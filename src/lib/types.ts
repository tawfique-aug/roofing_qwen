// Core type definitions for the roofing lead generation system

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  zip_code: string;
  service_type: ServiceType;
  urgency: Urgency;
  description: string;
  photo_urls: string[];
  score: number;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
  owner_id?: string;
}

export type ServiceType = 
  | 'roof_repair'
  | 'roof_replacement'
  | 'roof_inspection'
  | 'storm_damage'
  | 'gutter_service'
  | 'emergency'
  | 'other';

export type Urgency = 'emergency' | 'urgent' | 'soon' | 'planning';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'scheduled' | 'completed' | 'lost';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  zip_code: string;
  service_type: ServiceType;
  urgency: Urgency;
  description: string;
  photos: File[];
}

export interface DashboardStats {
  total_leads: number;
  new_leads: number;
  high_priority: number;
  contacted_today: number;
}

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  roof_repair: 'Roof Repair',
  roof_replacement: 'Roof Replacement',
  roof_inspection: 'Roof Inspection',
  storm_damage: 'Storm Damage',
  gutter_service: 'Gutter Service',
  emergency: 'Emergency Service',
  other: 'Other',
};

export const URGENCY_LABELS: Record<Urgency, string> = {
  emergency: 'Emergency (ASAP)',
  urgent: 'Urgent (This Week)',
  soon: 'Soon (This Month)',
  planning: 'Just Planning',
};

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  scheduled: 'Scheduled',
  completed: 'Completed',
  lost: 'Lost',
};
