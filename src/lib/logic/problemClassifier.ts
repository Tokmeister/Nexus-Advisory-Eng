import { clean, keywordScoreByField, normaliseUrgency } from './helpers';
import { resolveOverlayKey } from './industryOverlays';
import type { AdvisoryInput, ClassificationResult } from './types';

type Rule = {
  type: string;
  label: string;
  tags: string[];
  keywords: string[];
  executiveTheme?: string;
};

const GENERIC_RULES: Rule[] = [
  { type: 'margin_leakage', label: 'Margin Integrity & Profit Recovery', tags: ['profitability', 'cost control', 'commercial discipline'], keywords: ['margin', 'leakage', 'profit', 'pricing', 'cost creep', 'waste', 'shrinkage', 'fee leakage'] },
  { type: 'workflow_breakdown', label: 'Workflow & Execution Integrity', tags: ['process', 'execution', 'handoff'], keywords: ['delay', 'handoff', 'workflow', 'bottleneck', 'backlog', 'slow turnaround', 'turnaround'] },
  { type: 'planning_failure', label: 'Strategic Planning & Alignment', tags: ['planning', 'forecasting', 'coordination'], keywords: ['plan', 'planning', 'forecast', 'schedule', 'misalignment', 'capacity'] },
  { type: 'capacity_constraint', label: 'Capacity & Throughput Optimisation', tags: ['capacity', 'throughput', 'resources'], keywords: ['capacity', 'throughput', 'downtime', 'availability', 'resource shortage', 'utilisation', 'utilization'] },
  { type: 'compliance_risk', label: 'Compliance & Governance Exposure', tags: ['compliance', 'governance', 'controls'], keywords: ['compliance', 'audit', 'regulatory', 'non-compliance', 'safety', 'governance'] },
  { type: 'service_quality_risk', label: 'Service Quality & Client Experience', tags: ['quality', 'customer', 'delivery'], keywords: ['quality', 'service failure', 'customer complaint', 'rework', 'late delivery', 'service consistency'] },
  { type: 'cash_flow_stress', label: 'Cash Flow & Working Capital', tags: ['cash flow', 'working capital', 'liquidity'], keywords: ['cash flow', 'liquidity', 'working capital', 'debtors', 'creditors', 'funding'] },
];

