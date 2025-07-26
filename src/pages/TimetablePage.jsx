import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Download, Edit3, Save, X, Plus, Trash2, User, Shield, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { getDatabase, ref, onValue, set, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const TimetablePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Class 10-A');
  const [timetableData, setTimetableData] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [tempCellData, setTempCellData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Days and classes
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const classes = ['ECE', 'EEE', 'CSE', 'IT'];

  // Default timetable data
  const defaultTimetableData = {
    'Class 10-A': {
      'Monday': [
        { time: '08:00-08:45', subject: 'Mathematics', teacher: 'Mr. Robert Smith', room: 'Room 101' },
        { time: '08:45-09:30', subject: 'English Literature', teacher: 'Ms. Emily Johnson', room: 'Room 102' },
        { time: '09:30-10:15', subject: 'Microprocesser and Controller', teacher: 'Dr. Michael Brown', room: 'Lab 201' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'Embaded and IOT', teacher: 'Dr. Sarah Davis', room: 'Lab 202' },
        { time: '11:15-12:00', subject: 'History', teacher: 'Mr. James Wilson', room: 'Room 103' },
        { time: '12:00-12:45', subject: 'Computer Science', teacher: 'Ms. Lisa Anderson', room: 'Computer Lab' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Physical Education', teacher: 'Mr. David Miller', room: 'Gymnasium' }
      ],
      'Tuesday': [
        { time: '08:00-08:45', subject: 'English Literature', teacher: 'Ms. Emily Johnson', room: 'Room 102' },
        { time: '08:45-09:30', subject: 'Mathematics', teacher: 'Mr. Robert Smith', room: 'Room 101' },
        { time: '09:30-10:15', subject: 'Machines lab', teacher: 'Dr. Jennifer Taylor', room: 'Lab 203' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'Control system', teacher: 'Dr.Anburasu', room: 'Room 104' },
        { time: '11:15-12:00', subject: 'Electrical Machines -I', teacher: 'Dr. Michael Brown', room: 'Lab 201' },
        { time: '12:00-12:45', subject: 'Field teory', teacher: 'Ms. Maria Garcia', room: 'Art Studio' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Music', teacher: 'Mr. Thomas Lee', room: 'Music Room' }
      ],
      'Wednesday': [
        { time: '08:00-08:45', subject: 'Network Theory', teacher: 'Dr. Sarah Davis', room: 'Lab 202' },
        { time: '08:45-09:30', subject: 'Mathematics', teacher: 'Mr. Robert Smith', room: 'Room 101' },
        { time: '09:30-10:15', subject: 'English Literature', teacher: 'Ms. Emily Johnson', room: 'Room 102' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'Computer Science', teacher: 'Ms. Lisa Anderson', room: 'Computer Lab' },
        { time: '11:15-12:00', subject: 'Cloud Computing', teacher: 'Dr. Jennifer Taylor', room: 'Lab 203' },
        { time: '12:00-12:45', subject: 'Big Data Analytics', teacher: 'Mr. Christopher Martin', room: 'Room 105' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Library Study', teacher: 'Ms. Nancy Rodriguez', room: 'Library' }
      ],
      'Thursday': [
        { time: '08:00-08:45', subject: 'Physics', teacher: 'Dr. Michael Brown', room: 'Lab 201' },
        { time: '08:45-09:30', subject: 'Biology', teacher: 'Dr. Jennifer Taylor', room: 'Lab 203' },
        { time: '09:30-10:15', subject: 'Mathematics', teacher: 'Mr. Robert Smith', room: 'Room 101' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'English Literature', teacher: 'Ms. Emily Johnson', room: 'Room 102' },
        { time: '11:15-12:00', subject: 'Chemistry', teacher: 'Dr. Sarah Davis', room: 'Lab 202' },
        { time: '12:00-12:45', subject: 'French Language', teacher: 'Ms. Sophie Dubois', room: 'Room 106' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Drama & Theatre', teacher: 'Mr. Alexander Clark', room: 'Drama Hall' }
      ],
      'Friday': [
        { time: '08:00-08:45', subject: 'Mathematics', teacher: 'Mr. Robert Smith', room: 'Room 101' },
        { time: '08:45-09:30', subject: 'Computer Science', teacher: 'Ms. Lisa Anderson', room: 'Computer Lab' },
        { time: '09:30-10:15', subject: 'History', teacher: 'Mr. James Wilson', room: 'Room 103' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'Geography', teacher: 'Ms. Karen White', room: 'Room 104' },
        { time: '11:15-12:00', subject: 'English Literature', teacher: 'Ms. Emily Johnson', room: 'Room 102' },
        { time: '12:00-12:45', subject: 'Physical Education', teacher: 'Mr. David Miller', room: 'Gymnasium' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Assembly', teacher: 'All Teachers', room: 'Main Hall' }
      ]
    },
    'Class 10-B': {
      'Monday': [
        { time: '08:00-08:45', subject: 'English Literature', teacher: 'Ms. Emily Johnson', room: 'Room 102' },
        { time: '08:45-09:30', subject: 'Mathematics', teacher: 'Mr. Robert Smith', room: 'Room 101' },
        { time: '09:30-10:15', subject: 'Chemistry', teacher: 'Dr. Sarah Davis', room: 'Lab 202' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'Physics', teacher: 'Dr. Michael Brown', room: 'Lab 201' },
        { time: '11:15-12:00', subject: 'Biology', teacher: 'Dr. Jennifer Taylor', room: 'Lab 203' },
        { time: '12:00-12:45', subject: 'Geography', teacher: 'Ms. Karen White', room: 'Room 104' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Computer Science', teacher: 'Ms. Lisa Anderson', room: 'Computer Lab' }
      ],
      'Tuesday': [
        { time: '08:00-08:45', subject: 'Mathematics', teacher: 'Mr. Robert Smith', room: 'Room 101' },
        { time: '08:45-09:30', subject: 'Physics', teacher: 'Dr. Michael Brown', room: 'Lab 201' },
        { time: '09:30-10:15', subject: 'English Literature', teacher: 'Ms. Emily Johnson', room: 'Room 102' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'History', teacher: 'Mr. James Wilson', room: 'Room 103' },
        { time: '11:15-12:00', subject: 'Chemistry', teacher: 'Dr. Sarah Davis', room: 'Lab 202' },
        { time: '12:00-12:45', subject: 'Physical Education', teacher: 'Mr. David Miller', room: 'Gymnasium' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Art & Design', teacher: 'Ms. Maria Garcia', room: 'Art Studio' }
      ],
      'Wednesday': [
        { time: '08:00-08:45', subject: 'Biology', teacher: 'Dr. Jennifer Taylor', room: 'Lab 203' },
        { time: '08:45-09:30', subject: 'Computer Science', teacher: 'Ms. Lisa Anderson', room: 'Computer Lab' },
        { time: '09:30-10:15', subject: 'Mathematics', teacher: 'Mr. Robert Smith', room: 'Room 101' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'English Literature', teacher: 'Ms. Emily Johnson', room: 'Room 102' },
        { time: '11:15-12:00', subject: 'Physics', teacher: 'Dr. Michael Brown', room: 'Lab 201' },
        { time: '12:00-12:45', subject: 'French Language', teacher: 'Ms. Sophie Dubois', room: 'Room 106' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Music', teacher: 'Mr. Thomas Lee', room: 'Music Room' }
      ],
      'Thursday': [
        { time: '08:00-08:45', subject: 'Chemistry', teacher: 'Dr. Sarah Davis', room: 'Lab 202' },
        { time: '08:45-09:30', subject: 'Geography', teacher: 'Ms. Karen White', room: 'Room 104' },
        { time: '09:30-10:15', subject: 'Biology', teacher: 'Dr. Jennifer Taylor', room: 'Lab 203' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'Mathematics', teacher: 'Mr. Robert Smith', room: 'Room 101' },
        { time: '11:15-12:00', subject: 'English Literature', teacher: 'Ms. Emily Johnson', room: 'Room 102' },
        { time: '12:00-12:45', subject: 'Social Studies', teacher: 'Mr. Christopher Martin', room: 'Room 105' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Library Study', teacher: 'Ms. Nancy Rodriguez', room: 'Library' }
      ],
      'Friday': [
        { time: '08:00-08:45', subject: 'Physics', teacher: 'Dr. Michael Brown', room: 'Lab 201' },
        { time: '08:45-09:30', subject: 'History', teacher: 'Mr. James Wilson', room: 'Room 103' },
        { time: '09:30-10:15', subject: 'Computer Science', teacher: 'Ms. Lisa Anderson', room: 'Computer Lab' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'Chemistry', teacher: 'Dr. Sarah Davis', room: 'Lab 202' },
        { time: '11:15-12:00', subject: 'Mathematics', teacher: 'Mr. Robert Smith', room: 'Room 101' },
        { time: '12:00-12:45', subject: 'Drama & Theatre', teacher: 'Mr. Alexander Clark', room: 'Drama Hall' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Assembly', teacher: 'All Teachers', room: 'Main Hall' }
      ]
    },
    'Class 9-A': {
      'Monday': [
        { time: '08:00-08:45', subject: 'Mathematics', teacher: 'Ms. Rachel Green', room: 'Room 201' },
        { time: '08:45-09:30', subject: 'English', teacher: 'Mr. John Parker', room: 'Room 202' },
        { time: '09:30-10:15', subject: 'Science', teacher: 'Dr. Amanda Collins', room: 'Lab 301' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'Social Studies', teacher: 'Ms. Diana Ross', room: 'Room 203' },
        { time: '11:15-12:00', subject: 'Hindi', teacher: 'Mrs. Priya Sharma', room: 'Room 204' },
        { time: '12:00-12:45', subject: 'Computer Applications', teacher: 'Mr. Kevin Adams', room: 'Computer Lab' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Art & Craft', teacher: 'Ms. Isabella Cruz', room: 'Art Studio' }
      ],
      'Tuesday': [
        { time: '08:00-08:45', subject: 'Science', teacher: 'Dr. Amanda Collins', room: 'Lab 301' },
        { time: '08:45-09:30', subject: 'Mathematics', teacher: 'Ms. Rachel Green', room: 'Room 201' },
        { time: '09:30-10:15', subject: 'English', teacher: 'Mr. John Parker', room: 'Room 202' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'Geography', teacher: 'Mr. Paul Thompson', room: 'Room 205' },
        { time: '11:15-12:00', subject: 'History', teacher: 'Ms. Catherine Bell', room: 'Room 206' },
        { time: '12:00-12:45', subject: 'Physical Education', teacher: 'Coach Mike Johnson', room: 'Playground' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Music', teacher: 'Ms. Melody Watson', room: 'Music Room' }
      ],
      'Wednesday': [
        { time: '08:00-08:45', subject: 'English', teacher: 'Mr. John Parker', room: 'Room 202' },
        { time: '08:45-09:30', subject: 'Science', teacher: 'Dr. Amanda Collins', room: 'Lab 301' },
        { time: '09:30-10:15', subject: 'Mathematics', teacher: 'Ms. Rachel Green', room: 'Room 201' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'Hindi', teacher: 'Mrs. Priya Sharma', room: 'Room 204' },
        { time: '11:15-12:00', subject: 'Computer Applications', teacher: 'Mr. Kevin Adams', room: 'Computer Lab' },
        { time: '12:00-12:45', subject: 'Social Studies', teacher: 'Ms. Diana Ross', room: 'Room 203' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Library Period', teacher: 'Ms. Helen Carter', room: 'Library' }
      ],
      'Thursday': [
        { time: '08:00-08:45', subject: 'Mathematics', teacher: 'Ms. Rachel Green', room: 'Room 201' },
        { time: '08:45-09:30', subject: 'History', teacher: 'Ms. Catherine Bell', room: 'Room 206' },
        { time: '09:30-10:15', subject: 'Science', teacher: 'Dr. Amanda Collins', room: 'Lab 301' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'English', teacher: 'Mr. John Parker', room: 'Room 202' },
        { time: '11:15-12:00', subject: 'Geography', teacher: 'Mr. Paul Thompson', room: 'Room 205' },
        { time: '12:00-12:45', subject: 'Sanskrit', teacher: 'Dr. Raj Kumar', room: 'Room 207' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Moral Science', teacher: 'Mrs. Grace Phillips', room: 'Room 208' }
      ],
      'Friday': [
        { time: '08:00-08:45', subject: 'Science', teacher: 'Dr. Amanda Collins', room: 'Lab 301' },
        { time: '08:45-09:30', subject: 'Computer Applications', teacher: 'Mr. Kevin Adams', room: 'Computer Lab' },
        { time: '09:30-10:15', subject: 'English', teacher: 'Mr. John Parker', room: 'Room 202' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'Mathematics', teacher: 'Ms. Rachel Green', room: 'Room 201' },
        { time: '11:15-12:00', subject: 'Hindi', teacher: 'Mrs. Priya Sharma', room: 'Room 204' },
        { time: '12:00-12:45', subject: 'Physical Education', teacher: 'Coach Mike Johnson', room: 'Playground' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Class Assembly', teacher: 'All Teachers', room: 'Class 9-A' }
      ]
    },
    'Class 9-B': {
      'Monday': [
        { time: '08:00-08:45', subject: 'English', teacher: 'Mr. John Parker', room: 'Room 202' },
        { time: '08:45-09:30', subject: 'Mathematics', teacher: 'Ms. Rachel Green', room: 'Room 201' },
        { time: '09:30-10:15', subject: 'Hindi', teacher: 'Mrs. Priya Sharma', room: 'Room 204' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'Science', teacher: 'Dr. Amanda Collins', room: 'Lab 301' },
        { time: '11:15-12:00', subject: 'Geography', teacher: 'Mr. Paul Thompson', room: 'Room 205' },
        { time: '12:00-12:45', subject: 'Art & Craft', teacher: 'Ms. Isabella Cruz', room: 'Art Studio' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Computer Applications', teacher: 'Mr. Kevin Adams', room: 'Computer Lab' }
      ],
      'Tuesday': [
        { time: '08:00-08:45', subject: 'Mathematics', teacher: 'Ms. Rachel Green', room: 'Room 201' },
        { time: '08:45-09:30', subject: 'Science', teacher: 'Dr. Amanda Collins', room: 'Lab 301' },
        { time: '09:30-10:15', subject: 'Social Studies', teacher: 'Ms. Diana Ross', room: 'Room 203' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'English', teacher: 'Mr. John Parker', room: 'Room 202' },
        { time: '11:15-12:00', subject: 'History', teacher: 'Ms. Catherine Bell', room: 'Room 206' },
        { time: '12:00-12:45', subject: 'Music', teacher: 'Ms. Melody Watson', room: 'Music Room' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Physical Education', teacher: 'Coach Mike Johnson', room: 'Playground' }
      ],
      'Wednesday': [
        { time: '08:00-08:45', subject: 'Science', teacher: 'Dr. Amanda Collins', room: 'Lab 301' },
        { time: '08:45-09:30', subject: 'Hindi', teacher: 'Mrs. Priya Sharma', room: 'Room 204' },
        { time: '09:30-10:15', subject: 'Mathematics', teacher: 'Ms. Rachel Green', room: 'Room 201' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'Computer Applications', teacher: 'Mr. Kevin Adams', room: 'Computer Lab' },
        { time: '11:15-12:00', subject: 'English', teacher: 'Mr. John Parker', room: 'Room 202' },
        { time: '12:00-12:45', subject: 'Geography', teacher: 'Mr. Paul Thompson', room: 'Room 205' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Sanskrit', teacher: 'Dr. Raj Kumar', room: 'Room 207' }
      ],
      'Thursday': [
        { time: '08:00-08:45', subject: 'Hindi', teacher: 'Mrs. Priya Sharma', room: 'Room 204' },
        { time: '08:45-09:30', subject: 'Mathematics', teacher: 'Ms. Rachel Green', room: 'Room 201' },
        { time: '09:30-10:15', subject: 'History', teacher: 'Ms. Catherine Bell', room: 'Room 206' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'Science', teacher: 'Dr. Amanda Collins', room: 'Lab 301' },
        { time: '11:15-12:00', subject: 'Social Studies', teacher: 'Ms. Diana Ross', room: 'Room 203' },
        { time: '12:00-12:45', subject: 'Library Period', teacher: 'Ms. Helen Carter', room: 'Library' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Moral Science', teacher: 'Mrs. Grace Phillips', room: 'Room 208' }
      ],
      'Friday': [
        { time: '08:00-08:45', subject: 'English', teacher: 'Mr. John Parker', room: 'Room 202' },
        { time: '08:45-09:30', subject: 'Physical Education', teacher: 'Coach Mike Johnson', room: 'Playground' },
        { time: '09:30-10:15', subject: 'Science', teacher: 'Dr. Amanda Collins', room: 'Lab 301' },
        { time: '10:15-10:30', subject: 'Morning Break', teacher: '', room: 'Cafeteria' },
        { time: '10:30-11:15', subject: 'Mathematics', teacher: 'Ms. Rachel Green', room: 'Room 201' },
        { time: '11:15-12:00', subject: 'Computer Applications', teacher: 'Mr. Kevin Adams', room: 'Computer Lab' },
        { time: '12:00-12:45', subject: 'Art & Craft', teacher: 'Ms. Isabella Cruz', room: 'Art Studio' },
        { time: '12:45-13:30', subject: 'Lunch Break', teacher: '', room: 'Cafeteria' },
        { time: '13:30-14:15', subject: 'Class Assembly', teacher: 'All Teachers', room: 'Class 9-B' }
      ]
    }
  };

  // Initialize Firebase Auth
  const auth = getAuth();
  const db = getDatabase();

  // Check if current user is admin
  const isAdmin = currentUser?.claims?.admin || false;

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
  };

  // Load timetable data from Firebase
  const loadTimetableData = async () => {
    setLoading(true);
    try {
      const timetableRef = ref(db, 'timetables');
      
      onValue(timetableRef, (snapshot) => {
        const data = snapshot.val();
        if (data && Object.keys(data).length > 0) {
          setTimetableData(data);
        } else {
          // Use default timetable data if no data in Firebase
          setTimetableData(defaultTimetableData);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Error loading timetable:', error);
      // Use default data on error
      setTimetableData(defaultTimetableData);
      showNotification('error', 'Failed to load timetable data, using default schedule');
      setLoading(false);
    }
  };

  // Save timetable data to Firebase
  const saveTimetableData = async (newData) => {
    setSaving(true);
    try {
      const timetableRef = ref(db, 'timetables');
      await set(timetableRef, newData);
      showNotification('success', 'Timetable updated successfully!');
    } catch (error) {
      console.error('Error saving timetable:', error);
      showNotification('error', 'Failed to save timetable');
    } finally {
      setSaving(false);
    }
  };

  // Initialize component
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Get user token to check admin status
        const idTokenResult = await user.getIdTokenResult();
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          claims: idTokenResult.claims
        });
        
        // Load timetable data
        loadTimetableData();
      } else {
        setCurrentUser(null);
        // Show default data even when not logged in
        setTimetableData(defaultTimetableData);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Export to PDF function
  const exportToPDF = () => {
    const printContent = document.getElementById('timetable-content');
    const windowUrl = 'about:blank';
    const uniqueName = new Date();
    const windowName = 'print' + uniqueName.getTime();
    const printWindow = window.open(windowUrl, windowName, 'scrollbars=yes');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${selectedClass} - Timetable</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .school-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .class-name { font-size: 18px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #333; padding: 8px; text-align: center; font-size: 12px; }
          th { background-color: #f0f0f0; font-weight: bold; }
          .break-cell { background-color: #f9f9f9; font-style: italic; }
          .time-cell { font-weight: bold; background-color: #f5f5f5; }
          .subject { font-weight: bold; color: #2563eb; }
          .teacher { color: #666; font-size: 10px; }
          .room { color: #888; font-size: 10px; }
          @media print { body { margin: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">Springfield High School</div>
          <div class="class-name">${selectedClass} - Weekly Timetable</div>
          <div style="font-size: 12px; color: #888; margin-top: 10px;">
            Generated on: ${new Date().toLocaleDateString()}
          </div>
        </div>
        ${printContent.innerHTML}
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Edit cell functions
  const startEditing = (day, index, period) => {
    if (!isAdmin) return;
    setEditingCell(`${day}-${index}`);
    setTempCellData({ ...period });
  };

  const saveCell = async (day, index) => {
    const newTimetable = { ...timetableData };
    if (!newTimetable[selectedClass]) {
      newTimetable[selectedClass] = {};
    }
    if (!newTimetable[selectedClass][day]) {
      newTimetable[selectedClass][day] = [];
    }
    newTimetable[selectedClass][day][index] = { ...tempCellData };
    
    setTimetableData(newTimetable);
    await saveTimetableData(newTimetable);
    
    setEditingCell(null);
    setTempCellData({});
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setTempCellData({});
  };

  const addPeriod = async (day) => {
    if (!isAdmin) return;
    const newTimetable = { ...timetableData };
    if (!newTimetable[selectedClass]) {
      newTimetable[selectedClass] = {};
    }
    if (!newTimetable[selectedClass][day]) {
      newTimetable[selectedClass][day] = [];
    }
    
    const newPeriod = {
      time: '15:00-16:00',
      subject: 'New Subject',
      teacher: 'Teacher Name',
      room: 'Room'
    };
    newTimetable[selectedClass][day].push(newPeriod);
    
    setTimetableData(newTimetable);
    await saveTimetableData(newTimetable);
  };

  const deletePeriod = async (day, index) => {
    if (!isAdmin) return;
    if (window.confirm('Are you sure you want to delete this period?')) {
      const newTimetable = { ...timetableData };
      newTimetable[selectedClass][day].splice(index, 1);
      
      setTimetableData(newTimetable);
      await saveTimetableData(newTimetable);
    }
  };

  const currentTimetable = timetableData[selectedClass] || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading timetable data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-12">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle size={20} className="mr-2" />
          ) : (
            <AlertCircle size={20} className="mr-2" />
          )}
          {notification.message}
        </div>
      )}

      {/* Saving indicator */}
      {saving && (
        <div className="fixed top-4 left-4 z-50 bg-blue-100 text-blue-800 p-4 rounded-lg shadow-lg flex items-center">
          <Loader className="animate-spin h-5 w-5 mr-2" />
          Saving changes...
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-lg">
            <Calendar size={40} className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Class Timetable</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Weekly schedule and class timings - Real-time Firebase sync
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Admin Mode</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportToPDF}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
              >
                <Download size={16} className="mr-2" />
                Export PDF
              </button>

              {currentUser ? (
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
                >
                  <User size={16} className="mr-2" />
                  {currentUser.displayName || currentUser.email}
                </button>
              ) : (
                <div className="px-6 py-2 bg-gray-200 text-gray-600 rounded-lg flex items-center">
                  <User size={16} className="mr-2" />
                  Guest View
                </div>
              )}

              {isAdmin && (
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`px-6 py-2 font-semibold rounded-lg transition-all duration-300 flex items-center ${
                    editMode 
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  }`}
                >
                  <Edit3 size={16} className="mr-2" />
                  {editMode ? 'Exit Edit' : 'Edit Mode'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Timetable */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div id="timetable-content">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <th className="px-4 py-4 text-left font-semibold">Time</th>
                    {days.map(day => (
                      <th key={day} className="px-4 py-4 text-center font-semibold min-w-[200px]">
                        {day}
                        {isAdmin && editMode && (
                          <button
                            onClick={() => addPeriod(day)}
                            className="ml-2 p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
                            title="Add Period"
                          >
                            <Plus size={14} />
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.max(...days.map(day => currentTimetable[day]?.length || 0)) }, (_, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50">
                        {currentTimetable[days[0]]?.[index]?.time || ''}
                      </td>
                      {days.map(day => {
                        const period = currentTimetable[day]?.[index];
                        const cellId = `${day}-${index}`;
                        const isEditing = editingCell === cellId;
                        
                        if (!period) {
                          return (
                            <td key={day} className="px-4 py-3 text-center">
                              {isAdmin && editMode && (
                                <button
                                  onClick={() => addPeriod(day)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Add Period"
                                >
                                  <Plus size={16} />
                                </button>
                              )}
                            </td>
                          );
                        }

                        const isBreak = period.subject.toLowerCase().includes('break');

                        return (
                          <td key={day} className={`px-4 py-3 text-center relative group ${isBreak ? 'bg-yellow-50' : ''}`}>
                            {isEditing ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={tempCellData.subject || ''}
                                  onChange={(e) => setTempCellData({...tempCellData, subject: e.target.value})}
                                  className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                                  placeholder="Subject"
                                />
                                <input
                                  type="text"
                                  value={tempCellData.teacher || ''}
                                  onChange={(e) => setTempCellData({...tempCellData, teacher: e.target.value})}
                                  className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                                  placeholder="Teacher"
                                />
                                <input
                                  type="text"
                                  value={tempCellData.room || ''}
                                  onChange={(e) => setTempCellData({...tempCellData, room: e.target.value})}
                                  className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                                  placeholder="Room"
                                />
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => saveCell(day, index)}
                                    disabled={saving}
                                    className="p-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                  >
                                    <Save size={12} />
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="p-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`cursor-pointer ${isAdmin && editMode ? 'hover:bg-blue-50 rounded-lg p-2' : ''}`}
                                onClick={() => isAdmin && editMode && startEditing(day, index, period)}
                              >
                                <div className={`font-semibold ${isBreak ? 'text-orange-600' : 'text-blue-600'}`}>
                                  {period.subject}
                                </div>
                                {period.teacher && (
                                  <div className="text-sm text-gray-600 mt-1">
                                    {period.teacher}
                                  </div>
                                )}
                                {period.room && (
                                  <div className="text-xs text-gray-500">
                                    {period.room}
                                  </div>
                                )}
                                {isAdmin && editMode && !isBreak && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deletePeriod(day, index);
                                    }}
                                    disabled={saving}
                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-opacity disabled:opacity-25"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Legend & Instructions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Color Coding</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Regular Classes</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-200 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Break Time</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Lab Sessions</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Special Activities</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Admin Features</h4>
              <div className="text-sm text-gray-600 space-y-1">
                {isAdmin ? (
                  <>
                    <p>• You have full administrative privileges</p>
                    <p>• Click "Edit Mode" to modify timetable</p>
                    <p>• Click on any cell to edit subject, teacher, or room</p>
                    <p>• Use + button to add new periods</p>
                    <p>• Changes are automatically saved to Firebase</p>
                  </>
                ) : (
                  <p>• Only administrators can edit the timetable</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">User Profile</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Current User Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Current User</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Name:</strong> {currentUser.displayName || 'Not provided'}</p>
                  <p><strong>Email:</strong> {currentUser.email}</p>
                  <p><strong>User ID:</strong> {currentUser.uid}</p>
                </div>
                {isAdmin && (
                  <div className="mt-2 flex items-center text-green-600">
                    <Shield size={16} className="mr-2" />
                    <span className="text-sm font-medium">Admin Access Granted</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Firebase Integration:</strong> All timetable changes are automatically saved to Firebase and synced in real-time across all devices.
                </p>
              </div>
              
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetablePage;