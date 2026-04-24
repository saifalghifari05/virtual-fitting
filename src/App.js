import React, { useState, useEffect } from "react";

// ─── Storage ──────────────────────────────────────────────────────────────────
const S = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const KEYS = { TOKEN: "tt_token", COLLARS: "tt_collars", ORDERS: "tt_orders" };

// ─── Database Default ─────────────────────────────────────────────────────────
const DEFAULT_COLLARS = [
  { id: "classic_rounded", name: "Classic Rounded", alias: "Sanghai Bulat", photo: null, prompt: "tall stand mandarin collar with no fold-over, stands upright around neck, top edge is smoothly rounded and curved, medium height 4cm, very clean minimal structured appearance" },
  { id: "classic_sharp", name: "Classic Sharp", alias: "Sanghai Kotak", photo: null, prompt: "tall stand mandarin collar with no fold-over, stands upright around neck, top edge is completely flat and straight with sharp square angular corners, medium height 4cm, strict formal appearance" },
  { id: "short_farancy", name: "Short Farancy", alias: "Faronsi", photo: null, prompt: "short fold-over dress shirt collar with medium pointed tips, moderate spread angle, clean and sharp construction" },
  { id: "long_farancy", name: "Long Farancy", alias: "Kemeja", photo: null, prompt: "full dress shirt fold-over collar with long sharp pointed collar tips, medium spread angle, classic formal dress shirt collar construction, very crisp" },
  { id: "exclusive_qatary", name: "Exclusive Qatary", alias: "Ronaldo", photo: null, prompt: "exclusive Qatari-style stand collar, distinctive premium design, elegant structured appearance with refined tailoring details" },
  { id: "hexagon_deluxe", name: "Hexagon Deluxe", alias: "Hexagon", photo: null, prompt: "very wide spread dress shirt collar with nearly horizontal spread angle between collar points, extremely wide open spread almost flat on shoulders, sharp angular pointed tips, dramatically bold and exclusive appearance" },
  { id: "signature_rounded", name: "Signature Rounded", alias: "Kemeja Bulat", photo: null, prompt: "dress shirt fold-over collar with fully rounded curved collar tips instead of pointed ends, soft elegant appearance, medium spread angle, refined and sophisticated look" },
  { id: "signature_italian", name: "Signature Italian", alias: "Italy", photo: null, prompt: "Italian-style dress collar with elegant refined design, sophisticated spread with premium Italian tailoring aesthetics, sharp and distinguished" },
];

const KANTONG = [
  { id: "front_1", name: "Front Pocket 1", alias: "Kantong No 1", prompt: "single standard patch pocket on left chest" },
  { id: "front_2", name: "Front Pocket 2", alias: "Kantong No 2", prompt: "single patch pocket with flap on left chest" },
  { id: "front_3", name: "Front Pocket 3", alias: "Kantong No 3", prompt: "single horizontal welt slit pocket on left chest, clean flush minimal opening" },
  { id: "front_4", name: "Front Pocket 4", alias: "Kantong No 4", prompt: "double welt slit pockets on both sides of chest" },
  { id: "inside_a", name: "Inside Pocket A", alias: "Bobok Saudi", prompt: "no visible exterior chest pocket, hidden interior pocket" },
  { id: "inside_b", name: "Inside Pocket B", alias: "Tailor", prompt: "horizontal welt slit pocket completely flush with fabric, very minimal clean slit opening only" },
];

const PLAKET = [
  { id: "rounded", name: "Plaket Rounded", alias: "Plaket Bulat", prompt: "narrow center front placket strip with a rounded curved bottom tip, clean topstitching on both sides" },
  { id: "triangle", name: "Plaket Triangle", alias: "Plaket Segitiga", prompt: "narrow center front placket strip ending in a sharp downward-pointing triangle tip, clean parallel topstitching on both sides of the placket" },
  { id: "rectangle", name: "Plaket Rectangle", alias: "Plaket Kotak", prompt: "narrow center front placket strip with a square/rectangular flat bottom end, clean topstitching" },
  { id: "hexagon", name: "Plaket Hexagon", alias: "Plaket Hexagon", prompt: "narrow center front placket strip ending in a hexagonal shaped tip, distinctive clean topstitching" },
  { id: "hidden_zip", name: "Hidden Zipper", alias: "Plaket Resleting", prompt: "concealed zipper closure running down center front, no visible placket strip, completely clean front" },
  { id: "visible_btn", name: "Visible Button", alias: "Plaket Kancing", prompt: "visible button closure running down center front with exposed buttons, classic button-through opening" },
];

const LENGAN = [
  { id: "closed", name: "Closed Sleeve", alias: "Manset Siku", prompt: "sleeves with cuff ending at elbow length, clean closed cuff" },
  { id: "rectangle", name: "Rectangle Sleeve", alias: "Manset Kotak", prompt: "long sleeves with wide structured French double cuffs, thick and stiff rectangular shape, fastened with cufflinks" },
  { id: "rounded", name: "Rounded Sleeve", alias: "Manset Bulat", prompt: "long sleeves with rounded barrel cuffs, soft elegant finish" },
  { id: "with_zipper", name: "With Zipper", alias: "Lengan Resleting", prompt: "long sleeves with zipper closure at the cuff end" },
  { id: "without_zipper", name: "Without Zipper", alias: "Lengan Polos", prompt: "long sleeves with simple clean cuffs, no zipper, minimal finish" },
];

