
# AIRCLOCK - On Time Worldwide
AIRCLOCK is a clean, modern, and feature-rich time utility web application built with vanilla HTML, CSS, and JavaScript. It provides accurate timekeeping for locations around the globe, along with a suite of powerful tools like a stopwatch, timer, and alarm system, all in a single, responsive interface. The application saves all your preferences and pinned clocks directly in your browser for a persistent, personalized experience.


### ✨ Key Features

* **Dynamic Main Clock**
    -   Automatically detects and displays the user's local time, date, and timezone on startup.
* **Global Clock Dashboard**
    -   Search and pin clocks for any major city worldwide to a responsive grid.
    -   Each clock card displays the city, current time, date, and a day/night indicator (☀️/🌙).
    -   Shows the time difference between pinned clocks and your local time.
* **Powerful Utilities**
    -   **Stopwatch**: A precise stopwatch with lap-recording functionality.
    -   **Timer**: A countdown timer that plays an audible alert when finished.
    -   **Alarms**: Set multiple, labeled alarms with on/off toggles and a live countdown to the ring time.
* **Personalization & Settings**
    -   **Light & Dark Themes**: Choose your preferred theme or enable the "Auto Theme" setting, which intelligently switches based on the local time of your main clock.
    -   **24-Hour Format**: Toggle between 12-hour and 24-hour time display.
    -   **Multi-Language Support**: The user interface is available in English, Spanish, and Bangla.
* **Additional Components**
    -   A simple monthly **Calendar**.
    -   A persistent **Notes** area to jot down quick reminders.
    -   A distraction-free **Fullscreen Mode** for the main clock.

---

### 🛠️ How It Works

1.  **Time Data Acquisition**
    -   The application uses the free WorldTimeAPI to fetch accurate time data for all clocks.
    -   On initial load, it fetches the user's timezone via their IP address to set the main clock.
2.  **Efficient Time Updates**
    -   To improve performance and minimize API calls, the app calculates an initial time `offset` between the API server and the user's browser.
    -   This offset allows all clock displays to be updated locally every second without constant network requests.
    -   When loading saved clocks, the data is fetched simultaneously to reduce load times.
3.  **Data Persistence**
    -   All user settings, pinned clocks, notes, and alarms are saved to the browser's `localStorage`.
    -   This ensures your personalized configuration is remembered and restored between visits.
