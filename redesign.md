# AllHealth X Tech — Complete Site Redesign

**Design system: Frost & Navy Editorial · v1.0**

This document unifies the **Hero editorial layout** (from the new Hero and About pages) with the **Pairing B — Frost & Navy** color system defined in `color-system.md`. Apply it to every page and every component.

---

## Design Name

**Frost & Navy Editorial**

| Layer | Source |
|---|---|
| Layout & visual language | Hero + About editorial style |
| Colors, typography, components | `color-system.md` (Pairing B) |
| Replaces | Eventor Design System (old `index.css`) |

---

## 1. Global Rules (Apply Everywhere)

| Rule | Value |
|---|---|
| Page background default | `#FAF3FF` Ice |
| Alternate sections | `#EDE8FF` Frost |
| Dark sections | `#000E7A` Navy gradient |
| Headlines font | DM Serif Display, weight 400 |
| Body / UI font | DM Sans, max weight 600 |
| Primary CTA | `#0023FD` pill, white text |
| Link / interactive text | `#0019C4` Deep Blue — never `#0023FD` as text |
| Icons (decorative) | `#6B7FE8` Bridge Blue — never as text |
| One accent per page | `#EB42FA` Magenta |
| Focus ring | `3px solid #EB42FA` |
| Card radius | `14px` |
| Button radius | `100px` (pill) |
| Remove entirely | Eventor blues, oklch greens, green/gold navbar, 5-layer blue gradients |

### Hard Rules (from color-system.md)

1. Magenta appears **once per screen** — badge, icon, or underline only
2. Never use `#0023FD` as text — use `#0019C4` instead
3. Never use `#6B7FE8` as text — icons and decorative elements only
4. Never place two Navy sections back-to-back
5. `#0023FD` is for buttons and fills only — not section backgrounds
6. DM Serif Display is for headlines only — never UI chrome
7. Text on Navy: `#FAF3FF` or `#EDE8FF` — never pure `#FFFFFF`
8. Disabled states: `#D6CFFF` bg + `#4B5BB0` text
9. Focus ring is always `3px solid #EB42FA`
10. Cards: `#FFFEF9` on Ice pages, `#FFFFFF` on Frost pages

---

## 2. Color Mapping (Current → Target)

### Hero dark gradient (replace oklch)

```css
/* Current hero base */
bg-[oklch(18%_0.035_176)]

/* Target — Navy gradient */
background: linear-gradient(
  115deg,
  #00084A 0%,      /* Abyss */
  #000E7A 48%,     /* Navy */
  #0019C4 100%     /* Deep Blue */
);
```

### Light surfaces

| Current | Target | Token |
|---|---|---|
| `oklch(94% 0.02 100)` | `#FAF3FF` | Ice |
| `oklch(96% 0.014 110)` | `#EDE8FF` | Frost |
| `oklch(97% 0.012 100)` cards | `#FFFEF9` | Warm White |

### Text

| Role | Current (oklch) | Target | Token |
|---|---|---|---|
| Hero headline | `oklch(97% 0.01 150)` | `#FAF3FF` | text-on-dark |
| Hero body | `oklch(88% 0.026 160)` | `#EDE8FF` | on-dark secondary |
| Section H2 (light) | `oklch(21% 0.042 170)` | `#00084A` | text-primary |
| Section body | `oklch(35% 0.035 170)` | `#1A2A8A` | text-secondary |
| Eyebrow / label | `oklch(42% 0.07 150)` | `#4B5BB0` | text-muted |

### Accent / CTA (replace yellow-green)

| Current | Target | Use |
|---|---|---|
| `oklch(78% 0.125 93)` CTA fill | `#0023FD` | Primary button |
| CTA text on yellow | `#FFFFFF` | Primary button text |
| Ghost border on dark | `rgba(250,243,255,0.35)` | Ghost on Navy |
| Icon accent yellow | `#6B7FE8` | Bridge Blue — icons only |
| One accent moment | `#EB42FA` | Magenta — once per page |

### Navbar (replace green/gold)

