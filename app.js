// ==========================================
// VARIABLES GLOBALES Y ESTADO DE SESIÓN
// ==========================================
let modoModal = 'login';
let fotoTemporal = null;
let fotoComunitariaTemporal = null;
let alimentoSeleccionadoId = null;
let usuarioActual = 'mi_cuenta@nowaste.com';
let redSocialSeleccionada = 'Google';

// Coordenadas GPS del usuario
let miLatitud = null;
let miLongitud = null;

// Filtros Despensa
let categoriaFiltro = 'todos';
let tipoFiltro = 'todos';
let ubicacionFiltro = 'todas';
let ordenActual = 'vencimiento';

// Filtros Donaciones y Puntos Fijos
let donacionSubtab = 'red';
let donacionFiltro = 'cerca';

// Filtros Comunidades y Chat
let comunidadSubtab = 'foro';
let comunidadFiltroCategoria = 'todos';
let chatActivoEmail = null;

// Variables de estado de perfil
let avatarUrlTemporal = null;
let avatarTamanoTemporal = 80;

// Base de datos de cuentas registradas localmente
let usuariosRegistrados = JSON.parse(localStorage.getItem('nowaste_usuarios_db')) || {
    'usuario.demo@gmail.com': { pass: '123456', nombre: 'Usuario Demo', tipo: 'hogar' },
    'sofia@nowaste.com': { pass: '123456', nombre: 'Sofia', tipo: 'hogar' },
    'mcdonalds@comercio.com': { pass: '123456', nombre: 'McDonald\'s Centro', tipo: 'comercio' },
    'fundacion@esperanza.org': { pass: '123456', nombre: 'Fundación San José', tipo: 'fundacion' }
};

// ==========================================
// CONFIGURACIÓN Y SPRITES VECTORIALES (SVG) DEL SR. BIGOTES
// ==========================================
function generarSVGBigotes(tipo) {
    const svgs = {
        zanahoria: `
            <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="88" rx="22" ry="5" fill="#e2e8f0" />
                <path d="M 32 45 C 32 30 40 20 50 20 C 60 20 68 30 68 45 C 68 62 62 80 50 80 C 38 80 32 62 32 45 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="2"/>
                <path d="M 38 28 C 30 10 20 12 28 2 C 38 -2 44 18 42 26 Z" fill="#ffffff" stroke="#f1f5f9"/>
                <path d="M 36 25 C 30 12 23 13 29 5 C 36 2 41 18 40 24 Z" fill="#fbcfe8"/>
                <path d="M 62 28 C 70 10 80 12 72 2 C 62 -2 56 18 58 26 Z" fill="#ffffff" stroke="#f1f5f9"/>
                <path d="M 64 25 C 70 12 77 13 71 5 C 64 2 59 18 60 24 Z" fill="#fbcfe8"/>
                <circle cx="43" cy="42" r="3.5" fill="#1e293b"/>
                <circle cx="57" cy="42" r="3.5" fill="#1e293b"/>
                <circle cx="44.5" cy="40.5" r="1.2" fill="#ffffff"/>
                <circle cx="58.5" cy="40.5" r="1.2" fill="#ffffff"/>
                <ellipse cx="50" cy="47" rx="2" ry="1.5" fill="#f43f5e"/>
                <path d="M 46 50 Q 50 54 54 50" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="36" cy="48" r="3.5" fill="#fda4af" opacity="0.6"/>
                <circle cx="64" cy="48" r="3.5" fill="#fda4af" opacity="0.6"/>
                <path d="M 44 54 L 56 54 L 50 59 Z" fill="#2563eb"/>
                <circle cx="50" cy="54.5" r="2" fill="#1d4ed8"/>
                <path d="M 50 78 C 45 78 40 70 42 62 C 48 55 58 60 58 70 C 58 76 54 78 50 78 Z" fill="#ea580c"/>
                <path d="M 48 72 C 45 72 43 68 44 64 C 47 60 52 62 52 68 Z" fill="#f97316"/>
                <path d="M 50 62 Q 46 55 42 58 Q 48 50 50 62 Z" fill="#16a34a"/>
                <path d="M 50 62 Q 54 55 58 58 Q 52 50 50 62 Z" fill="#22c55e"/>
            </svg>`,
        feliz: `
            <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="90" rx="16" ry="4" fill="#cbd5e1" opacity="0.5"/>
                <g transform="translate(0, -6)">
                    <path d="M 32 45 C 32 30 40 20 50 20 C 60 20 68 30 68 45 C 68 62 62 80 50 80 C 38 80 32 62 32 45 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="2"/>
                    <path d="M 38 28 C 30 10 20 12 28 2 C 38 -2 44 18 42 26 Z" fill="#ffffff"/>
                    <path d="M 36 25 C 30 12 23 13 29 5 C 36 2 41 18 40 24 Z" fill="#fbcfe8"/>
                    <path d="M 62 28 C 70 10 80 12 72 2 C 62 -2 56 18 58 26 Z" fill="#ffffff"/>
                    <path d="M 64 25 C 70 12 77 13 71 5 C 64 2 59 18 60 24 Z" fill="#fbcfe8"/>
                    <path d="M 40 40 Q 44 35 47 40" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
                    <path d="M 53 40 Q 56 35 60 40" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
                    <ellipse cx="50" cy="45" rx="2" ry="1.5" fill="#f43f5e"/>
                    <path d="M 44 48 Q 50 56 56 48 Z" fill="#1e293b"/>
                    <path d="M 47 50 Q 50 54 53 50" fill="#f43f5e"/>
                    <circle cx="35" cy="46" r="4" fill="#fda4af" opacity="0.7"/>
                    <circle cx="65" cy="46" r="4" fill="#fda4af" opacity="0.7"/>
                    <path d="M 44 54 L 56 54 L 50 59 Z" fill="#2563eb"/>
                </g>
            </svg>`,
        lentes: `
            <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="88" rx="22" ry="5" fill="#e2e8f0" />
                <path d="M 32 45 C 32 30 40 20 50 20 C 60 20 68 30 68 45 C 68 62 62 80 50 80 C 38 80 32 62 32 45 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="2"/>
                <path d="M 38 28 C 30 10 20 12 28 2 C 38 -2 44 18 42 26 Z" fill="#ffffff"/>
                <path d="M 36 25 C 30 12 23 13 29 5 C 36 2 41 18 40 24 Z" fill="#fbcfe8"/>
                <path d="M 62 28 C 70 10 80 12 72 2 C 62 -2 56 18 58 26 Z" fill="#ffffff"/>
                <path d="M 64 25 C 70 12 77 13 71 5 C 64 2 59 18 60 24 Z" fill="#fbcfe8"/>
                <path d="M 35 38 L 65 38 L 62 48 L 38 48 Z" fill="#0f172a"/>
                <path d="M 33 39 L 67 39" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
                <ellipse cx="50" cy="51" rx="2" ry="1.5" fill="#f43f5e"/>
                <path d="M 46 54 Q 50 57 54 54" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round"/>
            </svg>`
    };
    return svgs[tipo] || svgs.zanahoria;
}

const spritesSrBigotesConfig = {
    1: { tipo: 'zanahoria', bgCard: 'bg-amber-50 border-amber-300', mensaje: '"¡Bienvenido! Hoy empieza tu racha con la zanahoria del ahorro."' },
    2: { tipo: 'feliz', bgCard: 'bg-emerald-50 border-emerald-300', mensaje: '"¡2 días seguidos! Estás salvando comida como un profesional."' },
    3: { tipo: 'lentes', bgCard: 'bg-indigo-50 border-indigo-300', mensaje: '"¡3 días de racha! ¡Qué estilo tienes para no desperdiciar nada!"' },
    4: { tipo: 'feliz', bgCard: 'bg-pink-50 border-pink-300', mensaje: '"¡4 días! El planeta y tu bolsillo te lo agradecen mucho."' },
    5: { tipo: 'zanahoria', bgCard: 'bg-blue-50 border-blue-300', mensaje: '"¡5 días en racha! Tu disciplina de consumo es imbatible."' },
    6: { tipo: 'lentes', bgCard: 'bg-purple-50 border-purple-300', mensaje: '"¡6 días consecutivos! Ya eres todo un experto en desperdicio cero."' },
    7: { tipo: 'feliz', bgCard: 'bg-teal-50 border-teal-300', mensaje: '"¡UNA SEMANA ENTERA! 🎉 ¡Logro legendario con el Sr. Bigotes!"' }
};