const INDUSTRY_RULES: Record<string, Rule[]> = {
  professional_services: [
    { type: 'ps_conversion_delivery', label: 'Commercial Conversion & Delivery Discipline', tags: ['commercial conversion', 'service delivery', 'utilisation governance'], keywords: ['proposal conversion', 'proposal', 'proposal management', 'client delivery', 'delivery discipline', 'turnaround', 'service consistency', 'scope discipline'], executiveTheme: 'Scale Readiness' },
    { type: 'ps_utilisation_economics', label: 'Utilisation & Client Economics', tags: ['utilisation governance', 'client economics', 'profitability'], keywords: ['utilisation', 'utilization', 'billable', 'billable hours', 'service profitability', 'account-level economics', 'retainer', 'fee leakage'], executiveTheme: 'Margin Quality' },
    { type: 'ps_operating_model', label: 'Operating Model & Accountability', tags: ['operating model', 'leadership alignment', 'accountability'], keywords: ['operating model', 'role ownership', 'account management', 'leadership visibility', 'governance'], executiveTheme: 'Execution Control' },
  ],
  printing_packaging: [
    { type: 'pp_executive_margin_leakage', label: 'Executive Margin Leakage & Portfolio Mix', tags: ['executive visibility', 'portfolio mix', 'quoting discipline'], keywords: ['group', 'portfolio', 'multi-site', 'multisite', 'multiple sites', 'plants', 'plant mix', 'product mix', 'customer segmentation', 'segment strategy', 'under-pricing', 'underpricing', 'wrong work', 'filler work', 'over-capacity', 'overcapacity', 'quoting discipline', 'unprofitable work'], executiveTheme: 'Executive Margin Control' },
    { type: 'pp_operational_waste_rework', label: 'Operational Waste, Rework & Spoilage Control', tags: ['waste elimination', 'rework control', 'shop-floor discipline'], keywords: ['waste', 'rework', 'rerun', 'scrap', 'spoilage', 'make-ready waste', 'running spoilage', 'finishing waste', 'handling damage', 'post-press waste', 'spoiled'], executiveTheme: 'Gross Margin Protection' },
    { type: 'pp_planning_turnaround_control', label: 'Planning, Scheduling & Turnaround Control', tags: ['planning discipline', 'turnaround velocity', 'queue control'], keywords: ['turnaround', 'late delivery', 'scheduling', 'schedule', 'job flow', 'queue', 'planning board', 'sequencing', 'changeover frequency', 'rush jobs', 'starvation', 'overload', 'dispatch delay', 'otif'], executiveTheme: 'Operational Agility' },
    { type: 'pp_specification_change_control', label: 'Specification Integrity & Change Control', tags: ['specification control', 'change governance', 'approval discipline'], keywords: ['specification', 'artwork', 'proof', 'change control', 'client approval', 'version control', 'job ticket', 'misinterpretation', 'transcription error', 'wrong artwork', 'wrong die', 'wrong stock', 'late customer changes', 'incomplete brief'], executiveTheme: 'Right-First-Time Delivery' },
    { type: 'pp_capacity_bottleneck_balance', label: 'Press Utilisation, Bottlenecks & Capacity Balance', tags: ['press utilisation', 'bottleneck control', 'capacity balance'], keywords: ['press', 'finishing', 'setup time', 'changeover', 'make ready', 'capacity utilisation', 'oee', 'net productive utilisation', 'gross utilisation', 'schedule attainment', 'bottleneck', 'guillotine', 'folder', 'gluer', 'die-cutter', 'idle press'], executiveTheme: 'Capacity Efficiency' },
  ],
  manufacturing: [
    { type: 'mfg_product_margin_protection', label: 'Product Margin Protection & Portfolio Mix', tags: ['product margin protection', 'portfolio mix', 'commercial discipline'], keywords: ['product mix', 'channel mix', 'unprofitable key accounts', 'pricing discipline', 'under-recovery', 'under recovery', 'landed cost', 'make-vs-buy', 'make vs buy', 'discount leakage', 'rebate', 'margin contribution', 'standard cost drift'], executiveTheme: 'Margin Discipline' },
    { type: 'mfg_schedule_delivery_velocity', label: 'Schedule Adherence & Delivery Velocity', tags: ['schedule adherence', 'delivery velocity', 'planning discipline'], keywords: ['master production schedule', 'mps', 'mrp', 'bullwhip', 'finite loading', 'capacity planning', 'expediting', 'changeover', 'setup', 'cycle time variance', 'bottleneck', 'otif', 'dispatch bottleneck', 'delivery velocity'], executiveTheme: 'Flow Reliability' },
    { type: 'mfg_quality_specification_control', label: 'Quality, Specification & Process Control', tags: ['quality systems', 'specification control', 'process discipline'], keywords: ['engineering change', 'engineering change order', 'technical data package', 'bom', 'bill of materials', 'routing', 'work instruction', 'tolerance', 'calibration', 'gauge control', 'first-pass yield', 'first pass yield', 'copq', 'non-conformance', 'rcca', 'defect pareto'], executiveTheme: 'Right-First-Time Control' },
    { type: 'mfg_asset_oee_capacity', label: 'Asset Utilisation, OEE & Capacity Balance', tags: ['oee', 'asset utilisation', 'capacity balance'], keywords: ['oee', 'availability', 'performance', 'quality rate', 'unplanned downtime', 'planned downtime', 'minor stoppages', 'idling', 'ideal cycle time', 'changeover time', 'waiting', 'starvation', 'capacity balancing', 'technology transfer', 'flexible cells', 'automation'], executiveTheme: 'Asset Productivity' },
  ],
  construction: [
    { type: 'con_portfolio_margin_erosion', label: 'Portfolio Margin Erosion & Tender Risk', tags: ['portfolio visibility', 'tender risk', 'project selection'], keywords: ['group', 'holdings', 'portfolio', 'under-bidding', 'underbidding', 'tender risk', 'project selection', 'client segmentation', 'over-commitment', 'overcommitment', 'central overhead', 'margin erosion', 'wrong projects'], executiveTheme: 'Portfolio Margin Control' },
    { type: 'con_commercial_leakage_claims', label: 'Commercial Leakage, Variations & Claims', tags: ['commercial leakage', 'variation control', 'contract administration'], keywords: ['variation', 'claim', 'change order', 'site instruction', 'client approval', 'contract administration', 'time-bar', 'time bar', 'missed notices', 'late notification', 'boq', 'bill of quantities', 'estimate drift', 'rate build-up', 'rate buildup', 'entitlement', 'eot', 'prolongation'], executiveTheme: 'Commercial Recovery' },
    { type: 'con_operational_delivery_risk', label: 'Operational Delivery Risk & Site Productivity', tags: ['site execution', 'productivity control', 'subcontractor performance'], keywords: ['site productivity', 'labour productivity', 'plant downtime', 'equipment downtime', 'site wastage', 'rework', 'quality errors', 'subcontractor', 'supervision', 'site management', 'productivity shortfall', 'idle plant'], executiveTheme: 'Site Execution Control' },
    { type: 'con_schedule_coordination_slippage', label: 'Programme Slippage & Coordination Control', tags: ['programme control', 'critical path', 'coordination risk'], keywords: ['schedule', 'programme', 'delay', 'critical path', 'late completion', 'slippage', 'baseline programme', 'master programme', 'dependencies', 'subcontractor delays', 'late approvals', 'design changes', 'site access', 'long-lead items', 'material shortages', 'sequencing conflicts'], executiveTheme: 'Predictable Delivery' },
    { type: 'con_cashflow_certification_exposure', label: 'Project Cash Exposure & Certification Control', tags: ['cash exposure', 'certification discipline', 'working capital'], keywords: ['cash flow', 'certification', 'retention', 'billing', 'collections', 'progress claim', 'interim payment certificate', 'ipc', 'negative cash cycle', 'wip', 'bonding', 'guarantee exposure', 'final account', 'valuation', 'disallowed items'], executiveTheme: 'Liquidity Protection' },
  ],
  agriculture: [
    { type: 'ag_yield_performance', label: 'Yield Performance & Operational Timing', tags: ['yield performance', 'operational timing', 'farm execution'], keywords: ['yield gap', 'yield', 'planting window', 'harvesting window', 'stocking density', 'germination', 'harvest losses', 'post-harvest', 'post harvest', 'pest', 'disease', 'weed control', 'timeliness of operations', 'labour productivity', 'machinery productivity'], executiveTheme: 'Yield Realisation' },
    { type: 'ag_margin_cost_control', label: 'Unit Cost, Margin & Enterprise Mix', tags: ['unit cost control', 'gross margin', 'enterprise mix'], keywords: ['gross margin per hectare', 'gross margin per animal', 'cost per hectare', 'cost per unit', 'crop mix', 'livestock mix', 'land allocation', 'hedging', 'forward contracting', 'input efficiency', 'fuel', 'fertiliser', 'seed', 'price realisation', 'overhead absorption', 'input price variance'], executiveTheme: 'Margin Discipline' },
    { type: 'ag_risk_management', label: 'Risk Management, Resilience & Realisation', tags: ['risk management', 'weather resilience', 'market protection'], keywords: ['weather', 'drought', 'flood', 'frost', 'heat stress', 'biosecurity', 'disease outbreak', 'insurance', 'claims recovery', 'hedging', 'forward sales', 'quality downgrade', 'off-taker', 'off taker', 'debt servicing'], executiveTheme: 'Risk Layering' },
    { type: 'ag_working_capital_cash_cycle', label: 'Working Capital & Seasonal Cash Exposure', tags: ['working capital', 'cash cycle', 'seasonal exposure'], keywords: ['peak funding', 'pre-planting', 'pre planting', 'cash conversion cycle', 'inventory holding', 'storage', 'drying', 'grading', 'packing', 'payment terms', 'lease timing', 'harvest cash inflows', 'working capital', 'seasonal cash'], executiveTheme: 'Liquidity Timing' },
  ],
  healthcare: [
    { type: 'hc_clinical_quality_safety', label: 'Clinical Quality, Patient Safety & Care Variation', tags: ['clinical quality', 'patient safety', 'care variation'], keywords: ['clinical quality', 'patient safety', 'clinical variation', 'clinical governance', 'infection control', 'hai', 'readmission', 'mortality', 'morbidity', 'adverse event', 'sentinel event', 'protocol adherence', 'handover', 'medication errors', 'missed diagnoses', 'quality and patient safety'], executiveTheme: 'Clinical Governance' },
    { type: 'hc_margin_case_contribution', label: 'Contribution per Case, Admission & Payer Mix', tags: ['case contribution', 'payer mix', 'tariff discipline'], keywords: ['contribution margin', 'contribution margin per case', 'contribution per case', 'contribution per admission', 'contribution per patient', 'margin per case', 'revenue per case', 'case-mix', 'case mix', 'payer-mix', 'payer mix', 'medical aid', 'insurer', 'cash conversion', 'coding', 'claim rejection', 'rejected claims', 'billing and collection', 'short payments', 'tariff'], executiveTheme: 'Margin Discipline' },
    { type: 'hc_operational_capacity_flow', label: 'Operational Throughput, Capacity & Patient Flow', tags: ['patient flow', 'capacity utilisation', 'throughput control'], keywords: ['patient-flow', 'patient flow', 'patient-flow efficiency', 'throughput', 'capacity utilisation', 'theatre', 'theatre utilisation', 'bed utilisation', 'bed occupancy', 'bed blocking', 'outpatient facilities', 'patient journey', 'discharge planning', 'turnover time', 'cancellation rate', 'boarding', 'waiting list', 'clinic flow'], executiveTheme: 'Flow Reliability' },
    { type: 'hc_revenue_cycle_cash', label: 'Revenue Cycle, Cash Flow & Working Capital', tags: ['revenue cycle', 'cash control', 'working capital'], keywords: ['revenue-cycle', 'revenue cycle', 'cash conversion', 'claim submission', 'claim rejection', 'denial rate', 'authorisation delays', 'authorisation', 'pre-authorisation', 'pre authorisation', 'days sales outstanding', 'dso', 'billing accuracy', 'billing and collection', 'bad debt', 'co-payment', 'co payment', 'inventory turns', 'consignment'], executiveTheme: 'Cash Conversion' },
  ],
  energy: [
    { type: 'en_project_margin_irr', label: 'Project Margin Protection & IRR Realisation', tags: ['irr realisation', 'project margin', 'portfolio strategy'], keywords: ['project economics', 'project margin', 'irr', 'yield assurance', 'yield under-performance', 'yield under performance', 'curtailment', 'renewable portfolio', 'solar', 'wind', 'asset-level economic drift', 'asset-level economics', 'ppa', 'offtake', 'off-take', 'merchant exposure', 'technology mix', 'site selection', 'resource under-performance', 'resource under performance', 'degradation', 'o&m cost overruns'], executiveTheme: 'Value Realisation' },
    { type: 'en_schedule_commissioning', label: 'Schedule Slippage, Grid Connection & Commissioning', tags: ['schedule control', 'grid connection', 'commissioning risk'], keywords: ['commissioning certainty', 'grid connection', 'commissioning delays', 'commissioning', 'delivery certainty', 'permitting', 'eia', 'land acquisition', 'substation', 'epc', 'civil works', 'weather window', 'pto', 'fac', 'handover delay', 'testing delay'], executiveTheme: 'Delivery Certainty' },
    { type: 'en_contractual_claims', label: 'Variations, Claims & Contractual Performance', tags: ['contract performance', 'claims recovery', 'variation control'], keywords: ['contractual recovery', 'contractual', 'claims discipline', 'variation', 'change order', 'curtailment compensation', 'performance guarantees', 'insurance claims', 'force majeure', 'warranty', 'oem', 'epc under-performance', 'epc under performance', 'claim recovery', 'epc and oem'], executiveTheme: 'Commercial Recovery' },
    { type: 'en_cashflow_transition', label: 'Cash Flow, Funding & Construction-to-Operation Transition', tags: ['cash exposure', 'funding control', 'working capital'], keywords: ['funding discipline', 'cash exposure', 'construction-to-operation', 'construction to operation', 'funding headroom', 'upfront capex', 'drawdowns', 'equity injections', 'bonding', 'letters of credit', 'operational phase cash', 'revenue collection', 'escrow', 'spares inventory', 'refinancing', 'currency mismatch', 'inflation mismatch'], executiveTheme: 'Funding Discipline' },
  ],
};

