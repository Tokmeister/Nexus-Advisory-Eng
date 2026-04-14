import type { AdvisoryRecord } from '@/lib/advisoryLogic';

type SupabaseClientLike = any;
type GenericRow = Record<string, any>;

type ProjectActionStatus = 'Not Started' | 'In Progress' | 'Blocked' | 'Completed';

type ProjectActionView = {
  id: string;
  projectId: string;
  actionItem: string;
  status: ProjectActionStatus;
  ownerName: string;
  dueDate: string;
  notes: string;
  sortOrder: number;
  updatedAt: string;
  createdAt: string;
  isOverdue: boolean;
  ageDays: number;
};

type ProjectView = {
  id: string;
  client: string;
  industry: string;
  businessArea: string;
  challenge: string;
  priority: string;
  status: string;
  progress: number;
  reportId: string;
  project: string;
  updatedAt: string;
  actions: ProjectActionView[];
  healthScore: number;
  healthLabel: 'Healthy' | 'Watch' | 'At Risk';
  overdueActions: number;
  blockedActions: number;
  completedActions: number;
  totalActions: number;
  ownerLoad: { owner: string; count: number }[];
};

export type AnalyticsSnapshot = {
  advisoryOutputsTotal: number;
  activeClientsTotal: number;
  avgProjectVelocity: number;
  highUrgencyTotal: number;
  estimatedValueTotal: number;
  monthlyAdvisoryOutputs: { label: string; value: number }[];
  monthlyEstimatedValue: { label: string; value: number }[];
  monthlyProjectVelocity: number[];
  monthlyHighUrgency: { label: string; value: number }[];
  industryMix: { label: string; value: number; color: string }[];
  categoryMix: { label: string; value: number; color: string }[];
  overdueActionsTotal: number;
  blockedActionsTotal: number;
  completedActionsTotal: number;
  openActionsTotal: number;
  actionCompletionRate: number;
  avgActionAgeDays: number;
  ownerLoad: { label: string; value: number; color: string }[];
  healthMix: { label: string; value: number; color: string }[];
};

export type DashboardSnapshot = {
  totalAdvisoryInputs: number;
  totalProjects: number;
  totalActions: number;
  totalReports: number;
  avgUrgency: 'Low' | 'Medium' | 'High' | 'Critical';
  latestReport: { title: string; client: string; date: string; confidence: string; urgency: string };
  latestInsight: { title: string; text: string };
  projectsCompleted: number;
  activities: { action: string; detail: string; time: string; urgency: string; sortTs: number }[];
  monthlyProjects: { label: string; completed: number; total: number }[];
  overdueActions: number;
  blockedActions: number;
  avgHealthScore: number;
  completionRate: number;
};

const SUPABASE_URL =
  import.meta.env.VITE_NEXUS_SUPABASE_URL || 'https://clwjhdxjdpikrxcormsb.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_NEXUS_SUPABASE_ANON_KEY || 'sb_publishable_EJGKO-RRnc9zJo8jUxsLlQ_uvTNC2Bw';

let supabasePromise: Promise<SupabaseClientLike> | null = null;

export function clean(value: unknown): string {
  return String(value || '').trim();
}

function blankRoadmap() {
  return { day30Title: '', day60Title: '', day90Title: '', day30: [], day60: [], day90: [] };
}

