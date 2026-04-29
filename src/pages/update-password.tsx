import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { updatePassword } from '@/lib/auth/auth-client';

export default function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!newPassword.trim()) {
      setMessage({ text: 'Enter a new password.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const result = await updatePassword(newPassword);
      if (result.error) {
        setMessage({ text: result.error.message || 'Password update failed.', type: 'error' });
      } else {
        setMessage({ text: 'Password updated successfully. Redirecting to login…', type: 'success' });
        setTimeout(() => navigate('/login', { replace: true }), 1200);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#f5f7fb', border: '1px solid #d7dce5',
    borderRadius: '10px', padding: '13px 14px', color: '#0b1f4d',
    fontSize: '15px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border-color 160ms ease',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '13px', fontWeight: '600', color: '#33415f',
    marginBottom: '6px', letterSpacing: '0.01em',
  };

  return (
    <div style={{ margin: 0, background: '#f5f7fb', minHeight: '100vh', fontFamily: '"Segoe UI", Arial, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e8ef', padding: '0 34px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', minHeight: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <img src="/assets/brand/nexus-logo-full.svg" alt="Nexus" style={{ height: '40px', width: 'auto', display: 'block' }} />
          </button>
          <div style={{ fontSize: '14px', color: '#5e6c88' }}>
            Remember your password?{' '}
            <Link to="/login" style={{ color: '#003087', fontWeight: '700', textDecoration: 'none' }}>Log In</Link>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px 64px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <small style={{ display: 'block', color: '#5e6c88', textTransform: 'uppercase' as const, letterSpacing: '0.1em', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>Password Reset</small>
            <h1 style={{ margin: '0 0 10px', fontSize: '36px', fontWeight: '800', color: '#003087', letterSpacing: '-0.03em', lineHeight: '1.1' }}>Set your new password</h1>
            <p style={{ margin: 0, color: '#5e6c88', fontSize: '16px', lineHeight: '1.5' }}>Use the recovery link from your email, then enter your new password below.</p>
          </div>

          <div style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 12px 40px rgba(13,33,89,0.09)', border: '1px solid #e5e8ef', padding: '36px 32px' }}>
            {message && (
              <div style={{ background: message.type === 'error' ? '#fff0f0' : '#f0fff4', border: `1px solid ${message.type === 'error' ? '#fca5a5' : '#86efac'}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: message.type === 'error' ? '#dc2626' : '#16a34a', fontWeight: '500' }}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={labelStyle}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} required placeholder="Create a strong password"
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: '3rem' }}
                    onFocus={e => (e.target.style.borderColor = '#003087')}
                    onBlur={e => (e.target.style.borderColor = '#d7dce5')} />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ba8be', padding: 0, display: 'flex', alignItems: 'center' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input type="password" required placeholder="Repeat your new password"
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#003087')}
                  onBlur={e => (e.target.style.borderColor = '#d7dce5')} />
              </div>
              <button type="submit" disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '52px', borderRadius: '999px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? '#6b7a99' : '#003087', border: 'none', color: '#fff', transition: 'all 160ms ease' }}>
                {loading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
            <Link to="/login" style={{ color: '#9ba8be', textDecoration: 'none' }}>← Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
