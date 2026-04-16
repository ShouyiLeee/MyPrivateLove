# 🎁 Project Proposal: Private Memory Space

## 1. Overview

This project is a personal website designed as a **digital memory space** for a girlfriend.  
It is not just a note-taking app, but a **private emotional space** where she can:

- Store personal preferences and personality
- Write daily notes and emotions
- Track special days and personal cycles
- Visualize memories through timeline and map
- View meaningful statistics about her life and relationship

---

## 2. Product Vision

> Build a **cute, emotional, and personalized web experience** that feels like a safe and lovely place to store memories.

Key principles:

- Simple to use
- Emotion-driven
- Visually appealing (cute & soft UI)
- Highly personal

---

## 3. Core Features

## 3.1 Profile Setup (Onboarding Quiz)

### Purpose:
Collect user preferences and create a personal profile.

### Flow:
- First-time user enters the site
- A quiz-style onboarding appears:
  - Favorite color
  - Favorite food
  - Hobbies
  - Personality traits
  - Likes / dislikes

### Output:
- Stored as a **User Profile**
- Used for:
  - Personalization
  - UI theme suggestions
  - Display in profile page

---

## 3.2 Calendar + Daily Notes

### Features:
- Calendar view (monthly)
- Click a day → open "Daily Entry"

### Each entry includes:
- Mood (emoji)
- Text note
- Images upload
- Tags:
  - Memory
  - Date
  - Normal day
- Optional location

---

### Additional:
- Basic cycle tracking
- Highlight special days

---

## 3.3 Love Dashboard

### Purpose:
Turn raw data into meaningful insights.

### Metrics:
- Total days used
- Total notes written
- Total memories created

### Mood Statistics:
- % Happy 😊
- % Sad 😢
- % Angry 😡
- % Tired 😴

### Highlights:
- Happiest day
- Most active day
- Most memorable day (most images/notes)

### Optional:
- Relationship duration (days together)

---

## 3.4 Memory Map

### Purpose:
Visualize places and memories.

### Features:
- Map showing visited locations
- Each location contains:
  - Notes
  - Images
  - Dates

### Interaction:
- Click marker → show memory detail

---

## 3.5 Timeline View

### Purpose:
Display life events chronologically

### Features:
- Vertical scroll
- Show:
  - Notes
  - Memories
  - Special days

---

## 4. User Flow

### First-time user:
1. Open website
2. Start onboarding quiz
3. Create profile
4. Enter main dashboard

---

### Daily usage:
1. Open calendar
2. Select a day
3. Add:
   - Mood
   - Note
   - Image
   - Location (optional)

---

### Exploration:
- Dashboard → stats
- Map → places visited
- Timeline → memory journey

---

## 5. Data Model

### User
id
name
preferences (JSON)
created_at

---

### DailyEntry
id
user_id
date
mood
note
images[]
tags[]
location (optional)
created_at

---

### Relationship (optional)
start_date

---

### Derived Data (no need to store)
- Mood statistics
- Highlights
- Dashboard metrics

---

## 6. UI/UX Design

### Style:
- Pastel colors (pink, purple, beige)
- Rounded corners
- Soft shadows

---

### Elements:
- Emoji
- Cute icons
- Stickers

---

### Animations:
- Fade-in
- Hover effects
- Floating elements (hearts, sparkles)

---

### Fonts:
- Rounded / handwritten style

---

## 7. Technical Stack

### Frontend:
- Next.js
- TailwindCSS
- Framer Motion

---

### Backend:
- Firebase / Supabase (recommended for simplicity)

---

### Map Integration:
- Mapbox or Leaflet

---

### Storage:
- Cloud storage for images

---

## 8. Development Roadmap

### Phase 1 (MVP)
- Profile onboarding (quiz)
- Calendar UI
- Create daily entry

---

### Phase 2
- Mood tracking
- Image upload

---

### Phase 3
- Love Dashboard

---

### Phase 4
- Memory Map

---

### Phase 5
- Timeline view
- UI polish & animation

---

## 9. Key Differentiation

This is NOT:
- A generic note-taking app

This IS:
- A **personal emotional memory system**

---

### Success factors:
- Cute UI
- Smooth UX
- Meaningful data visualization

---

## 10. Future Improvements (Optional)

- Theme switching
- Dark mode
- Stickers collection
- Export memories (PDF)
- Lock/Private mode

---

## 11. Conclusion

This project focuses on **emotion, personalization, and memory**.

If executed well, it becomes:
> A meaningful and memorable digital gift.
