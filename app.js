// Variables globales
let modoFormulario = 'login';
let fotoTemporal = null;
let alimentoSeleccionadoId = null;

// Filtros
let categoriaFiltro = 'todos';
let tipoFiltro = 'todos';
let ubicacionFiltro = 'todas';
let ordenActual = 'vencimiento';

// INVENTARIO CON CATEGORÍAS Y UBICACIÓN
let inventario = [
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
    },
    { 
        id: 3, 
        nombre: 'Aguacates', 
        cantidad: '2 pcs', 
        dias: 6, 
        pronto: false, 
        tipo: 'Frutas y Verduras',
        ubicacion: 'Alacena',
        imagen: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500', 
        diasTotal: 10 
    },
    { 
        id: 4, 
        nombre: 'Tomates Frescos', 
        cantidad: '5 pcs', 
        dias: 5, 
        pronto: false, 
        tipo: 'Frutas y Verduras',
        ubicacion: 'Refrigerador',
        imagen: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500', 
        diasTotal: 8 
    }
];

// LISTA DE PENDIENTES
let listaCompras = [
    { id: 101, nombre: 'Huevos docena', comprado: false },
    { id: 102, nombre: 'Queso Parmesano', comprado: false }
];

document.addEventListener('DOMContentLoaded', () => {
    renderizarDespensa();
    renderizarListaCompras();
});

// FUNCIONES DE CONTROL DEL MODAL DE INICIO DE SESIÓN / REGISTRO
function abrirModalLogin(modo = 'login') {
    modoFormulario = modo;
    cambiarTabLogin(modo);
    document.getElementById('modal-login')?.classList.remove('hidden');
}

function cerrarModalLogin() {
    document.getElementById('modal-login')?.classList.add('hidden');
}

function cambiarTabLogin(modo) {
    modoFormulario = modo;
    const tabLogin = document.getElementById('tab-login');
    const tabRegistro = document.getElementById('tab-registro');
    const titulo = document.getElementById('titulo-modal-form');
    const btnSubmit = document.getElementById('btn-submit-form');

    if (modo === 'login') {
        tabLogin.className = "flex-1 py-2 rounded-xl text-[#0f5132] bg-white shadow-sm transition-all duration-200";
        tabRegistro.className = "flex-1 py-2 rounded-xl text-slate-500 hover:text-slate-800 transition-all duration-200";
        if (titulo) titulo.textContent = 'Iniciar Sesión';
        if (btnSubmit) btnSubmit.textContent = 'Iniciar sesión';
    } else {
        tabRegistro.className = "flex-1 py-2 rounded-xl text-[#0f5132] bg-white shadow-sm transition-all duration-200";
        tabLogin.className = "flex-1 py-2 rounded-xl text-slate-500 hover:text-slate-800 transition-all duration-200";
        if (titulo) titulo.textContent = 'Crear Cuenta';
        if (btnSubmit) btnSubmit.textContent = 'Crear cuenta';
    }
}

function togglePasswordVisible() {
    const inputPass = document.getElementById('login-password');
    const icono = document.getElementById('icono-ojo');
    
    if (inputPass.type === 'password') {
        inputPass.type = 'text';
        icono.className = 'fa-regular fa-eye-slash text-xs';
    } else {
        inputPass.type = 'password';
        icono.className = 'fa-regular fa-eye text-xs';
    }
}

function ejecutarLogin() {
    const correo = document.getElementById('login-correo')?.value.trim();
    if (!correo) return;

    // Extraer un nombre visible a partir del correo
    const nombreUsuario = correo.split('@')[0];
    const saludoEl = document.getElementById('saludo-usuario');
    if (saludoEl) saludoEl.textContent = `¡Hola, ${nombreUsuario}! 👋`;

    cerrarModalLogin();
    mostrarDespensa();
}

function loginSocial(red) {
    alert(`Autenticando con ${red}...`);
    const saludoEl = document.getElementById('saludo-usuario');
    if (saludoEl) saludoEl.textContent = `¡Hola, Usuario ${red}! 👋`;
    
    cerrarModalLogin();
    mostrarDespensa();
}

