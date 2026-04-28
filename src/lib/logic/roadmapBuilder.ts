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
  ps_consulting_advisory_delivery: makeRoadmap(
    'Advisory Engagement Diagnostic',
    'Scope & Delivery Control',
    'Scalable Consulting Delivery Model',
    [
      'Map the full consulting delivery path from lead source, diagnostic, proposal, statement of work, workshop, deliverables, and implementation support.',
      'Identify active engagements where scope creep, unclear deliverables, weak client decision rights, or poor handoff discipline are creating effort leakage.',
      'Create one executive view of proposal conversion, engagement profitability, delivery status, unresolved client actions, and client value realisation.',
    ],
    [
      'Install governance over proposal approval, scope sign-off, change requests, delivery handoffs, workshop outputs, and client escalation points.',
      'Clarify owner accountability across business development, senior advisor, delivery team, analyst support, and client sponsor.',
      'Review delivery progress, scope movement, margin risk, and client value weekly across active advisory engagements.',
    ],
    [
      'Embed a repeatable consulting operating model that protects scope discipline, advisory quality, client outcomes, and margin recovery.',
      'Standardise diagnostic packs, statements of work, change-control templates, engagement reviews, and close-out reporting.',
      'Use engagement profitability, client value delivered, and scope discipline as leadership steering measures.',
    ]
  ),

  ps_legal_compliance_matter_management: makeRoadmap(
    'Matter & Compliance Diagnostic',
    'Matter Control Stabilisation',
    'Disciplined Matter Management Model',
    [
      'Map active matters or compliance mandates by client, mandate, stage, owner, deadline, billing status, risk exposure, and unresolved action.',
      'Identify missed handoffs, weak document control, deadline risk, poor client instruction discipline, and billing leakage.',
      'Create one matter dashboard covering deadline status, client instructions, work-in-progress, open risks, billing, and owner accountability.',
    ],
    [
      'Install matter governance covering file opening, mandate confirmation, document control, deadline tracking, client communication, and billing follow-through.',
      'Escalate high-risk matters, overdue client instructions, and billing exposure through a weekly review cadence.',
      'Clarify accountability between professionals, support staff, finance, and client relationship owners.',
    ],
    [
      'Embed a disciplined matter-management rhythm that protects professional quality, compliance control, client trust, and revenue recovery.',
      'Standardise matter opening, review, document control, escalation, and closure processes.',
      'Use matter velocity, risk exposure, recovery rate, and deadline reliability as executive steering measures.',
    ]
  ),

  ps_accounting_tax_month_end: makeRoadmap(
    'Client Administration Diagnostic',
    'Month-End & Tax Control',
    'Scalable Practice Administration Model',
    [
      'Map client workflows across bookkeeping, VAT, payroll, SARS submissions, reconciliations, month-end packs, management accounts, and financial statements.',
      'Identify missing client documents, recurring reconciliation delays, staff overload, review bottlenecks, and billing under-recovery.',
      'Create a client-status dashboard covering document gaps, submission deadlines, month-end progress, queries, billing, and overdue actions.',
    ],
    [
      'Install cut-off dates, document-request routines, owner accountability, escalation rules, and weekly client-admin reviews.',
      'Standardise monthly pack preparation, reconciliation review, tax submission checks, and client communication cadence.',
      'Prioritise clients with repeated document delays, high workload intensity, or poor fee recovery.',
    ],
    [
      'Embed a repeatable accounting and tax operating model that balances service reliability, compliance deadlines, workload planning, and client economics.',
      'Standardise client onboarding, monthly processing, review sign-offs, submission tracking, and billing follow-through.',
      'Use turnaround, submission accuracy, client responsiveness, and recovery per client as practice management measures.',
    ]
  ),

  ps_engineering_architecture_project_control: makeRoadmap(
    'Technical Project Diagnostic',
    'Design & Approval Control',
    'Disciplined Technical Delivery Model',
    [
      'Map technical project flow across brief, design, drawings, reviews, client approvals, site inspections, revisions, and final sign-off.',
      'Identify design-change leakage, drawing revision gaps, late approvals, unclear technical ownership, and rework pressure.',
      'Create one project view covering design status, outstanding approvals, site queries, revision control, delivery milestones, and fee recovery.',
    ],
    [
      'Install technical governance over drawing revision control, approval gates, design changes, site query responses, and client decision points.',
      'Clarify ownership between principal, project lead, technical drafter, site inspector, client sponsor, and finance.',
      'Review project delivery, technical risk, approval delays, rework, and fee recovery weekly.',
    ],
    [
      'Embed a technical delivery model that protects design quality, document integrity, project delivery, client approvals, and profitability.',
      'Standardise drawing control, design review, site-inspection records, technical queries, and change-instruction discipline.',
      'Use technical delivery reliability, approval velocity, change recovery, and project profitability as steering measures.',
    ]
  ),

  ps_agency_marketing_pipeline_delivery: makeRoadmap(
    'Agency Workflow Diagnostic',
    'Campaign & Retainer Control',
    'Scalable Agency Delivery Model',
    [
      'Map agency workflow from lead, client brief, proposal, campaign planning, creative production, approval, delivery, reporting, and retainer review.',
      'Identify weak briefs, approval friction, campaign delays, under-priced retainers, account-management gaps, and margin leakage.',
      'Create visibility on pipeline quality, campaign status, client approvals, delivery deadlines, retainer profitability, and renewal risk.',
    ],
    [
      'Install governance over brief intake, campaign handoff, approval gates, delivery deadlines, performance reporting, and client escalation.',
      'Clarify ownership between account management, creative, production, performance, finance, and client sponsor.',
      'Review campaign delivery, retainer profitability, client satisfaction, and renewal risk weekly.',
    ],
    [
      'Embed an agency operating model that protects creative quality, delivery reliability, retainer economics, client retention, and pipeline conversion.',
      'Standardise briefs, campaign playbooks, approval routines, reporting templates, and monthly client reviews.',
      'Use campaign delivery reliability, retainer profitability, client retention, and conversion rate as leadership measures.',
    ]
  ),

  ps_it_managed_services_sla: makeRoadmap(
    'SLA & Support Diagnostic',
    'Service Desk Stabilisation',
    'Managed Services Reliability Model',
    [
      'Map ticket flow, SLA performance, support desk workload, escalation paths, recurring incidents, response time, and resolution time.',
      'Identify ticket backlog, repeated incidents, SLA breach risk, under-priced support, and weak accountability between support tiers.',
      'Create a service dashboard covering open tickets, SLA risk, response time, resolution time, recurring issues, and client profitability.',
    ],
    [
      'Install triage, escalation, closure notes, root-cause tracking, and client communication routines.',
      'Review SLA performance, backlog ageing, repeat incidents, high-risk clients, and account profitability weekly.',
      'Clarify ownership between first-line support, senior technical resources, account management, and client sponsor.',
    ],
    [
      'Embed a managed-services operating model that links support execution, SLA discipline, recurring-issue elimination, and client economics.',
      'Standardise ticket categories, escalation rules, recurring-incident reviews, and monthly client service reviews.',
      'Use SLA performance, resolution quality, recurring incident reduction, and account profitability as executive measures.',
    ]
  ),

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

  pp_label_flexible_packaging_operations: makeRoadmap(
    'Label & Flexible Packaging Flow Diagnostic',
    'Artwork, Press & Finishing Control',
    'Disciplined Packaging Flow Model',
    [
      'Map label, flexible packaging, and sleeve production from artwork, proofing, substrate readiness, press, slitting, rewinding, inspection, and dispatch.',
      'Quantify make-ready waste, substrate issues, colour variation, finishing defects, reruns, and job margin leakage by job and customer.',
      'Create one leadership view of artwork readiness, proof status, press performance, finishing quality, dispatch readiness, and job profitability.',
    ],
    [
      'Install release gates for artwork, proofs, dies, substrates, inks, job tickets, and customer approvals before production starts.',
      'Stabilise sequencing across pre-press, press, slitting, rewinding, inspection, and dispatch.',
      'Review waste, reruns, customer complaints, turnaround, and job margin weekly.',
    ],
    [
      'Embed a label and flexible-packaging control rhythm that protects right-first-time execution, waste reduction, finishing quality, and customer trust.',
      'Standardise artwork governance, production-release criteria, quality checks, and post-job review loops.',
      'Use job margin, rerun causes, waste, turnaround, and complaint trends as executive steering measures.',
    ]
  ),

  pp_carton_folding_carton_postpress: makeRoadmap(
    'Carton & Post-Press Diagnostic',
    'Finishing Throughput Recovery',
    'Post-Press Control Model',
    [
      'Map carton and post-press flow across artwork, plates, board, die-cutting, creasing, foiling, gluing, packing, and dispatch.',
      'Identify folder-gluer bottlenecks, die-cutting errors, board issues, setup loss, late finishing, and dispatch delays.',
      'Create visibility on finishing queues, waste, rerun causes, asset loading, OTIF, and job profitability.',
    ],
    [
      'Tighten die-line control, make-ready discipline, finishing sequencing, quality gates, and dispatch readiness.',
      'Stabilise the handoff from press to finishing so post-press does not silently become the plant bottleneck.',
      'Review finishing throughput, queue movement, waste, reruns, and OTIF weekly.',
    ],
    [
      'Embed a carton and post-press operating model that treats finishing throughput as a strategic capacity and margin lever.',
      'Standardise die-line approvals, folder-gluer readiness checks, finishing release criteria, and post-job reviews.',
      'Use carton job profitability, finishing throughput, waste, and OTIF as leadership control measures.',
    ]
  ),

  pp_commercial_print_prepress_control: makeRoadmap(
    'Commercial Print & Pre-Press Diagnostic',
    'Specification & Proofing Control',
    'Right-First-Time Print Model',
    [
      'Map commercial print flow from quote, artwork, pre-press, proofing, plate/CTP, press, finishing, delivery, and invoice.',
      'Identify artwork errors, proofing delays, version-control failures, plate issues, late customer changes, and job-ticket gaps.',
      'Create visibility on artwork readiness, proof status, pre-press queue, press-release readiness, and rerun exposure.',
    ],
    [
      'Install control gates for artwork intake, PDF proofing, customer sign-off, imposition checks, plate release, and change requests.',
      'Clarify accountability between sales, pre-press, planning, production, finishing, and dispatch.',
      'Review right-first-time release, pre-press delays, rerun causes, and client disputes weekly.',
    ],
    [
      'Embed commercial print governance around specification integrity, version control, proof approval, and job-release discipline.',
      'Standardise artwork intake, proofing, imposition, plate release, and job-ticket control.',
      'Use right-first-time release, rerun reduction, turnaround, and client trust as executive performance measures.',
    ]
  ),

  pp_market_expansion_sales_pipeline: makeRoadmap(
    'Market Expansion Diagnostic',
    'Target Account Activation',
    'Disciplined Growth Engine',
    [
      'Map the sales pipeline by target sector, account type, decision-maker, product fit, margin potential, and probability of conversion.',
      'Identify underdeveloped markets such as pharma, food, cosmetics, aviation suppliers, industrial clients, and outsourced service opportunities.',
      'Create a target-account register with owner accountability, contact strategy, offer positioning, and weekly follow-up discipline.',
    ],
    [
      'Launch targeted outreach into high-fit markets with clear value propositions, technical capability proof, and quoting discipline.',
      'Assign ownership for each target account, including freelance or specialist sales representation where appropriate.',
      'Review pipeline quality, conversion movement, account feedback, quotation value, and expected margin weekly.',
    ],
    [
      'Embed a disciplined market-expansion engine that connects sales activity, sector targeting, technical capability, margin rules, and delivery readiness.',
      'Standardise target-account reviews, sales-rep reporting, quote follow-up, and win/loss learning.',
      'Use pipeline quality, conversion rate, sector margin, and retained account growth as executive growth measures.',
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
      'Reset role clarity between commercial, prepress, planning, and production teams.',
      'Escalate recurring specification failures with visible ownership.',
    ],
    [
      'Embed right-first-time specification governance as standard practice.',
      'Reduce reruns by institutionalising release-control discipline.',
      'Position specification integrity as a quality, margin, and trust lever.',
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

  mfg_discrete_production_flow: makeRoadmap(
    'Work-Order Flow Diagnostic',
    'Throughput Stabilisation',
    'Disciplined Factory Flow Model',
    [
      'Map production flow across planning, material release, work orders, routings, work centres, assembly, quality checks, and dispatch.',
      'Identify where line balancing, work-order discipline, setup loss, labour allocation, or routing weakness is reducing throughput.',
      'Create one view of schedule attainment, WIP, bottleneck work centres, output recovery, and first-pass yield.',
    ],
    [
      'Stabilise the primary production constraint through short-interval control, labour balance, routing discipline, and material readiness.',
      'Standardise work-order release, shift handovers, work instructions, WIP control, and daily production reviews.',
      'Review throughput, schedule adherence, bottleneck performance, and quality-at-source weekly.',
    ],
    [
      'Embed a discrete manufacturing operating model that protects work-order velocity, schedule discipline, quality, and throughput.',
      'Standardise production review rhythms across lines, cells, work centres, or plants.',
      'Use work-order velocity, schedule adherence, first-pass yield, and bottleneck performance as executive measures.',
    ]
  ),

  mfg_process_yield_batch_control: makeRoadmap(
    'Batch Yield Diagnostic',
    'Process Control Stabilisation',
    'Yield Stability Model',
    [
      'Map batch flow across recipe, formulation, material issue, mixing, processing, filling, quality release, and yield reconciliation.',
      'Quantify batch variance, yield loss, rework, downtime, quality holds, and formulation inconsistency by product family.',
      'Create batch-level visibility on planned yield, actual yield, variance causes, quality release, and cost impact.',
    ],
    [
      'Tighten recipe discipline, process-parameter control, batch records, operator checks, and quality-release routines.',
      'Investigate the highest-value yield-loss points through root-cause reviews and owner-led recovery actions.',
      'Review batch variance, yield performance, quality release time, and process stability weekly.',
    ],
    [
      'Embed a batch and process-control model that protects yield stability, quality release, and loss prevention.',
      'Standardise batch records, formulation control, variance review, and process-parameter governance.',
      'Use yield realisation, batch variance, quality release time, and process stability as leadership steering measures.',
    ]
  ),

  mfg_food_fmcg_quality_traceability: makeRoadmap(
    'Traceability & Shelf-Life Diagnostic',
    'Food Safety Control Stabilisation',
    'Traceable Quality Operating Model',
    [
      'Map food/FMCG flow across raw material, batch traceability, production, packing, quality release, cold chain, storage, and dispatch.',
      'Identify traceability gaps, shelf-life risk, quality downgrades, recall exposure, cold-chain weakness, and stock-rotation issues.',
      'Create visibility on batch traceability, expiry exposure, quality holds, stock rotation, and service-level risk.',
    ],
    [
      'Tighten HACCP controls, batch records, recall readiness, quality-release gates, cold-chain checks, and expiry management.',
      'Intervene on the products, batches, storage areas, or suppliers carrying the greatest quality and service risk.',
      'Review traceability integrity, shelf-life risk, quality release, and service reliability weekly.',
    ],
    [
      'Embed a food/FMCG control model around traceability, food safety, shelf-life protection, stock rotation, and quality release discipline.',
      'Standardise recall readiness, batch control, expiry governance, and cold-chain routines.',
      'Use traceability integrity, quality release performance, shelf-life risk, and service reliability as executive measures.',
    ]
  ),

  mfg_engineering_fabrication_bom_control: makeRoadmap(
    'Engineering Control Diagnostic',
    'BOM & Revision Stabilisation',
    'Technical Production Control Model',
    [
      'Map fabrication flow across drawing revision, BOM, cut list, procurement, machining, welding, assembly, inspection, and delivery.',
      'Identify BOM errors, drawing-revision gaps, engineering changes, rework, material mismatch, and routing weakness.',
      'Create visibility on revision status, material readiness, fabrication bottlenecks, rework causes, and job profitability.',
    ],
    [
      'Tighten drawing revision control, engineering change approvals, BOM integrity, cut-list accuracy, inspection gates, and routing discipline.',
      'Intervene on jobs, drawings, materials, or work centres carrying the greatest rework and margin risk.',
      'Review technical change, job progress, rework, material readiness, and margin weekly.',
    ],
    [
      'Embed an engineering and fabrication control model around BOM integrity, technical change governance, routing discipline, and quality checks.',
      'Standardise drawing revision control, engineering change approvals, cut-list accuracy, inspection gates, and job close-out reviews.',
      'Use revision accuracy, rework reduction, material readiness, and job margin as leadership control measures.',
    ]
  ),

  mfg_maintenance_oee_asset_reliability: makeRoadmap(
    'Asset Reliability Diagnostic',
    'Downtime Recovery',
    'OEE & Maintenance Control Model',
    [
      'Break OEE losses into availability, performance, and quality-rate losses by asset, line, shift, and failure mode.',
      'Map breakdowns, preventive maintenance adherence, critical spares, MTBF, MTTR, and recurring stoppages.',
      'Create visibility on asset downtime, maintenance backlog, spares risk, and constrained-equipment recovery.',
    ],
    [
      'Stabilise constrained assets through preventive maintenance discipline, critical spares control, and root-cause elimination.',
      'Review downtime, MTBF, MTTR, maintenance compliance, and spares exposure weekly.',
      'Clarify ownership between production, maintenance, engineering, stores, and finance.',
    ],
    [
      'Embed asset-reliability governance around preventive maintenance, critical spares, root-cause elimination, and constrained-asset protection.',
      'Standardise maintenance planning, breakdown reviews, spares governance, and reliability escalation routines.',
      'Use OEE, MTBF, MTTR, maintenance compliance, and downtime cost as executive productivity measures.',
    ]
  ),

  mfg_supply_chain_inventory_control: makeRoadmap(
    'Material Availability Diagnostic',
    'Inventory & Supplier Control',
    'Reliable Material Flow Model',
    [
      'Map material availability across suppliers, lead times, purchase orders, MRP signals, warehouse accuracy, inventory health, and production shortages.',
      'Identify supplier delays, stockouts, obsolete stock, slow-moving inventory, planning instability, and production-impacting shortages.',
      'Create visibility on supplier reliability, raw-material risk, stock health, inventory turns, and shortage impact.',
    ],
    [
      'Stabilise supplier escalation, purchase-order follow-up, MRP inputs, warehouse accuracy, and shortage management.',
      'Review supplier OTIF, stockout risk, inventory health, obsolete stock, and production-impacting material gaps weekly.',
      'Clarify accountability between procurement, planning, production, warehouse, and finance.',
    ],
    [
      'Embed supply-chain and inventory governance around material availability, supplier reliability, MRP discipline, and working-capital control.',
      'Standardise supplier performance reviews, inventory health reviews, and production-shortage escalation.',
      'Use material availability, supplier OTIF, inventory turns, stockout risk, and obsolete stock as executive measures.',
    ]
  ),

  mfg_product_margin_protection: makeRoadmap(
    'Product Margin Diagnostic',
    'Margin Recovery Control',
    'Product Economics Operating Model',
    [
      'Quantify product margin leakage by product family, customer, plant, and cause.',
      'Separate strategic mix, pricing under-recovery, discount leakage, material variance, labour absorption, rework, and complexity cost.',
      'Create executive visibility on where weak margin contribution is consuming scarce capacity.',
    ],
    [
      'Tighten product-mix, pricing, customer-economics, and standard-cost review discipline.',
      'Intervene where low-contribution work is crowding out strategic capacity.',
      'Review standard-cost drift, realised margin, and product-family profitability weekly.',
    ],
    [
      'Embed product margin protection as a portfolio and operating-system discipline.',
      'Standardise margin-quality reviews before new work is accepted or expanded.',
      'Use product economics to steer growth, pricing, capacity, and customer decisions.',
    ]
  ),

  mfg_schedule_delivery_velocity: makeRoadmap(
    'Schedule & Delivery Diagnostic',
    'Planning Control Recovery',
    'Delivery Velocity Model',
    [
      'Map where MPS, MRP, finite loading, setup loss, supplier variability, and dispatch bottlenecks are destabilising schedule adherence.',
      'Separate planning-system instability from shop-floor productivity loss.',
      'Build daily visibility on OTIF, schedule attainment, bottleneck movement, and expediting pressure.',
    ],
    [
      'Reset schedule control around real constraints, frozen-zone discipline, material readiness, and practical capacity.',
      'Tighten planning, production, procurement, and dispatch alignment through weekly control routines.',
      'Intervene on products, lines, customers, or suppliers driving repeated schedule instability.',
    ],
    [
      'Embed delivery velocity as the output of planning discipline, material readiness, and execution reliability.',
      'Standardise schedule-review rhythms across plants, lines, and product families.',
      'Use schedule adherence and delivery velocity as executive operating measures.',
    ]
  ),

  mfg_quality_specification_control: makeRoadmap(
    'Quality & Specification Diagnostic',
    'Right-First-Time Stabilisation',
    'Specification Control Model',
    [
      'Audit engineering changes, BOM/version accuracy, routing discipline, work-instruction adherence, and first-pass yield by product family.',
      'Quantify COPQ, defect Pareto, non-conformance recurrence, and RCCA closure performance.',
      'Install visible control on the specification and process failures driving rework, concessions, and external quality risk.',
    ],
    [
      'Harden BOM, routing, calibration, gauge control, process discipline, and engineering-change governance.',
      'Prioritise the quality issues causing the highest cost, recurrence, or customer exposure.',
      'Review first-pass yield, COPQ, RCCA closure, and recurring defects weekly.',
    ],
    [
      'Embed quality and specification control as an economic control system, not only a compliance requirement.',
      'Standardise specification governance, process discipline, and recurrence-prevention routines.',
      'Use first-pass quality and recurrence prevention as core margin-protection levers.',
    ]
  ),

  mfg_asset_oee_capacity: makeRoadmap(
    'OEE & Capacity Diagnostic',
    'Asset Productivity Recovery',
    'Capacity Discipline Model',
    [
      'Break OEE into availability, performance, and quality-rate losses by line, asset, and shift.',
      'Measure changeover loss, minor stoppages, waiting, starvation, and operator variability on constrained assets.',
      'Identify whether the issue is line productivity, capacity balance, technology mismatch, or maintenance reliability.',
    ],
    [
      'Stabilise constrained assets through setup reduction, maintenance control, operator discipline, and practical capacity planning.',
      'Rebalance assets, cells, and plant loading around real constraints rather than nominal capacity.',
      'Review OEE, productive hours, bottleneck performance, and capacity recovery weekly.',
    ],
    [
      'Embed OEE and asset productivity as value-creation measures tied to margin, delivery, and working capital.',
      'Standardise capacity reviews across lines, assets, plants, and shifts.',
      'Use asset productivity as a leadership-controlled growth lever.',
    ]
  ),

  mfg_bottleneck_throughput: makeRoadmap(
    'Bottleneck Diagnostic',
    'Throughput Recovery',
    'Constraint Management Discipline',
    [
      'Map the primary bottleneck and quantify lost throughput with hard operational data.',
      'Stabilise upstream and downstream flow around the true constraint.',
      'Launch rapid countermeasures on the highest-value throughput losses.',
    ],
    [
      'Treat throughput acceleration as a strategic value-creation programme.',
      'Align production planning, staffing, and maintenance around the true bottleneck.',
      'Install executive visibility on constraint performance and output recovery.',
    ],
    [
      'Embed constraint management into the operating rhythm.',
      'Use bottleneck performance to steer capacity, staffing, and investment decisions.',
      'Sustain throughput gains through disciplined review and accountability.',
    ]
  ),

  mfg_quality_source: makeRoadmap(
    'Quality-at-Source Diagnostic',
    'Defect Containment',
    'Prevention Discipline',
    [
      'Quantify defect, scrap, and rework failure points at source.',
      'Contain the highest-impact quality escapes immediately.',
      'Reset quality ownership at the points where defects are created, not discovered later.',
    ],
    [
      'Embed quality-at-source as a core leadership discipline.',
      'Reduce cost-of-poor-quality through hard controls and visible accountability.',
      'Use first-pass quality and defect prevention as margin protection levers.',
    ],
    [
      'Institutionalise recurrence prevention and owner-led corrective action.',
      'Standardise process controls where defect creation is concentrated.',
      'Use quality prevention as a permanent operating measure.',
    ]
  ),

  mfg_supply_chain_exposure: makeRoadmap(
    'Supply Exposure Diagnostic',
    'Continuity Stabilisation',
    'Resilient Material Flow',
    [
      'Stress-test supplier risk, lead-time volatility, and inventory vulnerabilities.',
      'Map where material constraints are threatening throughput and customer delivery.',
      'Create executive visibility on the most material supply-chain exposures.',
    ],
    [
      'Strengthen supply continuity and lead-time control as a resilience agenda.',
      'Reduce operational fragility by rebalancing inventory, sourcing, and planning discipline.',
      'Move supply-chain risk from reactive firefighting into structured executive control.',
    ],
    [
      'Embed supplier and inventory risk into standard leadership review.',
      'Standardise supplier escalation and material-readiness governance.',
      'Use supply reliability as a core resilience metric.',
    ]
  ),

  mfg_oee_capacity: makeRoadmap(
    'OEE Diagnostic',
    'Capacity Recovery',
    'Productive Capacity Discipline',
    [
      'Break down OEE losses into availability, performance, and quality components.',
      'Target the most material downtime and speed losses immediately.',
      'Build daily visibility on practical capacity recovery by line and asset.',
    ],
    [
      'Treat OEE and capacity underperformance as executive productivity issues.',
      'Raise asset productivity through disciplined visibility and ownership.',
      'Link effective capacity to monthly margin and service-level outcomes.',
    ],
    [
      'Embed OEE review into the operating rhythm.',
      'Standardise capacity recovery actions around real constraints.',
      'Use productive capacity as a strategic growth lever.',
    ]
  ),

  con_general_building_contractor: makeRoadmap(
    'Building Project Diagnostic',
    'Site & Commercial Control',
    'Predictable Building Delivery Model',
    [
      'Map building-project execution across tender assumptions, site supervision, subcontractor coordination, finishes, snagging, practical completion, and cash certification.',
      'Identify where programme slippage, poor supervision, rework, subcontractor gaps, late approvals, or snag accumulation are damaging margin and delivery credibility.',
      'Create visibility on project margin, site productivity, open variations, snag status, subcontractor performance, and certification risk.',
    ],
    [
      'Install weekly site reviews, variation capture, subcontractor accountability, quality closure, and payment-certification follow-up.',
      'Stabilise the site packages, subcontractors, or approvals carrying the greatest programme and margin risk.',
      'Clarify owner accountability for programme recovery, commercial recovery, site supervision, and snag close-out.',
    ],
    [
      'Embed a building-contractor control model around site execution, subcontractor coordination, programme discipline, quality closure, and commercial recovery.',
      'Standardise weekly project reviews, snag control, site-instruction capture, and certification follow-up.',
      'Use site productivity, programme adherence, margin forecast, and certification progress as leadership measures.',
    ]
  ),

  con_civil_infrastructure_delivery: makeRoadmap(
    'Civil Works Diagnostic',
    'Plant & Programme Recovery',
    'Civil Delivery Control Model',
    [
      'Map civil works flow across earthworks, plant utilisation, material availability, subcontractors, quality testing, programme milestones, claims, and certificates.',
      'Identify productivity loss from idle plant, weather, sequencing, site access, rework, material shortages, or weak daily production control.',
      'Create visibility on plant productivity, quantity installed, programme status, claim exposure, and cash certification.',
    ],
    [
      'Install daily production reporting, plant utilisation reviews, quantity tracking, site-instruction capture, and claims evidence management.',
      'Stabilise the work fronts, equipment, subcontractors, or approvals driving the greatest productivity loss.',
      'Review programme movement, plant utilisation, quantity output, and margin forecast weekly.',
    ],
    [
      'Embed civil-delivery governance around plant productivity, quantity tracking, programme control, quality testing, and commercial recovery.',
      'Standardise work-front planning, plant control, claims evidence, and certificate follow-up.',
      'Use quantity output, plant utilisation, programme movement, and margin forecast as executive control measures.',
    ]
  ),

  con_specialist_subcontractor_control: makeRoadmap(
    'Specialist Package Diagnostic',
    'Interface & Payment Control',
    'Subcontractor Performance Model',
    [
      'Map specialist subcontractor workflow across scope, shop drawings, site access, interface dependencies, programme milestones, variations, and payment claims.',
      'Identify scope gaps, coordination failures, late approvals, payment delays, and site-interface issues affecting delivery and cash flow.',
      'Create visibility on packages at risk, site dependencies, approvals, variation status, and payment exposure.',
    ],
    [
      'Install package handoffs, shop-drawing approvals, site-readiness checks, weekly subcontractor reviews, and variation capture.',
      'Escalate interface conflicts, approval delays, and payment exposure before they damage programme and liquidity.',
      'Clarify ownership between project management, site teams, commercial teams, subcontractors, and client representatives.',
    ],
    [
      'Embed subcontractor governance around scope clarity, interface coordination, programme commitments, variation recovery, and payment discipline.',
      'Standardise package reviews, interface controls, and payment follow-up.',
      'Use package progress, claim recovery, interface risk, and cash exposure as leadership measures.',
    ]
  ),

  con_hs_compliance_safety_file: makeRoadmap(
    'Safety File & Site Compliance Diagnostic',
    'Audit Readiness Recovery',
    'Construction H&S Control Model',
    [
      'Audit safety-file completeness, risk assessments, method statements, toolbox talks, incident logs, scaffold inspections, and subcontractor compliance documents.',
      'Identify urgent OHS gaps that could stop work, trigger penalties, or expose the client to site-level legal risk.',
      'Create a compliance action register covering missing evidence, responsible owners, due dates, site risk, and audit readiness.',
    ],
    [
      'Close critical safety-file gaps, expired documents, missing records, and subcontractor compliance failures.',
      'Install weekly site safety reviews, toolbox-talk tracking, incident reporting, and corrective-action close-out.',
      'Escalate overdue or high-risk compliance items to project and executive leadership.',
    ],
    [
      'Embed a construction H&S control model around safety-file discipline, evidence packs, subcontractor compliance, incident reporting, and audit readiness.',
      'Standardise site safety reviews, document renewal checks, toolbox-talk records, and corrective-action tracking.',
      'Use audit readiness, incident trends, close-out discipline, and subcontractor compliance as executive control measures.',
    ]
  ),

  con_qs_cost_variation_control: makeRoadmap(
    'QS & Commercial Diagnostic',
    'Variation Recovery Control',
    'Commercial Recovery Model',
    [
      'Map BOQ, measurement, valuations, variations, claims, interim payment certificates, retentions, and final-account exposure.',
      'Identify disallowed items, weak substantiation, missed notices, poor measurement control, and unrecovered variation value.',
      'Create visibility on commercial exposure, claim status, certification delays, retention risk, and final-account movement.',
    ],
    [
      'Tighten claim packs, valuation reviews, notice compliance, rate build-ups, and certification follow-up.',
      'Prioritise the variations, claims, certificates, and final-account items carrying the greatest value at risk.',
      'Review claim conversion, certification progress, margin recovery, and final-account closure weekly.',
    ],
    [
      'Embed QS and commercial governance around BOQ discipline, measurement accuracy, variation substantiation, and final-account recovery.',
      'Standardise claim evidence, valuation controls, notice routines, and certificate follow-up.',
      'Use claim conversion, certification progress, margin recovery, and final-account closure as leadership measures.',
    ]
  ),

  con_property_development_management: makeRoadmap(
    'Development Feasibility Diagnostic',
    'Approval & Funding Control',
    'Development Governance Model',
    [
      'Map development feasibility across land, zoning, approvals, funding, professional team, contractor procurement, leasing/pre-sales, delivery, and handover.',
      'Identify approval delays, feasibility gaps, funding risks, contractor exposure, market absorption risk, and weak stage-gate governance.',
      'Create visibility on project feasibility, approval status, funding headroom, cost-to-complete, sales/leasing risk, and handover readiness.',
    ],
    [
      'Install development stage gates covering feasibility, approvals, funding, procurement, construction progress, market absorption, and handover.',
      'Escalate approvals, funding headroom, cost-to-complete, or contractor risks that threaten project viability.',
      'Review development economics, approval movement, cost forecast, and funding status weekly.',
    ],
    [
      'Embed development governance linking feasibility, approvals, funding, contractor control, market absorption, and handover risk.',
      'Standardise development-stage gates, cost reviews, approval tracking, professional-team accountability, and funding reviews.',
      'Use feasibility resilience, approval movement, cost-to-complete, and funding headroom as executive measures.',
    ]
  ),

  con_facilities_maintenance_sla: makeRoadmap(
    'Facilities Maintenance Diagnostic',
    'SLA & Work-Order Recovery',
    'Maintenance Service Reliability Model',
    [
      'Map facilities maintenance flow across call-outs, work orders, SLA response, planned maintenance, tenant complaints, parts availability, and billing.',
      'Identify recurring asset failures, maintenance backlog, missed SLA response, weak work-order closure, and under-recovered service work.',
      'Create visibility on open work orders, SLA compliance, repeat faults, planned maintenance, cost recovery, and customer satisfaction.',
    ],
    [
      'Tighten triage, dispatch, job closure notes, parts control, planned maintenance routines, and client reporting.',
      'Stabilise repeat faults, overdue work orders, and SLA breach risks with owner-led recovery actions.',
      'Review SLA performance, backlog ageing, repeat faults, service profitability, and billing recovery weekly.',
    ],
    [
      'Embed maintenance-service governance around SLA discipline, work-order closure, repeat-fault elimination, asset upkeep, and billing recovery.',
      'Standardise service categories, work-order notes, planned maintenance calendars, and client reporting.',
      'Use SLA performance, backlog ageing, repeat faults, and service profitability as leadership measures.',
    ]
  ),

  con_portfolio_margin_erosion: makeRoadmap(
    'Portfolio Margin Diagnostic',
    'Tender & Project Selection Control',
    'Portfolio Margin Control Model',
    [
      'Build a portfolio-level view of tender risk, current forecast margin, central overhead absorption, and project selection quality.',
      'Identify under-bid or wrong-fit projects that are consuming capacity without adequate margin protection.',
      'Create executive visibility on which projects, clients, or packages are structurally eroding portfolio margin.',
    ],
    [
      'Tighten bid/no-bid discipline, risk pricing, margin gates, and executive review of margin-at-risk work.',
      'Intervene on low-return projects, exposed clients, and packages consuming scarce management capacity.',
      'Review portfolio margin quality, risk pricing, and forecast movement weekly.',
    ],
    [
      'Embed tender selection and portfolio mix as the first layer of construction margin control.',
      'Standardise project-selection governance across regions, project types, and clients.',
      'Use portfolio margin quality as a leadership steering measure.',
    ]
  ),

  con_commercial_leakage_claims: makeRoadmap(
    'Commercial Leakage Diagnostic',
    'Claims Recovery Control',
    'Commercial Recovery Discipline',
    [
      'Audit current variations, claims, approvals, notices, site instructions, and unresolved entitlement exposures.',
      'Quantify value earned but not yet approved, claimed, certified, or recovered.',
      'Create one commercial action register covering entitlement, evidence, owner, due date, client status, and recovery value.',
    ],
    [
      'Tighten the evidence trail, notice compliance, approval discipline, claim packs, and escalation cadence around change events.',
      'Escalate at-risk claims before value leakage becomes irreversible.',
      'Review claim conversion, variation recovery, and unresolved entitlement weekly.',
    ],
    [
      'Embed variation and claim control as a commercial recovery engine.',
      'Standardise evidence capture, notice routines, approval tracking, and commercial escalation.',
      'Use executive oversight to protect commercial value already earned on site.',
    ]
  ),

  con_operational_delivery_risk: makeRoadmap(
    'Site Productivity Diagnostic',
    'Execution Recovery',
    'Site Execution Control Model',
    [
      'Map site productivity loss, rework, idle plant, subcontractor delays, material shortages, and supervision weaknesses on exposed projects.',
      'Identify where operational execution failure is destroying commercial performance.',
      'Create short-interval control around the sites or packages carrying the greatest value at risk.',
    ],
    [
      'Tighten subcontractor coordination, supervision cadence, productivity tracking, quality recovery, and daily constraint removal.',
      'Stabilise the work fronts, trades, plant, or suppliers creating repeated site disruption.',
      'Review productivity, rework, subcontractor performance, and forecast margin weekly.',
    ],
    [
      'Embed site execution as a margin and delivery-control system, not only a construction activity.',
      'Standardise daily planning, short-interval control, productivity reporting, and quality recovery routines.',
      'Link project-level operating recovery directly to forecast margin and milestone achievement.',
    ]
  ),

  con_schedule_coordination_slippage: makeRoadmap(
    'Programme Slippage Diagnostic',
    'Critical Path Recovery',
    'Predictable Delivery Discipline',
    [
      'Identify critical-path slippage, sequencing conflicts, late approvals, long-lead risks, and subcontractor delays.',
      'Quantify the delivery, margin, and cash implications of programme movement.',
      'Create one programme recovery view covering milestones, blockers, owner actions, and recovery dates.',
    ],
    [
      'Stabilise milestone governance and short-interval control on delayed projects.',
      'Link site actions directly to the schedule drivers that matter most.',
      'Escalate blockers, approvals, and interface risks before they become unrecoverable delay.',
    ],
    [
      'Embed critical-path visibility as a core executive control mechanism.',
      'Standardise programme review, lookahead planning, blocker escalation, and recovery tracking.',
      'Treat programme integrity as central to delivery credibility and cash protection.',
    ]
  ),

  con_cashflow_certification_exposure: makeRoadmap(
    'Project Cash Diagnostic',
    'Certification & Collection Control',
    'Liquidity Protection Model',
    [
      'Map billing, certification, retention, WIP, disallowed items, and collection blockages across live projects.',
      'Quantify cash exposure from delayed certificates, retentions, weak billing cadence, and unresolved valuations.',
      'Create one project cash view covering claims submitted, certified value, outstanding payments, retention, and forecast liquidity.',
    ],
    [
      'Tighten billing, certification, valuation, retention, and collection discipline across exposed contracts.',
      'Install weekly project cash reviews on the contracts carrying the greatest liquidity risk.',
      'Escalate delayed certificates, disputed valuations, and debtor exposure with clear owner accountability.',
    ],
    [
      'Embed project cash flow as a first-order executive control measure.',
      'Standardise project cash reviews, certification follow-up, valuation evidence, and collection escalation.',
      'Protect liquidity by linking project controls directly to cash realisation.',
    ]
  ),

  con_project_margin: makeRoadmap(
    'Project Margin Diagnostic',
    'Commercial Recovery',
    'Margin Control Discipline',
    [
      'Map margin leakage by live project, package, and major cost driver.',
      'Identify where budget drift, procurement slippage, or execution waste is eroding project economics.',
      'Install weekly project commercial reviews on the most exposed jobs.',
    ],
    [
      'Protect project margin through disciplined cost control and owner-level accountability.',
      'Treat commercial control as a weekly operating discipline, not a month-end exercise.',
      'Escalate margin recovery on live projects with visible leadership sponsorship.',
    ],
    [
      'Embed project margin reviews into the operating rhythm.',
      'Standardise cost-to-complete and recovery action tracking.',
      'Use forecast margin as a leadership control measure.',
    ]
  ),

  con_schedule_slippage: makeRoadmap(
    'Schedule Slippage Diagnostic',
    'Programme Recovery',
    'Delivery Discipline',
    [
      'Identify critical-path slippage and quantify delivery and cash implications.',
      'Stabilise milestone governance and short-interval control on delayed projects.',
      'Link site actions directly to schedule drivers that matter most.',
    ],
    [
      'Use critical-path visibility as a core executive control mechanism.',
      'Reduce schedule drift through disciplined site and project governance.',
      'Treat programme integrity as central to delivery credibility and cash protection.',
    ],
    [
      'Embed programme reviews into standard construction governance.',
      'Standardise recovery planning and blocker escalation.',
      'Use delivery reliability as a leadership performance measure.',
    ]
  ),

  con_variations_claims: makeRoadmap(
    'Variation & Claims Diagnostic',
    'Claim Recovery',
    'Commercial Recovery Discipline',
    [
      'Audit current variations, claims, approvals, and unresolved commercial exposures.',
      'Tighten the evidence trail and approval discipline around change events.',
      'Escalate at-risk claims before value leakage becomes irreversible.',
    ],
    [
      'Treat variation and claim control as a commercial recovery engine.',
      'Strengthen governance over changes, approvals, and contractual entitlement.',
      'Use executive oversight to protect commercial value already earned on site.',
    ],
    [
      'Embed variation governance into project reviews.',
      'Standardise claim evidence and approval tracking.',
      'Use claim recovery as a margin-protection measure.',
    ]
  ),

  con_cashflow_controls: makeRoadmap(
    'Project Cash Diagnostic',
    'Cash Control Recovery',
    'Working Capital Discipline',
    [
      'Map billing, certification, and collection blockages across live projects.',
      'Quantify cash exposure from retentions, delayed certificates, and weak billing cadence.',
      'Install weekly project cash reviews on the most exposed contracts.',
    ],
    [
      'Treat project cash flow as a first-order executive control measure.',
      'Tighten billing, certification, and collection discipline across the portfolio.',
      'Protect liquidity by linking project controls directly to cash realisation.',
    ],
    [
      'Embed cash visibility into project governance.',
      'Standardise certification and collection follow-up.',
      'Use cash conversion as a core leadership metric.',
    ]
  ),

  ag_crop_production_yield_planning: makeRoadmap(
    'Crop Yield Diagnostic',
    'Seasonal Execution Control',
    'Crop Production Operating Model',
    [
      'Map crop production by field, crop, planting window, input application, irrigation, spraying, harvest timing, and yield result.',
      'Identify where planting delays, input inefficiency, pest pressure, machinery availability, or harvest loss is reducing yield realisation.',
      'Create visibility on potential vs achieved yield, field execution, input cost, harvest readiness, and seasonal cash exposure.',
    ],
    [
      'Tighten crop plans, operating windows, spray/fertiliser records, irrigation scheduling, and field reviews.',
      'Intervene on fields, crops, or operating windows carrying the greatest yield and margin risk.',
      'Review yield outlook, input efficiency, field execution, and harvest readiness weekly during critical windows.',
    ],
    [
      'Embed crop-production governance around seasonal planning, input efficiency, field execution, water availability, and yield recovery.',
      'Standardise crop plans, operating windows, field reviews, and harvest-readiness checks.',
      'Use yield per hectare, input efficiency, timing adherence, and gross margin as leadership measures.',
    ]
  ),

  ag_livestock_health_feed_conversion: makeRoadmap(
    'Livestock Productivity Diagnostic',
    'Health & Feed Control',
    'Livestock Operating Model',
    [
      'Map herd or flock performance across animal health, feed conversion, mortality, breeding, grazing, biosecurity, and market readiness.',
      'Identify health risks, feed inefficiency, mortality drivers, weak breeding performance, or poor stocking discipline.',
      'Create visibility on animal numbers, mortality, feed conversion, health events, treatment cost, and margin per animal.',
    ],
    [
      'Tighten health checks, feeding routines, grazing plans, vaccination records, and mortality reviews.',
      'Intervene on herds, flocks, camps, or feed regimes carrying the greatest productivity and biosecurity risk.',
      'Review mortality, feed conversion, health events, weight gain, and breeding performance weekly.',
    ],
    [
      'Embed livestock governance around animal health, feed efficiency, biosecurity, breeding discipline, and market timing.',
      'Standardise health records, grazing routines, feeding controls, and mortality reviews.',
      'Use mortality, feed conversion, weight gain, breeding performance, and gross margin per animal as executive measures.',
    ]
  ),

  ag_fresh_produce_packhouse_cold_chain: makeRoadmap(
    'Fresh Produce Flow Diagnostic',
    'Packhouse & Cold Chain Control',
    'Fresh Produce Operating Model',
    [
      'Map fresh-produce flow across harvest, intake, grading, packing, cold rooms, dispatch, market agents, and quality downgrades.',
      'Identify post-harvest loss, packhouse bottlenecks, cold-chain weakness, grading downgrades, and buyer payment timing issues.',
      'Create visibility on intake volume, grade-out, packhouse throughput, cold-chain compliance, dispatch status, and realised price.',
    ],
    [
      'Tighten harvest timing, intake checks, grading rules, packing schedules, cold-room control, and dispatch readiness.',
      'Intervene on products, grades, packhouse lines, cold rooms, or buyers carrying the greatest value risk.',
      'Review grade-out, throughput, post-harvest loss, cold-chain compliance, and price realisation weekly.',
    ],
    [
      'Embed fresh-produce governance around harvest timing, grading discipline, packhouse throughput, cold-chain control, and price realisation.',
      'Standardise intake checks, grading rules, cold-room checks, and dispatch routines.',
      'Use grade-out, packhouse throughput, cold-chain compliance, post-harvest loss, and realised price as leadership measures.',
    ]
  ),

  ag_irrigation_water_resource_control: makeRoadmap(
    'Water Resource Diagnostic',
    'Irrigation Reliability Control',
    'Water Resilience Model',
    [
      'Map water availability, irrigation infrastructure, boreholes, pivots, soil moisture, drought exposure, and load-shedding impact on irrigation timing.',
      'Identify water constraints, pump reliability issues, irrigation scheduling weaknesses, and crop stress risk.',
      'Create visibility on water allocation, soil moisture, irrigation adherence, equipment uptime, and crop-risk exposure.',
    ],
    [
      'Tighten irrigation plans, borehole/pump checks, water-use tracking, soil-moisture monitoring, and drought-response triggers.',
      'Intervene on the fields, pumps, pivots, or water constraints carrying the greatest yield risk.',
      'Review water availability, irrigation reliability, equipment uptime, and crop-stress indicators weekly.',
    ],
    [
      'Embed irrigation and water governance around resource planning, equipment reliability, scheduling discipline, and climate resilience.',
      'Standardise water-use tracking, irrigation scheduling, equipment checks, and drought contingency routines.',
      'Use water-use efficiency, irrigation reliability, soil moisture, and crop-stress risk as executive measures.',
    ]
  ),

  ag_agri_processing_value_chain: makeRoadmap(
    'Agri-Processing Diagnostic',
    'Storage & Throughput Control',
    'Value Chain Operating Model',
    [
      'Map agri-processing flow across intake, storage, cleaning, grading, milling, abattoir/dairy processing, packing, dispatch, and yield reconciliation.',
      'Identify processing yield loss, storage risk, throughput bottlenecks, quality downgrades, and working-capital lock-up.',
      'Create visibility on intake quality, processing yield, storage ageing, throughput, dispatch readiness, and realised margin.',
    ],
    [
      'Tighten grading, storage discipline, process controls, yield reviews, and dispatch planning.',
      'Intervene on intake quality, storage, processing bottlenecks, or dispatch constraints carrying the greatest value risk.',
      'Review processing yield, throughput, storage loss, quality downgrades, and cash conversion weekly.',
    ],
    [
      'Embed agri-processing governance around intake quality, storage discipline, processing yield, throughput, and value-chain cash conversion.',
      'Standardise grading, storage, process controls, yield reviews, and dispatch planning.',
      'Use processing yield, throughput, storage loss, quality downgrade, and cash conversion as executive measures.',
    ]
  ),

  ag_yield_performance: makeRoadmap(
    'Yield Realisation Diagnostic',
    'Operational Timing Recovery',
    'Yield Governance Model',
    [
      'Quantify the yield gap by crop, enterprise, or farm and split it between controllable execution loss and external environmental drag.',
      'Map planting, spraying, harvesting, labour, machinery, and post-harvest timing performance on the highest-value hectares or enterprises.',
      'Create visible control on the critical operating windows where yield is won or lost.',
    ],
    [
      'Treat yield performance as a structured operating and agronomic control issue.',
      'Use timeliness, field execution, and post-harvest discipline to convert potential yield into realised output.',
      'Link yield-realisation governance directly to margin, storage, and cash expectations.',
    ],
    [
      'Embed yield governance into seasonal review rhythms.',
      'Standardise field execution reviews and post-harvest learning.',
      'Use yield realisation as a core leadership measure.',
    ]
  ),

  ag_margin_cost_control: makeRoadmap(
    'Enterprise Margin Diagnostic',
    'Cost & Mix Control',
    'Agricultural Margin Model',
    [
      'Build a gross-margin waterfall per hectare or per animal showing yield shortfall, price realisation variance, input variance, and waste/shrinkage.',
      'Separate enterprise-mix decisions from farm-execution issues so leadership can see where value is structurally weak.',
      'Create executive visibility on input efficiency, overhead absorption, and realised contribution by enterprise.',
    ],
    [
      'Tighten enterprise selection, land allocation, procurement leverage, and price-realisation discipline.',
      'Intervene where input cost, yield, price, or enterprise mix is destroying margin.',
      'Review gross margin per hectare or animal weekly during key operating windows.',
    ],
    [
      'Embed unit cost and gross margin discipline as a portfolio and operating-system issue.',
      'Standardise enterprise economics review across fields, herds, crops, and markets.',
      'Use realised gross margin per hectare or per animal as a core leadership steering metric.',
    ]
  ),

  ag_risk_management: makeRoadmap(
    'Agricultural Risk Diagnostic',
    'Risk Layering Recovery',
    'Resilience Governance Model',
    [
      'Map weather, biological, market, and counterparty risks with probability-weighted financial impact.',
      'Stress-test hedging, insurance, diversification, biosecurity, and claims-recovery effectiveness on the most exposed enterprises.',
      'Create one leadership view of where controllable risk ends and external volatility begins.',
    ],
    [
      'Strengthen mitigation infrastructure, hedging discipline, biosecurity routines, and insurance-claim readiness.',
      'Escalate risk exposures that threaten yield, cash flow, market access, or animal/crop health.',
      'Review risk triggers, mitigation actions, and residual exposure weekly during high-risk periods.',
    ],
    [
      'Embed agricultural risk as a layered control system spanning field execution, climate exposure, market protection, and financial resilience.',
      'Standardise risk reviews before and during each seasonal cycle.',
      'Use risk layering and resilience metrics as standard executive review items.',
    ]
  ),

  ag_working_capital_cash_cycle: makeRoadmap(
    'Seasonal Cash Diagnostic',
    'Cash Timing Control',
    'Working Capital Discipline',
    [
      'Map seasonal funding peaks, inventory carrying cost, harvest-to-cash timing, buyer payment terms, storage, grading, packing, and sale timing.',
      'Quantify where operating timing, storage decisions, buyer terms, or price realisation are trapping working capital.',
      'Create visibility on cash-conversion timing by crop, farm, enterprise, buyer, and season.',
    ],
    [
      'Tighten harvest-to-realisation decisions, buyer terms, lease timing, capital phasing, and funding headroom.',
      'Intervene where storage, drying, grading, packing, or payment timing is creating avoidable cash pressure.',
      'Review seasonal cash movement, inventory holding, buyer exposure, and funding headroom weekly.',
    ],
    [
      'Embed seasonal cash exposure as a planned operating discipline, not a surprise finance problem.',
      'Standardise cash forecasts around planting, production, harvest, storage, sale, and buyer payment timing.',
      'Use liquidity timing and funding headroom as core agricultural control measures alongside yield and margin.',
    ]
  ),

  hc_private_practice_operations: makeRoadmap(
    'Practice Workflow Diagnostic',
    'Billing & Administration Control',
    'Disciplined Practice Operating Model',
    [
      'Map appointment scheduling, patient file completeness, claims documentation, billing follow-up, and debtor control across the practice workflow.',
      'Separate clinical workload from avoidable front-office administrative friction.',
      'Create a simple practice dashboard covering appointment utilisation, patient waiting time, claims status, billing delays, and cash-flow visibility.',
    ],
    [
      'Tighten reception workflow, patient documentation, claims follow-up, billing routines, and debtor control.',
      'Clarify accountability between reception, clinical staff, billing, finance, and practice management.',
      'Review appointment utilisation, claims status, patient-file completeness, and cash conversion weekly.',
    ],
    [
      'Embed a disciplined private-practice operating model around front-office workflow, patient administration, claims control, and doctor utilisation.',
      'Standardise patient-file checks, billing follow-up, claims documentation, and practice dashboards.',
      'Use appointment utilisation, claims follow-up, debtor control, and service quality as weekly management measures.',
    ]
  ),

  hc_clinic_access_flow: makeRoadmap(
    'Clinic Access Diagnostic',
    'Patient Flow Stabilisation',
    'Access Reliability Model',
    [
      'Map patient access, booking flow, triage, consultation-room utilisation, waiting times, and follow-up appointment discipline.',
      'Separate true capacity shortage from scheduling friction, queue-management failure, and avoidable handoff delays.',
      'Create daily visibility on patient throughput, waiting time, no-shows, staff loading, and unresolved follow-ups.',
    ],
    [
      'Tighten appointment booking, triage, nurse/doctor scheduling, room allocation, and patient communication.',
      'Stabilise the points in the clinic flow causing the highest waiting-time or follow-up risk.',
      'Review patient access, waiting times, no-shows, and unresolved follow-ups weekly.',
    ],
    [
      'Embed clinic access and patient flow as a structured operating control system.',
      'Standardise booking, triage, consultation-room use, follow-up, and patient communication routines.',
      'Use access reliability and waiting-time control to improve patient experience and service capacity.',
    ]
  ),

  hc_hospital_capacity_flow: makeRoadmap(
    'Hospital Flow Diagnostic',
    'Capacity & Discharge Control',
    'Facility Flow Reliability Model',
    [
      'Map theatres, beds, diagnostics, consultation rooms, discharge planning, and patient-journey bottlenecks on the most exposed services.',
      'Separate pure capacity shortage from scheduling failure, handoff delay, and avoidable flow disruption.',
      'Build daily visibility on cancellations, turnover time, bed blocking, ED throughput, and waiting-list pressure.',
    ],
    [
      'Tighten scheduling, discharge planning, inter-department coordination, and bottleneck escalation.',
      'Intervene on the wards, theatres, diagnostics, or services creating the largest flow constraint.',
      'Review patient flow, capacity utilisation, cancellations, and discharge readiness weekly.',
    ],
    [
      'Embed patient flow and capacity utilisation as a clinical and economic control system together.',
      'Standardise facility flow reviews, discharge planning, handoff controls, and access management.',
      'Use flow reliability to improve both patient experience and productive capacity.',
    ]
  ),

  hc_revenue_cycle_cash: makeRoadmap(
    'Revenue Cycle Diagnostic',
    'Claims & Cash Recovery',
    'Cash Conversion Discipline',
    [
      'Map authorisation delays, coding gaps, denials, billing errors, co-payment leakage, patient account aging, and claims follow-up across the cycle.',
      'Quantify where revenue is being delayed, denied, or lost after care has already been delivered.',
      'Install visible control on the highest-value claim, billing, and collection failure points.',
    ],
    [
      'Tighten coding, authorisation, billing, claims follow-up, denial management, and collection governance.',
      'Escalate high-value claim delays, rejected claims, and debtor exposure weekly.',
      'Review cash conversion, denial rate, claims follow-up, and patient account ageing.',
    ],
    [
      'Embed the revenue cycle as a core healthcare operating discipline, not a back-office afterthought.',
      'Standardise authorisation, billing, claims, and collection review rhythms.',
      'Link revenue-cycle control directly to working capital, contribution preservation, and funding resilience.',
    ]
  ),

  hc_clinical_quality_safety: makeRoadmap(
    'Clinical Quality Diagnostic',
    'Safety Control Stabilisation',
    'Clinical Governance Model',
    [
      'Quantify quality and safety variance by facility, specialty, department, or practice and separate system issues from clinician-level variability.',
      'Map adverse events, protocol-adherence gaps, documentation quality, handover failure, and high-risk care variation.',
      'Create visible control on the clinical risks most likely to damage outcomes and economics.',
    ],
    [
      'Tighten clinical governance, protocol adherence, handover controls, adverse-event reviews, and documentation quality.',
      'Prioritise the safety risks with the highest patient, reputational, and economic exposure.',
      'Review quality and safety indicators, incident close-out, and protocol adherence weekly.',
    ],
    [
      'Embed clinical quality and patient safety as the first control system of the healthcare operating model.',
      'Standardise clinical governance reviews, incident learning, documentation control, and outcome transparency.',
      'Link quality recovery directly to reputation, contribution margin, and operating resilience.',
    ]
  ),

  hc_margin_case_contribution: makeRoadmap(
    'Contribution Diagnostic',
    'Payer & Cost Control',
    'Healthcare Margin Discipline',
    [
      'Build a contribution waterfall per case, consultation, specialty, or patient panel including payer mix and direct-cost leakage.',
      'Separate case-mix, tariff, direct-cost, claim-rejection, and service-line economics issues.',
      'Create executive visibility on where contribution is being destroyed by funding and cost-to-serve mismatch.',
    ],
    [
      'Tighten payer mix, tariff discipline, case costing, consumable control, and service-line profitability review.',
      'Intervene on services, payers, or cases carrying the weakest contribution profile.',
      'Review contribution per case, payer mix, tariff leakage, and direct cost weekly.',
    ],
    [
      'Embed contribution per case, consultation, or patient as a strategic healthcare control measure.',
      'Standardise service-line economics reviews and payer-mix visibility.',
      'Use contribution visibility to steer specialty mix, pricing, capacity, and service investment.',
    ]
  ),

  hc_medical_supplier_stock_distribution: makeRoadmap(
    'Medical Supply Diagnostic',
    'Stock & Distribution Control',
    'Healthcare Supply Reliability Model',
    [
      'Map stock availability, inventory turns, batch control, expiry risk, supplier lead times, debtor exposure, and distribution reliability.',
      'Identify where stockouts, expired stock, late delivery, or weak debtor control are eroding service performance and cash flow.',
      'Create one dashboard covering inventory health, order fulfilment, debtor days, and critical customer service levels.',
    ],
    [
      'Tighten procurement, batch control, expiry management, delivery planning, and collections cadence.',
      'Intervene on high-risk stock lines, critical customers, supplier delays, or debtor exposure.',
      'Review stock availability, inventory turns, service reliability, expiry risk, and debtor performance weekly.',
    ],
    [
      'Embed stock discipline, distribution reliability, and debtor control as one healthcare supply operating system.',
      'Standardise inventory health reviews, batch/expiry checks, delivery planning, and collection escalation.',
      'Use inventory turns, stock availability, service reliability, and debtor performance as executive control measures.',
    ]
  ),

  hc_pharmacy_margin_stock_control: makeRoadmap(
    'Pharmacy Operating Diagnostic',
    'Script & Stock Control',
    'Pharmacy Margin Model',
    [
      'Map script flow, dispensary workload, medicine stock turns, expired stock, front-shop performance, and margin leakage.',
      'Identify where prescription volume, stock discipline, shrinkage, or pricing gaps are eroding pharmacy contribution.',
      'Create daily visibility on scripts, stockouts, expiry risk, gross margin, and pharmacist capacity.',
    ],
    [
      'Tighten stock replenishment, schedule medicine control, expiry management, dispensary workflow, and front-shop economics.',
      'Intervene on medicines, stock categories, scripts, or workflow points carrying the highest margin and service risk.',
      'Review stock turns, scripts, shrinkage, expiry exposure, and gross margin weekly.',
    ],
    [
      'Embed script flow, stock control, and margin discipline as the core operating system of the pharmacy.',
      'Standardise stock checks, expiry reviews, dispensary routines, and margin reporting.',
      'Use stock turns, script throughput, shrinkage, and margin quality as management steering metrics.',
    ]
  ),

  hc_healthcare_admin_compliance: makeRoadmap(
    'Healthcare Admin Diagnostic',
    'Compliance & Workflow Control',
    'Administrative Control Model',
    [
      'Map administrative workflow, document control, compliance records, reporting gaps, role clarity, and staff workload across the healthcare operation.',
      'Identify where poor administration is creating patient confidentiality, billing, compliance, or management-visibility risk.',
      'Create a simple compliance and management dashboard covering open actions, missing documents, reporting delays, and workflow bottlenecks.',
    ],
    [
      'Tighten role accountability, document control, reporting cadence, patient confidentiality processes, and management action tracking.',
      'Close missing evidence, overdue compliance actions, and recurring administrative bottlenecks.',
      'Review open actions, missing documents, reporting delays, and workflow risks weekly.',
    ],
    [
      'Embed healthcare administration and compliance visibility as a core operating-control layer.',
      'Standardise document control, reporting routines, compliance reviews, and action tracking.',
      'Use administrative discipline to protect patient trust, compliance posture, cash flow, and leadership visibility.',
    ]
  ),

  hc_operational_capacity_flow: makeRoadmap(
    'Healthcare Flow Diagnostic',
    'Capacity Recovery',
    'Healthcare Operating Model',
    [
      'Map patient flow, scheduling, consultation capacity, diagnostic bottlenecks, documentation quality, and revenue-cycle pressure in the specific care setting.',
      'Separate true care-capacity shortage from administrative friction, scheduling weakness, or workflow breakdown.',
      'Build daily visibility on patient throughput, cancellations, waiting pressure, claims status, and management actions.',
    ],
    [
      'Tighten scheduling, handoffs, documentation, billing, and operating reviews around the real bottlenecks.',
      'Intervene on the services or workflows causing the greatest patient-experience, cash, or capacity pressure.',
      'Review flow reliability, documentation, billing status, and capacity utilisation weekly.',
    ],
    [
      'Embed patient flow and capacity utilisation as a care-quality and economic control system together.',
      'Standardise operating reviews across the relevant practice, clinic, facility, or service line.',
      'Use flow reliability to improve patient experience, productive capacity, and cash conversion.',
    ]
  ),

  en_solar_epc_installation_delivery: makeRoadmap(
    'Solar EPC Delivery Diagnostic',
    'Installation & Commissioning Control',
    'Solar Delivery Control Model',
    [
      'Map solar EPC delivery from site survey, design, procurement, installation, QA, commissioning, handover, and client sign-off.',
      'Identify installation delays, procurement gaps, inverter/module issues, commissioning failures, and site-handover risks.',
      'Create visibility on project margin, installation progress, commissioning readiness, snag status, and client acceptance.',
    ],
    [
      'Tighten site readiness, procurement tracking, QA checks, commissioning packs, handover criteria, and client sign-off routines.',
      'Intervene on projects, suppliers, installers, or sites carrying the greatest schedule, margin, or commissioning risk.',
      'Review installation progress, commissioning success, snag closure, and project margin weekly.',
    ],
    [
      'Embed solar EPC governance around installation quality, procurement readiness, commissioning discipline, and margin control.',
      'Standardise site readiness, QA, commissioning, handover, and client sign-off routines.',
      'Use installation progress, commissioning success, snag closure, and project margin as executive measures.',
    ]
  ),

  en_backup_power_storage_resilience: makeRoadmap(
    'Backup & Storage Diagnostic',
    'Resilience Control',
    'Energy Resilience Model',
    [
      'Map backup power and storage flow across load assessment, system design, batteries, inverters, generators, installation, testing, and maintenance.',
      'Identify load mismatch, battery-sizing risk, generator dependency, installation quality gaps, and resilience failures during load shedding.',
      'Create visibility on system uptime, load profile, battery health, generator readiness, and client resilience outcomes.',
    ],
    [
      'Tighten load management, commissioning tests, load-shedding scenarios, maintenance checks, and client operating procedures.',
      'Intervene on system components or sites carrying the greatest resilience and service risk.',
      'Review uptime, battery performance, load coverage, generator readiness, and incident response weekly.',
    ],
    [
      'Embed backup and storage governance around load management, system reliability, battery health, and maintenance discipline.',
      'Standardise commissioning tests, maintenance checks, and client operating procedures.',
      'Use uptime, battery performance, load coverage, and incident response as executive measures.',
    ]
  ),

  en_renewable_asset_operations: makeRoadmap(
    'Renewable Asset Diagnostic',
    'Yield Assurance Control',
    'Asset Performance Model',
    [
      'Map renewable asset performance across monitoring, availability, performance ratio, degradation, cleaning, O&M response, curtailment, and revenue loss.',
      'Identify underperforming assets, SCADA data gaps, O&M delays, curtailment exposure, and warranty-recovery opportunities.',
      'Create visibility on asset yield, availability, O&M actions, curtailment impact, and revenue at risk.',
    ],
    [
      'Tighten asset monitoring, performance reviews, cleaning schedules, fault response, warranty recovery, and claims escalation.',
      'Intervene on assets, faults, O&M providers, or contracts carrying the greatest yield and revenue risk.',
      'Review performance ratio, availability, curtailment loss, degradation, and O&M response time weekly.',
    ],
    [
      'Embed renewable asset governance around yield assurance, O&M effectiveness, warranty recovery, and revenue protection.',
      'Standardise asset monitoring, cleaning schedules, fault response, and claims escalation.',
      'Use performance ratio, availability, curtailment loss, degradation, and O&M response time as executive measures.',
    ]
  ),

  en_grid_connection_permitting: makeRoadmap(
    'Grid & Permitting Diagnostic',
    'Approval Control',
    'Grid Readiness Model',
    [
      'Map grid connection, permitting, municipal approval, NERSA requirements, wheeling options, connection studies, and substation dependencies.',
      'Identify approval delays, grid-capacity constraints, missing technical documents, and utility-interface risks.',
      'Create visibility on permit status, grid dependencies, approval owners, expected decision dates, and project economics at risk.',
    ],
    [
      'Tighten approval tracking, technical document readiness, utility engagement, grid-application packs, and escalation cadence.',
      'Escalate grid, municipal, or permitting blockers that threaten schedule and project economics.',
      'Review approval progress, grid readiness, schedule risk, and IRR exposure weekly.',
    ],
    [
      'Embed grid and permitting governance around approval tracking, technical document readiness, utility engagement, and schedule protection.',
      'Standardise grid-application packs, municipal follow-up, decision logs, and escalation cadence.',
      'Use approval progress, grid readiness, schedule risk, and IRR exposure as executive measures.',
    ]
  ),

  en_energy_efficiency_demand_management: makeRoadmap(
    'Energy Efficiency Diagnostic',
    'Demand & Consumption Control',
    'Verified Savings Model',
    [
      'Map consumption, demand charges, tariff structure, load profile, metering, submetering, power factor, and high-consumption assets.',
      'Identify quick savings from demand management, energy-efficiency improvements, tariff optimisation, and operating discipline.',
      'Create visibility on baseline consumption, savings opportunities, demand peaks, and payback by intervention.',
    ],
    [
      'Tighten energy audits, measurement and verification, load-profile reviews, demand reduction, and tariff control.',
      'Intervene on assets, sites, or processes carrying the greatest consumption and demand-charge opportunity.',
      'Review kWh reduction, demand-charge reduction, verified savings, and payback progress weekly.',
    ],
    [
      'Embed energy-efficiency governance around consumption visibility, demand reduction, tariff control, and verified savings.',
      'Standardise energy audits, savings tracking, load-profile reviews, and action accountability.',
      'Use kWh reduction, demand-charge reduction, payback period, and verified savings as executive control measures.',
    ]
  ),

  en_project_margin_irr: makeRoadmap(
    'Project Economics Diagnostic',
    'IRR Protection',
    'Value Realisation Model',
    [
      'Build a base-case to current-case IRR waterfall by project, technology, region, and cause of erosion.',
      'Separate resource under-performance, curtailment, degradation, O&M overrun, and contract-quality issues with quantified value at risk.',
      'Create executive visibility on where project economics are deteriorating before the full portfolio is affected.',
    ],
    [
      'Tighten technology, site, PPA, procurement, and O&M choices where they are creating avoidable margin dilution.',
      'Intervene on projects or assets carrying the greatest IRR erosion.',
      'Review IRR movement, yield, curtailment, O&M cost, and contractual exposure weekly.',
    ],
    [
      'Embed project economics and IRR realisation as a structured portfolio-control discipline.',
      'Standardise base-case vs current-case reviews across the energy portfolio.',
      'Use project-economics visibility to steer future development, storage, and diversification decisions.',
    ]
  ),

  en_schedule_commissioning: makeRoadmap(
    'Schedule & Commissioning Diagnostic',
    'Delivery Certainty Recovery',
    'Commissioning Discipline Model',
    [
      'Map delay from permitting, land, grid connection, EPC execution, weather windows, and commissioning handover gaps.',
      'Separate regulatory, contractor, weather, and grid-interface causes instead of treating all delay as one schedule problem.',
      'Build visible control on the projects where delivery certainty is most exposed.',
    ],
    [
      'Tighten critical-path governance around grid interface, EPC accountability, testing, commissioning, and final acceptance readiness.',
      'Escalate approval, contractor, grid, and commissioning risks before they damage economics and funding timing.',
      'Review schedule movement, commissioning readiness, and acceptance blockers weekly.',
    ],
    [
      'Embed schedule and commissioning control as a cross-functional portfolio discipline spanning development to operations.',
      'Standardise delivery reviews, commissioning packs, testing logic, and handover criteria.',
      'Use delay visibility to protect both economics and funding timing.',
    ]
  ),

  en_contractual_claims: makeRoadmap(
    'Contractual Recovery Diagnostic',
    'Claims Control',
    'Commercial Recovery Model',
    [
      'Audit variation recovery, performance guarantees, curtailment compensation, insurance claims, and EPC/OEM contractual exposure.',
      'Quantify the gap between value or entitlement available and value actually recovered under contract.',
      'Escalate the projects where weak claims recovery is allowing avoidable economic loss to persist.',
    ],
    [
      'Tighten governance over change events, compensation triggers, warranty recovery, insurance claims, and standard contract discipline.',
      'Prioritise claims with the greatest economic exposure and strongest evidence base.',
      'Review contractual recovery, claim status, warranty exposure, and compensation movement weekly.',
    ],
    [
      'Embed contractual performance and claims recovery as a core value-protection system across the portfolio.',
      'Standardise claim evidence, warranty recovery, compensation triggers, and escalation routines.',
      'Use executive oversight to protect earned value and reduce contractual leakage.',
    ]
  ),

  en_cashflow_transition: makeRoadmap(
    'Funding & Cash Transition Diagnostic',
    'Construction-to-Operation Cash Control',
    'Funding Discipline Model',
    [
      'Map construction-phase funding peaks, drawdown timing, bonding exposure, and operational-phase cash conversion by project.',
      'Quantify where schedule delay, payment-security weakness, or O&M phasing is stressing funding headroom.',
      'Install visible control on the projects carrying the greatest liquidity and refinancing risk.',
    ],
    [
      'Tighten payment-security, milestone alignment, spare-parts working capital, post-commissioning cash logic, and refinancing readiness.',
      'Escalate projects where delay or funding headroom threatens delivery continuity.',
      'Review drawdowns, funding headroom, milestone claims, and operational cash conversion weekly.',
    ],
    [
      'Embed construction-to-operation cash discipline as a first-order portfolio control issue.',
      'Standardise funding reviews, milestone cash tracking, spare-parts planning, and refinancing logic.',
      'Use funding-headroom visibility to protect delivery continuity and return realisation.',
    ]
  ),

  margin_leakage: makeRoadmap(
    'Margin Leakage Diagnostic',
    'Recovery Control',
    'Margin Discipline Embedded',
    [
      'Identify and quantify the top three margin leakage points with line-item precision.',
      'Institute immediate controls to freeze non-essential cost expansion while leakage is validated.',
      'Validate pricing discipline, discount governance, and operational waste at the most granular level.',
    ],
    [
      'Launch a fact-based margin recovery programme with clear executive ownership and KPIs.',
      'Drive owner-level accountability for the largest leakage pools through structured workstreams.',
      'Embed weekly operating reviews that track margin recovery progress in real time.',
    ],
    [
      'Institutionalise margin discipline into the operating rhythm.',
      'Standardise margin review before key commercial and operating decisions.',
      'Use margin recovery and margin quality as leadership steering measures.',
    ]
  ),

  workflow_breakdown: makeRoadmap(
    'Workflow Breakdown Diagnostic',
    'Execution Stabilisation',
    'Workflow Discipline Embedded',
    [
      'Map the end-to-end workflow and isolate the primary execution bottlenecks.',
      'Stabilise critical handoff points and eliminate non-value-adding activities.',
      'Introduce short-cycle executive review routines to surface and resolve blockers immediately.',
    ],
    [
      'Redesign the operating model around the critical path to restore execution velocity.',
      'Clarify accountability across teams and functions with explicit RACI ownership.',
      'Implement service-level tracking and performance dashboards for turnaround and output quality.',
    ],
    [
      'Embed workflow reviews into the operating rhythm.',
      'Standardise handoffs, escalation, and accountability routines.',
      'Use execution velocity and handoff quality as leadership measures.',
    ]
  ),

  planning_failure: makeRoadmap(
    'Planning Failure Diagnostic',
    'Planning Control Recovery',
    'Planning Discipline Embedded',
    [
      'Stress-test current planning assumptions against actual demand and capacity realities.',
      'Realign planning cadence and forecasting processes to current operational truth.',
      'Close the largest planning-to-execution gaps with immediate corrective actions.',
    ],
    [
      'Rebuild the strategic planning model anchored in current operational and market facts.',
      'Strengthen coordination between commercial, operational, and finance leadership.',
      'Embed disciplined review mechanisms for forecast, schedule, and delivery adjustments.',
    ],
    [
      'Institutionalise planning reviews into the operating model.',
      'Standardise forecast, capacity, and execution alignment.',
      'Use planning accuracy and delivery reliability as leadership measures.',
    ]
  ),

  capacity_constraint: makeRoadmap(
    'Capacity Constraint Diagnostic',
    'Capacity Stabilisation',
    'Capacity Discipline Embedded',
    [
      'Diagnose the root throughput or utilisation constraint with data-driven precision.',
      'Separate genuine capacity loss from demand pressure or scheduling inefficiency.',
      'Stabilise immediate availability, staffing, or delivery pressure points.',
    ],
    [
      'Rebalance capacity allocation against strategic priorities and demand signals.',
      'Implement executive visibility dashboards on utilisation and constraint performance.',
      'Sequence improvement initiatives around the true operational bottleneck.',
    ],
    [
      'Embed capacity reviews into leadership cadence.',
      'Standardise capacity allocation and constraint escalation.',
      'Use productive capacity and utilisation quality as steering measures.',
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
