import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, requestPasswordReset } from '@/lib/auth/auth-client';
import { Eye, EyeOff } from 'lucide-react';
import { HeaderAuthActions, PublicFooter, PublicHeader, SHELL_BG } from '@/components/PublicMarketingChrome';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const result = await signIn.email({ email, password });
      if (result.error) {
        setMessage({ text: result.error.message || 'Invalid email or password.', type: 'error' });
      } else {
        navigate('/billing', { replace: true });
      }
    } catch {
      setMessage({ text: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!email.trim()) {
      setMessage({ text: 'Enter your email address first, then click Forgot password.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const result = await requestPasswordReset(email);
      if (result.error) {
        setMessage({ text: result.error.message || 'Could not send reset email.', type: 'error' });
      } else {
        setMessage({ text: 'Reset email sent. Check your inbox and use the button in the email to continue.', type: 'success' });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#f5f7fb', border: '1px solid #d7dce5',
    borderRadius: '12px', padding: '13px 14px', color: '#0b1f4d',
    fontSize: '15px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border-color 160ms ease',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '13px', fontWeight: 700, color: '#33415f',
    marginBottom: '6px', letterSpacing: '0.02em', textTransform: 'uppercase',
  };

  return (
    <div style={{ margin: 0, background: SHELL_BG, minHeight: '100vh', fontFamily: '"Segoe UI", Arial, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader rightContent={<HeaderAuthActions active="login" />} />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px 64px' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <small style={{ display: 'block', color: '#5e6c88', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>Welcome Back</small>
            <h1 style={{ margin: '0 0 10px', fontSize: 'clamp(42px,5vw,60px)', fontWeight: 900, color: '#003087', letterSpacing: '-0.045em', lineHeight: '1.02' }}>Sign in to NEXUS</h1>
            <p style={{ margin: 0, color: '#5e6c88', fontSize: '16px', lineHeight: '1.6' }}>Enter your credentials to access your billing and workspace flow.</p>
          </div>

          <div style={{ background: '#fff', borderRadius: '28px', boxShadow: '0 12px 40px rgba(13,33,89,0.09)', border: '1px solid #e5e8ef', padding: '36px 32px' }}>
            {message && (
              <div style={{ background: message.type === 'error' ? '#fff0f0' : '#f0fff4', border: `1px solid ${message.type === 'error' ? '#fca5a5' : '#86efac'}`, borderRadius: '14px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: message.type === 'error' ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                {message.text}
              </div>
            )}

            <form id="loginForm" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input id="loginEmail" type="email" required placeholder="you@company.co.za"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#003087')}
                  onBlur={e => (e.target.style.borderColor = '#d7dce5')} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                  <a href="#" onClick={handleForgotPassword} style={{ fontSize: '13px', color: '#003087', textDecoration: 'none', fontWeight: 700 }}>
                    Forgot password?
                  </a>
                </div>
                <div style={{ position: 'relative' }}>
                  <input id="loginPassword" type={showPassword ? 'text' : 'password'} required placeholder="Enter your password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: '3rem' }}
                    onFocus={e => (e.target.style.borderColor = '#003087')}
                    onBlur={e => (e.target.style.borderColor = '#d7dce5')} />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ba8be', padding: 0, display: 'flex', alignItems: 'center' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '52px', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', background: loading ? '#6b7a99' : '#003087', border: '2px solid #003087', color: '#fff', marginTop: '6px', transition: 'all 160ms ease' }}>
                {loading ? 'Signing in…' : 'Log In'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
