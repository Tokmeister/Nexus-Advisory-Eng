import { dedupeCaseInsensitive } from './helpers';
import type { OverlayConfig, Roadmap } from './types';

const makeRoadmap = (
  day30Title: string,
  day60Title: string,
  day90Title: string,
  day30: string[],
  day60: string[],
  day90: string[]
): Roadmap => ({
  day30Title,
  day60Title,
  day90Title,
  day30,
  day60,
  day90,
});

const ROADMAP_BASES: Record<string, Roadmap> = {
  ps_conversion_delivery: makeRoadmap(
    'Commercial Engine Diagnostic',
    'Execution Stabilisation',
    'Scalable Operating Model',
    [
      'Map conversion quality, scoping integrity, proposal velocity, and delivery handoff risk.',
      'Identify where pipeline activity is not translating into quality revenue.',
      'Build one executive view of conversion, scope, delivery, and account economics.',
    ],
    [
      'Stabilise proposal governance, delivery handoffs, and escalation rules.',
      'Introduce weekly operating reviews that connect commercial promises to delivery outcomes.',
      'Intervene where sold scope and delivered scope are diverging materially.',
    ],
    [
      'Embed repeatable commercial-to-delivery governance rhythms.',
      'Standardise proposal controls and service delivery accountability.',
      'Use conversion quality and delivery predictability as leadership steering metrics.',
    ]
  ),

  ps_utilisation_economics: makeRoadmap(
    'Utilisation & Economics Diagnostic',
    'Margin Recovery Discipline',
    'Client Economics Operating Model',
    [
      'Map utilisation quality, billable recovery, retainer economics, pricing discipline, and account-level profitability.',
      'Identify where delivery effort is growing faster than fee recovery or client value realisation.',
      'Create one executive view of utilisation mix, margin contribution, and service-line economics.',
    ],
    [
      'Tighten scoping, pricing, recovery rules, and utilisation governance across exposed clients.',
      'Review utilisation quality and realised margin weekly by account or service line.',
      'Intervene where low-value work is consuming scarce delivery capacity.',
    ],
    [
      'Embed utilisation and client economics as standard leadership steering measures.',
      'Standardise margin-quality review before new work is accepted.',
      'Use service-line economics to steer growth, staffing, and pricing decisions.',
    ]
  ),

  ps_operating_model: makeRoadmap(
    'Operating Model Diagnostic',
    'Role & Decision Stabilisation',
    'Scalable Accountability Model',
    [
      'Map role interfaces, decision bottlenecks, escalation paths, and ownership gaps across sales, solutioning, delivery, and account leadership.',
      'Identify the highest-friction handoffs slowing execution or weakening client outcomes.',
      'Create one leadership view of pipeline health, delivery quality, utilisation, and client economics.',
    ],
    [
      'Clarify accountable owners across commercial, delivery, finance, and client-success workstreams.',
      'Install operating reviews that link decisions directly to delivery outcomes and client value.',
      'Remove duplicated effort, decision ambiguity, and weak escalation paths.',
    ],
    [
      'Embed repeatable leadership cadences that support scalable service delivery.',
      'Standardise role accountability and decision rights across all active engagements.',
      'Use operating-model discipline as the foundation for growth without founder overload.',
    ]
  ),

  pp_executive_margin_leakage: makeRoadmap(
    'Portfolio Margin Diagnostic',
    'Commercial Control Recovery',
    'Margin-Quality Operating Model',
    [
      'Build a portfolio margin view by customer, product family, site, job type, and quoting discipline.',
      'Separate under-pricing, absorbed customer changes, filler work, and wrong-fit work from shop-floor loss.',
      'Create executive visibility on where commercial decisions are consuming capacity without adequate contribution.',
    ],
    [
      'Tighten quoting discipline, customer segmentation, margin gates, and approval rules for exposed work.',
      'Intervene on low-return customer or product categories consuming scarce capacity.',
      'Review portfolio margin quality through recurring executive commercial forums.',
    ],
    [
      'Embed margin-quality review before capacity is committed.',
      'Standardise profitable-work selection and escalation rules across sites or service lines.',
      'Use portfolio margin quality as a leadership steering metric for growth.',
    ]
  ),

  pp_operational_waste_rework: makeRoadmap(
    'Waste & Margin Diagnostic',
    'Operational Recovery',
    'Right-First-Time Discipline',
    [
      'Quantify waste, spoilage, reruns, and setup-related loss by job, press, finishing line, and customer.',
      'Identify the highest-value sources of avoidable margin erosion.',
      'Create daily visibility of waste and rework performance at leadership level.',
    ],
    [
      'Drive owner-led recovery on the biggest waste pools.',
      'Tighten process discipline around setup, approval, release, and production execution.',
      'Use daily huddles to keep recovery actions visible and current.',
    ],
    [
      'Embed right-first-time standards into production management.',
      'Connect waste reduction directly to gross margin recovery.',
      'Position waste discipline as a permanent operating standard.',
    ]
  ),

  pp_planning_turnaround_control: makeRoadmap(
    'Velocity & Queue Diagnostic',
    'Flow Stabilisation',
    'Delivery Agility',
    [
      'Map queue time, scheduling loss, sequencing friction, rush-job disruption, and handoff failure across the job flow.',
      'Quantify the commercial impact of slow turnaround and late delivery.',
      'Build leadership visibility on planning, queue, schedule attainment, and on-time delivery performance.',
    ],
    [
      'Reset scheduling discipline, prioritisation logic, and release rules.',
      'Tighten flow control between order intake, prepress, press, finishing, and dispatch.',
      'Use daily performance reviews to surface slippage early.',
    ],
    [
      'Institutionalise faster, more reliable client turnaround.',
      'Treat operational agility as a differentiator in the client value proposition.',
      'Link turnaround performance to executive margin and service reviews.',
    ]
  ),

  pp_specification_change_control: makeRoadmap(
    'Specification Failure Diagnostic',
    'Control Stabilisation',
    'Right-First-Time Governance',
    [
      'Map where specification, artwork, proofing, version control, job tickets, and approvals are failing.',
      'Quantify rerun risk and client dispute exposure caused by weak controls.',
      'Create one ownership trail for specification and release decisions.',
    ],
    [
      'Harden change control, approval gates, and version discipline.',
      'Reset role clarity between commercial, prepress, planning, and production teams.',
      'Escalate recurring specification failures with visible ownership.',
    ],
    [
      'Embed right-first-time specification governance as standard practice.',
      'Reduce reruns by institutionalising release-control discipline.',
      'Position specification integrity as a quality, margin, and trust lever.',
    ]
  ),

  pp_capacity_bottleneck_balance: makeRoadmap(
    'Capacity & Setup Diagnostic',
    'Utilisation Recovery',
    'Productive Capacity Discipline',
    [
      'Measure setup loss, changeover inefficiency, net productive hours, and effective press or finishing utilisation.',
      'Identify where capacity is being lost before value is created.',
      'Build one executive view of setup, loading, bottleneck movement, and productive hours by asset.',
    ],
    [
      'Execute focused setup-time reduction and smarter scheduling interventions.',
      'Stabilise utilisation discipline across press and finishing assets.',
      'Review productive hours weekly at plant leadership level.',
    ],
    [
      'Institutionalise higher effective capacity without adding avoidable cost.',
      'Link productive utilisation to turnaround, margin, and service performance.',
      'Use asset productivity as a leadership-controlled growth lever.',
    ]
  ),

  pp_waste_rework: makeRoadmap(
    'Waste & Margin Diagnostic',
    'Operational Recovery',
    'Right-First-Time Discipline',
    [
      'Quantify waste, spoilage, reruns, and setup-related loss by line and asset.',
      'Identify the highest-value sources of avoidable margin erosion.',
      'Create daily visibility of waste and rework performance at leadership level.',
    ],
    [
      'Drive owner-led recovery on the biggest waste pools.',
      'Tighten process discipline around setup, approval, and execution.',
      'Use daily huddles to keep recovery actions visible and current.',
    ],
    [
      'Embed right-first-time standards into production management.',
      'Connect waste reduction directly to gross margin recovery.',
      'Position waste discipline as a permanent operating standard.',
    ]
  ),

  pp_turnaround_velocity: makeRoadmap(
    'Velocity & Queue Diagnostic',
    'Flow Stabilisation',
    'Delivery Agility',
    [
      'Map queue time, scheduling loss, and handoff friction across the job flow.',
      'Quantify the commercial impact of slow turnaround.',
      'Build leadership visibility on planning, queue, and on-time delivery performance.',
    ],
    [
      'Reset scheduling discipline and prioritisation logic.',
      'Tighten flow control between planning, press, and finishing.',
      'Use daily performance reviews to surface slippage early.',
    ],
    [
      'Institutionalise faster, more reliable client turnaround.',
      'Treat operational agility as a differentiator in the client value proposition.',
      'Link turnaround performance to executive margin and service reviews.',
    ]
  ),

  pp_specification_control: makeRoadmap(
    'Specification Failure Diagnostic',
    'Control Stabilisation',
    'Right-First-Time Governance',
    [
      'Map where specification, artwork, proofing, and approvals are failing.',
      'Quantify rerun risk and client dispute exposure caused by weak controls.',
      'Create one ownership trail for specification and release decisions.',
    ],
    [
      'Harden change control, approval gates, and version discipline.',
      'Reset role clarity between commercial, prepress, and production teams.',
      'Escalate recurring specification failures with visible ownership.',
    ],
    [
      'Embed right-first-time specification governance as standard practice.',
      'Reduce reruns by institutionalising release control discipline.',
      'Position specification integrity as a quality and margin lever.',
    ]
  ),

  pp_press_utilisation: makeRoadmap(
    'Capacity & Setup Diagnostic',
    'Utilisation Recovery',
    'Productive Capacity Discipline',
    [
      'Measure setup loss, changeover inefficiency, and effective press utilisation.',
      'Identify where capacity is being lost before value is created.',
      'Build one executive view of setup, loading, and productive hours by asset.',
    ],
    [
      'Execute focused setup-time reduction and smarter scheduling interventions.',
      'Stabilise utilisation discipline across press and finishing assets.',
      'Review productive hours weekly at plant leadership level.',
    ],
    [
      'Institutionalise higher effective capacity without adding avoidable cost.',
      'Link productive utilisation to turnaround, margin, and service performance.',
      'Use asset productivity as a leadership-controlled growth lever.',
    ]
  ),

  mfg_product_margin_protection: makeRoadmap(
    'Margin Leakage Diagnostic',
    'Commercial & Cost Recovery',
    'Margin Discipline Institutionalised',
    [
      'Build a margin-leakage waterfall across product family, customer, plant, and cause.',
      'Separate strategic mix decisions, commercial leakage, and operational erosion with quantified financial impact.',
      'Create one executive view of realised contribution margin, complexity load, and standard-cost drift.',
    ],
    [
      'Tighten pricing recovery, discount discipline, and product/customer mix governance on the value pools carrying the greatest margin risk.',
      'Intervene on material variance, labour absorption, and rework pools with explicit owner accountability.',
      'Review realised margin contribution weekly or monthly at leadership level, not only period-end finance close.',
    ],
    [
      'Embed product-margin governance as a standing executive discipline.',
      'Link product economics directly to plant loading, service performance, and working-capital deployment.',
      'Use portfolio margin quality to steer growth and manufacturing strategy.',
    ]
  ),

  mfg_schedule_delivery_velocity: makeRoadmap(
    'Flow & Planning Diagnostic',
    'Schedule Recovery',
    'Reliable Delivery Discipline',
    [
      'Map MPS, MRP, finite-loading, setup loss, supplier variability, and dispatch delay across the end-to-end flow.',
      'Separate planning-system instability from true execution loss.',
      'Create daily visibility on OTIF, schedule attainment, and expediting pressure.',
    ],
    [
      'Reset frozen-zone discipline, practical capacity assumptions, and escalation rules around real constraints.',
      'Stabilise schedule control at the lines, suppliers, and dispatch points carrying the most value at risk.',
      'Track recovery of delivery velocity through recurring plant and leadership reviews.',
    ],
    [
      'Embed delivery reliability as a managed operating rhythm, not a reactive firefighting response.',
      'Link schedule adherence directly to commercial credibility, plant loading, and working-capital protection.',
      'Use delivery velocity as a core steering measure across the manufacturing system.',
    ]
  ),

  mfg_quality_specification_control: makeRoadmap(
    'Quality-System Diagnostic',
    'Specification & Process Recovery',
    'Right-First-Time Discipline',
    [
      'Map engineering-change, BOM, routing, calibration, and process-control failures by product family and line.',
      'Quantify COPQ, first-pass yield loss, defect Pareto, and recurrence exposure.',
      'Create one ownership trail for quality escapes and unresolved RCCA actions.',
    ],
    [
      'Tighten specification governance, work-instruction adherence, and corrective-action closure discipline.',
      'Intervene on the processes and products generating the highest quality-cost exposure.',
      'Review quality-system recovery through visible plant and leadership cadences.',
    ],
    [
      'Institutionalise right-first-time control as a standard operating discipline.',
      'Link first-pass quality, recurrence prevention, and process compliance directly to margin and service outcomes.',
      'Use quality-system integrity as a durable competitive advantage.',
    ]
  ),

  mfg_asset_oee_capacity: makeRoadmap(
    'OEE & Capacity Diagnostic',
    'Asset Recovery',
    'Productive Capacity Discipline',
    [
      'Break OEE into availability, performance, and quality-rate losses by asset, line, and shift.',
      'Identify whether changeovers, minor stoppages, starvation, operator variability, or cross-site imbalance are constraining output.',
      'Create one executive view of practical capacity and asset-productivity loss.',
    ],
    [
      'Execute focused recovery on the highest-value downtime, speed-loss, and balance issues.',
      'Rebalance assets, cells, or plant loading around practical rather than theoretical capacity.',
      'Track productive-capacity recovery through recurring plant and executive reviews.',
    ],
    [
      'Institutionalise OEE and asset productivity as core operating disciplines.',
      'Connect productive capacity directly to delivery reliability, margin quality, and inventory efficiency.',
      'Use asset and network balance visibility to sustain durable manufacturing performance.',
    ]
  ),

  mfg_bottleneck_throughput: makeRoadmap(
    'Constraint Diagnostic',
    'Flow Recovery',
    'Throughput Discipline',
    [
      'Quantify the true throughput bottleneck and its lost output value.',
      'Map where flow is breaking down around the primary constraint.',
      'Build a single operational view of constraint performance.',
    ],
    [
      'Drive targeted interventions on the bottleneck and supporting flow losses.',
      'Align planning and staffing around the real throughput constraint.',
      'Install daily review discipline focused on output recovery.',
    ],
    [
      'Embed throughput management as a recurring leadership routine.',
      'Use constraint visibility to prevent future flow degradation.',
      'Link throughput gains to executive margin and service reviews.',
    ]
  ),

  mfg_quality_source: makeRoadmap(
    'Quality Failure Diagnostic',
    'Control at Source',
    'Defect Prevention Discipline',
    [
      'Map defect creation points, scrap losses, and quality escapes.',
      'Quantify cost-of-poor-quality exposure with executive visibility.',
      'Identify the highest-value quality control gaps at source.',
    ],
    [
      'Stabilise the most material quality failure points.',
      'Reinforce owner accountability where defects originate.',
      'Reset review cadence around first-pass quality and rework reduction.',
    ],
    [
      'Embed quality-at-source into the operating model.',
      'Link quality prevention directly to margin protection.',
      'Use defect-prevention discipline as a strategic reliability lever.',
    ]
  ),

  mfg_supply_chain_exposure: makeRoadmap(
    'Supply Risk Diagnostic',
    'Continuity Stabilisation',
    'Resilient Supply Discipline',
    [
      'Map supplier, lead-time, and inventory vulnerabilities.',
      'Quantify production and customer risk linked to supply exposure.',
      'Create a single executive view of critical supply constraints.',
    ],
    [
      'Stabilise the most material supply risks through targeted interventions.',
      'Tighten planning and inventory decision discipline.',
      'Institute recurring supply-risk reviews at leadership level.',
    ],
    [
      'Embed resilience into sourcing, planning, and stock governance.',
      'Use supply reliability as a margin and delivery protection mechanism.',
      'Position supply continuity as an executive control area, not an exception report.',
    ]
  ),

  mfg_oee_capacity: makeRoadmap(
    'OEE Diagnostic',
    'Capacity Recovery',
    'Asset Productivity Discipline',
    [
      'Break OEE losses into actionable availability, performance, and quality drivers.',
      'Quantify capacity lost through downtime, speed loss, and quality failure.',
      'Build a practical-capacity dashboard for executive review.',
    ],
    [
      'Attack the highest-value downtime and speed losses.',
      'Introduce owner-level discipline around asset productivity recovery.',
      'Track effective capacity weekly through plant and executive reviews.',
    ],
    [
      'Institutionalise asset productivity as a core operating discipline.',
      'Connect capacity recovery to margin and customer service performance.',
      'Use OEE visibility to sustain operational excellence.',
    ]
  ),

  con_portfolio_margin_erosion: makeRoadmap(
    'Portfolio Margin Diagnostic',
    'Tender & Commercial Recovery',
    'Portfolio Margin Discipline',
    [
      'Build a portfolio view of tender risk, project selection quality, forecast margin, and current exposure.',
      'Separate wrong-fit work, under-bidding, central overhead pressure, and execution leakage.',
      'Create one executive view of margin at risk by project, client, package, and business unit.',
    ],
    [
      'Tighten bid/no-bid governance, tender review, risk pricing, and commercial escalation rules.',
      'Intervene on projects and clients carrying the greatest structural margin risk.',
      'Review portfolio margin quality through recurring executive governance.',
    ],
    [
      'Embed portfolio margin discipline across tendering, execution, commercial recovery, and cash conversion.',
      'Standardise project-selection and margin-at-risk reviews across regions or business units.',
      'Use portfolio margin quality as a strategic steering metric.',
    ]
  ),

  con_commercial_leakage_claims: makeRoadmap(
    'Variation & Claim Diagnostic',
    'Commercial Control Recovery',
    'Entitlement Discipline',
    [
      'Map outstanding variations, claims, approvals, notices, and unresolved entitlement risk.',
      'Quantify commercial value at risk from weak variation governance.',
      'Create a single executive view of claim exposure and status.',
    ],
    [
      'Strengthen evidence, notice, approval, and escalation discipline for change events.',
      'Accelerate recovery on high-value unresolved claims.',
      'Review entitlement status weekly through leadership forums.',
    ],
    [
      'Institutionalise stronger change and claim governance.',
      'Use entitlement visibility to protect realised project value.',
      'Position variation discipline as a core project-commercial capability.',
    ]
  ),

  con_operational_delivery_risk: makeRoadmap(
    'Site Execution Diagnostic',
    'Productivity Recovery',
    'Predictable Site Delivery',
    [
      'Map site productivity loss, subcontractor performance, idle plant, quality errors, and supervision gaps.',
      'Identify where operational execution failure is eroding project margin and schedule reliability.',
      'Create one site-control view for the most exposed projects or packages.',
    ],
    [
      'Tighten supervision cadence, subcontractor coordination, plant utilisation, and short-interval control.',
      'Intervene on packages carrying the greatest productivity and margin risk.',
      'Link site recovery actions directly to margin forecast and milestone performance.',
    ],
    [
      'Embed site execution discipline as a repeatable operating rhythm.',
      'Standardise productivity, quality, and subcontractor review cadence across projects.',
      'Use site reliability as a core commercial protection lever.',
    ]
  ),

  con_schedule_coordination_slippage: makeRoadmap(
    'Critical-Path Diagnostic',
    'Programme Stabilisation',
    'Predictable Schedule Discipline',
    [
      'Map critical-path slippage and milestone risk across the project portfolio.',
      'Quantify the delivery and cash implications of current delays.',
      'Create executive visibility on the most schedule-exposed projects.',
    ],
    [
      'Tighten short-interval control and milestone governance.',
      'Link site-level actions to actual schedule recovery drivers.',
      'Review slippage weekly with visible ownership and escalation.',
    ],
    [
      'Embed schedule discipline as a repeatable project control rhythm.',
      'Use critical-path visibility to drive predictable delivery.',
      'Position programme reliability as a commercial differentiator.',
    ]
  ),

  con_cashflow_certification_exposure: makeRoadmap(
    'Project Cash Diagnostic',
    'Cash Control Recovery',
    'Liquidity Discipline',
    [
      'Map billing, certification, valuation, retention, and collection blockages across live projects.',
      'Quantify cash exposure linked to delayed certificates, WIP, retentions, and billing weakness.',
      'Create weekly visibility on the most exposed contracts.',
    ],
    [
      'Tighten billing, certification, valuation, and collection discipline with clear ownership.',
      'Escalate project cash issues before liquidity pressure compounds.',
      'Connect project controls directly to cash realisation.',
    ],
    [
      'Institutionalise project cash governance across the portfolio.',
      'Use cash visibility as a standard executive project control measure.',
      'Protect liquidity through disciplined project-commercial follow-through.',
    ]
  ),

  con_project_margin: makeRoadmap(
    'Project Margin Diagnostic',
    'Commercial Recovery',
    'Margin Discipline Institutionalised',
    [
      'Map margin leakage across live projects and major cost categories.',
      'Quantify the most material sources of commercial erosion.',
      'Create weekly executive visibility on exposed projects.',
    ],
    [
      'Drive owner-led recovery on projects with the greatest margin pressure.',
      'Tighten cost control, package governance, and site accountability.',
      'Use recurring reviews to prevent further leakage.',
    ],
    [
      'Embed stronger project-commercial discipline across the portfolio.',
      'Link project margin visibility to executive P&L governance.',
      'Position predictable margin delivery as a core operating standard.',
    ]
  ),

  con_schedule_slippage: makeRoadmap(
    'Critical-Path Diagnostic',
    'Programme Stabilisation',
    'Predictable Schedule Discipline',
    [
      'Map critical-path slippage and milestone risk across the project portfolio.',
      'Quantify the delivery and cash implications of current delays.',
      'Create executive visibility on the most schedule-exposed projects.',
    ],
    [
      'Tighten short-interval control and milestone governance.',
      'Link site-level actions to actual schedule recovery drivers.',
      'Review slippage weekly with visible ownership and escalation.',
    ],
    [
      'Embed schedule discipline as a repeatable project control rhythm.',
      'Use critical-path visibility to drive predictable delivery.',
      'Position programme reliability as a commercial differentiator.',
    ]
  ),

  con_variations_claims: makeRoadmap(
    'Variation & Claim Diagnostic',
    'Commercial Control Recovery',
    'Entitlement Discipline',
    [
      'Map outstanding variations, claims, approvals, and unresolved entitlement risk.',
      'Quantify commercial value at risk from weak variation governance.',
      'Create a single executive view of claim exposure and status.',
    ],
    [
      'Strengthen evidence, approval, and escalation discipline for change events.',
      'Accelerate recovery on high-value unresolved claims.',
      'Review entitlement status weekly through leadership forums.',
    ],
    [
      'Institutionalise stronger change and claim governance.',
      'Use entitlement visibility to protect realised project value.',
      'Position variation discipline as a core project-commercial capability.',
    ]
  ),

  con_cashflow_controls: makeRoadmap(
    'Project Cash Diagnostic',
    'Cash Control Recovery',
    'Liquidity Discipline',
    [
      'Map billing, certification, and collection blockages across live projects.',
      'Quantify cash exposure linked to delayed certificates, retentions, and billing weakness.',
      'Create weekly visibility on the most exposed contracts.',
    ],
    [
      'Tighten billing, certification, and collection discipline with clear ownership.',
      'Escalate project cash issues before liquidity pressure compounds.',
      'Connect project controls directly to cash realisation.',
    ],
    [
      'Institutionalise project cash governance across the portfolio.',
      'Use cash visibility as a standard executive project control measure.',
      'Protect liquidity through disciplined project-commercial follow-through.',
    ]
  ),

  ag_yield_performance: makeRoadmap(
    'Yield-Gap Diagnostic',
    'Operational Timing Recovery',
    'Disciplined Yield Realisation',
    [
      'Quantify potential versus achieved yield by crop, enterprise, region, or farm and split the gap between controllable and external causes.',
      'Map planting, spraying, harvesting, labour, machinery, and post-harvest timing performance on the highest-value units.',
      'Create one executive view of where yield is being lost across the cycle.',
    ],
    [
      'Tighten execution on the critical operating windows carrying the greatest value at risk.',
      'Intervene on labour, machinery, pest/disease, and post-harvest failures with visible owner accountability.',
      'Track yield-recovery actions through weekly or seasonal farm reviews.',
    ],
    [
      'Embed yield-realisation control as a recurring agricultural operating discipline.',
      'Link field execution directly to realised margin, storage performance, and cash expectations.',
      'Use yield-gap visibility to sustain better decisions across future seasons.',
    ]
  ),

  ag_margin_cost_control: makeRoadmap(
    'Margin Waterfall Diagnostic',
    'Enterprise & Cost Recovery',
    'Gross-Margin Discipline',
    [
      'Build a gross-margin waterfall per hectare or per animal across yield, price, input variance, and waste/shrinkage.',
      'Separate enterprise-mix decisions from farm-execution issues with quantified financial impact.',
      'Create one executive view of contribution margin, input efficiency, and overhead absorption by enterprise.',
    ],
    [
      'Tighten land allocation, enterprise selection, procurement leverage, and unit-cost discipline where value is most exposed.',
      'Intervene on the cost pools and product/market decisions carrying the greatest margin risk.',
      'Track realised gross-margin recovery through recurring leadership reviews.',
    ],
    [
      'Embed gross-margin governance as a standing agricultural leadership discipline.',
      'Link enterprise economics directly to seasonal execution, working capital, and risk decisions.',
      'Use realised margin per hectare or per animal to steer future portfolio choices.',
    ]
  ),

  ag_risk_management: makeRoadmap(
    'Risk-Layering Diagnostic',
    'Resilience Recovery',
    'Integrated Risk Discipline',
    [
      'Map weather, biological, market, and counterparty risk with quantified financial exposure.',
      'Stress-test mitigation infrastructure, hedging, insurance, diversification, and claims recovery logic.',
      'Create one leadership view of controllable versus external agricultural risk.',
    ],
    [
      'Tighten risk-mitigation actions on the farms, enterprises, and exposures carrying the greatest value at risk.',
      'Strengthen hedging, insurance, and biosecurity disciplines with explicit owner accountability.',
      'Track risk-reduction actions through recurring seasonal or monthly reviews.',
    ],
    [
      'Embed agricultural risk layering as a standard leadership system.',
      'Link resilience decisions directly to expected margin, cash, and portfolio stability outcomes.',
      'Use risk visibility to improve future seasonal planning and diversification choices.',
    ]
  ),

  ag_working_capital_cash_cycle: makeRoadmap(
    'Seasonal Cash Diagnostic',
    'Cash-Cycle Recovery',
    'Liquidity Timing Discipline',
    [
      'Map pre-season funding peaks, inventory carrying cost, harvest timing, storage, and buyer-payment exposure across the cycle.',
      'Quantify where drying, grading, packing, sale timing, or lease timing is trapping working capital.',
      'Create one view of liquidity timing by crop, enterprise, or farm.',
    ],
    [
      'Tighten harvest-to-realisation decisions, buyer terms, inventory discipline, and capital phasing on the most exposed enterprises.',
      'Intervene on cash-cycle bottlenecks with visible owner accountability.',
      'Track liquidity recovery through recurring finance and operating reviews.',
    ],
    [
      'Embed seasonal cash planning as a standing agricultural operating discipline.',
      'Link liquidity timing directly to yield, margin, and off-take decisions.',
      'Use funding-headroom visibility to support more resilient portfolio decisions.',
    ]
  ),

  hc_private_practice_operations: makeRoadmap(
    'Private Practice Workflow Diagnostic',
    'Practice Control Recovery',
    'Disciplined Practice Operating Model',
    [
      'Map appointment scheduling, patient file completeness, claims documentation, billing follow-up, debtor control, and front-office workflow.',
      'Separate clinical workload from avoidable administrative friction that should be handled through clearer practice workflows.',
      'Create one practice dashboard covering appointment utilisation, patient waiting time, claims status, billing delays, and cash-flow visibility.',
    ],
    [
      'Tighten front-office scheduling, patient follow-up, file completeness, claims submission, billing follow-up, and debtor escalation.',
      'Clarify role ownership between reception, clinical staff, billing, finance, and practice management.',
      'Track weekly recovery using appointment utilisation, patient administration quality, claims follow-up, debtor control, and service quality.',
    ],
    [
      'Embed a disciplined private-practice operating model that protects doctor time, patient experience, and cash conversion.',
      'Standardise patient administration, claims documentation, billing follow-up, and management reporting rhythms.',
      'Use practice-level visibility to sustain better service quality, staff workload balance, and cash-flow control.',
    ]
  ),

  hc_clinic_access_flow: makeRoadmap(
    'Clinic Access Diagnostic',
    'Flow & Scheduling Recovery',
    'Reliable Clinic Operating Rhythm',
    [
      'Map patient access, booking flow, triage, consultation-room utilisation, waiting times, and follow-up appointment discipline.',
      'Separate true capacity shortage from booking friction, queue-management failure, and avoidable handoff delays.',
      'Create daily visibility on patient throughput, no-shows, staff loading, waiting time, and unresolved follow-ups.',
    ],
    [
      'Tighten appointment booking, triage, nurse/doctor scheduling, room allocation, and patient communication.',
      'Intervene on the clinic-flow bottlenecks creating waiting-time pressure and poor service experience.',
      'Track access reliability and waiting-time recovery through visible daily or weekly operating reviews.',
    ],
    [
      'Embed clinic access and patient-flow control as a standard operating discipline.',
      'Standardise review rhythms for booking quality, consultation flow, follow-ups, no-shows, and staff loading.',
      'Use access reliability to improve patient experience, productive capacity, and service consistency.',
    ]
  ),

  hc_hospital_capacity_flow: makeRoadmap(
    'Hospital Flow Diagnostic',
    'Capacity & Discharge Recovery',
    'Reliable Facility Throughput',
    [
      'Map theatres, beds, diagnostics, consultation rooms, discharge planning, and patient-journey bottlenecks on the most exposed services.',
      'Separate true capacity shortage from scheduling failure, handoff delay, and avoidable flow disruption.',
      'Create daily visibility on cancellations, turnover time, bed blocking, ED throughput, and waiting-list pressure.',
    ],
    [
      'Tighten scheduling, discharge, and inter-department coordination on the most exposed services.',
      'Intervene on the bottlenecks destroying both access and economic performance.',
      'Track flow recovery through visible operational and executive review cadence.',
    ],
    [
      'Embed patient-flow and facility-capacity control as a recurring operating discipline.',
      'Link throughput reliability directly to patient experience, contribution, and staff productivity.',
      'Use flow visibility to sustain better access and better economics together.',
    ]
  ),

  hc_revenue_cycle_cash: makeRoadmap(
    'Revenue-Cycle Diagnostic',
    'Cash Conversion Recovery',
    'Disciplined Funding Control',
    [
      'Map authorisation, coding, denial, billing, claims follow-up, co-payment, patient-account aging, and collection leakage across the cycle.',
      'Quantify where revenue is delayed, denied, or lost after care delivery.',
      'Create one leadership view of cash-conversion weakness by practice, clinic, service, payer, or account type.',
    ],
    [
      'Tighten coding, authorisation, billing, claims follow-up, and collection control where the greatest value is at risk.',
      'Intervene on the root causes of denials, disputed claims, slow cash realisation, and patient-account aging.',
      'Track revenue-cycle recovery through recurring finance and operating reviews.',
    ],
    [
      'Embed revenue-cycle control as a standard healthcare operating discipline.',
      'Link cash conversion directly to contribution protection and working-capital resilience.',
      'Use funding visibility to sustain better service and stronger financial control.',
    ]
  ),

  hc_clinical_quality_safety: makeRoadmap(
    'Quality & Safety Diagnostic',
    'Clinical Governance Recovery',
    'Disciplined Care Quality Model',
    [
      'Map clinical quality and safety variance by facility, specialty, department, or practice.',
      'Separate system-level governance weakness from clinician-level or service-line variability.',
      'Create one executive view of quality, safety, documentation quality, and high-risk care variation.',
    ],
    [
      'Tighten protocol adherence, clinical documentation, governance, and escalation on the highest-risk services.',
      'Intervene on the quality failures driving both patient harm and economic leakage.',
      'Track clinical recovery through visible facility, practice, or executive reviews.',
    ],
    [
      'Embed clinical governance and safety discipline as a recurring operating rhythm.',
      'Link quality, reputation, and contribution protection directly in leadership reviews.',
      'Use outcome transparency to sustain better care and better economics together.',
    ]
  ),

  hc_margin_case_contribution: makeRoadmap(
    'Contribution & Funding Diagnostic',
    'Case-Economics Recovery',
    'Disciplined Contribution Model',
    [
      'Build a contribution waterfall per case, admission, consultation, specialty, service line, or patient panel.',
      'Separate payer mix, tariff, direct-cost leakage, claim-rejection pressure, and service-line economics with quantified value at risk.',
      'Create one executive view of where contribution is structurally weak.',
    ],
    [
      'Tighten payer, tariff, case-costing, consumable, and service-line control on the most exposed services.',
      'Intervene on the case-mix, pricing, or cost-to-serve decisions destroying contribution quality.',
      'Track contribution recovery through recurring leadership reviews.',
    ],
    [
      'Embed contribution governance as a standing healthcare leadership discipline.',
      'Link service-line economics directly to quality, capacity, and funding decisions.',
      'Use contribution visibility to steer practice, clinic, specialty, or network strategy.',
    ]
  ),

  hc_medical_supplier_stock_distribution: makeRoadmap(
    'Medical Supply Diagnostic',
    'Stock & Debtor Recovery',
    'Reliable Supply Operating Model',
    [
      'Map stock availability, inventory turns, batch control, expiry risk, supplier lead times, debtor exposure, and distribution reliability.',
      'Identify where stockouts, expired stock, late delivery, or weak debtor control are eroding service performance and cash flow.',
      'Create one dashboard covering inventory health, order fulfilment, debtor days, and critical customer service levels.',
    ],
    [
      'Tighten procurement, batch control, expiry management, delivery planning, supplier follow-up, and collections cadence.',
      'Intervene on products, customers, or suppliers carrying the greatest service or cash-flow risk.',
      'Track stock, debtor, and delivery recovery through weekly operations and finance reviews.',
    ],
    [
      'Embed stock discipline, distribution reliability, and debtor control as one healthcare supply operating system.',
      'Standardise inventory, expiry, procurement, fulfilment, and collections review rhythms.',
      'Use supply reliability and debtor performance as executive control measures.',
    ]
  ),

  hc_pharmacy_margin_stock_control: makeRoadmap(
    'Pharmacy Operating Diagnostic',
    'Script & Stock Recovery',
    'Disciplined Pharmacy Control Model',
    [
      'Map script flow, dispensary workload, medicine stock turns, expired stock, front-shop performance, and margin leakage.',
      'Identify where prescription volume, stock discipline, shrinkage, or pricing gaps are eroding pharmacy contribution.',
      'Create daily visibility on scripts, stockouts, expiry risk, gross margin, and pharmacist capacity.',
    ],
    [
      'Tighten stock replenishment, schedule medicine control, expiry management, dispensary workflow, and front-shop economics.',
      'Intervene on stock, script, staffing, or margin issues carrying the greatest value at risk.',
      'Track pharmacy performance through recurring script, stock, margin, and service reviews.',
    ],
    [
      'Embed script flow, stock control, and margin discipline as the core operating system of the pharmacy.',
      'Standardise stock-turn, expiry, dispensary, front-shop, and margin review rhythms.',
      'Use stock turns, script throughput, shrinkage, and margin quality as management steering metrics.',
    ]
  ),

  hc_healthcare_admin_compliance: makeRoadmap(
    'Healthcare Administration Diagnostic',
    'Compliance & Reporting Recovery',
    'Administrative Control Model',
    [
      'Map administrative workflow, document control, compliance records, reporting gaps, role clarity, and staff workload.',
      'Identify where poor administration is creating patient confidentiality, billing, compliance, or management-visibility risk.',
      'Create a simple compliance and management dashboard covering open actions, missing documents, reporting delays, and workflow bottlenecks.',
    ],
    [
      'Tighten role accountability, document control, reporting cadence, patient confidentiality processes, and management action tracking.',
      'Intervene on the administrative bottlenecks creating the greatest risk to compliance, cash flow, or patient trust.',
      'Track administrative recovery through weekly management reviews and action ownership.',
    ],
    [
      'Embed healthcare administration and compliance visibility as a core operating-control layer.',
      'Standardise administrative workflow, documentation, reporting, and compliance review rhythms.',
      'Use administrative discipline to protect patient trust, compliance posture, cash flow, and leadership visibility.',
    ]
  ),

  hc_operational_capacity_flow: makeRoadmap(
    'Healthcare Flow Diagnostic',
    'Workflow & Capacity Recovery',
    'Disciplined Care Flow Model',
    [
      'Map patient flow, scheduling, consultation capacity, diagnostic bottlenecks, documentation quality, and revenue-cycle pressure in the specific care setting.',
      'Separate true care-capacity shortage from administrative friction, scheduling weakness, or workflow breakdown.',
      'Build daily visibility on patient throughput, cancellations, waiting pressure, claims status, and management actions.',
    ],
    [
      'Tighten scheduling, handoffs, documentation, billing, and operating reviews around the real bottlenecks.',
      'Intervene on the workflows damaging patient experience, productive capacity, cash conversion, or staff workload.',
      'Track recovery through recurring healthcare operating reviews.',
    ],
    [
      'Embed patient-flow and capacity control as a care-quality and economic control system.',
      'Standardise review rhythms around workflow reliability, patient experience, capacity, and cash conversion.',
      'Use flow reliability to improve patient experience, productive capacity, and financial control.',
    ]
  ),

  en_project_margin_irr: makeRoadmap(
    'Economics & Yield Diagnostic',
    'IRR Recovery',
    'Disciplined Project-Economics Model',
    [
      'Build a base-case to current-case IRR waterfall across projects, technologies, and causes of erosion.',
      'Separate resource under-performance, curtailment, degradation, O&M overrun, and commercial leakage with quantified value at risk.',
      'Create one executive view of project economics under pressure.',
    ],
    [
      'Tighten interventions on the projects where yield, cost, or contract design is destroying return quality.',
      'Intervene on the highest-value economics leakages with explicit owner accountability.',
      'Track IRR recovery through visible portfolio reviews.',
    ],
    [
      'Embed project-economics governance as a standing portfolio discipline.',
      'Link technology, site, PPA, and O&M choices directly to realised return quality.',
      'Use economics visibility to steer future development and diversification strategy.',
    ]
  ),

  en_schedule_commissioning: makeRoadmap(
    'Delay & Handover Diagnostic',
    'Delivery Recovery',
    'Disciplined Commissioning Model',
    [
      'Map permitting, grid, EPC, weather-window, and commissioning delay across the portfolio.',
      'Separate regulatory, contractor, weather, and handover causes of slippage.',
      'Create one executive view of delivery certainty at project level.',
    ],
    [
      'Tighten critical-path control on the projects with the greatest schedule and commissioning exposure.',
      'Intervene on grid-interface, EPC, and final-acceptance failures with visible accountability.',
      'Track schedule recovery through recurring project and portfolio reviews.',
    ],
    [
      'Embed schedule and commissioning control as a standard portfolio operating discipline.',
      'Link delivery certainty directly to economics and funding timing.',
      'Use delay visibility to improve future development and EPC governance.',
    ]
  ),

  en_contractual_claims: makeRoadmap(
    'Contractual Recovery Diagnostic',
    'Claims & Entitlement Recovery',
    'Disciplined Contract Performance',
    [
      'Audit claim, variation, warranty, curtailment-compensation, and insurance-recovery exposure by project.',
      'Quantify the gap between contractual entitlement and realised recovery.',
      'Create one executive view of where value is leaking through weak contract performance.',
    ],
    [
      'Tighten governance over claims, change events, performance guarantees, and recovery escalation.',
      'Intervene on the projects where contractual leakage is most severe.',
      'Track recovery through recurring project-commercial reviews.',
    ],
    [
      'Embed contractual-performance discipline as a standard portfolio capability.',
      'Link contract recovery directly to economics, liquidity, and supplier governance.',
      'Use contract visibility to improve future PPA, EPC, and OEM negotiation quality.',
    ]
  ),

  en_cashflow_transition: makeRoadmap(
    'Funding & Cash Diagnostic',
    'Liquidity Recovery',
    'Disciplined Funding Model',
    [
      'Map construction-phase funding peaks, drawdowns, guarantees, and operational cash-conversion exposure by project.',
      'Quantify where schedule delay, payment-security weakness, or O&M phasing is stretching headroom.',
      'Create one executive view of funding pressure and refinancing exposure.',
    ],
    [
      'Tighten milestone alignment, payment security, spare-parts working capital, and refinancing readiness with visible owner accountability.',
      'Intervene on the projects carrying the greatest liquidity risk.',
      'Track cash recovery through recurring finance and portfolio reviews.',
    ],
    [
      'Embed construction-to-operation cash discipline as a standard portfolio operating control.',
      'Link funding timing directly to schedule certainty, contract recovery, and long-term asset cash generation.',
      'Use headroom visibility to protect delivery continuity and return realisation.',
    ]
  ),

  margin_leakage: makeRoadmap(
    'Margin Leakage Diagnostic',
    'Recovery Execution',
    'Margin Discipline Embedded',
    [
      'Identify and quantify the top margin leakage points with line-item precision.',
      'Validate pricing discipline, cost expansion, waste, discount governance, and operational leakage.',
      'Create executive visibility on where margin is being lost and who owns recovery.',
    ],
    [
      'Execute targeted recovery on the largest leakage points with explicit owner accountability.',
      'Reset pricing, cost, and operational controls where loss is recurring.',
      'Review margin recovery weekly against financial impact.',
    ],
    [
      'Embed margin governance as a standing executive rhythm.',
      'Link margin recovery to operating reviews and leadership decisions.',
      'Use margin-quality visibility to prevent regression.',
    ]
  ),

  workflow_breakdown: makeRoadmap(
    'Workflow Diagnostic',
    'Execution Stabilisation',
    'Workflow Discipline Embedded',
    [
      'Map the end-to-end workflow and isolate the primary execution bottlenecks.',
      'Identify the critical handoffs causing delay, duplication, rework, or accountability failure.',
      'Create one leadership view of workflow blockers and service-level risk.',
    ],
    [
      'Stabilise critical handoffs and remove non-value-adding activities.',
      'Clarify accountable owners and escalation paths.',
      'Review workflow recovery through short-cycle operating cadences.',
    ],
    [
      'Embed workflow discipline into the operating model.',
      'Standardise handoff controls, service-level tracking, and accountability rules.',
      'Use workflow reliability as a core execution metric.',
    ]
  ),

  planning_failure: makeRoadmap(
    'Planning Assumption Diagnostic',
    'Planning Recovery',
    'Disciplined Planning Rhythm',
    [
      'Stress-test current planning assumptions against actual demand and capacity realities.',
      'Identify planning-to-execution gaps causing misalignment, delay, or waste.',
      'Create one leadership view of forecast, capacity, schedule, and delivery risk.',
    ],
    [
      'Realign planning cadence and forecasting processes to current operational truth.',
      'Close the largest planning-to-execution gaps with immediate corrective actions.',
      'Strengthen coordination between commercial, operational, and finance leadership.',
    ],
    [
      'Embed disciplined review mechanisms for forecast, schedule, and delivery adjustments.',
      'Standardise planning governance and escalation rules.',
      'Use planning accuracy as a leadership control metric.',
    ]
  ),

  capacity_constraint: makeRoadmap(
    'Capacity Diagnostic',
    'Constraint Recovery',
    'Capacity Discipline Embedded',
    [
      'Diagnose the root throughput or utilisation constraint with data-driven precision.',
      'Separate genuine capacity loss from demand pressure or scheduling inefficiency.',
      'Create one leadership view of constraint performance and availability risk.',
    ],
    [
      'Stabilise immediate availability, staffing, or delivery pressure points.',
      'Rebalance capacity allocation against strategic priorities and demand signals.',
      'Track constraint recovery through weekly operating reviews.',
    ],
    [
      'Embed capacity governance and constraint visibility into the operating model.',
      'Sequence improvement initiatives around the true operational bottleneck.',
      'Use utilisation and constraint performance as executive steering metrics.',
    ]
  ),

  compliance_risk: makeRoadmap(
    'Compliance Exposure Diagnostic',
    'Remediation Control',
    'Governance Discipline Embedded',
    [
      'Quantify immediate compliance exposure and prioritise highest-risk control gaps.',
      'Identify missing evidence, weak controls, overdue actions, and accountability gaps.',
      'Create one compliance action register with owner, due date, and residual-risk view.',
    ],
    [
      'Close critical compliance vulnerabilities with assigned executive owners.',
      'Escalate overdue or high-risk remediation items.',
      'Track compliance recovery through recurring governance reviews.',
    ],
    [
      'Embed compliance action tracking and control reviews into the operating rhythm.',
      'Standardise accountability for recurring compliance obligations.',
      'Use residual-risk visibility to prevent future exposure.',
    ]
  ),

  service_quality_risk: makeRoadmap(
    'Service Quality Diagnostic',
    'Service Recovery',
    'Quality-by-Design Model',
    [
      'Quantify the primary service and quality failure points impacting client or patient experience.',
      'Identify recurring rework, complaint, defect, delay, or delivery-failure patterns.',
      'Create one leadership view of service-quality risk and owner accountability.',
    ],
    [
      'Stabilise highest-impact client-facing issues to protect revenue and reputation.',
      'Reduce recurring failure patterns through root-cause elimination.',
      'Track service recovery against measurable client outcome and satisfaction KPIs.',
    ],
    [
      'Redesign service delivery control points to embed quality by design.',
      'Drive quality ownership and accountability across the full value chain.',
      'Use service quality as a core management and growth metric.',
    ]
  ),

  cash_flow_stress: makeRoadmap(
    'Cash Pressure Diagnostic',
    'Cash Control Recovery',
    'Working-Capital Discipline',
    [
      'Conduct a rapid diagnostic of debtors, creditors, working capital, and short-term liquidity pressure.',
      'Identify the largest cash blockages, overdue collections, payment risks, and forecasting gaps.',
      'Create one leadership view of cash exposure and immediate control actions.',
    ],
    [
      'Protect near-term liquidity through disciplined cash prioritisation and controls.',
      'Tighten collection, payment, and cash forecasting processes with executive oversight.',
      'Escalate major cash risks before they become liquidity constraints.',
    ],
    [
      'Embed forward-looking cash visibility and scenario planning.',
      'Standardise working-capital reviews and owner accountability.',
      'Use cash discipline as a core element of the operating model.',
    ]
  ),

  general_operational_pressure: makeRoadmap(
    'Rapid Diagnostic & Containment',
    'Execution Stabilisation',
    'Institutionalised Discipline',
    [
      'Translate the stated strategic goal into a clear 30 / 60 / 90-day intervention roadmap.',
      'Identify the highest-leverage leakage points, delays, or decision bottlenecks.',
      'Create a single source of truth dashboard that surfaces critical execution signals for leadership.',
    ],
    [
      'Execute targeted interventions at the largest value-leakage points with explicit owner accountability.',
      'Reset operating review cadences to focus on facts, metrics, and forward-looking actions.',
      'Drive disciplined follow-through on the highest-priority initiatives with weekly executive oversight.',
    ],
    [
      'Embed repeatable operating rhythms that sustain performance and prevent regression.',
      'Shift from reactive firefighting to proactive trend visibility and risk mitigation.',
      'Link all management reviews directly to measurable business outcomes and leadership ownership.',
    ]
  ),

  default: makeRoadmap(
    'Rapid Diagnostic & Containment',
    'Execution Stabilisation',
    'Institutionalised Discipline',
    [
      'Translate the stated strategic goal into a clear 30 / 60 / 90-day intervention roadmap.',
      'Identify the highest-leverage leakage points, delays, or decision bottlenecks.',
      'Create a single source of truth dashboard that surfaces critical execution signals for leadership.',
    ],
    [
      'Execute targeted interventions at the largest value-leakage points with explicit owner accountability.',
      'Reset operating review cadences to focus on facts, metrics, and forward-looking actions.',
      'Drive disciplined follow-through on the highest-priority initiatives with weekly executive oversight.',
    ],
    [
      'Embed repeatable operating rhythms that sustain performance and prevent regression.',
      'Shift from reactive firefighting to proactive trend visibility and risk mitigation.',
      'Link all management reviews directly to measurable business outcomes and leadership ownership.',
    ]
  ),
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
