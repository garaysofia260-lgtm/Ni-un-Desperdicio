// ==========================================
// VARIABLES GLOBALES Y ESTADO DE SESIÓN
// ==========================================
let modoModal = 'login';
let fotoTemporal = null;
let alimentoSeleccionadoId = null;
let usuarioActual = '';
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

// Estado de ajuste/recorte de foto de perfil
let imagenPerfilOriginal = null;
let perfilZoom = 1;
let perfilOffsetX = 0;
let perfilOffsetY = 0;

// Base de datos de cuentas registradas localmente
let usuariosRegistrados = JSON.parse(localStorage.getItem('nowaste_usuarios_db')) || {
    'usuario.demo@gmail.com': { pass: '123456', nombre: 'Usuario Demo', tipo: 'hogar' },
    'sofia@nowaste.com': { pass: '123456', nombre: 'Sofia', tipo: 'hogar' }
};

// DATOS BASE DE DONACIONES
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
    }
];

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
    }
];

const listaComprasDefault = [
    { id: 101, nombre: 'Huevos docena', comprado: false }
];

let inventario = [];
let listaCompras = [];
let redDonaciones = [];

// Perfil predeterminado desde cero
const perfilDefault = {
    avatar: '',
    kilosSalvados: 0,
    donacionesHechas: 0,
    dineroAhorrado: 0,
    puntos: 0,
    nivelTitulo: 'Semilla Ambiental 🌿'
};

let miPerfil = { ...perfilDefault };

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
// CARGA Y SINCRONIZACIÓN DE USUARIO Y PERFIL
// ==========================================
function cargarDatosUsuario() {
    const sesionGuardada = localStorage.getItem('nowaste_usuario_activo');
    if (sesionGuardada) {
        usuarioActual = sesionGuardada;
    }

    if (!usuarioActual) return;

    // Cargar Perfil de métricas y avatar
    const perfilGuardado = localStorage.getItem(`nowaste_perfil_${usuarioActual}`);
    if (perfilGuardado) {
        try { miPerfil = JSON.parse(perfilGuardado); } catch(e) { miPerfil = { ...perfilDefault }; }
    } else {
        miPerfil = { ...perfilDefault };
    }

    // Cargar despensa e inventario
    const despensaGuardada = localStorage.getItem(`nowaste_despensa_${usuarioActual}`);
    if (despensaGuardada !== null) {
        try { inventario = JSON.parse(despensaGuardada); } catch (e) { inventario = []; }
    } else {
        inventario = JSON.parse(JSON.stringify(inventarioDefault));
    }

    // Cargar lista de compras
    const comprasGuardadas = localStorage.getItem(`nowaste_compras_${usuarioActual}`);
    if (comprasGuardadas !== null) {
        try { listaCompras = JSON.parse(comprasGuardadas); } catch (e) { listaCompras = []; }
    } else {
        listaCompras = JSON.parse(JSON.stringify(listaComprasDefault));
    }

    cargarRedDonacionesGlobales();
    actualizarSincronizacionPerfilUI();
    guardarEnLocalStorage();
}

function actualizarNivelYTitulos() {
    // Cálculo dinámico de títulos según los kilos salvados
    const kgs = miPerfil.kilosSalvados || 0;
    
    if (kgs >= 20) {
        miPerfil.nivelTitulo = 'Héroe Sin Desperdicio 🏆';
    } else if (kgs >= 10) {
        miPerfil.nivelTitulo = 'Defensor del Alimento 🛡️';
    } else if (kgs >= 3) {
        miPerfil.nivelTitulo = 'Protector Verde 🌱';
    } else {
        miPerfil.nivelTitulo = 'Semilla Ambiental 🌿';
    }
}

