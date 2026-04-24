"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { ensamblarContexto, renderizarBloques } from "@/lib/plantillas/ensamblador";
import PLANTILLA_CONTRATO from "@/lib/plantillas/contrato_administracion";
import PLANTILLA_ADDENDUM from "@/lib/plantillas/addendum_personalizado";
import { generarDocxBlob } from "@/lib/docx/generador";
import { generarDocxAddendumBlob } from "@/lib/docx/generador_addendum";

// Alias retro-compatible para el resto del código
const PLANTILLA = PLANTILLA_CONTRATO;

// Mapa de plantillas disponibles
const PLANTILLAS = {
  contrato: PLANTILLA_CONTRATO,
  addendum: PLANTILLA_ADDENDUM,
};

// ============================================================
// DEMO DATA (Herbert Sears → La Jolla de Mismaloya)
// ============================================================
const DEMO = {
  partes: {
    propietario: {
      personas: [{ nombre: "HERBERT SEARS TRUE", genero: "M" }],
      tipoPersona: "fisica",
      email: "htsears@searsconsult.com",
      celular: "+1 555 123 4567",
    },
  },
  bloques: {
    cl_reportes_ocupantes: true,
    cl_exclusividad_renta: true,
    cl_exclusividad_venta: false,
    cl_condominio_areas: true,
    cl_limpieza: true,
    cl_limpieza_logistica: true,
    cl_limpieza_inspecciones: true,
    cl_limpieza_personal: true,
    cl_asistencia_legal: true,
    cl_rentas_cubren_gastos: true,
    cl_rentas_impuestos: true,
    cl_venta_propiedad: true,
    cl_facturas: false,
    cl_acceso_condominios: true,
    cl_asambleas: true,
    cl_responsabilidad: true,
  },
  campos: {
    propiedad: {
      direccion: "Condominium La Jolla de Mismaloya, CARR.A BARRA DE NAVIDAD SN KM-11 5705 COL. LOMAS DE MISMALOYA PUERTO VALLARTA, JALISCO CP 48270",
      tipo_propiedad: "condominio",
      es_condominio: true,
    },
    honorarios: {
      cuota_mensual: 125,
      cuota_no_negociable: true,
      incluye_iva: true,
      umbral_reparacion: 100,
      tarifa_servicios_especiales: 20,
      porcentaje_supervision: "10%",
      costo_asamblea: 100,
      costo_hora_adicional_asamblea: 30,
    },
    vigencia: {
      fecha_inicio: "2024-08-15",
      duracion: "indefinida",
      dias_aviso_cancelacion: 30,
      ciudad_firma: "Puerto Vallarta, Jalisco",
      num_llaves: 3,
      incluir_codigo_acceso: true,
    },
    reportes: {
      dias_reporte: 30,
      dias_inconformidad: 30,
    },
    testigos: {
      incluir_testigos: false,
      incluir_aceptacion: false,
    },
  },
};

const INIT = {
  partes: {
    propietario: {
      personas: [{ nombre: "", genero: "M" }],
      tipoPersona: "fisica",
      email: "",
      celular: "",
    },
  },
  bloques: {
    cl_reportes_ocupantes: true,
    cl_exclusividad_renta: false,
    cl_exclusividad_venta: false,
    cl_condominio_areas: true,
    cl_limpieza: true,
    cl_limpieza_logistica: true,
    cl_limpieza_inspecciones: true,
    cl_limpieza_personal: true,
    cl_asistencia_legal: true,
    cl_rentas_cubren_gastos: false,
    cl_rentas_impuestos: false,
    cl_venta_propiedad: true,
    cl_facturas: false,
    cl_acceso_condominios: true,
    cl_asambleas: true,
    cl_responsabilidad: true,
  },
  campos: {
    propiedad: { tipo_propiedad: "condominio", es_condominio: true },
    honorarios: {
      cuota_mensual: 125,
      cuota_no_negociable: true,
      incluye_iva: true,
      umbral_reparacion: 100,
      tarifa_servicios_especiales: 20,
      porcentaje_supervision: "10%",
      costo_asamblea: 100,
      costo_hora_adicional_asamblea: 30,
    },
    vigencia: {
      duracion: "indefinida",
      dias_aviso_cancelacion: 30,
      ciudad_firma: "Puerto Vallarta, Jalisco",
      num_llaves: 3,
      incluir_codigo_acceso: true,
    },
    reportes: { dias_reporte: 30, dias_inconformidad: 30 },
    testigos: { incluir_testigos: false, incluir_aceptacion: false },
  },
};

