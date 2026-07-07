import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-[#0B1220] via-[#111C30] to-[#0B1220] pt-24 pb-32 text-right"
        dir="rtl"
      >
        {/* Glow decorative gradients in background */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-600 rounded-full opacity-10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-right">
              <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/25 rounded-full text-blue-400 text-xs font-semibold mb-6">
                🚗 منصة صيانة السيارات الأولى بمصر
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                خدمات صيانة السيارات
                <span className="block bg-gradient-to-r from-[#F97316] to-[#EA580C] bg-clip-text text-transparent mt-2">
                  بمنتهى الاحترافية والسهولة
                </span>
              </h1>
              <p className="text-lg text-white text-slate-350 mb-8 leading-relaxed max-w-xl">
                نحن هنا لمساعدتك في طلب خدمات الصيانة الفورية وتوصيلك بأقرب الفنيين والمراكز
                المعتمدة أينما كنت وفي أي وقت.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-start">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  إنشاء طلب صيانة
                </button>
                <button
                  onClick={() =>
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-xl font-bold transition-all shadow-md backdrop-blur-sm transform hover:-translate-y-0.5 cursor-pointer"
                >
                  تعرف على الخدمات
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-slate-800">
                <div>
                  <div className="text-3xl font-extrabold text-blue-500 mb-1">+500</div>
                  <div className="text-xs text-slate-400 font-medium">عميل سعيد</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-orange-500 mb-1">+50</div>
                  <div className="text-xs text-slate-400 font-medium">فني محترف</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-emerald-500 mb-1">4.9</div>
                  <div className="text-xs text-slate-400 font-medium font-bold">تقييم مستمر</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                <img
                  src="/hero_car_maintenance.png"
                  alt="صيانة السيارات"
                  className="w-full h-auto object-cover transform hover:scale-[1.02] transition duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
