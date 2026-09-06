# Designers

A React 19 + Vite app for browsing, creating, editing and deleting designer profile cards.

**Visual identity inspired by [OpenCode](https://opencode.ai)** — see [DESIGN.md](DESIGN.md) for the full design system we adapt.

---

## Features

- **Auth**: separate Login (`/`) and Register (`/register`) pages, session kept in `localStorage`
- **Profiles CRUD**: add, edit and delete designer cards via modals
- **Avatars**: pick a random identicon on create (checkbox) or fall back to a default image
- **Grid + pagination**: 4 cards per page, responsive 4 → 2 → 1 columns
- **Marquee**: infinite scrolling strip of design categories (pauses on hover, respects `prefers-reduced-motion`)
- **Inline notifications**: auto-expiring ASCII-styled notice banner — no popup library
- **Accessible**: named inputs, `role="dialog"` modals, keyboard-operable logout, visible focus, reduced-motion support

---

## Tech Stack

- [React 19](https://react.dev/) + [Vite 7](https://vite.dev/)
- [React Router 7](https://reactrouter.com/)
- Vanilla CSS with custom properties (no framework)
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) — open substitute for Berkeley Mono

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # production build to dist/
npm run preview    # serve the production build
npm run lint       # eslint
node --test tests/ # test suite (no framework needed, node:test)
```

### Environment

Create a `.env` in the root:

```env
VITE_EXPRESS=http://localhost:3000
```

Points at the Express backend that serves `/users`, `/register` and `/profiles`.

---

## Project Structure

```
src/
├── components/
│   ├── 404/                 # not-found page
│   ├── Cabecera/            # header: text wordmark, home/explore links, [x] logout icon
│   ├── CarrouselCards/      # category marquee (home)
│   ├── CarrouselDesigners/  # profile grid, pagination, add-card action
│   ├── Context/             # DesignerContext: auth, profiles CRUD, modal state
│   ├── DesignersApp/        # route wrapper for login
│   ├── Explore/             # profile grid page + add/edit modal
│   ├── Footer/              # ASCII-marker footer with social links
│   ├── Home/                # dark TUI-style hero + marquee section
│   ├── Login/               # login page (OpenCode-style split panel)
│   └── Register/            # register page (same visual system)
├── pages/                   # thin page wrappers for the router
├── App.jsx                  # routes
├── main.jsx                 # entry
└── index.css                # global reset + design tokens
tests/                        # node:test suites (CSS contracts + logic)
DESIGN.md                     # design system reference (OpenCode adaptation)
```

---

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Login | Sign in |
| `/register` | Register | Create an account |
| `/home` | Home | Hero + category marquee |
| `/explore` | Explore | Designer cards grid + CRUD modals |
| `/not-found` | Error404 | 404 page |

---

## Design System

The UI follows the design system documented in [DESIGN.md](DESIGN.md), adapted from
OpenCode's marketing site: Berkeley-Mono-style typography on warm cream, hairline
borders instead of shadows, ASCII bracket markers as icons, and a single dark
"TUI" surface per page.

Key tokens live in `src/index.css`:

```css
--fontMono      /* JetBrains Mono stack */
--canvas        /* #fdfcfc warm cream body */
--ink           /* #201d1d near-black brand color */
--surfaceDark   /* #201d1d single dark hero surface */
--hairline      /* 1px translucent borders */
--accent / --danger / --warning / --success  /* semantic ramp */
```

Rules of thumb: 4px radius on interactive elements, 0 on containers; no box
shadows; no photos — typography and ASCII glyphs carry the identity.

---

## Testing

Tests run with the Node built-in runner — no test framework dependency:

```bash
node --test tests/
```

Suites:

- `responsive.test.mjs` — CSS contracts (in-flow layouts, no artificial heights, form shrink rules)
- `motion.test.mjs` — explicit transitions, hover gating, reduced-motion, defined tokens
- `carrousel.test.mjs` — marquee duplication, animation, pause and reduced-motion
- `auth-pages.test.mjs` — separate login/register pages, no Google, style vocabulary
- `home-redesign.test.mjs` — header without logo, icon logout, hero composition
- `explore-redesign.test.mjs` — grid, modal, empty-field validation, style rules
- `profiles.test.mjs` / `profile-list.test.mjs` — context handlers, loading/error/empty states

---

## License

MIT