function toTitleCase(value: string): string {
  const raw = clean(value);
  if (!raw) return '';
  return raw
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function formatUrgency(value: string): string {
  const raw = clean(value).toLowerCase();
  if (!raw) return 'Medium';
  if (raw === 'very high' || raw === 'critical') return 'Critical';
  if (raw === 'high' || raw === 'urgent') return 'High';
  if (raw === 'medium' || raw === 'moderate') return 'Medium';
  if (raw === 'low') return 'Low';
  return toTitleCase(raw);
}

function formatPriority(value: string): string {
  return formatUrgency(value);
}

function formatProjectStatus(value: string): string {
  const raw = clean(value).toLowerCase();
  if (['in progress', 'in_progress', 'working'].includes(raw)) return 'In Progress';
  if (['active'].includes(raw)) return 'Active';
  if (['blocked', 'on hold', 'on_hold'].includes(raw)) return 'Blocked';
  if (['completed', 'complete', 'done'].includes(raw)) return 'Completed';
  if (['not started', 'not_started'].includes(raw)) return 'Active';
  return toTitleCase(raw || 'Active');
}

function formatActionStatus(value: string): ProjectActionStatus {
  const raw = clean(value).toLowerCase();
  if (['in progress', 'in_progress', 'working', 'active'].includes(raw)) return 'In Progress';
  if (['blocked', 'on hold', 'on_hold'].includes(raw)) return 'Blocked';
  if (['completed', 'complete', 'done'].includes(raw)) return 'Completed';
  return 'Not Started';
}

function formatReportStatus(value: string): string {
  const raw = clean(value).toLowerCase();
  if (!raw) return 'Saved';
  if (raw === 'draft') return 'Saved';
  return toTitleCase(raw);
}

function formatDisplayDate(value: unknown): string {
  const raw = clean(value);
  if (!raw) return '';
  const dt = new Date(raw);
  if (!Number.isNaN(dt.getTime())) return dt.toISOString().slice(0, 10);
  return raw.slice(0, 10);
}

function sortRowsByNewest<T extends GenericRow>(rows: T[]): T[] {
  return [...rows].sort((a, b) => {
    const aTime = new Date(a.updated_at || a.created_at || a.date || 0).getTime() || 0;
    const bTime = new Date(b.updated_at || b.created_at || b.date || 0).getTime() || 0;
    return bTime - aTime;
  });
}

function deriveCategory(reportTitle: string, fallback = 'Advisory'): string {
  const title = clean(reportTitle);
  if (!title) return fallback;
  return title
    .replace(/\s+Strategic Review$/i, '')
    .replace(/\s+Review$/i, '')
    .replace(/^.+?\s+/, '') || fallback;
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function buildRecentMonthBuckets(monthCount = 7) {
  const now = new Date();
  const buckets: { key: string; label: string }[] = [];
  for (let offset = monthCount - 1; offset >= 0; offset -= 1) {
    const dt = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    buckets.push({ key: monthKey(dt), label: dt.toLocaleString('en-GB', { month: 'short' }) });
  }
  return buckets;
}

function parseNumeric(value: unknown): number {
  const raw = String(value ?? '').replace(/[^0-9.-]+/g, '');
  const num = Number(raw);
  return Number.isFinite(num) ? num : 0;
}

function pickColor(index: number): string {
  const palette = ['#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706', '#60a5fa', '#22c55e'];
  return palette[index % palette.length];
}

function daysBetween(from: unknown, to = new Date()): number {
  const raw = clean(from);
  if (!raw) return 0;
  const dt = new Date(raw);
  if (Number.isNaN(dt.getTime())) return 0;
  return Math.max(0, Math.floor((to.getTime() - dt.getTime()) / 86400000));
}

function isOverdue(dueDate: unknown, status: string): boolean {
  const raw = clean(dueDate);
  if (!raw || formatActionStatus(status) === 'Completed') return false;
  const dt = new Date(raw);
  if (Number.isNaN(dt.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dt.setHours(0, 0, 0, 0);
  return dt.getTime() < today.getTime();
}

function computeProjectHealth(actions: ProjectActionView[], projectStatus: string, progress: number) {
  if (!actions.length) {
    const base = projectStatus === 'Completed' ? 100 : progress > 0 ? 70 : 55;
    return {
      score: base,
      label: (base >= 80 ? 'Healthy' : base >= 55 ? 'Watch' : 'At Risk') as 'Healthy' | 'Watch' | 'At Risk',
      overdue: 0,
      blocked: projectStatus === 'Blocked' ? 1 : 0,
      completed: projectStatus === 'Completed' ? 1 : 0,
    };
  }

  const overdue = actions.filter(action => action.isOverdue).length;
  const blocked = actions.filter(action => action.status === 'Blocked').length;
  const completed = actions.filter(action => action.status === 'Completed').length;
  const inProgress = actions.filter(action => action.status === 'In Progress').length;
  const completionRate = completed / actions.length;

  let score = 50 + Math.round(completionRate * 40) + Math.min(inProgress * 4, 10);
  score -= blocked * 18;
  score -= overdue * 12;
  if (projectStatus === 'Completed') score = 100;
  if (projectStatus === 'Blocked') score -= 12;
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    label: (score >= 80 ? 'Healthy' : score >= 55 ? 'Watch' : 'At Risk') as 'Healthy' | 'Watch' | 'At Risk',
    overdue,
    blocked,
    completed,
  };
}

async function getSupabase(): Promise<SupabaseClientLike> {
  const existing = (window as Window & { __nexusSupabase?: SupabaseClientLike }).__nexusSupabase;
  if (existing) return existing;

  if (!supabasePromise) {
    supabasePromise = import(/* @vite-ignore */ 'https://esm.sh/@supabase/supabase-js@2').then((mod: { createClient: (url: string, key: string, options?: Record<string, unknown>) => SupabaseClientLike }) => {
      const client = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      });
      (window as Window & { __nexusSupabase?: SupabaseClientLike }).__nexusSupabase = client;
      return client;
    });
  }

  return supabasePromise;
}

export async function getCurrentProfile() {
  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message || 'Could not read session.');

  const userId = data?.session?.user?.id as string | undefined;
  if (!userId) throw new Error('No authenticated user session found.');

  const profileLookup = await supabase
    .from('profiles')
    .select('id, organisation_id, full_name, email, role')
    .eq('id', userId)
    .maybeSingle();

  if (profileLookup.error) throw new Error(profileLookup.error.message || 'Could not load profile.');
  if (!profileLookup.data?.organisation_id) throw new Error('Profile found, but organisation_id is missing.');
  return profileLookup.data;
}