const mensajesNotificacionSrBigotes = [
    "🐰 '¡No olvides revisar tus verduras de la alacena!'",
    "🐰 '¿Tienes pan duro? ¡Haz crutones o rebozado!'",
    "🐰 'Hoy es un gran día para donar lo que no consumas.'",
    "🐰 'Recuerda: mantener limpia la nevera conserva mejor la comida.'"
];

const noticiasTiempoRealDefault = [
    { id: 1, titulo: '🔴 En Vivo: Reducción récord de desperdicio en comercios locales', fuente: 'Monitoreo Zero Waste', resumen: 'Más de 45 establecimientos locales se han unido hoy a la red de rescate de alimentos.' },
    { id: 2, titulo: '⚡ Alerta comunitaria: Alta demanda de frutas frescas en comedores', fuente: 'Red Solidaria', resumen: 'Los puntos de recolección reportan gran éxito en donaciones de cítricos y plátanos.' }
];

const publicacionesComunidadDefault = [
    { id: 401, autor: 'Sofia', tipoAutor: 'hogar', categoria: 'recetas', titulo: '🍞 Cómo aprovechar el pan duro de ayer', contenido: '¡No lo tires! Corta en cubos, agrega aceite de oliva, orégano y hornea por 8 min a 180°C.', imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500', fecha: 'Hace 2 horas', likes: 12, dioLike: false },
    { id: 402, autor: 'Fundación San José', tipoAutor: 'fundacion', categoria: 'alertas', titulo: '🏛️ Gran Recolección de Granos Secos', contenido: 'Este fin de semana estaremos recibiendo arroz y lentejas en la sede central.', imagen: null, fecha: 'Hace 5 horas', likes: 24, dioLike: false }
];

const donacionesBaseDefault = [
    { id: 201, donante: '@maria_gomez', tipoDonante: 'hogar', nombre: 'Pan Artesanal de Masa Madre', cantidad: '2 barras', ubicacion: 'A 300m (Barrio Centro)', urgente: true, dias: 0, fechaLimite: 'Hoy hasta las 19:00', imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500', reservadoPor: null }
];

let puntosRecoleccionList = [
    { id: 301, nombre: 'Banco de Alimentos Central', tipoClave: 'banco', tipo: '📦 Banco de Alimentos', direccion: 'Calle Principal # 45-12', lat: 4.6097, lon: -74.0817, horario: '8:00 AM - 5:00 PM', estado: 'Abierto ahora', aceptacion: 'Acepta refrigerados y no perecederos', necesidadUrgente: '🍞 Buscando pan y cereales', distancia: 'Calculando GPS...' }
];

const inventarioDefault = [
    { id: 1, nombre: 'Plátanos Maduros', cantidad: '4 unidades', dias: 0, pronto: true, tipo: 'Frutas y Verduras', ubicacion: 'Alacena', imagen: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500', diasTotal: 7 }
];

const listaComprasDefault = [
    { id: 101, nombre: 'Huevos docena', comprado: false }
];

let inventario = [];
let listaCompras = [];
let redDonaciones = [];
let publicacionesComunidad = [];
let solicitudesAmistad = {};
let amigosConectados = {};
let mensajesChat = {};

const plantillasRecetas = [
    {
        idTipo: 'batido',
        nombreBase: 'Batido Cremoso de Rescate',
        aplicableA: ['Frutas y Verduras', 'Lácteos', 'Bebidas'],
        tiempo: '5 min',
        dificultad: 'Fácil',
        imagenDefault: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500',
        pasosTemplate: (ing) => [
            `Corta en trozos pequeños los/las ${ing}.`,
            `Agrégalos a la licuadora con agua, leche o yogur.`,
            `Licúa bien por 2 minutos, añade endulzante opcional y sirve bien frío.`
        ]
    }
];

// ==========================================
// CARGA Y SINCRONIZACIÓN EN TIEMPO REAL
// ==========================================
function cargarDatosUsuario() {
    const sesionGuardada = localStorage.getItem('nowaste_usuario_activo');
    if (sesionGuardada) usuarioActual = sesionGuardada;

    const usernameGuardado = localStorage.getItem(`nowaste_username_${usuarioActual}`);
    const saludo = document.getElementById('saludo-usuario');
    if (saludo) {
        saludo.textContent = usernameGuardado ? `¡Hola, ${usernameGuardado}! 👋` : `¡Hola, ${usuarioActual.split('@')[0]}! 👋`;
    }

    const despensaGuardada = localStorage.getItem(`nowaste_despensa_${usuarioActual}`);
    inventario = despensaGuardada !== null ? JSON.parse(despensaGuardada) : JSON.parse(JSON.stringify(inventarioDefault));

    const comprasGuardadas = localStorage.getItem(`nowaste_compras_${usuarioActual}`);
    listaCompras = comprasGuardadas !== null ? JSON.parse(comprasGuardadas) : JSON.parse(JSON.stringify(listaComprasDefault));

    solicitudesAmistad = JSON.parse(localStorage.getItem('nowaste_solicitudes_db')) || {};
    amigosConectados = JSON.parse(localStorage.getItem('nowaste_amigos_db')) || {};
    mensajesChat = JSON.parse(localStorage.getItem('nowaste_chats_db')) || {};

    cargarRedDonacionesGlobales();
    cargarPublicacionesComunidadGlobales();
    guardarEnLocalStorage();
}

function cargarRedDonacionesGlobales() {
    const donacionesGuardadas = localStorage.getItem(`nowaste_donaciones_red`);
    redDonaciones = donacionesGuardadas ? JSON.parse(donacionesGuardadas) : JSON.parse(JSON.stringify(donacionesBaseDefault));
}

function cargarPublicacionesComunidadGlobales() {
    const pubGuardadas = localStorage.getItem(`nowaste_comunidad_posts`);
    publicacionesComunidad = pubGuardadas ? JSON.parse(pubGuardadas) : JSON.parse(JSON.stringify(publicacionesComunidadDefault));
}

function guardarEnLocalStorage() {
    try {
        if (usuarioActual) {
            localStorage.setItem(`nowaste_despensa_${usuarioActual}`, JSON.stringify(inventario));
            localStorage.setItem(`nowaste_compras_${usuarioActual}`, JSON.stringify(listaCompras));
        }
        localStorage.setItem(`nowaste_donaciones_red`, JSON.stringify(redDonaciones));
        localStorage.setItem(`nowaste_comunidad_posts`, JSON.stringify(publicacionesComunidad));
        localStorage.setItem('nowaste_usuarios_db', JSON.stringify(usuariosRegistrados));
        localStorage.setItem('nowaste_solicitudes_db', JSON.stringify(solicitudesAmistad));
        localStorage.setItem('nowaste_amigos_db', JSON.stringify(amigosConectados));
        localStorage.setItem('nowaste_chats_db', JSON.stringify(mensajesChat));
    } catch (e) {
        console.warn("Límite de almacenamiento alcanzado", e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const estaAutenticado = localStorage.getItem('nowaste_autenticado') === 'true';
    if (estaAutenticado) {
        cargarDatosUsuario();
        mostrarDespensa();
    } else {
        cerrarSesion();
    }

    renderizarDespensa();
    renderizarListaCompras();
    renderizarRedDonaciones();
    renderizarPuntosRecoleccion();
    renderizarNoticiasTiempoReal();
    renderizarPublicacionesComunidad();
    renderizarListaPerfiles();
    renderizarPanelChatsYAmigos();
});

// ==========================================
// VISTA DE PERFIL, RACHA Y SR. BIGOTES
// ==========================================
function abrirPerfil() {
    ocultarTodasLasVistas();
    document.getElementById('vista-perfil')?.classList.remove('hidden');
    cargarDatosPerfil();
}

function cargarDatosPerfil() {
    const nombreEl = document.getElementById('perfil-nombre-usuario');
    const correoEl = document.getElementById('perfil-correo-usuario');
    const badgeEl = document.getElementById('perfil-badge-tipo');

    const usernameGuardado = localStorage.getItem(`nowaste_username_${usuarioActual}`) || usuarioActual.split('@')[0];
    const tipoCuenta = usuariosRegistrados[usuarioActual]?.tipo || 'hogar';

    if (nombreEl) nombreEl.textContent = usernameGuardado;
    if (correoEl) correoEl.textContent = usuarioActual;

    if (badgeEl) {
        if (tipoCuenta === 'comercio') {
            badgeEl.textContent = "🏬 Comercio Aliado";
            badgeEl.className = "mt-1 bg-amber-100 text-amber-800 font-bold text-[9px] px-2.5 py-0.5 rounded-full border border-amber-200";
        } else if (tipoCuenta === 'fundacion') {
            badgeEl.textContent = "🏛️ Fundación Solidaria";
            badgeEl.className = "mt-1 bg-purple-100 text-purple-800 font-bold text-[9px] px-2.5 py-0.5 rounded-full border border-purple-200";
        } else {
            badgeEl.textContent = "🌱 Defensor del Alimento";
            badgeEl.className = "mt-1 bg-emerald-100 text-emerald-800 font-bold text-[9px] px-2.5 py-0.5 rounded-full border border-emerald-200";
        }
    }

    const avatarGuardado = localStorage.getItem(`nowaste_avatar_${usuarioActual}`) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
    const tamanoGuardado = localStorage.getItem(`nowaste_avatar_size_${usuarioActual}`) || 80;

    const imgAvatar = document.getElementById('avatar-img');
    const frameAvatar = document.getElementById('avatar-frame');

    if (imgAvatar) imgAvatar.src = avatarGuardado;
    if (frameAvatar) {
        frameAvatar.style.width = `${tamanoGuardado}px`;
        frameAvatar.style.height = `${tamanoGuardado}px`;
    }

    actualizarRachaDiaria();
    actualizarMetricasImpacto();
}

function actualizarRachaDiaria() {
    const hoyStr = new Date().toISOString().split('T')[0];
    let rachaActual = parseInt(localStorage.getItem(`nowaste_racha_count_${usuarioActual}`)) || 1;
    let ultimaFecha = localStorage.getItem(`nowaste_racha_fecha_${usuarioActual}`);

    if (ultimaFecha && ultimaFecha !== hoyStr) {
        const fechaUltima = new Date(ultimaFecha);
        const fechaHoy = new Date(hoyStr);
        const diffDias = Math.floor((fechaHoy - fechaUltima) / (1000 * 60 * 60 * 24));

        if (diffDias === 1) rachaActual++;
        else if (diffDias > 1) rachaActual = 1;

        localStorage.setItem(`nowaste_racha_count_${usuarioActual}`, rachaActual);
        localStorage.setItem(`nowaste_racha_fecha_${usuarioActual}`, hoyStr);
    } else if (!ultimaFecha) {
        localStorage.setItem(`nowaste_racha_count_${usuarioActual}`, 1);
        localStorage.setItem(`nowaste_racha_fecha_${usuarioActual}`, hoyStr);
    }

    const diaClave = ((rachaActual - 1) % 7) + 1;
    const configRacha = spritesSrBigotesConfig[diaClave] || spritesSrBigotesConfig[1];

    const numEl = document.getElementById('racha-dias-numero');
    const msgEl = document.getElementById('sr-bigotes-mensaje');
    const spriteContainer = document.getElementById('sr-bigotes-sprite')?.parentElement;
    const cardEl = document.getElementById('racha-card');
    const notiEl = document.getElementById('sr-bigotes-noticall');

    if (numEl) numEl.textContent = rachaActual;
    if (msgEl) msgEl.textContent = configRacha.mensaje;
    
    // Inyección limpia del vector SVG vectorial para evitar errores de carga de imágenes
    if (spriteContainer) {
        spriteContainer.innerHTML = generarSVGBigotes(configRacha.tipo);
    }

    if (cardEl) {
        cardEl.className = `rounded-3xl p-4 shadow-md border-2 transition-all duration-500 flex items-center justify-between relative overflow-hidden ${configRacha.bgCard}`;
    }

    if (notiEl) {
        const indexNoti = Math.floor(Math.random() * mensajesNotificacionSrBigotes.length);
        notiEl.textContent = mensajesNotificacionSrBigotes[indexNoti];
    }
}

function actualizarMetricasImpacto() {
    const salvadosKg = (inventario.length * 0.8 + 3.2).toFixed(1);
    const ahorroEstimado = (inventario.length * 12000 + 15000).toLocaleString('es-CO');
    const donadosPacks = redDonaciones.filter(d => d.donante.includes(usuarioActual.split('@')[0])).length + 2;

    const elSalvado = document.getElementById('metric-salvado');
    const elAhorro = document.getElementById('metric-ahorro');
    const elDonado = document.getElementById('metric-donado');

    if (elSalvado) elSalvado.textContent = `${salvadosKg} kg`;
    if (elAhorro) elAhorro.textContent = `$${ahorroEstimado}`;
    if (elDonado) elDonado.textContent = `${donadosPacks} Packs`;
}

function abrirEditorAvatar() {
    avatarUrlTemporal = localStorage.getItem(`nowaste_avatar_${usuarioActual}`) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
    avatarTamanoTemporal = localStorage.getItem(`nowaste_avatar_size_${usuarioActual}`) || 80;

    const slider = document.getElementById('slider-avatar-size');
    if (slider) slider.value = avatarTamanoTemporal;

    document.getElementById('modal-editor-avatar')?.classList.remove('hidden');
}

function cerrarEditorAvatar() { document.getElementById('modal-editor-avatar')?.classList.add('hidden'); }

function seleccionarAvatarPreset(url) {
    avatarUrlTemporal = url;
    document.getElementById('avatar-img').src = url;
}

function subirCustomAvatar(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            avatarUrlTemporal = evt.target.result;
            document.getElementById('avatar-img').src = avatarUrlTemporal;
        };
        reader.readAsDataURL(file);
    }
}

function cambiarTamanoAvatar(val) {
    avatarTamanoTemporal = val;
    const frame = document.getElementById('avatar-frame');
    if (frame) {
        frame.style.width = `${val}px`;
        frame.style.height = `${val}px`;
    }
}

function guardarAjustesAvatar() {
    localStorage.setItem(`nowaste_avatar_${usuarioActual}`, avatarUrlTemporal);
    localStorage.setItem(`nowaste_avatar_size_${usuarioActual}`, avatarTamanoTemporal);
    cerrarEditorAvatar();
    cargarDatosPerfil();
    alert("✨ ¡Avatar e icono de perfil actualizados con éxito!");
}

function cambiarDeCuenta() { cerrarSesion(); abrirLogin(); }

function reiniciarDatosCuenta() {
    if (confirm("⚠️ ¿Estás seguro de que deseas reiniciar todos los datos de tu cuenta?")) {
        localStorage.removeItem(`nowaste_despensa_${usuarioActual}`);
        localStorage.removeItem(`nowaste_compras_${usuarioActual}`);
        localStorage.removeItem(`nowaste_racha_count_${usuarioActual}`);
        localStorage.removeItem(`nowaste_avatar_${usuarioActual}`);
        cargarDatosUsuario();
        cargarDatosPerfil();
        renderizarDespensa();
        alert("🔄 Tu cuenta se ha reiniciado correctamente.");
    }
}

// ==========================================
// MÓDULO COMUNIDADES, CHAT Y VECINOS
// ==========================================
function cambiarSubtabComunidad(tab) {
    comunidadSubtab = tab;
    const btnForo = document.getElementById('tab-com-foro');
    const btnPerfiles = document.getElementById('tab-com-perfiles');
    const btnChat = document.getElementById('tab-com-chat');

    const contForo = document.getElementById('subtab-comunidad-foro');
    const contPerfiles = document.getElementById('subtab-comunidad-perfiles');
    const contChat = document.getElementById('subtab-comunidad-chat');

    [btnForo, btnPerfiles, btnChat].forEach(b => {
        if (b) b.className = "flex-1 py-1.5 rounded-xl text-emerald-100 hover:text-white transition cursor-pointer";
    });

    [contForo, contPerfiles, contChat].forEach(c => c?.classList.add('hidden'));

    if (tab === 'foro') {
        btnForo.className = "flex-1 py-1.5 rounded-xl bg-white text-emerald-900 shadow-sm transition cursor-pointer";
        contForo?.classList.remove('hidden');
        renderizarNoticiasTiempoReal();
        renderizarPublicacionesComunidad();
    } else if (tab === 'perfiles') {
        btnPerfiles.className = "flex-1 py-1.5 rounded-xl bg-white text-emerald-900 shadow-sm transition cursor-pointer";
        contPerfiles?.classList.remove('hidden');
        renderizarListaPerfiles();
    } else {
        btnChat.className = "flex-1 py-1.5 rounded-xl bg-white text-emerald-900 shadow-sm transition cursor-pointer";
        contChat?.classList.remove('hidden');
        cerrarChatActivo();
        renderizarPanelChatsYAmigos();
    }
}

function renderizarNoticiasTiempoReal() {
    const cont = document.getElementById('contenedor-noticias-tiempo-real');
    const labelHora = document.getElementById('hora-actual-noticias');
    if (!cont) return;

    const ahora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (labelHora) labelHora.textContent = `Actualizado ${ahora}`;

    cont.innerHTML = '';
    noticiasTiempoRealDefault.forEach(n => {
        cont.innerHTML += `
            <div class="bg-white/10 p-2 rounded-xl text-[10px] space-y-0.5 border border-white/10">
                <h4 class="font-bold text-amber-200">${n.titulo}</h4>
                <p class="text-emerald-100 leading-tight">${n.resumen}</p>
            </div>
        `;
    });
}

function renderizarPublicacionesComunidad() {
    const cont = document.getElementById('contenedor-publicaciones-comunidad');
    if (!cont) return;

    cont.innerHTML = '';
    let filtrados = publicacionesComunidad.filter(p => comunidadFiltroCategoria === 'todos' || p.categoria === comunidadFiltroCategoria);

    if (filtrados.length === 0) {
        cont.innerHTML = `<div class="text-center py-8 text-xs text-slate-400">No hay publicaciones en esta categoría.</div>`;
        return;
    }

    filtrados.forEach(post => {
        let badgeTipo = `<b class="text-emerald-700">${post.autor}</b>`;
        if (post.tipoAutor === 'comercio') badgeTipo = `<span class="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">🏬 ${post.autor}</span>`;
        if (post.tipoAutor === 'fundacion') badgeTipo = `<span class="bg-purple-100 text-purple-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">🏛️ ${post.autor}</span>`;

        let catTxt = post.categoria === 'recetas' ? '🍲 Receta' : (post.categoria === 'tips' ? '💡 Tip' : '📢 Alerta');
        const imagenHTML = post.imagen ? `<div class="w-full h-36 rounded-xl overflow-hidden mb-2"><img src="${post.imagen}" class="w-full h-full object-cover"></div>` : '';

        cont.innerHTML += `
            <div class="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-2">
                <div class="flex justify-between items-start">
                    <div>
                        <span class="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">${catTxt}</span>
                        <h4 class="text-xs font-bold text-slate-800 mt-1">${post.titulo}</h4>
                    </div>
                    <span class="text-[9px] text-slate-400 font-semibold">${post.fecha}</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">${post.contenido}</p>
                ${imagenHTML}
                <div class="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                    <span class="text-slate-500">Por ${badgeTipo}</span>
                    <button type="button" onclick="darLikePublicacionComunidad(${post.id})" class="flex items-center gap-1 font-bold ${post.dioLike ? 'text-red-500' : 'text-slate-400'} cursor-pointer">
                        <i class="${post.dioLike ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        <span>${post.likes}</span>
                    </button>
                </div>
            </div>
        `;
    });
}

function filtrarPublicacionesComunidad(cat) {
    comunidadFiltroCategoria = cat;
    ['todos', 'recetas', 'tips', 'alertas'].forEach(c => {
        const btn = document.getElementById(`btn-com-cat-${c}`);
        if (btn) btn.className = c === cat ? "px-3 py-1 rounded-xl bg-[#3b630b] text-white font-bold whitespace-nowrap cursor-pointer" : "px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-600 whitespace-nowrap cursor-pointer";
    });
    renderizarPublicacionesComunidad();
}

function darLikePublicacionComunidad(idPost) {
    const post = publicacionesComunidad.find(p => p.id === idPost);
    if (!post) return;
    post.dioLike ? (post.likes--, post.dioLike = false) : (post.likes++, post.dioLike = true);
    guardarEnLocalStorage();
    renderizarPublicacionesComunidad();
}

function abrirModalNuevaPublicacionComunidad() {
    fotoComunitariaTemporal = null;
    document.getElementById('input-comunidad-titulo').value = '';
    document.getElementById('input-comunidad-contenido').value = '';
    document.getElementById('preview-foto-comunidad')?.classList.add('hidden');
    document.getElementById('placeholder-foto-comunidad')?.classList.remove('hidden');
    document.getElementById('modal-publicar-comunidad')?.classList.remove('hidden');
}

function cerrarModalNuevaPublicacionComunidad() { document.getElementById('modal-publicar-comunidad')?.classList.add('hidden'); }

function previsualizarFotoComunidad(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            fotoComunitariaTemporal = evt.target.result;
            const imgPreview = document.getElementById('preview-foto-comunidad');
            const placeholder = document.getElementById('placeholder-foto-comunidad');
            if (imgPreview && placeholder) {
                imgPreview.src = fotoComunitariaTemporal;
                imgPreview.classList.remove('hidden');
                placeholder.classList.add('hidden');
            }
        };
        reader.readAsDataURL(file);
    }
}

