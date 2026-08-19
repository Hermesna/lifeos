# LifeOS · Personal Productivity Dashboard

> **Frontend Architecture & Engineering** · A standardized, ultra-efficient personal ecosystem designed for managing habits, finances, languages, travel, and personal growth in real-time.

---

## Current Status & Focus

<div align="center">
  <img src="https://img.shields.io/badge/Status-Completed%20&%20Responsive-success?style=for-the-badge&logo=firebase&logoColor=white" alt="Completed Badge" />
  <img src="https://img.shields.io/badge/Live-Deployment-blue?style=for-the-badge&logo=firebase&logoColor=white" alt="Live Demo" />
</div>

<br />

> **Live Preview:** [https://lifeos-hnunez.web.app/](https://lifeos-hnunez.web.app/)

LifeOS is fully developed and production-ready. The core architecture successfully integrates a **Feature-First** structure, real-time cloud persistence via Firebase/Firestore, and a fully polished responsive design optimized for seamless cross-device mobile and desktop experiences.

---

## Key Features & Modules

* **⚡ Real-Time Dashboard & Sync:** Multi-module state management synchronized live with Firestore listeners, allowing instant updates across sessions, data, and user preferences.
* **🎯 Habit Tracker:** Daily routine management with cross-module integrations (e.g., studying a language automatically logs a corresponding habit entry).
* **💰 Finance Manager:** Transaction logging (income/expense tracking) and custom savings funds with real-time balance and target calculations.
* **🗣️ Language Learning Hub:** Specialized tracking for study sessions (vocabulary, listening, grammar, speaking) categorized by target languages and proficiency levels.
* **✈️ Travel Planner:** Itinerary and trip management for upcoming adventures.
* **🎨 Adaptive Theme Engine:** Native Dark/Light mode switcher with system preference detection and local persistence to prevent any flash of unstyled content.
* **🔐 Authentication System:** Secure email/password and Google authentication via Firebase Auth with automated profile provisioning.

---

## Technology Stack

Built with a performance-first, server-agnostic (SPA) client-side approach:

* **Core & UI:** `React (^19.2.7)` · `TypeScript (~6.0.2)` · `Tailwind CSS (^4.3.2)` · `Lucide React (^1.23.0)`
* **Build Tool:** `Vite (^8.1.1)`
* **State & Persistence:** `Zustand (^5.0.14)` (with middleware persistence)
* **Backend & Database:** `Firebase Auth & Cloud Firestore (^12.16.0)` (Real-time snapshots)
* **Routing:** `React Router Dom (^7.18.1)` (Nested layout strategies and guarded routes)
* **Validation & Forms:** `Zod (^4.4.3)` · `React Hook Form (^7.81.0)`
* **Internationalization:** `i18next (^26.3.6)` (Multi-language support)
* **Utilities & UI Helpers:** `TanStack React Query (^5.101.2)` · `DnD Kit (^6.3.1)`

---

## 🚀 Getting Started

To run LifeOS locally, follow these steps:

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [pnpm](https://pnpm.io/) (Recommended) or [npm](https://www.npmjs.com/)
* A [Firebase Project](https://console.firebase.google.com/)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Hermesna/lifeos.git](https://github.com/Hermesna/lifeos.git)
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```
3. **Configure Environment Variables. Create a .env file in the root directory and add your Firebase configuration:**
   ```bash
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. **Run the development server:**
   ```bash
   pnpm run dev
   ```
5. **Firebase Setup:**
   - Enable Authentication (Email/Password & Google) in your Firebase Console.
   - Enable Cloud Firestore in your Firebase Console and set up your security rules.

---

## Architectural Highlights

* **Feature-First Structure:** Each domain (`habits`, `finances`, `languages`, `travel`, `auth`) encapsulates its own components, hooks, stores, and types, ensuring high maintainability and decoupled scalability.

* **Optimized Mobile View:** Fully adapted UI layout featuring collapsible navigation, fluid spacing, and touch-friendly interactive targets for a native-like mobile experience.

* **Robust Type Safety:** Strict TypeScript interfaces across all data models, stores, and Firestore document references.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
