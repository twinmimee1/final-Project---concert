// ==========================================
// 1. DATA STRUCTURES & ALGORITHMS (DSAs)
// ==========================================

// --- DSA 1: SORTING ALGORITHM (Selection Sort - เขียนเอง) ---
function customSelectionSort(arr, key) {
    let n = arr.length;
    let list = [...arr]; // Copy array

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

// --- DSA 2: STACK IMPLEMENTATION (เขียนด้วย Class เอง สำหรับ Undo การเลือกบัตร) ---
class TicketStack {
    constructor() {
        this.items = {};
        this.top = 0;
    }
    push(element) {
        this.items[this.top] = element;
        this.top++;
    }
    pop() {
        if (this.top === 0) return null;
        this.top--;
        const result = this.items[this.top];
        delete this.items[this.top];
        return result;
    }
    peek() {
        if (this.top === 0) return null;
        return this.items[this.top - 1];
    }
    isEmpty() {
        return this.top === 0;
    }
}

// --- DSA 3: QUEUE IMPLEMENTATION (เขียนด้วย Class เอง สำหรับระบบรอคิว) ---
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
}

// Global Instances
let globalEvents = [];
const selectionStack = new TicketStack();
const bookingQueue = new BookingQueue();
let favoriteEvents = [];
let currentUser = null;
let selectedEventForBooking = null;

// ==========================================
// 2. APP LOGIC & API INTEGRATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
});

async function fetchEvents(keyword = '') {
    const loading = document.getElementById('loading');
    const grid = document.getElementById('events-grid');
    loading.classList.remove('hidden');
    grid.innerHTML = '';

    try {
        const response = await fetch(`/api/events?keyword=${keyword}`);
        const data = await response.json();
        globalEvents = data.events;
        renderEvents(globalEvents);
    } catch (err) {
        grid.innerHTML = '<p>เกิดข้อผิดพลาดในการโหลดข้อมูล API</p>';
    } finally {
        loading.classList.add('hidden');
    }
}

