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
  {
    type: 'margin_leakage',
    label: 'Margin Integrity & Profit Recovery',
    tags: ['profitability', 'cost control', 'commercial discipline'],
    keywords: ['margin', 'leakage', 'profit', 'pricing', 'cost creep', 'waste', 'shrinkage', 'fee leakage'],
  },
  {
    type: 'workflow_breakdown',
    label: 'Workflow & Execution Integrity',
    tags: ['process', 'execution', 'handoff'],
    keywords: ['delay', 'handoff', 'workflow', 'bottleneck', 'backlog', 'slow turnaround', 'turnaround'],
  },
  {
    type: 'planning_failure',
    label: 'Strategic Planning & Alignment',
    tags: ['planning', 'forecasting', 'coordination'],
    keywords: ['plan', 'planning', 'forecast', 'schedule', 'misalignment', 'capacity'],
  },
  {
    type: 'capacity_constraint',
    label: 'Capacity & Throughput Optimisation',
    tags: ['capacity', 'throughput', 'resources'],
    keywords: ['capacity', 'throughput', 'downtime', 'availability', 'resource shortage', 'utilisation', 'utilization'],
  },
  {
    type: 'compliance_risk',
    label: 'Compliance & Governance Exposure',
    tags: ['compliance', 'governance', 'controls'],
    keywords: ['compliance', 'audit', 'regulatory', 'non-compliance', 'safety', 'governance'],
  },
  {
    type: 'service_quality_risk',
    label: 'Service Quality & Client Experience',
    tags: ['quality', 'customer', 'delivery'],
    keywords: ['quality', 'service failure', 'customer complaint', 'rework', 'late delivery', 'service consistency'],
  },
  {
    type: 'cash_flow_stress',
    label: 'Cash Flow & Working Capital',
    tags: ['cash flow', 'working capital', 'liquidity'],
    keywords: ['cash flow', 'liquidity', 'working capital', 'debtors', 'creditors', 'funding'],
  },
];

