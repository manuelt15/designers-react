# Designers App

A React 19 + Vite web application for managing designer profiles. Users can create, read, update, and delete designer profiles with a modern, responsive interface.

---

## Features

- **User Authentication**: Login and registration system
- **Designer Profiles**: Create, read, update, and delete designer profiles
- **Pagination**: Browse profiles with 4 items per page
- **User Notifications**: Beautiful notifications using SweetAlert2
- **Responsive Design**: Works on all device sizes
- **Navigation**: React Router for seamless page transitions

---

## Tech Stack

- [React 19](https://reactjs.org/) with Vite 7
- [React Router](https://reactrouter.com/) for navigation
- [SweetAlert2](https://sweetalert2.github.io/) for user notifications
- CSS with custom properties for theming

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the development server at `http://localhost:5173`

### Production Build

```bash
npm run build
```

Creates optimized build in `dist/` folder

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## Project Structure

```
src/
├── components/
│   ├── 404/              # Error page
│   ├── Cabecera/         # Navigation header
│   ├── CarrouselCards/   # Home page carousel
│   ├── CarrouselDesigners/ # Profiles grid with pagination
│   ├── Context/          # React Context (DesignersContext)
│   ├── DesignersApp/     # Login/Register page
│   ├── Explore/         # Main CRUD page
│   ├── Footer/          # Footer component
│   └── Home/            # Home page
├── pages/               # Page-level components
├── App.jsx              # Main app with routing
├── main.jsx             # Entry point
└── index.css            # Global styles & CSS variables
```

---

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | DesignersApp | Login/Register page |
| `/home` | Home | Home page with carousel |
| `/explore` | Explore | Profiles CRUD with pagination |
| `/not-found` | Error404 | 404 error page |

---

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_EXPRESS=http://localhost:your-port
```

---

## CSS Variables

The project uses CSS custom properties for theming:

```css
--colorBase: #000000;      /* Primary background */
--colorBase2: #61696B;     /* Secondary text */
--colorBase3: #FFFFFF;     /* Light text */
--color1: #FF3206;         /* Accent orange */
--color2: #FF5D00;         /* Secondary accent */
--color3: #F98A45;         /* Tertiary accent */
--fontBtn1: "Nunito";      /* Button font */
--fontText: "Roboto";       /* Body text font */
--fontTitu: "Bebas Neue";  /* Title font */
```

---

## License

MIT
