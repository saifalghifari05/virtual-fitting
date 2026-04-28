<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tarda Tailor — Virtual Fitting System</title>
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --navy:   #1c2b4a;
  --navy2:  #243358;
  --navy3:  #2e4070;
  --navyd:  rgba(28,43,74,.07);
  --bw:     #faf8f4;
  --bw2:    #f2ede4;
  --bw3:    #e6dfd2;
  --gold:   #b8924a;
  --gold2:  #d4a85c;
  --tx:     #1c2b4a;
  --tx2:    #556070;
  --tx3:    #8a98ae;
  --ok:     #2e7d52;
  --err:    #b03030;
  --bd:     #d4cec4;
  --r:      10px;
  --sh:     0 2px 14px rgba(28,43,74,.08);
}
html { font-size: 16px; }
body { background: var(--bw); font-family: 'DM Sans', sans-serif; color: var(--tx); min-height: 100vh; }
.app { max-width: 900px; margin: 0 auto; padding: 0 16px 80px; }

/* HEADER */
.hdr { background: var(--navy); margin: 0 -16px 32px; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; height: 66px; }
.hdr-brand { font-size: 9px; letter-spacing: 5px; text-transform: uppercase; color: var(--gold2); margin-bottom: 3px; }
.hdr-name { font-family: 'Libre Baskerville', serif; font-size: 16px; color: #faf8f4; font-weight: 400; letter-spacing: .5px; }
.hdr-right { display: flex; gap: 8px; }
.btn-hdr { background: transparent; color: rgba(250,248,244,.75); border: 1.5px solid rgba(250,248,244,.2); border-radius: 7px; padding: 7px 14px; font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer; transition: all .2s; }
.btn-hdr:hover { background: rgba(250,248,244,.1); color: #faf8f4; border-color: rgba(250,248,244,.4); }

/* PROGRESS */
.prog { display: flex; align-items: center; justify-content: center; margin-bottom: 28px; }
.ps { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.pd { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; border: 2px solid var(--bd); background: var(--bw); color: var(--tx3); transition: all .3s; flex-shrink: 0; }
.pd.on { border-color: var(--navy); background: var(--navy); color: #fff; }
.pd.dn { border-color: var(--ok); background: var(--ok); color: #fff; }
.pl { font-size: 10px; color: var(--tx3); text-align: center; white-space: nowrap; }
.pl.on { color: var(--navy); font-weight: 500; }
.pline { height: 2px; background: var(--bd); margin: 0 8px 18px; flex: 1; max-width: 80px; transition: background .3s; }
.pline.dn { background: var(--ok); }

/* CARD */
.card { background: #fff; border: 1px solid var(--bd); border-radius: var(--r); padding: 26px; margin-bottom: 14px; box-shadow: var(--sh); }
.card-t { font-family: 'Libre Baskerville', serif; font-size: 20px; font-weight: 400; color: var(--navy); margin-bottom: 4px; }
.card-s { font-size: 13px; color: var(--tx2); margin-bottom: 20px; }
.sec-t { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: var(--gold); margin: 20px 0 12px; padding-bottom: 8px; border-bottom: 1px solid var(--bw3); }

/* GRID */
.g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
.g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 13px; }
.ga { grid-column: 1/-1; }

/* FIELDS */
.fw { display: flex; flex-direction: column; gap: 6px; }
.fl { font-size: 10px; letter-spacing: .8px; text-transform: uppercase; color: var(--tx2); font-weight: 500; }
.req { color: var(--err); }
.ir { display: flex; }
.fi, .fs, .fta { width: 100%; background: var(--bw); border: 1.5px solid var(--bd); border-radius: 7px; color: var(--tx); font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 10px 13px; outline: none; transition: border-color .2s; -webkit-appearance: none; appearance: none; }
.fi:focus, .fs:focus, .fta:focus { border-color: var(--navy); background: #fff; }
.ir .fi { border-radius: 7px 0 0 7px; border-right: none; }
.unit { background: var(--bw2); border: 1.5px solid var(--bd); border-left: none; border-radius: 0 7px 7px 0; padding: 10px 12px; font-size: 11px; color: var(--tx2); white-space: nowrap; }
.fs { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23556070' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; cursor: pointer; }
.fta { resize: vertical; min-height: 70px; }

/* BUTTONS */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; border: none; border-radius: 7px; padding: 10px 20px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .2s; white-space: nowrap; }
.bn { background: var(--navy); color: #faf8f4; }
.bn:hover { background: var(--navy3); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(28,43,74,.2); }
.bg { background: transparent; color: var(--tx2); border: 1.5px solid var(--bd); }
.bg:hover { border-color: var(--navy); color: var(--navy); }
.bo { background: transparent; color: var(--navy); border: 1.5px solid var(--navy); }
.bo:hover { background: var(--navyd); }
.bgold { background: var(--gold); color: #fff; }
.bgold:hover { background: var(--gold2); }
.bwa { background: #25D366; color: #fff; }
.bwa:hover { background: #1dba58; }
.bsm { padding: 7px 13px; font-size: 12px; border-radius: 6px; }
.btn:disabled { opacity: .4; cursor: not-allowed; transform: none !important; }
.acts { display: flex; gap: 9px; margin-top: 22px; flex-wrap: wrap; }

/* FEEDBACK */
.err-box { background: #fff5f5; border: 1px solid #f0c0c0; border-radius: 7px; padding: 10px 14px; font-size: 12px; color: var(--err); margin-top: 10px; }
.tip-box { background: #fffbf0; border: 1px solid #f0d888; border-radius: 7px; padding: 10px 14px; font-size: 12px; color: #7a6020; margin-bottom: 14px; }

/* LOADING */
.loading { text-align: center; padding: 70px 20px; }
.spin { width: 44px; height: 44px; border: 2px solid var(--bw3); border-top-color: var(--navy); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
@keyframes spin { to { transform: rotate(360deg); } }
.load-t { font-family: 'Libre Baskerville', serif; font-size: 22px; font-weight: 400; color: var(--navy); margin-bottom: 6px; }
.load-s { font-size: 13px; color: var(--tx2); }

/* OPTION CARDS */
.ogrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; }
.opt { background: var(--bw); border: 2px solid var(--bd); border-radius: 9px; padding: 10px; cursor: pointer; transition: all .2s; text-align: center; position: relative; }
.opt:hover { border-color: var(--navy2); background: #fff; box-shadow: var(--sh); }
.opt.sel { border-color: var(--navy); background: #fff; box-shadow: 0 2px 14px rgba(28,43,74,.14); }
.opt-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 6px; margin-bottom: 7px; display: block; background: var(--bw2); }
.opt-ph { width: 100%; aspect-ratio: 4/3; background: var(--bw2); border-radius: 6px; margin-bottom: 7px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
.opt-n { font-size: 11px; color: var(--navy); font-weight: 500; margin-bottom: 2px; line-height: 1.3; }
.opt-a { font-size: 10px; color: var(--tx2); }
.opt-chk { position: absolute; top: 6px; right: 6px; width: 18px; height: 18px; border-radius: 50%; background: var(--navy); display: none; align-items: center; justify-content: center; font-size: 10px; color: #fff; font-weight: 700; }
.opt.sel .opt-chk { display: flex; }
.empty-grid { grid-column: 1/-1; text-align: center; padding: 28px; color: var(--tx3); font-size: 13px; background: var(--bw); border: 1.5px dashed var(--bd); border-radius: 8px; }

/* CHIPS */
.chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }
.chip { padding: 7px 14px; border-radius: 20px; font-size: 12px; cursor: pointer; border: 1.5px solid var(--bd); background: var(--bw); color: var(--tx); transition: all .2s; }
.chip:hover { border-color: var(--navy); }
.chip.sel { border-color: var(--navy); background: var(--navy); color: #faf8f4; }

/* RESULT */
.result-img { width: 100%; border-radius: 10px; border: 1px solid var(--bd); display: block; max-height: 75vh; object-fit: contain; background: var(--bw2); }
.rlbl { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--tx3); margin-bottom: 8px; text-align: center; }
.info-card { background: var(--bw); border: 1px solid var(--bd); border-radius: 9px; padding: 14px 16px; margin-bottom: 12px; }
.info-card-t { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: var(--gold); margin-bottom: 10px; }
.irow { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--bw3); font-size: 12px; }
.irow:last-child { border: none; }
.ik { color: var(--tx2); }
.iv { text-align: right; max-width: 55%; word-break: break-word; color: var(--navy); font-weight: 500; }

/* ARCHIVE */
.arc-item { display: flex; align-items: center; gap: 13px; padding: 12px 14px; background: var(--bw); border: 1px solid var(--bd); border-radius: 9px; margin-bottom: 8px; }
.arc-thumb { width: 52px; height: 52px; object-fit: cover; border-radius: 7px; border: 1px solid var(--bd); flex-shrink: 0; background: var(--bw2); display: flex; align-items: center; justify-content: center; font-size: 18px; overflow: hidden; }
.arc-thumb img { width: 100%; height: 100%; object-fit: cover; }
.arc-info { flex: 1; min-width: 0; }
.arc-name { font-size: 14px; font-weight: 500; color: var(--navy); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.arc-date { font-size: 11px; color: var(--tx2); margin-top: 2px; }
.arc-tags { display: flex; gap: 5px; margin-top: 5px; flex-wrap: wrap; }
.tag { background: var(--navyd); border: 1px solid rgba(28,43,74,.12); border-radius: 10px; padding: 2px 8px; font-size: 10px; color: var(--navy); }
.arc-act { display: flex; gap: 6px; flex-shrink: 0; }

/* ADMIN */
.adm-panel { background: #fff; border: 1px solid var(--bd); border-radius: var(--r); padding: 22px; margin-bottom: 14px; display: none; box-shadow: var(--sh); }
.adm-t { font-family: 'Libre Baskerville', serif; font-size: 18px; color: var(--navy); margin-bottom: 4px; }
.adm-s { font-size: 12px; color: var(--tx2); margin-bottom: 18px; line-height: 1.7; }

/* CATEGORY TABS */
.cat-tabs { display: flex; gap: 0; margin-bottom: 18px; border: 1.5px solid var(--bd); border-radius: 8px; overflow: hidden; }
.cat-tab { flex: 1; padding: 9px 4px; font-size: 11px; font-weight: 500; text-align: center; cursor: pointer; background: var(--bw); color: var(--tx2); border: none; border-right: 1px solid var(--bd); transition: all .2s; font-family: 'DM Sans', sans-serif; }
.cat-tab:last-child { border-right: none; }
.cat-tab:hover { background: var(--bw2); color: var(--navy); }
.cat-tab.active { background: var(--navy); color: #fff; }

/* DB ITEMS */
.db-section { display: none; }
.db-section.active { display: block; }
.db-add-form { background: var(--bw); border: 1px solid var(--bd); border-radius: 9px; padding: 16px; margin-bottom: 14px; }
.db-add-title { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--navy); font-weight: 500; margin-bottom: 12px; }
.db-item-list { display: flex; flex-direction: column; gap: 8px; }
.db-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bw); border: 1px solid var(--bd); border-radius: 8px; }
.db-item-thumb { width: 52px; height: 40px; border-radius: 5px; border: 1px solid var(--bd); flex-shrink: 0; overflow: hidden; background: var(--bw2); display: flex; align-items: center; justify-content: center; font-size: 16px; }
.db-item-thumb img { width: 100%; height: 100%; object-fit: cover; }
.db-item-info { flex: 1; }
.db-item-name { font-size: 13px; font-weight: 500; color: var(--navy); }
.db-item-sub { font-size: 10px; color: var(--tx2); margin-top: 1px; }
.db-item-act { display: flex; gap: 6px; flex-shrink: 0; }
.db-count { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--tx2); margin-bottom: 8px; font-weight: 500; }

.page-h2 { font-family: 'Libre Baskerville', serif; font-size: 24px; color: var(--navy); font-weight: 400; margin-bottom: 4px; }
.page-sub { font-size: 13px; color: var(--tx2); margin-bottom: 22px; }

.hidden { display: none !important; }

@media (max-width: 600px) {
  .hdr { padding: 0 16px; }
  .g2, .g3 { grid-template-columns: 1fr; }
  .card { padding: 16px; }
  .acts { flex-direction: column; }
  .acts .btn { width: 100%; }
  .pline { max-width: 30px; }
  .fi, .fs, .fta { font-size: 16px; }
  .ogrid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
  .cat-tab { font-size: 10px; padding: 8px 2px; }
}
</style>
</head>
<body>
<div class="app">

<!-- HEADER -->
<div class="hdr">
  <div>
    <div class="hdr-brand">Tarda Tailor</div>
    <div class="hdr-name">Virtual Fitting System</div>
  </div>
  <div class="hdr-right">
    <button class="btn-hdr" onclick="toggleAdmin()">⚙ Admin</button>
    <button class="btn-hdr" onclick="toggleArchive()">📂 Archive</button>
  </div>
</div>

<!-- ADMIN PANEL -->
<div class="adm-panel" id="adm-panel">
  <div class="adm-t">⚙ Admin — Model Database</div>
  <div class="adm-s">Upload reference photos for each model type. AI uses these photos to generate accurate mockups. The more detailed the photo, the more accurate the result.</div>

  <!-- Category Tabs -->
  <div class="cat-tabs">
    <button class="cat-tab active" onclick="switchAdmCat('collar')">Collar</button>
    <button class="cat-tab" onclick="switchAdmCat('pocket')">Pocket</button>
    <button class="cat-tab" onclick="switchAdmCat('placket')">Placket</button>
    <button class="cat-tab" onclick="switchAdmCat('sleeve')">Sleeve</button>
    <button class="cat-tab" onclick="switchAdmCat('fabric')">Fabric</button>
  </div>

  <!-- Each category section -->
  <div id="adm-collar" class="db-section active"></div>
  <div id="adm-pocket" class="db-section"></div>
  <div id="adm-placket" class="db-section"></div>
  <div id="adm-sleeve" class="db-section"></div>
  <div id="adm-fabric" class="db-section"></div>
</div>

<!-- ARCHIVE PANEL -->
<div class="card hidden" id="arc-panel">
  <div class="card-t">Archive</div>
  <div class="card-s" id="arc-count">No orders yet.</div>
  <div id="arc-list"></div>
</div>

<!-- PROGRESS -->
<div class="prog hidden" id="prog">
  <div class="ps"><div class="pd" id="p1">1</div><div class="pl" id="pl1">Measurements</div></div>
  <div class="pline" id="ln1"></div>
  <div class="ps"><div class="pd" id="p2">2</div><div class="pl" id="pl2">Garment Model</div></div>
  <div class="pline" id="ln2"></div>
  <div class="ps"><div class="pd" id="p3">3</div><div class="pl" id="pl3">Result</div></div>
</div>

<!-- STEP 1: MEASUREMENTS -->
<div class="hidden" id="s1">
  <div class="page-h2">Customer Data & Measurements</div>
  <div class="page-sub">Enter measurements in fitting order — male customers only</div>
  <div class="card">
    <div class="sec-t">Customer Identity</div>
    <div class="g2">
      <div class="fw ga">
        <label class="fl">Customer Name</label>
        <input class="fi" id="f-nama" placeholder="Full name">
      </div>
      <div class="fw ga">
        <label class="fl">Body Type</label>
        <select class="fs" id="f-postur">
          <option value="slim slender">Slim / Slender</option>
          <option value="ideal average proportioned" selected>Ideal / Normal</option>
          <option value="stocky broad full-figured">Broad / Full-figured</option>
        </select>
      </div>
    </div>
    <div class="sec-t">Body Measurements</div>
    <div class="g2" id="m-grid"></div>
    <div class="sec-t">Customer Preferences</div>
    <div class="g2">
      <div class="fw">
        <label class="fl">Gamis Length <span class="req">*</span></label>
        <div class="ir"><input class="fi" type="number" id="f-panjangGamis" placeholder="143"><span class="unit">cm</span></div>
      </div>
      <div class="fw">
        <label class="fl">Bottom Width <span class="req">*</span></label>
        <div class="ir"><input class="fi" type="number" id="f-lebarBawah" placeholder="105"><span class="unit">cm</span></div>
      </div>
    </div>
    <div class="sec-t">Notes</div>
    <div class="fw">
      <label class="fl">Special Notes</label>
      <textarea class="fta" id="f-catatan" placeholder="Special requests, fit preferences, etc..."></textarea>
    </div>
    <div class="err-box hidden" id="s1-err"></div>
    <div class="acts">
      <button class="btn bn" onclick="goStep2()">Next: Choose Garment Model →</button>
    </div>
  </div>
</div>

<!-- STEP 2: GARMENT MODEL -->
<div class="hidden" id="s2">
  <div class="page-h2">Garment Model</div>
  <div class="page-sub">Select collar, pocket, placket, sleeve, and color</div>

  <div class="card">
    <div class="card-t">Collar</div>
    <div class="card-s">Reference photo required for accurate mockup result</div>
    <div class="ogrid" id="g-collar"></div>
  </div>
  <div class="card">
    <div class="card-t">Pocket</div>
    <div class="ogrid" id="g-pocket"></div>
  </div>
  <div class="card">
    <div class="card-t">Placket</div>
    <div class="ogrid" id="g-placket"></div>
  </div>
  <div class="card">
    <div class="card-t">Sleeve / Cuff</div>
    <div class="ogrid" id="g-sleeve"></div>
  </div>
  <div class="card">
    <div class="card-t">Fabric Texture</div>
    <div class="card-s" id="fabric-card-s">Select fabric texture — reference photo will be sent to AI for realistic result</div>
    <div class="ogrid" id="g-fabric"></div>
  </div>
  <div class="card">
    <div class="card-t">Color</div>
    <div class="sec-t">Select Color</div>
    <div class="chips" id="color-chips"></div>
    <div class="fw" style="margin-bottom:14px">
      <label class="fl">Or type custom color</label>
      <input class="fi" id="f-custom-color" placeholder="e.g. sage green, dusty rose, midnight blue..." oninput="onCustomColor()">
    </div>
    <div class="fw">
      <label class="fl">Additional Color Note (optional)</label>
      <input class="fi" id="f-color-note" placeholder="e.g. with gold embroidery detail, two-tone...">
    </div>
  </div>

  <div class="err-box hidden" id="s2-err"></div>
  <div class="acts">
    <button class="btn bn" onclick="doGenerate()">✨ Generate Mockup</button>
    <button class="btn bg" onclick="showScreen(1)">← Back</button>
  </div>
</div>

<!-- STEP 3: LOADING -->
<div class="hidden" id="s3">
  <div class="loading">
    <div class="spin"></div>
    <div class="load-t">Creating Virtual Mockup…</div>
    <div class="load-s" id="load-msg">Sending to OpenAI gpt-image-2…</div>
    <div class="load-s" style="margin-top:6px;font-size:11px;color:var(--tx3)">Process takes 20–40 seconds, please wait</div>
  </div>
</div>

<!-- STEP 4: RESULT -->
<div class="hidden" id="s4">
  <div class="page-h2">Fitting Complete 🎉</div>
  <div class="page-sub" id="res-cust">Virtual mockup ready</div>
  <div class="card">
    <div style="margin-bottom:18px">
      <div class="rlbl">Virtual Mockup — OpenAI gpt-image-2</div>
      <img id="res-img" class="result-img" src="" alt="mockup">
    </div>
    <div class="g2" style="margin-bottom:12px">
      <div class="info-card">
        <div class="info-card-t">Garment Specification</div>
        <div id="spec-rows"></div>
      </div>
      <div class="info-card">
        <div class="info-card-t">Body Measurements</div>
        <div id="meas-rows"></div>
      </div>
    </div>
    <div class="err-box hidden" id="s4-err"></div>
    <div class="acts">
      <button class="btn bn" onclick="doExportPDF()">📄 Export PDF</button>
      <button class="btn bwa" onclick="doShareWA()">📱 Send via WhatsApp</button>
      <button class="btn bo" onclick="doDownload()">⬇ Download</button>
      <button class="btn bg" onclick="showScreen(2)">← Edit Model</button>
      <button class="btn bg" onclick="doReset()">+ New Customer</button>
    </div>
  </div>
</div>

</div><!-- /app -->
<script>
// ════════════════════════════════════════
// ⚠️  PASTE YOUR OPENAI API KEY HERE
// ════════════════════════════════════════
const OPENAI_KEY = "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";
// ════════════════════════════════════════

const MFIELDS = [
  {id:"tinggiBadan",     label:"Height",               unit:"cm", ph:"169", req:true},
  {id:"beratBadan",      label:"Weight",               unit:"kg", ph:"79",  req:true},
  {id:"lingkarLeher",    label:"Neck Circumference",   unit:"cm", ph:"44",  req:true},
  {id:"bahu",            label:"Shoulder Width",       unit:"cm", ph:"49",  req:true},
  {id:"panjangLengan",   label:"Sleeve Length",        unit:"cm", ph:"61",  req:true},
  {id:"ujungLengan",     label:"Wrist Circumference",  unit:"cm", ph:"27",  req:false},
  {id:"siku",            label:"Elbow Circumference",  unit:"cm", ph:"23",  req:false},
  {id:"otot",            label:"Upper Arm (Bicep)",    unit:"cm", ph:"28",  req:false},
  {id:"ketiak",          label:"Underarm Width",       unit:"cm", ph:"36",  req:false},
  {id:"lingkarDada",     label:"Chest Circumference",  unit:"cm", ph:"105", req:true},
  {id:"lingkarPinggang", label:"Waist Circumference",  unit:"cm", ph:"97",  req:true},
  {id:"lingkarPinggul",  label:"Hip Circumference",    unit:"cm", ph:"101", req:true},
];

const COLORS = [
  {name:"White",        val:"pure crisp white"},
  {name:"Off White",    val:"soft warm off-white broken white"},
  {name:"Cream",        val:"warm cream ivory"},
  {name:"Light Grey",   val:"light silver grey"},
  {name:"Charcoal",     val:"dark charcoal grey"},
  {name:"Navy Blue",    val:"deep navy blue"},
  {name:"Royal Blue",   val:"rich royal blue"},
  {name:"Black",        val:"jet black"},
  {name:"Dark Brown",   val:"dark rich brown"},
  {name:"Tan Brown",    val:"warm tan light brown"},
  {name:"Forest Green", val:"deep forest bottle green"},
  {name:"Burgundy",     val:"deep maroon burgundy"},
  {name:"Olive",        val:"muted military olive green"},
  {name:"Sky Blue",     val:"soft powder sky blue"},
  {name:"Teal",         val:"deep teal"},
  {name:"Dusty Rose",   val:"muted dusty rose pink"},
];

// ─── CATEGORIES ───
const CATEGORIES = [
  { key:"collar",  label:"Collar",  icon:"👔", desc:"Model collar / neckline" },
  { key:"pocket",  label:"Pocket",  icon:"🪡", desc:"Model pocket / kantong" },
  { key:"placket", label:"Placket", icon:"▲",  desc:"Model placket / front opening" },
  { key:"sleeve",  label:"Sleeve",  icon:"🧵", desc:"Model sleeve / cuff" },
  { key:"fabric",  label:"Fabric",  icon:"🧶", desc:"Fabric texture — used for realistic rendering" },
];

// ─── STATE ───
let db = { collar:[], pocket:[], placket:[], sleeve:[], fabric:[] };
let sel = { collar:null, pocket:null, placket:null, sleeve:null, fabric:null };
let selColor="", customColor="", colorNote="";
let lastB64=null, lastOrder=null, orders=[];
let adminPhoto=null, admCat="collar";
let showAdmin=false, showArchive=false;

const ls = (k,v) => {
  if(v===undefined){try{return JSON.parse(localStorage.getItem(k));}catch{return null;}}
  try{localStorage.setItem(k,JSON.stringify(v));}catch{}
};

// ─── INIT ───
window.onload = () => {
  db      = ls("tt_db_v2")  || { collar:[], pocket:[], placket:[], sleeve:[], fabric:[] };
  orders  = ls("tt_orders") || [];

  document.getElementById("m-grid").innerHTML = MFIELDS.map(f=>`
    <div class="fw">
      <label class="fl">${f.label}${f.req?' <span class="req">*</span>':''}</label>
      <div class="ir">
        <input class="fi" type="number" id="f-${f.id}" placeholder="${f.ph}">
        <span class="unit">${f.unit}</span>
      </div>
    </div>`).join("");

  buildAllGrids();
  buildChips();
  buildAllAdmSections();
  showScreen(1);
};

// ─── BUILD GRIDS ───
function buildGrid(gridId, items, cat) {
  const el = document.getElementById(gridId);
  if(!el) return;
  if(!items||items.length===0){
    el.innerHTML=`<div class="empty-grid">No ${cat} photos in database yet.<br>Add via <strong>Admin ⚙</strong> to enable selection.</div>`;
    return;
  }
  el.innerHTML = items.map(item=>`
    <div class="opt${sel[cat]?.id===item.id?' sel':''}" id="opt-${cat}-${item.id}" onclick="selectOpt('${cat}','${item.id}')">
      <div class="opt-chk">✓</div>
      ${item.photo?`<img class="opt-img" src="data:image/jpeg;base64,${item.photo}" alt="${item.name}">`:`<div class="opt-ph">${CATEGORIES.find(c=>c.key===cat)?.icon||"◻"}</div>`}
      <div class="opt-n">${item.name}</div>
    </div>`).join("");
}

function buildAllGrids() {
  buildGrid("g-collar",  db.collar,  "collar");
  buildGrid("g-pocket",  db.pocket,  "pocket");
  buildGrid("g-placket", db.placket, "placket");
  buildGrid("g-sleeve",  db.sleeve,  "sleeve");
  buildGrid("g-fabric",  db.fabric,  "fabric");
}

function buildChips() {
  document.getElementById("color-chips").innerHTML = COLORS.map(c=>
    `<div class="chip${selColor===c.val&&!customColor?' sel':''}" id="chip-${c.name.replace(/\s/g,'_')}" onclick="selectColor('${c.name}','${c.val}')">${c.name}</div>`
  ).join("");
}

// ─── ADMIN SECTIONS ───
function buildAllAdmSections() {
  CATEGORIES.forEach(cat => buildAdmSection(cat));
}

function buildAdmSection(cat) {
  const el = document.getElementById("adm-"+cat.key);
  if(!el) return;
  const items = db[cat.key] || [];

  el.innerHTML = `
    <div class="db-add-form">
      <div class="db-add-title">Add / Update ${cat.label} Photo</div>
      <div class="g2">
        <div class="fw">
          <label class="fl">${cat.label} Model Name</label>
          <input class="fi" id="inp-name-${cat.key}" placeholder="e.g. ${getPlaceholder(cat.key)}" oninput="checkAdmSave('${cat.key}')">
        </div>
        <div class="fw">
          <label class="fl">Upload Photo</label>
          <input type="file" accept="image/*" class="fi" id="inp-file-${cat.key}" style="padding:8px 10px" onchange="handleAdmPhoto('${cat.key}',this)">
        </div>
      </div>
      <div style="margin-top:10px;display:flex;gap:10px;align-items:center">
        <button class="btn bn bsm" id="btn-save-${cat.key}" onclick="saveItem('${cat.key}')" disabled>+ Save to Database</button>
        <img id="prev-${cat.key}" style="height:36px;border-radius:5px;border:1px solid var(--bd);display:none">
      </div>
    </div>
    <div class="db-count">${cat.label} Database (${items.length} items)</div>
    <div class="db-item-list" id="list-${cat.key}">
      ${items.length===0?`<div style="text-align:center;padding:16px;color:var(--tx3);font-size:13px">No ${cat.label.toLowerCase()} data yet.</div>`:
        items.map(item=>`
          <div class="db-item">
            <div class="db-item-thumb">
              ${item.photo?`<img src="data:image/jpeg;base64,${item.photo}" alt="${item.name}">`:"📷"}
            </div>
            <div class="db-item-info">
              <div class="db-item-name">${item.name}</div>
              <div class="db-item-sub">${item.photo?"✓ Photo saved":"No photo"}</div>
            </div>
            <div class="db-item-act">
              <button class="btn bg bsm" onclick="deleteItem('${cat.key}','${item.id}')">Delete</button>
            </div>
          </div>`).join("")}
    </div>`;
}

function getPlaceholder(key) {
  return {
    collar:  "Classic Rounded, Long Farancy...",
    pocket:  "Front Pocket 1, Inside Pocket B...",
    placket: "Plaket Triangle, Plaket Hexagon...",
    sleeve:  "Rectangle Sleeve, Rounded Sleeve...",
    fabric:  "Premium Twill, Satin Silk...",
  }[key] || "Model name";
}

function switchAdmCat(cat) {
  admCat = cat;
  document.querySelectorAll(".cat-tab").forEach((t,i)=>t.classList.toggle("active", CATEGORIES[i]?.key===cat));
  document.querySelectorAll(".db-section").forEach(s=>s.classList.remove("active"));
  document.getElementById("adm-"+cat)?.classList.add("active");
}

function checkAdmSave(key) {
  const name=document.getElementById("inp-name-"+key)?.value.trim();
  document.getElementById("btn-save-"+key).disabled = !name || !adminPhoto || admCat!==key;
}

function handleAdmPhoto(key, input) {
  const file=input.files[0]; if(!file) return;
  const r=new FileReader();
  r.onloadend=()=>{
    adminPhoto=r.result.split(",")[1];
    const prev=document.getElementById("prev-"+key);
    if(prev){prev.src=r.result;prev.style.display="block";}
    checkAdmSave(key);
  };
  r.readAsDataURL(file);
}

function saveItem(key) {
  const name=document.getElementById("inp-name-"+key)?.value.trim();
  if(!name||!adminPhoto) return;

  const existIdx=db[key].findIndex(c=>c.name.toLowerCase()===name.toLowerCase());
  if(existIdx>=0){
    db[key][existIdx].photo=adminPhoto;
  } else {
    db[key].push({id:key+"_"+Date.now(), name, photo:adminPhoto});
  }
  ls("tt_db_v2", db);
  adminPhoto=null;
  document.getElementById("inp-file-"+key).value="";
  document.getElementById("inp-name-"+key).value="";
  document.getElementById("btn-save-"+key).disabled=true;
  const prev=document.getElementById("prev-"+key);
  if(prev) prev.style.display="none";
  buildAdmSection(CATEGORIES.find(c=>c.key===key));
  buildAllGrids();
  alert(`✓ "${name}" saved to ${key} database!`);
}

function deleteItem(key, id) {
  if(!confirm("Delete this item?")) return;
  db[key]=db[key].filter(i=>i.id!==id);
  ls("tt_db_v2",db);
  buildAdmSection(CATEGORIES.find(c=>c.key===key));
  buildAllGrids();
}

// ─── SCREEN ───
function showScreen(n) {
  [1,2,3,4].forEach(i=>document.getElementById("s"+i)?.classList.toggle("hidden",i!==n));
  document.getElementById("prog").classList.remove("hidden");
  updProg(n);
}

function updProg(n) {
  [1,2,3].forEach(i=>{
    const pd=document.getElementById("p"+i), pl=document.getElementById("pl"+i);
    if(!pd) return;
    pd.classList.remove("on","dn"); pl.classList.remove("on");
    const done=(n===4&&i<=3)||(n>i&&n<4);
    if(done){pd.classList.add("dn");pd.textContent="✓";}
    else if(i===n){pd.classList.add("on");pd.textContent=i;pl.classList.add("on");}
    else{pd.textContent=i;}
  });
  [1,2].forEach(i=>document.getElementById("ln"+i)?.classList.toggle("dn",(n>i&&n<4)||n===4));
}

function toggleAdmin(){
  showAdmin=!showAdmin; showArchive=false;
  document.getElementById("adm-panel").style.display=showAdmin?"block":"none";
  document.getElementById("arc-panel").classList.add("hidden");
}

function toggleArchive(){
  showArchive=!showArchive; showAdmin=false;
  document.getElementById("adm-panel").style.display="none";
  const p=document.getElementById("arc-panel");
  showArchive?(p.classList.remove("hidden"),renderArchive()):p.classList.add("hidden");
}

// ─── NAVIGATION ───
function goStep2() {
  const reqIds=[...MFIELDS.filter(f=>f.req).map(f=>f.id),"panjangGamis","lebarBawah"];
  if(reqIds.some(id=>!document.getElementById("f-"+id)?.value)){
    showErr("s1-err","Please fill in all required (*) fields."); return;
  }
  buildAllGrids();
  showScreen(2);
}

function doReset(){
  Object.keys(sel).forEach(k=>sel[k]=null);
  selColor=""; customColor=""; colorNote=""; lastB64=null; lastOrder=null;
  document.getElementById("f-nama").value="";
  MFIELDS.forEach(f=>{const el=document.getElementById("f-"+f.id);if(el)el.value="";});
  ["f-panjangGamis","f-lebarBawah","f-catatan","f-bahan","f-custom-color","f-color-note"]
    .forEach(id=>{const el=document.getElementById(id);if(el)el.value="";});
  document.querySelectorAll(".opt").forEach(el=>el.classList.remove("sel"));
  document.querySelectorAll(".chip").forEach(el=>el.classList.remove("sel"));
  showScreen(1);
}

// ─── SELECTION ───
function selectOpt(cat, id) {
  db[cat] && db[cat].forEach(i=>document.getElementById(`opt-${cat}-${i.id}`)?.classList.remove("sel"));
  document.getElementById(`opt-${cat}-${id}`)?.classList.add("sel");
  sel[cat]=db[cat]?.find(i=>i.id===id)||null;
}

function selectColor(name, val) {
  selColor=val; customColor="";
  document.getElementById("f-custom-color").value="";
  document.querySelectorAll(".chip").forEach(c=>c.classList.remove("sel"));
  document.getElementById("chip-"+name.replace(/\s/g,'_'))?.classList.add("sel");
}

function onCustomColor(){
  customColor=document.getElementById("f-custom-color").value;
  selColor="";
  document.querySelectorAll(".chip").forEach(c=>c.classList.remove("sel"));
}

// ─── MEASURES ───
function getMeasures(){
  const m={nama:document.getElementById("f-nama").value, postur:document.getElementById("f-postur").value};
  MFIELDS.forEach(f=>{m[f.id]=document.getElementById("f-"+f.id)?.value||"";});
  m.panjangGamis=document.getElementById("f-panjangGamis").value;
  m.lebarBawah=document.getElementById("f-lebarBawah").value;
  m.catatan=document.getElementById("f-catatan").value;
  return m;
}

// ─── PROMPT BUILDER ───
function buildPrompt(m, color, colorNote) {
  const collar  = sel.collar;
  const pocket  = sel.pocket;
  const placket = sel.placket;
  const sleeve  = sel.sleeve;
  const fabric  = sel.fabric;

  const hasRefs = [collar,pocket,placket,sleeve,fabric].filter(x=>x?.photo).map(x=>x.name);

  return `Professional full-body fashion catalog photograph for Tarda Tailor, a premium Indonesian custom Islamic menswear brand.
${hasRefs.length>0?`\nREFERENCE PHOTOS PROVIDED: ${hasRefs.join(", ")}. Reproduce each design element EXACTLY as shown in the reference photos — every detail must match precisely.\n`:""}
Subject: Muslim Indonesian man, ${m.postur} build, warm olive Southeast Asian skin tone. Height ${m.tinggiBadan}cm, weight ${m.beratBadan}kg. Neck ${m.lingkarLeher}cm, shoulder width ${m.bahu}cm, sleeve length ${m.panjangLengan}cm, chest ${m.lingkarDada}cm, waist ${m.lingkarPinggang}cm, hips ${m.lingkarPinggul}cm.

GARMENT — Premium custom-tailored gamis (Islamic long robe):
- Color: ${color}${colorNote?`, ${colorNote}`:""}
- Collar: ${collar?"EXACTLY as reference photo — "+collar.name:"not specified"}
- Pocket: ${pocket?"EXACTLY as reference photo — "+pocket.name:"not specified"}
- Placket: ${placket?"EXACTLY as reference photo — "+placket.name:"not specified"}
- Sleeve/Cuff: ${sleeve?"EXACTLY as reference photo — "+sleeve.name:"not specified"}
- Fabric: ${fabric?"EXACTLY as reference photo texture — "+fabric.name+", realistic fabric draping and texture":"premium smooth fabric, realistic draping"}
- Garment length: ${m.panjangGamis}cm floor-length
- Bottom hem width: ${m.lebarBawah}cm
- Silhouette: tailored semi-fitted, structured and refined${m.catatan?`\n- Special notes: ${m.catatan}`:""}

OUTPUT: Pure white studio background. Full body front-facing, entire figure head to feet visible. Neutral standing pose, arms slightly away from body. High-end fashion editorial quality, sharp fabric detail, realistic texture and draping.`;
}

// ─── OPENAI API ───
async function callOpenAI(prompt) {
  const setMsg = msg => document.getElementById("load-msg").textContent = msg;

  // Collect all reference photos
  const refs = CATEGORIES.map(c=>({cat:c.key, item:sel[c.key]})).filter(x=>x.item?.photo);

  if(refs.length > 0) {
    setMsg(`Sending ${refs.length} reference photo(s) + measurements to OpenAI…`);

    // Use edits endpoint with first reference image (most important = collar)
    const primary = refs.find(r=>r.cat==="collar") || refs[0];
    const byteStr=atob(primary.item.photo);
    const ab=new ArrayBuffer(byteStr.length);
    const ia=new Uint8Array(ab);
    for(let i=0;i<byteStr.length;i++) ia[i]=byteStr.charCodeAt(i);
    const blob=new Blob([ab],{type:"image/jpeg"});

    const fd=new FormData();
    fd.append("model","gpt-image-2");
    fd.append("image",blob,`${primary.cat}-reference.jpg`);
    fd.append("prompt",`The provided image shows the reference design for: ${primary.item.name}. ${prompt}`);
    fd.append("n","1");
    fd.append("size","1024x1536");

    const res=await fetch("https://api.openai.com/v1/images/edits",{
      method:"POST",headers:{"Authorization":`Bearer ${OPENAI_KEY}`},body:fd,
    });
    const data=await res.json();
    if(!res.ok) throw new Error(data?.error?.message||`HTTP ${res.status}`);
    const b64=data?.data?.[0]?.b64_json;
    if(!b64) throw new Error("No image returned from OpenAI.");
    return b64;
  }

  // No reference photos — use generations endpoint
  setMsg("Sending to OpenAI gpt-image-2…");
  const res=await fetch("https://api.openai.com/v1/images/generations",{
    method:"POST",
    headers:{"Authorization":`Bearer ${OPENAI_KEY}`,"Content-Type":"application/json"},
    body:JSON.stringify({model:"gpt-image-2",prompt,n:1,size:"1024x1536",quality:"high"}),
  });
  const data=await res.json();
  if(!res.ok) throw new Error(data?.error?.message||`HTTP ${res.status}`);
  const b64=data?.data?.[0]?.b64_json;
  if(!b64) throw new Error("No image returned from OpenAI.");
  return b64;
}

async function doGenerate() {
  if(!sel.collar) {showErr("s2-err","Please select a collar model.");return;}
  if(!sel.pocket) {showErr("s2-err","Please select a pocket model.");return;}
  if(!sel.placket){showErr("s2-err","Please select a placket model.");return;}
  if(!sel.sleeve) {showErr("s2-err","Please select a sleeve model.");return;}
  const color=customColor||selColor;
  if(!color){showErr("s2-err","Please select or type a color.");return;}
  const cn=document.getElementById("f-color-note").value;

  showScreen(3);
  const m=getMeasures();
  const prompt=buildPrompt(m,color,cn);

  try {
    const img=await callOpenAI(prompt);
    lastB64=img;
    lastOrder={
      id:Date.now(),
      nama:m.nama||"Customer",
      tgl:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),
      m,
      collar:sel.collar, pocket:sel.pocket, placket:sel.placket, sleeve:sel.sleeve, fabric:sel.fabric,
      color, colorNote:cn,
      gamisImg:img,
    };
    orders.unshift(lastOrder);
    if(orders.length>30) orders.pop();
    ls("tt_orders",orders);
    renderResult(lastOrder);
    showScreen(4);
  } catch(e) {
    showScreen(2);
    showErr("s2-err","Error: "+e.message);
  }
}

// ─── RENDER RESULT ───
function renderResult(o) {
  document.getElementById("res-cust").textContent="Virtual mockup for "+(o.nama||"Customer");
  document.getElementById("res-img").src="data:image/png;base64,"+o.gamisImg;
  const irow=(k,v)=>v?`<div class="irow"><span class="ik">${k}</span><span class="iv">${v}</span></div>`:"";
  document.getElementById("spec-rows").innerHTML=[
    irow("Collar",    o.collar?.name),
    irow("Pocket",    o.pocket?.name),
    irow("Placket",   o.placket?.name),
    irow("Sleeve",    o.sleeve?.name),
    o.fabric?irow("Fabric",o.fabric?.name):"",
    irow("Color",     o.color+(o.colorNote?` — ${o.colorNote}`:"")),
    irow("Length",    `${o.m.panjangGamis} cm`),
    irow("Hem Width", `${o.m.lebarBawah} cm`),
    o.m.catatan?irow("Notes",o.m.catatan):"",
  ].join("");
  document.getElementById("meas-rows").innerHTML=[
    irow("Name",    o.m.nama||"-"),
    irow("H / W",   `${o.m.tinggiBadan} cm · ${o.m.beratBadan} kg`),
    irow("Neck",    `${o.m.lingkarLeher} cm`),
    irow("Shoulder",`${o.m.bahu} cm`),
    irow("Sleeve",  `${o.m.panjangLengan} cm`),
    o.m.ujungLengan?irow("Wrist",`${o.m.ujungLengan} cm`):"",
    o.m.siku?irow("Elbow",`${o.m.siku} cm`):"",
    o.m.otot?irow("Bicep",`${o.m.otot} cm`):"",
    o.m.ketiak?irow("Underarm",`${o.m.ketiak} cm`):"",
    irow("Chest",   `${o.m.lingkarDada} cm`),
    irow("Waist",   `${o.m.lingkarPinggang} cm`),
    irow("Hips",    `${o.m.lingkarPinggul} cm`),
  ].join("");
}

// ─── EXPORT ───
function doDownload(){
  if(!lastB64) return;
  const a=document.createElement("a");
  a.href="data:image/png;base64,"+lastB64;
  a.download="mockup-"+(lastOrder?.nama||"customer").replace(/\s/g,"-")+".png";
  a.click();
}

function doShareWA(){
  if(!lastOrder) return;
  const o=lastOrder;
  const t=`*ORDER FITTING — TARDA TAILOR*\n\n👤 *Customer:* ${o.nama}\n📅 *Date:* ${o.tgl}\n\n`+
    `📏 *Body Measurements:*\n`+
    `• Height: ${o.m.tinggiBadan} cm\n• Weight: ${o.m.beratBadan} kg\n`+
    `• Neck: ${o.m.lingkarLeher} cm\n• Shoulder: ${o.m.bahu} cm\n`+
    `• Sleeve: ${o.m.panjangLengan} cm\n`+
    (o.m.ujungLengan?`• Wrist: ${o.m.ujungLengan} cm\n`:"")+
    (o.m.siku?`• Elbow: ${o.m.siku} cm\n`:"")+
    (o.m.otot?`• Bicep: ${o.m.otot} cm\n`:"")+
    (o.m.ketiak?`• Underarm: ${o.m.ketiak} cm\n`:"")+
    `• Chest: ${o.m.lingkarDada} cm\n• Waist: ${o.m.lingkarPinggang} cm\n`+
    `• Hips: ${o.m.lingkarPinggul} cm\n• Length: ${o.m.panjangGamis} cm\n`+
    `• Hem Width: ${o.m.lebarBawah} cm\n\n`+
    `👗 *Garment Specification:*\n`+
    `• Collar: ${o.collar?.name||"-"}\n• Pocket: ${o.pocket?.name||"-"}\n`+
    `• Placket: ${o.placket?.name||"-"}\n• Sleeve: ${o.sleeve?.name||"-"}\n`+
    (o.fabric?`• Fabric: ${o.fabric?.name}\n`:"")+
    `• Color: ${o.color}${o.colorNote?` — ${o.colorNote}`:""}\n`+
    (o.m.catatan?`• Notes: ${o.m.catatan}\n`:"")+
    `\n_Tarda Tailor Virtual Fitting System_`;
  window.open("https://wa.me/?text="+encodeURIComponent(t),"_blank");
}

function doExportPDF(){
  if(!lastOrder) return;
  const o=lastOrder;
  const row=(k,v)=>v?`<div class="row"><span class="lbl">${k}</span><span class="val">${v}</span></div>`:"";
  const win=window.open("","_blank");
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Order Fitting — ${o.nama}</title>
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
<style>body{font-family:'DM Sans',sans-serif;max-width:780px;margin:0 auto;padding:32px;color:#1c2b4a;font-size:12px}
.hdr{background:#1c2b4a;color:#faf8f4;padding:18px 24px;border-radius:8px;margin-bottom:22px;display:flex;align-items:center;justify-content:space-between}
.brand{font-size:8px;letter-spacing:5px;text-transform:uppercase;color:#d4a85c;margin-bottom:3px}
h1{font-family:'Libre Baskerville',serif;font-size:20px;font-weight:400;margin:0}.meta{font-size:12px;color:#c8d8f0}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px}
.sec{background:#f5f2ec;border:1px solid #d4cec4;border-radius:7px;padding:13px}
.sec h3{font-size:8px;text-transform:uppercase;letter-spacing:1.5px;color:#b8924a;margin:0 0 9px;padding-bottom:6px;border-bottom:1px solid #d4cec4}
.row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #e6dfd2;font-size:11px}
.row:last-child{border:none}.lbl{color:#556070}.val{text-align:right;color:#1c2b4a;font-weight:500}
.mockup{text-align:center;margin-top:14px}.mockup p{font-size:8px;text-transform:uppercase;letter-spacing:1.5px;color:#8a98ae;margin-bottom:6px}
.mockup img{max-width:260px;width:100%;border-radius:8px;border:1px solid #d4cec4}
.footer{text-align:center;margin-top:20px;font-size:9px;color:#8a98ae;border-top:1px solid #e6dfd2;padding-top:12px}
@media print{body{padding:16px}}</style></head><body>
<div class="hdr"><div><div class="brand">Tarda Tailor</div><h1>Order Fitting Sheet</h1></div><div class="meta">${o.nama}<br>${o.tgl}</div></div>
<div class="grid">
<div class="sec"><h3>Body Measurements</h3>
${row("Name",o.m.nama||"-")}${row("Height",o.m.tinggiBadan+" cm")}${row("Weight",o.m.beratBadan+" kg")}
${row("Neck",o.m.lingkarLeher+" cm")}${row("Shoulder",o.m.bahu+" cm")}${row("Sleeve",o.m.panjangLengan+" cm")}
${o.m.ujungLengan?row("Wrist",o.m.ujungLengan+" cm"):""}${o.m.siku?row("Elbow",o.m.siku+" cm"):""}
${o.m.otot?row("Bicep",o.m.otot+" cm"):""}${o.m.ketiak?row("Underarm",o.m.ketiak+" cm"):""}
${row("Chest",o.m.lingkarDada+" cm")}${row("Waist",o.m.lingkarPinggang+" cm")}
${row("Hips",o.m.lingkarPinggul+" cm")}${row("Length",o.m.panjangGamis+" cm")}${row("Hem Width",o.m.lebarBawah+" cm")}
</div>
<div class="sec"><h3>Garment Specification</h3>
${row("Collar",o.collar?.name)}${row("Pocket",o.pocket?.name)}
${row("Placket",o.placket?.name)}${row("Sleeve",o.sleeve?.name)}
${o.fabric?row("Fabric",o.fabric?.name):""}
${row("Color",o.color+(o.colorNote?` — ${o.colorNote}`:""))}
${o.m.catatan?row("Notes",o.m.catatan):""}
</div></div>
${o.gamisImg?`<div class="mockup"><p>Virtual Mockup — Tarda Tailor</p><img src="data:image/png;base64,${o.gamisImg}"></div>`:""}
<div class="footer">Tarda Tailor · Virtual Fitting System · ${o.tgl}</div>
<script>window.onload=()=>window.print()<\/script></body></html>`);
  win.document.close();
}

// ─── ARCHIVE ───
function renderArchive(){
  const cnt=document.getElementById("arc-count"), list=document.getElementById("arc-list");
  if(!orders.length){cnt.textContent="No orders yet.";list.innerHTML="";return;}
  cnt.textContent=`${orders.length} orders saved in this browser.`;
  list.innerHTML=orders.map(o=>`
    <div class="arc-item">
      ${o.gamisImg?`<div class="arc-thumb"><img src="data:image/png;base64,${o.gamisImg}" alt=""></div>`:`<div class="arc-thumb">👔</div>`}
      <div class="arc-info">
        <div class="arc-name">${o.nama}</div>
        <div class="arc-date">${o.tgl}</div>
        <div class="arc-tags">
          ${o.collar?`<span class="tag">${o.collar.name}</span>`:""}
          <span class="tag">${(o.color||"").split(" ")[0]}</span>
          <span class="tag">${o.m?.tinggiBadan||""}cm</span>
        </div>
      </div>
      <div class="arc-act">
        <button class="btn bg bsm" onclick="arcPDF(${o.id})">PDF</button>
        <button class="btn bg bsm" onclick="arcWA(${o.id})">WA</button>
      </div>
    </div>`).join("");
}

function arcPDF(id){const o=orders.find(x=>x.id===id);if(!o)return;lastOrder=o;lastB64=o.gamisImg;doExportPDF();}
function arcWA(id){const o=orders.find(x=>x.id===id);if(!o)return;lastOrder=o;doShareWA();}

function showErr(id,msg){
  const el=document.getElementById(id);
  if(!el) return;
  el.textContent=msg; el.classList.remove("hidden");
  setTimeout(()=>el.classList.add("hidden"),7000);
}
</script>
</body>
</html>
