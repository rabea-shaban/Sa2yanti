import { useState } from 'react';
import { FaBatteryHalf, FaMapMarkerAlt, FaSearch, FaWrench } from 'react-icons/fa';

type ServiceType = 'oil' | 'battery' | 'check';

export default function ServiceRequest() {
  const [selected, setSelected] = useState<ServiceType | null>(null);

  const services = [
    {
      id: 'oil',
      title: 'تغيير زيت',
      icon: <FaWrench />,
      color: 'bg-blue-500',
    },

    {
      id: 'battery',
      title: 'بطارية',
      icon: <FaBatteryHalf />,
      color: 'bg-orange-500',
    },

    {
      id: 'check',
      title: 'كشف أعطال',
      icon: <FaSearch />,
      color: 'bg-purple-500',
    },
  ];

  return (
    <section className="min-h-screen bg-[#F1F7FF] py-16 px-5">
      {/* title */}

      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-slate-900">صيانة سيارتك بضغطة زر</h1>

        <p className="text-gray-500 mt-4 text-xl">احصل على خدمات الصيانة في أي مكان وأي وقت</p>
      </div>

      {/* card */}

      <div className="max-w-4xl mx-auto bg-white rounded-[30px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <label className="block text-right text-gray-700 mb-6">اختر نوع الخدمة</label>

        {/* services */}

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelected(service.id as ServiceType)}
              className={`border rounded-3xl h-36 flex flex-col items-center justify-center gap-3 transition duration-300

                ${selected === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}

                hover:shadow-md`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl ${service.color}`}
              >
                {service.icon}
              </div>

              <span className="font-medium">{service.title}</span>
            </button>
          ))}
        </div>

        {/* location */}

        <label className="block text-right text-gray-700 mb-3">أدخل موقعك</label>

        <div className="relative">
          <input
            dir="rtl"
            placeholder="مثال: المنيا -- العدوه "
            className="w-full h-16 rounded-2xl border border-gray-200 px-6 pr-14 outline-none"
          />

          <FaMapMarkerAlt className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* button */}

        <button
          disabled={!selected}
          className="w-full h-16 mt-8 rounded-2xl bg-gray-200 disabled:opacity-100 enabled:bg-blue-600 enabled:text-white transition"
        >
          اطلب الخدمة
        </button>
      </div>

      <div className="text-center mt-10">
        <button className="text-blue-600 font-medium hover:underline">
          أنا فني - الانتقال إلى لوحة التحكم ←
        </button>
      </div>
    </section>
  );
}
