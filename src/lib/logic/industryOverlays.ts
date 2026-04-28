import type { OverlayConfig } from './types';
import { clean } from './helpers';

const makeRoadmap = (
  day30Title: string,
  day60Title: string,
  day90Title: string,
  day30: string[],
  day60: string[],
  day90: string[]
) => ({
  day30Title,
  day60Title,
  day90Title,
  day30,
  day60,
  day90,
});

export const PROFESSIONAL_SERVICES_OVERLAY: OverlayConfig = {
  key: 'professional_services',
  label: 'Professional Services',
  keywords: [
    'consulting',
    'consultant',
    'professional services',
    'advisory',
    'proposal',
    'proposals',
    'billable',
    'billable hours',
    'utilisation',
    'utilization',
    'retainer',
    'client delivery',
    'engagement',
    'fee leakage',
    'turnaround time',
    'service consistency',
    'capacity planning',
    'client economics',
  ],
  narrative:
    'Professional services create enduring competitive advantage through disciplined commercial positioning, high-conversion proposal execution, rigorous utilisation governance, and uncompromising focus on client economics and delivery excellence.',
  recommendationBias: [
    'Implement enterprise-grade governance to align utilisation, pricing discipline, and delivery capacity with margin protection.',
    'Elevate proposal-to-close conversion and scope integrity as strategic levers for profitable growth.',
    'Establish delivery accountability frameworks that safeguard quality, turnaround, and client value realisation.',
  ],
  actionTemplates: [
    'Conduct a full-funnel diagnostic of commercial leakage across the pipeline, pricing, scoping, and utilisation.',
    'Strengthen executive oversight on proposal governance, client engagement cadence, and economic performance.',
    'Drive delivery excellence through standardised accountability, escalation protocols, and client outcome tracking.',
  ],
  riskHints: [
    'Fee leakage often materialises through weak scoping, inconsistent pricing, or eroded utilisation discipline.',
    'Sub-optimal utilisation compounds silently but directly erodes EBITDA and partner margins.',
    'Delivery inconsistency undermines client trust, repeat business, and future proposal win rates.',
  ],
  focusTags: ['Utilisation Governance', 'Proposal Conversion', 'Delivery Excellence', 'Client Economics'],
  roadmapBias: makeRoadmap(
    'Commercial Engine Diagnostic',
    'Execution Stabilisation',
    'Scalable Operating Model',
    [
      'Map end-to-end commercial flow from pipeline quality through proposal conversion, pricing discipline, and retainer economics.',
      'Quantify highest-value leakage points in scoping, pricing, and billable utilisation with executive visibility.',
      'Translate the client mandate into a prioritised 90-day commercial and delivery intervention plan.',
    ],
    [
      'Institute weekly executive dashboards on utilisation, proposal status, turnaround performance, and delivery slippage.',
      'Clarify cross-functional ownership between sales, solutioning, delivery, and account leadership.',
      'Enforce service standards and escalation protocols where delivery or client experience risk is material.',
    ],
    [
      'Embed repeatable operating rhythms for pipeline health, utilisation governance, and delivery performance.',
      'Standardise pricing, scoping, and proposal governance across all new engagements.',
      'Position client economics and delivery excellence as the primary steering metrics for sustainable growth.',
    ]
  ),
};

