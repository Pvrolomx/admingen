# HANDOFF — AdminGen (Castle Solutions Contract Generator)

**Fecha:** 2026-04-16
**Estado:** Live en producción, funcional al 100%

---

## 🏰 QUÉ ES ADMINGEN

Generador de contratos de administración y mantenimiento de propiedades para **Claudia Castillo** (Castle Solutions / CASTLEBAY PV, SRL DE CV). Wizard de 5 pasos, DOCX bilingüe ES/EN lado a lado, 13 cláusulas con 10 bloques condicionales (escalable/descalable).

**Live URLs:**
- 🏠 https://admingen.castlesolutions.mx (custom domain, SSL activo)
- 🏠 https://admingen.vercel.app (alias Vercel)

**Repo:** https://github.com/Pvrolomx/admingen  
**Vercel Project ID:** `prj_kWsdfbZDx1rC1SuCCccpJ7HsoffA`  
**Vercel Team ID:** `team_xmFW0blsjqFI5lwt29wBPi8Q`

---

## 🔑 CREDENCIALES

**Busca los tokens en chats anteriores vía `conversation_search`:**
- `GitHub PAT` — buscar "ghp_" (user: Pvrolomx, scopes repo+workflow)
- `Vercel Token` — buscar "vcp_" (el token nuevo de abril 2026)
- El token viejo de Vercel (`HYf0...`) perdió scope de escritura — usa el nuevo

Si no aparecen, pídele al Arquitecto que los pase. Están guardados en chat.duendes.app canal.

---

## 📁 ARQUITECTURA

**4 capas declarativas** (copiado del motor de OfertaGen):

```
src/
├── app/
│   ├── page.js          ← Wizard UI (5 steps)
│   ├── layout.js        ← Metadata + manifest
│   └── globals.css
├── lib/
│   ├── core/            ← MOTOR COMPARTIDO (no tocar sin razón)
│   │   ├── concordancia.js    ← Género/número para MR, PROPIETARIO, etc.
│   │   ├── num2words.js       ← Números → letras ES/EN
│   │   ├── fechas.js          ← Formateo de fechas bilingüe
│   │   └── index.js           ← Re-exports
│   ├── docx/
│   │   └── generador.js       ← DOCX con tabla bilingüe párrafo-por-fila
│   └── plantillas/
│       ├── ensamblador.js     ← Resuelve contexto del form
│       └── contrato_administracion.js  ← 13 cláusulas + 10 bloques
└── public/
    ├── manifest.json    ← PWA teal (#0d9488)
    ├── sw.js            ← Service Worker
    └── icon-{192,512}.png
```

---

## 📝 DATOS FIJOS (no editables)

**Administrador:**
- Razón social: **CASTLEBAY PV, SRL DE CV**
- Representante: **Claudia Rebeca Castillo Soto**
- Domicilio: **Paseo del Arque 59, Las Ceibas, Bahía de Banderas, Nayarit, 63735**
- Email: **claudia@castlesolutions.biz**
- Celular: **+52 322 306 8482**

---

## 📋 CLÁUSULAS

**13 cláusulas core + 10 bloques condicionales:**

| # | Cláusula | Tipo |
|---|----------|------|
| — | Encabezado + Declaraciones I, II | siempre |
| 1 | Derecho exclusivo | siempre |
| 1a | Exclusividad renta vacacional (Airbnb/VRBO/Booking) | condicional, OFF default |
| 1b | Exclusividad listing venta (90 días first option) | condicional, OFF default |
| 2 | Reportes (30 días aviso, 30 días inconformidad) | siempre |
| 2a | Autorización info ocupantes via email | condicional, ON default |
| 3 | Servicios de administración | siempre |
| 3a | Mantenimiento | siempre |
| 3b | Reparaciones y emergencias | siempre |
| 3c | Pagos de servicios | siempre |
| 3d | Responsabilidad áreas comunes | condicional, auto-ON en condo |
| 3e | Servicios de limpieza | condicional, ON default |
| 4 | Supervisión (10% obras) | siempre |
| 5 | Acceso a condominios | condicional, auto-ON en condo |
| 6 | Representación en asambleas | condicional, auto-ON en condo |
| 7 | Cuota mensual ($125 USD + IVA) | siempre |
| 7a | Facturas deducibles (RFC) | condicional, OFF default |
| 8 | Llaves / código de acceso | siempre |
| 9 | Duración | siempre |
| 9a | Aviso de venta | condicional, ON default |
| 10 | Precios | siempre |
| 10a | Cláusula de responsabilidad | condicional, ON default |
| 11 | Notificaciones (formato label por línea) | siempre |
| 12 | Jurisdicción | siempre |
| 13 | Nota traducción | siempre |

---

## 🎯 LÓGICA IMPORTANTE

### Property Type Auto-Control
El dropdown "Tipo de propiedad" controla automáticamente las cláusulas de condominio:

- **Condominio / Penthouse** → activa `cl_condominio_areas`, `cl_acceso_condominios`, `cl_asambleas`
- **Casa / Villa** → desactiva las 3 y oculta la sección "Condominios" del UI