function guardarPublicacionComunidad() {
    const cat = document.getElementById('select-comunidad-categoria')?.value || 'recetas';
    const titulo = document.getElementById('input-comunidad-titulo')?.value.trim();
    const contenido = document.getElementById('input-comunidad-contenido')?.value.trim();
    if (!titulo || !contenido) return alert("Por favor completa el título y mensaje.");

    const miNombre = localStorage.getItem(`nowaste_username_${usuarioActual}`) || usuarioActual.split('@')[0];
    publicacionesComunidad.unshift({
        id: Date.now(),
        autor: miNombre,
        tipoAutor: usuariosRegistrados[usuarioActual]?.tipo || 'hogar',
        categoria: cat,
        titulo: titulo,
        contenido: contenido,
        imagen: fotoComunitariaTemporal || null,
        fecha: 'Ahora mismo',
        likes: 0,
        dioLike: false
    });
    guardarEnLocalStorage();
    renderizarPublicacionesComunidad();
    cerrarModalNuevaPublicacionComunidad();
    alert("🎉 Publicación compartida con éxito.");
}

function renderizarListaPerfiles() {
    const cont = document.getElementById('contenedor-lista-perfiles');
    if (!cont) return;

    cont.innerHTML = '';
    const busqueda = (document.getElementById('input-buscar-perfil')?.value || '').toLowerCase().trim();
    let emails = Object.keys(usuariosRegistrados).filter(email => email !== usuarioActual);

    if (busqueda) {
        emails = emails.filter(email => email.toLowerCase().includes(busqueda) || usuariosRegistrados[email].nombre.toLowerCase().includes(busqueda));
    }

    if (emails.length === 0) {
        cont.innerHTML = `<div class="text-center py-8 text-xs text-slate-400">No se encontraron perfiles.</div>`;
        return;
    }

    emails.forEach(email => {
        const u = usuariosRegistrados[email];
        cont.innerHTML += `
            <div class="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex items-center justify-between">
                <div class="flex items-center gap-3 cursor-pointer flex-1" onclick="verPerfilUsuario('${email}')">
                    <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">${u.nombre.charAt(0).toUpperCase()}</div>
                    <div>
                        <h4 class="text-xs font-bold text-slate-800">${u.nombre}</h4>
                        <p class="text-[10px] text-slate-400">${email}</p>
                    </div>
                </div>
                <button type="button" onclick="verPerfilUsuario('${email}')" class="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer">Ver Perfil</button>
            </div>
        `;
    });
}

