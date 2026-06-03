import React, { useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import emailjs from "@emailjs/browser";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { EMAILJS_CONFIG } from "./emailjsConfig";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

function calcBMR(sexe, poids, taille, age) {
  const m = taille / 100;
  return sexe === "homme"
    ? 13.707 * poids + 492.3 * m - 6.673 * age + 97.607
    : 9.74 * poids + 172.9 * m - 4.737 * age + 667.054;
}

function imcCategory(imc) {
  if (imc < 18.5)
    return {
      label: "Insuffisance pondérale",
      color: "#60A5FA",
      bg: "rgba(96,165,250,0.1)",
    };
  if (imc < 25)
    return {
      label: "Poids normal",
      color: "#34D399",
      bg: "rgba(52,211,153,0.1)",
    };
  if (imc < 30)
    return { label: "Surpoids", color: "#FBBF24", bg: "rgba(251,191,36,0.1)" };
  return { label: "Obésité", color: "#F87171", bg: "rgba(248,113,113,0.1)" };
}

const ACTIVITY_LABELS = {
  1.2: "Sédentaire",
  1.375: "Légèrement actif (1–3×/sem)",
  1.55: "Modérément actif (4–5×/sem)",
  1.725: "Très actif (6×/sem ou plus)",
};
const OBJECTIF_LABELS = {
  prise: "Prise de poids",
  maintien: "Maintien",
  perte: "Perte de poids",
};

function Label({ children }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "1.8px",
        textTransform: "uppercase",
        color: "#6B7A8D",
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        background: "#0F1923",
        border: "1px solid #1E2D3D",
        borderRadius: 8,
        padding: "11px 14px",
        color: "#E8EDF2",
        fontFamily: "inherit",
        fontSize: 14,
        outline: "none",
        transition: "border 0.2s, box-shadow 0.2s",
        boxSizing: "border-box",
        ...props.style,
      }}
      onFocus={(e) => {
        e.target.style.border = "1px solid #00E5FF";
        e.target.style.boxShadow = "0 0 0 3px rgba(0,229,255,0.08)";
      }}
      onBlur={(e) => {
        e.target.style.border = "1px solid #1E2D3D";
        e.target.style.boxShadow = "none";
      }}
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        background: "#0F1923",
        border: "1px solid #1E2D3D",
        borderRadius: 8,
        padding: "11px 14px",
        color: "#E8EDF2",
        fontFamily: "inherit",
        fontSize: 14,
        outline: "none",
        transition: "border 0.2s",
        boxSizing: "border-box",
        ...props.style,
      }}
      onFocus={(e) => {
        e.target.style.border = "1px solid #00E5FF";
      }}
      onBlur={(e) => {
        e.target.style.border = "1px solid #1E2D3D";
      }}
    >
      {children}
    </select>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Row({ children }) {
  return (
    <div
      className="two-col"
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
    >
      {children}
    </div>
  );
}

