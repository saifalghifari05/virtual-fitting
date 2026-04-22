import React, { useState } from 'react';

// ─── Prompt Builders ──────────────────────────────────────────────────────────

function buildBodyPrompt(data) {
  const gender = data.jenisKelamin === 'pria' ? 'male' : 'female';
  const skin =
    {
      putih: 'fair light skin',
      'sawo matang': 'medium olive Southeast Asian skin',
      gelap: 'dark brown skin',
    }[data.warnKulit] || 'medium skin';
  const build =
    { kurus: 'slim slender', ideal: 'average normal', gemuk: 'plus size full' }[
      data.posturTubuh
    ] || 'average';
  return `Full body fashion mannequin illustration of a ${gender} person. ${build} body build, ${skin}. Height ${data.tinggiBadan}cm, weight ${data.beratBadan}kg, chest ${data.lingkarDada}cm, waist ${data.lingkarPinggang}cm, hips ${data.lingkarPinggul}cm. Neutral front-facing standing pose, arms slightly away from body. Wearing plain white fitted undergarment. Clean white background. Professional fashion sketch style, elegant fashion illustration, suitable for clothing visualization. Full body visible from head to toe.`;
}

function buildGamisPrompt(bodyData, gamisData) {
  const gender = bodyData.jenisKelamin === 'pria' ? 'male' : 'female';
  const skin =
    {
      putih: 'fair light skin',
      'sawo matang': 'medium olive skin',
      gelap: 'dark brown skin',
    }[bodyData.warnKulit] || 'medium skin';
  const build =
    { kurus: 'slim', ideal: 'average', gemuk: 'plus size' }[
      bodyData.posturTubuh
    ] || 'average';
  const modelMap = {
    'a-line': 'A-line silhouette flaring gently from waist',
    "syar'i": 'loose fully covering Syari style with extra volume',
    casual: 'relaxed casual everyday style',
    'semi-formal': 'semi-formal elegant style',
    'pesta/formal': 'formal party wear with elegant details',
  };
  return `Professional fashion catalog photo of a ${gender} model wearing an Indonesian gamis Islamic long robe dress. ${build} body build, ${skin}, height ${
    bodyData.tinggiBadan
  }cm. Gamis design: ${
    modelMap[gamisData.modelGamis] || gamisData.modelGamis
  }, ${gamisData.warnaUtama} color, ${
    gamisData.motif || 'solid no pattern'
  } pattern, ${gamisData.modelKerah} neckline collar, ${
    gamisData.modelLengan
  } sleeves, ${gamisData.panjangGamis} length${
    gamisData.bahanKain ? `, ${gamisData.bahanKain} fabric` : ''
  }${
    gamisData.detailTambahan ? `, ${gamisData.detailTambahan}` : ''
  }. Clean pure white background, full body front view, professional fashion illustration, realistic fabric draping and texture, fashion catalog quality image.`;
}

// ─── Hugging Face API ─────────────────────────────────────────────────────────

