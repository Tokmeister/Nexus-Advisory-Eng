import { useEffect, useMemo, useState } from 'react';
import NexusShell from '@/components/NexusShell';
import {
  Cpu,
  Send,
  Save,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import {
  buildAdvisoryOutput,
  clearCurrentOutput,
  loadCurrentOutput,
  openPrintView,
  saveCurrentOutput,
  type AdvisoryInput,
  type AdvisoryRecord,
} from '@/lib/advisoryLogic';
import { fetchRecentHistoryOutputs } from '@/lib/nexus-data';

type SupabaseUserLike = {
  id?: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

type SupabaseClientLike = {
  auth: {
    getSession: () => Promise<{
      data: { session: { user?: SupabaseUserLike } | null };
      error: { message?: string } | null;
    }>;
  };
  from: (table: string) => {
    select: (columns?: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{ data: Record<string, unknown> | null; error: { message?: string } | null }>;
        order?: unknown;
      };
      order?: (column: string, opts?: { ascending?: boolean }) => {
        limit: (count: number) => {
          maybeSingle: () => Promise<{ data: Record<string, unknown> | null; error: { message?: string } | null }>;
        };
      };
    };
    insert: (rows: Record<string, unknown>[]) => {
      select: (columns?: string) => {
        single: () => Promise<{ data: Record<string, unknown>; error: { message?: string } | null }>;
        then?: unknown;
      };
    };
    update: (rows: Record<string, unknown>) => {
      eq: (column: string, value: string) => Promise<{ data: unknown; error: { message?: string } | null }>;
    };
  };
};


const industryOptions = [
  'Construction',
  'Agriculture',
  'Manufacturing',
  'Printing/Packaging',
  'Medical/Health Care',
  'Energy',
  'Professional Services',
];

const inputFields = [
  {
    id: 'challenge',
    label: 'Primary Business Challenge',
    placeholder: 'Describe the core challenge or problem statement…',
    type: 'textarea',
    rows: 3,
  },
  {
    id: 'goal',
    label: 'Strategic Goal',
    placeholder: 'What outcome is the client trying to achieve?',
    type: 'textarea',
    rows: 2,
  },
  {
    id: 'constraints',
    label: 'Known Constraints',
    placeholder: 'Budget, timeline, regulatory, or operational constraints…',
    type: 'textarea',
    rows: 2,
  },
];

const urgencyOptions = ['Low', 'Medium', 'High', 'Critical'];
const valueTypeOptions = ['Revenue Growth', 'Cost Saving', 'Margin Improvement', 'Cash Flow Improvement', 'Loss Prevention', 'Efficiency Gain', 'Other'];
const urgencyColors: Record<string, string> = {
  Low: '#22c55e',
  Medium: '#f59e0b',
  High: '#ef4444',
  Critical: '#a855f7',
};

const SUPABASE_URL =
  import.meta.env.VITE_NEXUS_SUPABASE_URL || 'https://clwjhdxjdpikrxcormsb.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_NEXUS_SUPABASE_ANON_KEY || 'sb_publishable_EJGKO-RRnc9zJo8jUxsLlQ_uvTNC2Bw';

let supabasePromise: Promise<SupabaseClientLike> | null = null;

function clean(value: unknown): string {
  return String(value || '').trim();
}

async function getSupabase(): Promise<SupabaseClientLike> {
  const existing = (window as Window & { __nexusSupabase?: SupabaseClientLike }).__nexusSupabase;
  if (existing) return existing;

  if (!supabasePromise) {
    supabasePromise = import(
      /* @vite-ignore */ 'https://esm.sh/@supabase/supabase-js@2'
    ).then((mod: { createClient: (url: string, key: string, options?: Record<string, unknown>) => SupabaseClientLike }) => {
      const client = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });

      (window as Window & { __nexusSupabase?: SupabaseClientLike }).__nexusSupabase = client;
      return client;
    });
  }

  return supabasePromise;
}