const INDUSTRY_RULES: Record<string, Rule[]> = {
  professional_services: [
    {
      type: 'ps_consulting_advisory_delivery',
      label: 'Consulting Advisory Delivery, Scope Control & Client Value',
      tags: ['consulting delivery', 'scope control', 'client value', 'engagement governance'],
      keywords: [
        'consulting',
        'consultant',
        'advisory',
        'advisor',
        'client engagement',
        'engagement delivery',
        'scope creep',
        'statement of work',
        'sow',
        'diagnostic',
        'workshop',
        'proposal',
        'implementation support',
        'client value',
        'deliverables',
      ],
      executiveTheme: 'Advisory Delivery Control',
    },
    {
      type: 'ps_legal_compliance_matter_management',
      label: 'Legal, Compliance & Matter Management Discipline',
      tags: ['matter management', 'compliance workflow', 'risk governance', 'professional control'],
      keywords: [
        'legal',
        'law firm',
        'attorney',
        'matter',
        'case file',
        'compliance advisory',
        'regulatory advice',
        'contract review',
        'legal drafting',
        'matter management',
        'client mandate',
        'court',
        'litigation',
        'legal billing',
      ],
      executiveTheme: 'Matter Control',
    },
    {
      type: 'ps_accounting_tax_month_end',
      label: 'Accounting, Tax, Month-End & Client Administration',
      tags: ['accounting operations', 'tax compliance', 'month-end control', 'client administration'],
      keywords: [
        'accounting',
        'accountant',
        'bookkeeping',
        'tax',
        'vat',
        'payroll',
        'month-end',
        'month end',
        'management accounts',
        'financial statements',
        'sars',
        'audit file',
        'client documents',
        'recon',
        'reconciliation',
      ],
      executiveTheme: 'Client Administration Control',
    },
    {
      type: 'ps_engineering_architecture_project_control',
      label: 'Engineering, Architecture & Technical Project Delivery',
      tags: ['technical delivery', 'project control', 'design governance', 'professional workflow'],
      keywords: [
        'engineering',
        'engineer',
        'architecture',
        'architect',
        'design office',
        'drawing',
        'technical drawing',
        'design review',
        'project documentation',
        'professional services project',
        'site inspection',
        'technical approval',
        'design change',
      ],
      executiveTheme: 'Technical Delivery Control',
    },
    {
      type: 'ps_agency_marketing_pipeline_delivery',
      label: 'Agency Pipeline, Campaign Delivery & Client Retention',
      tags: ['agency operations', 'campaign delivery', 'pipeline conversion', 'client retention'],
      keywords: [
        'agency',
        'marketing agency',
        'creative agency',
        'campaign',
        'content',
        'retainer',
        'lead generation',
        'client pipeline',
        'campaign delivery',
        'creative workflow',
        'account manager',
        'client retention',
        'brief',
      ],
      executiveTheme: 'Agency Growth Control',
    },
    {
      type: 'ps_it_managed_services_sla',
      label: 'IT Services, SLA Delivery & Support Desk Performance',
      tags: ['managed services', 'sla control', 'support desk', 'service reliability'],
      keywords: [
        'it services',
        'managed services',
        'msp',
        'support desk',
        'helpdesk',
        'ticket',
        'tickets',
        'sla',
        'service level',
        'incident',
        'user support',
        'technical support',
        'system uptime',
        'response time',
      ],
      executiveTheme: 'Service Reliability',
    },
    {
      type: 'ps_conversion_delivery',
      label: 'Commercial Conversion & Delivery Discipline',
      tags: ['commercial conversion', 'service delivery', 'utilisation governance'],
      keywords: [
        'proposal conversion',
        'proposal',
        'proposal management',
        'client delivery',
        'delivery discipline',
        'turnaround',
        'service consistency',
        'scope discipline',
      ],
      executiveTheme: 'Scale Readiness',
    },
    {
      type: 'ps_utilisation_economics',
      label: 'Utilisation & Client Economics',
      tags: ['utilisation governance', 'client economics', 'profitability'],
      keywords: [
        'utilisation',
        'utilization',
        'billable',
        'billable hours',
        'service profitability',
        'account-level economics',
        'retainer',
        'fee leakage',
      ],
      executiveTheme: 'Margin Quality',
    },
    {
      type: 'ps_operating_model',
      label: 'Operating Model & Accountability',
      tags: ['operating model', 'leadership alignment', 'accountability'],
      keywords: ['operating model', 'role ownership', 'account management', 'leadership visibility', 'governance'],
      executiveTheme: 'Execution Control',
    },
  ],

  printing_packaging: [
    {
      type: 'pp_label_flexible_packaging_operations',
      label: 'Labels, Flexible Packaging & Sleeve Production Control',
      tags: ['label production', 'flexible packaging', 'sleeve workflow', 'conversion control'],
      keywords: [
        'label',
        'labels',
        'flexible packaging',
        'flexo',
        'flexographic',
        'shrink sleeve',
        'sleeves',
        'film',
        'substrate',
        'adhesive',
        'rewinder',
        'slitter',
        'lamination',
        'narrow web',
        'wide web',
        'barcode',
        'die line',
      ],
      executiveTheme: 'Packaging Flow Control',
    },
    {
      type: 'pp_carton_folding_carton_postpress',
      label: 'Carton, Folding Carton & Post-Press Throughput',
      tags: ['carton packaging', 'post-press control', 'finishing throughput', 'conversion bottlenecks'],
      keywords: [
        'carton',
        'folding carton',
        'corrugated',
        'die-cutting',
        'die cutting',
        'gluer',
        'folder gluer',
        'creasing',
        'embossing',
        'uv coating',
        'foiling',
        'post-press',
        'post press',
        'finishing bottleneck',
      ],
      executiveTheme: 'Post-Press Throughput',
    },
    {
      type: 'pp_commercial_print_prepress_control',
      label: 'Commercial Print, Pre-Press & Artwork Workflow Control',
      tags: ['commercial print', 'pre-press workflow', 'artwork control', 'proofing discipline'],
      keywords: [
        'commercial print',
        'litho',
        'digital print',
        'prepress',
        'pre-press',
        'ctp',
        'plate',
        'plates',
        'imposition',
        'colour proof',
        'color proof',
        'artwork',
        'pdf proof',
        'client approval',
        'version control',
      ],
      executiveTheme: 'Pre-Press Integrity',
    },
    {
      type: 'pp_market_expansion_sales_pipeline',
      label: 'Market Expansion, Sales Pipeline & Key Account Growth',
      tags: ['market expansion', 'sales pipeline', 'key account growth', 'sector targeting'],
      keywords: [
        'new markets',
        'new leads',
        'lead generation',
        'sales pipeline',
        'key accounts',
        'saa',
        'saa technical',
        'outsourced work',
        'contract expansion',
        'pharma',
        'pharmaceutical',
        'food packaging',
        'cosmetics',
        'retail packaging',
        'customer acquisition',
        'freelance reps',
        'sales reps',
      ],
      executiveTheme: 'Commercial Growth',
    },
    {
      type: 'pp_executive_margin_leakage',
      label: 'Executive Margin Leakage & Portfolio Mix',
      tags: ['executive visibility', 'portfolio mix', 'quoting discipline'],
      keywords: [
        'group',
        'portfolio',
        'multi-site',
        'multisite',
        'multiple sites',
        'plants',
        'plant mix',
        'product mix',
        'customer segmentation',
        'segment strategy',
        'under-pricing',
        'underpricing',
        'wrong work',
        'filler work',
        'over-capacity',
        'overcapacity',
        'quoting discipline',
        'unprofitable work',
      ],
      executiveTheme: 'Executive Margin Control',
    },
    {
      type: 'pp_operational_waste_rework',
      label: 'Operational Waste, Rework & Spoilage Control',
      tags: ['waste elimination', 'rework control', 'shop-floor discipline'],
      keywords: [
        'waste',
        'rework',
        'rerun',
        'scrap',
        'spoilage',
        'make-ready waste',
        'running spoilage',
        'finishing waste',
        'handling damage',
        'post-press waste',
        'spoiled',
      ],
      executiveTheme: 'Gross Margin Protection',
    },
    {
      type: 'pp_planning_turnaround_control',
      label: 'Planning, Scheduling & Turnaround Control',
      tags: ['planning discipline', 'turnaround velocity', 'queue control'],
      keywords: [
        'turnaround',
        'late delivery',
        'scheduling',
        'schedule',
        'job flow',
        'queue',
        'planning board',
        'sequencing',
        'changeover frequency',
        'rush jobs',
        'starvation',
        'overload',
        'dispatch delay',
        'otif',
      ],
      executiveTheme: 'Operational Agility',
    },
    {
      type: 'pp_specification_change_control',
      label: 'Specification Integrity & Change Control',
      tags: ['specification control', 'change governance', 'approval discipline'],
      keywords: [
        'specification',
        'artwork',
        'proof',
        'change control',
        'client approval',
        'version control',
        'job ticket',
        'misinterpretation',
        'transcription error',
        'wrong artwork',
        'wrong die',
        'wrong stock',
        'late customer changes',
        'incomplete brief',
      ],
      executiveTheme: 'Right-First-Time Delivery',
    },
    {
      type: 'pp_capacity_bottleneck_balance',
      label: 'Press Utilisation, Bottlenecks & Capacity Balance',
      tags: ['press utilisation', 'bottleneck control', 'capacity balance'],
      keywords: [
        'press',
        'finishing',
        'setup time',
        'changeover',
        'make ready',
        'capacity utilisation',
        'oee',
        'net productive utilisation',
        'gross utilisation',
        'schedule attainment',
        'bottleneck',
        'guillotine',
        'folder',
        'gluer',
        'die-cutter',
        'idle press',
      ],
      executiveTheme: 'Capacity Efficiency',
    },
  ],

  manufacturing: [
    {
      type: 'mfg_discrete_production_flow',
      label: 'Discrete Manufacturing Flow, Work Orders & Throughput Control',
      tags: ['production flow', 'work order control', 'throughput', 'factory discipline'],
      keywords: [
        'discrete manufacturing',
        'assembly',
        'work order',
        'production order',
        'line balancing',
        'assembly line',
        'work centre',
        'work center',
        'routing',
        'production cell',
        'job shop',
        'throughput',
        'production flow',
      ],
      executiveTheme: 'Factory Flow Control',
    },
    {
      type: 'mfg_process_yield_batch_control',
      label: 'Process Manufacturing Yield, Batch Control & Loss Reduction',
      tags: ['batch control', 'yield management', 'process loss', 'quality stability'],
      keywords: [
        'process manufacturing',
        'batch',
        'batch record',
        'recipe',
        'formulation',
        'yield loss',
        'process yield',
        'mixing',
        'blending',
        'filling',
        'line loss',
        'process variance',
        'batch variance',
      ],
      executiveTheme: 'Yield Stability',
    },
    {
      type: 'mfg_food_fmcg_quality_traceability',
      label: 'Food/FMCG Quality, Traceability & Shelf-Life Control',
      tags: ['fmcg production', 'traceability', 'food safety', 'quality control'],
      keywords: [
        'food',
        'fmcg',
        'beverage',
        'shelf life',
        'expiry',
        'traceability',
        'batch traceability',
        'haccp',
        'food safety',
        'cold chain',
        'recall',
        'pack date',
        'best before',
      ],
      executiveTheme: 'Traceable Quality',
    },
    {
      type: 'mfg_engineering_fabrication_bom_control',
      label: 'Engineering, Fabrication, BOM & Technical Change Control',
      tags: ['engineering control', 'fabrication workflow', 'bom integrity', 'technical change'],
      keywords: [
        'fabrication',
        'engineering',
        'metalwork',
        'machining',
        'welding',
        'cnc',
        'bill of materials',
        'bom',
        'drawing revision',
        'engineering change',
        'technical data',
        'cut list',
        'nesting',
        'routing',
      ],
      executiveTheme: 'Technical Production Control',
    },
    {
      type: 'mfg_maintenance_oee_asset_reliability',
      label: 'Maintenance, OEE & Asset Reliability Control',
      tags: ['asset reliability', 'maintenance planning', 'oee', 'downtime control'],
      keywords: [
        'maintenance',
        'preventive maintenance',
        'planned maintenance',
        'breakdown',
        'machine breakdown',
        'asset reliability',
        'mtbf',
        'mttr',
        'spares',
        'critical spares',
        'oee',
        'downtime',
        'unplanned downtime',
      ],
      executiveTheme: 'Asset Reliability',
    },
    {
      type: 'mfg_supply_chain_inventory_control',
      label: 'Supply Chain, Inventory & Material Availability Control',
      tags: ['inventory control', 'material availability', 'supplier reliability', 'working capital'],
      keywords: [
        'inventory',
        'raw material',
        'material shortage',
        'supplier delay',
        'supplier reliability',
        'stockout',
        'stock out',
        'slow moving stock',
        'obsolete stock',
        'warehouse',
        'mrp',
        'procurement',
        'purchase order',
        'lead time',
      ],
      executiveTheme: 'Material Flow Reliability',
    },
    {
      type: 'mfg_product_margin_protection',
      label: 'Product Margin Protection & Portfolio Mix',
      tags: ['product margin protection', 'portfolio mix', 'commercial discipline'],
      keywords: [
        'product mix',
        'channel mix',
        'unprofitable key accounts',
        'pricing discipline',
        'under-recovery',
        'under recovery',
        'landed cost',
        'make-vs-buy',
        'make vs buy',
        'discount leakage',
        'rebate',
        'margin contribution',
        'standard cost drift',
      ],
      executiveTheme: 'Margin Discipline',
    },
    {
      type: 'mfg_schedule_delivery_velocity',
      label: 'Schedule Adherence & Delivery Velocity',
      tags: ['schedule adherence', 'delivery velocity', 'planning discipline'],
      keywords: [
        'master production schedule',
        'mps',
        'mrp',
        'bullwhip',
        'finite loading',
        'capacity planning',
        'expediting',
        'changeover',
        'setup',
        'cycle time variance',
        'bottleneck',
        'otif',
        'dispatch bottleneck',
        'delivery velocity',
      ],
      executiveTheme: 'Flow Reliability',
    },
    {
      type: 'mfg_quality_specification_control',
      label: 'Quality, Specification & Process Control',
      tags: ['quality systems', 'specification control', 'process discipline'],
      keywords: [
        'engineering change',
        'engineering change order',
        'technical data package',
        'bom',
        'bill of materials',
        'routing',
        'work instruction',
        'tolerance',
        'calibration',
        'gauge control',
        'first-pass yield',
        'first pass yield',
        'copq',
        'non-conformance',
        'rcca',
        'defect pareto',
      ],
      executiveTheme: 'Right-First-Time Control',
    },
    {
      type: 'mfg_asset_oee_capacity',
      label: 'Asset Utilisation, OEE & Capacity Balance',
      tags: ['oee', 'asset utilisation', 'capacity balance'],
      keywords: [
        'oee',
        'availability',
        'performance',
        'quality rate',
        'unplanned downtime',
        'planned downtime',
        'minor stoppages',
        'idling',
        'ideal cycle time',
        'changeover time',
        'waiting',
        'starvation',
        'capacity balancing',
        'technology transfer',
        'flexible cells',
        'automation',
      ],
      executiveTheme: 'Asset Productivity',
    },
  ],

  construction: [
    {
      type: 'con_general_building_contractor',
      label: 'General Building Contractor Site Execution & Margin Control',
      tags: ['general building', 'site execution', 'subcontractor coordination', 'project margin'],
      keywords: [
        'building contractor',
        'general contractor',
        'main contractor',
        'residential',
        'commercial building',
        'renovation',
        'alterations',
        'building project',
        'site foreman',
        'brickwork',
        'plastering',
        'finishes',
        'snag list',
        'practical completion',
      ],
      executiveTheme: 'Building Delivery Control',
    },
    {
      type: 'con_civil_infrastructure_delivery',
      label: 'Civil Works, Earthworks & Infrastructure Delivery Control',
      tags: ['civil works', 'earthworks', 'infrastructure delivery', 'plant productivity'],
      keywords: [
        'civil works',
        'civils',
        'earthworks',
        'roadworks',
        'roads',
        'stormwater',
        'bulk services',
        'water reticulation',
        'sewer',
        'pipeline',
        'excavation',
        'cut and fill',
        'plant utilisation',
        'plant utilization',
        'compaction',
      ],
      executiveTheme: 'Civil Delivery Control',
    },
    {
      type: 'con_specialist_subcontractor_control',
      label: 'Specialist Subcontractor Delivery, Coordination & Payment Control',
      tags: ['specialist subcontractor', 'coordination control', 'payment discipline', 'site interface'],
      keywords: [
        'subcontractor',
        'specialist subcontractor',
        'electrical contractor',
        'plumbing',
        'hvac',
        'fire protection',
        'roofing',
        'steelwork',
        'scaffolding',
        'shop drawings',
        'site interface',
        'subbie',
        'subcontractor payment',
        'scope gap',
      ],
      executiveTheme: 'Subcontractor Performance',
    },
    {
      type: 'con_hs_compliance_safety_file',
      label: 'Construction Health & Safety, Safety File & Site Compliance',
      tags: ['construction safety', 'safety file', 'ohs compliance', 'site audit readiness'],
      keywords: [
        'health and safety',
        'h&s',
        'safety file',
        'ohs',
        'ohs act',
        'risk assessment',
        'method statement',
        'toolbox talk',
        'incident',
        'near miss',
        'fall protection',
        'scaffold inspection',
        'site audit',
        'subcontractor compliance',
      ],
      executiveTheme: 'Site Compliance Control',
    },
    {
      type: 'con_qs_cost_variation_control',
      label: 'Quantity Surveying, Cost Control, BOQ & Variation Recovery',
      tags: ['quantity surveying', 'cost control', 'boq discipline', 'variation recovery'],
      keywords: [
        'quantity surveyor',
        'qs',
        'boq',
        'bill of quantities',
        'measurement',
        'remeasurement',
        'valuation',
        'cost report',
        'cost plan',
        'variation',
        'claim',
        'final account',
        'payment certificate',
        'interim claim',
        'rate build-up',
      ],
      executiveTheme: 'Commercial Recovery',
    },
    {
      type: 'con_property_development_management',
      label: 'Property Development Feasibility, Approvals & Delivery Governance',
      tags: ['property development', 'feasibility', 'approvals', 'development governance'],
      keywords: [
        'property development',
        'developer',
        'feasibility',
        'town planning',
        'zoning',
        'municipal approval',
        'development finance',
        'pre-sales',
        'pre sales',
        'tenant mix',
        'leasing',
        'professional team',
        'handover',
        'occupation certificate',
      ],
      executiveTheme: 'Development Feasibility',
    },
    {
      type: 'con_facilities_maintenance_sla',
      label: 'Facilities Maintenance, Reactive Work Orders & SLA Control',
      tags: ['facilities maintenance', 'reactive work', 'sla control', 'service delivery'],
      keywords: [
        'maintenance contractor',
        'facilities',
        'facility maintenance',
        'reactive maintenance',
        'call-out',
        'call out',
        'work order',
        'sla',
        'service level',
        'tenant complaint',
        'asset upkeep',
        'planned maintenance',
        'maintenance backlog',
      ],
      executiveTheme: 'Maintenance Reliability',
    },
    {
      type: 'con_portfolio_margin_erosion',
      label: 'Portfolio Margin Erosion & Tender Risk',
      tags: ['portfolio visibility', 'tender risk', 'project selection'],
      keywords: [
        'group',
        'holdings',
        'portfolio',
        'under-bidding',
        'underbidding',
        'tender risk',
        'project selection',
        'client segmentation',
        'over-commitment',
        'overcommitment',
        'central overhead',
        'margin erosion',
        'wrong projects',
      ],
      executiveTheme: 'Portfolio Margin Control',
    },
    {
      type: 'con_commercial_leakage_claims',
      label: 'Commercial Leakage, Variations & Claims',
      tags: ['commercial leakage', 'variation control', 'contract administration'],
      keywords: [
        'variation',
        'claim',
        'change order',
        'site instruction',
        'client approval',
        'contract administration',
        'time-bar',
        'time bar',
        'missed notices',
        'late notification',
        'boq',
        'bill of quantities',
        'estimate drift',
        'rate build-up',
        'rate buildup',
        'entitlement',
        'eot',
        'prolongation',
      ],
      executiveTheme: 'Commercial Recovery',
    },
    {
      type: 'con_operational_delivery_risk',
      label: 'Operational Delivery Risk & Site Productivity',
      tags: ['site execution', 'productivity control', 'subcontractor performance'],
      keywords: [
        'site productivity',
        'labour productivity',
        'plant downtime',
        'equipment downtime',
        'site wastage',
        'rework',
        'quality errors',
        'subcontractor',
        'supervision',
        'site management',
        'productivity shortfall',
        'idle plant',
      ],
      executiveTheme: 'Site Execution Control',
    },
    {
      type: 'con_schedule_coordination_slippage',
      label: 'Programme Slippage & Coordination Control',
      tags: ['programme control', 'critical path', 'coordination risk'],
      keywords: [
        'schedule',
        'programme',
        'delay',
        'critical path',
        'late completion',
        'slippage',
        'baseline programme',
        'master programme',
        'dependencies',
        'subcontractor delays',
        'late approvals',
        'design changes',
        'site access',
        'long-lead items',
        'material shortages',
        'sequencing conflicts',
      ],
      executiveTheme: 'Predictable Delivery',
    },
    {
      type: 'con_cashflow_certification_exposure',
      label: 'Project Cash Exposure & Certification Control',
      tags: ['cash exposure', 'certification discipline', 'working capital'],
      keywords: [
        'cash flow',
        'certification',
        'retention',
        'billing',
        'collections',
        'progress claim',
        'interim payment certificate',
        'ipc',
        'negative cash cycle',
        'wip',
        'bonding',
        'guarantee exposure',
        'final account',
        'valuation',
        'disallowed items',
      ],
      executiveTheme: 'Liquidity Protection',
    },
  ],

  agriculture: [
    {
      type: 'ag_crop_production_yield_planning',
      label: 'Crop Production, Yield Planning & Seasonal Execution',
      tags: ['crop production', 'yield planning', 'seasonal execution', 'field operations'],
      keywords: [
        'crop',
        'crops',
        'maize',
        'wheat',
        'soybean',
        'sunflower',
        'planting',
        'harvesting',
        'spraying',
        'fertiliser',
        'fertilizer',
        'seed',
        'field operation',
        'hectare',
        'yield per hectare',
      ],
      executiveTheme: 'Crop Yield Realisation',
    },
    {
      type: 'ag_livestock_health_feed_conversion',
      label: 'Livestock Health, Feed Conversion & Herd/Flock Productivity',
      tags: ['livestock productivity', 'animal health', 'feed conversion', 'biosecurity'],
      keywords: [
        'livestock',
        'cattle',
        'sheep',
        'goats',
        'poultry',
        'dairy',
        'herd',
        'flock',
        'animal health',
        'mortality',
        'feed conversion',
        'grazing',
        'breeding',
        'calving',
        'biosecurity',
      ],
      executiveTheme: 'Livestock Productivity',
    },
    {
      type: 'ag_fresh_produce_packhouse_cold_chain',
      label: 'Fresh Produce, Packhouse, Grading & Cold Chain Control',
      tags: ['fresh produce', 'packhouse flow', 'grading control', 'cold chain'],
      keywords: [
        'fresh produce',
        'fruit',
        'vegetables',
        'packhouse',
        'grading',
        'packing',
        'cold chain',
        'cold room',
        'export fruit',
        'quality downgrade',
        'post-harvest',
        'post harvest',
        'market agent',
        'ripening',
      ],
      executiveTheme: 'Fresh Produce Flow',
    },
    {
      type: 'ag_irrigation_water_resource_control',
      label: 'Irrigation, Water Resource & Climate Resilience Control',
      tags: ['irrigation control', 'water resource', 'climate resilience', 'input efficiency'],
      keywords: [
        'irrigation',
        'water rights',
        'borehole',
        'pivot',
        'drip irrigation',
        'dam levels',
        'water allocation',
        'drought',
        'heat stress',
        'rainfall',
        'soil moisture',
        'water use efficiency',
        'loadshedding irrigation',
      ],
      executiveTheme: 'Water Resilience',
    },
    {
      type: 'ag_agri_processing_value_chain',
      label: 'Agri-Processing, Storage & Value Chain Throughput',
      tags: ['agri-processing', 'storage control', 'value chain flow', 'throughput'],
      keywords: [
        'agri-processing',
        'processing',
        'milling',
        'oil pressing',
        'abattoir',
        'dairy processing',
        'storage',
        'silo',
        'drying',
        'cleaning',
        'grading line',
        'processing yield',
        'value chain',
      ],
      executiveTheme: 'Value Chain Throughput',
    },
    {
      type: 'ag_yield_performance',
      label: 'Yield Performance & Operational Timing',
      tags: ['yield performance', 'operational timing', 'farm execution'],
      keywords: [
        'yield gap',
        'yield',
        'planting window',
        'harvesting window',
        'stocking density',
        'germination',
        'harvest losses',
        'post-harvest',
        'post harvest',
        'pest',
        'disease',
        'weed control',
        'timeliness of operations',
        'labour productivity',
        'machinery productivity',
      ],
      executiveTheme: 'Yield Realisation',
    },
    {
      type: 'ag_margin_cost_control',
      label: 'Unit Cost, Margin & Enterprise Mix',
      tags: ['unit cost control', 'gross margin', 'enterprise mix'],
      keywords: [
        'gross margin per hectare',
        'gross margin per animal',
        'cost per hectare',
        'cost per unit',
        'crop mix',
        'livestock mix',
        'land allocation',
        'hedging',
        'forward contracting',
        'input efficiency',
        'fuel',
        'fertiliser',
        'seed',
        'price realisation',
        'overhead absorption',
        'input price variance',
      ],
      executiveTheme: 'Margin Discipline',
    },
    {
      type: 'ag_risk_management',
      label: 'Risk Management, Resilience & Realisation',
      tags: ['risk management', 'weather resilience', 'market protection'],
      keywords: [
        'weather',
        'drought',
        'flood',
        'frost',
        'heat stress',
        'biosecurity',
        'disease outbreak',
        'insurance',
        'claims recovery',
        'hedging',
        'forward sales',
        'quality downgrade',
        'off-taker',
        'off taker',
        'debt servicing',
      ],
      executiveTheme: 'Risk Layering',
    },
    {
      type: 'ag_working_capital_cash_cycle',
      label: 'Working Capital & Seasonal Cash Exposure',
      tags: ['working capital', 'cash cycle', 'seasonal exposure'],
      keywords: [
        'peak funding',
        'pre-planting',
        'pre planting',
        'cash conversion cycle',
        'inventory holding',
        'storage',
        'drying',
        'grading',
        'packing',
        'payment terms',
        'lease timing',
        'harvest cash inflows',
        'working capital',
        'seasonal cash',
      ],
      executiveTheme: 'Liquidity Timing',
    },
  ],

  healthcare: [
    {
      type: 'hc_private_practice_operations',
      label: 'Private Practice Operations, Billing & Patient Administration',
      tags: ['private practice', 'patient administration', 'claims discipline', 'front-office workflow'],
      keywords: [
        'private practice',
        'family practice',
        'medical practice',
        'general practice',
        'gp practice',
        'doctor practice',
        'specialist practice',
        'practice operations',
        'front-office',
        'front office',
        'reception',
        'appointment scheduling',
        'appointment utilisation',
        'appointment utilization',
        'patient file',
        'patient file completeness',
        'patient records',
        'claims documentation',
        'billing follow-up',
        'debtor control',
        'doctor utilisation',
        'doctor utilization',
        'practice dashboard',
        'patient follow-up',
        'medical aid claims',
        'practice management',
        'administrative friction',
        'not a hospital',
      ],
      executiveTheme: 'Practice Control',
    },
    {
      type: 'hc_clinic_access_flow',
      label: 'Clinic Access, Patient Flow & Service Coordination',
      tags: ['clinic flow', 'patient access', 'service coordination', 'waiting-time control'],
      keywords: [
        'clinic',
        'clinic flow',
        'community clinic',
        'outpatient clinic',
        'primary care clinic',
        'patient access',
        'waiting time',
        'waiting times',
        'triage',
        'consultation rooms',
        'nurse scheduling',
        'queue management',
        'walk-in patients',
        'booking discipline',
        'clinic administration',
        'clinic throughput',
        'patient throughput',
        'follow-up appointments',
      ],
      executiveTheme: 'Access Reliability',
    },
    {
      type: 'hc_hospital_capacity_flow',
      label: 'Hospital Capacity, Throughput & Patient Flow',
      tags: ['hospital capacity', 'patient flow', 'throughput control', 'facility coordination'],
      keywords: [
        'hospital',
        'ward',
        'bed',
        'beds',
        'bed occupancy',
        'bed blocking',
        'theatre',
        'theatres',
        'theatre utilisation',
        'theatre utilization',
        'emergency department',
        'ed throughput',
        'discharge',
        'discharge planning',
        'length of stay',
        'los',
        'admission',
        'admissions',
        'inpatient',
        'outpatient facilities',
        'turnover time',
        'cancellation rate',
        'boarding',
        'waiting list',
      ],
      executiveTheme: 'Facility Flow Reliability',
    },
    {
      type: 'hc_revenue_cycle_cash',
      label: 'Revenue Cycle, Claims, Cash Flow & Working Capital',
      tags: ['revenue cycle', 'claims control', 'cash conversion', 'working capital'],
      keywords: [
        'revenue-cycle',
        'revenue cycle',
        'cash conversion',
        'claim submission',
        'claim rejection',
        'rejected claims',
        'claims follow-up',
        'denial rate',
        'authorisation delays',
        'authorisation',
        'authorization',
        'pre-authorisation',
        'pre authorisation',
        'pre-authorization',
        'days sales outstanding',
        'dso',
        'billing accuracy',
        'billing and collection',
        'bad debt',
        'co-payment',
        'co payment',
        'patient account aging',
        'medical aid',
        'insurer',
      ],
      executiveTheme: 'Cash Conversion',
    },
    {
      type: 'hc_clinical_quality_safety',
      label: 'Clinical Quality, Patient Safety & Care Variation',
      tags: ['clinical quality', 'patient safety', 'care variation'],
      keywords: [
        'clinical quality',
        'patient safety',
        'clinical variation',
        'clinical governance',
        'infection control',
        'hai',
        'readmission',
        'mortality',
        'morbidity',
        'adverse event',
        'sentinel event',
        'protocol adherence',
        'handover',
        'medication errors',
        'missed diagnoses',
        'quality and patient safety',
      ],
      executiveTheme: 'Clinical Governance',
    },
    {
      type: 'hc_margin_case_contribution',
      label: 'Contribution per Case, Consultation & Payer Mix',
      tags: ['case contribution', 'payer mix', 'tariff discipline'],
      keywords: [
        'contribution margin',
        'contribution margin per case',
        'contribution per case',
        'contribution per admission',
        'contribution per patient',
        'contribution per consultation',
        'margin per case',
        'revenue per case',
        'case-mix',
        'case mix',
        'payer-mix',
        'payer mix',
        'tariff',
        'short payments',
        'cash patient',
        'patient panel',
        'service line economics',
      ],
      executiveTheme: 'Margin Discipline',
    },
    {
      type: 'hc_medical_supplier_stock_distribution',
      label: 'Medical Supplier Stock, Distribution & Debtor Control',
      tags: ['medical supply', 'stock control', 'distribution reliability', 'debtor discipline'],
      keywords: [
        'medical supplier',
        'medical supplies',
        'medical distributor',
        'consumables',
        'devices',
        'medical device',
        'medical equipment',
        'stock control',
        'stock availability',
        'inventory turns',
        'expiry',
        'expired stock',
        'batch control',
        'lot control',
        'cold chain',
        'supplier lead time',
        'distribution',
        'delivery route',
        'hospital procurement',
        'clinic procurement',
        'debtor control',
      ],
      executiveTheme: 'Supply Reliability',
    },
    {
      type: 'hc_pharmacy_margin_stock_control',
      label: 'Pharmacy Stock, Script Flow & Margin Control',
      tags: ['pharmacy operations', 'stock turns', 'script flow', 'margin control'],
      keywords: [
        'pharmacy',
        'dispensary',
        'script',
        'scripts',
        'prescription',
        'front shop',
        'front-shop',
        'stock turns',
        'stock shrinkage',
        'expired medicine',
        'schedule medicine',
        'medicine stock',
        'dispensing workflow',
        'pharmacist capacity',
        'pharmacy margin',
      ],
      executiveTheme: 'Pharmacy Operating Control',
    },
    {
      type: 'hc_healthcare_admin_compliance',
      label: 'Healthcare Administration, Compliance & Management Visibility',
      tags: ['healthcare administration', 'compliance visibility', 'management reporting'],
      keywords: [
        'healthcare administration',
        'admin pressure',
        'administrative workflow',
        'medical administration',
        'document control',
        'compliance document',
        'patient confidentiality',
        'popia',
        'medical ethics',
        'policy control',
        'management visibility',
        'dashboard',
        'reporting visibility',
        'role clarity',
        'staff workload',
        'workflow discipline',
      ],
      executiveTheme: 'Administrative Control',
    },
  ],

  energy: [
    {
      type: 'en_solar_epc_installation_delivery',
      label: 'Solar EPC, Installation Delivery & Site Execution Control',
      tags: ['solar epc', 'installation delivery', 'site execution', 'commissioning readiness'],
      keywords: [
        'solar',
        'solar pv',
        'pv',
        'rooftop solar',
        'ground mount',
        'inverter',
        'panel',
        'module',
        'installation',
        'epc',
        'dc string',
        'ac connection',
        'commissioning',
        'solar installer',
        'site handover',
      ],
      executiveTheme: 'Solar Delivery Control',
    },
    {
      type: 'en_backup_power_storage_resilience',
      label: 'Backup Power, Battery Storage & Energy Resilience',
      tags: ['backup power', 'battery storage', 'resilience', 'load management'],
      keywords: [
        'battery',
        'bess',
        'storage',
        'backup power',
        'generator',
        'genset',
        'loadshedding',
        'load shedding',
        'hybrid system',
        'microgrid',
        'ups',
        'energy resilience',
        'peak shaving',
        'load management',
      ],
      executiveTheme: 'Energy Resilience',
    },
    {
      type: 'en_renewable_asset_operations',
      label: 'Renewable Asset Operations, Yield Assurance & O&M Control',
      tags: ['renewable operations', 'yield assurance', 'o&m control', 'asset performance'],
      keywords: [
        'asset operations',
        'o&m',
        'operations and maintenance',
        'yield assurance',
        'performance ratio',
        'availability',
        'curtailment',
        'degradation',
        'cleaning schedule',
        'monitoring',
        'scada',
        'asset performance',
        'renewable asset',
      ],
      executiveTheme: 'Asset Yield Control',
    },
    {
      type: 'en_grid_connection_permitting',
      label: 'Grid Connection, Permitting & Regulatory Approval Control',
      tags: ['grid connection', 'permitting', 'regulatory approvals', 'connection risk'],
      keywords: [
        'grid connection',
        'grid application',
        'municipal approval',
        'wheeling',
        'nersa',
        'eia',
        'permitting',
        'interconnection',
        'substation',
        'grid capacity',
        'utility approval',
        'connection study',
        'single line diagram',
      ],
      executiveTheme: 'Grid Readiness',
    },
    {
      type: 'en_energy_efficiency_demand_management',
      label: 'Energy Efficiency, Demand Management & Cost Reduction',
      tags: ['energy efficiency', 'demand management', 'cost reduction', 'consumption visibility'],
      keywords: [
        'energy efficiency',
        'demand management',
        'energy audit',
        'consumption',
        'demand charge',
        'tariff',
        'metering',
        'submetering',
        'energy cost',
        'load profile',
        'kwh',
        'power factor',
        'cost saving',
      ],
      executiveTheme: 'Energy Cost Control',
    },
    {
      type: 'en_project_margin_irr',
      label: 'Project Margin Protection & IRR Realisation',
      tags: ['irr realisation', 'project margin', 'portfolio strategy'],
      keywords: [
        'project economics',
        'project margin',
        'irr',
        'yield assurance',
        'yield under-performance',
        'yield under performance',
        'curtailment',
        'renewable portfolio',
        'solar',
        'wind',
        'asset-level economic drift',
        'asset-level economics',
        'ppa',
        'offtake',
        'off-take',
        'merchant exposure',
        'technology mix',
        'site selection',
        'resource under-performance',
        'resource under performance',
        'degradation',
        'o&m cost overruns',
      ],
      executiveTheme: 'Value Realisation',
    },
    {
      type: 'en_schedule_commissioning',
      label: 'Schedule Slippage, Grid Connection & Commissioning',
      tags: ['schedule control', 'grid connection', 'commissioning risk'],
      keywords: [
        'commissioning certainty',
        'grid connection',
        'commissioning delays',
        'commissioning',
        'delivery certainty',
        'permitting',
        'eia',
        'land acquisition',
        'substation',
        'epc',
        'civil works',
        'weather window',
        'pto',
        'fac',
        'handover delay',
        'testing delay',
      ],
      executiveTheme: 'Delivery Certainty',
    },
    {
      type: 'en_contractual_claims',
      label: 'Variations, Claims & Contractual Performance',
      tags: ['contract performance', 'claims recovery', 'variation control'],
      keywords: [
        'contractual recovery',
        'contractual',
        'claims discipline',
        'variation',
        'change order',
        'curtailment compensation',
        'performance guarantees',
        'insurance claims',
        'force majeure',
        'warranty',
        'oem',
        'epc under-performance',
        'epc under performance',
        'claim recovery',
        'epc and oem',
      ],
      executiveTheme: 'Commercial Recovery',
    },
    {
      type: 'en_cashflow_transition',
      label: 'Cash Flow, Funding & Construction-to-Operation Transition',
      tags: ['cash exposure', 'funding control', 'working capital'],
      keywords: [
        'funding discipline',
        'cash exposure',
        'construction-to-operation',
        'construction to operation',
        'funding headroom',
        'upfront capex',
        'drawdowns',
        'equity injections',
        'bonding',
        'letters of credit',
        'operational phase cash',
        'revenue collection',
        'escrow',
        'spares inventory',
        'refinancing',
        'currency mismatch',
        'inflation mismatch',
      ],
      executiveTheme: 'Funding Discipline',
    },
  ],
};