| Current | Target |
|---|---|
| Logo `#173D33` + gold icon | Logo `#000E7A`, icon `#FAF3FF` |
| Active nav `#2F6B57` | Active `#0019C4` (Deep Blue) |
| Register `#E9C46A` | Register `#0023FD` pill, white text |
| Scrolled bg oklch cream | `#FAF3FF` at 92% + `#D6CFFF` border |

### Footer

| Current (Eventor) | Target |
|---|---|
| White bg + slate text | `#000E7A` Navy bg |
| Blue links | `#FAF3FF` / `#EDE8FF` text, hover `#6B7FE8` icons |

---

## 3. Typography

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Page hero H1 | DM Serif Display | `clamp(3rem, 8vw, 7.7rem)` | 400 | context-based |
| Section H2 | DM Serif Display | `clamp(2.3rem, 5vw, 5rem)` | 400 | `#00084A` or `#FAF3FF` on Navy |
| Eyebrow | DM Sans | 11px | 600 | `#4B5BB0`, uppercase, `0.12em` tracking |
| Body | DM Sans | 16–18px | 400 | `#1A2A8A` |
| H4 / feature label | DM Sans | 15px | 600 | `#0019C4` |
| Caption | DM Sans | 11–12px | 400 | `#4B5BB0` |

### Font migration

| Current | Target |
|---|---|
| Sora (`--font-primary`) | DM Serif Display — headlines only |
| Manrope (`--font-secondary`) | DM Sans — body, UI, nav, buttons |
| `font-black` (900) on H1/H2 | 400 display / 600 max for labels |

---

## 4. Reusable Layout Patterns

### Pattern A — Page Hero (dark, full-width)

Used on: Home, About, Agenda, Speakers, Contact, Registration, Policies.

```
┌─────────────────────────────────────────────────────────┐
│  [Navy gradient + 72px grid overlay @ 8% opacity]       │
│                                                         │
│  [Eyebrow pill]                                         │
│  [Display H1 — DM Serif]                                │
│  [Subtitle — DM Sans, secondary]                        │
│  [Primary pill CTA]  [Ghost pill CTA]                   │
│  [Optional: meta row — 3 cols, icon + label, border-t]  │
│  [Optional right col: image + floating Warm White card] │
└─────────────────────────────────────────────────────────┘
```

- Section: `relative min-h-[70vh] overflow-hidden` (96vh on home only)
- Grid overlay: 72×72px, Mist-tinted lines at ~8% opacity
- Content: `max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 pt-28 pb-16`
- Motion: shared `fadeUp(delay)` from hero

### Pattern B — Light content section (Ice)

Eyebrow → H2 → body copy → card/stat grid with Mist borders.

Background: `#FAF3FF` · Cards: `#FFFEF9`, `1px solid #D6CFFF`, `14px` radius

### Pattern C — Dark anchor section (Navy)

Background: `#000E7A` · Text: `#FAF3FF` primary, `#EDE8FF` secondary · CTAs: Core Blue + ghost-on-dark

### Pattern D — Alternate section (Frost)

Background: `#EDE8FF` · Cards: `#FFFFFF`

### Pattern E — Conversion strip (Core Blue)

One per page max. Background: `#0023FD` · Text: `#FAF3FF`

---

## 5. CSS Custom Properties

Replace Eventor vars in `frontend/src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');

:root {
  /* Surfaces */
  --color-warm-white:     #FFFEF9;
  --color-ice:            #FAF3FF;
  --color-frost:          #EDE8FF;
  --color-mist:           #D6CFFF;

  /* Blue scale */
  --color-bridge:         #6B7FE8;
  --color-blue-core:      #0023FD;
  --color-blue-deep:      #0019C4;
  --color-navy:           #000E7A;
  --color-abyss:          #00084A;

  /* Accent */
  --color-magenta:        #EB42FA;
  --color-magenta-tint:   rgba(235, 66, 250, 0.10);
  --color-violet:         #CD44DF;

  /* Text */
  --text-primary:         #00084A;
  --text-secondary:       #1A2A8A;
  --text-muted:           #4B5BB0;
  --text-on-dark:         #FAF3FF;

  /* Semantic */
  --color-error:          #C8002A;
  --color-success:        #0A7B5C;
  --color-disabled-bg:    #D6CFFF;
  --color-disabled-text:  #4B5BB0;
  --color-focus-ring:     #EB42FA;

  /* Typography */
  --font-display:         'DM Serif Display', Georgia, serif;
  --font-body:            'DM Sans', system-ui, sans-serif;
  --font-primary:         var(--font-display);   /* legacy alias */
  --font-secondary:       var(--font-body);      /* legacy alias */

  /* Radius */
  --radius-pill:          100px;
  --radius-card:          14px;
}
```

