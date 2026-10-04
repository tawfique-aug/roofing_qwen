/**
 * Demo Data Store
 * 
 * In production, all data comes from Supabase PostgreSQL.
 * This module provides a local demo mode for when Supabase is not configured,
 * allowing the UI to be demonstrated without a backend.
 * 
 * SECURITY: This is ONLY for demo/development. Production uses Supabase with RLS.
 */

import type { Lead, LeadStatus, DashboardStats } from './types';

const DEMO_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 123-4567',
    zip_code: '75001',
    service_type: 'storm_damage',
    urgency: 'emergency',
    description: 'Large tree fell on our roof during last night\'s storm. There\'s a visible hole and water is leaking into the attic. We need emergency tarping and repair ASAP.',
    photo_urls: [],
    score: 95,
    status: 'new',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'mchen@email.com',
    phone: '(555) 234-5678',
    zip_code: '75002',
    service_type: 'roof_replacement',
    urgency: 'soon',
    description: 'Our roof is 25 years old and showing significant wear. Multiple shingles are missing and we\'ve had a few small leaks. Looking to get a full replacement quote.',
    photo_urls: [],
    score: 72,
    status: 'contacted',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '(555) 345-6789',
    zip_code: '75003',
    service_type: 'roof_inspection',
    urgency: 'planning',
    description: 'We\'re buying a new home and need a roof inspection as part of our due diligence. The house is about 15 years old.',
    photo_urls: [],
    score: 35,
    status: 'new',
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    name: 'David Thompson',
    email: 'dthompson@email.com',
    phone: '(555) 456-7890',
    zip_code: '75004',
    service_type: 'roof_repair',
    urgency: 'urgent',
    description: 'Noticed water stains on our ceiling after recent rain. Think we might have a leak around the chimney area. Need someone to look at it before it gets worse.',
    photo_urls: [],
    score: 68,
    status: 'qualified',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    name: 'Lisa Park',
    email: 'lisa.park@email.com',
    phone: '(555) 567-8901',
    zip_code: '75005',
    service_type: 'gutter_service',
    urgency: 'soon',
    description: 'Gutters are overflowing and pulling away from the house on one side. Need repair or replacement of about 30 feet of gutter.',
    photo_urls: [],
    score: 45,
    status: 'new',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
];

// Simulated demo store
let demoLeads = [...DEMO_LEADS];

export function getDemoLeads(): Lead[] {
  return [...demoLeads].sort((a, b) => b.score - a.score);
}

export function getDemoLead(id: string): Lead | undefined {
  return demoLeads.find(l => l.id === id);
}

export function updateDemoLeadStatus(id: string, status: LeadStatus): Lead | null {
  const lead = demoLeads.find(l => l.id === id);
  if (!lead) return null;
  lead.status = status;
  lead.updated_at = new Date().toISOString();
  return { ...lead };
}

export function addDemoLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Lead {
  const newLead: Lead = {
    ...lead,
    id: String(Date.now()),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  demoLeads = [newLead, ...demoLeads];
  return newLead;
}

export function getDemoStats(): DashboardStats {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return {
    total_leads: demoLeads.length,
    new_leads: demoLeads.filter(l => l.status === 'new').length,
    high_priority: demoLeads.filter(l => l.score >= 70).length,
    contacted_today: demoLeads.filter(l => 
      l.status === 'contacted' && new Date(l.updated_at) >= todayStart
    ).length,
  };
}
