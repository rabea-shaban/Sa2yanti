import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-[#00274C] via-[#001C38] to-[#00274C] text-white text-center border-t border-slate-800/20 relative overflow-hidden" dir="rtl">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">هل تحتاج إلى صيانة فورية لسيارتك؟</h2>
        <p className="text-base md:text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          ابدأ الآن وأنشئ طلبك خلال دقائق معدودة. شبكتنا من الفنيين المحترفين في أتم الجاهزية لخدمتك أينما كنت.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="px-8 py-4 bg-[#EE5A0E] hover:bg-[#D44B07] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5 cursor-pointer"
        >
          إنشاء طلب صيانة جديد
        </button>
      </div>
    </section>
  );
};

export default CTASection;
