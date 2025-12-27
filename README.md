
# 🛡️ GearGuard: Maintenance Made Easy

**GearGuard** is a modern web application designed to simplify maintenance tracking and asset management. Built with performance and user experience in mind, it utilizes the latest React ecosystem tools to provide a seamless, type-safe experience.

## ✨ Key Features

* **Responsive UI:** Built with **Shadcn UI** and **Tailwind CSS** for a beautiful, accessible interface.
* **Data Visualization:** Interactive charts and analytics powered by **Recharts**.
* **Drag & Drop Workflows:** Kanban-style or sortable lists using **DnD Kit**.
* **Robust Data Fetching:** Optimized server state management with **TanStack Query**.
* **Secure Backend:** Authentication and database services managed by **Supabase**.
* **Form Management:** Complex forms handling with validation using **React Hook Form** and **Zod**.
* **Theming:** Native Dark/Light mode support via **next-themes**.

## 🛠️ Tech Stack

### Core

* **Framework:** React 18
* **Build Tool:** Vite (SWC)
* **Language:** TypeScript
* **Routing:** React Router DOM

### UI & Styling

* **Components:** Radix UI Primitives (via Shadcn UI)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Animations:** Tailwindcss-animate
* **Toasts:** Sonner

### State & Logic

* **Server State:** TanStack React Query
* **Date Handling:** date-fns
* **Form Validation:** Zod + Hookform Resolvers

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js (v18 or higher recommended)
* npm (or yarn/pnpm)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Priinc3/gearguard-maintenance-made-easy.git
cd gearguard-maintenance-made-easy

```


2. **Install dependencies:**
```bash
npm install

```


3. **Environment Setup:**
Create a `.env` file in the root directory. You will need your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

```


4. **Run the Development Server:**
```bash
npm run dev

```


The app should now be running at `http://localhost:8080` (or similar port).

## 📜 Scripts

* `npm run dev`: Starts the development server with hot module replacement.
* `npm run build`: Compiles the application for production using Vite.
* `npm run lint`: Runs ESLint to check code quality.
* `npm run preview`: Locally preview the production build.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
