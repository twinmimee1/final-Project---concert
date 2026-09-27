// ==========================================
// 1. DATA STRUCTURES & ALGORITHMS (DSAs)
// ==========================================

// --- Selection Sort ---
function customSelectionSort(arr, key) {
    let n = arr.length;
    let list = [...arr];

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (key === 'price') {
                if (list[j].minPrice < list[minIdx].minPrice) minIdx = j;
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

// --- Custom Stack Class ---
class Stack {
    constructor() {
        this.items = [];
    }
    push(element) {
        this.items.push(element);
    }
    pop() {
        if (this.isEmpty()) return null;
        return this.items.pop();
    }
    peek() {
        return this.items[this.items.length - 1];
    }
    isEmpty() {
        return this.items.length === 0;
    }
    clear() {
        this.items = [];
    }
    getElements() {
        return [...this.items];
    }
}

// --- Queue Structure ---
class BookingQueue {
    constructor() { 
        this.items = {}; 
        this.head = 0; 
        this.tail = 0; 
    }
    enqueue(element) { 
        this.items[this.tail] = element; 
        this.tail++; 
    }
    dequeue() {
        if (this.head === this.tail) return null;
        const item = this.items[this.head];
        delete this.items[this.head];
        this.head++;
        return item;
    }
    size() { 
        return this.tail - this.head; 
    }
    clear() {
        this.items = {};
        this.head = 0;
        this.tail = 0;
    }
}

// Global Variables
let globalEvents = [];
const selectionStack = new Stack();
const bookingQueue = new BookingQueue();
let currentUser = null;

// Favorite State & Undo/Redo Stacks
let favoriteEvents = []; 
const undoStack = new Stack(); 
const redoStack = new Stack(); 

// โครงสร้างเก็บจำนวนบัตรที่เลือก
let ticketCart = {
    'VIP': { price: 6500, qty: 0 },
    'Zone A': { price: 5500, qty: 0 },
    'Zone B': { price: 4500, qty: 0 },
    'Zone C': { price: 3500, qty: 0 },
    'Zone D': { price: 2500, qty: 0 }
};

// ==========================================
// 2. PAGE NAVIGATION, EVENT LISTENERS & AUTH
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
    setupTabNavigation();
    setupPasswordToggle();
});

function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('hidden'));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.remove('hidden');
}

function handleLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username-input').value;
    if (usernameInput) {
        currentUser = usernameInput;
        completeLoginSequence();
    }
}

function mockSocialLogin(provider) {
    currentUser = `${provider}_User`;
    alert(`คุณได้เข้าสู่ระบบผ่าน ${provider} เรียบร้อยแล้ว!`);
    completeLoginSequence();
}

function completeLoginSequence() {
    const userBtn = document.getElementById('user-btn');
    if (userBtn) userBtn.innerText = currentUser;
    showSection('home-page');
}

// สลับการมองเห็นรหัสผ่าน (Password Visibility Toggle)
function setupPasswordToggle() {
    const togglePwdBtn = document.querySelector('.toggle-pwd');
    if (togglePwdBtn) {
        togglePwdBtn.addEventListener('click', function() {
            const pwdInput = this.parentElement.querySelector('input[type="password"], input[type="text"]');
            if (pwdInput) {
                if (pwdInput.type === 'password') {
                    pwdInput.type = 'text';
                    this.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    pwdInput.type = 'password';
                    this.classList.replace('fa-eye-slash', 'fa-eye');
                }
            }
        });
    }
}

// ระบบจัดการ Tab Navigation บนหน้า Booking
function setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContentText = document.querySelector('.tab-content-text');

    const tabContents = {
        0: `<p>The 1975 กลับมาอีกครั้งกับทัวร์คอนเสิร์ตระดับโลก "Live in Bangkok" พร้อมโชว์ใหม่ล่าสุดจากอัลบั้ม และเพลงฮิตที่ทุกคนคิดถึง ห้ามพลาด! โอกาสสุดท้ายที่จะได้สัมผัสพวกเขาแบบใกล้ชิดในประเทศไทย</p>
            <div class="quote-style">"It's not just a concert, it's a feeling." ♡</div>`,
        1: `<p>ศิลปินหลัก: <strong>The 1975</strong> วงอินดี้ร็อกระดับโลก พร้อมไลน์อัปสุดพิเศษที่จะมาร่วมสร้างความประทับใจตลอดทั้งค่ำคืน</p>`,
        2: `<p>สามารถตรวจสอบตำแหน่งที่นั่งและโซนต่าง ๆ ได้ที่แผนผัง SVG ด้านล่างนี้ โดยแบ่งตามระดับราคาและสิทธิประโยชน์</p>`,
        3: `<p>1. ห้ามนำกล้องถ่ายภาพมืออาชีพเข้าภายในงาน<br>2. แสดงหลักฐานการฉีดวัคซีนหรือผลตรวจ ATK ตามที่ผู้จัดกำหนด<br>3. ไม่อนุญาตให้เปลี่ยนหรือคืนบัตรในทุกกรณี</p>`
    };

    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (tabContentText && tabContents[index]) {
                tabContentText.innerHTML = tabContents[index];
            }
        });
    });
}