const WARNA = [
  { name: "Putih", val: "pure crisp white" },
  { name: "Broken White", val: "soft off-white" },
  { name: "Krem", val: "warm cream ivory" },
  { name: "Abu Muda", val: "light silver gray" },
  { name: "Abu Tua", val: "dark charcoal gray" },
  { name: "Navy", val: "deep navy blue" },
  { name: "Biru Royal", val: "rich royal blue" },
  { name: "Hitam", val: "jet black" },
  { name: "Coklat Tua", val: "dark rich brown" },
  { name: "Coklat Muda", val: "warm light brown" },
  { name: "Hijau Botol", val: "deep bottle green" },
  { name: "Marun", val: "deep maroon burgundy" },
  { name: "Olive", val: "muted olive green" },
  { name: "Biru Langit", val: "soft sky blue" },
];

// ─── Prompt Builder ───────────────────────────────────────────────────────────
function buildPrompt(m, kerah, kantong, plaket, lengan, warna, bahan) {
  return `You are a fashion visualization AI for Tarda Tailor, a premium Indonesian custom menswear brand.
${kerah.photo ? `\nREFERENCE IMAGE: The attached photo shows the EXACT collar design called "${kerah.name}" (${kerah.alias}). Reproduce this collar EXACTLY as shown in the reference photo — every detail must match precisely.\n` : ""}
Generate a full-body professional fashion catalog photograph of a Muslim Indonesian man wearing a premium custom-tailored gamis (Islamic long robe).

CUSTOMER BODY:
- Height: ${m.tinggiBadan}cm, Weight: ${m.beratBadan}kg, ${m.postur} build
- Warm olive Southeast Asian skin tone
- Neck: ${m.lingkarLeher}cm, Shoulders: ${m.bahu}cm wide
- Sleeve length: ${m.panjangLengan}cm
- Chest: ${m.lingkarDada}cm, Waist: ${m.lingkarPinggang}cm, Hips: ${m.lingkarPinggul}cm

GARMENT SPECIFICATIONS:
- Color: ${warna}${bahan ? `, ${bahan} fabric` : ", premium smooth twill fabric with subtle diagonal texture"}
- Collar: ${kerah.photo ? "EXACTLY as shown in reference photo — " : ""}${kerah.prompt}
- Front placket: ${plaket.prompt}
- Pocket: ${kantong.prompt}
- Sleeves: ${lengan.prompt}
- Garment length: ${m.panjangGamis}cm (floor length)
- Bottom hem width: ${m.lebarBawah}cm
- Silhouette: tailored semi-fitted, clean structured lines, not too loose not too tight
${m.catatan ? `- Special notes: ${m.catatan}` : ""}

OUTPUT REQUIREMENTS:
Pure white studio background. Full body front-facing view, head to toe visible. Neutral standing pose, arms slightly away from body. Professional fashion catalog quality. Sharp fabric detail and realistic draping fitted precisely to customer measurements. High-end menswear editorial style.`;
}

// ─── Gemini API ───────────────────────────────────────────────────────────────
async function callGemini(apiKey, prompt, collarPhoto, onStatus) {
  const MODELS = [
  "gemini-2.5-flash-image",
  "gemini-3.1-flash-image-preview",
  "gemini-2.5-flash-preview-image-generation",
];
  const parts = [];
  if (collarPhoto) parts.push({ inline_data: { mime_type: "image/jpeg", data: collarPhoto } });
  parts.push({ text: prompt });

  let lastError = null;
  for (const model of MODELS) {
    onStatus(`Mengirim ke Gemini AI…`);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) { lastError = data?.error?.message || `HTTP ${res.status}`; continue; }
      const imgPart = (data?.candidates?.[0]?.content?.parts || []).find(p => p.inlineData?.data);
      if (!imgPart) { lastError = "Model tidak menghasilkan gambar."; continue; }
      return imgPart.inlineData.data;
    } catch (e) { lastError = e.message; }
  }
  throw new Error(lastError || "Semua model gagal. Cek API key dan pastikan billing aktif.");
}

