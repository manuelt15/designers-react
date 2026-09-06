# DESIGN.md — Designers App

**Inspiration: [OpenCode](https://opencode.ai)** (marketing site + TUI aesthetic).
Berkeley Mono is a paid font, so we substitute **JetBrains Mono** and keep the
rest of the language: warm cream canvas, near-black ink, hairline borders, ASCII
bracket markers, and one dark "terminal" surface per page.

---

## Principles

1. **One font, one identity.** Everything is monospace (`--fontMono`). No
   sans-serif, no display face, no italics.
2. **Flat on cream.** `--canvas` (#fdfcfc) is the only body background. No
   gray section bands, no gradients, no box shadows — separation comes from
   1px hairlines.
3. **One dark surface per page.** `--surfaceDark` (#201d1d) is reserved for a
   single hero/panel element (login panel, home hero). Never for body chrome.
4. **ASCII is the icon set.** `[+]`, `[-]`, `[x]`, `→` replace icons, bullets
   and toggles. No SVG icon libraries.
5. **Radius vocabulary is two values.** 4px (`--radius` implied) on every
   interactive element; 0 on containers. Avatar circles may use 9999px.
6. **Semantic ramp stays semantic.** `--accent` (blue), `--danger` (red),
   `--warning` (amber), `--success` (green) only mark states (links inside the
   dark panel, delete actions, availability), never large surfaces.

---

## Tokens (`src/index.css`)

| Token | Value | Use |
|---|---|---|
| `--fontMono` | JetBrains Mono → IBM Plex Mono → ui-monospace… | every text role |
| `--canvas` | `#fdfcfc` | body background, text on dark |
| `--ink` | `#201d1d` | brand color: headings, body, primary button fill |
| `--inkDeep` | `#0f0000` | pressed state of ink buttons |
| `--surfaceSoft` | `#f8f7f7` | input backgrounds, quiet fills |
| `--surfaceCard` | `#f1eeee` | disabled fills |
| `--surfaceDark` | `#201d1d` | the single dark panel per page |
| `--surfaceDarkElevated` | `#302c2c` | prompt rows inside the dark panel |
| `--hairline` | `rgba(15,0,0,0.12)` | 1px section/card borders |
| `--hairlineStrong` | `#646262` | outline button borders, checkbox borders |
| `--accent` | `#007aff` | command tokens inside the TUI panel |
| `--danger` | `#ff3b30` | delete, logout hover, error text |
| `--warning` | `#ff9f0a` | "busy" availability |
| `--success` | `#30d158` | "active" availability, success messages |
| `--mute` | `#646262` | metadata, inactive links, captions |
| `--ash` | `#9a9898` | disabled text, secondary text on dark |

Legacy tokens (`--colorBase*`, `--color1..3`, `--fontTitu`, …) remain defined
for un-migrated components only; new work must use the tokens above.

---

## Typography

| Role | Size | Weight | Line height | Use |
|---|---|---|---|---|
| Display | 38px (28px mobile) | 700 | 1.5 | page hero title |
| Title | 28px | 700 | 1.5 | auth form title |
| Section label | 16px | 700 | 1.5 | section headings, wordmark |
| Body | 16px | 400 | 1.5 | paragraphs, inputs, buttons |
| Emphasis | 16px | 500 | 2.0 | nav links, button labels |
| Caption | 14px | 400 | 2.0 | footer, metadata, hints |

Buttons keep the tall line-height (2.0) inside a 40px box — calm, spacious labels.

---

## Layout

- Content column: max **960px** (home) / **1200px** (explore), centered, `16px` side padding.
- Vertical rhythm: **96px** between sections (64px tablet, 48px mobile).
- No card shadows; sections are flat blocks separated by `1px solid var(--hairline)`.
- Header: sticky cream bar, 56px, hairline bottom — text wordmark left, links center, `[x]` logout right.
- Footer: hairline top, `[+]` marker rows, legal row separated by another hairline.

### Responsive breakpoints

| Width | Changes |
|---|---|
| ≤1100px | profile grid 4 → 2 columns |
| ≤850px | auth shell stacks (dark panel on top), home spacing 96 → 64px |
| ≤768px | header paddings tighten |
| ≤640px | single column everything, forms stack, full-width CTAs, marquee font 14px |

---

## Components

### Buttons
- **Primary** (`auth-submit`, `home-btn`, `pagination-btn`): ink fill, canvas text, 4px radius, `4px 20px` padding, 40px tall. Pressed: `--inkDeep` + `translateY(1px)`. Disabled: `--surfaceCard` fill with `--ash` text.
- **Secondary/ghost** (`pagination-btn.ghost`, `card-modify`): transparent fill, 1px `--hairlineStrong` border, ink text. Delete variant is danger-tinted.
- **Icon logout** (`cabecera-logout`): `[x]` text span with `role="button"` + keyboard handling; not a `<button>`. Hovers to `--danger`.

### Inputs (`box`, `auth-input`)
- Background `--surfaceSoft`, 1px `--hairline` border, 4px radius, 40px tall, `8px 12px` padding.
- **Focus:** background flips to `--canvas`, border becomes 1px `--ink`. No glow, no halo.
- Disabled: `--surfaceCard` background, `--ash` text.

### Modal (Explore add/edit)
- Overlay: `rgba(32, 29, 29, 0.6)` full-screen, centered card.
- Card: canvas background, 1px hairline border, 4px radius, 24px padding, header row with `[x]` close.
- `role="dialog"` + `aria-modal`; clicking the overlay closes.
- Forms inside: 2-column grid (1 on mobile), checkbox styled as ASCII `x`.

### Cards (`designers-card`)
- Canvas background, 1px hairline border, 4px radius, 16px padding.
- 64px circular avatar, data fields in caption size, actions pinned to the bottom.
- Availability: `[+] active` in `--success` / `[-] busy` in `--warning`.

### Marquee (`CarrouselCards`)
- Full-width strip between two hairlines; items `[+] Category` in mono.
- Track duplicates its content once (`aria-hidden` copy) and animates
  `translateX(0 → -50%)`, 40s linear infinite.
- Pauses on hover (only when `(hover: hover) and (pointer: fine)`).
- `prefers-reduced-motion: reduce` → no animation, manual horizontal scroll.

### Notifications (inline notice)
No popup library. Operations surface a mono banner under the section header:

- `.notice-ok` (green), `.notice-warn` (amber), `.notice-error` (red) — all on `--surfaceSoft`, 1px border in the semantic color, 4px radius.
- Auto-expires after 4s; enters with a 200ms fade+slide (disabled under reduced motion).
- Copy uses ASCII markers: `[+] profile added`, `[x] failed to update the profile`.

---

## Motion

- Transitions: 150ms, property-specific (`background-color`, `border-color`, `color`) — never `all`.
- Press feedback: `translateY(1px)` (or `scale(0.98)`), never animated layout properties.
- Hover effects are gated behind `@media(hover: hover) and (pointer: fine)`.
- Global `prefers-reduced-motion: reduce` in `index.css` kills animations, transitions and smooth scrolling.

---

## Accessibility

- Every input has `aria-label`; submit inputs use `value` (not placeholder).
- Modals: `role="dialog"`, `aria-modal="true"`, labelled, Escape/overlay close.
- Logout icon: `role="button"`, `tabIndex={0}`, Enter/Space handled.
- Focus-visible outline defined globally in `index.css`.
- Reduced-motion support at global and component level.

---

## Do

- Use the tokens; don't hardcode colors.
- Keep the one-dark-surface-per-page rule.
- Prefer text/ASCII over new icons or images.
- Keep new components in the mono + hairline vocabulary.

## Don't

- No box shadows, gradients, or photos.
- No sans-serif or display fonts.
- No semantic-ramp colors on large surfaces.
- No `border-radius` other than 4px / 9999px.
- No `transition: all`.

---

*Adapted from OpenCode's design language (opencode.ai). Berkeley Mono substituted
with JetBrains Mono; layout and color decisions re-derived for this app.*