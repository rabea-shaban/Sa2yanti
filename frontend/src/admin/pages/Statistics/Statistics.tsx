import { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { Users, PieChart } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserGrowthStats {
  _id: { year: number; month: number };
  count: number;
}

interface OrderDistributionStats {
  _id: string;
  count: number;
}

export default function Statistics() {
  const [loading, setLoading] = useState(true);
  const [userGrowth, setUserGrowth] = useState<UserGrowthStats[]>([]);
  const [techGrowth, setTechGrowth] = useState<UserGrowthStats[]>([]);
  const [orderDist, setOrderDist] = useState<OrderDistributionStats[]>([]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/statistics');
      if (res.data.success) {
        setUserGrowth(res.data.userGrowth || []);
        setTechGrowth(res.data.techGrowth || []);
        setOrderDist(res.data.orderDistribution || []);
      }
    } catch (err: any) {
      toast.error('فشل في تحميل التقارير والإحصائيات.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getMonthNameArabic = (monthNumber: number) => {
    const months = [
      'يناير',
      'فبراير',
      'مارس',
      'أبريل',
      'مايو',
      'يونيو',
      'يوليو',
      'أغسطس',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسمبر',
    ];
    return months[monthNumber - 1] || '';
  };

  const getStatusLabelArabic = (status: string) => {
    switch (status) {
      case 'pending':
        return 'مستني فني';
      case 'accepted':
        return 'الفني وافق';
      case 'in-progress':
        return 'شغال دلوقتي';
      case 'completed':
        return 'خلص خلاص';
      case 'cancelled':
        return 'اتلغى';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500';
      case 'accepted':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-purple-500';
      case 'completed':
        return 'bg-emerald-500';
      case 'cancelled':
        return 'bg-rose-500';
      default:
        return 'bg-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6" dir="rtl">
        <h1 className="text-2xl font-bold text-white text-right">التقارير والإحصائيات</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
          <div className="h-80 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
        </div>
      </div>
    );
  }

  // Calculate total orders
  const totalOrdersCount = (orderDist || []).reduce((acc, curr) => acc + curr.count, 0);

  // Group User Growth data by month keys
  const mergedMonthlyData: Record<string, { monthName: string; users: number; techs: number }> = {};
  
  (userGrowth || []).forEach((u) => {
    const key = `${getMonthNameArabic(u._id.month)} ${u._id.year}`;
    if (!mergedMonthlyData[key]) {
      mergedMonthlyData[key] = { monthName: key, users: 0, techs: 0 };
    }
    mergedMonthlyData[key].users = u.count;
  });

  (techGrowth || []).forEach((t) => {
    const key = `${getMonthNameArabic(t._id.month)} ${t._id.year}`;
    if (!mergedMonthlyData[key]) {
      mergedMonthlyData[key] = { monthName: key, users: 0, techs: 0 };
    }
    mergedMonthlyData[key].techs = t.count;
  });

  const chartData = Object.values(mergedMonthlyData);
  const maxUserCount = Math.max(...chartData.map((d) => Math.max(d.users, d.techs)), 5);

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">التقارير والإحصائيات</h1>
        <p className="text-sm text-slate-400 font-medium">تحليل كامل لنشاط المنصة ونمو الحسابات وحالة الأوردرات.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: User Registration growth (custom SVG/HTML charts) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-850 flex-row-reverse">
            <div className="flex items-center gap-2.5 flex-row-reverse">
              <Users size={18} className="text-indigo-400" />
              <h2 className="text-base font-bold text-white">نمو تسجيل الحسابات</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">حسابات العملاء والفنيين</span>
          </div>

          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-600 text-sm">
              لا يوجد بيانات كافية لعرض الرسم البياني حالياً.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Custom Bar Graph */}
              <div className="h-64 flex items-end gap-6 pt-6 border-b border-slate-800 pb-2 px-4 justify-center">
                {chartData.map((data, idx) => {
                  const userPercent = (data.users / maxUserCount) * 100;
                  const techPercent = (data.techs / maxUserCount) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 max-w-[60px]">
                      <div className="w-full flex items-end gap-1.5 h-48 justify-center">
                        {/* Users Bar */}
                        <div
                          className="w-3.5 bg-indigo-500 rounded-t-md hover:bg-indigo-455 transition-all relative group"
                          style={{ height: `${userPercent}%` }}
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] px-1.5 py-0.5 rounded font-mono opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                            {data.users} عميل
                          </div>
                        </div>
                        {/* Techs Bar */}
                        <div
                          className="w-3.5 bg-cyan-400 rounded-t-md hover:bg-cyan-350 transition-all relative group"
                          style={{ height: `${techPercent}%` }}
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] px-1.5 py-0.5 rounded font-mono opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                            {data.techs} فني
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold whitespace-nowrap">
                        {data.monthName}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legends */}
              <div className="flex justify-center gap-6 text-xs flex-row-reverse">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-indigo-500" />
                  <span className="text-slate-350 font-semibold">إجمالي العملاء</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-cyan-400" />
                  <span className="text-slate-350 font-semibold">إجمالي الصنايعية</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Order distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-850 flex-row-reverse">
            <div className="flex items-center gap-2.5 flex-row-reverse">
              <PieChart size={18} className="text-indigo-400" />
              <h2 className="text-base font-bold text-white">توزيع حالة الأوردرات</h2>
            </div>
            <span className="text-xs font-semibold text-slate-550">إجمالي الأوردرات: {totalOrdersCount}</span>
          </div>

          {(!orderDist || orderDist.length === 0) ? (
            <div className="h-64 flex items-center justify-center text-slate-600 text-sm">
              لا يوجد أوردرات في قاعدة البيانات حالياً لعرض إحصائياتها.
            </div>
          ) : (
            <div className="h-64 flex flex-col justify-center space-y-4">
              {(orderDist || []).map((item) => {
                const percent = totalOrdersCount > 0 ? (item.count / totalOrdersCount) * 100 : 0;
                return (
                  <div key={item._id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-300 flex-row-reverse">
                      <span className="font-semibold flex items-center gap-2 flex-row-reverse">
                        <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(item._id)}`} />
                        {getStatusLabelArabic(item._id)}
                      </span>
                      <span className="font-mono text-slate-400">
                        {item.count} أوردر ({percent.toFixed(1)}%)
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getStatusColor(item._id)}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
