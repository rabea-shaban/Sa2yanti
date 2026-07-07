import bcrypt from 'bcryptjs';
import User from '../models/User.model';
import Settings from '../models/Settings.model';
import Category from '../models/Category.model';
import Service from '../models/Service.model';

export const seedSuperAdmin = async (): Promise<void> => {
  try {
    // 1. Seed Super Admin
    const superAdminExists = await User.findOne({ role: 'super_admin' });
    if (!superAdminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await User.create({
        name: 'Super Admin',
        email: 'admin@sa2yanti.com',
        phone: '0000000000',
        password: hashedPassword,
        role: 'super_admin',
      });
      console.log('✔ Super Admin created successfully (admin@sa2yanti.com / Admin@123)');
    } else {
      console.log('✔ Super Admin already exists.');
    }

    // 2. Seed Default Settings
    const settingsExist = await Settings.findOne();
    if (!settingsExist) {
      await Settings.create({
        websiteName: 'Sa2yanti',
        logo: '/logo.png',
        supportEmail: 'support@sa2yanti.com',
        phone: '+962700000000',
        socialMedia: {
          facebook: 'https://facebook.com/sa2yanti',
          twitter: 'https://twitter.com/sa2yanti',
          instagram: 'https://instagram.com/sa2yanti',
        },
        address: 'العدوة، المنيا، مصر',
        maintenanceMode: false,
      });
      console.log('✔ Default site settings initialized.');
    } else {
      console.log('✔ Site settings already initialized.');
    }

    // Clear existing categories and services to prevent duplicates and clean old English entries
    await Service.deleteMany({});
    await Category.deleteMany({});
    console.log('✔ Cleared old categories and services for fresh Arabic seed.');

    // 3. Seed Default Categories in Formal Arabic
    const defaultCategories = [
      { name: 'صيانة المحركات', description: 'خدمات صيانة المحركات وتغيير الزيت والفحص الميكانيكي.' },
      { name: 'نظام الفرامل', description: 'تبديل فحمات الفرامل وصيانة الأقراص وفحص سوائل المكابح.' },
      { name: 'الكهرباء والبطاريات', description: 'فحص وتغيير بطاريات السيارات وصيانة التوصيلات الكهربائية.' },
      { name: 'نظام التعليق والمساعدين', description: 'فحص وتغيير المساعدين وضبط زوايا العجلات ونظام التوجيه.' },
      { name: 'تكييف الهواء', description: 'تعبئة غاز الفريون وصيانة الضاغط وتنظيف الفلاتر.' },
      { name: 'خدمات الطوارئ', description: 'خدمات المساعدة على الطريق، سحب السيارات وتغيير الإطارات.' },
      { name: 'الصيانة العامة', description: 'الفحص الشامل للسيارة وتغيير البواجي وفلاتر الهواء.' },
    ];

    const categoryMap: Record<string, string> = {};

    for (const cat of defaultCategories) {
      let existingCat = await Category.findOne({ name: cat.name });
      if (!existingCat) {
        existingCat = await Category.create(cat);
        console.log(`✔ Category seeded: ${cat.name}`);
      }
      categoryMap[cat.name] = existingCat._id.toString();
    }

    // 4. Seed Default Services in Formal Arabic
    const defaultServices = [
      {
        name: 'تغيير زيت المحرك',
        description: 'استبدال زيت المحرك التخليقي بالكامل مع تغيير فلتر الزيت.',
        price: 450,
        categoryName: 'صيانة المحركات',
      },
      {
        name: 'فحص أعطال المحرك',
        description: 'فحص شامل لأعطال كمبيوتر السيارة وقراءة رموز فحص المحرك.',
        price: 350,
        categoryName: 'صيانة المحركات',
      },
      {
        name: 'تبديل فحمات الفرامل',
        description: 'تركيب فحمات فرامل خزفية (سيراميك) عالية الجودة مع تشحيم الملاقط.',
        price: 600,
        categoryName: 'نظام الفرامل',
      },
      {
        name: 'تغيير بطارية السيارة',
        description: 'فحص واختبار البطارية وتركيب بطارية جديدة مع ضمان لمدة 12 شهراً.',
        price: 2500,
        categoryName: 'الكهرباء والبطاريات',
      },
      {
        name: 'تعبئة غاز فريون المكيف',
        description: 'فحص تسريب غاز المكيف وإعادة تعبئة غاز الفريون الأمريكي الأصلي.',
        price: 600,
        categoryName: 'تكييف الهواء',
      },
      {
        name: 'إصلاح الإطارات على الطريق',
        description: 'إصلاح ثقوب الإطارات في الموقع أو تركيب الإطار الاحتياطي.',
        price: 200,
        categoryName: 'خدمات الطوارئ',
      },
      {
        name: 'استبدال شمعات الاحتراق (البواجي)',
        description: 'تركيب شمعات احتراق جديدة لتحسين استهلاك الوقود وأداء المحرك.',
        price: 500,
        categoryName: 'الصيانة العامة',
      },
    ];

    for (const serv of defaultServices) {
      const categoryId = categoryMap[serv.categoryName];
      if (!categoryId) continue;

      const serviceExists = await Service.findOne({ name: serv.name });
      if (!serviceExists) {
        await Service.create({
          name: serv.name,
          description: serv.description,
          price: serv.price,
          category: categoryId,
          isActive: true,
          image: '',
        });
        console.log(`✔ Service seeded: ${serv.name}`);
      }
    }

    // 5. Migrate and update existing technicians for geospatial query & services
    const services = await Service.find();
    const serviceIds = services.map(s => s._id);

    const techniciansToUpdate = await User.find({ role: 'technician' });
    let updatedCount = 0;
    for (const tech of techniciansToUpdate) {
      let updated = false;
      if (!tech.services || tech.services.length === 0) {
        tech.services = serviceIds;
        updated = true;
      }
      if (!tech.locationGeo || !tech.locationGeo.coordinates || tech.locationGeo.coordinates[0] === 0) {
        if (tech.latitude && tech.longitude) {
          (tech as any).locationGeo = {
            type: 'Point',
            coordinates: [tech.longitude, tech.latitude]
          };
          updated = true;
        }
      }
      if (updated) {
        await tech.save();
        updatedCount++;
      }
    }
    if (updatedCount > 0) {
      console.log(`✔ Migrated ${updatedCount} technicians with GeoJSON coordinates & services list.`);
    }

    // 6. Seed Default Technicians
    const technicianExists = await User.findOne({ role: 'technician' });
    if (!technicianExists) {
      const hashedPassword = await bcrypt.hash('Tech@123', 10);
      const defaultTechs = [
        {
          name: 'أحمد محمد - مركز صيانة النور',
          email: 'ahmed@tech.com',
          phone: '01011111111',
          password: hashedPassword,
          role: 'technician' as const,
          location: 'الشارع: جسر السويس - القرية: عين شمس - المركز: عين شمس - المحافظة: القاهرة',
          latitude: 30.125,
          longitude: 31.332,
          rating: 4.8,
          completedJobs: 120,
          avatar: '',
        },
        {
          name: 'محمود علي - الفني المتميز',
          email: 'mahmoud@tech.com',
          phone: '01022222222',
          password: hashedPassword,
          role: 'technician' as const,
          location: 'الشارع: مكرم عبيد - القرية: المنطقة السادسة - المركز: مدينة نصر - المحافظة: القاهرة',
          latitude: 30.062,
          longitude: 31.345,
          rating: 4.5,
          completedJobs: 85,
          avatar: '',
        },
        {
          name: 'مصطفى محمود - صيانة الأمانة',
          email: 'mostafa@tech.com',
          phone: '01033333333',
          password: hashedPassword,
          role: 'technician' as const,
          location: 'الشارع: الشارع الرئيسي - القرية: القايات - المركز: العدوة - المحافظة: المنيا',
          latitude: 28.625,
          longitude: 30.686,
          rating: 4.9,
          completedJobs: 210,
          avatar: '',
        },
      ];

      for (const t of defaultTechs) {
        await User.create({
          ...t,
          services: serviceIds,
          locationGeo: {
            type: 'Point',
            coordinates: [t.longitude, t.latitude],
          },
        });
        console.log(`✔ Seeded Technician: ${t.name}`);
      }
    }

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
};
