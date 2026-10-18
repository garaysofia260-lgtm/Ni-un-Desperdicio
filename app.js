// Variables globales
let modoModal = 'login';
let fotoTemporal = null;
let alimentoSeleccionadoId = null;
let mapaInstancia = null;

// Gamificación e Impacto
let statsImpacto = {
    dineroAhorrado: 42500, // en Moneda Local (COP)
    co2Reducido: 12.4, // en kg
    nivel: 2,
    insignias: ['Primer Salve', 'Cero Desperdicio']
};

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

let listaCompras = [
    { id: 101, nombre: 'Huevos docena', comprado: false },
    { id: 102, nombre: 'Queso Parmesano', comprado: false }
];

// PLANTILLAS DE RECETAS ADAPTABLES
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
    },
    {
        idTipo: 'compota',
        nombreBase: 'Compota / Postre Dulce de',
        aplicableA: ['Frutas y Verduras'],
        tiempo: '12 min',
        dificultad: 'Fácil',
        imagenDefault: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
        pasosTemplate: (ing) => [
            `Pela y pica en cubitos los/las ${ing}.`,
            `Llévalos a una olla pequeña con un chorrito de agua y canela a fuego lento por 10 minutos.`,
            `Cuando estén suaves, tritura ligeramente y disfruta caliente o frío.`
        ]
    },
    {
        idTipo: 'salteado',
        nombreBase: 'Salteado Express de',
        aplicableA: ['Frutas y Verduras', 'Alacena/Secos'],
        tiempo: '10 min',
        dificultad: 'Fácil',
        imagenDefault: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
        pasosTemplate: (ing) => [
            `Corta los/las ${ing} en tiras o rodajas delgadas.`,
            `Calienta una sartén con un poco de aceite de oliva o mantequilla.`,
            `Saltea a fuego vivo durante 5-7 minutos y condimenta con sal y pimienta.`
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    renderizarDespensa();
    renderizarListaCompras();
    verificarAlertasProximas();
});

// 1. NOTIFICACIONES PUSH O ALERTAS AUTOMÁTICAS
function activarNotificacionesPush() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                const icono = document.getElementById('icono-notificaciones');
                if (icono) icono.className = "fa-solid fa-bell text-amber-300 animate-bounce";
                alert("🔔 ¡Notificaciones activadas! Te avisaremos 1 ó 2 días antes de que tus insumos venzan.");
                verificarAlertasProximas();
            } else {
                alert("⚠️ Se denegó el permiso para notificaciones.");
            }
        });
    } else {
        alert("🔔 Tu navegador no soporta Notificaciones Push directas.");
    }
}

function verificarAlertasProximas() {
    const proximos = inventario.filter(i => i.dias <= 2);
    if (proximos.length > 0) {
        proximos.forEach(item => {
            if (Notification.permission === 'granted') {
                new Notification(`⚠️ ¡Alimento por vencer!`, {
                    body: `Tu producto "${item.nombre}" vence en ${item.dias === 0 ? 'hoy' : item.dias + ' días'}. ¡Cocínalo o dónalo!`,
                    icon: item.imagen
                });
            }
        });
    }
}

// 2. ESCÁNER DE CÓDIGO DE BARRAS POR CÁMARA
function escanearCodigoBarrasCamara() {
    alert("📷 Abriendo cámara para escáner de código de barras...");
    
    // Simulación inteligente de lectura de código de barras EAN-13
    setTimeout(() => {
        const productosBarcodeMock = [
            { nombre: 'Peras Conferencia', tipo: 'Frutas y Verduras', ub: 'Refrigerador', cant: '1 kg', dias: 4 },
            { nombre: 'Yogurt Griego Natural', tipo: 'Lácteos', ub: 'Refrigerador', cant: '500g', dias: 3 },
            { nombre: 'Avena en Hojuelas', tipo: 'Alacena/Secos', ub: 'Alacena', cant: '1 Bolsa', dias: 15 }
        ];

        const detectado = productosBarcodeMock[Math.floor(Math.random() * productosBarcodeMock.length)];
        
        document.getElementById('input-nombre-alimento').value = detectado.nombre;
        document.getElementById('input-cantidad-alimento').value = detectado.cant;
        document.getElementById('select-tipo-alimento').value = detectado.tipo;
        document.getElementById('select-ubicacion-alimento').value = detectado.ub;

        // Calcular fecha según los días
        const f = new Date();
        f.setDate(f.getDate() + detectado.dias);
        document.getElementById('input-fecha-alimento').value = f.toISOString().split('T')[0];

        alert(`✅ Código de Barras Detectado: "${detectado.nombre}". ¡Datos autocompletados!`);
    }, 1200);
}