Body default:

```css
body {
  background: var(--color-ice);
  color: var(--text-primary);
  font-family: var(--font-body);
}
```

Focus ring:

```css
*:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```

---

## 6. Component Tokens

### Buttons

| Variant | Background | Text | Border | Context |
|---|---|---|---|---|
| Primary | `#0023FD` | `#FFFFFF` | none | Light sections |
| Ghost | transparent | `#0019C4` | 1.5px `#0023FD` | Light sections |
| Ghost-on-dark | transparent | `#FAF3FF` | 1.5px rgba Frost | Navy sections |
| Navy | `#000E7A` | `#FAF3FF` | none | Inside Core Blue strip |
| Accent | `#EB42FA` | `#FFFFFF` | none | Once per page only |
| Disabled | `#D6CFFF` | `#4B5BB0` | none | Any disabled state |

Shape: pill (`100px`), padding `10px 20px`, DM Sans 13px/500 · Hover: `-translate-y-0.5`

### Cards

```css
background: #FFFEF9;        /* Ice pages — use #FFFFFF on Frost */
border: 1px solid #D6CFFF;
border-radius: 14px;
padding: 1.25rem 1.5rem;
box-shadow: 0 18px 50px rgba(0, 14, 122, 0.08);
```

### Badges

| Variant | Background | Text |
|---|---|---|
| Default | `#EDE8FF` | `#000E7A` |
| Mist | `#D6CFFF` | `#00084A` |
| Accent | `rgba(235,66,250,0.10)` | `#5B1F61` |
| Navy | `#000E7A` | `#D6CFFF` |
| Success | light teal tint | `#0A7B5C` |
| Error | light red tint | `#C8002A` |

Shape: `border-radius: 100px`, padding `3px 10px`, font-size 11px

### Inputs

| State | Border | Background |
|---|---|---|
| Default | `1.5px solid #D6CFFF` | `#FFFEF9` |
| Focus | `1.5px solid #0023FD` | `#FFFEF9` |
| Error | `1.5px solid #C8002A` | `#FFFEF9` |
| Disabled | `1.5px solid #D6CFFF` | `#EDE8FF` |

### Grid overlay (dark heroes)

```css
background-image:
  linear-gradient(rgba(214, 207, 255, 0.38) 1px, transparent 1px),
  linear-gradient(90deg, rgba(214, 207, 255, 0.28) 1px, transparent 1px);
background-size: 72px 72px;
opacity: 0.08;
```

---

## 7. New Shared Components to Create

Extract repeated patterns from Hero + About:

| Component | Purpose |
|---|---|
| `PageHero.jsx` | Navy gradient hero: eyebrow, H1, subtitle, CTAs, meta, optional image |
| `SectionShell.jsx` | Eyebrow + H2 + subtitle wrapper |
| `Eyebrow.jsx` | Pill badge (light/dark variants) |
| `MetaRow.jsx` | Icon + label grid from hero |
| `DarkSection.jsx` | Navy section wrapper |
| `CTABand.jsx` | Core Blue conversion strip |
| `GridOverlay.jsx` | 72px grid for dark heroes |

---

## 8. Foundation Files

### `frontend/src/index.css`

- Replace Eventor `:root` vars with Frost & Navy tokens (§5)
- Import DM Serif Display + DM Sans
- Update body, focus ring, typography hierarchy
- Replace `.btn-eventor`, `.card-eventor`, `.nav-eventor` with Frost & Navy equivalents
- Remove old gradient utilities (`bg-gradient-eventor-*`)

