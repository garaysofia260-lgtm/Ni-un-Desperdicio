// Variable global para almacenar el modo del modal ('login' o 'registro')
let modoModal = 'login';

// Abrir modal con modo específico ('login' o 'registro')
function abrirModal(modo) {
    modoModal = modo || 'login';
    const modal = document.getElementById('modal-login');
    if (modal) {
        modal.classList.remove('hidden');
        actualizarModalUI();
    }
}

// Funciones directas para los botones principales
function abrirLogin() {
    abrirModal('login');
}

function abrirRegistro() {
    abrirModal('registro');
}

// Cerrar modal
function cerrarLogin() {
    const modal = document.getElementById('modal-login');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Cambiar pestaña dentro del modal
function cambiarModoModal(modo) {
    modoModal = modo;
    actualizarModalUI();
}

// Actualiza visualmente los elementos del modal según el modo seleccionado
function actualizarModalUI() {
    const titulo = document.getElementById('modal-titulo');
    const camposLogin = document.getElementById('campos-login');
    const camposRegistro = document.getElementById('campos-registro');
    const btnSubmit = document.getElementById('btn-submit-modal');
    const linkOlvidaste = document.getElementById('link-olvidaste');
    const tabLogin = document.getElementById('tab-login');
    const tabRegistro = document.getElementById('tab-registro');

    if (!titulo || !camposLogin || !camposRegistro) return;

    if (modoModal === 'login') {
        titulo.textContent = 'Iniciar Sesión';
        camposLogin.classList.remove('hidden');
        camposRegistro.classList.add('hidden');
        if (btnSubmit) btnSubmit.textContent = 'Iniciar sesión';
        if (linkOlvidaste) linkOlvidaste.classList.remove('hidden');

        if (tabLogin && tabRegistro) {
            tabLogin.className = "flex-1 py-1.5 text-xs font-bold rounded-xl bg-white shadow-sm text-emerald-800 transition cursor-pointer";
            tabRegistro.className = "flex-1 py-1.5 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 transition cursor-pointer";
        }
    } else {
        titulo.textContent = 'Crear Cuenta';
        camposLogin.classList.add('hidden');
        camposRegistro.classList.remove('hidden');
        if (btnSubmit) btnSubmit.textContent = 'Registrarse';
        if (linkOlvidaste) linkOlvidaste.classList.add('hidden');

        if (tabLogin && tabRegistro) {
            tabRegistro.className = "flex-1 py-1.5 text-xs font-bold rounded-xl bg-white shadow-sm text-emerald-800 transition cursor-pointer";
            tabLogin.className = "flex-1 py-1.5 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 transition cursor-pointer";
        }
    }
}

// 1. Mostrar / Ocultar Contraseña
function togglePassword(inputId, iconId) {
    const passInput = document.getElementById(inputId);
    const passIcon = document.getElementById(iconId);
    if (passInput && passIcon) {
        if (passInput.type === 'password') {
            passInput.type = 'text';
            passIcon.className = 'fa-solid fa-eye-slash text-slate-400 text-xs';
        } else {
            passInput.type = 'password';
            passIcon.className = 'fa-solid fa-eye text-slate-400 text-xs';
        }
    }
}

// 2. Selector de Perfil (Hogar vs Comercio)
function seleccionarPerfil(tipo) {
    const btnHogar = document.getElementById('btn-perfil-hogar');
    const btnComercio = document.getElementById('btn-perfil-comercio');
    const inputPerfil = document.getElementById('perfil-tipo-input');

    if (inputPerfil) inputPerfil.value = tipo;

    if (tipo === 'hogar' && btnHogar && btnComercio) {
        btnHogar.className = "flex-1 py-2 rounded-xl text-xs font-bold border-2 border-emerald-600 bg-emerald-50 text-emerald-800 flex items-center justify-center gap-1.5 transition cursor-pointer";
        btnComercio.className = "flex-1 py-2 rounded-xl text-xs font-semibold border-2 border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition cursor-pointer";
    } else if (btnHogar && btnComercio) {
        btnComercio.className = "flex-1 py-2 rounded-xl text-xs font-bold border-2 border-emerald-600 bg-emerald-50 text-emerald-800 flex items-center justify-center gap-1.5 transition cursor-pointer";
        btnHogar.className = "flex-1 py-2 rounded-xl text-xs font-semibold border-2 border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition cursor-pointer";
    }
}

// 3. Login Social Simulado
function loginSocial(red) {
    alert(`Iniciando sesión con ${red}... ¡Bienvenido a NO WASTE!`);
    cerrarLogin();
}

// 4. Detección de Ubicación por GPS
function obtenerUbicacion() {
    const badgeUbicacion = document.getElementById('badge-ubicacion');
    const textoCiudad = document.getElementById('texto-ciudad');
    const btnGps = document.getElementById('btn-gps');

    if (btnGps) {
        btnGps.innerHTML = '<i class="fa-solid fa-spinner animate-spin text-sm"></i>';
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Consulta de reverse geocoding
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                    .then(res => res.json())
                    .then(data => {
                        const ciudad = data.address?.city || data.address?.town || data.address?.state || "Ubicación activa";
                        if (textoCiudad) textoCiudad.textContent = `📍 ${ciudad}`;
                        if (badgeUbicacion) badgeUbicacion.classList.remove('hidden');
                    })
                    .catch(() => {
                        if (textoCiudad) textoCiudad.textContent = `📍 Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
                        if (badgeUbicacion) badgeUbicacion.classList.remove('hidden');
                    })
                    .finally(() => {
                        if (btnGps) btnGps.innerHTML = '<i class="fa-solid fa-location-dot text-sm"></i>';
                    });
            },
            () => {
                if (btnGps) btnGps.innerHTML = '<i class="fa-solid fa-location-dot text-sm"></i>';
                alert("Por favor habilita el permiso de ubicación GPS en tu navegador.");
            }
        );
    } else {
        if (btnGps) btnGps.innerHTML = '<i class="fa-solid fa-location-dot text-sm"></i>';
        alert("Tu dispositivo o navegador no soporta geolocalización.");
    }
}

// Procesar formulario
function procesarFormulario(e) {
    e.preventDefault();
    if (modoModal === 'login') {
        alert("¡Sesión iniciada con éxito!");
    } else {
        const check = document.getElementById('check-terminos');
        if (check && !check.checked) {
            alert("Debes aceptar los términos y condiciones para crear tu cuenta.");
            return;
        }
        alert("¡Cuenta creada con éxito! Bienvenido a NO WASTE.");
    }
    cerrarLogin();
}
// ==========================================
// ESTADO GLOBAL Y PERSISTENCIA DE DATOS
// ==========================================
let modoModal = 'login';
let filtroCategoriaActual = 'todos';
let alimentoSeleccionadoId = null;
let fotoAlimentoTemporal = null;

let ordenActual = 'vencimiento';
let ubicacionFiltrada = 'todas';
let tipoCuentaUsuario = localStorage.getItem('nowaste_tipo_cuenta') || 'hogar';

let contadorDonaciones = localStorage.getItem('nowaste_donaciones') !== null 
    ? parseInt(localStorage.getItem('nowaste_donaciones')) : 0;

let contadorKgSalvados = localStorage.getItem('nowaste_kg') !== null 
    ? parseFloat(localStorage.getItem('nowaste_kg')) : 0.0;

let contadorRecetas = localStorage.getItem('nowaste_recetas') !== null 
    ? parseInt(localStorage.getItem('nowaste_recetas')) : 0;

let totalAlimentosAgregadosHistorial = localStorage.getItem('nowaste_total_agregados') !== null
    ? parseInt(localStorage.getItem('nowaste_total_agregados')) : 0;

let fotoPerfilUsuario = localStorage.getItem('nowaste_foto_perfil') 
    || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';

// RACHA DEL SR. BIGOTES
let rachaDias = localStorage.getItem('nowaste_racha') !== null 
    ? parseInt(localStorage.getItem('nowaste_racha')) : 0;

let ultimaFechaVisita = localStorage.getItem('nowaste_ultima_visita') || '';

let inventarioAlimentos = JSON.parse(localStorage.getItem('nowaste_inventario')) || [];

// ==========================================
// GENERADOR VECTORIAL SVG DEL SR. BIGOTES
// ==========================================
function generarSVGSrBigotes(dia) {
    // Dibujo vectorial limpio del Sr. Bigotes (Conejo con moño azul y zanahoria)
    return `
    <svg viewBox="0 0 100 120" class="w-full h-full drop-shadow">
        <!-- Orejas -->
        <ellipse cx="38" cy="22" rx="7" ry="18" fill="#fff" stroke="#f1f5f9" stroke-width="2"/>
        <ellipse cx="38" cy="22" rx="4" ry="12" fill="#fbcfe8"/>
        <ellipse cx="62" cy="22" rx="7" ry="18" fill="#fff" stroke="#f1f5f9" stroke-width="2"/>
        <ellipse cx="62" cy="22" rx="4" ry="12" fill="#fbcfe8"/>
        
        <!-- Cabeza -->
        <circle cx="50" cy="50" r="24" fill="#fff" stroke="#f1f5f9" stroke-width="2"/>
        
        <!-- Mejillas -->
        <circle cx="35" cy="55" r="4" fill="#fbcfe8" opacity="0.8"/>
        <circle cx="65" cy="55" r="4" fill="#fbcfe8" opacity="0.8"/>
        
        <!-- Ojos -->
        ${dia >= 3 
            ? `<path d="M 33 47 Q 38 42 43 47" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
               <path d="M 57 47 Q 62 42 67 47" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
            : `<circle cx="38" cy="47" r="3" fill="#1e293b"/>
               <circle cx="62" cy="47" r="3" fill="#1e293b"/>`
        }

        <!-- Nariz y Boca -->
        <polygon points="48,51 52,51 50,54" fill="#e11d48"/>
        <path d="M 46 56 Q 50 59 54 56" stroke="#1e293b" stroke-width="1.5" fill="none" stroke-linecap="round"/>

        <!-- Moño Azul característico -->
        <path d="M 42 65 L 50 67 L 42 70 Z" fill="#0284c7"/>
        <path d="M 58 65 L 50 67 L 58 70 Z" fill="#0284c7"/>
        <circle cx="50" cy="67" r="2.5" fill="#38bdf8"/>

        <!-- Cuerpo -->
        <ellipse cx="50" cy="85" rx="18" ry="16" fill="#fff" stroke="#f1f5f9" stroke-width="2"/>

        <!-- Zanahoria 🥕 incorporada -->
        <g transform="translate(${dia >= 3 ? '40, 75' : '52, 80'}) rotate(${dia >= 3 ? '-15' : '20'})">
            <path d="M 0 0 Q 8 -5 12 12 Q 5 22 0 25 Q -5 22 -12 12 Q -8 -5 0 0 Z" fill="#f97316"/>
            <!-- Hojas de la zanahoria -->
            <path d="M -3 -3 Q -8 -12 -2 -14 Q 0 -8 0 0 Z" fill="#22c55e"/>
            <path d="M 0 -3 Q 0 -15 4 -14 Q 2 -8 0 0 Z" fill="#16a34a"/>
            <path d="M 3 -3 Q 8 -12 2 -14 Q 0 -8 0 0 Z" fill="#22c55e"/>
        </g>
    </svg>`;
}

// CONFIGURACIÓN DE COLORES Y TEXTOS POR DÍA
const CONFIG_RACHA_DIAS = {
    0: { bgCard: 'bg-sky-100 border-sky-300', bgBanner: 'bg-sky-100 border-sky-200', textoDia: 'DÍA 0 🥕', tag: 'DÍA 0' },
    1: { bgCard: 'bg-sky-100 border-sky-300', bgBanner: 'bg-sky-100 border-sky-200', textoDia: 'DÍA 1 🥕', tag: 'DÍA 1' },
    2: { bgCard: 'bg-amber-100 border-amber-300', bgBanner: 'bg-amber-100 border-amber-200', textoDia: 'DÍA 2 🥕', tag: 'DÍA 2' },
    3: { bgCard: 'bg-emerald-100 border-emerald-300', bgBanner: 'bg-emerald-100 border-emerald-200', textoDia: 'DÍA 3 🥕', tag: 'DÍA 3' },
    4: { bgCard: 'bg-purple-100 border-purple-300', bgBanner: 'bg-purple-100 border-purple-200', textoDia: 'DÍA 4 🥕', tag: 'DÍA 4' },
    5: { bgCard: 'bg-orange-100 border-orange-300', bgBanner: 'bg-orange-100 border-orange-200', textoDia: 'DÍA 5 🥕', tag: 'DÍA 5' },
    6: { bgCard: 'bg-teal-100 border-teal-300', bgBanner: 'bg-teal-100 border-teal-200', textoDia: 'DÍA 6 🥕', tag: 'DÍA 6' },
    7: { bgCard: 'bg-pink-100 border-pink-300', bgBanner: 'bg-pink-100 border-pink-200', textoDia: 'DÍA 7+ 🥕', tag: 'DÍA 7+' }
};

function obtenerConfigDia(dia) {
    if (dia >= 7) return CONFIG_RACHA_DIAS[7];
    return CONFIG_RACHA_DIAS[dia] || CONFIG_RACHA_DIAS[0];
}

// ==========================================
// GUARDAR ESTADO LOCAL
// ==========================================
function guardarEstadoLocal() {
    localStorage.setItem('nowaste_donaciones', contadorDonaciones);
    localStorage.setItem('nowaste_kg', contadorKgSalvados);
    localStorage.setItem('nowaste_recetas', contadorRecetas);
    localStorage.setItem('nowaste_total_agregados', totalAlimentosAgregadosHistorial);
    localStorage.setItem('nowaste_inventario', JSON.stringify(inventarioAlimentos));
    localStorage.setItem('nowaste_foto_perfil', fotoPerfilUsuario);
    localStorage.setItem('nowaste_tipo_cuenta', tipoCuentaUsuario);
    localStorage.setItem('nowaste_racha', rachaDias);
    localStorage.setItem('nowaste_ultima_visita', ultimaFechaVisita);
}

// ==========================================
// SISTEMA DE RACHA (STREAK) Y SR. BIGOTES
// ==========================================
function verificarRachaDiaria() {
    const hoyStr = new Date().toISOString().split('T')[0];

    if (!ultimaFechaVisita) {
        if (inventarioAlimentos.length > 0) {
            rachaDias = 1;
            ultimaFechaVisita = hoyStr;
        }
    } else if (ultimaFechaVisita !== hoyStr) {
        const fechaUltima = new Date(ultimaFechaVisita);
        const fechaHoy = new Date(hoyStr);
        const difDias = Math.floor((fechaHoy - fechaUltima) / (1000 * 60 * 60 * 24));

        if (difDias === 1) {
            rachaDias += 1;
        } else if (difDias > 1) {
            rachaDias = 1;
        }
        ultimaFechaVisita = hoyStr;
    }

    guardarEstadoLocal();
}

function actualizarMensajeSrBigotes() {
    const msgElem = document.getElementById('mensaje-sr-bigotes');
    const containerBanner = document.getElementById('banner-sr-bigotes-despensa');
    const svgContainer = document.getElementById('svg-sr-bigotes-despensa');
    
    const config = obtenerConfigDia(rachaDias);

    if (svgContainer) svgContainer.innerHTML = generarSVGSrBigotes(rachaDias);
    if (containerBanner) {
        containerBanner.className = `rounded-2xl p-3 text-slate-800 shadow-sm flex items-center gap-3 relative overflow-hidden transition-all duration-300 ${config.bgBanner}`;
    }

    if (!msgElem) return;

    const vencidosCriticos = inventarioAlimentos.filter(a => a.diasVencimiento <= 1);

    if (vencidosCriticos.length > 0) {
        msgElem.innerHTML = `⚠️ <b>¡Atención!</b> Tienes <b>${vencidosCriticos.length} alimentos</b> por vencer. ¡El Sr. Bigotes te ayuda a cuidarlos en su <b>${config.textoDia}</b>!`;
    } else if (inventarioAlimentos.length === 0) {
        msgElem.innerHTML = `🥑 <b>¡Hola! Soy el Sr. Bigotes.</b> Agrega tus alimentos para alimentar mi racha de zanahorias 🥕`;
    } else {
        msgElem.innerHTML = `🥑 <b>¡Excelente trabajo!</b> Tu despensa está sana y el Sr. Bigotes celebra su <b>${config.textoDia}</b>.`;
    }
}

// ==========================================
// NAVEGACIÓN
// ==========================================
function irA(vista) {
    const vistas = ['vista-auth', 'vista-despensa', 'vista-detalle-alimento', 'vista-perfil'];
    vistas.forEach(v => {
        const elem = document.getElementById(v);
        if (elem) elem.classList.add('hidden');
    });

    if (vista === 'despensa') {
        const d = document.getElementById('vista-despensa');
        if (d) d.classList.remove('hidden');
        renderizarAlimentos();
        actualizarMensajeSrBigotes();
    } else if (vista === 'perfil') {
        const p = document.getElementById('vista-perfil');
        if (p) p.classList.remove('hidden');
        actualizarMétricasPerfil();
    } else if (vista === 'vista-auth') {
        const a = document.getElementById('vista-auth');
        if (a) a.classList.remove('hidden');
    }
}

// ==========================================
// MODALES Y FORMULARIO
// ==========================================
function abrirModal(modo) {
    modoModal = modo || 'login';
    const modal = document.getElementById('modal-login');
    if (modal) {
        modal.classList.remove('hidden');
        actualizarModalUI();
    }
}

function abrirLogin() { abrirModal('login'); }
function abrirRegistro() { abrirModal('registro'); }

function cerrarLogin() {
    const modal = document.getElementById('modal-login');
    if (modal) modal.classList.add('hidden');
}

function cambiarModoModal(modo) {
    modoModal = modo;
    actualizarModalUI();
}

function actualizarModalUI() {
    const titulo = document.getElementById('modal-titulo');
    const camposLogin = document.getElementById('campos-login');
    const camposRegistro = document.getElementById('campos-registro');
    const btnSubmit = document.getElementById('btn-submit-modal');
    const tabLogin = document.getElementById('tab-login');
    const tabRegistro = document.getElementById('tab-registro');

    if (!titulo || !camposLogin || !camposRegistro) return;

    if (modoModal === 'login') {
        titulo.textContent = 'Iniciar Sesión';
        camposLogin.classList.remove('hidden');
        camposRegistro.classList.add('hidden');
        if (btnSubmit) btnSubmit.textContent = 'Iniciar sesión';

        if (tabLogin && tabRegistro) {
            tabLogin.className = "flex-1 py-1.5 text-xs font-bold rounded-xl bg-white shadow-sm text-emerald-800 transition cursor-pointer";
            tabRegistro.className = "flex-1 py-1.5 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 transition cursor-pointer";
        }
    } else {
        titulo.textContent = 'Crear Cuenta';
        camposLogin.classList.add('hidden');
        camposRegistro.classList.remove('hidden');
        if (btnSubmit) btnSubmit.textContent = 'Registrarse';

        if (tabLogin && tabRegistro) {
            tabRegistro.className = "flex-1 py-1.5 text-xs font-bold rounded-xl bg-white shadow-sm text-emerald-800 transition cursor-pointer";
            tabLogin.className = "flex-1 py-1.5 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 transition cursor-pointer";
        }
    }
}

function togglePassword(inputId, iconId) {
    const passInput = document.getElementById(inputId);
    const passIcon = document.getElementById(iconId);
    if (passInput && passIcon) {
        if (passInput.type === 'password') {
            passInput.type = 'text';
            passIcon.className = 'fa-solid fa-eye-slash text-slate-400 text-xs';
        } else {
            passInput.type = 'password';
            passIcon.className = 'fa-solid fa-eye text-slate-400 text-xs';
        }
    }
}

function seleccionarPerfil(tipo) {
    const btnHogar = document.getElementById('btn-perfil-hogar');
    const btnComercio = document.getElementById('btn-perfil-comercio');

    if (tipo === 'hogar' && btnHogar && btnComercio) {
        btnHogar.className = "flex-1 py-2 rounded-xl text-xs font-bold border-2 border-emerald-600 bg-emerald-50 text-emerald-800 flex items-center justify-center gap-1.5 cursor-pointer";
        btnComercio.className = "flex-1 py-2 rounded-xl text-xs font-semibold border-2 border-slate-200 bg-slate-50 text-slate-600 flex items-center justify-center gap-1.5 cursor-pointer";
    } else if (btnHogar && btnComercio) {
        btnComercio.className = "flex-1 py-2 rounded-xl text-xs font-bold border-2 border-emerald-600 bg-emerald-50 text-emerald-800 flex items-center justify-center gap-1.5 cursor-pointer";
        btnHogar.className = "flex-1 py-2 rounded-xl text-xs font-semibold border-2 border-slate-200 bg-slate-50 text-slate-600 flex items-center justify-center gap-1.5 cursor-pointer";
    }
}

function abrirModalFiltros() {
    const modal = document.getElementById('modal-filtros');
    if (modal) modal.classList.remove('hidden');
}

function cerrarModalFiltros() {
    const modal = document.getElementById('modal-filtros');
    if (modal) modal.classList.add('hidden');
}

function aplicarFiltrosAvanzados() {
    const selectOrden = document.getElementById('select-orden');
    const selectUbi = document.getElementById('select-ubicacion');

    if (selectOrden) ordenActual = selectOrden.value;
    if (selectUbi) ubicacionFiltrada = selectUbi.value;

    cerrarModalFiltros();
    renderizarAlimentos();
}

// ==========================================
// INSIGNIAS Y PERFIL
// ==========================================
function renderizarInsignias() {
    const contenedor = document.getElementById('contenedor-insignias');
    if (!contenedor) return;

    const insignias = [
        {
            id: 'primer_paso',
            titulo: 'Primer Paso',
            emoji: '🥑',
            desbloqueado: totalAlimentosAgregadosHistorial >= 1,
            desc: 'Agrega tu 1er alimento'
        },
        {
            id: 'en_racha',
            titulo: 'En Racha',
            emoji: '🥕',
            desbloqueado: rachaDias >= 3,
            desc: 'Racha de 3 días'
        },
        {
            id: 'eco_guardian',
            titulo: 'Eco Guardián',
            emoji: '👑',
            desbloqueado: contadorKgSalvados >= 5.0,
            desc: 'Salva 5 kg de comida'
        },
        {
            id: 'donador',
            titulo: 'Corazón Solidario',
            emoji: '🤝',
            desbloqueado: contadorDonaciones >= 2,
            desc: 'Realiza 2 donaciones'
        }
    ];

    contenedor.innerHTML = '';
    insignias.forEach(ins => {
        if (ins.desbloqueado) {
            contenedor.innerHTML += `
                <div class="flex flex-col items-center">
                    <div class="w-10 h-10 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-lg shadow-sm relative">
                        ${ins.emoji}
                        <span class="absolute -top-1 -right-1 bg-emerald-600 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">✓</span>
                    </div>
                    <span class="text-[9px] font-bold text-slate-800 mt-1">${ins.titulo}</span>
                </div>
            `;
        } else {
            contenedor.innerHTML += `
                <div class="flex flex-col items-center opacity-40 grayscale">
                    <div class="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-300 flex items-center justify-center text-lg">
                        ${ins.emoji}
                    </div>
                    <span class="text-[9px] font-bold text-slate-500 mt-1">${ins.titulo}</span>
                </div>
            `;
        }
    });
}

function actualizarMétricasPerfil() {
    const elDonaciones = document.getElementById('perfil-stat-donaciones');
    const elKg = document.getElementById('perfil-stat-kg');
    const elKgHeader = document.getElementById('header-kg-salvados');
    const elRecetas = document.getElementById('perfil-stat-recetas');
    const elRachaHeader = document.getElementById('header-racha-dias');
    const elRachaPerfil = document.getElementById('perfil-racha-dias');
    const elAhorroDinero = document.getElementById('perfil-dinero-ahorro');
    const elSubtextoRacha = document.getElementById('perfil-racha-subtexto');
    
    // ELEMENTOS DINÁMICOS EN PERFIL
    const cardRacha = document.getElementById('card-racha-perfil');
    const textoDiaGrande = document.getElementById('texto-dia-grande');
    const svgPerfil = document.getElementById('svg-sr-bigotes-perfil');
    const badgeTagDia = document.getElementById('badge-tag-dia');
    const badgeNivel = document.getElementById('badge-nivel-usuario');

    const badgeTipoHeader = document.getElementById('badge-tipo-usuario-header');
    const badgePerfil = document.getElementById('perfil-badge-tipo');
    const textoToggle = document.getElementById('texto-toggle-cuenta');
    const iconoToggle = document.getElementById('icono-toggle-cuenta');
    const labelCentro = document.getElementById('label-stat-centro');

    if (elDonaciones) elDonaciones.textContent = contadorDonaciones;
    if (elKg) elKg.textContent = `${contadorKgSalvados} kg`;
    if (elKgHeader) elKgHeader.textContent = `${contadorKgSalvados} kg`;
    if (elRecetas) elRecetas.textContent = contadorRecetas;
    if (elRachaHeader) elRachaHeader.textContent = `${rachaDias} días`;
    if (elRachaPerfil) elRachaPerfil.textContent = `${rachaDias} Días Consecutivos`;

    const config = obtenerConfigDia(rachaDias);

    if (cardRacha) {
        cardRacha.className = `rounded-2xl p-4 text-slate-900 shadow-md relative overflow-hidden flex items-center justify-between border-2 transition-all duration-300 ${config.bgCard}`;
    }
    if (textoDiaGrande) textoDiaGrande.textContent = config.textoDia;
    if (svgPerfil) svgPerfil.innerHTML = generarSVGSrBigotes(rachaDias);
    if (badgeTagDia) badgeTagDia.textContent = config.tag;

    if (elSubtextoRacha) {
        if (rachaDias === 0) {
            elSubtextoRacha.textContent = "¡Agrega comida a tu despensa para iniciar tu racha de zanahorias!";
        } else if (rachaDias < 3) {
            elSubtextoRacha.textContent = "¡El Sr. Bigotes está feliz de verte hoy! Sigue así.";
        } else {
            elSubtextoRacha.textContent = "¡Racha de zanahorias imparable! El Sr. Bigotes está orgulloso.";
        }
    }

    if (badgeNivel) {
        if (contadorKgSalvados >= 5.0) {
            badgeNivel.innerHTML = `<i class="fa-solid fa-award text-xs"></i> Nivel 3 • Héroe Verde`;
        } else if (rachaDias >= 2 || contadorKgSalvados > 0) {
            badgeNivel.innerHTML = `<i class="fa-solid fa-award text-xs"></i> Nivel 2 • Eco Guardián`;
        } else {
            badgeNivel.innerHTML = `<i class="fa-solid fa-award text-xs"></i> Nivel 1 • Principiante`;
        }
    }

    const estimacionAhorro = Math.round(contadorKgSalvados * 12000);
    if (elAhorroDinero) elAhorroDinero.textContent = `$${estimacionAhorro.toLocaleString()} COP Ahorrados`;

    if (tipoCuentaUsuario === 'empresa') {
        if (badgeTipoHeader) badgeTipoHeader.textContent = "Empresa 🏢";
        if (badgePerfil) badgePerfil.textContent = "🏢 Perfil Comercio";
        if (textoToggle) textoToggle.textContent = "Cambiar a Perfil Hogar / Personal";
        if (iconoToggle) iconoToggle.className = "fa-solid fa-house";
        if (labelCentro) labelCentro.textContent = "Ofertas";
    } else {
        if (badgeTipoHeader) badgeTipoHeader.textContent = "Hogar 🏡";
        if (badgePerfil) badgePerfil.textContent = "🏡 Perfil Hogar";
        if (textoToggle) textoToggle.textContent = "Cambiar a Perfil Empresa / Comercio";
        if (iconoToggle) iconoToggle.className = "fa-solid fa-store";
        if (labelCentro) labelCentro.textContent = "Recetas";
    }

    renderizarInsignias();
}

function toggleTipoCuenta() {
    if (tipoCuentaUsuario === 'hogar') {
        tipoCuentaUsuario = 'empresa';
        alert("🏢 Has cambiado a Perfil Empresa / Comercio.");
    } else {
        tipoCuentaUsuario = 'hogar';
        alert("🏡 Has cambiado a Perfil Hogar / Personal.");
    }
    guardarEstadoLocal();
    actualizarMétricasPerfil();
}

// ==========================================
// RENDERIZADO Y ALIMENTOS
// ==========================================
function renderizarAlimentos() {
    const contenedorVence = document.getElementById('contenedor-vence-pronto');
    const contenedorFrescos = document.getElementById('contenedor-frescos');
    const inputBuscar = document.getElementById('input-buscar');
    const terminoBusqueda = inputBuscar ? inputBuscar.value.toLowerCase().trim() : '';

    if (!contenedorVence || !contenedorFrescos) return;

    contenedorVence.innerHTML = '';
    contenedorFrescos.innerHTML = '';

    let filtrados = inventarioAlimentos.filter(item => {
        const coincideNombre = item.nombre.toLowerCase().includes(terminoBusqueda);
        const coincideCat = filtroCategoriaActual === 'todos' || item.categoria === filtroCategoriaActual;
        const coincideUbi = ubicacionFiltrada === 'todas' || item.ubicacion.toLowerCase().includes(ubicacionFiltrada.toLowerCase());
        return coincideNombre && coincideCat && coincideUbi;
    });

    if (ordenActual === 'vencimiento') {
        filtrados.sort((a, b) => a.diasVencimiento - b.diasVencimiento);
    } else if (ordenActual === 'nombre') {
        filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (ordenActual === 'reciente') {
        filtrados.sort((a, b) => b.id - a.id);
    }

    const vencePronto = filtrados.filter(item => item.diasVencimiento <= 2);
    const frescos = filtrados.filter(item => item.diasVencimiento > 2);

    if (vencePronto.length === 0) {
        contenedorVence.innerHTML = `<p class="text-[11px] text-slate-400 italic py-1">No hay elementos próximos a vencer.</p>`;
    } else {
        vencePronto.forEach(item => {
            contenedorVence.innerHTML += `
                <div onclick="verDetalleAlimento(${item.id})" class="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 flex items-center justify-between shadow-sm hover:shadow transition cursor-pointer">
                    <div class="flex items-center gap-3">
                        <img src="${item.imagen}" class="w-10 h-10 rounded-xl object-cover border border-slate-200">
                        <div>
                            <h4 class="text-xs font-bold text-slate-800">${item.nombre}</h4>
                            <p class="text-[10px] text-amber-700 font-semibold">Vence en ${item.diasVencimiento} días • ${item.cantidad}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5" onclick="event.stopPropagation()">
                        <button onclick="sugerirReceta('${item.nombre}')" class="bg-amber-600 text-white text-[10px] font-bold px-2 py-1.5 rounded-xl shadow-sm cursor-pointer">
                            ¿Qué cocinar?
                        </button>
                        <button onclick="donarAlimento(${item.id})" class="bg-amber-500 text-white text-[10px] font-bold px-2 py-1.5 rounded-xl shadow-sm cursor-pointer">
                            Donar
                        </button>
                    </div>
                </div>
            `;
        });
    }

    if (frescos.length === 0) {
        contenedorFrescos.innerHTML = `<p class="text-[11px] text-slate-400 italic col-span-2 py-1">No hay alimentos en esta sección.</p>`;
    } else {
        frescos.forEach(item => {
            contenedorFrescos.innerHTML += `
                <div onclick="verDetalleAlimento(${item.id})" class="bg-white border border-slate-200 rounded-2xl p-2.5 flex flex-col justify-between shadow-sm cursor-pointer">
                    <div class="flex items-center gap-2 mb-2">
                        <img src="${item.imagen}" class="w-8 h-8 rounded-lg object-cover">
                        <div>
                            <h4 class="text-xs font-bold text-slate-800">${item.nombre}</h4>
                            <p class="text-[9px] text-emerald-600 font-medium">Vence en ${item.diasVencimiento} días</p>
                        </div>
                    </div>
                    <span class="text-[10px] text-slate-400">Cantidad: ${item.cantidad}</span>
                </div>
            `;
        });
    }

    actualizarContadores();
    actualizarMensajeSrBigotes();
}

function filtrarCategoria(cat) {
    filtroCategoriaActual = cat;
    renderizarAlimentos();
}

function actualizarContadores() {
    const totalCount = inventarioAlimentos.length;
    const venceCount = inventarioAlimentos.filter(i => i.diasVencimiento <= 2).length;
    const frescosCount = inventarioAlimentos.filter(i => i.diasVencimiento > 2).length;

    const btnTodos = document.getElementById('btn-cat-todos');
    const btnVence = document.getElementById('btn-cat-vence');
    const btnFrescos = document.getElementById('btn-cat-frescos');

    if (btnTodos) btnTodos.textContent = `Todos (${totalCount})`;
    if (btnVence) btnVence.textContent = `🔴 Vence pronto (${venceCount})`;
    if (btnFrescos) btnFrescos.textContent = `🟢 Frescos (${frescosCount})`;
}

// ==========================================
// ACCIONES
// ==========================================
function donarAlimento(id) {
    const item = inventarioAlimentos.find(a => a.id === id);
    if (item) {
        contadorDonaciones += 1;
        contadorKgSalvados = parseFloat((contadorKgSalvados + 0.5).toFixed(1));

        eliminarAlimento(id);
        guardarEstadoLocal();
        actualizarMétricasPerfil();

        alert(`🤝 Donación de "${item.nombre}" registrada correctamente.`);
    }
}

function donarDesdeDetalle() {
    if (alimentoSeleccionadoId) {
        donarAlimento(alimentoSeleccionadoId);
        cerrarDetalleAlimento();
    }
}

function verDetalleAlimento(id) {
    const item = inventarioAlimentos.find(a => a.id === id);
    if (!item) return;

    alimentoSeleccionadoId = id;

    const imgElem = document.getElementById('det-imagen');
    if (imgElem) imgElem.src = item.imagen;

    const nomElem = document.getElementById('det-nombre');
    if (nomElem) nomElem.textContent = item.nombre;

    const cantElem = document.getElementById('det-cantidad');
    if (cantElem) cantElem.textContent = `${item.cantidad} • ${item.ubicacion}`;

    const despensaView = document.getElementById('vista-despensa');
    const detalleView = document.getElementById('vista-detalle-alimento');
    if (despensaView) despensaView.classList.add('hidden');
    if (detalleView) detalleView.classList.remove('hidden');
}

function cerrarDetalleAlimento() {
    const detalleView = document.getElementById('vista-detalle-alimento');
    const despensaView = document.getElementById('vista-despensa');
    if (detalleView) detalleView.classList.add('hidden');
    if (despensaView) despensaView.classList.remove('hidden');
}

function consumirDesdeDetalle() {
    if (alimentoSeleccionadoId) {
        eliminarAlimento(alimentoSeleccionadoId);
        cerrarDetalleAlimento();
        contadorKgSalvados = parseFloat((contadorKgSalvados + 0.3).toFixed(1));
        guardarEstadoLocal();
        actualizarMétricasPerfil();
        alert("¡Alimento marcado como consumido!");
    }
}

function eliminarAlimento(id) {
    inventarioAlimentos = inventarioAlimentos.filter(item => item.id !== id);
    guardarEstadoLocal();
    renderizarAlimentos();
}

function sugerirReceta(alimento) {
    contadorRecetas += 1;
    guardarEstadoLocal();
    actualizarMétricasPerfil();
    alert(`🍳 Idea de receta de rescate con ${alimento}:\n- Batido o salteado express\n- Sopa o guiso de aprovechamiento`);
}

function abrirModalAgregar() {
    const modal = document.getElementById('modal-agregar');
    if (modal) modal.classList.remove('hidden');
}

function cerrarModalAgregar() {
    const modal = document.getElementById('modal-agregar');
    if (modal) modal.classList.add('hidden');
}

function previsualizarFotoAlimento(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            fotoAlimentoTemporal = e.target.result;
            const imgPreview = document.getElementById('preview-foto-alimento');
            const placeholder = document.getElementById('placeholder-foto-alimento');
            
            if (imgPreview && placeholder) {
                imgPreview.src = fotoAlimentoTemporal;
                imgPreview.classList.remove('hidden');
                placeholder.classList.add('hidden');
            }
        };
        reader.readAsDataURL(file);
    }
}

function guardarAlimento() {
    const inputNombre = document.getElementById('nuevo-nombre');
    const inputCantidad = document.getElementById('nueva-cantidad');
    const inputFechaCal = document.getElementById('nueva-fecha-cal');

    if (!inputNombre || !inputNombre.value.trim()) {
        alert("Por favor escribe el nombre del alimento.");
        return;
    }

    let diasCalculados = 4;
    if (inputFechaCal && inputFechaCal.value) {
        const fechaSeleccionada = new Date(inputFechaCal.value + 'T00:00:00');
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const diferenciaTiempo = fechaSeleccionada.getTime() - hoy.getTime();
        diasCalculados = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));

        if (diasCalculados < 0) diasCalculados = 0;
    }

    const imagenFinal = fotoAlimentoTemporal || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500';

    const nuevoItem = {
        id: Date.now(),
        nombre: inputNombre.value.trim(),
        emoji: '🥑',
        cantidad: inputCantidad && inputCantidad.value.trim() ? inputCantidad.value.trim() : '1 unidad',
        diasVencimiento: diasCalculados,
        categoria: diasCalculados <= 2 ? 'vence' : 'frescos',
        imagen: imagenFinal,
        ubicacion: 'Despensa'
    };

    inventarioAlimentos.unshift(nuevoItem);
    totalAlimentosAgregadosHistorial += 1;

    if (rachaDias === 0) {
        rachaDias = 1;
        ultimaFechaVisita = new Date().toISOString().split('T')[0];
    }

    guardarEstadoLocal();
    renderizarAlimentos();
    actualizarMétricasPerfil();

    inputNombre.value = '';
    if (inputCantidad) inputCantidad.value = '';
    if (inputFechaCal) inputFechaCal.value = '';
    fotoAlimentoTemporal = null;

    const imgPreview = document.getElementById('preview-foto-alimento');
    const placeholder = document.getElementById('placeholder-foto-alimento');
    if (imgPreview) imgPreview.classList.add('hidden');
    if (placeholder) placeholder.classList.remove('hidden');

    cerrarModalAgregar();
}

function reiniciarProgreso() {
    if (confirm("¿Deseas reiniciar tu progreso y contadores a 0?")) {
        contadorDonaciones = 0;
        contadorKgSalvados = 0.0;
        contadorRecetas = 0;
        totalAlimentosAgregadosHistorial = 0;
        rachaDias = 0;
        ultimaFechaVisita = '';
        inventarioAlimentos = [];
        
        guardarEstadoLocal();
        renderizarAlimentos();
        actualizarMétricasPerfil();
    }
}

function cerrarSesion() { irA('vista-auth'); }

function loginSocial(red) {
    alert(`Iniciando con ${red}...`);
    cerrarLogin();
    irA('despensa');
}

function procesarFormulario(e) {
    if (e) e.preventDefault();
    cerrarLogin();
    irA('despensa');
}

// INICIALIZACIÓN
window.addEventListener('DOMContentLoaded', () => {
    verificarRachaDiaria();
    actualizarMétricasPerfil();
    renderizarAlimentos();
});
