export type AdvisoryInput = {
  client: string;
  industry: string;
  challenge: string;
  goal: string;
  constraints: string;
  urgency: string;
  impactAreas: string;
  financialExposure: string;
  valueType: string;
  estimatedValue: string;
  businessFunction: string;
  triggerSource: string;
  notes: string;
};

export type Roadmap = {
  day30Title: string;
  day60Title: string;
  day90Title: string;
  day30: string[];
  day60: string[];
  day90: string[];
};

export type AdvisoryRecord = {
  id: string;
  reportId: string;
  client: string;
  industry: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  confidence: string;
  urgency: 'High' | 'Medium' | 'Low' | 'Critical';
  status: string;
  date: string;
  challenge: string;
  goal: string;
  project: string;
  summary: string;
  executiveTitle: string;
  executiveText: string;
  issueStatement: string;
  riskSummary: string[];
  recommendations: string[];
  priorities: string[];
  risks: string[];
  focusTags: string[];
  roadmap: Roadmap;
  consultantNote: string;
};

export type OverlayConfig = {
  key: string;
  label: string;
  keywords: string[];
  narrative: string;
  recommendationBias: string[];
  actionTemplates: string[];
  riskHints: string[];
  focusTags: string[];
  roadmapBias: Roadmap;
};

export type ClassificationResult = {
  problemType: string;
  label: string;
  tags: string[];
  confidence: 'High' | 'Moderate';
  secondaryLabel?: string;
  executiveTheme?: string;
};

export type RecommendationSet = {
  quickWins: string[];
  priorities: string[];
};