function buildSearchText(input: AdvisoryInput): string {
  return [input.client, input.challenge, input.goal, input.constraints, input.businessFunction, input.triggerSource, input.notes]
    .map(clean)
    .join(' ')
    .toLowerCase();
}

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function appendContextTags(input: AdvisoryInput, tags: string[]): string[] {
  const text = buildSearchText(input);

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

  if (['building contractor', 'civil works', 'subcontractor', 'safety file', 'boq', 'site instruction'].some((term) => text.includes(term))) {
    extra.push('Construction Delivery Context');
  }

  if (['assembly', 'batch', 'work order', 'oee', 'maintenance', 'raw material', 'traceability'].some((term) => text.includes(term))) {
    extra.push('Manufacturing Operating Context');
  }

  if (['label', 'labels', 'carton', 'prepress', 'pre-press', 'flexo', 'sleeve', 'packaging'].some((term) => text.includes(term))) {
    extra.push('Printing / Packaging Context');
  }

  if (['farm', 'hectare', 'harvest', 'irrigation', 'crop', 'livestock', 'agronomy'].some((term) => text.includes(term))) {
    extra.push('Farm / Enterprise Context');
  }

  if (['private practice', 'family practice', 'medical practice', 'doctor practice', 'front office', 'front-office', 'patient file', 'claims documentation'].some((term) => text.includes(term))) {
    extra.push('Private Practice Context');
  } else if (['hospital', 'ward', 'theatre', 'bed occupancy', 'discharge', 'emergency department', 'ed throughput'].some((term) => text.includes(term))) {
    extra.push('Hospital / Facility Context');
  } else if (['clinic', 'patient access', 'waiting time', 'triage', 'consultation room'].some((term) => text.includes(term))) {
    extra.push('Clinic / Access Context');
  } else if (['patient', 'clinical', 'medical aid', 'billing', 'claims'].some((term) => text.includes(term))) {
    extra.push('Healthcare Operating Context');
  }

  if (['solar', 'wind', 'ppa', 'grid', 'turbine', 'module', 'battery', 'commissioning'].some((term) => text.includes(term))) {
    extra.push('Project / Asset Context');
  }

  if (['consulting', 'legal', 'accounting', 'agency', 'managed services', 'billable', 'retainer'].some((term) => text.includes(term))) {
    extra.push('Professional Services Context');
  }

  return Array.from(new Set([...tags, ...extra]));
}

