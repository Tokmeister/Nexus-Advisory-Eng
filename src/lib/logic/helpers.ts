import type { AdvisoryInput } from './types';

export function clean(value: unknown): string {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function cleanList(value: string): string[] {
  return clean(value)
    .split(',')
    .map((item) => clean(item))
    .filter(Boolean);
}

export function trimSentence(value: string): string {
  return clean(value).replace(/[.!?]+$/g, '').trim();
}

export function normaliseUrgency(value: string): 'High' | 'Medium' | 'Low' | 'Critical' {
  const raw = clean(value).toLowerCase();
  if (raw === 'critical') return 'Critical';
  if (raw === 'high' || raw === 'urgent') return 'High';
  if (raw === 'medium' || raw === 'moderate') return 'Medium';
  return 'Low';
}

export function todayString(): string {
  return new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function buildReportId(clientName: string): string {
  const slug = clean(clientName).toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'CLIENT';
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('') + '-' + [String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0')].join('');
  return `NEXUS-${slug}-${stamp}`;
}

export function validateInput(input: AdvisoryInput): string[] {
  const errors: string[] = [];
  if (!clean(input.client)) errors.push('Client name is required.');
  if (!clean(input.industry)) errors.push('Industry is required.');
  if (!clean(input.challenge)) errors.push('Primary business challenge is required.');
  if (!clean(input.goal)) errors.push('Strategic goal is required.');
  if (!clean(input.valueType)) errors.push('Value type is required.');
  if (!clean(input.estimatedValue)) {
    errors.push('Estimated value (ZAR) is required.');
  } else {
    const numericValue = Number(clean(input.estimatedValue).replace(/[^0-9.-]+/g, ''));
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      errors.push('Estimated value (ZAR) must be greater than 0.');
    }
  }
  if (!clean(input.businessFunction)) errors.push('Business function affected is required.');
  if (!clean(input.triggerSource)) errors.push('Trigger source is required.');
  if (clean(input.challenge).length < 20) errors.push('Business challenge is too short. Add more context.');
  if (clean(input.goal).length < 12) errors.push('Strategic goal is too short. Add more precision.');
  return errors;
}

export function dedupeCaseInsensitive(items: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items.map(clean).filter(Boolean)) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

export function keywordScoreByField(input: AdvisoryInput, keywords: string[]): number {
  const fields: Array<[string, number]> = [
    [clean(input.industry).toLowerCase(), 4],
    [clean(input.challenge).toLowerCase(), 5],
    [clean(input.goal).toLowerCase(), 3],
    [clean(input.constraints).toLowerCase(), 2],
    [clean(input.businessFunction).toLowerCase(), 1],
    [clean(input.triggerSource).toLowerCase(), 4],
    [clean(input.notes).toLowerCase(), 1],
  ];
  let score = 0;
  for (const [text, weight] of fields) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) score += weight;
    }
  }
  return score;
}

export function includesAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}
