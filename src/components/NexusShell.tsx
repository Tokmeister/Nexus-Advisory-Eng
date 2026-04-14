import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  Mail,
  Search,
  LogOut,
  LayoutDashboard,
  Cpu,
  FolderOpen,
  FileText,
  BarChart2,
  Settings,
} from 'lucide-react';
import { signOut, useSession } from '@/lib/auth/auth-client';

const navLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Advisory Engine', icon: Cpu, path: '/advisory' },
  { label: 'Projects', icon: FolderOpen, path: '/projects' },
  { label: 'Reports', icon: FileText, path: '/reports' },
  { label: 'Analytics', icon: BarChart2, path: '/analytics' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

interface NexusShellProps {
  children: ReactNode;
}

function NexusWaveBanner() {
  return (
    <div style={{ position: 'relative', height: '100px', overflow: 'visible', flexShrink: 0 }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#1e6bb8" stopOpacity="0.45"/>
            <stop offset="30%"  stopColor="#2563eb" stopOpacity="0.35"/>
            <stop offset="65%"  stopColor="#60a5fa" stopOpacity="0.20"/>
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.05"/>
          </linearGradient>
          <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#1d4ed8" stopOpacity="0.40"/>
            <stop offset="40%"  stopColor="#3b82f6" stopOpacity="0.25"/>
            <stop offset="75%"  stopColor="#7dd3fc" stopOpacity="0.10"/>
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="wg3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#0ea5e9" stopOpacity="0.25"/>
            <stop offset="35%"  stopColor="#38bdf8" stopOpacity="0.11"/>
            <stop offset="70%"  stopColor="#7dd3fc" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="wg4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#2563eb" stopOpacity="0.45"/>
            <stop offset="20%"  stopColor="#3b82f6" stopOpacity="0.30"/>
            <stop offset="55%"  stopColor="#60a5fa" stopOpacity="0.10"/>
            <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#60a5fa" stopOpacity="0.45"/>
            <stop offset="50%"  stopColor="#93c5fd" stopOpacity="0.20"/>
            <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#38bdf8" stopOpacity="0.40"/>
            <stop offset="45%"  stopColor="#7dd3fc" stopOpacity="0.10"/>
            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="gg1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#1e40af" stopOpacity="0.30"/>
            <stop offset="25%"  stopColor="#2563eb" stopOpacity="0.20"/>
            <stop offset="60%"  stopColor="#60a5fa" stopOpacity="0.10"/>
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0"/>
          </linearGradient>
          <filter id="sb"><feGaussianBlur stdDeviation="1.2"/></filter>
          <filter id="gb"><feGaussianBlur stdDeviation="0.5"/></filter>
          <style>{`
            @keyframes nw1 {
              0%   { d: path("M0,30 C100,55 220,90 380,75 C540,60 640,88 760,68 C880,48 980,76 1100,60 C1150,52 1180,54 1200,50 L1200,120 L0,120 Z"); }
              100% { d: path("M0,22 C110,50 240,88 390,72 C550,56 650,84 770,65 C890,46 990,74 1110,58 C1158,50 1182,52 1200,48 L1200,120 L0,120 Z"); }
            }
            @keyframes nw2 {
              0%   { d: path("M0,40 C110,65 240,100 400,82 C560,64 660,96 780,74 C900,52 1000,84 1100,66 C1155,56 1182,60 1200,55 L1200,120 L0,120 Z"); }
              100% { d: path("M0,32 C100,60 250,96 410,78 C570,60 670,92 790,70 C910,48 1010,80 1110,62 C1160,52 1185,57 1200,52 L1200,120 L0,120 Z"); }
            }
            @keyframes nw3 {
              0%   { d: path("M0,52 C130,75 260,108 420,90 C580,72 670,104 790,82 C910,60 1010,92 1110,74 C1162,64 1186,68 1200,65 L1200,120 L0,120 Z"); }
              100% { d: path("M0,44 C120,70 270,104 430,86 C590,68 680,100 800,78 C920,56 1020,88 1120,70 C1165,60 1188,65 1200,62 L1200,120 L0,120 Z"); }
            }
            @keyframes nl1 {
              0%   { d: path("M0,30 C100,55 220,90 380,75 C540,60 640,88 760,68 C880,48 980,76 1100,60 C1150,52 1180,54 1200,50"); }
              100% { d: path("M0,22 C110,50 240,88 390,72 C550,56 650,84 770,65 C890,46 990,74 1110,58 C1158,50 1182,52 1200,48"); }
            }
            @keyframes nl2 {
              0%   { d: path("M0,40 C110,65 240,100 400,82 C560,64 660,96 780,74 C900,52 1000,84 1100,66 C1155,56 1182,60 1200,55"); }
              100% { d: path("M0,32 C100,60 250,96 410,78 C570,60 670,92 790,70 C910,48 1010,80 1110,62 C1160,52 1185,57 1200,52"); }
            }
            .nw1 { animation: nw1 8s ease-in-out infinite alternate; }
            .nw2 { animation: nw2 10s ease-in-out infinite alternate; }
            .nw3 { animation: nw3 12s ease-in-out infinite alternate; }
            .nl1 { animation: nl1 9s ease-in-out infinite alternate; }
            .nl2 { animation: nl2 11s ease-in-out infinite alternate; }
          `}</style>
        </defs>

        {/* glow base */}
        <path filter="url(#sb)"
          d="M0,10 C80,35 200,72 360,58 C520,44 620,76 740,56 C860,36 960,62 1080,46 C1140,38 1175,42 1200,38 L1200,120 L0,120 Z"
          fill="url(#gg1)"/>

        {/* wave layers */}
        <path className="nw1" filter="url(#sb)"
          d="M0,30 C100,55 220,90 380,75 C540,60 640,88 760,68 C880,48 980,76 1100,60 C1150,52 1180,54 1200,50 L1200,120 L0,120 Z"
          fill="url(#wg1)"/>
        <path className="nw2" filter="url(#sb)"
          d="M0,40 C110,65 240,100 400,82 C560,64 660,96 780,74 C900,52 1000,84 1100,66 C1155,56 1182,60 1200,55 L1200,120 L0,120 Z"
          fill="url(#wg2)"/>
        <path className="nw3"
          d="M0,52 C130,75 260,108 420,90 C580,72 670,104 790,82 C910,60 1010,92 1110,74 C1162,64 1186,68 1200,65 L1200,120 L0,120 Z"
          fill="url(#wg3)"/>

        {/* edge lines */}
        <path className="nl1" filter="url(#gb)"
          d="M0,30 C100,55 220,90 380,75 C540,60 640,88 760,68 C880,48 980,76 1100,60 C1150,52 1180,54 1200,50"
          fill="none" stroke="url(#lg1)" strokeWidth="1.2"/>
        <path className="nl2" filter="url(#gb)"
          d="M0,40 C110,65 240,100 400,82 C560,64 660,96 780,74 C900,52 1000,84 1100,66 C1155,56 1182,60 1200,55"
          fill="none" stroke="url(#lg2)" strokeWidth="0.8"/>
        <path
          d="M0,22 C90,46 210,82 360,66 C510,50 610,82 730,62 C850,42 950,70 1070,54 C1130,46 1172,49 1200,45"
          fill="none" stroke="url(#lg1)" strokeWidth="0.5" opacity="0.5"/>

        {/* left anchor — bleeds from sidebar blue border */}
        <rect x="0" y="0" width="4" height="120" fill="#2563eb" opacity="0.5"/>
        <rect x="4" y="0" width="10" height="120" fill="url(#wg4)" opacity="0.3"/>
      </svg>
    </div>
  );
}

const PROFILE_UPDATED_EVENT = 'nexus-profile-updated';
const ORGANISATION_UPDATED_EVENT = 'nexus-organisation-updated';
const AUTH_CHANGED_EVENT = 'nexus-auth-changed';
const DEFAULT_AVATAR = '/assets/profile.jpg';

const SUPABASE_URL =
  import.meta.env.VITE_NEXUS_SUPABASE_URL || 'https://clwjhdxjdpikrxcormsb.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_NEXUS_SUPABASE_ANON_KEY || 'sb_publishable_EJGKO-RRnc9zJo8jUxsLlQ_uvTNC2Bw';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClientLike = any;
let shellSupabasePromise: Promise<SupabaseClientLike> | null = null;

function clean(value: unknown): string {
  return String(value || '').trim();
}

function buildFullName(fn: unknown, ln: unknown, full: unknown, fallback: string): string {
  const s = `${clean(fn)} ${clean(ln)}`.replace(/\s+/g, ' ').trim();
  return s || clean(full) || clean(fallback) || 'User';
}

function readCache() {
  return {
    userName: clean(localStorage.getItem('nexus_user_name')),
    userAvatar: clean(localStorage.getItem('nexus_user_avatar')),
    organisationName: clean(localStorage.getItem('nexus_organisation_name')),
  };
}

function writeCache(p: { userName?: string; userAvatar?: string; organisationName?: string }) {
  if (p.userName) localStorage.setItem('nexus_user_name', p.userName);
  if (p.userAvatar) localStorage.setItem('nexus_user_avatar', p.userAvatar);
  if (p.organisationName) localStorage.setItem('nexus_organisation_name', p.organisationName);
}

function readStoredOrgId(): string {
  return (
    clean(localStorage.getItem('activeOrganisationId')) ||
    clean(localStorage.getItem('nexus_selected_organisation_id'))
  );
}

async function getSupabase(): Promise<SupabaseClientLike> {
  const win = window as Window & { __nexusSupabase?: SupabaseClientLike };
  if (win.__nexusSupabase) return win.__nexusSupabase;
  if (!shellSupabasePromise) {
    shellSupabasePromise = import(
      /* @vite-ignore */ 'https://esm.sh/@supabase/supabase-js@2'
    ).then((mod: { createClient: (u: string, k: string, o?: Record<string, unknown>) => SupabaseClientLike }) => {
      const c = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      });
      win.__nexusSupabase = c;
      return c;
    });
  }
  return shellSupabasePromise;
}

