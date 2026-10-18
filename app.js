// ==========================================
// VARIABLES GLOBALES Y ESTADO DE SESIÓN
// ==========================================
let modoModal = 'login';
let fotoTemporal = null;
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
let categoriaPuntosFijos = 'todos';

// Base de datos de cuentas registradas localmente
let usuariosRegistrados = JSON.parse(localStorage.getItem('nowaste_usuarios_db')) || {
    'usuario.demo@gmail.com': { pass: '123456', nombre: 'Usuario Demo', tipo: 'hogar' },
    'sofia@nowaste.com': { pass: '123456', nombre: 'Sofia', tipo: 'hogar' },
    'mcdonalds@comercio.com': { pass: '123456', nombre: 'McDonald\'s Centro', tipo: 'comercio' },
    'fundacion@esperanza.org': { pass: '123456', nombre: 'Fundación San José', tipo: 'fundacion' }
};

// DATOS BASE PREDETERMINADOS DE DONACIONES
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

// LISTA DE PUNTOS FIJOS OFICIALES CON UBICACIÓN GPS
let puntosRecoleccionList = [
    {
        id: 301,
        nombre: 'Banco de Alimentos Central',
        tipoClave: 'banco',
        tipo: '📦 Banco de Alimentos',
        direccion: 'Calle Principal # 45-12',
        lat: 4.6097,
        lon: -74.0817,
        horario: '8:00 AM - 5:00 PM',
        estado: 'Abierto ahora',
        aceptacion: 'Acepta refrigerados y no perecederos',
        necesidadUrgente: '🍞 Buscando pan y cereales',
        distancia: 'Calculando GPS...'
    },
    {
        id: 302,
        nombre: 'Fundación Nutriendo Esperanza',
        tipoClave: 'fundacion',
        tipo: '🏛️ Fundación de Comida',
        direccion: 'Carrera 15 # 28-40',
        lat: 4.6200,
        lon: -74.0700,
        horario: '9:00 AM - 6:00 PM',
        estado: 'Abierto ahora',
        aceptacion: 'Acepta frutas, verduras y lácteos',
        necesidadUrgente: '🍎 Requiere frutas frescas hoy',
        distancia: 'Calculando GPS...'
    },
    {
        id: 303,
        nombre: 'Comedor Social San Francisco',
        tipoClave: 'comedor',
        tipo: '🍲 Comedor Social',
        direccion: 'Avenida Bolivar # 10-05',
        lat: 4.6000,
        lon: -74.0900,
        horario: '11:00 AM - 3:00 PM',
        estado: 'Abierto ahora',
        aceptacion: 'Acepta platillos cocinados y secos',
        necesidadUrgente: '🍲 Necesita arroz y legumbres',
        distancia: 'Calculando GPS...'
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

// ESCUCHADOR EN TIEMPO REAL
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
// PUNTOS FIJOS GPS (FUNDACIONES, BANCOS Y COMEDORES)
// ==========================================
function obtenerPuntosRecoleccionGPS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                miLatitud = pos.coords.latitude;
                miLongitud = pos.coords.longitude;

                // Calcular distancia real a cada punto
                puntosRecoleccionList.forEach(p => {
                    const dist = calcularDistanciaHaversine(miLatitud, miLongitud, p.lat, p.lon);
                    p.distancia = `${dist.toFixed(1)} km`;
                });

                // Ordenar por cercanía
                puntosRecoleccionList.sort((a, b) => parseFloat(a.distancia) - parseFloat(b.distancia));
                renderizarPuntosRecoleccion();
            },
            () => {
                alert("Por favor habilita el GPS en tu navegador para ver la distancia real.");
            }
        );
    }
}

function calcularDistanciaHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function filtrarPuntosFijos(cat) {
    categoriaPuntosFijos = cat;
    
    ['todos', 'fundacion', 'banco', 'comedor'].forEach(c => {
        const btn = document.getElementById(`btn-puntos-cat-${c}`);
        if (btn) {
            if (c === cat) {
                btn.className = "px-2.5 py-1 rounded-xl bg-[#3b630b] text-white font-bold whitespace-nowrap cursor-pointer";
            } else {
                btn.className = "px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold whitespace-nowrap cursor-pointer";
            }
        }
    });

    renderizarPuntosRecoleccion();
}