// 3. GAMIFICACIÓN E IMPACTO AMBIENTAL
function abrirPerfilGamificacion() {
    ocultarTodasLasVistas();
    document.getElementById('vista-gamificacion')?.classList.remove('hidden');

    document.getElementById('gamificacion-dinero').textContent = `$${statsImpacto.dineroAhorrado.toLocaleString()} COP`;
    document.getElementById('gamificacion-co2').textContent = `${statsImpacto.co2Reducido.toFixed(1)} kg CO₂`;
    document.getElementById('stat-salvados').textContent = `${statsImpacto.co2Reducido.toFixed(1)} kg`;
}

function sumarImpacto(co2 = 0.8, dinero = 3500) {
    statsImpacto.co2Reducido += co2;
    statsImpacto.dineroAhorrado += dinero;
    
    if (statsImpacto.co2Reducido > 20 && statsImpacto.nivel < 3) {
        statsImpacto.nivel = 3;
        alert("🏆 ¡FELICIDADES! Has subido al NIVEL 3: Maestro del Residuo Cero ⭐");
    }
}

// 4. RED COMUNITARIA DE DONACIONES (MAPA INTERACTIVO LEAFLET)
function abrirMapaDonaciones() {
    ocultarTodasLasVistas();
    document.getElementById('vista-donaciones')?.classList.remove('hidden');

    setTimeout(() => {
        if (!mapaInstancia) {
            mapaInstancia = L.map('mapa-donaciones-container').setView([4.6097, -74.0817], 13); // Coordenadas default
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '© OpenStreetMap'
            }).addTo(mapaInstancia);

            // Marcadores de prueba
            L.marker([4.615, -74.082]).addTo(mapaInstancia).bindPopup("<b>Banco de Alimentos Central</b><br>Reciben frutas y secos.");
            L.marker([4.605, -74.078]).addTo(mapaInstancia).bindPopup("<b>Comedor Comunitario Sur</b><br>Aceptan lácteos y verduras.");
        }
        mapaInstancia.invalidateSize();
    }, 200);

    renderizarPuntosDonacion();
}

function renderizarPuntosDonacion() {
    const cont = document.getElementById('lista-puntos-donacion');
    if (!cont) return;

    cont.innerHTML = `
        <div class="p-2 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
            <div>
                <b class="text-slate-800">📍 Banco de Alimentos Central</b>
                <p class="text-[10px] text-slate-500">A 1.2 km de distancia • Abierto hasta las 6 PM</p>
            </div>
            <button onclick="alert('Solicitando recolección a domicilio 🚚')" class="bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg">Entregar</button>
        </div>
        <div class="p-2 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
                <b class="text-slate-800">📍 Red Vecinal Solidaria</b>
                <p class="text-[10px] text-slate-500">A 400 m de distancia • Punto comunitario</p>
            </div>
            <button onclick="alert('Publicado en la red comunitaria 🤝')" class="bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg">Publicar</button>
        </div>
    `;
}

// 5. GENERADOR AUTOMÁTICO DE COMPRAS AL PREPARAR RECETAS
function verPasosRecetaDinamica(idReceta) {
    const receta = window.recetasGeneradasCache?.find(r => r.id === idReceta);
    if (!receta) return;

    document.getElementById('modal-receta-img').src = receta.imagen;
    document.getElementById('modal-receta-titulo').textContent = receta.titulo;
    document.getElementById('modal-receta-meta').innerHTML = `
        <span>⏱️ Tiempo: ${receta.tiempo}</span>
        <span>📊 Dificultad: ${receta.dificultad}</span>
    `;

    const ingList = document.getElementById('modal-receta-ingredientes');
    ingList.innerHTML = `
        <li class="flex items-center gap-2 text-emerald-700 font-semibold">
            <i class="fa-solid fa-circle-check text-emerald-600 text-xs"></i>
            <span>${receta.ingredienteEstrella} (De tu despensa)</span>
        </li>
    `;

    const pasosList = document.getElementById('modal-receta-pasos');
    pasosList.innerHTML = '';
    receta.pasos.forEach(p => {
        pasosList.innerHTML += `<li>${p}</li>`;
    });

    const btnCocinar = document.getElementById('btn-cocinar-receta');
    btnCocinar.onclick = () => {
        // Restar de la despensa el ingrediente consumido
        inventario = inventario.filter(i => i.nombre !== receta.ingredienteEstrella);
        
        // Sumar puntos de impacto
        sumarImpacto(0.9, 4000);

        // AÑADIR AUTOMÁTICAMENTE INSUMOS FALTANTES A "LO QUE NECESITO"
        listaCompras.push({
            id: Date.now(),
            nombre: `Reponer: ${receta.ingredienteEstrella}`,
            comprado: false
        });

        renderizarDespensa();
        renderizarListaCompras();
        cerrarModalReceta();

        alert(`👨‍🍳 ¡Preparaste "${receta.titulo}"!\n\n1. Se restó "${receta.ingredienteEstrella}" de tu despensa.\n2. Se añadió a tu Lista de Compras para reponer.\n3. Ahorraste $4.000 COP y evitaste CO₂ 🎉`);
    };

    document.getElementById('modal-receta-detalle').classList.remove('hidden');
}

