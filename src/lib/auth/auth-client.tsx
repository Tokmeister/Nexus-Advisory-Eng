import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type SessionUser = {
  id?: string;
  email?: string;
  name?: string;
  image?: string | null;
};

type AuthSession = {
  user: SessionUser;
  session?: unknown;
};

type AuthResult<T = unknown> = {
  data: T | null;
  error: { message: string } | null;
};

type SignUpPayload = {
  email: string;
  password: string;
  name?: string;
  organisationName?: string;
  category?: string;
};

type SignInPayload = {
  email: string;
  password: string;
};

type SocialPayload = {
  provider: string;
  callbackURL?: string;
};

type SupabaseUserLike = {
  id?: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

type SupabaseClientLike = {
  auth: {
    getSession: () => Promise<{ data: { session: { user?: SupabaseUserLike } | null }; error: unknown }>;
    signInWithPassword: (args: { email: string; password: string }) => Promise<{
      data: { user?: SupabaseUserLike; session?: { user?: SupabaseUserLike } | null };
      error: { message?: string } | null;
    }>;
    signUp: (args: {
      email: string;
      password: string;
      options?: { data?: Record<string, unknown> };
    }) => Promise<{
      data: { user?: SupabaseUserLike; session?: { user?: SupabaseUserLike } | null };
      error: { message?: string } | null;
    }>;
    signOut: () => Promise<{ error: { message?: string } | null }>;
    resetPasswordForEmail: (email: string, options?: { redirectTo?: string }) => Promise<{ data?: unknown; error: { message?: string } | null }>;
    updateUser: (attributes: { password?: string }) => Promise<{ data?: unknown; error: { message?: string } | null }>;
    onAuthStateChange: (
      callback: (_event: string, session: { user?: SupabaseUserLike } | null) => void
    ) => { data: { subscription: { unsubscribe: () => void } } };
  };
  from: (table: string) => {
    select: (columns?: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{ data: Record<string, unknown> | null; error: { message?: string } | null }>;
      };
    };
    insert: (rows: Record<string, unknown>[]) => {
      select: (columns?: string) => {
        single: () => Promise<{ data: Record<string, unknown>; error: { message?: string } | null }>;
      };
    };
    upsert: (
      rows: Record<string, unknown>[],
      options?: { onConflict?: string }
    ) => Promise<{ data: unknown; error: { message?: string } | null }>;
  };
};

const AUTH_EVENT = 'nexus-auth-changed';

const SUPABASE_URL =
  import.meta.env.VITE_NEXUS_SUPABASE_URL || 'https://clwjhdxjdpikrxcormsb.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_NEXUS_SUPABASE_ANON_KEY || 'sb_publishable_EJGKO-RRnc9zJo8jUxsLlQ_uvTNC2Bw';

let supabasePromise: Promise<SupabaseClientLike> | null = null;

function emitAuthChanged() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function clean(value: unknown): string {
  return String(value || '').trim();
}

async function getSupabase(): Promise<SupabaseClientLike> {
  const existing = (window as Window & { __nexusSupabase?: SupabaseClientLike }).__nexusSupabase;
  if (existing) return existing;

  if (!supabasePromise) {
    supabasePromise = import(
      /* @vite-ignore */ 'https://esm.sh/@supabase/supabase-js@2'
    ).then((mod: { createClient: (url: string, key: string, options?: Record<string, unknown>) => SupabaseClientLike }) => {
      const client = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });

      (window as Window & { __nexusSupabase?: SupabaseClientLike }).__nexusSupabase = client;
      return client;
    });
  }

  return supabasePromise;
}

function readMetaOrganisationId(user?: SupabaseUserLike | null): string {
  if (!user) return '';

  const candidates = [
    user.user_metadata?.organisation_id,
    user.user_metadata?.organization_id,
    user.app_metadata?.organisation_id,
    user.app_metadata?.organization_id,
  ];

  for (const candidate of candidates) {
    const value = clean(candidate);
    if (value) return value;
  }

  return '';
}

