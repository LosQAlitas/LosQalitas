// ==========================================
// LOS +QALITAS
// PANEL DEL EQUIPO
// AUTENTICACIÓN CON CLOUDFLARE WORKER
// ==========================================

const API_URL = 'https://losqalitas-api.traposyayomexico.workers.dev';

// ==========================================
// ELEMENTOS
// ==========================================

const pantallaLogin = document.getElementById('pantalla-login');

const panelEquipo = document.getElementById('panel-equipo');

const formLogin = document.getElementById('form-login');

const usuarioInput = document.getElementById('usuario');

const passwordInput = document.getElementById('password');

const mensajeLogin = document.getElementById('mensaje-login');

const usuarioActivo = document.getElementById('usuario-activo');

const btnSalir = document.getElementById('btn-salir');

const listaPedidos = document.getElementById('lista-pedidos-equipo');

const contadorNuevos = document.getElementById('contador-nuevos');

const contadorPreparando = document.getElementById('contador-preparando');

const contadorListos = document.getElementById('contador-listos');

const botonesFiltro = document.querySelectorAll('.filtro');

// ==========================================
// SESIÓN
// ==========================================

let tokenSesion = sessionStorage.getItem('losqalitas_token');

let usuarioActual = null;

let filtroActual = 'todos';

let pedidos = [];
// ==========================================
// SONIDO DE PEDIDOS NUEVOS
// ==========================================

let pedidosConocidos = new Set();

let primeraCargaPedidos = true;

let audioContext = null;

// ==========================================
// ACTIVAR AUDIO
// ==========================================

function activarAudio() {
  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (AudioContext) {
      audioContext = new AudioContext();
    }
  }

  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

// ==========================================
// SONIDO + VOZ DE NUEVO PEDIDO
// ==========================================

function reproducirSonidoNuevoPedido() {
  // ------------------------------------------
  // SONIDO DE AVISO
  // ------------------------------------------

  activarAudio();

  if (audioContext) {
    const ahora = audioContext.currentTime;

    const oscilador = audioContext.createOscillator();

    const ganancia = audioContext.createGain();

    oscilador.type = 'sine';

    oscilador.frequency.setValueAtTime(659, ahora);

    oscilador.frequency.setValueAtTime(880, ahora + 0.12);

    oscilador.frequency.setValueAtTime(1046, ahora + 0.24);

    ganancia.gain.setValueAtTime(0, ahora);

    ganancia.gain.linearRampToValueAtTime(0.28, ahora + 0.02);

    ganancia.gain.linearRampToValueAtTime(0, ahora + 0.42);

    oscilador.connect(ganancia);

    ganancia.connect(audioContext.destination);

    oscilador.start(ahora);

    oscilador.stop(ahora + 0.42);
  }

  // ------------------------------------------
  // VOZ
  // ------------------------------------------

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();

    const mensaje = new SpeechSynthesisUtterance('¡Pedido recibido!');

    mensaje.lang = 'es-MX';

    mensaje.rate = 0.95;

    mensaje.pitch = 1.05;

    mensaje.volume = 1;

    window.speechSynthesis.speak(mensaje);
  }
}

// ==========================================
// HEADERS AUTENTICADOS
// ==========================================

function headersAutenticados() {
  return {
    'Content-Type': 'application/json',

    Authorization: `Bearer ${tokenSesion}`,
  };
}

// ==========================================
// LOGIN
// ==========================================

formLogin.addEventListener('submit', async (event) => {
  event.preventDefault();

  const usuario = usuarioInput.value.trim();

  const password = passwordInput.value;

  mensajeLogin.textContent = '';

  if (!usuario || !password) {
    mensajeLogin.textContent = 'Escribe usuario y contraseña.';

    return;
  }

  const boton = formLogin.querySelector('.btn-login');

  if (boton) {
    boton.disabled = true;

    boton.textContent = 'Entrando...';
  }

  try {
    const respuesta = await fetch(`${API_URL}/login`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        usuario,
        password,
      }),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok || !resultado.ok || !resultado.token) {
      throw new Error(resultado.error || 'Usuario o contraseña incorrectos.');
    }

    tokenSesion = resultado.token;

    usuarioActual = resultado.usuario;

    sessionStorage.setItem('losqalitas_token', tokenSesion);

    mostrarPanel();
  } catch (error) {
    console.error('❌ Error en login:', error);

    mensajeLogin.textContent = error.message || 'No se pudo iniciar sesión.';
  } finally {
    if (boton) {
      boton.disabled = false;

      boton.textContent = 'Entrar';
    }
  }
});

