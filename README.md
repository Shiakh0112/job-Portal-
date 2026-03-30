# 🚀 DreamHire - Job Portal

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Click_Here-6a38c2?style=for-the-badge)](https://your-deploy-link.netlify.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/your-username/your-repo-name)

> 🔗 **Live Demo:** [https://your-deploy-link.netlify.app](https://your-deploy-link.netlify.app)
> 
> 📂 **GitHub Repo:** [https://github.com/your-username/your-repo-name](https://github.com/your-username/your-repo-name)

A fully functional frontend Job Portal web application built with **HTML, CSS, and JavaScript**. Users can browse jobs, apply for positions, take skill assessment tests, and manage their profile — all without any backend server.

---

## 📁 Project Structure

```
main/
├── index.html              # Home page (main landing page)
├── script.js               # Home page JavaScript
├── style.css               # Home page CSS
│
├── html/
│   ├── login.html          # Login page
│   ├── register.html       # Registration page
│   ├── job.html            # Job listing page with filters
│   ├── job-details.html    # Individual job detail page
│   ├── profile.html        # User profile page
│   ├── about.html          # About page
│   └── Services.html       # Services page
│
├── css/
│   ├── style.css           # Job page CSS
│   ├── auth.css            # Login & Register page CSS
│   ├── job-details.css     # Job details page CSS
│   └── profile.css         # Profile page CSS
│
├── js/
│   ├── auth.js             # Login & Register logic
│   ├── main.js             # Job listing, filter, pagination logic
│   ├── job-details.js      # Job detail view & apply logic
│   └── profile.js          # Profile view & edit logic
│
├── data/
│   └── jobs.json           # 135+ job listings data
│
├── test/
│   ├── contests.html       # Skill test listing page
│   ├── test.html           # Quiz/test taking page
│   ├── test.json           # 20 skill tests with questions
│   ├── testscript.js       # Test logic (load, quiz, timer, score)
│   └── style.css           # Test pages CSS
│
└── assets/
    ├── google.png
    ├── amazon.png
    ├── microsoft.png
    ├── linkedin.png
    ├── figma.png
    ├── twitter.png
    ├── bag.png
    ├── testskill.png
    ├── steps-bg.png
    ├── offer-1.jpg
    ├── offer-2.jpg
    └── offer-3.jpg
```

---

## 🌐 Pages Detail

### 1. `index.html` — Home Page
- **Navbar** with logo, navigation links, Login/Register buttons (logged out) and Profile/Logout (logged in)
- **Hero Section** with feature cards (pyramid layout)
- **Steps Section** — 4 steps to get hired
- **Explore Categories** — 8 job categories
- **NCAT Test Banner** — skill test promotion
- **Skill Test Slider** — Swiper.js carousel with test cards + popup modal
- **Top Companies** section
- **What We Offer** section
- **Trusted Clients** — infinite scroll animation
- **Footer** with links and contact info
- **ScrollReveal** animations on scroll

### 2. `html/login.html` — Login Page
- Navbar with Home button
- Email & Password form
- Validates credentials from `localStorage`
- On success → redirects to `index.html`
- Shows error message on wrong credentials

### 3. `html/register.html` — Register Page
- Navbar with Home button
- Full Name, Email, Password, Confirm Password form
- Checks if email already exists
- Password match validation
- On success → auto login + redirect to `index.html`

### 4. `html/job.html` — Job Listing Page
- Full navbar with auth state
- **Search bar** — search by company, role, or skills
- **Filter Sidebar** (slide-in panel) with:
  - Salary Range (checkboxes)
  - Location (dynamic from data)
  - Role (dynamic from data)
  - Work Mode (Remote / In-office / Hybrid)
  - Shift (Day / Night / Flexible)
- **Job Cards Grid** — shows 6 jobs per page
- **Pagination** with smart page numbers
- **Results count** display
- **Clear Filters** button

### 5. `html/job-details.html` — Job Detail Page
- Full job information: description, responsibilities, qualifications
- Technical & soft skills tags
- Job summary sidebar (salary, vacancies, type, experience)
- **Apply Now** button — saves application to `localStorage`
- Duplicate application prevention
- Login prompt for unauthenticated users

### 6. `html/profile.html` — Profile Page
- Displays user name, email, phone, location, job role, experience, bio, skills
- **Edit Profile** modal — update all profile fields
- **Applied Jobs** section — shows all jobs user applied for
- **Test Scores** section — shows completed test results with percentage
- Score color coding: green (≥80%), yellow (≥60%), red (<60%)

### 7. `test/contests.html` — Skill Tests Listing
- Shows all 20 available skill tests as cards
- Each card shows: title, description, duration, skills, question count
- Shows "Completed - Score: X%" if already attempted
- "Start Test" / "Retake Test" button
- Login required to start a test

### 8. `test/test.html` — Quiz Page
- Loads selected test from `localStorage`
- Shows one question at a time with 4 options (radio buttons)
- **Timer** — counts down from test duration
- Previous / Next navigation
- Auto-submit on timer end
- **Result screen** — shows score percentage and message
- Saves best score to `localStorage`

---

## ⚙️ JavaScript Files Detail

### `script.js` — Home Page Logic
| Function | Description |
|----------|-------------|
| `checkAuthStatus()` | Shows/hides Login-Register or Profile-Logout based on localStorage |
| `logoutLink` event | Clears user from localStorage, redirects to login page |
| `loadTest()` | Fetches `test.json`, renders Swiper cards, handles popup modal |
| ScrollReveal | Animates sections on scroll |
| Swiper init | Initializes both testimonial and test card swipers |

### `js/auth.js` — Authentication Logic
| Function | Description |
|----------|-------------|
| `generateUserId()` | Creates random unique ID for new users |
| Login handler | Finds user in `localStorage.users`, sets `localStorage.user` |
| Register handler | Validates form, checks duplicate email, saves new user |

### `js/main.js` — Job Listing Logic
| Function | Description |
|----------|-------------|
| `fetchJobs()` | Fetches `jobs.json`, populates filters, renders jobs |
| `populateFilters()` | Dynamically creates location & role checkboxes from data |
| `filterJobs()` | Filters by search text + all 5 checkbox filters simultaneously |
| `getChecked(name)` | Helper to get all checked checkbox values by name |
| `renderJobs()` | Renders current page job cards as HTML |
| `renderPagination()` | Smart pagination with dots for large page counts |
| `updateResultsCount()` | Updates "X jobs found" counter |
| `clearFilters()` | Resets all checkboxes and search input |
| `viewDetails(id)` | Navigates to job-details page with job ID in URL |

### `js/job-details.js` — Job Detail Logic
| Function | Description |
|----------|-------------|
| `fetchJobs()` | Loads jobs.json data |
| `getJobIdFromUrl()` | Reads `?id=` from URL params |
| `renderJobDetails(id)` | Builds full job detail HTML |
| `applyForJob(id)` | Saves application to `localStorage.applications` |
| `checkAuthStatus()` | Shows/hides auth buttons |

### `js/profile.js` — Profile Logic
| Function | Description |
|----------|-------------|
| `checkAuthStatus()` | Redirects to login if not logged in, displays user info |
| `fetchJobs()` | Loads jobs data to match with applied job IDs |
| `renderAppliedJobs()` | Shows applied job cards with date |
| `renderTestScores()` | Shows test results sorted by date |
| `editProfileBtn` event | Opens edit modal with current data |
| `editProfileForm` submit | Updates user object in localStorage |

### `test/testscript.js` — Test Logic
| Function | Description |
|----------|-------------|
| `loadTests()` | Fetches test.json, renders test cards with completion status |
| `startQuiz()` | Loads selected test from localStorage, initializes quiz |
| `displayQuestion()` | Shows current question with radio options |
| `startTimer()` | Countdown timer, auto-submits on 0 |
| `nextQuestion()` | Validates answer, moves to next or submits |
| `previousQuestion()` | Goes back to previous question |
| `submitQuiz()` | Calculates score, shows result, saves to localStorage |
| `saveTestScore()` | Saves/updates best score in localStorage |

---

## 🗄️ Data Files

### `data/jobs.json` — Job Data
- **135+ job listings** from companies like Google, Microsoft, Amazon, Meta, Apple, TCS, Infosys, Wipro, etc.
- Each job object contains:

```json
{
  "id": 1,
  "companyName": "Microsoft",
  "logo": "https://logo.clearbit.com/microsoft.com",
  "vacancies": 5,
  "monthlySalary": "35000-45000",
  "jobType": "full time",
  "jobTiming": "dayshift",
  "workMode": "hybrid",
  "experienceRequired": "2 years",
  "role": "Software Engineer",
  "position": "Mid",
  "category": "Engineering",
  "description": "...",
  "qualifications": [...],
  "skillsRequired": [...],
  "softSkillsRequired": [...],
  "responsibilities": [...],
  "location": "Hyderabad, India",
  "website": "https://www.microsoft.com",
  "contactEmail": "careers@microsoft.com"
}
```

### `test/test.json` — Skill Test Data
- **20 skill tests** available
- Each test contains:

```json
{
  "id": 1,
  "title": "Frontend Web Developer Test",
  "description": "...",
  "duration": "30 min",
  "questions": 25,
  "skills": ["HTML", "CSS", "JavaScript"],
  "image": "https://...",
  "testQuestions": [
    {
      "question": "Which HTML5 element...",
      "options": ["<nav>", "<navbar>", ...],
      "correctAnswer": "<nav>"
    }
  ]
}
```

**Available Tests:**
| # | Test Title | Duration | Questions |
|---|-----------|----------|-----------|
| 1 | Frontend Web Developer | 30 min | 25 |
| 2 | Backend Node.js Developer | 35 min | 28 |
| 3 | Full Stack MERN | 40 min | 30 |
| 4 | React.js Developer | 30 min | 25 |
| 5 | Java Programmer | 35 min | 30 |
| 6 | Python Developer | 30 min | 26 |
| 7 | Data Analyst | 40 min | 35 |
| 8 | Database MySQL | 25 min | 22 |
| 9 | Cyber Security Basics | 35 min | 30 |
| 10 | DevOps Engineer | 40 min | 30 |
| 11 | UI/UX Design Fundamentals | 25 min | 20 |
| 12 | Android Developer | 35 min | 28 |
| 13 | iOS Swift Developer | 35 min | 28 |
| 14 | Data Structures & Algorithms | 45 min | 35 |
| 15 | Machine Learning Basics | 40 min | 30 |
| 16 | Product Manager | 30 min | 25 |
| 17 | QA Tester | 30 min | 25 |
| 18 | Digital Marketing | 25 min | 24 |
| 19 | Networking Concepts | 35 min | 30 |
| 20 | Communication Skills | 20 min | 20 |

---

## 💾 localStorage Data Structure

All data is stored in browser's `localStorage` (no backend required):

| Key | Type | Description |
|-----|------|-------------|
| `user` | Object | Currently logged-in user `{id, name, email, ...profile}` |
| `users` | Array | All registered users with passwords |
| `applications` | Array | Job applications `{userId, jobId, appliedAt}` |
| `testScores` | Array | Test results `{userId, testId, score, percentage, completedAt}` |
| `currentTest` | Object | Temporarily stores selected test before quiz starts |

---

## 🎨 CSS Files Detail

### `style.css` (Home page)
- CSS variables for colors, shadows, transitions
- Navbar styles (fixed, responsive, mobile hamburger)
- Hero section with pyramid card layout
- Steps, Explore, Jobs, Offer sections
- Client infinite scroll animation
- Swiper card styles
- Popup modal styles
- Footer styles
- Responsive breakpoints: 560px, 768px, 1024px

### `css/style.css` (Job page)
- Search bar with glassmorphism effect
- Filter sidebar (slide-in from left)
- Accordion filter sections
- Job card grid layout
- Pagination styles
- Responsive design

### `css/auth.css` (Login/Register)
- Centered card layout
- Form input styles
- Error/success message styles

### `css/job-details.css`
- Two-column layout (main content + sidebar)
- Skills tag styles
- Apply button styles

### `css/profile.css`
- Profile info display
- Applied jobs grid
- Test score cards with color coding
- Edit modal styles

---

## 🔗 External Libraries Used

| Library | Version | Purpose |
|---------|---------|---------|
| [Remixicon](https://remixicon.com/) | 4.2.0 | Icons (menu, home, phone, etc.) |
| [Font Awesome](https://fontawesome.com/) | 6.4.0 | Icons (search, briefcase, etc.) |
| [Swiper.js](https://swiperjs.com/) | 11 | Carousel/slider for test cards |
| [ScrollReveal](https://scrollrevealjs.org/) | Latest | Scroll animations on home page |
| [Clearbit Logo API](https://clearbit.com/) | - | Company logos via URL |

---

## 🔐 Authentication Flow

```
Register → Save to localStorage.users → Auto login → Home
Login    → Check localStorage.users  → Set localStorage.user → Home
Logout   → Remove localStorage.user  → Redirect to login page
```

- Passwords stored in plain text in localStorage (frontend-only demo)
- No JWT or session tokens used
- Auth state checked on every page load

---

## 🔍 Filter System (job.html)

Filters work in combination — all active filters must match:

```
Final Result = Search AND Salary AND Location AND Role AND WorkMode AND Shift
```

- Checkboxes trigger filter instantly on change
- Multiple values in same filter = OR logic (e.g., Remote OR Hybrid)
- Different filter types = AND logic

---

## 📱 Responsive Design

| Breakpoint | Layout |
|-----------|--------|
| > 768px | Full desktop navbar, horizontal layout |
| 560px - 768px | Tablet adjustments |
| < 560px | Mobile hamburger menu, stacked layout |

---

## 🚀 How to Run

1. Download or clone the project
2. Open `index.html` in any browser
3. No server or installation required — pure HTML/CSS/JS

> **Note:** The `fetch()` calls for JSON files require a local server (like VS Code Live Server) to work properly due to CORS restrictions.

---

## 📌 Key Features Summary

- ✅ User Registration & Login (localStorage)
- ✅ Job Search with real-time filtering
- ✅ 5 filter types: Salary, Location, Role, Work Mode, Shift
- ✅ Pagination (6 jobs per page)
- ✅ Job Detail page with Apply functionality
- ✅ Duplicate application prevention
- ✅ User Profile with edit functionality
- ✅ Applied Jobs history
- ✅ 20 Skill Assessment Tests
- ✅ Timer-based quiz with auto-submit
- ✅ Test score tracking (best score saved)
- ✅ Responsive design (mobile + desktop)
- ✅ Smooth animations (ScrollReveal + CSS)
- ✅ Navbar auth state management on all pages

---

## 👨‍💻 Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Flexbox, Grid, Animations, CSS Variables
- **Vanilla JavaScript** — DOM manipulation, Fetch API, localStorage
- **JSON** — Data storage for jobs and tests