function actualizarSincronizacionPerfilUI() {
    actualizarNivelYTitulos();

    const usernameGuardado = localStorage.getItem(`nowaste_username_${usuarioActual}`) || (usuarioActual ? usuarioActual.split('@')[0] : 'Usuario');
    
    // Actualizar Saludo
    const saludo = document.getElementById('saludo-usuario');
    if (saludo) saludo.textContent = `¡Hola, ${usernameGuardado}! 👋`;

    // Actualizar Fotos de perfil en todos los encabezados e íconos
    const fotosNodos = document.querySelectorAll('.img-perfil-header, .avatar-usuario-icon');
    fotosNodos.forEach(el => {
        if (miPerfil.avatar) {
            if (el.tagName === 'IMG') {
                el.src = miPerfil.avatar;
            } else {
                el.innerHTML = `<img src="${miPerfil.avatar}" class="w-full h-full object-cover rounded-full">`;
            }
        } else {
            if (el.tagName === 'IMG') {
                el.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
            } else {
                el.textContent = '🥑';
            }
        }
    });

    // Sincronizar métricas en las vistas
    const statSalvados = document.getElementById('stat-salvados');
    if (statSalvados) statSalvados.textContent = `${(miPerfil.kilosSalvados || 0).toFixed(1)} kg`;

    const statBadgeNivel = document.getElementById('badge-nivel-header');
    if (statBadgeNivel) statBadgeNivel.textContent = miPerfil.nivelTitulo;

    // Vista perfil detallado
    const pNombre = document.getElementById('perfil-nombre-txt');
    if (pNombre) pNombre.textContent = usernameGuardado;

    const pTitulo = document.getElementById('perfil-titulo-txt');
    if (pTitulo) pTitulo.textContent = miPerfil.nivelTitulo;

    const pKg = document.getElementById('perfil-kg-num');
    if (pKg) pKg.textContent = `${(miPerfil.kilosSalvados || 0).toFixed(1)} kg`;

    const pDon = document.getElementById('perfil-donaciones-num');
    if (pDon) pDon.textContent = miPerfil.donacionesHechas || 0;

    const pAhorro = document.getElementById('perfil-ahorro-num');
    if (pAhorro) pAhorro.textContent = `$${(miPerfil.dineroAhorrado || 0).toLocaleString()}`;
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
            localStorage.setItem(`nowaste_perfil_${usuarioActual}`, JSON.stringify(miPerfil));
        }
        localStorage.setItem(`nowaste_donaciones_red`, JSON.stringify(redDonaciones));
        localStorage.setItem('nowaste_usuarios_db', JSON.stringify(usuariosRegistrados));
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
});

// ==========================================
// CONTROLES Y AJUSTE DE FOTO DE PERFIL (ZOOM Y PAN)
// ==========================================
function cargarImagenPerfilOriginal(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        const img = new Image();
        img.onload = function() {
            imagenPerfilOriginal = img;
            perfilZoom = 1;
            perfilOffsetX = 0;
            perfilOffsetY = 0;
            
            const rangeZoom = document.getElementById('range-perfil-zoom');
            if (rangeZoom) rangeZoom.value = 1;

            dibujarCanvasPerfil();
            document.getElementById('modal-ajustar-foto')?.classList.remove('hidden');
        };
        img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
}

function cambiarZoomPerfil(val) {
    perfilZoom = parseFloat(val);
    dibujarCanvasPerfil();
}

function moverFotoPerfil(dx, dy) {
    perfilOffsetX += dx;
    perfilOffsetY += dy;
    dibujarCanvasPerfil();
}

function dibujarCanvasPerfil() {
    const canvas = document.getElementById('canvas-perfil');
    if (!canvas || !imagenPerfilOriginal) return;

    const ctx = canvas.getContext('2d');
    const size = canvas.width;

    ctx.clearRect(0, 0, size, size);

    // Dibuja imagen ajustando zoom y desfase
    const nw = imagenPerfilOriginal.width * perfilZoom;
    const nh = imagenPerfilOriginal.height * perfilZoom;

    const x = (size - nw) / 2 + perfilOffsetX;
    const y = (size - nh) / 2 + perfilOffsetY;

    ctx.save();
    // Máscara circular
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(imagenPerfilOriginal, x, y, nw, nh);
    ctx.restore();
}

