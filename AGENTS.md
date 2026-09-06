# AGENTS.md - Development Guidelines

## Overview
This is a React 19 + Vite project with React Router. It's a designer profiles management app with CRUD operations, pagination, and user notifications. Uses JavaScript (JSX, not TypeScript).

---

## Commands

### Development
```bash
npm run dev          # Start Vite dev server
npm run build        # Production build to dist/
npm run preview      # Preview production build
```

### Linting
```bash
npm run lint         # Run ESLint on entire project
```

### Testing
Tests use the Node built-in runner (no framework dependency):
```bash
node --test tests/
```

---

## Project Structure
```
src/
├── components/       # Reusable UI components (PascalCase folders)
│   ├── ComponentName/
│   │   ├── ComponentName.jsx
│   │   └── ComponentName.css
│   ├── Context/      # React Context providers
│   ├── 404/          # Error page
│   └── ...
├── pages/            # Thin page wrappers for the router
├── App.jsx           # Main app with routing
├── main.jsx          # Entry point
└── index.css         # Global reset + design tokens (see DESIGN.md)
tests/                # node:test suites (CSS contracts + logic)
DESIGN.md             # Design system reference (OpenCode adaptation)
```

---

## Code Style Guidelines

### File Naming
- **Components**: PascalCase (e.g., `Home.jsx`, `CarrouselCards.jsx`)
- **Context**: PascalCase with descriptive name (e.g., `DesignersContext.jsx`)
- **CSS**: Match component name (e.g., `Home.css`)
- **Pages**: PascalCase (e.g., `Explore.jsx`)

### Component Structure
```jsx
import { Component } from "path"
import './Component.css'

export const ComponentName = () => {
    // hooks at top
    const [state, setState] = useState()
    
    // handlers
    const handler = () => {}
    
    return (
        <div className="component-wrapper">
            {/* JSX */}
        </div>
    )
}
```

### Imports
- **Order**: React imports → third-party → local components → CSS
- **Quotes**: Use double quotes (`"path"`) for consistency
- **Extensions**: Omit `.jsx` extensions in imports

```jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SomeComponent } from "../SomeComponent/SomeComponent"
import "./Component.css"
```

### Naming Conventions
- **Components**: PascalCase (`Home`, `Explore`, `DesignersApp`)
- **Variables/Functions**: camelCase (`formLogin`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE if truly constant
- **Refs**: Prefix with `form` for form refs (`formLogin`, `formRegister`)
- **State**: Prefix with meaningful names (`goodLogin`, `userExist`)

### React Patterns
- Use **functional components** with hooks
- Use **useRef** for form element references
- Use **useState** for component state
- Use **useEffect** for side effects (loading data, subscriptions)
- Use **Context** for global state (see `DesignersContext.jsx`)
- Destructure props: `const { children } = props`

### Async/Await & Error Handling
Always wrap async operations in try/catch:

```jsx
const fetchData = async () => {
    let controller = new AbortController()
    let options = {
        method: 'get',
        signal: controller.signal
    }
    
    try {
        let response = await fetch(`${API_URL}/endpoint`, options)
        let data = await response.json()
        setData(data)
    } catch (error) {
        console.error('Error fetching data:', error)
    } finally {
        controller.abort()
    }
}
```

### CSS
- Use separate `.css` files per component
- Use BEM-like naming: `.component-wrapper`, `.component-element--modifier`
- Keep CSS in same folder as component
- Use classes instead of inline styles

### Environment Variables
- Use `import.meta.env.VITE_*` for Vite environment variables
- Never commit secrets; use `.env` files (already gitignored)

### Error Handling & Notifications
- Use `console.error` for errors, `console.log` for debugging
- Show user-friendly error states in UI
- Use **SweetAlert2** for user notifications (already installed)
- Use timeout-based state resets for error messages

### SweetAlert2 Usage
```jsx
import Swal from "sweetalert2"

Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: 'Operation completed successfully.',
    background: '#000000',
    color: '#FFFFFF',
    confirmButtonColor: '#F98A45',
    confirmButtonText: 'OK'
})
```

---

## ESLint Rules
The project uses ESLint with these rules:

- React Hooks rules enforced
- React Refresh enabled for HMR

Run `npm run lint` before committing.

---

## Features

### Pagination
- CarrouselDesigners shows 4 items per page
- Uses `currentPage`, `itemsPerPage` (4), `nextPage()`, `prevPage()` from context

### User Notifications
- Inline auto-expiring notice banner (`notice` in context: kind ok/warn/error, 4s)
- No SweetAlert2 — the dependency was removed; do not reintroduce popup libraries
- Form reset after successful submission
- Add/Edit live in modals (`role="dialog"`); empty name/age/design/email are rejected before hitting the API

### Routes
- `/` - Login page (OpenCode-style split panel)
- `/register` - Register page (same visual system)
- `/home` - Home page (dark hero + category marquee)
- `/explore` - Explore page (profile grid + add/edit modals)
- `/not-found` - 404 error page

---

## Additional Notes
- This is a **JavaScript project** (not TypeScript)
- Uses React 19 with Vite 7
- Spanish comments exist in existing code (acceptable but English preferred for new code)
- Tests: node:test + postcss + esbuild (dev deps from Vite)
- Dependencies: react, react-dom, react-router-dom
- Design system: OpenCode-inspired, tokens in index.css, documented in DESIGN.md
