import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield, LogOut, Phone, Mail, MessageSquare, Clock,
  TrendingUp, Users, AlertTriangle, CheckCircle, Search,
  ChevronDown, ExternalLink, Filter, Star, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDemoLeads, getDemoStats, updateDemoLeadStatus } from '../lib/demo-store';
import {
  SERVICE_TYPE_LABELS, URGENCY_LABELS, STATUS_LABELS,
  type Lead, type LeadStatus, type DashboardStats
} from '../lib/types';
import { getPriorityBadge } from '../lib/lead-scoring';

function getPriorityFromScore(score: number): 'high' | 'medium' | 'low' {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

export default function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [demoMode] = useState(true); // Always true in this environment

  useEffect(() => {
    // In production: check auth state and redirect if not logged in
    // For demo: show dashboard regardless
    loadData();
  }, []);

  const loadData = () => {
    setLoadingData(true);
    // Simulate API delay
    setTimeout(() => {
      setLeads(getDemoLeads());
      setStats(getDemoStats());
      setLoadingData(false);
    }, 500);
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    const updated = updateDemoLeadStatus(leadId, newStatus);
    if (updated) {
      setLeads(prev => prev.map(l => l.id === leadId ? updated : l));
      if (selectedLead?.id === leadId) {
        setSelectedLead(updated);
      }
    }
  };

  const filteredLeads = leads.filter(lead => {
    // Status filter
    if (filter !== 'all' && lead.status !== filter) return false;
    // Search filter
    if (search) {
      const q = search.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.zip_code.includes(q) ||
        lead.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">ApexRoof Dashboard</h1>
                {demoMode && (
                  <p className="text-xs text-amber-600">Demo Mode</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <span className="hidden sm:block text-sm text-gray-500">{user.email}</span>
              )}
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">View Site</span>
              </Link>
              <button
                onClick={() => signOut().then(() => navigate('/login'))}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={Users}
              label="Total Leads"
              value={stats.total_leads}
              color="bg-blue-50 text-blue-600"
            />
            <StatCard
              icon={AlertTriangle}
              label="New Leads"
              value={stats.new_leads}
              color="bg-amber-50 text-amber-600"
            />
            <StatCard
              icon={TrendingUp}
              label="High Priority"
              value={stats.high_priority}
              color="bg-red-50 text-red-600"
            />
            <StatCard
              icon={CheckCircle}
              label="Contacted Today"
              value={stats.contacted_today}
              color="bg-green-50 text-green-600"
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search leads by name, email, phone, ZIP..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
            </div>
            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm appearance-none bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="lost">Lost</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className="space-y-3">
          {filteredLeads.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No leads found</h3>
              <p className="text-gray-500 text-sm">
                {search || filter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'New leads will appear here as they come in.'}
              </p>
            </div>
          ) : (
            filteredLeads.map(lead => {
              const priority = getPriorityFromScore(lead.score);
              const isSelected = selectedLead?.id === lead.id;

              return (
                <div
                  key={lead.id}
                  className={`bg-white rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-300 shadow-md ring-1 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  } ${priority === 'high' ? 'border-l-4 border-l-red-400' : ''}`}
                  onClick={() => setSelectedLead(isSelected ? null : lead)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityBadge(priority)}`}>
                            {priority.toUpperCase()}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                            {STATUS_LABELS[lead.status]}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {lead.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {lead.email}
                          </span>
                          <span>📍 {lead.zip_code}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{lead.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>{SERVICE_TYPE_LABELS[lead.service_type]}</span>
                          <span>•</span>
                          <span>{URGENCY_LABELS[lead.urgency]}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(lead.created_at)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Score: {lead.score}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Actions */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            Call
                          </a>
                          <a
                            href={`sms:${lead.phone}`}
                            className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Text
                          </a>
                          <a
                            href={`mailto:${lead.email}`}
                            className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                            Email
                          </a>
                        </div>

                        {/* Status Management */}
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">Update Status:</p>
                          <div className="flex flex-wrap gap-2">
                            {(Object.keys(STATUS_LABELS) as LeadStatus[]).map(status => (
                              <button
                                key={status}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(lead.id, status);
                                }}
                                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                                  lead.status === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {STATUS_LABELS[status]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: typeof Users;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
