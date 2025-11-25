# PRIMEAPPAREL Front‑End

A premium B2B wholesale apparel web application built with **React**, **Vite**, and **Tailwind CSS**. The site showcases a modern, visually rich UI for a garment manufacturer, featuring:

- Full‑width hero slider with dynamic background images.
- Responsive badge highlights (Verified Manufacturer, Global Shipping).
- Curated collections grid with hover effects.
- Detailed About page with background‑image sections and core values.
- Contact and inquiry modals powered by Redux Toolkit.

## Tech Stack

- **React 18** – component‑based UI.
- **Vite** – fast dev server & bundler.
- **Tailwind CSS** – utility‑first styling.
- **Lucide‑react** – icons.
- **Redux Toolkit** – state management for auth & leads.
- **Axios** – API calls.

## Getting Started

```bash
# Clone the repo (already done)
cd project-free/client

# Install dependencies
npm install

# Run the development server
npm run dev
```

The app will be available at `http://localhost:5174`.

## Project Structure (high‑level)

```
src/
├─ assets/          # static assets
├─ components/      # reusable UI components (Navbar, Footer, Modals…)
├─ constants/       # e.g. heroImages.js
├─ pages/           # page components (Home, About, Contact…)
├─ redux/           # slices & store
├─ layouts/         # layout wrappers
├─ App.jsx & main.jsx
└─ index.css        # global Tailwind imports & custom utilities
```

## Scripts

- `npm run dev` – start Vite dev server.
- `npm run build` – create production bundle.
- `npm run preview` – preview the production build.

## Deployment

Push to the `main` branch; CI/CD can be set up to deploy the `dist/` folder to any static hosting (Netlify, Vercel, GitHub Pages, etc.).

---

*Feel free to extend the UI, add more pages, or integrate the back‑end API located in the `server` folder.*