### `frontend/src/App.jsx` / `main.jsx`

No visual changes; ensure Layout wraps all routes.

---

## 9. Layout Components

### `components/layout/Layout.jsx`

Add `bg-[var(--color-ice)]` on root if needed.

### `components/layout/Navbar.jsx`

| Element | Current | Target |
|---|---|---|
| Logo bg | `#173D33` green | `#000E7A` Navy |
| Logo icon | Gold `#E9C46A` | `#FAF3FF` |
| Brand text | `#1F2937` | `#00084A` Abyss |
| Subtitle "July 2026" | `#2F6B57` green | `#4B5BB0` muted |
| Nav links | Green hover/active | `#0019C4` active, `#1A2A8A` default |
| Active underline | Green | `#0023FD` |
| Register button | Gold `#E9C46A` | `#0023FD` pill, white text |
| Scrolled bg | oklch cream | `#FAF3FF` 92% + `#D6CFFF` border |
| Mobile menu | Green tints | Frost tints |

On home hero (transparent nav): Frost text, ghost register button.

### `components/layout/Footer.jsx`

| Element | Current | Target |
|---|---|---|
| Background | White Eventor | `#000E7A` Navy |
| Text | Slate/Eventor vars | `#FAF3FF` primary, `#EDE8FF` secondary |
| Logo | Blue gradient | Navy square + Frost icon |
| Links hover | `#3B82F6` | `#EDE8FF` text, `#6B7FE8` icons |
| Social buttons | Gray boxes | `#0019C4` bg, hover `#0023FD` |
| Border | Eventor gray | `#0019C4` subtle |

---

## 10. UI Primitives

### `components/ui/Button.jsx`

| Variant | Target |
|---|---|
| primary | bg `#0023FD`, text white, pill, hover lift |
| secondary / ghost | border `#0023FD`, text `#0019C4` |
| ghost-on-dark | border Frost 35%, text `#FAF3FF` |
| navy | bg `#000E7A`, text `#FAF3FF` |
| danger | bg `#C8002A` |
| disabled | bg `#D6CFFF`, text `#4B5BB0` |
| focus | Magenta ring |
| shape | `rounded-full` (pill) |
| font | DM Sans 13px/500 |

Remove: `#3B82F6` gradients, Eventor focus rings.

### `components/ui/Input.jsx`

| State | Target |
|---|---|
| bg | `#FFFEF9` Warm White |
| border | `1.5px solid #D6CFFF` |
| text | `#00084A` |
| label | `#1A2A8A` |
| placeholder | `#4B5BB0` |
| focus border | `#0023FD` |
| focus ring | Magenta |
| error | `#C8002A` |

Remove: dark Eventor input backgrounds.

### `components/ui/Card.jsx`

| Current | Target |
|---|---|
| Dark navy `#1A1F2E` | `#FFFEF9` on Ice, `#FFFFFF` on Frost |
| Blue hover glow | Mist border + subtle Navy shadow |
| `rounded-2xl` | `rounded-[14px]` |
| Border | `1px solid #D6CFFF` |

### `components/ui/Badge.jsx`

Map all variants to §6 Badges table. Remove emerald/amber generic Tailwind and blue gradients.

### `components/ui/LoadingSpinner.jsx`

- Default: `border-t-[#0023FD]`
- Light mode: `border-t-[#FAF3FF]`

### `components/ui/ErrorMessage.jsx`

- bg: light error tint · text/border: `#C8002A` · radius: `14px`

### `components/ui/AnimatedSection.jsx`

Keep animations; no color changes.

---

## 11. Home Page Components

### `pages/HomePage.jsx`

Keep section order; wrap in AnimatedSection as now.

### `components/home/HeroSection.jsx` ← reference design

