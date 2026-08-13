export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // ==========================================
    // CORS
    // ==========================================

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);

    // ==========================================
    // RESPUESTA JSON
    // ==========================================

    function respuestaJSON(datos, status = 200) {
      return new Response(JSON.stringify(datos), {
        status,

        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // ==========================================
    // INICIO
    // ==========================================

    if (url.pathname === '/') {
      return respuestaJSON({
        ok: true,
        mensaje: 'Los +Qalitas API funcionando',
      });
    }

    // ==========================================
    // PRUEBA DE D1
    // ==========================================

    if (url.pathname === '/db-test') {
      try {
        const resultado = await env.DB.prepare('SELECT ultimo_numero FROM contador_pedidos WHERE id = 1').first();

        return respuestaJSON({
          ok: true,
          base: resultado,
        });
      } catch (error) {
        return respuestaJSON(
          {
            ok: false,
            error: error.message,
          },
          500,
        );
      }
    }

    // ==========================================
    // CREAR PEDIDO COMPLETO
    // NÚMERO + GUARDADO EN UNA SOLA OPERACIÓN
    // ==========================================

    if (url.pathname === '/crear-pedido' && request.method === 'POST') {
      try {
        const datos = await request.json();

        const productos = datos.productos;

        const total = Number(datos.total);

        if (!Array.isArray(productos) || productos.length === 0) {
          return respuestaJSON(
            {
              ok: false,
              error: 'El pedido no contiene productos.',
            },
            400,
          );
        }

        if (!Number.isFinite(total)) {
          return respuestaJSON(
            {
              ok: false,
              error: 'El total del pedido no es válido.',
            },
            400,
          );
        }

        // ======================================
        // TRANSACCIÓN ATÓMICA
        // ======================================

        const resultados = await env.DB.batch([
          // 1. Aumentar contador
          env.DB.prepare(
            `
              UPDATE contador_pedidos
              SET ultimo_numero = ultimo_numero + 1
              WHERE id = 1
              `,
          ),

          // 2. Guardar pedido con el nuevo número
          env.DB.prepare(
            `
              INSERT INTO pedidos (
                numero_pedido,
                productos,
                total,
                estado
              )
              VALUES (
                (
                  SELECT ultimo_numero
                  FROM contador_pedidos
                  WHERE id = 1
                ),
                ?,
                ?,
                'nuevo'
              )
              `,
          ).bind(JSON.stringify(productos), total),

          // 3. Obtener número generado
          env.DB.prepare(
            `
              SELECT ultimo_numero
              FROM contador_pedidos
              WHERE id = 1
              `,
          ),
        ]);

        const numeroPedido = resultados[2]?.results?.[0]?.ultimo_numero;

        const pedidoGuardado = await env.DB.prepare(
          `
              SELECT
                id,
                numero_pedido,
                total,
                estado,
                creado_en
              FROM pedidos
              WHERE numero_pedido = ?
              ORDER BY id DESC
              LIMIT 1
              `,
        )
          .bind(numeroPedido)
          .first();

        return respuestaJSON({
          ok: true,

          numeroPedido,

          pedido: pedidoGuardado,
        });
      } catch (error) {
        console.error('❌ Error creando pedido:', error);

        return respuestaJSON(
          {
            ok: false,
            error: error.message,
          },
          500,
        );
      }
    }

    // ==========================================
    // OBTENER PEDIDOS
    // ==========================================

    if (url.pathname === '/pedidos' && request.method === 'GET') {
      try {
        const resultado = await env.DB.prepare(
          `
              SELECT
                id,
                numero_pedido,
                productos,
                total,
                estado,
                creado_en
              FROM pedidos
              ORDER BY id DESC
              `,
        ).all();

        return respuestaJSON({
          ok: true,

          pedidos: resultado.results,
        });
      } catch (error) {
        return respuestaJSON(
          {
            ok: false,
            error: error.message,
          },
          500,
        );
      }
    }

    // ==========================================
    // ACTUALIZAR ESTADO
    // ==========================================

    if (url.pathname === '/actualizar-pedido' && request.method === 'POST') {
      try {
        const datos = await request.json();

        const id = Number(datos.id);

        const estado = String(datos.estado || '');

        if (!id || !estado) {
          return respuestaJSON(
            {
              ok: false,
              error: 'Faltan datos.',
            },
            400,
          );
        }

        const resultado = await env.DB.prepare(
          `
              UPDATE pedidos
              SET estado = ?
              WHERE id = ?
              `,
        )
          .bind(estado, id)
          .run();

        return respuestaJSON({
          ok: true,

          cambiado: resultado.meta.changes > 0,
        });
      } catch (error) {
        return respuestaJSON(
          {
            ok: false,
            error: error.message,
          },
          500,
        );
      }
    }

    // ==========================================
    // RUTA NO ENCONTRADA
    // ==========================================

    return respuestaJSON(
      {
        ok: false,
        error: 'Ruta no encontrada',
      },
      404,
    );
  },
};
