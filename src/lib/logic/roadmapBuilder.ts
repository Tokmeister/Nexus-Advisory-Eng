import { dedupeCaseInsensitive } from './helpers';
import type { OverlayConfig, Roadmap } from './types';

const ROADMAP_BASES: Record<string, Roadmap> = {
  ps_conversion_delivery: {
    day30Title: 'Commercial Engine Diagnostic',
    day60Title: 'Execution Stabilisation',
    day90Title: 'Scalable Operating Model',
    day30: [
      'Map conversion quality, scoping integrity, proposal velocity, and delivery handoff risk.',
      'Identify where pipeline activity is not translating into quality revenue.',
      'Build one executive view of conversion, scope, delivery, and account economics.',
    ],
    day60: [
      'Stabilise proposal governance, delivery handoffs, and escalation rules.',
      'Introduce weekly operating reviews that connect commercial promises to delivery outcomes.',
      'Intervene where sold scope and delivered scope are diverging materially.',
    ],
    day90: [
      'Embed repeatable commercial-to-delivery governance rhythms.',
      'Standardise proposal controls and service delivery accountability.',
      'Use conversion quality and delivery predictability as leadership steering metrics.',
    ],
  },
  pp_waste_rework: {
    day30Title: 'Waste & Margin Diagnostic',
    day60Title: 'Operational Recovery',
    day90Title: 'Right-First-Time Discipline',
    day30: [
      'Quantify waste, spoilage, reruns, and setup-related loss by line and asset.',
      'Identify the highest-value sources of avoidable margin erosion.',
      'Create daily visibility of waste and rework performance at leadership level.',
    ],
    day60: [
      'Drive owner-led recovery on the biggest waste pools.',
      'Tighten process discipline around setup, approval, and execution.',
      'Use daily huddles to keep recovery actions visible and current.',
    ],
    day90: [
      'Embed right-first-time standards into production management.',
      'Connect waste reduction directly to gross margin recovery.',
      'Position waste discipline as a permanent operating standard.',
    ],
  },
  pp_turnaround_velocity: {
    day30Title: 'Velocity & Queue Diagnostic',
    day60Title: 'Flow Stabilisation',
    day90Title: 'Delivery Agility',
    day30: [
      'Map queue time, scheduling loss, and handoff friction across the job flow.',
      'Quantify the commercial impact of slow turnaround.',
      'Build leadership visibility on planning, queue, and on-time delivery performance.',
    ],
    day60: [
      'Reset scheduling discipline and prioritisation logic.',
      'Tighten flow control between planning, press, and finishing.',
      'Use daily performance reviews to surface slippage early.',
    ],
    day90: [
      'Institutionalise faster, more reliable client turnaround.',
      'Treat operational agility as a differentiator in the client value proposition.',
      'Link turnaround performance to executive margin and service reviews.',
    ],
  },
  pp_specification_control: {
    day30Title: 'Specification Failure Diagnostic',
    day60Title: 'Control Stabilisation',
    day90Title: 'Right-First-Time Governance',
    day30: [
      'Map where specification, artwork, proofing, and approvals are failing.',
      'Quantify rerun risk and client dispute exposure caused by weak controls.',
      'Create one ownership trail for specification and release decisions.',
    ],
    day60: [
      'Harden change control, approval gates, and version discipline.',
      'Reset role clarity between commercial, prepress, and production teams.',
      'Escalate recurring specification failures with visible ownership.',
    ],
    day90: [
      'Embed right-first-time specification governance as standard practice.',
      'Reduce reruns by institutionalising release control discipline.',
      'Position specification integrity as a quality and margin lever.',
    ],
  },
  pp_press_utilisation: {
    day30Title: 'Capacity & Setup Diagnostic',
    day60Title: 'Utilisation Recovery',
    day90Title: 'Productive Capacity Discipline',
    day30: [
      'Measure setup loss, changeover inefficiency, and effective press utilisation.',
      'Identify where capacity is being lost before value is created.',
      'Build one executive view of setup, loading, and productive hours by asset.',
    ],
    day60: [
      'Execute focused setup-time reduction and smarter scheduling interventions.',
      'Stabilise utilisation discipline across press and finishing assets.',
      'Review productive hours weekly at plant leadership level.',
    ],
    day90: [
      'Institutionalise higher effective capacity without adding avoidable cost.',
      'Link productive utilisation to turnaround, margin, and service performance.',
      'Use asset productivity as a leadership-controlled growth lever.',
    ],
  },
  mfg_bottleneck_throughput: {
    day30Title: 'Constraint Diagnostic',
    day60Title: 'Flow Recovery',
    day90Title: 'Throughput Discipline',
    day30: [
      'Quantify the true throughput bottleneck and its lost output value.',
      'Map where flow is breaking down around the primary constraint.',
      'Build a single operational view of constraint performance.',
    ],
    day60: [
      'Drive targeted interventions on the bottleneck and supporting flow losses.',
      'Align planning and staffing around the real throughput constraint.',
      'Install daily review discipline focused on output recovery.',
    ],
    day90: [
      'Embed throughput management as a recurring leadership routine.',
      'Use constraint visibility to prevent future flow degradation.',
      'Link throughput gains to executive margin and service reviews.',
    ],
  },
  mfg_quality_source: {
    day30Title: 'Quality Failure Diagnostic',
    day60Title: 'Control at Source',
    day90Title: 'Defect Prevention Discipline',
    day30: [
      'Map defect creation points, scrap losses, and quality escapes.',
      'Quantify cost-of-poor-quality exposure with executive visibility.',
      'Identify the highest-value quality control gaps at source.',
    ],
    day60: [
      'Stabilise the most material quality failure points.',
      'Reinforce owner accountability where defects originate.',
      'Reset review cadence around first-pass quality and rework reduction.',
    ],
    day90: [
      'Embed quality-at-source into the operating model.',
      'Link quality prevention directly to margin protection.',
      'Use defect-prevention discipline as a strategic reliability lever.',
    ],
  },
  mfg_supply_chain_exposure: {
    day30Title: 'Supply Risk Diagnostic',
    day60Title: 'Continuity Stabilisation',
    day90Title: 'Resilient Supply Discipline',
    day30: [
      'Map supplier, lead-time, and inventory vulnerabilities.',
      'Quantify production and customer risk linked to supply exposure.',
      'Create a single executive view of critical supply constraints.',
    ],
    day60: [
      'Stabilise the most material supply risks through targeted interventions.',
      'Tighten planning and inventory decision discipline.',
      'Institute recurring supply-risk reviews at leadership level.',
    ],
    day90: [
      'Embed resilience into sourcing, planning, and stock governance.',
      'Use supply reliability as a margin and delivery protection mechanism.',
      'Position supply continuity as an executive control area, not an exception report.',
    ],
  },
  mfg_oee_capacity: {
    day30Title: 'OEE Diagnostic',
    day60Title: 'Capacity Recovery',
    day90Title: 'Asset Productivity Discipline',
    day30: [
      'Break OEE losses into actionable availability, performance, and quality drivers.',
      'Quantify capacity lost through downtime, speed loss, and quality failure.',
      'Build a practical-capacity dashboard for executive review.',
    ],
    day60: [
      'Attack the highest-value downtime and speed losses.',
      'Introduce owner-level discipline around asset productivity recovery.',
      'Track effective capacity weekly through plant and executive reviews.',
    ],
    day90: [
      'Institutionalise asset productivity as a core operating discipline.',
      'Connect capacity recovery to margin and customer service performance.',
      'Use OEE visibility to sustain operational excellence.',
    ],
  },
  con_project_margin: {
    day30Title: 'Project Margin Diagnostic',
    day60Title: 'Commercial Recovery',
    day90Title: 'Margin Discipline Institutionalised',
    day30: [
      'Map margin leakage across live projects and major cost categories.',
      'Quantify the most material sources of commercial erosion.',
      'Create weekly executive visibility on exposed projects.',
    ],
    day60: [
      'Drive owner-led recovery on projects with the greatest margin pressure.',
      'Tighten cost control, package governance, and site accountability.',
      'Use recurring reviews to prevent further leakage.',
    ],
    day90: [
      'Embed stronger project-commercial discipline across the portfolio.',
      'Link project margin visibility to executive P&L governance.',
      'Position predictable margin delivery as a core operating standard.',
    ],
  },
  con_schedule_slippage: {
    day30Title: 'Critical-Path Diagnostic',
    day60Title: 'Programme Stabilisation',
    day90Title: 'Predictable Schedule Discipline',
    day30: [
      'Map critical-path slippage and milestone risk across the project portfolio.',
      'Quantify the delivery and cash implications of current delays.',
      'Create executive visibility on the most schedule-exposed projects.',
    ],
    day60: [
      'Tighten short-interval control and milestone governance.',
      'Link site-level actions to actual schedule recovery drivers.',
      'Review slippage weekly with visible ownership and escalation.',
    ],
    day90: [
      'Embed schedule discipline as a repeatable project control rhythm.',
      'Use critical-path visibility to drive predictable delivery.',
      'Position programme reliability as a commercial differentiator.',
    ],
  },
  con_variations_claims: {
    day30Title: 'Variation & Claim Diagnostic',
    day60Title: 'Commercial Control Recovery',
    day90Title: 'Entitlement Discipline',
    day30: [
      'Map outstanding variations, claims, approvals, and unresolved entitlement risk.',
      'Quantify commercial value at risk from weak variation governance.',
      'Create a single executive view of claim exposure and status.',
    ],
    day60: [
      'Strengthen evidence, approval, and escalation discipline for change events.',
      'Accelerate recovery on high-value unresolved claims.',
      'Review entitlement status weekly through leadership forums.',
    ],
    day90: [
      'Institutionalise stronger change and claim governance.',
      'Use entitlement visibility to protect realised project value.',
      'Position variation discipline as a core project-commercial capability.',
    ],
  },
  con_cashflow_controls: {
    day30Title: 'Project Cash Diagnostic',
    day60Title: 'Cash Control Recovery',
    day90Title: 'Liquidity Discipline',
    day30: [
      'Map billing, certification, and collection blockages across live projects.',
      'Quantify cash exposure linked to delayed certificates, retentions, and billing weakness.',
      'Create weekly visibility on the most exposed contracts.',
    ],
    day60: [
      'Tighten billing, certification, and collection discipline with clear ownership.',
      'Escalate project cash issues before liquidity pressure compounds.',
      'Connect project controls directly to cash realisation.',
    ],
    day90: [
      'Institutionalise project cash governance across the portfolio.',
      'Use cash visibility as a standard executive project control measure.',
      'Protect liquidity through disciplined project-commercial follow-through.',
    ],
  },

  mfg_product_margin_protection: {
    day30Title: 'Margin Leakage Diagnostic',
    day60Title: 'Commercial & Cost Recovery',
    day90Title: 'Margin Discipline Institutionalised',
    day30: [
      'Build a margin-leakage waterfall across product family, customer, plant, and cause.',
      'Separate strategic mix decisions, commercial leakage, and operational erosion with quantified financial impact.',
      'Create one executive view of realised contribution margin, complexity load, and standard-cost drift.',
    ],
    day60: [
      'Tighten pricing recovery, discount discipline, and product/customer mix governance on the value pools carrying the greatest margin risk.',
      'Intervene on material variance, labour absorption, and rework pools with explicit owner accountability.',
      'Review realised margin contribution weekly or monthly at leadership level, not only period-end finance close.',
    ],
    day90: [
      'Embed product-margin governance as a standing executive discipline.',
      'Link product economics directly to plant loading, service performance, and working-capital deployment.',
      'Use portfolio margin quality to steer growth and manufacturing strategy.',
    ],
  },
  mfg_schedule_delivery_velocity: {
    day30Title: 'Flow & Planning Diagnostic',
    day60Title: 'Schedule Recovery',
    day90Title: 'Reliable Delivery Discipline',
    day30: [
      'Map MPS, MRP, finite-loading, setup loss, supplier variability, and dispatch delay across the end-to-end flow.',
      'Separate planning-system instability from true execution loss.',
      'Create daily visibility on OTIF, schedule attainment, and expediting pressure.',
    ],
    day60: [
      'Reset frozen-zone discipline, practical capacity assumptions, and escalation rules around real constraints.',
      'Stabilise schedule control at the lines, suppliers, and dispatch points carrying the most value at risk.',
      'Track recovery of delivery velocity through recurring plant and leadership reviews.',
    ],
    day90: [
      'Embed delivery reliability as a managed operating rhythm, not a reactive firefighting response.',
      'Link schedule adherence directly to commercial credibility, plant loading, and working-capital protection.',
      'Use delivery velocity as a core steering measure across the manufacturing system.',
    ],
  },
  mfg_quality_specification_control: {
    day30Title: 'Quality-System Diagnostic',
    day60Title: 'Specification & Process Recovery',
    day90Title: 'Right-First-Time Discipline',
    day30: [
      'Map engineering-change, BOM, routing, calibration, and process-control failures by product family and line.',
      'Quantify COPQ, first-pass yield loss, defect Pareto, and recurrence exposure.',
      'Create one ownership trail for quality escapes and unresolved RCCA actions.',
    ],
    day60: [
      'Tighten specification governance, work-instruction adherence, and corrective-action closure discipline.',
      'Intervene on the processes and products generating the highest quality-cost exposure.',
      'Review quality-system recovery through visible plant and leadership cadences.',
    ],
    day90: [
      'Institutionalise right-first-time control as a standard operating discipline.',
      'Link first-pass quality, recurrence prevention, and process compliance directly to margin and service outcomes.',
      'Use quality-system integrity as a durable competitive advantage.',
    ],
  },
  mfg_asset_oee_capacity: {
    day30Title: 'OEE & Capacity Diagnostic',
    day60Title: 'Asset Recovery',
    day90Title: 'Productive Capacity Discipline',
    day30: [
      'Break OEE into availability, performance, and quality-rate losses by asset, line, and shift.',
      'Identify whether changeovers, minor stoppages, starvation, operator variability, or cross-site imbalance are constraining output.',
      'Create one executive view of practical capacity and asset-productivity loss.',
    ],
    day60: [
      'Execute focused recovery on the highest-value downtime, speed-loss, and balance issues.',
      'Rebalance assets, cells, or plant loading around practical rather than theoretical capacity.',
      'Track productive-capacity recovery through recurring plant and executive reviews.',
    ],
    day90: [
      'Institutionalise OEE and asset productivity as core operating disciplines.',
      'Connect productive capacity directly to delivery reliability, margin quality, and inventory efficiency.',
      'Use asset and network balance visibility to sustain durable manufacturing performance.',
    ],
  },

  ag_yield_performance: {
    day30Title: 'Yield-Gap Diagnostic',
    day60Title: 'Operational Timing Recovery',
    day90Title: 'Disciplined Yield Realisation',
    day30: [
      'Quantify potential versus achieved yield by crop, enterprise, region, or farm and split the gap between controllable and external causes.',
      'Map planting, spraying, harvesting, labour, machinery, and post-harvest timing performance on the highest-value units.',
      'Create one executive view of where yield is being lost across the cycle.',
    ],
    day60: [
      'Tighten execution on the critical operating windows carrying the greatest value at risk.',
      'Intervene on labour, machinery, pest/disease, and post-harvest failures with visible owner accountability.',
      'Track yield-recovery actions through weekly or seasonal farm reviews.',
    ],
    day90: [
      'Embed yield-realisation control as a recurring agricultural operating discipline.',
      'Link field execution directly to realised margin, storage performance, and cash expectations.',
      'Use yield-gap visibility to sustain better decisions across future seasons.',
    ],
  },
  ag_margin_cost_control: {
    day30Title: 'Margin Waterfall Diagnostic',
    day60Title: 'Enterprise & Cost Recovery',
    day90Title: 'Gross-Margin Discipline',
    day30: [
      'Build a gross-margin waterfall per hectare or per animal across yield, price, input variance, and waste/shrinkage.',
      'Separate enterprise-mix decisions from farm-execution issues with quantified financial impact.',
      'Create one executive view of contribution margin, input efficiency, and overhead absorption by enterprise.',
    ],
    day60: [
      'Tighten land allocation, enterprise selection, procurement leverage, and unit-cost discipline where value is most exposed.',
      'Intervene on the cost pools and product/market decisions carrying the greatest margin risk.',
      'Track realised gross-margin recovery through recurring leadership reviews.',
    ],
    day90: [
      'Embed gross-margin governance as a standing agricultural leadership discipline.',
      'Link enterprise economics directly to seasonal execution, working capital, and risk decisions.',
      'Use realised margin per hectare or per animal to steer future portfolio choices.',
    ],
  },
  ag_risk_management: {
    day30Title: 'Risk-Layering Diagnostic',
    day60Title: 'Resilience Recovery',
    day90Title: 'Integrated Risk Discipline',
    day30: [
      'Map weather, biological, market, and counterparty risk with quantified financial exposure.',
      'Stress-test mitigation infrastructure, hedging, insurance, diversification, and claims recovery logic.',
      'Create one leadership view of controllable versus external agricultural risk.',
    ],
    day60: [
      'Tighten risk-mitigation actions on the farms, enterprises, and exposures carrying the greatest value at risk.',
      'Strengthen hedging, insurance, and biosecurity disciplines with explicit owner accountability.',
      'Track risk-reduction actions through recurring seasonal or monthly reviews.',
    ],
    day90: [
      'Embed agricultural risk layering as a standard leadership system.',
      'Link resilience decisions directly to expected margin, cash, and portfolio stability outcomes.',
      'Use risk visibility to improve future seasonal planning and diversification choices.',
    ],
  },
  ag_working_capital_cash_cycle: {
    day30Title: 'Seasonal Cash Diagnostic',
    day60Title: 'Cash-Cycle Recovery',
    day90Title: 'Liquidity Timing Discipline',
    day30: [
      'Map pre-season funding peaks, inventory carrying cost, harvest timing, storage, and buyer-payment exposure across the cycle.',
      'Quantify where drying, grading, packing, sale timing, or lease timing is trapping working capital.',
      'Create one view of liquidity timing by crop, enterprise, or farm.',
    ],
    day60: [
      'Tighten harvest-to-realisation decisions, buyer terms, inventory discipline, and capital phasing on the most exposed enterprises.',
      'Intervene on cash-cycle bottlenecks with visible owner accountability.',
      'Track liquidity recovery through recurring finance and operating reviews.',
    ],
    day90: [
      'Embed seasonal cash planning as a standing agricultural operating discipline.',
      'Link liquidity timing directly to yield, margin, and off-take decisions.',
      'Use funding-headroom visibility to support more resilient portfolio decisions.',
    ],
  },

  hc_clinical_quality_safety: {
    day30Title: 'Quality & Safety Diagnostic',
    day60Title: 'Clinical Governance Recovery',
    day90Title: 'Disciplined Care Quality Model',
    day30: [
      'Map clinical quality and safety variance by facility, specialty, department, or practice.',
      'Separate system-level governance weakness from clinician-level or service-line variability.',
      'Create one executive view of quality, safety, and high-risk care variation.',
    ],
    day60: [
      'Tighten protocol adherence, governance, and escalation on the highest-risk clinical services.',
      'Intervene on the quality failures driving both patient harm and economic leakage.',
      'Track clinical recovery through visible facility and executive reviews.',
    ],
    day90: [
      'Embed clinical governance and safety discipline as a recurring operating rhythm.',
      'Link quality, reputation, and contribution protection directly in leadership reviews.',
      'Use outcome transparency to sustain better care and better economics together.',
    ],
  },
  hc_margin_case_contribution: {
    day30Title: 'Contribution & Funding Diagnostic',
    day60Title: 'Case-Economics Recovery',
    day90Title: 'Disciplined Contribution Model',
    day30: [
      'Build a contribution waterfall per case, admission, consultation, specialty, or patient panel.',
      'Separate payer mix, tariff, direct-cost leakage, LOS variance, and claim-rejection pressure with quantified value at risk.',
      'Create one executive view of where contribution is structurally weak.',
    ],
    day60: [
      'Tighten payer, tariff, case-costing, and formulary or consumable control on the most exposed services.',
      'Intervene on the case-mix and pricing decisions destroying contribution quality.',
      'Track contribution recovery through recurring leadership reviews.',
    ],
    day90: [
      'Embed contribution governance as a standing healthcare leadership discipline.',
      'Link service-line economics directly to quality, capacity, and funding decisions.',
      'Use contribution visibility to steer network and specialty strategy.',
    ],
  },
  hc_operational_capacity_flow: {
    day30Title: 'Patient-Flow Diagnostic',
    day60Title: 'Capacity Recovery',
    day90Title: 'Reliable Care Throughput',
    day30: [
      'Map theatres, beds, diagnostics, consultations, and discharge bottlenecks across the care journey.',
      'Separate true capacity shortage from scheduling, handoff, and flow-management failure.',
      'Create daily visibility on cancellations, turnover, bed blocking, and waiting pressure.',
    ],
    day60: [
      'Tighten scheduling, discharge, and inter-department coordination on the most exposed services.',
      'Intervene on the bottlenecks destroying both access and economic performance.',
      'Track flow recovery through visible operational and executive review cadence.',
    ],
    day90: [
      'Embed patient-flow and capacity control as a recurring operating discipline.',
      'Link throughput reliability directly to patient experience, contribution, and staff productivity.',
      'Use flow visibility to sustain better access and better economics together.',
    ],
  },
  hc_revenue_cycle_cash: {
    day30Title: 'Revenue-Cycle Diagnostic',
    day60Title: 'Cash Conversion Recovery',
    day90Title: 'Disciplined Funding Control',
    day30: [
      'Map authorisation, coding, denial, billing, co-payment, and collection leakage across the cycle.',
      'Quantify where revenue is delayed, denied, or lost after care delivery.',
      'Create one leadership view of cash-conversion weakness by facility, service, or payer.',
    ],
    day60: [
      'Tighten coding, authorisation, billing, and collection control where the greatest value is at risk.',
      'Intervene on the root causes of denials, disputed claims, and slow cash realisation.',
      'Track revenue-cycle recovery through recurring finance and operating reviews.',
    ],
    day90: [
      'Embed revenue-cycle control as a standard healthcare operating discipline.',
      'Link cash conversion directly to contribution protection and working-capital resilience.',
      'Use funding visibility to sustain better service and better financial control.',
    ],
  },
  en_project_margin_irr: {
    day30Title: 'Economics & Yield Diagnostic',
    day60Title: 'IRR Recovery',
    day90Title: 'Disciplined Project-Economics Model',
    day30: [
      'Build a base-case to current-case IRR waterfall across projects, technologies, and causes of erosion.',
      'Separate resource under-performance, curtailment, degradation, O&M overrun, and commercial leakage with quantified value at risk.',
      'Create one executive view of project economics under pressure.',
    ],
    day60: [
      'Tighten interventions on the projects where yield, cost, or contract design is destroying return quality.',
      'Intervene on the highest-value economics leakages with explicit owner accountability.',
      'Track IRR recovery through visible portfolio reviews.',
    ],
    day90: [
      'Embed project-economics governance as a standing portfolio discipline.',
      'Link technology, site, PPA, and O&M choices directly to realised return quality.',
      'Use economics visibility to steer future development and diversification strategy.',
    ],
  },
  en_schedule_commissioning: {
    day30Title: 'Delay & Handover Diagnostic',
    day60Title: 'Delivery Recovery',
    day90Title: 'Disciplined Commissioning Model',
    day30: [
      'Map permitting, grid, EPC, weather-window, and commissioning delay across the portfolio.',
      'Separate regulatory, contractor, weather, and handover causes of slippage.',
      'Create one executive view of delivery certainty at project level.',
    ],
    day60: [
      'Tighten critical-path control on the projects with the greatest schedule and commissioning exposure.',
      'Intervene on grid-interface, EPC, and final-acceptance failures with visible accountability.',
      'Track schedule recovery through recurring project and portfolio reviews.',
    ],
    day90: [
      'Embed schedule and commissioning control as a standard portfolio operating discipline.',
      'Link delivery certainty directly to economics and funding timing.',
      'Use delay visibility to improve future development and EPC governance.',
    ],
  },
  en_contractual_claims: {
    day30Title: 'Contractual Recovery Diagnostic',
    day60Title: 'Claims & Entitlement Recovery',
    day90Title: 'Disciplined Contract Performance',
    day30: [
      'Audit claim, variation, warranty, curtailment-compensation, and insurance-recovery exposure by project.',
      'Quantify the gap between contractual entitlement and realised recovery.',
      'Create one executive view of where value is leaking through weak contract performance.',
    ],
    day60: [
      'Tighten governance over claims, change events, performance guarantees, and recovery escalation.',
      'Intervene on the projects where contractual leakage is most severe.',
      'Track recovery through recurring project-commercial reviews.',
    ],
    day90: [
      'Embed contractual-performance discipline as a standard portfolio capability.',
      'Link contract recovery directly to economics, liquidity, and supplier governance.',
      'Use contract visibility to improve future PPA, EPC, and OEM negotiation quality.',
    ],
  },
  en_cashflow_transition: {
    day30Title: 'Funding & Cash Diagnostic',
    day60Title: 'Liquidity Recovery',
    day90Title: 'Disciplined Funding Model',
    day30: [
      'Map construction-phase funding peaks, drawdowns, guarantees, and operational cash-conversion exposure by project.',
      'Quantify where schedule delay, payment-security weakness, or O&M phasing is stretching headroom.',
      'Create one executive view of funding pressure and refinancing exposure.',
    ],
    day60: [
      'Tighten milestone alignment, payment security, spare-parts working capital, and refinancing readiness with visible owner accountability.',
      'Intervene on the projects carrying the greatest liquidity risk.',
      'Track cash recovery through recurring finance and portfolio reviews.',
    ],
    day90: [
      'Embed construction-to-operation cash discipline as a standard portfolio operating control.',
      'Link funding timing directly to schedule certainty, contract recovery, and long-term asset cash generation.',
      'Use headroom visibility to protect delivery continuity and return realisation.',
    ],
  },
  default: {
    day30Title: 'Rapid Diagnostic & Containment',
    day60Title: 'Execution Stabilisation',
    day90Title: 'Institutionalised Discipline',
    day30: [
      'Translate the stated strategic goal into a clear 30 / 60 / 90-day intervention roadmap.',
      'Identify the highest-leverage leakage points, delays, or decision bottlenecks.',
      'Create a single source of truth dashboard that surfaces critical execution signals for leadership.',
    ],
    day60: [
      'Execute targeted interventions at the largest value-leakage points with explicit owner accountability.',
      'Reset operating review cadences to focus on facts, metrics, and forward-looking actions.',
      'Drive disciplined follow-through on the highest-priority initiatives with weekly executive oversight.',
    ],
    day90: [
      'Embed repeatable operating rhythms that sustain performance and prevent regression.',
      'Shift from reactive firefighting to proactive trend visibility and risk mitigation.',
      'Link all management reviews directly to measurable business outcomes and leadership ownership.',
    ],
  },
};

export function buildRoadmap(problemType: string, overlay: OverlayConfig, goal: string): Roadmap {
  const base = ROADMAP_BASES[problemType] || ROADMAP_BASES.default;
  return {
    day30Title: overlay.roadmapBias.day30Title || base.day30Title,
    day60Title: overlay.roadmapBias.day60Title || base.day60Title,
    day90Title: overlay.roadmapBias.day90Title || base.day90Title,
    day30: dedupeCaseInsensitive([...base.day30, ...(overlay.roadmapBias.day30 || [])]).slice(0, 6),
    day60: dedupeCaseInsensitive([...base.day60, ...(overlay.roadmapBias.day60 || [])]).slice(0, 6),
    day90: dedupeCaseInsensitive([...base.day90, ...(overlay.roadmapBias.day90 || [])]).slice(0, 6),
  };
}
