// ==========================================
// LOS +QALITAS
// SISTEMA DEL PEDIDO
// ==========================================

const productos = document.querySelectorAll('.producto');

const modalConfiguracion = document.getElementById('modal-configuracion');
const modalPedido = document.getElementById('modal-pedido');

const modalTitulo = document.getElementById('modal-titulo');
const modalDescripcion = document.getElementById('modal-descripcion');

const configuracionProducto = document.getElementById('configuracion-producto');

const agregarConfigurado = document.getElementById('agregar-configurado');

const cerrarModal = document.getElementById('cerrar-modal');
const cerrarPedido = document.getElementById('cerrar-pedido');

const botonVerPedido = document.querySelector('.btn-pedido');
const seguirComprando = document.getElementById('seguir-comprando');
const hacerPedido = document.getElementById('hacer-pedido');

const listaPedido = document.getElementById('lista-pedido');
const totalCarrito = document.getElementById('total-carrito');
const totalPedido = document.getElementById('total-pedido');

// ==========================================
// CARRITO
// ==========================================

let pedido = [];

let productoActual = null;

// ==========================================
// ABRIR CONFIGURACIÓN
// ==========================================

productos.forEach((producto) => {
  const boton = producto.querySelector('.btn-agregar');

  boton.addEventListener('click', () => {
    const nombre = producto.dataset.nombre;
    const precio = Number(producto.dataset.precio);

    productoActual = {
      nombre,
      precio,
    };

    abrirConfiguracion(nombre, precio);
  });
});

// ==========================================
// CONFIGURACIÓN DEL PRODUCTO
// ==========================================

