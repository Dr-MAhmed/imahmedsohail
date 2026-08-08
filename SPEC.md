# Portfolio Website Specification

## Project Overview

- **Project Name**: Full-Stack Developer Portfolio
- **Type**: Single-page portfolio website
- **Core Functionality**: Showcase 10+ projects as a full-stack developer with a distinctive technical aesthetic
- **Target Users**: Potential employers, clients, and collaborators

---

## Design Plan

### Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Background (Deep) | Charcoal Black | `#0D0D0D` |
| Background (Surface) | Slate Gray | `#1A1A2E` |
| Background (Card) | Dark Navy | `#16213E` |
| Primary Accent | Electric Cyan | `#00FFF5` |
| Secondary Accent | Soft Violet | `#7B68EE` |
| Text Primary | Off White | `#E8E8E8` |
| Text Secondary | Muted Gray | `#8B8B9E` |
| Border/Divider | Subtle Gray | `#2D2D44` |

### Typography

- **Display Font**: "JetBrains Mono" — for headings and hero text (monospace, technical feel)
- **Body Font**: "IBM Plex Sans" — clean, readable sans-serif for body content
- **Code/Tech Font**: "Fira Code" — for code snippets, tags, and technical elements

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Hero Name | JetBrains Mono | 72px | 700 |
| Section Headings | JetBrains Mono | 36px | 600 |
| Project Titles | JetBrains Mono | 24px | 600 |
| Body Text | IBM Plex Sans | 16px | 400 |
| Code/Tags | Fira Code | 14px | 400 |
| Small Text | IBM Plex Sans | 14px | 400 |

### Layout Concept

```
┌─────────────────────────────────────────────────────┐
│ [Navigation: Logo | About | Projects | Skills | Contact]
├─────────────────────────────────────────────────────┤
│ HERO SECTION
│ ┌─────────────────────────────────────────────────┐ │
│ │  "Hello, I'm [Name]"                           │ │
│ │  Full-Stack Developer                          │ │
│ │  [Tagline describing expertise]               │ │
│ │                                                 │ │
│ │  [View Work] [Contact Me]    Terminal-style    │ │
│ │                               typing animation │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ ABOUT SECTION
│ ┌─────────────────────────────────────────────────┐ │
│ │ Brief intro + tech stack icons                 │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ PROJECTS SECTION (Grid of 10+ project cards)
│ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│ │ Project  │ │ Project  │ │ Project  │            │
│ │  1       │ │   2      │ │   3      │            │
│ └──────────┘ └──────────┘ └──────────┘            │
│ (Continues in responsive grid)
├─────────────────────────────────────────────────────┤
│ SKILLS SECTION
│ ┌─────────────────────────────────────────────────┐ │
│ │ Tech categories with icon badges               │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ CONTACT SECTION
│ ┌─────────────────────────────────────────────────┐ │
│ │ Email | GitHub | LinkedIn | Resume              │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ FOOTER
└─────────────────────────────────────────────────────┘
```

### Signature Element

**Terminal Cursor Animation**: The hero section features a blinking cursor effect after the tagline, simulating a real code editor. This reinforces the developer-focused aesthetic without being a generic "typing effect" — it's styled like an actual CLI prompt (`>`).

---

## Functionality Specification

### Core Features

1. **Navigation**: Smooth scroll to sections, fixed header on scroll
2. **Hero Section**: Name, title, tagline with terminal cursor animation
3. **About Section**: Brief bio + tech stack with icon badges
4. **Projects Section**: 10+ project cards with:
   - Initial state: Only first 3 projects visible (All category)
   - "View All" button to show remaining projects with animation
   - Category filtering (clicking a filter shows *all* matching projects with animation)
   - Product Icon (emoji)
   - Project title
   - Tech stack tags
   - Brief description
   - Links (Live Demo, GitHub)
5. **Skills Section**: Categorized skills with visual badges
6. **Contact Section**: Email, social links, CTA buttons
7. **Responsive Design**: Mobile, tablet, desktop layouts
8. **Scroll Animations**: Subtle fade-in on scroll

### User Interactions

- Hove effects on project cards (lift + glow)
- Hover effects on buttons (color transition)
- Smooth scrolling for navigation links
- **"View All Work" button click reveals full projects list with beautiful slide/fade animation**
- Filtering options reveal matching projects with animation
- External links open in new tabs

### Data Structure

Projects will be stored in a JavaScript array with:
```javascript
{
  id: 1,
  title: "Project Name",
  description: "Brief description",
  techStack: ["React", "Node.js", "MongoDB"],
  github: "https://github.com/...",
  demo: "https://...",
  icon: "🛒" // emoji or icon identifier
}
```

---

## Acceptance Criteria

1. ✓ Page loads without errors
2. ✓ All 10+ projects are displayed in a responsive grid
3. ✓ Navigation scrolls smoothly to each section
4. ✓ Hero has terminal cursor animation
5. ✓ Project cards have hover effects
6. ✓ All links are functional
7. ✓ Site is responsive (mobile, tablet, desktop)
8. ✓ Dark theme is consistently applied
9. ✓ Fonts load correctly (JetBrains Mono, IBM Plex Sans, Fira Code)
10. ✓ Page is accessible (proper heading hierarchy, alt texts)