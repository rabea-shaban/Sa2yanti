import { useForm } from 'react-hook-form';
import { FaBatteryHalf, FaSearch, FaWrench } from 'react-icons/fa';
import axiosInstance from '../../services/Api';
import LocationPicker from './LocationPicker';
import toast from 'react-hot-toast';

type ServiceType = 'تغيير زيت' | 'بطارية' | 'كشف أعطال';

type FormValues = {
  service: ServiceType;
  location: string;
  latitude: number;
  longitude: number;
};

const services = [
  { title: 'تغيير زيت' as ServiceType, icon: <FaWrench />, color: 'bg-blue-500' },
  { title: 'بطارية' as ServiceType, icon: <FaBatteryHalf />, color: 'bg-orange-500' },
  { title: 'كشف أعطال' as ServiceType, icon: <FaSearch />, color: 'bg-purple-500' },
];

export default function ServiceRequest() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const selected = watch('service');

  const handleLocationChange = (location: string, lat: number, lng: number) => {
    setValue('location', location, { shouldValidate: true });
    setValue('latitude', lat, { shouldValidate: true });
    setValue('longitude', lng, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    const res = await axiosInstance.post('orders', data);
    console.log(res);
    toast.success(res.data.message);
  };

  return (
    <section className="min-h-screen bg-[#F1F7FF] py-16 px-5">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-slate-900">صيانة سيارتك بضغطة زر</h1>
        <p className="text-gray-500 mt-4 text-xl">احصل على خدمات الصيانة في أي مكان وأي وقت</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto bg-white rounded-[30px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
      >
        {/* Hidden form fields */}
        <input type="hidden" {...register('service', { required: 'يرجى اختيار نوع الخدمة' })} />
        <input type="hidden" {...register('location', { required: 'يرجى تحديد الموقع' })} />
        <input type="hidden" {...register('latitude')} />
        <input type="hidden" {...register('longitude')} />

        {/* Service selection */}
        <label className="block text-right text-gray-700 mb-6">اختر نوع الخدمة</label>

        <div className="grid md:grid-cols-3 gap-5 mb-4">
          {services.map((service) => (
            <button
              key={service.title}
              type="button"
              onClick={() => setValue('service', service.title, { shouldValidate: true })}
              className={`border rounded-3xl h-36 flex flex-col items-center justify-center gap-3 transition duration-300
                ${selected === service.title ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
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

        {errors.service && (
          <p className="text-red-500 text-sm text-right mb-6">{errors.service.message}</p>
        )}

        {/* Location picker with map */}
        <LocationPicker onLocationChange={handleLocationChange} />

        {errors.location && (
          <p className="text-red-500 text-sm text-right mt-2">{errors.location.message}</p>
        )}

        <button
          type="submit"
          className="w-full h-16 mt-8 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          اطلب الخدمة
        </button>
      </form>

      <div className="text-center mt-10">
        <button type="button" className="text-blue-600 font-medium hover:underline">
          أنا فني - الانتقال إلى لوحة التحكم ←
        </button>
      </div>
    </section>
  );
}