async function callHuggingFace(hfToken, prompt, onStatus) {
  const { HfInference } = await import('@huggingface/inference');
  const hf = new HfInference(hfToken);

  onStatus('Mengirim ke Hugging Face AI…');

  const blob = await hf.textToImage({
    model: 'black-forest-labs/FLUX.1-schnell',
    inputs: prompt,
    parameters: { num_inference_steps: 4 },
  });

  onStatus('Memproses gambar…');

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ─── Reusable Fields ──────────────────────────────────────────────────────────

function SelectField({ label, name, value, onChange, options, required }) {
  return (
    <div className="field-wrap">
      <label className="field-label">
        {label} {required && <span className="req">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="field-select"
        required={required}
      >
        <option value="">— Pilih —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function TardaTailorApp() {
  const [hfToken, setHfToken] = useState('');
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  const [bodyImageB64, setBodyImageB64] = useState(null);
  const [gamisImageB64, setGamisImageB64] = useState(null);
  const [namaCustomer, setNamaCustomer] = useState('');

  const [bodyForm, setBodyForm] = useState({
    jenisKelamin: 'wanita',
    tinggiBadan: '',
    beratBadan: '',
    lingkarDada: '',
    lingkarPinggang: '',
    lingkarPinggul: '',
    warnKulit: 'sawo matang',
    posturTubuh: 'ideal',
  });
  const [gamisForm, setGamisForm] = useState({
    modelGamis: '',
    warnaUtama: '',
    motif: '',
    modelKerah: '',
    modelLengan: '',
    panjangGamis: '',
    bahanKain: '',
    detailTambahan: '',
  });

  const updateBody = (e) =>
    setBodyForm({ ...bodyForm, [e.target.name]: e.target.value });
  const updateGamis = (e) =>
    setGamisForm({ ...gamisForm, [e.target.name]: e.target.value });

  const handleGenerateBody = async () => {
    const req = [
      'tinggiBadan',
      'beratBadan',
      'lingkarDada',
      'lingkarPinggang',
      'lingkarPinggul',
    ];
    if (req.some((k) => !bodyForm[k]))
      return setError('Lengkapi semua field bertanda *');
    setError('');
    setLoading(true);
    try {
      const b64 = await callHuggingFace(
        hfToken,
        buildBodyPrompt(bodyForm),
        setLoadingMsg
      );
      setBodyImageB64(b64);
      setStep(2);
    } catch (e) {
      setError('Error: ' + e.message);
    }
    setLoading(false);
    setLoadingMsg('');
  };

  const handleGenerateGamis = async () => {
    const req = [
      'modelGamis',
      'warnaUtama',
      'modelKerah',
      'modelLengan',
      'panjangGamis',
    ];
    if (req.some((k) => !gamisForm[k]))
      return setError('Lengkapi semua field bertanda *');
    setError('');
    setLoading(true);
    try {
      const b64 = await callHuggingFace(
        hfToken,
        buildGamisPrompt(bodyForm, gamisForm),
        setLoadingMsg
      );
      setGamisImageB64(b64);
      setStep(4);
    } catch (e) {
      setError('Error: ' + e.message);
    }
    setLoading(false);
    setLoadingMsg('');
  };

  const handleReset = () => {
    setStep(1);
    setBodyImageB64(null);
    setGamisImageB64(null);
    setNamaCustomer('');
    setError('');
    setBodyForm({
      jenisKelamin: 'wanita',
      tinggiBadan: '',
      beratBadan: '',
      lingkarDada: '',
      lingkarPinggang: '',
      lingkarPinggul: '',
      warnKulit: 'sawo matang',
      posturTubuh: 'ideal',
    });
    setGamisForm({
      modelGamis: '',
      warnaUtama: '',
      motif: '',
      modelKerah: '',
      modelLengan: '',
      panjangGamis: '',
      bahanKain: '',
      detailTambahan: '',
    });
  };

  const download = (b64, name) => {
    const a = document.createElement('a');
    a.href = `data:image/jpeg;base64,${b64}`;
    a.download = name;
    a.click();
  };

  const steps = [
    'Setup',
    'Ukur Badan',
    'Mockup Badan',
    'Desain Gamis',
    'Hasil Final',
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#0e0e12;--surface:#16161d;--surface2:#1e1e28;--border:#2a2a38;--gold:#c9a84c;--gold-light:#e8c97a;--gold-dim:rgba(201,168,76,.15);--text:#e8e4dc;--text-dim:#8a8596;--error:#e07070;--success:#6dbe8a;--r:10px}
        body{background:var(--bg);font-family:'DM Sans',sans-serif;color:var(--text);min-height:100vh}
        .app{max-width:860px;margin:0 auto;padding:24px 16px 60px}
        .header{text-align:center;padding:40px 0 32px}
        .brand{font-family:'Playfair Display',serif;font-size:13px;letter-spacing:6px;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
        .title{font-family:'Playfair Display',serif;font-size:32px;font-weight:600;color:var(--text);line-height:1.2}
        .title em{font-style:italic;color:var(--gold-light)}
        .subtitle{font-size:14px;color:var(--text-dim);margin-top:8px}
        .progress-bar{display:flex;align-items:center;justify-content:center;margin:32px 0}
        .prog-step{display:flex;flex-direction:column;align-items:center;gap:6px}
        .prog-dot{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;border:2px solid var(--border);background:var(--surface);color:var(--text-dim);transition:all .3s}
        .prog-dot.active{border-color:var(--gold);background:var(--gold-dim);color:var(--gold)}
        .prog-dot.done{border-color:var(--success);background:rgba(109,190,138,.15);color:var(--success)}
        .prog-label{font-size:10px;color:var(--text-dim);letter-spacing:.5px;text-align:center;white-space:nowrap}
        .prog-label.active{color:var(--gold)}
        .prog-line{width:40px;height:2px;background:var(--border);margin:0 4px 20px;transition:background .3s}
        .prog-line.done{background:var(--success)}
        .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:32px;margin-bottom:20px}
        .card-title{font-family:'Playfair Display',serif;font-size:20px;margin-bottom:4px}
        .card-sub{font-size:13px;color:var(--text-dim);margin-bottom:28px}
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
        .span2{grid-column:1/-1}
        .field-wrap{display:flex;flex-direction:column;gap:6px}
        .field-label{font-size:12px;letter-spacing:.8px;text-transform:uppercase;color:var(--text-dim);font-weight:500}
        .req{color:var(--gold)}
        .input-row{display:flex;align-items:center}
        .field-input,.field-select,.field-textarea{width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;padding:10px 14px;outline:none;transition:border-color .2s;-webkit-appearance:none;appearance:none}
        .field-input:focus,.field-select:focus,.field-textarea:focus{border-color:var(--gold)}
        .field-select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a8596' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px;cursor:pointer}
        .field-textarea{resize:vertical;min-height:80px}
        .unit{background:var(--border);border:1px solid var(--border);border-left:none;border-radius:0 6px 6px 0;padding:10px 12px;font-size:12px;color:var(--text-dim);white-space:nowrap}
        .input-row .field-input{border-radius:6px 0 0 6px}
        .btn{display:inline-flex;align-items:center;gap:8px;border:none;border-radius:8px;padding:12px 28px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s;letter-spacing:.3px}
        .btn-gold{background:var(--gold);color:#0e0e12}
        .btn-gold:hover{background:var(--gold-light);transform:translateY(-1px);box-shadow:0 8px 24px rgba(201,168,76,.25)}
        .btn-ghost{background:transparent;color:var(--text-dim);border:1px solid var(--border)}
        .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
        .btn-outline{background:transparent;color:var(--gold);border:1px solid var(--gold)}
        .btn-outline:hover{background:var(--gold-dim)}
        .btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
        .actions{display:flex;gap:12px;margin-top:28px;flex-wrap:wrap}
        .error-box{background:rgba(224,112,112,.12);border:1px solid rgba(224,112,112,.3);border-radius:8px;padding:12px 16px;font-size:13px;color:var(--error);margin-top:16px}
        .note-box{background:rgba(109,190,138,.1);border:1px solid rgba(109,190,138,.25);border-radius:8px;padding:12px 16px;font-size:13px;color:var(--success);margin-bottom:20px}
        .loading-wrap{text-align:center;padding:40px 24px}
        .spinner{width:48px;height:48px;border:3px solid var(--border);border-top-color:var(--gold);border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px}
        @keyframes spin{to{transform:rotate(360deg)}}
        .loading-text{font-family:'Playfair Display',serif;font-size:18px;color:var(--text);margin-bottom:6px}
        .loading-sub{font-size:13px;color:var(--text-dim)}
        .setup-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:40px;text-align:center;max-width:500px;margin:40px auto 0}
        .setup-icon{font-size:48px;margin-bottom:20px}
        .setup-title{font-family:'Playfair Display',serif;font-size:24px;margin-bottom:8px}
        .setup-desc{font-size:14px;color:var(--text-dim);margin-bottom:20px;line-height:1.6}
        .api-input{width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;padding:12px 16px;outline:none;margin-bottom:12px;transition:border-color .2s}
        .api-input:focus{border-color:var(--gold)}
        .api-link{font-size:12px;color:var(--text-dim);margin-bottom:20px;display:block;text-align:left}
        .api-link a{color:var(--gold);text-decoration:none}
        .result-wrap{display:flex;gap:28px;align-items:flex-start;flex-wrap:wrap}
        .result-image{flex:1;min-width:240px}
        .result-image img{width:100%;border-radius:8px;border:1px solid var(--border);display:block}
        .result-info{flex:1;min-width:220px}
        .result-name{font-family:'Playfair Display',serif;font-size:22px;margin-bottom:4px}
        .result-badge{display:inline-block;background:var(--gold-dim);border:1px solid rgba(201,168,76,.3);border-radius:20px;padding:4px 12px;font-size:11px;color:var(--gold);letter-spacing:.8px;text-transform:uppercase;margin-bottom:16px}
        .info-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px}
        .info-row:last-of-type{border-bottom:none}
        .info-key{color:var(--text-dim)}
        .info-val{font-weight:500;text-align:right}
        .compare{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .compare-label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-dim);margin-bottom:8px;text-align:center}
        .compare-item img{width:100%;border-radius:8px;border:1px solid var(--border);display:block}
        .steps-hint{background:var(--surface2);border-radius:8px;padding:16px;margin-bottom:20px;font-size:13px;color:var(--text-dim);line-height:1.8}
        .steps-hint strong{color:var(--gold)}
        @media(max-width:600px){.form-grid{grid-template-columns:1fr}.compare{grid-template-columns:1fr}.result-wrap{flex-direction:column}.card{padding:20px}.prog-line{width:20px}}
      `}</style>

      <div className="app">
        <div className="header">
          <div className="brand">Tarda Tailor</div>
          <h1 className="title">
            Sistem Mockup <em>Gamis</em>
          </h1>
          <p className="subtitle">
            AI-Powered Fitting & Visualization · Hugging Face Edition
          </p>
        </div>

        {step > 0 && (
          <div className="progress-bar">
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div className="prog-step">
                  <div
                    className={`prog-dot ${
                      i < step ? 'done' : i === step ? 'active' : ''
                    }`}
                  >
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`prog-label ${i === step ? 'active' : ''}`}>
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`prog-line ${i < step ? 'done' : ''}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 0: Setup ── */}
        {step === 0 && (
          <div className="setup-card">
            <div className="setup-icon">✂️</div>
            <h2 className="setup-title">Mulai Sesi Fitting</h2>
            <p className="setup-desc">
              Gunakan{' '}
              <strong style={{ color: 'var(--gold)' }}>Hugging Face</strong>{' '}
              untuk generate gambar —{' '}
              <strong style={{ color: 'var(--success)' }}>100% gratis</strong>,
              tanpa kartu kredit.
            </p>

            <div
              className="steps-hint"
              style={{ textAlign: 'left', marginBottom: 20 }}
            >
              <strong>Cara dapat token gratis:</strong>
              <br />
              1. Buka{' '}
              <a
                href="https://huggingface.co/join"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--gold)' }}
              >
                huggingface.co/join
              </a>{' '}
              → daftar akun
              <br />
              2. Klik foto profil → <strong>Settings</strong> →{' '}
              <strong>Access Tokens</strong>
              <br />
              3. Klik <strong>New token</strong> → pilih <strong>Read</strong> →
              Copy token
            </div>

            <input
              className="api-input"
              type="password"
              placeholder="hf_xxxxxxxxxxxxxxxxxxxx"
              value={hfToken}
              onChange={(e) => setHfToken(e.target.value)}
            />
            <span className="api-link">
              Token berbentuk <code>hf_</code> diikuti huruf/angka
            </span>
            <input
              className="api-input"
              type="text"
              placeholder="Nama Customer (opsional)"
              value={namaCustomer}
              onChange={(e) => setNamaCustomer(e.target.value)}
            />

            <button
              className="btn btn-gold"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              onClick={() => {
                if (!hfToken.trim())
                  return setError('Masukkan Hugging Face token dulu.');
                setError('');
                setStep(1);
              }}
            >
              Mulai Fitting →
            </button>
            {error && <div className="error-box">{error}</div>}
          </div>
        )}

        {/* ── STEP 1: Ukuran Badan ── */}
        {step === 1 && (
          <div className="card">
            <h2 className="card-title">Ukuran Badan Customer</h2>
            <p className="card-sub">
              {namaCustomer ? `Customer: ${namaCustomer} · ` : ''}Masukkan data
              pengukuran
            </p>
            <div className="form-grid">
              <SelectField
                label="Jenis Kelamin"
                name="jenisKelamin"
                value={bodyForm.jenisKelamin}
                onChange={updateBody}
                required
                options={[
                  { value: 'wanita', label: 'Wanita' },
                  { value: 'pria', label: 'Pria' },
                ]}
              />
              <SelectField
                label="Postur Tubuh"
                name="posturTubuh"
                value={bodyForm.posturTubuh}
                onChange={updateBody}
                required
                options={[
                  { value: 'kurus', label: 'Kurus / Slim' },
                  { value: 'ideal', label: 'Ideal / Normal' },
                  { value: 'gemuk', label: 'Gemuk / Plus Size' },
                ]}
              />
              {[
                ['tinggiBadan', 'Tinggi Badan', '160', 'cm'],
                ['beratBadan', 'Berat Badan', '55', 'kg'],
                ['lingkarDada', 'Lingkar Dada', '88', 'cm'],
                ['lingkarPinggang', 'Lingkar Pinggang', '72', 'cm'],
                ['lingkarPinggul', 'Lingkar Pinggul', '96', 'cm'],
              ].map(([name, label, ph, unit]) => (
                <div className="field-wrap" key={name}>
                  <label className="field-label">
                    {label} <span className="req">*</span>
                  </label>
                  <div className="input-row">
                    <input
                      type="number"
                      name={name}
                      value={bodyForm[name]}
                      onChange={updateBody}
                      placeholder={ph}
                      className="field-input"
                    />
                    <span className="unit">{unit}</span>
                  </div>
                </div>
              ))}
              <SelectField
                label="Warna Kulit"
                name="warnKulit"
                value={bodyForm.warnKulit}
                onChange={updateBody}
                options={[
                  { value: 'putih', label: 'Putih / Terang' },
                  { value: 'sawo matang', label: 'Sawo Matang' },
                  { value: 'gelap', label: 'Gelap / Coklat' },
                ]}
              />
            </div>
            {error && <div className="error-box">{error}</div>}
            {loading ? (
              <div className="loading-wrap">
                <div className="spinner" />
                <div className="loading-text">Generating Mockup Badan…</div>
                <div className="loading-sub">
                  {loadingMsg || 'Menghubungi Hugging Face AI…'}
                </div>
                <div
                  className="loading-sub"
                  style={{ marginTop: 8, fontSize: 12 }}
                >
                  Pertama kali bisa 30–60 detik (model loading)
                </div>
              </div>
            ) : (
              <div className="actions">
                <button className="btn btn-gold" onClick={handleGenerateBody}>
                  ✨ Generate Mockup Badan
                </button>
                <button className="btn btn-ghost" onClick={() => setStep(0)}>
                  ← Kembali
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Body Result ── */}
        {step === 2 && bodyImageB64 && (
          <div className="card">
            <h2 className="card-title">Mockup Badan Berhasil ✓</h2>
            <p className="card-sub">
              Periksa hasil, lalu lanjutkan ke desain gamis
            </p>
            <div className="result-wrap">
              <div className="result-image">
                <img
                  src={`data:image/jpeg;base64,${bodyImageB64}`}
                  alt="Body mockup"
                />
              </div>
              <div className="result-info">
                <div className="result-name">{namaCustomer || 'Customer'}</div>
                <div className="result-badge">Body Mockup</div>
                {[
                  [
                    'Jenis Kelamin',
                    bodyForm.jenisKelamin === 'wanita' ? 'Wanita' : 'Pria',
                  ],
                  [
                    'Tinggi / Berat',
                    `${bodyForm.tinggiBadan} cm · ${bodyForm.beratBadan} kg`,
                  ],
                  ['Dada', `${bodyForm.lingkarDada} cm`],
                  ['Pinggang', `${bodyForm.lingkarPinggang} cm`],
                  ['Pinggul', `${bodyForm.lingkarPinggul} cm`],
                  ['Postur', bodyForm.posturTubuh],
                ].map(([k, v]) => (
                  <div className="info-row" key={k}>
                    <span className="info-key">{k}</span>
                    <span
                      className="info-val"
                      style={{ textTransform: 'capitalize' }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="actions">
              <button className="btn btn-gold" onClick={() => setStep(3)}>
                Lanjut Input Desain Gamis →
              </button>
              <button
                className="btn btn-outline"
                onClick={() =>
                  download(
                    bodyImageB64,
                    `badan-${namaCustomer || 'customer'}.jpg`
                  )
                }
              >
                ⬇ Download
              </button>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>
                ← Ulangi
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Gamis Form ── */}
        {step === 3 && (
          <div className="card">
            <h2 className="card-title">Desain Gamis Customer</h2>
            <p className="card-sub">
              Masukkan spesifikasi gamis yang diinginkan
            </p>
            <div className="form-grid">
              <SelectField
                label="Model / Siluet"
                name="modelGamis"
                value={gamisForm.modelGamis}
                onChange={updateGamis}
                required
                options={[
                  { value: 'a-line', label: 'A-Line' },
                  { value: "syar'i", label: "Syar'i (Longgar Penuh)" },
                  { value: 'casual', label: 'Casual' },
                  { value: 'semi-formal', label: 'Semi Formal' },
                  { value: 'pesta/formal', label: 'Pesta / Formal' },
                ]}
              />
              <div className="field-wrap">
                <label className="field-label">
                  Warna Utama <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="warnaUtama"
                  value={gamisForm.warnaUtama}
                  onChange={updateGamis}
                  placeholder="navy blue, merah marun, hijau tosca…"
                  className="field-input"
                />
              </div>
              <div className="field-wrap">
                <label className="field-label">Motif / Corak</label>
                <input
                  type="text"
                  name="motif"
                  value={gamisForm.motif}
                  onChange={updateGamis}
                  placeholder="polos, batik, bunga, garis, bordir…"
                  className="field-input"
                />
              </div>
              <SelectField
                label="Model Kerah"
                name="modelKerah"
                value={gamisForm.modelKerah}
                onChange={updateGamis}
                required
                options={[
                  { value: 'round neck', label: 'Kerah Bulat' },
                  { value: 'V-neck', label: 'Kerah V' },
                  { value: 'mandarin collar', label: 'Kerah Shanghai' },
                  { value: 'square neck', label: 'Kerah Kotak' },
                  { value: 'turtleneck', label: 'Turtleneck' },
                ]}
              />
              <SelectField
                label="Model Lengan"
                name="modelLengan"
                value={gamisForm.modelLengan}
                onChange={updateGamis}
                required
                options={[
                  { value: 'long straight sleeves', label: 'Panjang Biasa' },
                  { value: 'puff balloon sleeves', label: 'Lengan Balon' },
                  { value: 'bell sleeves', label: 'Lengan Lonceng' },
                  { value: 'wide kimono sleeves', label: 'Lengan Kimono' },
                  { value: 'three-quarter sleeves', label: '3/4' },
                ]}
              />
              <SelectField
                label="Panjang Gamis"
                name="panjangGamis"
                value={gamisForm.panjangGamis}
                onChange={updateGamis}
                required
                options={[
                  { value: 'ankle length', label: 'Mata Kaki' },
                  { value: 'floor length', label: 'Menyentuh Lantai' },
                  { value: 'midi calf length', label: 'Betis' },
                ]}
              />
              <div className="field-wrap">
                <label className="field-label">Bahan / Kain</label>
                <input
                  type="text"
                  name="bahanKain"
                  value={gamisForm.bahanKain}
                  onChange={updateGamis}
                  placeholder="katun rayon, satin, linen, crinkle…"
                  className="field-input"
                />
              </div>
              <div className="field-wrap span2">
                <label className="field-label">Detail Tambahan</label>
                <textarea
                  name="detailTambahan"
                  value={gamisForm.detailTambahan}
                  onChange={updateGamis}
                  placeholder="resleting di sisi, sabuk pinggang, bordir di kerah, kancing bungkus…"
                  className="field-textarea"
                />
              </div>
            </div>
            {error && <div className="error-box">{error}</div>}
            {loading ? (
              <div className="loading-wrap">
                <div className="spinner" />
                <div className="loading-text">Membuat Mockup Gamis…</div>
                <div className="loading-sub">
                  {loadingMsg || 'Memvisualisasikan desain gamis…'}
                </div>
              </div>
            ) : (
              <div className="actions">
                <button className="btn btn-gold" onClick={handleGenerateGamis}>
                  ✨ Generate Mockup Gamis Final
                </button>
                <button className="btn btn-ghost" onClick={() => setStep(2)}>
                  ← Kembali
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 4: Final ── */}
        {step === 4 && gamisImageB64 && (
          <div className="card">
            <h2 className="card-title">Mockup Final Selesai 🎉</h2>
            <p className="card-sub">
              Hasil visualisasi gamis untuk {namaCustomer || 'customer'}
            </p>
            <div className="compare" style={{ marginBottom: 24 }}>
              <div className="compare-item">
                <div className="compare-label">Mockup Badan</div>
                <img
                  src={`data:image/jpeg;base64,${bodyImageB64}`}
                  alt="Body"
                />
              </div>
              <div className="compare-item">
                <div className="compare-label">✨ Mockup + Gamis</div>
                <img
                  src={`data:image/jpeg;base64,${gamisImageB64}`}
                  alt="Gamis"
                />
              </div>
            </div>
            <div
              style={{
                background: 'var(--surface2)',
                borderRadius: 8,
                padding: '16px 20px',
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  color: 'var(--text-dim)',
                  marginBottom: 12,
                }}
              >
                Ringkasan Pesanan
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px 20px',
                  fontSize: 13,
                }}
              >
                {[
                  ['Model', gamisForm.modelGamis],
                  ['Warna', gamisForm.warnaUtama],
                  ['Kerah', gamisForm.modelKerah],
                  ['Lengan', gamisForm.modelLengan],
                  ['Panjang', gamisForm.panjangGamis],
                  gamisForm.bahanKain && ['Bahan', gamisForm.bahanKain],
                  gamisForm.motif && ['Motif', gamisForm.motif],
                ]
                  .filter(Boolean)
                  .map(([k, v]) => (
                    <div key={k}>
                      <span style={{ color: 'var(--text-dim)' }}>{k}:</span>{' '}
                      <strong>{v}</strong>
                    </div>
                  ))}
              </div>
              {gamisForm.detailTambahan && (
                <div style={{ marginTop: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-dim)' }}>Detail:</span>{' '}
                  {gamisForm.detailTambahan}
                </div>
              )}
            </div>
            <div className="actions">
              <button
                className="btn btn-gold"
                onClick={() =>
                  download(
                    gamisImageB64,
                    `gamis-${namaCustomer || 'customer'}.jpg`
                  )
                }
              >
                ⬇ Download Mockup Final
              </button>
              <button
                className="btn btn-outline"
                onClick={() =>
                  download(
                    bodyImageB64,
                    `badan-${namaCustomer || 'customer'}.jpg`
                  )
                }
              >
                ⬇ Download Badan
              </button>
              <button className="btn btn-ghost" onClick={() => setStep(3)}>
                ← Edit Desain
              </button>
              <button className="btn btn-ghost" onClick={handleReset}>
                + Customer Baru
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
