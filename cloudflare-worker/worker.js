export default {
  async fetch(request, env) {
    // ==========================================
    // CORS
    // ==========================================

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

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
    // UTILIDADES
    // ==========================================

    function bytesToHex(bytes) {
      return Array.from(bytes)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
    }

    function hexToBytes(hex) {
      const bytes = new Uint8Array(hex.length / 2);

      for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
      }

      return bytes;
    }

    function generarToken() {
      const bytes = new Uint8Array(32);

      crypto.getRandomValues(bytes);

      return bytesToHex(bytes);
    }

    async function sha256(text) {
      const datos = new TextEncoder().encode(text);

      const hash = await crypto.subtle.digest('SHA-256', datos);

      return bytesToHex(new Uint8Array(hash));
    }

    async function generarPasswordHash(password) {
      const salt = new Uint8Array(16);

      crypto.getRandomValues(salt);

      const iterations = 100000;

      const baseKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);

      const bits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt,
          iterations,
          hash: 'SHA-256',
        },
        baseKey,
        256,
      );

      const hash = new Uint8Array(bits);

      return `pbkdf2:sha256:${iterations}:` + `${bytesToHex(salt)}:` + `${bytesToHex(hash)}`;
    }

    async function verificarPassword(password, passwordHash) {
      try {
        const partes = passwordHash.split(':');

        if (partes.length !== 5 || partes[0] !== 'pbkdf2' || partes[1] !== 'sha256') {
          return false;
        }

        const iterations = Number(partes[2]);

        const salt = hexToBytes(partes[3]);

        const hashGuardado = hexToBytes(partes[4]);

        const baseKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);

        const bits = await crypto.subtle.deriveBits(
          {
            name: 'PBKDF2',
            salt,
            iterations,
            hash: 'SHA-256',
          },
          baseKey,
          256,
        );

        const hashCalculado = new Uint8Array(bits);

        if (hashCalculado.length !== hashGuardado.length) {
          return false;
        }

        let diferencia = 0;

        for (let i = 0; i < hashCalculado.length; i++) {
          diferencia |= hashCalculado[i] ^ hashGuardado[i];
        }

        return diferencia === 0;
      } catch (error) {
        console.error('Error verificando contraseña:', error);

        return false;
      }
    }

    // ==========================================
    // AUTENTICACIÓN
    // ==========================================

    async function obtenerSesion() {
      const encabezado = request.headers.get('Authorization');

      if (!encabezado || !encabezado.startsWith('Bearer ')) {
        return null;
      }

      const token = encabezado.substring(7).trim();

      if (!token) {
        return null;
      }

      const tokenHash = await sha256(token);

      const sesion = await env.DB.prepare(
        `
            SELECT
              s.token,
              s.usuario_id,
              s.expira_en,
              u.id,
              u.nombre,
              u.usuario,
              u.rol,
              u.activo
            FROM sesiones s
            INNER JOIN usuarios u
              ON u.id = s.usuario_id
            WHERE s.token = ?
            LIMIT 1
            `,
      )
        .bind(tokenHash)
        .first();

      if (!sesion) {
        return null;
      }

      if (Number(sesion.activo) !== 1) {
        return null;
      }

      const expira = new Date(sesion.expira_en).getTime();

      if (!Number.isFinite(expira) || expira <= Date.now()) {
        await env.DB.prepare(
          `
            DELETE FROM sesiones
            WHERE token = ?
            `,
        )
          .bind(tokenHash)
          .run();

        return null;
      }

      return sesion;
    }

    async function requiereSesion() {
      const sesion = await obtenerSesion();

      if (!sesion) {
        return respuestaJSON(
          {
            ok: false,
            error: 'No autorizado.',
          },
          401,
        );
      }

      return sesion;
    }

    // ==========================================
    // INICIO
    // ==========================================

    if (url.pathname === '/' && request.method === 'GET') {
      return respuestaJSON({
        ok: true,
        mensaje: 'Los +Qalitas API funcionando',
      });
    }

    // ==========================================
    // PRUEBA D1
    // ==========================================

    if (url.pathname === '/db-test' && request.method === 'GET') {
      try {
        const resultado = await env.DB.prepare(
          `
              SELECT
                ultimo_numero
              FROM contador_pedidos
              WHERE id = 1
              `,
        ).first();

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
    // LOGIN
    // ==========================================

    if (url.pathname === '/login' && request.method === 'POST') {
      try {
        const datos = await request.json();

        const usuario = String(datos.usuario || '')
          .trim()
          .toLowerCase();

        const password = String(datos.password || '');

        if (!usuario || !password) {
          return respuestaJSON(
            {
              ok: false,
              error: 'Usuario y contraseña son obligatorios.',
            },
            400,
          );
        }

        const cuenta = await env.DB.prepare(
          `
              SELECT
                id,
                nombre,
                usuario,
                password_hash,
                rol,
                activo
              FROM usuarios
              WHERE usuario = ?
              LIMIT 1
              `,
        )
          .bind(usuario)
          .first();

        if (!cuenta || Number(cuenta.activo) !== 1) {
          return respuestaJSON(
            {
              ok: false,
              error: 'Usuario o contraseña incorrectos.',
            },
            401,
          );
        }

        const correcta = await verificarPassword(password, cuenta.password_hash);

        if (!correcta) {
          return respuestaJSON(
            {
              ok: false,
              error: 'Usuario o contraseña incorrectos.',
            },
            401,
          );
        }

        // ======================================
        // LIMPIAR SESIONES EXPIRADAS
        // ======================================

        await env.DB.prepare(
          `
            DELETE FROM sesiones
            WHERE expira_en <= ?
            `,
        )
          .bind(new Date().toISOString())
          .run();

        // ======================================
        // CREAR TOKEN DE SESIÓN
        // ======================================

        const token = generarToken();

        const tokenHash = await sha256(token);

        const expira = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();

        await env.DB.prepare(
          `
            INSERT INTO sesiones (
              token,
              usuario_id,
              expira_en
            )
            VALUES (?, ?, ?)
            `,
        )
          .bind(tokenHash, cuenta.id, expira)
          .run();

        return respuestaJSON({
          ok: true,

          token,

          usuario: {
            id: cuenta.id,
            nombre: cuenta.nombre,
            usuario: cuenta.usuario,
            rol: cuenta.rol,
          },

          expira,
        });
      } catch (error) {
        console.error('Error en login:', error);

        return respuestaJSON(
          {
            ok: false,
            error: 'Error interno al iniciar sesión.',
          },
          500,
        );
      }
    }

    // ==========================================
    // MI SESIÓN
    // ==========================================

    if (url.pathname === '/me' && request.method === 'GET') {
      const sesion = await requiereSesion();

      if (sesion instanceof Response) {
        return sesion;
      }

      return respuestaJSON({
        ok: true,

        usuario: {
          id: sesion.id,
          nombre: sesion.nombre,
          usuario: sesion.usuario,
          rol: sesion.rol,
        },
      });
    }

    // ==========================================
    // CERRAR SESIÓN
    // ==========================================

    if (url.pathname === '/logout' && request.method === 'POST') {
      const encabezado = request.headers.get('Authorization');

      if (encabezado) {
        const token = encabezado.replace('Bearer ', '').trim();

        if (token) {
          const tokenHash = await sha256(token);

          await env.DB.prepare(
            `
              DELETE FROM sesiones
              WHERE token = ?
              `,
          )
            .bind(tokenHash)
            .run();
        }
      }

      return respuestaJSON({
        ok: true,
      });
    }

    // ==========================================
    // CREAR USUARIO
    //
    // Esta ruta requiere SETUP_KEY
    // como Secret del Worker.
    // ==========================================

    if (url.pathname === '/crear-usuario' && request.method === 'POST') {
      try {
        const setupKey = request.headers.get('X-Setup-Key');

        if (!env.SETUP_KEY || !setupKey || setupKey !== env.SETUP_KEY) {
          return respuestaJSON(
            {
              ok: false,
              error: 'No autorizado.',
            },
            401,
          );
        }

        const datos = await request.json();

        const nombre = String(datos.nombre || '').trim();

        const usuario = String(datos.usuario || '')
          .trim()
          .toLowerCase();

        const password = String(datos.password || '');

        if (!nombre || !usuario || !password) {
          return respuestaJSON(
            {
              ok: false,
              error: 'Nombre, usuario y contraseña son obligatorios.',
            },
            400,
          );
        }

        if (password.length < 8) {
          return respuestaJSON(
            {
              ok: false,
              error: 'La contraseña debe tener al menos 8 caracteres.',
            },
            400,
          );
        }

        const passwordHash = await generarPasswordHash(password);

        await env.DB.prepare(
          `
            INSERT INTO usuarios (
              nombre,
              usuario,
              password_hash,
              rol,
              activo
            )
            VALUES (?, ?, ?, 'admin', 1)
            `,
        )
          .bind(nombre, usuario, passwordHash)
          .run();

        return respuestaJSON({
          ok: true,

          mensaje: 'Usuario creado correctamente.',

          usuario: {
            nombre,
            usuario,
            rol: 'admin',
          },
        });
      } catch (error) {
        console.error('Error creando usuario:', error);

        const mensaje = String(error.message || '');

        if (mensaje.toLowerCase().includes('unique')) {
          return respuestaJSON(
            {
              ok: false,
              error: 'Ese usuario ya existe.',
            },
            409,
          );
        }

        return respuestaJSON(
          {
            ok: false,
            error: 'No se pudo crear el usuario.',
          },
          500,
        );
      }
    }

    // ==========================================
    // CREAR PEDIDO
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
        // CONTADOR + PEDIDO
        // ======================================

        const resultados = await env.DB.batch([
          env.DB.prepare(
            `
              UPDATE contador_pedidos
              SET ultimo_numero =
                ultimo_numero + 1
              WHERE id = 1
              `,
          ),

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

          env.DB.prepare(
            `
              SELECT
                ultimo_numero
              FROM contador_pedidos
              WHERE id = 1
              `,
          ),
        ]);

        const numeroPedido = resultados[2]?.results?.[0]?.ultimo_numero;

        if (!numeroPedido) {
          throw new Error('No se pudo obtener el número de pedido.');
        }

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
        console.error('Error creando pedido:', error);

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
    // AHORA REQUIERE SESIÓN
    // ==========================================

    if (url.pathname === '/pedidos' && request.method === 'GET') {
      const sesion = await requiereSesion();

      if (sesion instanceof Response) {
        return sesion;
      }

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
    // ACTUALIZAR PEDIDO
    // AHORA REQUIERE SESIÓN
    // ==========================================

    if (url.pathname === '/actualizar-pedido' && request.method === 'POST') {
      const sesion = await requiereSesion();

      if (sesion instanceof Response) {
        return sesion;
      }

      try {
        const datos = await request.json();

        const id = Number(datos.id);

        const estado = String(datos.estado || '');

        const estadosPermitidos = ['nuevo', 'preparando', 'listo', 'entregado'];

        if (!id || !estadosPermitidos.includes(estado)) {
          return respuestaJSON(
            {
              ok: false,
              error: 'Datos de estado inválidos.',
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