| Element | Change |
|---|---|
| Dark gradient | Navy: `#00084A → #000E7A → #0019C4` |
| Grid overlay | Mist-tinted lines |
| Eyebrow pill | Frost border, `#EDE8FF` text |
| H1 | DM Serif 400, `#FAF3FF` |
| Subtitle | `#EDE8FF` |
| Primary CTA | `#0023FD` pill (replace yellow) |
| Ghost CTA | Frost border, `#FAF3FF` text |
| Meta icons | `#6B7FE8` Bridge Blue |
| Floating card | `#FFFEF9` bg, `#00084A` text |
| Image border | `#D6CFFF` |
| **Magenta moment** | Eyebrow underline OR one meta icon |

### `components/home/StatsCounter.jsx`

| Element | Target |
|---|---|
| Section bg | Ice `#FAF3FF` |
| Eyebrow | `#4B5BB0` |
| H2 | DM Serif, `#00084A` |
| Body | `#1A2A8A` |
| Stat grid | Warm White cards, Mist borders |
| Hover | Frost `#EDE8FF` fill |
| Stat numbers | `#000E7A` Navy |

### `components/home/FeaturedSpeakers.jsx`

| Element | Target |
|---|---|
| Section bg | Navy `#000E7A` |
| Eyebrow | Bridge Blue `#6B7FE8` |
| H2 | `#FAF3FF` |
| Audience grid cells | `#0019C4` tint bg, hover lighter |
| Number accent | Bridge Blue |
| CTAs | Core Blue primary + ghost-on-dark |

### `components/home/AgendaPreview.jsx`

| Element | Target |
|---|---|
| Section bg | Frost `#EDE8FF` |
| Difference cards | White bg, Mist border, 14px radius |
| Dark themes block | Navy bg — recolor only |
| Theme numbers | Bridge Blue |
| "View agenda" link | `#EDE8FF` text, Bridge Blue icon |

### `components/home/SponsorsSection.jsx`

| Element | Target |
|---|---|
| Top section bg | Ice |
| Partner slot cards | Warm White, Mist border |
| Final CTA block | Navy bg |
| CTAs | Core Blue + ghost-on-dark |

### `components/home/HighlightsSection.jsx` *(unused on HomePage)*

| Current | Target |
|---|---|
| Old blue gradient + slate dark cards | Frost section + Warm White track cards OR retire if unused |
| Dark glass cards | Warm White cards with Bridge Blue icons |
| Blue gradient tags | Frost badge default variant |

---

## 12. Inner Pages

### `pages/AboutPage.jsx`

| Section | Target |
|---|---|
| **Add PageHero** | Navy gradient hero (like home, no image required) |
| Principles grid | Ice bg, 3 Warm White cards, Mist borders |
| CTA block | Navy — recolor oklch → tokens |
| CTAs | Core Blue pill + ghost-on-dark |
| Remove | Standalone light hero — merge into PageHero |

### `pages/AgendaPage.jsx`

| Section | Target |
|---|---|
| **Remove** | All 5 gradient layers |
| **Add** | PageHero: eyebrow "Programme", H1, subtitle |
| Page bg | Ice |
| Track filter pills | Active: `#0023FD` pill; inactive: Warm White + Mist border |
| Day dividers | `#D6CFFF` lines, `#4B5BB0` date label |
| AgendaItem cards | Warm White, 14px radius, Mist border |
| Time column | `#0019C4` Deep Blue |
| TrackBadge | Map to Badge component variants |
| Empty state | `#4B5BB0` muted text |
| **Optional** | Core Blue CTA strip at bottom |

### `pages/SpeakersPage.jsx`

| Section | Target |
|---|---|
| **Remove** | All 5 gradient layers |
| **Add** | PageHero: "Our Speakers" |
| Page bg | Ice |
| SpeakerCard | Warm White, Mist border, 14px radius |
| Featured badge | Accent badge (magenta tint) — **page magenta moment** |
| Initials fallback | `#6B7FE8` Bridge on Frost bg |
| SpeakerModal overlay | `#00084A` 90% |
| Modal card | Warm White, DM Serif name |
| Social links | Ghost pills, Deep Blue text |

### `pages/ContactPage.jsx`

