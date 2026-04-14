import type { RecommendationSet } from './types';

const LIBRARY: Record<string, RecommendationSet> = {
  ps_conversion_delivery: {
    quickWins: [
      'Conduct a comprehensive audit of proposal conversion rates, scoping accuracy, and delivery turnaround across the active pipeline.',
      'Establish real-time executive visibility into billable utilisation, client delivery performance, and account-level profitability.',
      'Clarify and reinforce cross-functional role accountability across business development, solutioning, delivery, and account leadership.',
    ],
    priorities: [
      'Design and implement a robust commercial-to-delivery governance model for professional services execution.',
      'Strengthen proposal governance, delivery standards, and client economics review cadences at executive level.',
      'Institute weekly performance tracking of conversion rates, utilisation, delivery quality, and margins by account.',
    ],
  },
  ps_utilisation_economics: {
    quickWins: [
      'Create account-level visibility on billable recovery, utilisation mix, and realised contribution by service line.',
      'Stress-test retainer economics, scoping discipline, and pricing recovery across active clients.',
      'Identify where effort intensity is growing faster than fee recovery or client value realisation.',
    ],
    priorities: [
      'Reposition client economics and utilisation governance as core leadership steering measures.',
      'Tighten pricing, scoping, and recovery discipline across the professional services portfolio.',
      'Institutionalise weekly review of utilisation quality and margin realisation by account.',
    ],
  },
  ps_operating_model: {
    quickWins: [
      'Clarify role interfaces across sales, solutioning, delivery, and account leadership.',
      'Build one executive view that integrates pipeline health, utilisation, delivery quality, and client economics.',
      'Eliminate decision ambiguity in handoffs, escalation paths, and ownership of client outcomes.',
    ],
    priorities: [
      'Strengthen the operating model before growth amplifies control weakness.',
      'Install executive review rhythms that link leadership decisions directly to operating outcomes.',
      'Use role clarity and decision cadence as the foundation for scalable service delivery.',
    ],
  },
  pp_waste_rework: {
    quickWins: [
      'Quantify waste, reruns, and spoilage at job, press, and finishing level.',
      'Identify the three largest avoidable margin leaks caused by waste or rework.',
      'Install daily control on rerun causes, spoilage rates, and corrective owner actions.',
    ],
    priorities: [
      'Restore gross margin by treating waste and rework as executive control issues, not shop-floor noise.',
      'Assign owner-led recovery plans to the largest recurring waste pools.',
      'Institutionalise right-first-time discipline across the end-to-end print flow.',
    ],
  },
  pp_turnaround_velocity: {
    quickWins: [
      'Map job queue delays, planning bottlenecks, and late-stage handoff failures.',
      'Introduce daily visual scheduling and turnaround dashboards at plant leadership level.',
      'Stabilise the planning-to-press-to-finishing flow around actual capacity.',
    ],
    priorities: [
      'Treat turnaround velocity as a strategic client-retention lever.',
      'Use scheduling control and on-time delivery as core executive operating measures.',
      'Reduce avoidable queue time and hidden capacity loss across the full workflow.',
    ],
  },
  pp_specification_control: {
    quickWins: [
      'Audit artwork, specification, proofing, and approval failure points.',
      'Institute strict change-control and version-control governance before jobs reach press.',
      'Escalate recurring client-specification errors through a single accountability mechanism.',
    ],
    priorities: [
      'Build right-first-time specification control into the commercial and production workflow.',
      'Reduce rerun risk by hardening approval gates and job release discipline.',
      'Protect client trust by tightening specification integrity and change governance.',
    ],
  },
  pp_press_utilisation: {
    quickWins: [
      'Measure setup time, changeover loss, and usable press hours by asset.',
      'Attack the largest setup losses with focused reduction sprints.',
      'Re-sequence jobs to improve press loading and reduce hidden idle capacity.',
    ],
    priorities: [
      'Raise effective capacity through setup-time reduction and smarter utilisation governance.',
      'Use press productivity and finishing flow as margin levers, not just technical metrics.',
      'Link asset utilisation to executive review of turnaround and gross margin.',
    ],
  },
  mfg_bottleneck_throughput: {
    quickWins: [
      'Map the primary bottleneck and quantify lost throughput with hard operational data.',
      'Stabilise upstream and downstream flow around the true constraint.',
      'Launch rapid countermeasures on the highest-value throughput losses.',
    ],
    priorities: [
      'Treat throughput acceleration as a strategic value-creation programme.',
      'Align production planning, staffing, and maintenance around the true bottleneck.',
      'Install executive visibility on constraint performance and output recovery.',
    ],
  },
  mfg_quality_source: {
    quickWins: [
      'Quantify defect, scrap, and rework failure points at source.',
      'Contain the highest-impact quality escapes immediately.',
      'Reset quality ownership at the points where defects are created, not discovered later.',
    ],
    priorities: [
      'Embed quality-at-source as a core leadership discipline.',
      'Reduce cost-of-poor-quality through hard controls and visible accountability.',
      'Use first-pass quality and defect prevention as margin protection levers.',
    ],
  },
  mfg_supply_chain_exposure: {
    quickWins: [
      'Stress-test supplier risk, lead-time volatility, and inventory vulnerabilities.',
      'Map where material constraints are threatening throughput and customer delivery.',
      'Create executive visibility on the most material supply-chain exposures.',
    ],
    priorities: [
      'Strengthen supply continuity and lead-time control as a resilience agenda.',
      'Reduce operational fragility by rebalancing inventory, sourcing, and planning discipline.',
      'Move supply-chain risk from reactive firefighting into structured executive control.',
    ],
  },
  mfg_oee_capacity: {
    quickWins: [
      'Break down OEE losses into availability, performance, and quality components.',
      'Target the most material downtime and speed losses immediately.',
      'Build daily visibility on practical capacity recovery by line and asset.',
    ],
    priorities: [
      'Treat OEE and capacity underperformance as executive productivity issues.',
      'Raise asset productivity through disciplined visibility and ownership.',
      'Link effective capacity to monthly margin and service-level outcomes.',
    ],
  },
  con_project_margin: {
    quickWins: [
      'Map margin leakage by live project, package, and major cost driver.',
      'Identify where budget drift, procurement slippage, or execution waste is eroding project economics.',
      'Install weekly project commercial reviews on the most exposed jobs.',
    ],
    priorities: [
      'Protect project margin through disciplined cost control and owner-level accountability.',
      'Treat commercial control as a weekly operating discipline, not a month-end exercise.',
      'Escalate margin recovery on live projects with visible leadership sponsorship.',
    ],
  },
  con_schedule_slippage: {
    quickWins: [
      'Identify critical-path slippage and quantify the delivery and cash implications.',
      'Stabilise milestone governance and short-interval control on delayed projects.',
      'Link site actions directly to the schedule drivers that matter most.',
    ],
    priorities: [
      'Use critical-path visibility as a core executive control mechanism.',
      'Reduce schedule drift through disciplined site and project governance.',
      'Treat programme integrity as central to delivery credibility and cash protection.',
    ],
  },
  con_variations_claims: {
    quickWins: [
      'Audit current variations, claims, approvals, and unresolved commercial exposures.',
      'Tighten the evidence trail and approval discipline around change events.',
      'Escalate at-risk claims before value leakage becomes irreversible.',
    ],
    priorities: [
      'Treat variation and claim control as a commercial recovery engine.',
      'Strengthen governance over changes, approvals, and contractual entitlement.',
      'Use executive oversight to protect commercial value already earned on site.',
    ],
  },
  con_cashflow_controls: {
    quickWins: [
      'Map billing, certification, and collection blockages across live projects.',
      'Quantify cash exposure from retentions, delayed certificates, and weak billing cadence.',
      'Install weekly project cash reviews on the most exposed contracts.',
    ],
    priorities: [
      'Treat project cash flow as a first-order executive control measure.',
      'Tighten billing, certification, and collection discipline across the portfolio.',
      'Protect liquidity by linking project controls directly to cash realisation.',
    ],
  },

  mfg_product_margin_protection: {
    quickWins: [
      'Quantify product margin leakage by product family, customer, plant, and cause rather than treating all erosion as one manufacturing issue.',
      'Separate strategic mix, pricing under-recovery, discount leakage, material variance, labour absorption, and rework into one margin waterfall.',
      'Create executive visibility on where complexity, change frequency, and weak margin contribution are consuming capacity without adequate return.',
    ],
    priorities: [
      'Treat product margin protection as a portfolio and operating-system discipline, not only a plant-cost issue.',
      'Tighten product-mix, customer-economics, and pricing recovery decisions before weak work consumes more capacity.',
      'Use standard-cost drift and realised margin contribution as leadership steering measures across the manufacturing network.',
    ],
  },
  mfg_schedule_delivery_velocity: {
    quickWins: [
      'Map where MPS, MRP, finite loading, setup loss, supplier variability, and dispatch bottlenecks are destabilising schedule adherence.',
      'Separate planning-system instability from genuine shop-floor productivity loss.',
      'Build daily visibility on OTIF, schedule attainment, bottleneck movement, and expediting pressure.',
    ],
    priorities: [
      'Treat delivery velocity as the output of planning discipline, material readiness, and execution reliability together.',
      'Reset schedule control around real constraints, frozen-zone discipline, and practical capacity.',
      'Use schedule adherence and delivery velocity as executive operating measures, not only production-planning metrics.',
    ],
  },
  mfg_quality_specification_control: {
    quickWins: [
      'Audit engineering changes, BOM/version accuracy, routing discipline, work-instruction adherence, and first-pass yield by product family.',
      'Quantify COPQ, defect Pareto, non-conformance recurrence, and RCCA closure performance.',
      'Install visible control on the specification and process failures driving rework, concessions, and external quality risk.',
    ],
    priorities: [
      'Treat quality and specification control as an economic control system, not only a compliance requirement.',
      'Harden BOM, routing, calibration, gauge control, and process-discipline governance where value leakage is highest.',
      'Use first-pass quality and recurrence prevention as core margin-protection levers.',
    ],
  },
  mfg_asset_oee_capacity: {
    quickWins: [
      'Break OEE into availability, performance, and quality-rate losses by line, asset, and shift.',
      'Measure changeover loss, minor stoppages, waiting/starvation, and operator variability on constrained assets.',
      'Identify whether the real issue is line-level productivity, capacity balance across sites, or technology/process mismatch.',
    ],
    priorities: [
      'Use OEE and asset productivity as value-creation measures tied directly to margin, delivery, and working capital.',
      'Rebalance assets, cells, and plant loading around practical constraints rather than nominal capacity.',
      'Treat automation, skill dependency, and network capacity balance as leadership decisions, not only engineering topics.',
    ],
  },

  ag_yield_performance: {
    quickWins: [
      'Quantify the yield gap by crop, enterprise, or farm and split it between controllable execution loss and external environmental drag.',
      'Map planting, spraying, harvesting, labour, machinery, and post-harvest timing performance on the highest-value hectares or enterprises.',
      'Create visible control on the critical operating windows where yield is won or lost.',
    ],
    priorities: [
      'Treat yield performance as a structured operating and agronomic control issue, not only a seasonal outcome.',
      'Use timeliness, field execution, and post-harvest discipline to convert potential yield into realised output.',
      'Link yield-realisation governance directly to margin, storage, and cash expectations.',
    ],
  },
  ag_margin_cost_control: {
    quickWins: [
      'Build a gross-margin waterfall per hectare or per animal showing yield shortfall, price realisation variance, input variance, and waste/shrinkage.',
      'Separate enterprise-mix decisions from farm-execution issues so leadership can see where value is structurally weak.',
      'Create executive visibility on input efficiency, overhead absorption, and realised contribution by enterprise.',
    ],
    priorities: [
      'Treat unit cost and gross margin discipline as a portfolio and operating-system issue, not only a cost-accounting exercise.',
      'Tighten enterprise selection, land allocation, procurement leverage, and price-realisation discipline across the portfolio.',
      'Use realised gross margin per hectare or per animal as a core leadership steering metric.',
    ],
  },
  ag_risk_management: {
    quickWins: [
      'Map weather, biological, market, and counterparty risks with probability-weighted financial impact.',
      'Stress-test hedging, insurance, diversification, and biosecurity effectiveness on the most exposed enterprises.',
      'Create one leadership view of where controllable risk ends and external volatility begins.',
    ],
    priorities: [
      'Treat agricultural risk as a layered control system spanning field execution, climate exposure, market protection, and financial resilience.',
      'Strengthen mitigation infrastructure, hedging discipline, and claims recovery before the next adverse cycle hits.',
      'Use risk layering and resilience metrics as standard executive review items, not exception cases only.',
    ],
  },
  ag_working_capital_cash_cycle: {
    quickWins: [
      'Map seasonal funding peaks, inventory carrying cost, harvest-to-cash timing, and buyer payment terms across the cycle.',
      'Quantify where storage, drying, grading, packing, or sale-timing decisions are trapping working capital.',
      'Install visibility on cash-conversion timing by crop, farm, or enterprise.',
    ],
    priorities: [
      'Treat seasonal cash exposure as a planned operating discipline, not a surprise finance problem.',
      'Tighten harvest-to-realisation decisions, buyer terms, lease timing, and capital phasing against expected inflows.',
      'Use liquidity timing and funding headroom as core agricultural control measures alongside yield and margin.',
    ],
  },

  hc_clinical_quality_safety: {
    quickWins: [
      'Quantify quality and safety variance by facility, specialty, department, or practice and separate system issues from clinician-level variability.',
      'Map infections, readmissions, adverse events, protocol-adherence gaps, and handover failure on the highest-risk services.',
      'Create visible control on the clinical risks most likely to damage both outcomes and economics.',
    ],
    priorities: [
      'Treat clinical quality and patient safety as the first control system of the healthcare operating model.',
      'Use clinical governance, standardisation, and outcome transparency to reduce both harm and economic leakage.',
      'Link quality recovery directly to reputation, contribution margin, and network resilience.',
    ],
  },
  hc_margin_case_contribution: {
    quickWins: [
      'Build a contribution waterfall per case, admission, consultation, specialty, or patient panel including payer mix and direct-cost leakage.',
      'Separate case-mix and tariff issues from theatre, implant, drug, LOS, and claim-rejection leakage.',
      'Create executive visibility on where contribution is being destroyed by funding and cost-to-serve mismatch.',
    ],
    priorities: [
      'Treat contribution per case or patient as a strategic and operating-system control measure, not just a finance output.',
      'Tighten payer mix, tariff discipline, case costing, and formulary or consumable control where the value at risk is highest.',
      'Use contribution visibility to steer specialty mix, network design, and service-line investment.',
    ],
  },
  hc_operational_capacity_flow: {
    quickWins: [
      'Map theatres, beds, diagnostics, consultation rooms, discharge planning, and patient-journey bottlenecks on the most exposed services.',
      'Separate pure capacity shortage from scheduling failure, handoff delay, and avoidable flow disruption.',
      'Build daily visibility on cancellations, turnover time, bed blocking, ED throughput, and waiting-list pressure.',
    ],
    priorities: [
      'Treat patient flow and capacity utilisation as a clinical and economic control system together.',
      'Tighten scheduling, discharge, and inter-department coordination around the bottlenecks destroying access and contribution.',
      'Use flow reliability to improve both patient experience and productive capacity.',
    ],
  },
  hc_revenue_cycle_cash: {
    quickWins: [
      'Map authorisation delays, coding gaps, denials, billing errors, co-payment leakage, and patient account aging across the cycle.',
      'Quantify where revenue is being delayed, denied, or lost after care has already been delivered.',
      'Install visible control on the highest-value claim and collection failure points.',
    ],
    priorities: [
      'Treat the revenue cycle as a core healthcare operating discipline, not a back-office afterthought.',
      'Tighten coding, authorisation, billing, and collection governance where cash conversion is weakest.',
      'Link revenue-cycle control directly to working capital, contribution preservation, and funding resilience.',
    ],
  },
  en_project_margin_irr: {
    quickWins: [
      'Build a base-case to current-case IRR waterfall by project, technology, region, and cause of erosion.',
      'Separate resource under-performance, curtailment, degradation, O&M overrun, and contract-quality issues with quantified value at risk.',
      'Create executive visibility on where project economics are deteriorating before the full portfolio is affected.',
    ],
    priorities: [
      'Treat project economics and IRR realisation as a structured portfolio-control discipline, not only a model at financial close.',
      'Tighten technology, site, PPA, and procurement choices where they are creating avoidable margin dilution.',
      'Use project-economics visibility to steer future development, storage, and diversification decisions.',
    ],
  },
  en_schedule_commissioning: {
    quickWins: [
      'Map delay from permitting, land, grid connection, EPC execution, weather windows, and commissioning handover gaps.',
      'Separate regulatory, contractor, weather, and grid-interface causes instead of treating all delay as one schedule problem.',
      'Build visible control on the projects where delivery certainty is most exposed.',
    ],
    priorities: [
      'Treat schedule and commissioning control as a cross-functional portfolio discipline spanning development to operations.',
      'Tighten critical-path governance around grid interface, EPC accountability, and final acceptance readiness.',
      'Use delay visibility to protect both economics and funding timing.',
    ],
  },
  en_contractual_claims: {
    quickWins: [
      'Audit variation recovery, performance guarantees, curtailment compensation, insurance claims, and EPC/OEM contractual exposure.',
      'Quantify the gap between value or entitlement available and value actually recovered under contract.',
      'Escalate the projects where weak claims recovery is allowing avoidable economic loss to persist.',
    ],
    priorities: [
      'Treat contractual performance and claims recovery as a core value-protection system across the portfolio.',
      'Tighten governance over change events, compensation triggers, warranty recovery, and standard contract discipline.',
      'Use executive oversight to protect earned value and reduce contractual leakage.',
    ],
  },
  en_cashflow_transition: {
    quickWins: [
      'Map construction-phase funding peaks, drawdown timing, bonding exposure, and operational-phase cash conversion by project.',
      'Quantify where schedule delay, payment-security weakness, or O&M phasing is stressing funding headroom.',
      'Install visible control on the projects carrying the greatest liquidity and refinancing risk.',
    ],
    priorities: [
      'Treat construction-to-operation cash discipline as a first-order portfolio control issue.',
      'Tighten payment-security, milestone alignment, spare-parts working capital, and post-commissioning refinancing logic.',
      'Use funding-headroom visibility to protect delivery continuity and return realisation.',
    ],
  },
  margin_leakage: {
    quickWins: [
      'Identify and quantify the top three margin leakage points with line-item precision.',
      'Institute immediate controls to freeze non-essential cost expansion while leakage is validated.',
      'Validate pricing discipline, discount governance, and operational waste at the most granular level.',
    ],
    priorities: [
      'Launch a fact-based margin recovery programme with clear executive ownership and KPIs.',
      'Drive owner-level accountability for the largest leakage pools through structured workstreams.',
      'Embed weekly operating reviews that track margin recovery progress in real time.',
    ],
  },
  workflow_breakdown: {
    quickWins: [
      'Map the end-to-end workflow and isolate the primary execution bottlenecks.',
      'Stabilise critical handoff points and eliminate non-value-adding activities.',
      'Introduce short-cycle executive review routines to surface and resolve blockers immediately.',
    ],
    priorities: [
      'Redesign the operating model around the critical path to restore execution velocity.',
      'Clarify accountability across teams and functions with explicit RACI ownership.',
      'Implement service-level tracking and performance dashboards for turnaround and output quality.',
    ],
  },
  planning_failure: {
    quickWins: [
      'Stress-test current planning assumptions against actual demand and capacity realities.',
      'Realign planning cadence and forecasting processes to current operational truth.',
      'Close the largest planning-to-execution gaps with immediate corrective actions.',
    ],
    priorities: [
      'Rebuild the strategic planning model anchored in current operational and market facts.',
      'Strengthen coordination between commercial, operational, and finance leadership.',
      'Embed disciplined review mechanisms for forecast, schedule, and delivery adjustments.',
    ],
  },
  capacity_constraint: {
    quickWins: [
      'Diagnose the root throughput or utilisation constraint with data-driven precision.',
      'Separate genuine capacity loss from demand pressure or scheduling inefficiency.',
      'Stabilise immediate availability, staffing, or delivery pressure points.',
    ],
    priorities: [
      'Rebalance capacity allocation against strategic priorities and demand signals.',
      'Implement executive visibility dashboards on utilisation and constraint performance.',
      'Sequence improvement initiatives around the true operational bottleneck.',
    ],
  },
  compliance_risk: {
    quickWins: [
      'Quantify immediate compliance exposure and prioritise highest-risk control gaps.',
      'Close critical compliance vulnerabilities with assigned executive owners.',
      'Establish clear accountability for remediation of material compliance items.',
    ],
    priorities: [
      'Reinforce governance frameworks and control routines at board and executive level.',
      'Implement a structured compliance action register with rigorous tracking.',
      'Embed executive review discipline to monitor remediation progress and residual risk.',
    ],
  },
  service_quality_risk: {
    quickWins: [
      'Quantify the primary service and quality failure points impacting client experience.',
      'Stabilise highest-impact client-facing issues to protect revenue and reputation.',
      'Reduce recurring rework and failure patterns through root-cause elimination.',
    ],
    priorities: [
      'Redesign service delivery control points to embed quality by design.',
      'Drive quality ownership and accountability across the entire value chain.',
      'Track service recovery against measurable client outcome and satisfaction KPIs.',
    ],
  },
  cash_flow_stress: {
    quickWins: [
      'Conduct a rapid diagnostic of debtors, creditors, and working capital pressure points.',
      'Protect near-term liquidity through disciplined cash prioritisation and controls.',
      'Pause or defer non-essential cash commitments while preserving strategic initiatives.',
    ],
    priorities: [
      'Stabilise cash discipline as a core element of the operating model.',
      'Tighten collection, payment, and cash forecasting processes with executive oversight.',
      'Build forward-looking cash visibility and scenario planning capability.',
    ],
  },
  general_operational_pressure: {
    quickWins: [
      'Clarify the highest-impact execution pressure points with executive precision.',
      'Stabilise the most material operational risks through targeted interventions.',
      'Narrow leadership focus to the fewest, highest-leverage actions.',
    ],
    priorities: [
      'Develop a structured, time-bound recovery plan with clear executive sponsorship.',
      'Assign accountable owners and measurable KPIs for each priority workstream.',
      'Institute disciplined operating reviews to drive accountability and course correction.',
    ],
  },
};

export function recommendationLibrary(problemType: string): RecommendationSet {
  return LIBRARY[problemType] || LIBRARY.general_operational_pressure;
}
