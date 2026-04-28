import type { RecommendationSet } from './types';

const rec = (quickWins: string[], priorities: string[]): RecommendationSet => ({
  quickWins,
  priorities,
});

const LIBRARY: Record<string, RecommendationSet> = {
  ps_consulting_advisory_delivery: rec(
    [
      'Map the full consulting engagement flow from lead source, diagnostic, proposal, statement of work, delivery handoff, client workshop, deliverables, and implementation support.',
      'Identify scope creep, under-scoped deliverables, weak client decision points, and effort leakage across active advisory engagements.',
      'Create executive visibility on proposal conversion, project profitability, delivery turnaround, client value, and unresolved client actions.',
    ],
    [
      'Build a consulting delivery governance model that links scoping, pricing, delivery discipline, client value, and margin protection.',
      'Standardise statements of work, change requests, workshop outputs, and engagement close-out reviews.',
      'Use engagement profitability, client value realisation, and scope discipline as core professional-services steering measures.',
    ]
  ),

  ps_legal_compliance_matter_management: rec(
    [
      'Map active matters by mandate, stage, owner, deadline, client exposure, billing status, and unresolved risk.',
      'Identify matter-management bottlenecks, missed handoffs, weak document control, and billing leakage across legal or compliance work.',
      'Create a matter dashboard covering deadlines, client instructions, work-in-progress, billing, risk status, and open actions.',
    ],
    [
      'Install disciplined matter governance with clear owner accountability, deadline control, client communication routines, and billing follow-through.',
      'Standardise matter-opening, mandate confirmation, document control, review, and close-out processes.',
      'Use matter velocity, risk exposure, recovery rate, and client responsiveness as executive control measures.',
    ]
  ),

  ps_accounting_tax_month_end: rec(
    [
      'Map client administration across bookkeeping, VAT, payroll, SARS submissions, reconciliations, month-end packs, and management accounts.',
      'Identify missing client documents, recurring reconciliation delays, staff overload, and billing under-recovery.',
      'Create a client dashboard covering submission status, document gaps, month-end progress, queries, billing, and overdue actions.',
    ],
    [
      'Build a disciplined accounting and tax workflow with clear client cut-off dates, owner accountability, and escalation logic.',
      'Standardise monthly pack preparation, document requests, review sign-offs, and client communication cadence.',
      'Use turnaround, submission accuracy, client responsiveness, and recovery per client as core practice management measures.',
    ]
  ),

  ps_engineering_architecture_project_control: rec(
    [
      'Map technical project flow across brief, design, drawings, reviews, approvals, site inspections, revisions, and client sign-off.',
      'Identify design-change leakage, drawing revision issues, late approvals, unclear technical ownership, and rework pressure.',
      'Create visibility on active projects, design status, outstanding approvals, site queries, revision control, and fee recovery.',
    ],
    [
      'Install technical project governance linking design quality, document control, client approvals, site coordination, and fee protection.',
      'Standardise drawing revision control, approval gates, site query responses, and change-instruction discipline.',
      'Use technical delivery reliability, change recovery, and project profitability as executive steering measures.',
    ]
  ),

  ps_agency_marketing_pipeline_delivery: rec(
    [
      'Map agency workflow from lead, brief, proposal, campaign planning, creative production, approval, delivery, reporting, and retainer review.',
      'Identify campaign delays, approval friction, weak brief quality, under-priced retainers, and account-management leakage.',
      'Create visibility on pipeline quality, campaign status, client approvals, delivery deadlines, retainer profitability, and renewal risk.',
    ],
    [
      'Build an agency operating rhythm that protects creative delivery, client retention, campaign performance, and margin quality.',
      'Standardise brief intake, campaign handoff, approval gates, reporting templates, and retainer review cadence.',
      'Use campaign delivery reliability, retainer profitability, and client retention as executive control measures.',
    ]
  ),

  ps_it_managed_services_sla: rec(
    [
      'Map ticket flow, SLA performance, support desk workload, escalation paths, recurring incidents, and client communication quality.',
      'Identify ticket backlog, slow response, repeat incidents, under-priced support, and weak accountability between support tiers.',
      'Create a dashboard covering open tickets, SLA breach risk, response time, resolution time, recurring issues, and client profitability.',
    ],
    [
      'Build a managed-services control model linking support desk execution, SLA compliance, recurring-issue elimination, and client economics.',
      'Standardise triage, escalation, closure notes, root-cause tracking, and monthly client service reviews.',
      'Use SLA performance, ticket resolution quality, recurring incidents, and account profitability as core steering measures.',
    ]
  ),

  ps_conversion_delivery: rec(
    [
      'Conduct a comprehensive audit of proposal conversion rates, scoping accuracy, and delivery turnaround across the active pipeline.',
      'Establish real-time executive visibility into billable utilisation, client delivery performance, and account-level profitability.',
      'Clarify and reinforce cross-functional role accountability across business development, solutioning, delivery, and account leadership.',
    ],
    [
      'Design and implement a robust commercial-to-delivery governance model for professional services execution.',
      'Strengthen proposal governance, delivery standards, and client economics review cadences at executive level.',
      'Institute weekly performance tracking of conversion rates, utilisation, delivery quality, and margins by account.',
    ]
  ),

  ps_utilisation_economics: rec(
    [
      'Create account-level visibility on billable recovery, utilisation mix, and realised contribution by service line.',
      'Stress-test retainer economics, scoping discipline, and pricing recovery across active clients.',
      'Identify where effort intensity is growing faster than fee recovery or client value realisation.',
    ],
    [
      'Reposition client economics and utilisation governance as core leadership steering measures.',
      'Tighten pricing, scoping, and recovery discipline across the professional services portfolio.',
      'Institutionalise weekly review of utilisation quality and margin realisation by account.',
    ]
  ),

  ps_operating_model: rec(
    [
      'Clarify role interfaces across sales, solutioning, delivery, and account leadership.',
      'Build one executive view that integrates pipeline health, utilisation, delivery quality, and client economics.',
      'Eliminate decision ambiguity in handoffs, escalation paths, and ownership of client outcomes.',
    ],
    [
      'Strengthen the operating model before growth amplifies control weakness.',
      'Install executive review rhythms that link leadership decisions directly to operating outcomes.',
      'Use role clarity and decision cadence as the foundation for scalable service delivery.',
    ]
  ),

  pp_label_flexible_packaging_operations: rec(
    [
      'Map label, flexible packaging, and sleeve production flow from artwork, proofing, substrate readiness, press, slitting, rewinding, inspection, and dispatch.',
      'Quantify waste, reruns, make-ready loss, substrate issues, colour variation, and finishing defects by job, press, and customer.',
      'Create daily visibility on artwork readiness, press performance, rewind/slitting quality, dispatch readiness, and job margin leakage.',
    ],
    [
      'Build a label and flexible-packaging control model around right-first-time artwork, substrate discipline, press stability, finishing quality, and job profitability.',
      'Standardise release criteria for artwork, proofs, dies, substrates, inks, and customer approvals before jobs enter production.',
      'Use job margin, rerun causes, waste, turnaround, and customer complaint patterns as executive steering measures.',
    ]
  ),

  pp_carton_folding_carton_postpress: rec(
    [
      'Map carton and post-press flow across artwork, plates, die-cutting, creasing, foiling, gluing, finishing, packing, and dispatch.',
      'Identify where folder-gluer bottlenecks, die-cutting errors, board issues, setup loss, and late finishing are damaging turnaround and margin.',
      'Create visibility on post-press queues, finishing waste, rerun causes, dispatch delay, and capacity balance.',
    ],
    [
      'Treat post-press throughput as a strategic bottleneck, not a downstream afterthought.',
      'Tighten die-line control, make-ready discipline, finishing sequencing, quality gates, and dispatch readiness.',
      'Use carton job profitability, finishing throughput, waste, and OTIF as leadership control measures.',
    ]
  ),

  pp_commercial_print_prepress_control: rec(
    [
      'Map commercial print flow from quote, artwork, pre-press, proofing, plate/CTP, press, finishing, delivery, and invoice.',
      'Identify artwork errors, proofing delays, version-control failures, plate issues, and late customer changes causing reruns or disputes.',
      'Create visibility on artwork readiness, proof status, pre-press queue, press release readiness, and job-ticket completeness.',
    ],
    [
      'Build pre-press and commercial print governance around specification integrity, version control, proof approval, and job release discipline.',
      'Standardise artwork intake, PDF proofing, customer sign-off, imposition checks, and change-request control.',
      'Use right-first-time release, rerun reduction, turnaround, and client trust as executive performance measures.',
    ]
  ),

  pp_market_expansion_sales_pipeline: rec(
    [
      'Map current sales pipeline by sector, account type, decision-maker, product fit, margin potential, and probability of conversion.',
      'Identify underdeveloped markets such as pharma, food, cosmetics, aviation suppliers, industrial clients, and outsourced service opportunities.',
      'Create a focused target-account list with owner accountability, contact strategy, offer positioning, and weekly follow-up discipline.',
    ],
    [
      'Build a disciplined market-expansion engine that links target sectors, sales representatives, technical capability, quotation discipline, and delivery readiness.',
      'Use freelance or specialist sales representation only where target-account ownership, margin rules, and reporting cadence are clear.',
      'Treat pipeline quality, conversion rate, sector margin, and retained account growth as executive growth measures.',
    ]
  ),

  pp_executive_margin_leakage: rec(
    [
      'Build a portfolio margin view by customer, product family, site, job type, and quoting discipline.',
      'Identify unprofitable work, absorbed customer changes, under-pricing, and filler work consuming capacity without adequate return.',
      'Create executive visibility on where commercial decisions are creating production pressure and margin erosion.',
    ],
    [
      'Treat portfolio mix and quoting discipline as executive margin-control levers.',
      'Reposition the business around profitable work, priority sectors, and disciplined customer segmentation.',
      'Embed margin-quality review before capacity is committed to low-return work.',
    ]
  ),

  pp_operational_waste_rework: rec(
    [
      'Quantify waste, reruns, and spoilage at job, press, and finishing level.',
      'Identify the three largest avoidable margin leaks caused by waste or rework.',
      'Install daily control on rerun causes, spoilage rates, and corrective owner actions.',
    ],
    [
      'Restore gross margin by treating waste and rework as executive control issues, not shop-floor noise.',
      'Assign owner-led recovery plans to the largest recurring waste pools.',
      'Institutionalise right-first-time discipline across the end-to-end print flow.',
    ]
  ),

  pp_planning_turnaround_control: rec(
    [
      'Map job queue delays, planning bottlenecks, sequencing failures, and late-stage handoff losses.',
      'Introduce daily visual scheduling and turnaround dashboards at plant leadership level.',
      'Stabilise the planning-to-press-to-finishing flow around actual capacity and customer priority.',
    ],
    [
      'Treat turnaround velocity as a strategic client-retention lever.',
      'Use scheduling control and on-time delivery as core executive operating measures.',
      'Reduce avoidable queue time and hidden capacity loss across the full workflow.',
    ]
  ),

  pp_specification_change_control: rec(
    [
      'Audit artwork, specification, proofing, approval, and version-control failure points.',
      'Institute strict change-control and release governance before jobs reach press.',
      'Escalate recurring client-specification errors through a single accountability mechanism.',
    ],
    [
      'Build right-first-time specification control into the commercial and production workflow.',
      'Reduce rerun risk by hardening approval gates and job-release discipline.',
      'Protect client trust by tightening specification integrity and change governance.',
    ]
  ),

  pp_capacity_bottleneck_balance: rec(
    [
      'Measure setup time, changeover loss, net productive hours, and bottlenecks by press and finishing asset.',
      'Attack the largest setup and sequencing losses through focused reduction sprints.',
      'Rebalance jobs across press and finishing capacity to reduce hidden idle time and queue buildup.',
    ],
    [
      'Raise effective capacity through setup-time reduction and smarter utilisation governance.',
      'Use press productivity and finishing flow as margin levers, not just technical metrics.',
      'Link asset utilisation to executive review of turnaround, gross margin, and service performance.',
    ]
  ),

  pp_waste_rework: rec(
    [
      'Quantify waste, reruns, and spoilage at job, press, and finishing level.',
      'Identify the largest avoidable margin leaks caused by waste or rework.',
      'Install daily control on rerun causes, spoilage rates, and corrective owner actions.',
    ],
    [
      'Restore gross margin by treating waste and rework as executive control issues.',
      'Assign owner-led recovery plans to recurring waste pools.',
      'Institutionalise right-first-time discipline across the end-to-end print flow.',
    ]
  ),

  pp_turnaround_velocity: rec(
    [
      'Map job queue delays, planning bottlenecks, and late-stage handoff failures.',
      'Introduce daily visual scheduling and turnaround dashboards.',
      'Stabilise the planning-to-press-to-finishing flow around actual capacity.',
    ],
    [
      'Treat turnaround velocity as a strategic client-retention lever.',
      'Use scheduling control and on-time delivery as core executive operating measures.',
      'Reduce avoidable queue time and hidden capacity loss.',
    ]
  ),

  pp_specification_control: rec(
    [
      'Audit artwork, specification, proofing, and approval failure points.',
      'Institute strict change-control and version-control governance before jobs reach press.',
      'Escalate recurring client-specification errors through a single accountability mechanism.',
    ],
    [
      'Build right-first-time specification control into the commercial and production workflow.',
      'Reduce rerun risk by hardening approval gates and job release discipline.',
      'Protect client trust by tightening specification integrity and change governance.',
    ]
  ),

  pp_press_utilisation: rec(
    [
      'Measure setup time, changeover loss, and usable press hours by asset.',
      'Attack the largest setup losses with focused reduction sprints.',
      'Re-sequence jobs to improve press loading and reduce hidden idle capacity.',
    ],
    [
      'Raise effective capacity through setup-time reduction and smarter utilisation governance.',
      'Use press productivity and finishing flow as margin levers.',
      'Link asset utilisation to executive review of turnaround and gross margin.',
    ]
  ),

  mfg_discrete_production_flow: rec(
    [
      'Map work-order flow from planning, material release, production routing, work centres, assembly, quality checks, and dispatch.',
      'Identify where line balancing, work-order discipline, setup loss, labour allocation, or routing weakness is reducing throughput.',
      'Create visibility on schedule attainment, bottleneck work centres, work-in-progress, first-pass yield, and daily output recovery.',
    ],
    [
      'Build a discrete manufacturing control model around work-order accuracy, schedule discipline, labour balance, quality-at-source, and throughput.',
      'Standardise routing, work instructions, shift handovers, WIP control, and production review routines.',
      'Use work-order velocity, schedule adherence, first-pass yield, and bottleneck performance as executive measures.',
    ]
  ),

  mfg_process_yield_batch_control: rec(
    [
      'Map batch flow across recipe/formulation, material issue, mixing, processing, filling, quality release, and yield reconciliation.',
      'Quantify batch variance, yield loss, rework, downtime, quality holds, and formulation inconsistency by product family.',
      'Create batch-level visibility on planned yield, actual yield, variance causes, quality release, and cost impact.',
    ],
    [
      'Build a batch and process-control model around recipe discipline, yield stability, quality release, and loss prevention.',
      'Standardise batch records, formulation control, variance review, operator checks, and process-parameter governance.',
      'Use yield realisation, batch variance, quality release time, and process stability as leadership steering measures.',
    ]
  ),

  mfg_food_fmcg_quality_traceability: rec(
    [
      'Map food/FMCG flow across raw material, batch traceability, production, packing, quality release, cold chain, storage, and dispatch.',
      'Identify traceability gaps, shelf-life risk, quality downgrades, recall exposure, and cold-chain weaknesses.',
      'Create visibility on batch traceability, expiry exposure, quality holds, stock rotation, and service-level risk.',
    ],
    [
      'Build a food/FMCG control model around traceability, food safety, shelf-life protection, stock rotation, and quality release discipline.',
      'Standardise HACCP controls, batch records, recall readiness, cold-chain checks, and expiry management.',
      'Use traceability integrity, quality release performance, shelf-life risk, and service reliability as executive measures.',
    ]
  ),

  mfg_engineering_fabrication_bom_control: rec(
    [
      'Map fabrication flow across drawing revision, BOM, cut list, procurement, machining, welding, assembly, inspection, and delivery.',
      'Identify BOM errors, drawing-revision gaps, engineering changes, rework, material mismatch, and routing weakness.',
      'Create visibility on revision status, material readiness, fabrication bottlenecks, rework causes, and job profitability.',
    ],
    [
      'Build an engineering and fabrication control model around BOM integrity, technical change governance, routing discipline, and quality checks.',
      'Standardise drawing revision control, engineering change approvals, cut-list accuracy, inspection gates, and job close-out reviews.',
      'Use revision accuracy, rework reduction, material readiness, and job margin as leadership control measures.',
    ]
  ),

  mfg_maintenance_oee_asset_reliability: rec(
    [
      'Break OEE losses into availability, performance, and quality-rate losses by asset, line, shift, and failure mode.',
      'Map breakdowns, preventive maintenance adherence, critical spares, MTBF, MTTR, and recurring stoppages.',
      'Create visibility on asset downtime, maintenance backlog, spares risk, and constrained-equipment recovery.',
    ],
    [
      'Build asset-reliability governance around preventive maintenance, critical spares, root-cause elimination, and constrained-asset protection.',
      'Standardise maintenance planning, breakdown reviews, spares governance, and reliability escalation routines.',
      'Use OEE, MTBF, MTTR, maintenance compliance, and downtime cost as executive productivity measures.',
    ]
  ),

  mfg_supply_chain_inventory_control: rec(
    [
      'Map material availability across suppliers, lead times, purchase orders, MRP signals, warehouse accuracy, inventory health, and production shortages.',
      'Identify supplier delays, stockouts, obsolete stock, slow-moving inventory, and planning instability affecting throughput.',
      'Create visibility on supplier reliability, raw-material risk, stock health, inventory turns, and production-impacting shortages.',
    ],
    [
      'Build supply-chain and inventory governance around material availability, supplier reliability, MRP discipline, and working-capital control.',
      'Standardise supplier escalation, purchase-order follow-up, inventory health reviews, and production-shortage management.',
      'Use material availability, supplier OTIF, inventory turns, stockout risk, and obsolete stock as executive measures.',
    ]
  ),

  mfg_product_margin_protection: rec(
    [
      'Quantify product margin leakage by product family, customer, plant, and cause rather than treating all erosion as one manufacturing issue.',
      'Separate strategic mix, pricing under-recovery, discount leakage, material variance, labour absorption, and rework into one margin waterfall.',
      'Create executive visibility on where complexity, change frequency, and weak margin contribution are consuming capacity without adequate return.',
    ],
    [
      'Treat product margin protection as a portfolio and operating-system discipline, not only a plant-cost issue.',
      'Tighten product-mix, customer-economics, and pricing recovery decisions before weak work consumes more capacity.',
      'Use standard-cost drift and realised margin contribution as leadership steering measures across the manufacturing network.',
    ]
  ),

  mfg_schedule_delivery_velocity: rec(
    [
      'Map where MPS, MRP, finite loading, setup loss, supplier variability, and dispatch bottlenecks are destabilising schedule adherence.',
      'Separate planning-system instability from genuine shop-floor productivity loss.',
      'Build daily visibility on OTIF, schedule attainment, bottleneck movement, and expediting pressure.',
    ],
    [
      'Treat delivery velocity as the output of planning discipline, material readiness, and execution reliability together.',
      'Reset schedule control around real constraints, frozen-zone discipline, and practical capacity.',
      'Use schedule adherence and delivery velocity as executive operating measures, not only production-planning metrics.',
    ]
  ),

  mfg_quality_specification_control: rec(
    [
      'Audit engineering changes, BOM/version accuracy, routing discipline, work-instruction adherence, and first-pass yield by product family.',
      'Quantify COPQ, defect Pareto, non-conformance recurrence, and RCCA closure performance.',
      'Install visible control on the specification and process failures driving rework, concessions, and external quality risk.',
    ],
    [
      'Treat quality and specification control as an economic control system, not only a compliance requirement.',
      'Harden BOM, routing, calibration, gauge control, and process-discipline governance where value leakage is highest.',
      'Use first-pass quality and recurrence prevention as core margin-protection levers.',
    ]
  ),

  mfg_asset_oee_capacity: rec(
    [
      'Break OEE into availability, performance, and quality-rate losses by line, asset, and shift.',
      'Measure changeover loss, minor stoppages, waiting/starvation, and operator variability on constrained assets.',
      'Identify whether the real issue is line-level productivity, capacity balance across sites, or technology/process mismatch.',
    ],
    [
      'Use OEE and asset productivity as value-creation measures tied directly to margin, delivery, and working capital.',
      'Rebalance assets, cells, and plant loading around practical constraints rather than nominal capacity.',
      'Treat automation, skill dependency, and network capacity balance as leadership decisions, not only engineering topics.',
    ]
  ),

  mfg_bottleneck_throughput: rec(
    [
      'Map the primary bottleneck and quantify lost throughput with hard operational data.',
      'Stabilise upstream and downstream flow around the true constraint.',
      'Launch rapid countermeasures on the highest-value throughput losses.',
    ],
    [
      'Treat throughput acceleration as a strategic value-creation programme.',
      'Align production planning, staffing, and maintenance around the true bottleneck.',
      'Install executive visibility on constraint performance and output recovery.',
    ]
  ),

  mfg_quality_source: rec(
    [
      'Quantify defect, scrap, and rework failure points at source.',
      'Contain the highest-impact quality escapes immediately.',
      'Reset quality ownership at the points where defects are created, not discovered later.',
    ],
    [
      'Embed quality-at-source as a core leadership discipline.',
      'Reduce cost-of-poor-quality through hard controls and visible accountability.',
      'Use first-pass quality and defect prevention as margin protection levers.',
    ]
  ),

  mfg_supply_chain_exposure: rec(
    [
      'Stress-test supplier risk, lead-time volatility, and inventory vulnerabilities.',
      'Map where material constraints are threatening throughput and customer delivery.',
      'Create executive visibility on the most material supply-chain exposures.',
    ],
    [
      'Strengthen supply continuity and lead-time control as a resilience agenda.',
      'Reduce operational fragility by rebalancing inventory, sourcing, and planning discipline.',
      'Move supply-chain risk from reactive firefighting into structured executive control.',
    ]
  ),

  mfg_oee_capacity: rec(
    [
      'Break down OEE losses into availability, performance, and quality components.',
      'Target the most material downtime and speed losses immediately.',
      'Build daily visibility on practical capacity recovery by line and asset.',
    ],
    [
      'Treat OEE and capacity underperformance as executive productivity issues.',
      'Raise asset productivity through disciplined visibility and ownership.',
      'Link effective capacity to monthly margin and service-level outcomes.',
    ]
  ),

  con_general_building_contractor: rec(
    [
      'Map building-project execution across tender assumptions, site supervision, subcontractor coordination, finishes, snagging, practical completion, and cash certification.',
      'Identify where programme slippage, poor supervision, rework, subcontractor gaps, or late approvals are damaging margin and delivery credibility.',
      'Create visibility on project margin, site productivity, open variations, snag status, subcontractor performance, and certification risk.',
    ],
    [
      'Build a building-contractor control model around site execution, subcontractor coordination, programme discipline, quality closure, and commercial recovery.',
      'Standardise weekly site reviews, variation capture, snag control, subcontractor accountability, and payment-certification follow-up.',
      'Use site productivity, programme adherence, margin forecast, and certification progress as leadership measures.',
    ]
  ),

  con_civil_infrastructure_delivery: rec(
    [
      'Map civil works flow across earthworks, plant utilisation, materials, subcontractors, quality testing, programme milestones, claims, and certificates.',
      'Identify productivity loss from idle plant, weather, sequencing, site access, rework, material shortages, or weak daily production control.',
      'Create visibility on plant productivity, quantity installed, programme status, claim exposure, and cash certification.',
    ],
    [
      'Build civil-delivery governance around plant productivity, quantity tracking, programme control, quality testing, and commercial recovery.',
      'Standardise daily production reporting, plant utilisation review, site-instruction capture, and claims evidence management.',
      'Use quantity output, plant utilisation, programme movement, and margin forecast as executive control measures.',
    ]
  ),

  con_specialist_subcontractor_control: rec(
    [
      'Map specialist subcontractor workflow across scope, shop drawings, site access, interface dependencies, programme milestones, variations, and payment claims.',
      'Identify scope gaps, coordination failure, late approvals, payment delays, and interface issues affecting delivery and cash flow.',
      'Create visibility on packages at risk, site dependencies, approvals, variation status, and payment exposure.',
    ],
    [
      'Build subcontractor performance governance around scope clarity, interface coordination, programme commitments, variation recovery, and payment discipline.',
      'Standardise package handoffs, shop drawing approvals, site readiness checks, and weekly subcontractor performance reviews.',
      'Use package progress, claim recovery, interface risk, and cash exposure as leadership measures.',
    ]
  ),

  con_hs_compliance_safety_file: rec(
    [
      'Audit safety-file completeness, risk assessments, method statements, toolbox talks, incident logs, scaffold inspections, and subcontractor compliance documents.',
      'Identify urgent OHS gaps that could stop work, trigger penalties, or expose the client to site-level legal risk.',
      'Create a compliance action register covering missing documents, responsible owners, due dates, site risk, and audit readiness.',
    ],
    [
      'Build a construction H&S control model around safety-file discipline, evidence packs, subcontractor compliance, incident reporting, and audit readiness.',
      'Standardise site safety reviews, document renewal checks, toolbox-talk records, and corrective-action tracking.',
      'Use audit readiness, incident trends, close-out discipline, and subcontractor compliance as executive control measures.',
    ]
  ),

  con_qs_cost_variation_control: rec(
    [
      'Map BOQ, measurement, valuations, variations, claims, interim payment certificates, retentions, and final-account exposure.',
      'Identify disallowed items, weak substantiation, missed notices, poor measurement control, and unrecovered variation value.',
      'Create visibility on commercial exposure, claim status, certification delays, retention risk, and final-account movement.',
    ],
    [
      'Build QS and commercial governance around BOQ discipline, measurement accuracy, variation substantiation, and final-account recovery.',
      'Standardise claim packs, valuation reviews, notice compliance, rate build-ups, and certification follow-up.',
      'Use claim conversion, certification progress, margin recovery, and final-account closure as leadership measures.',
    ]
  ),

  con_property_development_management: rec(
    [
      'Map development feasibility across land, zoning, approvals, funding, professional team, contractor procurement, leasing/pre-sales, delivery, and handover.',
      'Identify approval delays, feasibility gaps, funding risks, contractor exposure, and weak development-governance points.',
      'Create visibility on project feasibility, approval status, funding headroom, cost-to-complete, sales/leasing risk, and handover readiness.',
    ],
    [
      'Build development governance linking feasibility, approvals, funding, contractor control, market absorption, and handover risk.',
      'Standardise development-stage gates, cost reviews, approval tracking, professional-team accountability, and funding reviews.',
      'Use feasibility resilience, approval movement, cost-to-complete, and funding headroom as executive measures.',
    ]
  ),

  con_facilities_maintenance_sla: rec(
    [
      'Map facilities maintenance flow across call-outs, work orders, SLA response, planned maintenance, tenant complaints, parts availability, and billing.',
      'Identify recurring asset failures, backlog, missed SLA response, weak work-order closure, and under-recovered service work.',
      'Create visibility on open work orders, SLA compliance, repeat faults, planned maintenance, cost recovery, and customer satisfaction.',
    ],
    [
      'Build maintenance-service governance around SLA discipline, work-order closure, repeat-fault elimination, asset upkeep, and billing recovery.',
      'Standardise triage, dispatch, job closure notes, parts control, planned maintenance routines, and client reporting.',
      'Use SLA performance, backlog ageing, repeat faults, and service profitability as leadership measures.',
    ]
  ),

  con_portfolio_margin_erosion: rec(
    [
      'Build a portfolio-level view of tender risk, current forecast margin, central overhead absorption, and project selection quality.',
      'Identify under-bid or wrong-fit projects that are consuming capacity without adequate margin protection.',
      'Create executive visibility on which projects, clients, or packages are structurally eroding portfolio margin.',
    ],
    [
      'Treat tender selection and portfolio mix as the first layer of construction margin control.',
      'Tighten bid/no-bid discipline, risk pricing, and executive review of margin-at-risk work.',
      'Use portfolio margin quality as a leadership steering measure across regions, project types, and clients.',
    ]
  ),

  con_commercial_leakage_claims: rec(
    [
      'Audit current variations, claims, approvals, notices, and unresolved entitlement exposures.',
      'Tighten the evidence trail and approval discipline around change events.',
      'Escalate at-risk claims before value leakage becomes irreversible.',
    ],
    [
      'Treat variation and claim control as a commercial recovery engine.',
      'Strengthen governance over changes, approvals, notices, and contractual entitlement.',
      'Use executive oversight to protect commercial value already earned on site.',
    ]
  ),

  con_operational_delivery_risk: rec(
    [
      'Map site productivity loss, rework, idle plant, subcontractor delays, and supervision weaknesses on exposed projects.',
      'Identify where operational execution failure is destroying commercial performance.',
      'Create short-interval control around the sites or packages carrying the greatest value at risk.',
    ],
    [
      'Treat site execution as a margin and delivery-control system, not only a construction activity.',
      'Tighten subcontractor coordination, supervision cadence, productivity tracking, and quality recovery.',
      'Link project-level operating recovery directly to forecast margin and milestone achievement.',
    ]
  ),

  con_schedule_coordination_slippage: rec(
    [
      'Identify critical-path slippage and quantify the delivery and cash implications.',
      'Stabilise milestone governance and short-interval control on delayed projects.',
      'Link site actions directly to the schedule drivers that matter most.',
    ],
    [
      'Use critical-path visibility as a core executive control mechanism.',
      'Reduce schedule drift through disciplined site and project governance.',
      'Treat programme integrity as central to delivery credibility and cash protection.',
    ]
  ),

  con_cashflow_certification_exposure: rec(
    [
      'Map billing, certification, retention, and collection blockages across live projects.',
      'Quantify cash exposure from delayed certificates, WIP, retentions, and weak billing cadence.',
      'Install weekly project cash reviews on the most exposed contracts.',
    ],
    [
      'Treat project cash flow as a first-order executive control measure.',
      'Tighten billing, certification, valuation, and collection discipline across the portfolio.',
      'Protect liquidity by linking project controls directly to cash realisation.',
    ]
  ),

  con_project_margin: rec(
    [
      'Map margin leakage by live project, package, and major cost driver.',
      'Identify where budget drift, procurement slippage, or execution waste is eroding project economics.',
      'Install weekly project commercial reviews on the most exposed jobs.',
    ],
    [
      'Protect project margin through disciplined cost control and owner-level accountability.',
      'Treat commercial control as a weekly operating discipline, not a month-end exercise.',
      'Escalate margin recovery on live projects with visible leadership sponsorship.',
    ]
  ),

  con_schedule_slippage: rec(
    [
      'Identify critical-path slippage and quantify delivery and cash implications.',
      'Stabilise milestone governance and short-interval control on delayed projects.',
      'Link site actions directly to schedule drivers that matter most.',
    ],
    [
      'Use critical-path visibility as a core executive control mechanism.',
      'Reduce schedule drift through disciplined site and project governance.',
      'Treat programme integrity as central to delivery credibility and cash protection.',
    ]
  ),

  con_variations_claims: rec(
    [
      'Audit current variations, claims, approvals, and unresolved commercial exposures.',
      'Tighten the evidence trail and approval discipline around change events.',
      'Escalate at-risk claims before value leakage becomes irreversible.',
    ],
    [
      'Treat variation and claim control as a commercial recovery engine.',
      'Strengthen governance over changes, approvals, and contractual entitlement.',
      'Use executive oversight to protect commercial value already earned on site.',
    ]
  ),

  con_cashflow_controls: rec(
    [
      'Map billing, certification, and collection blockages across live projects.',
      'Quantify cash exposure from retentions, delayed certificates, and weak billing cadence.',
      'Install weekly project cash reviews on the most exposed contracts.',
    ],
    [
      'Treat project cash flow as a first-order executive control measure.',
      'Tighten billing, certification, and collection discipline across the portfolio.',
      'Protect liquidity by linking project controls directly to cash realisation.',
    ]
  ),

  ag_crop_production_yield_planning: rec(
    [
      'Map crop production by field, crop, planting window, input application, irrigation, spraying, harvest timing, and yield result.',
      'Identify where planting delays, input inefficiency, pest pressure, machinery availability, or harvest loss is reducing yield realisation.',
      'Create visibility on potential vs achieved yield, field execution, input cost, harvest readiness, and seasonal cash exposure.',
    ],
    [
      'Build crop-production governance around seasonal planning, input efficiency, field execution, water availability, and yield recovery.',
      'Standardise crop plans, operating windows, spray/fertiliser records, field reviews, and harvest-readiness checks.',
      'Use yield per hectare, input efficiency, timing adherence, and gross margin as leadership measures.',
    ]
  ),

  ag_livestock_health_feed_conversion: rec(
    [
      'Map herd or flock performance across animal health, feed conversion, mortality, breeding, grazing, biosecurity, and market readiness.',
      'Identify health risks, feed inefficiency, mortality drivers, weak breeding performance, or poor stocking discipline.',
      'Create visibility on animal numbers, mortality, feed conversion, health events, treatment cost, and margin per animal.',
    ],
    [
      'Build livestock governance around animal health, feed efficiency, biosecurity, breeding discipline, and market timing.',
      'Standardise health checks, feeding routines, grazing plans, vaccination records, and mortality reviews.',
      'Use mortality, feed conversion, weight gain, breeding performance, and gross margin per animal as executive measures.',
    ]
  ),

  ag_fresh_produce_packhouse_cold_chain: rec(
    [
      'Map fresh-produce flow across harvest, intake, grading, packing, cold rooms, dispatch, market agents, and quality downgrades.',
      'Identify post-harvest loss, packhouse bottlenecks, cold-chain weakness, grading downgrades, and buyer payment timing issues.',
      'Create visibility on intake volume, grade-out, packhouse throughput, cold-chain compliance, dispatch status, and realised price.',
    ],
    [
      'Build fresh-produce governance around harvest timing, grading discipline, packhouse throughput, cold-chain control, and price realisation.',
      'Standardise intake checks, grading rules, packing schedules, cold-room control, and dispatch readiness.',
      'Use grade-out, packhouse throughput, cold-chain compliance, post-harvest loss, and realised price as leadership measures.',
    ]
  ),

  ag_irrigation_water_resource_control: rec(
    [
      'Map water availability, irrigation infrastructure, boreholes, pivots, soil moisture, drought exposure, and load-shedding impact on irrigation timing.',
      'Identify water constraints, pump reliability issues, irrigation scheduling weaknesses, and crop stress risk.',
      'Create visibility on water allocation, soil moisture, irrigation adherence, equipment uptime, and crop-risk exposure.',
    ],
    [
      'Build irrigation and water governance around resource planning, equipment reliability, scheduling discipline, and climate resilience.',
      'Standardise irrigation plans, borehole/pump checks, water-use tracking, and drought-response triggers.',
      'Use water-use efficiency, irrigation reliability, soil moisture, and crop-stress risk as executive measures.',
    ]
  ),

  ag_agri_processing_value_chain: rec(
    [
      'Map agri-processing flow across intake, storage, cleaning, grading, milling, abattoir/dairy processing, packing, dispatch, and yield reconciliation.',
      'Identify processing yield loss, storage risk, throughput bottlenecks, quality downgrades, and working-capital lock-up.',
      'Create visibility on intake quality, processing yield, storage ageing, throughput, dispatch readiness, and realised margin.',
    ],
    [
      'Build agri-processing governance around intake quality, storage discipline, processing yield, throughput, and value-chain cash conversion.',
      'Standardise grading, storage, process controls, yield reviews, and dispatch planning.',
      'Use processing yield, throughput, storage loss, quality downgrade, and cash conversion as executive measures.',
    ]
  ),

  ag_yield_performance: rec(
    [
      'Quantify the yield gap by crop, enterprise, or farm and split it between controllable execution loss and external environmental drag.',
      'Map planting, spraying, harvesting, labour, machinery, and post-harvest timing performance on the highest-value hectares or enterprises.',
      'Create visible control on the critical operating windows where yield is won or lost.',
    ],
    [
      'Treat yield performance as a structured operating and agronomic control issue, not only a seasonal outcome.',
      'Use timeliness, field execution, and post-harvest discipline to convert potential yield into realised output.',
      'Link yield-realisation governance directly to margin, storage, and cash expectations.',
    ]
  ),

  ag_margin_cost_control: rec(
    [
      'Build a gross-margin waterfall per hectare or per animal showing yield shortfall, price realisation variance, input variance, and waste/shrinkage.',
      'Separate enterprise-mix decisions from farm-execution issues so leadership can see where value is structurally weak.',
      'Create executive visibility on input efficiency, overhead absorption, and realised contribution by enterprise.',
    ],
    [
      'Treat unit cost and gross margin discipline as a portfolio and operating-system issue, not only a cost-accounting exercise.',
      'Tighten enterprise selection, land allocation, procurement leverage, and price-realisation discipline across the portfolio.',
      'Use realised gross margin per hectare or per animal as a core leadership steering metric.',
    ]
  ),

  ag_risk_management: rec(
    [
      'Map weather, biological, market, and counterparty risks with probability-weighted financial impact.',
      'Stress-test hedging, insurance, diversification, and biosecurity effectiveness on the most exposed enterprises.',
      'Create one leadership view of where controllable risk ends and external volatility begins.',
    ],
    [
      'Treat agricultural risk as a layered control system spanning field execution, climate exposure, market protection, and financial resilience.',
      'Strengthen mitigation infrastructure, hedging discipline, and claims recovery before the next adverse cycle hits.',
      'Use risk layering and resilience metrics as standard executive review items, not exception cases only.',
    ]
  ),

  ag_working_capital_cash_cycle: rec(
    [
      'Map seasonal funding peaks, inventory carrying cost, harvest-to-cash timing, and buyer payment terms across the cycle.',
      'Quantify where storage, drying, grading, packing, or sale-timing decisions are trapping working capital.',
      'Install visibility on cash-conversion timing by crop, farm, or enterprise.',
    ],
    [
      'Treat seasonal cash exposure as a planned operating discipline, not a surprise finance problem.',
      'Tighten harvest-to-realisation decisions, buyer terms, lease timing, and capital phasing against expected inflows.',
      'Use liquidity timing and funding headroom as core agricultural control measures alongside yield and margin.',
    ]
  ),

  hc_private_practice_operations: rec(
    [
      'Map appointment scheduling, patient file completeness, claims documentation, billing follow-up, and debtor control across the practice workflow.',
      'Separate clinical workload from avoidable front-office administrative friction so doctors and clinical staff are not pulled into non-clinical bottlenecks.',
      'Create a simple practice dashboard covering appointment utilisation, patient waiting time, claims status, billing delays, and cash-flow visibility.',
    ],
    [
      'Build a disciplined private-practice operating model around front-office workflow, patient administration, claims control, and doctor utilisation.',
      'Tighten role accountability between reception, clinical staff, billing, finance, and practice management.',
      'Use appointment utilisation, claims follow-up, patient file completeness, debtor control, and service quality as weekly management measures.',
    ]
  ),

  hc_clinic_access_flow: rec(
    [
      'Map patient access, booking flow, triage, consultation-room utilisation, waiting times, and follow-up appointment discipline.',
      'Separate true capacity shortage from scheduling friction, queue-management failure, and avoidable handoff delays.',
      'Create daily visibility on patient throughput, waiting time, no-shows, staff loading, and unresolved follow-ups.',
    ],
    [
      'Treat clinic access and patient flow as a structured operating control system.',
      'Tighten appointment booking, triage, nurse/doctor scheduling, room allocation, and patient communication.',
      'Use access reliability and waiting-time control to improve patient experience and service capacity.',
    ]
  ),

  hc_hospital_capacity_flow: rec(
    [
      'Map theatres, beds, diagnostics, consultation rooms, discharge planning, and patient-journey bottlenecks on the most exposed services.',
      'Separate pure capacity shortage from scheduling failure, handoff delay, and avoidable flow disruption.',
      'Build daily visibility on cancellations, turnover time, bed blocking, ED throughput, and waiting-list pressure.',
    ],
    [
      'Treat patient flow and capacity utilisation as a clinical and economic control system together.',
      'Tighten scheduling, discharge, and inter-department coordination around the bottlenecks destroying access and contribution.',
      'Use flow reliability to improve both patient experience and productive capacity.',
    ]
  ),

  hc_revenue_cycle_cash: rec(
    [
      'Map authorisation delays, coding gaps, denials, billing errors, co-payment leakage, patient account aging, and claims follow-up across the cycle.',
      'Quantify where revenue is being delayed, denied, or lost after care has already been delivered.',
      'Install visible control on the highest-value claim, billing, and collection failure points.',
    ],
    [
      'Treat the revenue cycle as a core healthcare operating discipline, not a back-office afterthought.',
      'Tighten coding, authorisation, billing, claims follow-up, and collection governance where cash conversion is weakest.',
      'Link revenue-cycle control directly to working capital, contribution preservation, and funding resilience.',
    ]
  ),

  hc_clinical_quality_safety: rec(
    [
      'Quantify quality and safety variance by facility, specialty, department, or practice and separate system issues from clinician-level variability.',
      'Map adverse events, protocol-adherence gaps, documentation quality, handover failure, and high-risk care variation.',
      'Create visible control on the clinical risks most likely to damage both outcomes and economics.',
    ],
    [
      'Treat clinical quality and patient safety as the first control system of the healthcare operating model.',
      'Use clinical governance, standardisation, and outcome transparency to reduce both harm and economic leakage.',
      'Link quality recovery directly to reputation, contribution margin, and operating resilience.',
    ]
  ),

  hc_margin_case_contribution: rec(
    [
      'Build a contribution waterfall per case, consultation, specialty, or patient panel including payer mix and direct-cost leakage.',
      'Separate case-mix, tariff, direct-cost, claim-rejection, and service-line economics issues.',
      'Create executive visibility on where contribution is being destroyed by funding and cost-to-serve mismatch.',
    ],
    [
      'Treat contribution per case, consultation, or patient as a strategic healthcare control measure.',
      'Tighten payer mix, tariff discipline, case costing, consumable control, and service-line profitability review.',
      'Use contribution visibility to steer specialty mix, pricing, capacity, and service investment.',
    ]
  ),

  hc_medical_supplier_stock_distribution: rec(
    [
      'Map stock availability, inventory turns, batch control, expiry risk, supplier lead times, debtor exposure, and distribution reliability.',
      'Identify where stockouts, expired stock, late delivery, or weak debtor control are eroding service performance and cash flow.',
      'Create one dashboard covering inventory health, order fulfilment, debtor days, and critical customer service levels.',
    ],
    [
      'Treat stock discipline, distribution reliability, and debtor control as one healthcare supply operating system.',
      'Tighten procurement, batch control, expiry management, delivery planning, and collections cadence.',
      'Use inventory turns, stock availability, service reliability, and debtor performance as executive control measures.',
    ]
  ),

  hc_pharmacy_margin_stock_control: rec(
    [
      'Map script flow, dispensary workload, medicine stock turns, expired stock, front-shop performance, and margin leakage.',
      'Identify where prescription volume, stock discipline, shrinkage, or pricing gaps are eroding pharmacy contribution.',
      'Create daily visibility on scripts, stockouts, expiry risk, gross margin, and pharmacist capacity.',
    ],
    [
      'Treat script flow, stock control, and margin discipline as the core operating system of the pharmacy.',
      'Tighten stock replenishment, schedule medicine control, expiry management, dispensary workflow, and front-shop economics.',
      'Use stock turns, script throughput, shrinkage, and margin quality as management steering metrics.',
    ]
  ),

  hc_healthcare_admin_compliance: rec(
    [
      'Map administrative workflow, document control, compliance records, reporting gaps, role clarity, and staff workload across the healthcare operation.',
      'Identify where poor administration is creating patient confidentiality, billing, compliance, or management-visibility risk.',
      'Create a simple compliance and management dashboard covering open actions, missing documents, reporting delays, and workflow bottlenecks.',
    ],
    [
      'Treat healthcare administration and compliance visibility as a core operating-control layer.',
      'Tighten role accountability, document control, reporting cadence, patient confidentiality processes, and management action tracking.',
      'Use administrative discipline to protect patient trust, compliance posture, cash flow, and leadership visibility.',
    ]
  ),

  hc_operational_capacity_flow: rec(
    [
      'Map patient flow, scheduling, consultation capacity, diagnostic bottlenecks, documentation quality, and revenue-cycle pressure in the specific care setting.',
      'Separate true care-capacity shortage from administrative friction, scheduling weakness, or workflow breakdown.',
      'Build daily visibility on patient throughput, cancellations, waiting pressure, claims status, and management actions.',
    ],
    [
      'Treat patient flow and capacity utilisation as a care-quality and economic control system together.',
      'Tighten scheduling, handoffs, documentation, billing, and operating reviews around the real bottlenecks.',
      'Use flow reliability to improve patient experience, productive capacity, and cash conversion.',
    ]
  ),

  en_solar_epc_installation_delivery: rec(
    [
      'Map solar EPC delivery from site survey, design, procurement, installation, QA, commissioning, handover, and client sign-off.',
      'Identify installation delays, procurement gaps, inverter/module issues, commissioning failures, and site-handover risks.',
      'Create visibility on project margin, installation progress, commissioning readiness, snag status, and client acceptance.',
    ],
    [
      'Build solar EPC governance around installation quality, procurement readiness, commissioning discipline, and margin control.',
      'Standardise site readiness, QA checks, commissioning packs, handover criteria, and client sign-off routines.',
      'Use installation progress, commissioning success, snag closure, and project margin as executive measures.',
    ]
  ),

  en_backup_power_storage_resilience: rec(
    [
      'Map backup power and storage flow across load assessment, system design, batteries, inverters, generators, installation, testing, and maintenance.',
      'Identify load mismatch, battery-sizing risk, generator dependency, installation quality gaps, and resilience failures during load shedding.',
      'Create visibility on system uptime, load profile, battery health, generator readiness, and client resilience outcomes.',
    ],
    [
      'Build a backup and storage control model around load management, system reliability, battery health, and maintenance discipline.',
      'Standardise commissioning tests, load-shedding scenarios, maintenance checks, and client operating procedures.',
      'Use uptime, battery performance, load coverage, and incident response as executive measures.',
    ]
  ),

  en_renewable_asset_operations: rec(
    [
      'Map renewable asset performance across monitoring, availability, performance ratio, degradation, cleaning, O&M response, curtailment, and revenue loss.',
      'Identify underperforming assets, SCADA data gaps, O&M delays, curtailment exposure, and warranty-recovery opportunities.',
      'Create visibility on asset yield, availability, O&M actions, curtailment impact, and revenue at risk.',
    ],
    [
      'Build renewable asset governance around yield assurance, O&M effectiveness, warranty recovery, and revenue protection.',
      'Standardise asset monitoring, performance reviews, cleaning schedules, fault response, and claims escalation.',
      'Use performance ratio, availability, curtailment loss, degradation, and O&M response time as executive measures.',
    ]
  ),

  en_grid_connection_permitting: rec(
    [
      'Map grid connection, permitting, municipal approval, NERSA requirements, wheeling options, connection studies, and substation dependencies.',
      'Identify approval delays, grid-capacity constraints, missing technical documents, and utility-interface risks.',
      'Create visibility on permit status, grid dependencies, approval owners, expected decision dates, and project economics at risk.',
    ],
    [
      'Build grid and permitting governance around approval tracking, technical document readiness, utility engagement, and schedule protection.',
      'Standardise grid-application packs, municipal follow-up, decision logs, and escalation cadence.',
      'Use approval progress, grid readiness, schedule risk, and IRR exposure as executive measures.',
    ]
  ),

  en_energy_efficiency_demand_management: rec(
    [
      'Map consumption, demand charges, tariff structure, load profile, metering, submetering, power factor, and high-consumption assets.',
      'Identify quick savings from demand management, energy-efficiency improvements, tariff optimisation, and operating discipline.',
      'Create visibility on baseline consumption, savings opportunities, demand peaks, and payback by intervention.',
    ],
    [
      'Build energy-efficiency governance around consumption visibility, demand reduction, tariff control, and verified savings.',
      'Standardise energy audits, measurement and verification, load-profile reviews, and accountability for savings actions.',
      'Use kWh reduction, demand-charge reduction, payback period, and verified savings as executive control measures.',
    ]
  ),

  en_project_margin_irr: rec(
    [
      'Build a base-case to current-case IRR waterfall by project, technology, region, and cause of erosion.',
      'Separate resource under-performance, curtailment, degradation, O&M overrun, and contract-quality issues with quantified value at risk.',
      'Create executive visibility on where project economics are deteriorating before the full portfolio is affected.',
    ],
    [
      'Treat project economics and IRR realisation as a structured portfolio-control discipline, not only a model at financial close.',
      'Tighten technology, site, PPA, and procurement choices where they are creating avoidable margin dilution.',
      'Use project-economics visibility to steer future development, storage, and diversification decisions.',
    ]
  ),

  en_schedule_commissioning: rec(
    [
      'Map delay from permitting, land, grid connection, EPC execution, weather windows, and commissioning handover gaps.',
      'Separate regulatory, contractor, weather, and grid-interface causes instead of treating all delay as one schedule problem.',
      'Build visible control on the projects where delivery certainty is most exposed.',
    ],
    [
      'Treat schedule and commissioning control as a cross-functional portfolio discipline spanning development to operations.',
      'Tighten critical-path governance around grid interface, EPC accountability, and final acceptance readiness.',
      'Use delay visibility to protect both economics and funding timing.',
    ]
  ),

  en_contractual_claims: rec(
    [
      'Audit variation recovery, performance guarantees, curtailment compensation, insurance claims, and EPC/OEM contractual exposure.',
      'Quantify the gap between value or entitlement available and value actually recovered under contract.',
      'Escalate the projects where weak claims recovery is allowing avoidable economic loss to persist.',
    ],
    [
      'Treat contractual performance and claims recovery as a core value-protection system across the portfolio.',
      'Tighten governance over change events, compensation triggers, warranty recovery, and standard contract discipline.',
      'Use executive oversight to protect earned value and reduce contractual leakage.',
    ]
  ),

  en_cashflow_transition: rec(
    [
      'Map construction-phase funding peaks, drawdown timing, bonding exposure, and operational-phase cash conversion by project.',
      'Quantify where schedule delay, payment-security weakness, or O&M phasing is stressing funding headroom.',
      'Install visible control on the projects carrying the greatest liquidity and refinancing risk.',
    ],
    [
      'Treat construction-to-operation cash discipline as a first-order portfolio control issue.',
      'Tighten payment-security, milestone alignment, spare-parts working capital, and post-commissioning refinancing logic.',
      'Use funding-headroom visibility to protect delivery continuity and return realisation.',
    ]
  ),

  margin_leakage: rec(
    [
      'Identify and quantify the top three margin leakage points with line-item precision.',
      'Institute immediate controls to freeze non-essential cost expansion while leakage is validated.',
      'Validate pricing discipline, discount governance, and operational waste at the most granular level.',
    ],
    [
      'Launch a fact-based margin recovery programme with clear executive ownership and KPIs.',
      'Drive owner-level accountability for the largest leakage pools through structured workstreams.',
      'Embed weekly operating reviews that track margin recovery progress in real time.',
    ]
  ),

  workflow_breakdown: rec(
    [
      'Map the end-to-end workflow and isolate the primary execution bottlenecks.',
      'Stabilise critical handoff points and eliminate non-value-adding activities.',
      'Introduce short-cycle executive review routines to surface and resolve blockers immediately.',
    ],
    [
      'Redesign the operating model around the critical path to restore execution velocity.',
      'Clarify accountability across teams and functions with explicit RACI ownership.',
      'Implement service-level tracking and performance dashboards for turnaround and output quality.',
    ]
  ),

  planning_failure: rec(
    [
      'Stress-test current planning assumptions against actual demand and capacity realities.',
      'Realign planning cadence and forecasting processes to current operational truth.',
      'Close the largest planning-to-execution gaps with immediate corrective actions.',
    ],
    [
      'Rebuild the strategic planning model anchored in current operational and market facts.',
      'Strengthen coordination between commercial, operational, and finance leadership.',
      'Embed disciplined review mechanisms for forecast, schedule, and delivery adjustments.',
    ]
  ),

  capacity_constraint: rec(
    [
      'Diagnose the root throughput or utilisation constraint with data-driven precision.',
      'Separate genuine capacity loss from demand pressure or scheduling inefficiency.',
      'Stabilise immediate availability, staffing, or delivery pressure points.',
    ],
    [
      'Rebalance capacity allocation against strategic priorities and demand signals.',
      'Implement executive visibility dashboards on utilisation and constraint performance.',
      'Sequence improvement initiatives around the true operational bottleneck.',
    ]
  ),

  compliance_risk: rec(
    [
      'Quantify immediate compliance exposure and prioritise highest-risk control gaps.',
      'Close critical compliance vulnerabilities with assigned executive owners.',
      'Establish clear accountability for remediation of material compliance items.',
    ],
    [
      'Reinforce governance frameworks and control routines at board and executive level.',
      'Implement a structured compliance action register with rigorous tracking.',
      'Embed executive review discipline to monitor remediation progress and residual risk.',
    ]
  ),

  service_quality_risk: rec(
    [
      'Quantify the primary service and quality failure points impacting client experience.',
      'Stabilise highest-impact client-facing issues to protect revenue and reputation.',
      'Reduce recurring rework and failure patterns through root-cause elimination.',
    ],
    [
      'Redesign service delivery control points to embed quality by design.',
      'Drive quality ownership and accountability across the entire value chain.',
      'Track service recovery against measurable client outcome and satisfaction KPIs.',
    ]
  ),

  cash_flow_stress: rec(
    [
      'Conduct a rapid diagnostic of debtors, creditors, and working capital pressure points.',
      'Protect near-term liquidity through disciplined cash prioritisation and controls.',
      'Pause or defer non-essential cash commitments while preserving strategic initiatives.',
    ],
    [
      'Stabilise cash discipline as a core element of the operating model.',
      'Tighten collection, payment, and cash forecasting processes with executive oversight.',
      'Build forward-looking cash visibility and scenario planning capability.',
    ]
  ),

  general_operational_pressure: rec(
    [
      'Clarify the highest-impact execution pressure points with executive precision.',
      'Stabilise the most material operational risks through targeted interventions.',
      'Narrow leadership focus to the fewest, highest-leverage actions.',
    ],
    [
      'Develop a structured, time-bound recovery plan with clear executive sponsorship.',
      'Assign accountable owners and measurable KPIs for each priority workstream.',
      'Institute disciplined operating reviews to drive accountability and course correction.',
    ]
  ),
};

export function recommendationLibrary(problemType: string): RecommendationSet {
  return LIBRARY[problemType] || LIBRARY.general_operational_pressure;
}
