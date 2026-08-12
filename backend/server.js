const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// NÚMEROS DE WHATSAPP POR ESTACIÓN
// ==========================================

const estaciones = {
  Alitas: ['525645973242', '525584594703'],

  Brochetas: ['525645973242', '525584594703'],

  Cerillos: ['525645973242', '525584594703', '525617723407', '525522399148'],

  Crepas: ['525617723407', '525522399148'],

  Waffles: ['525617723407', '525522399148'],
};

// ==========================================
// CREAR TEXTO DEL PEDIDO
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
  return productos.reduce((total, producto) => total + Number(producto.precio || 0), 0);
}

// ==========================================
// CREAR MENSAJE DE WHATSAPP
// ==========================================

function crearMensajeEstacion(numeroPedido, nombreEstacion, productos) {
  const total = calcularTotal(productos);

  return `🔥 LOS +QALITAS

🧾 PEDIDO #${numeroPedido}

📍 ESTACIÓN: ${nombreEstacion}

${crearTextoProductos(productos)}
TOTAL DE ESTA ESTACIÓN: $${total}

⚠️ PEDIDO #${numeroPedido}`;
}

// ==========================================
// RECIBIR PEDIDOS
// ==========================================

app.post('/pedido', (req, res) => {
  try {
    const { numeroPedido, productos } = req.body;

    // ======================================
    // VALIDACIÓN
    // ======================================

    if (!numeroPedido) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Falta el número de pedido.',
      });
    }

    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El pedido no contiene productos.',
      });
    }

    // ======================================
    // NUEVO PEDIDO
    // ======================================

    console.log('');
    console.log('==========================================');
    console.log('🔥 NUEVO PEDIDO');
    console.log('==========================================');

    console.log(`🧾 PEDIDO #${numeroPedido}`);

    console.log('');
    console.log('📦 PRODUCTOS RECIBIDOS');

    console.log(JSON.stringify(productos, null, 2));

    // ======================================
    // FILTRAR POR ESTACIONES
    // ======================================

    const pedidoFiltrado = {};

    Object.keys(estaciones).forEach((nombreEstacion) => {
      const productosEstacion = productos.filter((producto) => producto.nombre === nombreEstacion);

      if (productosEstacion.length > 0) {
        pedidoFiltrado[nombreEstacion] = {
          productos: productosEstacion,

          destinatarios: estaciones[nombreEstacion],

          mensaje: crearMensajeEstacion(numeroPedido, nombreEstacion, productosEstacion),
        };
      }
    });

    // ======================================
    // MOSTRAR RESULTADO
    // ======================================

    console.log('');
    console.log('==========================================');
    console.log('📦 PEDIDO FILTRADO POR ESTACIONES');
    console.log('==========================================');

    Object.keys(pedidoFiltrado).forEach((nombreEstacion) => {
      const estacion = pedidoFiltrado[nombreEstacion];

      console.log('');
      console.log(`🔥 ${nombreEstacion.toUpperCase()}`);

      console.log('Destinatarios:', estacion.destinatarios);

      console.log('');
      console.log(estacion.mensaje);
    });

    // ======================================
    // RESPUESTA A LA PÁGINA
    // ======================================

    res.json({
      ok: true,

      mensaje: 'Pedido recibido correctamente',

      pedido: {
        numeroPedido,

        productos,

        estaciones: pedidoFiltrado,
      },
    });
  } catch (error) {
    console.error('❌ ERROR AL PROCESAR PEDIDO:', error);

    res.status(500).json({
      ok: false,

      mensaje: 'Error interno de la central.',
    });
  }
});

// ==========================================
// INICIO
// ==========================================

app.listen(PORT, () => {
  console.log('');
  console.log(`🔥 Central Los +Qalitas funcionando en http://localhost:${PORT}`);
});
