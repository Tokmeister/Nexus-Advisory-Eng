import { useEffect, useMemo, useState } from 'react';
import { Cpu, FolderOpen, FileText, TrendingUp, CheckSquare } from 'lucide-react';
import NexusShell from '@/components/NexusShell';

type SupabaseClientLike = any;
type GenericRow = Record<string, any>;

type ActivityItem = {
  action: string;
  detail: string;
  time: string;
  urgency: string;
  sortTs: number;
};

type DashboardState = {
  totalAdvisoryInputs: number;
  totalProjects: number;
  totalActions: number;
  totalReports: number;
  avgUrgency: 'Low' | 'Medium' | 'High' | 'Critical';
  latestReport: { title: string; client: string; date: string; confidence: string; urgency: string };
  latestInsight: { title: string; text: string };
  projectsCompleted: number;
  activities: ActivityItem[];
  monthlyProjects: { label: string; completed: number; total: number }[];
  overdueActions: number;
  blockedActions: number;
  openActions: number;
  completedActions: number;
};

const urgencyColor: Record<string, string> = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#22c55e',
  Critical: '#a855f7',
};

const emptyState: DashboardState = {
  totalAdvisoryInputs: 0,
  totalProjects: 0,
  totalActions: 0,
  totalReports: 0,
  avgUrgency: 'Medium',
  latestReport: { title: 'No reports yet', client: '--', date: '--', confidence: '--', urgency: 'Medium' },
  latestInsight: { title: 'No executive output yet', text: 'Generate the first advisory to populate the executive control layer for this organisation.' },
  projectsCompleted: 0,
  activities: [],
  monthlyProjects: [
    { label: 'Jan', completed: 0, total: 0 },
    { label: 'Feb', completed: 0, total: 0 },
    { label: 'Mar', completed: 0, total: 0 },
    { label: 'Apr', completed: 0, total: 0 },
  ],
  overdueActions: 0,
  blockedActions: 0,
  openActions: 0,
  completedActions: 0,
};

const SUPABASE_URL =
  import.meta.env.VITE_NEXUS_SUPABASE_URL || 'https://clwjhdxjdpikrxcormsb.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_NEXUS_SUPABASE_ANON_KEY || 'sb_publishable_EJGKO-RRnc9zJo8jUxsLlQ_uvTNC2Bw';

let supabasePromise: Promise<SupabaseClientLike> | null = null;

function clean(value: unknown): string {
  return String(value || '').trim();
}

function urgencyLabel(value: unknown): 'Low' | 'Medium' | 'High' | 'Critical' {
  const raw = clean(value).toLowerCase();
  if (raw === 'critical' || raw === 'very high') return 'Critical';
  if (raw === 'high' || raw === 'urgent') return 'High';
  if (raw === 'low') return 'Low';
  return 'Medium';
}

function urgencyScore(value: unknown): number {
  const label = urgencyLabel(value);
  if (label === 'Critical') return 4;
  if (label === 'High') return 3;
  if (label === 'Medium') return 2;
  return 1;
}


function actionStatus(value: unknown): string {
  const raw = clean(value).toLowerCase();
  if (['completed', 'complete', 'done'].includes(raw)) return 'Completed';
  if (['blocked', 'on hold', 'on_hold'].includes(raw)) return 'Blocked';
  if (['in progress', 'in_progress', 'working'].includes(raw)) return 'In Progress';
  return 'Open';
}

function isOverdue(dueDate: unknown, status: unknown): boolean {
  if (actionStatus(status) === 'Completed') return false;
  const raw = clean(dueDate);
  if (!raw) return false;
  const dt = new Date(raw);
  if (Number.isNaN(dt.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dt.setHours(0, 0, 0, 0);
  return dt.getTime() < today.getTime();
}

function formatDate(value: unknown): string {
  const raw = clean(value);
  if (!raw) return '--';
  const dt = new Date(raw);
  if (Number.isNaN(dt.getTime())) return raw.slice(0, 10);
  return dt.toISOString().slice(0, 10);
}

function relativeTime(value: unknown): string {
  const raw = clean(value);
  if (!raw) return '--';
  const dt = new Date(raw);
  if (Number.isNaN(dt.getTime())) return '--';
  const diffMs = Date.now() - dt.getTime();
  const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}

async function getSupabase(): Promise<SupabaseClientLike> {
  const existing = (window as Window & { __nexusSupabase?: SupabaseClientLike }).__nexusSupabase;
  if (existing) return existing;

  if (!supabasePromise) {
    supabasePromise = import(
      /* @vite-ignore */ 'https://esm.sh/@supabase/supabase-js@2'
    ).then((mod: { createClient: (url: string, key: string, options?: Record<string, unknown>) => SupabaseClientLike }) => {
      const client = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      });
      (window as Window & { __nexusSupabase?: SupabaseClientLike }).__nexusSupabase = client;
      return client;
    });
  }

  return supabasePromise;
}