function renderizarPuntosRecoleccion() {
    const cont = document.getElementById('contenedor-puntos-recoleccion');
    if (!cont) return;

    cont.innerHTML = '';

    let filtrados = puntosRecoleccionList.filter(p => {
        return categoriaPuntosFijos === 'todos' || p.tipoClave === categoriaPuntosFijos;
    });

    if (filtrados.length === 0) {
        cont.innerHTML = `<div class="text-center py-8 text-xs text-slate-400">No hay puntos fijos en esta categoría.</div>`;
        return;
    }

    filtrados.forEach(p => {
        const linkMap = miLatitud && miLongitud 
            ? `https://www.google.com/maps/dir/?api=1&origin=${miLatitud},${miLongitud}&destination=${p.lat},${p.lon}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.nombre + ' ' + p.direccion)}`;

        cont.innerHTML += `
            <div class="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm space-y-2">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="text-xs font-bold text-slate-800">${p.nombre}</h4>
                        <p class="text-[10px] text-emerald-700 font-bold">${p.tipo} • 📍 ${p.distancia}</p>
                    </div>
                    <span class="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                        🟢 ${p.estado}
                    </span>
                </div>

                <div class="text-[10px] text-slate-600 space-y-1">
                    <p>📍 <b>Dirección:</b> ${p.direccion}</p>
                    <p>⏰ <b>Horario:</b> ${p.horario}</p>
                    <p class="text-emerald-800 font-semibold">📦 ${p.aceptacion}</p>
                    <p class="text-red-600 font-bold bg-red-50 p-1.5 rounded-lg border border-red-100">${p.necesidadUrgente}</p>
                </div>

                <a href="${linkMap}" target="_blank" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 no-underline">
                    <i class="fa-solid fa-map-location-dot text-emerald-700"></i> Abrir en GPS / Maps
                </a>
            </div>
        `;
    });
}

// ==========================================
// RED SOLIDARIA Y DONACIONES VECINALES
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
        obtenerPuntosRecoleccionGPS();
    }
}

function filtrarDonaciones(filtro) {
    donacionFiltro = filtro;
    const btnCerca = document.getElementById('btn-don-filtro-cerca');
    const btnUrgente = document.getElementById('btn-don-filtro-urgente');

    if (filtro === 'cerca') {
        btnCerca.className = "px-3 py-1 rounded-xl bg-[#3b630b] text-white font-bold text-[10px] shadow-xs cursor-pointer";
        btnUrgente.className = "px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold text-[10px] cursor-pointer";
    } else {
        btnUrgente.className = "px-3 py-1 rounded-xl bg-[#3b630b] text-white font-bold text-[10px] shadow-xs cursor-pointer";
        btnCerca.className = "px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold text-[10px] cursor-pointer";
    }
    renderizarRedDonaciones();
}

function abrirModalPublicarDonacion(itemPreseleccionado = null) {
    const modal = document.getElementById('modal-publicar-donacion');
    const select = document.getElementById('select-donar-despensa');
    if (!modal || !select) return;

    select.innerHTML = '<option value="">-- Seleccionar de mi despensa --</option>';
    
    inventario.forEach(i => {
        select.innerHTML += `<option value="${i.id}">${i.nombre} (${i.cantidad}) - ${i.pronto ? '🔴 Próximo a vencer' : '🟢 Fresco'}</option>`;
    });

    if (itemPreseleccionado) {
        select.value = itemPreseleccionado.id;
        autocompletarDonacionDesdeDespensa();
    } else {
        document.getElementById('input-donar-nombre').value = '';
        document.getElementById('input-donar-cantidad').value = '';
    }

    const hoy = new Date();
    const hoyTxt = hoy.toISOString().split('T')[0];
    const fechaInput = document.getElementById('input-donar-fecha-limite');
    if (fechaInput) fechaInput.value = hoyTxt;

    modal.classList.remove('hidden');
}

function cerrarModalPublicarDonacion() { document.getElementById('modal-publicar-donacion')?.classList.add('hidden'); }

function autocompletarDonacionDesdeDespensa() {
    const select = document.getElementById('select-donar-despensa');
    const idSel = parseInt(select.value);

    const item = inventario.find(i => i.id === idSel);
    if (item) {
        document.getElementById('input-donar-nombre').value = item.nombre;
        document.getElementById('input-donar-cantidad').value = item.cantidad;
        document.getElementById('input-donar-ubicacion').value = `📍 Mi Ubicación (Barrio Centro)`;
    }
}