// ============================================================
// INIT DATA — ADDENDUM (modo 'addendum')
// ============================================================
const INIT_ADDENDUM = {
  partes: {
    propietario: {
      personas: [{ nombre: "", genero: "M" }],
      tipoPersona: "fisica",
      email: "",
    },
  },
  bloques: {
    ad_instrucciones_limpieza: false,
    ad_cambios_equipo: false,
    ad_restriccion_acceso: false,
    ad_ausencia_prolongada: false,
    ad_protocolo_rentas: false,
    ad_contractors_terceros: false,
    ad_instrucciones_cambiantes: false,
    ad_master_list_preseason: false,
  },
  campos: {
    propiedad: { direccion: "", addendum_numero: "1" },
    contrato_base: { fecha_contrato: "", fecha_efectiva: "" },
    testigos: { incluir_testigos: false, incluir_aceptacion: false },
  },
};

// ============================================================
// HELPERS
// ============================================================
function ensamblar(plantilla, data) {
  try { return ensamblarContexto(plantilla, data); }
  catch (e) { console.error('ensamblar:', e.message); return null; }
}
function renderBlks(plantilla, ctx) {
  if (!ctx) return [];
  try { return renderizarBloques(plantilla, ctx); }
  catch (e) { console.error('renderBlks:', e.message); return []; }
}

// ============================================================
// COMPONENTS
// ============================================================
function Input({ label, value, onChange, type = "text", placeholder = "", required, wide, rows, sub }) {
  return (
    <div className={`flex flex-col gap-1 ${wide ? "col-span-2" : ""}`}>
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {sub && <span className="text-[10px] text-gray-400">{sub}</span>}
      {rows ? (
        <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
          className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none resize-y" />
      ) : (
        <input type={type} value={value || ""} onChange={e => onChange(type === "number" ? +e.target.value : e.target.value)} placeholder={placeholder}
          step={type === "number" ? "any" : undefined}
          className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none" />
      )}
    </div>
  );
}

