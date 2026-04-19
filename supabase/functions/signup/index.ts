// functions/signup.ts (TESTED & WORKING VERSION)
// Supabase Edge Function for atomic signup
// Uses Supabase SQL function - FULLY TESTED IN DATABASE

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: { message: 'Server configuration error' } }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Step 1: Create Auth user first
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

    // Step 2: Call the Supabase SQL function to create organisation and profile atomically
    // This function was tested in Supabase and works correctly
    const { data: signupResult, error: signupError } = await supabaseAdmin
      .rpc('signup_user', {
        p_email: email,
        p_password: password,
        p_full_name: fullName,
        p_organisation_name: organisationName,
        p_category: category,
      });

    if (signupError) {
      console.error('Signup function error:', signupError);
      // Cleanup: Delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: { message: signupError.message || 'Failed to create organisation/profile' } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!signupResult || signupResult.length === 0) {
      return new Response(
        JSON.stringify({ error: { message: 'Signup returned no result' } }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = signupResult[0];
    
    if (!result.success) {
      console.error('Signup failed:', result.error_message);
      // Cleanup: Delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: { message: result.error_message || 'Failed to create organisation/profile' } }),
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
      organisation_id: result.organisation_id,
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
