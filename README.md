# CSE Clubs Council Recruitment Portal

Official recruitment portal for the **CSE Clubs Council**, featuring a modern dark glassmorphic design system, an executive Admin Panel with real-time analytics, and a serverless backend powered by **Google Apps Script** and **Google Sheets**.

---

## 🌟 Key Features

- **Modern Premium UI**: Built with pure HTML5, CSS3, Vanilla JS, dark theme glassmorphism, glowing blue accents, and responsive layout.
- **Mandatory Instructions Modal**: Displays 11 recruitment guidelines on first load, locking portal interaction until accepted by the applicant.
- **Dynamic Card Dashboard**: 5 Leadership Roles (Vice President, Events Head, Technical Head, Social Media Head, Documentation Head) and 10 Clubs (Coding, Innovation, CyberSentinel, Animatrix, Magazine, Fusion & Fashion, Nature, Yoga, AspireX, AppNova).
- **Interactive Forms & Real-time Validation**: Validates VTU Number (e.g. `1VT21CS001`), email, 10-digit phone, academic year eligibility, and character counters.
- **WhatsApp Channel Integration**: Direct callout for applicants to join the official CSE Council WhatsApp Channel (`https://whatsapp.com/channel/0029VbDBib02phHQ142idH1V`) during and after application.
- **Live Registration Countdown & Controls**: Controlled dynamically from Google Sheets (`OPEN` / `CLOSED` toggle & scheduled close timer).
- **Executive Admin Panel (`/admin/`)**:
  - Authenticated via Google Apps Script against the `Admins` sheet.
  - Analytics dashboard with club-wise application breakdown meters, role preference charts, and year/dept demographics.
  - Controls to open/close registrations and set opening/closing dates.
  - Latest submissions table with instant search filter & **CSV Export**.
- **Duplicate Prevention**: Rejects duplicate submissions per candidate (`VTU Number` + `Role/Club`).

---

## 📁 Project Layout

```
├── index.html               # Public recruitment portal layout
├── style.css                # Glassmorphic dark theme CSS design system
├── script.js                # Core JS module (validation, timer, search, API calls)
├── google-apps-script.gs    # Backend API code to paste into Google Apps Script (Code.gs)
├── README.md                # Deployment and configuration guide
└── admin/
    ├── index.html           # Admin panel layout & analytics dashboard
    ├── style.css            # Admin dashboard glassmorphic styling
    └── script.js            # Admin authentication, stats engine, settings toggle, CSV export
```

---

## 🚀 Step 1: Google Apps Script Backend Setup

