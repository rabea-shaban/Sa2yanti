import { CheckCircle, Clock, Shield, Users } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Clock,
      title: 'سرعة الاستجابة',
      description: 'استجابة سريعة لطلباتك في أقل من 30 دقيقة',
    },
    {
      icon: Users,
      title: 'فنيون متخصصون',
      description: 'فريق من الفنيين المعتمدين وذوي الخبرة العالية',
    },
    {
      icon: CheckCircle,
      title: 'متابعة الطلبات',
      description: 'تتبع حالة طلبك بشكل مباشر وشفاف',
    },
    {
      icon: Shield,
      title: 'سهولة الاستخدام',
      description: 'واجهة بسيطة وسهلة للجميع بدون تعقيد',
    },
  ];
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">لماذا تختار صيانتي؟</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نوفر لك تجربة استثنائية في صيانة سيارتك
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 text-center border border-slate-100 shadow-md transition duration-300 hover:shadow-lg hover:scale-[1.005]"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
