import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './useAuth';

// Define types
type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'assessment' | 'attendance' | 'announcement' | 'system';
};

type NotificationsContextType = {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
};

// Create context
const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Mock data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New Quiz Added',
    message: 'SQL Quiz has been scheduled for Database Systems on June 15th.',
    time: '2 hours ago',
    read: false,
    type: 'assessment'
  },
  {
    id: '2',
    title: 'Attendance Reminder',
    message: 'Don\'t forget to scan the QR code for today\'s Web Development class.',
    time: '5 hours ago',
    read: false,
    type: 'attendance'
  },
  {
    id: '3',
    title: 'Exam Result Available',
    message: 'Your Introduction to Programming midterm results are now available.',
    time: 'Yesterday',
    read: true,
    type: 'assessment'
  },
  {
    id: '4',
    title: 'Class Canceled',
    message: 'Data Structures class on Friday has been canceled due to instructor illness.',
    time: '2 days ago',
    read: true,
    type: 'announcement'
  }
];

// Provider component
export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would make an API call to fetch notifications
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (user) {
          setNotifications(MOCK_NOTIFICATIONS);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchNotifications();
    }
  }, [user]);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };
  
  const value = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
  
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook to use the notifications context
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  
  return context;
};