import { ArrowLeft, CheckCircle, Shield, Wrench } from 'lucide-react';

const WorksSection = () => {
  const howItWorks = [
    {
      step: '1',
      title: 'إنشاء طلب',
      description: 'قم بإدخال تفاصيل المشكلة وإرسال الطلب بسهولة',
      icon: Wrench,
    },
    {
      step: '2',
      title: 'استقبال الطلب',
      description: 'يقوم الفني بمراجعة الطلب وقبوله في دقائق',
      icon: CheckCircle,
    },
    {
      step: '3',
      title: 'تنفيذ الخدمة',
      description: 'متابعة حالة الطلب حتى اكتمال الصيانة بنجاح',
      icon: Shield,
    },
  ];

  return (
    <>
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">كيف يعمل النظام؟</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ثلاث خطوات بسيطة للحصول على خدمة صيانة احترافية لسيارتك
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="relative bg-white rounded-3xl p-8 border border-slate-100 shadow-md transition duration-300 hover:shadow-lg hover:scale-[1.005]"
                >
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.step}
                  </div>

                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{item.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{item.description}</p>

                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -left-4 transform -translate-y-1/2">
                      <ArrowLeft className="w-8 h-8 text-blue-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default WorksSection;
