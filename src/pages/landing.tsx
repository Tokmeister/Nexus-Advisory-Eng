import { useNavigate } from 'react-router-dom';
import { BILLING_PLANS } from '@/lib/billing';
import { HeaderAuthActions, PublicFooter, PublicHeader } from '@/components/PublicMarketingChrome';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ margin: 0, background: '#ffffff', color: '#0b1f4d', fontFamily: '"Segoe UI", Arial, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader rightContent={<HeaderAuthActions />} />

      <section style={{ background: 'linear-gradient(180deg, #012169 0%, #001b5e 100%)', color: '#fff', padding: '70px 34px 88px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '18px', opacity: 0.95 }}>
            Nexus advisory intelligence platform
          </div>
          <h1 style={{ margin: '0 auto 22px', maxWidth: '900px', fontSize: 'clamp(54px, 6vw, 86px)', lineHeight: '0.96', letterSpacing: '-0.055em', fontWeight: 900 }}>
            Structured advisory execution built for growth.
          </h1>
          <p style={{ margin: '0 auto 28px', maxWidth: '760px', fontSize: '24px', lineHeight: '1.45', opacity: 0.96 }}>
            Turn business inputs into decision briefs, reports, projects, and actionable execution — with a cleaner, smarter, client-ready operating environment.
          </p>
          <button
            onClick={() => navigate('/signup')}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '54px', padding: '0 30px', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', border: '2px solid #fff', background: '#fff', color: '#003087', transition: 'all 160ms ease' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#f0f4ff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fff';
            }}
          >
            Sign Up
          </button>
          <div style={{ marginTop: '18px', fontSize: '16px', opacity: 0.9 }}>
            Need help choosing the right path?{' '}
            <span onClick={() => navigate('/signup')} style={{ color: '#fff', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
              Start with account selection
            </span>
            .
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1240px', margin: '-34px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 3, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ background: '#efefef', borderRadius: '36px', overflow: 'hidden', border: '1px solid #d9deea' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 0 }}>
            {BILLING_PLANS.map((plan, index) => (
              <section key={plan.code} id={plan.code === 'startup' ? 'startup' : plan.code === 'small_business' ? 'small-business' : 'enterprise'} style={{ padding: '34px 30px 28px', borderRight: index < 2 ? '1px solid #d9deea' : 'none', display: 'flex', flexDirection: 'column', minHeight: '438px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: '#42526e', marginBottom: '12px' }}>{plan.categoryLabel}</div>
                <h3 style={{ margin: 0, fontSize: 'clamp(34px, 4vw, 46px)', lineHeight: '0.98', color: '#003087', letterSpacing: '-0.03em' }}>{plan.title}</h3>
                <div style={{ marginTop: '18px', fontSize: '31px', fontWeight: 800, color: '#003087' }}>
                  ${plan.monthlyUsd.toLocaleString()}
                  <span style={{ fontSize: '18px', fontWeight: 700 }}>/month</span>
                </div>
                <div style={{ marginTop: '6px', fontSize: '13px', color: '#5e6c88', fontWeight: 700 }}>Exclusive of VAT</div>
                <p style={{ margin: '28px 0 18px', color: '#33415f', fontSize: '16px', lineHeight: '1.75', minHeight: '82px' }}>{plan.description}</p>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#33415f', fontSize: '16px', lineHeight: '1.95', minHeight: '210px' }}>
                  {plan.bullets.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/signup')}
                  style={{ marginTop: '28px', alignSelf: 'flex-start', border: '2px solid #003087', background: 'transparent', color: '#003087', borderRadius: '999px', padding: '12px 18px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Choose {plan.title}
                </button>
              </section>
            ))}
          </div>
        </div>
      </div>

      <section style={{ background: '#fff', padding: '10px 34px 70px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '28px', alignItems: 'stretch' }}>
          {[
            { kicker: 'Why Nexus', title: 'One entry point. Three client paths. One execution system.', body: 'Nexus is our Advisory AI Engine — a capability our team is extremely proud of — built to turn business data into sharper insight, smarter decisions, and faster execution.' },
            { kicker: 'Built for clarity and momentum', title: 'Choose the right path for your business.', body: 'Create your account and move from challenge to execution through a structured, guided workflow.' },
          ].map((card, i) => (
            <div key={i} style={{ border: '1px solid #e5e8ef', borderRadius: '28px', padding: '32px', background: '#fff', boxShadow: '0 12px 30px rgba(13,33,89,0.05)' }}>
              <small style={{ display: 'block', marginBottom: '12px', color: '#5e6c88', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '12px', fontWeight: 700 }}>{card.kicker}</small>
              <h2 style={{ margin: '0 0 14px', fontSize: '38px', lineHeight: '1.08', color: '#003087', letterSpacing: '-0.03em' }}>{card.title}</h2>
              <p style={{ margin: 0, color: '#33415f', fontSize: '16px', lineHeight: '1.75' }}>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
