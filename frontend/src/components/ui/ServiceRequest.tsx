import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaWrench } from 'react-icons/fa';
import axiosInstance from '../../services/Api';
import LocationPicker from './LocationPicker';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

interface ServiceItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isActive: boolean;
}

type FormValues = {
  service: string;
  location: string;
  latitude: number;
  longitude: number;
};

export default function ServiceRequest() {
  const navigate = useNavigate();
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const selected = watch('service');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const res = await axiosInstance.get('/auth/services');
        if (res.data.success) {
          setServicesList(res.data.services);
        }
      } catch (err) {
        toast.error('فشل في تحميل قائمة الخدمات المتاحة');
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const handleLocationChange = (location: string, lat: number, lng: number) => {
    setValue('location', location, { shouldValidate: true });
    setValue('latitude', lat, { shouldValidate: true });
    setValue('longitude', lng, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await axiosInstance.post('/orders', data);
      toast.success(res.data.message || 'تم إرسال الطلب بنجاح');
      navigate('/orders');
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'حدث خطأ، حاول مرة أخرى');
    }
  };

  return (
    <section className="min-h-screen bg-[#F1F7FF] py-16 px-5" dir="rtl">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-slate-900">صيانة سيارتك بضغطة زر</h1>
        <p className="text-gray-500 mt-4 text-xl">احصل على خدمات الصيانة في أي مكان وأي وقت</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto bg-white rounded-[30px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
      >
        <input type="hidden" {...register('service', { required: 'يرجى اختيار نوع الخدمة' })} />
        <input type="hidden" {...register('location', { required: 'يرجى تحديد الموقع' })} />
        <input type="hidden" {...register('latitude')} />
        <input type="hidden" {...register('longitude')} />

        <label className="block text-right text-lg font-bold text-gray-700 mb-6">اختر نوع الخدمة</label>

        {loadingServices ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : servicesList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">لا توجد خدمات متاحة حالياً.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5 mb-6">
            {servicesList.map((service) => (
              <button
                key={service._id}
                type="button"
                onClick={() => setValue('service', service.name, { shouldValidate: true })}
                className={`border rounded-3xl p-5 min-h-[144px] flex flex-col items-center justify-center gap-3 transition duration-300 cursor-pointer
                  ${selected === service.name ? 'border-blue-500 bg-blue-50/50 shadow-md' : 'border-gray-200'}
                  hover:shadow-md`}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl overflow-hidden shrink-0 bg-blue-600">
                  {service.image ? (
                    <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                  ) : (
                    <FaWrench />
                  )}
                </div>
                <div className="text-center">
                  <span className="font-bold block text-sm text-slate-800">{service.name}</span>
                  <span className="text-xs text-blue-600 font-bold block mt-1">{service.price} ج.م</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {errors.service && (
          <p className="text-red-500 text-sm text-right mb-6">{errors.service.message}</p>
        )}

        <LocationPicker onLocationChange={handleLocationChange} />

        {errors.location && (
          <p className="text-red-500 text-sm text-right mt-2">{errors.location.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || loadingServices || servicesList.length === 0}
          className="w-full h-16 mt-8 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition duration-200 disabled:opacity-50 font-bold text-lg"
        >
          {isSubmitting ? 'جاري الإرسال...' : 'اطلب الخدمة'}
        </button>
      </form>
    </section>
  );
}
