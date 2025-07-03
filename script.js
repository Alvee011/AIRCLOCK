// --- 1. CONFIGURATION & STATE MANAGEMENT ---
// This section defines all the constants and variables the app will use.

// A central object to hold references to all the important HTML elements.
// This makes the code cleaner and easier to read than using document.getElementById() everywhere.
const dom = {
    body: document.body,
    mainTime: document.getElementById('mainTime'),
    mainDate: document.getElementById('mainDate'),
    mainLocation: document.getElementById('mainLocation'),
    mainClockContainer: document.getElementById('mainClockContainer'),
    searchContainer: document.getElementById('searchContainer'),
    citySearchInput: document.getElementById('citySearchInput'),
    searchDropdown: document.getElementById('searchDropdown'),
    clocksGrid: document.getElementById('clocksGrid'),
    notesArea: document.getElementById('notesArea'),
    resetBtn: document.getElementById('resetBtn'),
    refreshCardsBtn: document.getElementById('refreshCardsBtn'),
    menuBtn: document.getElementById('menuBtn'),
    navOverlay: document.getElementById('navOverlay'),
    navLinks: document.querySelectorAll('.nav-link'),
    settingsBtn: document.getElementById('settingsBtn'),
    settingsModal: document.getElementById('settingsModal'),
    closeSettingsBtn: document.getElementById('closeSettingsBtn'),
    autoThemeToggle: document.getElementById('autoThemeToggle'),
    manualThemeToggle: document.getElementById('manualThemeToggle'),
    manualThemeToggleContainer: document.getElementById('manualThemeToggleContainer'),
    hourFormatToggle: document.getElementById('hourFormatToggle'),
    languageSelect: document.getElementById('languageSelect'),
    calendarTitleText: document.getElementById('calendarTitleText'),
    calendarGrid: document.getElementById('calendarGrid'),
    prevMonthBtn: document.getElementById('prevMonthBtn'),
    nextMonthBtn: document.getElementById('nextMonthBtn'),
    datePickerModal: document.getElementById('datePickerModal'),
    closeDatePickerBtn: document.getElementById('closeDatePickerBtn'),
    pickerYearInput: document.getElementById('pickerYearInput'),
    prevYearBtn: document.getElementById('prevYearBtn'),
    nextYearBtn: document.getElementById('nextYearBtn'),
    datePickerMonthsGrid: document.getElementById('datePickerMonthsGrid'),
    fullscreenOverlay: document.getElementById('fullscreenOverlay'),
    fullscreenTime: document.getElementById('fullscreenTime'),
    fullscreenDate: document.getElementById('fullscreenDate'),
    closeFullscreenBtn: document.getElementById('closeFullscreenBtn'),
    popularCitiesContainer: document.getElementById('popular-cities-container'),
    // Stopwatch elements
    stopwatchDisplay: document.getElementById('stopwatchDisplay'),
    stopwatchToggleBtn: document.getElementById('stopwatchToggleBtn'), // New toggle button
    stopwatchLapBtn: document.getElementById('stopwatchLapBtn'),
    stopwatchResetBtn: document.getElementById('stopwatchResetBtn'),
    lapsList: document.getElementById('lapsList'),
    // Timer elements
    timerDisplay: document.getElementById('timerDisplay'),
    timerInputsContainer: document.getElementById('timerInputs'),
    timerHoursInput: document.getElementById('timerHours'),
    timerMinutesInput: document.getElementById('timerMinutes'),
    timerSecondsInput: document.getElementById('timerSeconds'),
    timerToggleBtn: document.getElementById('timerToggleBtn'), // The new combined start/stop button
    timerResetBtn: document.getElementById('timerResetBtn'),
    // Alarm elements
    alarmTimeInput: document.getElementById('alarmTimeInput'),
    alarmLabelInput: document.getElementById('alarmLabelInput'),
    addAlarmBtn: document.getElementById('addAlarmBtn'),
    alarmsList: document.getElementById('alarmsList'),
    // UI Text elements for translation
    uiText: {
        notesTitle: document.getElementById('notesTitle'),
        calendarSectionTitle: document.getElementById('calendarSectionTitle'),
        settingsModalTitle: document.getElementById('settingsModalTitle'),
        themeSettingsTitle: document.getElementById('themeSettingsTitle'),
        formatSettingsTitle: document.getElementById('formatSettingsTitle'),
        languageSettingsTitle: document.getElementById('languageSettingsTitle'),
        autoThemeLabel: document.getElementById('autoThemeLabel'),
        darkThemeLabel: document.getElementById('darkThemeLabel'),
        hourFormatLabel: document.getElementById('hourFormatLabel'),
    }
};

// The 'state' object holds all the dynamic data for the application.
// Keeping all state in one place makes it easier to manage and debug.
let state = {
    mainClock: null, // Holds data for the user's primary clock
    pinnedClocks: [], // An array of clock objects for different cities
    settings: {
        autoTheme: true,
        manualThemeDark: false,
        is24Hour: true,
        language: 'en'
    },
    currentCalendarDate: new Date(),
    // State for utility features
    stopwatch: {
        startTime: 0,
        elapsedTime: 0,
        intervalId: null,
        laps: []
    },
    timer: {
        totalSeconds: 0,
        remainingSeconds: 0,
        intervalId: null // This is key to knowing if the timer is running
    },
    alarms: [], // An array of alarm objects
    alarmCheckInterval: null
};

let clockUpdateInterval = null; // Will hold the main setInterval for updating all clocks
const API_BASE_URL = 'https://worldtimeapi.org/api';

