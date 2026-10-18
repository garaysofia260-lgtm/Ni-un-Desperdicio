// ==========================================
// VARIABLES GLOBALES Y ESTADO DE SESIÓN
// ==========================================
let modoModal = 'login';
let fotoTemporal = null;
let alimentoSeleccionadoId = null;
let usuarioActual = 'mi_cuenta@nowaste.com';
let redSocialSeleccionada = 'Google';

// Filtros Despensa
let categoriaFiltro = 'todos';
let tipoFiltro = 'todos';
let ubicacionFiltro = 'todas';
let ordenActual = 'vencimiento';

// Filtros Donaciones
let donacionSubtab = 'red';
let donacionFiltro = 'cerca';

// Base de datos de cuentas registradas localmente
let usuariosRegistrados = JSON.parse(localStorage.getItem('nowaste_usuarios_db')) || {
    'usuario.demo@gmail.com': { pass: '123456', nombre: 'Usuario Demo', tipo: 'hogar' },
    'sofia@nowaste.com': { pass: '123456', nombre: 'Sofia', tipo: 'hogar' },
    'mcdonalds@comercio.com': { pass: '123456', nombre: 'McDonald\'s Centro', tipo: 'comercio' },
    'fundacion@esperanza.org': { pass: '123456', nombre: 'Fundación San José', tipo: 'fundacion' }
};

// DATOS BASE PREDETERMINADOS PARA LA RED DE DONACIONES
const donacionesBaseDefault = [
    {
        id: 201,
        donante: '@maria_gomez',
        tipoDonante: 'hogar',
        nombre: 'Pan Artesanal de Masa Madre',
        cantidad: '2 barras',
        ubicacion: 'A 300m (Barrio Centro)',
        urgente: true,
        dias: 0,
        fechaLimite: 'Hoy hasta las 19:00',
        imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
        reservadoPor: null
    },
    {
        id: 202,
        donante: 'McDonald\'s Centro',
        tipoDonante: 'comercio',
        nombre: 'Hamburguesas con Queso (Excedente diario)',
        cantidad: '12 unidades',
        ubicacion: 'A 500m (Sucursal Calle 50)',
        urgente: true,
        dias: 0,
        fechaLimite: 'Hoy hasta las 22:30',
        imagen: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
        reservadoPor: null
    }
];

const inventarioDefault = [
    { 
        id: 1, 
        nombre: 'Plátanos Maduros', 
        cantidad: '4 unidades', 
        dias: 0, 
        pronto: true, 
        tipo: 'Frutas y Verduras',
        ubicacion: 'Alacena',
        imagen: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500', 
        diasTotal: 7 
    },
    { 
        id: 2, 
        nombre: 'Leche Entera', 
        cantidad: '1 Litro', 
        dias: 2, 
        pronto: true, 
        tipo: 'Lácteos',
        ubicacion: 'Refrigerador',
        imagen: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500', 
        diasTotal: 10 
    }
];

const listaComprasDefault = [
    { id: 101, nombre: 'Huevos docena', comprado: false },
    { id: 102, nombre: 'Queso Parmesano', comprado: false }
];

const puntosRecoleccionDefault = [
    {
        id: 301,
        nombre: 'Banco de Alimentos Central',
        tipo: 'Comedor y Banco Social',
        direccion: 'Calle 45 # 12-34',
        horario: '8:00 AM - 5:00 PM',
        estado: 'Abierto ahora',
        aceptacion: 'Acepta refrigerados y no perecederos',
        necesidadUrgente: '🍞 Buscando pan y cereales',
        distancia: '1.2 km'
    }
];

let inventario = [];
let listaCompras = [];
let redDonaciones = [];

// PLANTILLAS DE RECETAS
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
    if (sesionGuardada) {
        usuarioActual = sesionGuardada;
    }

    const usernameGuardado = localStorage.getItem(`nowaste_username_${usuarioActual}`);
    const saludo = document.getElementById('saludo-usuario');
    
    if (saludo) {
        if (usernameGuardado) {
            saludo.textContent = `¡Hola, ${usernameGuardado}! 👋`;
        } else {
            saludo.textContent = `¡Hola, ${usuarioActual.split('@')[0]}! 👋`;
        }
    }

    const despensaGuardada = localStorage.getItem(`nowaste_despensa_${usuarioActual}`);
    if (despensaGuardada !== null) {
        try { inventario = JSON.parse(despensaGuardada); } catch (e) { inventario = []; }
    } else {
        inventario = JSON.parse(JSON.stringify(inventarioDefault));
    }

    const comprasGuardadas = localStorage.getItem(`nowaste_compras_${usuarioActual}`);
    if (comprasGuardadas !== null) {
        try { listaCompras = JSON.parse(comprasGuardadas); } catch (e) { listaCompras = []; }
    } else {
        listaCompras = JSON.parse(JSON.stringify(listaComprasDefault));
    }

    cargarRedDonacionesGlobales();
    guardarEnLocalStorage();
}

function cargarRedDonacionesGlobales() {
    const donacionesGuardadas = localStorage.getItem(`nowaste_donaciones_red`);
    if (donacionesGuardadas) {
        try { redDonaciones = JSON.parse(donacionesGuardadas); } catch (e) { redDonaciones = []; }
    } else {
        redDonaciones = JSON.parse(JSON.stringify(donacionesBaseDefault));
    }
}

