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
      const hashedPassword = await bcrypt.hash('302060', 10);
      await User.create({
        name: 'Super Admin',
        email: 'rabea@admin',
        phone: '0000000000',
        password: hashedPassword,
        role: 'super_admin',
      });
      console.log('✔ Super Admin created successfully (rabea@admin / 302060)');
    } else {
      console.log('✔ Super Admin already exists.');
    }

    // 2. Seed Default Settings
    const settingsExist = await Settings.findOne();
    if (!settingsExist) {
      await Settings.create({
        websiteName: 'sy2antek',
        logo: '/logo.png',
        supportEmail: 'support@sy2antek.com',
        phone: '+962700000000',
        socialMedia: {
          facebook: 'https://facebook.com/sy2antek',
          twitter: 'https://twitter.com/sy2antek',
          instagram: 'https://instagram.com/sy2antek',
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
    await User.deleteMany({ role: 'technician' });
    console.log('✔ Cleared old technicians for fresh seed.');

    const hashedPassword = await bcrypt.hash('Tech@123', 10);
    const defaultTechs = [
      {
        name: 'أحمد محمد - مركز صيانة النور (عين شمس)',
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
        name: 'المهندس شريف - مركز صيانة هليوبوليس (مصر الجديدة)',
        email: 'sherif@tech.com',
        phone: '01012345678',
        password: hashedPassword,
        role: 'technician' as const,
        location: 'الشارع: شارع الأهرام - القرية: الكوربة - المركز: مصر الجديدة - المحافظة: القاهرة',
        latitude: 30.0905,
        longitude: 31.3228,
        rating: 4.9,
        completedJobs: 180,
        avatar: '',
      },
      {
        name: 'مركز الفهد لصيانة الميكانيكا (المعادي)',
        email: 'fahed@tech.com',
        phone: '01122334455',
        password: hashedPassword,
        role: 'technician' as const,
        location: 'الشارع: شارع 9 - القرية: ثكنات المعادي - المركز: المعادي - المحافظة: القاهرة',
        latitude: 29.9602,
        longitude: 31.2618,
        rating: 4.7,
        completedJobs: 145,
        avatar: '',
      },
      {
        name: 'أبو خطوة - لخدمات التكييف والكهرباء (الزمالك)',
        email: 'abukhotwa@tech.com',
        phone: '01233445566',
        password: hashedPassword,
        role: 'technician' as const,
        location: 'الشارع: شارع 26 يوليو - القرية: الزمالك - المركز: غرب القاهرة - المحافظة: القاهرة',
        latitude: 30.0612,
        longitude: 31.2205,
        rating: 4.6,
        completedJobs: 98,
        avatar: '',
      },
      {
        name: 'المركز الألماني لصيانة السيارات (مدينة نصر)',
        email: 'german@tech.com',
        phone: '01066778899',
        password: hashedPassword,
        role: 'technician' as const,
        location: 'الشارع: شارع عباس العقاد - القرية: المنطقة الأولى - المركز: مدينة نصر - المحافظة: القاهرة',
        latitude: 30.0638,
        longitude: 31.3392,
        rating: 4.8,
        completedJobs: 320,
        avatar: '',
      },
      {
        name: 'الأسطورة لصيانة الإطارات والفرامل (الدقي)',
        email: 'legend@tech.com',
        phone: '01511223344',
        password: hashedPassword,
        role: 'technician' as const,
        location: 'الشارع: شارع التحرير - القرية: الدقي - المركز: الدقي - المحافظة: الجيزة',
        latitude: 30.0384,
        longitude: 31.2114,
        rating: 4.9,
        completedJobs: 250,
        avatar: '',
      },
      {
        name: 'ميكانيكي العاصمة (وسط البلد)',
        email: 'capital@tech.com',
        phone: '01099887766',
        password: hashedPassword,
        role: 'technician' as const,
        location: 'الشارع: شارع طلعت حرب - القرية: وسط البلد - المركز: عابدين - المحافظة: القاهرة',
        latitude: 30.0468,
        longitude: 31.2384,
        rating: 4.5,
        completedJobs: 110,
        avatar: '',
      },
      {
        name: 'مصطفى محمود - صيانة الأمانة (العدوة)',
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

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
};
