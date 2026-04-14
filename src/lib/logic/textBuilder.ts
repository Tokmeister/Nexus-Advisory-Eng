import { clean, cleanList, dedupeCaseInsensitive, trimSentence } from './helpers';
import type { AdvisoryInput, ClassificationResult, OverlayConfig } from './types';

export function buildExecutiveSummary(input: AdvisoryInput, classification: ClassificationResult, overlay: OverlayConfig): string {
  const theme = classification.executiveTheme ? `${classification.executiveTheme.toLowerCase()} and ` : '';
  const secondary = classification.secondaryLabel ? ` A secondary pressure is ${classification.secondaryLabel.toLowerCase()}.` : '';
  return clean(
    `${overlay.narrative} The core challenge is: ${trimSentence(input.challenge)}. The strategic imperative is: ${trimSentence(input.goal)}. ` +
    `The immediate advisory priority is to stabilise ${theme}execution, distinguish the primary control failure from adjacent operational noise, and mobilise owner-led action that protects measurable enterprise value.${secondary}`
  );
}

export function buildIssueStatement(input: AdvisoryInput, classification: ClassificationResult): string {
  const secondary = classification.secondaryLabel ? ` Secondary pressure is also visible in ${classification.secondaryLabel.toLowerCase()}.` : '';
  const theme = classification.executiveTheme ? ` The dominant control theme is ${classification.executiveTheme.toLowerCase()}.` : '';
  return clean(
    `The primary strategic issue has been classified as ${classification.label.toLowerCase()}. This is materially constraining progress toward the stated goal: ${trimSentence(input.goal)}.${theme}${secondary}`
  );
}

export function buildRisks(input: AdvisoryInput, classification: ClassificationResult, riskLevel: string, overlay: OverlayConfig): string[] {
  return dedupeCaseInsensitive([
    `Failure to address ${classification.label.toLowerCase()} in a structured, owner-led manner risks continued under-performance against the strategic goal "${trimSentence(input.goal)}".`,
    `Execution velocity in ${clean(input.businessFunction).toLowerCase()} will remain reactive unless stabilised with clear governance and accountability.`,
    `Current risk profile is ${riskLevel} until leadership visibility, accountability, and operating discipline are elevated to the required standard.`,
    ...overlay.riskHints,
  ]).slice(0, 4);
}

export function buildFocusTags(classification: ClassificationResult, overlay: OverlayConfig, input: AdvisoryInput): string[] {
  return dedupeCaseInsensitive([
    ...classification.tags,
    ...overlay.focusTags,
    classification.executiveTheme || '',
    `Urgency: ${clean(input.urgency)}`,
    clean(input.industry),
  ]).slice(0, 8);
}

export function buildRiskSummary(urgencyScore: number, exposureScore: number, impactScore: number, riskLevel: string): string[] {
  return [
    `Urgency score: ${urgencyScore}`,
    `Exposure score: ${exposureScore}`,
    `Impact score: ${impactScore}`,
    `Overall advisory risk level: ${riskLevel}`,
  ];
}

export function buildConsultantNote(input: AdvisoryInput, classification: ClassificationResult, overlay: OverlayConfig): string {
  const secondary = classification.secondaryLabel ? ` Secondary consideration should also be given to ${classification.secondaryLabel.toLowerCase()}.` : '';
  return clean(
    `Consultant note: The brief indicates ${classification.label.toLowerCase()} pressure within a ${overlay.label.toLowerCase()} context. ` +
      `The recommended path is to convert the challenge "${trimSentence(input.challenge)}" into a sequenced, high-impact intervention roadmap directly tied to the strategic goal "${trimSentence(input.goal)}", while separating the primary control failure from secondary execution noise.${secondary}`
  );
}

export function buildConfidence(input: AdvisoryInput, classification: { confidence: 'High' | 'Moderate' }): string {
  const words = [input.challenge, input.goal, input.constraints, input.businessFunction, input.triggerSource].join(' ').split(/\s+/).length;
  const base = classification.confidence === 'High' ? 88 : 76;
  const extra = Math.min(8, Math.max(0, Math.floor((words - 18) / 8)));
  return `${Math.min(96, base + extra)}%`;
}

export function scoreRisk(input: AdvisoryInput) {
  const urgencyRaw = clean(input.urgency).toLowerCase();
  const urgencyScore = urgencyRaw === 'critical' ? 5 : urgencyRaw === 'high' || urgencyRaw === 'urgent' ? 5 : urgencyRaw === 'medium' || urgencyRaw === 'moderate' ? 3 : 1;

  const exposureRaw = clean(input.financialExposure).toLowerCase();
  const exposureScore = !exposureRaw
    ? 1
    : exposureRaw.includes('high') || exposureRaw.includes('severe') || exposureRaw.includes('material') || exposureRaw.includes('million') || exposureRaw.includes('r ')
      ? 5
      : exposureRaw.includes('medium') || exposureRaw.includes('moderate')
        ? 3
        : exposureRaw.includes('low') || exposureRaw.includes('minor')
          ? 1
          : 2;

  const impactCount = cleanList(input.impactAreas).length;
  const impactScore = impactCount >= 4 ? 5 : impactCount === 3 ? 4 : impactCount === 2 ? 3 : impactCount === 1 ? 2 : 1;

  const total = urgencyScore + exposureScore + impactScore;
  const riskLevel = total >= 13 ? 'high' : total >= 8 ? 'elevated' : total >= 5 ? 'moderate' : 'low';

  return { urgencyScore, exposureScore, impactScore, totalRiskScore: total, riskLevel };
}
