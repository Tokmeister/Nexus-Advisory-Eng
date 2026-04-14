import { useEffect, useMemo, useState } from 'react';
import NexusShell from '@/components/NexusShell';
import { FolderOpen, CheckSquare, AlertTriangle, Clock, ChevronRight, Save } from 'lucide-react';
import { fetchProjectsLibrary, updateProjectAction, type ProjectView, type ProjectActionView } from '@/lib/nexus-data';

const priorityColor: Record<string, string> = { High: '#ef4444', Medium: '#f59e0b', Low: '#22c55e', Critical: '#a855f7' };
const statusColor: Record<string, string> = { 'Not Started': '#94a3b8', 'In Progress': '#3b82f6', Active: '#22c55e', Blocked: '#ef4444', Completed: '#22c55e' };
const healthColor: Record<string, string> = { Healthy: '#22c55e', Watch: '#f59e0b', 'At Risk': '#ef4444' };

type ActionDraftMap = Record<string, ProjectActionView>;

export default function ProjectsPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [projects, setProjects] = useState<ProjectView[]>([]);
  const [drafts, setDrafts] = useState<ActionDraftMap>({});
  const [savingId, setSavingId] = useState('');
  const [banner, setBanner] = useState('');

  async function loadProjects() {
    const rows = await fetchProjectsLibrary();
    setProjects(rows);
    setDrafts(Object.fromEntries(rows.flatMap(project => project.actions.map(action => [action.id, { ...action }]))));
  }

  useEffect(() => {
    let active = true;
    fetchProjectsLibrary()
      .then((rows) => {
        if (!active) return;
        setProjects(rows);
        setDrafts(Object.fromEntries(rows.flatMap(project => project.actions.map(action => [action.id, { ...action }]))));
      })
      .catch(() => {
        if (active) {
          setProjects([]);
          setDrafts({});
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const total = projects.length;
  const active = projects.filter(p => ['In Progress', 'Active'].includes(p.status)).length;
  const blocked = projects.filter(p => p.status === 'Blocked' || p.blockedActions > 0).length;
  const completed = projects.filter(p => p.status === 'Completed').length;
  const overdue = projects.reduce((sum, p) => sum + p.overdueActions, 0);
  const avgHealth = projects.length ? Math.round(projects.reduce((sum, p) => sum + p.healthScore, 0) / projects.length) : 0;

  const ownerLoad = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach(project => project.ownerLoad.forEach(item => counts.set(item.owner, (counts.get(item.owner) || 0) + item.count)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [projects]);

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

  const panel: React.CSSProperties = { background: '#0d1526', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '1.75rem' };
  const inputStyle: React.CSSProperties = { width: '100%', background: '#09111f', border: '1px solid #1e3a5f', borderRadius: '6px', color: '#e2e8f0', padding: '0.45rem 0.55rem', fontSize: '0.72rem' };
  const kicker = (t: string) => <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#3b82f6', textTransform: 'uppercase' as const, fontWeight: '600', marginBottom: '0.2rem' }}>{t}</div>;

  function patchDraft(actionId: string, patch: Partial<ProjectActionView>) {
    setDrafts(prev => ({ ...prev, [actionId]: { ...prev[actionId], ...patch } }));
  }

  async function saveAction(projectId: string, actionId: string) {
    const draft = drafts[actionId];
    if (!draft) return;
    setSavingId(actionId);
    setBanner('');
    try {
      await updateProjectAction({
        actionId,
        projectId,
        actionItem: draft.actionItem,
        status: draft.status,
        ownerName: draft.ownerName,
        dueDate: draft.dueDate,
        notes: draft.notes,
        sortOrder: Number(draft.sortOrder || 0),
      });
      await loadProjects();
      setBanner('Project action saved and analytics-ready.');
    } catch (error) {
      setBanner(error instanceof Error ? error.message : 'Could not save action.');
    } finally {
      setSavingId('');
    }
  }

  return (
    <NexusShell>
      <div style={{ padding: '1.5rem 2rem 3rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <div onMouseEnter={() => setHoveredCard('hero')} onMouseLeave={() => setHoveredCard(null)}
            style={{ background: 'linear-gradient(135deg, #0d1526 0%, #0f1e3a 100%)', border: `1px solid ${hoveredCard === 'hero' ? '#3b82f6' : '#1e3a5f'}`, borderLeft: '3px solid #2563eb', borderRadius: '12px', padding: '1.5rem 2rem', transition: 'all 0.2s ease', transform: hoveredCard === 'hero' ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hoveredCard === 'hero' ? '0 8px 32px rgba(37,99,235,0.2)' : '0 2px 8px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: '#3b82f6', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.4rem' }}>Client Workflow Layer</div>
            <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: '800', color: '#e2e8f0' }}>NEXUS Projects</h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6', maxWidth: '680px' }}>
              Turns saved advisory outputs into client workstreams. Actions can now be managed directly and pushed back into execution analytics.
            </p>
            {banner ? <div style={{ marginTop: '0.75rem', color: banner.toLowerCase().includes('saved') ? '#22c55e' : '#f59e0b', fontSize: '0.75rem' }}>{banner}</div> : null}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Projects', value: total, icon: FolderOpen, id: 'm-total' },
            { label: 'Active Intervention', value: active, icon: Clock, id: 'm-active' },
            { label: 'Blocked', value: blocked, icon: AlertTriangle, id: 'm-blocked' },
            { label: 'Overdue Actions', value: overdue, icon: AlertTriangle, id: 'm-overdue' },
            { label: 'Avg Health Score', value: `${avgHealth}%`, icon: CheckSquare, id: 'm-health' },
          ].map(({ label, value, icon: Icon, id }) => (
            <div key={id} onMouseEnter={() => setHoveredCard(id)} onMouseLeave={() => setHoveredCard(null)} style={cardStyle(id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                <Icon size={14} color="#2563eb" />
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: '700', color: '#60a5fa', lineHeight: 1 }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={panel}>
            {kicker('Project Register')}
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>Active Client Workstreams</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {projects.map(p => (
                <div key={p.id} onMouseEnter={() => setHoveredCard(p.id)} onMouseLeave={() => setHoveredCard(null)} style={{ ...cardStyle(p.id), padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>{p.industry}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#e2e8f0' }}>{p.client}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: '600', padding: '0.15rem 0.5rem', borderRadius: '999px', background: `${priorityColor[p.priority] || '#94a3b8'}22`, color: priorityColor[p.priority] || '#94a3b8', border: `1px solid ${priorityColor[p.priority] || '#94a3b8'}44` }}>{p.priority}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: '600', padding: '0.15rem 0.5rem', borderRadius: '999px', background: `${statusColor[p.status] || '#94a3b8'}22`, color: statusColor[p.status] || '#94a3b8', border: `1px solid ${statusColor[p.status] || '#94a3b8'}44` }}>{p.status}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: '600', padding: '0.15rem 0.5rem', borderRadius: '999px', background: `${healthColor[p.healthLabel]}22`, color: healthColor[p.healthLabel], border: `1px solid ${healthColor[p.healthLabel]}44` }}>{p.healthLabel} {p.healthScore}%</span>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.6' }}>{p.challenge}</p>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{p.project}</span>
                      <span style={{ fontSize: '0.65rem', color: '#60a5fa', fontWeight: '600' }}>{p.progress}%</span>
                    </div>
                    <div style={{ height: '5px', background: '#1e2a45', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${p.progress}%`, background: p.progress === 100 ? '#22c55e' : 'linear-gradient(90deg, #2563eb, #3b82f6)', borderRadius: '999px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem', marginBottom: p.actions.length ? '0.75rem' : 0 }}>
                    {[
                      { k: 'Business Area', v: p.businessArea },
                      { k: 'Report', v: p.reportId },
                      { k: 'Updated', v: p.updatedAt },
                      { k: 'Actions', v: `${p.completedActions}/${p.totalActions}` },
                      { k: 'Overdue', v: `${p.overdueActions}` },
                      { k: 'Blocked', v: `${p.blockedActions}` },
                    ].map(({ k, v }) => (
                      <div key={k} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e3a5f', borderRadius: '6px', padding: '0.5rem 0.6rem' }}>
                        <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginBottom: '0.2rem' }}>{k}</div>
                        <div style={{ fontSize: '0.7rem', color: '#e2e8f0' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {p.actions.length > 0 && (
                    <div style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: '8px', padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.65rem', color: '#3b82f6', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Execution Actions</div>
                      {p.actions.map((action, i) => {
                        const draft = drafts[action.id] || action;
                        return (
                          <div key={action.id} style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(30,58,95,0.55)', paddingTop: i === 0 ? 0 : '0.75rem', marginTop: i === 0 ? 0 : '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem' }}>
                              <ChevronRight size={11} color="#3b82f6" style={{ marginTop: '2px', flexShrink: 0 }} />
                              <div style={{ fontSize: '0.75rem', color: '#e2e8f0', fontWeight: 600 }}>Action #{i + 1}</div>
                              <span style={{ marginLeft: 'auto', fontSize: '0.62rem', fontWeight: '600', padding: '0.12rem 0.45rem', borderRadius: '999px', background: draft.isOverdue ? '#ef444422' : '#1e3a5f', color: draft.isOverdue ? '#ef4444' : '#94a3b8', border: `1px solid ${draft.isOverdue ? '#ef444444' : '#1e3a5f'}` }}>{draft.isOverdue ? 'Overdue' : `${draft.ageDays}d age`}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr auto', gap: '0.5rem', alignItems: 'start' }}>
                              <input value={draft.actionItem} onChange={e => patchDraft(action.id, { actionItem: e.target.value })} style={inputStyle} />
                              <select value={draft.status} onChange={e => patchDraft(action.id, { status: e.target.value as ProjectActionView['status'] })} style={inputStyle}>
                                {['Not Started', 'In Progress', 'Blocked', 'Completed'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                              <input value={draft.ownerName} onChange={e => patchDraft(action.id, { ownerName: e.target.value })} placeholder="Owner" style={inputStyle} />
                              <input type="date" value={draft.dueDate} onChange={e => patchDraft(action.id, { dueDate: e.target.value, isOverdue: false })} style={inputStyle} />
                              <button onClick={() => saveAction(p.id, action.id)} disabled={savingId === action.id} style={{ height: '34px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0 0.8rem', borderRadius: '8px', border: '1px solid #2563eb', background: savingId === action.id ? '#1e3a5f' : '#2563eb', color: '#fff', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600 }}>
                                <Save size={12} /> {savingId === action.id ? 'Saving' : 'Save'}
                              </button>
                            </div>
                            <textarea value={draft.notes} onChange={e => patchDraft(action.id, { notes: e.target.value })} rows={2} placeholder="Notes" style={{ ...inputStyle, marginTop: '0.45rem', resize: 'vertical' }} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={panel}>
              {kicker('Execution Snapshot')}
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>Project Tracker</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1e3a5f' }}>
                      {['Client', 'Health', 'Overdue', 'Blocked', 'Updated'].map(col => (
                        <th key={col} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#60a5fa', fontWeight: '600', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p, i) => (
                      <tr key={p.id} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)} style={{ borderBottom: '1px solid #1e3a5f', background: hoveredRow === i ? 'rgba(37,99,235,0.08)' : 'transparent', transition: 'background 0.15s ease' }}>
                        <td style={{ padding: '0.65rem 0.75rem', color: '#e2e8f0', fontWeight: '500' }}>{p.client}</td>
                        <td style={{ padding: '0.65rem 0.75rem', color: healthColor[p.healthLabel] }}>{p.healthLabel} {p.healthScore}%</td>
                        <td style={{ padding: '0.65rem 0.75rem', color: p.overdueActions > 0 ? '#ef4444' : '#94a3b8' }}>{p.overdueActions}</td>
                        <td style={{ padding: '0.65rem 0.75rem', color: p.blockedActions > 0 ? '#ef4444' : '#94a3b8' }}>{p.blockedActions}</td>
                        <td style={{ padding: '0.65rem 0.75rem', color: '#94a3b8' }}>{p.updatedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={panel}>
              {kicker('Owner Accountability')}
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>Top Action Owners</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {ownerLoad.length ? ownerLoad.map(([owner, count]) => (
                  <div key={owner} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #1e3a5f', borderRadius: '8px', padding: '0.65rem 0.8rem', background: 'rgba(255,255,255,0.02)' }}>
                    <span style={{ fontSize: '0.78rem', color: '#e2e8f0' }}>{owner}</span>
                    <span style={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: 600 }}>{count} actions</span>
                  </div>
                )) : <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No owner assignments yet.</div>}
              </div>
              <div style={{ marginTop: '0.875rem', fontSize: '0.72rem', color: '#1e3a5f', lineHeight: '1.5' }}>
                Projects is the workflow layer. Reports remains the document layer.
              </div>
            </div>
          </div>
        </div>
      </div>
    </NexusShell>
  );
}