// ==========================================
// 3. API FETCHING & FEED DISPLAY
// ==========================================

async function fetchEvents(keyword = '') {
    const loading = document.getElementById('loading');
    const grid = document.getElementById('events-grid');
    if (loading) loading.classList.remove('hidden');

    try {
        const response = await fetch(`/api/events?keyword=${keyword}`);
        const data = await response.json();
        globalEvents = data.events || [];
        renderEvents(globalEvents);
    } catch (err) {
        if (grid) grid.innerHTML = '<p style="grid-column: span 4; text-align:center;">เกิดข้อผิดพลาดในการดึงข้อมูล API</p>';
    } finally {
        if (loading) loading.classList.add('hidden');
    }
}

function renderEvents(events) {
    const grid = document.getElementById('events-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (events.length === 0) {
        grid.innerHTML = '<p style="grid-column: span 4; text-align:center;">ไม่พบรายการคอนเสิร์ต</p>';
        return;
    }

    events.forEach(event => {
        const dateObj = new Date(event.date);
        const day = isNaN(dateObj.getDate()) ? '15' : dateObj.getDate();
        const monthYear = isNaN(dateObj.getDate()) ? 'NOV 2025' : dateObj.toLocaleString('en', { month: 'short', year: 'numeric' });

        const isFav = favoriteEvents.some(fav => fav.id === event.id);
        const heartClass = isFav ? 'fa-solid fa-heart active' : 'fa-regular fa-heart';
        const heartColor = isFav ? 'color: var(--accent-pink);' : '';

        const card = document.createElement('div');
        card.className = 'concert-card-modern';
        card.innerHTML = `
            <div class="card-img-wrapper" onclick="openQuickView('${event.id}')" style="cursor:pointer">
                <img src="${event.imageUrl}" alt="${event.name}">
                <div class="date-badge">
                    <div class="day">${day}</div>
                    <div class="month-year">${monthYear}</div>
                </div>
            </div>
            <div class="concert-card-body">
                <div>
                    <h4 class="concert-title" title="${event.name}">${event.name}</h4>
                    <div class="concert-venue">${event.venue}, ${event.city}</div>
                </div>
                <div class="concert-card-footer">
                    <button class="btn-book-small" onclick="directBooking('${event.id}')">จองบัตร</button>
                    <i class="${heartClass} fav-btn-icon" style="${heartColor}" onclick="toggleFavorite('${event.id}')"></i>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function handleSort(key) {
    const sorted = customSelectionSort(globalEvents, key);
    renderEvents(sorted);
}

function searchEvents() {
    const query = document.getElementById('search-input').value;
    fetchEvents(query);
}

function filterGenre(genre) {
    // ปรับ Active State บน Genre Pills UI
    document.querySelectorAll('.genre-pill').forEach(pill => pill.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    if (genre === 'all') fetchEvents('music');
    else fetchEvents(genre);
}

// ==========================================
// 4. FAVORITES & UNDO/REDO SYSTEM (STACK DSA)
// ==========================================

function toggleFavorite(eventId) {
    const event = globalEvents.find(e => e.id === eventId);
    if (!event) return;

    const isFav = favoriteEvents.some(e => e.id === eventId);
    let actionType = '';

    if (isFav) {
        favoriteEvents = favoriteEvents.filter(e => e.id !== eventId);
        actionType = 'REMOVE';
    } else {
        favoriteEvents.push(event);
        actionType = 'ADD';
    }

    undoStack.push({ type: actionType, event: event });
    redoStack.clear();

    updateFavoritesUI();
}

function undoFavorite() {
    if (undoStack.isEmpty()) return;

    const lastAction = undoStack.pop();
    
    if (lastAction.type === 'ADD') {
        favoriteEvents = favoriteEvents.filter(e => e.id !== lastAction.event.id);
    } else if (lastAction.type === 'REMOVE') {
        favoriteEvents.push(lastAction.event);
    }

    redoStack.push(lastAction);
    updateFavoritesUI();
}

function redoFavorite() {
    if (redoStack.isEmpty()) return;

    const nextAction = redoStack.pop();

    if (nextAction.type === 'ADD') {
        favoriteEvents.push(nextAction.event);
    } else if (nextAction.type === 'REMOVE') {
        favoriteEvents = favoriteEvents.filter(e => e.id !== nextAction.event.id);
    }

    undoStack.push(nextAction);
    updateFavoritesUI();
}

function updateFavoritesUI() {
    const favCountElem = document.getElementById('fav-count');
    if (favCountElem) favCountElem.innerText = favoriteEvents.length;

    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    if (undoBtn) undoBtn.disabled = undoStack.isEmpty();
    if (redoBtn) redoBtn.disabled = redoStack.isEmpty();

    renderEvents(globalEvents);
    renderFavoritesModalContent();
}

function openFavoritesModal() {
    renderFavoritesModalContent();
    const modal = document.getElementById('favorites-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeFavoritesModal() {
    const modal = document.getElementById('favorites-modal');
    if (modal) modal.classList.add('hidden');
}

function renderFavoritesModalContent() {
    const grid = document.getElementById('favorites-list-grid');
    const emptyMsg = document.getElementById('no-favorites-msg');
    if (!grid) return;

    grid.innerHTML = '';

    if (favoriteEvents.length === 0) {
        if (emptyMsg) emptyMsg.classList.remove('hidden');
    } else {
        if (emptyMsg) emptyMsg.classList.add('hidden');
        
        favoriteEvents.forEach(event => {
            const dateObj = new Date(event.date);
            const day = isNaN(dateObj.getDate()) ? '15' : dateObj.getDate();
            const monthYear = isNaN(dateObj.getDate()) ? 'NOV 2025' : dateObj.toLocaleString('en', { month: 'short', year: 'numeric' });

            const card = document.createElement('div');
            card.className = 'concert-card-modern';
            card.innerHTML = `
                <div class="card-img-wrapper" onclick="closeFavoritesModal(); openQuickView('${event.id}')" style="cursor:pointer">
                    <img src="${event.imageUrl}" alt="${event.name}">
                    <div class="date-badge">
                        <div class="day">${day}</div>
                        <div class="month-year">${monthYear}</div>
                    </div>
                </div>
                <div class="concert-card-body">
                    <div>
                        <h4 class="concert-title">${event.name}</h4>
                        <div class="concert-venue">${event.venue}, ${event.city}</div>
                    </div>
                    <div class="concert-card-footer">
                        <button class="btn-book-small" onclick="closeFavoritesModal(); directBooking('${event.id}')">จองบัตร</button>
                        <i class="fa-solid fa-heart active fav-btn-icon" style="color: var(--accent-pink);" onclick="toggleFavorite('${event.id}')"></i>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

// ==========================================
// 5. QUICK VIEW & BOOKING QUEUE LOGIC
// ==========================================

function openQuickView(eventId) {
    const event = globalEvents.find(e => e.id === eventId);
    if (!event) return;

    const modalBody = document.getElementById('quickview-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
        <div class="qv-container">
            <img src="${event.imageUrl}" alt="${event.name}" class="qv-image">
            <div class="qv-details">
                <span class="qv-badge">${event.genre || 'Concert'}</span>
                <h2>${event.name}</h2>
                <p><i class="fa-solid fa-user-astronaut"></i> <strong>ศิลปิน:</strong> ${event.artists || event.name}</p>
                <p><i class="fa-regular fa-calendar-days"></i> <strong>วันแสดง:</strong> ${event.date} (${event.time || '19:00 น.'})</p>
                <p><i class="fa-solid fa-location-dot"></i> <strong>สถานที่:</strong> ${event.venue}, ${event.city}</p>
                <p><i class="fa-solid fa-tag"></i> <strong>ราคาบัตรเริ่มต้น:</strong> ${event.minPrice ? event.minPrice.toLocaleString() : '1,500'} THB</p>
                <div class="qv-actions">
                    <button class="btn-book-small" style="width: 100%; padding: 12px; font-size: 0.95rem; border-radius: 20px;" onclick="closeQuickView(); directBooking('${event.id}')">
                        จองบัตรคอนเสิร์ตนี้เลย
                    </button>
                </div>
            </div>
        </div>
    `;

    const modal = document.getElementById('quickview-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeQuickView() {
    const modal = document.getElementById('quickview-modal');
    if (modal) modal.classList.add('hidden');
}

// === อัปเดตข้อมูล Dynamic ไปยังหน้า Booking ===
function directBooking(eventId) {
    const event = globalEvents.find(e => e.id === eventId);
    if (!event) return;

    // 1. อัปเดต Hero Banner Background & Title
    const heroElem = document.getElementById('booking-event-hero');
    if (heroElem && event.imageUrl) {
        heroElem.style.background = `linear-gradient(180deg, rgba(15, 10, 25, 0.3) 0%, rgba(10, 9, 17, 0.95) 100%), url('${event.imageUrl}') center/cover`;
    }

    // 2. อัปเดตข้อความรายละเอียดงาน
    const heroTitle = document.getElementById('booking-event-title');
    const subtitle = document.getElementById('booking-event-subtitle');
    const dateElem = document.getElementById('booking-event-date');
    const timeElem = document.getElementById('booking-event-time');
    const venueElem = document.getElementById('booking-event-venue');
    const genreElem = document.getElementById('booking-event-genre');
    const artistElem = document.getElementById('booking-artist-name');
    const descElem = document.querySelector('.event-desc-text');

    if (heroTitle) heroTitle.innerText = event.name;
    if (subtitle) subtitle.innerText = event.name;
    if (dateElem) dateElem.innerText = event.date;
    if (timeElem) timeElem.innerText = `เวลา ${event.time || '19:00 น.'}`;
    if (venueElem) venueElem.innerText = `${event.venue}, ${event.city}`;
    if (genreElem) genreElem.innerText = event.genre || 'Concert';
    if (artistElem) artistElem.innerHTML = `${event.artists || event.name} <span class="headliner-badge">Headliner</span>`;

    // อัปเดตคำบรรยายงาน
    if (descElem) {
        descElem.innerText = event.description || `เตรียมพบกับคอนเสิร์ตเต็มรูปแบบของ ${event.name} ที่จะมาพร้อมโชว์สุดพิเศษ และเพลงฮิตมากมาย ให้คุณได้ดื่มด่ำไปกับบรรยากาศและพลังแห่งดนตรีไปด้วยกัน`;
    }

    // 3. คำนวณและอัปเดตราคาบัตรตามฐานราคา minPrice ของงานนั้นๆ
    const basePrice = event.minPrice || 2500;
    ticketCart = {
        'VIP': { price: basePrice + 4000, qty: 0 },
        'Zone A': { price: basePrice + 3000, qty: 0 },
        'Zone B': { price: basePrice + 2000, qty: 0 },
        'Zone C': { price: basePrice + 1000, qty: 0 },
        'Zone D': { price: basePrice, qty: 0 }
    };

    // แสดงราคาบัตรบน UI หน้าจอง
    updateTicketPricesUI();

    // รีเซ็ตคิวและตระกร้าสินค้า
    resetTicketCart();
    showSection('booking-page');
}

// อัปเดตข้อความราคาบน UI ฝั่งขวา
function updateTicketPricesUI() {
    for (let zone in ticketCart) {
        const card = document.getElementById(`qty-${zone}`)?.closest('.ticket-type-card');
        if (card) {
            const priceElem = card.querySelector('.ticket-price');
            if (priceElem) {
                const unitText = priceElem.querySelector('.unit-text')?.outerHTML || '';
                priceElem.innerHTML = `฿ ${ticketCart[zone].price.toLocaleString()} ${unitText}`;
            }
        }
    }
}

function changeTicketQty(zoneName, delta) {
    if (!ticketCart[zoneName]) return;

    if (delta > 0) {
        // เพิ่มลง Stack
        ticketCart[zoneName].qty++;
        selectionStack.push({ zoneName, price: ticketCart[zoneName].price });
    } else {
        // หากเป็นการกดปุ่มลบ (-) โดยตรงที่โซนนั้นๆ
        if (ticketCart[zoneName].qty > 0) {
            ticketCart[zoneName].qty--;
            
            // ลบรายการโซนนั้นๆ ตัวล่าสุดออกจาก Stack
            const elements = selectionStack.getElements();
            for (let i = elements.length - 1; i >= 0; i--) {
                if (elements[i].zoneName === zoneName) {
                    elements.splice(i, 1);
                    break;
                }
            }
            selectionStack.items = elements;
        }
    }

    const qtyElem = document.getElementById(`qty-${zoneName}`);
    if (qtyElem) qtyElem.innerText = ticketCart[zoneName].qty;

    updateStackUI();
    calculateTotal();
}

function resetTicketCart() {
    selectionStack.clear();
    bookingQueue.clear();
    
    const checkoutBtn = document.getElementById('checkout-btn');
    const queueInfo = document.getElementById('queue-info');
    if (checkoutBtn) checkoutBtn.disabled = true;
    if (queueInfo) queueInfo.innerText = '';

    for (let key in ticketCart) {
        ticketCart[key].qty = 0;
        const elem = document.getElementById(`qty-${key}`);
        if (elem) elem.innerText = '0';
    }
    updateStackUI();
    calculateTotal();
}

function handleUndoStack() {
    const lastSelection = selectionStack.pop();
    if (lastSelection) {
        const zone = lastSelection.zoneName;
        if (ticketCart[zone] && ticketCart[zone].qty > 0) {
            ticketCart[zone].qty--;
            const qtyElem = document.getElementById(`qty-${zone}`);
            if (qtyElem) qtyElem.innerText = ticketCart[zone].qty;
        }
    }
    updateStackUI();
    calculateTotal();
}

// === แสดงผล Stack เป็นกล่องแบบต่อท้ายเรียงกัน ===
function updateStackUI() {
    const stackContainer = document.getElementById('stack-history-container');
    const undoBtn = document.querySelector('.undo-stack-btn');
    if (!stackContainer) return;

    stackContainer.innerHTML = '';
    const items = selectionStack.getElements();

    if (items.length === 0) {
        stackContainer.innerHTML = '<span class="empty-stack-text">ไม่มี</span>';
        if (undoBtn) undoBtn.disabled = true;
    } else {
        if (undoBtn) undoBtn.disabled = false;
        
        items.forEach(item => {
            const badge = document.createElement('div');
            badge.className = 'stack-badge-item';
            
            // กำหนดสีของ Badge ตามโซน
            let zoneClass = '';
            if (item.zoneName === 'VIP') zoneClass = 'vip';
            else if (item.zoneName === 'Zone A') zoneClass = 'zone-a';
            else if (item.zoneName === 'Zone B') zoneClass = 'zone-b';
            else if (item.zoneName === 'Zone C') zoneClass = 'zone-c';
            else if (item.zoneName === 'Zone D') zoneClass = 'zone-d';

            badge.innerHTML = `
                <span class="badge-dot ${zoneClass}"></span>
                <span class="badge-text">${item.zoneName} (฿${item.price.toLocaleString()})</span>
            `;
            stackContainer.appendChild(badge);
        });
    }
}

function calculateTotal() {
    let total = 0;
    for (let key in ticketCart) {
        total += ticketCart[key].price * ticketCart[key].qty;
    }

    const totalDisplay = document.getElementById('total-price-display');
    if (totalDisplay) {
        totalDisplay.innerText = `฿ ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
}

function joinQueue() {
    if (!currentUser) { 
        alert('กรุณาเข้าสู่ระบบก่อนครับ'); 
        showSection('welcome-page'); 
        return; 
    }

    let hasTickets = false;
    for (let key in ticketCart) {
        if (ticketCart[key].qty > 0) {
            hasTickets = true;
            break;
        }
    }

    if (!hasTickets) {
        alert('กรุณาเลือกบัตรอย่างน้อย 1 ใบก่อนเข้าคิว');
        return;
    }

    bookingQueue.enqueue(currentUser);
    const queueInfo = document.getElementById('queue-info');
    if (queueInfo) queueInfo.innerText = `คุณอยู่ในคิวอันดับที่ ${bookingQueue.size()}`;

    setTimeout(() => {
        if (queueInfo) queueInfo.innerText = `ถึงคิวของคุณแล้ว! โปรดกดชำระเงิน`;
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) checkoutBtn.disabled = false;
    }, 2000);
}

function processBooking() {
    alert('จองบัตรคอนเสิร์ตสำเร็จ!');
    resetTicketCart();
    showSection('home-page');
}