function writeOrganisationId(organisationId: string) {
  const value = clean(organisationId);
  if (!value) return;

  localStorage.setItem('activeOrganisationId', value);
  localStorage.setItem('nexus_selected_organisation_id', value);
}

function clearOrganisationId() {
  localStorage.removeItem('activeOrganisationId');
  localStorage.removeItem('nexus_selected_organisation_id');
}

async function lookupOrganisationId(user?: SupabaseUserLike | null): Promise<string> {
  if (!user?.id) return '';

  // 1. Check user metadata first (zero network cost)
  const metaOrg = readMetaOrganisationId(user);
  if (metaOrg) {
    writeOrganisationId(metaOrg);
    return metaOrg;
  }

  // 2. Check localStorage cache (zero network cost)
  const cached =
    clean(localStorage.getItem('activeOrganisationId')) ||
    clean(localStorage.getItem('nexus_selected_organisation_id'));
  if (cached) return cached;

  // 3. Single Supabase query — no retry waterfall
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select('organisation_id')
      .eq('id', user.id as string)
      .maybeSingle();

    if (!error) {
      const organisationId = clean(data?.organisation_id);
      if (organisationId) {
        writeOrganisationId(organisationId);
        return organisationId;
      }
    }
  } catch {
    // Silently fall through — user stays functional without org ID
  }

  return '';
}

async function syncOrganisationContext(user?: SupabaseUserLike | null) {
  const organisationId = await lookupOrganisationId(user);
  if (organisationId) {
    writeOrganisationId(organisationId);
  }
}

function normaliseSessionUser(user?: SupabaseUserLike | null): SessionUser {
  return {
    id: clean(user?.id) || undefined,
    email: clean(user?.email) || undefined,
    name: clean(user?.user_metadata?.full_name) || clean(user?.user_metadata?.name) || undefined,
    image: null,
  };
}

async function readCurrentSession(): Promise<AuthSession | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(clean(error) || 'Failed to read session.');
  }

  const session = data?.session;
  const user = session?.user;

  if (!user?.email) return null;

  await syncOrganisationContext(user);

  return {
    user: normaliseSessionUser(user),
    session,
  };
}

async function ensureOrganisationAndProfile(user: SupabaseUserLike, payload: SignUpPayload) {
  const supabase = await getSupabase();

  const organisationName = clean(payload.organisationName);
  if (!organisationName) {
    throw new Error('Organisation name is required.');
  }

  const fullName = clean(payload.name) || clean(payload.email);
  const email = clean(payload.email).toLowerCase();

  const { data: organisation, error: organisationError } = await supabase
    .from('organisations')
    .insert([{ name: organisationName }])
    .select('id,name')
    .single();

  if (organisationError) {
    throw new Error(organisationError.message || 'Organisation insert failed.');
  }

  const profileRow = {
    id: user.id,
    organisation_id: organisation.id,
    email,
    full_name: fullName,
    role: 'client_admin',
  };

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert([profileRow], { onConflict: 'id' });

  if (profileError) {
    throw new Error(profileError.message || 'Profile upsert failed.');
  }

  writeOrganisationId(clean(organisation.id));
}

export const signIn = {
  email: async ({ email, password }: SignInPayload): Promise<AuthResult<AuthSession>> => {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: clean(email).toLowerCase(),
        password,
      });

      if (error) {
        return { data: null, error: { message: error.message || 'Invalid email or password.' } };
      }

      const user = data?.user || data?.session?.user || null;
      await syncOrganisationContext(user);
      emitAuthChanged();

      return {
        data: user
          ? {
              user: normaliseSessionUser(user),
              session: data?.session || null,
            }
          : await readCurrentSession(),
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Sign in failed.' },
      };
    }
  },

  social: async (_payload?: SocialPayload): Promise<AuthResult<unknown>> => {
    return {
      data: null,
      error: { message: 'Social sign-in is disabled in this build.' },
    };
  },
};

