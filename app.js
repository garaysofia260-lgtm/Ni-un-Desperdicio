// Variables globales
let modoModal = 'login';
let fotoTemporal = null;
let alimentoSeleccionadoId = null;
let categoriaFiltro = 'todos';
let ordenActual = 'vencimiento';

// INVENTARIO INICIAL
let inventario = [
    { id: 1, nombre: 'Plátanos Maduros', cantidad: '4 unidades', dias: 0, emoji: '🍌', pronto: true, imagen: null, diasTotal: 7 },
    { id: 2, nombre: 'Leche Entera', cantidad: '1 Litro', dias: 2, emoji: '🥛', pronto: true, imagen: null, diasTotal: 10 },
    { id: 3, nombre: 'Aguacates', cantidad: '2 pcs', dias: 6, emoji: '🥑', pronto: false, imagen: null, diasTotal: 10 },
    { id: 4, nombre: 'Tomates', cantidad: '5 pcs', dias: 5, emoji: '🍅', pronto: false, imagen: null, diasTotal: 8 }
];

document.addEventListener('DOMContentLoaded', () => {
    renderizarDespensa();
});

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
        if (categoriaFiltro === 'pronto') return coincideNombre && item.pronto;
        if (categoriaFiltro === 'frescos') return coincideNombre && !item.pronto;
        return coincideNombre;
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
                        ${item.imagen ? `<img src="${item.imagen}" class="w-8 h-8 rounded-xl object-cover">` : `<span class="text-2xl">${item.emoji}</span>`}
                        <div>
                            <h4 class="text-xs font-bold text-slate-800">${item.nombre}</h4>
                            <p class="text-[10px] text-red-600 font-semibold">${item.dias === 0 ? 'Vence hoy' : 'Vence en ' + item.dias + ' días'} • ${item.cantidad}</p>
                        </div>
                    </div>
                    <button type="button" onclick="event.stopPropagation(); sugerirReceta('${item.nombre}')" class="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl shadow-sm active:scale-95 transition cursor-pointer">
                        ¿Qué cocinar?
                    </button>
                </div>
            `;
        } else {
            contadorFrescos++;
            listaFrescos.innerHTML += `
                <div onclick="abrirDetalleTab(${item.id})" class="bg-white border border-slate-200/80 rounded-2xl p-2.5 flex flex-col justify-between shadow-sm cursor-pointer hover:border-emerald-400 transition">
                    <div class="flex items-center gap-2 mb-2">
                        ${item.imagen ? `<img src="${item.imagen}" class="w-7 h-7 rounded-lg object-cover">` : `<span class="text-xl">${item.emoji}</span>`}
                        <div>
                            <h4 class="text-xs font-bold text-slate-800">${item.nombre}</h4>
                            <p class="text-[9px] text-emerald-600 font-medium">Vence en ${item.dias} días</p>
                        </div>
                    </div>
                    <span class="text-[10px] text-slate-400">Cantidad: ${item.cantidad}</span>
                </div>
            `;
        }
    });

    if (seccionPronto) seccionPronto.style.display = (contadorPronto > 0 || categoriaFiltro === 'pronto') ? 'block' : 'none';
    if (seccionFrescos) seccionFrescos.style.display = (contadorFrescos > 0 || categoriaFiltro === 'frescos') ? 'block' : 'none';
}

// PESTAÑA DEDICADA DE DETALLE CON CÁLCULO DE FRESCURA
function abrirDetalleTab(id) {
    const item = inventario.find(i => i.id === id);
    if (!item) return;

    alimentoSeleccionadoId = id;

    // Asignar textos
    document.getElementById('tab-detalle-nombre').textContent = item.nombre;
    document.getElementById('tab-detalle-cantidad').textContent = item.cantidad;
    document.getElementById('tab-detalle-dias-restantes').textContent = `${item.dias} días restantes para su fecha límite`;

    // Manejar Imagen / Emoji
    const imgEl = document.getElementById('tab-detalle-img');
    const emojiEl = document.getElementById('tab-detalle-emoji');

    if (item.imagen) {
        imgEl.src = item.imagen;
        imgEl.classList.remove('hidden');
        emojiEl.classList.add('hidden');
    } else {
        imgEl.classList.add('hidden');
        emojiEl.classList.remove('hidden');
        emojiEl.textContent = item.emoji || '🥑';
    }

    // Calcular Porcentaje de Frescura (0% - 100%)
    const diasTotal = item.diasTotal || 7;
    let pct = Math.min(100, Math.max(10, Math.round((item.dias / diasTotal) * 100)));
    if (item.dias === 0) pct = 5;

    const barEl = document.getElementById('tab-detalle-bar');
    const pctTxt = document.getElementById('tab-detalle-porcentaje');
    const badgeEl = document.getElementById('tab-detalle-badge');
    const estadoTxt = document.getElementById('tab-detalle-estado');

    if (barEl) barEl.style.width = `${pct}%`;
    if (pctTxt) pctTxt.textContent = `${pct}% Fresco`;

    // Ajustar Colores según Nivel de Frescura
    if (pct > 50) {
        if (barEl) barEl.className = "h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-500";
        if (badgeEl) { badgeEl.textContent = 'Fresco 🟢'; badgeEl.className = "absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm bg-emerald-600"; }
        if (estadoTxt) estadoTxt.textContent = "Óptimo estado";
    } else if (pct > 20) {
        if (barEl) barEl.className = "h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500";
        if (badgeEl) { badgeEl.textContent = 'Consumir pronto 🟡'; badgeEl.className = "absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm bg-amber-600"; }
        if (estadoTxt) estadoTxt.textContent = "Atención requerida";
    } else {
        if (barEl) barEl.className = "h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500";
        if (badgeEl) { badgeEl.textContent = '¡Urgente! 🔴'; badgeEl.className = "absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm bg-red-600"; }
        if (estadoTxt) estadoTxt.textContent = "Prioridad máxima";
    }

    // Transición de pestañas
    document.getElementById('vista-despensa')?.classList.add('hidden');
    document.getElementById('vista-detalle-alimento')?.classList.remove('hidden');
}

function volverADespensa() {
    document.getElementById('vista-detalle-alimento')?.classList.add('hidden');
    document.getElementById('vista-despensa')?.classList.remove('hidden');
}

function marcarComoConsumidoTab() {
    if (alimentoSeleccionadoId) {
        inventario = inventario.filter(i => i.id !== alimentoSeleccionadoId);
        renderizarDespensa();
    }
    volverADespensa();
}

function recetaDesdeDetalle() {
    const item = inventario.find(i => i.id === alimentoSeleccionadoId);
    if (item) sugerirReceta(item.nombre);
}

// BÚSQUEDA Y FILTROS
function filtrarAlimentos() { renderizarDespensa(); }

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

function abrirModalFiltros() { document.getElementById('modal-filtros')?.classList.remove('hidden'); }
function cerrarModalFiltros() { document.getElementById('modal-filtros')?.classList.add('hidden'); }
function cambiarOrden(orden) { ordenActual = orden; renderizarDespensa(); }

// CÁMARA Y FOTO
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

function guardarAlimento() {
    const nom = document.getElementById('input-nombre-alimento')?.value.trim();
    const cant = document.getElementById('input-cantidad-alimento')?.value.trim() || '1 unidad';
    const fecha = document.getElementById('input-fecha-alimento')?.value;

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
        emoji: '🥑',
        pronto: dias <= 2,
        imagen: fotoTemporal,
        diasTotal: Math.max(dias + 2, 7)
    };

    inventario.unshift(nuevo);
    renderizarDespensa();
    cerrarModalAgregar();

    document.getElementById('input-nombre-alimento').value = '';
    document.getElementById('input-cantidad-alimento').value = '';
    document.getElementById('input-fecha-alimento').value = '';
    fotoTemporal = null;
    document.getElementById('preview-foto')?.classList.add('hidden');
    document.getElementById('placeholder-foto')?.classList.remove('hidden');
}

// MODAL LOGIN / AUTH
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

function mostrarDespensa() {
    document.getElementById('vista-auth')?.classList.add('hidden');
    document.getElementById('vista-despensa')?.classList.remove('hidden');
}

function cerrarSesion() {
    document.getElementById('vista-despensa')?.classList.add('hidden');
    document.getElementById('vista-auth')?.classList.remove('hidden');
}

function loginSocial(red) {
    alert(`Iniciando sesión con ${red}... ¡Bienvenido a NO WASTE!`);
    cerrarLogin();
    mostrarDespensa();
}

function procesarFormulario(e) {
    if (e && e.preventDefault) e.preventDefault();
    cerrarLogin();
    mostrarDespensa();
    return false;
}

function sugerirReceta(alimento) {
    alert(`🍳 Idea de receta de rescate con ${alimento}:\n- Batido o crema casera\n- Salteado vegetal express\n- Tarta / Tortilla de aprovechamiento`);
}

function abrirModalAgregar() { document.getElementById('modal-agregar')?.classList.remove('hidden'); }
function cerrarModalAgregar() { document.getElementById('modal-agregar')?.classList.add('hidden'); }

function obtenerUbicacion() {
    const badgeUbicacion = document.getElementById('badge-ubicacion');
    const textoCiudad = document.getElementById('texto-ciudad');
    const btnGps = document.getElementById('btn-gps');
    if (btnGps) btnGps.innerHTML = '<i class="fa-solid fa-spinner animate-spin text-sm"></i>';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
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