function renderEvents(events) {
    const grid = document.getElementById('events-grid');
    grid.innerHTML = '';

    if (events.length === 0) {
        grid.innerHTML = '<p>ไม่พบรายการคอนเสิร์ต</p>';
        return;
    }

    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <img src="${event.imageUrl}" alt="${event.name}">
            <div class="event-card-content">
                <h4>${event.name}</h4>
                <p><i class="fa-regular fa-calendar"></i> ${event.date}</p>
                <p><i class="fa-solid fa-location-dot"></i> ${event.venue}</p>
                <div class="card-actions">
                    <button class="book-btn" onclick="directBooking('${event.id}')">จองบัตร</button>
                    <button class="genre-btn" onclick="openQuickView('${event.id}')">ดูย่อ</button>
                    <i class="fa-regular fa-heart" style="cursor:pointer; color: var(--accent-pink)" onclick="toggleFavorite('${event.id}')"></i>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- Sorting Trigger ---
function handleSort(key) {
    const sorted = customSelectionSort(globalEvents, key);
    renderEvents(sorted);
}

// --- Filter Search ---
function searchEvents() {
    const query = document.getElementById('search-input').value;
    fetchEvents(query);
}

function filterGenre(genre) {
    if (genre === 'all') fetchEvents('music');
    else fetchEvents(genre);
}

// --- Auth Mockup ---
function openLoginModal() { document.getElementById('login-modal').classList.remove('hidden'); }
function closeLoginModal() { document.getElementById('login-modal').classList.add('hidden'); }

function handleLogin() {
    const name = document.getElementById('username-input').value;
    if (name) {
        currentUser = name;
        document.getElementById('user-btn').innerText = currentUser;
        closeLoginModal();
        alert(`เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ ${currentUser}`);
    }
}

function mockSocialLogin(provider) {
    alert(`เข้าสู่ระบบผ่าน ${provider} สำเร็จ!`);
    currentUser = `${provider}_User`;
    document.getElementById('user-btn').innerText = currentUser;
    closeLoginModal();
}

// --- Favorites Feature ---
function toggleFavorite(eventId) {
    const event = globalEvents.find(e => e.id === eventId);
    if (!event) return;

    if (!favoriteEvents.includes(event.name)) {
        favoriteEvents.push(event.name);
    }
    document.getElementById('fav-count').innerText = favoriteEvents.length;
    renderFavoritesList();
}

function renderFavoritesList() {
    const list = document.getElementById('fav-list');
    list.innerHTML = favoriteEvents.map(item => `<li>${item}</li>`).join('');
}

function toggleFavoritesMenu() {
    document.getElementById('favorites-popup').classList.toggle('hidden');
}

// --- Quick View Modal ---
function openQuickView(eventId) {
    const event = globalEvents.find(e => e.id === eventId);
    if (!event) return;

    const modalBody = document.getElementById('quickview-body');
    modalBody.innerHTML = `
        <h3>${event.name}</h3>
        <p><strong>ศิลปิน:</strong> ${event.artists}</p>
        <p><strong>วัน/เวลา:</strong> ${event.date} | ${event.time}</p>
        <p><strong>สถานที่:</strong> ${event.venue}, ${event.city}</p>
        <button class="submit-btn" onclick="closeQuickView(); directBooking('${event.id}')">จองบัตรเลย</button>
    `;
    document.getElementById('quickview-modal').classList.remove('hidden');
}

function closeQuickView() { document.getElementById('quickview-modal').classList.add('hidden'); }

// --- Booking & Navigation Flow ---
function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

function directBooking(eventId) {
    selectedEventForBooking = globalEvents.find(e => e.id === eventId);
    if (!selectedEventForBooking) return;

    const infoContainer = document.getElementById('booking-event-info');
    infoContainer.innerHTML = `
        <h2>${selectedEventForBooking.name}</h2>
        <img src="${selectedEventForBooking.imageUrl}" style="width:100%; max-height:250px; object-fit:cover; border-radius:8px;">
        <p><strong>ศิลปิน:</strong> ${selectedEventForBooking.artists}</p>
        <p><strong>สถานที่:</strong> ${selectedEventForBooking.venue} (${selectedEventForBooking.city}, ${selectedEventForBooking.country})</p>
        <p><strong>วัน-เวลา:</strong> ${selectedEventForBooking.date} @ ${selectedEventForBooking.time}</p>
        <p><a href="${selectedEventForBooking.ticketmasterUrl}" target="_blank" style="color: var(--accent-pink)">ดูรายละเอียดบน Ticketmaster</a></p>
    `;
    showSection('booking-page');
}

// --- Stack & Queue Handling ---
function selectZone(zoneName, price) {
    selectionStack.push({ zoneName, price });
    updateStackUI();
}

function handleUndoStack() {
    const removed = selectionStack.pop();
    if (removed) {
        alert(`ยกเลิกการเลือกโซน: ${removed.zoneName}`);
    }
    updateStackUI();
}

function updateStackUI() {
    const current = selectionStack.peek();
    document.getElementById('stack-history').innerText = current ? `${current.zoneName} (${current.price} THB)` : 'ไม่มี';
}

function joinQueue() {
    if (!currentUser) {
        alert('กรุณาเข้าสู่ระบบก่อนทำการจอง');
        openLoginModal();
        return;
    }
    bookingQueue.enqueue(currentUser);
    document.getElementById('queue-info').innerText = `คุณอยู่ในคิวอันดับที่ ${bookingQueue.size()}`;
    
    // จำลองการรัน Queue
    setTimeout(() => {
        const processedUser = bookingQueue.dequeue();
        document.getElementById('queue-info').innerText = `ถึงคิวของ ${processedUser} แล้ว! โปรดกดชำระเงิน`;
        document.getElementById('checkout-btn').disabled = false;
    }, 2000);
}

function processBooking() {
    alert('จองบัตรคอนเสิร์ตสำเร็จ! ขอให้สนุกกับคอนเสิร์ตครับ');
    showSection('home-page');
}