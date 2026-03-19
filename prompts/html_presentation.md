# AI-Native HTML Presentation Generator Prompt

## Context
This is a **DBA (Gen AI) group assignment**.

## Context
You are given a **fully structured VC-grade pitch deck** in Markdown:



You are provided with:
- Assignment brief: `@assignment.md`
- Product note: `@docs/md/product_note.md`
- Submission draft: `@docs/md/submission.md`
- Industry research & supporting data: `@docs/md/research.md`
- Finalized contnet pack and slide details: `@docs/md/hogh_vc_elevator_pitch_content_pack.md`

- PLatform demo html to learn the styles and UX : `@index.html`

Your task is to convert this into a **stunning, interactive HTML presentation** using **HTML, CSS, and JavaScript**.

---

## Role
You are a **senior frontend engineer + product designer + storytelling expert**.

You specialize in:
- Immersive storytelling interfaces
- High-end presentation UX (Apple / Stripe / Linear style)
- Smooth animations and transitions
- Clean, futuristic AI-native design systems

---

## Objective
Build a **fully functional, visually striking presentation app** that:
- Feels like a **modern product demo**, not PowerPoint
- Uses **fluid animations and transitions**
- Enhances storytelling through **interaction and motion**
- Supports both **presenter mode** and **self-paced viewing**

---

## Technical Requirements

### Core Stack
- Pure **HTML + CSS + JavaScript** (no heavy frameworks)
- Optional lightweight libraries allowed (e.g., GSAP, Three.js, Lenis, etc.)


- We have a live demo, so this slide shuold introduce the demo and havge a button to clik to see the live demo
- live demo is on this link https://noaman.github.io/hire_get_hired/app/index.html


---

## Presentation Features

### 1. Slide System
- 10 slides mapped exactly from the Markdown deck
- Each slide = full-screen section
- Smooth transitions:
  - Fade + slide + subtle zoom
- Navigation:
  - Keyboard (← → or space)
  - Scroll-based (optional)
  - Click navigation dots or side panel

---

### 2. Layout & UX
- Fullscreen responsive layout
- Clean grid-based design
- Strong typography hierarchy:
  - Title (hero)
  - Subtext
  - Supporting bullets

---

### 3. Animations (CRITICAL)
- Entrance animations per slide:
  - Staggered text reveals
  - Fade + translate
- Micro-interactions:
  - Hover effects on key elements
  - Subtle motion on visuals
- Transition effects:
  - Crossfade / parallax between slides
- Optional:
  - Particle or gradient motion background

---

### 4. Visual Design System

- Ensure the sluides are not monotonous and each has a meaningful layout that justifes to the message and content being presnetd

#### Style Theme
base on the HTML demo oif the platform

---

---

### 8. Presenter Enhancements (Optional but Preferred)
- Speaker notes toggle panel
- Progress indicator (Slide X / 10)
- Timer or pacing indicator

---

## Output Format

Generate a **single self-contained HTML file**:
- Inline CSS (or `<style>` block)
- Inline JS (or `<script>` block)

The output should:
- Run directly in browser
- Require no setup

---

## Code Quality

- Clean, well-structured code
- Modular JS where possible
- Comments explaining key parts
- Avoid unnecessary complexity

---

## Experience Goal

The final output should feel like:
> A **Series A startup demo experience** — immersive, fluid, and memorable

NOT:
- Basic slides
- Static HTML
- Text-heavy layouts



---

## Final Instruction

Do not explain the code.

Just output the **complete HTML file**.