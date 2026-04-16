import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BILLING_PLANS,
  getBillingState,
  getPlanAmount,
  getPlanId,
  loadPayPalSdk,
  saveApprovedSubscription,
  savePendingSelection,
} from '@/lib/billing';
import { BillingHeaderMeta, PublicFooter, PublicHeader, SHELL_BG } from '@/components/PublicMarketingChrome';

type BillingCycle = 'monthly' | 'yearly';
type PlanCode = 'startup' | 'small_business' | 'enterprise';

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => {
        render: (selectorOrElement: string | HTMLElement) => Promise<void>;
        close?: () => void;
      };
    };
  }
}

export default function BillingPage() {
  const navigate = useNavigate();
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PlanCode>('startup');
  const [statusMessage, setStatusMessage] = useState<{ text: string; tone: 'error' | 'success' | 'info' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [renderingPayPal, setRenderingPayPal] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement | null>(null);

  const activePlan = useMemo(() => BILLING_PLANS.find(plan => plan.code === selectedPlan) || BILLING_PLANS[0], [selectedPlan]);
  const activePlanId = getPlanId(activePlan, cycle);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const billing = await getBillingState();
        if (!mounted) return;
        if (billing.status === 'active') {
          setHasActiveSubscription(true);
          navigate('/welcome', { replace: true });
          return;
        }
        if (billing.planCode === 'small_business' || billing.planCode === 'enterprise' || billing.planCode === 'startup') {
          setSelectedPlan(billing.planCode as PlanCode);
        }
        if (billing.billingCycle === 'yearly' || billing.billingCycle === 'monthly') {
          setCycle(billing.billingCycle);
        }
      } catch {
        // Stay on billing page with defaults.
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    let mounted = true;

    const renderButtons = async () => {
      if (!paypalContainerRef.current) return;
      paypalContainerRef.current.innerHTML = '';
      setStatusMessage(null);

      try {
        await savePendingSelection({ planCode: selectedPlan, billingCycle: cycle });
      } catch (error) {
        if (mounted) {
          setStatusMessage({ text: error instanceof Error ? error.message : 'Could not save your selected plan.', tone: 'error' });
        }
        return;
      }

      if (!activePlanId) {
        if (mounted) {
          setStatusMessage({
            text: 'PayPal plan ID is not configured for this option yet. Add the matching VITE_PAYPAL_PLAN_ID_* value and refresh.',
            tone: 'info',
          });
        }
        return;
      }

      try {
        setRenderingPayPal(true);
        await loadPayPalSdk();

        if (!window.paypal || !paypalContainerRef.current || !mounted) return;

        await window.paypal
          .Buttons({
            style: {
              shape: 'pill',
              color: 'gold',
              layout: 'vertical',
              label: 'subscribe',
            },
            createSubscription: (_data: unknown, actions: { subscription: { create: (payload: Record<string, unknown>) => Promise<string> } }) => {
              return actions.subscription.create({ plan_id: activePlanId });
            },
            onApprove: async (data: { subscriptionID?: string }) => {
              try {
                await saveApprovedSubscription({
                  planCode: selectedPlan,
                  billingCycle: cycle,
                  paypalSubscriptionId: String(data.subscriptionID || ''),
                });
                navigate('/welcome', { replace: true });
              } catch (error) {
                setStatusMessage({ text: error instanceof Error ? error.message : 'Payment approved, but subscription activation failed.', tone: 'error' });
              }
            },
            onError: (error: unknown) => {
              setStatusMessage({ text: error instanceof Error ? error.message : 'PayPal checkout failed. Please try again.', tone: 'error' });
            },
          })
          .render(paypalContainerRef.current);
      } catch (error) {
        if (mounted) {
          setStatusMessage({ text: error instanceof Error ? error.message : 'Could not load PayPal checkout.', tone: 'error' });
        }
      } finally {
        if (mounted) setRenderingPayPal(false);
      }
    };

    if (!loading && !hasActiveSubscription) {
      void renderButtons();
    }

    return () => {
      mounted = false;
      if (paypalContainerRef.current) paypalContainerRef.current.innerHTML = '';
    };
  }, [cycle, selectedPlan, loading, hasActiveSubscription, activePlanId, navigate]);

  const msgStyles: Record<'error' | 'success' | 'info', React.CSSProperties> = {
    error: { background: '#fff1f1', border: '1px solid #f2b6b6', color: '#b42318' },
    success: { background: '#f1fff5', border: '1px solid #8ad7a1', color: '#157347' },
    info: { background: '#f5f8ff', border: '1px solid #bfd2f3', color: '#0b3d91' },
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: SHELL_BG }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', border: '3px solid #c8d4ea', borderTopColor: '#003087', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ margin: 0, minHeight: '100vh', background: SHELL_BG, color: '#062c72', fontFamily: '"Segoe UI", Arial, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader rightContent={<BillingHeaderMeta />} />

      <main style={{ maxWidth: '1240px', margin: '0 auto', width: '100%', padding: '40px 24px 64px', boxSizing: 'border-box' }}>
        <section style={{ textAlign: 'center', marginBottom: '30px' }}>
          <small style={{ display: 'block', marginBottom: '14px', fontSize: '14px', fontWeight: 700, color: '#003087' }}>
            NEXUS SUBSCRIPTION
          </small>
          <h1 style={{ margin: 0, fontSize: 'clamp(42px, 5vw, 60px)', lineHeight: '1.02', letterSpacing: '-0.045em', color: '#003087', fontWeight: 900 }}>
            Choose the right Nexus plan for your business.
          </h1>
          <p style={{ maxWidth: '760px', margin: '16px auto 0', color: '#42526e', fontSize: '17px', lineHeight: '1.7' }}>
            Move from challenge to execution through a structured advisory workflow. Save 15% with annual billing.
          </p>
        </section>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #d7deea', borderRadius: '999px', padding: '6px' }}>
            {(['monthly', 'yearly'] as BillingCycle[]).map(option => {
              const active = cycle === option;
              return (
                <button
                  key={option}
                  onClick={() => setCycle(option)}
                  style={{
                    minWidth: '150px',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '12px 18px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 700,
                    background: active ? '#003087' : 'transparent',
                    color: active ? '#fff' : '#003087',
                  }}
                >
                  {option === 'monthly' ? 'Monthly' : 'Yearly · Save 15%'}
                </button>
              );
            })}
          </div>
        </div>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0', background: '#efefef', borderRadius: '36px', overflow: 'hidden', border: '1px solid #d9deea' }}>
          {BILLING_PLANS.map(plan => {
            const active = selectedPlan === plan.code;
            const price = getPlanAmount(plan, cycle);
            return (
              <article key={plan.code} style={{ padding: '34px 30px 28px', background: active ? '#f8fbff' : '#efefef', borderRight: plan.code !== 'enterprise' ? '1px solid #d9deea' : 'none', position: 'relative' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: '#42526e', marginBottom: '12px' }}>{plan.categoryLabel}</div>
                <h2 style={{ margin: 0, fontSize: 'clamp(34px, 4vw, 46px)', lineHeight: '0.98', color: '#003087', letterSpacing: '-0.03em' }}>{plan.title}</h2>
                <div style={{ marginTop: '18px', fontSize: '31px', fontWeight: 800, color: '#003087' }}>
                  ${price.toLocaleString()}
                  <span style={{ fontSize: '18px', fontWeight: 700 }}>{cycle === 'monthly' ? '/month' : '/year'}</span>
                </div>
                <div style={{ marginTop: '6px', fontSize: '13px', color: '#5e6c88', fontWeight: 700 }}>Exclusive of VAT</div>
                <p style={{ margin: '28px 0 18px', color: '#33415f', fontSize: '16px', lineHeight: '1.75', minHeight: '82px' }}>{plan.description}</p>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#33415f', fontSize: '16px', lineHeight: '1.95', minHeight: '210px' }}>
                  {plan.bullets.map(item => <li key={item}>{item}</li>)}
                </ul>
                <button
                  onClick={() => setSelectedPlan(plan.code)}
                  style={{
                    marginTop: '28px',
                    border: '2px solid #003087',
                    background: active ? '#003087' : 'transparent',
                    color: active ? '#fff' : '#003087',
                    borderRadius: '999px',
                    padding: '12px 18px',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {active ? 'Selected' : `Choose ${plan.title}`}
                </button>
              </article>
            );
          })}
        </section>

        <section style={{ maxWidth: '760px', margin: '30px auto 0', background: '#fff', border: '1px solid #d7deea', borderRadius: '24px', padding: '28px 28px 24px', boxShadow: '0 10px 28px rgba(15,33,84,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#5e6c88', fontWeight: 700, letterSpacing: '0.08em' }}>PAYMENT</div>
              <h3 style={{ margin: '6px 0 0', fontSize: '28px', lineHeight: '1.15', color: '#003087' }}>
                {activePlan.title} · {cycle === 'monthly' ? 'Monthly' : 'Annual'}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', color: '#5e6c88' }}>Amount due</div>
              <div style={{ fontSize: '30px', color: '#003087', fontWeight: 800 }}>${getPlanAmount(activePlan, cycle).toLocaleString()}</div>
            </div>
          </div>

          <p style={{ margin: '0 0 18px', color: '#42526e', fontSize: '15px', lineHeight: '1.7' }}>
            Pay securely with PayPal to activate your organisation subscription. Once payment is approved, your Nexus workspace will unlock automatically.
          </p>

          {statusMessage && (
            <div style={{ ...msgStyles[statusMessage.tone], borderRadius: '14px', padding: '12px 14px', marginBottom: '18px', fontSize: '14px', fontWeight: 600 }}>
              {statusMessage.text}
            </div>
          )}

          <div ref={paypalContainerRef} />

          {renderingPayPal && (
            <div style={{ marginTop: '12px', fontSize: '14px', color: '#5e6c88' }}>Loading PayPal checkout…</div>
          )}

          {!activePlanId && (
            <div style={{ marginTop: '16px', padding: '14px 16px', borderRadius: '14px', background: '#f9fbff', border: '1px dashed #b8c9ea', color: '#33415f', fontSize: '14px', lineHeight: '1.7' }}>
              Add the PayPal environment values for this plan before go-live. The current selection expects a plan ID in <strong>{cycle === 'yearly' ? activePlan.yearlyPlanEnv : activePlan.monthlyPlanEnv}</strong>.
            </div>
          )}

          <div style={{ marginTop: '18px', fontSize: '13px', color: '#5e6c88', lineHeight: '1.7' }}>
            By continuing, you confirm that pricing is shown in USD and exclusive of VAT. Annual plans reflect a 15% once-off payment saving.
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