async function fetchOrganisationRows(table: string) {
  const profile = await getCurrentProfile();
  const supabase = await getSupabase();
  const { data, error } = await supabase.from(table).select('*').eq('organisation_id', clean(profile.organisation_id));
  if (error) throw new Error(error.message || `Could not load ${table}.`);
  return (data || []) as GenericRow[];
}

async function fetchRowsByIds(table: string, ids: string[], idColumn = 'id') {
  if (!ids.length) return [] as GenericRow[];
  const supabase = await getSupabase();
  const { data, error } = await supabase.from(table).select('*').in(idColumn, ids);
  if (error) throw new Error(error.message || `Could not load ${table}.`);
  return (data || []) as GenericRow[];
}

export async function fetchReportsLibrary(): Promise<AdvisoryRecord[]> {
  const reports = sortRowsByNewest(await fetchOrganisationRows('reports'));
  const advisoryInputs = await fetchRowsByIds('advisory_inputs', reports.map(row => clean(row.advisory_input_id)).filter(Boolean));
  const projects = await fetchRowsByIds('projects', reports.map(row => clean(row.project_id)).filter(Boolean));
  const advisoryById = new Map(advisoryInputs.map(row => [clean(row.id), row]));
  const projectById = new Map(projects.map(row => [clean(row.id), row]));

  return reports.map((report) => {
    const advisory = advisoryById.get(clean(report.advisory_input_id)) || {};
    const project = projectById.get(clean(report.project_id)) || {};
    const client = clean(advisory.client_name || 'Client');
    const urgency = formatUrgency(clean(advisory.urgency_level || 'Medium'));
    const projectName = clean(project.project_name || report.title || 'Execution Project');
    const summary = clean(project.target_outcome || report.title || advisory.primary_business_challenge || 'Live advisory record saved in Supabase.');
    const category = deriveCategory(clean(report.title), clean(advisory.business_function_affected || 'Advisory'));

    return {
      id: clean(report.id || report.report_id),
      reportId: clean(report.report_id || report.id),
      client,
      industry: clean(advisory.industry || 'Unclassified'),
      category,
      priority: formatPriority(clean(project.priority || advisory.urgency_level || 'Medium')),
      confidence: '--',
      urgency,
      status: formatReportStatus(clean(report.status || 'Saved')),
      date: formatDisplayDate(report.created_at || report.updated_at || advisory.created_at),
      challenge: clean(advisory.primary_business_challenge || summary),
      goal: clean(advisory.strategic_goal || project.target_outcome || ''),
      project: projectName,
      summary,
      executiveTitle: clean(report.title || `${client} ${category} Review`),
      executiveText: '',
      issueStatement: '',
      riskSummary: [],
      recommendations: [],
      priorities: [],
      risks: [],
      focusTags: [],
      roadmap: blankRoadmap(),
      consultantNote: '',
    };
  });
}

