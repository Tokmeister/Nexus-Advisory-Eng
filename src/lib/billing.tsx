import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '@/lib/auth/auth-client';

type BillingCycle = 'monthly' | 'yearly';
type PlanCode = 'startup' | 'small_business' | 'enterprise';
type SubscriptionStatus = 'inactive' | 'pending' | 'active' | 'cancelled' | 'past_due';

type PlanDefinition = {
  code: PlanCode;
  categoryLabel: string;
  title: string;
  monthlyUsd: number;
  yearlyUsd: number;
  description: string;
  bullets: string[];
  monthlyPlanEnv: string;
  yearlyPlanEnv: string;
};

type BillingState = {
  organisationId: string;
  status: SubscriptionStatus;
  planCode: string;
  billingCycle: BillingCycle;
  paypalSubscriptionId: string;
  renewsAt: string;
};

type SupabaseUserLike = {
  id?: string;
  email?: string;
};

type QueryBuilder = {
  eq: (column: string, value: string) => QueryBuilder;
  maybeSingle: () => Promise<{ data: Record<string, unknown> | null; error: { message?: string } | null }>;
  single: () => Promise<{ data: Record<string, unknown>; error: { message?: string } | null }>;
};

type SupabaseClientLike = {
  auth: {
    getSession: () => Promise<{ data: { session: { user?: SupabaseUserLike } | null }; error: { message?: string } | null }>;
  };
  from: (table: string) => {
    select: (_columns?: string) => QueryBuilder;
    upsert: (
      rows: Record<string, unknown>[],
      options?: { onConflict?: string }
    ) => Promise<{ data: unknown; error: { message?: string } | null }>;
  };
};

declare global {
  interface Window {
    __nexusSupabaseBilling?: SupabaseClientLike;
    paypal?: {
      Buttons: (config: Record<string, unknown>) => { render: (selectorOrElement: string | HTMLElement) => Promise<void> };
    };
  }
}

const SUPABASE_URL = import.meta.env.VITE_NEXUS_SUPABASE_URL || 'https://clwjhdxjdpikrxcormsb.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_NEXUS_SUPABASE_ANON_KEY || 'sb_publishable_EJGKO-RRnc9zJo8jUxsLlQ_uvTNC2Bw';
const PAYPAL_CLIENT_ID = String(import.meta.env.VITE_PAYPAL_CLIENT_ID || '').trim();

let supabasePromise: Promise<SupabaseClientLike> | null = null;
let paypalScriptPromise: Promise<void> | null = null;

function clean(value: unknown): string {
  return String(value || '').trim();
}

async function getSupabase(): Promise<SupabaseClientLike> {
  const existing = window.__nexusSupabaseBilling;
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

      window.__nexusSupabaseBilling = client;
      return client;
    });
  }

  return supabasePromise;
}

async function getCurrentOrganisationId(): Promise<string> {
  const cached = clean(localStorage.getItem('activeOrganisationId')) || clean(localStorage.getItem('nexus_selected_organisation_id'));
  if (cached) return cached;

  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message || 'Could not read session.');
  const userId = clean(data?.session?.user?.id);
  if (!userId) throw new Error('No authenticated user session found.');

  const profile = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', userId)
    .maybeSingle();

  if (profile.error) throw new Error(profile.error.message || 'Could not read organisation context.');
  const organisationId = clean(profile.data?.organisation_id);
  if (!organisationId) throw new Error('No active organisation_id was found.');

  localStorage.setItem('activeOrganisationId', organisationId);
  localStorage.setItem('nexus_selected_organisation_id', organisationId);
  return organisationId;
}

export const BILLING_PLANS: PlanDefinition[] = [
  {
    code: 'startup',
    categoryLabel: 'CATEGORY 01',
    title: 'Start-ups',
    monthlyUsd: 27,
    yearlyUsd: 275,
    description: 'Built for start-ups that need traction, structure, and momentum.',
    bullets: [
      'Solve problems faster',
      'Build clear workflows',
      'Create a growth foundation',
      'Powered by our Nexus strong logic framework',
      'Gemini Flash-Lite with 20 inputs/month',
    ],
    monthlyPlanEnv: 'VITE_PAYPAL_PLAN_ID_STARTUP_MONTHLY',
    yearlyPlanEnv: 'VITE_PAYPAL_PLAN_ID_STARTUP_YEARLY',
  },
  {
    code: 'small_business',
    categoryLabel: 'CATEGORY 02',
    title: 'Small Businesses',
    monthlyUsd: 54,
    yearlyUsd: 550,
    description: 'Built for growing businesses that need visibility, control, and stronger execution.',
    bullets: [
      'Find leakage and pressure points',
      'Improve reporting and follow-through',
      'Build accountability and momentum',
      'Powered by our Nexus strong logic framework',
      'Gemini Flash with 50 inputs/month',
    ],
    monthlyPlanEnv: 'VITE_PAYPAL_PLAN_ID_SMALL_BUSINESS_MONTHLY',
    yearlyPlanEnv: 'VITE_PAYPAL_PLAN_ID_SMALL_BUSINESS_YEARLY',
  },
  {
    code: 'enterprise',
    categoryLabel: 'CATEGORY 03',
    title: 'Enterprise Solutions',
    monthlyUsd: 270,
    yearlyUsd: 2750,
    description: 'Built for larger organisations that need scale, coordination, and deeper execution support.',
    bullets: [
      'Manage more complex environments',
      'Align reporting with execution',
      'Strengthen scalable action management',
      'Powered by our Nexus strong logic framework',
      'Gemini Pro with 100 inputs/month',
    ],
    monthlyPlanEnv: 'VITE_PAYPAL_PLAN_ID_ENTERPRISE_MONTHLY',
    yearlyPlanEnv: 'VITE_PAYPAL_PLAN_ID_ENTERPRISE_YEARLY',
  },
];

