import React, { useState } from 'react';

export default function BookingPage({ event, currentUser, onBack, onRequireLogin }) {
  const [activeTab, setActiveTab] = useState(0);

  // คำนวณราคาบัตรตั้งต้น
  const basePrice = event?.minPrice || 2500;
  const [ticketCart, setTicketCart] = useState({
    'VIP': { price: basePrice + 4000, qty: 0 },
    'Zone A': { price: basePrice + 3000, qty: 0 },
    'Zone B': { price: basePrice + 2000, qty: 0 },
    'Zone C': { price: basePrice + 1000, qty: 0 },
    'Zone D': { price: basePrice, qty: 0 }
  });

  // Stack DSA สำหรับเก็บประวัติการกดเลือกบัตร
  const [selectionStack, setSelectionStack] = useState([]);

  // Queue DSA สำหรับจำลองระบบคิว
  const [queueList, setQueueList] = useState([]);
  const [queueMessage, setQueueMessage] = useState('');
  const [canCheckout, setCanCheckout] = useState(false);

  // เปลี่ยนจำนวนบัตร + อัปเดต Stack DSA
  const handleQtyChange = (zoneName, delta) => {
    setTicketCart((prevCart) => {
      const currentQty = prevCart[zoneName].qty;
      const newQty = delta > 0 ? currentQty + 1 : Math.max(0, currentQty - 1);

      return {
        ...prevCart,
        [zoneName]: { ...prevCart[zoneName], qty: newQty }
      };
    });

    if (delta > 0) {
      setSelectionStack((prevStack) => [
        ...prevStack,
        { zoneName, price: ticketCart[zoneName].price }
      ]);
    } else {
      setSelectionStack((prevStack) => {
        const idx = prevStack.findLastIndex((item) => item.zoneName === zoneName);
        if (idx !== -1) {
          const newStack = [...prevStack];
          newStack.splice(idx, 1);
          return newStack;
        }
        return prevStack;
      });
    }
  };

  // Undo บน Stack
  const handleUndoStack = () => {
    if (selectionStack.length === 0) return;
    const lastSelection = selectionStack[selectionStack.length - 1];

    setTicketCart((prev) => ({
      ...prev,
      [lastSelection.zoneName]: {
        ...prev[lastSelection.zoneName],
        qty: Math.max(0, prev[lastSelection.zoneName].qty - 1)
      }
    }));

    setSelectionStack((prev) => prev.slice(0, -1));
  };

  // คำนวณราคารวม
  const totalPrice = Object.keys(ticketCart).reduce((sum, zone) => {
    return sum + ticketCart[zone].price * ticketCart[zone].qty;
  }, 0);

  // Queue DSA: เข้าคิวจอง
  const handleJoinQueue = () => {
    if (!currentUser) {
      alert('กรุณาเข้าสู่ระบบก่อนครับ');
      onRequireLogin();
      return;
    }

    const hasTickets = Object.values(ticketCart).some((t) => t.qty > 0);
    if (!hasTickets) {
      alert('กรุณาเลือกบัตรอย่างน้อย 1 ใบก่อนเข้าคิว');
      return;
    }

    const newQueue = [...queueList, currentUser];
    setQueueList(newQueue);
    setQueueMessage(`คุณอยู่ในคิวอันดับที่ ${newQueue.length}`);

    setTimeout(() => {
      setQueueMessage('ถึงคิวของคุณแล้ว! โปรดกดชำระเงิน');
      setCanCheckout(true);
    }, 2000);
  };

  const handleProcessBooking = () => {
    alert('จองบัตรคอนเสิร์ตสำเร็จ!');
    onBack();
  };

  const tabContents = [
    <p key="0">The 1975 กลับมาอีกครั้งกับทัวร์คอนเสิร์ตระดับโลก "Live in Bangkok" พร้อมโชว์ใหม่ล่าสุดจากอัลบั้ม และเพลงฮิตที่ทุกคนคิดถึง ห้ามพลาด!</p>,
    <p key="1">ศิลปินหลัก: <strong>{event?.artists || event?.name || 'The 1975'}</strong> พร้อมไลน์อัปสุดพิเศษที่จะมาร่วมสร้างความประทับใจ</p>,
    <p key="2">สามารถตรวจสอบตำแหน่งที่นั่งและโซนต่าง ๆ ได้ที่แผนผัง SVG ด้านล่างนี้ โดยแบ่งตามระดับราคาและสิทธิประโยชน์</p>,
    <p key="3">1. ห้ามนำกล้องถ่ายภาพมืออาชีพเข้าภายในงาน<br />2. แสดงหลักฐานการฉีดวัคซีนหรือผลตรวจ ATK ตามที่ผู้จัดกำหนด<br />3. ไม่อนุญาตให้เปลี่ยนหรือคืนบัตรในทุกกรณี</p>
  ];

  return (
    <main id="booking-page" className="page-section">
      <div className="booking-page-wrapper">
        <button className="back-btn-pill" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> กลับหน้าหลัก
        </button>

        <div className="booking-grid-layout">
          {/* ฝั่งซ้าย: ข้อมูลคอนเสิร์ต & ผังที่นั่ง */}
          <div className="booking-main-content">
            <div
              className="event-hero-banner"
              style={{
                background: `linear-gradient(180deg, rgba(15, 10, 25, 0.2) 0%, rgba(10, 9, 17, 0.95) 100%), url('${event?.imageUrl || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200'}') center/cover`
              }}
            >
              <span className="world-tour-badge">• WORLD TOUR 2025</span>
              <h1 className="event-hero-title">{event?.name || 'Live Concert'}</h1>
              <div className="hero-art-overlay">
                <span className="handwrite-art">Music Brings Us Together ♥</span>
              </div>
            </div>

            <div className="event-info-summary">
              <div className="info-tag-badge">CONCERT</div>
              <h2>{event?.name}</h2>
              <div className="tour-subtext">WORLD TOUR 2025</div>
              <p className="event-desc-text">
                {event?.description || `เตรียมพบกับคอนเสิร์ตเต็มรูปแบบของ ${event?.name} ที่จะมาพร้อมโชว์สุดพิเศษ และเพลงฮิตมากมาย ให้คุณได้ดื่มด่ำไปกับบรรยากาศและพลังแห่งดนตรีไปด้วยกัน`}
              </p>

              <div className="info-meta-list">
                <div className="meta-item">
                  <i className="fa-regular fa-calendar-days"></i>
                  <div><strong>{event?.date || '15 พฤศจิกายน 2025'}</strong><br /><span>เวลา {event?.time || '19:00 น.'}</span></div>
                </div>
                <div className="meta-item">
                  <i className="fa-solid fa-location-dot"></i>
                  <div><strong>{event?.venue || 'Impact Arena'}</strong><br /><span>{event?.city || 'กรุงเทพฯ'}</span></div>
                </div>
                <div className="meta-item">
                  <i className="fa-solid fa-tag"></i>
                  <div><strong>ประเภทคอนเสิร์ต</strong><br /><span>{event?.genre || 'Music'}</span></div>
                </div>
              </div>
            </div>

            {/* แท็บรายละเอียด & แผนผังที่นั่ง */}
            <div className="details-section-grid">
              <div className="details-card-box">
                <div className="card-header-title">
                  <i className="fa-solid fa-align-left"></i> รายละเอียดคอนเสิร์ต
                </div>
                <div className="tab-nav-buttons">
                  {['ข้อมูลทั่วไป', 'ศิลปิน', 'แผนผังที่นั่ง', 'เงื่อนไขการเข้าร่วม'].map((tabName, idx) => (
                    <button
                      key={idx}
                      className={`tab-btn ${activeTab === idx ? 'active' : ''}`}
                      onClick={() => setActiveTab(idx)}
                    >
                      {tabName}
                    </button>
                  ))}
                </div>
                <div className="tab-content-text">
                  {tabContents[activeTab]}
                </div>
              </div>

              {/* LineUp */}
              <div className="details-card-box">
                <div className="card-header-title">
                  <i className="fa-solid fa-user-group"></i> Line Up
                </div>
                <div className="artist-lineup-item">
                  <img src={event?.imageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300'} alt="Artist" className="artist-thumb" />
                  <div className="artist-info">
                    <h4>{event?.artists || event?.name} <span className="headliner-badge">Headliner</span></h4>
                    <p>Known for their unique sound, emotional lyrics and unforgettable live performances.</p>
                  </div>
                </div>
              </div>

              {/* SVG Seatmap */}
              <div className="details-card-box seatmap-card">
                <div className="card-header-title">
                  <i className="fa-solid fa-map-location-dot"></i> แผนผังที่นั่ง (โดยประมาณ)
                </div>
                <div className="seatmap-container">
                  <svg viewBox="0 0 400 280" className="svg-stage-map">
                    <rect x="130" y="20" width="140" height="30" rx="6" fill="#3a3854" stroke="#ff4b82" strokeWidth="2" />
                    <text x="200" y="40" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">STAGE</text>
                    <path d="M 120 60 L 280 60 L 270 110 L 130 110 Z" fill="#ff4b82" opacity="0.85" />
                    <text x="200" y="90" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">VIP</text>
                    <path d="M 110 115 L 290 115 L 280 160 L 120 160 Z" fill="#9d4edd" opacity="0.85" />
                    <text x="200" y="142" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">Zone A</text>
                    <path d="M 100 165 L 300 165 L 290 205 L 110 205 Z" fill="#3a86ef" opacity="0.85" />
                    <text x="200" y="190" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">Zone B</text>
                    <path d="M 50 80 L 105 80 L 105 200 L 60 180 Z" fill="#2a9d8f" opacity="0.85" />
                    <text x="80" y="145" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">Zone C</text>
                    <path d="M 295 80 L 350 80 L 340 180 L 295 200 Z" fill="#e76f51" opacity="0.85" />
                    <text x="320" y="145" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">Zone D</text>
                  </svg>
                  <div className="seatmap-legend">
                    <div className="legend-item"><span className="color-dot vip"></span> VIP</div>
                    <div className="legend-item"><span className="color-dot zone-a"></span> โซน A</div>
                    <div className="legend-item"><span className="color-dot zone-b"></span> โซน B</div>
                    <div className="legend-item"><span className="color-dot zone-c"></span> โซน C</div>
                    <div className="legend-item"><span className="color-dot zone-d"></span> โซน D</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: เลือกโซนบัตร + DSA Panel */}
          <div className="booking-sidebar-panel">
            <div className="ticket-select-box">
              <div className="panel-header">
                <i className="fa-solid fa-ticket"></i> เลือกประเภทบัตร
              </div>

              <div className="ticket-type-list">
                {Object.keys(ticketCart).map((zoneName) => {
                  const item = ticketCart[zoneName];
                  const bgClass = zoneName === 'VIP' ? 'vip-bg' : zoneName === 'Zone A' ? 'zone-a-bg' : zoneName === 'Zone B' ? 'zone-b-bg' : zoneName === 'Zone C' ? 'zone-c-bg' : 'zone-d-bg';

                  return (
                    <div className="ticket-type-card" key={zoneName}>
                      <div className="ticket-info">
                        <div className="ticket-name-row">
                          <span className={`zone-badge ${bgClass}`}></span>
                          <strong>{zoneName}</strong>
                          {zoneName === 'VIP' && <span className="best-view-tag">Best View</span>}
                        </div>
                        <div className="ticket-price">฿ {item.price.toLocaleString()}</div>
                      </div>
                      <div className="quantity-control">
                        <button onClick={() => handleQtyChange(zoneName, -1)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => handleQtyChange(zoneName, 1)}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stack DSA Bar */}
              <div className="dsa-stack-bar">
                <div className="stack-header-row">
                  <span>ประวัติการเลือก (Stack DSA):</span>
                  <button className="undo-stack-btn" onClick={handleUndoStack} disabled={selectionStack.length === 0}>
                    <i className="fa-solid fa-rotate-left"></i> Undo
                  </button>
                </div>
                <div className="stack-badge-container">
                  {selectionStack.length === 0 ? (
                    <span className="empty-stack-text">ไม่มี</span>
                  ) : (
                    selectionStack.map((st, idx) => (
                      <div className="stack-badge-item" key={idx}>
                        <span className={`badge-dot ${st.zoneName === 'VIP' ? 'vip' : st.zoneName === 'Zone A' ? 'zone-a' : st.zoneName === 'Zone B' ? 'zone-b' : st.zoneName === 'Zone C' ? 'zone-c' : 'zone-d'}`}></span>
                        <span>{st.zoneName} (฿{st.price.toLocaleString()})</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Queue DSA Bar */}
              <div className="queue-status-box">
                <div className="queue-title">สถานะการจองคิว (Queue DSA)</div>
                <button className="join-queue-btn" onClick={handleJoinQueue}>เข้าคิวจองบัตร</button>
                <div className="queue-info-text">{queueMessage}</div>
              </div>

              {/* Total & Checkout */}
              <div className="checkout-footer-panel">
                <div className="total-price-row">
                  <span>ยอดรวม</span>
                  <span className="total-amount">฿ {totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <button className="go-select-seat-btn" disabled={!canCheckout} onClick={handleProcessBooking}>
                  <i className="fa-solid fa-ticket"></i> ยืนยันการจองบัตร
                </button>
                <p className="fee-note">* ราคานี้ยังไม่รวมค่าธรรมเนียมการจอง 3%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}