function appendContextTags(input: AdvisoryInput, tags: string[]): string[] {
  const text = [input.challenge, input.goal, input.constraints, input.businessFunction, input.triggerSource, input.notes]
    .map(clean)
    .join(' ')
    .toLowerCase();

  const extra: string[] = [];
  if (['group', 'holding', 'holdings', 'portfolio', 'multi-site', 'multisite', 'multiple sites', 'regional'].some((term) => text.includes(term))) {
    extra.push('Group / Portfolio Context');
  }
  if (['site', 'site-level', 'plant', 'plant-level', 'shop-floor', 'shop floor', 'press', 'finishing'].some((term) => text.includes(term))) {
    extra.push('Operational / Site Context');
  }
  if (['executive visibility', 'leadership visibility', 'board', 'exco', 'portfolio view'].some((term) => text.includes(term))) {
    extra.push('Executive Visibility');
  }
  if (['planning', 'scheduling', 'programme', 'queue', 'sequence', 'sequencing'].some((term) => text.includes(term))) {
    extra.push('Planning & Scheduling');
  }
  if (['specification', 'artwork', 'proof', 'version control', 'client approval', 'change control'].some((term) => text.includes(term))) {
    extra.push('Specification / Change Control');
  }
  if (['claim', 'variation', 'contract administration', 'certification', 'retention', 'cash flow'].some((term) => text.includes(term))) {
    extra.push('Commercial / Contract Control');
  }
  if (['farm', 'hectare', 'harvest', 'irrigation', 'crop', 'livestock', 'agronomy'].some((term) => text.includes(term))) {
    extra.push('Farm / Enterprise Context');
  }
  if (['patient', 'clinical', 'theatre', 'ward', 'hospital', 'clinic', 'medical aid'].some((term) => text.includes(term))) {
    extra.push('Clinical / Facility Context');
  }
  if (['solar', 'wind', 'ppa', 'grid', 'turbine', 'module', 'battery', 'commissioning'].some((term) => text.includes(term))) {
    extra.push('Project / Asset Context');
  }

  return Array.from(new Set([...tags, ...extra]));
}

