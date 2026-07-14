import { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { Save, RefreshCw, Globe, Share2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings values
  const [websiteName, setWebsiteName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/settings');
      if (res.data.success) {
        const s = res.data.settings;
        setWebsiteName(s.websiteName || '');
        setSupportEmail(s.supportEmail || '');
        setPhone(s.phone || '');
        setAddress(s.address || '');
        setFacebook(s.socialMedia?.facebook || '');
        setTwitter(s.socialMedia?.twitter || '');
        setInstagram(s.socialMedia?.instagram || '');
        setMaintenanceMode(s.maintenanceMode || false);
      }
    } catch (err: any) {
      toast.error('فشل في تحميل إعدادات النظام.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminApi.patch('/settings', {
        websiteName,
        supportEmail,
        phone,
        address,
        socialMedia: { facebook, twitter, instagram },
        maintenanceMode,
      });
      if (res.data.success) {
        toast.success('تم حفظ إعدادات النظام بنجاح');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل في حفظ إعدادات النظام.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6" dir="rtl">
        <h1 className="text-2xl font-bold text-white text-right">إعدادات النظام</h1>
        <div className="h-96 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">إعدادات النظام</h1>
        <p className="text-sm text-slate-400 font-medium">إدارة بيانات التواصل، روابط التواصل الاجتماعي، وحالة تشغيل النظام.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: General Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-850 flex-row-reverse">
              <Globe size={18} className="text-indigo-400" />
              <h2 className="text-base font-bold text-white">الإعدادات العامة</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">اسم الموقع</label>
                <input
                  type="text"
                  required
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  placeholder="مثال: صيانتك"
                  className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-700 text-sm focus:outline-none text-right"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">البريد الإلكتروني للدعم</label>
                <input
                  type="email"
                  required
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="support@sy2antek.com"
                  className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-700 text-sm focus:outline-none text-right"
                />
              </div>

              <div>
                <label className="text-xs text-slate-505 block mb-1">رقم هاتف التواصل</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="مثال: +201156807072"
                  className="block w-full px-4 py-2.5 bg-slate-955 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-550 text-white placeholder-slate-700 text-sm focus:outline-none text-right"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-1">عنوان مركز الصيانة</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: العدوة، المنيا، مصر"
                  className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-705 text-sm focus:outline-none text-right"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Social Links */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-850 flex-row-reverse">
              <Share2 size={18} className="text-indigo-400" />
              <h2 className="text-base font-bold text-white">روابط التواصل الاجتماعي</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">رابط فيسبوك</label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-700 text-sm focus:outline-none text-right"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">رابط تويتر (X)</label>
                <input
                  type="url"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-700 text-sm focus:outline-none text-right"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-1">رابط إنستغرام</label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-705 text-sm focus:outline-none text-right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Maintenance & Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-850 pb-4 flex-row-reverse">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white flex items-center justify-end gap-2.5">
                وضع الصيانة
                <ShieldAlert size={18} className="text-amber-500" />
              </h2>
              <p className="text-xs text-slate-500">عند تفعيل وضع الصيانة، سيتم إغلاق النظام أمام العملاء والفنيين لعرض صفحة صيانة مؤقتة.</p>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-14 h-7 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                maintenanceMode ? 'bg-amber-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                  maintenanceMode ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex justify-end gap-3 flex-row-reverse">
            <button
              type="button"
              onClick={fetchSettings}
              className="flex items-center justify-center gap-2 border border-slate-800 bg-slate-850 text-slate-300 hover:text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-slate-800 transition cursor-pointer"
            >
              <RefreshCw size={16} />
              إعادة تعيين
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-505 text-white px-6 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={16} />
                  حفظ الإعدادات
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