function Toggle({ label, sub, checked, onChange, disabled }) {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${
        disabled
          ? "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-50 cursor-not-allowed"
          : "cursor-pointer " + (checked ? "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800" : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700")
      }`}
    >
      <div className={`w-10 h-5 rounded-full relative transition-colors ${checked && !disabled ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"}`}>
        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${checked ? "left-5" : "left-0.5"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {sub && <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{sub}</div>}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">{title}</h3>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function AdminGenPage() {
  const [modo, setModo] = useState("contrato"); // 'contrato' | 'addendum'
  const [data, setData] = useState(INIT);
  const [dataAddendum, setDataAddendum] = useState(INIT_ADDENDUM);
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [logoBase64, setLogoBase64] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [expandedClause, setExpandedClause] = useState(null);

  // Plantilla activa según el modo
  const plantillaActiva = modo === "addendum" ? PLANTILLA_ADDENDUM : PLANTILLA_CONTRATO;
  const datosActivos = modo === "addendum" ? dataAddendum : data;
  const setDatosActivos = modo === "addendum" ? setDataAddendum : setData;

  const steps = modo === "addendum"
    ? ["Propietario", "Referencia", "Cláusulas", "Preview"]
    : ["Propietario", "Propiedad", "Honorarios", "Cláusulas", "Preview"];

  // Al cambiar modo, reset step a 0
  const cambiarModo = (nuevoModo) => {
    if (nuevoModo === modo) return;
    setModo(nuevoModo);
    setStep(0);
  };

  // Auto-save draft
  useEffect(() => {
    try { const s = localStorage.getItem("admingen_draft"); if (s) setData(JSON.parse(s)); } catch {}
  }, []);
  useEffect(() => {
    const t = setTimeout(() => { try { localStorage.setItem("admingen_draft", JSON.stringify(data)); } catch {} }, 1000);
    return () => clearTimeout(t);
  }, [data]);

  const upParte = (pid, k, v) => setDatosActivos(d => ({ ...d, partes: { ...d.partes, [pid]: { ...d.partes[pid], [k]: v } } }));
  const upPersona = (pid, i, k, v) => setDatosActivos(d => { const pp = [...d.partes[pid].personas]; pp[i] = { ...pp[i], [k]: v }; return { ...d, partes: { ...d.partes, [pid]: { ...d.partes[pid], personas: pp } } }; });
  const addPersona = (pid) => setDatosActivos(d => ({ ...d, partes: { ...d.partes, [pid]: { ...d.partes[pid], personas: [...d.partes[pid].personas, { nombre: "", genero: "M" }] } } }));
  const rmPersona = (pid, i) => setDatosActivos(d => ({ ...d, partes: { ...d.partes, [pid]: { ...d.partes[pid], personas: d.partes[pid].personas.filter((_, j) => j !== i) } } }));
  const upCampo = (sec, k, v) => setDatosActivos(d => ({ ...d, campos: { ...d.campos, [sec]: { ...d.campos[sec], [k]: v } } }));
  const togBloque = (id) => setDatosActivos(d => {
    const nuevoValor = !d.bloques[id];
    const nuevosBloques = { ...d.bloques, [id]: nuevoValor };
    // Si se apaga cl_limpieza, apagar también los accesorios b.1, b.2 y b.3
    if (id === "cl_limpieza" && !nuevoValor) {
      nuevosBloques.cl_limpieza_logistica = false;
      nuevosBloques.cl_limpieza_inspecciones = false;
      nuevosBloques.cl_limpieza_personal = false;
    }
    // Si se apaga cl_rentas_cubren_gastos, apagar también cl_rentas_impuestos
    if (id === "cl_rentas_cubren_gastos" && !nuevoValor) {
      nuevosBloques.cl_rentas_impuestos = false;
    }
    return { ...d, bloques: nuevosBloques };
  });
  const loadDemo = () => setData(JSON.parse(JSON.stringify(DEMO)));
  const resetAll = () => { setData(JSON.parse(JSON.stringify(INIT))); setStep(0); localStorage.removeItem("admingen_draft"); };

  const handleLogoUpload = useCallback(() => {
    const input = document.createElement("input"); input.type = "file"; input.accept = "image/png,image/jpeg,image/jpg";
    input.onchange = async (e) => {
      const file = e.target.files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { const u = ev.target?.result; if (typeof u === "string") { setLogoPreview(u); setLogoBase64(u.split(",")[1]); } };
      reader.readAsDataURL(file);
    };
    input.click();
  }, []);
  const clearLogo = useCallback(() => { setLogoBase64(null); setLogoPreview(null); }, []);

  const exportDraft = useCallback(() => {
    const nombre = datosActivos.partes?.propietario?.personas?.[0]?.nombre?.split(" ")[0] || "BORRADOR";
    const fecha = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify({ version: "1.0", type: "admin_contract", exportedAt: new Date().toISOString(), step, data }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `CONTRATO_ADMIN_${nombre}_${fecha}.json`; a.click();
    URL.revokeObjectURL(url);
  }, [data, step]);

  const importDraft = useCallback(() => {
    const input = document.createElement("input"); input.type = "file"; input.accept = ".json";
    input.onchange = async (e) => {
      const file = e.target.files?.[0]; if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        if (parsed.data) { setData(parsed.data); if (typeof parsed.step === "number") setStep(parsed.step); }
        else setData(parsed);
      } catch { alert("Error al cargar el archivo."); }
    };
    input.click();
  }, []);

  const ctx = useMemo(() => ensamblar(plantillaActiva, datosActivos), [plantillaActiva, datosActivos]);
  const bloques = useMemo(() => renderBlks(plantillaActiva, ctx), [plantillaActiva, ctx]);

  const handleGenerate = useCallback(async () => {
    if (!bloques.length) return;
    setGenerating(true);
    try {
      const nombre = datosActivos.partes.propietario.personas[0]?.nombre?.replace(/\s+/g, "_") || "OWNER";
      let blob;
      let prefijo;

      if (modo === "addendum") {
        // Recolectar nombres de todos los propietarios para el header
        const ownerNames = datosActivos.partes.propietario.personas
          .map(p => p.nombre)
          .filter(Boolean)
          .join(" & ");
        blob = await generarDocxAddendumBlob(bloques, plantillaActiva.meta, {
          logoBase64,
          datosExtras: {
            addendum_numero: datosActivos.campos.propiedad?.addendum_numero || "1",
            direccion: datosActivos.campos.propiedad?.direccion || "",
            fecha_efectiva: datosActivos.campos.contrato_base?.fecha_efectiva || "",
            owner_name: ownerNames,
          },
        });
        prefijo = `ADDENDUM_${datosActivos.campos.propiedad?.addendum_numero || "1"}`;
      } else {
        blob = await generarDocxBlob(bloques, plantillaActiva.meta, { logoBase64 });
        prefijo = "CONTRATO_ADMIN";
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `${prefijo}_${nombre}.docx`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generando DOCX:", err);
      alert("Error al generar el documento. Revisa la consola.");
    }
    setGenerating(false);
  }, [bloques, datosActivos, plantillaActiva, modo, logoBase64]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Castle Admin</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Castle Solutions — Contrato de Administración</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <button onClick={importDraft} className="px-3 py-1.5 text-xs bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-lg hover:bg-teal-100 transition flex items-center gap-1">
            <span>📂</span> Cargar
          </button>
          <button onClick={exportDraft} className="px-3 py-1.5 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 transition flex items-center gap-1">
            <span>💾</span> Guardar
          </button>
          <button onClick={loadDemo} className="px-3 py-1.5 text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 transition">Demo</button>
          {logoPreview ? (
            <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <img src={logoPreview} alt="Logo" className="h-6 max-w-16 object-contain" />
              <button onClick={clearLogo} className="text-purple-500 hover:text-purple-700 text-xs ml-1">✕</button>
            </div>
          ) : (
            <button onClick={handleLogoUpload} className="px-3 py-1.5 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 transition">🖼️ Logo</button>
          )}
          <button onClick={resetAll} className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 transition">Limpiar</button>
        </div>
      </div>

      {/* Tab switcher: Contrato / Addendum */}
      <div className="flex gap-2 mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <button
          onClick={() => cambiarModo("contrato")}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${modo === "contrato" ? "bg-white dark:bg-gray-900 text-teal-700 dark:text-teal-300 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"}`}
        >
          📄 Contrato de Administración
        </button>
        <button
          onClick={() => cambiarModo("addendum")}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${modo === "addendum" ? "bg-white dark:bg-gray-900 text-teal-700 dark:text-teal-300 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"}`}
        >
          📋 Addendum Personalizado
        </button>
      </div>

      {/* Stepper */}
      <div className="flex gap-1 mb-6">
        {steps.map((s, i) => (
          <button key={s} onClick={() => setStep(i)}
            className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-all ${i === step ? "bg-teal-500 text-white shadow-sm" : i < step ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>
            {i + 1}. {s}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-4 min-h-[400px]">

        {/* STEP 0 — PROPIETARIO */}
        {step === 0 && <>
          <Section title="Propietario / Owner">
            {datosActivos.partes.propietario.personas.map((per, i) => (
              <div key={i} className="col-span-2 flex flex-col gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-400">Propietario {i + 1}</span>
                  {datosActivos.partes.propietario.personas.length > 1 && <button onClick={() => rmPersona("propietario", i)} className="ml-auto text-xs text-red-500 hover:text-red-700">Quitar</button>}
                </div>
                <input value={per.nombre} onChange={e => upPersona("propietario", i, "nombre", e.target.value.toUpperCase())} placeholder="NOMBRE COMPLETO"
                  className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-teal-400 outline-none font-medium" />
                <div className="flex gap-2">
                  {["M", "F"].map(g => (
                    <button key={g} onClick={() => upPersona("propietario", i, "genero", g)}
                      className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${per.genero === g ? "bg-teal-500 text-white" : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"}`}>{g}</button>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={() => addPersona("propietario")} className="col-span-2 text-xs text-teal-500 hover:text-teal-700 py-1">+ Agregar propietario</button>
            <Input label="Email" value={datosActivos.partes.propietario.email} onChange={v => upParte("propietario", "email", v)} type="email" required />
            <Input label="Celular / WhatsApp" value={datosActivos.partes.propietario.celular} onChange={v => upParte("propietario", "celular", v)} type="tel" required placeholder="+52 322 ..." />
          </Section>
          <div className="p-4 bg-teal-50 dark:bg-teal-900/10 rounded-xl border border-teal-200 dark:border-teal-800">
            <h4 className="text-xs font-semibold text-teal-700 dark:text-teal-300 mb-1">Administrador (fijo)</h4>
            <p className="text-xs text-teal-600 dark:text-teal-400">Claudia Rebeca Castillo Soto — CASTLEBAY PV, SRL DE CV</p>
            <p className="text-xs text-teal-600 dark:text-teal-400">claudia@castlesolutions.biz · +52 322 306 8482</p>
          </div>
        </>}

        {/* STEP 1 — PROPIEDAD (modo contrato) */}
        {step === 1 && modo === "contrato" && <>
          <Section title="Datos de la propiedad">
            <Input label="Dirección completa" value={datosActivos.campos.propiedad?.direccion} onChange={v => upCampo("propiedad", "direccion", v)} placeholder="Condominio, dirección, municipio, estado, CP" required wide rows={3} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Tipo de propiedad</label>
              <select value={datosActivos.campos.propiedad?.tipo_propiedad || "condominio"} onChange={e => {
                const tipo = e.target.value;
                const esCondo = tipo === "condominio" || tipo === "penthouse";
                upCampo("propiedad", "tipo_propiedad", tipo);
                upCampo("propiedad", "es_condominio", esCondo);
                if (!esCondo) {
                  setDatosActivos(d => ({...d, bloques: {...d.bloques, cl_condominio_areas: false, cl_acceso_condominios: false, cl_asambleas: false}}));
                } else {
                  setDatosActivos(d => ({...d, bloques: {...d.bloques, cl_condominio_areas: true, cl_acceso_condominios: true, cl_asambleas: true}}));
                }
              }}
                className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800">
                <option value="condominio">Condominio / Departamento</option>
                <option value="casa">Casa</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </div>
            {!(datosActivos.campos.propiedad?.tipo_propiedad === "condominio" || datosActivos.campos.propiedad?.tipo_propiedad === "penthouse") && (
              <div className="col-span-2 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-700 dark:text-amber-300">Las cláusulas de condominio (áreas comunes, acceso, asambleas) se desactivan automáticamente para este tipo de propiedad.</p>
              </div>
            )}
          </Section>
          <Section title="Vigencia y firma">
            <Input label="Fecha de inicio" value={datosActivos.campos.vigencia?.fecha_inicio} onChange={v => upCampo("vigencia", "fecha_inicio", v)} type="date" required />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Duración</label>
              <select value={datosActivos.campos.vigencia?.duracion || "indefinida"} onChange={e => upCampo("vigencia", "duracion", e.target.value)}
                className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800">
                <option value="indefinida">Indefinida</option>
                <option value="12">12 meses</option>
                <option value="24">24 meses</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Ciudad de firma</label>
              <select value={datosActivos.campos.vigencia?.ciudad_firma || "Puerto Vallarta, Jalisco"} onChange={e => upCampo("vigencia", "ciudad_firma", e.target.value)}
                className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800">
                <option value="Puerto Vallarta, Jalisco">Puerto Vallarta, Jalisco</option>
                <option value="Nuevo Vallarta, Nayarit">Nuevo Vallarta, Nayarit</option>
              </select>
            </div>
            <Input label="Días de aviso para cancelación" value={datosActivos.campos.vigencia?.dias_aviso_cancelacion} onChange={v => upCampo("vigencia", "dias_aviso_cancelacion", v)} type="number" />
            <Input label="Juegos de llaves" value={datosActivos.campos.vigencia?.num_llaves} onChange={v => upCampo("vigencia", "num_llaves", v)} type="number" />
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <input type="checkbox" checked={datosActivos.campos.vigencia?.incluir_codigo_acceso !== false} onChange={e => upCampo("vigencia", "incluir_codigo_acceso", e.target.checked)} className="rounded" />
              <label className="text-sm">O código de acceso (door code)</label>
            </div>
          </Section>
        </>}

        {/* STEP 1 — REFERENCIA AL CONTRATO (modo addendum) */}
        {step === 1 && modo === "addendum" && <>
          <Section title="Datos de la propiedad">
            <Input label="Dirección completa de la propiedad" value={datosActivos.campos.propiedad?.direccion} onChange={v => upCampo("propiedad", "direccion", v)} placeholder="ej. Villa Magna 352A & 352B, Puerto Vallarta, Jalisco" required wide rows={2} />
            <Input label="Número de addendum" value={datosActivos.campos.propiedad?.addendum_numero} onChange={v => upCampo("propiedad", "addendum_numero", v)} placeholder="1" sub="Ej: 1 para el primer addendum de este cliente. Se mostrará como 'ADDENDUM NO. 1'." />
          </Section>
          <Section title="Referencia al contrato principal">
            <Input label="Fecha del contrato principal" value={datosActivos.campos.contrato_base?.fecha_contrato} onChange={v => upCampo("contrato_base", "fecha_contrato", v)} placeholder="ej. April 15, 2026" required sub="Fecha del contrato de administración al que este addendum se refiere (en inglés)." />
            <Input label="Fecha efectiva del addendum" value={datosActivos.campos.contrato_base?.fecha_efectiva} onChange={v => upCampo("contrato_base", "fecha_efectiva", v)} placeholder="ej. April 23, 2026" required sub="Fecha de firma y entrada en vigor de este addendum (en inglés)." />
          </Section>
          <div className="p-4 bg-teal-50 dark:bg-teal-900/10 rounded-xl border border-teal-200 dark:border-teal-800">
            <h4 className="text-xs font-semibold text-teal-700 dark:text-teal-300 mb-1">📋 Addendum — Documento separado</h4>
            <p className="text-xs text-teal-600 dark:text-teal-400 leading-relaxed">Este documento se genera por separado del contrato de administración. Formalmente lo modifica/precisa para un cliente específico. Tono conversacional directo (estilo redacción de Claudia), idioma principal inglés con nota bilingüe de prevalencia.</p>
          </div>
        </>}

        {/* STEP 2 — CLÁUSULAS del ADDENDUM (modo addendum) */}
        {step === 2 && modo === "addendum" && <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-500 mb-2">Activa solo las cláusulas que aplican a este propietario. Haz click en la flecha para ver el preview completo de cada una.</p>
          {plantillaActiva.bloques.filter(b => b.condicional).map(bloque => {
            const activo = datosActivos.bloques?.[bloque.id] === true;
            const expanded = expandedClause === bloque.id;
            const preview = bloque.render({ fecha_contrato: datosActivos.campos.contrato_base?.fecha_contrato || '___', propietario: { nombres: datosActivos.partes.propietario.personas?.[0]?.nombre || 'OWNER', clave: 'vf' } });
            return (
              <div key={bloque.id} className={`rounded-xl border transition-all ${activo ? "border-teal-300 dark:border-teal-700 bg-teal-50/40 dark:bg-teal-900/10" : "border-gray-200 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-800/30"}`}>
                <div className="flex items-center gap-3 p-3">
                  <div onClick={() => togBloque(bloque.id)} className="cursor-pointer">
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${activo ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${activo ? "left-5" : "left-0.5"}`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => togBloque(bloque.id)}>
                    <div className="text-sm font-medium">{bloque.etiqueta}</div>
                  </div>
                  <button onClick={() => setExpandedClause(expanded ? null : bloque.id)} className="text-xs text-gray-400 hover:text-teal-600 px-2 py-1">
                    {expanded ? "▼ Ocultar" : "▶ Preview"}
                  </button>
                </div>
                {expanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50">
                    <div className="text-xs leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-96 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      {preview.en || preview.es}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>}

        {/* STEP 2 — HONORARIOS (modo contrato) */}
        {step === 2 && modo === "contrato" && <>
          <Section title="Cuota de administración">
            <Input label="Cuota mensual (USD)" value={datosActivos.campos.honorarios?.cuota_mensual} onChange={v => upCampo("honorarios", "cuota_mensual", v)} type="number" required />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <input type="checkbox" checked={datosActivos.campos.honorarios?.cuota_no_negociable !== false} onChange={e => upCampo("honorarios", "cuota_no_negociable", e.target.checked)} className="rounded" />
                <label className="text-sm">No negociable</label>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <input type="checkbox" checked={datosActivos.campos.honorarios?.incluye_iva !== false} onChange={e => upCampo("honorarios", "incluye_iva", e.target.checked)} className="rounded" />
                <label className="text-sm">Más IVA (16%)</label>
              </div>
            </div>
          </Section>
          <Section title="Reparaciones y servicios">
            <Input label="Umbral reparación sin autorización (USD)" value={datosActivos.campos.honorarios?.umbral_reparacion} onChange={v => upCampo("honorarios", "umbral_reparacion", v)} type="number" sub="Reparaciones por debajo de este monto no requieren autorización" />
            <Input label="Tarifa servicios especiales (USD/hr)" value={datosActivos.campos.honorarios?.tarifa_servicios_especiales} onChange={v => upCampo("honorarios", "tarifa_servicios_especiales", v)} type="number" />
            <Input label="% supervisión de obras" value={datosActivos.campos.honorarios?.porcentaje_supervision} onChange={v => upCampo("honorarios", "porcentaje_supervision", v)} placeholder="10%" />
          </Section>
          <Section title="Asambleas de condóminos">
            <Input label="Costo asamblea (USD por 2 hrs)" value={datosActivos.campos.honorarios?.costo_asamblea} onChange={v => upCampo("honorarios", "costo_asamblea", v)} type="number" />
            <Input label="Costo hora adicional (USD)" value={datosActivos.campos.honorarios?.costo_hora_adicional_asamblea} onChange={v => upCampo("honorarios", "costo_hora_adicional_asamblea", v)} type="number" />
          </Section>
          <Section title="Reportes">
            <Input label="Días para reporte de gastos" value={datosActivos.campos.reportes?.dias_reporte} onChange={v => upCampo("reportes", "dias_reporte", v)} type="number" />
            <Input label="Días para inconformarse" value={datosActivos.campos.reportes?.dias_inconformidad} onChange={v => upCampo("reportes", "dias_inconformidad", v)} type="number" />
          </Section>
        </>}

        {/* STEP 3 — CLÁUSULAS del CONTRATO (modo contrato) */}
        {step === 3 && modo === "contrato" && <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-500 mb-2">Activa o desactiva cláusulas opcionales. Las cláusulas core (exclusividad, reportes, mantenimiento, pagos, cuota, llaves, duración, precios, notificaciones, jurisdicción) siempre se incluyen.</p>

          <div className="mb-2"><p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Exclusividad</p></div>
          <Toggle label="Exclusividad de renta vacacional" sub="Derecho exclusivo de publicar en Airbnb, VRBO, Booking y medios digitales" checked={datosActivos.bloques.cl_exclusividad_renta} onChange={() => togBloque("cl_exclusividad_renta")} />
          <Toggle label="Exclusividad de listing si decide vender" sub="Primera opción para listar en exclusiva 180 días. Cambio de agent durante ese periodo → terminación del contrato con 30 días de aviso." checked={datosActivos.bloques.cl_exclusividad_venta} onChange={() => togBloque("cl_exclusividad_venta")} />

          <div className="mt-3 mb-2"><p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Servicios</p></div>
          <Toggle label="Autorización info de ocupantes" sub="Admin puede recibir info/consejo de ocupantes vía email" checked={datosActivos.bloques.cl_reportes_ocupantes} onChange={() => togBloque("cl_reportes_ocupantes")} />
          <Toggle label="Servicios de limpieza" sub="Alcance: la cuota no incluye limpieza. Tipos: light/check-out/deep. Lógica deep→light" checked={datosActivos.bloques.cl_limpieza} onChange={() => togBloque("cl_limpieza")} />
          <div className={datosActivos.bloques.cl_limpieza ? "" : "opacity-60"}>
            <Toggle label="↳ Limpieza — logística y tarifas" sub="Preaviso 7 días, emergencias con cargo, domingos/festivos doble tarifa, productos por cuenta del owner" checked={datosActivos.bloques.cl_limpieza_logistica} onChange={() => togBloque("cl_limpieza_logistica")} disabled={!datosActivos.bloques.cl_limpieza} />
          </div>
          <div className={datosActivos.bloques.cl_limpieza ? "" : "opacity-60"}>
            <Toggle label="↳ Limpieza — inspecciones periódicas" sub="Admin puede inspeccionar electrodomésticos, fugas, ventilación, alberca — con aviso razonable al ocupante" checked={datosActivos.bloques.cl_limpieza_inspecciones} onChange={() => togBloque("cl_limpieza_inspecciones")} disabled={!datosActivos.bloques.cl_limpieza} />
          </div>
          <div className={datosActivos.bloques.cl_limpieza ? "" : "opacity-60"}>
            <Toggle label="↳ Limpieza — personal contratado" sub="Owner/condominio que contrata directo asume responsabilidades laborales. Admin que contrata asume las suyas (Jalisco/Nayarit)" checked={datosActivos.bloques.cl_limpieza_personal} onChange={() => togBloque("cl_limpieza_personal")} disabled={!datosActivos.bloques.cl_limpieza} />
          </div>

          <div className="mt-3 mb-2"><p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">🏠 Rentas</p></div>
          <Toggle label="Rentas cubren gastos" sub="Los ingresos por renta (vacacional o tradicional) se aplican primero a gastos, luego a cuota, y el remanente va al owner. Solo si Castle cobra las rentas." checked={datosActivos.bloques.cl_rentas_cubren_gastos} onChange={() => togBloque("cl_rentas_cubren_gastos")} />
          <div className={datosActivos.bloques.cl_rentas_cubren_gastos ? "" : "opacity-60"}>
            <Toggle label="↳ Rentas — gestión fiscal (ISR/IVA/ISH)" sub="Castle gestiona impuestos por rentas por cuenta del owner. Deslinde de responsabilidad solidaria — owner sigue siendo el contribuyente." checked={datosActivos.bloques.cl_rentas_impuestos} onChange={() => togBloque("cl_rentas_impuestos")} disabled={!datosActivos.bloques.cl_rentas_cubren_gastos} />
          </div>

          <div className="mt-3 mb-2"><p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">⚖️ Valor agregado Castle Solutions</p></div>
          <Toggle label="Plus de asistencia legal" sub="Consultas breves sin costo sobre la propiedad (inmobiliario, condominal, migratorio, fiscal). Trámites mayores se negocian con estrategia y presupuesto." checked={datosActivos.bloques.cl_asistencia_legal} onChange={() => togBloque("cl_asistencia_legal")} />

          {(datosActivos.campos.propiedad?.tipo_propiedad === "condominio" || datosActivos.campos.propiedad?.tipo_propiedad === "penthouse") && <>
          <div className="mt-3 mb-2"><p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Condominios</p></div>
          <Toggle label="Responsabilidad áreas comunes" sub="Deslinde: áreas comunes = responsabilidad del admin condominal" checked={datosActivos.bloques.cl_condominio_areas} onChange={() => togBloque("cl_condominio_areas")} />
          <Toggle label="Acceso a condominios" sub="Owner hace arreglos para acceso ininterrumpido del admin" checked={datosActivos.bloques.cl_acceso_condominios} onChange={() => togBloque("cl_acceso_condominios")} />
          <Toggle label="Representación en asambleas" sub="Admin representa al owner en asamblea con proxy ($100+IVA/2hrs)" checked={datosActivos.bloques.cl_asambleas} onChange={() => togBloque("cl_asambleas")} />
          </>}

          <div className="mt-3 mb-2"><p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Protecciones</p></div>
          <Toggle label="Cláusula de responsabilidad" sub="Admin no responsable por temas judiciales/penales del owner" checked={datosActivos.bloques.cl_responsabilidad} onChange={() => togBloque("cl_responsabilidad")} />
          <Toggle label="Aviso de venta" sub="Owner avisa 30 días antes del cierre de venta" checked={datosActivos.bloques.cl_venta_propiedad} onChange={() => togBloque("cl_venta_propiedad")} />
          <Toggle label="Facturas deducibles (RFC)" sub="Owner provee RFC para facturas fiscales" checked={datosActivos.bloques.cl_facturas} onChange={() => togBloque("cl_facturas")} />

          <div className="mt-3 mb-2"><p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Otros — Final del documento</p></div>
          <Toggle label="Incluir líneas de testigos" sub="Testigo 1 / Witness 1 y Testigo 2 / Witness 2. OFF por default — no se requieren en contratos privados de prestación de servicios." checked={datosActivos.campos.testigos?.incluir_testigos === true} onChange={v => upCampo("testigos", "incluir_testigos", v)} />
          <Toggle label="Incluir lugar/fecha de aceptación" sub="'LUGAR, FECHA Y HORA DE ACEPTACIÓN'. OFF por default — típico de ofertas unilaterales, no de contratos bilaterales." checked={datosActivos.campos.testigos?.incluir_aceptacion === true} onChange={v => upCampo("testigos", "incluir_aceptacion", v)} />
        </div>}

        {/* STEP PREVIEW — contrato step=4, addendum step=3 */}
        {((step === 4 && modo === "contrato") || (step === 3 && modo === "addendum")) && <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{modo === "addendum" ? "Vista previa (Inglés)" : "Vista previa bilingüe"}</h2>
            <button onClick={handleGenerate} disabled={generating || !bloques.length}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-xl transition shadow-sm disabled:shadow-none">
              {generating ? "Generando..." : "Descargar .docx"}
            </button>
          </div>
          {bloques.length === 0 ? <p className="text-gray-400 text-sm">Completa los datos del propietario para ver la vista previa.</p> :
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden text-xs leading-relaxed">
              <div className="grid grid-cols-2 bg-gray-100 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                <div className="px-3 py-2 font-semibold text-gray-500 text-[10px] tracking-wider border-r border-gray-200 dark:border-gray-600">ESPAÑOL</div>
                <div className="px-3 py-2 font-semibold text-gray-500 text-[10px] tracking-wider">ENGLISH</div>
              </div>
              {bloques.map((b, i) => {
                if (b.tipo === "firmas") return (
                  <div key={i} className="flex justify-around py-10 border-t border-gray-200 dark:border-gray-600">
                    {b.firmas?.map((f, j) => (
                      <div key={j} className="text-center">
                        <div className="w-48 border-b border-gray-900 dark:border-gray-200 mb-2" />
                        <div className="font-bold text-[11px]">{f.nombre}</div>
                        <div className="text-[10px] text-gray-500 whitespace-pre-line">{f.rol_es}</div>
                      </div>
                    ))}
                  </div>
                );
                const tEs = b.titulo?.es; const tEn = b.titulo?.en;
                const sEs = b.subtitulo?.es; const sEn = b.subtitulo?.en;
                const num = b.numero;
                return (
                  <div key={i} className={`grid grid-cols-2 ${i ? "border-t border-gray-100 dark:border-gray-700" : ""}`}>
                    <div className="px-3 py-2.5 border-r border-gray-100 dark:border-gray-700">
                      {tEs && <p className="font-bold mb-1 underline">{num ? `${num}.- ` : ""}{tEs}</p>}
                      {sEs && <p className="font-bold mb-1">{sEs}</p>}
                      {b.es?.split("\n\n").map((p, j) => <p key={j} className="mb-1.5">{p.split("\n").map((l, k) => <span key={k}>{k > 0 && <br />}{l}</span>)}</p>)}
                    </div>
                    <div className="px-3 py-2.5 text-gray-500 dark:text-gray-400">
                      {tEn && <p className="font-bold mb-1 text-gray-600 dark:text-gray-300 underline">{num ? `${num}.- ` : ""}{tEn}</p>}
                      {sEn && <p className="font-bold mb-1 text-gray-600 dark:text-gray-300">{sEn}</p>}
                      {b.en?.split("\n\n").map((p, j) => <p key={j} className="mb-1.5">{p.split("\n").map((l, k) => <span key={k}>{k > 0 && <br />}{l}</span>)}</p>)}
                    </div>
                  </div>
                );
              })}
            </div>}
        </div>}
      </div>

      {/* Nav */}
      <div className="flex justify-between">
        {step > 0 ? <button onClick={() => setStep(s => s - 1)} className="px-5 py-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 transition">Anterior</button> : <div />}
        {step < 4 ? <button onClick={() => setStep(s => s + 1)} className="px-5 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-xl shadow-sm transition">Siguiente</button>
          : <button onClick={handleGenerate} disabled={generating || !bloques.length}
            className="px-6 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 rounded-xl shadow-sm transition">
            {generating ? "Generando..." : "Descargar .docx"}
          </button>}
      </div>

      {/* Footer — RDE regla 10 */}
      <footer className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400">
        <a href="https://castlesolutions.mx" target="_blank" rel="noopener noreferrer" className="hover:text-teal-500 transition">Castle Solutions</a>
        <span>Hecho por Colmena 2026</span>
      </footer>
    </div>
  );
}