export async function fetchRecentHistoryOutputs(limit = 6): Promise<AdvisoryRecord[]> {
  const reports = await fetchReportsLibrary();
  return reports.slice(0, limit);
}

function mapProjectActions(actions: GenericRow[]): ProjectActionView[] {
  const now = new Date();
  return [...actions]
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0) || (new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()))
    .map((action) => ({
      id: clean(action.id),
      projectId: clean(action.project_id),
      actionItem: clean(action.action_item),
      status: formatActionStatus(clean(action.status)),
      ownerName: clean(action.owner_name),
      dueDate: formatDisplayDate(action.due_date),
      notes: clean(action.notes),
      sortOrder: Number(action.sort_order || 0),
      updatedAt: formatDisplayDate(action.updated_at || action.created_at),
      createdAt: formatDisplayDate(action.created_at),
      isOverdue: isOverdue(action.due_date, clean(action.status)),
      ageDays: daysBetween(action.created_at || action.updated_at, now),
    }));
}

export async function fetchProjectsLibrary(): Promise<ProjectView[]> {
  const projects = sortRowsByNewest(await fetchOrganisationRows('projects'));
  const advisoryInputs = await fetchRowsByIds('advisory_inputs', projects.map(row => clean(row.advisory_input_id)).filter(Boolean));
  const reports = await fetchRowsByIds('reports', projects.map(row => clean(row.report_id)).filter(Boolean));
  const projectActions = await fetchRowsByIds('project_actions', projects.map(row => clean(row.id)).filter(Boolean), 'project_id');

  const advisoryById = new Map(advisoryInputs.map(row => [clean(row.id), row]));
  const reportById = new Map(reports.map(row => [clean(row.id), row]));
  const actionsByProjectId = new Map<string, GenericRow[]>();

  for (const action of projectActions) {
    const projectId = clean(action.project_id);
    if (!projectId) continue;
    if (!actionsByProjectId.has(projectId)) actionsByProjectId.set(projectId, []);
    actionsByProjectId.get(projectId)!.push(action);
  }

  return projects.map((project) => {
    const advisory = advisoryById.get(clean(project.advisory_input_id)) || {};
    const report = reportById.get(clean(project.report_id)) || {};
    const mappedActions = mapProjectActions(actionsByProjectId.get(clean(project.id)) || []);
    const health = computeProjectHealth(mappedActions, formatProjectStatus(clean(project.status || 'not_started')), Number(project.progress_percent || 0));
    const ownerMap = new Map<string, number>();
    for (const action of mappedActions) {
      const owner = action.ownerName || 'Unassigned';
      ownerMap.set(owner, (ownerMap.get(owner) || 0) + 1);
    }

    return {
      id: clean(project.id),
      client: clean(advisory.client_name || 'Client'),
      industry: clean(advisory.industry || 'Unclassified'),
      businessArea: clean(project.business_area || advisory.business_function_affected || 'General Business'),
      challenge: clean(advisory.primary_business_challenge || project.next_action || project.target_outcome || 'Execution project created from live advisory output.'),
      priority: formatPriority(clean(project.priority || advisory.urgency_level || 'Medium')),
      status: formatProjectStatus(clean(project.status || 'not_started')),
      progress: Number(project.progress_percent || 0),
      reportId: clean(report.report_id || report.id || ''),
      project: clean(project.project_name || report.title || 'Execution Project'),
      updatedAt: formatDisplayDate(project.updated_at || project.created_at || report.created_at || advisory.created_at),
      actions: mappedActions,
      healthScore: health.score,
      healthLabel: health.label,
      overdueActions: health.overdue,
      blockedActions: health.blocked,
      completedActions: health.completed,
      totalActions: mappedActions.length,
      ownerLoad: [...ownerMap.entries()].map(([owner, count]) => ({ owner, count })).sort((a, b) => b.count - a.count),
    };
  });
}

