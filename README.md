# 🌺 AyurDiet — Ayurvedic Diet Management Software

> Smart India Hackathon Project | Full Stack MERN Application  
> Personalized diet plans based on ancient Ayurvedic principles

---

## 🌿 Features

| Feature | Description |
|---|---|
| **Prakriti Assessment** | 10-question quiz to determine your Vata, Pitta, or Kapha constitution |
| **Personalized Diet Plans** | Complete meal schedules tailored to your dosha |
| **Food Library** | Searchable database of 50+ Ayurvedic foods with dosha effects |
| **Health Log & Tracker** | Daily wellness tracking with energy, sleep, mood, digestion scores |
| **Seasonal Guide** | Seasonal dietary recommendations aligned with nature's rhythms |
| **Herb Recommendations** | Ayurvedic herbs and supplements based on your constitution |
| **User Profiles** | BMI calculator, health goals, allergy management |

---

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router, Recharts, React Hot Toast
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (JSON Web Tokens)
- **Styling**: Custom CSS with Cormorant Garamond & Jost fonts

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Setup Backend

```bash
cd ayurvedic-diet-app/backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

Backend runs on: `http://localhost:5000`

### 2. Setup Frontend

```bash
cd ayurvedic-diet-app/frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

### 3. Environment Variables (backend/.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ayurvedic_diet
JWT_SECRET=your_very_secure_secret_key
NODE_ENV=development
```

---

## 📁 Project Structure

```
ayurvedic-diet-app/
├── backend/
│   ├── models/
│   │   ├── User.js           # User schema with prakriti
│   │   ├── Food.js           # Ayurvedic food database
│   │   ├── DietPlan.js       # Personalized diet plans
│   │   └── HealthLog.js      # Daily wellness tracking
│   ├── routes/
│   │   ├── auth.js           # Register, Login, Get Me
│   │   ├── users.js          # Profile management
│   │   ├── prakriti.js       # Assessment quiz + scoring
│   │   ├── diet.js           # Diet plan generation
│   │   ├── foods.js          # Food library
│   │   └── healthLogs.js     # Wellness logging & stats
│   ├── middleware/
│   │   └── auth.js           # JWT protection middleware
│   ├── server.js             # Express app entry point
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── context/
        │   └── AuthContext.js  # Global auth + API state
        ├── components/
        │   └── Navbar.js       # Navigation bar
        ├── pages/
        │   ├── Login.js        # Auth pages
        │   ├── Register.js
        │   ├── Dashboard.js    # Main dashboard
        │   ├── PrakritiTest.js # Dosha quiz
        │   ├── DietPlan.js     # Personalized meal plan
        │   ├── FoodLibrary.js  # Browse Ayurvedic foods
        │   ├── HealthLog.js    # Daily tracking + charts
        │   ├── SeasonalGuide.js # Seasonal eating guide
        │   └── Profile.js      # User profile
        ├── App.js              # Routes & structure
        ├── App.css             # Global styles
        └── index.js
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Prakriti
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/prakriti/questions` | Get all 10 quiz questions |
| POST | `/api/prakriti/assess` | Submit answers & get dosha |

### Diet
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/diet/plan` | Get personalized plan (auth) |
| GET | `/api/diet/recommendations/:prakriti` | Get dosha recommendations |
| GET | `/api/diet/seasonal` | Get current seasonal guide |

### Foods
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/foods` | List all foods |
| GET | `/api/foods/dosha/:dosha` | Filter by dosha-balancing |

### Health Logs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health-logs` | Get user's recent logs |
| POST | `/api/health-logs` | Create daily log |
| GET | `/api/health-logs/stats` | Get 7-day averages |

---

## 🎨 Design Philosophy

The UI follows an Ayurvedic aesthetic with:
- **Saffron & turmeric tones** — warmth and nourishment
- **Forest greens** — nature and healing  
- **Parchment backgrounds** — ancient wisdom
- **Cormorant Garamond** serif font — refinement and tradition
- **Jost** sans-serif — modern accessibility

---

## 🔮 Future Enhancements

- [ ] AI-powered meal suggestions using ML
- [ ] Recipe database with cooking instructions
- [ ] Doctor/Vaidya consultation booking
- [ ] Community forums and success stories
- [ ] Mobile app (React Native)
- [ ] Integration with fitness trackers
- [ ] Multi-language support (Hindi, Marathi, etc.)
- [ ] Panchakarma treatment guides

---

## 📜 Ayurvedic Doshas

| Dosha | Elements | Characteristics | Imbalance Signs |
|---|---|---|---|
| **Vata** 🌬️ | Air + Space | Creative, quick, adaptable | Anxiety, insomnia, constipation |
| **Pitta** 🔥 | Fire + Water | Sharp, intelligent, ambitious | Anger, inflammation, acidity |
| **Kapha** 🌊 | Earth + Water | Stable, loving, nurturing | Lethargy, weight gain, congestion |

---

*Built with ❤️ for Smart India Hackathon 2024*