// ==========================================
// MOSTRAR PANEL
// ==========================================

function mostrarPanel() {
  activarAudio();
  pantallaLogin.classList.add('oculto');

  panelEquipo.classList.remove('oculto');

  if (usuarioActual) {
    usuarioActivo.textContent = `👤 ${usuarioActual.nombre}`;
  }

  formLogin.reset();

  mensajeLogin.textContent = '';

  cargarPedidos();
}

// ==========================================
// COMPROBAR SESIÓN AL ABRIR
// ==========================================

async function comprobarSesion() {
  if (!tokenSesion) {
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${tokenSesion}`,
      },
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok || !resultado.ok) {
      throw new Error('Sesión inválida');
    }

    usuarioActual = resultado.usuario;

    mostrarPanel();
  } catch (error) {
    cerrarSesionLocal();
  }
}

// ==========================================
// CERRAR SESIÓN
// ==========================================

btnSalir.addEventListener('click', async () => {
  try {
    if (tokenSesion) {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${tokenSesion}`,
        },
      });
    }
  } catch (error) {
    console.warn('No se pudo cerrar sesión en el servidor.', error);
  }

  cerrarSesionLocal();
});

// ==========================================
// CERRAR SESIÓN LOCAL
// ==========================================

function cerrarSesionLocal() {
  tokenSesion = null;

  usuarioActual = null;

  pedidos = [];

  sessionStorage.removeItem('losqalitas_token');

  panelEquipo.classList.add('oculto');

  pantallaLogin.classList.remove('oculto');

  mensajeLogin.textContent = '';

  renderizarPedidos();
}

// ==========================================
// CARGAR PEDIDOS
// ==========================================