| Section | Target |
|---|---|
| **Remove** | All 5 gradient layers |
| **Add** | Compact PageHero (shorter min-height) |
| Page bg | Ice |
| Info panel card | Warm White, Bridge Blue icon boxes |
| Highlight box | Frost bg, Deep Blue heading |
| Form card | Warm White, uses updated Input/Button |
| Success banner | `#0A7B5C` Success Teal |
| Error banner | `#C8002A` |
| Textarea | Match Input tokens |

### `pages/RegistrationPage.jsx`

| Section | Target |
|---|---|
| **Remove** | All 5 gradient layers |
| Page bg | Frost `#EDE8FF` (form-focused) |
| Form container | Centered Warm White card, 14px radius |
| Heading | DM Serif inside card |
| Uses | Updated Input, Button, ErrorMessage |

### `pages/PoliciesPage.jsx`

| Section | Target |
|---|---|
| **Remove** | All 5 gradient layers |
| **Add** | PageHero: eyebrow "Legal", H1 "Policies" |
| Page bg | Ice |
| Anchor nav pills | Warm White, active `#0023FD` |
| Policy sections | Prose: `#1A2A8A` body, `#00084A` H2 |
| Updated date | `#4B5BB0` caption |

---

## 13. Registration Flow

### `components/registration/SimpleRegistrationForm.jsx`

- Use Frost & Navy Input, Button, ErrorMessage
- Form card: Warm White on Frost page
- Section labels: DM Sans 600, `#0019C4`
- Price/summary box: Frost bg, Mist border
- Payment button: Core Blue primary
- Validation errors: `#C8002A`

### `components/registration/SuccessStep.jsx`

| Current | Target |
|---|---|
| Generic gray/green/brand classes | Full Frost & Navy |
| Success icon circle | Success Teal `#0A7B5C` tint |
| H2 | DM Serif, `#00084A` |
| Ticket card | Warm White, Mist border, Bridge Blue label |
| Event details cards | Warm White, Bridge Blue icons |
| Links | `#0019C4` |
| Buttons | Core Blue primary + Ghost secondary |
| Fix placeholder event data | Bangalore July 2026 (match site copy) |

### `components/registration/AttendeeDetailsStep.jsx`

Same tokens as SimpleRegistrationForm if still used.

---

## 14. Other Components

### `components/ErrorBoundary.jsx`

| Element | Target |
|---|---|
| Page bg | Ice |
| H1 | DM Serif, `#00084A` |
| Body | `#1A2A8A` |
| Error pre | `#C8002A` on light error tint |
| Reload button | Core Blue pill |

### `components/icons/index.jsx`

Icons inherit `currentColor` — no changes unless hardcoded fills exist.

---

## 15. Page-by-Page Section Rhythm

### Home

```
Navy Hero → Ice Stats → Navy FeaturedSpeakers → Frost AgendaPreview → Ice Sponsors → Navy Footer
Magenta: Hero eyebrow
```

### About

```
Navy PageHero → Ice Principles → Navy CTA block → Navy Footer
Magenta: Hero badge
```

### Agenda

```
Navy PageHero → Ice content + filters → Core Blue CTA strip → Navy Footer
Magenta: Featured track badge
```

### Speakers

```
Navy PageHero → Ice speaker grid → Navy Footer
Magenta: Featured speaker badge
```

### Contact

```
Navy PageHero (compact) → Ice form layout → Navy Footer
Magenta: One form label accent OR send icon
```

### Registration

```
Frost page → Warm White form card → Navy Footer
Magenta: Success check OR ticket ID highlight
```

### Policies

```
Navy PageHero → Ice prose → Navy Footer
Magenta: Active anchor pill underline
```

---

## 16. What Gets Deleted

Remove from Agenda, Speakers, Contact, Registration, and Policies pages:

```jsx
// DELETE — all 5 background layers:
<div className="fixed inset-0" style={{ background: 'linear-gradient(135deg, #ffffff...' }} />
// + radial orbs, blue bloom, grain
```

Replace with:
- `PageHero` (Navy) at top
- `bg-[var(--color-ice)]` or `bg-[var(--color-frost)]` on page body

Also remove all hardcoded:
- `#3B82F6`, `#2563EB`, `#0EA5E9`
- `#2F6B57`, `#E9C46A`, `#173D33`
- `oklch(...)` color values

