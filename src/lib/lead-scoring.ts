/**
 * Lead Scoring Module
 * 
 * SECURITY NOTES:
 * - Scoring is calculated SERVER-SIDE in production (via Edge Functions)
 * - This client-side version is for display/preview purposes only
 * - The server always recalculates and overrides any client-provided score
 * - Never trust scores sent from the browser
 */

import type { ServiceType, Urgency } from './types';

interface ScoringInput {
  service_type: ServiceType;
  urgency: Urgency;
  has_photos: boolean;
  description_length: number;
  zip_code: string;
}

interface ScoringResult {
  score: number;
  priority: 'high' | 'medium' | 'low';
  factors: string[];
}

// Service type weights (higher = more valuable lead)
const SERVICE_WEIGHTS: Record<ServiceType, number> = {
  emergency: 30,
  storm_damage: 25,
  roof_replacement: 25,
  roof_repair: 20,
  roof_inspection: 10,
  gutter_service: 10,
  other: 5,
};

// Urgency weights
const URGENCY_WEIGHTS: Record<Urgency, number> = {
  emergency: 30,
  urgent: 20,
  soon: 10,
  planning: 5,
};

/**
 * Calculate lead score based on multiple factors.
 * Score range: 0-100
 * 
 * In production, this runs server-side via Supabase Edge Function.
 */
export function calculateLeadScore(input: ScoringInput): ScoringResult {
  let score = 0;
  const factors: string[] = [];

  // Service type score (0-30)
  const serviceScore = SERVICE_WEIGHTS[input.service_type] || 0;
  score += serviceScore;
  if (serviceScore >= 20) factors.push('High-value service type');

  // Urgency score (0-30)
  const urgencyScore = URGENCY_WEIGHTS[input.urgency] || 0;
  score += urgencyScore;
  if (urgencyScore >= 20) factors.push('Urgent timeline');

  // Photo bonus (0-15)
  if (input.has_photos) {
    score += 15;
    factors.push('Photos provided');
  }

  // Description quality (0-15)
  if (input.description_length >= 200) {
    score += 15;
    factors.push('Detailed description');
  } else if (input.description_length >= 100) {
    score += 10;
    factors.push('Good description');
  } else if (input.description_length >= 50) {
    score += 5;
  }

  // Location bonus (0-10) - in production, check against service area
  if (input.zip_code && input.zip_code.length >= 5) {
    score += 10;
    factors.push('Valid service area');
  }

  // Cap at 100
  score = Math.min(score, 100);

  // Determine priority
  let priority: 'high' | 'medium' | 'low';
  if (score >= 70) priority = 'high';
  else if (score >= 40) priority = 'medium';
  else priority = 'low';

  return { score, priority, factors };
}

export function getPriorityColor(priority: 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'low': return 'text-green-600 bg-green-50 border-green-200';
  }
}

export function getPriorityBadge(priority: 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-amber-100 text-amber-800';
    case 'low': return 'bg-green-100 text-green-800';
  }
}