export async function updateProjectAction(input: {
  actionId: string;
  projectId: string;
  actionItem: string;
  status: string;
  ownerName: string;
  dueDate: string;
  notes: string;
  sortOrder: number;
}) {
  const profile = await getCurrentProfile();
  const supabase = await getSupabase();
  const organisationId = clean(profile.organisation_id);
  const nowIso = new Date().toISOString();

  const payload = {
    action_item: input.actionItem,
    status: input.status.toLowerCase().replace(/\s+/g, '_'),
    owner_name: input.ownerName,
    due_date: input.dueDate || null,
    notes: input.notes,
    sort_order: input.sortOrder,
    updated_at: nowIso,
  };

  const updateRes = await supabase
    .from('project_actions')
    .update(payload)
    .eq('id', input.actionId)
    .eq('organisation_id', organisationId)
    .select('*')
    .maybeSingle();

  if (updateRes.error) throw new Error(updateRes.error.message || 'Could not save project action.');

  const allActionsRes = await supabase
    .from('project_actions')
    .select('*')
    .eq('organisation_id', organisationId)
    .eq('project_id', input.projectId);

  if (allActionsRes.error) throw new Error(allActionsRes.error.message || 'Could not reload project actions.');

  const actions = mapProjectActions((allActionsRes.data || []) as GenericRow[]);
  const completed = actions.filter(a => a.status === 'Completed').length;
  const blocked = actions.filter(a => a.status === 'Blocked').length;
  const inProgress = actions.filter(a => a.status === 'In Progress').length;
  const total = actions.length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const nextAction = actions.find(a => a.status !== 'Completed')?.actionItem || actions.at(0)?.actionItem || '';
  const projectStatus = blocked > 0 ? 'blocked' : completed === total && total > 0 ? 'completed' : inProgress > 0 || completed > 0 ? 'in_progress' : 'not_started';

  const projectUpdateRes = await supabase
    .from('projects')
    .update({
      status: projectStatus,
      progress_percent: progressPercent,
      next_action: nextAction,
      updated_at: nowIso,
    })
    .eq('id', input.projectId)
    .eq('organisation_id', organisationId);

  if (projectUpdateRes.error) throw new Error(projectUpdateRes.error.message || 'Could not roll up project status.');

  return true;
}

