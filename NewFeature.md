# ✨ New Features Proposal

## 1. Overview

This document defines additional features to enhance the project based on the core concept:

> A cute, emotional, and personal memory space

These features focus on:
- Emotional value
- Personal expression
- Real-life usefulness

---

## 2. Feature List

### 2.1 Wishlist

---

## 🎯 Purpose

Allow the user to save items they like or want to receive as gifts.

This is not just a bookmark list, but a **personal wish space**.

---

## 🧩 Features

### Add Item
User can:
- Paste product link (Shopee, Lazada, etc.)
- Input:
  - Title
  - Image (upload or URL)
  - Note (why they like it)
  - Category (optional)

---

### Display
- Grid layout (card-based)
- Each item shows:
  - Image
  - Title
  - Small emoji/icon

---

### Item Detail
- Large image
- Title
- Note
- Button → open original link

---

### Status (optional but recommended)
- 💭 Want
- 🎁 Gifted
- ✅ Owned

---

## 💡 UX Notes
- Keep it simple (manual input is fine)
- Focus on visual (image-first UI)
- Make it feel “cute” and personal

---

## 🧱 Data Model


wishlist_items
id
user_id
title
link
image_url
note
category
status
created_at


---

---

### 2.2 Photo Memories Wall

---

## 🎯 Purpose

Create a visual space to view all memories through images.

Focus on:
> Emotion through visuals instead of text

---

## 🧩 Features

### Display
- Grid layout (Pinterest-style)
- Show all images from daily entries

---

### Interaction
- Click image → open related daily entry
- Hover → show date or short note

---

### Filtering (optional)
- By date
- By tag

---

## 💡 UX Notes
- Prioritize visual layout
- Large images, minimal text
- Smooth transitions

---

## 🧱 Data Source

- Use images from:
  - `daily_entries.images`

---

---

### 2.3 Special Days Tracker

---

## 🎯 Purpose

Track important dates and events.

---

## 🧩 Features

### Add Special Day
User can input:
- Title (e.g. Birthday, Anniversary)
- Date
- Optional note

---

### Display
- List of special days
- Countdown:
  - “3 days left 💕”

---

### Calendar Integration
- Highlight special days in calendar view

---

## 💡 UX Notes
- Show countdown clearly
- Use emoji/icons
- Keep it lightweight

---

## 🧱 Data Model


special_days
id
user_id
title
date
note
created_at


---

---

### 2.4 Time Capsule

---

## 🎯 Purpose

Allow user to write messages to the future.

This is a highly emotional feature.

---

## 🧩 Features

### Create Capsule
User can:
- Write a message
- Select open date

---

### Locked State
- Capsule is hidden or locked until open date
- Show as:
  - 🔒 Locked message

---

### Open Capsule
- When date is reached:
  - User can open it
  - Display message with simple animation

---

## 💡 UX Notes
- Create sense of anticipation
- Keep UI minimal and emotional
- Add small animation when opening

---

## 🧱 Data Model


time_capsules
id
user_id
message
open_date
is_opened (boolean)
created_at


---

---

## 3. Integration with Existing System

---

### Calendar
- Show:
  - Special days
  - Time capsule open dates

---

### Dashboard
- Add:
  - Wishlist count
  - Special days count
  - Time capsules count

---

### Timeline
- Include:
  - Wishlist added
  - Special days
  - Time capsule created/opened

---

---

## 4. Development Priority

### Phase 1 (High Priority)
1. Wishlist
2. Special Days Tracker

---

### Phase 2
3. Photo Memories Wall

---

### Phase 3
4. Time Capsule

---

---

## 5. Design Guidelines

All new features must follow:

- Pastel color palette
- Rounded UI
- Soft shadow
- Cute icons / emoji

---

## Animation:
- Subtle
- Smooth
- Not distracting

---

## 6. Final Notes

These features should:

- Enhance emotional value
- Stay simple to use
- Integrate naturally with existing system

---

Do NOT:
- Overcomplicate logic
- Add unnecessary configuration
- Break the minimal and cute design philosophy

---

## 7. Summary

These additions will:

- Make the app more meaningful
- Increase daily engagement
- Improve personalization
- Strengthen the “gift experience”