1. Open [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet titled **`CSE Clubs Council Database`**.
2. In the top menu, click **Extensions** > **Apps Script**.
3. Clear any default code in `Code.gs` and paste the full contents of [`google-apps-script.gs`](google-apps-script.gs).
4. Save the script project (`Ctrl + S` or `Cmd + S`).
5. Run the `setupSheets` function once inside Apps Script to automatically generate all required sheets and header rows:
   - Click the function dropdown in the top bar -> select **`setupSheets`** -> click **Run**.
   - Grant the necessary Google account permissions.
6. Deploy the Web App:
   - Click **Deploy** (top right) > **New deployment**.
   - Select type: **Web App** (click gear icon next to "Select type").
   - Set **Description**: `Recruitment API v1`.
   - Set **Execute as**: **`Me`**.
   - Set **Who has access**: **`Anyone`**.
   - Click **Deploy**.
7. Copy the generated **Web App URL** (starts with `https://script.google.com/macros/s/...`).

---

## 🔗 Step 2: Connecting Apps Script URL to Frontend

1. Open `script.js` in your workspace.
2. Update line 10 with your Web App URL:
   ```javascript
   const API_URL = "https://script.google.com/macros/s/YOUR_EXEC_ID_HERE/exec";
   ```
3. Open `admin/script.js`.
4. Update line 10 with the exact same URL:
   ```javascript
   const API_URL = "https://script.google.com/macros/s/YOUR_EXEC_ID_HERE/exec";
   ```

---

## 📊 Step 3: Google Sheets Database Structure

The Google Apps Script automatically initializes and manages the following tabs:

### 1. `Leadership Applications`
| Column Header | Description |
| :--- | :--- |
| `Timestamp` | Submission date & time |
| `Category` | Set to `Leadership` |
| `Position Applied` | Title of leadership role |
| `VTU Number` | Applicant USN |
| `Full Name` | Candidate name |
| `Department` | CSE, ISE, AIML, DS, etc. |
| `Year` | 2nd Year / 3rd Year |
| `Section` | Section letter (A, B, C, etc.) |
| `Phone` | 10-digit mobile number |
| `Email` | Email address |
| `Skills` | Technical & leadership skills |
| `Experience` | Past leadership & event experience |
| `GitHub`, `LinkedIn`, `Portfolio` | Social & project links |
| `Why Role` | Motivation |
| `Contribution` | Proposed initiatives |
| `Availability` | Availability commitment |
| `Status` | `Submitted` |
| `Remarks` | Admin notes |

### 2. `Club Applications`
| Column Header | Description |
| :--- | :--- |
| `Timestamp` | Submission date & time |
| `Category` | Set to `Club` |
| `Club Name` | Name of targeted club |
| `Applying As` | Club Head, Vice Head, or Member |
| `VTU Number` | Applicant USN |
| `Full Name` | Candidate name |
| `Department` | Department |
| `Year` | Academic Year |
| `Section` | Section |
| `Phone`, `Email` | Contact details |
| `Skills`, `Experience`, `Why Join`, `Contribution` | Application responses |
| `GitHub`, `LinkedIn`, `Portfolio` | Links |
| `Status`, `Remarks` | Admin status & notes |

### 3. `Settings`
| Key | Value |
| :--- | :--- |
| `registration_status` | `OPEN` or `CLOSED` |
| `registration_open` | ISO opening timestamp |
| `registration_close` | ISO closing timestamp |

### 4. `Admins`
| Username | Password |
| :--- | :--- |
| `admin` | `ChangeMe123!` |

---

## 🔐 Admin Credentials Management

To change the admin credentials:
1. Open your Google Sheet titled `CSE Clubs Council Database`.
2. Navigate to the **`Admins`** tab.
3. Edit the `Username` or `Password` column values directly in row 2!
4. The admin login screen will immediately validate against these updated credentials upon login.

*(Note: Fallback credentials in `admin/script.js` (`DEFAULT_ADMIN_USER` and `DEFAULT_ADMIN_PASS`) apply when `API_URL` is unconfigured).*

---

## 🌐 Step 4: Hosting & Deployment

You can host this static portal for free on GitHub Pages, Netlify, or Vercel:

### Option A: GitHub Pages
1. Push this workspace code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Deploy CSE Clubs Council Recruitment Portal"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
2. Go to your GitHub repository -> **Settings** > **Pages**.
3. Under **Build and deployment** > **Branch**, select `main` branch and `/ (root)` folder.
4. Click **Save**. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`!
5. Admin Panel will be available at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/admin/`.

### Option B: Netlify
1. Log in to [Netlify](https://app.netlify.com).
2. Drag and drop your project folder directly into the Netlify dashboard.
3. Netlify will instant-deploy your portal with an HTTPS URL.

### Option C: Vercel
1. Install Vercel CLI or connect via GitHub on [Vercel](https://vercel.com).
2. Run `vercel` in your project root directory and follow the simple prompts to deploy.

---

## 💬 WhatsApp Channel

For recruitment updates, interview calls, and announcements, candidates are directed to join:
👉 **[Official CSE Council WhatsApp Channel](https://whatsapp.com/channel/0029VbDBib02phHQ142idH1V)**

---

## 📄 License & Credits
Designed & Developed for the **CSE Clubs Council, Department of Computer Science & Engineering**.