---

## 17. Implementation Checklist

### Phase 1 — Foundation
- [x] `frontend/src/index.css`
- [x] `components/ui/Button.jsx`
- [x] `components/ui/Input.jsx`
- [x] `components/ui/Card.jsx`
- [x] `components/ui/Badge.jsx`
- [x] `components/ui/LoadingSpinner.jsx`
- [x] `components/ui/ErrorMessage.jsx`

### Phase 2 — New shared + layout
- [x] Create `PageHero.jsx`, `SectionShell.jsx`, `Eyebrow.jsx`, `GridOverlay.jsx`
- [x] Create `MetaRow.jsx`, `DarkSection.jsx`, `CTABand.jsx`
- [x] `components/layout/Navbar.jsx`
- [x] `components/layout/Footer.jsx`
- [x] `components/layout/Layout.jsx`

### Phase 3 — Home
- [x] `components/home/HeroSection.jsx`
- [x] `components/home/StatsCounter.jsx`
- [x] `components/home/FeaturedSpeakers.jsx`
- [x] `components/home/AgendaPreview.jsx`
- [x] `components/home/SponsorsSection.jsx`
- [x] `components/home/HighlightsSection.jsx`
- [x] `pages/HomePage.jsx`

### Phase 4 — Inner pages
- [x] `pages/AboutPage.jsx`
- [x] `pages/AgendaPage.jsx`
- [x] `pages/SpeakersPage.jsx`
- [x] `pages/ContactPage.jsx`
- [x] `pages/RegistrationPage.jsx`
- [x] `pages/PoliciesPage.jsx`

### Phase 5 — Registration + misc
- [x] `components/registration/SimpleRegistrationForm.jsx`
- [x] `components/registration/SuccessStep.jsx`
- [x] `components/registration/AttendeeDetailsStep.jsx`
- [x] `components/ErrorBoundary.jsx`

### Phase 6 — QA
- [x] No legacy colors left (`#3B82F6`, oklch, green/gold)
- [x] No two Navy sections back-to-back
- [x] One Magenta accent per page
- [x] WCAG: no `#0023FD` or `#6B7FE8` as body/link text
- [x] Focus ring Magenta on all interactives (global `index.css` + component focus-visible)
- [x] Production build passes (`npm run build`)

---

## 18. File Inventory

| Layer | Files | Count |
|---|---|---|
| Tokens | `index.css` | 1 |
| UI primitives | Button, Input, Card, Badge, LoadingSpinner, ErrorMessage, AnimatedSection | 7 |
| Layout | Navbar, Footer, Layout | 3 |
| Home sections | HeroSection, StatsCounter, FeaturedSpeakers, AgendaPreview, SponsorsSection, HighlightsSection | 6 |
| Pages | Home, About, Agenda, Speakers, Contact, Registration, Policies | 7 |
| Registration | SimpleRegistrationForm, SuccessStep, AttendeeDetailsStep | 3 |
| Misc | ErrorBoundary, icons | 2 |
| **New to create** | PageHero, SectionShell, Eyebrow, MetaRow, DarkSection, CTABand, GridOverlay | 7 |

**Total existing files to update: ~29 · New components: 7**

---

## 19. Before / After Summary

| Area | Before | After |
|---|---|---|
| Color model | 3 systems (Eventor, green/gold nav, oklch hero) | Single Frost & Navy palette |
| Fonts | Sora + Manrope, weight 900 | DM Serif Display + DM Sans, max 600 |
| Page structure | Hero-only editorial; inner pages use old gradients | Every page opens with PageHero |
| Buttons | Mixed rounded-md, yellow/gold, blue gradient | Unified pills, Core Blue primary |
| Section flow | Inconsistent light/dark | Ice → Frost → Navy rhythm |
| Footer | White Eventor | Navy structural anchor |
| Accessibility | Mixed contrast | WCAG AA via Deep Blue links + Magenta focus |

---

*Frost & Navy Editorial · AllHealth X Tech · v1.0*  
*Color source: `color-system.md` · Layout source: Hero + About editorial style*
