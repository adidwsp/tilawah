# Project Blueprint

## Overview

This project is a Quran progress tracking application called "Khatam Bareng Skrt". It allows users to track their Quran reading progress, view leaderboards, and see their timeline of accomplishments. The application is built with Vue.js, Pinia for state management, and Supabase for the backend.

## Features & Design

### Core Features

*   **User Authentication:** Users can register and log in with a username. The session is persisted in local storage.
*   **Dashboard:** Displays the user's progress, stats, and a search bar to find surahs.
*   **Leaderboard:** Shows a ranked list of users based on their reading progress.
*   **Timeline:** A chronological view of the user's reading history.
*   **Reporting:** Users can report their reading progress.
*   **Editing:** Users can edit their progress.

### Design

*   **UI:** The application uses Tailwind CSS for a modern, responsive, and utility-first design.
*   **Components:** The UI is built with single-file components, including:
    *   `EmojiReaction.vue`
    *   `HelloWorld.vue`
    *   `Navigation.vue`
    *   `ProgressBar.vue`
    *   `StatsCard.vue`
    *   `SurahSearch.vue`
    *   `TimelineItem.vue`
*   **Views:** The application has the following views:
    *   `Dashboard.vue`
    *   `Edit.vue`
    *   `Leaderboard.vue`
    *   `Login.vue`
    *   `Report.vue`
    *   `Timeline.vue`
*   **State Management:** Pinia is used for centralized state management.
*   **Routing:** Vue Router is used for client-side routing.

## Current Change: Add Gender Field

### Plan

1.  **Modify `src/views/Login.vue`**:
    *   Add a `select` input for gender in the registration form.
    *   Add a `registerGender` ref to store the selected gender.
    *   Update the `handleRegister` function to include the `gender` in the registration data.
2.  **Modify `src/stores/auth.js`**:
    *   Update the `register` function to accept the `gender` field and pass it to the Supabase insert query.