function verPerfilUsuario(email) {
    const u = usuariosRegistrados[email];
    if (!u) return;

    document.getElementById('perfil-modal-nombre').textContent = u.nombre;
    document.getElementById('perfil-modal-correo').textContent = email;
    document.getElementById('perfil-modal-tipo').textContent = u.tipo || 'hogar';

    const btnContainer = document.getElementById('perfil-modal-accion-container');
    const misAmigos = amigosConectados[usuarioActual] || [];
    const misSolicitudes = solicitudesAmistad[email] || [];

    if (misAmigos.includes(email)) {
        btnContainer.innerHTML = `<button type="button" onclick="cerrarModalPerfil(); cambiarSubtabComunidad('chat'); abrirChatConAmigo('${email}');" class="w-full btn-green text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer">💬 Abrir Chat Directo</button>`;
    } else if (misSolicitudes.includes(usuarioActual)) {
        btnContainer.innerHTML = `<button type="button" disabled class="w-full bg-slate-100 text-slate-500 text-xs font-bold py-2.5 rounded-xl cursor-not-allowed">⏳ Solicitud Enviada</button>`;
    } else {
        btnContainer.innerHTML = `<button type="button" onclick="enviarSolicitudAmistad('${email}')" class="w-full btn-green text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer">➕ Enviar Solicitud de Amistad</button>`;
    }
    document.getElementById('modal-ver-perfil')?.classList.remove('hidden');
}

function cerrarModalPerfil() { document.getElementById('modal-ver-perfil')?.classList.add('hidden'); }