function obtenerUbicacion() {
    const txt = document.getElementById('texto-ciudad');
    if (txt) txt.textContent = '📍 Detectando ubicación...';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            () => { if (txt) txt.textContent = '📍 Bogotá ciudad'; },
            () => { if (txt) txt.textContent = '📍 Ubicación detectada'; }
        );
    } else {
        if (txt) txt.textContent = '📍 Bogotá ciudad';
    }
}

// RENDERIZAR INVENTARIO
function renderizarDespensa() {
    const listaPronto = document.getElementById('lista-pronto');
    const listaFrescos = document.getElementById('lista-frescos');
    const seccionPronto = document.getElementById('seccion-pronto');
    const seccionFrescos = document.getElementById('seccion-frescos');

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
                <div onclick="abrirDetalleTab(${item.id})" class="bg-red-50/60 border border-red-200 rounded-2xl p-3 flex items-center justify-between shadow-xs cursor-pointer hover:border-red-400 transition">
                    <div class="flex items-center gap-3">
                        <img src="${item.imagen}" class="w-9 h-9 rounded-xl object-cover shadow-xs">
                        <div>
                            <h4 class="text-xs font-bold text-slate-800">${item.nombre}</h4>
                            <p class="text-[10px] text-red-600 font-semibold">${item.dias === 0 ? 'Vence hoy' : 'Vence en ' + item.dias + ' días'} • ${item.cantidad}</p>
                            <span class="text-[9px] bg-white border border-slate-200 px-1.5 py-0.2 rounded text-slate-500 font-medium">📍 ${item.ubicacion}</span>
                        </div>
                    </div>
                    <button type="button" onclick="event.stopPropagation(); sugerirReceta('${item.nombre}')" class="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl shadow-xs active:scale-95 transition cursor-pointer">
                        ¿Qué cocinar?
                    </button>
                </div>
            `;
        } else {
            contadorFrescos++;
            listaFrescos.innerHTML += `
                <div onclick="abrirDetalleTab(${item.id})" class="bg-white border border-slate-200/80 rounded-2xl p-2.5 flex flex-col justify-between shadow-xs cursor-pointer hover:border-emerald-400 transition">
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

    if (seccionPronto) seccionPronto.style.display = (contadorPronto > 0 || categoriaFiltro === 'pronto') ? 'block' : 'none';
    if (seccionFrescos) seccionFrescos.style.display = (contadorFrescos > 0 || categoriaFiltro === 'frescos') ? 'block' : 'none';
}

function filtrarTipo(tipo) { tipoFiltro = tipo; renderizarDespensa(); }
function filtrarUbicacion(ub) { ubicacionFiltro = ub; renderizarDespensa(); }

function abrirDetalleTab(id) {
    const item = inventario.find(i => i.id === id);
    if (!item) return;

    alimentoSeleccionadoId = id;

    document.getElementById('tab-detalle-nombre').textContent = item.nombre;
    document.getElementById('tab-detalle-cantidad').textContent = item.cantidad;
    document.getElementById('tab-detalle-dias-restantes').textContent = `${item.dias} días restantes para su fecha límite`;
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
        if (barEl) barEl.className = "h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-500 shadow-xs";
        if (badgeEl) { badgeEl.textContent = 'Fresco 🟢'; badgeEl.className = "absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-md bg-emerald-600"; }
    } else {
        if (barEl) barEl.className = "h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500 shadow-xs";
        if (badgeEl) { badgeEl.textContent = '¡Urgente! 🔴'; badgeEl.className = "absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-md bg-red-600"; }
    }

    document.getElementById('vista-despensa')?.classList.add('hidden');
    document.getElementById('vista-lista-compras')?.classList.add('hidden');
    document.getElementById('vista-detalle-alimento')?.classList.remove('hidden');
}

