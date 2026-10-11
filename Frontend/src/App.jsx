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

  // ดึงข้อมูลคอนเสิร์ตโดยตรงจาก Ticketmaster Discovery API ผ่านฝั่ง Frontend
  const fetchEvents = async (keyword = '') => {
    setLoading(true);
    
    // 🔑 ใส่ Ticketmaster API Key ของคุณที่นี่ (แทนที่ข้อความในเครื่องหมายคำพูด)
    const apiKey = 'k2uAz1KC7ugsIt0qSedWtxwYWbVRofms'; 
    
    const queryKeyword = keyword && keyword !== 'music' ? keyword : 'concert';
    const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&keyword=${encodeURIComponent(queryKeyword)}&size=20&countryCode=TH`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      // แปลงโครงสร้างข้อมูลของ Ticketmaster ให้ตรงกับที่คอมโพเนนต์ใช้งาน
      if (data._embedded && data._embedded.events) {
        const formattedEvents = data._embedded.events.map((item) => ({
          id: item.id,
          name: item.name,
          venue: item._embedded?.venues?.[0]?.name || 'Impact Arena',
          city: item._embedded?.venues?.[0]?.city?.name || 'Bangkok',
          date: item.dates?.start?.localDate || '2026-12-31',
          time: item.dates?.start?.localTime || '19:00 น.',
          genre: item.classifications?.[0]?.genre?.name || 'Music',
          minPrice: item.priceRanges?.[0]?.min || 1500,
          artists: item._embedded?.attractions?.[0]?.name || item.name,
          imageUrl: item.images?.[0]?.url || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800'
        }));
        setGlobalEvents(formattedEvents);
      } else {
        setGlobalEvents([]);
      }
    } catch (err) {
      console.error('Ticketmaster API Error:', err);
      setGlobalEvents([]);
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