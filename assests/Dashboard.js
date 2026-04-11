/* ============================================================
   Sanchar-Shakti · 5G UCE Dashboard — JavaScript
   DoT Innovation Sprint 2026
   ============================================================ */

// ============================================================
//  STATE
// ============================================================
let emergencyMode = false;
let activeScenario = null;
let tickCount = 0;

// Slice data — SLA values match Slide 8 (CMC 2025 Simu5G simulation)
const slices = [
  { id:'emergency',    name:'EMERGENCY',  color:'#ff2d55', prb:95, sla:98,  sla_static:72 },
  { id:'health',       name:'HEALTHCARE', color:'#00ffcc', prb:88, sla:100, sla_static:68 },
  { id:'rail',         name:'RAIL/GOV',   color:'#00d4ff', prb:75, sla:95,  sla_static:76 },
  { id:'embb',         name:'BROADBAND',  color:'#ffd60a', prb:40, sla:91,  sla_static:78 },
  { id:'iot',          name:'IoT',        color:'#39ff87', prb:30, sla:90,  sla_static:80 },
  { id:'entertainment',name:'ENTERTAIN',  color:'#5a8db0', prb:15, sla:82,  sla_static:75 },
];

const initialPRBs = { emergency:95, health:88, rail:75, embb:40, iot:30, entertainment:15 };
const targetPRBs  = { ...initialPRBs };

const coverageNodes = [
  { node:'DELHI-gNB-01',    type:'TERRESTRIAL', status:'online' },
  { node:'MUMBAI-gNB-04',   type:'TERRESTRIAL', status:'online' },
  { node:'BENGALURU-gNB-07',type:'TERRESTRIAL', status:'online' },
  { node:'TOWER_042-GWT',   type:'TERRESTRIAL', status:'online' },
  { node:'LEO-SAT-INSAT-7B',type:'SATELLITE',   status:'satellite' },
  { node:'LEO-SAT-ONEWEB-3',type:'SATELLITE',   status:'satellite' },
  { node:'LATUR-gNB-02',    type:'TERRESTRIAL', status:'online' },
];

const auditEntries = [];
const alertEntries = [];

// ============================================================
//  INIT
// ============================================================
window.onload = function() {
  renderSLAGrid();
  renderPRBGrid();
  renderBreathingBars();
  renderCoverageTable();
  renderForecast();
  addInitialAuditEntries();
  addInitialAlerts();
  fillTRAILog();
  startClock();
  setInterval(tick, 2500);
};

// ============================================================
//  RENDER FUNCTIONS
// ============================================================
function renderSLAGrid() {
  const container = document.getElementById('sla-grid');
  container.innerHTML = slices.map(s => {
    const light = s.sla >= 95 ? 'green' : s.sla >= 85 ? 'yellow' : 'red';
    return `
      <div class="sla-row">
        <div class="sla-light ${light}"></div>
        <div class="sla-name" style="color:${s.color};min-width:80px;">${s.name}</div>
        <div class="sla-bar-bg">
          <div class="sla-bar-fill" style="width:${s.sla}%;background:${s.color};"></div>
        </div>
        <div class="sla-pct" style="color:${s.color};">${s.sla}%</div>
      </div>`;
  }).join('');
}

function renderPRBGrid() {
  const container = document.getElementById('prb-grid');
  container.innerHTML = slices.map(s => `
    <div class="slice-card" data-slice="${s.id}" id="card-${s.id}">
      <div class="slice-name">${s.name}</div>
      <div class="slice-pct" style="color:${s.color};" id="pct-${s.id}">${targetPRBs[s.id]}%</div>
      <div class="slice-label">PRB ALLOC</div>
    </div>`).join('');
}

function renderBreathingBars() {
  const container = document.getElementById('breathing-bars');
  container.innerHTML = slices.map(s => `
    <div class="b-bar-wrap">
      <div class="b-bar-container">
        <div class="b-bar-fill bar-animate" id="bar-${s.id}"
          style="height:${targetPRBs[s.id]}%;background:linear-gradient(to top,${s.color}99,${s.color});"></div>
      </div>
      <div class="b-bar-label" style="color:${s.color};">${s.id==='entertainment'?'ENTS':s.name.substring(0,5)}</div>
    </div>`).join('');
}

function renderCoverageTable() {
  const tbody = document.getElementById('coverage-tbody');
  tbody.innerHTML = coverageNodes.map(n => `
    <tr>
      <td style="font-family:'Share Tech Mono';font-size:10px;">${n.node}</td>
      <td style="font-size:10px;color:var(--text-secondary);">${n.type}</td>
      <td><span class="status-pill ${n.status}">${n.status.toUpperCase()}</span></td>
    </tr>`).join('');
}

