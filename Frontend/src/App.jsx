import React, { useState, useEffect } from 'react';
import './index.css';
import WelcomePage from './components/WelcomePage';
import HomePage from './components/HomePage';
import BookingPage from './components/BookingPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome-page'); // 'welcome-page', 'home-page', 'booking-page'
  const [currentUser, setCurrentUser] = useState(null);
  const [globalEvents, setGlobalEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // ดึงข้อมูลคอนเสิร์ตจาก Express Backend (พร้อมระบบสำรอง Fallback)
  const fetchEvents = async (keyword = '') => {
    setLoading(true);
    try {
      const endpoint = keyword 
        ? `http://localhost:3000/api/events?keyword=${keyword}`
        : 'http://localhost:3000/api/events';
        
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      const eventsData = data.events || data;

      if (eventsData && eventsData.length > 0) {
        setGlobalEvents(eventsData);
      } else {
        setGlobalEvents(FALLBACK_EVENTS);
      }
    } catch (err) {
      console.warn('API connection failed, using fallback mock data for Vercel/Production:', err);
      // หากรันบน Vercel แล้วต่อ Localhost ไม่ได้ นำข้อมูลสำรองมาแสดงทันที
      if (keyword) {
        const filtered = FALLBACK_EVENTS.filter(e => 
          e.name.toLowerCase().includes(keyword.toLowerCase()) || 
          e.genre.toLowerCase().includes(keyword.toLowerCase())
        );
        setGlobalEvents(filtered.length > 0 ? filtered : FALLBACK_EVENTS);
      } else {
        setGlobalEvents(FALLBACK_EVENTS);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="app-container">
      {currentPage === 'welcome-page' && (
        <WelcomePage 
          onLoginSuccess={(username) => {
            setCurrentUser(username);
            setCurrentPage('home-page');
          }} 
        />
      )}

      {currentPage === 'home-page' && (
        <HomePage 
          currentUser={currentUser}
          events={globalEvents}
          loading={loading}
          favoriteEvents={favoriteEvents}
          onSearch={fetchEvents}
          onSelectEvent={(event) => {
            setSelectedEvent(event);
            setCurrentPage('booking-page');
          }}
          onToggleFavorite={(event) => {
            if (favoriteEvents.some(f => f.id === event.id)) {
              setFavoriteEvents(favoriteEvents.filter(f => f.id !== event.id));
            } else {
              setFavoriteEvents([...favoriteEvents, event]);
            }
          }}
          onNavigate={(page) => setCurrentPage(page)}
        />
      )}

      {currentPage === 'booking-page' && (
        <BookingPage 
          event={selectedEvent}
          currentUser={currentUser}
          onBack={() => setCurrentPage('home-page')}
          onRequireLogin={() => setCurrentPage('welcome-page')}
        />
      )}
    </div>
  );
}