function confirmarPublicarDonacion() {
    const select = document.getElementById('select-donar-despensa');
    const idDespensa = parseInt(select.value);
    const nombre = document.getElementById('input-donar-nombre')?.value.trim();
    const cantidad = document.getElementById('input-donar-cantidad')?.value.trim();
    const ubicacion = document.getElementById('input-donar-ubicacion')?.value.trim() || 'A 200m de ti';
    const fechaLim = document.getElementById('input-donar-fecha-limite')?.value;
    const horaLim = document.getElementById('input-donar-hora-limite')?.value || '18:00';

    if (!nombre) return alert("Por favor ingresa el nombre del alimento a donar.");

    const miNombre = localStorage.getItem(`nowaste_username_${usuarioActual}`) || usuarioActual.split('@')[0];
    const tipoCuenta = usuariosRegistrados[usuarioActual]?.tipo || 'hogar';

    let itemOriginal = inventario.find(i => i.id === idDespensa);

    const nuevaDonacion = {
        id: Date.now(),
        donante: miNombre,
        tipoDonante: tipoCuenta,
        nombre: nombre,
        cantidad: cantidad || '1 paquete',
        ubicacion: ubicacion,
        urgente: itemOriginal ? itemOriginal.pronto : true,
        dias: itemOriginal ? itemOriginal.dias : 1,
        fechaLimite: `${fechaLim || 'Hoy'} hasta las ${horaLim}`,
        imagen: itemOriginal ? itemOriginal.imagen : 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500',
        reservadoPor: null
    };

    redDonaciones.unshift(nuevaDonacion);

    if (itemOriginal) {
        inventario = inventario.filter(i => i.id !== idDespensa);
    }

    guardarEnLocalStorage();
    renderizarDespensa();
    cerrarModalPublicarDonacion();

    alert(`🤝 ¡Excelente! "${nombre}" publicado en la Red Solidaria.`);
    abrirDonaciones();
}

function reservarDonacion(idDonacion) {
    const don = redDonaciones.find(d => d.id === idDonacion);
    if (!don) return;

    const miUsername = localStorage.getItem(`nowaste_username_${usuarioActual}`) || usuarioActual.split('@')[0];

    don.reservadoPor = miUsername;
    guardarEnLocalStorage();
    renderizarRedDonaciones();

    alert(`🎉 ¡Alimento Reservado!\n\nHas apartado "${don.nombre}" de ${don.donante}.\nRecolección antes de: ${don.fechaLimite}.`);
}

