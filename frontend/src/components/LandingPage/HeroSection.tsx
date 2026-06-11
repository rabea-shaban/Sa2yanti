import { Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white pt-16 pb-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-right">
              <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
                🚗 منصة صيانة السيارات الأولى في المملكة
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                خدمات صيانة السيارات
                <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  بسهولة وسرعة
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                منصة تساعدك في طلب خدمات صيانة السيارات والتواصل مع الفنيين المتخصصين بكل سهولة.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  إنشاء طلب صيانة
                </button>
                <button
                  onClick={() =>
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                >
                  تعرف على الخدمات
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">+500</div>
                  <div className="text-sm text-gray-600">عميل راضٍ</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">+50</div>
                  <div className="text-sm text-gray-600">فني محترف</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">4.9</div>
                  <div className="text-sm text-gray-600">تقييم المستخدمين</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-square bg-gradient-to-br from-blue-100 via-blue-50 to-purple-50 flex items-center justify-center p-12">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Wrench className="w-64 h-64 text-blue-600 opacity-20 absolute" />
                    <div className="relative bg-white rounded-2xl shadow-xl p-8 transform rotate-3">
                      <div className="w-48 h-48 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                        <Wrench className="w-24 h-24 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-200 rounded-full opacity-50 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