function enviarSolicitudAmistad(emailDestino) {
    if (!solicitudesAmistad[emailDestino]) solicitudesAmistad[emailDestino] = [];
    if (!solicitudesAmistad[emailDestino].includes(usuarioActual)) {
        solicitudesAmistad[emailDestino].push(usuarioActual);
        guardarEnLocalStorage();
        alert("✨ Solicitud de amistad enviada.");
    }
    cerrarModalPerfil();
    renderizarListaPerfiles();
}

function renderizarPanelChatsYAmigos() {
    const contSolicitudes = document.getElementById('contenedor-solicitudes');
    const contAmigos = document.getElementById('contenedor-amigos-chats');
    if (!contSolicitudes || !contAmigos) return;

    contSolicitudes.innerHTML = '';
    contAmigos.innerHTML = '';

    const misSolicitudes = solicitudesAmistad[usuarioActual] || [];
    if (misSolicitudes.length === 0) {
        contSolicitudes.innerHTML = `<p class="text-[11px] text-slate-400 italic">No tienes solicitudes pendientes.</p>`;
    } else {
        misSolicitudes.forEach(rem => {
            const u = usuariosRegistrados[rem] || { nombre: rem };
            contSolicitudes.innerHTML += `
                <div class="flex items-center justify-between bg-slate-50 p-2 rounded-xl border text-xs">
                    <p class="font-bold text-slate-800">${u.nombre}</p>
                    <div class="flex gap-1">
                        <button type="button" onclick="aceptarSolicitud('${rem}')" class="bg-emerald-600 text-white font-bold px-2 py-1 rounded text-[10px] cursor-pointer">Aceptar</button>
                        <button type="button" onclick="rechazarSolicitud('${rem}')" class="bg-slate-200 text-slate-600 font-bold px-2 py-1 rounded text-[10px] cursor-pointer">Rechazar</button>
                    </div>
                </div>`;
        });
    }

    const misAmigos = amigosConectados[usuarioActual] || [];
    if (misAmigos.length === 0) {
        contAmigos.innerHTML = `<p class="text-[11px] text-slate-400 italic">Aún no tienes amigos agregados.</p>`;
    } else {
        misAmigos.forEach(amigoEmail => {
            const amigo = usuariosRegistrados[amigoEmail] || { nombre: amigoEmail };
            contAmigos.innerHTML += `
                <div onclick="abrirChatConAmigo('${amigoEmail}')" class="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border transition cursor-pointer">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">${amigo.nombre.charAt(0).toUpperCase()}</div>
                        <div><p class="font-bold text-xs text-slate-800">${amigo.nombre}</p><p class="text-[9px] text-emerald-700 font-semibold">🟢 Conectado</p></div>
                    </div>
                    <i class="fa-solid fa-chevron-right text-slate-400 text-xs"></i>
                </div>`;
        });
    }
}

function aceptarSolicitud(remitenteEmail) {
    if (!amigosConectados[usuarioActual]) amigosConectados[usuarioActual] = [];
    if (!amigosConectados[remitenteEmail]) amigosConectados[remitenteEmail] = [];
    if (!amigosConectados[usuarioActual].includes(remitenteEmail)) amigosConectados[usuarioActual].push(remitenteEmail);
    if (!amigosConectados[remitenteEmail].includes(usuarioActual)) amigosConectados[remitenteEmail].push(usuarioActual);

    solicitudesAmistad[usuarioActual] = solicitudesAmistad[usuarioActual].filter(e => e !== remitenteEmail);
    guardarEnLocalStorage();
    renderizarPanelChatsYAmigos();
    alert("🤝 ¡Ahora son amigos!");
}

function rechazarSolicitud(remitenteEmail) {
    solicitudesAmistad[usuarioActual] = solicitudesAmistad[usuarioActual].filter(e => e !== remitenteEmail);
    guardarEnLocalStorage();
    renderizarPanelChatsYAmigos();
}

function abrirChatConAmigo(amigoEmail) {
    chatActivoEmail = amigoEmail;
    const amigo = usuariosRegistrados[amigoEmail] || { nombre: amigoEmail };
    document.getElementById('panel-lista-chats')?.classList.add('hidden');
    document.getElementById('panel-conversacion-chat')?.classList.remove('hidden');
    document.getElementById('chat-titulo-amigo').textContent = `Chat con ${amigo.nombre}`;
    renderizarMensajesChat();
}

function cerrarChatActivo() {
    chatActivoEmail = null;
    document.getElementById('panel-conversacion-chat')?.classList.add('hidden');
    document.getElementById('panel-lista-chats')?.classList.remove('hidden');
    renderizarPanelChatsYAmigos();
}

function obtenerClaveChat(e1, e2) { return [e1, e2].sort().join('_'); }

function renderizarMensajesChat() {
    const cont = document.getElementById('contenedor-mensajes-chat');
    if (!cont || !chatActivoEmail) return;

    cont.innerHTML = '';
    const clave = obtenerClaveChat(usuarioActual, chatActivoEmail);
    const historial = mensajesChat[clave] || [];

    if (historial.length === 0) {
        cont.innerHTML = `<p class="text-center text-[10px] text-slate-400 italic py-6">No hay mensajes aún.</p>`;
        return;
    }

    historial.forEach(m => {
        const esMio = m.de === usuarioActual;
        cont.innerHTML += `
            <div class="flex flex-col ${esMio ? 'items-end' : 'items-start'}">
                <div class="max-w-[80%] rounded-2xl px-3 py-2 text-xs ${esMio ? 'bg-[#3b630b] text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none border'}">
                    <p>${m.texto}</p>
                </div>
                <span class="text-[8px] text-slate-400 mt-0.5">${m.hora}</span>
            </div>`;
    });
    cont.scrollTop = cont.scrollHeight;
}

function enviarMensajeChat() {
    const input = document.getElementById('input-mensaje-chat');
    const texto = input?.value.trim();
    if (!texto || !chatActivoEmail) return;

    const clave = obtenerClaveChat(usuarioActual, chatActivoEmail);
    if (!mensajesChat[clave]) mensajesChat[clave] = [];
    mensajesChat[clave].push({ de: usuarioActual, texto: texto, hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    input.value = '';
    guardarEnLocalStorage();
    renderizarMensajesChat();
}

// ==========================================
// PUNTOS FIJOS GPS & DONACIONES
// ==========================================
function obtenerPuntosRecoleccionGPS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            miLatitud = pos.coords.latitude;
            miLongitud = pos.coords.longitude;
            puntosRecoleccionList.forEach(p => {
                const dist = calcularDistanciaHaversine(miLatitud, miLongitud, p.lat, p.lon);
                p.distancia = `${dist.toFixed(1)} km`;
            });
            puntosRecoleccionList.sort((a, b) => parseFloat(a.distancia) - parseFloat(b.distancia));
            renderizarPuntosRecoleccion();
        });
    }
}

function calcularDistanciaHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function renderizarPuntosRecoleccion() {
    const cont = document.getElementById('contenedor-puntos-recoleccion');
    if (!cont) return;

    cont.innerHTML = '';
    puntosRecoleccionList.forEach(p => {
        const linkMap = miLatitud && miLongitud ? `https://www.google.com/maps/dir/?api=1&origin=${miLatitud},${miLongitud}&destination=${p.lat},${p.lon}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.nombre)}`;
        cont.innerHTML += `
            <div class="bg-white border rounded-2xl p-3 shadow-sm space-y-2 text-xs">
                <div class="flex justify-between items-start">
                    <div><h4 class="font-bold text-slate-800">${p.nombre}</h4><p class="text-emerald-700 font-bold">${p.tipo} • 📍 ${p.distancia}</p></div>
                    <span class="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">🟢 ${p.estado}</span>
                </div>
                <p>📍 ${p.direccion} | ⏰ ${p.horario}</p>
                <a href="${linkMap}" target="_blank" class="w-full bg-slate-100 text-slate-700 font-bold py-2 rounded-xl flex items-center justify-center gap-1 no-underline">Abrir en GPS / Maps</a>
            </div>`;
    });
}