function applyHealthcareSubtypeBoost(input: AdvisoryInput, rule: Rule, baseScore: number): number {
  const overlayKey = resolveOverlayKey(input.industry);
  if (overlayKey !== 'healthcare') return baseScore;

  const text = buildSearchText(input);

  let score = baseScore;

  const privatePracticeSignals = [
    'private practice',
    'family practice',
    'medical practice',
    'gp practice',
    'doctor',
    'front-office',
    'front office',
    'patient file',
    'claims documentation',
    'doctor utilisation',
    'doctor utilization',
    'not a hospital',
  ];

  const hospitalSignals = [
    'hospital',
    'ward',
    'theatre',
    'theatres',
    'bed',
    'beds',
    'bed occupancy',
    'bed blocking',
    'emergency department',
    'ed throughput',
    'discharge',
    'length of stay',
  ];

  const clinicSignals = [
    'clinic',
    'outpatient clinic',
    'community clinic',
    'walk-in',
    'triage',
    'consultation rooms',
    'patient access',
  ];

  const supplierSignals = [
    'medical supplier',
    'medical supplies',
    'medical distributor',
    'medical equipment',
    'medical device',
    'consumables',
    'distribution',
    'batch control',
    'cold chain',
  ];

  const pharmacySignals = [
    'pharmacy',
    'dispensary',
    'script',
    'prescription',
    'front shop',
    'stock turns',
    'expired medicine',
  ];

  const hasPrivatePractice = includesAny(text, privatePracticeSignals);
  const hasHospital = includesAny(text, hospitalSignals);
  const hasClinic = includesAny(text, clinicSignals);
  const hasSupplier = includesAny(text, supplierSignals);
  const hasPharmacy = includesAny(text, pharmacySignals);

  if (rule.type === 'hc_private_practice_operations' && hasPrivatePractice) score += 14;
  if (rule.type === 'hc_hospital_capacity_flow' && hasHospital && !text.includes('not a hospital')) score += 12;
  if (rule.type === 'hc_clinic_access_flow' && hasClinic && !hasHospital) score += 10;
  if (rule.type === 'hc_medical_supplier_stock_distribution' && hasSupplier) score += 12;
  if (rule.type === 'hc_pharmacy_margin_stock_control' && hasPharmacy) score += 12;

  if (rule.type === 'hc_hospital_capacity_flow' && hasPrivatePractice) score -= 12;
  if (rule.type === 'hc_hospital_capacity_flow' && text.includes('not a hospital')) score -= 18;
  if (rule.type === 'hc_private_practice_operations' && hasHospital && !hasPrivatePractice) score -= 4;

  return score;
}

