# TICKETVIBE — Concert Tickets Booking Application

โปรเจกต์ระบบจองบัตรคอนเสิร์ต พัฒนาต่อยอดด้วยการแยกสถาปัตยกรรมเป็น **Frontend (React + Vite)** และ **Backend (Express API Proxy)** พร้อมการนำโครงสร้างข้อมูลและอัลกอริทึม (DSA) มาประยุกต์ใช้ในการจัดการ UX/UI เชิงลึก


## 📌 1. โครงสร้างโปรเจกต์ (Project Structure)

```text
ticketvibe-project/
├── backend/
│   ├── server.js          # Express API Proxy, Data Validation & Cache
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WelcomePage.jsx   # หน้า Login / Register State
│   │   │   ├── HomePage.jsx      # หน้า Feed คอนเสิร์ต, ค้นหา, กรอง และ Selection Sort DSA
│   │   │   └── BookingPage.jsx   # หน้าจองบัตร, ผังที่นั่ง, Stack & Queue DSA
│   │   ├── App.jsx               # ตัวจัดการ State หลักและการสลับหน้า (Page Router)
│   │   └── index.css             # สไตล์หลักและธีมสีของแอปพลิเคชัน
│   ├── index.html
│   └── package.json
└── README.md
```

## 🛠️ 2. วิธีการติดตั้งและรันโปรเจกต์ (Setup & Local Run)
### 1. รันฝั่ง Backend (Express Server)
```text
cd backend
npm install
node server.js
```
(เซิร์ฟเวอร์จะรันที่พอร์ต http://localhost:3000)
### 2. รันฝั่ง Frontend (React + Vite)
```text
cd frontend
npm install
npm run dev
```
(เปิดเบราว์เซอร์และเข้าชมผ่านลิงก์ http://localhost:5173)

## 📋 3. ตารางส่วนร่วมของสมาชิก (Contribution Table)
| ชื่อ-สกุล | รหัสนักศึกษา | ชิ้นงานที่รับผิดชอบ (ไฟล์ / Component / Route / DSA) | ช่วงที่นำเสนอในคลิป |
| :--- | :--- | :--- | :--- |
| **[ชื่อสมาชิกคนที่ 1]** | [รหัสนักศึกษา] | • **Frontend State & Navigation:** `src/App.jsx`, `src/components/WelcomePage.jsx`<br>• **UX Flow Improvement:** ระบบ Authentication State และการเปลี่ยนผ่านหน้าจอ (Page Router)<br>• **Design System:** `src/index.css` และ Responsive Layout | **0:00 - 2:30**<br>(ช่วงที่ 1, 2 และ 3) |
| **[ชื่อสมาชิกคนที่ 2]** | [รหัสนักศึกษา] | • **Backend Express:** `backend/server.js` (API Proxy ซ่อน Key, Validation & Route `/api/events`)<br>• **Main Feed Component:** `src/components/HomePage.jsx`<br>• **UX States:** Loading / Empty / Error Handling | **2:30 - 5:00**<br>(ช่วงที่ 3 และ 4) |
| **[ชื่อของคุณ]** | [รหัสนักศึกษา] | • **Booking Component & Seatmap:** `src/components/BookingPage.jsx` (ผังที่นั่ง SVG & Ticket Selector)<br>• **DSA Integration:**<br> - Custom Selection Sort ($O(n^2)$) ในหน้า Feed<br> - Stack ($O(1)$) ระบบ Undo เลือกโซนบัตร<br> - Queue ($O(1)$) จำลองระบบคิวจองบัตร | **5:00 - 7:00**<br>(ช่วงที่ 5 และ 6) |

## 🔄 4. ตารางข้อแนะนำจากงานแรก และสิ่งที่แก้ (Before / After Table)
| ข้อแนะนำจากงานแรก | สิ่งที่แก้ในงานนี้ | หลักฐาน Before / After |
| :--- | :--- | :--- |
| **1. สถาปัตยกรรมโค้ดปะปนกัน:**<br>งานเดิมเขียน HTML/CSS/JS รวมกันในไฟล์เดียว ทำให้จัดการ State ยากและไม่เป็นระเบียบ | **แยก Frontend & Backend ชัดเจน:**<br>รีแฟกเตอร์โครงสร้างเป็น Monorepo แยกสถาปัตยกรรมเป็น React + Vite และ Express ทำหน้าที่เป็น API Proxy ป้องกันการรั่วไหลของ API Key | **Before:** โครงสร้างไฟล์เดี่ยวรวมทุกอย่าง<br><br>**After:** แยกโฟลเดอร์ `/frontend` และ `/backend` ชัดเจนตามหลักการสถาปัตยกรรม |
| **2. UX States ไม่ครบถ้วน:**<br>งานเดิมไม่มี Feedback ที่ชัดเจนตอนระบบกำลังดึงข้อมูล หรือกรณีค้นหาไม่พบ | **เพิ่ม UX States ครบทุกสถานการณ์:**<br>ออกแบบฟีเจอร์ UX ให้สมบูรณ์ มีสถานะ Loading, Empty, Error และ Success พร้อมข้อความแจ้งเตือนที่เข้าใจง่าย | **Before:** หน้าจอค้างนิ่งขณะรอข้อมูลจาก API<br><br>**After:** แสดง Spinner ตอนโหลด และแจ้งเตือน "ไม่พบรายการคอนเสิร์ต" เมื่อค้นหาไม่เจอ |
| **3. การนำ DSA มาใช้ยังไม่ลึกซึ้ง:**<br>การเรียงลำดับและจัดการข้อมูลในงานเดิมทำแบบพื้นฐาน ไม่ส่งผลต่อ UX เชิงลึก | **นำ DSA มาประยุกต์ใช้เชิงลึกกับข้อมูลจริง:**<br>- **Selection Sort ($O(n^2)$):** จัดเรียงคอนเสิร์ตตามราคาและวันที่<br>- **Stack ($O(1)$):** จัดการประวัติการกดเลือกโซนบัตรพร้อมระบบ Undo<br>- **Queue ($O(1)$):** จัดการคิวการจองบัตรตามลำดับ (FIFO) | **Before:** ใช้ฟังก์ชัน Array Sort ธรรมดา<br><br>**After:** ใช้ Custom Selection Sort, Stack Badge Visualizer และ Queue Status Box บน UI |

## 🧠 5. อัลกอริทึมและโครงสร้างข้อมูลที่ใช้ (DSA Details)
### 1.Custom Selection Sort O(n<sup>2</sup>) :
ใช้ในการจัดเรียงรายการคอนเสิร์ตตามราคาเริ่มต้น (minPrice) หรือวันที่จัดงาน เพื่อช่วยให้ผู้ใช้เปรียบเทียบข้อมูลได้สะดวกขึ้น ประมวลผลบนฝั่ง React
### 2.Stack (LIFO - Last In, First Out) :
ใช้ในการเก็บประวัติโซนบัตรที่ผู้ใช้เลือก การกดเลือกจะทำการ Push ลง Stack และเมื่อกดปุ่ม Undo จะทำการ Pop โซนล่าสุดออกทันที ช่วยป้องกันผู้ใช้เลือกบัตรผิดพลาด
### 3.Queue (FIFO - First In, First Out) :
จำลองระบบคิวการซื้อบัตรคอนเสิร์ต เพื่อให้เกิดความสอดคล้องกับพฤติกรรมผู้ใช้จริงในการจองบัตรงานยอดนิยม ผู้ที่กดเข้าคิวก่อน (Enqueue) จะได้รับสิทธิ์ชำระเงินก่อน (Dequeue)