function renderForecast() {
  const w = 600, pad = 15, now = 300;
  let actualPts = [], predPts = [];
  for (let x = pad; x <= now; x += 10) {
    const t = (x-pad)/(now-pad);
    const y = 90 - t*40 + Math.sin(t*8)*12 + Math.cos(t*5)*8;
    actualPts.push([x, Math.max(20,Math.min(130,y))]);
  }
  for (let x = now; x <= w-pad; x += 10) {
    const t = (x-now)/(w-now-pad);
    const y = 50 - t*15 + Math.sin(t*5)*6;
    predPts.push([x, Math.max(20,Math.min(130,y))]);
  }
  const toPath = pts => pts.map((p,i)=>`${i===0?'M':'L'} ${p[0]} ${p[1]}`).join(' ');
  const toArea = (pts,bY) => {
    const path=toPath(pts), last=pts[pts.length-1], first=pts[0];
    return `${path} L ${last[0]} ${bY} L ${first[0]} ${bY} Z`;
  };
  document.getElementById('actual-line').setAttribute('d', toPath(actualPts));
  document.getElementById('pred-line').setAttribute('d', toPath(predPts));
  document.getElementById('actual-area').setAttribute('d', toArea(actualPts,145));
  document.getElementById('pred-area').setAttribute('d', toArea(predPts,145));
}

function addInitialAuditEntries() {
  [
    { type:'info',      time:'10:00:01', msg:'DRL: <span class="highlight">+20% PRB</span> → HLTH slice. Trigger: IPL surge detected.' },
    { type:'warning',   time:'10:00:01', msg:'Tatkal surge: <span class="highlight">+20% PRBs</span> → Railway Slice · SHAP: event=Tatkal, w=0.87' },
    { type:'satellite', time:'10:00:28', msg:'RSRP drop @ tower_042. CHO (3GPP Rel-17) <span class="sat">NTN pre-auth triggered...</span>' },
    { type:'success',   time:'10:00:29', msg:'<span class="good">NTN tunnel active.</span> Session maintained. Zero packet loss.' },
    { type:'info',      time:'10:00:41', msg:'ENTRTN slice capped at 82%. <span class="health">URLLC SLA protected @ 100%.</span>' },
    { type:'critical',  time:'10:00:55', msg:'Cardiac monitor SLA spike detected. Emergency PRB redistribution initiated.' },
  ].forEach(e => addAuditEntry(e.type, e.time, e.msg));
  renderAuditLog();
}

function addInitialAlerts() {
  [
    { cls:'event',     icon:'🏏', text:'IPL Final detected. 578M concurrent stream forecast active.',       time:'10:00:00' },
    { cls:'anomaly',   icon:'⚠️', text:'Traffic spike on eMBB slice — 2.3σ above baseline.',               time:'10:00:12' },
    { cls:'satellite', icon:'🛰️', text:'LEO pre-authentication handshake complete. tower_042 monitored.', time:'10:00:28' },
    { cls:'ok',        icon:'✅', text:'All URLLC SLAs nominal. Cardiac monitoring secured.',               time:'10:00:41' },
  ].forEach(a => alertEntries.unshift(a));
  renderAlerts();
}

function fillTRAILog() {
  const entries = [
    '10:00:01 · PRB borrowed from ENTERTAIN → HEALTH · Amount: 20% · SHAP score: 0.91',
    '10:00:01 · PRB borrowed from ENTERTAIN → RAIL · Amount: 15% · Trigger: Tatkal',
    '10:00:28 · NTN CHO invoked for tower_042 · Latency: <2s · Session: PRESERVED',
    '10:00:41 · ENTERTAIN cap applied · Reason: URLLC protection · Duration: ongoing',
    '10:00:55 · EMERGENCY PRB uplift · +5% from eMBB · Cardiac SLA: 100%',
  ];
  document.getElementById('trai-log').innerHTML = entries.map(e =>
    `<div style="padding:6px 8px;background:rgba(0,212,255,0.05);border-radius:4px;border-left:2px solid var(--neon-blue);color:var(--text-secondary);">${e}</div>`
  ).join('');
}

// ============================================================
//  LOG HELPERS
// ============================================================
function getTimeStr() { return new Date().toTimeString().slice(0,8); }

function addAuditEntry(type, time, msg) {
  auditEntries.unshift({ type, time, msg });
  if (auditEntries.length > 20) auditEntries.pop();
}

function renderAuditLog() {
  document.getElementById('audit-log').innerHTML = auditEntries.map(e =>
    `<div class="audit-entry ${e.type}">
      <div class="audit-time">${e.time}</div>
      <div class="audit-msg">${e.msg}</div>
    </div>`).join('');
}

function renderAlerts() {
  document.getElementById('alerts-list').innerHTML = alertEntries.slice(0,6).map(a =>
    `<div class="alert-item ${a.cls}">
      <div class="alert-icon">${a.icon}</div>
      <div><div class="alert-text">${a.text}</div><div class="alert-time">${a.time}</div></div>
    </div>`).join('');
}