async function getOrganisationId(): Promise<string> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message || 'Could not read session.');
  const userId = data?.session?.user?.id;
  if (!userId) throw new Error('No authenticated user session found.');

  const profileLookup = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', userId)
    .maybeSingle();

  if (profileLookup.error) throw new Error(profileLookup.error.message || 'Could not load profile.');
  const organisationId = clean(profileLookup.data?.organisation_id);
  if (!organisationId) throw new Error('Profile found, but organisation_id is missing.');
  return organisationId;
}

function buildMonthlyProjectData(projects: GenericRow[]) {
  const now = new Date();
  const months = Array.from({ length: 4 }).map((_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (3 - idx), 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString('en-US', { month: 'short' }),
    };
  });

  return months.map((month) => {
    const monthProjects = projects.filter((project) => {
      const raw = clean(project.created_at || project.updated_at);
      if (!raw) return false;
      return formatDate(raw).startsWith(month.key);
    });

    return {
      label: month.label,
      total: monthProjects.length,
      completed: monthProjects.filter((project) => clean(project.status).toLowerCase() === 'completed').length,
    };
  });
}

function deriveDashboardState(
  advisoryInputs: GenericRow[],
  reports: GenericRow[],
  projects: GenericRow[],
  projectActions: GenericRow[]
): DashboardState {
  const advisoryById = new Map(advisoryInputs.map((row) => [clean(row.id), row]));
  const projectById = new Map(projects.map((row) => [clean(row.id), row]));

  const latestAdvisory = [...advisoryInputs].sort((a, b) => {
    const aTs = new Date(a.created_at || a.updated_at || 0).getTime() || 0;
    const bTs = new Date(b.created_at || b.updated_at || 0).getTime() || 0;
    return bTs - aTs;
  })[0];

  const latestReportRow = [...reports].sort((a, b) => {
    const aTs = new Date(a.created_at || a.updated_at || 0).getTime() || 0;
    const bTs = new Date(b.created_at || b.updated_at || 0).getTime() || 0;
    return bTs - aTs;
  })[0];

  const latestReportAdvisory = latestReportRow ? advisoryById.get(clean(latestReportRow.advisory_input_id)) : null;

  const latestInsight = latestAdvisory
    ? {
        title: `${clean(latestAdvisory.client_name || 'Client')} — ${clean(latestAdvisory.industry || 'Advisory')}`,
        text:
          clean(latestAdvisory.primary_business_challenge) ||
          clean(latestAdvisory.strategic_goal) ||
          'Latest executive advisory input captured in Supabase.',
      }
    : emptyState.latestInsight;

  const latestReport = latestReportRow
    ? {
        title: clean(latestReportRow.title || latestReportRow.report_id || 'Latest report'),
        client: clean(latestReportAdvisory?.client_name || 'Client'),
        date: formatDate(latestReportRow.created_at || latestReportRow.updated_at),
        confidence: '--',
        urgency: urgencyLabel(latestReportAdvisory?.urgency_level),
      }
    : emptyState.latestReport;

  const activities: ActivityItem[] = [
    ...reports.map((row) => {
      const advisory = advisoryById.get(clean(row.advisory_input_id)) || {};
      const created = row.created_at || row.updated_at;
      return {
        action: 'Report generated',
        detail: `${clean(row.title || row.report_id || 'Report')} — ${clean(advisory.client_name || 'Client')}`,
        time: relativeTime(created),
        urgency: urgencyLabel(advisory.urgency_level),
        sortTs: new Date(created || 0).getTime() || 0,
      };
    }),
    ...advisoryInputs.map((row) => ({
      action: 'Advisory input saved',
      detail: `${clean(row.client_name || 'Client')} — ${clean(row.industry || 'Advisory')}`,
      time: relativeTime(row.created_at || row.updated_at),
      urgency: urgencyLabel(row.urgency_level),
      sortTs: new Date(row.created_at || row.updated_at || 0).getTime() || 0,
    })),
    ...projects.map((row) => {
      const advisory = advisoryById.get(clean(row.advisory_input_id)) || {};
      const created = row.updated_at || row.created_at;
      return {
        action: 'Project updated',
        detail: `${clean(row.project_name || 'Project')} — ${clean(advisory.client_name || 'Client')}`,
        time: relativeTime(created),
        urgency: urgencyLabel(row.priority || advisory.urgency_level),
        sortTs: new Date(created || 0).getTime() || 0,
      };
    }),
    ...projectActions.map((row) => {
      const project = projectById.get(clean(row.project_id)) || {};
      const advisory = advisoryById.get(clean(project.advisory_input_id)) || {};
      const created = row.updated_at || row.created_at;
      return {
        action: clean(row.status).toLowerCase() === 'completed' ? 'Action completed' : 'Action logged',
        detail: `${clean(row.action_item || 'Project action')} — ${clean(advisory.client_name || 'Client')}`,
        time: relativeTime(created),
        urgency: urgencyLabel(project.priority || advisory.urgency_level),
        sortTs: new Date(created || 0).getTime() || 0,
      };
    }),
  ]
    .sort((a, b) => b.sortTs - a.sortTs)
    .slice(0, 5);

  const avgUrgency = advisoryInputs.length
    ? urgencyLabel(
        advisoryInputs
          .map((row) => urgencyScore(row.urgency_level))
          .reduce((sum, score) => sum + score, 0) / advisoryInputs.length >= 3.5
          ? 'critical'
          : advisoryInputs.map((row) => urgencyScore(row.urgency_level)).reduce((sum, score) => sum + score, 0) / advisoryInputs.length >= 2.5
            ? 'high'
            : advisoryInputs.map((row) => urgencyScore(row.urgency_level)).reduce((sum, score) => sum + score, 0) / advisoryInputs.length >= 1.5
              ? 'medium'
              : 'low'
      )
    : 'Medium';

  const overdueActions = projectActions.filter((row) => isOverdue(row.due_date, row.status)).length;
  const blockedActions = projectActions.filter((row) => actionStatus(row.status) === 'Blocked').length;
  const completedActions = projectActions.filter((row) => actionStatus(row.status) === 'Completed').length;
  const openActions = Math.max(0, projectActions.length - completedActions);

  return {
    totalAdvisoryInputs: advisoryInputs.length,
    totalProjects: projects.length,
    totalActions: projectActions.length,
    totalReports: reports.length,
    avgUrgency,
    latestReport,
    latestInsight,
    projectsCompleted: projects.filter((row) => clean(row.status).toLowerCase() === 'completed').length,
    activities,
    monthlyProjects: buildMonthlyProjectData(projects),
    overdueActions,
    blockedActions,
    openActions,
    completedActions,
  };
}

