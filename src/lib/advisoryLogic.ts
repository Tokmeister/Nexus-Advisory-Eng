import type { AdvisoryInput, AdvisoryRecord } from './logic/types';
export type { AdvisoryInput, AdvisoryRecord } from './logic/types';

import { buildReportId, clean, normaliseUrgency, todayString, validateInput } from './logic/helpers';
import { resolveOverlay } from './logic/industryOverlays';
import { classifyProblem } from './logic/problemClassifier';
import { recommendationLibrary } from './logic/recommendationLibrary';
import { buildRoadmap } from './logic/roadmapBuilder';
import {
  buildConfidence,
  buildConsultantNote,
  buildExecutiveSummary,
  buildFocusTags,
  buildIssueStatement,
  buildRiskSummary,
  buildRisks,
  scoreRisk,
} from './logic/textBuilder';

const OUTPUT_STORAGE_KEY = 'nexus_advisory_output_v6';
const REPORTS_HISTORY_KEY = 'nexus_reports_v3';
const REPORT_LOGO_SRC = '/assets/logo-pdf.png';

export function buildAdvisoryOutput(input: AdvisoryInput): AdvisoryRecord {
  const errors = validateInput(input);
  if (errors.length) throw new Error(errors.join('\n'));

  const normalisedUrgency = normaliseUrgency(input.urgency);

  const cleaned: AdvisoryInput = {
    client: clean(input.client),
    industry: clean(input.industry),
    challenge: clean(input.challenge),
    goal: clean(input.goal),
    constraints: clean(input.constraints),
    urgency: normalisedUrgency,
    impactAreas: clean(input.impactAreas),
    financialExposure: clean(input.financialExposure),
    valueType: clean(input.valueType),
    estimatedValue: clean(input.estimatedValue),
    businessFunction: clean(input.businessFunction),
    triggerSource: clean(input.triggerSource),
    notes: clean(input.notes),
  };

  const overlay = resolveOverlay(cleaned.industry);
  const classification = classifyProblem(cleaned);
  const recs = recommendationLibrary(classification.problemType);
  const risk = scoreRisk(cleaned);
  const confidence = buildConfidence(cleaned, classification);
  const reportId = buildReportId(cleaned.client);
  const roadmap = buildRoadmap(classification.problemType, overlay, cleaned.goal);

  const recommendations = Array.from(
    new Set([...recs.quickWins, ...overlay.actionTemplates, ...overlay.recommendationBias].map(clean).filter(Boolean))
  ).slice(0, 4);

  const priorities = Array.from(new Set(recs.priorities.map(clean).filter(Boolean))).slice(0, 4);
  const summary = buildExecutiveSummary(cleaned, classification, overlay);
  const issueStatement = buildIssueStatement(cleaned, classification);
  const risks = buildRisks(cleaned, classification, risk.riskLevel, overlay);
  const focusTags = buildFocusTags(classification, overlay, cleaned);
  const riskSummary = buildRiskSummary(risk.urgencyScore, risk.exposureScore, risk.impactScore, risk.riskLevel);

  const priority =
    normalisedUrgency === 'Critical' || normalisedUrgency === 'High'
      ? 'High'
      : normalisedUrgency === 'Medium'
        ? 'Medium'
        : 'Low';

  const date = todayString();

  return {
    id: reportId,
    reportId,
    client: cleaned.client,
    industry: overlay.label || cleaned.industry,
    category: classification.label,
    priority,
    confidence,
    urgency: normalisedUrgency,
    status: 'Saved',
    date,
    challenge: cleaned.challenge,
    goal: cleaned.goal,
    project: `${cleaned.client} ${classification.label}`,
    summary,
    executiveTitle: `${cleaned.client} — ${classification.label} Strategic Review`,
    executiveText: summary,
    issueStatement,
    riskSummary,
    recommendations,
    priorities,
    risks,
    focusTags,
    roadmap,
    consultantNote: buildConsultantNote(cleaned, classification, overlay),
  };
}

