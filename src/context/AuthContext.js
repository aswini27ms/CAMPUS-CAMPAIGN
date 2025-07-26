import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

// List of initial admin emails
const ADMIN_EMAILS = ['admin@campus.com', 'superadmin@campus.com'];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create new user with proper role assignment
  const signup = async (email, password, additionalData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Determine if user is admin
      const isAdmin = ADMIN_EMAILS.includes(email);
      
      // Create user document with role
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        ...additionalData,
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      });
      
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  // Login existing user
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout user
  const logout = () => {
    return signOut(auth);
  };

  // Fetch user data with proper error handling
  const fetchUserData = async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({
          ...data,
          role: data.role || 'user'
        });
      } else {
        console.log('No user data found');
        setUserData({ role: 'user' });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData({ role: 'user' });
    }
  };

  // Auth state listener with enhanced role handling
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchUserData(user.uid);
        
        // Additional check for legacy users or admins
        if (ADMIN_EMAILS.includes(user.email)) {
          setUserData(prev => ({
            ...prev,
            role: 'admin'
          }));
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Context value with explicit admin check
  const value = {
    currentUser,
    userData,
    userType: userData?.role || 'user',
    isAdmin: () => {
      return userData?.role === 'admin' || 
             (currentUser?.email && ADMIN_EMAILS.includes(currentUser.email));
    },
    loading,
    signup,
    login,
    logout,
    resetPassword: (email) => sendPasswordResetEmail(auth, email),
    updateUserEmail: (email) => updateEmail(currentUser, email),
    updateUserPassword: (password) => updatePassword(currentUser, password)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};