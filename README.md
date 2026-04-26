# 🎓 CampusConnect — Automated Campus Ambassador Management Platform

> **AICore Connect Hackathon | UnsaidTalks | Submission Deadline: 26 April 2026**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Click_Here-4F46E5?style=for-the-badge)](https://campusconnect.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Public_Repo-181717?style=for-the-badge&logo=github)](https://github.com/YOUR_USERNAME/campusconnect)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 📽️ Demo Video

> **Click the thumbnail below to watch the full walkthrough (hosted on Google Drive)**

[![CampusConnect Demo Video](https://img.shields.io/badge/▶_Watch_Demo_Video-Google_Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/YOUR_VIDEO_FILE_ID/view)

> 📁 **Google Drive Folder (Proof Storage Demo):** [View Shared Folder](https://drive.google.com/drive/folders/YOUR_FOLDER_ID)

_The screen recording demonstrates: Organization setup → Ambassador onboarding → Task creation → Proof upload to Google Drive → Leaderboard update → GitHub Profile Analysis._

---

## 📌 Problem Statement

Organizations and startups running Campus Ambassador (CA) programs fall back on spreadsheets, WhatsApp groups, and manual forms — creating a fragmented experience that frustrates ambassadors and overwhelms managers. Valuable ambassadors disengage when they lack clarity, recognition, and structure.

**CampusConnect solves this** by providing a centralized platform where organizations onboard ambassadors, assign challenges, track engagement, and where ambassadors earn recognition for every contribution they make.

---

## ✨ Features

### For Organizations (Admin)
| Feature | Description |
|---------|-------------|
| 🏢 Org Onboarding | Create organization, get unique 6-char invite code |
| 📋 Task Manager | Create/edit/close tasks (Referral, Social Post, Event, Content) with points & deadlines |
| ✅ Proof Review | Review ambassador-submitted proofs (uploaded to Google Drive) — approve or reject |
| 📊 Analytics Dashboard | Real-time stats: completion rates, engagement timeline, college breakdown |
| 🏆 Leaderboard | See top performers ranked by points — filter by week/month/all-time |
| 👥 Ambassador Directory | Searchable table of all ambassadors with export to CSV |

### For Campus Ambassadors
| Feature | Description |
|---------|-------------|
| 🎯 My Tasks | View all assigned tasks with deadlines, submit proof via file or link |
| ☁️ Google Drive Proof | Files uploaded directly to organization's Google Drive folder |
| 🔥 Points & Streaks | Earn points on task completion; streak bonuses for consistent activity |
| 🏅 Badges | Earn 6 unique badges (First Blood, On Fire, Rocketeer, Megaphone, Connector, Star Ambassador) |
| 📈 Leaderboard | Live ranked leaderboard — see your rank vs. peers |
| 🔍 GitHub Analyzer | **AI-powered GitHub profile analysis — recruiter-readiness score in < 2 minutes** |

### 🤖 AI-Powered GitHub Profile Analyzer
Enter your GitHub username and get:
- ✅ **Overall Profile Score (0–100)** with recruiter grade (A/B/C/D)
- 📁 **Repos to highlight vs. archive** (with specific reasoning)
- 📝 **README quality score** per repo + improvement suggestions
- 👀 **What recruiters notice first** (pinned repos, bio, avatar)
- 🛣️ **3–5 prioritized action items** to become recruiter-ready

---

## 🛠️ Tech Stack

```
Frontend:  React 18 + Vite + Tailwind CSS + shadcn/ui + Recharts
Backend:   Node.js + Express.js (REST API)
Database:  MongoDB Atlas
Auth:      JWT (JSON Web Tokens) + bcrypt
Storage:   Google Drive API v3 (proof file uploads)
AI:        Anthropic Claude API (GitHub profile analysis)
Hosting:   Vercel (frontend) + Railway (backend)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Google Cloud Console project with Drive API enabled
- Anthropic API key (or OpenAI)
- GitHub Personal Access Token (optional, raises rate limits)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/campusconnect.git
cd campusconnect
```

### 2. Setup Backend

```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values (see Environment Variables section below)
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
```

### 4. Open in Browser

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## 🔐 Environment Variables

### Backend `/server/.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/campusconnect

# JWT
JWT_SECRET=your_super_secret_jwt_key_256_bits_long
JWT_EXPIRES_IN=7d

# Google Drive API
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/drive/callback

# AI (Anthropic Claude)
ANTHROPIC_API_KEY=sk-ant-your_anthropic_api_key

# GitHub (optional — increases API rate limit from 60 to 5000 req/hr)
GITHUB_TOKEN=ghp_your_github_pat

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Frontend `/client/.env`

```env
VITE_API_URL=http://localhost:5000
```

---

## ☁️ Google Drive Setup Guide

> **This is required for proof file uploads to work.**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project → Enable **Google Drive API**
3. Go to **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
4. Set Authorized redirect URI to: `https://your-backend.railway.app/api/drive/callback`
5. Copy `Client ID` and `Client Secret` into your `.env`
6. When Admin registers and connects Drive, they are prompted to authorize — this creates a shared org folder at: `CampusConnect/{OrgName}/`
7. All ambassador proof uploads go into: `CampusConnect/{OrgName}/{TaskTitle}/{AmbassadorName}_{timestamp}.ext`

**Demo Google Drive Folder (read-only):** [Click Here](https://drive.google.com/drive/folders/YOUR_DEMO_FOLDER_ID)

---

## 📂 Project Structure

```
campusconnect/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/            # shadcn/ui base components
│   │   │   ├── Leaderboard/
│   │   │   ├── TaskCard/
│   │   │   └── BadgeDisplay/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── admin/         # Dashboard, Tasks, Analytics, Ambassadors
│   │   │   └── ambassador/    # Dashboard, Tasks, Profile, GitHub Analyzer
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # API client, utils
│   │   └── App.jsx
│   ├── .env.example
│   └── package.json
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── models/            # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Organization.js
│   │   │   ├── Task.js
│   │   │   └── Submission.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── org.js
│   │   │   ├── tasks.js
│   │   │   ├── gamification.js
│   │   │   ├── github.js
│   │   │   └── drive.js
│   │   ├── middleware/
│   │   │   ├── auth.js        # JWT verification
│   │   │   └── roleGuard.js   # Admin/Ambassador role check
│   │   ├── services/
│   │   │   ├── pointsEngine.js
│   │   │   ├── badgeEngine.js
│   │   │   ├── driveService.js
│   │   │   └── githubAnalyzer.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
├── README.md
└── LICENSE
```

---

## 🎮 Gamification System

### Points

| Action | Points |
|--------|--------|
| Task Completion | As defined per task (10–500) |
| 7-Day Streak Bonus | +10% of task points |
| First Task Completed | +25 bonus points |
| Referral Converted | +50 points |
| Early Submission (before 50% deadline) | +15 points |

### Badges

| Badge | Trigger |
|-------|---------|
| 🥇 First Blood | Complete your first task |
| 🔥 On Fire | Maintain a 7-day activity streak |
| 🚀 Rocketeer | Reach top 3 on leaderboard |
| 📣 Megaphone | Complete 5 social post tasks |
| 🤝 Connector | 3 successful referrals |
| ⭐ Star Ambassador | Earn all 5 badges above |

---

## 🔌 API Reference

### Auth
```
POST   /api/auth/register      Register user (admin/ambassador)
POST   /api/auth/login         Login → JWT
POST   /api/auth/logout        Invalidate session
GET    /api/auth/me            Get current user
```

### Tasks
```
GET    /api/tasks              List tasks
POST   /api/tasks              Create task (admin)
PUT    /api/tasks/:id          Update task (admin)
POST   /api/tasks/:id/submit   Submit proof (multipart/form-data)
PUT    /api/tasks/:id/submissions/:subId   Approve/Reject (admin)
```

### Gamification
```
GET    /api/leaderboard        Ranked list (?period=week|month|all)
GET    /api/ambassador/:id/points    Points history
GET    /api/ambassador/:id/badges    Earned badges
```

### GitHub Analyzer
```
GET    /api/github/analyze?username=torvalds    AI profile analysis
```

### Google Drive
```
GET    /api/drive/connect       Initiate OAuth flow
GET    /api/drive/callback      OAuth callback
POST   /api/drive/upload        Upload proof file → Drive link
```

---

## 🧪 Demo Credentials

> Try the live app without signup:

| Role | Email | Password |
|------|-------|----------|
| Admin | `demo@campusconnect.app` | `Demo@1234` |
| Ambassador | `ambassador@campusconnect.app` | `Demo@1234` |

---

## 🏆 Hackathon Evaluation Alignment

| Criterion | Weight | How We Address It |
|-----------|--------|-------------------|
| **Impact** | 20% | GitHub analyzer gives recruiter-readiness report in < 2 min. Solves real CA fragmentation problem. |
| **Innovation** | 20% | AI-powered GitHub scoring + auto proof verification via Drive API. Unique gamification layer. |
| **Technical Execution** | 20% | Clean monorepo, proper REST API, JWT auth, Drive integration, AI analysis. This README. |
| **User Experience** | 25% | **Hosted on Vercel (public URL)**. Responsive Tailwind UI. Clear feedback on every user action. |
| **Presentation** | 15% | Screen-recording video embedded above. Clear demo flow covering all features. |

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd client
vercel --prod
# Set env var: VITE_API_URL=https://your-backend.railway.app
```

### Backend (Railway)
```bash
cd server
railway up
# Add all .env variables in Railway dashboard
```

---

## 🤝 Contributing

This project was built for the AICore Connect Hackathon by UnsaidTalks. If you'd like to extend it:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Contact

**Hackathon Organizer:** UnsaidTalks — [www.unsaidtalks.com](https://www.unsaidtalks.com)
**WhatsApp:** +91-7303573374
**Email:** info@unsaidtalks.com
**Submission Portal:** [Unstop](https://unstop.com)

---

<p align="center">
  Built with ❤️ for <strong>AICore Connect Hackathon</strong> by UnsaidTalks<br/>
  <em>Making community-led marketing structured, scalable, and measurable.</em>
</p>
"# CampusConnect" 