function guardarFotoPerfilAjustada() {
    const canvas = document.getElementById('canvas-perfil');
    if (!canvas) return;

    miPerfil.avatar = canvas.toDataURL('image/jpeg', 0.85);
    guardarEnLocalStorage();
    actualizarSincronizacionPerfilUI();

    document.getElementById('modal-ajustar-foto')?.classList.add('hidden');
    alert("📸 ¡Foto de perfil actualizada correctamente!");
}

function cerrarModalAjustarFoto() {
    document.getElementById('modal-ajustar-foto')?.classList.add('hidden');
}

// ==========================================
// REGISTRO Y ACCIONES QUE AUMENTAN LAS MÉTRICAS
// ==========================================
function registrarAccionSostenible(kilos, esDonacion = false, valorAhorro = 3500) {
    miPerfil.kilosSalvados = (miPerfil.kilosSalvados || 0) + kilos;
    miPerfil.dineroAhorrado = (miPerfil.dineroAhorrado || 0) + valorAhorro;
    
    if (esDonacion) {
        miPerfil.donacionesHechas = (miPerfil.donacionesHechas || 0) + 1;
    }

    guardarEnLocalStorage();
    actualizarSincronizacionPerfilUI();
}

function marcarComoConsumidoTab() {
    if (alimentoSeleccionadoId) {
        inventario = inventario.filter(i => i.id !== alimentoSeleccionadoId);
        registrarAccionSostenible(0.5, false, 4000); // Incrementa 0.5kg y ahorros
        
        guardarEnLocalStorage();
        renderizarDespensa();
        alert("🎉 ¡Felicidades! Has evitado el desperdicio. Tus estadísticas han aumentado.");
    }
    volverADespensa();
}

function confirmarPublicarDonacion() {
    const select = document.getElementById('select-donar-despensa');
    const idDespensa = parseInt(select.value);
    const nombre = document.getElementById('input-donar-nombre')?.value.trim();
    const cantidad = document.getElementById('input-donar-cantidad')?.value.trim();
    const ubicacion = document.getElementById('input-donar-ubicacion')?.value.trim() || 'A 200m de ti';

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
        fechaLimite: `Hoy hasta las 20:00`,
        imagen: itemOriginal ? itemOriginal.imagen : 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500',
        reservadoPor: null
    };

    redDonaciones.unshift(nuevaDonacion);

    if (itemOriginal) {
        inventario = inventario.filter(i => i.id !== idDespensa);
    }

    registrarAccionSostenible(0.8, true, 5000); // Aumenta kilos y donaciones hechas
    
    guardarEnLocalStorage();
    renderizarDespensa();
    cerrarModalPublicarDonacion();

    alert(`🤝 ¡Donación publicada! "${nombre}" se añadió a la red y tus puntos han subido.`);
    abrirDonaciones();
}

// ==========================================
// PUNTOS FIJOS Y UBICACIÓN GPS
// ==========================================
function obtenerPuntosRecoleccionGPS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                miLatitud = pos.coords.latitude;
                miLongitud = pos.coords.longitude;

                puntosRecoleccionList.forEach(p => {
                    const dist = calcularDistanciaHaversine(miLatitud, miLongitud, p.lat, p.lon);
                    p.distancia = `${dist.toFixed(1)} km`;
                });

                puntosRecoleccionList.sort((a, b) => parseFloat(a.distancia) - parseFloat(b.distancia));
                renderizarPuntosRecoleccion();
            },
            () => { alert("Habilita el GPS para calcular la ubicación exacta."); }
        );
    }
}

function calcularDistanciaHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

function renderizarPuntosRecoleccion() {
    const cont = document.getElementById('contenedor-puntos-recoleccion');
    if (!cont) return;

    cont.innerHTML = '';
    let filtrados = puntosRecoleccionList.filter(p => categoriaPuntosFijos === 'todos' || p.tipoClave === categoriaPuntosFijos);

    filtrados.forEach(p => {
        cont.innerHTML += `
            <div class="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm space-y-2">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="text-xs font-bold text-slate-800">${p.nombre}</h4>
                        <p class="text-[10px] text-emerald-700 font-bold">${p.tipo} • 📍 ${p.distancia}</p>
                    </div>
                </div>
                <p class="text-[10px] text-slate-600">📍 ${p.direccion}</p>
            </div>
        `;
    });
}