async function cargarPedidos() {
  if (!tokenSesion) {
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/pedidos`, {
      headers: headersAutenticados(),
    });

    const resultado = await respuesta.json();

    // ======================================
    // SESIÓN EXPIRADA
    // ======================================

    if (respuesta.status === 401) {
      cerrarSesionLocal();

      return;
    }

    // ======================================
    // ERROR
    // ======================================

    if (!respuesta.ok || !resultado.ok) {
      throw new Error(resultado.error || 'No se pudieron cargar los pedidos.');
    }

    // ======================================
    // PEDIDOS RECIBIDOS
    // ======================================

    const pedidosNuevos = Array.isArray(resultado.pedidos) ? resultado.pedidos : [];

    // ======================================
    // DETECTAR PEDIDO NUEVO
    // ======================================

    if (!primeraCargaPedidos) {
      const hayPedidoNuevo = pedidosNuevos.some((pedido) => {
        return pedido.estado === 'nuevo' && !pedidosConocidos.has(Number(pedido.id));
      });

      if (hayPedidoNuevo) {
        reproducirSonidoNuevoPedido();
      }
    }

    // ======================================
    // COMPROBAR SI CAMBIÓ ALGO
    // ======================================

    const huboCambios = JSON.stringify(pedidos) !== JSON.stringify(pedidosNuevos);

    // ======================================
    // PRIMERA CARGA
    // ======================================

    if (primeraCargaPedidos) {
      // Guardamos como conocidos
      // todos los pedidos que ya existían

      pedidosNuevos.forEach((pedido) => {
        pedidosConocidos.add(Number(pedido.id));
      });

      primeraCargaPedidos = false;

      pedidos = pedidosNuevos;

      renderizarPedidos();

      return;
    }

    // ======================================
    // SI NO CAMBIÓ NADA
    // ======================================

    if (!huboCambios) {
      return;
    }

    // ======================================
    // GUARDAR NUEVOS PEDIDOS COMO CONOCIDOS
    // ======================================

    pedidosNuevos.forEach((pedido) => {
      pedidosConocidos.add(Number(pedido.id));
    });

    // ======================================
    // GUARDAR POSICIÓN DEL SCROLL
    // ======================================

    const scrollY = window.scrollY;

    // ======================================
    // ACTUALIZAR PEDIDOS
    // ======================================

    pedidos = pedidosNuevos;

    // ======================================
    // REDIBUJAR
    // ======================================

    renderizarPedidos();

    // ======================================
    // RESTAURAR POSICIÓN
    // ======================================

    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  } catch (error) {
    console.error('❌ Error cargando pedidos:', error);

    // No destruimos una lista que ya
    // está funcionando solamente porque
    // falló una actualización automática.

    if (pedidos.length === 0) {
      listaPedidos.innerHTML = `

        <div class="sin-pedidos">

          <div class="sin-pedidos-icono">
            ⚠️
          </div>

          <h2>
            No se pudieron cargar
          </h2>

          <p>
            Revisa la conexión con el servidor.
          </p>

        </div>

      `;
    }
  }
}

// ==========================================
// RENDERIZAR PEDIDOS
// ==========================================

function renderizarPedidos() {
  actualizarContadores();

  const pedidosFiltrados = pedidos.filter((pedido) => {
    if (filtroActual === 'todos') {
      return true;
    }

    return pedido.estado === filtroActual;
  });

  if (pedidosFiltrados.length === 0) {
    listaPedidos.innerHTML = `

      <div class="sin-pedidos">

        <div class="sin-pedidos-icono">
          📦
        </div>

        <h2>
          No hay pedidos
        </h2>

        <p>
          No hay pedidos que coincidan con este filtro.
        </p>

      </div>

    `;

    return;
  }

  listaPedidos.innerHTML = '';

  pedidosFiltrados.forEach((pedido) => {
    listaPedidos.appendChild(crearTarjetaPedido(pedido));
  });
}

// ==========================================
// CREAR TARJETA DE PEDIDO
// ==========================================

function crearTarjetaPedido(pedido) {
  const tarjeta = document.createElement('article');

  tarjeta.className = 'pedido-card';

  const estado = pedido.estado || 'nuevo';

  const productos = obtenerProductos(pedido.productos);

  const fecha = formatearFecha(pedido.creado_en);

  tarjeta.innerHTML = `

    <div class="pedido-card-header">

      <h2 class="pedido-numero">
        #${pedido.numero_pedido}
      </h2>

      <div class="pedido-fecha">
        ${fecha}
      </div>

    </div>


    <div
      class="
        estado-badge
        estado-${estado}
      "
    >
      ${nombreEstado(estado)}
    </div>


    <div class="productos-pedido">

      ${productosHTML(productos)}

    </div>


    <div class="pedido-total">

      <span>
        Total
      </span>

      <strong>
        $${pedido.total}
      </strong>

    </div>


    <div class="acciones-pedido">

      ${botonesEstado(estado)}

    </div>

  `;

  tarjeta.querySelectorAll('[data-estado]').forEach((boton) => {
    boton.addEventListener('click', () => {
      cambiarEstado(pedido.id, boton.dataset.estado);
    });
  });

  return tarjeta;
}

// ==========================================
// PRODUCTOS
// ==========================================

function obtenerProductos(productos) {
  if (Array.isArray(productos)) {
    return productos;
  }

  try {
    const convertidos = JSON.parse(productos);

    if (Array.isArray(convertidos)) {
      return convertidos;
    }
  } catch (error) {
    console.warn('No se pudo leer productos:', error);
  }

  return [];
}

// ==========================================
// HTML DE PRODUCTOS
// ==========================================

function productosHTML(productos) {
  if (productos.length === 0) {
    return `

      <div class="producto-pedido">

        <strong>
          Sin productos
        </strong>

      </div>

    `;
  }

  return productos
    .map((producto) => {
      const detalle = producto.detalle ? producto.detalle : '';

      return `

          <div class="producto-pedido">

            <strong>
              ${escaparHTML(producto.nombre)}
            </strong>


            ${
              detalle
                ? `
                  <div class="producto-detalle">
                    ${escaparHTML(detalle)}
                  </div>
                `
                : ''
            }


            <div class="producto-detalle">

              Precio:
              $${Number(producto.precio || 0)}

            </div>

          </div>

        `;
    })
    .join('');
}

// ==========================================
// BOTONES DE ESTADO
// ==========================================

function botonesEstado(estado) {
  if (estado === 'nuevo') {
    return `

      <button
        type="button"
        class="
          accion-pedido
          accion-preparando
        "
        data-estado="preparando"
      >
        👨‍🍳 Preparando
      </button>

    `;
  }

  if (estado === 'preparando') {
    return `

      <button
        type="button"
        class="
          accion-pedido
          accion-listo
        "
        data-estado="listo"
      >
        ✅ Listo
      </button>

    `;
  }

  if (estado === 'listo') {
    return `

      <button
        type="button"
        class="
          accion-pedido
          accion-entregado
        "
        data-estado="entregado"
      >
        📦 Entregado
      </button>

    `;
  }

  return `

    <span
      style="
        color:#9d9d9d;
        font-size:13px;
        font-weight:700;
      "
    >
      Pedido completado
    </span>

  `;
}

// ==========================================
// NOMBRE DEL ESTADO
// ==========================================

function nombreEstado(estado) {
  if (estado === 'nuevo') {
    return '🆕 NUEVO';
  }

  if (estado === 'preparando') {
    return '👨‍🍳 PREPARANDO';
  }

  if (estado === 'listo') {
    return '✅ LISTO';
  }

  if (estado === 'entregado') {
    return '📦 ENTREGADO';
  }

  return estado.toUpperCase();
}

// ==========================================
// CONTADORES
// ==========================================

function actualizarContadores() {
  const nuevos = pedidos.filter((pedido) => pedido.estado === 'nuevo').length;

  const preparando = pedidos.filter((pedido) => pedido.estado === 'preparando').length;

  const listos = pedidos.filter((pedido) => pedido.estado === 'listo').length;

  const ventas = pedidos.filter((pedido) => pedido.estado === 'entregado').reduce((total, pedido) => total + Number(pedido.total || 0), 0);

  contadorNuevos.textContent = nuevos;

  contadorPreparando.textContent = preparando;

  contadorListos.textContent = listos;

  const contadorVentas = document.getElementById('contador-ventas');

  if (contadorVentas) {
    contadorVentas.textContent = `$${ventas}`;
  }
}
// ==========================================
// CAMBIAR ESTADO
// ==========================================

async function cambiarEstado(id, estado) {
  try {
    const respuesta = await fetch(`${API_URL}/actualizar-pedido`, {
      method: 'POST',

      headers: headersAutenticados(),

      body: JSON.stringify({
        id,
        estado,
      }),
    });

    const resultado = await respuesta.json();

    if (respuesta.status === 401) {
      cerrarSesionLocal();

      return;
    }

    if (!respuesta.ok || !resultado.ok) {
      throw new Error(resultado.error || 'No se pudo actualizar el pedido.');
    }

    const pedidoEncontrado = pedidos.find((pedido) => Number(pedido.id) === Number(id));

    if (pedidoEncontrado) {
      pedidoEncontrado.estado = estado;
    }

    renderizarPedidos();
  } catch (error) {
    console.error('❌ Error actualizando pedido:', error);

    alert('No se pudo actualizar el pedido.');
  }
}

// ==========================================
// FILTROS
// ==========================================

botonesFiltro.forEach((boton) => {
  boton.addEventListener('click', () => {
    botonesFiltro.forEach((otroBoton) => {
      otroBoton.classList.remove('activo');
    });

    boton.classList.add('activo');

    filtroActual = boton.dataset.filtro;

    renderizarPedidos();
  });
});

// ==========================================
// ACTUALIZACIÓN AUTOMÁTICA
// ==========================================

setInterval(() => {
  if (tokenSesion && !panelEquipo.classList.contains('oculto')) {
    cargarPedidos();
  }
}, 10000);

// ==========================================
// FECHA
// ==========================================

function formatearFecha(fecha) {
  if (!fecha) {
    return '';
  }

  const fechaObjeto = new Date(fecha.replace(' ', 'T'));

  if (Number.isNaN(fechaObjeto.getTime())) {
    return fecha;
  }

  return fechaObjeto.toLocaleString('es-MX', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

// ==========================================
// SEGURIDAD BÁSICA PARA TEXTO
// ==========================================

function escaparHTML(texto) {
  return String(texto).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

// ==========================================
// INICIAR
// ==========================================

comprobarSesion();
