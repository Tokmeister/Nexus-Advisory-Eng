import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NexusShell from '@/components/NexusShell';
import { FileText, Users, TrendingUp, AlertCircle, Search, X } from 'lucide-react';
import type { AdvisoryRecord } from '@/lib/advisoryLogic';
import { fetchReportsLibrary } from '@/lib/nexus-data';

const urgencyColor: Record<string, string> = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#22c55e',
  Critical: '#a855f7',
};

function cleanSearch(value: string | null): string {
  return String(value || '').trim();
}

export default function ReportsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [search, setSearch] = useState(() => cleanSearch(searchParams.get('search')));
  const [clientFilter, setClientFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [allReports, setAllReports] = useState<AdvisoryRecord[]>([]);
  const [selectedReport, setSelectedReport] = useState<AdvisoryRecord | null>(null);

  useEffect(() => {
    setSearch(cleanSearch(searchParams.get('search')));
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    fetchReportsLibrary()
      .then((rows) => {
        if (active) setAllReports(rows);
      })
      .catch(() => {
        if (active) setAllReports([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return allReports.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        [r.client, r.industry, r.category, r.challenge, r.goal, r.reportId, r.project, r.date]
          .join(' ')
          .toLowerCase()
          .includes(q);

      const matchClient = !clientFilter || r.client === clientFilter;
      const matchCat = !categoryFilter || r.category === categoryFilter;
      const matchInd = !industryFilter || r.industry === industryFilter;

      return matchSearch && matchClient && matchCat && matchInd;
    });
  }, [allReports, search, clientFilter, categoryFilter, industryFilter]);

  const clients = [...new Set(allReports.map((r) => r.client).filter(Boolean))].sort();
  const categories = [...new Set(allReports.map((r) => r.category).filter(Boolean))].sort();
  const industries = [...new Set(allReports.map((r) => r.industry).filter(Boolean))].sort();

  const latest = filtered[0] || null;

  const openReport = (report: AdvisoryRecord) => {
    setSelectedReport(report);
  };

  const numericConf = filtered
    .map((r) => parseInt(String(r.confidence || '').replace(/[^0-9]/g, ''), 10))
    .filter((v) => !Number.isNaN(v));

  const avgConfidence = numericConf.length
    ? `${Math.round(numericConf.reduce((s, v) => s + v, 0) / numericConf.length)}%`
    : '--';

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
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: '0.2rem',
      }}
    >
      {t}
    </div>
  );

  const selectStyle: React.CSSProperties = {
    background: '#0a0f1e',
    border: '1px solid #1e3a5f',
    borderRadius: '8px',
    color: '#94a3b8',
    padding: '0.5rem 0.75rem',
    fontSize: '0.78rem',
    outline: 'none',
    cursor: 'pointer',
  };

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
              Document Library Layer
            </div>

            <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: '800', color: '#e2e8f0' }}>
              NEXUS Reports
            </h1>

            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6', maxWidth: '680px' }}>
              Report library for saved advisory outputs. Portfolio visibility across clients, categories, urgency, and report history without touching the live advisory engine.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Reports', value: filtered.length, icon: FileText, id: 'm-total' },
            { label: 'Unique Clients', value: new Set(filtered.map((r) => r.client)).size, icon: Users, id: 'm-clients' },
            { label: 'Avg Confidence', value: avgConfidence, icon: TrendingUp, id: 'm-conf' },
            {
              label: 'High Urgency',
              value: filtered.filter((r) => r.urgency === 'High' || r.urgency === 'Critical').length,
              icon: AlertCircle,
              id: 'm-urg',
            },
          ].map(({ label, value, icon: Icon, id }) => (
            <div
              key={id}
              onMouseEnter={() => setHoveredCard(id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={cardStyle(id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {label}
                </div>
                <Icon size={14} color="#2563eb" />
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#60a5fa', lineHeight: 1 }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={panel}>
            {kicker('Library Filters')}
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>
              Find the Right Report Fast
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <Search
                  size={12}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search client, challenge, goal…"
                  style={{
                    width: '100%',
                    background: '#0a0f1e',
                    border: '1px solid #1e3a5f',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem 0.5rem 2rem',
                    color: '#e2e8f0',
                    fontSize: '0.78rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                  onBlur={(e) => (e.target.style.borderColor = '#1e3a5f')}
                />
              </div>

              <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} style={selectStyle}>
                <option value="">All Clients</option>
                {clients.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={selectStyle}>
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)} style={selectStyle}>
                <option value="">All Industries</option>
                {industries.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setSearch('');
                  setClientFilter('');
                  setCategoryFilter('');
                  setIndustryFilter('');
                  setSelectedReport(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.5rem 0.875rem',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  background: 'transparent',
                  border: '1px solid #1e3a5f',
                  color: '#94a3b8',
                  transition: 'all 0.2s ease',
                }}
              >
                <X size={12} />
                Clear Filters
              </button>

              <button
                onClick={() => navigate('/advisory')}
                style={{
                  padding: '0.5rem 0.875rem',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  background: '#2563eb',
                  border: '1px solid #2563eb',
                  color: '#fff',
                  transition: 'all 0.2s ease',
                }}
              >
                Generate New Advisory
              </button>
            </div>
          </div>

          <div style={panel}>
            {kicker('Latest Document Signal')}
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>
              Recent Report Snapshot
            </h3>

            {latest ? (
              <div
                onClick={() => openReport(latest)}
                onMouseEnter={() => setHoveredCard('latest')}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ ...cardStyle('latest'), cursor: 'pointer' }}
              >
                <div style={{ fontSize: '0.65rem', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>
                  {latest.reportId}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.5rem' }}>
                  {latest.client}
                </div>
                <p style={{ margin: '0 0 0.875rem', fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.6' }}>
                  {(latest.challenge || latest.summary || '').slice(0, 160)}…
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[latest.industry, latest.category, latest.urgency].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '0.65rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        background: 'rgba(37,99,235,0.12)',
                        color: '#60a5fa',
                        border: '1px solid rgba(37,99,235,0.25)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>No reports match current filters.</div>
            )}
          </div>
        </div>

        {selectedReport && (
          <div style={{ ...panel, marginBottom: '1.5rem' }}>
            {kicker('Selected Report')}

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.45rem', fontSize: '1rem', fontWeight: '800', color: '#e2e8f0' }}>
                  {selectedReport.client}
                </h3>
                <div style={{ fontSize: '0.68rem', color: '#60a5fa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {selectedReport.reportId}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #1e3a5f',
                  background: 'transparent',
                  color: '#94a3b8',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e3a5f', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ fontSize: '0.65rem', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                  Executive Context
                </div>
                <p style={{ margin: '0 0 0.8rem', color: '#cbd5e1', fontSize: '0.8rem', lineHeight: '1.65' }}>
                  {selectedReport.challenge || selectedReport.summary || 'No challenge summary captured for this report.'}
                </p>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.78rem', lineHeight: '1.65' }}>
                  {selectedReport.goal || 'No strategic goal captured for this report.'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { k: 'Industry', v: selectedReport.industry },
                  { k: 'Category', v: selectedReport.category },
                  { k: 'Priority', v: selectedReport.priority },
                  { k: 'Urgency', v: selectedReport.urgency },
                  { k: 'Confidence', v: selectedReport.confidence },
                  { k: 'Date', v: selectedReport.date },
                ].map(({ k, v }) => (
                  <div key={k} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e3a5f', borderRadius: '8px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.6rem', color: '#60a5fa', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {k}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#e2e8f0', fontWeight: '600' }}>{v || '--'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ ...panel, marginBottom: '1.5rem' }}>
          {kicker('Report Cards')}
          <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>
            Saved Advisory Outputs
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {filtered.map((r, i) => (
              <div
                key={`${r.reportId}-card-${i}`}
                onClick={() => openReport(r)}
                onMouseEnter={() => setHoveredCard(`${r.reportId}-card-${i}`)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ ...cardStyle(`${r.reportId}-card-${i}`), cursor: 'pointer' }}
              >
                <div style={{ fontSize: '0.6rem', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>
                  {r.industry}
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '0.5rem' }}>
                  {r.client}
                </div>
                <p style={{ margin: '0 0 0.875rem', fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.6' }}>
                  {(r.challenge || r.summary || '').slice(0, 130)}…
                </p>

                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: '600',
                      padding: '0.12rem 0.45rem',
                      borderRadius: '999px',
                      background: `${urgencyColor[r.urgency] || '#94a3b8'}22`,
                      color: urgencyColor[r.urgency] || '#94a3b8',
                      border: `1px solid ${urgencyColor[r.urgency] || '#94a3b8'}44`,
                    }}
                  >
                    {r.urgency}
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      padding: '0.12rem 0.45rem',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,0.04)',
                      color: '#94a3b8',
                      border: '1px solid #1e3a5f',
                    }}
                  >
                    {r.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                  {[
                    { k: 'Report ID', v: r.reportId },
                    { k: 'Category', v: r.category },
                    { k: 'Project', v: r.project },
                    { k: 'Date', v: r.date },
                  ].map(({ k, v }) => (
                    <div key={k} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e3a5f', borderRadius: '6px', padding: '0.4rem 0.6rem' }}>
                      <div style={{ fontSize: '0.58rem', color: '#94a3b8', marginBottom: '0.15rem' }}>{k}</div>
                      <div style={{ fontSize: '0.68rem', color: '#e2e8f0' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={panel}>
          {kicker('Report Register')}
          <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>
            Structured Report Log
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1e3a5f' }}>
                  {['Client', 'Industry', 'Category', 'Priority', 'Confidence', 'Urgency', 'Date'].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: '0.6rem 0.875rem',
                        textAlign: 'left',
                        color: '#60a5fa',
                        fontWeight: '600',
                        fontSize: '0.68rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={`${r.reportId}-row-${i}`}
                    onClick={() => openReport(r)}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderBottom: '1px solid #1e3a5f',
                      background: hoveredRow === i || selectedReport?.reportId === r.reportId ? 'rgba(37,99,235,0.10)' : 'transparent',
                      transition: 'background 0.15s ease',
                      cursor: 'pointer',
                    }}
                  >
                    <td style={{ padding: '0.75rem 0.875rem', color: '#e2e8f0', fontWeight: '500' }}>{r.client}</td>
                    <td style={{ padding: '0.75rem 0.875rem', color: '#94a3b8' }}>{r.industry}</td>
                    <td style={{ padding: '0.75rem 0.875rem', color: '#94a3b8' }}>{r.category}</td>
                    <td style={{ padding: '0.75rem 0.875rem' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: '600',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '999px',
                          background: `${urgencyColor[r.priority] || '#94a3b8'}22`,
                          color: urgencyColor[r.priority] || '#94a3b8',
                          border: `1px solid ${urgencyColor[r.priority] || '#94a3b8'}44`,
                        }}
                      >
                        {r.priority}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.875rem', color: '#60a5fa', fontWeight: '600' }}>{r.confidence}</td>
                    <td style={{ padding: '0.75rem 0.875rem' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: '600',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '999px',
                          background: `${urgencyColor[r.urgency] || '#94a3b8'}22`,
                          color: urgencyColor[r.urgency] || '#94a3b8',
                          border: `1px solid ${urgencyColor[r.urgency] || '#94a3b8'}44`,
                        }}
                      >
                        {r.urgency}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.875rem', color: '#94a3b8' }}>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </NexusShell>
  );
}
