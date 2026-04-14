import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '@/lib/auth/auth-client';
import { HeaderAuthActions, PublicFooter, PublicHeader, SHELL_BG } from '@/components/PublicMarketingChrome';

const CATEGORIES = [
  {
    id: 'Start-ups',
    title: 'Start-ups',
    desc: 'Built for start-ups that need traction, structure, and momentum.',
    bullets: ['Solve problems faster', 'Build clear workflows'],
  },
  {
    id: 'Small Businesses',
    title: 'Small Businesses',
    desc: 'Built for growing businesses that need visibility, control, and stronger execution.',
    bullets: ['Find leakage and pressure points', 'Improve reporting and follow-through'],
  },
  {
    id: 'Enterprise Solutions',
    title: 'Enterprise Solutions',
    desc: 'Built for larger organisations that need scale, coordination, and deeper execution support.',
    bullets: ['Manage more complex environments', 'Align reporting with execution'],
  },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: '',
    organisationName: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' | 'warn' } | null>(null);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!form.category) {
      setMessage({ text: 'Please select a client category.', type: 'warn' });
      return;
    }

    if (!form.organisationName.trim()) {
      setMessage({ text: 'Organisation name is required.', type: 'warn' });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'warn' });
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.email({
        email: form.email,
        password: form.password,
        name: form.fullName,
        organisationName: form.organisationName,
        category: form.category,
      });

      if (result.error) {
        setMessage({ text: result.error.message || 'Sign-up failed.', type: 'error' });
      } else {
        setMessage({ text: 'Account created! Redirecting to login…', type: 'success' });
        setTimeout(() => navigate('/login'), 1200);
      }
    } catch {
      setMessage({ text: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '54px',
    padding: '0 14px',
    border: '1px solid #b7c3d7',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    background: '#fff',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 160ms ease',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '7px',
    fontSize: '13px',
    color: '#3d4f70',
    fontWeight: 700,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  };

  const msgColor = message?.type === 'error' ? '#c73a3a' : message?.type === 'success' ? '#1a8f4d' : '#9d6a00';

  return (
    <div style={{ margin: 0, fontFamily: '"Segoe UI", Arial, sans-serif', background: SHELL_BG, color: '#062c72', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader rightContent={<HeaderAuthActions active="signup" />} />

      <main style={{ maxWidth: '1240px', margin: '0 auto', width: '100%', padding: '42px 24px 70px', boxSizing: 'border-box' }}>
        <section style={{ textAlign: 'center', marginBottom: '28px' }}>
          <small style={{ display: 'block', marginBottom: '14px', fontSize: '14px', fontWeight: 700, color: '#003087' }}>
            Sign up for Nexus
          </small>
          <h1 style={{ margin: 0, fontSize: 'clamp(42px, 5vw, 60px)', lineHeight: '1.02', letterSpacing: '-0.045em', color: '#003087', fontWeight: 900 }}>
            Choose the account that fits your business.
          </h1>
        </section>

        <div style={{ maxWidth: '860px', margin: '0 auto', background: '#fff', border: '1px solid #d6dde8', borderRadius: '28px', boxShadow: '0 10px 28px rgba(15,33,84,0.10)', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            {CATEGORIES.map(cat => {
              const active = form.category === cat.id;
              return (
                <article
                  key={cat.id}
                  onClick={() => set('category', cat.id)}
                  style={{
                    border: active ? '2px solid #003087' : '1px solid #dce3ee',
                    boxShadow: active ? 'inset 0 0 0 1px rgba(0,48,135,0.08)' : 'none',
                    borderRadius: '24px',
                    padding: '26px 20px',
                    cursor: 'pointer',
                    transition: 'all 160ms ease',
                    minHeight: '246px',
                    background: active ? '#f8fbff' : '#fff',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ width: '22px', height: '22px', border: '2px solid #9eb2d0', borderRadius: '50%', marginBottom: '16px', position: 'relative', flexShrink: 0 }}>
                    {active && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#003087', position: 'absolute', top: '4px', left: '4px' }} />}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: '#42526e', marginBottom: '10px' }}>{cat.id === 'Start-ups' ? 'CATEGORY 01' : cat.id === 'Small Businesses' ? 'CATEGORY 02' : 'CATEGORY 03'}</div>
                  <h3 style={{ margin: '0 0 10px', fontSize: '28px', lineHeight: '0.98', color: '#003087', letterSpacing: '-0.03em' }}>{cat.title}</h3>
                  <p style={{ margin: '0 0 10px', color: '#2d3e5f', lineHeight: '1.6', fontSize: '15px' }}>{cat.desc}</p>
                  <ul style={{ margin: 0, paddingLeft: '18px', color: '#2d3e5f', lineHeight: '1.55', fontSize: '14px' }}>
                    {cat.bullets.map(b => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Client category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} style={fieldStyle}>
                <option value="">Select category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div>
                <label style={labelStyle}>Organisation name</label>
                <input value={form.organisationName} onChange={e => set('organisationName', e.target.value)} style={fieldStyle} placeholder="Enter organisation name" />
              </div>
              <div>
                <label style={labelStyle}>Full name</label>
                <input value={form.fullName} onChange={e => set('fullName', e.target.value)} style={fieldStyle} placeholder="Enter your full name" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Email address</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} style={fieldStyle} placeholder="you@company.com" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div>
                <label style={labelStyle}>Password</label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)} style={fieldStyle} placeholder="Create password" />
              </div>
              <div>
                <label style={labelStyle}>Confirm password</label>
                <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} style={fieldStyle} placeholder="Confirm password" />
              </div>
            </div>

            {message && <div style={{ color: msgColor, fontSize: '14px', fontWeight: 700 }}>{message.text}</div>}

            <button type="submit" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '54px', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', background: loading ? '#6b7a99' : '#003087', border: '2px solid #003087', color: '#fff', marginTop: '6px' }}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