// FUNCIONES BÁSICAS DE NAVEGACIÓN Y DESPENSA
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
                    <button type="button" onclick="event.stopPropagation(); abrirRecetas()" class="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl shadow-sm active:scale-95 transition cursor-pointer">
                        ¿Qué cocinar?
                    </button>
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

function abrirRecetas() {
    ocultarTodasLasVistas();
    document.getElementById('vista-recetas')?.classList.remove('hidden');
    generarRecetasDinamicas();
}

function generarRecetasDinamicas() {
    const contenedor = document.getElementById('contenedor-recetas');
    const chipsCont = document.getElementById('chips-despensa-recetas');
    if (!contenedor) return;

    contenedor.innerHTML = '';
    if (chipsCont) chipsCont.innerHTML = '';

    if (inventario.length === 0) {
        if (chipsCont) chipsCont.innerHTML = `<span class="text-xs text-slate-400 italic">No hay ingredientes en tu despensa.</span>`;
        contenedor.innerHTML = `<div class="text-center py-8 text-slate-400 text-xs">Agrega alimentos en tu despensa para crear recetas automáticas 🎉</div>`;
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
                let tituloCompleto = `${plantilla.nombreBase} ${item.nombre}`;
                recetasGeneradas.push({
                    id: `${item.id}-${plantilla.idTipo}`,
                    titulo: tituloCompleto,
                    ingredienteEstrella: item.nombre,
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

    recetasGeneradas.sort((a, b) => a.diasRestantes - b.diasRestantes);

    recetasGeneradas.forEach(receta => {
        contenedor.innerHTML += `
            <div class="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm flex flex-col gap-2">
                <div class="flex gap-3 items-center">
                    <img src="${receta.imagen}" class="w-16 h-16 rounded-xl object-cover shadow-xs">
                    <div class="flex-1">
                        <div class="flex justify-between items-start gap-1">
                            <h4 class="text-xs font-bold text-slate-800">${receta.titulo}</h4>
                            ${receta.esUrgente ? '<span class="bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap">🔥 ¡Vence pronto!</span>' : ''}
                        </div>
                        <p class="text-[10px] text-slate-500 mt-0.5">Ingrediente principal: <b class="text-emerald-700">${receta.ingredienteEstrella}</b></p>
                        <div class="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                            <span>⏱️ ${receta.tiempo}</span>
                            <span>📊 ${receta.dificultad}</span>
                        </div>
                    </div>
                </div>
                <button type="button" onclick="verPasosRecetaDinamica('${receta.id}')" class="w-full bg-slate-100 hover:bg-emerald-50 text-emerald-800 font-bold text-[11px] py-1.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1">
                    <i class="fa-solid fa-book-open text-xs"></i> Ver Preparación
                </button>
            </div>
        `;
    });

    window.recetasGeneradasCache = recetasGeneradas;
}

function cerrarModalReceta() {
    document.getElementById('modal-receta-detalle').classList.add('hidden');
}

function filtrarCategoria(cat) {
    categoriaFiltro = cat;
    renderizarDespensa();
}

function abrirDetalleTab(id) {
    const item = inventario.find(i => i.id === id);
    if (!item) return;

    alimentoSeleccionadoId = id;
    document.getElementById('tab-detalle-nombre').textContent = item.nombre;
    document.getElementById('tab-detalle-cantidad').textContent = item.cantidad;
    document.getElementById('tab-detalle-dias-restantes').textContent = `${item.dias} días restantes para vencimiento`;
    
    const imgEl = document.getElementById('tab-detalle-img');
    if (imgEl) imgEl.src = item.imagen;

    ocultarTodasLasVistas();
    document.getElementById('vista-detalle-alimento')?.classList.remove('hidden');
}

function volverADespensa() {
    ocultarTodasLasVistas();
    document.getElementById('vista-despensa')?.classList.remove('hidden');
}

function ocultarTodasLasVistas() {
    document.getElementById('vista-auth')?.classList.add('hidden');
    document.getElementById('vista-despensa')?.classList.add('hidden');
    document.getElementById('vista-detalle-alimento')?.classList.add('hidden');
    document.getElementById('vista-lista-compras')?.classList.add('hidden');
    document.getElementById('vista-recetas')?.classList.add('hidden');
    document.getElementById('vista-donaciones')?.classList.add('hidden');
    document.getElementById('vista-gamificacion')?.classList.add('hidden');
}

function marcarComoConsumidoTab() {
    if (alimentoSeleccionadoId) {
        inventario = inventario.filter(i => i.id !== alimentoSeleccionadoId);
        sumarImpacto(0.8, 3500);
        renderizarDespensa();
        alert("¡Felicidades! Has evitado el desperdicio de este alimento. 🎉");
    }
    volverADespensa();
}

function donarAlimentoDetalle() {
    abrirMapaDonaciones();
}

function donarAlimentoGenerico() {
    abrirMapaDonaciones();
}

function recetaDesdeDetalle() {
    abrirRecetas();
}

// LISTA DE COMPRAS
function abrirListaCompras() {
    ocultarTodasLasVistas();
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

    listaCompras.forEach(item => {
        cont.innerHTML += `
            <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <label class="flex items-center gap-2 cursor-pointer flex-1 ${item.comprado ? 'line-through text-slate-400' : 'text-slate-800 font-semibold'}">
                    <input type="checkbox" ${item.comprado ? 'checked' : ''} onchange="toggleItemCompra(${item.id})" class="rounded text-emerald-600">
                    <span>${item.nombre}</span>
                </label>
                <button type="button" onclick="eliminarItemCompra(${item.id})" class="text-red-400 hover:text-red-600 px-1.5 py-1">
                    <i class="fa-solid fa-trash text-xs"></i>
                </button>
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

function abrirModalFiltros() { document.getElementById('modal-filtros')?.classList.remove('hidden'); }
function cerrarModalFiltros() { document.getElementById('modal-filtros')?.classList.add('hidden'); }
function cambiarOrden(orden) { ordenActual = orden; renderizarDespensa(); }

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
    document.getElementById('preview-foto')?.classList.add('hidden');
    document.getElementById('placeholder-foto')?.classList.remove('hidden');

    alert(`🥑 "${nom}" guardado correctamente.`);
}

function abrirModal(modo) {
    modoModal = modo || 'login';
    document.getElementById('modal-login')?.classList.remove('hidden');
}

function abrirLogin() { abrirModal('login'); }
function abrirRegistro() { abrirModal('registro'); }
function cerrarLogin() { document.getElementById('modal-login')?.classList.add('hidden'); }

function mostrarDespensa() {
    ocultarTodasLasVistas();
    document.getElementById('vista-despensa')?.classList.remove('hidden');
}

function cerrarSesion() {
    ocultarTodasLasVistas();
    document.getElementById('vista-auth')?.classList.remove('hidden');
}

function loginSocial(red) {
    alert(`Iniciando sesión con ${red}...`);
    cerrarLogin();
    mostrarDespensa();
}

function procesarFormulario(e) {
    if (e && e.preventDefault) e.preventDefault();
    cerrarLogin();
    mostrarDespensa();
    return false;
}

function abrirModalAgregar() { document.getElementById('modal-agregar')?.classList.remove('hidden'); }
function cerrarModalAgregar() { document.getElementById('modal-agregar')?.classList.add('hidden'); }

function obtenerUbicacion() {
    const badgeUbicacion = document.getElementById('badge-ubicacion');
    const textoCiudad = document.getElementById('texto-ciudad');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                if (textoCiudad) textoCiudad.textContent = `📍 Ubicación confirmada`;
                if (badgeUbicacion) badgeUbicacion.classList.remove('hidden');
            },
            () => alert("Por favor habilita el permiso de GPS.")
        );
    }
}
