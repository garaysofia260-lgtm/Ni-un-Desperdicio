// Variables globales
let modoModal = 'login';
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

let listaCompras = [
    { id: 101, nombre: 'Huevos docena', comprado: false },
    { id: 102, nombre: 'Queso Parmesano', comprado: false }
];

// Base de datos de recetas de aprovechamiento con lista de ingredientes
let recetasBase = [
    {
        id: 1,
        titulo: 'Batido de Plátano y Leche',
        ingredientes: ['Plátanos Maduros', 'Leche Entera', 'Miel'],
        tiempo: '5 min',
        dificultad: 'Fácil',
        imagen: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500',
        pasos: [
            'Licúa los plátanos maduros con la leche fría.',
            'Agrega una cucharadita de miel o canela al gusto.',
            'Sirve inmediatamente bien frío.'
        ]
    },
    {
        id: 2,
        titulo: 'Salsa Casera de Tomate',
        ingredientes: ['Tomates Frescos', 'Ajo', 'Aceite de oliva'],
        tiempo: '15 min',
        dificultad: 'Fácil',
        imagen: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500',
        pasos: [
            'Pica los tomates y saltea con ajo picado en aceite de oliva.',
            'Cocina a fuego lento durante 10 a 12 minutos.',
            'Sazona con sal, pimienta y sal al gusto.'
        ]
    },
    {
        id: 3,
        titulo: 'Guacamole Express de Rescate',
        ingredientes: ['Aguacates', 'Tomates Frescos', 'Limón'],
        tiempo: '8 min',
        dificultad: 'Fácil',
        imagen: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
        pasos: [
            'Tritura los aguacates maduros en un tazón.',
            'Agrega tomates en cubitos, un chorrito de limón y sal.',
            'Mezcla y sirve con nachos o tostadas.'
        ]
    },
    {
        id: 4,
        titulo: 'Tortilla de Verduras y Tomate',
        ingredientes: ['Tomates Frescos', 'Huevos', 'Cebolla'],
        tiempo: '12 min',
        dificultad: 'Fácil',
        imagen: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500',
        pasos: [
            'Pica las verduras y sofríelas 5 minutos.',
            'Bate 2-3 huevos y viértelos sobre las verduras.',
            'Cocina por ambos lados hasta dorar.'
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    renderizarDespensa();
    renderizarListaCompras();
});

// RENDERIZAR INVENTARIO
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

// MÓDULO DE RECETAS BASADO EN DESPENSA EN TIEMPO REAL
function abrirRecetas() {
    ocultarTodasLasVistas();
    document.getElementById('vista-recetas')?.classList.remove('hidden');
    renderizarRecetasDinamicas();
}

function renderizarRecetasDinamicas() {
    const contenedor = document.getElementById('contenedor-recetas');
    const chipsCont = document.getElementById('chips-despensa-recetas');
    if (!contenedor) return;

    contenedor.innerHTML = '';
    if (chipsCont) chipsCont.innerHTML = '';

    // Muestra los ingredientes actuales en forma de etiquetas
    if (inventario.length === 0) {
        if (chipsCont) chipsCont.innerHTML = `<span class="text-xs text-slate-400 italic">Tu despensa está vacía</span>`;
    } else {
        inventario.forEach(i => {
            if (chipsCont) {
                chipsCont.innerHTML += `
                    <span class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        ${i.pronto ? '🔴' : '🟢'} ${i.nombre}
                    </span>
                `;
            }
        });
    }

    // Algoritmo: Analiza coincidencias con la despensa
    const recetasEvaluadas = recetasBase.map(receta => {
        let coincidencias = 0;
        let tieneUrgente = false;

        receta.ingredientes.forEach(ing => {
            const encontrado = inventario.find(inv => inv.nombre.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(inv.nombre.toLowerCase()));
            if (encontrado) {
                coincidencias++;
                if (encontrado.pronto) tieneUrgente = true;
            }
        });

        const porcentajeMatch = Math.round((coincidencias / receta.ingredientes.length) * 100);

        return {
            ...receta,
            coincidencias,
            porcentajeMatch,
            tieneUrgente
        };
    });

    // Ordenar: Primero recetas con insumos urgentes, luego por mayor % de ingredientes disponibles
    recetasEvaluadas.sort((a, b) => {
        if (a.tieneUrgente !== b.tieneUrgente) return b.tieneUrgente ? 1 : -1;
        return b.porcentajeMatch - a.porcentajeMatch;
    });

    // Renderizar tarjetas
    recetasEvaluadas.forEach(receta => {
        contenedor.innerHTML += `
            <div class="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm flex flex-col gap-2">
                <div class="flex gap-3 items-center">
                    <img src="${receta.imagen}" class="w-16 h-16 rounded-xl object-cover shadow-xs">
                    <div class="flex-1">
                        <div class="flex justify-between items-start gap-1">
                            <h4 class="text-xs font-bold text-slate-800">${receta.titulo}</h4>
                            <span class="${receta.porcentajeMatch > 50 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'} text-[9px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap">
                                ${receta.porcentajeMatch}% de insumos
                            </span>
                        </div>
                        <p class="text-[10px] text-slate-500 mt-0.5">Usa: ${receta.ingredientes.join(', ')}</p>
                        <div class="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                            <span>⏱️ ${receta.tiempo}</span>
                            <span>📊 ${receta.dificultad}</span>
                            ${receta.tieneUrgente ? '<span class="text-red-600 font-bold">🔥 Rescata ingrediente</span>' : ''}
                        </div>
                    </div>
                </div>
                <button type="button" onclick="verDetalleReceta(${receta.id})" class="w-full bg-slate-100 hover:bg-emerald-50 text-emerald-800 font-bold text-[11px] py-1.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1">
                    <i class="fa-solid fa-book-open text-xs"></i> Ver Preparación Completa
                </button>
            </div>
        `;
    });
}

function verDetalleReceta(id) {
    const receta = recetasBase.find(r => r.id === id);
    if (!receta) return;

    document.getElementById('modal-receta-img').src = receta.imagen;
    document.getElementById('modal-receta-titulo').textContent = receta.titulo;
    document.getElementById('modal-receta-meta').innerHTML = `
        <span>⏱️ Tiempo: ${receta.tiempo}</span>
        <span>📊 Dificultad: ${receta.dificultad}</span>
    `;

    const ingList = document.getElementById('modal-receta-ingredientes');
    ingList.innerHTML = '';
    receta.ingredientes.forEach(ing => {
        const disponible = inventario.some(i => i.nombre.toLowerCase().includes(ing.toLowerCase()));
        ingList.innerHTML += `
            <li class="flex items-center gap-2 ${disponibles ? 'text-emerald-700 font-semibold' : 'text-slate-500'}">
                <i class="fa-solid ${disponible ? 'fa-circle-check text-emerald-600' : 'fa-circle-minus text-slate-300'} text-xs"></i>
                <span>${ing} ${disponible ? '(En despensa)' : '(Te falta)'}</span>
            </li>
        `;
    });

    const pasosList = document.getElementById('modal-receta-pasos');
    pasosList.innerHTML = '';
    receta.pasos.forEach(p => {
        pasosList.innerHTML += `<li>${p}</li>`;
    });

    const btnCocinar = document.getElementById('btn-cocinar-receta');
    btnCocinar.onclick = () => {
        alert(`🎉 ¡Felicidades! Preparaste "${receta.titulo}".`);
        cerrarModalReceta();
    };

    document.getElementById('modal-receta-detalle').classList.remove('hidden');
}

function cerrarModalReceta() {
    document.getElementById('modal-receta-detalle').classList.add('hidden');
}

// BÚSQUEDA Y FILTROS POR CATEGORÍA/TIPO/UBICACIÓN
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

function filtrarTipo(tipo) {
    tipoFiltro = tipo;
    const contenedor = document.getElementById('contenedor-filtros-tipo');
    if (contenedor) {
        const botones = contenedor.querySelectorAll('button');
        botones.forEach(b => {
            if (b.getAttribute('onclick').includes(`'${tipo}'`)) {
                b.className = "btn-tipo px-2.5 py-1 rounded-lg bg-[#3b630b] font-bold text-white whitespace-nowrap shadow-xs cursor-pointer";
            } else {
                b.className = "btn-tipo px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 whitespace-nowrap cursor-pointer";
            }
        });
    }
    renderizarDespensa();
}

function filtrarUbicacion(ub) {
    ubicacionFiltro = ub;
    const contenedor = document.getElementById('contenedor-filtros-ubicacion');
    if (contenedor) {
        const botones = contenedor.querySelectorAll('button');
        botones.forEach(b => {
            if (b.getAttribute('onclick').includes(`'${ub}'`)) {
                b.className = "btn-ubicacion px-2.5 py-1 rounded-lg bg-[#3b630b] font-bold text-white shadow-xs cursor-pointer";
            } else {
                b.className = "btn-ubicacion px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 cursor-pointer";
            }
        });
    }
    renderizarDespensa();
}

// PESTAÑA DEDICADA DE DETALLE DEL ALIMENTO
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
    const estadoTxt = document.getElementById('tab-detalle-estado');

    if (barEl) barEl.style.width = `${pct}%`;
    if (pctTxt) pctTxt.textContent = `${pct}% Fresco`;

    if (pct > 50) {
        if (barEl) barEl.className = "h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-500 shadow-sm";
        if (badgeEl) { badgeEl.textContent = 'Fresco 🟢'; badgeEl.className = "absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-md bg-emerald-600"; }
        if (estadoTxt) estadoTxt.textContent = "Óptimo estado";
    } else if (pct > 20) {
        if (barEl) barEl.className = "h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500 shadow-sm";
        if (badgeEl) { badgeEl.textContent = 'Consumir pronto 🟡'; badgeEl.className = "absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-md bg-amber-600"; }
        if (estadoTxt) estadoTxt.textContent = "Atención requerida";
    } else {
        if (barEl) barEl.className = "h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500 shadow-sm";
        if (badgeEl) { badgeEl.textContent = '¡Urgente! 🔴'; badgeEl.className = "absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-md bg-red-600"; }
        if (estadoTxt) estadoTxt.textContent = "Prioridad máxima";
    }

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
}

