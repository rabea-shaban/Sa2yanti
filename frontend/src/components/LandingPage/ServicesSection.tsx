import { Battery, Gauge, Shield, Wrench, Zap } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: Wrench,
      title: 'صيانة المحرك',
      description: 'فحص وصيانة شاملة للمحرك وجميع أجزائه الداخلية',
      color: 'blue',
    },
    {
      icon: Battery,
      title: 'فحص البطارية',
      description: 'فحص واستبدال البطارية مع ضمان الجودة',
      color: 'orange',
    },
    {
      icon: Gauge,
      title: 'تغيير الزيت',
      description: 'تغيير زيت المحرك باستخدام أفضل الأنواع المناسبة لسيارتك',
      color: 'green',
    },
    {
      icon: Zap,
      title: 'فحص الكهرباء',
      description: 'فحص وإصلاح جميع الأعطال الكهربائية في السيارة',
      color: 'purple',
    },
    {
      icon: Shield,
      title: 'صيانة الإطارات',
      description: 'فحص وتغيير الإطارات مع خدمة الموازنة والترصيص',
      color: 'red',
    },
  ];
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">خدماتنا المتميزة</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نقدم مجموعة شاملة من خدمات الصيانة لجميع أنواع السيارات
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            const colorClasses = {
              blue: 'from-blue-500 to-blue-600',
              orange: 'from-orange-500 to-orange-600',
              green: 'from-green-500 to-green-600',
              purple: 'from-purple-500 to-purple-600',
              red: 'from-red-500 to-red-600',
            };

            return (
              <div
                key={index}
                className="group bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${
                    colorClasses[service.color as keyof typeof colorClasses]
                  } rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
