# onaim-task

1. Project Overview

This project is a Gaming Features Admin Panel that allows operators to manage three independent gaming modules: Leaderboard, Raffle, and Wheel (Spin-to-Win). It provides a structured interface to create, configure, and monitor each feature efficiently.

---

2. Architecture

The project follows a modular feature-based architecture where each domain (Leaderboard, Raffle, Wheel) is fully isolated.

Key Principles
Feature Isolation — Each module contains its own pages, components, hooks, and services
Shared Layer — Common UI components and utilities are reused across modules

Project Structure:

src/
├── modules/
│ ├── leaderboard/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── hooks/
│ │ └── api/
│ ├── raffle/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── hooks/
│ │ └── api/
│ └── wheel/
│ ├── pages/
│ ├── components/
│ ├── hooks/
│ └── api/
│
├── shared/
│ ├── layout/
│ ├── components/
│ ├── hooks/
│
├── app/
│ └── router.tsx
│
└── main.tsx

---

3. Tech Stack

React 18 — UI library
TypeScript — Type safety and scalability
React Router DOM — Routing
Material UI (MUI) — UI components and styling
Vite — Fast build tool and dev server
Axios — API communication
Mock Data

---

4. Getting Started

git clone <repository-url>
cd <project-folder>
npm install
npm run dev

---

5. Design Decisions

- 1. Feature-based architecture
     პროექტი დაყოფილია მოდულებად (leaderboard, raffle, wheel), რაც უზრუნველყოფს კოდის იზოლაციას და მარტივ მასშტაბირებას. თითოეული მოდული დამოუკიდებლად შეიძლება განვითარდეს.

- 2. Shared layer გამოყენება
     საერთო კომპონენტები და utilities მოთავსებულია shared ფოლდერში. ეს ამცირებს კოდის დუბლირებას და უზრუნველყოფს ერთგვაროვან UI/UX-ს მთელ აპლიკაციაში.

- 3. Mock Data
     მონაცემები არის ფაილშივე, თუმცა API-სთან დასაკავშირებელი კოდიც ფაილშივეა დაწერილი.
