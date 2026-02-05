import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  TicketIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';
import { API_BASE_URL } from "../../config/api";

// --- Types ---
interface MetricsOverview {
  totalRevenue: number;
  totalBookings: number;
  totalCustomers: number;
  activePackages: number;
}

interface TrendData { month: string; count?: number; revenue?: number; }
interface TopPackage { packageTitle: string; bookingCount: number; }

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

// --- Components ---
const StatsCard = ({ title, value, icon: Icon, trend, colorClass }: any) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
      <Icon className="w-24 h-24 transform translate-x-8 -translate-y-8" />
    </div>
    <div className="relative z-10 flex justify-between items-start">
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-opacity-100`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className={`flex items-center font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
        {trend >= 0 ? <ArrowTrendingUpIcon className="w-4 h-4 mr-1" /> : <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />}
        {Math.abs(trend)}%
      </span>
      <span className="text-slate-400 ml-2">vs last month</span>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white text-xs rounded-lg py-2 px-3 shadow-xl border border-slate-700">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboardPage: React.FC = () => {
  const { session, user } = useAuth();
  const [overview, setOverview] = useState<MetricsOverview | null>(null);
  const [trends, setTrends] = useState<{ bookingsPerMonth: TrendData[]; revenueTrend: TrendData[]; topPackages: TopPackage[] } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!session?.access_token) return;
      try {
        const [overviewRes, trendsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/dashboard/overview`, { headers: { 'Authorization': `Bearer ${session.access_token}` } }),
          fetch(`${API_BASE_URL}/api/admin/dashboard/trends`, { headers: { 'Authorization': `Bearer ${session.access_token}` } })
        ]);

        if (!overviewRes.ok || !trendsRes.ok) throw new Error('Failed to fetch data');

        const overviewData = await overviewRes.json();
        const trendsData = await trendsRes.json();

        setOverview(overviewData.overview || overviewData);
        setTrends(trendsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMetrics();
  }, [user, session]);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );

  if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-lg">Error: {error}</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
          <p className="text-slate-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Export Report</button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5">
            + Create Package
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value={`$${overview.totalRevenue.toLocaleString()}`}
            icon={CurrencyDollarIcon}
            trend={12.5}
            colorClass="bg-emerald-500 text-emerald-600"
          />
          <StatsCard
            title="Total Bookings"
            value={overview.totalBookings}
            icon={TicketIcon}
            trend={8.2}
            colorClass="bg-blue-500 text-blue-600"
          />
          <StatsCard
            title="Active Users"
            value={overview.totalCustomers}
            icon={UserGroupIcon}
            trend={-2.4}
            colorClass="bg-purple-500 text-purple-600"
          />
          <StatsCard
            title="Packages"
            value={overview.activePackages}
            icon={CubeIcon}
            trend={0}
            colorClass="bg-amber-500 text-amber-600"
          />
        </div>
      )}

      {/* Charts Section */}
      {trends && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Area Chart - Spans 2 cols */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Analytics</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends.revenueTrend}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Packages Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Top Packages</h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trends.topPackages.map(p => ({ name: p.packageTitle, value: p.bookingCount }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {trends.topPackages.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bookings Bar Chart - Full Width on Mobile */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Booking Traffic</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends.bookingsPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#F1F5F9' }} content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
