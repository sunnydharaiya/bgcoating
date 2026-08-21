/* ==========================================================================
   BG CoatingOS™ — React Single Page Application (SPA) Calculator Engine
   Powered by React + Django REST Framework Calculation & Audit Logging API
   ========================================================================== */

const { useState, useEffect } = React;

function CoatingOSApp() {
  // Navigation & Tool Tab
  const [activeTab, setActiveTab] = useState('tank_shell');
  
  // User Authentication & Session
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loginCreds, setLoginCreds] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Paint Products & Projects
  const [paintProducts, setPaintProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  
  // Audit Logs & Drawer
  const [auditLogs, setAuditLogs] = useState([]);
  const [showLogDrawer, setShowLogDrawer] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Form Inputs — Tank Shell
  const [tankShell, setTankShell] = useState({
    diameter: 15.0,
    height: 12.0,
    volume_solids: 65.0,
    dft: 100,
    loss_pct: 30.0,
    unit_system: 'metric'
  });

  // Form Inputs — Tank Roof
  const [tankRoof, setTankRoof] = useState({
    roof_type: 'conical',
    diameter: 15.0,
    roof_height: 2.5,
    volume_solids: 65.0,
    dft: 100,
    loss_pct: 30.0
  });

  // Form Inputs — Pipe Spool
  const [pipeSpool, setPipeSpool] = useState({
    outer_diameter_mm: 323.9,
    length_m: 6.0,
    quantity: 10,
    volume_solids: 65.0,
    dft: 100,
    loss_pct: 30.0
  });

  // Form Inputs — Abrasive Blasting
  const [abrasive, setAbrasive] = useState({
    surface_area_m2: 500.0,
    abrasive_type: 'garnet',
    initial_condition: 'B'
  });

  // Calculation Output Result
  const [activeResult, setActiveResult] = useState(null);

  // Fetch initial products and audit logs
  useEffect(() => {
    fetchPaintProducts();
    fetchAuditLogs();
    fetchUserProjects();
    const savedToken = localStorage.getItem('coatingos_token');
    const savedUser = localStorage.getItem('coatingos_username');
    if (savedToken && savedUser) {
      setUser({ username: savedUser, token: savedToken });
    }
  }, []);

  const fetchPaintProducts = async () => {
    try {
      const res = await fetch('/api/v1/calculator/products/');
      if (res.ok) {
        const data = await res.json();
        setPaintProducts(data);
      }
    } catch (e) {
      console.warn("Could not fetch paint products catalog.", e);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem('coatingos_token');
      const headers = token ? { 'Authorization': `Token ${token}` } : {};
      const res = await fetch('/api/v1/calculator/logs/', { headers });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data);
      }
    } catch (e) {
      console.warn("Could not fetch calculation audit logs.", e);
    }
  };

  const fetchUserProjects = async () => {
    try {
      const res = await fetch('/api/v1/calculator/projects/');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (e) {
      console.warn("Could not fetch user projects.", e);
    }
  };

  // Perform Calculation & Record Audit Log
  const runCalculation = async (overrideType, overrideData) => {
    setIsCalculating(true);
    const calcType = overrideType || activeTab;
    let payload = { type: calcType, project_id: selectedProject || null };

    if (calcType === 'tank_shell') payload = { ...payload, ...tankShell };
    else if (calcType === 'tank_roof') payload = { ...payload, ...tankRoof };
    else if (calcType === 'pipe_spool') payload = { ...payload, ...pipeSpool };
    else if (calcType === 'abrasive_blasting') payload = { ...payload, ...abrasive };

    if (overrideData) payload = { ...payload, ...overrideData };

    try {
      const token = localStorage.getItem('coatingos_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Token ${token}`;

      const res = await fetch('/api/v1/calculator/calculate/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setActiveResult(data.result);
        fetchAuditLogs(); // Refresh logs drawer
      } else {
        alert("Calculation error. Please check parameters.");
      }
    } catch (err) {
      console.error("Calculation API failure:", err);
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle Paint Product Auto-fill Selection
  const handleProductSelect = (productId, targetForm, setFormState) => {
    setSelectedProduct(productId);
    const prod = paintProducts.find(p => p.id === parseInt(productId));
    if (prod) {
      setFormState(prev => ({
        ...prev,
        volume_solids: prod.volume_solids_pct,
        dft: prod.default_dft_microns
      }));
    }
  };

  // Auth Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/v1/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginCreds)
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('coatingos_token', data.token);
        localStorage.setItem('coatingos_username', data.username);
        setUser({ username: data.username, token: data.token });
        setShowAuthModal(false);
        fetchAuditLogs();
        fetchUserProjects();
      } else {
        setAuthError(data.error || "Authentication failed.");
      }
    } catch (err) {
      setAuthError("Network failure connecting to login API.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('coatingos_token');
    localStorage.removeItem('coatingos_username');
    setUser(null);
  };

  return (
    <div className="bg-white-workspace text-charcoal font-sans min-h-screen flex flex-col">
      
      {/* ================= HEADER RAIL ================= */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-slate-950 font-extrabold px-3 py-1 rounded text-sm tracking-wider">
            BG CoatingOS™
          </div>
          <span className="text-slate-300 text-sm hidden md:inline font-mono">
            Industrial Surface & Protective Coating Estimator
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {/* Project Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Project:</span>
            <select 
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
            >
              <option value="">General (Unassigned)</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title} ({p.client_name || 'Client'})</option>
              ))}
            </select>
          </div>

          {/* Log History Toggle */}
          <button 
            onClick={() => setShowLogDrawer(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded text-xs font-mono border border-slate-700 transition"
          >
            <span>📜 Audit Logs</span>
            <span className="bg-amber-500/20 text-amber-300 rounded-full px-1.5 py-0.2 text-[10px]">
              {auditLogs.length}
            </span>
          </button>

          {/* Account Profile / Login Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-slate-200">👤 {user.username}</span>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 text-xs underline">Logout</button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded text-xs transition"
            >
              🔑 User Login
            </button>
          )}
        </div>
      </header>

      {/* ================= TOOL NAV TABS ================= */}
      <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center gap-2 overflow-x-auto">
        <button 
          onClick={() => { setActiveTab('tank_shell'); setActiveResult(null); }}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition ${activeTab === 'tank_shell' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
        >
          🛢️ Storage Tank Shell
        </button>

        <button 
          onClick={() => { setActiveTab('tank_roof'); setActiveResult(null); }}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition ${activeTab === 'tank_roof' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
        >
          ⛺ Tank Roof (Conical/Dome)
        </button>

        <button 
          onClick={() => { setActiveTab('pipe_spool'); setActiveResult(null); }}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition ${activeTab === 'pipe_spool' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
        >
          🔧 Pipe Spool System
        </button>

        <button 
          onClick={() => { setActiveTab('abrasive_blasting'); setActiveResult(null); }}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition ${activeTab === 'abrasive_blasting' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
        >
          💥 Abrasive Blasting Media
        </button>
      </div>

      {/* ================= WORKSPACE BODY ================= */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Input Form Panel */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          
          {/* Tank Shell Controls */}
          {activeTab === 'tank_shell' && (
            <div className="space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-lg font-bold text-slate-900">Storage Tank Shell Surface Area & Coating Calculator</h2>
                <p className="text-xs text-slate-500">Calculates cylindrical shell area, theoretical paint coverage, and loss-adjusted liters.</p>
              </div>

              {/* Paint Spec Selector */}
              {paintProducts.length > 0 && (
                <div className="bg-amber-50/60 border border-amber-200 p-3 rounded-xl">
                  <label className="block text-xs font-semibold text-amber-900 mb-1">⚡ Auto-fill Paint Spec from Database Catalog:</label>
                  <select 
                    className="w-full bg-white border border-amber-300 rounded px-3 py-1.5 text-xs text-slate-800"
                    value={selectedProduct}
                    onChange={e => handleProductSelect(e.target.value, tankShell, setTankShell)}
                  >
                    <option value="">-- Custom Paint Specs --</option>
                    {paintProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.manufacturer} — {p.name} (VS {p.volume_solids_pct}%, DFT {p.default_dft_microns}µm)</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tank Outer Diameter (meters):</label>
                  <input 
                    type="number" step="0.1" min="0.5"
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-mono focus:ring-2 focus:ring-amber-500"
                    value={tankShell.diameter}
                    onChange={e => setTankShell({ ...tankShell, diameter: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Shell Height (meters):</label>
                  <input 
                    type="number" step="0.1" min="0.5"
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-mono focus:ring-2 focus:ring-amber-500"
                    value={tankShell.height}
                    onChange={e => setTankShell({ ...tankShell, height: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Volume Solids (%):</label>
                  <input 
                    type="number" step="1" min="10" max="100"
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-mono"
                    value={tankShell.volume_solids}
                    onChange={e => setTankShell({ ...tankShell, volume_solids: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target DFT (microns µm):</label>
                  <input 
                    type="number" step="5" min="10"
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-mono"
                    value={tankShell.dft}
                    onChange={e => setTankShell({ ...tankShell, dft: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Application Loss (%):</label>
                  <input 
                    type="number" step="5" min="0" max="80"
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-mono"
                    value={tankShell.loss_pct}
                    onChange={e => setTankShell({ ...tankShell, loss_pct: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <button 
                onClick={() => runCalculation('tank_shell')}
                disabled={isCalculating}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
              >
                {isCalculating ? "Calculating & Logging..." : "⚡ Calculate & Log Audit Entry"}
              </button>
            </div>
          )}

          {/* Tank Roof Controls */}
          {activeTab === 'tank_roof' && (
            <div className="space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-lg font-bold text-slate-900">Tank Roof Surface Area Calculator</h2>
                <p className="text-xs text-slate-500">Supports Conical, Dome, and Flat tank roof geometry calculation.</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Roof Geometry:</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                    value={tankRoof.roof_type}
                    onChange={e => setTankRoof({ ...tankRoof, roof_type: e.target.value })}
                  >
                    <option value="conical">Conical Roof</option>
                    <option value="dome">Dome / Spherical Roof</option>
                    <option value="flat">Flat Roof</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tank Diameter (m):</label>
                  <input 
                    type="number" step="0.5"
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-mono"
                    value={tankRoof.diameter}
                    onChange={e => setTankRoof({ ...tankRoof, diameter: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Roof Crown Height (m):</label>
                  <input 
                    type="number" step="0.1"
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-mono"
                    value={tankRoof.roof_height}
                    onChange={e => setTankRoof({ ...tankRoof, roof_height: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <button 
                onClick={() => runCalculation('tank_roof')}
                disabled={isCalculating}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-sm transition shadow-md"
              >
                {isCalculating ? "Calculating..." : "⚡ Calculate Tank Roof Area"}
              </button>
            </div>
          )}

          {/* Pipe Spool Controls */}
          {activeTab === 'pipe_spool' && (
            <div className="space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-lg font-bold text-slate-900">Pipe Spool External Surface Area Engine</h2>
                <p className="text-xs text-slate-500">Calculates outer pipe surface area based on Outer Diameter (OD mm) and spool lengths.</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Outer Diameter (OD mm):</label>
                  <input 
                    type="number" step="1"
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-mono"
                    value={pipeSpool.outer_diameter_mm}
                    onChange={e => setPipeSpool({ ...pipeSpool, outer_diameter_mm: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Single Spool Length (m):</label>
                  <input 
                    type="number" step="0.5"
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-mono"
                    value={pipeSpool.length_m}
                    onChange={e => setPipeSpool({ ...pipeSpool, length_m: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pipe Quantity:</label>
                  <input 
                    type="number" step="1" min="1"
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-mono"
                    value={pipeSpool.quantity}
                    onChange={e => setPipeSpool({ ...pipeSpool, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <button 
                onClick={() => runCalculation('pipe_spool')}
                disabled={isCalculating}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-sm transition shadow-md"
              >
                {isCalculating ? "Calculating..." : "⚡ Calculate Pipe Spools"}
              </button>
            </div>
          )}

          {/* Abrasive Blasting Controls */}
          {activeTab === 'abrasive_blasting' && (
            <div className="space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-lg font-bold text-slate-900">Abrasive Blasting Media Consumption</h2>
                <p className="text-xs text-slate-500">Estimates Garnet / Copper Slag media consumption in kg & metric tons based on rust grades.</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Surface Area (m²):</label>
                  <input 
                    type="number" step="10"
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-mono"
                    value={abrasive.surface_area_m2}
                    onChange={e => setAbrasive({ ...abrasive, surface_area_m2: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Abrasive Media Type:</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                    value={abrasive.abrasive_type}
                    onChange={e => setAbrasive({ ...abrasive, abrasive_type: e.target.value })}
                  >
                    <option value="garnet">Garnet (Grit 30/60)</option>
                    <option value="copper_slag">Copper Slag</option>
                    <option value="steel_grit">Steel Shot / Grit</option>
                    <option value="aluminum_oxide">Aluminum Oxide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Steel Condition:</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                    value={abrasive.initial_condition}
                    onChange={e => setAbrasive({ ...abrasive, initial_condition: e.target.value })}
                  >
                    <option value="A">Grade A (Mill scale intact)</option>
                    <option value="B">Grade B (Rust starting)</option>
                    <option value="C">Grade C (Pitted rust)</option>
                    <option value="D">Grade D (Severe pitting)</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => runCalculation('abrasive_blasting')}
                disabled={isCalculating}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-sm transition shadow-md"
              >
                {isCalculating ? "Calculating..." : "⚡ Estimate Abrasive Media"}
              </button>
            </div>
          )}

        </div>

        {/* Right Output Panel & Summary Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-amber-400 tracking-wider uppercase font-mono">📊 Engineering Calculation Output</h3>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">Verified API</span>
            </div>

            {activeResult ? (
              <div className="space-y-4">
                
                {/* Surface Area Big Display */}
                {activeResult.surface_area_m2 !== undefined && (
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
                    <span className="text-xs text-slate-400 uppercase font-mono block mb-1">Calculated Surface Area</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white">{activeResult.surface_area_m2}</span>
                      <span className="text-amber-400 font-bold">m²</span>
                      <span className="text-slate-400 text-xs ml-auto">({activeResult.surface_area_sqft} sq ft)</span>
                    </div>
                  </div>
                )}

                {/* Pipe Spool Area Display */}
                {activeResult.total_surface_area_m2 !== undefined && (
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
                    <span className="text-xs text-slate-400 uppercase font-mono block mb-1">Total Pipe Surface Area</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white">{activeResult.total_surface_area_m2}</span>
                      <span className="text-amber-400 font-bold">m²</span>
                      <span className="text-slate-400 text-xs ml-auto">({activeResult.total_surface_area_sqft} sq ft)</span>
                    </div>
                  </div>
                )}

                {/* Paint Volume Results */}
                {activeResult.practical_liters !== undefined && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Theoretical Liters</span>
                      <span className="text-xl font-bold text-slate-200">{activeResult.theoretical_liters} L</span>
                    </div>
                    <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/30">
                      <span className="text-[10px] text-amber-400 uppercase font-mono block">Practical Liters (Loss Incl.)</span>
                      <span className="text-xl font-extrabold text-amber-300">{activeResult.practical_liters} L</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">({activeResult.practical_gallons} US Gal)</span>
                    </div>
                  </div>
                )}

                {/* Abrasive Blasting Results */}
                {activeResult.consumption_kg !== undefined && (
                  <div className="space-y-3">
                    <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/30">
                      <span className="text-[10px] text-amber-400 uppercase font-mono block">Media Required</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-amber-300">{activeResult.consumption_metric_tons}</span>
                        <span className="text-xs text-amber-400">Metric Tons</span>
                        <span className="text-slate-400 text-xs ml-auto">({activeResult.consumption_kg} kg)</span>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Estimated Nozzle Hours</span>
                      <span className="text-lg font-bold text-slate-200">{activeResult.estimated_nozzle_hours} Hours</span>
                    </div>
                  </div>
                )}

                <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span>✓ Server Audit Log Entry Recorded</span>
                  <span className="text-amber-400">ISO 12944 / NACE Aligned</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p className="text-3xl mb-2">📐</p>
                <p className="text-sm font-semibold">Ready for Engineering Calculation</p>
                <p className="text-xs text-slate-600 mt-1">Adjust parameters on the left and click Calculate to trigger math & audit logging.</p>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* ================= AUDIT LOG SLIDE-OVER DRAWER ================= */}
      {showLogDrawer && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex justify-end">
          <div className="bg-slate-900 text-white w-full max-w-lg h-full p-6 shadow-2xl overflow-y-auto flex flex-col border-l border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-lg text-amber-400">📜 Audit Activity Log</h3>
                <p className="text-xs text-slate-400">Real-time database audit log of calculation requests</p>
              </div>
              <button 
                onClick={() => setShowLogDrawer(false)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 space-y-3">
              {auditLogs.length > 0 ? (
                auditLogs.map(log => (
                  <div key={log.id} className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/70 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-300 font-mono">#{log.id} {log.calculator_type_display}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.created_at ? new Date(log.created_at).toLocaleString() : ''}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono bg-slate-950/50 p-2 rounded overflow-x-auto">
                      <p className="text-slate-400 text-[10px]">User: {log.username || 'Guest'}</p>
                      <p className="text-emerald-400 mt-1">Result: {JSON.stringify(log.result_data)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-xs text-center py-8">No calculation logs recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= LOGIN MODAL ================= */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-base">🔑 CoatingOS User Login</h3>
              <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            {authError && (
              <div className="bg-red-50 text-red-600 text-xs p-2.5 rounded-lg mb-3 border border-red-200">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username:</label>
                <input 
                  type="text" required
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                  value={loginCreds.username}
                  onChange={e => setLoginCreds({ ...loginCreds, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password:</label>
                <input 
                  type="password" required
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                  value={loginCreds.password}
                  onChange={e => setLoginCreds({ ...loginCreds, password: e.target.value })}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition shadow"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Render React App into #reactCalculatorRoot
const rootElement = document.getElementById('reactCalculatorRoot');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<CoatingOSApp />);
}