export function getPlanAmount(plan: PlanDefinition, cycle: BillingCycle) {
  return cycle === 'yearly' ? plan.yearlyUsd : plan.monthlyUsd;
}

export function getPlanId(plan: PlanDefinition, cycle: BillingCycle) {
  const key = cycle === 'yearly' ? plan.yearlyPlanEnv : plan.monthlyPlanEnv;
  return clean(import.meta.env[key]);
}

export async function getBillingState(): Promise<BillingState> {
  const organisationId = await getCurrentOrganisationId();
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from('organisation_subscriptions')
    .select('organisation_id,status,plan_code,billing_cycle,paypal_subscription_id,renews_at')
    .eq('organisation_id', organisationId)
    .maybeSingle();

  if (error) {
    return {
      organisationId,
      status: 'inactive',
      planCode: '',
      billingCycle: 'monthly',
      paypalSubscriptionId: '',
      renewsAt: '',
    };
  }

  return {
    organisationId,
    status: (clean(data?.status) as SubscriptionStatus) || 'inactive',
    planCode: clean(data?.plan_code),
    billingCycle: (clean(data?.billing_cycle) as BillingCycle) || 'monthly',
    paypalSubscriptionId: clean(data?.paypal_subscription_id),
    renewsAt: clean(data?.renews_at),
  };
}

export async function savePendingSelection(args: { planCode: PlanCode; billingCycle: BillingCycle }) {
  const organisationId = await getCurrentOrganisationId();
  const supabase = await getSupabase();
  const now = new Date().toISOString();

  const { error } = await supabase.from('organisation_subscriptions').upsert(
    [
      {
        organisation_id: organisationId,
        plan_code: args.planCode,
        billing_cycle: args.billingCycle,
        status: 'pending',
        updated_at: now,
      },
    ],
    { onConflict: 'organisation_id' }
  );

  if (error) throw new Error(error.message || 'Could not save plan selection.');
}

export async function saveApprovedSubscription(args: {
  planCode: PlanCode;
  billingCycle: BillingCycle;
  paypalSubscriptionId: string;
}) {
  const organisationId = await getCurrentOrganisationId();
  const supabase = await getSupabase();
  const renewsAt = new Date(Date.now() + (args.billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  const { error } = await supabase.from('organisation_subscriptions').upsert(
    [
      {
        organisation_id: organisationId,
        plan_code: args.planCode,
        billing_cycle: args.billingCycle,
        status: 'active',
        paypal_subscription_id: args.paypalSubscriptionId,
        starts_at: now,
        renews_at: renewsAt,
        updated_at: now,
      },
    ],
    { onConflict: 'organisation_id' }
  );

  if (error) throw new Error(error.message || 'Could not activate subscription.');
}

export async function loadPayPalSdk() {
  if (window.paypal) return;
  if (!PAYPAL_CLIENT_ID) throw new Error('PayPal client ID is missing.');
  if (!paypalScriptPromise) {
    paypalScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-paypal-sdk="nexus"]') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Could not load PayPal SDK.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(PAYPAL_CLIENT_ID)}&vault=true&intent=subscription`;
      script.async = true;
      script.dataset.paypalSdk = 'nexus';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Could not load PayPal SDK.'));
      document.head.appendChild(script);
    });
  }

  return paypalScriptPromise;
}

export function SubscribedRoute({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const state = await getBillingState();
        if (!mounted) return;
        setActive(state.status === 'active');
      } catch {
        if (!mounted) return;
        setActive(false);
      } finally {
        if (mounted) setChecking(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [session?.user?.email]);

  if (isPending || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!session?.user?.email) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!active) {
    return <Navigate to="/billing" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