function ProjectsChart({ total, completed, active, barData }: { total: number; completed: number; active: number; barData: { label: string; completed: number; total: number }[] }) {
  const remaining = Math.max(active, total - completed);
  const completedPct = total > 0 ? (completed / total) * 100 : 0;
  const maxVal = Math.max(...barData.map(d => d.total), 1);
  const chartH = 80;

  return (
    <div>
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#60a5fa', lineHeight: 1 }}>{total}</div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>Total</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#22c55e', lineHeight: 1 }}>{completed}</div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>Done</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#f59e0b', lineHeight: 1 }}>{remaining}</div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>Active</div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Completion</span>
              <span style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: '600' }}>{Math.round(completedPct)}%</span>
            </div>
            <div style={{ height: '6px', background: '#1e2a45', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${completedPct}%`, background: 'linear-gradient(90deg, #2563eb, #22c55e)', borderRadius: '999px' }} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: `${chartH + 20}px` }}>
        {barData.map((d, i) => {
          const totalH = Math.round((d.total / maxVal) * chartH);
          const compH = Math.round((d.completed / maxVal) * chartH);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: `${chartH}px`, position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${totalH}px`, background: 'rgba(37,99,235,0.2)', borderRadius: '4px 4px 0 0', border: '1px solid rgba(37,99,235,0.3)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${compH}px`, background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)', borderRadius: '4px 4px 0 0' }} />
              </div>
              <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{d.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(37,99,235,0.4)', border: '1px solid rgba(37,99,235,0.5)' }} />
          <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Total Projects</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#22c55e' }} />
          <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Completed</span>
        </div>
      </div>
    </div>
  );
}