const cityData = [
    { name: "New York", country: "USA", timezone: "America/New_York", flag: "🇺🇸" },
    { name: "London", country: "United Kingdom", timezone: "Europe/London", flag: "🇬🇧" },
    { name: "Tokyo", country: "Japan", timezone: "Asia/Tokyo", flag: "🇯🇵" },
    { name: "Paris", country: "France", timezone: "Europe/Paris", flag: "🇫🇷" },
    { name: "Sydney", country: "Australia", timezone: "Australia/Sydney", flag: "🇦🇺" },
    { name: "Dhaka", country: "Bangladesh", timezone: "Asia/Dhaka", flag: "🇧🇩" },
    { name: "Berlin", country: "Germany", timezone: "Europe/Berlin", flag: "🇩🇪" },
    { name: "Los Angeles", country: "USA", timezone: "America/Los_Angeles", flag: "🇺🇸" },
    { name: "Chicago", country: "USA", timezone: "America/Chicago", flag: "🇺🇸" },
    { name: "Toronto", country: "Canada", timezone: "America/Toronto", flag: "🇨🇦" },
    { name: "Sao Paulo", country: "Brazil", timezone: "America/Sao_Paulo", flag: "🇧🇷" },
    { name: "Mexico City", country: "Mexico", timezone: "America/Mexico_City", flag: "🇲🇽" },
    { name: "Buenos Aires", country: "Argentina", timezone: "America/Argentina/Buenos_Aires", flag: "🇦🇷" },
    { name: "Lagos", country: "Nigeria", timezone: "Africa/Lagos", flag: "🇳🇬" },
    { name: "Cairo", country: "Egypt", timezone: "Africa/Cairo", flag: "🇪🇬" },
    { name: "Johannesburg", country: "South Africa", timezone: "Africa/Johannesburg", flag: "🇿🇦" },
    { name: "Nairobi", country: "Kenya", timezone: "Africa/Nairobi", flag: "🇰🇪" },
    { name: "Moscow", country: "Russia", timezone: "Europe/Moscow", flag: "🇷🇺" },
    { name: "Madrid", country: "Spain", timezone: "Europe/Madrid", flag: "🇪🇸" },
    { name: "Rome", country: "Italy", timezone: "Europe/Rome", flag: "🇮🇹" },
    { name: "Amsterdam", country: "Netherlands", timezone: "Europe/Amsterdam", flag: "🇳🇱" },
    { name: "Stockholm", country: "Sweden", timezone: "Europe/Stockholm", flag: "🇸🇪" },
    { name: "Istanbul", country: "Turkey", timezone: "Europe/Istanbul", flag: "🇹🇷" },
    { name: "Dubai", country: "UAE", timezone: "Asia/Dubai", flag: "🇦🇪" },
    { name: "Abu Dhabi", country: "UAE", timezone: "Asia/Dubai", flag: "🇦🇪" },
    { name: "Mumbai", country: "India", timezone: "Asia/Kolkata", flag: "🇮🇳" },
    { name: "Delhi", country: "India", timezone: "Asia/Kolkata", flag: "🇮🇳" },
    { name: "Shanghai", country: "China", timezone: "Asia/Shanghai", flag: "🇨🇳" },
    { name: "Beijing", country: "China", timezone: "Asia/Shanghai", flag: "🇨🇳" },
    { name: "Singapore", country: "Singapore", timezone: "Asia/Singapore", flag: "🇸🇬" },
    { name: "Seoul", country: "South Korea", timezone: "Asia/Seoul", flag: "🇰🇷" },
    { name: "Bangkok", country: "Thailand", timezone: "Asia/Bangkok", flag: "🇹🇭" },
    { name: "Jakarta", country: "Indonesia", timezone: "Asia/Jakarta", flag: "🇮🇩" },
    { name: "Kuala Lumpur", country: "Malaysia", timezone: "Asia/Kuala_Lumpur", flag: "🇲🇾" },
    { name: "Ho Chi Minh City", country: "Vietnam", timezone: "Asia/Ho_Chi_Minh", flag: "🇻🇳" },
    { name: "Manila", country: "Philippines", timezone: "Asia/Manila", flag: "🇵🇭" },
    { name: "Auckland", country: "New Zealand", timezone: "Pacific/Auckland", flag: "🇳🇿" },
    { name: "Honolulu", country: "USA", timezone: "Pacific/Honolulu", flag: "🇺🇸" },
    { name: "Ankara", country: "Turkey", timezone: "Europe/Istanbul", flag: "🇹🇷" },
    { name: "Riyadh", country: "Saudi Arabia", timezone: "Asia/Riyadh", flag: "🇸🇦" },
    { name: "Tehran", country: "Iran", timezone: "Asia/Tehran", flag: "🇮🇷" },
    { name: "Baghdad", country: "Iraq", timezone: "Asia/Baghdad", flag: "🇮🇶" },
    { name: "Lima", country: "Peru", timezone: "America/Lima", flag: "🇵🇪" },
    { name: "Bogota", country: "Colombia", timezone: "America/Bogota", flag: "🇨🇴" },
    { name: "Santiago", country: "Chile", timezone: "America/Santiago", flag: "🇨🇱" },
    { name: "Caracas", country: "Venezuela", timezone: "America/Caracas", flag: "🇻🇪" },
    { name: "Helsinki", country: "Finland", timezone: "Europe/Helsinki", flag: "🇫🇮" },
    { name: "Oslo", country: "Norway", timezone: "Europe/Oslo", flag: "🇳🇴" },
    { name: "Copenhagen", country: "Denmark", timezone: "Europe/Copenhagen", flag: "🇩🇰" },
    { name: "Dublin", country: "Ireland", timezone: "Europe/Dublin", flag: "🇮🇪" },
    { name: "Lisbon", country: "Portugal", timezone: "Europe/Lisbon", flag: "🇵🇹" },
    { name: "Prague", country: "Czech Republic", timezone: "Europe/Prague", flag: "🇨🇿" },
    { name: "Warsaw", country: "Poland", timezone: "Europe/Warsaw", flag: "🇵🇱" },
    { name: "Vienna", country: "Austria", timezone: "Europe/Vienna", flag: "🇦🇹" },
    { name: "Budapest", country: "Hungary", timezone: "Europe/Budapest", flag: "🇭🇺" },
    { name: "Athens", country: "Greece", timezone: "Europe/Athens", flag: "🇬🇷" },
    { name: "Addis Ababa", country: "Ethiopia", timezone: "Africa/Addis_Ababa", flag: "🇪🇹" },
    { name: "Karachi", country: "Pakistan", timezone: "Asia/Karachi", flag: "🇵🇰" },
    { name: "Taipei", country: "Taiwan", timezone: "Asia/Taipei", flag: "🇹🇼" }
];

