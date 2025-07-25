# Productivity Key Indicator (PKI) v2.0 Web Application

## Master Your Time, Quantify Your Effectiveness.

The Productivity Key Indicator (PKI) is a sophisticated, privacy-first web application designed to empower users to master their time and transform "busyness" into "effectiveness." Moving beyond simple time tracking, PKI provides a quantified, data-driven framework for planning, executing, and reflecting on daily productivity.

---

### 💡 Core Philosophy

PKI is built on four foundational pillars:

1.  **Intentional Planning**: Productivity begins with a clear plan. PKI encourages users to define their intentions and set targets for the day before they begin.
2.  **Dual-Metric Feedback**: Gain comprehensive insights with two distinct feedback loops:
    *   **Composite Score (0-100)**: A holistic, goal-oriented measure of daily success against your planned targets.
    *   **XP Score (Points-Based)**: A granular, activity-driven measure of effort that fuels long-term engagement and progression.
3.  **Gamified Progress**: Leverage proven mechanics like XP, levels, and streaks to make the journey of self-improvement engaging, motivating, and rewarding.
4.  **Absolute Data Privacy**: Your data is exclusively yours. The application is 100% client-side, runs offline, and requires no accounts or cloud sync. All data lives and dies on your device unless you choose to export it.

### 🎯 Target User Persona

PKI is ideal for motivated individuals (students, professionals, creators, lifelong learners) who value data, appreciate structured systems, and are looking for a powerful tool to build lasting habits of focus and discipline.

---

### ✨ Key Features

#### 📊 Dual-Metric Feedback System
*   **Composite Score**: A weighted calculation (0-100) based on:
    *   **Completion Rate**: Follow-through on high-priority tasks.
    *   **Focus Ratio**: Proportion of time spent in deep concentration.
    *   **Distraction Ratio**: Ability to avoid low-value activities.
    *   **Throughput**: Overall task completion volume.
    *   **Rest Balance**: Adherence to planned recovery.
*   **XP Score**: Earn points for every minute logged, contributing to your overall progression.

#### 🎮 Gamification Engine
*   **XP & Leveling**: Progress through levels as you accumulate XP, with a dynamic scaling formula.
*   **Streak System**: Track consecutive days of logging activity (`Daily Log Streak`) and meeting deep work targets (`Deep Work Streak`).
*   **Visual Progression**: Prominent display of your current level, XP progress, and streaks in the header.

#### 🗓️ Daily Briefing & Planning
*   **Intentional Goal Setting**: Set time targets (in minutes) for various activity categories like Deep Work, Shallow Work, Scheduled Leisure, Distraction, and Rabbit Hole.
*   **Real-time Progress**: Visualize your progress against daily targets with dynamic progress bars.
*   **Smart Feedback**: Receive contextual messages indicating whether you're on track, surpassing goals, or exceeding negative activity limits.
*   **Integrated Task Management**: Add, manage, and track daily tasks with completion checkboxes, priority tags, and an overall task progress bar.

#### ✍️ Activity Logging
*   **Granular Tracking**: Log activities with start/end times, duration, category, and description.
*   **Automated Point Calculation**: Each log entry automatically calculates and stores points based on predefined category values.
*   **Detailed Overview**: View a comprehensive list of today's logged activities, including time, duration, category, description, and earned XP.

#### 🔒 Absolute Data Privacy & Portability
*   **Client-Side IndexedDB**: All your data is stored securely in your browser's IndexedDB, ensuring privacy and offline access.
*   **Full Backup & Restore**: Export your entire profile data to a downloadable JSON file and import it back when needed.
*   **Daily Export**: Export a single day's log to CSV or Markdown for external analysis or archiving.

#### 🎨 Intuitive UI/UX
*   **Modern Design**: Clean, minimalist interface with a focus on clarity and usability.
*   **Collapsible Sidebar**: Navigate seamlessly between Dashboard, Log Activity, Daily Plan, Analytics, and Profile settings.
*   **Responsive Layout**: Optimized for a consistent experience across various screen sizes.
*   **Lucide Icons**: A clean, modern icon library for intuitive visual cues.

---

### 🛠️ Technologies Used

*   **React**: A declarative, component-based JavaScript library for building user interfaces.
*   **TypeScript**: A superset of JavaScript that adds static types, enhancing code quality and maintainability.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
*   **Vite**: A fast build tool that provides an extremely quick development experience.
*   **IndexedDB**: A low-level API for client-side storage of significant amounts of structured data.
*   **date-fns**: A modern JavaScript date utility library.
*   **clsx**: A tiny utility for constructing `className` strings conditionally.
*   **Lucide React**: A beautiful, customizable icon library.

---

### 🚀 Getting Started (Local Development)

To run PKI v2.0 on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd productivity-key-indicator
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173`.

---

### 📸 Screenshots / Demo

*(Placeholder: Add screenshots or a link to a live demo here)*

---

### 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

---

### 📄 License

This project is open-source and available under the [MIT License](LICENSE).