import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">هل تحتاج إلى صيانة لسيارتك؟</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          ابدأ الآن وأنشئ طلبك خلال دقائق. فريقنا من الفنيين المحترفين جاهز لخدمتك.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          إنشاء طلب جديد
        </button>
      </div>
    </section>
  );
};

export default CTASection;
