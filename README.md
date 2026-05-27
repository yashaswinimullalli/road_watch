## 📌 Problem Statement

India's road infrastructure suffers from a critical accountability gap. Potholes, damaged roads, and poor maintenance cause thousands of accidents annually — yet citizens have no effective, transparent way to report issues, identify responsible authorities, or track resolution progress.

**Road Sathi** bridges this gap by combining AI-powered damage analysis, GPS-based road classification, and community-driven reporting into a single, transparent accountability platform.

---

## 🚀 What is Road Sathi?

Road Sathi is a full-stack, AI-integrated web application that allows citizens to:

- **Detect and report** road damage using image upload and GPS location
- **Classify roads** as NH / SH / MDR / Other to identify the responsible authority
- **Analyze damage severity** using AI image analysis
- **Generate official complaint letters** automatically
- **Track complaints** on a live dashboard with poll/support voting
- **Prevent duplicates** through intelligent issue detection

The platform promotes **community-driven road transparency** by making every complaint visible, trackable, and actionable.

---

## 🎯 Core MVP Features

| Feature | Description |
|---|---|
| 📍 **GPS Location Detection** | Auto-detects user location for precise issue mapping |
| 🗺️ **Overpass API Road Identification** | Identifies the exact road using OpenStreetMap data |
| 🏷️ **Road Type Classification** | Classifies roads as NH / SH / MDR / Other Road |
| 🤖 **AI Road Damage Analysis** | Analyzes uploaded images for visible road damage |
| 📊 **Severity & Test Score Detection** | Generates damage severity level and a structured test score |
| 🔍 **Transparency Data Mapping** | Maps road ownership and maintenance responsibility |
| 📝 **Complaint Letter Generation** | Auto-generates formal complaint letters to responsible authorities |
| 🗳️ **Poll / Support Vote System** | Citizens can upvote issues to indicate community impact |
| 🔁 **Duplicate Issue Detection** | Prevents redundant complaints for the same road issue |
| 📋 **Dashboard Tracking System** | Live complaint tracking with status and review navigation |
| 📱 **Mobile Responsive UI** | Fully responsive design optimized for all screen sizes |

---

## 🛠️ Tech Stack

### Frontend
- **React** – Component-based UI framework
- **Tailwind CSS** – Utility-first responsive styling

### Backend
- **Node.js** – Runtime environment
- **Express.js** – RESTful API framework

### Database
- **MongoDB Atlas** – Cloud-hosted NoSQL database

### AI / ML Service
- **Python** – Core AI scripting language
- **FastAPI / Flask** – AI microservice API layer
- **AI Image Analysis** – Road damage detection, severity scoring, condition analysis

### External APIs
- **Overpass API** – Road type identification via OpenStreetMap
- **Reverse Geocoding API** – Converts GPS coordinates to readable addresses

---

## 🏗️ System Architecture

### 🌐 Full System Flow
<img width="1024" height="1536" alt="image" src="https://github.com/user-attachments/assets/cb016eb0-3a04-4dd9-9153-a14c824de71d" />


---

### 🤖 AI Analysis Pipeline



---



> **Duplicate detection:** matches complaints by GPS location + road ID. Duplicates don't create new entries — they boost the existing issue's community support count, keeping the dashboard clean and impact-ranked.

---



## 📁 Folder Structure

```
road_watch/
│
├── AI/                              
│   ├── app/                         
│   │   ├── routes/analyze.py        # 🤖 AI Analysis API route
│   │   ├── services/detector.py      # 🔍 YOLOv8 Model loader & damage classifier
│   │   ├── services/priority.py      # ⚖️ Severity & Priority score calculation logic
│   │   └── main.py                  # 🚀 FastAPI service setup & lifespan manager
│   └── run.py                       # ⚡ script to run the AI service
│
├── Roadwatch_Frontend/              
│   └── src/
│       ├── components/              
│       │   ├── UploadImage.jsx      # 📸 Camera/Image uploader & location grabber
│       │   ├── RoadReport.jsx       # 📊 UI display for AI report card & ownership mapping
│       │   └── LetterEditor.jsx     # 📝 Citizen complaint letter editor & PDF download
│       ├── pages/                   
│       │   ├── Home.jsx             # 💬 Interactive Chatbot layout (main UI page)
│       │   └── ReportDetails.jsx    # 📋 Individual report tracking details page
│       └── App.jsx                  # 🛣️ Frontend routing configuration
│
└── backend/                         
    └── src/
        ├── config/db.js             # 🗄️ MongoDB connection file
        ├── controllers/
        │   └── process.controller.js # ⚙️ Core orchestrator (handles GPS reverse geocoding, 
        │                              Overpass OSM queries, AI service calls, and letter saves)
        ├── models/                  # 📐 Mongoose collection models
        │   ├── Road.js              #   - OSM Road metadata (ownership, type: NH/SH/MDR)
        │   ├── RoadDamage.js        #   - Complaint status, image upload path, severity, votes
        │   └── TestScore.js         #   - Detailed test metrics & AI output values
        ├── routes/api.routes.js     # 🌐 Backend Express endpoints mapping
        └── app.js                   # 🚀 Node.js / Express entry point

```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js >= 18.x
- Python >= 3.9
- MongoDB Atlas account
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/road-sathi.git
cd road-sathi
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
AI_SERVICE_URL=http://localhost:8000
OVERPASS_API_URL=https://overpass-api.de/api/interpreter
```

Run the backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd Roadwatch_Frontend
npm install
```



Run the frontend:

```bash
npm run dev
```

---

### 4. AI Service Setup

```bash
cd AI
pip install -r requirements.txt
```

Run the AI service:

```bash
uvicorn main:app --reload --port 8000
```

---

### 5. MongoDB Connection

- Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Whitelist your IP and create a database user
- Paste the connection string into `MONGO_URI` in `/backend/.env`

---

## 🔭 Future Scope

- 🏛️ **Real Government API Integration** — Direct complaint submission to NHAI, PWD, and state highway portals
- 📡 **Live Complaint Status Tracking** — Real-time updates from authorities on resolution progress
- 🌐 **Multilingual Support** — Regional language accessibility for broader citizen reach
- 📊 **Real-Time Civic Analytics** — City-level road health dashboards for administrators and journalists

---

## 💡 What Makes Road Sathi Unique

- **AI + GPS + Civic Accountability** — Three powerful systems combined into one seamless flow
- **Road Authority Mapping** — Citizens know exactly *who* is responsible for each road
- **Community Upvoting** — Issues with high support get prioritized visibility
- **Zero Redundancy** — Duplicate detection keeps data clean and focused
- **Hackathon-Grade Architecture** — Scalable, modular, and production-ready from day one

---

## 📄 License

[MIT](LICENSE)

---

<div align="center">
  <strong>Built with ❤️ for better roads and greater accountability.</strong><br/>
  <em>Road Sathi — Because Every Pothole Has a Story, and Every Citizen Has a Voice.</em>
</div>