export async function fetchAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  const profile = await getCurrentProfile();
  const organisationId = clean(profile.organisation_id);
  const supabase = await getSupabase();

  const [advisoryRes, reportsRes, projectsRes, actionsRes] = await Promise.all([
    supabase.from('advisory_inputs').select('*').eq('organisation_id', organisationId),
    supabase.from('reports').select('*').eq('organisation_id', organisationId),
    supabase.from('projects').select('*').eq('organisation_id', organisationId),
    supabase.from('project_actions').select('*').eq('organisation_id', organisationId),
  ]);

  if (advisoryRes.error) throw new Error(advisoryRes.error.message || 'Could not load advisory_inputs.');
  if (reportsRes.error) throw new Error(reportsRes.error.message || 'Could not load reports.');
  if (projectsRes.error) throw new Error(projectsRes.error.message || 'Could not load projects.');
  if (actionsRes.error) throw new Error(actionsRes.error.message || 'Could not load project_actions.');

  const advisoryInputs = (advisoryRes.data || []) as GenericRow[];
  const reports = (reportsRes.data || []) as GenericRow[];
  const projects = (projectsRes.data || []) as GenericRow[];
  const projectActions = (actionsRes.data || []) as GenericRow[];
  const mappedActions = mapProjectActions(projectActions);

  const monthBuckets = buildRecentMonthBuckets(7);
  const outputCounts = new Map(monthBuckets.map(bucket => [bucket.key, 0]));
  const estimatedValueCounts = new Map(monthBuckets.map(bucket => [bucket.key, 0]));
  const highUrgencyCounts = new Map(monthBuckets.map(bucket => [bucket.key, 0]));
  const projectVelocityCounts = new Map(monthBuckets.map(bucket => [bucket.key, 0]));
  const industryCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  const activeClients = new Set<string>();
  const ownerCounts = new Map<string, number>();
  const healthCounts = new Map<string, number>([['Healthy', 0], ['Watch', 0], ['At Risk', 0]]);

  for (const row of advisoryInputs) {
    const client = clean(row.client_name).toLowerCase();
    if (client) activeClients.add(client);
    const dt = new Date(clean(row.created_at || row.date));
    const key = Number.isNaN(dt.getTime()) ? '' : monthKey(dt);
    if (key && outputCounts.has(key)) {
      outputCounts.set(key, (outputCounts.get(key) || 0) + 1);
      estimatedValueCounts.set(key, (estimatedValueCounts.get(key) || 0) + parseNumeric(row.estimated_value));
      const urgency = formatUrgency(clean(row.urgency_level || ''));
      if (urgency === 'High' || urgency === 'Critical') highUrgencyCounts.set(key, (highUrgencyCounts.get(key) || 0) + 1);
    }
    const industry = clean(row.industry || 'Unclassified');
    industryCounts.set(industry, (industryCounts.get(industry) || 0) + 1);
  }

  for (const report of reports) {
    const category = deriveCategory(clean(report.title), 'Advisory');
    categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
  }

  const actionsByProject = new Map<string, ProjectActionView[]>();
  for (const action of mappedActions) {
    if (!actionsByProject.has(action.projectId)) actionsByProject.set(action.projectId, []);
    actionsByProject.get(action.projectId)!.push(action);
    const owner = action.ownerName || 'Unassigned';
    ownerCounts.set(owner, (ownerCounts.get(owner) || 0) + 1);
    const dt = new Date(clean(action.updatedAt || action.createdAt));
    const key = Number.isNaN(dt.getTime()) ? '' : monthKey(dt);
    if (key && projectVelocityCounts.has(key) && (action.status === 'Completed' || action.status === 'In Progress')) {
      projectVelocityCounts.set(key, (projectVelocityCounts.get(key) || 0) + 1);
    }
  }

  for (const project of projects) {
    const health = computeProjectHealth(actionsByProject.get(clean(project.id)) || [], formatProjectStatus(clean(project.status || '')), Number(project.progress_percent || 0));
    healthCounts.set(health.label, (healthCounts.get(health.label) || 0) + 1);
  }

  const overdueActionsTotal = mappedActions.filter(action => action.isOverdue).length;
  const blockedActionsTotal = mappedActions.filter(action => action.status === 'Blocked').length;
  const completedActionsTotal = mappedActions.filter(action => action.status === 'Completed').length;
  const openActionsTotal = mappedActions.length - completedActionsTotal;
  const actionCompletionRate = mappedActions.length ? Math.round((completedActionsTotal / mappedActions.length) * 100) : 0;
  const avgActionAgeDays = mappedActions.length ? Math.round(mappedActions.reduce((sum, action) => sum + action.ageDays, 0) / mappedActions.length) : 0;

  return {
    advisoryOutputsTotal: advisoryInputs.length,
    activeClientsTotal: activeClients.size,
    avgProjectVelocity: Number((Array.from(projectVelocityCounts.values()).reduce((sum, value) => sum + value, 0) / monthBuckets.length).toFixed(1)),
    highUrgencyTotal: advisoryInputs.filter(row => ['High', 'Critical'].includes(formatUrgency(clean(row.urgency_level || '')))).length,
    estimatedValueTotal: advisoryInputs.reduce((sum, row) => sum + parseNumeric(row.estimated_value), 0),
    monthlyAdvisoryOutputs: monthBuckets.map(bucket => ({ label: bucket.label, value: outputCounts.get(bucket.key) || 0 })),
    monthlyEstimatedValue: monthBuckets.map(bucket => ({ label: bucket.label, value: Number(((estimatedValueCounts.get(bucket.key) || 0) / 1000000).toFixed(2)) })),
    monthlyProjectVelocity: monthBuckets.map(bucket => projectVelocityCounts.get(bucket.key) || 0),
    monthlyHighUrgency: monthBuckets.map(bucket => ({ label: bucket.label, value: highUrgencyCounts.get(bucket.key) || 0 })),
    industryMix: [...industryCounts.entries()].map(([label, value], index) => ({ label, value, color: pickColor(index) })),
    categoryMix: [...categoryCounts.entries()].map(([label, value], index) => ({ label, value, color: pickColor(index) })),
    overdueActionsTotal,
    blockedActionsTotal,
    completedActionsTotal,
    openActionsTotal,
    actionCompletionRate,
    avgActionAgeDays,
    ownerLoad: [...ownerCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, value], index) => ({ label, value, color: pickColor(index) })),
    healthMix: ['Healthy', 'Watch', 'At Risk'].map((label, index) => ({ label, value: healthCounts.get(label) || 0, color: ['#22c55e', '#f59e0b', '#ef4444'][index] })),
  };
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