// ==========================================
// DESPENSA Y LISTA DE COMPRAS
// ==========================================
function renderizarDespensa() {
    const listaPronto = document.getElementById('lista-pronto');
    const listaFrescos = document.getElementById('lista-frescos');
    if (!listaPronto || !listaFrescos) return;

    listaPronto.innerHTML = '';
    listaFrescos.innerHTML = '';

    const termino = (document.getElementById('input-buscar')?.value || '').toLowerCase().trim();

    let filtrados = inventario.filter(item => {
        const coincideNombre = item.nombre.toLowerCase().includes(termino);
        const coincideEstado = categoriaFiltro === 'todos' || 
                              (categoriaFiltro === 'pronto' && item.pronto) || 
                              (categoriaFiltro === 'frescos' && !item.pronto);
        
        return coincideNombre && coincideEstado;
    });

    filtrados.forEach(item => {
        if (item.pronto) {
            listaPronto.innerHTML += `
                <div onclick="abrirDetalleTab(${item.id})" class="bg-red-50/60 border border-red-200 rounded-2xl p-3 flex items-center justify-between shadow-sm cursor-pointer">
                    <div class="flex items-center gap-3">
                        <img src="${item.imagen}" class="w-9 h-9 rounded-xl object-cover">
                        <div>
                            <h4 class="text-xs font-bold text-slate-800">${item.nombre}</h4>
                            <p class="text-[10px] text-red-600 font-semibold">${item.dias === 0 ? 'Vence hoy' : 'Vence en ' + item.dias + ' días'}</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            listaFrescos.innerHTML += `
                <div onclick="abrirDetalleTab(${item.id})" class="bg-white border border-slate-200/80 rounded-2xl p-2.5 shadow-sm cursor-pointer">
                    <div class="flex items-center gap-2">
                        <img src="${item.imagen}" class="w-8 h-8 rounded-lg object-cover">
                        <div>
                            <h4 class="text-xs font-bold text-slate-800">${item.nombre}</h4>
                            <p class="text-[9px] text-emerald-600">Vence en ${item.dias} días</p>
                        </div>
                    </div>
                </div>
            `;
        }
    });
}

function renderizarListaCompras() {
    const cont = document.getElementById('contenedor-lista-compras');
    if (!cont) return;

    cont.innerHTML = '';
    listaCompras.forEach(item => {
        cont.innerHTML += `
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span>${item.nombre}</span>
            </div>
        `;
    });
}

function renderizarRedDonaciones() {
    const cont = document.getElementById('contenedor-red-donaciones');
    if (!cont) return;

    cont.innerHTML = '';
    redDonaciones.forEach(item => {
        cont.innerHTML += `
            <div class="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
                <h4 class="text-xs font-bold text-slate-800">${item.nombre}</h4>
                <p class="text-[10px] text-slate-500">Donado por ${item.donante}</p>
            </div>
        `;
    });
}

// ==========================================
// AUTENTICACIÓN
// ==========================================
function procesarFormulario(e) {
    if (e && e.preventDefault) e.preventDefault();

    if (modoModal === 'login') {
        const emailInput = document.getElementById('input-login-email');
        const passInput = document.getElementById('pass-login');

        const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
        const pass = passInput ? passInput.value.trim() : '';

        if (!email || !pass) return alert("⚠️ Ingresa correo y contraseña.");

        if (usuariosRegistrados[email] && usuariosRegistrados[email].pass !== pass) {
            return alert("❌ Contraseña incorrecta.");
        }

        usuarioActual = email;
        localStorage.setItem('nowaste_usuario_activo', usuarioActual);
        localStorage.setItem('nowaste_autenticado', 'true');
    } else {
        const emailRegInput = document.getElementById('input-reg-email');
        const pass1Input = document.getElementById('pass-reg1');
        const nombreInput = document.getElementById('input-reg-nombre');

        const emailReg = emailRegInput ? emailRegInput.value.trim().toLowerCase() : '';
        const pass1 = pass1Input ? pass1Input.value.trim() : '';
        const nombre = nombreInput ? nombreInput.value.trim() : '';

        if (!emailReg || !pass1) return alert("⚠️ Completa los campos obligatorios.");

        usuariosRegistrados[emailReg] = { pass: pass1, nombre: nombre || emailReg.split('@')[0] };
        usuarioActual = emailReg;
        localStorage.setItem('nowaste_usuario_activo', usuarioActual);
        localStorage.setItem(`nowaste_username_${usuarioActual}`, nombre || emailReg.split('@')[0]);
        localStorage.setItem('nowaste_autenticado', 'true');
    }

    cerrarLogin();
    cargarDatosUsuario();
    mostrarDespensa();
    return false;
}

function abrirModalSocial(red) {
    redSocialSeleccionada = red;
    document.getElementById('modal-social')?.classList.remove('hidden');
}

function cerrarModalSocial() { document.getElementById('modal-social')?.classList.add('hidden'); }

function confirmarLoginSocial() {
    const select = document.getElementById('select-cuenta-social');
    const customEmail = document.getElementById('input-correo-social-custom')?.value.trim().toLowerCase();
    
    let emailFinal = select ? select.value : '';
    if (emailFinal === 'nuevo_correo') {
        if (!customEmail || !customEmail.includes('@')) return alert("⚠️ Ingresa un correo válido.");
        emailFinal = customEmail;
    }

    usuarioActual = emailFinal;
    localStorage.setItem('nowaste_usuario_activo', usuarioActual);
    localStorage.setItem('nowaste_autenticado', 'true');

    cerrarModalSocial();
    cargarDatosUsuario();
    mostrarDespensa();
}

function cerrarSesion() {
    localStorage.removeItem('nowaste_autenticado');
    localStorage.removeItem('nowaste_usuario_activo');
    usuarioActual = '';
    miPerfil = { ...perfilDefault };
    
    ocultarTodasLasVistas();
    document.getElementById('vista-auth')?.classList.remove('hidden');
}

// ==========================================
// GESTIÓN DE VISTAS
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
    actualizarSincronizacionPerfilUI();
}

function volverADespensa() { mostrarDespensa(); }

function abrirDonaciones() {
    ocultarTodasLasVistas();
    document.getElementById('vista-donaciones')?.classList.remove('hidden');
    actualizarSincronizacionPerfilUI();
}

function abrirComunidades() {
    ocultarTodasLasVistas();
    document.getElementById('vista-comunidades')?.classList.remove('hidden');
    actualizarSincronizacionPerfilUI();
}

function abrirRecetas() {
    ocultarTodasLasVistas();
    document.getElementById('vista-recetas')?.classList.remove('hidden');
    actualizarSincronizacionPerfilUI();
}

function abrirDetalleTab(id) {
    const item = inventario.find(i => i.id === id);
    if (!item) return;

    alimentoSeleccionadoId = id;
    document.getElementById('tab-detalle-nombre').textContent = item.nombre;
    ocultarTodasLasVistas();
    document.getElementById('vista-detalle-alimento')?.classList.remove('hidden');
}

function abrirModalAgregar() { document.getElementById('modal-agregar')?.classList.remove('hidden'); }
function cerrarModalAgregar() { document.getElementById('modal-agregar')?.classList.add('hidden'); }
function abrirModalPublicarDonacion() { document.getElementById('modal-publicar-donacion')?.classList.remove('hidden'); }
function cerrarModalPublicarDonacion() { document.getElementById('modal-publicar-donacion')?.classList.add('hidden'); }
function abrirLogin() { modoModal = 'login'; document.getElementById('modal-login')?.classList.remove('hidden'); }
function cerrarLogin() { document.getElementById('modal-login')?.classList.add('hidden'); }
