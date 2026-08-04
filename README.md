# 🏛️ AVENOR Real Estate

AVENOR is a state-of-the-art, luxury real estate digital platform engineered for High-Net-Worth Individuals (HNIs), estate investors, and architectural connoisseurs. Combining high-frequency scroll-driven 3D flight canvas photography with real-time portfolio management, AVENOR delivers an immersive interface for inspecting, valuing, scheduling, and managing private oceanfront estates and monolithic residences globally. 🚀

---

## 🌟 Live Demo & Deployment

- 🌐 **Live Production Website**: [https://avenor-realty.vercel.app](https://avenor-realty.vercel.app)

---

## ✨ Features

### 🎬 60 FPS Scroll-Driven Spatial Flight Canvas
- 240-frame preloaded high-DPI flight camera sweep through luxury architecture.
- Built on a custom HTML5 `<canvas>` rendering engine with smooth 60 FPS inertia lerp loops.
- Tiered progressive image loading (0.0s startup latency with parallel keyframe streaming).
- Interactive glassmorphism scene overlays synchronized to scroll progress.

### 🔐 Role-Based Authentication & Scoped Portals
- **Admin Principal Portal (`/admin`)**:
  - Live feed of real client inspection booking requests.
  - Property Inventory CRUD (Create, Edit, Delete luxury listings).
  - Partner Builders directory and regional demand analytics.
  - Role-protected route access.
- **HNI Client Portal (`/dashboard`)**:
  - Personal saved wishlist & recently inspected residence history.
  - Real-time scheduled private inspection tracking (`Pending Approval` vs. `Confirmed`).
  - Country & Currency preferences.

### 📅 Real-Time Client Inspection Approval Workflow
- Clients schedule private inspections directly from any residence dossier (`Pending Approval`).
- Requests stream live into the **Admin Dashboard**.
- Admins review client contact details and click **"Approve & Schedule"** to confirm the inspection, updating both Admin & Client portals in real-time.

### 🌐 Global Currency Valuation Engine
- Instant multi-currency valuation recalculation across global markets:
  - 🇮🇳 **INR (₹)** — Indian Rupee
  - 🇺🇸 **USD ($)** — US Dollar
  - 🇪🇺 **EUR (€)** — Euro
  - 🇬🇧 **GBP (£)** — British Pound
  - 🇯🇵 **JPY (¥)** — Japanese Yen
  - 🇦🇪 **AED (AED)** — UAE Dirham

### 📊 Analytics & Bento Dashboard
- Interactive portfolio market volume tracking.
- Regional HNI demand distribution breakdown.
- Average time-on-market metrics and conversion analytics.

### 💾 Permanent State Persistence
- Integrated `localStorage` state synchronization ensuring all newly added properties, booked appointments, wishlists, and currency preferences persist cleanly across logins, new signups, and browser sessions.

### 📱 Responsive & Ultra-High-Performance UI
- Custom minimalist scrollbars matching dark hero theme.
- Typographic letter badges replacing external photo placeholders.
- Fully responsive across Desktop, Laptop, Tablet, and Mobile devices.

---

## 🛠️ Tech Stack & Tools Used

AVENOR is built using a modern frontend stack with an express micro-backend architecture.

### Frontend
- ⚛️ **React** - Component-based UI library (v18)
- ⚡ **Vite** - Lightning-fast build tool and development server
- 🎨 **Tailwind CSS** - Utility-first CSS framework for luxury styling
- 🖼️ **HTML5 2D Canvas & RequestAnimationFrame** - Ultra-smooth 60 FPS scroll flight engine
- ✨ **Framer Motion & GSAP** - Smooth micro-animations and transitions
- 🔤 **Google Fonts** - Hanken Grotesk, Outfit, and Inter web typography
- 🧩 **Lucide React & Material Symbols** - Modern icon systems

### Backend & Storage
- 🟢 **Node.js & Express** - RESTful API server architecture
- 🍃 **MongoDB & Mongoose / Supabase** - Database schemas and auth integration
- ⚡ **Socket.io** - Real-time websocket event broadcasting
- 💾 **LocalStorage State Sync** - Client-side persistent application context

### Hosting & Deployment
- ⚡ **Vercel Production Deployment** - Automated continuous delivery pipeline ([https://avenor-realty.vercel.app](https://avenor-realty.vercel.app))

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine:

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sambitverse/Real_Estate.git
   cd Real_Estate
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser to view the app.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 👤 Author

- **Developer**: Sambit Moharana
- **GitHub**: [@sambitverse](https://github.com/sambitverse)
- **Live Demo**: [https://avenor-realty.vercel.app](https://avenor-realty.vercel.app)