function renderizarRedDonaciones() {
    const cont = document.getElementById('contenedor-red-donaciones');
    if (!cont) return;

    cont.innerHTML = '';
    const busqueda = (document.getElementById('input-buscar-donaciones')?.value || '').toLowerCase().trim();
    let filtrados = redDonaciones.filter(item => {
        const coincideBusqueda = item.nombre.toLowerCase().includes(busqueda) || item.donante.toLowerCase().includes(busqueda);
        const coincideUrgencia = donacionFiltro === 'urgente' ? item.urgente : true;
        return coincideBusqueda && coincideUrgencia;
    });

    if (filtrados.length === 0) {
        cont.innerHTML = `<div class="text-center py-8 text-xs text-slate-400">No se encontraron alimentos o donantes.</div>`;
        return;
    }

    const miUsername = localStorage.getItem(`nowaste_username_${usuarioActual}`) || usuarioActual.split('@')[0];
    filtrados.forEach(item => {
        const esReservado = item.reservadoPor !== null;
        const reservadoPorMi = item.reservadoPor === miUsername;

        cont.innerHTML += `
            <div class="bg-white border rounded-2xl p-3 shadow-sm space-y-2 text-xs">
                <div class="flex gap-3 items-center">
                    <img src="${item.imagen}" class="w-14 h-14 rounded-xl object-cover">
                    <div class="flex-1">
                        <div class="flex justify-between"><h4 class="font-bold text-slate-800">${item.nombre}</h4>${item.urgente ? '<span class="bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded">🔴 Urgente</span>' : ''}</div>
                        <p class="text-[10px] text-slate-500">Donado por <b class="text-emerald-700">${item.donante}</b> • ${item.cantidad}</p>
                    </div>
                </div>
                ${esReservado ? `<button disabled class="w-full bg-slate-100 text-slate-500 py-2 rounded-xl font-bold cursor-not-allowed">${reservadoPorMi ? '✅ Apartado por ti' : 'Reservado'}</button>` : `<button onclick="reservarDonacion(${item.id})" class="w-full btn-green text-white py-2 rounded-xl font-bold cursor-pointer">Solicitar / Reservar</button>`}
            </div>`;
    });
}

function cambiarSubtabDonacion(tab) {
    donacionSubtab = tab;
    const btnRed = document.getElementById('tab-donar-red');
    const btnPuntos = document.getElementById('tab-donar-puntos');
    const contRed = document.getElementById('subtab-contenido-red');
    const contPuntos = document.getElementById('subtab-contenido-puntos');

    if (tab === 'red') {
        btnRed.className = "flex-1 py-1.5 rounded-xl bg-white text-emerald-900 shadow-sm transition cursor-pointer";
        btnPuntos.className = "flex-1 py-1.5 rounded-xl text-emerald-100 transition cursor-pointer";
        contRed.classList.remove('hidden');
        contPuntos.classList.add('hidden');
    } else {
        btnPuntos.className = "flex-1 py-1.5 rounded-xl bg-white text-emerald-900 shadow-sm transition cursor-pointer";
        btnRed.className = "flex-1 py-1.5 rounded-xl text-emerald-100 transition cursor-pointer";
        contPuntos.classList.remove('hidden');
        contRed.classList.add('hidden');
        obtenerPuntosRecoleccionGPS();
    }
}

function filtrarDonaciones(filtro) {
    donacionFiltro = filtro;
    renderizarRedDonaciones();
}

function abrirModalPublicarDonacion(itemPreseleccionado = null) {
    const modal = document.getElementById('modal-publicar-donacion');
    const select = document.getElementById('select-donar-despensa');
    if (!modal || !select) return;

    select.innerHTML = '<option value="">-- Seleccionar de mi despensa --</option>';
    inventario.forEach(i => { select.innerHTML += `<option value="${i.id}">${i.nombre} (${i.cantidad})</option>`; });

    if (itemPreseleccionado) {
        select.value = itemPreseleccionado.id;
        autocompletarDonacionDesdeDespensa();
    }
    document.getElementById('input-donar-fecha-limite').value = new Date().toISOString().split('T')[0];
    modal.classList.remove('hidden');
}

function cerrarModalPublicarDonacion() { document.getElementById('modal-publicar-donacion')?.classList.add('hidden'); }

function autocompletarDonacionDesdeDespensa() {
    const select = document.getElementById('select-donar-despensa');
    const item = inventario.find(i => i.id === parseInt(select.value));
    if (item) {
        document.getElementById('input-donar-nombre').value = item.nombre;
        document.getElementById('input-donar-cantidad').value = item.cantidad;
        document.getElementById('input-donar-ubicacion').value = `Mi Ubicación`;
    }
}

function confirmarPublicarDonacion() {
    const select = document.getElementById('select-donar-despensa');
    const idDespensa = parseInt(select.value);
    const nombre = document.getElementById('input-donar-nombre')?.value.trim();
    if (!nombre) return alert("Ingresa el nombre del alimento.");

    const miNombre = localStorage.getItem(`nowaste_username_${usuarioActual}`) || usuarioActual.split('@')[0];
    let itemOriginal = inventario.find(i => i.id === idDespensa);

    redDonaciones.unshift({
        id: Date.now(),
        donante: miNombre,
        tipoDonante: usuariosRegistrados[usuarioActual]?.tipo || 'hogar',
        nombre: nombre,
        cantidad: document.getElementById('input-donar-cantidad')?.value.trim() || '1 paquete',
        ubicacion: document.getElementById('input-donar-ubicacion')?.value.trim() || 'Cerca de ti',
        urgente: itemOriginal ? itemOriginal.pronto : true,
        fechaLimite: `Hoy 18:00`,
        imagen: itemOriginal ? itemOriginal.imagen : 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500',
        reservadoPor: null
    });

    if (itemOriginal) inventario = inventario.filter(i => i.id !== idDespensa);
    guardarEnLocalStorage();
    renderizarDespensa();
    cerrarModalPublicarDonacion();
    alert("🤝 ¡Alimento publicado en la Red Solidaria!");
    abrirDonaciones();
}

function reservarDonacion(idDonacion) {
    const don = redDonaciones.find(d => d.id === idDonacion);
    if (!don) return;
    don.reservadoPor = localStorage.getItem(`nowaste_username_${usuarioActual}`) || usuarioActual.split('@')[0];
    guardarEnLocalStorage();
    renderizarRedDonaciones();
    alert(`🎉 ¡Alimento Reservado con éxito!`);
}

function donarAlimentoDirecto(idAlimento) {
    const item = inventario.find(i => i.id === idAlimento);
    if (item) abrirModalPublicarDonacion(item);
}

// ==========================================
// LISTA DE COMPRAS Y DESPENSA
// ==========================================
function renderizarListaCompras() {
    const cont = document.getElementById('contenedor-lista-compras');
    const badge = document.getElementById('badge-compras-count');
    const resumen = document.getElementById('resumen-compras-pendientes');
    if (!cont) return;

    cont.innerHTML = '';
    const pendientes = listaCompras.filter(i => !i.comprado).length;
    if (badge) badge.textContent = pendientes;
    if (resumen) resumen.textContent = `${pendientes} pendientes`;

    if (listaCompras.length === 0) {
        cont.innerHTML = `<p class="text-xs text-slate-400 text-center py-4">Tu lista está vacía.</p>`;
        return;
    }

    listaCompras.forEach(item => {
        cont.innerHTML += `
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border text-xs">
                <label class="flex items-center gap-2 cursor-pointer flex-1">
                    <input type="checkbox" ${item.comprado ? 'checked' : ''} onchange="toggleItemCompra(${item.id})" class="rounded text-emerald-600">
                    <span class="${item.comprado ? 'line-through text-slate-400' : 'text-slate-800 font-semibold'}">${item.nombre}</span>
                </label>
                <div class="flex gap-1">
                    <button type="button" onclick="moverADespensaDesdeCompras(${item.id})" class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded cursor-pointer">+ Despensa</button>
                    <button type="button" onclick="eliminarItemCompra(${item.id})" class="text-red-400 px-1 cursor-pointer"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`;
    });
}

function agregarItemCompra() {
    const input = document.getElementById('input-item-compra');
    const txt = input?.value.trim();
    if (!txt) return;
    listaCompras.unshift({ id: Date.now(), nombre: txt, comprado: false });
    input.value = '';
    guardarEnLocalStorage();
    renderizarListaCompras();
}

function toggleItemCompra(id) {
    const item = listaCompras.find(i => i.id === id);
    if (item) { item.comprado = !item.comprado; guardarEnLocalStorage(); renderizarListaCompras(); }
}

function eliminarItemCompra(id) {
    listaCompras = listaCompras.filter(i => i.id !== id);
    guardarEnLocalStorage();
    renderizarListaCompras();
}