function urgencyLabel(value: unknown): 'Low' | 'Medium' | 'High' | 'Critical' {
  const raw = clean(value).toLowerCase();
  if (raw === 'critical' || raw === 'very high') return 'Critical';
  if (raw === 'high' || raw === 'urgent') return 'High';
  if (raw === 'low') return 'Low';
  return 'Medium';
}

function urgencyScore(value: unknown): number {
  const label = urgencyLabel(value);
  return label === 'Critical' ? 4 : label === 'High' ? 3 : label === 'Medium' ? 2 : 1;
}

function buildMonthlyProjectData(projects: GenericRow[]) {
  const now = new Date();
  const months = Array.from({ length: 4 }).map((_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (3 - idx), 1);
    return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleString('en-US', { month: 'short' }) };
  });

  return months.map((month) => {
    const monthProjects = projects.filter((project) => formatDisplayDate(project.created_at || project.updated_at).startsWith(month.key));
    return {
      label: month.label,
      total: monthProjects.length,
      completed: monthProjects.filter((project) => clean(project.status).toLowerCase() === 'completed').length,
    };
  });
}

export async function fetchDashboardSnapshot(): Promise<DashboardSnapshot> {
  const profile = await getCurrentProfile();
  const organisationId = clean(profile.organisation_id);
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

  const advisoryInputs = (advisoryRes.data || []) as GenericRow[];
  const reports = (reportsRes.data || []) as GenericRow[];
  const projects = (projectsRes.data || []) as GenericRow[];
  const projectActions = (actionsRes.data || []) as GenericRow[];
  const mappedActions = mapProjectActions(projectActions);
  const actionsByProject = new Map<string, ProjectActionView[]>();
  for (const action of mappedActions) {
    if (!actionsByProject.has(action.projectId)) actionsByProject.set(action.projectId, []);
    actionsByProject.get(action.projectId)!.push(action);
  }

  const advisoryById = new Map(advisoryInputs.map((row) => [clean(row.id), row]));
  const projectById = new Map(projects.map((row) => [clean(row.id), row]));

  const latestAdvisory = [...advisoryInputs].sort((a, b) => (new Date(b.created_at || b.updated_at || 0).getTime() || 0) - (new Date(a.created_at || a.updated_at || 0).getTime() || 0))[0];
  const latestReportRow = [...reports].sort((a, b) => (new Date(b.created_at || b.updated_at || 0).getTime() || 0) - (new Date(a.created_at || a.updated_at || 0).getTime() || 0))[0];
  const latestReportAdvisory = latestReportRow ? advisoryById.get(clean(latestReportRow.advisory_input_id)) : null;

  const activities = [
    ...reports.map((row) => {
      const advisory = advisoryById.get(clean(row.advisory_input_id)) || {};
      const created = row.created_at || row.updated_at;
      return { action: 'Report generated', detail: `${clean(row.title || row.report_id || 'Report')} — ${clean(advisory.client_name || 'Client')}`, time: relativeTime(created), urgency: urgencyLabel(advisory.urgency_level), sortTs: new Date(created || 0).getTime() || 0 };
    }),
    ...projects.map((row) => {
      const advisory = advisoryById.get(clean(row.advisory_input_id)) || {};
      const created = row.updated_at || row.created_at;
      return { action: 'Project updated', detail: `${clean(row.project_name || 'Project')} — ${clean(advisory.client_name || 'Client')}`, time: relativeTime(created), urgency: urgencyLabel(row.priority || advisory.urgency_level), sortTs: new Date(created || 0).getTime() || 0 };
    }),
    ...projectActions.map((row) => {
      const project = projectById.get(clean(row.project_id)) || {};
      const advisory = advisoryById.get(clean(project.advisory_input_id)) || {};
      const created = row.updated_at || row.created_at;
      const status = formatActionStatus(clean(row.status));
      return { action: status === 'Completed' ? 'Action completed' : status === 'Blocked' ? 'Action blocked' : 'Action updated', detail: `${clean(row.action_item || 'Project action')} — ${clean(advisory.client_name || 'Client')}`, time: relativeTime(created), urgency: urgencyLabel(project.priority || advisory.urgency_level), sortTs: new Date(created || 0).getTime() || 0 };
    }),
  ].sort((a, b) => b.sortTs - a.sortTs).slice(0, 5);

  const avgUrgency = advisoryInputs.length
    ? urgencyLabel(
        advisoryInputs.map((row) => urgencyScore(row.urgency_level)).reduce((sum, score) => sum + score, 0) / advisoryInputs.length >= 3.5
          ? 'critical'
          : advisoryInputs.map((row) => urgencyScore(row.urgency_level)).reduce((sum, score) => sum + score, 0) / advisoryInputs.length >= 2.5
            ? 'high'
            : advisoryInputs.map((row) => urgencyScore(row.urgency_level)).reduce((sum, score) => sum + score, 0) / advisoryInputs.length >= 1.5
              ? 'medium'
              : 'low'
      )
    : 'Medium';

  const healthScores = projects.map((project) => computeProjectHealth(actionsByProject.get(clean(project.id)) || [], formatProjectStatus(clean(project.status || '')), Number(project.progress_percent || 0)).score);
  const overdueActions = mappedActions.filter(action => action.isOverdue).length;
  const blockedActions = mappedActions.filter(action => action.status === 'Blocked').length;
  const completionRate = mappedActions.length ? Math.round((mappedActions.filter(action => action.status === 'Completed').length / mappedActions.length) * 100) : 0;

  return {
    totalAdvisoryInputs: advisoryInputs.length,
    totalProjects: projects.length,
    totalActions: projectActions.length,
    totalReports: reports.length,
    avgUrgency,
    latestReport: latestReportRow ? { title: clean(latestReportRow.title || latestReportRow.report_id || 'Latest report'), client: clean(latestReportAdvisory?.client_name || 'Client'), date: formatDisplayDate(latestReportRow.created_at || latestReportRow.updated_at), confidence: '--', urgency: urgencyLabel(latestReportAdvisory?.urgency_level) } : { title: 'No reports yet', client: '--', date: '--', confidence: '--', urgency: 'Medium' },
    latestInsight: latestAdvisory ? { title: `${clean(latestAdvisory.client_name || 'Client')} — ${clean(latestAdvisory.industry || 'Advisory')}`, text: clean(latestAdvisory.primary_business_challenge) || clean(latestAdvisory.strategic_goal) || 'Latest executive advisory input captured in Supabase.' } : { title: 'No executive output yet', text: 'Generate the first advisory to populate the executive control layer for this organisation.' },
    projectsCompleted: projects.filter((row) => clean(row.status).toLowerCase() === 'completed').length,
    activities,
    monthlyProjects: buildMonthlyProjectData(projects),
    overdueActions,
    blockedActions,
    avgHealthScore: healthScores.length ? Math.round(healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length) : 0,
    completionRate,
  };
}

export type { ProjectView, ProjectActionView };
