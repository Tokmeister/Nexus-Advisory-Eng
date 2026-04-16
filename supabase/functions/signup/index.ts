// functions/signup.ts
// Supabase Edge Function for atomic signup
// This runs on the server in a trusted context, can bypass RLS for setup

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface SignupRequest {
  email: string;
  password: string;
  full_name?: string;
  organisation_name: string;
  client_category?: string;
}

interface SignupResponse {
  user?: {
    id: string;
    email: string;
    user_metadata?: Record<string, unknown>;
  };
  organisation_id?: string;
  error?: {
    message: string;
  };
}

// Helper: Generate a simple org ID or use UUID
function generateOrgId(): string {
  return crypto.randomUUID();
}

// Helper: Validate email format
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export default async (req: Request): Promise<Response> => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: { message: 'Method not allowed' } }), { status: 405 });
  }

  try {
    const body: SignupRequest = await req.json();

    // Validation
    if (!body.email || !body.password || !body.organisation_name) {
      return new Response(
        JSON.stringify({ error: { message: 'Missing required fields: email, password, organisation_name' } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const email = body.email.trim().toLowerCase();
    const password = body.password;
    const organisationName = body.organisation_name.trim();
    const fullName = body.full_name?.trim() || email.split('@')[0];
    const category = body.client_category?.trim() || 'Start-ups';

    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: { message: 'Invalid email format' } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: { message: 'Password must be at least 8 characters' } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!organisationName || organisationName.length < 2) {
      return new Response(
        JSON.stringify({ error: { message: 'Organisation name is required (min 2 characters)' } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase Admin client
    // NOTE: In production, get these from environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: { message: 'Server configuration error' } }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Step 1: Create Auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Requires email verification
      user_metadata: {
        full_name: fullName,
        organisation_name: organisationName,
        client_category: category,
      },
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return new Response(
        JSON.stringify({ error: { message: authError.message || 'Failed to create auth user' } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = authData?.user?.id;
    if (!userId) {
      return new Response(
        JSON.stringify({ error: { message: 'Auth user created but no ID returned' } }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Create Organisation
    const organisationId = generateOrgId();
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from('organisations')
      .insert([
        {
          id: organisationId,
          name: organisationName,
          category: category,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select('id, name')
      .single();

    if (orgError) {
      console.error('Organisation creation error:', orgError);
      // Cleanup: Delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: { message: orgError.message || 'Failed to create organisation' } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Step 3: Create Profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([
        {
          id: userId,
          organisation_id: organisationId,
          email: email,
          full_name: fullName,
          role: 'client_admin', // First user is admin
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select('id, organisation_id, role')
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Cleanup: Delete the auth user and organisation
      await supabaseAdmin.auth.admin.deleteUser(userId);
      await supabaseAdmin.from('organisations').delete().eq('id', organisationId);
      return new Response(
        JSON.stringify({ error: { message: profileError.message || 'Failed to create profile' } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Success! Return the created user and org ID
    const response: SignupResponse = {
      user: {
        id: userId,
        email: authData.user.email || email,
        user_metadata: authData.user.user_metadata,
      },
      organisation_id: organisationId,
    };

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Signup error:', error);
    return new Response(
      JSON.stringify({ error: { message: 'Internal server error' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