function applyRemainingSectorSubtypeBoost(input: AdvisoryInput, rule: Rule, baseScore: number): number {
  const overlayKey = resolveOverlayKey(input.industry);
  if (overlayKey === 'healthcare') return baseScore;

  const text = buildSearchText(input);
  let score = baseScore;

  const boost = (ruleTypes: string[], signals: string[], points = 12) => {
    if (ruleTypes.includes(rule.type) && includesAny(text, signals)) score += points;
  };

  const suppress = (ruleTypes: string[], signals: string[], points = 5) => {
    if (ruleTypes.includes(rule.type) && includesAny(text, signals)) score -= points;
  };

  if (overlayKey === 'construction') {
    boost(['con_general_building_contractor'], ['building contractor', 'main contractor', 'residential', 'commercial building', 'renovation', 'practical completion'], 14);
    boost(['con_civil_infrastructure_delivery'], ['civil works', 'civils', 'earthworks', 'roads', 'stormwater', 'bulk services', 'plant utilisation'], 14);
    boost(['con_specialist_subcontractor_control'], ['specialist subcontractor', 'electrical contractor', 'plumbing', 'hvac', 'roofing', 'scaffolding', 'subcontractor payment'], 13);
    boost(['con_hs_compliance_safety_file'], ['safety file', 'ohs', 'risk assessment', 'method statement', 'toolbox talk', 'incident', 'site audit'], 15);
    boost(['con_qs_cost_variation_control'], ['quantity surveyor', 'qs', 'boq', 'payment certificate', 'final account', 'valuation', 'variation'], 13);
    boost(['con_property_development_management'], ['property development', 'developer', 'feasibility', 'town planning', 'zoning', 'development finance'], 12);
    boost(['con_facilities_maintenance_sla'], ['facilities', 'reactive maintenance', 'call-out', 'work order', 'sla', 'tenant complaint'], 12);

    suppress(['con_hs_compliance_safety_file'], ['property development', 'sales pipeline', 'new markets'], 6);
    suppress(['con_property_development_management'], ['safety file', 'toolbox talk', 'incident'], 6);
  }

  if (overlayKey === 'manufacturing') {
    boost(['mfg_discrete_production_flow'], ['assembly', 'work order', 'production order', 'line balancing', 'job shop', 'production cell'], 13);
    boost(['mfg_process_yield_batch_control'], ['batch', 'recipe', 'formulation', 'yield loss', 'mixing', 'blending', 'filling'], 13);
    boost(['mfg_food_fmcg_quality_traceability'], ['food', 'fmcg', 'beverage', 'shelf life', 'haccp', 'traceability', 'recall'], 13);
    boost(['mfg_engineering_fabrication_bom_control'], ['fabrication', 'engineering', 'welding', 'cnc', 'drawing revision', 'bom', 'cut list'], 13);
    boost(['mfg_maintenance_oee_asset_reliability'], ['maintenance', 'breakdown', 'mtbf', 'mttr', 'critical spares', 'oee', 'downtime'], 13);
    boost(['mfg_supply_chain_inventory_control'], ['inventory', 'raw material', 'supplier delay', 'stockout', 'warehouse', 'procurement', 'lead time'], 13);
  }

  if (overlayKey === 'printing_packaging') {
    boost(['pp_label_flexible_packaging_operations'], ['label', 'labels', 'flexo', 'shrink sleeve', 'sleeves', 'film', 'rewinder', 'slitter'], 14);
    boost(['pp_carton_folding_carton_postpress'], ['carton', 'folding carton', 'corrugated', 'die-cutting', 'folder gluer', 'creasing'], 14);
    boost(['pp_commercial_print_prepress_control'], ['commercial print', 'litho', 'digital print', 'prepress', 'pre-press', 'ctp', 'artwork'], 14);
    boost(['pp_market_expansion_sales_pipeline'], ['new markets', 'new leads', 'sales pipeline', 'saa', 'saa technical', 'pharma', 'freelance reps'], 15);
    boost(['pp_specification_change_control'], ['wrong artwork', 'client approval', 'version control', 'job ticket', 'incomplete brief'], 9);
    boost(['pp_capacity_bottleneck_balance'], ['press', 'finishing', 'make ready', 'oee', 'bottleneck', 'idle press'], 8);
  }

  if (overlayKey === 'agriculture') {
    boost(['ag_crop_production_yield_planning'], ['crop', 'maize', 'wheat', 'soybean', 'planting', 'harvesting', 'hectare'], 14);
    boost(['ag_livestock_health_feed_conversion'], ['livestock', 'cattle', 'sheep', 'poultry', 'dairy', 'herd', 'feed conversion'], 14);
    boost(['ag_fresh_produce_packhouse_cold_chain'], ['fresh produce', 'fruit', 'vegetables', 'packhouse', 'grading', 'cold chain'], 14);
    boost(['ag_irrigation_water_resource_control'], ['irrigation', 'water rights', 'borehole', 'pivot', 'drought', 'soil moisture'], 14);
    boost(['ag_agri_processing_value_chain'], ['agri-processing', 'milling', 'abattoir', 'silo', 'processing yield', 'value chain'], 13);
  }

  if (overlayKey === 'energy') {
    boost(['en_solar_epc_installation_delivery'], ['solar', 'solar pv', 'rooftop solar', 'inverter', 'panel', 'module', 'solar installer'], 15);
    boost(['en_backup_power_storage_resilience'], ['battery', 'bess', 'backup power', 'generator', 'loadshedding', 'microgrid', 'ups'], 14);
    boost(['en_renewable_asset_operations'], ['o&m', 'yield assurance', 'performance ratio', 'curtailment', 'scada', 'asset performance'], 13);
    boost(['en_grid_connection_permitting'], ['grid connection', 'municipal approval', 'wheeling', 'nersa', 'permitting', 'interconnection'], 14);
    boost(['en_energy_efficiency_demand_management'], ['energy efficiency', 'energy audit', 'demand charge', 'metering', 'load profile', 'power factor'], 14);
  }

  if (overlayKey === 'professional_services') {
    boost(['ps_consulting_advisory_delivery'], ['consulting', 'advisory', 'client engagement', 'scope creep', 'sow', 'workshop'], 14);
    boost(['ps_legal_compliance_matter_management'], ['legal', 'law firm', 'attorney', 'matter', 'litigation', 'contract review'], 14);
    boost(['ps_accounting_tax_month_end'], ['accounting', 'bookkeeping', 'tax', 'vat', 'payroll', 'month-end', 'sars'], 14);
    boost(['ps_engineering_architecture_project_control'], ['engineering', 'architecture', 'drawing', 'design review', 'site inspection'], 13);
    boost(['ps_agency_marketing_pipeline_delivery'], ['agency', 'marketing agency', 'campaign', 'creative workflow', 'account manager'], 13);
    boost(['ps_it_managed_services_sla'], ['it services', 'managed services', 'msp', 'support desk', 'ticket', 'sla'], 13);
  }

  return score;
}

function selectBestRule(input: AdvisoryInput, rules: Rule[]): ClassificationResult | null {
  const scored = rules
    .map((rule) => {
      const baseScore = keywordScoreByField(input, rule.keywords);
      const healthcareScore = applyHealthcareSubtypeBoost(input, rule, baseScore);
      const score = applyRemainingSectorSubtypeBoost(input, rule, healthcareScore);
      return { rule, score };
    })
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
    if (
      industryResult.confidence === 'Moderate' &&
      (normaliseUrgency(input.urgency) === 'High' || clean(input.financialExposure).toLowerCase().includes('million'))
    ) {
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