function selectBestRule(input: AdvisoryInput, rules: Rule[]): ClassificationResult | null {
  const scored = rules
    .map((rule) => ({ rule, score: keywordScoreByField(input, rule.keywords) }))
    .sort((a, b) => b.score - a.score);

  if (!scored.length || scored[0].score <= 0) return null;

  const primary = scored[0];
  const secondary = scored.find((entry) => entry.rule.type !== primary.rule.type && entry.score >= Math.max(5, primary.score - 4));
  const confidence: 'High' | 'Moderate' = primary.score >= 9 ? 'High' : 'Moderate';

  return {
    problemType: primary.rule.type,
    label: primary.rule.label,
    tags: appendContextTags(input, primary.rule.tags),
    confidence,
    secondaryLabel: secondary?.rule.label,
    executiveTheme: primary.rule.executiveTheme,
  };
}

export function classifyProblem(input: AdvisoryInput): ClassificationResult {
  const overlayKey = resolveOverlayKey(input.industry);
  const industryRules = INDUSTRY_RULES[overlayKey] || [];
  const industryResult = selectBestRule(input, industryRules);
  if (industryResult) {
    if (industryResult.confidence === 'Moderate' && (normaliseUrgency(input.urgency) === 'High' || clean(input.financialExposure).toLowerCase().includes('million'))) {
      industryResult.confidence = 'High';
    }
    return industryResult;
  }

  const genericResult = selectBestRule(input, GENERIC_RULES);
  if (genericResult) return genericResult;

  return {
    problemType: 'general_operational_pressure',
    label: 'Operational Performance Pressure',
    tags: appendContextTags(input, ['operations', 'execution', 'leadership alignment']),
    confidence: 'Moderate',
    executiveTheme: 'Execution Control',
  };
}
