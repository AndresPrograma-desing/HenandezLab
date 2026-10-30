// Edge Function: crea un empleado completo (cuenta de Supabase Auth + fila en
// `empleados`) en una sola llamada, para que el sistema no dependa de que un
// administrador cree manualmente la cuenta desde el Dashboard de Supabase.
//
// Solo puede invocarla un usuario ya autenticado cuyo rol en `empleados` sea
// 'administrativo' — se valida contra la base con el JWT del caller antes de
// usar la service_role key.
//
// Deploy: supabase functions deploy crear-empleado
// Config de secretos (una vez, ya las toma Supabase automáticamente en
// runtime): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY.

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Falta el header Authorization' }, 401);

  // Cliente "como el caller" (respeta RLS) — solo para verificar quién llama.
  const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user: callerUser },
    error: callerError,
  } = await callerClient.auth.getUser();

  if (callerError || !callerUser) return json({ error: 'Token inválido o expirado' }, 401);

  const { data: callerEmpleado, error: callerEmpleadoError } = await callerClient
    .from('empleados')
    .select('rol')
    .eq('auth_user_id', callerUser.id)
    .maybeSingle();

  if (callerEmpleadoError || callerEmpleado?.rol !== 'administrativo') {
    return json({ error: 'Solo un administrativo puede crear usuarios' }, 403);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Cuerpo de la petición inválido' }, 400);
  }

  const { email, password, cedula, nombre, apellido, cargo, rol, id_sucursal } = body as Record<string, string>;

  if (!email || !password || !cedula || !nombre || !apellido || !rol || !id_sucursal) {
    return json({ error: 'Faltan campos obligatorios' }, 400);
  }
  if (password.length < 8) {
    return json({ error: 'La contraseña debe tener al menos 8 caracteres' }, 400);
  }
  if (rol !== 'administrativo' && rol !== 'recepcion') {
    return json({ error: 'Rol inválido' }, 400);
  }

  // Cliente con privilegios totales — nunca sale de esta función.
  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: existeCedula } = await adminClient.from('empleados').select('cedula').eq('cedula', cedula).maybeSingle();
  if (existeCedula) return json({ error: 'Ya existe un empleado con esa cédula' }, 409);

  const { data: createdAuthUser, error: createAuthError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createAuthError || !createdAuthUser?.user) {
    return json({ error: createAuthError?.message ?? 'No se pudo crear la cuenta de acceso' }, 400);
  }

  const { data: empleado, error: insertError } = await adminClient
    .from('empleados')
    .insert({
      cedula,
      nombre,
      apellido,
      cargo: cargo || null,
      rol,
      id_sucursal,
      auth_user_id: createdAuthUser.user.id,
    })
    .select('cedula, nombre, apellido, cargo, rol, id_sucursal, estado_activo')
    .single();

  if (insertError) {
    // Revertir el Auth user para no dejar una cuenta huérfana sin empleado.
    await adminClient.auth.admin.deleteUser(createdAuthUser.user.id);
    return json({ error: insertError.message }, 400);
  }

  return json({ empleado }, 201);
});
