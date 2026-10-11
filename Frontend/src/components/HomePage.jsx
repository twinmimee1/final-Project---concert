import React, { useState } from 'react';

// Custom Selection Sort (DSA)
function customSelectionSort(arr, key) {
  let list = [...arr];
  let n = list.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (key === 'price') {
        const p1 = list[j].minPrice || 0;
        const p2 = list[minIdx].minPrice || 0;
        if (p1 < p2) minIdx = j;
      } else if (key === 'date') {
        if (new Date(list[j].date) < new Date(list[minIdx].date)) minIdx = j;
      }
    }
    if (minIdx !== i) {
      let temp = list[i];
      list[i] = list[minIdx];
      list[minIdx] = temp;
    }
  }
  return list;
}

export default function HomePage({
  currentUser,
  events,
  loading,
  favoriteEvents,
  onSearch,
  onSelectEvent,
  onToggleFavorite,
  onNavigate
}) {
  const [searchInput, setSearchInput] = useState('');
  const [activeGenre, setActiveGenre] = useState('all');
  const [displayEvents, setDisplayEvents] = useState(null);
  const [quickViewEvent, setQuickViewEvent] = useState(null);
  const [showFavModal, setShowFavModal] = useState(false);

  const eventList = displayEvents || events;

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    onSearch(searchInput);
    setDisplayEvents(null);
  };

  const handleFilterGenre = (genre) => {
    setActiveGenre(genre);
    if (genre === 'all') onSearch('music');
    else onSearch(genre);
    setDisplayEvents(null);
  };

  const handleSort = (key) => {
    const sorted = customSelectionSort(eventList, key);
    setDisplayEvents(sorted);
  };

  return (
    <div className="home-page-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo" onClick={() => onNavigate('home-page')} style={{ cursor: 'pointer' }}>TICKETVIBE</div>
        <ul className="nav-links">
          <li><a href="#welcome" onClick={(e) => { e.preventDefault(); onNavigate('welcome-page'); }}>Home</a></li>
          <li><a href="#events" onClick={(e) => { e.preventDefault(); onNavigate('home-page'); }}>Events</a></li>
          <li><a href="#help" onClick={(e) => e.preventDefault()}>Help</a></li>
        </ul>

        <div className="user-actions">
          <div className="fav-header-badge" onClick={() => setShowFavModal(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <i className="fa-solid fa-heart" style={{ color: '#ff4b82' }}></i>
            <span className="badge-number">{favoriteEvents.length}</span>
            <span className="fav-label">ถูกใจแล้ว</span>
          </div>

          <button className="login-btn" onClick={() => onNavigate('welcome-page')}>
            {currentUser || 'Login'}
          </button>
        </div>
      </nav>

      <main className="page-section">
        <div className="main-layout">
          {/* ฝั่งซ้าย */}
          <div className="left-content">
            {/* Hero Banner */}
            <div className="hero-banner-card">
              <div className="hero-overlay-text">
                <span className="script-font">Live Music</span>
                <h1>Better Together</h1>
                <p>จองบัตรคอนเสิร์ตที่คุณชื่นชอบ แล้วไปสร้างความทรงจำดีๆ ไปด้วยกัน ♥</p>

                <form className="search-bar-modern" onSubmit={handleSearchSubmit}>
                  <i className="fa-solid fa-magnifying-glass search-icon"></i>
                  <input
                    type="text"
                    placeholder="ค้นหาคอนเสิร์ต, ศิลปิน หรือสถานที่จัดงาน..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button type="submit" className="search-submit-btn">
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </form>
              </div>
              <div className="hero-decoration">
                <span className="handwrite-text">Good Music<br />Good Vibes<br />Always ♥</span>
              </div>
            </div>

            {/* Category & DSA Sort */}
            <div className="category-section">
              <div className="genre-icons-grid">
                {[
                  { id: 'all', label: 'All', icon: 'fa-music' },
                  { id: 'pop', label: 'Pop', icon: 'fa-guitar' },
                  { id: 'rock', label: 'Rock', icon: 'fa-drum' },
                  { id: 'hip hop', label: 'Hip Hop', icon: 'fa-record-vinyl' },
                  { id: 'indie', label: 'Indie', icon: 'fa-sliders' },
                  { id: 'k-pop', label: 'K-Pop', icon: 'fa-compact-disc' },
                  { id: 'edm', label: 'EDM', icon: 'fa-headphones' }
                ].map((g) => (
                  <button
                    key={g.id}
                    className={`genre-pill ${activeGenre === g.id ? 'active' : ''}`}
                    onClick={() => handleFilterGenre(g.id)}
                  >
                    <i className={`fa-solid ${g.icon}`}></i>
                    <span>{g.label}</span>
                  </button>
                ))}
              </div>

              <div className="sort-dropdown-container">
                <span>เรียงตาม (Sort DSA):</span>
                <button className="sort-tag-btn" onClick={() => handleSort('date')}>วันที่ใกล้ที่สุด</button>
                <button className="sort-tag-btn" onClick={() => handleSort('price')}>ราคาต่ำสุด</button>
              </div>
            </div>

            {/* Event List */}
            <div className="section-header-row">
              <h3>Popular Events <span className="sub-header-line">— คอนเสิร์ตที่กำลังมาแรง</span></h3>
            </div>

            {loading && <div className="loading">กำลังดึงข้อมูลคอนเสิร์ตจาก API...</div>}

            {!loading && eventList.length === 0 && (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>ไม่พบรายการคอนเสิร์ต</p>
            )}

            {!loading && eventList.length > 0 && (
              <div className="events-grid-4col">
                {eventList.map((event) => {
                  const isFav = favoriteEvents.some((f) => f.id === event.id);
                  const dateObj = new Date(event.date);
                  const day = isNaN(dateObj.getDate()) ? '15' : dateObj.getDate();
                  const monthYear = isNaN(dateObj.getDate()) ? 'NOV 2025' : dateObj.toLocaleString('en', { month: 'short', year: 'numeric' });

                  return (
                    <div className="concert-card-modern" key={event.id}>
                      <div className="card-img-wrapper" onClick={() => setQuickViewEvent(event)} style={{ cursor: 'pointer' }}>
                        <img src={event.imageUrl} alt={event.name} />
                        <div className="date-badge">
                          <div className="day">{day}</div>
                          <div className="month-year">{monthYear}</div>
                        </div>
                      </div>
                      <div className="concert-card-body">
                        <div>
                          <h4 className="concert-title" title={event.name}>{event.name}</h4>
                          <div className="concert-venue">{event.venue}, {event.city}</div>
                        </div>
                        <div className="concert-card-footer">
                          <button className="btn-book-small" onClick={() => onSelectEvent(event)}>จองบัตร</button>
                          <i
                            className={`fav-btn-icon ${isFav ? 'fa-solid fa-heart active' : 'fa-regular fa-heart'}`}
                            onClick={() => onToggleFavorite(event)}
                          ></i>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ฝั่งขวา Sidebar */}
          <aside className="right-sidebar">
            <div className="sidebar-card feature-badge-card">
              <div className="badge-title">บัตรดีๆ รอคุณอยู่! ✨</div>
              <ul className="feature-list">
                <li>
                  <i className="fa-regular fa-circle-check"></i>
                  <div>
                    <strong>จองง่าย ปลอดภัย</strong>
                    <p>มั่นใจได้ 100%</p>
                  </div>
                </li>
                <li>
                  <i className="fa-solid fa-bolt"></i>
                  <div>
                    <strong>รับบัตรทันที</strong>
                    <p>หลังชำระเงิน</p>
                  </div>
                </li>
                <li>
                  <i className="fa-headphones fa-solid"></i>
                  <div>
                    <strong>มีทีมซัพพอร์ต</strong>
                    <p>พร้อมดูแลตลอด 24 ชม.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="sidebar-card promo-banner-card">
              <div className="promo-content">
                <span className="handwrite-promo">More Concerts,<br />More Memories ♥</span>
                <button className="promo-arrow-btn"><i className="fa-solid fa-arrow-right"></i></button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* QuickView Modal */}
      {quickViewEvent && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <h3><i className="fa-solid fa-circle-info" style={{ color: '#ff4b82' }}></i> รายละเอียดคอนเสิร์ต</h3>
              <button className="close-modal-btn" onClick={() => setQuickViewEvent(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="qv-container">
                <img src={quickViewEvent.imageUrl} alt={quickViewEvent.name} className="qv-image" />
                <div className="qv-details">
                  <span className="qv-badge">{quickViewEvent.genre || 'Concert'}</span>
                  <h2>{quickViewEvent.name}</h2>
                  <p><i className="fa-solid fa-user-astronaut"></i> <strong>ศิลปิน:</strong> {quickViewEvent.artists || quickViewEvent.name}</p>
                  <p><i className="fa-regular fa-calendar-days"></i> <strong>วันแสดง:</strong> {quickViewEvent.date} ({quickViewEvent.time || '19:00 น.'})</p>
                  <p><i className="fa-solid fa-location-dot"></i> <strong>สถานที่:</strong> {quickViewEvent.venue}, {quickViewEvent.city}</p>
                  <p><i className="fa-solid fa-tag"></i> <strong>ราคาบัตรเริ่มต้น:</strong> {quickViewEvent.minPrice ? quickViewEvent.minPrice.toLocaleString() : '1,500'} THB</p>
                  <div className="qv-actions">
                    <button
                      className="btn-book-small"
                      style={{ width: '100%', padding: '12px', fontSize: '0.95rem', borderRadius: '20px' }}
                      onClick={() => {
                        const evt = quickViewEvent;
                        setQuickViewEvent(null);
                        onSelectEvent(evt);
                      }}
                    >
                      จองบัตรคอนเสิร์ตนี้เลย
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Modal */}
      {showFavModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3><i className="fa-solid fa-heart" style={{ color: '#ff4b82' }}></i> คอนเสิร์ตที่คุณชื่นชอบ</h3>
              <button className="close-modal-btn" onClick={() => setShowFavModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              {favoriteEvents.length === 0 ? (
                <div className="empty-state-msg">
                  <i className="fa-regular fa-heart" style={{ fontSize: '3rem', color: '#555', marginBottom: '10px' }}></i>
                  <p>ยังไม่มีคอนเสิร์ตที่ถูกใจ</p>
                </div>
              ) : (
                <div className="events-grid-4col">
                  {favoriteEvents.map((evt) => (
                    <div className="concert-card-modern" key={evt.id}>
                      <div className="card-img-wrapper" onClick={() => { setShowFavModal(false); setQuickViewEvent(evt); }} style={{ cursor: 'pointer' }}>
                        <img src={evt.imageUrl} alt={evt.name} />
                      </div>
                      <div className="concert-card-body">
                        <h4 className="concert-title">{evt.name}</h4>
                        <div className="concert-venue">{evt.venue}, {evt.city}</div>
                        <div className="concert-card-footer">
                          <button className="btn-book-small" onClick={() => { setShowFavModal(false); onSelectEvent(evt); }}>จองบัตร</button>
                          <i className="fa-solid fa-heart active fav-btn-icon" style={{ color: '#ff4b82' }} onClick={() => onToggleFavorite(evt)}></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}