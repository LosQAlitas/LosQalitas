// ==========================================
// LOS +QALITAS
// PANEL DEL EQUIPO
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
// SESIÓN TEMPORAL
// ==========================================

let usuarioActual = '';

let filtroActual = 'todos';

let pedidos = [];

// ==========================================
// LOGIN DE PRUEBA
// ==========================================

// IMPORTANTE:
// Esto es solamente para probar el panel.
// Después lo reemplazaremos por
// Cloudflare Access.

const USUARIO_PRUEBA = 'yayo';

const PASSWORD_PRUEBA = 'qalitas123';

// ==========================================
// LOGIN
// ==========================================

formLogin.addEventListener('submit', (event) => {
  event.preventDefault();

  const usuario = usuarioInput.value.trim();

  const password = passwordInput.value;

  if (usuario === USUARIO_PRUEBA && password === PASSWORD_PRUEBA) {
    iniciarSesion(usuario);

    return;
  }

  mensajeLogin.textContent = 'Usuario o contraseña incorrectos.';
});

// ==========================================
// INICIAR SESIÓN
// ==========================================

function iniciarSesion(usuario) {
  usuarioActual = usuario;

  usuarioActivo.textContent = `👤 ${usuario}`;

  pantallaLogin.classList.add('oculto');

  panelEquipo.classList.remove('oculto');

  mensajeLogin.textContent = '';

  formLogin.reset();

  cargarPedidos();
}

// ==========================================
// CERRAR SESIÓN
// ==========================================

btnSalir.addEventListener('click', () => {
  usuarioActual = '';

  panelEquipo.classList.add('oculto');

  pantallaLogin.classList.remove('oculto');

  pedidos = [];

  renderizarPedidos();
});

// ==========================================
// CARGAR PEDIDOS
// ==========================================

async function cargarPedidos() {
  listaPedidos.innerHTML = `

    <div class="sin-pedidos">

      <div class="sin-pedidos-icono">
        ⏳
      </div>

      <h2>
        Cargando pedidos...
      </h2>

      <p>
        Estamos consultando D1.
      </p>

    </div>

  `;

  try {
    const respuesta = await fetch(`${API_URL}/pedidos`);

    const resultado = await respuesta.json();

    if (!respuesta.ok || !resultado.ok) {
      throw new Error(resultado.error || 'No se pudieron cargar los pedidos.');
    }

    pedidos = Array.isArray(resultado.pedidos) ? resultado.pedidos : [];

    renderizarPedidos();
  } catch (error) {
    console.error('❌ Error cargando pedidos:', error);

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

  contadorNuevos.textContent = nuevos;

  contadorPreparando.textContent = preparando;

  contadorListos.textContent = listos;
}

// ==========================================
// CAMBIAR ESTADO
// ==========================================

async function cambiarEstado(id, estado) {
  try {
    const respuesta = await fetch(`${API_URL}/actualizar-pedido`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        id,
        estado,
      }),
    });

    const resultado = await respuesta.json();

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

// Por ahora actualizamos cada 10 segundos.
// Después podemos convertirlo en actualización
// en tiempo real.

setInterval(() => {
  if (!panelEquipo.classList.contains('oculto')) {
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
