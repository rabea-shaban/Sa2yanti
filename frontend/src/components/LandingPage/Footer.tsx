import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, Wrench } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/Api';

const QUICK_LINKS = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'الخدمات', href: '#services' },
  { label: 'كيف يعمل', href: '#how-it-works' },
  { label: 'تواصل معنا', href: '#contact' },
];

const AUTH_LINKS = [
  { label: 'تسجيل الدخول', to: '/auth/login' },
  { label: 'إنشاء حساب', to: '/auth/register' },
  { label: 'طلب خدمة', to: '/app' },
];

export default function Footer() {
  const [phone, setPhone] = useState('+201156807072');
  const [email, setEmail] = useState('info@syanaty.com');
  const [address, setAddress] = useState('العدوة، المنيا، مصر');
  const [socialMedia, setSocialMedia] = useState({ facebook: '', twitter: '', instagram: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get('/settings');
        if (res.data.success && res.data.settings) {
          const s = res.data.settings;
          if (s.phone) setPhone(s.phone);
          if (s.supportEmail) setEmail(s.supportEmail);
          if (s.address) setAddress(s.address);
          if (s.socialMedia) setSocialMedia(s.socialMedia);
        }
      } catch (err) {
        console.error('Failed to fetch settings for footer:', err);
      }
    };
    fetchSettings();
  }, []);

  const SOCIAL = [
    { icon: <FaFacebook className="w-4 h-4" />, href: socialMedia.facebook || '#', label: 'Facebook' },
    { icon: <FaTwitter className="w-4 h-4" />, href: socialMedia.twitter || '#', label: 'Twitter' },
    { icon: <FaInstagram className="w-4 h-4" />, href: socialMedia.instagram || '#', label: 'Instagram' },
  ];

  return (
    <footer id="contact" className="bg-[#0B1220] text-slate-400 text-right" dir="rtl">
      {/* Top Bar */}
      <div className="border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#00274C] border border-blue-500/20 rounded-xl flex items-center justify-center shadow-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white leading-tight">صيانتك</p>
              <p className="text-xs text-[#EE5A0E]">sy2antek Platform</p>
            </div>
          </div>
          <p className="text-slate-300 text-sm text-center md:text-right max-w-md leading-relaxed">
            منصة متخصصة في تقديم خدمات صيانة السيارات بطريقة سهلة وسريعة — نربط أصحاب السيارات بأفضل
            الفنيين المحترفين.
          </p>
          <div className="flex gap-2">
            {SOCIAL.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 bg-slate-850 hover:bg-[#EE5A0E] hover:text-white rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Stats */}
          <div className="sm:col-span-2 lg:col-span-1 grid grid-cols-2 gap-4">
            {[
              { value: '+500', label: 'فني معتمد' },
              { value: '+2000', label: 'طلب منجز' },
              { value: '4.9★', label: 'تقييم المستخدمين' },
              { value: '24/7', label: 'خدمة مستمرة' },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="bg-slate-900/40 rounded-2xl p-4 text-center border border-slate-800/40"
              >
                <p className="text-xl font-extrabold text-white">{value}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">
              روابط سريعة
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="flex items-center gap-2 hover:text-[#EE5A0E] transition-colors text-sm group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EE5A0E] group-hover:w-2.5 transition-all" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth Links */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">الحساب</h4>
            <ul className="space-y-3">
              {AUTH_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 hover:text-[#EE5A0E] transition-colors text-sm group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EE5A0E] group-hover:w-2.5 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">
              تواصل معنا
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-start gap-3 hover:text-[#EE5A0E] transition-colors text-sm group"
                >
                  <div className="w-8 h-8 bg-slate-850 group-hover:bg-[#EE5A0E] rounded-lg flex items-center justify-center shrink-0 transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="mt-1.5" dir="ltr">{phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-3 hover:text-[#EE5A0E] transition-colors text-sm group"
                >
                  <div className="w-8 h-8 bg-slate-850 group-hover:bg-[#EE5A0E] rounded-lg flex items-center justify-center shrink-0 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="mt-1.5">{email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 bg-slate-850 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[#EE5A0E]" />
                  </div>
                  <span className="mt-1.5">{address}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-850/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} صيانتك. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-350 transition-colors">
              سياسة الخصوصية
            </a>
            <span>·</span>
            <a href="#" className="hover:text-slate-350 transition-colors">
              الشروط والأحكام
            </a>
            <span>·</span>
            <a href="#" className="hover:text-slate-350 transition-colors">
              الدعم الفني
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
