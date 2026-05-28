import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Package, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const mockSalesData = [
  { name: 'Sen', sales: 4000, orders: 240 },
  { name: 'Sel', sales: 3000, orders: 139 },
  { name: 'Rab', sales: 2000, orders: 980 },
  { name: 'Kam', sales: 2780, orders: 390 },
  { name: 'Jum', sales: 1890, orders: 480 },
  { name: 'Sab', sales: 2390, orders: 380 },
  { name: 'Min', sales: 3490, orders: 430 },
];

const stats = [
  { 
    title: 'Total Pendapatan', 
    value: 'Rp 24.5M', 
    trend: '+12.5%', 
    isPositive: true,
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100'
  },
  { 
    title: 'Pesanan Aktif', 
    value: '1,420', 
    trend: '+5.2%', 
    isPositive: true,
    icon: ShoppingBag,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100'
  },
  { 
    title: 'Pelanggan Baru', 
    value: '345', 
    trend: '-2.1%', 
    isPositive: false,
    icon: Users,
    color: 'text-orange-600',
    bg: 'bg-orange-100'
  },
  { 
    title: 'Stok Produk', 
    value: '8,214', 
    trend: 'Stabil', 
    isPositive: true,
    icon: Package,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
];

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Selamat Datang, Admin</h1>
          <p className="text-slate-500 text-sm mt-1">Berikut adalah ringkasan performa toko hari ini.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="flex justify-between items-start pb-4 border-b border-slate-50">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="pt-4 flex items-center gap-2">
              <span className={`flex items-center text-xs font-semibold ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {stat.trend}
              </span>
              <span className="text-xs text-slate-400 font-medium">Bulan ini</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Tren Penjualan (Ribuan)</h3>
            <p className="text-sm text-slate-500 font-medium">Grafik 7 hari terakhir</p>
          </div>
          <div className="h-[300px] w-full min-w-0" style={{ minWidth: 0, minHeight: 0 }}>
            <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={mockSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
                  itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Secondary Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Volume Pesanan</h3>
            <p className="text-sm text-slate-500 font-medium">Berdasarkan hari</p>
          </div>
          <div className="h-[300px] w-full min-w-0" style={{ minWidth: 0, minHeight: 0 }}>
            <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={mockSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                  itemStyle={{ color: '#0ea5e9', fontWeight: 600 }}
                />
                <Bar dataKey="orders" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
