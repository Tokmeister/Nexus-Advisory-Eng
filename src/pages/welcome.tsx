import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToDashboard = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    navigate('/dashboard', { replace: true });
  };

  useEffect(() => {
    timerRef.current = setTimeout(goToDashboard, 7000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div style={{
      margin: 0,
      width: '100%',
      height: '100vh',
      background: '#020005',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>

      {/* Video wrapper with vignette — matches original .intro-video-wrap::after */}
      <div style={{
        position: 'relative',
        display: 'inline-block',
        lineHeight: 0,
      }}>
        {/* Vignette overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          boxShadow: 'inset 0 0 60px 34px #020005, inset 0 0 110px 50px #020005',
        }} />

        <video
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={goToDashboard}
          onError={goToDashboard}
          style={{
            width: 'min(42vw, 420px)',
            maxWidth: '420px',
            height: 'auto',
            display: 'block',
            objectFit: 'contain',
            background: 'transparent',
          }}
        >
          <source src="/assets/nexus-logo-animation.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Skip button */}
      <button
        onClick={goToDashboard}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          right: '2.5rem',
          zIndex: 10,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '999px',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '0.5rem 1.25rem',
          cursor: 'pointer',
          transition: 'all 200ms ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
        }}
      >
        Skip →
      </button>
    </div>
  );
}