function slugify(value: string) {
  return clean(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'CLIENT';
}

function buildReportId(clientName: string) {
  const now = new Date();
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');
  const timePart = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('');
  const milliPart = String(now.getMilliseconds()).padStart(3, '0');

  return `NEXUS-${slugify(clientName)}-${datePart}-${timePart}-${milliPart}`;
}

function normaliseUrgencyPriority(value: string) {
  const raw = clean(value).toLowerCase();
  if (['critical', 'very high', 'urgent', 'high'].includes(raw)) return 'high';
  if (['medium', 'moderate'].includes(raw)) return 'medium';
  if (['low', 'minor'].includes(raw)) return 'low';
  return raw || 'medium';
}

function normaliseProjectStatus(value: string) {
  const raw = clean(value).toLowerCase();
  if (['active', 'in progress', 'in_progress', 'working'].includes(raw)) return 'in_progress';
  if (['done', 'complete', 'completed'].includes(raw)) return 'completed';
  if (['blocked', 'on hold', 'on_hold'].includes(raw)) return 'blocked';
  return 'not_started';
}

function normaliseReportStatus(value: string) {
  const raw = clean(value).toLowerCase();
  if (['final', 'published', 'complete', 'completed'].includes(raw)) return 'final';
  return 'draft';
}

async function getCurrentProfile() {
  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message || 'Could not read session.');
  }

  const userId = data?.session?.user?.id;
  if (!userId) {
    throw new Error('No authenticated user session found.');
  }

  const profileLookup = await supabase
    .from('profiles')
    .select('id, organisation_id, full_name, email, role')
    .eq('id', userId)
    .maybeSingle();

  if (profileLookup.error) {
    throw new Error(profileLookup.error.message || 'Could not load profile.');
  }

  if (!profileLookup.data?.organisation_id) {
    throw new Error('Profile found, but organisation_id is missing.');
  }

  return profileLookup.data;
}

async function insertAdvisoryInputRow(organisationId: string, formData: Record<string, string>, industry: string, urgency: string) {
  const supabase = await getSupabase();

  const payload = {
    organisation_id: organisationId,
    client_name: clean(formData.client),
    industry: clean(industry),
    primary_business_challenge: clean(formData.challenge),
    strategic_goal: clean(formData.goal),
    known_constraints: clean(formData.constraints),
    urgency_level: clean(urgency),
    impact_areas: clean(formData.impactAreas),
    estimated_financial_exposure: clean(formData.financialExposure),
    value_type: clean(formData.valueType),
    estimated_value: Number(clean(formData.estimatedValue).replace(/[^0-9.-]+/g, '')),
    business_function_affected: clean(formData.businessFunction),
    trigger_source: clean(formData.triggerSource),
  };

  const { data, error } = await supabase
    .from('advisory_inputs')
    .insert([payload])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to insert advisory_inputs row.');
  }

  return data;
}

async function createReportRow(
  organisationId: string,
  advisoryInputId: string,
  advisoryRow: Record<string, unknown>,
  output: AdvisoryRecord & Record<string, unknown>
) {
  const supabase = await getSupabase();
  const reportId = clean(output.report_id || output.reportId);

  if (!reportId) {
    throw new Error('Output does not contain a report ID.');
  }

  const clientName = clean(advisoryRow.client_name || output.client || 'Client');
  const category = clean(output.category || output.detected_label || output.detectedLabel || 'Advisory');

  const insertPayload = {
    organisation_id: organisationId,
    advisory_input_id: advisoryInputId,
    report_id: reportId,
    title: `${clientName} ${category} Review`,
    status: normaliseReportStatus('draft'),
    version: 'v1',
    pdf_url: '',
  };

  const { data, error } = await supabase
    .from('reports')
    .insert([insertPayload])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to create report row.');
  }

  return data;
}