export default function NexusDashboard() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [dashboard, setDashboard] = useState<DashboardState>(emptyState);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const organisationId = await getOrganisationId();
        const supabase = await getSupabase();
        const [advisoryRes, reportsRes, projectsRes, actionsRes] = await Promise.all([
          supabase.from('advisory_inputs').select('*').eq('organisation_id', organisationId),
          supabase.from('reports').select('*').eq('organisation_id', organisationId),
          supabase.from('projects').select('*').eq('organisation_id', organisationId),
          supabase.from('project_actions').select('*').eq('organisation_id', organisationId),
        ]);

        if (advisoryRes.error) throw new Error(advisoryRes.error.message || 'Could not load advisory inputs.');
        if (reportsRes.error) throw new Error(reportsRes.error.message || 'Could not load reports.');
        if (projectsRes.error) throw new Error(projectsRes.error.message || 'Could not load projects.');
        if (actionsRes.error) throw new Error(actionsRes.error.message || 'Could not load actions.');

        const nextState = deriveDashboardState(
          advisoryRes.data || [],
          reportsRes.data || [],
          projectsRes.data || [],
          actionsRes.data || []
        );

        if (active) setDashboard(nextState);
      } catch {
        if (active) setDashboard(emptyState);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const cardStyle = (id: string): React.CSSProperties => ({
    background: '#0d1526',
    border: `1px solid ${hoveredCard === id ? '#3b82f6' : '#1e3a5f'}`,
    borderLeft: `3px solid ${hoveredCard === id ? '#3b82f6' : '#2563eb'}`,
    borderRadius: '10px',
    padding: '1.5rem',
    transition: 'all 0.2s ease',
    transform: hoveredCard === id ? 'translateY(-4px)' : 'translateY(0)',
    boxShadow: hoveredCard === id ? '0 8px 32px rgba(37,99,235,0.25)' : '0 2px 8px rgba(0,0,0,0.3)',
    cursor: 'default',
  });

  const panelStyle: React.CSSProperties = {
    background: '#0d1526',
    border: '1px solid #1e3a5f',
    borderRadius: '12px',
    padding: '1.75rem',
  };

  const kicker = (text: string) => (
    <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#3b82f6', textTransform: 'uppercase' as const, fontWeight: '600', marginBottom: '0.2rem' }}>
      {text}
    </div>
  );

  const activeProjects = useMemo(() => Math.max(0, dashboard.totalProjects - dashboard.projectsCompleted), [dashboard]);

  return (
    <NexusShell>
      <div style={{ padding: '1.5rem 2rem 3rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <div onMouseEnter={() => setHoveredCard('hero')} onMouseLeave={() => setHoveredCard(null)}
            style={{ background: 'linear-gradient(135deg, #0d1526 0%, #0f1e3a 100%)', border: `1px solid ${hoveredCard === 'hero' ? '#3b82f6' : '#1e3a5f'}`, borderLeft: '3px solid #2563eb', borderRadius: '12px', padding: '1.5rem 2rem', transition: 'all 0.2s ease', transform: hoveredCard === 'hero' ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hoveredCard === 'hero' ? '0 8px 32px rgba(37,99,235,0.2)' : '0 2px 8px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: '#3b82f6', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.4rem' }}>Executive Control Layer</div>
            <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: '800', color: '#e2e8f0', letterSpacing: '0.04em' }}>NEXUS Dashboard</h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6', maxWidth: '680px' }}>
              Command centre for advisory activity, client work, report generation, and the operating pulse of the platform.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Advisory Inputs', value: dashboard.totalAdvisoryInputs, icon: Cpu, id: 'r1-advisory' },
            { label: 'Total Projects', value: dashboard.totalProjects, icon: FolderOpen, id: 'r1-projects' },
            { label: 'Total Actions', value: dashboard.totalActions, icon: CheckSquare, id: 'r1-actions' },
            { label: 'Total Reports', value: dashboard.totalReports, icon: FileText, id: 'r1-reports' },
          ].map(({ label, value, icon: Icon, id }) => (
            <div key={id} onMouseEnter={() => setHoveredCard(id)} onMouseLeave={() => setHoveredCard(null)} style={cardStyle(id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                <Icon size={14} color="#2563eb" />
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#60a5fa', lineHeight: 1 }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={panelStyle}>
            {kicker('Latest Advisory')}
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>Most Recent Executive Output</h3>
            <div onMouseEnter={() => setHoveredCard('insight')} onMouseLeave={() => setHoveredCard(null)} style={cardStyle('insight')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <TrendingUp size={14} color="#3b82f6" />
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: '#e2e8f0' }}>{dashboard.latestInsight.title}</h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: '1.7' }}>{dashboard.latestInsight.text}</p>
            </div>
          </div>

          <div style={panelStyle}>
            {kicker('Recent Activity')}
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>Top 5 Latest Activities</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {dashboard.activities.map((a, i) => (
                <div key={i} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', borderRadius: '8px', background: hoveredRow === i ? 'rgba(37,99,235,0.08)' : 'rgba(255,255,255,0.02)', border: '1px solid #1e3a5f', transition: 'background 0.15s ease' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '500', color: '#e2e8f0' }}>{a.action}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.1rem' }}>{a.detail}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{a.time}</span>
                    <span style={{ fontSize: '0.62rem', fontWeight: '600', padding: '0.1rem 0.45rem', borderRadius: '999px', background: `${urgencyColor[a.urgency]}22`, color: urgencyColor[a.urgency], border: `1px solid ${urgencyColor[a.urgency]}44` }}>{a.urgency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '1.25rem' }}>
          <div style={panelStyle}>
            {kicker('Latest Report')}
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>Most Recent Output</h3>
            <div onMouseEnter={() => setHoveredCard('latest-report')} onMouseLeave={() => setHoveredCard(null)} style={cardStyle('latest-report')}>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.75rem' }}>{dashboard.latestReport.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[{ k: 'Client', v: dashboard.latestReport.client }, { k: 'Date', v: dashboard.latestReport.date }, { k: 'Confidence', v: dashboard.latestReport.confidence }].map(({ k, v }) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{k}</span>
                    <span style={{ fontSize: '0.7rem', color: '#60a5fa', fontWeight: '500' }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Urgency</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: '600', padding: '0.1rem 0.5rem', borderRadius: '999px', background: `${urgencyColor[dashboard.latestReport.urgency] || urgencyColor.Medium}22`, color: urgencyColor[dashboard.latestReport.urgency] || urgencyColor.Medium, border: `1px solid ${(urgencyColor[dashboard.latestReport.urgency] || urgencyColor.Medium)}44` }}>
                    {dashboard.latestReport.urgency}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={panelStyle}>
            {kicker('Average Urgency')}
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>Portfolio Risk Level</h3>
            <div onMouseEnter={() => setHoveredCard('avg-urgency')} onMouseLeave={() => setHoveredCard(null)}
              style={{ ...cardStyle('avg-urgency'), textAlign: 'center' as const, padding: '2rem 1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                {dashboard.avgUrgency === 'High' || dashboard.avgUrgency === 'Critical' ? '🔴' : dashboard.avgUrgency === 'Medium' ? '🟡' : '🟢'}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: urgencyColor[dashboard.avgUrgency], marginBottom: '0.5rem' }}>{dashboard.avgUrgency}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: '1.5' }}>Based on all active reports and advisory inputs across the portfolio.</div>
            </div>
          </div>

          <div style={panelStyle}>
            {kicker('Project Progress')}
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>Total vs. Completed Projects</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', marginBottom: '1rem' }}>
              {[
                { label: 'Overdue', value: dashboard.overdueActions, color: dashboard.overdueActions > 0 ? '#ef4444' : '#22c55e' },
                { label: 'Blocked', value: dashboard.blockedActions, color: dashboard.blockedActions > 0 ? '#f59e0b' : '#22c55e' },
                { label: 'Open', value: dashboard.openActions, color: '#60a5fa' },
                { label: 'Closed', value: dashboard.completedActions, color: '#22c55e' },
              ].map((item) => (
                <div key={item.label} style={{ border: `1px solid ${item.color}33`, borderLeft: `3px solid ${item.color}`, borderRadius: '8px', padding: '0.7rem 0.8rem', background: item.label === 'Overdue' && dashboard.overdueActions > 0 ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>{item.label}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
            <ProjectsChart total={dashboard.totalProjects} completed={dashboard.projectsCompleted} active={activeProjects} barData={dashboard.monthlyProjects} />
          </div>
        </div>
      </div>
    </NexusShell>
  );
}