// ─── PDF Export ───────────────────────────────────────────────────────────────
function exportPDF(o) {
  const win = window.open("", "_blank");
  const rows = (pairs) => pairs.filter(Boolean).map(([k, v]) =>
    `<div class="row"><span class="lbl">${k}</span><span class="val">${v || "-"}</span></div>`
  ).join("");
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
  <title>Fitting Sheet - ${o.nama}</title>
  <style>
    body{font-family:Georgia,serif;max-width:820px;margin:0 auto;padding:32px;color:#1a1a1a;font-size:13px}
    .hdr{text-align:center;border-bottom:2px solid #C9A84C;padding-bottom:20px;margin-bottom:24px}
    .brand{font-size:10px;letter-spacing:6px;text-transform:uppercase;color:#C9A84C;margin-bottom:6px}
    h1{font-size:24px;margin:0;font-family:Georgia,serif}
    .meta{color:#888;margin-top:4px;font-size:13px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:20px}
    .sec{background:#f9f7f3;border:1px solid #e8dcc8;border-radius:8px;padding:14px}
    .sec h3{font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#C9A84C;margin:0 0 10px;padding-bottom:7px;border-bottom:1px solid #e8dcc8}
    .row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #eee;font-size:12px}
    .row:last-child{border:none}.lbl{color:#888}.val{font-weight:600;text-align:right}
    .mockup{text-align:center;margin-top:16px}
    .mockup img{max-width:380px;width:100%;border-radius:8px;border:1px solid #ddd}
    .mockup p{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:6px}
    .footer{text-align:center;margin-top:24px;font-size:10px;color:#bbb;border-top:1px solid #eee;padding-top:14px}
    @media print{body{padding:16px}}
  </style></head><body>
  <div class="hdr">
    <div class="brand">Tarda Tailor</div>
    <h1>Order Fitting Sheet</h1>
    <div class="meta">${o.nama} &nbsp;·&nbsp; ${o.tgl}</div>
  </div>
  <div class="grid">
    <div class="sec"><h3>Ukuran Badan</h3>
      ${rows([
        ["Tinggi Badan", o.m.tinggiBadan + " cm"],
        ["Berat Badan", o.m.beratBadan + " kg"],
        ["Lingkar Leher", o.m.lingkarLeher + " cm"],
        ["Bahu", o.m.bahu + " cm"],
        ["Panjang Lengan", o.m.panjangLengan + " cm"],
        o.m.lingkarUjungLengan && ["Lingkar Ujung Lengan", o.m.lingkarUjungLengan + " cm"],
        o.m.siku && ["Siku", o.m.siku + " cm"],
        o.m.otot && ["Otot", o.m.otot + " cm"],
        o.m.ketiak && ["Ketiak", o.m.ketiak + " cm"],
        ["Lingkar Dada", o.m.lingkarDada + " cm"],
        ["Lingkar Pinggang", o.m.lingkarPinggang + " cm"],
        ["Lingkar Pinggul", o.m.lingkarPinggul + " cm"],
        ["Panjang Gamis", o.m.panjangGamis + " cm"],
        ["Lebar Bawah", o.m.lebarBawah + " cm"],
      ])}
    </div>
    <div class="sec"><h3>Spesifikasi Gamis</h3>
      ${rows([
        ["Warna", o.warna],
        o.bahan && ["Bahan", o.bahan],
        ["Kerah", o.kerah?.name + " (" + o.kerah?.alias + ")"],
        ["Kantong", o.kantong?.name + " (" + o.kantong?.alias + ")"],
        ["Plaket", o.plaket?.name + " (" + o.plaket?.alias + ")"],
        ["Lengan", o.lengan?.name + " (" + o.lengan?.alias + ")"],
        o.m.catatan && ["Catatan", o.m.catatan],
      ])}
    </div>
  </div>
  ${o.gamisImg ? `<div class="mockup"><p>Virtual Mockup</p><img src="data:image/png;base64,${o.gamisImg}"/></div>` : ""}
  <div class="footer">Tarda Tailor · Virtual Fitting System · ${o.tgl}</div>
  <script>window.onload=()=>window.print()</script>
  </body></html>`);
  win.document.close();
}

// ─── WhatsApp ─────────────────────────────────────────────────────────────────
function shareWA(o) {
  const t = `*ORDER FITTING - TARDA TAILOR*\n\n👤 *Customer:* ${o.nama}\n📅 *Tanggal:* ${o.tgl}\n\n📏 *Ukuran Badan:*\n• Tinggi: ${o.m.tinggiBadan} cm\n• Berat: ${o.m.beratBadan} kg\n• Lingkar Leher: ${o.m.lingkarLeher} cm\n• Bahu: ${o.m.bahu} cm\n• Panjang Lengan: ${o.m.panjangLengan} cm${o.m.lingkarUjungLengan ? "\n• Lingkar Ujung Lengan: " + o.m.lingkarUjungLengan + " cm" : ""}${o.m.siku ? "\n• Siku: " + o.m.siku + " cm" : ""}${o.m.otot ? "\n• Otot: " + o.m.otot + " cm" : ""}${o.m.ketiak ? "\n• Ketiak: " + o.m.ketiak + " cm" : ""}\n• Lingkar Dada: ${o.m.lingkarDada} cm\n• Lingkar Pinggang: ${o.m.lingkarPinggang} cm\n• Lingkar Pinggul: ${o.m.lingkarPinggul} cm\n• Panjang Gamis: ${o.m.panjangGamis} cm\n• Lebar Bawah: ${o.m.lebarBawah} cm\n\n👗 *Spesifikasi Gamis:*\n• Warna: ${o.warna}${o.bahan ? "\n• Bahan: " + o.bahan : ""}\n• Kerah: ${o.kerah?.name} (${o.kerah?.alias})\n• Kantong: ${o.kantong?.name} (${o.kantong?.alias})\n• Plaket: ${o.plaket?.name} (${o.plaket?.alias})\n• Lengan: ${o.lengan?.name} (${o.lengan?.alias})${o.m.catatan ? "\n• Catatan: " + o.m.catatan : ""}\n\n_Tarda Tailor Virtual Fitting System_`;
  window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, "_blank");
}

// ─── Init State ───────────────────────────────────────────────────────────────
const initM = {
  nama: "", postur: "ideal",
  tinggiBadan: "", beratBadan: "",
  lingkarLeher: "", bahu: "", panjangLengan: "",
  lingkarUjungLengan: "", siku: "", otot: "", ketiak: "",
  lingkarDada: "", lingkarPinggang: "", lingkarPinggul: "",
  panjangGamis: "", lebarBawah: "", catatan: "",
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [token, setToken] = useState("");
  const [remember, setRemember] = useState(true);
  const [step, setStep] = useState(0);
  const [m, setM] = useState(initM);
  const [collars, setCollars] = useState(DEFAULT_COLLARS);
  const [selKerah, setSelKerah] = useState(null);
  const [selKantong, setSelKantong] = useState(null);
  const [selPlaket, setSelPlaket] = useState(null);
  const [selLengan, setSelLengan] = useState(null);
  const [selWarna, setSelWarna] = useState("");
  const [customWarna, setCustomWarna] = useState("");
  const [bahan, setBahan] = useState("");
  const [gamisImg, setGamisImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [showArchive, setShowArchive] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminCollarId, setAdminCollarId] = useState("");
  const [adminPhoto, setAdminPhoto] = useState(null);

  useEffect(() => {
    const t = S.get(KEYS.TOKEN);
    if (t) { setToken(t); setStep(1); }
    setCollars(S.get(KEYS.COLLARS) || DEFAULT_COLLARS);
    setOrders(S.get(KEYS.ORDERS) || []);
  }, []);

  const upM = (e) => setM({ ...m, [e.target.name]: e.target.value });

  const validateM = () => {
    const req = ["tinggiBadan", "beratBadan", "lingkarLeher", "bahu", "panjangLengan", "lingkarDada", "lingkarPinggang", "lingkarPinggul", "panjangGamis", "lebarBawah"];
    return req.every(k => m[k]);
  };

  const generate = async () => {
    if (!selKerah || !selKantong || !selPlaket || !selLengan) return setError("Lengkapi semua pilihan model.");
    const warna = customWarna || selWarna;
    if (!warna) return setError("Pilih atau ketik warna gamis.");
    setError(""); setLoading(true); setStep(3);
    try {
      const prompt = buildPrompt(m, selKerah, selKantong, selPlaket, selLengan, warna, bahan);
      const img = await callGemini(token, prompt, selKerah.photo || null, setLoadingMsg);
      setGamisImg(img);
      const order = {
        id: Date.now(),
        nama: m.nama || "Customer",
        tgl: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        m, kerah: selKerah, kantong: selKantong, plaket: selPlaket, lengan: selLengan,
        warna, bahan, gamisImg: img,
      };
      const updated = [order, ...orders].slice(0, 30);
      setOrders(updated);
      S.set(KEYS.ORDERS, updated);
      setStep(4);
    } catch (e) {
      setError("Error: " + e.message);
      setStep(2);
    }
    setLoading(false); setLoadingMsg("");
  };

  const reset = () => {
    setM(initM); setSelKerah(null); setSelKantong(null); setSelPlaket(null);
    setSelLengan(null); setSelWarna(""); setCustomWarna(""); setBahan("");
    setGamisImg(null); setError(""); setStep(1);
  };

  const logout = () => {
    S.set(KEYS.TOKEN, null); setToken(""); setStep(0);
    setShowArchive(false); setShowAdmin(false);
  };

  const saveCollarPhoto = () => {
    if (!adminCollarId || !adminPhoto) return;
    const updated = collars.map(c => c.id === adminCollarId ? { ...c, photo: adminPhoto } : c);
    setCollars(updated); S.set(KEYS.COLLARS, updated);
    setAdminCollarId(""); setAdminPhoto(null);
    alert("✓ Foto berhasil disimpan ke database!");
  };

  const currentOrder = () => ({
    nama: m.nama || "Customer",
    tgl: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    m, kerah: selKerah, kantong: selKantong, plaket: selPlaket, lengan: selLengan,
    warna: customWarna || selWarna, bahan, gamisImg,
  });

  const dl = (b64, name) => {
    const a = document.createElement("a");
    a.href = `data:image/png;base64,${b64}`;
    a.download = name; a.click();
  };

  // ── Option Card Component ──
  const OptCard = ({ item, selected, onSelect, icon }) => (
    <div className={`opt ${selected?.id === item.id ? "opt-sel" : ""}`} onClick={() => onSelect(item)}>
      {selected?.id === item.id && <div className="opt-chk">✓</div>}
      {item.photo
        ? <img src={`data:image/jpeg;base64,${item.photo}`} alt={item.name} className="opt-img" />
        : <div className="opt-ph">{icon || "◻"}</div>
      }
      <div className="opt-name">{item.name}</div>
      <div className="opt-alias">{item.alias}</div>
    </div>
  );

  // ── Measurement Field ──
  const MF = ({ label, name, unit, ph, req }) => (
    <div className="fw">
      <label className="fl">{label}{req && <span className="req"> *</span>}</label>
      <div className="ir">
        <input type="number" name={name} value={m[name]} onChange={upM} placeholder={ph} className="fi" />
        {unit && <span className="unit">{unit}</span>}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#0b0b0f;--s1:#13131a;--s2:#1a1a24;--s3:#22222f;--bd:#2e2e40;--gold:#c9a84c;--gl:#e8c97a;--gd:rgba(201,168,76,.1);--tx:#e8e4dc;--txd:#7a7590;--err:#e07070;--ok:#6dbe8a;--r:12px}
        body{background:var(--bg);font-family:'DM Sans',sans-serif;color:var(--tx);min-height:100vh}
        .app{max-width:900px;margin:0 auto;padding:16px 14px 60px}

        .hdr{display:flex;align-items:center;justify-content:space-between;padding:16px 0 20px;border-bottom:1px solid var(--bd);margin-bottom:22px}
        .hdr-brand{font-size:10px;letter-spacing:5px;text-transform:uppercase;color:var(--gold);margin-bottom:3px}
        .hdr-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600}
        .hdr-right{display:flex;gap:7px;align-items:center}

        .prog{display:flex;align-items:center;justify-content:center;margin-bottom:22px;gap:0}
        .ps{display:flex;flex-direction:column;align-items:center;gap:4px}
        .pd{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;border:2px solid var(--bd);background:var(--s1);color:var(--txd);transition:all .3s;flex-shrink:0}
        .pd.on{border-color:var(--gold);background:var(--gd);color:var(--gold)}
        .pd.dn{border-color:var(--ok);background:rgba(109,190,138,.1);color:var(--ok)}
        .pl{font-size:8px;color:var(--txd);text-align:center;white-space:nowrap;letter-spacing:.3px}
        .pl.on{color:var(--gold)}
        .pline{height:2px;background:var(--bd);margin:0 4px 18px;flex:1;max-width:60px;transition:background .3s}
        .pline.dn{background:var(--ok)}

        .card{background:var(--s1);border:1px solid var(--bd);border-radius:var(--r);padding:22px;margin-bottom:12px}
        .ct{font-family:'Cormorant Garamond',serif;font-size:20px;margin-bottom:3px}
        .cs{font-size:13px;color:var(--txd);margin-bottom:18px}
        .stitle{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:var(--gold);margin:16px 0 10px;padding-bottom:6px;border-bottom:1px solid var(--bd)}

        .g2{display:grid;grid-template-columns:1fr 1fr;gap:11px}
        .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:11px}
        .ga{grid-column:1/-1}

        .fw{display:flex;flex-direction:column;gap:5px}
        .fl{font-size:10px;letter-spacing:.8px;text-transform:uppercase;color:var(--txd);font-weight:500}
        .req{color:var(--gold)}
        .ir{display:flex;align-items:center}
        .fi,.fs,.fta{width:100%;background:var(--s2);border:1.5px solid var(--bd);border-radius:7px;color:var(--tx);font-family:'DM Sans',sans-serif;font-size:15px;padding:10px 12px;outline:none;transition:border-color .2s;-webkit-appearance:none;appearance:none}
        .fi:focus,.fs:focus,.fta:focus{border-color:var(--gold)}
        .ir .fi{border-radius:7px 0 0 7px;border-right:none}
        .unit{background:var(--s2);border:1.5px solid var(--bd);border-left:none;border-radius:0 7px 7px 0;padding:10px 10px;font-size:11px;color:var(--txd);white-space:nowrap}
        .fs{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a7590' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px;cursor:pointer}
        .fta{resize:vertical;min-height:65px}

        .btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:none;border-radius:8px;padding:11px 18px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s}
        .bg{background:var(--gold);color:#0b0b0f;font-weight:600}
        .bg:hover{background:var(--gl);transform:translateY(-1px);box-shadow:0 6px 16px rgba(201,168,76,.2)}
        .bgh{background:transparent;color:var(--txd);border:1.5px solid var(--bd)}
        .bgh:hover{border-color:var(--gold);color:var(--gold)}
        .bo{background:transparent;color:var(--gold);border:1.5px solid var(--gold)}
        .bo:hover{background:var(--gd)}
        .bwa{background:#25D366;color:#fff;border:none}
        .bwa:hover{background:#1da851}
        .bsm{padding:7px 12px;font-size:12px;border-radius:6px}
        .btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;box-shadow:none!important}
        .actions{display:flex;gap:8px;margin-top:18px;flex-wrap:wrap}

        .err{background:rgba(224,112,112,.08);border:1px solid rgba(224,112,112,.2);border-radius:8px;padding:10px 13px;font-size:13px;color:var(--err);margin-top:11px;line-height:1.5}
        .tip{background:var(--gd);border:1px solid rgba(201,168,76,.15);border-radius:8px;padding:10px 13px;font-size:12px;color:var(--gold);margin-bottom:12px;line-height:1.6}

        .ogrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}
        .opt{background:var(--s2);border:1.5px solid var(--bd);border-radius:9px;padding:10px;cursor:pointer;transition:all .2s;text-align:center;position:relative}
        .opt:hover{border-color:var(--txd)}
        .opt-sel{border-color:var(--gold);background:rgba(201,168,76,.07)}
        .opt-img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:6px;margin-bottom:6px;display:block;background:var(--s3)}
        .opt-ph{width:100%;aspect-ratio:4/3;background:var(--s3);border-radius:6px;margin-bottom:6px;display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--txd)}
        .opt-name{font-size:11px;font-weight:500;line-height:1.2;margin-bottom:2px}
        .opt-alias{font-size:10px;color:var(--txd)}
        .opt-chk{position:absolute;top:5px;right:5px;width:16px;height:16px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-size:9px;color:#0b0b0f;font-weight:700}

        .cgrid{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:11px}
        .cbtn{padding:6px 12px;border-radius:20px;font-size:12px;cursor:pointer;border:1.5px solid var(--bd);background:var(--s2);color:var(--tx);transition:all .2s}
        .cbtn:hover{border-color:var(--txd)}
        .cbtn.csel{border-color:var(--gold);background:var(--gd);color:var(--gold)}

        .loading{text-align:center;padding:48px 20px}
        .spin{width:44px;height:44px;border:3px solid var(--bd);border-top-color:var(--gold);border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px}
        @keyframes spin{to{transform:rotate(360deg)}}
        .loading-t{font-family:'Cormorant Garamond',serif;font-size:22px;margin-bottom:5px}
        .loading-s{font-size:13px;color:var(--txd)}

        .setup{max-width:460px;margin:0 auto}
        .scard{background:var(--s1);border:1px solid var(--bd);border-radius:var(--r);padding:26px 20px;text-align:center}
        .sicon{font-size:36px;margin-bottom:12px}
        .st{font-family:'Cormorant Garamond',serif;font-size:24px;margin-bottom:5px}
        .ss{font-size:13px;color:var(--txd);margin-bottom:18px;line-height:1.6}
        .tinput{width:100%;background:var(--s2);border:1.5px solid var(--bd);border-radius:8px;color:var(--tx);font-family:'DM Sans',sans-serif;font-size:15px;padding:12px 14px;outline:none;margin-bottom:10px;transition:border-color .2s}
        .tinput:focus{border-color:var(--gold)}
        .rrow{display:flex;align-items:center;gap:8px;margin-bottom:16px;text-align:left;cursor:pointer}
        .rrow input{width:16px;height:16px;accent-color:var(--gold);cursor:pointer}
        .rrow span{font-size:13px;color:var(--txd)}
        .howto{background:var(--s2);border-radius:8px;padding:12px;margin-bottom:16px;text-align:left;font-size:12px;color:var(--txd);line-height:1.9}
        .howto strong{color:var(--gold)}
        .howto a{color:var(--gold);text-decoration:none}

        .rimg{width:100%;border-radius:10px;border:1px solid var(--bd);display:block;background:var(--s2);max-height:70vh;object-fit:contain}
        .rlbl{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:var(--txd);margin-bottom:7px;text-align:center}
        .icard{background:var(--s2);border-radius:9px;padding:13px 15px;margin-bottom:12px}
        .icard h4{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:var(--gold);margin-bottom:10px}
        .irow{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--bd);font-size:13px}
        .irow:last-child{border:none}
        .ik{color:var(--txd)}.iv{font-weight:500;text-align:right;text-transform:capitalize;max-width:60%;word-break:break-word}

        .aitem{display:flex;align-items:center;gap:11px;padding:11px;background:var(--s2);border-radius:9px;margin-bottom:7px}
        .athumb{width:52px;height:52px;object-fit:cover;border-radius:6px;border:1px solid var(--bd);flex-shrink:0;background:var(--s3)}
        .ainfo{flex:1;min-width:0}
        .aname{font-weight:500;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .adate{font-size:11px;color:var(--txd);margin-top:2px}
        .atags{display:flex;gap:5px;margin-top:5px;flex-wrap:wrap}
        .tag{background:var(--bd);border-radius:10px;padding:2px 8px;font-size:10px;color:var(--txd)}
        .aact{display:flex;gap:6px;flex-shrink:0}

        .adm{background:var(--s1);border:1px solid rgba(201,168,76,.2);border-radius:var(--r);padding:18px;margin-bottom:12px}

        @media(max-width:640px){
          .g2,.g3{grid-template-columns:1fr}
          .card{padding:14px}
          .actions{flex-direction:column}
          .actions .btn{width:100%}
          .pline{max-width:22px}
          .fi,.fs,.fta{font-size:16px}
          .ogrid{grid-template-columns:repeat(auto-fill,minmax(100px,1fr))}
        }
      `}</style>

      <div className="app">

        {/* Header */}
        <div className="hdr">
          <div>
            <div className="hdr-brand">Tarda Tailor</div>
            <div className="hdr-title">Virtual Fitting System</div>
          </div>
          {step > 0 && (
            <div className="hdr-right">
              <button className="btn bgh bsm" onClick={() => { setShowAdmin(!showAdmin); setShowArchive(false); }}>
                {showAdmin ? "✕" : "⚙"} Admin
              </button>
              <button className="btn bgh bsm" onClick={() => { setShowArchive(!showArchive); setShowAdmin(false); }}>
                📂 {orders.length}
              </button>
              <button className="btn bgh bsm" onClick={logout}>Keluar</button>
            </div>
          )}
        </div>

        {/* Admin Panel */}
        {showAdmin && step > 0 && (
          <div className="adm">
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, marginBottom: 4 }}>⚙ Admin — Database Foto Kerah</div>
            <p style={{ fontSize: 12, color: "var(--txd)", marginBottom: 14, lineHeight: 1.6 }}>
              Upload foto close-up setiap model kerah. Foto tersimpan di browser ini dan akan digunakan sebagai referensi visual untuk Gemini AI.
            </p>
            <div className="g2" style={{ marginBottom: 10 }}>
              <div className="fw">
                <label className="fl">Model Kerah</label>
                <select className="fs" value={adminCollarId} onChange={e => setAdminCollarId(e.target.value)}>
                  <option value="">— Pilih Model —</option>
                  {collars.map(c => (
                    <option key={c.id} value={c.id}>{c.photo ? "✓" : "○"} {c.name} ({c.alias})</option>
                  ))}
                </select>
              </div>
              <div className="fw">
                <label className="fl">Upload Foto Kerah</label>
                <input type="file" accept="image/*" className="fi" style={{ padding: "8px 11px" }}
                  onChange={async e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const r = new FileReader();
                    r.onloadend = () => setAdminPhoto(r.result.split(",")[1]);
                    r.readAsDataURL(file);
                  }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              <button className="btn bg" onClick={saveCollarPhoto} disabled={!adminCollarId || !adminPhoto} style={{ fontSize: 13, padding: "9px 16px" }}>
                Simpan Foto ke Database
              </button>
              <button className="btn bgh bsm" onClick={() => { setCollars(DEFAULT_COLLARS); S.set(KEYS.COLLARS, DEFAULT_COLLARS); }}>
                Reset Database
              </button>
            </div>
            <div className="fl" style={{ marginBottom: 7 }}>Status ({collars.filter(c => c.photo).length}/{collars.length} foto)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {collars.map(c => (
                <span key={c.id} style={{
                  padding: "3px 9px", borderRadius: 10, fontSize: 10,
                  background: c.photo ? "rgba(109,190,138,.1)" : "var(--s2)",
                  border: `1px solid ${c.photo ? "rgba(109,190,138,.25)" : "var(--bd)"}`,
                  color: c.photo ? "var(--ok)" : "var(--txd)"
                }}>
                  {c.photo ? "✓" : "○"} {c.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Archive */}
        {showArchive && step > 0 && (
          <div className="card">
            <div className="ct">Arsip Fitting</div>
            <p className="cs">{orders.length} pesanan tersimpan di browser ini</p>
            {orders.length === 0 && <p style={{ color: "var(--txd)", fontSize: 13 }}>Belum ada arsip.</p>}
            {orders.map(o => (
              <div key={o.id} className="aitem">
                {o.gamisImg
                  ? <img src={`data:image/png;base64,${o.gamisImg}`} className="athumb" alt="" />
                  : <div className="athumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👔</div>
                }
                <div className="ainfo">
                  <div className="aname">{o.nama}</div>
                  <div className="adate">{o.tgl}</div>
                  <div className="atags">
                    <span className="tag">{o.kerah?.name}</span>
                    <span className="tag">{o.warna?.split(" ")[0]}</span>
                    <span className="tag">{o.m?.tinggiBadan}cm</span>
                  </div>
                </div>
                <div className="aact">
                  <button className="btn bgh bsm" onClick={() => exportPDF(o)}>PDF</button>
                  <button className="btn bgh bsm" onClick={() => shareWA(o)}>WA</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Progress */}
        {step > 0 && step !== 3 && (
          <div className="prog">
            {[["1", "Ukuran"], ["2", "Model"], ["3", "Selesai"]].map(([n, label], i) => {
              const si = i + 1;
              const done = (step === 4 && si <= 3) || step > si;
              const active = (step === si) || (step === 4 && si === 3);
              return (
                <React.Fragment key={i}>
                  <div className="ps">
                    <div className={`pd ${done ? "dn" : active ? "on" : ""}`}>{done ? "✓" : n}</div>
                    <div className={`pl ${active ? "on" : ""}`}>{label}</div>
                  </div>
                  {i < 2 && <div className={`pline ${(step > si || step === 4) ? "dn" : ""}`} />}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* STEP 0 — Setup */}
        {step === 0 && (
          <div className="setup">
            <div className="scard">
              <div className="sicon">✂️</div>
              <h2 className="st">Virtual Fitting</h2>
              <p className="ss">Masukkan Gemini API Key untuk mengaktifkan sistem generate mockup AI.</p>
              <div className="howto">
                <strong>Cara dapat API Key:</strong><br />
                1. Buka <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">aistudio.google.com/app/apikey</a><br />
                2. Klik <strong>Create API key</strong><br />
                3. Copy key → paste di bawah
              </div>
              <input className="tinput" type="password" placeholder="AIzaSy..."
                value={token} onChange={e => setToken(e.target.value)} />
              <label className="rrow">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                <span>Simpan token di browser ini</span>
              </label>
              <button className="btn bg" style={{ width: "100%" }}
                onClick={() => {
                  if (!token.trim()) return setError("Masukkan API Key Gemini.");
                  if (remember) S.set(KEYS.TOKEN, token);
                  setError(""); setStep(1);
                }}>
                Mulai Fitting →
              </button>
              {error && <div className="err">{error}</div>}
            </div>
          </div>
        )}

        {/* STEP 1 — Fitting Form */}
        {step === 1 && (
          <div className="card">
            <div className="ct">Data & Ukuran Customer</div>
            <p className="cs">Masukkan hasil pengukuran sesuai urutan fitting — pria saja</p>

            <div className="stitle">Identitas</div>
            <div className="g2">
              <div className="fw ga">
                <label className="fl">Nama Customer</label>
                <input className="fi" name="nama" value={m.nama} onChange={upM} placeholder="Nama lengkap customer" />
              </div>
              <div className="fw ga">
                <label className="fl">Postur Tubuh</label>
                <select className="fs" name="postur" value={m.postur} onChange={upM}>
                  <option value="slim slender">Kurus / Slim</option>
                  <option value="ideal average">Ideal / Normal</option>
                  <option value="stocky full-figured">Gemuk / Plus Size</option>
                </select>
              </div>
            </div>

            <div className="stitle">Ukuran Badan</div>
            <div className="g2">
              <MF label="Tinggi Badan" name="tinggiBadan" unit="cm" ph="169" req />
              <MF label="Berat Badan" name="beratBadan" unit="kg" ph="79" req />
              <MF label="Lingkar Leher" name="lingkarLeher" unit="cm" ph="44" req />
              <MF label="Bahu" name="bahu" unit="cm" ph="49" req />
              <MF label="Panjang Lengan" name="panjangLengan" unit="cm" ph="61" req />
              <MF label="Lingkar Ujung Lengan" name="lingkarUjungLengan" unit="cm" ph="27" />
              <MF label="Siku" name="siku" unit="cm" ph="23" />
              <MF label="Otot" name="otot" unit="cm" ph="28" />
              <MF label="Ketiak" name="ketiak" unit="cm" ph="36" />
              <MF label="Lingkar Dada" name="lingkarDada" unit="cm" ph="105" req />
              <MF label="Lingkar Pinggang" name="lingkarPinggang" unit="cm" ph="97" req />
              <MF label="Lingkar Pinggul" name="lingkarPinggul" unit="cm" ph="101" req />
            </div>

            <div className="stitle">Pertanyaan ke Customer</div>
            <div className="g2">
              <MF label="Panjang Gamis" name="panjangGamis" unit="cm" ph="143" req />
              <MF label="Lebar Bagian Bawah" name="lebarBawah" unit="cm" ph="105" req />
            </div>

            <div className="stitle">Catatan</div>
            <div className="fw">
              <label className="fl">Catatan Khusus</label>
              <textarea className="fta" name="catatan" value={m.catatan} onChange={upM}
                placeholder="Permintaan khusus, preferensi fit, dll..." />
            </div>

            {error && <div className="err">{error}</div>}
            <div className="actions">
              <button className="btn bg" onClick={() => {
                if (!validateM()) return setError("Lengkapi semua field bertanda * terlebih dahulu.");
                setError(""); setStep(2);
              }}>Lanjut Pilih Model Gamis →</button>
            </div>
          </div>
        )}

        {/* STEP 2 — Model Selection */}
        {step === 2 && (
          <>
            {/* Kerah */}
            <div className="card">
              <div className="ct">Model Kerah</div>
              <p className="cs">Kerah dengan foto ✓ menghasilkan mockup lebih akurat</p>
              {collars.filter(c => c.photo).length === 0 && (
                <div className="tip">💡 Belum ada foto kerah. Upload foto di menu Admin (⚙) untuk akurasi lebih tinggi.</div>
              )}
              <div className="ogrid">
                {collars.map(c => <OptCard key={c.id} item={c} selected={selKerah} onSelect={setSelKerah} icon="👔" />)}
              </div>
            </div>

            {/* Kantong */}
            <div className="card">
              <div className="ct">Model Kantong</div>
              <div className="ogrid">
                {KANTONG.map(k => <OptCard key={k.id} item={k} selected={selKantong} onSelect={setSelKantong} icon="🪡" />)}
              </div>
            </div>

            {/* Plaket */}
            <div className="card">
              <div className="ct">Model Plaket</div>
              <div className="ogrid">
                {PLAKET.map(p => <OptCard key={p.id} item={p} selected={selPlaket} onSelect={setSelPlaket} icon="▲" />)}
              </div>
            </div>

            {/* Lengan */}
            <div className="card">
              <div className="ct">Model Lengan</div>
              <div className="ogrid">
                {LENGAN.map(l => <OptCard key={l.id} item={l} selected={selLengan} onSelect={setSelLengan} icon="🧵" />)}
              </div>
            </div>

            {/* Warna & Bahan */}
            <div className="card">
              <div className="ct">Warna & Bahan</div>
              <div className="stitle">Pilih Warna</div>
              <div className="cgrid">
                {WARNA.map(w => (
                  <button key={w.name}
                    className={`cbtn ${selWarna === w.val && !customWarna ? "csel" : ""}`}
                    onClick={() => { setSelWarna(w.val); setCustomWarna(""); }}>
                    {w.name}
                  </button>
                ))}
              </div>
              <div className="fw" style={{ marginBottom: 14 }}>
                <label className="fl">Atau ketik warna custom</label>
                <input className="fi" value={customWarna}
                  onChange={e => { setCustomWarna(e.target.value); setSelWarna(""); }}
                  placeholder="cth: sage green, dusty rose, midnight blue..." />
              </div>
              <div className="fw">
                <label className="fl">Bahan / Kain (opsional)</label>
                <input className="fi" value={bahan} onChange={e => setBahan(e.target.value)}
                  placeholder="cth: premium twill, satin silk, linen, crinkle..." />
              </div>
            </div>

            {error && <div className="err">{error}</div>}
            <div className="actions">
              <button className="btn bg" onClick={generate}>✨ Generate Mockup</button>
              <button className="btn bgh" onClick={() => { setError(""); setStep(1); }}>← Kembali</button>
            </div>
          </>
        )}

        {/* STEP 3 — Generating */}
        {step === 3 && (
          <div className="card">
            <div className="loading">
              <div className="spin" />
              <div className="loading-t">Membuat Virtual Mockup…</div>
              <div className="loading-s" style={{ marginTop: 6 }}>{loadingMsg || "Mengirim ke Gemini AI…"}</div>
              <div className="loading-s" style={{ marginTop: 5, fontSize: 12 }}>Proses 20–40 detik, harap tunggu</div>
            </div>
            {error && (
              <>
                <div className="err">{error}</div>
                <div className="actions" style={{ justifyContent: "center" }}>
                  <button className="btn bgh" onClick={() => setStep(2)}>← Kembali</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 4 — Result */}
        {step === 4 && gamisImg && (
          <div className="card">
            <div className="ct">Fitting Selesai 🎉</div>
            <p className="cs">Virtual mockup untuk {m.nama || "Customer"}</p>

            <div style={{ marginBottom: 18 }}>
              <div className="rlbl">✨ Virtual Mockup Gamis</div>
              <img src={`data:image/png;base64,${gamisImg}`} alt="mockup" className="rimg" />
            </div>

            <div className="icard">
              <h4>Spesifikasi Gamis</h4>
              {[
                ["Kerah", `${selKerah?.name} (${selKerah?.alias})`],
                ["Kantong", `${selKantong?.name} (${selKantong?.alias})`],
                ["Plaket", `${selPlaket?.name} (${selPlaket?.alias})`],
                ["Lengan", `${selLengan?.name} (${selLengan?.alias})`],
                ["Warna", customWarna || selWarna],
                bahan ? ["Bahan", bahan] : null,
                ["Panjang Gamis", `${m.panjangGamis} cm`],
                ["Lebar Bawah", `${m.lebarBawah} cm`],
                m.catatan ? ["Catatan", m.catatan] : null,
              ].filter(Boolean).map(([k, v]) => (
                <div key={k} className="irow"><span className="ik">{k}</span><span className="iv">{v}</span></div>
              ))}
            </div>

            <div className="icard">
              <h4>Ukuran Badan</h4>
              {[
                ["Nama", m.nama || "-"],
                ["Tinggi / Berat", `${m.tinggiBadan} cm · ${m.beratBadan} kg`],
                ["Lingkar Leher", `${m.lingkarLeher} cm`],
                ["Bahu", `${m.bahu} cm`],
                ["Panjang Lengan", `${m.panjangLengan} cm`],
                m.lingkarUjungLengan ? ["Lingkar Ujung Lengan", `${m.lingkarUjungLengan} cm`] : null,
                m.siku ? ["Siku", `${m.siku} cm`] : null,
                m.otot ? ["Otot", `${m.otot} cm`] : null,
                m.ketiak ? ["Ketiak", `${m.ketiak} cm`] : null,
                ["Lingkar Dada", `${m.lingkarDada} cm`],
                ["Lingkar Pinggang", `${m.lingkarPinggang} cm`],
                ["Lingkar Pinggul", `${m.lingkarPinggul} cm`],
              ].filter(Boolean).map(([k, v]) => (
                <div key={k} className="irow"><span className="ik">{k}</span><span className="iv">{v}</span></div>
              ))}
            </div>

            <div className="actions">
              <button className="btn bg" onClick={() => exportPDF(currentOrder())}>📄 Export PDF</button>
              <button className="btn bwa" onClick={() => shareWA(currentOrder())}>📱 Kirim WA</button>
              <button className="btn bo" onClick={() => dl(gamisImg, `mockup-${m.nama || "customer"}.png`)}>⬇ Download</button>
              <button className="btn bgh" onClick={() => { setError(""); setStep(2); }}>← Edit Model</button>
              <button className="btn bgh" onClick={reset}>+ Customer Baru</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