// FUNCIONES DE ACCIONES
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

function donarAlimentoGenerico() {
    alert("🤝 Red de Donación: Selecciona un alimento de tu despensa para publicarlo en el mapa de recolección.");
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

    if (listaCompras.length === 0) {
        cont.innerHTML = `<p class="text-xs text-slate-400 text-center py-4">Tu lista está vacía 🎉</p>`;
        return;
    }

    listaCompras.forEach(item => {
        cont.innerHTML += `
            <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <label class="flex items-center gap-2 cursor-pointer flex-1 ${item.comprado ? 'line-through text-slate-400' : 'text-slate-800 font-semibold'}">
                    <input type="checkbox" ${item.comprado ? 'checked' : ''} onchange="toggleItemCompra(${item.id})" class="rounded text-emerald-600">
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
        renderizarListaCompras();
        renderizarDespensa();
        alert(`🛒 ¡"${item.nombre}" se movió a tu Despensa!`);
    }
}

// MODALES Y UTILIDADES
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
}

// INICIO DE SESIÓN
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
    ocultarTodasLasVistas();
    document.getElementById('vista-despensa')?.classList.remove('hidden');
}

function cerrarSesion() {
    ocultarTodasLasVistas();
    document.getElementById('vista-auth')?.classList.remove('hidden');
}

function loginSocial(red) {
    alert(`Iniciando sesión con ${red}... ¡Bienvenido a NO WASTE!`);
    cerrarLogin();
    mostrarDespensa();
}

function procesarFormulario(e) {
    if (e && e.preventDefault) e.preventDefault();
    
    const email = document.getElementById('input-login-email')?.value.trim();
    if (email) {
        const saludo = document.getElementById('saludo-usuario');
        if (saludo) saludo.textContent = `¡Hola, ${email.split('@')[0]}! 👋`;
    }

    cerrarLogin();
    mostrarDespensa();
    return false;
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