export const INDUSTRY_OVERLAYS: Record<string, OverlayConfig> = {
  manufacturing: {
    key: 'manufacturing',
    label: 'Manufacturing',
    keywords: [
      'manufacturing',
      'factory',
      'production',
      'oee',
      'throughput',
      'scrap',
      'quality',
      'line speed',
      'downtime',
      'inventory',
      'bom',
      'routing',
      'changeover',
    ],
    narrative:
      'Manufacturing advantage is created when leadership can separate portfolio-level product margin erosion from commercial leakage, schedule instability, quality-control failure, and asset-productivity loss across the full operating system.',
    recommendationBias: [
      'Treat product margin protection as a waterfall across strategic mix, commercial leakage, material variance, labour absorption, rework, and process loss.',
      'Separate planning and schedule instability from true shop-floor execution loss so leadership attacks the right constraint first.',
      'Use quality-system integrity, OEE discipline, inventory efficiency, and product-complexity visibility as linked executive control levers.',
    ],
    actionTemplates: [
      'Build a margin-leakage waterfall by product family, customer, plant, and cause to expose strategic, commercial, and operational erosion.',
      'Map schedule instability from MPS, MRP, capacity planning, setup loss, supplier variability, and dispatch bottlenecks.',
      'Stress-test BOM accuracy, routing discipline, first-pass yield, COPQ, OEE, inventory health, and line/shift variability.',
    ],
    riskHints: [
      'Weak product-mix and pricing decisions can lock plants into volume without adequate contribution margin.',
      'Schedule instability, changeover loss, and supplier variability compound delivery failure and working-capital pressure together.',
      'Poor BOM, routing, and process-control discipline turns quality loss into hidden margin destruction.',
    ],
    focusTags: ['Product Margin Protection', 'Schedule Adherence', 'Quality & Specification Control', 'Asset Productivity'],
    roadmapBias: makeRoadmap(
      'Margin & Flow Diagnostic',
      'Control Recovery',
      'Disciplined Manufacturing System',
      [
        'Separate executive, commercial, and operational sources of margin erosion across products, customers, and plants.',
        'Create one leadership view of schedule adherence, quality cost, OEE, inventory health, and complexity load.',
        'Quantify the highest-value leakage pools across changeovers, process loss, rework, and working capital.',
      ],
      [
        'Tighten planning discipline, quality control, and asset recovery on the lines and product families carrying the greatest value at risk.',
        'Intervene on BOM, routing, supplier, and schedule-control failures with explicit owner accountability.',
        'Link plant-level execution recovery to financial impact, not just operational activity.',
      ],
      [
        'Embed a manufacturing operating model that links product economics, schedule reliability, quality performance, OEE, and inventory control.',
        'Standardise review rhythms across plants, lines, and product families where the network model requires it.',
        'Position disciplined manufacturing control as the basis of durable margin quality and delivery reliability.',
      ]
    ),
  },

  printing_packaging: {
    key: 'printing_packaging',
    label: 'Printing & Packaging',
    keywords: [
      'printing',
      'packaging',
      'press',
      'prepress',
      'finishing',
      'specification',
      'rerun',
      'setup time',
      'changeover',
      'waste',
      'artwork',
      'proof',
      'job ticket',
      'queue',
      'dispatch',
    ],
    narrative:
      'In printing and packaging, sustainable advantage is created when leadership can separate executive margin leakage from shop-floor waste, control planning and scheduling loss, harden specification integrity, and balance capacity across presses, finishing lines, and sites.',
    recommendationBias: [
      'Treat margin leakage as a structured waterfall across reruns, make-ready loss, spoilage, queue delay, finishing bottlenecks, and absorbed customer changes.',
      'Separate executive waste, planning-induced waste, specification failure, and shop-floor execution loss so accountability sits at the correct level.',
      'Use capacity balance, right-first-time execution, and turnaround control as leadership levers for profitable growth.',
    ],
    actionTemplates: [
      'Build a margin-leakage waterfall by job, press, finishing line, customer, and site to expose the biggest avoidable losses.',
      'Map the end-to-end flow from order intake to dispatch to isolate queue time, sequencing loss, and handoff failure.',
      'Harden specification, artwork, proofing, approval, and version-control gates before work reaches press.',
    ],
    riskHints: [
      'Absorbed customer changes, weak quoting discipline, and poor product mix can destroy margin before work even reaches the floor.',
      'Queue loss, rush-job disruption, and finishing bottlenecks erode turnaround performance and hidden capacity simultaneously.',
      'Weak specification integrity drives reruns, disputes, and avoidable client trust damage.',
    ],
    focusTags: ['Margin Leakage Waterfall', 'Planning & Scheduling', 'Specification Integrity', 'Capacity Balance'],
    roadmapBias: makeRoadmap(
      'Margin & Flow Diagnostic',
      'Control Recovery',
      'Disciplined Print Operating Model',
      [
        'Separate executive waste, planning-induced waste, and shop-floor loss with quantified financial impact.',
        'Measure gross vs net productive utilisation, schedule attainment, and bottlenecks across press and finishing.',
        'Create one executive view of reruns, spoilage, queue loss, turnaround performance, and customer-change cost.',
      ],
      [
        'Install owner-led control on the biggest waste pools, scheduling failures, and specification breakdowns.',
        'Stabilise planning, sequencing, and release discipline across order intake, pre-press, production, and dispatch.',
        'Tighten change-control, proofing, and approval governance before jobs consume productive capacity.',
      ],
      [
        'Embed margin-protection rhythms that connect job economics, asset productivity, and client delivery performance.',
        'Institutionalise cross-site capacity balancing and standardised specification control where the operating model requires it.',
        'Position right-first-time execution and disciplined turnaround as the commercial differentiator of the business.',
      ]
    ),
  },

  construction: {
    key: 'construction',
    label: 'Construction',
    keywords: [
      'construction',
      'project',
      'variation',
      'claim',
      'site',
      'programme',
      'schedule',
      'cash flow',
      'boq',
      'certification',
      'retention',
      'subcontractor',
    ],
    narrative:
      'Construction value is protected when leadership can distinguish portfolio-level margin erosion from project-commercial leakage, site execution risk, programme slippage, and cash exposure across the full contract lifecycle.',
    recommendationBias: [
      'Separate tender risk, contract administration, claim recovery, and site productivity so commercial leakage is not hidden inside operational noise.',
      'Treat schedule control, subcontractor coordination, and certification discipline as linked drivers of both margin and liquidity.',
      'Use portfolio-level visibility to distinguish systemic group issues from isolated project execution failure.',
    ],
    actionTemplates: [
      'Build a portfolio exposure view covering tender risk, project margin at risk, schedule slippage, disputed claims, and cash peaks/troughs.',
      'Stress-test contract administration discipline, notice compliance, claim substantiation, and certification lag on the most exposed projects.',
      'Map site productivity loss, subcontractor coordination failures, and critical-path disruption on at-risk jobs.',
    ],
    riskHints: [
      'Win-at-all-costs tendering, weak contract administration, and late claims recovery can erode margin long before site teams can respond.',
      'Programme slippage and subcontractor interface failure compound delivery risk and project cash exposure simultaneously.',
      'Delayed certification, retention pressure, and unresolved final accounts can trap working capital even on projects that appear operationally healthy.',
    ],
    focusTags: ['Portfolio Margin Control', 'Commercial Leakage', 'Programme Discipline', 'Cash Exposure'],
    roadmapBias: makeRoadmap(
      'Portfolio Exposure Diagnostic',
      'Commercial & Site Control',
      'Predictable Portfolio Delivery',
      [
        'Separate portfolio-level tender and client risk from project-level commercial leakage and site execution failure.',
        'Quantify unrecovered variations, schedule slippage, certification lag, and current forecast margin pressure across live work.',
        'Create one executive dashboard for margin at risk, claim recovery, programme status, and project cash exposure.',
      ],
      [
        'Tighten contract administration, notice compliance, claim governance, and weekly project-commercial review cadence.',
        'Intervene on the most exposed site productivity, subcontractor coordination, and milestone control failures.',
        'Escalate certification, billing, and collection blockages with explicit owner accountability.',
      ],
      [
        'Embed repeatable portfolio governance that links tender discipline, project execution, commercial recovery, and liquidity control.',
        'Standardise project and commercial review rhythms across regions, business units, or project clusters.',
        'Position predictable, margin-accretive delivery and disciplined cash conversion as the operating standard of the business.',
      ]
    ),
  },

  agriculture: {
    key: 'agriculture',
    label: 'Agriculture',
    keywords: [
      'agriculture',
      'yield',
      'hectare',
      'crop',
      'weather',
      'farm',
      'input cost',
      'harvest',
      'irrigation',
      'livestock',
    ],
    narrative:
      'Agricultural performance improves when leadership separates portfolio-level enterprise mix and margin choices from farm-level yield execution, layered biological and market risk, and seasonal cash-cycle exposure across the full production and realisation cycle.',
    recommendationBias: [
      'Treat gross margin per hectare or per animal as a layered outcome driven by yield realisation, price recovery, input efficiency, and seasonal cash timing.',
      'Separate controllable operational yield drag from external weather and biological volatility so mitigation is aimed at the true source of risk.',
      'Use enterprise mix, hedging, working-capital discipline, and operational timeliness as linked executive control levers.',
    ],
    actionTemplates: [
      'Build a seasonal margin and yield-gap view by crop, enterprise, region, and farm to distinguish controllable loss from external drag.',
      'Map operational timing, labour and machinery productivity, post-harvest loss, storage, and realisation bottlenecks across the cycle.',
      'Stress-test weather, biological, market, and cash-cycle risk together with funding headroom and insurance recovery logic.',
    ],
    riskHints: [
      'Yield under-performance can be driven by pre-season strategic choices, farm-execution timing, or external weather drag, and these should not be treated as one issue.',
      'Margin leakage often hides in price realisation variance, harvest/storage loss, input inefficiency, and poorly timed cash deployment.',
      'Weak hedging, insurance, and off-take discipline can convert a manageable production issue into a severe cash-flow problem.',
    ],
    focusTags: ['Yield Performance', 'Margin per Hectare / Animal', 'Risk Layering', 'Seasonal Cash Exposure'],
    roadmapBias: makeRoadmap(
      'Yield, Margin & Risk Diagnostic',
      'Control Recovery',
      'Disciplined Agricultural Operating Model',
      [
        'Separate yield drag, margin leakage, risk exposure, and cash-cycle pressure by farm, crop, or enterprise.',
        'Build one executive view of potential vs achieved yield, gross margin, risk layers, and funding exposure.',
        'Quantify the highest-value leakage pools across timing, input efficiency, harvest loss, storage, and price realisation.',
      ],
      [
        'Intervene on the farms, enterprises, and operating windows carrying the greatest value at risk.',
        'Tighten planning, risk mitigation, off-take discipline, and working-capital control with explicit owner accountability.',
        'Link field-level execution and seasonal decisions directly to margin and liquidity outcomes.',
      ],
      [
        'Embed an agricultural operating model that links yield, margin, risk, and cash as one leadership system.',
        'Standardise seasonal review rhythms across farms, enterprises, or climatic zones where the portfolio model requires it.',
        'Position disciplined agricultural control as the basis of resilient and scalable value creation.',
      ]
    ),
  },

  healthcare: {
    key: 'healthcare',
    label: 'Medical/Health Care',
    keywords: [
      'medical',
      'health',
      'healthcare',
      'patient',
      'clinical',
      'practice',
      'clinic',
      'hospital',
      'doctor',
      'nurse',
      'specialist',
      'pharmacy',
      'claims',
      'billing',
      'medical aid',
      'compliance',
      'patient administration',
      'appointment',
    ],
    narrative:
      'Healthcare performance strengthens when leadership balances patient care quality, clinical governance, operational flow, revenue-cycle discipline, and practical management visibility across the specific care setting being served.',
    recommendationBias: [
      'Separate patient-care quality, administrative workflow, revenue-cycle leakage, compliance exposure, and capacity utilisation so the right control system is improved first.',
      'Treat patient experience, documentation quality, appointment utilisation, claims discipline, and cash conversion as linked healthcare operating levers.',
      'Adapt the advisory response to the care setting, distinguishing private practices, clinics, hospitals, pharmacies, suppliers, and healthcare administration environments.',
    ],
    actionTemplates: [
      'Build one leadership view of patient flow, service quality, revenue-cycle performance, documentation completeness, and operating constraints.',
      'Map the end-to-end patient, claim, stock, or service workflow to identify where administrative friction, clinical handoff failure, or cash leakage is occurring.',
      'Strengthen role accountability across clinical staff, front-office administration, finance, stock control, compliance, and management reporting.',
    ],
    riskHints: [
      'Weak administrative workflow can pull clinical professionals into avoidable friction and reduce care capacity.',
      'Delayed claims, incomplete documentation, and poor billing follow-up can damage cash flow even when patient demand is healthy.',
      'Healthcare operating failure can erode patient trust, staff morale, compliance control, and economic performance at the same time.',
    ],
    focusTags: [
      'Patient Administration',
      'Clinical Governance',
      'Revenue Cycle Control',
      'Practice / Facility Operations',
      'Compliance Visibility',
    ],
    roadmapBias: makeRoadmap(
      'Healthcare Operating Diagnostic',
      'Workflow & Control Recovery',
      'Disciplined Care Operating Model',
      [
        'Separate patient-care quality, administrative workflow, revenue-cycle leakage, compliance exposure, and management visibility across the specific healthcare setting.',
        'Create one leadership view of patient flow, appointment utilisation, claims status, billing follow-up, documentation completeness, and operating risk.',
        'Quantify the highest-value leakage points across patient administration, claims, stock, staff workload, compliance, and cash conversion.',
      ],
      [
        'Tighten scheduling, documentation, billing, claims follow-up, stock control, and role accountability where operating friction is highest.',
        'Intervene on the workflows creating the greatest risk to patient experience, cash conversion, staff workload, or compliance control.',
        'Introduce weekly operating reviews that connect care quality, workflow discipline, revenue-cycle control, and management action.',
      ],
      [
        'Embed a healthcare operating model that links patient experience, workflow reliability, revenue-cycle discipline, compliance, and management reporting.',
        'Standardise review rhythms across practices, clinics, departments, sites, or service lines according to the client’s operating model.',
        'Position disciplined healthcare operations as the basis for better care, stronger trust, better cash flow, and sustainable capacity.',
      ]
    ),
  },

  energy: {
    key: 'energy',
    label: 'Energy',
    keywords: [
      'energy',
      'solar',
      'wind',
      'renewable',
      'ppa',
      'grid',
      'turbine',
      'module',
      'battery',
      'commissioning',
    ],
    narrative:
      'Energy value is protected when leadership can separate portfolio-level project economics from schedule and commissioning risk, contractual leakage, and funding exposure across the development, construction, and operations lifecycle of renewable assets.',
    recommendationBias: [
      'Treat IRR realisation as a layered outcome driven by resource quality, curtailment, equipment performance, contract structure, and construction-to-operation cash discipline.',
      'Separate development and permitting delay, EPC execution risk, commissioning slippage, and grid-connection dependency so the real critical path becomes visible.',
      'Use PPA quality, yield assurance, O&M effectiveness, and funding control as linked executive levers across the portfolio.',
    ],
    actionTemplates: [
      'Build a project-margin and IRR-at-risk view by asset, technology, region, and lifecycle stage.',
      'Map schedule slippage from permitting, grid connection, EPC execution, weather windows, and commissioning handover gaps.',
      'Stress-test claims recovery, PPA performance, curtailment exposure, O&M cost control, and funding headroom on the most exposed projects.',
    ],
    riskHints: [
      'Weak resource assumptions, curtailment, degradation, and O&M overruns can erode project economics long after financial close.',
      'Grid-connection and commissioning delay can destroy schedule certainty and push funding needs beyond plan.',
      'Poor contractual recovery and weak payment-security structures can turn technically viable assets into cash-flow stress cases.',
    ],
    focusTags: ['IRR Realisation', 'Schedule & Commissioning', 'Contractual Performance', 'Funding Exposure'],
    roadmapBias: makeRoadmap(
      'Economics, Delay & Cash Diagnostic',
      'Control Recovery',
      'Disciplined Energy Portfolio Model',
      [
        'Separate project economics, delivery risk, contractual leakage, and funding exposure across the portfolio.',
        'Create one executive view of IRR at risk, schedule slippage, curtailment, claims status, and cash headroom.',
        'Quantify the highest-value leakage pools across yield under-performance, grid delay, claims weakness, and construction-phase funding pressure.',
      ],
      [
        'Intervene on the projects and assets carrying the greatest economic, schedule, and funding risk.',
        'Tighten governance over EPC performance, grid interface, claims recovery, and payment-security discipline with explicit owner accountability.',
        'Link project-level recovery directly to portfolio economics and liquidity outcomes.',
      ],
      [
        'Embed an energy operating model that links project economics, delivery control, contractual performance, and long-term asset cash generation.',
        'Standardise review rhythms across technologies, regions, and lifecycle stages where the portfolio requires it.',
        'Position disciplined energy-portfolio control as the basis of durable return realisation.',
      ]
    ),
  },

  general: {
    key: 'general',
    label: 'General Business',
    keywords: [],
    narrative:
      'The advisory response must translate the stated challenge into a high-impact, owner-led execution plan that delivers measurable strategic and financial outcomes.',
    recommendationBias: [],
    actionTemplates: [],
    riskHints: [],
    focusTags: [],
    roadmapBias: makeRoadmap('Rapid Diagnostic & Containment', 'Execution Stabilisation', 'Institutionalised Discipline', [], [], []),
  },
};

export function resolveOverlayKey(industry: string): string {
  const industryClean = clean(industry).toLowerCase();

  const industryKeyMap: Record<string, string> = {
    'professional services': 'professional_services',
    manufacturing: 'manufacturing',
    'printing/packaging': 'printing_packaging',
    'printing & packaging': 'printing_packaging',
    construction: 'construction',
    agriculture: 'agriculture',
    'medical/health care': 'healthcare',
    'medical / health care': 'healthcare',
    healthcare: 'healthcare',
    health: 'healthcare',
    medical: 'healthcare',
    energy: 'energy',
  };

  for (const [pattern, key] of Object.entries(industryKeyMap)) {
    if (industryClean.includes(pattern)) return key;
  }

  return 'general';
}

export function resolveOverlay(industry: string): OverlayConfig {
  const key = resolveOverlayKey(industry);
  if (key === 'professional_services') return PROFESSIONAL_SERVICES_OVERLAY;
  return INDUSTRY_OVERLAYS[key] || INDUSTRY_OVERLAYS.general;
}