// SECCIÓN LISTA DE COMPRAS
function abrirListaCompras() {
    document.getElementById('vista-despensa')?.classList.add('hidden');
    document.getElementById('vista-detalle-alimento')?.classList.add('hidden');
    document.getElementById('vista-lista-compras')?.classList.remove('hidden');
}

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
            <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <label class="flex items-center gap-2 cursor-pointer flex-1 ${item.comprado ? 'line-through text-slate-400' : 'text-slate-800 font-semibold'}">
                    <input type="checkbox" ${item.comprado ? 'checked' : ''} onchange="toggleItemCompra(${item.id})" class="rounded text-emerald-600 focus:ring-emerald-500">
                    <span>${item.nombre}</span>
                </label>
                <div class="flex gap-1">
                    <button type="button" onclick="moverADespensaDesdeCompras(${item.id})" title="Pasar a Despensa" class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-lg">
                        + Despensa
                    </button>
                    <button type="button" onclick="eliminarItemCompra(${item.id})" class="text-red-400 hover:text-red-600 px-1.5 py-1">
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

    listaCompras.unshift({
        id: Date.now(),
        nombre: txt,
        comprado: false
    });

    input.value = '';
    renderizarListaCompras();
}

function toggleItemCompra(id) {
    const item = listaCompras.find(i => i.id === id);
    if (item) {
        item.comprado = !item.comprado;
        renderizarListaCompras();
    }
}

function eliminarItemCompra(id) {
    listaCompras = listaCompras.filter(i => i.id !== id);
    renderizarListaCompras();
}

function moverADespensaDesdeCompras(id) {
    const item = listaCompras.find(i => i.id === id);
    if (item) {
        const nuevo = {
            id: Date.now(),
            nombre: item.nombre,
            cantidad: '1 unidad',
            dias: 7,
            pronto: false,
            tipo: 'Alacena/Secos',
            ubicacion: 'Alacena',
            imagen: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500',
            diasTotal: 10
        };

        inventario.unshift(nuevo);
        listaCompras = listaCompras.filter(i => i.id !== id);
        renderizarListaCompras();
        renderizarDespensa();
        alert(`🛒 ¡"${item.nombre}" se movió a tu Despensa con éxito!`);
    }
}

function volverADespensa() {
    document.getElementById('vista-detalle-alimento')?.classList.add('hidden');
    document.getElementById('vista-lista-compras')?.classList.add('hidden');
    document.getElementById('vista-despensa')?.classList.remove('hidden');
}

function marcarComoConsumidoTab() {
    if (alimentoSeleccionadoId) {
        inventario = inventario.filter(i => i.id !== alimentoSeleccionadoId);
        renderizarDespensa();
        alert("¡Felicidades! Has evitado el desperdicio de este alimento. 🎉");
    }
    volverADespensa();
}

function donarAlimentoDetalle() {
    const item = inventario.find(i => i.id === alimentoSeleccionadoId);
    if (item) {
        alert(`🤝 ¡Excelente iniciativa! Tu producto "${item.nombre}" ha sido registrado para donación.`);
        inventario = inventario.filter(i => i.id !== alimentoSeleccionadoId);
        renderizarDespensa();
    }
    volverADespensa();
}

function donarAlimentoGenerico() { alert("🤝 Red de Donación activa."); }
function recetaDesdeDetalle() {
    const item = inventario.find(i => i.id === alimentoSeleccionadoId);
    if (item) sugerirReceta(item.nombre);
}

function filtrarAlimentos() { renderizarDespensa(); }
function filtrarCategoria(cat) { categoriaFiltro = cat; renderizarDespensa(); }
function abrirModalFiltros() { document.getElementById('modal-filtros')?.classList.remove('hidden'); }
function cerrarModalFiltros() { document.getElementById('modal-filtros')?.classList.add('hidden'); }
function cambiarOrden(orden) { ordenActual = orden; renderizarDespensa(); }

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
    renderizarDespensa();
    cerrarModalAgregar();

    document.getElementById('input-nombre-alimento').value = '';
    document.getElementById('input-cantidad-alimento').value = '';
    document.getElementById('input-fecha-alimento').value = '';
    fotoTemporal = null;
}

function abrirModalAgregar() { document.getElementById('modal-agregar')?.classList.remove('hidden'); }
function cerrarModalAgregar() { document.getElementById('modal-agregar')?.classList.add('hidden'); }
function sugerirReceta(alimento) { alert(`🍳 Receta sugerida con ${alimento}`); }

function mostrarDespensa() {
    document.getElementById('vista-auth')?.classList.add('hidden');
    document.getElementById('vista-despensa')?.classList.remove('hidden');
}

function cerrarSesion() {
    document.getElementById('vista-despensa')?.classList.add('hidden');
    document.getElementById('vista-auth')?.classList.remove('hidden');
}