function donarAlimentoDirecto(idAlimento) {
    const item = inventario.find(i => i.id === idAlimento);
    if (!item) return;

    abrirModalPublicarDonacion(item);
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
        cont.innerHTML = `<p class="text-xs text-slate-400 text-center py-4">Tu lista está vacía 🎉</p>`;
        return;
    }

    listaCompras.forEach(item => {
        cont.innerHTML += `
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <label class="flex items-center gap-2.5 cursor-pointer flex-1">
                    <input type="checkbox" ${item.comprado ? 'checked' : ''} onchange="toggleItemCompra(${item.id})" class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer">
                    <span class="${item.comprado ? 'line-through text-slate-400' : 'text-slate-800 font-semibold'} bg-transparent p-0 m-0 border-none outline-none">${item.nombre}</span>
                </label>
                <div class="flex items-center gap-1">
                    <button type="button" onclick="moverADespensaDesdeCompras(${item.id})" title="Pasar a Despensa" class="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-lg transition cursor-pointer">
                        + Despensa
                    </button>
                    <button type="button" onclick="eliminarItemCompra(${item.id})" class="text-red-400 hover:text-red-600 px-1.5 py-1 transition cursor-pointer">
                        <i class="fa-solid fa-trash text-xs"></i>
                    </button>
                </div>
            </div>
        `;
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
    if (item) {
        item.comprado = !item.comprado;
        guardarEnLocalStorage();
        renderizarListaCompras();
    }
}

function eliminarItemCompra(id) {
    listaCompras = listaCompras.filter(i => i.id !== id);
    guardarEnLocalStorage();
    renderizarListaCompras();
}

function moverADespensaDesdeCompras(id) {
    const item = listaCompras.find(i => i.id === id);
    if (item) {
        inventario.unshift({
            id: Date.now(),
            nombre: item.nombre,
            cantidad: '1 unidad',
            dias: 7,
            pronto: false,
            tipo: 'Alacena/Secos',
            ubicacion: 'Alacena',
            imagen: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500',
            diasTotal: 10
        });
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
    const seccionPronto = document.getElementById('seccion-pronto');
    const seccionFrescos = document.getElementById('seccion-frescos');
    const mensajeVacio = document.getElementById('mensaje-vacio');

    if (!listaPronto || !listaFrescos) return;

    listaPronto.innerHTML = '';
    listaFrescos.innerHTML = '';

    const termino = (document.getElementById('input-buscar')?.value || '').toLowerCase().trim();

    let filtrados = inventario.filter(item => {
        const coincideNombre = item.nombre.toLowerCase().includes(termino);
        const coincideEstado = categoriaFiltro === 'todos' || 
                              (categoriaFiltro === 'pronto' && item.pronto) || 
                              (categoriaFiltro === 'frescos' && !item.pronto);
        
        const coincideTipo = tipoFiltro === 'todos' || item.tipo === tipoFiltro;
        const coincideUbicacion = ubicacionFiltro === 'todas' || item.ubicacion === ubicacionFiltro;

        return coincideNombre && coincideEstado && coincideTipo && coincideUbicacion;
    });

    if (ordenActual === 'vencimiento') {
        filtrados.sort((a, b) => a.dias - b.dias);
    } else if (ordenActual === 'nombre') {
        filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    let contadorPronto = 0;
    let contadorFrescos = 0;

    filtrados.forEach(item => {
        if (item.pronto) {
            contadorPronto++;
            listaPronto.innerHTML += `
                <div onclick="abrirDetalleTab(${item.id})" class="bg-red-50/60 border border-red-200 rounded-2xl p-3 flex items-center justify-between shadow-sm cursor-pointer hover:border-red-400 transition">
                    <div class="flex items-center gap-3">
                        <img src="${item.imagen}" class="w-9 h-9 rounded-xl object-cover shadow-xs">
                        <div>
                            <h4 class="text-xs font-bold text-slate-800">${item.nombre}</h4>
                            <p class="text-[10px] text-red-600 font-semibold">${item.dias === 0 ? 'Vence hoy' : 'Vence en ' + item.dias + ' días'} • ${item.cantidad}</p>
                            <span class="text-[9px] bg-white border border-slate-200 px-1.5 py-0.2 rounded text-slate-500 font-medium">📍 ${item.ubicacion}</span>
                        </div>
                    </div>
                    <div class="flex gap-1">
                        <button type="button" onclick="event.stopPropagation(); donarAlimentoDirecto(${item.id})" class="bg-amber-500 text-white text-[10px] font-bold px-2 py-1.5 rounded-xl shadow-sm active:scale-95 transition cursor-pointer">
                            🤝 Donar
                        </button>
                        <button type="button" onclick="event.stopPropagation(); abrirRecetas()" class="bg-red-600 text-white text-[10px] font-bold px-2 py-1.5 rounded-xl shadow-sm active:scale-95 transition cursor-pointer">
                            🍳 Recetas
                        </button>
                    </div>
                </div>
            `;
        } else {
            contadorFrescos++;
            listaFrescos.innerHTML += `
                <div onclick="abrirDetalleTab(${item.id})" class="bg-white border border-slate-200/80 rounded-2xl p-2.5 flex flex-col justify-between shadow-sm cursor-pointer hover:border-emerald-400 transition">
                    <div class="flex items-center gap-2 mb-2">
                        <img src="${item.imagen}" class="w-8 h-8 rounded-lg object-cover shadow-xs">
                        <div>
                            <h4 class="text-xs font-bold text-slate-800">${item.nombre}</h4>
                            <p class="text-[9px] text-emerald-600 font-medium">Vence en ${item.dias} días</p>
                        </div>
                    </div>
                    <div class="flex justify-between items-center text-[9px] text-slate-400">
                        <span>Cant: ${item.cantidad}</span>
                        <span class="bg-slate-100 px-1 rounded text-slate-500">📍 ${item.ubicacion}</span>
                    </div>
                </div>
            `;
        }
    });

    if (seccionPronto) seccionPronto.style.display = (contadorPronto > 0) ? 'block' : 'none';
    if (seccionFrescos) seccionFrescos.style.display = (contadorFrescos > 0) ? 'block' : 'none';

    if (mensajeVacio) {
        if (contadorPronto === 0 && contadorFrescos === 0) {
            mensajeVacio.classList.remove('hidden');
        } else {
            mensajeVacio.classList.add('hidden');
        }
    }
}

function guardarAlimento() {
    const nom = document.getElementById('input-nombre-alimento')?.value.trim();
    const cant = document.getElementById('input-cantidad-alimento')?.value.trim() || '1 unidad';
    const fecha = document.getElementById('input-fecha-alimento')?.value;
    const tipo = document.getElementById('select-tipo-alimento')?.value || 'Alacena/Secos';
    const ub = document.getElementById('select-ubicacion-alimento')?.value || 'Alacena';

    if (!nom) return alert("Por favor ingresa un nombre.");

    let dias = 3;
    if (fecha) {
        const hoy = new Date();
        hoy.setHours(0,0,0,0);
        const destino = new Date(fecha);
        destino.setHours(0,0,0,0);
        dias = Math.max(0, Math.ceil((destino - hoy) / (1000 * 3600 * 24)));
    }

    const nuevo = {
        id: Date.now(),
        nombre: nom,
        cantidad: cant,
        dias: dias,
        pronto: dias <= 2,
        tipo: tipo,
        ubicacion: ub,
        imagen: fotoTemporal || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500',
        diasTotal: Math.max(dias + 2, 7)
    };

    inventario.unshift(nuevo);
    guardarEnLocalStorage();
    
    renderizarDespensa();
    cerrarModalAgregar();

    document.getElementById('input-nombre-alimento').value = '';
    document.getElementById('input-cantidad-alimento').value = '';
    document.getElementById('input-fecha-alimento').value = '';
    fotoTemporal = null;
    document.getElementById('preview-foto')?.classList.add('hidden');
    document.getElementById('placeholder-foto')?.classList.remove('hidden');

    alert(`🥑 "${nom}" guardado con éxito en tu cuenta.`);
}

function abrirDetalleTab(id) {
    const item = inventario.find(i => i.id === id);
    if (!item) return;

    alimentoSeleccionadoId = id;

    document.getElementById('tab-detalle-nombre').textContent = item.nombre;
    document.getElementById('tab-detalle-cantidad').textContent = item.cantidad;
    document.getElementById('tab-detalle-dias-restantes').textContent = `${item.dias} días restantes para vencimiento`;
    document.getElementById('tab-detalle-ubicacion-tag').textContent = `📍 ${item.ubicacion} • ${item.tipo}`;

    const imgEl = document.getElementById('tab-detalle-img');
    if (imgEl) imgEl.src = item.imagen;

    const diasTotal = item.diasTotal || 7;
    let pct = Math.min(100, Math.max(10, Math.round((item.dias / diasTotal) * 100)));
    if (item.dias === 0) pct = 5;

    const barEl = document.getElementById('tab-detalle-bar');
    const pctTxt = document.getElementById('tab-detalle-porcentaje');
    const badgeEl = document.getElementById('tab-detalle-badge');

    if (barEl) barEl.style.width = `${pct}%`;
    if (pctTxt) pctTxt.textContent = `${pct}% Fresco`;

    if (pct > 50) {
        if (barEl) barEl.className = "h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-500 shadow-sm";
        if (badgeEl) { badgeEl.textContent = 'Fresco 🟢'; badgeEl.className = "absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-md bg-emerald-600"; }
    } else {
        if (barEl) barEl.className = "h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500 shadow-sm";
        if (badgeEl) { badgeEl.textContent = '¡Urgente! 🔴'; badgeEl.className = "absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-md bg-red-600"; }
    }

    ocultarTodasLasVistas();
    document.getElementById('vista-detalle-alimento')?.classList.remove('hidden');
}

function marcarComoConsumidoTab() {
    if (alimentoSeleccionadoId) {
        inventario = inventario.filter(i => i.id !== alimentoSeleccionadoId);
        guardarEnLocalStorage();
        renderizarDespensa();
        alert("¡Felicidades! Has evitado el desperdicio de este alimento. 🎉");
    }
    volverADespensa();
}

function donarAlimentoDetalle() {
    if (alimentoSeleccionadoId) {
        donarAlimentoDirecto(alimentoSeleccionadoId);
    }
}

// ==========================================
// AUTENTICACIÓN Y REGISTRO DE USUARIOS
// ==========================================
function procesarFormulario(e) {
    if (e && e.preventDefault) e.preventDefault();

    if (modoModal === 'login') {
        const emailInput = document.getElementById('input-login-email');
        const passInput = document.getElementById('pass-login');

        const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
        const pass = passInput ? passInput.value.trim() : '';

        if (!email || !pass) {
            alert("⚠️ Por favor ingresa tanto tu correo como tu contraseña para iniciar sesión.");
            return false;
        }

        if (usuariosRegistrados[email]) {
            if (usuariosRegistrados[email].pass !== pass) {
                alert("❌ La contraseña ingresada es incorrecta. Inténtalo de nuevo.");
                return false;
            }
        } else {
            usuariosRegistrados[email] = { pass: pass, nombre: email.split('@')[0], tipo: 'hogar' };
        }

        usuarioActual = email;
        localStorage.setItem('nowaste_usuario_activo', usuarioActual);
        localStorage.setItem('nowaste_autenticado', 'true');
        
        if (!localStorage.getItem(`nowaste_username_${usuarioActual}`)) {
            localStorage.setItem(`nowaste_username_${usuarioActual}`, usuariosRegistrados[email].nombre || email.split('@')[0]);
        }

    } else {
        const nombreInput = document.getElementById('input-reg-nombre');
        const emailRegInput = document.querySelectorAll('#campos-registro input[type="email"]')[0];
        const pass1Input = document.getElementById('pass-reg1');
        const pass2Input = document.getElementById('pass-reg2');
        const checkTerminos = document.getElementById('check-terminos');
        const perfilInput = document.getElementById('perfil-tipo-input')?.value || 'hogar';

        const nombre = nombreInput ? nombreInput.value.trim() : '';
        const emailReg = emailRegInput ? emailRegInput.value.trim().toLowerCase() : '';
        const pass1 = pass1Input ? pass1Input.value.trim() : '';
        const pass2 = pass2Input ? pass2Input.value.trim() : '';

        if (!nombre || !emailReg || !pass1 || !pass2) {
            alert("⚠️ Todos los campos son obligatorios para crear tu cuenta.");
            return false;
        }

        if (pass1 !== pass2) {
            alert("❌ Las contraseñas no coinciden. Por favor verifica ambos campos.");
            return false;
        }

        if (checkTerminos && !checkTerminos.checked) {
            alert("⚠️ Debes aceptar los términos y la política ambiental para registrarte.");
            return false;
        }

        usuariosRegistrados[emailReg] = { pass: pass1, nombre: nombre, tipo: perfilInput };
        usuarioActual = emailReg;
        localStorage.setItem('nowaste_usuario_activo', usuarioActual);
        localStorage.setItem(`nowaste_username_${usuarioActual}`, nombre);
        localStorage.setItem('nowaste_autenticado', 'true');
    }

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
    const modal = document.getElementById('modal-social');
    const icon = document.getElementById('social-modal-icon');
    const title = document.getElementById('social-modal-title');
    const select = document.getElementById('select-cuenta-social');

    if (!modal) return;

    if (red === 'Google') {
        if (icon) icon.innerHTML = '<i class="fa-brands fa-google text-red-500"></i>';
        if (title) title.textContent = 'Continuar con Google';
    } else if (red === 'Facebook') {
        if (icon) icon.innerHTML = '<i class="fa-brands fa-facebook text-blue-600"></i>';
        if (title) title.textContent = 'Continuar con Facebook';
    } else {
        if (icon) icon.innerHTML = '<i class="fa-brands fa-apple text-black"></i>';
        if (title) title.textContent = 'Continuar con Apple ID';
    }

    if (select) select.value = select.options[0].value;

    document.getElementById('campo-correo-custom')?.classList.add('hidden');
    actualizarUsuarioDesdeSelect();
    cerrarLogin();
    modal.classList.remove('hidden');
}

function cerrarModalSocial() { document.getElementById('modal-social')?.classList.add('hidden'); }

function actualizarUsuarioDesdeSelect() {
    const select = document.getElementById('select-cuenta-social');
    const campoCustom = document.getElementById('campo-correo-custom');
    const inputUsername = document.getElementById('input-username-social');
    const btnLabel = document.getElementById('btn-user-label');

    if (!select || !inputUsername) return;

    if (select.value === 'nuevo_correo') {
        if (campoCustom) campoCustom.classList.remove('hidden');
        inputUsername.value = 'nuevo_usuario';
    } else {
        if (campoCustom) campoCustom.classList.add('hidden');
        const prefijo = select.value.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
        inputUsername.value = prefijo;
    }

    if (btnLabel) btnLabel.textContent = `@${inputUsername.value}`;
}

function confirmarLoginSocial() {
    const select = document.getElementById('select-cuenta-social');
    const customEmail = document.getElementById('input-correo-social-custom')?.value.trim();
    const username = document.getElementById('input-username-social')?.value.trim() || 'usuario';

    let emailFinal = select.value;
    if (emailFinal === 'nuevo_correo') {
        if (!customEmail) {
            alert("⚠️ Por favor ingresa un correo electrónico válido.");
            return;
        }
        emailFinal = customEmail;
    }

    usuarioActual = emailFinal;
    localStorage.setItem('nowaste_usuario_activo', usuarioActual);
    localStorage.setItem(`nowaste_username_${usuarioActual}`, username);
    localStorage.setItem('nowaste_autenticado', 'true');

    if (!usuariosRegistrados[usuarioActual]) {
        usuariosRegistrados[usuarioActual] = { pass: 'social_login', nombre: username, tipo: 'hogar' };
    }

    guardarEnLocalStorage();
    cerrarModalSocial();

    ejecutarPantallaDeCarga(() => {
        cargarDatosUsuario();
        mostrarDespensa();
        renderizarDespensa();
        renderizarListaCompras();
    });
}

function cerrarSesion() {
    localStorage.removeItem('nowaste_autenticado');
    localStorage.removeItem('nowaste_usuario_activo');

    inventario = [];
    listaCompras = [];
    usuarioActual = '';

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
        setTimeout(() => {
            loader.classList.add('hidden');
            if (callback) callback();
        }, 1500);
    } else {
        if (callback) callback();
    }
}

function activarNotificacionesPush() {
    const icono = document.getElementById('icono-notificacion');

    if (!('Notification' in window)) {
        alert("🔔 Las notificaciones push no están soportadas en este navegador.");
        return;
    }

    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            if (icono) icono.className = "fa-solid fa-bell text-amber-300 animate-bounce";
            
            const porVencer = inventario.filter(i => i.dias <= 2);
            
            if (porVencer.length > 0) {
                porVencer.forEach(item => {
                    new Notification("⚠️ ¡Insumo Próximo a Vencer!", {
                        body: `Tu alimento "${item.nombre}" vence en ${item.dias === 0 ? 'hoy' : item.dias + ' días'}. ¡Aprovéchalo en tus recetas!`,
                        icon: item.imagen
                    });
                });
                alert(`🔔 ¡Notificaciones activadas! Tienes ${porVencer.length} alimento(s) por vencer pronto.`);
            } else {
                alert("🔔 ¡Notificaciones activadas correctamente!");
            }
        } else {
            alert("⚠️ No permitiste las notificaciones en tu navegador.");
        }
    });
}