export default function NexusShell({ children }: NexusShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: session } = useSession();

  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [logoutHovered, setLogoutHovered] = useState(false);
  const [bellHovered, setBellHovered] = useState(false);
  const [mailHovered, setMailHovered] = useState(false);
  const [searchHovered, setSearchHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cache = readCache();
  const [userName, setUserName] = useState(cache.userName || 'User');
  const [userAvatar, setUserAvatar] = useState(cache.userAvatar || DEFAULT_AVATAR);
  const [organisationName, setOrganisationName] = useState(cache.organisationName || '');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem('nexus_sidebar_collapsed') === 'true'
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem('nexus_theme_preference') || 'dark'
  );

  const lastFetchedId = useRef('');

  const isActive = (path: string) => location.pathname === path;

  const runGlobalSearch = () => {
    const q = clean(searchQuery);
    if (q) navigate(`/reports?search=${encodeURIComponent(q)}`);
  };

  useEffect(() => {
    let mounted = true;

    const loadIdentity = async (force = false) => {
      const userId = clean(session?.user?.id);
      const sessionEmail = clean(session?.user?.email);
      const sessionName = clean(session?.user?.name);
      const fallback = sessionName || sessionEmail || 'User';
      const c = readCache();

      if (!mounted) return;

      if (!force) {
        if (c.userName) setUserName(c.userName);
        if (c.userAvatar) setUserAvatar(c.userAvatar);
        if (c.organisationName) setOrganisationName(c.organisationName);
      }

      if (!force && userId && lastFetchedId.current === userId) return;
      if (!userId && !sessionEmail) return;

      lastFetchedId.current = userId;

      try {
        const supabase = await getSupabase();

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, organisation_id, first_name, last_name, full_name, email, avatar_url')
          .eq('id', userId)
          .maybeSingle();

        if (!mounted) return;

        if (error || !profile) {
          if (!c.userName) setUserName(fallback);
          return;
        }

        const name = buildFullName(profile.first_name, profile.last_name, profile.full_name, clean(profile.email) || fallback);
        const avatar = clean(profile.avatar_url) || c.userAvatar || DEFAULT_AVATAR;
        setUserName(name);
        setUserAvatar(avatar);
        writeCache({ userName: name, userAvatar: avatar });

        const orgId = clean(profile.organisation_id) || readStoredOrgId();
        if (!orgId) {
          setOrganisationName(c.organisationName || 'No organisation');
          return;
        }

        if (c.organisationName && !force) setOrganisationName(c.organisationName);

        const orgResult = await supabase
          .from('organisations')
          .select('id, name')
          .eq('id', orgId)
          .maybeSingle();

        if (!mounted) return;

        const orgName = clean(orgResult.data?.name) || c.organisationName || 'No organisation';
        setOrganisationName(orgName);
        writeCache({ organisationName: orgName });
      } catch {
        if (!mounted) return;
        const c2 = readCache();
        if (c2.userName) setUserName(c2.userName);
        else setUserName(fallback);
        if (c2.organisationName) setOrganisationName(c2.organisationName);
      }
    };

    void loadIdentity();

    const handleForce = () => {
      lastFetchedId.current = '';
      void loadIdentity(true);
    };

    window.addEventListener(PROFILE_UPDATED_EVENT, handleForce);
    window.addEventListener(ORGANISATION_UPDATED_EVENT, handleForce);
    window.addEventListener(AUTH_CHANGED_EVENT, handleForce);

    const handleAppearance = () => {
      setSidebarCollapsed(localStorage.getItem('nexus_sidebar_collapsed') === 'true');
      setTheme(localStorage.getItem('nexus_theme_preference') || 'dark');
    };
    window.addEventListener('nexus-appearance-updated', handleAppearance);

    return () => {
      mounted = false;
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleForce);
      window.removeEventListener(ORGANISATION_UPDATED_EVENT, handleForce);
      window.removeEventListener(AUTH_CHANGED_EVENT, handleForce);
      window.removeEventListener('nexus-appearance-updated', handleAppearance);
    };
  }, [session?.user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const bg = theme === 'light' ? '#f8fafc' : '#0a0f1e';
  const sidebarBg = theme === 'light' ? '#f1f5f9' : '#060c18';
  const sidebarBorder = theme === 'light' ? '#cbd5e1' : '#1e3a5f';
  const textPrimary = theme === 'light' ? '#1e293b' : '#e2e8f0';
  const textMuted = theme === 'light' ? '#64748b' : '#94a3b8';
  const headerBg = theme === 'light' ? '#f1f5f9' : '#060c18';
  const sidebarWidth = sidebarCollapsed ? '64px' : '220px';

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: bg,
        fontFamily: 'Inter, DM Sans, sans-serif',
        overflow: 'hidden',
      }}
    >
      <aside
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          background: sidebarBg,
          borderRight: `1px solid ${sidebarBorder}`,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          overflow: 'hidden',
          transition: 'width 0.25s ease, min-width 0.25s ease',
        }}
      >
        <div style={{ padding: '1.25rem 1rem 0.75rem', display: 'flex', justifyContent: 'center' }}>
          <img
            src="/assets/nexus.png"
            alt="Nexus Logo"
            style={{
              width: sidebarCollapsed ? '36px' : '160px',
              height: sidebarCollapsed ? '36px' : '160px',
              objectFit: 'contain',
              WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 35%, transparent 75%)',
              maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 35%, transparent 75%)',
              display: 'block',
              transition: 'width 0.25s ease, height 0.25s ease',
            }}
          />
        </div>

        <div style={{ height: '1px', background: sidebarBorder, margin: '0 1rem 1rem' }} />

        <nav style={{ flex: 1, padding: '0 0.75rem' }}>
          {navLinks.map(({ label, icon: Icon, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              onMouseEnter={() => setHoveredNav(label)}
              onMouseLeave={() => setHoveredNav(null)}
              title={sidebarCollapsed ? label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                gap: '0.75rem',
                width: '100%',
                padding: '0.75rem 1rem',
                marginBottom: '0.25rem',
                borderRadius: '8px',
                background: isActive(path)
                  ? 'rgba(37,99,235,0.15)'
                  : hoveredNav === label
                    ? 'rgba(37,99,235,0.08)'
                    : 'transparent',
                color: isActive(path) || hoveredNav === label ? '#60a5fa' : textMuted,
                border: 'none',
                borderLeft: isActive(path) || hoveredNav === label ? '3px solid #2563eb' : '3px solid transparent',
                fontSize: '0.875rem',
                fontWeight: isActive(path) ? '600' : '400',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              {!sidebarCollapsed && label}
            </button>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div style={{ padding: '1rem 1.5rem', fontSize: '0.65rem', color: sidebarBorder, letterSpacing: '0.1em' }}>NEXUS v2.0</div>
        )}
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div
          style={{
            background: headerBg,
            borderBottom: `1px solid ${sidebarBorder}`,
            padding: '0.875rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ minWidth: '220px', paddingRight: '1rem' }}>
            <div
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                color: '#3b82f6',
                textTransform: 'uppercase',
                fontWeight: '600',
                marginBottom: '0.1rem',
              }}
            >
              Organisation
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: textPrimary,
                whiteSpace: 'nowrap',
              }}
            >
              {organisationName || '—'}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              maxWidth: '400px',
              marginLeft: 'auto',
              marginRight: '50px',
            }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={13}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                placeholder="Search dashboard, advisory, projects…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') runGlobalSearch();
                }}
                style={{
                  width: '100%',
                  background: '#0d1526',
                  border: '1px solid #1e3a5f',
                  borderRadius: '8px',
                  padding: '0.5rem 0.75rem 0.5rem 2.1rem',
                  color: '#e2e8f0',
                  fontSize: '0.78rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = '#2563eb')}
                onBlur={e => (e.target.style.borderColor = '#1e3a5f')}
              />
            </div>

            <button
              onClick={runGlobalSearch}
              onMouseEnter={() => setSearchHovered(true)}
              onMouseLeave={() => setSearchHovered(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: searchHovered ? '#2563eb' : '#0d1526',
                border: '1px solid #2563eb',
                borderRadius: '8px',
                color: searchHovered ? '#fff' : '#60a5fa',
                padding: '0.5rem 0.875rem',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '500',
                whiteSpace: 'nowrap',
              }}
            >
              <Search size={12} />
              Search
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onMouseEnter={() => setBellHovered(true)}
              onMouseLeave={() => setBellHovered(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: bellHovered ? '#3b82f6' : '#94a3b8',
                transition: 'color 0.2s',
                padding: '0.25rem',
              }}
            >
              <Bell size={18} />
            </button>

            <button
              onMouseEnter={() => setMailHovered(true)}
              onMouseLeave={() => setMailHovered(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: mailHovered ? '#3b82f6' : '#94a3b8',
                transition: 'color 0.2s',
                padding: '0.25rem',
              }}
            >
              <Mail size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img
                src={userAvatar || DEFAULT_AVATAR}
                alt={userName}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #2563eb',
                }}
              />
              <span
                style={{
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                }}
              >
                {userName}
              </span>
            </div>

            <button
              onMouseEnter={() => setLogoutHovered(true)}
              onMouseLeave={() => setLogoutHovered(false)}
              onClick={async () => {
                await signOut();
                window.location.replace('/');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: logoutHovered ? '#2563eb' : 'transparent',
                border: '1px solid #2563eb',
                borderRadius: '6px',
                color: logoutHovered ? '#fff' : '#60a5fa',
                padding: '0.4rem 0.875rem',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '500',
              }}
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        </div>

        <div style={{ background: bg, borderBottom: `1px solid ${sidebarBorder}`, padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginLeft: '68rem', width: 'fit-content' }}>
            {navLinks.map(({ label, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                style={{
                  padding: '0.75rem 0',
                  fontSize: '0.8rem',
                  color: isActive(path) ? '#60a5fa' : textMuted,
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive(path) ? '2px solid #2563eb' : '2px solid transparent',
                  fontWeight: isActive(path) ? '600' : '400',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!isActive(path)) (e.currentTarget as HTMLButtonElement).style.color = '#60a5fa';
                }}
                onMouseLeave={e => {
                  if (!isActive(path)) (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', flex: 1, overflowY: 'auto', paddingTop: '60px' }}>
          <div style={{ position: 'absolute', top: -40, left: 0, right: 0, zIndex: 0, pointerEvents: 'none' }}>
            <NexusWaveBanner />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