function moverADespensaDesdeCompras(id) {
    const item = listaCompras.find(i => i.id === id);
    if (item) {
        inventario.unshift({ id: Date.now(), nombre: item.nombre, cantidad: '1 unidad', dias: 7, pronto: false, tipo: 'Alacena/Secos', ubicacion: 'Alacena', imagen: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500', diasTotal: 10 });
        listaCompras = listaCompras.filter(i => i.id !== id);
        guardarEnLocalStorage();
        renderizarListaCompras();
        renderizarDespensa();
        alert(`🛒 ¡"${item.nombre}" se movió a tu Despensa!`);
    }
}

function renderizarDespensa() {
    const listaPronto = document.getElementById('lista-pronto');
    const listaFrescos = document.getElementById('lista-frescos');
    const mensajeVacio = document.getElementById('mensaje-vacio');
    if (!listaPronto || !listaFrescos) return;

    listaPronto.innerHTML = '';
    listaFrescos.innerHTML = '';

    const termino = (document.getElementById('input-buscar')?.value || '').toLowerCase().trim();
    let filtrados = inventario.filter(item => {
        const coincideNombre = item.nombre.toLowerCase().includes(termino);
        const coincideEstado = categoriaFiltro === 'todos' || (categoriaFiltro === 'pronto' && item.pronto) || (categoriaFiltro === 'frescos' && !item.pronto);
        const coincideTipo = tipoFiltro === 'todos' || item.tipo === tipoFiltro;
        const coincideUbicacion = ubicacionFiltro === 'todas' || item.ubicacion === ubicacionFiltro;
        return coincideNombre && coincideEstado && coincideTipo && coincideUbicacion;
    });

    if (ordenActual === 'vencimiento') filtrados.sort((a, b) => a.dias - b.dias);
    else if (ordenActual === 'nombre') filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));

    let countPronto = 0, countFrescos = 0;
    filtrados.forEach(item => {
        if (item.pronto) {
            countPronto++;
            listaPronto.innerHTML += `
                <div onclick="abrirDetalleTab(${item.id})" class="bg-red-50/60 border border-red-200 rounded-2xl p-3 flex items-center justify-between shadow-sm cursor-pointer">
                    <div class="flex items-center gap-3">
                        <img src="${item.imagen}" class="w-9 h-9 rounded-xl object-cover">
                        <div>
                            <h4 class="text-xs font-bold text-slate-800">${item.nombre}</h4>
                            <p class="text-[10px] text-red-600 font-semibold">${item.dias === 0 ? 'Vence hoy' : 'Vence en ' + item.dias + ' días'}</p>
                        </div>
                    </div>
                    <div class="flex gap-1">
                        <button onclick="event.stopPropagation(); donarAlimentoDirecto(${item.id})" class="bg-amber-500 text-white text-[10px] font-bold px-2 py-1.5 rounded-xl cursor-pointer">Donar</button>
                    </div>
                </div>`;
        } else {
            countFrescos++;
            listaFrescos.innerHTML += `
                <div onclick="abrirDetalleTab(${item.id})" class="bg-white border rounded-2xl p-2.5 shadow-sm cursor-pointer">
                    <h4 class="text-xs font-bold text-slate-800">${item.nombre}</h4>
                    <p class="text-[9px] text-emerald-600">Vence en ${item.dias} días</p>
                </div>`;
        }
    });

    if (mensajeVacio) mensajeVacio.classList.toggle('hidden', countPronto > 0 || countFrescos > 0);
}

function guardarAlimento() {
    const nom = document.getElementById('input-nombre-alimento')?.value.trim();
    if (!nom) return alert("Ingresa un nombre.");

    const fecha = document.getElementById('input-fecha-alimento')?.value;
    let dias = 3;
    if (fecha) {
        const hoy = new Date(); hoy.setHours(0,0,0,0);
        const destino = new Date(fecha); destino.setHours(0,0,0,0);
        dias = Math.max(0, Math.ceil((destino - hoy) / (1000 * 3600 * 24)));
    }

    inventario.unshift({
        id: Date.now(),
        nombre: nom,
        cantidad: document.getElementById('input-cantidad-alimento')?.value.trim() || '1 unidad',
        dias: dias,
        pronto: dias <= 2,
        tipo: document.getElementById('select-tipo-alimento')?.value || 'Alacena/Secos',
        ubicacion: document.getElementById('select-ubicacion-alimento')?.value || 'Alacena',
        imagen: fotoTemporal || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500'
    });

    guardarEnLocalStorage();
    renderizarDespensa();
    cerrarModalAgregar();
    alert(`🥑 "${nom}" guardado.`);
}

function abrirDetalleTab(id) {
    const item = inventario.find(i => i.id === id);
    if (!item) return;

    alimentoSeleccionadoId = id;
    document.getElementById('tab-detalle-nombre').textContent = item.nombre;
    document.getElementById('tab-detalle-cantidad').textContent = item.cantidad;
    document.getElementById('tab-detalle-dias-restantes').textContent = `${item.dias} días restantes`;
    document.getElementById('tab-detalle-img').src = item.imagen;

    ocultarTodasLasVistas();
    document.getElementById('vista-detalle-alimento')?.classList.remove('hidden');
}

function marcarComoConsumidoTab() {
    if (alimentoSeleccionadoId) {
        inventario = inventario.filter(i => i.id !== alimentoSeleccionadoId);
        guardarEnLocalStorage();
        renderizarDespensa();
    }
    volverADespensa();
}

function donarAlimentoDetalle() {
    if (alimentoSeleccionadoId) donarAlimentoDirecto(alimentoSeleccionadoId);
}

function recetaDesdeDetalle() {
    abrirRecetas();
}

// ==========================================
// AUTENTICACIÓN Y REGISTRO
// ==========================================
function procesarFormulario(e) {
    if (e && e.preventDefault) e.preventDefault();

    if (modoModal === 'login') {
        const email = document.getElementById('input-login-email')?.value.trim().toLowerCase() || '';
        const pass = document.getElementById('pass-login')?.value.trim() || '';

        if (!email || !pass) {
            alert("⚠️ Ingresa correo y contraseña.");
            return false;
        }

        if (usuariosRegistrados[email] && usuariosRegistrados[email].pass !== pass) {
            alert("❌ Contraseña incorrecta.");
            return false;
        }

        if (!usuariosRegistrados[email]) {
            usuariosRegistrados[email] = { pass: pass, nombre: email.split('@')[0], tipo: 'hogar' };
        }

        usuarioActual = email;
    } else {
        const nombre = document.getElementById('input-reg-nombre')?.value.trim() || '';
        const emailReg = document.querySelectorAll('#campos-registro input[type="email"]')[0]?.value.trim().toLowerCase() || '';
        const pass1 = document.getElementById('pass-reg1')?.value.trim() || '';
        const pass2 = document.getElementById('pass-reg2')?.value.trim() || '';

        if (!nombre || !emailReg || !pass1) {
            alert("⚠️ Completa todos los campos.");
            return false;
        }
        if (pass1 !== pass2) {
            alert("❌ Las contraseñas no coinciden.");
            return false;
        }

        usuariosRegistrados[emailReg] = { pass: pass1, nombre: nombre, tipo: document.getElementById('perfil-tipo-input')?.value || 'hogar' };
        usuarioActual = emailReg;
        localStorage.setItem(`nowaste_username_${usuarioActual}`, nombre);
    }

    localStorage.setItem('nowaste_usuario_activo', usuarioActual);
    localStorage.setItem('nowaste_autenticado', 'true');
    guardarEnLocalStorage();
    cerrarLogin();

    ejecutarPantallaDeCarga(() => {
        cargarDatosUsuario();
        mostrarDespensa();
        renderizarDespensa();
        renderizarListaCompras();
    });

    return false;
}

function abrirModalSocial(red) {
    redSocialSeleccionada = red;
    document.getElementById('modal-social')?.classList.remove('hidden');
}

function cerrarModalSocial() { document.getElementById('modal-social')?.classList.add('hidden'); }

function actualizarUsuarioDesdeSelect() {}

function confirmarLoginSocial() {
    usuarioActual = "usuario.social@gmail.com";
    localStorage.setItem('nowaste_usuario_activo', usuarioActual);
    localStorage.setItem(`nowaste_username_${usuarioActual}`, "Usuario Social");
    localStorage.setItem('nowaste_autenticado', 'true');
    cerrarModalSocial();
    ejecutarPantallaDeCarga(() => {
        cargarDatosUsuario();
        mostrarDespensa();
    });
}

function cerrarSesion() {
    localStorage.removeItem('nowaste_autenticado');
    localStorage.removeItem('nowaste_usuario_activo');
    ocultarTodasLasVistas();
    document.getElementById('vista-auth')?.classList.remove('hidden');
}