export const signUp = {
  email: async (payload: SignUpPayload): Promise<AuthResult<AuthSession>> => {
    try {
      const supabase = await getSupabase();
      const email = clean(payload.email).toLowerCase();
      const password = payload.password;
      const name = clean(payload.name);
      const organisationName = clean(payload.organisationName);
      const category = clean(payload.category);

      if (!organisationName) {
        return {
          data: null,
          error: { message: 'Organisation name is required.' },
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            organisation_name: organisationName,
            client_category: category,
          },
        },
      });

      if (error) {
        return { data: null, error: { message: error.message || 'Sign-up failed.' } };
      }

      const user = data?.user;
      if (!user?.id) {
        return {
          data: null,
          error: { message: 'Sign-up completed without a valid user record.' },
        };
      }

      await ensureOrganisationAndProfile(user, payload);
      emitAuthChanged();

      return {
        data: {
          user: normaliseSessionUser(user),
          session: data?.session || null,
        },
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Sign-up failed.' },
      };
    }
  },
};


export async function requestPasswordReset(email: string): Promise<AuthResult<boolean>> {
  try {
    const normalisedEmail = clean(email).toLowerCase();
    if (!normalisedEmail) {
      return { data: null, error: { message: 'Email address is required.' } };
    }

    const supabase = await getSupabase();
    const redirectTo = `${window.location.origin}/update-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(normalisedEmail, { redirectTo });

    if (error) {
      return { data: null, error: { message: error.message || 'Password reset request failed.' } };
    }

    return { data: true, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Password reset request failed.' },
    };
  }
}

export async function updatePassword(newPassword: string): Promise<AuthResult<boolean>> {
  try {
    const password = clean(newPassword);
    if (!password) {
      return { data: null, error: { message: 'New password is required.' } };
    }

    const supabase = await getSupabase();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { data: null, error: { message: error.message || 'Password update failed.' } };
    }

    emitAuthChanged();
    return { data: true, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Password update failed.' },
    };
  }
}

export async function signOut(): Promise<AuthResult<boolean>> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { data: null, error: { message: error.message || 'Sign out failed.' } };
    }

    clearOrganisationId();
    emitAuthChanged();
    return { data: true, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Sign out failed.' },
    };
  }
}

export function useSession() {
  const [data, setData] = useState<AuthSession | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | null = null;

    const sync = async () => {
      try {
        const session = await readCurrentSession();
        if (!mounted) return;
        setData(session);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Session read failed'));
        setData(null);
      } finally {
        if (mounted) setIsPending(false);
      }
    };

    void sync();

    const setupSubscription = async () => {
      const supabase = await getSupabase();
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!mounted) return;

        try {
          await syncOrganisationContext(session?.user || null);
          setData(
            session?.user?.email
              ? {
                  user: normaliseSessionUser(session.user),
                  session,
                }
              : null
          );
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Session sync failed'));
        } finally {
          setIsPending(false);
        }
      });

      unsubscribe = () => data.subscription.unsubscribe();
    };

    void setupSubscription();

    window.addEventListener('storage', sync);
    window.addEventListener(AUTH_EVENT, sync);

    return () => {
      mounted = false;
      unsubscribe?.();
      window.removeEventListener('storage', sync);
      window.removeEventListener(AUTH_EVENT, sync);
    };
  }, []);

  return { data, isPending, error };
}

export const useAuth = useSession;

export function SessionProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export const AuthProvider = SessionProvider;

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();
  const location = useLocation();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!session?.user?.email) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export function LogoutButton({
  className = '',
  children = 'Logout',
}: {
  className?: string;
  children?: ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      await signOut();
      window.location.href = '/login';
    } catch {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={className || 'px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50'}
    >
      {isLoading ? 'Logging out...' : children}
    </button>
  );
}
