import React, { useState, useEffect } from 'react';
import './index.css';
import WelcomePage from './components/WelcomePage';
import HomePage from './components/HomePage';
import BookingPage from './components/BookingPage';

// ข้อมูลคอนเสิร์ตสำรอง (Fallback Mock Data)
const FALLBACK_EVENTS = [
  {
    id: 'ev-1',
    name: "Oasis Live '27",
    venue: 'Allegiant Stadium',
    city: 'Las Vegas',
    date: '2027-08-20',
    time: '19:00 น.',
    genre: 'Rock',
    minPrice: 3500,
    artists: 'Oasis',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800'
  },
  {
    id: 'ev-2',
    name: 'The 1975 World Tour',
    venue: 'Impact Arena',
    city: 'Bangkok',
    date: '2026-11-15',
    time: '20:00 น.',
    genre: 'Pop',
    minPrice: 2500,
    artists: 'The 1975',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800'
  },
  {
    id: 'ev-3',
    name: 'Fujii Kaze Asia Tour',
    venue: 'IMAX Hall',
    city: 'Bangkok',
    date: '2026-12-10',
    time: '18:30 น.',
    genre: 'Indie',
    minPrice: 2800,
    artists: 'Fujii Kaze',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800'
  },
  {
    id: 'ev-4',
    name: 'Laufey: A Matter of Time',
    venue: 'Union Hall',
    city: 'Bangkok',
    date: '2026-05-31',
    time: '19:00 น.',
    genre: 'Jazz',
    minPrice: 2200,
    artists: 'Laufey',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800'
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome-page');
  const [currentUser, setCurrentUser] = useState(null);
  const [globalEvents, setGlobalEvents] = useState(FALLBACK_EVENTS); // ตั้งค่าเริ่มต้นเป็น Mock Data ทันที
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // ดึงข้อมูลคอนเสิร์ต
  const fetchEvents = async (keyword = '') => {
    setLoading(true);
    
    // ตรวจสอบว่าอยู่บน Localhost หรือไม่
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
      try {
        const endpoint = keyword 
          ? `http://localhost:3000/api/events?keyword=${keyword}`
          : 'http://localhost:3000/api/events';
          
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          const eventsData = data.events || data;
          if (eventsData && eventsData.length > 0) {
            setGlobalEvents(eventsData);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend connection failed, using fallback data:', err);
      }
    }

    // กรณีรันบน Vercel หรือเรียก API ไม่สำเร็จ ให้กรองจาก Fallback Data
    if (keyword && keyword !== 'music') {
      const lowerKey = keyword.toLowerCase();
      const filtered = FALLBACK_EVENTS.filter(e => 
        e.name.toLowerCase().includes(lowerKey) || 
        e.genre.toLowerCase().includes(lowerKey) ||
        e.artists.toLowerCase().includes(lowerKey) ||
        e.venue.toLowerCase().includes(lowerKey)
      );
      setGlobalEvents(filtered);
    } else {
      setGlobalEvents(FALLBACK_EVENTS);
    }

    setLoading(false);
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