function guardarEnLocalStorage() {
    try {
        if (usuarioActual) {
            localStorage.setItem(`nowaste_despensa_${usuarioActual}`, JSON.stringify(inventario));
            localStorage.setItem(`nowaste_compras_${usuarioActual}`, JSON.stringify(listaCompras));
        }
        localStorage.setItem(`nowaste_donaciones_red`, JSON.stringify(redDonaciones));
        localStorage.setItem('nowaste_usuarios_db', JSON.stringify(usuariosRegistrados));
    } catch (e) {
        console.warn("Límite de almacenamiento alcanzado", e);
    }
}

// ESCUCHADOR EN TIEMPO REAL: Si otra pestaña/cuenta dona o reserva, se actualiza al instante
window.addEventListener('storage', (event) => {
    if (event.key === 'nowaste_donaciones_red') {
        cargarRedDonacionesGlobales();
        renderizarRedDonaciones();
    }
});

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
});

// ==========================================
// RED SOLIDARIA Y BÚSQUEDA DE DONACIONES
// ==========================================
function renderizarRedDonaciones() {
    const cont = document.getElementById('contenedor-red-donaciones');
    if (!cont) return;

    cont.innerHTML = '';

    const busqueda = (document.getElementById('input-buscar-donaciones')?.value || '').toLowerCase().trim();

    let filtrados = redDonaciones.filter(item => {
        const coincideBusqueda = item.nombre.toLowerCase().includes(busqueda) ||
                                item.donante.toLowerCase().includes(busqueda) ||
                                item.ubicacion.toLowerCase().includes(busqueda);

        const coincideUrgencia = donacionFiltro === 'urgente' ? item.urgente : true;

        return coincideBusqueda && coincideUrgencia;
    });

    if (filtrados.length === 0) {
        cont.innerHTML = `
            <div class="text-center py-8 text-xs text-slate-400">
                <i class="fa-solid fa-box-open text-2xl mb-1 block"></i>
                No se encontraron alimentos o donantes que coincidan con "${busqueda}".
            </div>`;
        return;
    }

    const miUsername = localStorage.getItem(`nowaste_username_${usuarioActual}`) || usuarioActual.split('@')[0];

    filtrados.forEach(item => {
        const esReservado = item.reservadoPor !== null;
        const reservadoPorMi = item.reservadoPor === miUsername;

        let badgeDonante = `<b class="text-emerald-700">${item.donante}</b>`;
        if (item.tipoDonante === 'comercio') {
            badgeDonante = `<span class="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border border-amber-200">🏬 ${item.donante}</span>`;
        } else if (item.tipoDonante === 'fundacion') {
            badgeDonante = `<span class="bg-purple-100 text-purple-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border border-purple-200">🏛️ ${item.donante}</span>`;
        }

        cont.innerHTML += `
            <div class="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm space-y-2">
                <div class="flex gap-3 items-center">
                    <img src="${item.imagen}" class="w-14 h-14 rounded-xl object-cover shadow-xs">
                    <div class="flex-1">
                        <div class="flex justify-between items-start gap-1">
                            <h4 class="text-xs font-bold text-slate-800">${item.nombre}</h4>
                            ${item.urgente ? '<span class="bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0">🔴 Urgente</span>' : ''}
                        </div>
                        <p class="text-[10px] text-slate-500 mt-0.5">Donado por ${badgeDonante} • ${item.cantidad}</p>
                        <p class="text-[9px] text-slate-400 mt-0.5">📍 ${item.ubicacion}</p>
                    </div>
                </div>

                <div class="bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200/60 flex justify-between items-center text-[10px] text-amber-900 font-semibold">
                    <span>⏰ Límite: ${item.fechaLimite}</span>
                    <span class="text-[9px] ${esReservado ? 'bg-slate-200 text-slate-700' : 'bg-emerald-200 text-emerald-900'} px-1.5 py-0.2 rounded font-bold">
                        ${esReservado ? 'Reservado' : 'Disponible'}
                    </span>
                </div>

                ${esReservado ? `
                    <button type="button" disabled class="w-full bg-slate-100 text-slate-500 text-xs font-bold py-2 rounded-xl border border-slate-200 cursor-not-allowed flex items-center justify-center gap-1.5">
                        <i class="fa-solid fa-lock text-slate-400"></i> ${reservadoPorMi ? '✅ Apartado por ti' : 'Reservado por ' + item.reservadoPor}
                    </button>
                ` : `
                    <button type="button" onclick="reservarDonacion(${item.id})" class="w-full btn-green text-white text-xs font-bold py-2 rounded-xl shadow-xs transition active:scale-98 cursor-pointer flex items-center justify-center gap-1.5">
                        <i class="fa-solid fa-handshake"></i> Solicitar / Reservar Alimento
                    </button>
                `}
            </div>
        `;
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
        btnPuntos.className = "flex-1 py-1.5 rounded-xl text-emerald-100 hover:text-white transition cursor-pointer";
        contRed.classList.remove('hidden');
        contPuntos.classList.add('hidden');
    } else {
        btnPuntos.className = "flex-1 py-1.5 rounded-xl bg-white text-emerald-900 shadow-sm transition cursor-pointer";
        btnRed.className = "flex-1 py-1.5 rounded-xl text-emerald-100 hover:text-white transition cursor-pointer";
        contPuntos.classList.remove('hidden');
        contRed.classList.add('hidden');
