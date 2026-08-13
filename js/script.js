// ==========================================
// LOS +QALITAS
// SISTEMA COMPLETO DEL PEDIDO
// ==========================================

// ==========================================
// ELEMENTOS
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

  if (!boton) {
    return;
  }

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
// CONFIGURACIÓN
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

      <h3>
        ¿Qué salsas quieres?
      </h3>

      <p class="ayuda-salsas">
        Puedes elegir todas las que quieras.
      </p>

      <div class="lista-salsas">

        <label class="opcion-salsa">
          <input
            type="checkbox"
            value="BBQ"
          >
          <span>BBQ</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="checkbox"
            value="Búfalo"
          >
          <span>Búfalo</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="checkbox"
            value="Salsa inglesa"
          >
          <span>Salsa inglesa</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="checkbox"
            value="Salsa Maggie"
          >
          <span>Salsa Maggie</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="checkbox"
            value="BBQ Picoso"
          >
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

      <h3>
        ¿Qué salsas quieres?
      </h3>

      <p class="ayuda-salsas">
        Puedes elegir todas las que quieras.
      </p>

      <div class="lista-salsas">

        <label class="opcion-salsa">
          <input
            type="checkbox"
            value="BBQ"
          >
          <span>BBQ</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="checkbox"
            value="Búfalo"
          >
          <span>Búfalo</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="checkbox"
            value="Salsa inglesa"
          >
          <span>Salsa inglesa</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="checkbox"
            value="Salsa Maggie"
          >
          <span>Salsa Maggie</span>
        </label>

        <label class="opcion-salsa">
          <input
            type="checkbox"
            value="BBQ Picoso"
          >
          <span>BBQ Picoso</span>
        </label>

      </div>

    `;
  }

  // ========================================
  // HAMBURGUESAS
  // ========================================
  else if (nombre === 'Hamburguesas') {
    configuracionProducto.innerHTML = `

      <h3>
        Elige tu hamburguesa
      </h3>

      <p class="ayuda-salsas">
        Elige 1.
      </p>

      <div class="lista-salsas">

        <label class="opcion-salsa">

          <input
            type="radio"
            name="hamburguesa"
            value="Sencilla"
          >

          <span>
            🍔 Sencilla
          </span>

        </label>


        <label class="opcion-salsa">

          <input
            type="radio"
            name="hamburguesa"
            value="Hawaiana"
          >

          <span>
            🍍 Hawaiana
          </span>

        </label>

      </div>


      <!-- INGREDIENTES HAWAIANA -->

      <div
        id="ingredientes-hawaiana"
        style="
          display:none;
          margin-top:12px;
          padding:12px;
          background:#111;
          border-radius:10px;
          color:#ddd;
        "
      >

        <strong
          style="
            color:#f5b900;
            display:block;
            margin-bottom:6px;
          "
        >
          Incluye automáticamente:
        </strong>

        <div>
          🍍 Piña
        </div>

        <div>
          🥩 Jamón
        </div>

      </div>


      <!-- QUESO -->

      <h3
        style="
          margin-top:20px;
        "
      >
        Elige tu queso
      </h3>

      <p class="ayuda-salsas">
        Opcional.
      </p>

      <div class="lista-salsas">

        <label class="opcion-salsa">

          <input
            type="radio"
            name="queso-hamburguesa"
            value="Americano"
          >

          <span>
            🧀 Americano
          </span>

        </label>

      </div>


      <!-- TOPPINGS -->

      <h3
        style="
          margin-top:20px;
        "
      >
        Toppings
      </h3>

      <p class="ayuda-salsas">
        Puedes elegir todos los que quieras.
      </p>

      <div class="lista-salsas">

        <label class="opcion-salsa">

          <input
            type="checkbox"
            class="topping-hamburguesa"
            value="Lechuga"
          >

          <span>
            🥬 Lechuga
          </span>

        </label>


        <label class="opcion-salsa">

          <input
            type="checkbox"
            class="topping-hamburguesa"
            value="Jitomate"
          >

          <span>
            🍅 Jitomate
          </span>

        </label>


        <label class="opcion-salsa">

          <input
            type="checkbox"
            class="topping-hamburguesa"
            value="Cebolla"
          >

          <span>
            🧅 Cebolla
          </span>

        </label>

      </div>


      <!-- SALSAS -->

      <h3
        style="
          margin-top:20px;
        "
      >
        Salsas
      </h3>

      <p class="ayuda-salsas">
        Puedes elegir todas las que quieras.
      </p>

      <div class="lista-salsas">

        <label class="opcion-salsa">

          <input
            type="checkbox"
            class="salsa-hamburguesa"
            value="Kétchup"
          >

          <span>
            🍅 Kétchup
          </span>

        </label>


        <label class="opcion-salsa">

          <input
            type="checkbox"
            class="salsa-hamburguesa"
            value="Mostaza"
          >

          <span>
            💛 Mostaza
          </span>

        </label>


        <label class="opcion-salsa">

          <input
            type="checkbox"
            class="salsa-hamburguesa"
            value="Mayonesa"
          >

          <span>
            🥚 Mayonesa
          </span>

        </label>

      </div>

    `;

    // ======================================
    // MOSTRAR PIÑA Y JAMÓN
    // ======================================

    const radiosHamburguesa = configuracionProducto.querySelectorAll('input[name="hamburguesa"]');

    const ingredientesHawaiana = configuracionProducto.querySelector('#ingredientes-hawaiana');

    radiosHamburguesa.forEach((radio) => {
      radio.addEventListener('change', () => {
        if (radio.value === 'Hawaiana' && radio.checked) {
          ingredientesHawaiana.style.display = 'block';
        } else {
          ingredientesHawaiana.style.display = 'none';
        }
      });
    });
  }

  // ========================================
  // CERILLOS
  // ========================================
  else if (nombre === 'Cerillos') {
    configuracionProducto.innerHTML = `

      <h3>
        Elige tu cerveza
      </h3>

      <div class="lista-salsas">

        <label class="opcion-salsa">

          <input
            type="radio"
            name="cerveza"
            value="Modelo"
          >

          <span>
            🍺 Modelo
          </span>

        </label>


        <label class="opcion-salsa">

          <input
            type="radio"
            name="cerveza"
            value="Victoria"
          >

          <span>
            🍺 Victoria
          </span>

        </label>

      </div>


      <h3
        style="
          margin-top:20px;
        "
      >
        Elige tu sabor
      </h3>


      <div class="lista-salsas">

        <label class="opcion-salsa">

          <input
            type="radio"
            name="sabor"
            value="Cereza"
          >

          <span>
            🍒 Cereza
          </span>

        </label>


        <label class="opcion-salsa">

          <input
            type="radio"
            name="sabor"
            value="Sandía"
          >

          <span>
            🍉 Sandía
          </span>

        </label>


        <label class="opcion-salsa">

          <input
            type="radio"
            name="sabor"
            value="Tamarindo"
          >

          <span>
            🥭 Tamarindo
          </span>

        </label>

      </div>

    `;
  }

  // ========================================
  // CREPAS Y WAFFLES
  // ========================================
  else if (nombre === 'Crepas' || nombre === 'Waffles') {
    configuracionProducto.innerHTML = `

      <h3>
        Elige tu untable
      </h3>

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

          <span>
            🥄 Cajeta
          </span>

        </label>


        <label class="opcion-salsa">

          <input
            type="radio"
            name="untable"
            value="Lechera"
          >

          <span>
            🥛 Lechera
          </span>

        </label>


        <label class="opcion-salsa">

          <input
            type="radio"
            name="untable"
            value="Philadelphia"
          >

          <span>
            🧀 Philadelphia
          </span>

        </label>


        <label class="opcion-salsa">

          <input
            type="radio"
            name="untable"
            value="Nutella"
          >

          <span>
            🍫 Nutella
          </span>

        </label>

      </div>


      <h3
        style="
          margin-top:22px;
        "
      >
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

          <span>
            🍓 Fresa
          </span>

        </label>


        <label class="opcion-salsa">

          <input
            type="radio"
            name="fruta"
            value="Durazno"
          >

          <span>
            🍑 Durazno
          </span>

        </label>


        <label class="opcion-salsa">

          <input
            type="radio"
            name="fruta"
            value="Plátano"
          >

          <span>
            🍌 Plátano
          </span>

        </label>

      </div>


      <h3
        style="
          margin-top:22px;
        "
      >
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

          <span>
            🥜 Nuez
          </span>

        </label>


        <label class="opcion-salsa">

          <input
            type="radio"
            name="topping"
            value="Chispas de chocolate"
          >

          <span>
            🍫 Chispas de chocolate
          </span>

        </label>

      </div>


      <div
        id="extras-contenedor"
        style="
          display:none;
          margin-top:25px;
        "
      >

        <h3>
          ¿Quieres agregar algo más?
        </h3>

        <p class="ayuda-salsas">
          Nutella y Fresa +$10 · Los demás +$5
        </p>


        <h4>
          Untables extras
        </h4>

        <div class="lista-salsas">

          <label class="opcion-salsa">

            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Cajeta"
              data-precio="5"
            >

            <span>
              🥄 Cajeta +$5
            </span>

          </label>


          <label class="opcion-salsa">

            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Lechera"
              data-precio="5"
            >

            <span>
              🥛 Lechera +$5
            </span>

          </label>


          <label class="opcion-salsa">

            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Philadelphia"
              data-precio="5"
            >

            <span>
              🧀 Philadelphia +$5
            </span>

          </label>


          <label class="opcion-salsa">

            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Nutella"
              data-precio="10"
            >

            <span>
              🍫 Nutella +$10
            </span>

          </label>

        </div>


        <h4>
          Frutas extras
        </h4>

        <div class="lista-salsas">

          <label class="opcion-salsa">

            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Fresa"
              data-precio="10"
            >

            <span>
              🍓 Fresa +$10
            </span>

          </label>


          <label class="opcion-salsa">

            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Durazno"
              data-precio="5"
            >

            <span>
              🍑 Durazno +$5
            </span>

          </label>


          <label class="opcion-salsa">

            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Plátano"
              data-precio="5"
            >

            <span>
              🍌 Plátano +$5
            </span>

          </label>

        </div>


        <h4>
          Toppings extras
        </h4>

        <div class="lista-salsas">

          <label class="opcion-salsa">

            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Nuez"
              data-precio="5"
            >

            <span>
              🥜 Nuez +$5
            </span>

          </label>


          <label class="opcion-salsa">

            <input
              type="checkbox"
              class="extra-ingrediente"
              value="Chispas de chocolate"
              data-precio="5"
            >

            <span>
              🍫 Chispas de chocolate +$5
            </span>

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

  if (nombre === 'Hamburguesas') {
    return '🍔 Hamburguesas';
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

  if (nombre === 'Hamburguesas') {
    return 'Sencilla o Hawaiana';
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
// AGREGAR CONFIGURADO
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
  // HAMBURGUESAS
  // ========================================
  else if (nombre === 'Hamburguesas') {
    const tipo = configuracionProducto.querySelector('input[name="hamburguesa"]:checked');

    // EL QUESO ES OPCIONAL
    const queso = configuracionProducto.querySelector('input[name="queso-hamburguesa"]:checked');

    if (!tipo) {
      alert('Elige una hamburguesa.');

      return;
    }

    const toppings = Array.from(configuracionProducto.querySelectorAll('.topping-hamburguesa:checked')).map((input) => input.value);

    const salsas = Array.from(configuracionProducto.querySelectorAll('.salsa-hamburguesa:checked')).map((input) => input.value);

    // ======================================
    // CONSTRUIR DETALLE
    // ======================================

    let detalle = `Tipo: ${tipo.value}`;

    // QUESO SOLO SI LO ELIGIERON

    if (queso) {
      detalle += ` · Queso: ${queso.value}`;
    }

    // HAWAIANA

    if (tipo.value === 'Hawaiana') {
      detalle += ' · Incluye: Piña, Jamón';
    }

    // TOPPINGS

    if (toppings.length > 0) {
      detalle += ` · Toppings: ${toppings.join(', ')}`;
    }

    // SALSAS

    if (salsas.length > 0) {
      detalle += ` · Salsas: ${salsas.join(', ')}`;
    }

    pedido.push({
      nombre,

      precio: precioBase,

      detalle,
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

  if (nombre === 'Hamburguesas') {
    return '🍔';
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
// SISTEMA DE WHATSAPP
// ==========================================

function enviarWhatsApp(numero, mensaje) {
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, '_blank');
}

// ==========================================
// CREAR TEXTO DE PRODUCTOS
// ==========================================

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

// ==========================================
// CALCULAR TOTAL
// ==========================================

function calcularTotal(productos) {
  return productos.reduce((total, producto) => total + producto.precio, 0);
}

// ==========================================
// CREAR BOTÓN DE ESTACIÓN
// ==========================================

function crearBotonEstacion(contenedor, nombreEstacion, numeros, mensaje) {
  const boton = document.createElement('button');

  boton.type = 'button';

  boton.textContent = `📱 Enviar ${nombreEstacion}`;

  boton.style.display = 'block';

  boton.style.width = '100%';

  boton.style.margin = '10px 0';

  boton.style.padding = '15px';

  boton.style.border = 'none';

  boton.style.borderRadius = '10px';

  boton.style.cursor = 'pointer';

  boton.style.fontSize = '16px';

  boton.style.fontWeight = 'bold';

  boton.addEventListener('click', () => {
    numeros.forEach((numero, indice) => {
      setTimeout(() => {
        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

        window.open(url, '_blank');
      }, indice * 700);
    });

    boton.textContent = `✅ ${nombreEstacion} enviado`;

    boton.disabled = true;
  });

  contenedor.appendChild(boton);
}

// ==========================================
// CREAR SECCIÓN DE ESTACIÓN
// ==========================================

function crearSeccionEstacion(contenedor, titulo, productosEstacion, numeros, numeroPedido) {
  if (productosEstacion.length === 0) {
    return;
  }

  const seccion = document.createElement('div');

  seccion.style.marginBottom = '25px';

  const total = calcularTotal(productosEstacion);

  const mensaje = `🔥 LOS +QALITAS

🧾 PEDIDO #${numeroPedido}

📍 ${titulo}

${crearTextoProductos(productosEstacion)}

TOTAL DE ESTA ESTACIÓN: $${total}

⚠️ PEDIDO #${numeroPedido}`;

  const encabezado = document.createElement('h3');

  encabezado.textContent = titulo;

  seccion.appendChild(encabezado);

  const info = document.createElement('p');

  info.textContent = `${productosEstacion.length} producto(s) · ${numeros.length} WhatsApp`;

  seccion.appendChild(info);

  crearBotonEstacion(seccion, titulo, numeros, mensaje);

  contenedor.appendChild(seccion);
}

// ==========================================
// HACER PEDIDO - WHATSAPP DIRECTO
// ==========================================

hacerPedido.addEventListener('click', () => {
  if (pedido.length === 0) {
    alert('Tu pedido está vacío.');

    return;
  }

  let numeroPedido = Number(localStorage.getItem('numeroPedidoLosQalitas')) || 0;

  numeroPedido++;

  localStorage.setItem('numeroPedidoLosQalitas', numeroPedido);

  const total = pedido.reduce((suma, producto) => suma + producto.precio, 0);

  let mensaje = `🔥 LOS +QALITAS\n\n` + `🧾 PEDIDO #${numeroPedido}\n\n`;

  pedido.forEach((producto, indice) => {
    mensaje += `${indice + 1}. ${producto.nombre}\n`;

    if (producto.detalle) {
      mensaje += `   ${producto.detalle}\n`;
    }

    mensaje += `   Precio: $${producto.precio}\n\n`;
  });

  mensaje += `💰 TOTAL: $${total}\n\n` + `⚠️ PEDIDO #${numeroPedido}`;

  // ======================================
  // ÚNICO WHATSAPP
  // ======================================

  const numeroWhatsApp = '525645973242';

  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, '_blank');

  // ======================================
  // MOSTRAR CONFIRMACIÓN
  // ======================================

  const contenido = modalPedido.querySelector('.modal-contenido');

  const panelAnterior = document.getElementById('panel-central-pedido');

  if (panelAnterior) {
    panelAnterior.remove();
  }

  const panel = document.createElement('div');

  panel.id = 'panel-central-pedido';

  panel.style.marginTop = '20px';

  panel.style.padding = '20px';

  panel.style.borderRadius = '15px';

  panel.style.background = 'rgba(255,255,255,0.08)';

  panel.style.textAlign = 'center';

  panel.innerHTML = `

      <h2>
        🔥 PEDIDO #${numeroPedido}
      </h2>

      <p>
        ✅ Pedido preparado correctamente.
      </p>

      <p>
        📱 Se abrió WhatsApp para enviarlo.
      </p>

      <p>
        💰 Total: $${total}
      </p>

    `;

  contenido.appendChild(panel);

  alert(`🔥 PEDIDO #${numeroPedido}\n\n` + `Tu pedido está listo.\n\n` + `📱 Se abrió WhatsApp para enviarlo.\n\n` + `💰 Total: $${total}`);
});