async function ensureProjectRow(organisationId: string, reportRowId: string, advisoryInputId: string, advisoryRow: Record<string, unknown>, reportTitle: string) {
  const supabase = await getSupabase();

  const clientName = clean(advisoryRow.client_name || 'Client');
  const industry = clean(advisoryRow.industry || '');
  const projectName = clean(reportTitle) || (industry ? `${clientName} - ${industry} Execution Project` : `${clientName} Execution Project`);

  const challenge = clean(advisoryRow.primary_business_challenge || '');
  const insertPayload = {
    organisation_id: organisationId,
    report_id: reportRowId,
    advisory_input_id: advisoryInputId,
    project_name: projectName,
    status: normaliseProjectStatus('not_started'),
    priority: normaliseUrgencyPriority(clean(advisoryRow.urgency_level || 'medium')),
    business_area: clean(advisoryRow.business_function_affected || 'General Business'),
    target_outcome: clean(advisoryRow.strategic_goal || 'Convert advisory into a structured execution outcome.'),
    next_action: challenge
      ? `Validate root cause and convert into first executable workstream: ${challenge}`
      : 'Validate the advisory report and define the first execution action.',
    progress_percent: 0,
  };

  const { data, error } = await supabase
    .from('projects')
    .insert([insertPayload])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to create project row.');
  }

  return data;
}

async function seedProjectActions(projectId: string, organisationId: string, output: AdvisoryRecord & Record<string, unknown>) {
  const supabase = await getSupabase();

  const sourceActions = Array.isArray(output.actions) && output.actions.length
    ? output.actions
    : Array.isArray(output.recommendations) && output.recommendations.length
      ? output.recommendations
      : [
          ...(output.roadmap?.day30 || []),
          ...(output.roadmap?.day60 || []),
        ].slice(0, 5);

  const actionLines = sourceActions
    .map(item => clean(item))
    .filter(Boolean)
    .slice(0, 6);

  if (!actionLines.length) return [];

  const rows = actionLines.map((actionItem, index) => ({
    project_id: projectId,
    organisation_id: organisationId,
    action_item: actionItem,
    status: 'not_started',
    owner_name: '',
    due_date: null,
    notes: 'Seeded from advisory output',
    sort_order: index + 1,
  }));

  const { data, error } = await supabase
    .from('project_actions')
    .insert(rows)
    .select('*');

  if (error) {
    throw new Error(error.message || 'Failed to seed project actions.');
  }

  return data || [];
}

