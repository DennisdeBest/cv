# CSS — A Practical Guide for Designers Teaching Developers

This guide covers the core principles of CSS: how it works, how to write it well, and how to handle real-world concerns
like different screen sizes, dark mode, and accessibility. It is written for designers who want to explain CSS to
developer students, starting from scratch.

---

## Table of Contents

1. [What is CSS?](#1-what-is-css)
2. [Divs, the Box Model and Inheritance](#2-divs-the-box-model-and-inheritance)
3. [Selectors and Specificity](#3-selectors-and-specificity)
4. [Pseudo-classes and Pseudo-elements](#4-pseudo-classes-and-pseudo-elements)
5. [Why You Should Avoid `!important`](#5-why-you-should-avoid-important)
6. [Responsive Design — Media Queries](#6-responsive-design--media-queries)
7. [Print Styles](#7-print-styles)
8. [Dark Mode and System Preferences](#8-dark-mode-and-system-preferences)
9. [Accessibility](#9-accessibility)
10. [A Note on Tailwind](#10-a-note-on-tailwind)

---

## 1. What is CSS?

CSS (Cascading Style Sheets) is the language that controls how HTML elements look on screen. HTML provides structure ("
this is a heading, this is a paragraph"), while CSS provides presentation ("this heading is blue, 24px, bold, centred").

A CSS rule has two parts: a **selector** (what to target) and a **declaration block** (what to do to it).

```css
p {
    color: #1f2933;
    font-size: 16px;
    line-height: 1.6;
}
```

CSS is called *cascading* because multiple rules can apply to the same element, and the browser resolves conflicts by
following a well-defined priority system — more on that in [section 3](#3-selectors-and-specificity).

---

## 2. Divs, the Box Model and Inheritance

### The `<div>` element

A `<div>` is a generic container. It has no meaning on its own — it is simply a box you can group things in and style.
Think of it as a blank canvas.

```html

<div class="card">
    <h2>Title</h2>
    <p>Some text here.</p>
</div>
```

Modern HTML also provides *semantic* alternatives that carry meaning: `<header>`, `<nav>`, `<main>`, `<section>`,
`<article>`, `<footer>`. Prefer these when there is a meaningful context, and use `<div>` only when you need a neutral
wrapper. This matters for [accessibility](#9-accessibility).

### The Box Model

Every element in a browser is a rectangular box. The box model describes how that box is sized:

```
┌──────────────────────────────┐
│           MARGIN             │  space outside the element
│  ┌────────────────────────┐  │
│  │        BORDER          │  │  the element's border
│  │  ┌──────────────────┐  │  │
│  │  │     PADDING      │  │  │  space inside the border
│  │  │  ┌────────────┐  │  │  │
│  │  │  │  CONTENT   │  │  │  │  the actual text / image
│  │  │  └────────────┘  │  │  │
│  │  └──────────────────┘  │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

```css
.card {
    width: 300px;
    padding: 16px; /* space inside */
    border: 1px solid #e5e7eb;
    margin: 24px; /* space outside */
}
```

**Important:** by default, `width` only applies to the content area. Padding and border are *added on top* of it. This
is confusing. Add this to the top of every stylesheet:

```css
*, *::before, *::after {
    box-sizing: border-box;
}
```

This makes `width` include padding and border — much more predictable.

### Inheritance

Many CSS properties *inherit* from parent to child. If you set `color` or `font-family` on `body`, all text inside the
page inherits it unless overridden.

```css
body {
    font-family: system-ui, sans-serif;
    color: #1f2933;
}

/* All paragraphs and headings inside body will use that font and colour */
```

Properties related to text (color, font-size, font-family, line-height) generally inherit. Layout properties (width,
margin, padding, border) do not.

This means you should define your base typography on `body` and only override it where needed — not repeat the same
`font-family` on every element.

### CSS Custom Properties (Variables)

CSS variables, defined with `--`, are a modern and extremely useful feature. Define them once, use them everywhere.
Changing the variable changes everything that references it.

```css
:root {
    --color-primary: #1f2933;
    --color-accent: #2563eb;
    --spacing-md: 16px;
}

h1 {
    color: var(--color-primary);
}

a {
    color: var(--color-accent);
}

.card {
    padding: var(--spacing-md);
}
```

`:root` is equivalent to the `html` element but with slightly higher specificity. Variables defined there are available
everywhere on the page. They also inherit, which means you can override them on a subtree:

```css
.dark-section {
    --color-primary: #e2e8f0; /* overrides just inside this section */
}
```

---

## 3. Selectors and Specificity

### Types of Selectors

| Selector   | Example         | What it targets                       |
|------------|-----------------|---------------------------------------|
| Element    | `p`             | All `<p>` elements                    |
| Class      | `.card`         | All elements with `class="card"`      |
| ID         | `#header`       | The single element with `id="header"` |
| Attribute  | `[type="text"]` | Elements with that attribute value    |
| Descendant | `.card p`       | `<p>` inside `.card`                  |
| Child      | `.card > p`     | Direct `<p>` children of `.card`      |
| Multiple   | `h1, h2, h3`    | Any of those elements                 |

### Specificity — How the Browser Decides

When two rules target the same element, the one with higher **specificity** wins. Specificity is calculated as a score
with three tiers:

| Tier | What counts                                            | Score example |
|------|--------------------------------------------------------|---------------|
| A    | Inline styles (`style="..."`)                          | 1-0-0         |
| B    | IDs (`#header`)                                        | 0-1-0         |
| C    | Classes (`.card`), attributes, pseudo-classes          | 0-0-1         |
| —    | Elements (`p`, `div`) and pseudo-elements (`::before`) | 0-0-0*        |

*Element selectors have the lowest specificity, just below the class tier.

Examples:

```css
p {
    color: gray;
}

/* specificity: 0-0-1 */
.card p {
    color: black;
}

/* specificity: 0-1-1 — wins */
#main .card p {
    color: navy;
}

/* specificity: 1-1-1 — wins over both */
```

When specificity is equal, the rule that appears **later in the file** wins. This is the "cascade".

### Prefer Classes over IDs

**Use classes for almost everything. Use IDs sparingly.**

Reasons:

- An ID can only appear once on a page, which limits reuse.
- IDs have a much higher specificity than classes, making them harder to override without escalating to `!important`.
- Classes compose naturally: `<div class="card featured">` applies both `.card` and `.featured`.

```css
/* Avoid */
#submit-button {
    background: blue;
}

/* Prefer */
.btn-primary {
    background: blue;
}
```

The class can be applied to any button on any page. The ID cannot.

### Naming Conventions

A widely used convention is **BEM (Block Element Modifier)**:

```
.block {}                  /* the component */
.block__element {}         /* a part of the component */
.block--modifier {}        /* a variation of the component */
```

Example:

```css
.card {
}

.card__title {
}

.card__body {
}

.card--featured {
}
```

This keeps selectors flat (no deep nesting), readable, and collision-free.

Reference: [BEM methodology](https://getbem.com/)

---

## 4. Pseudo-classes and Pseudo-elements

### Pseudo-classes

Pseudo-classes target an element based on its **state** or **position**, without adding a class in HTML.

```css
/* User interaction states */
a:hover {
    text-decoration: underline;
}

a:focus {
    outline: 2px solid #2563eb;
}

a:visited {
    color: purple;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Structural — position in the DOM */
li:first-child {
    font-weight: bold;
}

li:last-child {
    margin-bottom: 0;
}

li:nth-child(2) {
    background: #f0f0f0;
}

/* Form state */
input:valid {
    border-color: green;
}

input:invalid {
    border-color: red;
}
```

### Pseudo-elements

Pseudo-elements target a **part** of an element, or insert generated content before/after it. They use double colons
`::`.

```css
/* Generated content */
.label::before {
    content: "→ ";
    color: #2563eb;
}

.required::after {
    content: " *";
    color: red;
}

/* First letter / first line */
p::first-letter {
    font-size: 2em;
    float: left;
}

/* Text selection colour */
::selection {
    background: #bfdbfe;
    color: #1e3a8a;
}
```

Pseudo-elements are also used heavily for decorative tricks — underline effects, custom list markers, overlays — without
adding empty HTML elements.

---

## 5. Why You Should Avoid `!important`

`!important` overrides the normal specificity system entirely. Any declaration marked with it wins regardless of
selector weight.

```css
.card p {
    color: black !important; /* nothing can override this easily */
}
```

This seems convenient in the moment. It is almost always a mistake.

**Why it causes problems:**

1. **It breaks the cascade.** The cascade exists so styles compose predictably. `!important` punches a hole through it.
2. **It creates escalation.** Once one `!important` exists, the next developer adds another to override it. Then
   another. You end up with a stylesheet full of `!important` declarations that fight each other.
3. **It hides the real problem.** If you need `!important`, it usually means your selectors are poorly structured or
   overly specific. The fix is to refactor, not to override.
4. **It hurts maintainability.** It is very hard to understand what is going on in a stylesheet littered with
   `!important`.

**The only legitimate uses:**

- Overriding third-party library styles you cannot change (and even then, try specificity first).
- Utility classes deliberately designed to always win (e.g. `.hidden { display: none !important; }` where you truly
  never want it overridden).

**The better alternative:** keep specificity low and consistent. If something is not applying, use browser DevTools to
inspect which rule is winning, then fix the structure.

---

## 6. Responsive Design — Media Queries

A media query applies CSS only when a condition is true — typically the width of the viewport.

```css
/* Base styles — apply everywhere */
.card {
    padding: 16px;
}

/* Override for screens wider than 768px */
@media (min-width: 768px) {
    .card {
        padding: 32px;
    }
}
```

### Mobile-First vs Desktop-First

**Mobile-first** means you write base styles for small screens, then add `min-width` queries to enhance for larger
screens. This is the recommended approach:

- Mobile traffic is dominant on the web.
- It forces you to prioritise content over decoration.
- Browsers on slow connections download the base styles and stop there.

```css
/* Mobile: single column */
.grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}

/* Tablet and up */
@media (min-width: 640px) {
    .grid {
        grid-template-columns: 1fr 1fr;
    }
}

/* Desktop and up */
@media (min-width: 1024px) {
    .grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

**Desktop-first** uses `max-width` breakpoints and works the opposite way. It is common in older codebases and requires
more effort to maintain well.

### Common Breakpoints

There is no universal standard, but these are widely used:

| Name            | Width           |
|-----------------|-----------------|
| Small (mobile)  | < 640px         |
| Medium (tablet) | 640px – 1024px  |
| Large (desktop) | 1024px – 1280px |
| Extra large     | > 1280px        |

Do not treat these as rigid boundaries. Add breakpoints where *your content* breaks, not where a framework tells you to.

### Fluid Layouts

Instead of jumping between fixed widths, use fluid techniques that naturally adapt:

```css
/* Fluid font size: scales between 14px at 320px and 18px at 1200px */
font-size:

clamp
(
14
px,

2.5
vw,

18
px

)
;

/* Fluid grid that automatically fits as many columns as possible */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* Responsive image */
img {
    max-width: 100%;
    height: auto;
}
```

References:

- [MDN — Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)
- [MDN — Responsive Design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)

---

## 7. Print Styles

The `@media print` block applies only when the user prints the page or saves it as a PDF.

```css
@media print {
    /* Hide UI controls */
    .navbar,
    .sidebar,
    .btn {
        display: none !important;
    }

    /* Remove backgrounds and shadows to save ink */
    body {
        background: white;
        color: black;
    }

    /* Expand content to fill the page */
    .container {
        max-width: none;
        padding: 0;
    }

    /* Avoid page breaks inside cards */
    .card {
        break-inside: avoid;
    }

    /* Define paper size */
    @page {
        size: A4;
        margin: 15mm;
    }
}
```

### PDF Downloads

Today, most "print" usage is actually PDF export via the browser's built-in print dialog. This means the user might want
the PDF to reflect their chosen colour theme — dark mode PDFs are perfectly readable on screen.

A reasonable approach is to **not force a white background** in print styles, and instead let the current theme carry
through. If the user needs a light-theme PDF for printing on paper, they switch to the light theme first, then export.

---

## 8. Dark Mode and System Preferences

Operating systems expose a user preference for light or dark colour schemes. CSS can read this with the
`prefers-color-scheme` media query.

### The CSS way — media query

```css
:root {
    --bg: #ffffff;
    --text: #1f2933;
    --accent: #2563eb;
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg: #0f172a;
        --text: #e2e8f0;
        --accent: #60a5fa;
    }
}

body {
    background: var(--bg);
    color: var(--text);
}
```

This approach is automatic and requires no JavaScript. The browser applies the dark variables whenever the user's system
is in dark mode.

### The JavaScript way — `data-theme` attribute

If you want to give users manual control (a theme switcher button), combine CSS custom properties with a `data-theme`
attribute on the root element:

```css
/* Default: light theme */
:root {
    --bg: #ffffff;
    --text: #1f2933;
    --accent: #2563eb;
}

/* Dark theme — activated by setting data-theme="dark" on <html> */
[data-theme="dark"] {
    --bg: #0f172a;
    --text: #e2e8f0;
    --accent: #60a5fa;
}
```

```javascript
// Read saved preference, or fall back to system preference
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = saved ?? (prefersDark ? 'dark' : 'light');

document.documentElement.dataset.theme = theme;

// When the user switches manually
function setTheme(name) {
		document.documentElement.dataset.theme = name;
		localStorage.setItem('theme', name);
}
```

**Priority order:**

1. User's explicit manual choice (saved in `localStorage`)
2. OS-level system preference (`prefers-color-scheme`)
3. Hard-coded default (light)

### Avoiding the Flash of Wrong Theme

When using JavaScript to set the theme, there is a brief moment on page load where the default (usually light) theme is
painted before the script runs, causing a visible flash. To prevent this, place an *inline* script at the very top of
`<head>` — before any stylesheets:

```html

<head>
    <script>
        (function () {
            const saved = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.dataset.theme = saved ?? (prefersDark ? 'dark' : 'light');
        })();
    </script>
    <link rel="stylesheet" href="styles.css">
</head>
```

Because it runs before the CSS is parsed, the correct variables are already set when the first paint happens.

### Other User Preferences

The same principle applies to other system-level preferences:

```css
/* Reduce animations for users who prefer less motion */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}

/* Adapt for low-bandwidth or data-saving mode */
@media (prefers-reduced-data: reduce) {
    .hero-background {
        background-image: none;
    }
}

/* High contrast mode */
@media (forced-colors: active) {
    .btn {
        border: 2px solid ButtonText;
    }
}
```

References:

- [MDN — prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

---

## 9. Accessibility

Accessibility means making your web page usable by as many people as possible — including people who use screen readers,
keyboard navigation, or have visual impairments. CSS plays a significant role.

### Colour Contrast

Text must have sufficient contrast against its background. The WCAG (Web Content Accessibility Guidelines) defines
minimum ratios:

| Level          | Body text | Large text (18px+ or 14px+ bold) |
|----------------|-----------|----------------------------------|
| AA (minimum)   | 4.5:1     | 3:1                              |
| AAA (enhanced) | 7:1       | 4.5:1                            |

Tools to check contrast:

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser (desktop app)](https://www.tpgi.com/color-contrast-checker/)
- Browser DevTools (Chrome and Firefox both have contrast ratio in the colour picker)

Do not rely on colour alone to convey information. A person who is colour-blind may not distinguish red from green. Use
icons, labels, or patterns alongside colour.

### Focus Styles

Keyboard users navigate pages using Tab and Shift+Tab. The focused element must always be visually indicated. **Never
remove the focus outline without providing an equivalent replacement.**

```css
/* BAD — removes focus indicator for keyboard users */
:focus {
    outline: none;
}

/* GOOD — removes the default only for mouse/touch users */
:focus:not(:focus-visible) {
    outline: none;
}

/* Style the focus ring for keyboard navigation */
:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 3px;
    border-radius: 3px;
}
```

`:focus-visible` applies the outline only when the browser determines keyboard navigation is in use — so mouse users do
not see a ring on every click, but keyboard users always do.

### Semantic HTML and ARIA

CSS cannot fix bad HTML structure. Always use the right element for the job:

- `<button>` for buttons (not `<div>` or `<span>` with a click handler)
- `<a href>` for links
- `<h1>–<h6>` for headings in hierarchical order
- `<label>` paired with `<input>` for form fields
- `<nav>`, `<main>`, `<header>`, `<footer>` for landmark regions

When you must use a non-semantic element (e.g. a custom dropdown), supplement it with ARIA attributes:

```html

<button aria-expanded="false" aria-haspopup="listbox">Theme ▾</button>
<ul role="listbox" hidden>
    <li role="option" aria-selected="true">Light</li>
    <li role="option" aria-selected="false">Dark</li>
</ul>
```

### Touch Target Sizes

Buttons and links should be large enough to tap comfortably on mobile. WCAG 2.5.5 recommends a minimum of **44×44 pixels
** for interactive targets.

```css
.btn {
    min-height: 44px;
    min-width: 44px;
    padding: 10px 20px;
}
```

### Font Sizes

Avoid setting base font sizes in `px` on `html` or `body`. Users can set a preferred font size in their browser.
Overriding it with a fixed pixel value ignores that preference.

```css
/* Avoid */
html {
    font-size: 14px;
}

/* Better — 1rem = user's browser default (usually 16px) */
html {
    font-size: 100%;
}

/* Or let the browser default apply (just don't set it at all) */
```

Use `rem` units for most font sizes and spacing so the layout scales with the user's preference.

### Reduced Motion

Some users are sensitive to animations and can trigger vestibular disorders. Always respect `prefers-reduced-motion`:

```css
.animated {
    transition: transform 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
    .animated {
        transition: none;
    }
}
```

### Key References

- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/) — the official accessibility standard from the W3C
- [WebAIM](https://webaim.org/) — practical accessibility guidance
- [MDN — Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [The A11Y Project](https://www.a11yproject.com/) — community-driven accessibility checklist and patterns
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) — patterns for custom interactive components

---

## 10. A Note on Tailwind

[Tailwind CSS](https://tailwindcss.com/) is a utility-first CSS framework. Instead of writing CSS files, you compose
styles entirely from pre-defined utility classes in your HTML:

```html

<div class="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold text-gray-900">Hello</h2>
</div>
```

It is popular and widely used, particularly in JavaScript frameworks. But it comes with trade-offs worth understanding.

**What it does well:**

- Very fast to prototype — no context-switching between HTML and CSS files.
- Consistent design system by default (spacing scale, colour palette).
- No dead CSS — only the classes you use are included in the build.

**What it hides:**

- You are still writing CSS. Tailwind classes map 1:1 to CSS properties. If you do not understand what `flex`,
  `items-center`, or `shadow-md` actually generate, you are copying patterns without understanding them.
- HTML becomes very verbose. A single element can have 15–20 class names. Reading and reviewing someone else's markup
  becomes difficult.
- It is tightly coupled to its design system. Deviating from it (custom spacing, unusual layouts) can require fighting
  the framework.
- Responsive and state variants (`md:`, `hover:`, `dark:`) add even more class names, making templates harder to read.
- It discourages reuse. In theory you extract reusable components; in practice many projects end up with copy-pasted
  class strings.

**The bigger point:**

Tailwind is a tool. Like any tool, it is appropriate in some contexts and inappropriate in others. But it should never
be a replacement for understanding CSS. A developer who knows only Tailwind is not a CSS developer — they are someone
who knows a framework that abstracts CSS. When that framework is not available, or when they face a problem Tailwind
does not neatly solve, they will struggle.

**Learn CSS first. Then decide if Tailwind adds value for your project.**

---

## Further Reading

- [MDN Web Docs — CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) — the most complete and accurate CSS reference
- [W3C CSS Specifications](https://www.w3.org/Style/CSS/) — the official standards body
- [CSS Tricks](https://css-tricks.com/) — articles, guides and the indispensable Flexbox and Grid visual references
- [Every Layout](https://every-layout.dev/) — layout primitives built on CSS logic, not breakpoints
- [Smashing Magazine — CSS](https://www.smashingmagazine.com/category/css/) — in-depth articles for intermediate to
  advanced topics
