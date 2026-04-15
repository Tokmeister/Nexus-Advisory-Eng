import { ReactNode } from 'react';
import { PublicFooter, PublicHeader, HeaderAuthActions, BRAND_BLUE } from '@/components/PublicMarketingChrome';

type PublicInfoPageProps = {
  title: string;
  intro?: string;
  children: ReactNode;
};

export default function PublicInfoPage({ title, intro, children }: PublicInfoPageProps) {
  return (
    <div
      style={{
        margin: 0,
        background: '#ffffff',
        color: '#0b1f4d',
        fontFamily: '"Segoe UI", Arial, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PublicHeader rightContent={<HeaderAuthActions />} />

      <section style={{ background: 'linear-gradient(180deg, #012169 0%, #001b5e 100%)', color: '#fff', padding: '56px 34px 64px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', opacity: 0.92 }}>
            Nexus advisory intelligence platform
          </div>
          <h1
            style={{
              margin: '0 0 16px',
              maxWidth: '900px',
              fontSize: 'clamp(40px, 5vw, 64px)',
              lineHeight: '0.98',
              letterSpacing: '-0.04em',
              fontWeight: 900,
            }}
          >
            {title}
          </h1>
          {intro && (
            <p style={{ margin: 0, maxWidth: '760px', fontSize: '20px', lineHeight: '1.55', opacity: 0.95 }}>
              {intro}
            </p>
          )}
        </div>
      </section>

      <section style={{ background: '#fff', padding: '36px 34px 70px' }}>
        <div
          style={{
            maxWidth: '980px',
            margin: '0 auto',
            background: '#ffffff',
            border: '1px solid #d9e0ea',
            borderRadius: '28px',
            padding: '34px 34px',
            color: '#32405d',
            fontSize: '16px',
            lineHeight: '1.85',
            boxShadow: '0 12px 30px rgba(13,33,89,0.05)',
          }}
        >
          <div
            style={{
              marginBottom: '18px',
              paddingBottom: '14px',
              borderBottom: '1px solid #e5e8ef',
            }}
          >
            <h2 style={{ margin: 0, color: BRAND_BLUE, fontSize: '28px', lineHeight: '1.2' }}>{title}</h2>
          </div>

          <div>{children}</div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