function StatBox({ label, value, unit, accent }) {
  return (
    <div
      style={{
        background: accent ? "rgba(0,229,255,0.05)" : "#0A1520",
        border: `1px solid ${accent ? "rgba(0,229,255,0.35)" : "#1A2535"}`,
        borderRadius: 10,
        padding: "14px 10px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 9,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#4A5568",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "clamp(0.95rem,2.5vw,1.3rem)",
          fontWeight: 800,
          color: accent ? "#00E5FF" : "#E8EDF2",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {unit && (
        <div style={{ fontSize: 10, color: "#4A5568", marginTop: 4 }}>
          {unit}
        </div>
      )}
    </div>
  );
}

function Chip({ color, bg, children }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        padding: "3px 9px",
        borderRadius: 20,
        color,
        background: bg,
        border: `1px solid ${color}44`,
      }}
    >
      {children}
    </span>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: "1px",
        background: "linear-gradient(90deg, transparent, #1E2D3D, transparent)",
        margin: "1.25rem 0",
      }}
    />
  );
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: 10,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: "#4A5568",
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span style={{ flex: 1, height: 1, background: "#1E2D3D" }} />
      {children}
      <span style={{ flex: 1, height: 1, background: "#1E2D3D" }} />
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({
    nom: "",
    age: "",
    sexe: "homme",
    taille: "",
    poids: "",
    activite: "1.375",
    objectif: "maintien",
    seances: "3",
  });
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState({ msg: "", type: "" });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function calculate() {
    const { age, taille, poids, activite, objectif, seances } = form;

    // Basic validation
    if (
      !age ||
      !taille ||
      !poids ||
      isNaN(+age) ||
      isNaN(+taille) ||
      isNaN(+poids)
    ) {
      alert("Veuillez remplir : âge, taille et poids.");
      return;
    }

    // Height must be in cm
    if (+taille < 100 || +taille > 250) {
      alert("La taille doit être en centimètres (ex: 172 et non 1.72).");
      return;
    }

    // Weight must be in kg
    if (+poids < 30 || +poids > 300) {
      alert("Le poids doit être en kilogrammes (ex: 109).");
      return;
    }

    const a = +age,
      t = +taille,
      p = +poids,
      act = +activite,
      s = +seances || 3;
    const imc = +(p / (t / 100) ** 2).toFixed(1);
    const bmr = Math.round(calcBMR(form.sexe, p, t, a));
    const tdee = Math.round(bmr * act);
    const prise = tdee + 400;
    const perte = tdee - 400;
    const target =
      objectif === "prise" ? prise : objectif === "perte" ? perte : tdee;

    // Coach Fahd exact formulas
    const protPerKg =
      objectif === "perte" ? 2.2 : objectif === "maintien" ? 1.8 : 2.0; // prise

    const fatPerKg =
      objectif === "perte" ? 0.8 : objectif === "maintien" ? 1.0 : 1.2; // prise

    const fatG = Math.round(p * fatPerKg);
    const fatCals = fatG * 9;

    // Cap protein so carbs always get minimum 100g (400 kcal)
    const maxProtCals = target - fatCals - 400;
    const idealProtG = Math.round(p * protPerKg);
    const protG = Math.min(idealProtG, Math.round(maxProtCals / 4));
    const protCals = protG * 4;

    // Carbs: everything left
    const carbCals = Math.max(target - protCals - fatCals, 0);
    const carbG = Math.round(carbCals / 4);

    // For pie chart
    const macroSplit = {
      prot: protCals / target,
      carb: carbCals / target,
      fat: fatCals / target,
    };

    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const trainingDays = Math.min(s, 7);
    const weekCals = days.map((_, i) =>
      i < trainingDays ? target : Math.round(target * 0.88),
    );
    const isTraining = days.map((_, i) => i < trainingDays);

    const res = {
      imc,
      imcInfo: imcCategory(imc),
      bmr,
      tdee,
      prise,
      perte,
      maintien: tdee,
      target,
      protG,
      carbG,
      fatG,
      macroSplit,
      seances: s,
      days,
      weekCals,
      isTraining,
    };
    setResults(res);
    sendToCoach(res);
  }

  async function sendToCoach(res) {
    setStatus({ msg: "Envoi au coach...", type: "pending" });
    try {
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          to_email: EMAILJS_CONFIG.COACH_EMAIL,
          to_name: "Coach Fahd",
          nom: form.nom || "Anonyme",
          age: form.age,
          sexe: form.sexe === "homme" ? "Homme" : "Femme",
          taille: form.taille + " cm",
          poids: form.poids + " kg",
          activite: ACTIVITY_LABELS[form.activite],
          objectif: OBJECTIF_LABELS[form.objectif],
          seances: form.seances,
          imc: res.imc,
          imc_label: res.imcInfo.label,
          bmr: res.bmr.toLocaleString() + " kcal/j",
          tdee: res.tdee.toLocaleString() + " kcal/j",
          cible: res.target.toLocaleString() + " kcal/j",
          proteines: res.protG + "g",
          glucides: res.carbG + "g",
          lipides: res.fatG + "g",
          cal_prise: res.prise.toLocaleString() + " kcal",
          cal_maintien: res.maintien.toLocaleString() + " kcal",
          cal_perte: res.perte.toLocaleString() + " kcal",
        },
        EMAILJS_CONFIG.PUBLIC_KEY,
      );
      setStatus({ msg: "✓ Données envoyées au coach", type: "ok" });
    } catch {
      setStatus({ msg: "⚠ Erreur envoi — vérifiez EmailJS", type: "err" });
    }
  }

  const macroData = results
    ? {
        labels: [
          `Protéines ${results.protG}g`,
          `Glucides ${results.carbG}g`,
          `Lipides ${results.fatG}g`,
        ],
        datasets: [
          {
            data: [
              results.macroSplit.prot * 100,
              results.macroSplit.carb * 100,
              results.macroSplit.fat * 100,
            ],
            backgroundColor: ["#00E5FF", "#7C3AFF", "#00FFA3"],
            borderWidth: 0,
            hoverOffset: 8,
          },
        ],
      }
    : null;

  const weekData = results
    ? {
        labels: results.days,
        datasets: [
          {
            data: results.weekCals,
            backgroundColor: results.weekCals.map((_, i) =>
              results.isTraining[i] ? "#00E5FF" : "#7C3AFF",
            ),
            borderRadius: 5,
            borderSkipped: false,
          },
        ],
      }
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060E18",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        input::placeholder { color: #3A4A5A; }
        .main-grid {
          max-width: 1020px; margin: 0 auto;
          padding: 2.5rem 1.25rem; display: grid;
          grid-template-columns: 1fr 1fr; gap: 1.5rem; justify-content: center;
        }
        .main-grid.single { grid-template-columns: minmax(0, 520px); }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 768px) {
          .main-grid, .main-grid.single {
            grid-template-columns: 1fr !important;
            padding: 1rem 0.85rem !important;
          }
          .hero-section { padding: 1.75rem 1rem 1.5rem !important; }
          .hero-title { font-size: 1.75rem !important; }
          .hero-sub { font-size: 13px !important; }
          .card-inner { padding: 1.25rem !important; }
          .stat-grid { gap: 6px !important; }
          .stat-val { font-size: 1rem !important; }
          .chart-bar { height: 130px !important; }
          .chart-donut { height: 155px !important; }
        }
        @media (max-width: 420px) {
          .two-col { grid-template-columns: 1fr !important; gap: 0 !important; }
          .hero-title { font-size: 1.5rem !important; }
          .badge-text { font-size: 9px !important; letter-spacing: 2px !important; }
        }
      `}</style>

      {/* HERO */}
      <div
        className="hero-section"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "3rem 2rem 2.5rem",
          textAlign: "center",
          borderBottom: "1px solid #0D1E2E",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 300,
            background:
              "radial-gradient(ellipse, rgba(0,229,255,0.07) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(0,229,255,0.06)",
              border: "1px solid rgba(0,229,255,0.15)",
              borderRadius: 30,
              padding: "4px 14px",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#00E5FF",
                display: "block",
                boxShadow: "0 0 6px #00E5FF",
              }}
            />
            <span
              className="badge-text"
              style={{
                fontSize: 11,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#00E5FF",
                fontWeight: 600,
              }}
            >
              Nutrition & Performance
            </span>
          </div>
          <h1
            className="hero-title"
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(1.75rem,6vw,3.5rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              color: "#E8EDF2",
              margin: "0 0 12px",
            }}
          >
            Coach{" "}
            <span
              style={{
                color: "#00E5FF",
                textShadow: "0 0 30px rgba(0,229,255,0.4)",
              }}
            >
              Fahd
            </span>{" "}
            Rabaaoui
          </h1>
          <p
            className="hero-sub"
            style={{
              fontSize: 15,
              color: "#4A5568",
              fontWeight: 300,
              maxWidth: 440,
              margin: "0 auto",
            }}
          >
            Analyse nutritionnelle personnalisée · Calcul de vos besoins
            caloriques exacts
          </p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className={`main-grid${results ? "" : " single"}`}>
        {/* FORM */}
        <div
          className="card-inner"
          style={{
            background: "#0A1520",
            border: "1px solid #0D1E2E",
            borderRadius: 16,
            padding: "1.75rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 200,
              height: 200,
              background:
                "radial-gradient(circle at top right, rgba(0,229,255,0.04), transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#00E5FF",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                flex: 1,
                height: 1,
                background: "linear-gradient(90deg, #00E5FF33, transparent)",
              }}
            />
            Votre Profil
            <span
              style={{
                flex: 1,
                height: 1,
                background: "linear-gradient(90deg, transparent, #00E5FF33)",
              }}
            />
          </div>

          <Field label="Nom complet">
            <Input
              value={form.nom}
              onChange={set("nom")}
              placeholder="Votre nom complet"
            />
          </Field>
          <Row>
            <Field label="Âge">
              <Input
                type="number"
                value={form.age}
                onChange={set("age")}
                placeholder="Votre âge"
                min="10"
                max="100"
              />
            </Field>
            <Field label="Sexe">
              <Select value={form.sexe} onChange={set("sexe")}>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </Select>
            </Field>
          </Row>
          <Row>
            <Field label="Taille (cm)">
              <Input
                type="number"
                value={form.taille}
                onChange={set("taille")}
                placeholder="Votre taille en cm"
                min="100"
                max="250"
              />
            </Field>
            <Field label="Poids (kg)">
              <Input
                type="number"
                value={form.poids}
                onChange={set("poids")}
                placeholder="Votre poids en kg"
                min="30"
                max="300"
              />
            </Field>
          </Row>
          <Field label="Niveau d'activité">
            <Select value={form.activite} onChange={set("activite")}>
              <option value="1.2">Sédentaire — peu ou pas d'exercice</option>
              <option value="1.375">
                Légèrement actif — 1 à 3 fois/semaine
              </option>
              <option value="1.55">
                Modérément actif — 4 à 5 fois/semaine
              </option>
              <option value="1.725">Très actif — 6 fois/semaine ou plus</option>
            </Select>
          </Field>
          <Row>
            <Field label="Objectif">
              <Select value={form.objectif} onChange={set("objectif")}>
                <option value="prise">Prise de poids</option>
                <option value="maintien">Maintien</option>
                <option value="perte">Perte de poids</option>
              </Select>
            </Field>
            <Field label="Séances / semaine">
              <Input
                type="number"
                value={form.seances}
                onChange={set("seances")}
                placeholder="Nb de séances"
                min="0"
                max="7"
              />
            </Field>
          </Row>

          <button
            onClick={calculate}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              padding: "14px",
              background: "linear-gradient(135deg, #00C4E0, #0070FF)",
              color: "#fff",
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              boxShadow: "0 4px 24px rgba(0,180,255,0.25)",
              transition: "transform 0.15s, box-shadow 0.15s",
              touchAction: "manipulation",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(0,180,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow =
                "0 4px 24px rgba(0,180,255,0.25)";
            }}
          >
            Analyser mon profil →
          </button>

          {status.msg && (
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                textAlign: "center",
                color:
                  status.type === "ok"
                    ? "#34D399"
                    : status.type === "err"
                      ? "#F87171"
                      : "#4A5568",
              }}
            >
              {status.msg}
            </div>
          )}
        </div>

        {/* RESULTS */}
        {results && (
          <div
            className="card-inner"
            style={{
              background: "#0A1520",
              border: "1px solid #0D1E2E",
              borderRadius: 16,
              padding: "1.75rem",
            }}
          >
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#00E5FF",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  flex: 1,
                  height: 1,
                  background: "linear-gradient(90deg, #00E5FF33, transparent)",
                }}
              />
              Résultats
              <span
                style={{
                  flex: 1,
                  height: 1,
                  background: "linear-gradient(90deg, transparent, #00E5FF33)",
                }}
              />
            </div>

            <div
              className="stat-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 10,
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  background: "#0A1520",
                  border: "1px solid #1A2535",
                  borderRadius: 10,
                  padding: "14px 8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "#4A5568",
                    marginBottom: 6,
                  }}
                >
                  IMC
                </div>
                <div
                  className="stat-val"
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "1.3rem",
                    fontWeight: 800,
                    color: "#E8EDF2",
                  }}
                >
                  {results.imc}
                </div>
                <Chip color={results.imcInfo.color} bg={results.imcInfo.bg}>
                  {results.imcInfo.label}
                </Chip>
              </div>
              <StatBox
                label="BCJ — BMR"
                value={results.bmr.toLocaleString()}
                unit="kcal / jour"
              />
              <StatBox
                label="Besoin total"
                value={results.tdee.toLocaleString()}
                unit="kcal / jour"
                accent
              />
            </div>

            <SectionLabel>Objectif calorique</SectionLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 8,
                marginBottom: "1.25rem",
              }}
            >
              {[
                { key: "prise", label: "Prise", val: results.prise, icon: "↑" },
                {
                  key: "maintien",
                  label: "Maintien",
                  val: results.maintien,
                  icon: "=",
                },
                { key: "perte", label: "Perte", val: results.perte, icon: "↓" },
              ].map(({ key, label, val, icon }) => {
                const active = form.objectif === key;
                return (
                  <div
                    key={key}
                    style={{
                      background: active ? "rgba(0,229,255,0.06)" : "#060E18",
                      border: `1px solid ${active ? "rgba(0,229,255,0.4)" : "#1A2535"}`,
                      borderRadius: 10,
                      padding: "12px 6px",
                      textAlign: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        marginBottom: 4,
                        color: active ? "#00E5FF" : "#2A3A4A",
                      }}
                    >
                      {icon}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                        color: "#4A5568",
                        marginBottom: 4,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontFamily: "Syne, sans-serif",
                        fontSize: "clamp(0.75rem,2vw,0.9rem)",
                        fontWeight: 700,
                        color: active ? "#00E5FF" : "#E8EDF2",
                      }}
                    >
                      {val.toLocaleString()} kcal
                    </div>
                  </div>
                );
              })}
            </div>

            <Divider />
            <SectionLabel>Macronutriments</SectionLabel>

            <div
              className="chart-donut"
              style={{
                position: "relative",
                height: 175,
                marginBottom: "0.75rem",
              }}
            >
              <Doughnut
                data={macroData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: "70%",
                  plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: (ctx) => ctx.label } },
                  },
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  textAlign: "center",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "#E8EDF2",
                  }}
                >
                  {results.target.toLocaleString()}
                </div>
                <div
                  style={{ fontSize: 9, color: "#4A5568", letterSpacing: 1 }}
                >
                  kcal cible
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 20,
                marginBottom: "1.25rem",
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  color: "#00E5FF",
                  label: "Protéines",
                  val: results.protG + "g",
                },
                {
                  color: "#7C3AFF",
                  label: "Glucides",
                  val: results.carbG + "g",
                },
                { color: "#00FFA3", label: "Lipides", val: results.fatG + "g" },
              ].map(({ color, label, val }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: color,
                        display: "block",
                        boxShadow: `0 0 6px ${color}`,
                      }}
                    />
                    <span style={{ fontSize: 11, color: "#4A5568" }}>
                      {label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color,
                    }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>

            <Divider />
            <SectionLabel>Plan hebdomadaire</SectionLabel>

            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: "#6B7A8D",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: "#00E5FF",
                    display: "block",
                  }}
                />
                Entraînement
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: "#6B7A8D",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: "#7C3AFF",
                    display: "block",
                  }}
                />
                Repos
              </div>
            </div>

            <div
              className="chart-bar"
              style={{ position: "relative", height: 150 }}
            >
              <Bar
                data={weekData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: { color: "#0D1E2E" },
                      ticks: { color: "#2A3A4A", font: { size: 11 } },
                    },
                    y: {
                      grid: { color: "#0D1E2E" },
                      ticks: {
                        color: "#2A3A4A",
                        font: { size: 10 },
                        callback: (v) => v.toLocaleString(),
                      },
                      min: Math.round(results.tdee * 0.78),
                    },
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => ctx.raw.toLocaleString() + " kcal",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