// ==========================================
// VISTAS Y NAVEGACIÓN
// ==========================================
function ocultarTodasLasVistas() {
    document.getElementById('vista-auth')?.classList.add('hidden');
    document.getElementById('vista-despensa')?.classList.add('hidden');
    document.getElementById('vista-detalle-alimento')?.classList.add('hidden');
    document.getElementById('vista-lista-compras')?.classList.add('hidden');
    document.getElementById('vista-recetas')?.classList.add('hidden');
    document.getElementById('vista-donaciones')?.classList.add('hidden');
    document.getElementById('vista-comunidades')?.classList.add('hidden');
    document.getElementById('vista-perfil')?.classList.add('hidden');
}

function mostrarDespensa() {
    ocultarTodasLasVistas();
    document.getElementById('vista-despensa')?.classList.remove('hidden');
}

function volverADespensa() { mostrarDespensa(); }

function abrirDonaciones() {
    ocultarTodasLasVistas();
    document.getElementById('vista-donaciones')?.classList.remove('hidden');
    cargarRedDonacionesGlobales();
    renderizarRedDonaciones();
    renderizarPuntosRecoleccion();
}

function abrirComunidades() {
    ocultarTodasLasVistas();
    document.getElementById('vista-comunidades')?.classList.remove('hidden');
    cargarPublicacionesComunidadGlobales();
    renderizarNoticiasTiempoReal();
    renderizarPublicacionesComunidad();
    renderizarListaPerfiles();
    renderizarPanelChatsYAmigos();
}

function abrirRecetas() {
    ocultarTodasLasVistas();
    document.getElementById('vista-recetas')?.classList.remove('hidden');
    generarRecetasDinamicas();
}

function abrirListaCompras() {
    ocultarTodasLasVistas();
    document.getElementById('vista-lista-compras')?.classList.remove('hidden');
}

function ejecutarPantallaDeCarga(callback) {
    const loader = document.getElementById('pantalla-carga');
    if (loader) {
        loader.classList.remove('hidden');
        setTimeout(() => { loader.classList.add('hidden'); if (callback) callback(); }, 1200);
    } else if (callback) callback();
}

function activarNotificacionesPush() { alert("🔔 Notificaciones activadas."); }

// ==========================================
// RECETAS Y FILTROS
// ==========================================
function generarRecetasDinamicas() {
    const contenedor = document.getElementById('contenedor-recetas');
    const chipsCont = document.getElementById('chips-despensa-recetas');
    if (!contenedor) return;

    contenedor.innerHTML = '';
    if (chipsCont) chipsCont.innerHTML = '';

    if (inventario.length === 0) {
        contenedor.innerHTML = `<div class="text-center py-8 text-slate-400 text-xs">Agrega alimentos para sugerir recetas.</div>`;
        return;
    }

    inventario.forEach(i => {
        if (chipsCont) chipsCont.innerHTML += `<span class="bg-emerald-50 border text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">${i.nombre}</span>`;
    });

    let recetasGeneradas = [];
    inventario.forEach(item => {
        plantillasRecetas.forEach(plantilla => {
            recetasGeneradas.push({
                id: `${item.id}-${plantilla.idTipo}`,
                titulo: `${plantilla.nombreBase} ${item.nombre}`,
                ingredienteEstrella: item.nombre,
                itemOriginalId: item.id,
                imagen: item.imagen || plantilla.imagenDefault,
                tiempo: plantilla.tiempo,
                dificultad: plantilla.dificultad,
                pasos: plantilla.pasosTemplate(item.nombre)
            });
        });
    });

    recetasGeneradas.forEach(receta => {
        contenedor.innerHTML += `
            <div class="bg-white border rounded-2xl p-3 shadow-sm flex flex-col gap-2">
                <div class="flex gap-3 items-center">
                    <img src="${receta.imagen}" class="w-16 h-16 rounded-xl object-cover">
                    <div class="flex-1"><h4 class="text-xs font-bold text-slate-800">${receta.titulo}</h4><p class="text-[10px] text-slate-500">Principal: <b class="text-emerald-700">${receta.ingredienteEstrella}</b></p></div>
                </div>
                <button type="button" onclick="verPasosRecetaDinamica('${receta.id}')" class="w-full bg-slate-100 text-emerald-800 font-bold text-[11px] py-1.5 rounded-xl cursor-pointer">Ver Preparación</button>
            </div>`;
    });
    window.recetasGeneradasCache = recetasGeneradas;
}

function verPasosRecetaDinamica(idReceta) {
    const receta = window.recetasGeneradasCache?.find(r => r.id === idReceta);
    if (!receta) return;

    document.getElementById('modal-receta-img').src = receta.imagen;
    document.getElementById('modal-receta-titulo').textContent = receta.titulo;
    document.getElementById('modal-receta-meta').innerHTML = `⏱️ ${receta.tiempo} | 📊 ${receta.dificultad}`;
    document.getElementById('modal-receta-ingredientes').innerHTML = `<li class="text-emerald-700 font-semibold">✓ ${receta.ingredienteEstrella}</li>`;

    const pasosList = document.getElementById('modal-receta-pasos');
    pasosList.innerHTML = '';
    receta.pasos.forEach(p => { pasosList.innerHTML += `<li>${p}</li>`; });

    document.getElementById('btn-cocinar-receta').onclick = () => {
        inventario = inventario.filter(i => i.id !== receta.itemOriginalId);
        guardarEnLocalStorage();
        renderizarDespensa();
        cerrarModalReceta();
        volverADespensa();
    };

    document.getElementById('modal-receta-detalle').classList.remove('hidden');
}

function cerrarModalReceta() { document.getElementById('modal-receta-detalle').classList.add('hidden'); }
function abrirModalFiltros() { document.getElementById('modal-filtros')?.classList.remove('hidden'); }
function cerrarModalFiltros() { document.getElementById('modal-filtros')?.classList.add('hidden'); }
function cambiarOrden(o) { ordenActual = o; renderizarDespensa(); }

function abrirModal(modo) {
    modoModal = modo || 'login';
    document.getElementById('modal-login')?.classList.remove('hidden');
    actualizarModalUI();
}

function abrirLogin() { abrirModal('login'); }
function abrirRegistro() { abrirModal('registro'); }
function cerrarLogin() { document.getElementById('modal-login')?.classList.add('hidden'); }
function cambiarModoModal(modo) { modoModal = modo; actualizarModalUI(); }

function actualizarModalUI() {
    const titulo = document.getElementById('modal-titulo');
    const camposLogin = document.getElementById('campos-login');
    const camposRegistro = document.getElementById('campos-registro');
    const btnSubmit = document.getElementById('btn-submit-modal');
    if (!titulo || !camposLogin || !camposRegistro) return;

    if (modoModal === 'login') {
        titulo.textContent = 'Iniciar Sesión';
        camposLogin.classList.remove('hidden');
        camposRegistro.classList.add('hidden');
        if (btnSubmit) btnSubmit.textContent = 'Iniciar sesión';
    } else {
        titulo.textContent = 'Crear Cuenta';
        camposLogin.classList.add('hidden');
        camposRegistro.classList.remove('hidden');
        if (btnSubmit) btnSubmit.textContent = 'Registrarse';
    }
}

function togglePassword(inputId, iconId) {
    const passInput = document.getElementById(inputId);
    const passIcon = document.getElementById(iconId);
    if (passInput && passIcon) {
        passInput.type = passInput.type === 'password' ? 'text' : 'password';
        passIcon.className = passInput.type === 'password' ? 'fa-solid fa-eye text-slate-400 text-xs' : 'fa-solid fa-eye-slash text-slate-400 text-xs';
    }
}

function seleccionarPerfil(tipo) {
    const inputPerfil = document.getElementById('perfil-tipo-input');
    if (inputPerfil) inputPerfil.value = tipo;
}

function abrirModalAgregar() { document.getElementById('modal-agregar')?.classList.remove('hidden'); }
function cerrarModalAgregar() { document.getElementById('modal-agregar')?.classList.add('hidden'); }

function filtrarTipo(tipo) {
    tipoFiltro = tipo;
    renderizarDespensa();
}

function filtrarUbicacion(ub) {
    ubicacionFiltro = ub;
    renderizarDespensa();
}

function filtrarCategoria(cat) {
    categoriaFiltro = cat;
    renderizarDespensa();
}

function previsualizarFoto(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            fotoTemporal = evt.target.result;
            const imgPreview = document.getElementById('preview-foto');
            const placeholder = document.getElementById('placeholder-foto');
            if (imgPreview && placeholder) {
                imgPreview.src = fotoTemporal;
                imgPreview.classList.remove('hidden');
                placeholder.classList.add('hidden');
            }
        };
        reader.readAsDataURL(file);
    }
}

function obtenerUbicacion() { alert("Ubicación GPS activada."); }
