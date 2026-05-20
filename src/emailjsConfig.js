// ============================================================
//  EMAILJS CONFIGURATION
//  1. Go to https://www.emailjs.com → create free account
//  2. Add a Gmail service → copy Service ID
//  3. Create one template → copy Template ID
//  4. Account → API Keys → copy Public Key
// ============================================================

const getEnv = (key) => {
  const value = import.meta.env[key];
  if (!value) {
    console.warn(`Missing ${key}. Add it to .env or Vercel env vars.`);
  }
  return value || "";
};

export const EMAILJS_CONFIG = {
  SERVICE_ID: getEnv("VITE_EMAILJS_SERVICE_ID"),
  TEMPLATE_ID: getEnv("VITE_EMAILJS_TEMPLATE_ID"),
  PUBLIC_KEY: getEnv("VITE_EMAILJS_PUBLIC_KEY"),
  COACH_EMAIL: getEnv("VITE_EMAILJS_COACH_EMAIL"),
};

// ============================================================
//  TEMPLATE variables to use in EmailJS:
//  {{to_name}}     - Client name
//  {{nom}}         - Client name
//  {{age}}         - Age
//  {{sexe}}        - Homme / Femme
//  {{taille}}      - Height
//  {{poids}}       - Weight
//  {{activite}}    - Activity level
//  {{objectif}}    - Goal
//  {{seances}}     - Sessions/week
//  {{imc}}         - BMI
//  {{imc_label}}   - BMI category
//  {{bmr}}         - Base metabolic rate
//  {{tdee}}        - Total daily energy
//  {{cible}}       - Target calories
//  {{proteines}}   - Protein grams
//  {{glucides}}    - Carb grams
//  {{lipides}}     - Fat grams
//  {{cal_prise}}   - Weight gain calories
//  {{cal_maintien}}- Maintenance calories
//  {{cal_perte}}   - Weight loss calories
// ============================================================