Código en `page.js` (dropdown de tipo de propiedad, `onChange` handler).

### Ciudad de Firma
Dropdown con 2 opciones:
- Puerto Vallarta, Jalisco (default)
- Nuevo Vallarta, Nayarit

### DOCX párrafo-por-fila
El `generador.js` divide cada cláusula por `\n\n` y genera una **fila de tabla por párrafo** — así ES y EN quedan alineados lado a lado sin descuadre. Ver función `crearFilasClausula()` que retorna **array** de filas (se aplana con `flatMap`).

### Logo
El usuario puede subir PNG/JPG en el botón "🖼️ Logo" del header. Se guarda en state como base64 y se pasa a `generarDocxBlob(bloques, meta, { logoBase64 })`. Aparece top-left del header del DOCX, paginación top-right.

### Cláusula de Notificaciones
Formato con label por línea:
```
EL ADMINISTRADOR:
Email: claudia@castlesolutions.biz
Teléfono: +52 322 306 8482

EL PROPIETARIO:
Email: [del form]
Teléfono: [del form]
```

---

## 🎨 BRANDING

- Color primario: **teal-500 / #0d9488**
- Footer: "Castle Solutions" (link a https://castlesolutions.mx) · "Hecho por Colmena 2026"
- PWA theme color: `#0d9488`

---

## ⚙️ CÓMO DEPLOYAR CAMBIOS

Deploy automático al hacer push a `main`. Vercel conectado vía Git integration.

```bash
git clone https://github.com/Pvrolomx/admingen
cd admingen
# hacer cambios
git add -A
git commit -m "mensaje"
git push origin main
# Vercel auto-deploya en ~30 segundos
```

Para push necesitas el GitHub PAT en el remote. Busca el token en chats anteriores.

---

## 🚧 PENDIENTES / POSIBLES MEJORAS

1. **Anexos 1 y 2** — El contrato menciona "Anexos 1 y 2" (documentos legales + inventario) pero no se generan. Requiere lógica adicional en el generador.
2. **Carta de autorización condominios** — Documento separado que acompaña el contrato para darle al administrador condominal. Podría ser un botón adicional.
3. **Anfitrión MX link** — Si Castle maneja renta vacacional, integrar cálculo de impuestos con https://anfitrion-mx.vercel.app
4. **Multi-propietarios** — El UI permite agregar más de un propietario, verificar que el ensamblador lo resuelve bien para persona moral + singular/plural.
5. **Export a PDF** — Actualmente solo DOCX. Podría usarse `pdfmake` o conversión server-side.

---

## 🐛 GOTCHAS

- El generador de OfertaGen y AdminGen están **duplicados** (copy de código). Si OfertaGen actualiza algo útil, hay que copiarlo manualmente. Alternativa futura: monorepo con motor core compartido.
- El `sw.js` (service worker) se copió de OfertaGen — verificar que cachea bien en móvil.
- `pvrolomxs-projects` es el team slug. Cualquier API call a Vercel necesita `?teamId=team_xmFW0blsjqFI5lwt29wBPi8Q`.
- Cuando clonen el repo desde cero, el token de GitHub ya no estará en el remote — hay que re-configurar.
- El repo antes se llamaba `castle-admin` y fue renombrado a `admingen`. GitHub redirige el nombre viejo automáticamente.

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de entregar cambios al usuario:

- [ ] `npx next build` pasa sin errores
- [ ] La vista previa muestra alineación correcta ES/EN
- [ ] El DOCX descargado se ve bien en Word
- [ ] Demo data carga correctamente (Herbert Sears / La Jolla de Mismaloya)
- [ ] Toggles de cláusulas prenden/apagan sin romper numeración
- [ ] Logo upload funciona (PNG y JPG)
- [ ] Dropdown de tipo de propiedad auto-controla condo clauses

---

## 📞 CONTACTO

**Rolo** (Rolando Romero García) — lawyer, Puerto Vallarta, Cédula Prof. 5255863  
**Claudia** — property manager, Castle Solutions, ~20 properties  
**Familia Castle:** Castle Admin (AdminGen), Castle Ops, Castle Checkin, Castle Flights, Casa Brasil  
**Otros apps Colmena:** OfertaGen, FideicomisoGen, Anfitrión MX, Fantasma, Mi Círculo, ASTRO4, PassportSnap

---

## 📜 HISTORIA BREVE DE ESTA SESIÓN

Esta app empezó como ruta `/admin` dentro de OfertaGen. El 16 de abril 2026 se desincorporó completamente:
1. Creado repo nuevo `Pvrolomx/castle-admin` → renombrado a `Pvrolomx/admingen`
2. Motor core copiado (no monorepo — cada app evoluciona independiente)
3. Proyecto Vercel creado con token nuevo (el viejo perdió scope)
4. Dominio custom `admingen.castlesolutions.mx` configurado (DNS en Namecheap ya estaba listo)
5. OfertaGen limpiado — removidas todas las referencias a Castle

**Siguiente duende:** Lee esto, luego checa el chat actual (compactado arriba en este mismo CD) para el contexto completo. Bienvenido a la Colmena. 🐝
