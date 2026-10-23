// ==========================================
// CONFIGURACIÓN Y SPRITES SVG DEL SR. BIGOTES
// ==========================================

// Funciones para generar las ilustraciones vectoriales (SVG) del Sr. Bigotes en tiempo real
function generarSVGBigotes(tipo) {
    const svgs = {
        // Día 1: Sr. Bigotes con la Zanahoria / Fuego
        zanahoria: `
            <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="88" rx="22" ry="5" fill="#e2e8f0" />
                <path d="M 32 45 C 32 30 40 20 50 20 C 60 20 68 30 68 45 C 68 62 62 80 50 80 C 38 80 32 62 32 45 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="2"/>
                <path d="M 38 28 C 30 10 20 12 28 2 C 38 -2 44 18 42 26 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="1.5"/>
                <path d="M 36 25 C 30 12 23 13 29 5 C 36 2 41 18 40 24 Z" fill="#fbcfe8"/>
                <path d="M 62 28 C 70 10 80 12 72 2 C 62 -2 56 18 58 26 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="1.5"/>
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

        // Día 2: Sr. Bigotes Saltando Feliz
        feliz: `
            <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="90" rx="16" ry="4" fill="#cbd5e1" opacity="0.5"/>
                <g transform="translate(0, -6)">
                    <path d="M 32 45 C 32 30 40 20 50 20 C 60 20 68 30 68 45 C 68 62 62 80 50 80 C 38 80 32 62 32 45 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="2"/>
                    <path d="M 38 28 C 30 10 20 12 28 2 C 38 -2 44 18 42 26 Z" fill="#ffffff" stroke="#f1f5f9"/>
                    <path d="M 36 25 C 30 12 23 13 29 5 C 36 2 41 18 40 24 Z" fill="#fbcfe8"/>
                    <path d="M 62 28 C 70 10 80 12 72 2 C 62 -2 56 18 58 26 Z" fill="#ffffff" stroke="#f1f5f9"/>
                    <path d="M 64 25 C 70 12 77 13 71 5 C 64 2 59 18 60 24 Z" fill="#fbcfe8"/>
                    <path d="M 40 40 Q 44 35 47 40" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
                    <path d="M 53 40 Q 56 35 60 40" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
                    <ellipse cx="50" cy="45" rx="2" ry="1.5" fill="#f43f5e"/>
                    <path d="M 44 48 Q 50 56 56 48 Z" fill="#1e293b"/>
                    <path d="M 47 50 Q 50 54 53 50" fill="#f43f5e"/>
                    <circle cx="35" cy="46" r="4" fill="#fda4af" opacity="0.7"/>
                    <circle cx="65" cy="46" r="4" fill="#fda4af" opacity="0.7"/>
                    <path d="M 44 54 L 56 54 L 50 59 Z" fill="#2563eb"/>
                    <circle cx="50" cy="54.5" r="2" fill="#1d4ed8"/>
                    <path d="M 28 50 Q 20 40 26 35" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
                    <path d="M 72 50 Q 80 40 74 35" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
                </g>
            </svg>`,

        // Día 3: Sr. Bigotes con Gafas de Sol
        lentes: `
            <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="88" rx="22" ry="5" fill="#e2e8f0" />
                <path d="M 32 45 C 32 30 40 20 50 20 C 60 20 68 30 68 45 C 68 62 62 80 50 80 C 38 80 32 62 32 45 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="2"/>
                <path d="M 38 28 C 30 10 20 12 28 2 C 38 -2 44 18 42 26 Z" fill="#ffffff" stroke="#f1f5f9"/>
                <path d="M 36 25 C 30 12 23 13 29 5 C 36 2 41 18 40 24 Z" fill="#fbcfe8"/>
                <path d="M 62 28 C 70 10 80 12 72 2 C 62 -2 56 18 58 26 Z" fill="#ffffff" stroke="#f1f5f9"/>
                <path d="M 64 25 C 70 12 77 13 71 5 C 64 2 59 18 60 24 Z" fill="#fbcfe8"/>
                <path d="M 35 38 L 65 38 L 62 48 L 38 48 Z" fill="#0f172a"/>
                <path d="M 33 39 L 67 39" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
                <path d="M 38 41 L 44 47" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>
                <path d="M 52 41 L 58 47" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>
                <ellipse cx="50" cy="51" rx="2" ry="1.5" fill="#f43f5e"/>
                <path d="M 46 54 Q 50 57 54 54" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M 44 58 L 56 58 L 50 63 Z" fill="#2563eb"/>
            </svg>`,

        // Día 4: Sr. Bigotes con Corazón
        corazon: `
            <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="88" rx="22" ry="5" fill="#e2e8f0" />
                <path d="M 32 45 C 32 30 40 20 50 20 C 60 20 68 30 68 45 C 68 62 62 80 50 80 C 38 80 32 62 32 45 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="2"/>
                <path d="M 38 28 C 30 10 20 12 28 2 C 38 -2 44 18 42 26 Z" fill="#ffffff"/>
                <path d="M 36 25 C 30 12 23 13 29 5 C 36 2 41 18 40 24 Z" fill="#fbcfe8"/>
                <path d="M 62 28 C 70 10 80 12 72 2 C 62 -2 56 18 58 26 Z" fill="#ffffff"/>
                <path d="M 64 25 C 70 12 77 13 71 5 C 64 2 59 18 60 24 Z" fill="#fbcfe8"/>
                <path d="M 40 40 Q 44 35 47 40" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M 53 40 Q 56 35 60 40" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
                <ellipse cx="50" cy="45" rx="2" ry="1.5" fill="#f43f5e"/>
                <path d="M 46 48 Q 50 51 54 48" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="36" cy="46" r="3.5" fill="#fda4af" opacity="0.6"/>
                <circle cx="64" cy="46" r="3.5" fill="#fda4af" opacity="0.6"/>
                <path d="M 50 60 C 40 50 35 62 43 72 L 50 78 L 57 72 C 65 62 60 50 50 60 Z" fill="#f43f5e"/>
            </svg>`,

        // Día 5: Sr. Bigotes Deportivo
        deporte: `
            <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="88" rx="22" ry="5" fill="#e2e8f0" />
                <path d="M 32 45 C 32 30 40 20 50 20 C 60 20 68 30 68 45 C 68 62 62 80 50 80 C 38 80 32 62 32 45 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="2"/>
                <path d="M 38 28 C 30 10 20 12 28 2 C 38 -2 44 18 42 26 Z" fill="#ffffff"/>
                <path d="M 36 25 C 30 12 23 13 29 5 C 36 2 41 18 40 24 Z" fill="#fbcfe8"/>
                <path d="M 62 28 C 70 10 80 12 72 2 C 62 -2 56 18 58 26 Z" fill="#ffffff"/>
                <path d="M 64 25 C 70 12 77 13 71 5 C 64 2 59 18 60 24 Z" fill="#fbcfe8"/>
                <path d="M 32 28 C 42 26 58 26 68 28 C 69 32 68 34 68 34 C 58 32 42 32 32 34 C 32 34 31 32 32 28 Z" fill="#0284c7"/>
                <circle cx="43" cy="42" r="3.5" fill="#1e293b"/>
                <path d="M 53 43 L 61 39" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
                <ellipse cx="50" cy="47" rx="2" ry="1.5" fill="#f43f5e"/>
                <path d="M 46 50 Q 50 54 54 50" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M 44 54 L 56 54 L 50 59 Z" fill="#2563eb"/>
            </svg>`,

        // Día 6: Sr. Bigotes Leyendo Libro
        lectura: `
            <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="88" rx="22" ry="5" fill="#e2e8f0" />
                <path d="M 32 45 C 32 30 40 20 50 20 C 60 20 68 30 68 45 C 68 62 62 80 50 80 C 38 80 32 62 32 45 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="2"/>
                <path d="M 38 28 C 30 10 20 12 28 2 C 38 -2 44 18 42 26 Z" fill="#ffffff"/>
                <path d="M 36 25 C 30 12 23 13 29 5 C 36 2 41 18 40 24 Z" fill="#fbcfe8"/>
                <path d="M 62 28 C 70 10 80 12 72 2 C 62 -2 56 18 58 26 Z" fill="#ffffff"/>
                <path d="M 64 25 C 70 12 77 13 71 5 C 64 2 59 18 60 24 Z" fill="#fbcfe8"/>
                <ellipse cx="43" cy="43" rx="3" ry="4" fill="#1e293b"/>
                <ellipse cx="57" cy="43" rx="3" ry="4" fill="#1e293b"/>
                <ellipse cx="50" cy="48" rx="2" ry="1.5" fill="#f43f5e"/>
                <path d="M 46 52 Q 50 55 54 52" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M 32 65 L 50 72 L 68 65 L 68 78 L 50 84 L 32 78 Z" fill="#1d4ed8"/>
                <path d="M 35 63 L 49 68 L 49 80 L 35 75 Z" fill="#ffffff"/>
                <path d="M 65 63 L 51 68 L 51 80 L 65 75 Z" fill="#ffffff"/>
            </svg>`,

        // Día 7: Sr. Bigotes Aventurero con Mochila
        mochila: `
            <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="88" rx="22" ry="5" fill="#e2e8f0" />
                <path d="M 60 48 C 60 48 78 50 75 72 C 72 82 62 80 60 80 Z" fill="#2563eb"/>
                <path d="M 32 45 C 32 30 40 20 50 20 C 60 20 68 30 68 45 C 68 62 62 80 50 80 C 38 80 32 62 32 45 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="2"/>
                <path d="M 38 28 C 30 10 20 12 28 2 C 38 -2 44 18 42 26 Z" fill="#ffffff"/>
                <path d="M 36 25 C 30 12 23 13 29 5 C 36 2 41 18 40 24 Z" fill="#fbcfe8"/>
                <path d="M 62 28 C 70 10 80 12 72 2 C 62 -2 56 18 58 26 Z" fill="#ffffff"/>
                <path d="M 64 25 C 70 12 77 13 71 5 C 64 2 59 18 60 24 Z" fill="#fbcfe8"/>
                <circle cx="43" cy="42" r="3.5" fill="#1e293b"/>
                <circle cx="57" cy="42" r="3.5" fill="#1e293b"/>
                <ellipse cx="50" cy="47" rx="2" ry="1.5" fill="#f43f5e"/>
                <path d="M 46 50 Q 50 54 54 50" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M 44 54 L 56 54 L 50 59 Z" fill="#0284c7"/>
            </svg>`
    };

    return svgs[tipo] || svgs.zanahoria;
}

// Configuración de rachas asociadas a los SVG
const spritesSrBigotes = {
    1: {
        tipo: 'zanahoria',
        bgCard: 'bg-amber-50 border-amber-300',
        mensaje: '"¡Bienvenido! Hoy empieza tu racha con la zanahoria del ahorro."'
    },
    2: {
        tipo: 'feliz',
        bgCard: 'bg-emerald-50 border-emerald-300',
        mensaje: '"¡2 días seguidos! Estás salvando comida como un profesional."'
    },
    3: {
        tipo: 'lentes',
        bgCard: 'bg-indigo-50 border-indigo-300',
        mensaje: '"¡3 días de racha! ¡Qué estilo tienes para no desperdiciar nada!"'
    },
    4: {
        tipo: 'corazon',
        bgCard: 'bg-pink-50 border-pink-300',
        mensaje: '"¡4 días! El planeta y tu bolsillo te lo agradecen mucho."'
    },
    5: {
        tipo: 'deporte',
        bgCard: 'bg-blue-50 border-blue-300',
        mensaje: '"¡5 días en racha! Tu disciplina de consumo es imbatible."'
    },
    6: {
        tipo: 'lectura',
        bgCard: 'bg-purple-50 border-purple-300',
        mensaje: '"¡6 días consecutivos! Ya eres todo un experto en desperdicio cero."'
    },
    7: {
        tipo: 'mochila',
        bgCard: 'bg-teal-50 border-teal-300',
        mensaje: '"¡UNA SEMANA ENTERA! 🎉 ¡Logro legendario con el Sr. Bigotes!"'
    }
};

// ==========================================
// FUNCIÓN ACTUALIZADA DE RACHA DIARIA
// ==========================================
function actualizarRachaDiaria() {
    const hoyStr = new Date().toISOString().split('T')[0];
    let rachaActual = parseInt(localStorage.getItem(`nowaste_racha_count_${usuarioActual}`)) || 1;
    let ultimaFecha = localStorage.getItem(`nowaste_racha_fecha_${usuarioActual}`);

    if (ultimaFecha && ultimaFecha !== hoyStr) {
        const fechaUltima = new Date(ultimaFecha);
        const fechaHoy = new Date(hoyStr);
        const diffDias = Math.floor((fechaHoy - fechaUltima) / (1000 * 60 * 60 * 24));

        if (diffDias === 1) {
            rachaActual++;
        } else if (diffDias > 1) {
            rachaActual = 1;
        }
        localStorage.setItem(`nowaste_racha_count_${usuarioActual}`, rachaActual);
        localStorage.setItem(`nowaste_racha_fecha_${usuarioActual}`, hoyStr);
    } else if (!ultimaFecha) {
        localStorage.setItem(`nowaste_racha_count_${usuarioActual}`, 1);
        localStorage.setItem(`nowaste_racha_fecha_${usuarioActual}`, hoyStr);
    }

    const diaClave = ((rachaActual - 1) % 7) + 1;
    const configRacha = spritesSrBigotes[diaClave] || spritesSrBigotes[1];

    const numEl = document.getElementById('racha-dias-numero');
    const msgEl = document.getElementById('sr-bigotes-mensaje');
    const spriteContainer = document.getElementById('sr-bigotes-sprite')?.parentElement;
    const cardEl = document.getElementById('racha-card');
    const notiEl = document.getElementById('sr-bigotes-noticall');

    if (numEl) numEl.textContent = rachaActual;
    if (msgEl) msgEl.textContent = configRacha.mensaje;
    
    // Inyección limpia del vector SVG vectorial sin rutas rotas
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