export default function AdvisoryPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [industry, setIndustry] = useState('');
  const [urgency, setUrgency] = useState('Medium');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [currentOutput, setCurrentOutput] = useState<AdvisoryRecord | null>(null);
  const [historyOutputs, setHistoryOutputs] = useState<AdvisoryRecord[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('Ready for input.');
  const [activeOrganisationId, setActiveOrganisationId] = useState<string>('');

  useEffect(() => {
    let active = true;

    const savedOutput = loadCurrentOutput();
    if (savedOutput) {
      setCurrentOutput(savedOutput);
      setGenerated(true);
      setFormData({
        client: savedOutput.client,
        challenge: savedOutput.challenge,
        goal: savedOutput.goal,
        constraints: '',
        impactAreas: savedOutput.focusTags.join(', '),
        financialExposure: '',
        valueType: '',
        estimatedValue: '',
        businessFunction: '',
        triggerSource: '',
        notes: '',
      });
      setIndustry(savedOutput.industry);
      setUrgency(savedOutput.urgency);
    }

    getCurrentProfile()
      .then((profile) => {
        if (active) setActiveOrganisationId(clean(profile.organisation_id));
      })
      .catch(() => {
        if (active) setActiveOrganisationId('');
      });

    fetchRecentHistoryOutputs(6)
      .then((rows) => {
        if (active) setHistoryOutputs(rows);
      })
      .catch(() => {
        if (active) setHistoryOutputs([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleGenerate = async () => {
    if (generating) return;

    setGenerating(true);
    setStatusMessage('Generating advisory and writing to Supabase…');

    try {
      const organisationId = clean(activeOrganisationId) || clean((await getCurrentProfile()).organisation_id);

      if (!organisationId) {
        throw new Error('No active organisation_id was found for the logged-in user.');
      }

      if (!clean(formData.client)) throw new Error('Client Name is required.');
      if (!clean(industry)) throw new Error('Industry is required.');
      if (!clean(formData.challenge)) throw new Error('Primary Business Challenge is required.');
      if (!clean(formData.goal)) throw new Error('Strategic Goal is required.');
      if (!clean(formData.valueType)) throw new Error('Value Type is required.');
      const estimatedValueNumber = Number(clean(formData.estimatedValue).replace(/[^0-9.-]+/g, ''));
      if (!Number.isFinite(estimatedValueNumber) || estimatedValueNumber <= 0) {
        throw new Error('Estimated Value (ZAR) must be greater than 0.');
      }
      if (!clean(formData.businessFunction)) throw new Error('Business Function is required.');

      const advisoryRow = await insertAdvisoryInputRow(organisationId, formData, industry, urgency);
      const cachedOrganisationId = clean(activeOrganisationId) || organisationId;
      if (!activeOrganisationId && cachedOrganisationId) {
        setActiveOrganisationId(cachedOrganisationId);
      }

      const advisoryInput: AdvisoryInput = {
        client: clean(formData.client),
        industry: clean(industry),
        challenge: clean(formData.challenge),
        goal: clean(formData.goal),
        constraints: clean(formData.constraints),
        urgency: clean(urgency),
        impactAreas: clean(formData.impactAreas),
        financialExposure: clean(formData.financialExposure),
        valueType: clean(formData.valueType),
        estimatedValue: clean(formData.estimatedValue),
        businessFunction: clean(formData.businessFunction),
        triggerSource: clean(formData.triggerSource),
        notes: clean(formData.notes),
      };

      const built = buildAdvisoryOutput(advisoryInput) as AdvisoryRecord & Record<string, unknown>;
      const reportId = buildReportId(advisoryInput.client);

      const output: AdvisoryRecord & Record<string, unknown> = {
        ...built,
        reportId,
        report_id: reportId,
        client: advisoryInput.client,
        industry: advisoryInput.industry,
        challenge: advisoryInput.challenge,
        goal: advisoryInput.goal,
        urgency: advisoryInput.urgency,
        date: new Date().toISOString().slice(0, 10),
        status: 'Saved',
        actions:
          Array.isArray((built as Record<string, unknown>).actions) && (built as Record<string, unknown>).actions?.length
            ? (built as Record<string, unknown>).actions
            : Array.isArray(built.recommendations) && built.recommendations.length
              ? built.recommendations.slice(0, 6)
              : [],
      };

      const report = await createReportRow(organisationId, clean(advisoryRow.id), advisoryRow, output);
      const project = await ensureProjectRow(
        organisationId,
        clean(report.id),
        clean(advisoryRow.id),
        advisoryRow,
        clean(report.title)
      );

      const supabase = await getSupabase();
      const reportProjectUpdate = await supabase
        .from('reports')
        .update({ project_id: project.id })
        .eq('id', clean(report.id));

      if (reportProjectUpdate?.error) {
        throw new Error(reportProjectUpdate.error.message || 'Failed to link project to report.');
      }

      await seedProjectActions(clean(project.id), organisationId, output);

      saveCurrentOutput(output);
      setCurrentOutput(output);
      setGenerated(true);
      setStatusMessage(
        `Advisory generated and saved to system for ${advisoryInput.client}. advisory_inputs, reports, projects, and project_actions were written.`
      );

      window.setTimeout(() => {
        fetchRecentHistoryOutputs(6)
          .then(setHistoryOutputs)
          .catch(() => setHistoryOutputs([]));
      }, 0);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to generate advisory.';
      setStatusMessage(`Generation failed: ${message}`);
      alert(message);
    } finally {
      setGenerating(false);
    }
  };

  const handleClear = () => {
    setFormData({});
    setIndustry('');
    setUrgency('Medium');
    setGenerated(false);
    setCurrentOutput(null);
    clearCurrentOutput();
    setStatusMessage('Form cleared locally. No system record was deleted.');
  };

  const handleSaveReport = () => {
    if (!currentOutput) return;
    setStatusMessage('Report already lives in Supabase. Reports, Projects, and Local History are now reading from the live system.');
  };

  const cardStyle = (id: string): React.CSSProperties => ({
    background: '#0d1526',
    border: `1px solid ${hoveredCard === id ? '#3b82f6' : '#1e3a5f'}`,
    borderLeft: `3px solid ${hoveredCard === id ? '#3b82f6' : '#2563eb'}`,
    borderRadius: '10px',
    padding: '1.5rem',
    transition: 'all 0.2s ease',
    transform: hoveredCard === id ? 'translateY(-3px)' : 'translateY(0)',
    boxShadow: hoveredCard === id ? '0 8px 32px rgba(37,99,235,0.2)' : '0 2px 8px rgba(0,0,0,0.3)',
    cursor: 'default',
  });

  const panel: React.CSSProperties = {
    background: '#0d1526',
    border: '1px solid #1e3a5f',
    borderRadius: '12px',
    padding: '1.75rem',
  };

  const kicker = (t: string) => (
    <div
      style={{
        fontSize: '0.6rem',
        letterSpacing: '0.2em',
        color: '#3b82f6',
        textTransform: 'uppercase' as const,
        fontWeight: '600',
        marginBottom: '0.2rem',
      }}
    >
      {t}
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0a0f1e',
    border: '1px solid #1e3a5f',
    borderRadius: '8px',
    padding: '0.6rem 0.875rem',
    color: '#e2e8f0',
    fontSize: '0.82rem',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
  };

  const preview = useMemo(() => currentOutput, [currentOutput]);

  return (
    <NexusShell>
      <div style={{ padding: '1.5rem 2rem 3rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <div
            onMouseEnter={() => setHoveredCard('hero')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              background: 'linear-gradient(135deg, #0d1526 0%, #0f1e3a 100%)',
              border: `1px solid ${hoveredCard === 'hero' ? '#3b82f6' : '#1e3a5f'}`,
              borderLeft: '3px solid #2563eb',
              borderRadius: '12px',
              padding: '1.5rem 2rem',
              transition: 'all 0.2s ease',
              transform: hoveredCard === 'hero' ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow: hoveredCard === 'hero' ? '0 8px 32px rgba(37,99,235,0.2)' : '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                color: '#3b82f6',
                textTransform: 'uppercase',
                fontWeight: '600',
                marginBottom: '0.4rem',
              }}
            >
              Intelligence Generation Layer
            </div>
            <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: '800', color: '#e2e8f0' }}>
              NEXUS Advisory Engine
            </h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6', maxWidth: '680px' }}>
              Generate structured executive advisory outputs from client inputs. Each output includes strategic recommendations, risk flags, confidence scoring, and now full Supabase persistence.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              background: 'rgba(37,99,235,0.08)',
              border: '1px solid rgba(37,99,235,0.25)',
              color: '#bfdbfe',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              fontSize: '0.8rem',
            }}
          >
            {statusMessage}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '1.25rem',
            alignItems: 'stretch',
            marginBottom: '1.5rem',
          }}
        >
          <div style={panel}>
            {kicker('Advisory Input')}
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>
              Client Context Form
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    color: '#60a5fa',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '0.35rem',
                  }}
                >
                  Client Name
                </label>
                <input
                  placeholder="e.g. Acme Corp"
                  value={formData.client || ''}
                  onChange={e => setFormData(p => ({ ...p, client: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#2563eb')}
                  onBlur={e => (e.target.style.borderColor = '#1e3a5f')}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    color: '#60a5fa',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '0.35rem',
                  }}
                >
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: industry ? '#e2e8f0' : '#475569',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#2563eb')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#1e3a5f')}
                >
                  <option value="">Select industry</option>
                  {industryOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {inputFields.map(field => (
                <div key={field.id}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.7rem',
                      color: '#60a5fa',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {field.label}
                  </label>
                  <textarea
                    rows={field.rows}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={e => setFormData(p => ({ ...p, [field.id]: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#2563eb')}
                    onBlur={e => (e.target.style.borderColor = '#1e3a5f')}
                  />
                </div>
              ))}

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    color: '#60a5fa',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '0.35rem',
                  }}
                >
                  Urgency
                </label>
                <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
                  {urgencyOptions.map(option => {
                    const active = urgency === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setUrgency(option)}
                        style={{
                          borderRadius: '999px',
                          border: `1px solid ${active ? urgencyColors[option] : '#1e3a5f'}`,
                          background: active ? `${urgencyColors[option]}22` : 'transparent',
                          color: active ? urgencyColors[option] : '#94a3b8',
                          padding: '0.35rem 0.8rem',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    color: '#60a5fa',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '0.35rem',
                  }}
                >
                  Value Type
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {valueTypeOptions.map(option => {
                    const active = formData.valueType === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, valueType: option }))}
                        style={{
                          border: `1px solid ${active ? '#2563eb' : '#334155'}`,
                          background: active ? 'rgba(37,99,235,0.18)' : 'rgba(15,23,42,0.65)',
                          color: active ? '#dbeafe' : '#94a3b8',
                          padding: '0.45rem 0.7rem',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    color: '#60a5fa',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '0.35rem',
                  }}
                >
                  Estimated Value (ZAR)
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Provide your best estimate of the financial upside, saving, or exposure"
                  value={formData.estimatedValue || ''}
                  onChange={e => setFormData(p => ({ ...p, estimatedValue: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#2563eb')}
                  onBlur={e => (e.target.style.borderColor = '#1e3a5f')}
                />
                <div style={{ marginTop: '0.35rem', color: '#94a3b8', fontSize: '0.72rem', lineHeight: '1.5' }}>
                  A directional estimate is acceptable. This supports business-case prioritisation and executive analytics.
                </div>
              </div>

              {[
                { id: 'impactAreas', label: 'Impact Areas', placeholder: 'Operations, Margin, Customer Service…' },
                { id: 'financialExposure', label: 'Estimated Financial Exposure', placeholder: 'e.g. R2m to R5m annually' },
                { id: 'businessFunction', label: 'Business Function Affected', placeholder: 'e.g. Operations' },
                { id: 'triggerSource', label: 'Trigger Source', placeholder: 'What triggered this advisory?' },
                { id: 'notes', label: 'Additional Notes', placeholder: 'Anything else useful for the engine?' },
              ].map(field => (
                <div key={field.id}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.7rem',
                      color: '#60a5fa',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {field.label}
                  </label>
                  <input
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={e => setFormData(p => ({ ...p, [field.id]: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#2563eb')}
                    onBlur={e => (e.target.style.borderColor = '#1e3a5f')}
                  />
                </div>
              ))}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: generating ? '#334155' : '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.7rem 1rem',
                    fontWeight: '700',
                    cursor: generating ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Send size={14} />
                  {generating ? 'Generating…' : 'Generate Advisory'}
                </button>

                <button
                  onClick={handleSaveReport}
                  disabled={!currentOutput}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'transparent',
                    color: currentOutput ? '#60a5fa' : '#64748b',
                    border: `1px solid ${currentOutput ? '#2563eb' : '#334155'}`,
                    borderRadius: '8px',
                    padding: '0.7rem 1rem',
                    fontWeight: '700',
                    cursor: currentOutput ? 'pointer' : 'not-allowed',
                  }}
                >
                  <Save size={14} />
                  Save Report
                </button>

                <button
                  onClick={handleClear}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'transparent',
                    color: '#94a3b8',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '0.7rem 1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={14} />
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div style={panel}>
            {kicker('Advisory Output')}
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>
              Executive Preview
            </h3>

            {!preview ? (
              <div
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  minHeight: '420px',
                  border: '1px dashed #1e3a5f',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <Cpu size={22} color="#3b82f6" style={{ marginBottom: '0.75rem' }} />
                  <div style={{ color: '#e2e8f0', fontWeight: '700', marginBottom: '0.35rem' }}>
                    No advisory generated yet
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                    Complete the form and generate the advisory to preview the structured output.
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={cardStyle('preview-head')}>
                  <div style={{ fontSize: '0.68rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                    {preview.industry}
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#e2e8f0', marginBottom: '0.35rem' }}>
                    {preview.executiveTitle || `${preview.client} Advisory Review`}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.65' }}>
                    {preview.executiveText || preview.summary}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  {[
                    { label: 'Priority', value: preview.priority, icon: AlertTriangle },
                    { label: 'Confidence', value: preview.confidence, icon: TrendingUp },
                    { label: 'Urgency', value: preview.urgency, icon: AlertTriangle },
                    { label: 'Category', value: preview.category, icon: CheckCircle },
                  ].map(({ label, value, icon: Icon }, i) => (
                    <div key={i} style={cardStyle(`metric-${i}`)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.62rem', color: '#94a3b8', textTransform: 'uppercase' }}>{label}</div>
                        <Icon size={13} color="#2563eb" />
                      </div>
                      <div style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: '700' }}>{value}</div>
                    </div>
                  ))}
                </div>

                <div style={cardStyle('issue')}>
                  <div style={{ fontSize: '0.68rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                    Issue Statement
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: '1.65' }}>
                    {preview.issueStatement || preview.challenge}
                  </div>
                </div>

                <div style={cardStyle('recommendations')}>
                  <div style={{ fontSize: '0.68rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                    Recommendations
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1rem', color: '#cbd5e1', fontSize: '0.82rem', lineHeight: '1.7' }}>
                    {(preview.recommendations || []).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div style={cardStyle('roadmap')}>
                  <div style={{ fontSize: '0.68rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                    30 / 60 / 90 Day Roadmap
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    {[
                      { title: preview.roadmap?.day30Title, items: preview.roadmap?.day30 || [] },
                      { title: preview.roadmap?.day60Title, items: preview.roadmap?.day60 || [] },
                      { title: preview.roadmap?.day90Title, items: preview.roadmap?.day90 || [] },
                    ].map((block, idx) => (
                      <div key={idx} style={{ background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '10px', padding: '0.85rem' }}>
                        <div style={{ color: '#e2e8f0', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                          {block.title}
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1rem', color: '#94a3b8', fontSize: '0.75rem', lineHeight: '1.6' }}>
                          {block.items.map((item, itemIdx) => (
                            <li key={itemIdx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
  onClick={() => {
    if (preview) openPrintView(preview);
  }}
  disabled={!preview}
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    background: 'transparent',
    color: preview ? '#60a5fa' : '#64748b',
    border: `1px solid ${preview ? '#2563eb' : '#334155'}`,
    borderRadius: '8px',
    padding: '0.7rem 1rem',
    fontWeight: '700',
    cursor: preview ? 'pointer' : 'not-allowed',
  }}
>
  <ChevronRight size={14} />
  Open Print View
</button>

                  <div style={{ color: '#94a3b8', fontSize: '0.74rem' }}>
                    Report ID: {preview.reportId || 'Pending'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={panel}>
          {kicker('Local History')}
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>
            Saved Advisory Outputs
          </h3>

          {!historyOutputs.length ? (
            <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
              No saved advisory outputs found in Supabase yet.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
              {historyOutputs.slice(0, 6).map((item, idx) => (
                <div key={idx} style={cardStyle(`history-${idx}`)}>
                  <div style={{ fontSize: '0.65rem', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                    {item.industry}
                  </div>
                  <div style={{ color: '#e2e8f0', fontWeight: '700', marginBottom: '0.25rem' }}>{item.client}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.76rem', lineHeight: '1.55' }}>{item.summary}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </NexusShell>
  );
}
