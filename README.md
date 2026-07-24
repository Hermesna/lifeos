# LifeOS · Personal Productivity Dashboard

> **Frontend Architecture Log** · Personal project focused on building a standardized and ultra-efficient ecosystem for managing habits, finances, and languages.

---

## Current Status & Focus

<div align="center">
  <img src="https://img.shields.io/badge/Status-In%20Active%20Development-blue?style=for-the-badge&logo=react&logoColor=white" alt="In Progress Badge" />
</div>

<br />

Currently iterating on the system's foundation, migrating components towards a unified global state and refining the user experience with seamless design transitions.

### On the radar:
* **LifeOS Core:** Consolidating a clean *Feature-First* architecture to vertically isolate each functionality (Habits, Travel, Languages).
* **Theme Engine:** Adaptive global system (Light/Dark Mode) with native detection of operating system preferences and local persistence without "flash" effects.
* **Strict Validation:** Implementation of data guardrails at the customer input using controlled forms and typed schemas.

---

## Technology Stack

At the architectural level, a lightweight, server-agnostic (pure SPA) approach has been prioritized, maximizing performance on the client side:

* **Core:** `React` · `TypeScript`
* **State Management:** `Zustand` (with local persistence middleware)
* **Routing:** `React Router v6` (Layout strategy and 404 view injection)
* **Styling:** `Tailwind CSS` (Dynamic design token strategy using semantic classes)
* **Validation:** `Zod` · `React Hook Form`

---
