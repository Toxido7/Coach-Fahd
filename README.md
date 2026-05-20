# Coach Fahd Rabaaoui — Analyseur Nutritionnel

## 🚀 Setup in 3 steps

### 1. Install dependencies

```bash
npm install
```

### 2. Configure EmailJS

Open `src/emailjsConfig.js` and replace:

- `YOUR_SERVICE_ID` → from emailjs.com > Email Services
- `YOUR_TEMPLATE_ID` → from emailjs.com > Email Templates
- `YOUR_PUBLIC_KEY` → from emailjs.com > Account > API Keys
- `YOUR_EMAIL@gmail.com` → your email address

**EmailJS Template variables you can use:**
`{{to_name}}`, `{{to_email}}`, `{{imc}}`, `{{bmr}}`, `{{tdee}}`, `{{cible}}`,
`{{proteines}}`, `{{glucides}}`, `{{lipides}}`, `{{objectif}}`, `{{activite}}`, etc.

### 3. Run locally

```bash
npm run dev
```

---

## 🌐 Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm install -g vercel
vercel
```

### Option B — GitHub + Vercel (recommended)

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Add Environment Variables in Vercel (Project → Settings → Environment Variables):
   - VITE_EMAILJS_SERVICE_ID
   - VITE_EMAILJS_TEMPLATE_ID
   - VITE_EMAILJS_PUBLIC_KEY
   - VITE_EMAILJS_COACH_EMAIL
4. Vercel auto-detects Vite — just click Deploy ✅

---

## 🧮 Formulas used

### BCJ Homme (Mifflin-St Jeor)

```
BCJ = (13.707 × poids) + (492.3 × taille_m) - (6.673 × âge) + 97.607
```

### BCJ Femme

```
BCJ = (9.740 × poids) + (172.9 × taille_m) - (4.737 × âge) + 667.054
```

### Activité multipliers

| Level                       | Multiplier |
| --------------------------- | ---------- |
| Sédentaire                  | × 1.2      |
| Légèrement actif (1-3×/sem) | × 1.375    |
| Modérément actif (4-6×/sem) | × 1.55     |
| Très actif                  | × 1.725    |

### Objectifs

- Prise de poids : TDEE + 300 kcal
- Maintien : TDEE
- Perte de poids : TDEE - 300 kcal

### Macros split

- Protéines : 30% (4 kcal/g)
- Glucides : 45% (4 kcal/g)
- Lipides : 25% (9 kcal/g)

---

## 📁 Project structure

```
coach-fahd/
├── src/
│   ├── App.jsx          ← Main component (all logic + UI)
│   ├── emailjsConfig.js ← YOUR EMAILJS IDs go here
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```