const popularCities = [
    { name: "Abu Dhabi", size: 2, timezone: "Asia/Dubai" }, { name: "Addis Ababa", size: 1, timezone: "Africa/Addis_Ababa" }, { name: "Amsterdam", size: 3, timezone: "Europe/Amsterdam" },
    { name: "Beijing", size: 5, timezone: "Asia/Shanghai" }, { name: "Berlin", size: 3, timezone: "Europe/Berlin" },
    { name: "Buenos Aires", size: 4, timezone: "America/Argentina/Buenos_Aires" }, { name: "Cairo", size: 3, timezone: "Africa/Cairo" }, { name: "Chicago", size: 4, timezone: "America/Chicago" }, { name: "Delhi", size: 5, timezone: "Asia/Kolkata" }, { name: "Dhaka", size: 4, timezone: "Asia/Dhaka" },
    { name: "Dubai", size: 4, timezone: "Asia/Dubai" }, { name: "Hong Kong", size: 4, timezone: "Asia/Hong_Kong" }, { name: "Istanbul", size: 5, timezone: "Europe/Istanbul" }, { name: "Jakarta", size: 3, timezone: "Asia/Jakarta" },
    { name: "Karachi", size: 5, timezone: "Asia/Karachi" }, { name: "Lagos", size: 4, timezone: "Africa/Lagos" }, { name: "London", size: 5, timezone: "Europe/London" }, { name: "Los Angeles", size: 5, timezone: "America/Los_Angeles" },
    { name: "Manila", size: 3, timezone: "Asia/Manila" }, { name: "Mexico City", size: 5, timezone: "America/Mexico_City" }, { name: "Moscow", size: 4, timezone: "Europe/Moscow" }, { name: "Mumbai", size: 4, timezone: "Asia/Kolkata" },
    { name: "New York", size: 5, timezone: "America/New_York" }, { name: "Paris", size: 4, timezone: "Europe/Paris" }, { name: "Rio de Janeiro", size: 3, timezone: "America/Sao_Paulo" },
    { name: "Seoul", size: 4, timezone: "Asia/Seoul" }, { name: "Shanghai", size: 4, timezone: "Asia/Shanghai" }, { name: "Singapore", size: 4, timezone: "Asia/Singapore" }, { name: "Sydney", size: 4, timezone: "Australia/Sydney" }, { name: "São Paulo", size: 5, timezone: "America/Sao_Paulo" }, { name: "Taipei", size: 3, timezone: "Asia/Taipei" },
    { name: "Tokyo", size: 5, timezone: "Asia/Tokyo" },
];

const translations = {
    en: { name: "English", ui: { notes: "Notes", calendar: "Calendar", settings: "Settings", theme: "Theme", autoTheme: "Auto Theme", darkMode: "Dark Mode", format: "Format", hourFormat: "24-Hour Format", language: "Language", reset: "Reset All Data" }, placeholders: { search: "Search for a city or country...", notes: "Write something..." }, alerts: { resetConfirm: "Are you sure? This will clear all pinned clocks and notes.", noPinned: "Search for a city to pin a clock." }, time: { ahead: "ahead", behind: "behind", same: "Same time" }, calendar: { months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] } },
    bn: { name: "বাংলা (Bangla)", ui: { notes: "নোট", calendar: "ক্যালেন্ডার", settings: "সেটিংস", theme: "থিম", autoTheme: "স্বয়ংক্রিয় থিম", darkMode: "ডার্ক মোড", format: "ফরম্যাট", hourFormat: "২৪-ঘন্টা ফরম্যাট", language: "ভাষা", reset: "সব ডেটা রিসেট করুন" }, placeholders: { search: "শহর বা দেশ খুঁজুন...", notes: "কিছু লিখুন..." }, alerts: { resetConfirm: "আপনি কি নিশ্চিত? এটি সমস্ত পিন করা ঘড়ি এবং নোট মুছে ফেলবে।", noPinned: "ঘড়ি পিন করতে একটি শহর অনুসন্ধান করুন।" }, time: { ahead: "ahead", behind: "behind", same: "Same time" }, calendar: { months: ["জানুয়ারী", "ফেব্রুয়ারী", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"], shortMonths: ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে"], weekdays: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"] } },
    es: { name: "Español", ui: { notes: "Notas", calendar: "Calendario", settings: "Ajustes", theme: "Tema", autoTheme: "Tema automático", darkMode: "Modo oscuro", format: "Formato", hourFormat: "Formato 24 horas", language: "Idioma", reset: "Restablecer datos" }, placeholders: { search: "Buscar una ciudad o país...", notes: "Escribe algo..." }, alerts: { resetConfirm: "¿Estás seguro? Esto borrará todos los relojes y notas fijados.", noPinned: "Busca una ciudad para fijar un reloj." }, time: { ahead: "adelantado", behind: "atrasado", same: "Misma hora" }, calendar: { months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"], shortMonths: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"], weekdays: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] } }
};