// ============================================================
//  TICK
// ============================================================
function tick() {
  tickCount++;
  const t = getTimeStr();
  if (!emergencyMode) {
    slices.forEach(s => {
      targetPRBs[s.id] = Math.max(5, Math.min(99, initialPRBs[s.id] + (Math.random()-0.5)*6));
    });
    updateBars();
  }
  if (tickCount % 3 === 0) {
    const msgs = [
      { type:'info',      msg:'Bi-LSTM: <span class="highlight">+5% eMBB demand</span> predicted in 4 min. Pre-allocating PRBs.' },
      { type:'success',   msg:'<span class="good">SLA check passed.</span> URLLC latency: 0.8ms. Target: &lt;1ms.' },
      { type:'info',      msg:'DRL epsilon-greedy: exploring bandwidth config #4872. Reward: +0.12.' },
      { type:'satellite', msg:'<span class="sat">LEO-SAT-INSAT-7B</span> position updated. Elevation: 42°. Link quality: GOOD.' },
    ];
    const pick = msgs[tickCount % msgs.length];
    addAuditEntry(pick.type, t, pick.msg);
    renderAuditLog();
  }
}

function updateBars() {
  slices.forEach(s => {
    const bar = document.getElementById('bar-'+s.id);
    const pct = document.getElementById('pct-'+s.id);
    if (bar) bar.style.height = targetPRBs[s.id]+'%';
    if (pct) pct.textContent = Math.round(targetPRBs[s.id])+'%';
  });
  updateSLA();
}

function updateSLA() {
  slices.forEach(s => {
    const noise = (Math.random()-0.5)*4;
    s.sla = Math.max(60, Math.min(100,
      (emergencyMode && (s.id==='emergency'||s.id==='health')) ? 100 : s.sla + noise));
  });
  renderSLAGrid();
}

// ============================================================
//  SCENARIOS
// ============================================================
function triggerScenario(name) {
  document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
  activeScenario = name;
  event.currentTarget.classList.add('active');
  const t = getTimeStr();

  if (name === 'ipl') {
    Object.assign(targetPRBs, { entertainment:82, health:100, emergency:98, embb:60, iot:28 });
    addAuditEntry('warning', t, '🏏 <span class="highlight">IPL TSUNAMI ACTIVE.</span> 578M streams. DRL borrowing 25% PRBs from ENTERTAIN → HEALTH.');
    addAuditEntry('info',    t, 'Bi-LSTM surge forecast confirmed. Tatkal window overlap risk detected.');
    alertEntries.unshift({ cls:'anomaly', icon:'🏏', text:'IPL Final: Entertainment slice saturating. PRBs redistributed to critical slices.', time:t });
    setXAI('IPL Final surge detected (578M streams). Entertainment slice saturating.',
           'Redistributing 25% PRBs from ENTERTAINMENT → HEALTHCARE to maintain URLLC SLA.',
           'Healthcare maintained at 100%. Entertainment continues at 82% — no blocking, only deprioritization.');
  } else if (name === 'tatkal') {
    Object.assign(targetPRBs, { rail:95, embb:35, entertainment:10, iot:25 });
    addAuditEntry('warning', t, '🚂 <span class="highlight">TATKAL PULSE ACTIVE.</span> 3L users/60s. IRCTC surge. SHAP: event=Tatkal, w=0.87');
    addAuditEntry('info',    t, 'DRL: +20% PRBs → Railway Slice (w=0.80). eMBB and ENTERTAIN deprioritized.');
    alertEntries.unshift({ cls:'event', icon:'🚂', text:'TATKAL WINDOW: 10:00 AM surge. 3 lakh concurrent IRCTC requests detected.', time:t });
    setXAI('Tatkal ticket window opened. 3 lakh concurrent requests in 60s.',
           'Borrowing PRBs from eMBB + Entertainment → Rail/Gov slice. SHAP weight w=0.87 (event=Tatkal).',
           'Session timeout rate reduced by ~30%. IRCTC SLA maintained at 95%.');
  } else if (name === 'tower_fail') {
    coverageNodes[3].status = 'degraded';
    renderCoverageTable();
    Object.assign(targetPRBs, { entertainment:8 });
    document.getElementById('ntn-latency').textContent = '<2s';
    document.getElementById('ntn-pkt').textContent = '0';
    addAuditEntry('critical',  t, '🌊 <span style="color:#ff2d55;">TOWER_042 SIGNAL DEGRADED.</span> Flood event. RSRP: -115dBm.');
    addAuditEntry('satellite', t, '<span class="sat">CHO (3GPP Rel-17) NTN pre-auth triggered.</span> LEO-SAT-INSAT-7B target acquired.');
    addAuditEntry('success',   t, '<span class="good">NTN tunnel active.</span> &lt;2s failover. Session preserved. Zero packet loss.');
    alertEntries.unshift({ cls:'satellite', icon:'🛰️', text:'TOWER_042 FAILURE: NTN handoff executed. <2s failover. Sessions preserved via LEO.', time:t });
    setXAI('TOWER_042 signal dropped below RSRP threshold (-115dBm). Flood event detected.',
           'CHO (3GPP Rel-17/19) pre-authenticated LEO satellite link BEFORE terrestrial RSRP dropped. Make-Before-Break. URLLC stays terrestrial — LEO latency 20–40ms incompatible with &lt;1ms budget.',
           'Zero packet loss. &lt;2s failover. Session IP preserved across terrestrial-NTN boundary.');
  } else if (name === 'surgery') {
    Object.assign(targetPRBs, { health:100, emergency:99, entertainment:5, embb:25, iot:15 });
    slices.find(s => s.id==='health').sla = 100;
    addAuditEntry('critical', t, '❤️ <span class="health">REMOTE SURGERY ALERT.</span> URLLC w=1.0. Cardiac monitoring — &lt;1ms latency budget.');
    addAuditEntry('info',     t, 'DRL: max priority w=1.0. ALL available PRBs redirected → URLLC HEALTH slice.');
    alertEntries.unshift({ cls:'ok', icon:'❤️', text:'SURGERY MODE: URLLC w=1.0 guaranteed. All non-critical traffic deprioritized.', time:t });
    setXAI('Remote cardiac surgery in progress. URLLC latency budget: &lt;1ms. Priority weight: w=1.0 (Telemedicine).',
           'DRL reward function sets wₛ=1.0 for Healthcare. Entertainment (w=0.10) and IoT (w=0.20) capped at minimum. URLLC stays terrestrial only.',
           'URLLC SLA: 100%. Latency: &lt;1ms. Patient connectivity guaranteed. Zero NTN involvement for surgery traffic.');
  }

  updateBars(); renderSLAGrid(); renderAuditLog(); renderAlerts();
}