export function saveCurrentOutput(output: AdvisoryRecord) {
  localStorage.setItem(OUTPUT_STORAGE_KEY, JSON.stringify(output));
}

export function loadCurrentOutput(): AdvisoryRecord | null {
  try {
    const raw = localStorage.getItem(OUTPUT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AdvisoryRecord) : null;
  } catch {
    return null;
  }
}

export function loadSavedReports<T extends { reportId: string }>(defaults: T[] = []): T[] {
  try {
    const raw = localStorage.getItem(REPORTS_HISTORY_KEY);
    const saved = raw ? (JSON.parse(raw) as T[]) : [];
    const merged = [...saved, ...defaults].filter(
      (item, index, arr) => arr.findIndex((r) => r.reportId === item.reportId) === index
    );
    return merged;
  } catch {
    return defaults;
  }
}

export function saveReportToHistory(output: AdvisoryRecord) {
  const existing = loadSavedReports<AdvisoryRecord>([]).filter((item) => item.reportId !== output.reportId);
  localStorage.setItem(REPORTS_HISTORY_KEY, JSON.stringify([output, ...existing].slice(0, 50)));
}

export function clearCurrentOutput() {
  localStorage.removeItem(OUTPUT_STORAGE_KEY);
}

function escapeHtml(value: string): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderList(items: string[], className = 'report-list') {
  const safeItems = items.map(clean).filter(Boolean);
  if (!safeItems.length) return `<div class="report-empty">No items captured for this section.</div>`;

  return `<ul class="${className}">${safeItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderTags(items: string[]) {
  const safeItems = items.map(clean).filter(Boolean);
  if (!safeItems.length) return `<div class="report-empty">No focus tags available.</div>`;

  return `<div class="report-tags">${safeItems.map((item) => `<span class="report-tag">${escapeHtml(item)}</span>`).join('')}</div>`;
}

function renderRoadmapPage(
  footerLeft: string,
  footerRight: string,
  sectionNumber: string,
  periodLabel: string,
  title: string,
  items: string[]
): string {
  return `
    <section class="report-page roadmap-page">
      <div class="report-content">
        <section class="report-section roadmap-section">
          <div class="report-section-header">
            <small>${escapeHtml(sectionNumber)}</small>
            <h2>30 / 60 / 90 Day Roadmap</h2>
            <p class="section-subtitle">${escapeHtml(periodLabel)}</p>
          </div>

          <div class="roadmap-card-wide">
            <small>${escapeHtml(periodLabel)}</small>
            <h3>${escapeHtml(title)}</h3>
            ${renderList(items, 'roadmap-list')}
          </div>
        </section>
      </div>
      <div class="page-footer"><div>${footerLeft}</div><div>${footerRight}</div></div>
    </section>
  `;
}

function buildPrintHtml(output: AdvisoryRecord): string {
  const title = escapeHtml(output.executiveTitle || `${output.client} Advisory Report`);
  const logoMarkup = `<img src="${REPORT_LOGO_SRC}" alt="NEXUS logo" class="cover-logo-image" onerror="this.style.display='none'; this.parentNode.innerHTML='&lt;div class=&quot;cover-logo-badge&quot;&gt;NEXUS&lt;/div&gt;';" />`;
  const footerLeft = 'Generated by NEXUS Advisory Engine';
  const footerRight = escapeHtml(output.reportId);

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(output.reportId)}</title>
  <style>
    :root {
      --ink: #14263a;
      --muted: #5f7b98;
      --line: #dde7f0;
      --paper: #f7fafc;
      --panel: #ffffff;
      --brand-900: #102742;
      --brand-800: #173759;
      --tag-bg: #eaf3fb;
      --tag-line: #d0e4f5;
      --tag-ink: #24527a;
      --footer-bottom: 8mm;
      --footer-height: 9mm;
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      background: #edf3f8;
      color: var(--ink);
      font-family: Arial, Helvetica, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      padding: 8mm 0;
    }

    .report-root {
      display: block;
    }

    .report-page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto 8mm auto;
      background: #ffffff;
      color: var(--ink);
      box-shadow: 0 10px 24px rgba(16, 39, 66, 0.08);
      page-break-after: always;
      break-after: page;
      position: relative;
      overflow: visible;
    }

    .report-page:last-child {
      page-break-after: auto;
      break-after: auto;
    }

    .report-cover {
      min-height: 297mm;
      background: linear-gradient(180deg, var(--brand-900) 0%, var(--brand-800) 34%, var(--paper) 34%, var(--paper) 100%);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }

    .cover-top {
      padding: 15mm 16mm 7mm 16mm;
      color: #eef6ff;
      text-align: center;
    }

    .cover-logo {
      width: 35mm;
      height: 35mm;
      margin: 0 auto 6mm auto;
      border-radius: 7mm;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.14);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .cover-logo-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    .cover-logo-badge {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #eef6ff;
    }

    .cover-eyebrow {
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      opacity: 0.84;
      margin-bottom: 4mm;
    }

    .cover-title {
      font-size: 23px;
      font-weight: 700;
      line-height: 1.13;
      margin: 0;
      overflow-wrap: break-word;
    }

    .cover-card-wrap {
      padding: 0 16mm;
      margin-top: 1.5mm;
      position: relative;
      z-index: 2;
    }

    .cover-card {
      background: #ffffff;
      color: var(--ink);
      border-radius: 6mm;
      box-shadow: 0 8px 30px rgba(7, 18, 30, 0.08);
      border: 1px solid rgba(20, 38, 58, 0.08);
      padding: 7mm;
    }

    .cover-meta-grid,
    .score-grid,
    .report-two-col {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 5mm;
    }

    .cover-meta-grid {
      gap: 7mm;
      margin-bottom: 7mm;
    }

    .score-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 3.5mm;
      margin-top: 7mm;
    }

    .meta-block small,
    .cover-card small,
    .report-section-header small,
    .report-box small,
    .roadmap-card-wide small,
    .score-card small {
      display: block;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted);
      margin-bottom: 2mm;
      font-weight: 700;
    }

    .meta-block div {
      font-size: 13.5px;
      font-weight: 600;
      line-height: 1.4;
      overflow-wrap: anywhere;
    }

    .cover-summary-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 3mm;
      color: #1f3b5a;
    }

    .cover-summary-text,
    .report-body-text,
    .report-box p,
    .report-note-box,
    .report-empty {
      font-size: 12px;
      line-height: 1.62;
      color: #324b64;
      hyphens: none;
      word-break: normal;
      overflow-wrap: break-word;
      margin: 0;
    }

    .cover-footer,
    .page-footer {
      position: absolute;
      left: 16mm;
      right: 16mm;
      bottom: var(--footer-bottom);
      min-height: var(--footer-height);
      font-size: 8.8px;
      color: #607a95;
      display: flex;
      justify-content: space-between;
      gap: 8mm;
      align-items: center;
    }

    .cover-footer div,
    .page-footer div {
      max-width: 48%;
      overflow-wrap: anywhere;
      line-height: 1.35;
    }

    .report-content {
      min-height: 297mm;
      padding: 12mm 13mm calc(var(--footer-height) + var(--footer-bottom) + 7mm) 13mm;
      background: var(--paper);
      overflow: visible;
    }

    .report-section {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 5mm;
      padding: 7mm;
      margin: 0 0 5mm 0;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .report-section:last-child {
      margin-bottom: 0;
    }

    .report-section-header {
      margin-bottom: 4mm;
    }

    .report-section-header h2 {
      margin: 0;
      font-size: 19px;
      line-height: 1.2;
      color: var(--brand-900);
    }

    .section-subtitle {
      margin: 2mm 0 0 0;
      font-size: 12px;
      color: var(--muted);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .report-box,
    .score-card,
    .roadmap-card-wide {
      background: #fbfcfe;
      border: 1px solid var(--line);
      border-radius: 4mm;
      padding: 5mm;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .report-box h3,
    .roadmap-card-wide h3 {
      margin: 0 0 3mm 0;
      font-size: 14px;
      line-height: 1.35;
      color: var(--brand-900);
    }

    .score-card .score-value {
      font-size: 20px;
      font-weight: 700;
      color: var(--brand-900);
      line-height: 1;
      margin-bottom: 2mm;
      overflow-wrap: break-word;
    }

    .score-card .score-label {
      font-size: 11px;
      line-height: 1.45;
      color: #617d99;
    }

    .report-list,
    .roadmap-list {
      margin: 0;
      padding-left: 18px;
      color: #31495f;
      font-size: 12px;
      line-height: 1.62;
    }

    .report-list li,
    .roadmap-list li {
      margin-bottom: 2.4mm;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .roadmap-list {
      font-size: 12.3px;
      line-height: 1.72;
    }

    .roadmap-list li {
      margin-bottom: 3mm;
    }

    .report-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 3mm;
    }

    .report-tag {
      background: var(--tag-bg);
      border: 1px solid var(--tag-line);
      color: var(--tag-ink);
      font-size: 9.5px;
      padding: 2.4mm 4mm;
      border-radius: 99px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      line-height: 1.2;
    }

    .report-note-box {
      background: #eef5fb;
      border: 1px solid #d9e6f2;
      border-radius: 4mm;
      padding: 5mm;
      white-space: pre-wrap;
    }

    .report-cta-line {
      display: flex;
      flex-wrap: wrap;
      gap: 3mm;
      margin-top: 4mm;
    }

    .report-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 24mm;
      padding: 2.4mm 4mm;
      border-radius: 99px;
      border: 1px solid var(--tag-line);
      background: #f5f9fd;
      color: var(--brand-900);
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-weight: 700;
    }

    .roadmap-page .report-content {
      padding-top: 13mm;
    }

    .roadmap-section {
      min-height: 245mm;
      display: flex;
      flex-direction: column;
    }

    .roadmap-card-wide {
      flex: 1;
    }

    @page {
      size: A4;
      margin: 0;
    }

    @media print {
      html,
      body {
        width: 210mm;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }

      body {
        padding: 0 !important;
      }

      .report-page {
        margin: 0 !important;
        box-shadow: none !important;
      }

      .report-section,
      .report-box,
      .roadmap-card-wide,
      .report-note-box,
      .report-list,
      .roadmap-list,
      .report-two-col {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="report-root">
    <section class="report-page report-cover">
      <div class="cover-top">
        <div class="cover-logo">${logoMarkup}</div>
        <div class="cover-eyebrow">NEXUS Advisory Intelligence Platform</div>
        <div class="cover-title">${title}</div>
      </div>

      <div class="cover-card-wrap">
        <div class="cover-card">
          <div class="cover-meta-grid">
            <div class="meta-block">
              <small>Report ID</small>
              <div>${escapeHtml(output.reportId)}</div>
            </div>
            <div class="meta-block">
              <small>Date</small>
              <div>${escapeHtml(output.date)}</div>
            </div>
            <div class="meta-block">
              <small>Client</small>
              <div>${escapeHtml(output.client)}</div>
            </div>
            <div class="meta-block">
              <small>Industry</small>
              <div>${escapeHtml(output.industry)}</div>
            </div>
          </div>

          <div class="cover-summary-title">Executive framing</div>
          <p class="cover-summary-text">${escapeHtml(output.executiveText || output.summary)}</p>

          <div class="score-grid">
            <div class="score-card">
              <small>Priority</small>
              <div class="score-value">${escapeHtml(output.priority)}</div>
              <div class="score-label">Execution priority rating</div>
            </div>
            <div class="score-card">
              <small>Confidence</small>
              <div class="score-value">${escapeHtml(output.confidence)}</div>
              <div class="score-label">Advisory confidence score</div>
            </div>
            <div class="score-card">
              <small>Urgency</small>
              <div class="score-value">${escapeHtml(output.urgency)}</div>
              <div class="score-label">Urgency level signalled</div>
            </div>
            <div class="score-card">
              <small>Category</small>
              <div class="score-value" style="font-size:13.5px; line-height:1.25;">${escapeHtml(output.category)}</div>
              <div class="score-label">Primary advisory classification</div>
            </div>
          </div>
        </div>
      </div>

      <div class="cover-footer">
        <div>${footerLeft}</div>
        <div>${footerRight}</div>
      </div>
    </section>

    <section class="report-page">
      <div class="report-content">
        <section class="report-section">
          <div class="report-section-header">
            <small>Section 1</small>
            <h2>Issue Statement</h2>
          </div>
          <p class="report-body-text">${escapeHtml(output.issueStatement)}</p>
        </section>

        <section class="report-section">
          <div class="report-section-header">
            <small>Section 2</small>
            <h2>Risk Summary</h2>
          </div>
          ${renderList(output.riskSummary)}
        </section>

        <section class="report-section">
          <div class="report-section-header">
            <small>Section 3</small>
            <h2>Strategic Recommendations</h2>
          </div>
          <div class="report-two-col">
            <div class="report-box">
              <small>Recommended moves</small>
              <h3>Immediate interventions</h3>
              ${renderList(output.recommendations)}
            </div>
            <div class="report-box">
              <small>Execution emphasis</small>
              <h3>Priority agenda</h3>
              ${renderList(output.priorities)}
            </div>
          </div>
        </section>
      </div>
      <div class="page-footer"><div>${footerLeft}</div><div>${footerRight}</div></div>
    </section>

    <section class="report-page">
      <div class="report-content">
        <section class="report-section">
          <div class="report-section-header">
            <small>Section 4</small>
            <h2>Focus Tags</h2>
          </div>
          ${renderTags(output.focusTags)}
          <div class="report-cta-line">
            <span class="report-pill">${escapeHtml(output.priority)} priority</span>
            <span class="report-pill">${escapeHtml(output.urgency)} urgency</span>
            <span class="report-pill">${escapeHtml(output.confidence)} confidence</span>
          </div>
        </section>

        <section class="report-section">
          <div class="report-section-header">
            <small>Section 5</small>
            <h2>Execution Risks</h2>
          </div>
          ${renderList(output.risks)}
        </section>
      </div>
      <div class="page-footer"><div>${footerLeft}</div><div>${footerRight}</div></div>
    </section>

    ${renderRoadmapPage(
      footerLeft,
      footerRight,
      'Section 6A',
      'First 30 days',
      output.roadmap.day30Title,
      output.roadmap.day30
    )}

    ${renderRoadmapPage(
      footerLeft,
      footerRight,
      'Section 6B',
      'Day 31 to 60',
      output.roadmap.day60Title,
      output.roadmap.day60
    )}

    ${renderRoadmapPage(
      footerLeft,
      footerRight,
      'Section 6C',
      'Day 61 to 90',
      output.roadmap.day90Title,
      output.roadmap.day90
    )}

    <section class="report-page">
      <div class="report-content">
        <section class="report-section">
          <div class="report-section-header">
            <small>Section 7</small>
            <h2>Consultant Note</h2>
          </div>
          <div class="report-note-box">${escapeHtml(output.consultantNote)}</div>
        </section>
      </div>
      <div class="page-footer"><div>${footerLeft}</div><div>${footerRight}</div></div>
    </section>
  </div>

  <script>
    window.addEventListener('load', function () {
      setTimeout(function () {
        window.focus();
        window.print();
      }, 350);
    });
  <\/script>
</body>
</html>`;
}

export function openPrintView(output: AdvisoryRecord) {
  const win = window.open('', '_blank', 'width=1120,height=920');
  if (!win) return;

  const html = buildPrintHtml(output);
  win.document.open();
  win.document.write(html);
  win.document.close();
}
