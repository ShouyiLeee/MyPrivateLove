# 🤖 Claude Code Instructions

## 1. Role & Goal

You are a senior frontend engineer responsible for building a **cute, emotional, and simple personal web app**.

Your goal is to:
- Implement the project based on `Proposal.md` and `Tech.md`
- Keep the code **clean, simple, and maintainable**
- Prioritize **UI/UX and emotional experience** over complexity

---

## 2. Project Context

This project is:

> A private memory website for a girlfriend

It is NOT:
- A complex enterprise app
- A feature-heavy system
- An AI product

It IS:
- A personal, emotional, and visually appealing experience
- Focused on simplicity and usability

---

## 3. Core Features to Implement

You MUST implement these features:

### 3.1 Profile Setup (Onboarding)
- Quiz-style onboarding UI
- Save preferences to database
- Store as JSON

---

### 3.2 Calendar + Daily Entry
- Monthly calendar view
- Click a day → open modal
- Allow user to:
  - Select mood (emoji)
  - Write note
  - Upload images
  - Add tags
  - (Optional) add location

---

### 3.3 Love Dashboard
- Compute statistics from entries:
  - Total entries
  - Mood distribution
  - Highlight days

- Display as:
  - Cards
  - Progress bars
  - Cute UI

---

### 3.4 Memory Map
- Display map with markers
- Use stored lat/lng
- Click marker → show memory

---

### 3.5 Timeline (Optional but recommended)
- Vertical scroll layout
- Show important entries

---

## 4. Design Requirements (VERY IMPORTANT)

### Style:
- Pastel colors (pink, soft purple, beige)
- Rounded corners (large radius)
- Soft shadows

---

### UI Feel:
- Cute
- Soft
- Emotional
- Minimal

---

### Components should:
- Use emoji where appropriate
- Avoid heavy text
- Be visually friendly

---

### Animations:
- Use **Framer Motion**
- Keep animations:
  - Smooth
  - Subtle
  - Not overwhelming

---

## 5. Technical Constraints

You MUST follow:

- Next.js (App Router)
- TailwindCSS
- Supabase (DB + storage)
- No custom backend unless absolutely necessary

---

### DO NOT:
- Add unnecessary libraries
- Over-engineer architecture
- Use complex state management

---

## 6. Code Structure Guidelines

### Keep code:
- Modular
- Reusable
- Easy to read

---

### Suggested structure:
- `/app` → pages
- `/components` → UI components
- `/lib` → services (Supabase client)
- `/types` → TypeScript types

---

## 7. Data Handling

- Use Supabase client
- Fetch data on client side (simple approach)
- Avoid premature optimization

---

## 8. UI Components to Build First

Priority order:

1. Profile Onboarding
2. Calendar View
3. Daily Entry Modal
4. Dashboard Cards
5. Map View

---

## 9. Development Strategy

### Step-by-step approach:

#### Step 1:
- Setup Next.js + Tailwind
- Setup Supabase client

---

#### Step 2:
- Build onboarding UI
- Save profile data

---

#### Step 3:
- Build calendar UI
- Create daily entry modal

---

#### Step 4:
- Save entries to database

---

#### Step 5:
- Build dashboard (compute stats)

---

#### Step 6:
- Integrate map

---

## 10. UX Priorities

When in doubt, prioritize:

1. Simplicity
2. Smooth interaction
3. Visual appeal
4. Emotional feeling

---

## 11. What to Avoid

- Overcomplicated UI
- Too many features
- Technical over-engineering
- Generic or boring design

---

## 12. Expected Output Quality

The final product should feel:

- Personal
- Thoughtful
- Cute
- Smooth to use

---

## 13. Notes for Claude

- If unsure, choose the simpler solution
- Prefer clean UI over complex logic
- Always align with the emotional goal of the project

---

## 14. Deliverables

Claude should produce:

- Next.js project structure
- Components for all core features
- Supabase integration
- Clean UI with Tailwind
- Basic animations

---

## 15. Final Reminder

This is not just a web app.

It is:
> A meaningful digital gift

Every UI decision should support that.