function toggleEmergency() {
  emergencyMode = !emergencyMode;
  const btn = document.getElementById('emBtn');
  const t = getTimeStr();
  if (emergencyMode) {
    btn.classList.add('active');
    btn.textContent = '🚨 EMERGENCY ACTIVE — CLICK TO DEACTIVATE';
    Object.assign(targetPRBs, { emergency:99, health:99, rail:95, iot:10, embb:5, entertainment:2 });
    slices.find(s=>s.id==='emergency').sla = 100;
    slices.find(s=>s.id==='health').sla    = 100;
    addAuditEntry('critical', t, '🚨 <span style="color:#ff2d55;font-weight:700;">EMERGENCY MODE ACTIVATED.</span> 100% resources → Emergency + Health. Entertainment suspended.');
    alertEntries.unshift({ cls:'anomaly', icon:'🚨', text:'EMERGENCY MODE: All PRBs redirected. Police, Fire, Hospital at maximum priority.', time:t });
    setXAI('Emergency Mode manually activated.',
           'Manual override: all PRBs pushed to Emergency (w=1.0) and Healthcare (w=1.0). Entertainment/gaming suspended.',
           'Emergency SLA: 100%. All critical services guaranteed. Compliant with Telecom Act 2023 §8.');
    document.getElementById('h-ntn').textContent = '🚨 EMRG';
    document.getElementById('h-ntn').style.color = 'var(--red-alert)';
  } else {
    btn.classList.remove('active');
    btn.textContent = '🚨 EMERGENCY MODE';
    Object.assign(targetPRBs, initialPRBs);
    document.getElementById('h-ntn').textContent = 'LEO ACTIVE';
    document.getElementById('h-ntn').style.color = 'var(--purple)';
    document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
    activeScenario = null;
    addAuditEntry('success', t, '<span class="good">Emergency mode deactivated.</span> Normal slice weights restored. System nominal.');
  }
  updateBars(); renderSLAGrid(); renderAuditLog(); renderAlerts();
}

function setXAI(decision, reason, result) {
  document.getElementById('xai-text').innerHTML =
    `<span class="xai-decision">DECISION:</span> ${decision}<br><br>
     <span class="xai-reason">REASON:</span> ${reason}<br><br>
     <span style="color:var(--neon-green);">RESULT:</span> ${result}`;
}

// ============================================================
//  TRAI OVERLAY
// ============================================================
function showTRAI() { document.getElementById('trai-overlay').classList.add('visible'); }
function hideTRAI() { document.getElementById('trai-overlay').classList.remove('visible'); }

// ============================================================
//  CLOCK
// ============================================================
function startClock() {
  function update() {
    document.getElementById('clock').textContent = new Date().toTimeString().slice(0,8);
  }
  update();
  setInterval(update, 1000);
}