// ==========================================
// RECETAS Y UTILIDADES
// ==========================================
function generarRecetasDinamicas() {
    const contenedor = document.getElementById('contenedor-recetas');
    const chipsCont = document.getElementById('chips-despensa-recetas');
    if (!contenedor) return;

    contenedor.innerHTML = '';
    if (chipsCont) chipsCont.innerHTML = '';

    if (inventario.length === 0) {
        if (chipsCont) chipsCont.innerHTML = `<span class="text-xs text-slate-400 italic">No hay ingredientes en tu despensa.</span>`;
        contenedor.innerHTML = `<div class="text-center py-8 text-slate-400 text-xs">Agrega alimentos en tu despensa para sugerir recetas.</div>`;
        return;
    }

    inventario.forEach(i => {
        if (chipsCont) {
            chipsCont.innerHTML += `
                <span class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    ${i.pronto ? '🔴' : '🟢'} ${i.nombre}
                </span>
            `;
        }
    });

    let recetasGeneradas = [];

    inventario.forEach(item => {
        plantillasRecetas.forEach(plantilla => {
            if (plantilla.aplicableA.includes(item.tipo) || plantilla.aplicableA.includes('Frutas y Verduras')) {
                recetasGeneradas.push({
                    id: `${item.id}-${plantilla.idTipo}`,
                    titulo: `${plantilla.nombreBase} ${item.nombre}`,
                    ingredienteEstrella: item.nombre,
                    itemOriginalId: item.id,
                    imagen: item.imagen || plantilla.imagenDefault,
                    tiempo: plantilla.tiempo,
                    dificultad: plantilla.dificultad,
                    esUrgente: item.pronto,
                    diasRestantes: item.dias,
                    pasos: plantilla.pasosTemplate(item.nombre)
                });
            }
        });
    });

    recetasGeneradas.forEach(receta => {
        contenedor.innerHTML += `
            <div class="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm flex flex-col gap-2">
                <div class="flex gap-3 items-center">
                    <img src="${receta.imagen}" class="w-16 h-16 rounded-xl object-cover shadow-xs">
                    <div class="flex-1">
                        <h4 class="text-xs font-bold text-slate-800">${receta.titulo}</h4>
                        <p class="text-[10px] text-slate-500 mt-0.5">Ingrediente: <b class="text-emerald-700">${receta.ingredienteEstrella}</b></p>
                    </div>
                </div>
                <button type="button" onclick="verPasosRecetaDinamica('${receta.id}')" class="w-full bg-slate-100 hover:bg-emerald-50 text-emerald-800 font-bold text-[11px] py-1.5 rounded-xl transition cursor-pointer">
                    Ver Preparación
                </button>
            </div>
        `;
    });

    window.recetasGeneradasCache = recetasGeneradas;
}

