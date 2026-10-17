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
