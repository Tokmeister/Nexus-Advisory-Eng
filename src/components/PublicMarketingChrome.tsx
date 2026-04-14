import { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';

export const BRAND_BLUE = '#003087';
export const SHELL_BG = '#f4f5f7';

const headerButtonBase: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '50px',
  padding: '0 26px',
  borderRadius: '999px',
  fontSize: '16px',
  fontWeight: 700,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'all 160ms ease',
};

export function PublicHeader({ rightContent }: { rightContent?: ReactNode }) {
  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #e5e8ef', padding: '0 34px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', minHeight: '82px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{ justifySelf: 'start', display: 'inline-flex', alignItems: 'center', gap: '14px', textDecoration: 'none', color: '#0b1f4d', whiteSpace: 'nowrap' }}>
          <img src="/assets/nexus.png" alt="Nexus" style={{ height: '46px', width: 'auto', display: 'block', flexShrink: 0 }} />
          <span style={{ color: BRAND_BLUE, fontSize: '18px', fontWeight: 500, letterSpacing: '-0.01em' }}>NEXUS</span>
        </Link>

        <nav style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '34px', justifySelf: 'center', whiteSpace: 'nowrap' }}>
          <a href="/#startup" style={{ color: '#0b1f4d', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>Start-ups</a>
          <a href="/#small-business" style={{ color: '#0b1f4d', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>Small Businesses</a>
          <a href="/#enterprise" style={{ color: '#0b1f4d', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>Enterprise Solutions</a>
        </nav>

        <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '14px', minWidth: '230px', justifyContent: 'flex-end' }}>
          {rightContent}
        </div>
      </div>
    </header>
  );
}

export function HeaderAuthActions({ active }: { active?: 'login' | 'signup' }) {
  return (
    <>
      <Link
        to="/login"
        style={{
          ...headerButtonBase,
          border: `2px solid ${BRAND_BLUE}`,
          color: BRAND_BLUE,
          background: active === 'login' ? '#f4f7fd' : '#fff',
          opacity: active === 'login' ? 0.9 : 1,
        }}
      >
        Log In
      </Link>
      <Link
        to="/signup"
        style={{
          ...headerButtonBase,
          border: `2px solid ${BRAND_BLUE}`,
          color: '#fff',
          background: BRAND_BLUE,
          opacity: active === 'signup' ? 1 : 1,
        }}
      >
        Sign Up
      </Link>
    </>
  );
}

export function BillingHeaderMeta() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#5e6c88' }}>
      <span>All prices in USD and exclusive of VAT.</span>
      <Link to="/login" style={{ color: BRAND_BLUE, textDecoration: 'none', fontWeight: 700 }}>Back to login</Link>
    </div>
  );
}

export function PublicFooter() {
  const links = ['About', 'Advisory Platform', 'Features', 'Contact', 'Security', 'Developers', 'Privacy', 'Cookies', 'Legal'];

  return (
    <footer style={{ marginTop: 'auto', background: '#f6f7fa', borderTop: '1px solid #e3e7ee', padding: '40px 34px 28px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '18px', marginBottom: '18px', textAlign: 'center' }}>
          {links.map(link => (
            <a key={link} href="#" style={{ color: '#32405d', textDecoration: 'none', fontSize: '14px' }} onClick={e => e.preventDefault()}>
              {link}
            </a>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #d9e0ea', marginTop: '18px', paddingTop: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', color: '#32405d', fontWeight: 400, fontSize: '14px' }}>
            <img src="/assets/nexus.png" alt="Nexus" style={{ height: '42px', width: 'auto', display: 'block', flexShrink: 0 }} />
            <span style={{ marginLeft: '15px', lineHeight: '1' }}>NEXUS Advisory Intelligence Platform</span>
            <span style={{ marginLeft: 'auto', lineHeight: '1', textAlign: 'right' }}>Connecting data. Driving decisions.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
