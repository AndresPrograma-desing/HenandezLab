// Edge Function: elimina un empleado y, si tiene cuenta de acceso vinculada,
// también la cuenta de Supabase Auth — para no dejar logins huérfanos que
// solo se puedan limpiar a mano desde el Dashboard.
//
// Deploy: supabase functions deploy eliminar-empleado

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
    return json({ error: 'Solo un administrativo puede eliminar usuarios' }, 403);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Cuerpo de la petición inválido' }, 400);
  }

  const { cedula } = body as Record<string, string>;
  if (!cedula) return json({ error: 'Falta la cédula' }, 400);

  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: empleado, error: fetchError } = await adminClient
    .from('empleados')
    .select('auth_user_id')
    .eq('cedula', cedula)
    .maybeSingle();

  if (fetchError) return json({ error: fetchError.message }, 400);
  if (!empleado) return json({ error: 'No existe ese empleado' }, 404);

  const { error: deleteError } = await adminClient.from('empleados').delete().eq('cedula', cedula);
  if (deleteError) return json({ error: deleteError.message }, 400);

  if (empleado.auth_user_id) {
    await adminClient.auth.admin.deleteUser(empleado.auth_user_id);
  }

  return json({ ok: true });
});