function abrirConfiguracion(nombre, precio) {
  configuracionProducto.innerHTML = '';

  modalTitulo.textContent = obtenerTitulo(nombre);
  modalDescripcion.textContent = obtenerDescripcion(nombre);

  // ========================================
  // ALITAS
  // ========================================

  if (nombre === 'Alitas') {
    configuracionProducto.innerHTML = `

      <h3>¿Qué salsas quieres?</h3>

      <p class="ayuda-salsas">
        Puedes elegir todas las que quieras.
      </p>

      <div class="lista-salsas">

        <label class="opcion-salsa">
          <input type="checkbox" value="BBQ">
          <span>BBQ</span>
        </label>

        <label class="opcion-salsa">
          <input type="checkbox" value="Búfalo">
          <span>Búfalo</span>
        </label>

        <label class="opcion-salsa">
          <input type="checkbox" value="Salsa inglesa">
          <span>Salsa inglesa</span>
        </label>

        <label class="opcion-salsa">
          <input type="checkbox" value="Salsa Maggie">
          <span>Salsa Maggie</span>
        </label>

        <label class="opcion-salsa">
          <input type="checkbox" value="BBQ Picoso">
          <span>BBQ Picoso</span>
        </label>

      </div>

    `;
  }

  // ========================================
  // BROCHETAS
  // ========================================
  else if (nombre === 'Brochetas') {
    configuracionProducto.innerHTML = `

      <h3>¿Qué salsas quieres?</h3>

      <p class="ayuda-salsas">
        Puedes elegir todas las que quieras.
      </p>

      <div class="lista-salsas">

        <label class="opcion-salsa">
          <input type="checkbox" value="BBQ">
          <span>BBQ</span>
        </label>

        <label class="opcion-salsa">
          <input type="checkbox" value="Búfalo">
          <span>Búfalo</span>
        </label>

        <label class="opcion-salsa">
          <input type="checkbox" value="Salsa inglesa">
          <span>Salsa inglesa</span>
        </label>

        <label class="opcion-salsa">
          <input type="checkbox" value="Salsa Maggie">
          <span>Salsa Maggie</span>
        </label>

        <label class="opcion-salsa">
          <input type="checkbox" value="BBQ Picoso">
          <span>BBQ Picoso</span>
        </label>

      </div>

    `;
  }

  // ========================================
  // CERILLOS
  // ========================================
  else if (nombre === 'Cerillos') {
    configuracionProducto.innerHTML = `

      <h3>Elige tu cerveza</h3>

      <div class="lista-salsas">

        <label class="opcion-salsa">
          <input
            type="radio"
            name="cerveza"
            value="Modelo"
          >
          <span>🍺 Modelo</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="radio"
            name="cerveza"
            value="Victoria"
          >
          <span>🍺 Victoria</span>
        </label>

      </div>


      <h3 style="margin-top: 20px;">
        Elige tu sabor
      </h3>

      <div class="lista-salsas">

        <label class="opcion-salsa">
          <input
            type="radio"
            name="sabor"
            value="Cereza"
          >
          <span>🍒 Cereza</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="radio"
            name="sabor"
            value="Sandía"
          >
          <span>🍉 Sandía</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="radio"
            name="sabor"
            value="Tamarindo"
          >
          <span>🥭 Tamarindo</span>
        </label>

      </div>

    `;
  }

  // ========================================
  // CREPAS Y WAFFLES
  // ========================================
  else if (nombre === 'Crepas' || nombre === 'Waffles') {
    configuracionProducto.innerHTML = `

      <h3>Elige tu untable</h3>

      <p class="ayuda-salsas">
        Elige 1.
      </p>

      <div class="lista-salsas">

        <label class="opcion-salsa">
          <input
            type="radio"
            name="untable"
            value="Cajeta"
          >
          <span>🥄 Cajeta</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="radio"
            name="untable"
            value="Lechera"
          >
          <span>🥛 Lechera</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="radio"
            name="untable"
            value="Philadelphia"
          >
          <span>🧀 Philadelphia</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="radio"
            name="untable"
            value="Nutella"
          >
          <span>🍫 Nutella</span>
        </label>

      </div>


      <h3 style="margin-top: 22px;">
        Elige tu fruta
      </h3>

      <p class="ayuda-salsas">
        Elige 1.
      </p>

      <div class="lista-salsas">

        <label class="opcion-salsa">
          <input
            type="radio"
            name="fruta"
            value="Fresa"
          >
          <span>🍓 Fresa</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="radio"
            name="fruta"
            value="Durazno"
          >
          <span>🍑 Durazno</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="radio"
            name="fruta"
            value="Plátano"
          >
          <span>🍌 Plátano</span>
        </label>

      </div>


      <h3 style="margin-top: 22px;">
        Elige tu topping
      </h3>

      <p class="ayuda-salsas">
        Elige 1.
      </p>

      <div class="lista-salsas">

        <label class="opcion-salsa">
          <input
            type="radio"
            name="topping"
            value="Nuez"
          >
          <span>🥜 Nuez</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="radio"
            name="topping"
            value="Chispas de chocolate"
          >
          <span>🍫 Chispas de chocolate</span>
        </label>

      </div>


      <div
        id="extras-contenedor"
        style="display: none; margin-top: 25px;"
      >

        <h3>
          ¿Quieres agregar algo más?
        </h3>

        <p class="ayuda-salsas">
          Nutella y Fresa +$10 · Los demás +$5
        </p>


        <h4 style="margin: 15px 0 8px;">
          Untables extras
        </h4>

        <div class="lista-salsas">

          <label class="opcion-salsa">
            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Cajeta"
              data-precio="5"
              data-tipo="Untable"
            >
            <span>🥄 Cajeta +$5</span>
          </label>

          <label class="opcion-salsa">
            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Lechera"
              data-precio="5"
              data-tipo="Untable"
            >
            <span>🥛 Lechera +$5</span>
          </label>

          <label class="opcion-salsa">
            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Philadelphia"
              data-precio="5"
              data-tipo="Untable"
            >
            <span>🧀 Philadelphia +$5</span>
          </label>

          <label class="opcion-salsa">
            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Nutella"
              data-precio="10"
              data-tipo="Untable"
            >
            <span>🍫 Nutella +$10</span>
          </label>

        </div>


        <h4 style="margin: 18px 0 8px;">
          Frutas extras
        </h4>

        <div class="lista-salsas">

          <label class="opcion-salsa">
            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Fresa"
              data-precio="10"
              data-tipo="Fruta"
            >
            <span>🍓 Fresa +$10</span>
          </label>

          <label class="opcion-salsa">
            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Durazno"
              data-precio="5"
              data-tipo="Fruta"
            >
            <span>🍑 Durazno +$5</span>
          </label>

          <label class="opcion-salsa">
            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Plátano"
              data-precio="5"
              data-tipo="Fruta"
            >
            <span>🍌 Plátano +$5</span>
          </label>

        </div>


        <h4 style="margin: 18px 0 8px;">
          Toppings extras
        </h4>

        <div class="lista-salsas">

          <label class="opcion-salsa">
            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Nuez"
              data-precio="5"
              data-tipo="Topping"
            >
            <span>🥜 Nuez +$5</span>
          </label>

          <label class="opcion-salsa">
            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Chispas de chocolate"
              data-precio="5"
              data-tipo="Topping"
            >
            <span>🍫 Chispas de chocolate +$5</span>
          </label>

        </div>

      </div>

    `;

    const radios = configuracionProducto.querySelectorAll('input[type="radio"]');

    const extrasContenedor = configuracionProducto.querySelector('#extras-contenedor');

    function revisarSeleccion() {
      const untable = configuracionProducto.querySelector('input[name="untable"]:checked');

      const fruta = configuracionProducto.querySelector('input[name="fruta"]:checked');

      const topping = configuracionProducto.querySelector('input[name="topping"]:checked');

      if (untable && fruta && topping) {
        extrasContenedor.style.display = 'block';

        extrasContenedor.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }

    radios.forEach((radio) => {
      radio.addEventListener('change', revisarSeleccion);
    });
  }

  modalConfiguracion.classList.add('activo');
}

// ==========================================
// TÍTULOS
// ==========================================

function obtenerTitulo(nombre) {
  if (nombre === 'Alitas') {
    return '🍗 Alitas';
  }

  if (nombre === 'Brochetas') {
    return '🍢 Brochetas';
  }

  if (nombre === 'Cerillos') {
    return '🍺 Cerillos';
  }

  if (nombre === 'Crepas') {
    return '🥞 Crepas';
  }

  if (nombre === 'Waffles') {
    return '🧇 Waffles';
  }

  return nombre;
}

// ==========================================
// DESCRIPCIONES
// ==========================================

function obtenerDescripcion(nombre) {
  if (nombre === 'Alitas') {
    return '5 piezas';
  }

  if (nombre === 'Brochetas') {
    return 'Bien servidas';
  }

  if (nombre === 'Cerillos') {
    return 'Elige tu cerveza y sabor';
  }

  if (nombre === 'Crepas') {
    return 'Elige tus ingredientes';
  }

  if (nombre === 'Waffles') {
    return 'Elige tus ingredientes';
  }

  return '';
}

// ==========================================
// AGREGAR PRODUCTO CONFIGURADO
// ==========================================

agregarConfigurado.addEventListener('click', () => {
  if (!productoActual) {
    return;
  }

  const nombre = productoActual.nombre;

  const precioBase = productoActual.precio;

  // ========================================
  // ALITAS / BROCHETAS
  // ========================================

  if (nombre === 'Alitas' || nombre === 'Brochetas') {
    const seleccionadas = Array.from(configuracionProducto.querySelectorAll('input[type="checkbox"]:checked')).map((input) => input.value);

    if (seleccionadas.length === 0) {
      alert('Elige al menos una salsa.');

      return;
    }

    pedido.push({
      nombre,

      precio: precioBase,

      detalle: `Salsas: ${seleccionadas.join(', ')}`,
    });
  }

  // ========================================
  // CERILLOS
  // ========================================
  else if (nombre === 'Cerillos') {
    const cerveza = configuracionProducto.querySelector('input[name="cerveza"]:checked');

    const sabor = configuracionProducto.querySelector('input[name="sabor"]:checked');

    if (!cerveza) {
      alert('Elige una cerveza.');

      return;
    }

    if (!sabor) {
      alert('Elige un sabor.');

      return;
    }

    pedido.push({
      nombre,

      precio: precioBase,

      detalle: `Cerveza: ${cerveza.value} · Sabor: ${sabor.value}`,
    });
  }

  // ========================================
  // CREPAS / WAFFLES
  // ========================================
  else if (nombre === 'Crepas' || nombre === 'Waffles') {
    const untable = configuracionProducto.querySelector('input[name="untable"]:checked');

    const fruta = configuracionProducto.querySelector('input[name="fruta"]:checked');

    const topping = configuracionProducto.querySelector('input[name="topping"]:checked');

    if (!untable) {
      alert('Elige un untable.');

      return;
    }

    if (!fruta) {
      alert('Elige una fruta.');

      return;
    }

    if (!topping) {
      alert('Elige un topping.');

      return;
    }

    const extras = Array.from(configuracionProducto.querySelectorAll('.extra-ingrediente:checked'));

    const extrasPrecio = extras.reduce((total, extra) => total + Number(extra.dataset.precio), 0);

    const extrasNombres = extras.map((extra) => `${extra.value} +$${extra.dataset.precio}`);

    const precioFinal = precioBase + extrasPrecio;

    let detalle = `Untable: ${untable.value} · ` + `Fruta: ${fruta.value} · ` + `Topping: ${topping.value}`;

    if (extrasNombres.length > 0) {
      detalle += ` · Extras: ${extrasNombres.join(', ')}`;
    }

    pedido.push({
      nombre,

      precio: precioFinal,

      detalle,
    });
  }

  actualizarCarrito();

  modalConfiguracion.classList.remove('activo');
});

// ==========================================
// PRODUCTOS SIN CONFIGURACIÓN
// ==========================================

productos.forEach((producto) => {
  const nombre = producto.dataset.nombre;

  if (nombre === 'Alitas' || nombre === 'Brochetas' || nombre === 'Cerillos' || nombre === 'Crepas' || nombre === 'Waffles') {
    return;
  }

  const boton = producto.querySelector('.btn-agregar');

  boton.addEventListener('click', () => {
    const precio = Number(producto.dataset.precio);

    pedido.push({
      nombre,

      precio,

      detalle: '',
    });

    actualizarCarrito();
  });
});

// ==========================================
// ACTUALIZAR CARRITO
// ==========================================

function actualizarCarrito() {
  const total = pedido.reduce((suma, producto) => suma + producto.precio, 0);

  totalCarrito.textContent = `$${total}`;

  renderizarPedido();
}

// ==========================================
// MOSTRAR PEDIDO
// ==========================================

function renderizarPedido() {
  listaPedido.innerHTML = '';

  if (pedido.length === 0) {
    listaPedido.innerHTML = `

      <p class="pedido-vacio">
        Tu pedido está vacío.
      </p>

    `;

    totalPedido.textContent = '$0';

    return;
  }

  pedido.forEach((producto, indice) => {
    const item = document.createElement('div');

    item.className = 'item-pedido';

    item.innerHTML = `

        <div class="item-pedido-info">

          <strong>
            ${iconoProducto(producto.nombre)}
            ${producto.nombre}
          </strong>

          ${producto.detalle ? `<small>${producto.detalle}</small>` : ''}

        </div>


        <div class="item-pedido-derecha">

          <strong>
            $${producto.precio}
          </strong>


          <button
            type="button"
            class="btn-eliminar"
            data-indice="${indice}"
            title="Eliminar"
          >
            🗑️
          </button>

        </div>

      `;

    listaPedido.appendChild(item);
  });

  const total = pedido.reduce((suma, producto) => suma + producto.precio, 0);

  totalPedido.textContent = `$${total}`;

  document.querySelectorAll('.btn-eliminar').forEach((boton) => {
    boton.addEventListener('click', () => {
      const indice = Number(boton.dataset.indice);

      pedido.splice(indice, 1);

      actualizarCarrito();
    });
  });
}

// ==========================================
// ICONOS
// ==========================================

function iconoProducto(nombre) {
  if (nombre === 'Alitas') {
    return '🍗';
  }

  if (nombre === 'Cerillos') {
    return '🍺';
  }

  if (nombre === 'Brochetas') {
    return '🍢';
  }

  if (nombre === 'Crepas') {
    return '🥞';
  }

  if (nombre === 'Waffles') {
    return '🧇';
  }

  return '🍴';
}

// ==========================================
// ABRIR PEDIDO
// ==========================================

botonVerPedido.addEventListener('click', () => {
  renderizarPedido();

  modalPedido.classList.add('activo');
});

// ==========================================
// CERRAR CONFIGURACIÓN
// ==========================================

cerrarModal.addEventListener('click', () => {
  modalConfiguracion.classList.remove('activo');
});

// ==========================================
// CERRAR PEDIDO
// ==========================================

cerrarPedido.addEventListener('click', () => {
  modalPedido.classList.remove('activo');
});

// ==========================================
// SEGUIR COMPRANDO
// ==========================================

seguirComprando.addEventListener('click', () => {
  modalPedido.classList.remove('activo');
});

// ==========================================
// HACER PEDIDO
// ==========================================

hacerPedido.addEventListener('click', () => {
  if (pedido.length === 0) {
    alert('Tu pedido está vacío.');

    return;
  }

  // ======================================
  // GENERAR NÚMERO DE PEDIDO
  // ======================================

  let numeroPedido = Number(localStorage.getItem('numeroPedidoLosQalitas')) || 0;

  numeroPedido++;

  localStorage.setItem('numeroPedidoLosQalitas', numeroPedido);

  // ======================================
  // SEPARAR PRODUCTOS
  // ======================================

  const alitasBrochetas = pedido.filter((producto) => producto.nombre === 'Alitas' || producto.nombre === 'Brochetas');

  const crepasWaffles = pedido.filter((producto) => producto.nombre === 'Crepas' || producto.nombre === 'Waffles');

  const cerillos = pedido.filter((producto) => producto.nombre === 'Cerillos');

  // ======================================
  // WHATSAPP ALITAS / BROCHETAS
  // ======================================

  const whatsAlitasBrochetas = ['525645973242', '525584594703'];

  // ======================================
  // WHATSAPP CREPAS / WAFFLES
  // ======================================

  const whatsCrepasWaffles = ['525617723407', '525522399148'];

  // ======================================
  // WHATSAPP CERILLOS
  // ======================================

  const whatsCerillos = ['525645973242', '525584594703', '525617723407', '525522399148'];

  // ======================================
  // CREAR TEXTO DE PRODUCTOS
  // ======================================

  function crearTextoProductos(productos) {
    let texto = '';

    productos.forEach((producto, indice) => {
      texto += `${indice + 1}. ${producto.nombre}\n`;

      if (producto.detalle) {
        texto += `   ${producto.detalle}\n`;
      }

      texto += `   Precio: $${producto.precio}\n\n`;
    });

    return texto;
  }

  // ======================================
  // CALCULAR TOTAL
  // ======================================

  function calcularTotal(productos) {
    return productos.reduce((total, producto) => total + producto.precio, 0);
  }

  // ======================================
  // ABRIR WHATSAPP
  // ======================================

  function enviarWhatsApp(numero, mensaje) {
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, '_blank');
  }

  // ======================================
  // ALITAS Y BROCHETAS
  // ======================================

  if (alitasBrochetas.length > 0) {
    const total = calcularTotal(alitasBrochetas);

    const mensaje = `🔥 LOS +QALITAS

🧾 PEDIDO #${numeroPedido}

🍗 ÁREA: ALITAS Y BROCHETAS

${crearTextoProductos(alitasBrochetas)}

TOTAL DEL ÁREA: $${total}

⚠️ Este pedido pertenece al PEDIDO #${numeroPedido}.`;

    whatsAlitasBrochetas.forEach((numero) => {
      enviarWhatsApp(numero, mensaje);
    });
  }

  // ======================================
  // CREPAS Y WAFFLES
  // ======================================

  if (crepasWaffles.length > 0) {
    const total = calcularTotal(crepasWaffles);

    const mensaje = `🔥 LOS +QALITAS

🧾 PEDIDO #${numeroPedido}

🥞 ÁREA: CREPAS Y WAFFLES

${crearTextoProductos(crepasWaffles)}

TOTAL DEL ÁREA: $${total}

⚠️ Este pedido pertenece al PEDIDO #${numeroPedido}.`;

    whatsCrepasWaffles.forEach((numero) => {
      enviarWhatsApp(numero, mensaje);
    });
  }

  // ======================================
  // CERILLOS
  // ======================================

  if (cerillos.length > 0) {
    const total = calcularTotal(cerillos);

    const mensaje = `🔥 LOS +QALITAS

🧾 PEDIDO #${numeroPedido}

🍺 ÁREA: CERILLOS

${crearTextoProductos(cerillos)}

TOTAL DEL ÁREA: $${total}

⚠️ Este pedido pertenece al PEDIDO #${numeroPedido}.`;

    whatsCerillos.forEach((numero) => {
      enviarWhatsApp(numero, mensaje);
    });
  }

  // ======================================
  // CONFIRMACIÓN
  // ======================================

  alert(
    `🔥 ¡Pedido realizado!

🧾 Tu número de pedido es:

#${numeroPedido}

Guarda este número para identificar tu pedido.`,
  );

  // ======================================
  // CERRAR MODAL
  // ======================================

  modalPedido.classList.remove('activo');
});