// --- Page Navigation Switching ---
dom.navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const targetPage = link.getAttribute('data-page');

        // Hide all sections
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(`page-${targetPage}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update nav link active class
        dom.navLinks.forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');

        // Close menu
        dom.navOverlay.classList.remove('active');
    });
});

// --- 2. CORE LOGIC ---

// A helper function to prevent a function from being called too frequently.
// Useful for things like search input to avoid making API calls on every keystroke.
const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
};

// Fetches time data from the WorldTimeAPI for a given timezone.
// It calculates the 'offset' - the difference between the API's time and the user's browser time.
// This offset is used to calculate the correct time locally without needing to call the API every second.
const createClockObject = async (timezone) => {
    try {
        const response = await fetch(`${API_BASE_URL}/timezone/${timezone}`);
        if (!response.ok) throw new Error(`API fetch failed for ${timezone}`);
        const data = await response.json();
        const cityInfo = cityData.find(c => c.timezone === data.timezone) || {};
        return { ...data, ...cityInfo, offset: new Date(data.utc_datetime).getTime() - Date.now(), apiFailed: false };
    } catch (error) {
        console.warn(`${error.message}. Falling back to browser time.`);
        const cityInfo = cityData.find(c => c.timezone === timezone) || {};
        return { timezone, ...cityInfo, apiFailed: true, offset: 0 };
    }
};

// A helper function to get the current hour (0-23) in a specific timezone.
// This is used to determine if it's day or night for styling the clock cards.
const getHourInTimezone = (date, timezone) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: false,
        timeZone: timezone,
    });
    return parseInt(formatter.format(date), 10);
};

// The main function that updates all visible clocks every second.
const updateAllClocks = () => {
    const now = Date.now();
    
    // Update the main clock
    if (state.mainClock) {
        const mainTime = new Date(now + state.mainClock.offset);
        const formattedTime = formatTime(mainTime, state.mainClock.timezone);
        const formattedDate = formatDate(mainTime, state.mainClock.timezone);

        dom.mainTime.textContent = formattedTime;
        dom.mainDate.textContent = formattedDate;
        
        if (dom.fullscreenOverlay.classList.contains('active')) {
            dom.fullscreenTime.textContent = formattedTime;
            dom.fullscreenDate.textContent = formattedDate;
        }
    }
    
    // Update all the pinned city clocks
    state.pinnedClocks.forEach(clock => {
        const card = document.querySelector(`.clock-card[data-timezone="${clock.timezone}"]`);
        if (card) {
            const clockTime = new Date(now + clock.offset);
            const hourInTimezone = getHourInTimezone(clockTime, clock.timezone);
            const isDay = hourInTimezone >= 6 && hourInTimezone < 18;

            card.querySelector('.time').textContent = formatTime(clockTime, clock.timezone);
            card.querySelector('.date').textContent = formatDate(clockTime, clock.timezone, 'short');
            card.querySelector('.day-night-indicator').textContent = isDay ? '☀️' : '🌙';
            
            card.classList.toggle('card-day', isDay);
            card.classList.toggle('card-night', !isDay);
            
            const timeDifferenceEl = card.querySelector('.time-difference');
            if (timeDifferenceEl) {
                timeDifferenceEl.innerHTML = calculateTimeDifference(clock);
            }
        }
    });

    // Update the countdowns for all active alarms
    updateAlarmCountdowns();
};

// Adds a new city clock to the dashboard.
const addClock = async (timezone) => {
    if (state.pinnedClocks.some(c => c.timezone === timezone)) return; // Avoid duplicates
    const newClock = await createClockObject(timezone);
    if (newClock) {
        state.pinnedClocks.push(newClock);
        renderPinnedClocks();
        saveState();
    }
};

// Removes a city clock from the dashboard.
const removeClock = (timezone) => {
    state.pinnedClocks = state.pinnedClocks.filter(c => c.timezone !== timezone);
    renderPinnedClocks();
    saveState();
};

// Calculates and formats the time difference between a pinned clock and the main clock.
const calculateTimeDifference = (clock) => {
    const t = translations[state.settings.language];
    if (!state.mainClock || clock.utc_offset === undefined || state.mainClock.utc_offset === undefined) {
        return ''; // Not enough data to calculate
    }

    const timezoneInfo = `${clock.abbreviation || ''} UTC${clock.utc_offset}`;
    
    const mainTotalOffsetSeconds = state.mainClock.raw_offset + (state.mainClock.dst_offset || 0);
    const clockTotalOffsetSeconds = clock.raw_offset + (clock.dst_offset || 0);
    const diffSeconds = clockTotalOffsetSeconds - mainTotalOffsetSeconds;
    const diffHours = diffSeconds / 3600;

    let diffFromMainText = '';
            if (Math.abs(diffHours) > 0.01) {
                const behindOrAhead = diffHours < 0 ? t.time.behind : t.time.ahead;
                const hoursDisplay = Math.abs(diffHours).toString().replace('.5', '.5').replace('.0', '');
                const mainClockName = state.mainClock.name || 'your location';
                diffFromMainText = ` &nbsp;&nbsp; | &nbsp;&nbsp; ${hoursDisplay} hours ${behindOrAhead} ${mainClockName}`;
            }

    return `${timezoneInfo}${diffFromMainText}`;
};

// --- 3. UTILITY (STOPWATCH, TIMER, ALARM) LOGIC ---

// Stopwatch logic
const updateStopwatchDisplay = () => {
    const now = Date.now();
    const time = state.stopwatch.elapsedTime + (state.stopwatch.startTime ? now - state.stopwatch.startTime : 0);
    const ms = Math.floor((time % 1000) / 10).toString().padStart(2, '0');
    const s = Math.floor((time / 1000) % 60).toString().padStart(2, '0');
    const m = Math.floor((time / (1000 * 60)) % 60).toString().padStart(2, '0');
    const h = Math.floor(time / (1000 * 60 * 60)).toString().padStart(2, '0');
    dom.stopwatchDisplay.innerHTML = `${h}:${m}:${s}<span class="milliseconds">.${ms}</span>`;
};

const renderLaps = () => {
    dom.lapsList.innerHTML = '';
    state.stopwatch.laps.forEach((lap, index) => {
        const lapItem = document.createElement('li');
        lapItem.className = 'lap-item';
        lapItem.innerHTML = `<span class="lap-number">Lap ${index + 1}</span><span>${lap.time}</span>`;
        dom.lapsList.prepend(lapItem);
    });
};

// Timer logic
const playTimerSound = () => {
    try {
        // Use Tone.js for a pleasant sound effect
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease("C5", "0.5s", Tone.now());
        synth.triggerAttackRelease("G4", "0.5s", Tone.now() + 0.5);
    } catch (e) {
        // Fallback to a simple alert if Tone.js fails
        alert('⏰ Timer finished!');
        console.error("Tone.js could not play sound.", e);
    }
};

const updateTimerDisplay = () => {
    const s = state.timer.remainingSeconds;
    const hrs = Math.floor(s / 3600).toString().padStart(2, '0');
    const mins = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const secs = Math.floor(s % 60).toString().padStart(2, '0');
    dom.timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
};

// Alarm logic
 const playAlarmSound = (label) => {
    try {
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease("A5", "0.2s", Tone.now());
        synth.triggerAttackRelease("A5", "0.2s", Tone.now() + 0.3);
    } catch(e) { console.error("Tone.js could not play sound.", e); }
    alert(`⏰ ${label}`);
};

 const checkAlarms = () => {
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5); // Format: "HH:MM"
    let stateChanged = false;

    state.alarms.forEach(alarm => {
        if (alarm.enabled && alarm.time === currentTime) {
            if (!alarm.triggeredToday) {
                playAlarmSound(alarm.label);
                alarm.triggeredToday = true;
                stateChanged = true;
            }
        } else {
            if (alarm.triggeredToday) {
               alarm.triggeredToday = false; // Reset for the next day
               stateChanged = true;
            }
        }
    });

    if (stateChanged) saveState();
};

// This function calculates and displays the remaining time for each alarm.
const updateAlarmCountdowns = () => {
    const now = new Date();
    state.alarms.forEach(alarm => {
        const countdownEl = document.querySelector(`.alarm-card[data-id="${alarm.id}"] .alarm-countdown`);
        if (!countdownEl) return;

        if (!alarm.enabled) {
            countdownEl.textContent = ''; // Clear countdown if alarm is off
            return;
        }

        const [hours, minutes] = alarm.time.split(':');
        let alarmTime = new Date();
        alarmTime.setHours(hours, minutes, 0, 0);

        // If the alarm time for today has already passed, set it for tomorrow
        if (alarmTime < now) {
            alarmTime.setDate(alarmTime.getDate() + 1);
        }

        const diff = alarmTime - now; // Difference in milliseconds
        if (diff > 0) {
            const h = Math.floor(diff / 1000 / 60 / 60);
            const m = Math.floor((diff / 1000 / 60) % 60);
            const s = Math.floor((diff / 1000) % 60);
            countdownEl.textContent = `Rings in ${h}h ${m}m ${s}s`;
        } else {
            countdownEl.textContent = '';
        }
    });
};

// --- 4. UI RENDERING & FORMATTING ---

// Renders the list of alarms from the state.
const renderAlarms = () => {
    dom.alarmsList.innerHTML = '';
    if (!state.alarms) state.alarms = []; // Ensure alarms is an array
    state.alarms.forEach((alarm) => {
        const li = document.createElement('li');
        li.className = 'alarm-item';

        const card = document.createElement('div');
        card.className = `alarm-card ${alarm.enabled ? '' : 'disabled'}`;
        card.dataset.id = alarm.id;

        // The HTML for each alarm card, now including the countdown element.
        card.innerHTML = `
            <div class="alarm-card-details">
                <div class="alarm-card-time">${alarm.time}</div>
                <div class="alarm-card-label">${alarm.label}</div>
                <div class="alarm-countdown"></div>
            </div>
            <div class="alarm-card-controls">
                <label class="toggle-switch">
                    <input type="checkbox" class="alarm-toggle-cb" ${alarm.enabled ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
                <button class="delete-alarm-btn">✕</button>
            </div>
        `;
        li.appendChild(card);
        dom.alarmsList.appendChild(li);
    });
    updateAlarmCountdowns(); // Update countdowns immediately after rendering
};

// Renders the grid of pinned city clocks.
const renderPinnedClocks = () => {
    dom.clocksGrid.innerHTML = '';
    const t = translations[state.settings.language];

    if (state.pinnedClocks.length === 0) {
        dom.clocksGrid.innerHTML = `<p style="opacity: 0.7; grid-column: 1 / -1; text-align: center;">${t.alerts.noPinned}</p>`;
        return;
    }
    state.pinnedClocks.forEach(clock => {
        const card = document.createElement('div');
        card.className = 'clock-card';
        card.dataset.timezone = clock.timezone;
        
        card.innerHTML = `
            <div class="day-night-indicator"></div>
            <button class="remove-card-btn">✕</button>
            <div class="clock-card-header">
                <div class="clock-card-title">
                    <span class="flag">${clock.flag || '🌐'}</span>
                    <span class="city-name">${clock.name || clock.timezone.split('/').pop().replace(/_/g, ' ')}</span>
                </div>
            </div>
            <div class="time">--:--:--</div>
            <div class="date">Loading...</div>
            <div class="time-difference"></div>
        `;
        dom.clocksGrid.appendChild(card);
        card.querySelector('.remove-card-btn').addEventListener('click', () => removeClock(clock.timezone));
    });
    updateAllClocks(); // Call once to populate initial data immediately
};

const renderCalendar = () => {
    const date = state.currentCalendarDate;
    const year = date.getFullYear();
    const month = date.getMonth();
    const t = translations[state.settings.language].calendar;

    dom.calendarTitleText.textContent = `${t.months[month]} ${year}`;
    
    dom.calendarGrid.innerHTML = '';
    t.weekdays.forEach(day => {
        dom.calendarGrid.innerHTML += `<div class="calendar-day-header">${day}</div>`;
    });

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let i = 0; i < firstDayOfMonth; i++) {
        dom.calendarGrid.innerHTML += `<div></div>`;
    }

    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = i;
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayEl.classList.add('today');
        }
        dom.calendarGrid.appendChild(dayEl);
    }
};

const renderDatePicker = (targetYear) => {
    const t = translations[state.settings.language].calendar;
    dom.pickerYearInput.value = targetYear;
    dom.datePickerMonthsGrid.innerHTML = '';

    t.shortMonths.forEach((monthName, index) => {
        const monthBtn = document.createElement('button');
        monthBtn.className = 'month-btn';
        monthBtn.textContent = monthName;
        monthBtn.dataset.month = index;
        
        if (index === state.currentCalendarDate.getMonth() && targetYear === state.currentCalendarDate.getFullYear()) {
            monthBtn.classList.add('active');
        }
        
        monthBtn.addEventListener('click', () => {
            state.currentCalendarDate.setFullYear(targetYear, index, 1);
            renderCalendar();
            dom.datePickerModal.classList.remove('active');
        });
        dom.datePickerMonthsGrid.appendChild(monthBtn);
    });
};

const renderPopularCities = () => {
    const cityCloud = document.getElementById('city-cloud');
    if (!cityCloud) return;
    cityCloud.innerHTML = '';

    popularCities.forEach(city => {
        const citySpan = document.createElement('span');
        citySpan.textContent = city.name;
        citySpan.className = `city-item size-${city.size}`;
        citySpan.addEventListener('click', () => addClock(city.timezone));
        cityCloud.appendChild(citySpan);
    });
};

const applyTheme = () => {
    if (state.settings.autoTheme) {
        if (state.mainClock) {
            const hour = getHourInTimezone(new Date(Date.now() + state.mainClock.offset), state.mainClock.timezone);
            dom.body.className = (hour >= 6 && hour < 18) ? 'light-theme' : 'dark-theme';
        } else {
            dom.body.className = 'light-theme';
        }
    } else {
        dom.body.className = state.settings.manualThemeDark ? 'dark-theme' : 'light-theme';
    }
    dom.manualThemeToggle.disabled = state.settings.autoTheme;
    dom.manualThemeToggleContainer.style.opacity = state.settings.autoTheme ? 0.5 : 1;
};

const applyLanguage = () => {
    const lang = state.settings.language;
    const t = translations[lang];
    
    dom.uiText.notesTitle.textContent = t.ui.notes;
    dom.uiText.calendarSectionTitle.textContent = t.ui.calendar;
    dom.uiText.settingsModalTitle.textContent = t.ui.settings;
    dom.uiText.themeSettingsTitle.textContent = t.ui.theme;
    dom.uiText.autoThemeLabel.textContent = t.ui.autoTheme;
    dom.uiText.darkThemeLabel.textContent = t.ui.darkMode;
    dom.uiText.formatSettingsTitle.textContent = t.ui.format;
    dom.uiText.hourFormatLabel.textContent = t.ui.hourFormat;
    dom.uiText.languageSettingsTitle.textContent = t.ui.language;

    dom.citySearchInput.placeholder = t.placeholders.search;
    dom.notesArea.placeholder = t.placeholders.notes;
    dom.resetBtn.textContent = t.ui.reset;
    
    renderCalendar();
    renderPinnedClocks();
    renderPopularCities();
};

const formatTime = (date, timezone) => {
    const locale = state.settings.language === 'bn' ? 'bn-BD' : state.settings.language;
    return date.toLocaleTimeString(locale, {
        timeZone: timezone,
        hour12: !state.settings.is24Hour,
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
};

const formatDate = (date, timezone, format = 'long') => {
    const locale = state.settings.language === 'bn' ? 'bn-BD' : state.settings.language;
    return date.toLocaleDateString(locale, {
        timeZone: timezone,
        weekday: format, year: 'numeric', month: format, day: 'numeric'
    });
};

// --- 5. EVENT LISTENERS ---

// This function sets up all the interactive parts of the page.
const setupEventListeners = () => {
    const toggleModal = (modal, show) => {
        modal.classList.toggle('active', show);
    };
    
    // --- Modal & Overlay Listeners ---
    dom.mainClockContainer.addEventListener('click', () => toggleModal(dom.fullscreenOverlay, true));
    dom.closeFullscreenBtn.addEventListener('click', () => toggleModal(dom.fullscreenOverlay, false));
    dom.settingsBtn.addEventListener('click', () => toggleModal(dom.settingsModal, true));
    dom.closeSettingsBtn.addEventListener('click', () => toggleModal(dom.settingsModal, false));
    dom.menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleModal(dom.navOverlay, true)
    });

    // --- Date Picker Listeners ---
    dom.calendarTitleText.addEventListener('click', () => {
        renderDatePicker(state.currentCalendarDate.getFullYear());
        toggleModal(dom.datePickerModal, true);
    });
    dom.closeDatePickerBtn.addEventListener('click', () => toggleModal(dom.datePickerModal, false));
    
    // Close modals when clicking the overlay
    [dom.settingsModal, dom.datePickerModal, dom.navOverlay].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                toggleModal(modal, false);
            }
        });
    });

    dom.prevYearBtn.addEventListener('click', () => {
        const newYear = parseInt(dom.pickerYearInput.value) - 1;
        renderDatePicker(newYear);
    });
    dom.nextYearBtn.addEventListener('click', () => {
        const newYear = parseInt(dom.pickerYearInput.value) + 1;
        renderDatePicker(newYear);
    });
    dom.pickerYearInput.addEventListener('change', () => {
        const newYear = parseInt(dom.pickerYearInput.value);
        if (!isNaN(newYear)) {
            renderDatePicker(newYear);
        } else {
            renderDatePicker(state.currentCalendarDate.getFullYear());
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            [dom.fullscreenOverlay, dom.settingsModal, dom.navOverlay, dom.datePickerModal].forEach(modal => toggleModal(modal, false));
        }
    });

    // --- Settings Controls ---
    dom.autoThemeToggle.addEventListener('change', (e) => {
        state.settings.autoTheme = e.target.checked;
        applyTheme();
        saveState();
    });
    dom.manualThemeToggle.addEventListener('change', (e) => {
        state.settings.manualThemeDark = e.target.checked;
        applyTheme();
        saveState();
    });
    dom.hourFormatToggle.addEventListener('change', (e) => {
        state.settings.is24Hour = e.target.checked;
        updateAllClocks();
        saveState();
    });
    dom.languageSelect.addEventListener('change', (e) => {
        state.settings.language = e.target.value;
        applyLanguage();
        saveState();
    });

    // --- City Search ---
    const handleSearchInput = debounce(() => {
        const query = dom.citySearchInput.value.toLowerCase();
        dom.searchDropdown.innerHTML = '';
        if (query) {
            const filteredCities = cityData.filter(c => 
                c.name.toLowerCase().includes(query) || 
                c.country.toLowerCase().includes(query)
            );
            filteredCities.forEach(city => {
                const item = document.createElement('div');
                item.className = 'search-dropdown-item';
                item.innerHTML = `<span class="flag">${city.flag}</span> <span class="city-name">${city.name}</span>`;
                item.addEventListener('click', () => {
                    addClock(city.timezone);
                    dom.citySearchInput.value = '';
                    dom.searchDropdown.classList.remove('active');
                });
                dom.searchDropdown.appendChild(item);
            });
            dom.searchDropdown.classList.toggle('active', filteredCities.length > 0);
        } else {
            dom.searchDropdown.classList.remove('active');
        }
    });
    dom.citySearchInput.addEventListener('input', handleSearchInput);
    document.addEventListener('click', (e) => {
        if (!dom.searchContainer.contains(e.target)) {
            dom.searchDropdown.classList.remove('active');
        }
    });

    // --- Popular Timezone Listeners ---
    dom.popularCitiesContainer.querySelectorAll('.timezone-item').forEach(item => {
        item.addEventListener('click', () => {
            const tz = item.textContent;
            let ianaTimezone;
            switch(tz) {
                case 'UTC': ianaTimezone = 'Etc/UTC'; break;
                case 'GMT': ianaTimezone = 'Etc/GMT'; break;
                case 'CET': ianaTimezone = 'CET'; break;
                case 'Pacific Time': ianaTimezone = 'America/Los_Angeles'; break;
                case 'Mountain Time': ianaTimezone = 'America/Denver'; break;
                case 'Central Time': ianaTimezone = 'America/Chicago'; break;
                case 'Eastern Time': ianaTimezone = 'America/New_York'; break;
                case 'China Standard Time': ianaTimezone = 'Asia/Shanghai'; break;
                case 'India Standard Time': ianaTimezone = 'Asia/Kolkata'; break;
                default: return;
            }
            addClock(ianaTimezone);
        });
    });

    // --- Data Persistence & Calendar Nav ---
    dom.notesArea.addEventListener('input', debounce(saveState, 500));
    dom.resetBtn.addEventListener('click', () => {
        const t = translations[state.settings.language];
        if (confirm(t.alerts.resetConfirm)) {
            localStorage.removeItem('airclockState');
            window.location.reload();
        }
    });
    
    // --- OPTIMIZED: Refresh Button Listener ---
    dom.refreshCardsBtn.addEventListener('click', async () => {
        // Find clocks that failed to load initially, identified by the `apiFailed` flag.
        const clocksToRefresh = state.pinnedClocks.filter(clock => clock.apiFailed);

        if (clocksToRefresh.length === 0) return; // Nothing to do.

        dom.refreshCardsBtn.disabled = true;

        const refreshPromises = clocksToRefresh.map(clock => createClockObject(clock.timezone));
        const refreshedClocks = await Promise.all(refreshPromises);

        // Update the main state array with the newly fetched data
        refreshedClocks.forEach(refreshedClock => {
            // Find the index of the clock we just refreshed
            const index = state.pinnedClocks.findIndex(c => c.timezone === refreshedClock.timezone);
            if (index !== -1) {
                state.pinnedClocks[index] = refreshedClock; // Replace the old object
            }
        });

        renderPinnedClocks();
        dom.refreshCardsBtn.disabled = false;
    });

    dom.prevMonthBtn.addEventListener('click', () => {
        state.currentCalendarDate.setMonth(state.currentCalendarDate.getMonth() - 1);
        renderCalendar();
    });
    dom.nextMonthBtn.addEventListener('click', () => {
        state.currentCalendarDate.setMonth(state.currentCalendarDate.getMonth() + 1);
        renderCalendar();
    });

    // --- Stopwatch Event Listeners (Updated) ---
    dom.stopwatchToggleBtn.addEventListener('click', () => {
        // Check if the stopwatch is currently running by looking at the intervalId
        if (state.stopwatch.intervalId) {
            // --- STOP THE STOPWATCH ---
            clearInterval(state.stopwatch.intervalId);
            state.stopwatch.elapsedTime += Date.now() - state.stopwatch.startTime;
            state.stopwatch.intervalId = null;
            state.stopwatch.startTime = 0;
            // Update button UI to show "Start"
            dom.stopwatchToggleBtn.textContent = 'Start';
            dom.stopwatchToggleBtn.classList.remove('stop-btn');
            dom.stopwatchToggleBtn.classList.add('start-btn');
        } else {
            // --- START THE STOPWATCH ---
            state.stopwatch.startTime = Date.now();
            state.stopwatch.intervalId = setInterval(updateStopwatchDisplay, 10);
            // Update button UI to show "Stop"
            dom.stopwatchToggleBtn.textContent = 'Stop';
            dom.stopwatchToggleBtn.classList.remove('start-btn');
            dom.stopwatchToggleBtn.classList.add('stop-btn');
        }
    });

    dom.stopwatchResetBtn.addEventListener('click', () => {
        // Stop any active stopwatch
        clearInterval(state.stopwatch.intervalId);
        // Reset the stopwatch state
        state.stopwatch = { startTime: 0, elapsedTime: 0, intervalId: null, laps: [] };
        // Reset the display and lap list
        dom.stopwatchDisplay.innerHTML = `00:00:00<span class="milliseconds">.00</span>`;
        renderLaps();
        // Also reset the toggle button's state to "Start"
        dom.stopwatchToggleBtn.textContent = 'Start';
        dom.stopwatchToggleBtn.classList.remove('stop-btn');
        dom.stopwatchToggleBtn.classList.add('start-btn');
    });

    dom.stopwatchLapBtn.addEventListener('click', () => {
        // Lap button only works if the stopwatch is running
        if (state.stopwatch.intervalId) {
            const lapTime = dom.stopwatchDisplay.innerHTML;
            state.stopwatch.laps.push({ time: lapTime });
            renderLaps();
        }
    });


    // --- Timer Event Listeners ---
    dom.timerToggleBtn.addEventListener('click', () => {
        // Check if the timer is currently running by looking at the intervalId
        if (state.timer.intervalId) {
            // --- STOP THE TIMER ---
            clearInterval(state.timer.intervalId);
            state.timer.intervalId = null;
            dom.timerInputsContainer.style.display = 'flex'; // Show the input fields again
            dom.timerToggleBtn.textContent = 'Start'; // Change button text
            dom.timerToggleBtn.classList.remove('stop-btn'); // Change button color
            dom.timerToggleBtn.classList.add('start-btn');
        } else {
            // --- START THE TIMER ---
            let totalSeconds = parseInt(dom.timerHoursInput.value) * 3600 +
                               parseInt(dom.timerMinutesInput.value) * 60 +
                               parseInt(dom.timerSecondsInput.value);

            if (totalSeconds <= 0) return; // Don't start if time is zero
            
            state.timer.remainingSeconds = totalSeconds;
            dom.timerInputsContainer.style.display = 'none'; // Hide input fields
            updateTimerDisplay(); // Show the initial time immediately
            dom.timerToggleBtn.textContent = 'Stop'; // Change button text
            dom.timerToggleBtn.classList.remove('start-btn'); // Change button color
            dom.timerToggleBtn.classList.add('stop-btn');

            // Start the countdown interval
            state.timer.intervalId = setInterval(() => {
                state.timer.remainingSeconds--;
                updateTimerDisplay();
                if (state.timer.remainingSeconds <= 0) {
                    clearInterval(state.timer.intervalId);
                    state.timer.intervalId = null;
                    dom.timerInputsContainer.style.display = 'flex';
                    dom.timerToggleBtn.textContent = 'Start';
                    dom.timerToggleBtn.classList.remove('stop-btn');
                    dom.timerToggleBtn.classList.add('start-btn');
                    playTimerSound();
                }
            }, 1000);
        }
    });

    dom.timerResetBtn.addEventListener('click', () => {
        // Stop any active timer
        if (state.timer.intervalId) clearInterval(state.timer.intervalId);
        // Reset the timer state
        state.timer = { totalSeconds: 0, remainingSeconds: 0, intervalId: null };
        // Reset input fields to default
        dom.timerHoursInput.value = "0";
        dom.timerMinutesInput.value = "10";
        dom.timerSecondsInput.value = "0";
        // Show the input fields
        dom.timerInputsContainer.style.display = 'flex';
        // Reset the display
        updateTimerDisplay();
        // Make sure the toggle button is in the 'Start' state
        dom.timerToggleBtn.textContent = 'Start';
        dom.timerToggleBtn.classList.remove('stop-btn');
        dom.timerToggleBtn.classList.add('start-btn');
    });
    
    // --- Alarm Event Listeners ---
    dom.addAlarmBtn.addEventListener('click', () => {
        const time = dom.alarmTimeInput.value;
        const label = dom.alarmLabelInput.value.trim() || 'Alarm';
        if (!time || state.alarms.some(a => a.time === time)) return;

        const newAlarm = { id: Date.now(), time, label, enabled: true, triggeredToday: false };
        state.alarms.push(newAlarm);
        
        dom.alarmTimeInput.value = '';
        dom.alarmLabelInput.value = '';

        renderAlarms();
        saveState();
    });
    
    dom.alarmsList.addEventListener('click', (e) => {
        const alarmCard = e.target.closest('.alarm-card');
        if (!alarmCard) return;

        const alarmId = parseInt(alarmCard.dataset.id);
        const alarm = state.alarms.find(a => a.id === alarmId);
        if (!alarm) return;

        // Handle the delete button click
        if (e.target.classList.contains('delete-alarm-btn')) {
            state.alarms = state.alarms.filter(a => a.id !== alarmId);
            renderAlarms();
        } 
        // Handle the on/off toggle switch click
        else if (e.target.classList.contains('alarm-toggle-cb')) {
            alarm.enabled = e.target.checked;
            alarmCard.classList.toggle('disabled', !alarm.enabled);
            updateAlarmCountdowns(); // Update countdown immediately on toggle
        }
        saveState();
    });
};

// --- 6. INITIALIZATION & STATE PERSISTENCE ---

// Saves the current state of the application to the browser's localStorage.
// This allows user data (pinned clocks, notes, settings) to persist between sessions.
const saveState = () => {
    const stateToSave = {
        pinnedTimezones: state.pinnedClocks.map(c => c.timezone),
        notes: dom.notesArea.value,
        settings: state.settings,
        alarms: state.alarms
    };
    localStorage.setItem('airclockState', JSON.stringify(stateToSave));
};

// Loads the saved state from localStorage when the application starts.
const loadState = async () => {
    const savedState = JSON.parse(localStorage.getItem('airclockState'));
    if (savedState) {
        dom.notesArea.value = savedState.notes || '';
        state.settings = { ...state.settings, ...savedState.settings };
        // Ensure loaded alarms have the 'enabled' property, defaulting to true
        state.alarms = savedState.alarms ? savedState.alarms.map(a => ({...a, enabled: a.enabled !== false, triggeredToday: false })) : [];
        
        // --- OPTIMIZED: Load pinned clocks in parallel ---
        if (savedState.pinnedTimezones && savedState.pinnedTimezones.length > 0) {
           const clockPromises = savedState.pinnedTimezones.map(timezone => createClockObject(timezone));
           const loadedClocks = await Promise.all(clockPromises);
           state.pinnedClocks = loadedClocks.filter(clock => clock); // Assign the resolved clocks
        }
    }
};

const populateLanguageSelector = () => {
    dom.languageSelect.innerHTML = '';
    for(const langCode in translations) {
        const option = document.createElement('option');
        option.value = langCode;
        option.textContent = translations[langCode].name;
        dom.languageSelect.appendChild(option);
    }
}

// The main initialization function that runs when the page loads.
const init = async () => {
    // Set up language options
    populateLanguageSelector();
    // Load any saved data from previous sessions
    await loadState();
    
    // Apply the loaded settings to the UI controls
    dom.autoThemeToggle.checked = state.settings.autoTheme;
    dom.manualThemeToggle.checked = state.settings.manualThemeDark;
    dom.hourFormatToggle.checked = state.settings.is24Hour;
    dom.languageSelect.value = state.settings.language;

    // Apply language and render initial UI components
    applyLanguage();
    renderAlarms();
    
    // Determine the user's local timezone
    let initialTimezone;
    try {
        const response = await fetch(`${API_BASE_URL}/ip`);
        if (!response.ok) throw new Error("IP API failed");
        initialTimezone = (await response.json()).timezone;
    } catch (e) {
        console.warn("IP lookup failed. Using browser's local timezone as fallback.");
        initialTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    // Create the main clock object
    state.mainClock = await createClockObject(initialTimezone);
    if(state.mainClock) dom.mainLocation.textContent = state.mainClock.timezone.replace(/_/g, ' ');
    
    // Apply theme and render clocks
    applyTheme();
    renderPinnedClocks();
    // Set up all the buttons and interactive elements
    setupEventListeners();
    
    // Start the main clock update loop
    updateAllClocks();
    clockUpdateInterval = setInterval(updateAllClocks, 1000);
    
    // Start checking for alarms
    state.alarmCheckInterval = setInterval(checkAlarms, 1000);
};

// Run the app!
init();