function verPasosRecetaDinamica(idReceta) {
    const receta = window.recetasGeneradasCache?.find(r => r.id === idReceta);
    if (!receta) return;

    document.getElementById('modal-receta-img').src = receta.imagen;
    document.getElementById('modal-receta-titulo').textContent = receta.titulo;
    document.getElementById('modal-receta-meta').innerHTML = `⏱️ Tiempo: ${receta.tiempo} | 📊 Dificultad: ${receta.dificultad}`;

    const ingList = document.getElementById('modal-receta-ingredientes');
    ingList.innerHTML = `<li class="text-emerald-700 font-semibold">✓ ${receta.ingredienteEstrella}</li>`;

    const pasosList = document.getElementById('modal-receta-pasos');
    pasosList.innerHTML = '';
    receta.pasos.forEach(p => { pasosList.innerHTML += `<li>${p}</li>`; });

    const btnCocinar = document.getElementById('btn-cocinar-receta');
    btnCocinar.onclick = () => {
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
function cambiarOrden(orden) { ordenActual = orden; renderizarDespensa(); }

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

function togglePassword(inputId, iconId) {
    const passInput = document.getElementById(inputId);
    const passIcon = document.getElementById(iconId);
    if (passInput && passIcon) {
        passInput.type = passInput.type === 'password' ? 'text' : 'password';
        passIcon.className = passInput.type === 'password' ? 'fa-solid fa-eye text-slate-400 text-xs' : 'fa-solid fa-eye-slash text-slate-400 text-xs';
    }
}

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

function abrirModalAgregar() { document.getElementById('modal-agregar')?.classList.remove('hidden'); }
function cerrarModalAgregar() { document.getElementById('modal-agregar')?.classList.add('hidden'); }

function filtrarTipo(tipo) {
    tipoFiltro = tipo;
    const botones = document.querySelectorAll('#contenedor-filtros-tipo .btn-tipo');
    botones.forEach(b => {
        const valAttr = b.getAttribute('data-tipo');
        if (valAttr === tipo) {
            b.className = "btn-tipo px-2.5 py-1 rounded-lg bg-[#3b630b] font-bold text-white whitespace-nowrap shadow-xs cursor-pointer";
        } else {
            b.className = "btn-tipo px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 whitespace-nowrap cursor-pointer";
        }
    });
    renderizarDespensa();
}

function filtrarUbicacion(ub) {
    ubicacionFiltro = ub;
    const botones = document.querySelectorAll('#contenedor-filtros-ubicacion .btn-ubicacion');
    botones.forEach(b => {
        const valAttr = b.getAttribute('data-ub');
        if (valAttr === ub) {
            b.className = "btn-ubicacion px-2.5 py-1 rounded-lg bg-[#3b630b] font-bold text-white shadow-xs cursor-pointer";
        } else {
            b.className = "btn-ubicacion px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 cursor-pointer";
        }
    });
    renderizarDespensa();
}

function filtrarCategoria(cat) {
    categoriaFiltro = cat;
    const btnTodos = document.getElementById('btn-cat-todos');
    const btnPronto = document.getElementById('btn-cat-pronto');
    const btnFrescos = document.getElementById('btn-cat-frescos');

    [btnTodos, btnPronto, btnFrescos].forEach(b => {
        if (b) b.className = "px-3.5 py-1.5 rounded-xl font-semibold bg-white border border-slate-200 text-slate-600 whitespace-nowrap transition cursor-pointer";
    });

    if (cat === 'todos' && btnTodos) btnTodos.className = "px-3.5 py-1.5 rounded-xl font-bold bg-[#3b630b] text-white shadow-sm whitespace-nowrap transition cursor-pointer";
    if (cat === 'pronto' && btnPronto) btnPronto.className = "px-3.5 py-1.5 rounded-xl font-bold bg-[#3b630b] text-white shadow-sm whitespace-nowrap transition cursor-pointer";
    if (cat === 'frescos' && btnFrescos) btnFrescos.className = "px-3.5 py-1.5 rounded-xl font-bold bg-[#3b630b] text-white shadow-sm whitespace-nowrap transition cursor-pointer";

    renderizarDespensa();
}

function previsualizarFoto(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 300;
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                fotoTemporal = canvas.toDataURL('image/jpeg', 0.7);

                const imgPreview = document.getElementById('preview-foto');
                const placeholder = document.getElementById('placeholder-foto');
                if (imgPreview && placeholder) {
                    imgPreview.src = fotoTemporal;
                    imgPreview.classList.remove('hidden');
                    placeholder.classList.add('hidden');
                }
            };
            img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function obtenerUbicacion() {
    const badgeUbicacion = document.getElementById('badge-ubicacion');
    const textoCiudad = document.getElementById('texto-ciudad');
    const btnGps = document.getElementById('btn-gps');
    if (btnGps) btnGps.innerHTML = '<i class="fa-solid fa-spinner animate-spin text-sm"></i>';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                miLatitud = pos.coords.latitude;
                miLongitud = pos.coords.longitude;

                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${miLatitud}&lon=${miLongitud}`)
                    .then(res => res.json())
                    .then(data => {
                        const ciudad = data.address?.city || data.address?.town || "Ubicación detectada";
                        if (textoCiudad) textoCiudad.textContent = `📍 ${ciudad}`;
                        if (badgeUbicacion) badgeUbicacion.classList.remove('hidden');
                    })
                    .finally(() => { if (btnGps) btnGps.innerHTML = '<i class="fa-solid fa-location-dot text-sm"></i>'; });
            },
            () => {
                if (btnGps) btnGps.innerHTML = '<i class="fa-solid fa-location-dot text-sm"></i>';
                alert("Por favor habilita el permiso de GPS.");
            }
        );
    }
}
