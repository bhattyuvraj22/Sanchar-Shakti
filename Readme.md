# Sanchar-Shakti · 5G Unified Continuity Engine

> *"Every day at 10:00 AM, the digital heart of India skips a beat. We are here to fix that."*

**AI-Driven Sovereign Intelligence for India's Critical 5G Infrastructure**

---

[![DoT Innovation Sprint 2026](https://img.shields.io/badge/DoT%20Innovation%20Sprint-2026-blue?style=for-the-badge)](https://dot.gov.in)
[![Theme: Smart Connectivity](https://img.shields.io/badge/Theme-Smart%20Connectivity-green?style=for-the-badge)]()
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen?style=for-the-badge)](https://bhattyuvraj22.github.io/sanchar-shakti/)

---

## 🏛️ Submission Details

| Field | Detail |
|---|---|
| **Hackathon** | DoT Innovation Sprint 2026 |
| **Organizer** | Department of Telecommunications, Ministry of Communications, Government of India |
| **Theme** | Smart Connectivity |
| **Innovator** | Yuvraj Bhatt · IIT Guwahati |
| **Contact** | yuvrajbhatt135@gmail.com · +91 9927146611 |

---

## 🌐 Live Demo

> **[👉 Click here to open the Interactive Dashboard](https://YOUR-USERNAME.github.io/sanchar-shakti/)**

This GitHub repository serves as the **live demo** for Sanchar-Shakti's static simulation dashboard. No installation needed — open the link above in any modern browser to interact with the AI engine in real time.

The demo showcases:
- Real-time 5G network slice visualization
- AI-driven PRB reallocation across 6 slices
- NTN satellite failover simulation
- TRAI-compliant audit trail with SHAP explainability

---

## 🧠 What is Sanchar-Shakti?

Sanchar-Shakti (Sanskrit: *Power of Communication*) is a sovereign AI engine designed to eliminate India's recurring 10:00 AM 5G congestion crisis — when millions of users simultaneously hit the network. It operates as a **4-layer intelligent continuity stack** built on top of India's 5G infrastructure:

| Layer | Technology | Function |
|---|---|---|
| 1 · Predictive | Bi-LSTM | 72-hr history → 5-min demand heatmap per slice |
| 2 · Decision | DRL Agent (ε-greedy) | Reallocates PRBs across 6 network slices in real-time |
| 3 · Continuity | NTN CHO (3GPP Rel-17/19) | LEO satellite fallback — Make-Before-Break, <2s failover |
| 4 · Visibility | TRAI Audit Dashboard | SHAP-explained, timestamped, reversible AI decisions |

---

## ⚡ Interactive Scenarios (Try in Demo)

Click any scenario in the live dashboard to watch Sanchar-Shakti respond in real time:

| Scenario | Trigger | What UCE Does |
|---|---|---|
| 🏏 IPL Final Tsunami | 578M concurrent streams | Borrows PRBs from Entertainment → Healthcare |
| 🚂 Tatkal Pulse | 3L IRCTC users in 60s | Boosts Rail/Gov slice (w=0.87), caps eMBB |
| 🌊 Rural Tower Failure | RSRP drop, flood event | CHO NTN handoff — zero packet loss, <2s |
| ❤️ Remote Surgery Alert | URLLC w=1.0 | Maximum PRBs to Healthcare, terrestrial only |
| 🚨 Emergency Mode | Manual override | All resources → Emergency + Health slices |

---

## 📊 Simulation Results

Benchmarked on **Simu5G** (CMC 2025):

| Metric | Static Slicing | Sanchar-Shakti (DRL) |
|---|---|---|
| Average SLA Compliance | 75% | **92%** ✅ |
| Healthcare (URLLC) | 68% | **100%** ✅ |
| Emergency Services | 72% | **98%** ✅ |
| NTN Failover Latency | N/A | **<2 seconds** ✅ |
| Packet Loss on Handoff | N/A | **0** ✅ |

---

## 📁 Repository Structure

```
sanchar-shakti/
├── index.html          ← 🌐 Live demo entry point (open this)
├── assets/
│   ├── dashboard.css   ← Styles and CSS variables
│   └── dashboard.js    ← Simulation logic, scenarios, rendering
├── pitch-deck.pdf      ← Full DoT submission proposal
└── README.md
```


---

## 🛠️ Tech Stack

`Bi-LSTM` · `Deep Reinforcement Learning` · `3GPP Rel-17/19 NTN CHO` · `O-RAN` · `free5GC` · `OAI` · `Simu5G` · `SHAP` · `React` · `WebSocket`

---

## 📄 References

- Nokia MBiT 2026 — India 5G traffic data
- CMC 2025 `doi:10.32604` — DRL simulation results
- IJNRD Jun 2025 — Rural telemedicine uplift via NTN
- 3GPP TS 38.821 — NTN NR standard
- free5GC NTN 2025 — 5G core NTN simulation

---

<div align="center">

**Sanchar-Shakti** · DoT Innovation Sprint 2026  
Department of Telecommunications · Ministry of Communications · Government of India

*Built with 🇮🇳 for India's digital future*

</div>