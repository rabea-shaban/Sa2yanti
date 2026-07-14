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

    // 4. Seed 20 Default Services in Formal Arabic
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
        name: 'تغيير سير المجموعه والكاتينة',
        description: 'استبدال سير المجموعة التالف وسير الكاتينة لتجنب تعطل الصمامات.',
        price: 900,
        categoryName: 'صيانة المحركات',
      },
      {
        name: 'تبديل فحمات الفرامل الأمامية',
        description: 'تركيب فحمات فرامل خزفية (سيراميك) عالية الجودة مع تشحيم الملاقط.',
        price: 600,
        categoryName: 'نظام الفرامل',
      },
      {
        name: 'خرط هوبات الفرامل',
        description: 'تسوية أقراص الفرامل (الهوبات) بالخرط لإزالة التموجات والاهتزازات.',
        price: 400,
        categoryName: 'نظام الفرامل',
      },
      {
        name: 'فحص وتغيير سائل الفرامل',
        description: 'تنظيف وتغيير زيت الفرامل بالكامل بنظام سحب الهواء وضبط الضغط.',
        price: 250,
        categoryName: 'نظام الفرامل',
      },
      {
        name: 'تغيير فحمات الفرامل الخلفية',
        description: 'استبدال وتركيب فحمات الفرامل الخلفية وضبط الهاند بريك.',
        price: 550,
        categoryName: 'نظام الفرامل',
      },
      {
        name: 'تغيير بطارية السيارة',
        description: 'فحص واختبار البطارية وتركيب بطارية جديدة مع ضمان لمدة 12 شهراً.',
        price: 2500,
        categoryName: 'الكهرباء والبطاريات',
      },
      {
        name: 'كشف وفحص ضفيرة الكهرباء',
        description: 'فحص وتحديد نقاط التماس الكهربائي وإصلاح التوصيلات والفيوزات.',
        price: 500,
        categoryName: 'الكهرباء والبطاريات',
      },
      {
        name: 'إصلاح دينامو السيارة',
        description: 'فحص كفاءة الشحن وتغيير كتاوت وفحمات الدينامو وإعادة تأهيله.',
        price: 800,
        categoryName: 'الكهرباء والبطاريات',
      },
      {
        name: 'تغيير مساعدين خلفيين',
        description: 'فك وتركيب زوج المساعدين الخلفيين لضمان توازن السيارة أثناء القيادة.',
        price: 1200,
        categoryName: 'نظام التعليق والمساعدين',
      },
      {
        name: 'ضبط زوايا العجلات والاتزان',
        description: 'وزن وضبط زوايا السيارة بالكمبيوتر لضمان القيادة المستقيمة وعدم تآكل الإطارات.',
        price: 350,
        categoryName: 'نظام التعليق والمساعدين',
      },
      {
        name: 'تعبئة غاز فريون المكيف',
        description: 'فحص تسريب غاز المكيف وإعادة تعبئة غاز الفريون الأمريكي الأصلي.',
        price: 600,
        categoryName: 'تكييف الهواء',
      },
      {
        name: 'غسيل وتطهير دورة المكيف',
        description: 'تنظيف ثلاجة المكيف وإزالة الأتربة والروائح الكريهة من مجاري الهواء.',
        price: 450,
        categoryName: 'تكييف الهواء',
      },
      {
        name: 'كشف تسريب المكيف بالنيتروجين',
        description: 'ضغط دورة التبريد بغاز النيتروجين الجاف لتحديد مكان التسريب بدقة.',
        price: 300,
        categoryName: 'تكييف الهواء',
      },
      {
        name: 'إصلاح الإطارات على الطريق',
        description: 'إصلاح ثقوب الإطارات في الموقع أو تركيب الإطار الاحتياطي.',
        price: 200,
        categoryName: 'خدمات الطوارئ',
      },
      {
        name: 'إنقاذ سيارة (سحب ونش)',
        description: 'خدمة سحب ونقل المركبات المعطلة عبر ونش مسطح لأقرب ورشة صيانة.',
        price: 700,
        categoryName: 'خدمات الطوارئ',
      },
      {
        name: 'اشتراك وتوصيل البطارية',
        description: 'توفير مصدر كهربائي لشحن وتشغيل السيارة المعطلة بسبب البطارية في الموقع.',
        price: 150,
        categoryName: 'خدمات الطوارئ',
      },
      {
        name: 'استبدال شمعات الاحتراق (البواجي)',
        description: 'تركيب شمعات احتراق جديدة لتحسين استهلاك الوقود وأداء المحرك.',
        price: 500,
        categoryName: 'الصيانة العامة',
      },
      {
        name: 'تنظيف البوابة وتغيير فلتر الهواء',
        description: 'تنظيف بوابة الهواء (الثروتل) وتغيير فلتر هواء المحرك لزيادة العزم.',
        price: 300,
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

    const services = await Service.find();
    const serviceIds = services.map(s => s._id);

    // 5. Seed 20 Default Technicians
    await User.deleteMany({ role: 'technician' });
    console.log('✔ Cleared old technicians for fresh seed.');

    const techPassword = await bcrypt.hash('Tech@123', 10);
    const techNames = [
      'أحمد محمد - مركز صيانة النور',
      'المهندس شريف - مركز صيانة هليوبوليس',
      'مركز الفهد لصيانة الميكانيكا',
      'أبو خطوة - لخدمات التكييف والكهرباء',
      'المركز الألماني لصيانة السيارات',
      'الأسطورة لصيانة الإطارات والفرامل',
      'ميكانيكي العاصمة - وسط البلد',
      'مصطفى محمود - صيانة الأمانة',
      'ورشة السلام للميكانيكا الحديثة',
      'المركز الفرنسي لصيانة السيارات',
      'المهندس كريم - صيانة السمعة الطيبة',
      'مركز النجمة لصيانة السيارات الألماني',
      'ورشة الهدى لكهرباء السيارات',
      'المركز الياباني لصيانة السيارات الاسيوية',
      'المهندس حسن - متخصص فرامل ومساعدين',
      'مركز باور لصيانة التوجيه والهيدروليك',
      'الورشة السريعة لصيانة الإطارات',
      'مركز الحرية لصيانة المكيفات',
      'ورشة الفرسان للميكانيكا العامة',
      'المهندس هاني - كشف أعطال بالكمبيوتر'
    ];

    const techLocations = [
      { name: 'الشارع: جسر السويس - القرية: عين شمس - المركز: عين شمس - المحافظة: القاهرة', lat: 30.125, lng: 31.332 },
      { name: 'الشارع: شارع الأهرام - القرية: الكوربة - المركز: مصر الجديدة - المحافظة: القاهرة', lat: 30.0905, lng: 31.3228 },
      { name: 'الشارع: شارع 9 - القرية: ثكنات المعادي - المركز: المعادي - المحافظة: القاهرة', lat: 29.9602, lng: 31.2618 },
      { name: 'الشارع: شارع 26 يوليو - القرية: الزمالك - المركز: غرب القاهرة - المحافظة: القاهرة', lat: 30.0612, lng: 31.2205 },
      { name: 'الشارع: شارع عباس العقاد - القرية: المنطقة الأولى - المركز: مدينة نصر - المحافظة: القاهرة', lat: 30.0638, lng: 31.3392 },
      { name: 'الشارع: شارع التحرير - القرية: الدقي - المركز: الدقي - المحافظة: الجيزة', lat: 30.0384, lng: 31.2114 },
      { name: 'الشارع: شارع طلعت حرب - القرية: وسط البلد - المركز: عابدين - المحافظة: القاهرة', lat: 30.0468, lng: 31.2384 },
      { name: 'الشارع: الشارع الرئيسي - القرية: القايات - المركز: العدوة - المحافظة: المنيا', lat: 28.625, lng: 30.686 },
      { name: 'الشارع: شارع التسعين - القرية: التجمع الخامس - المركز: القاهرة الجديدة - المحافظة: القاهرة', lat: 30.0274, lng: 31.4913 },
      { name: 'الشارع: شارع البطل أحمد عبد العزيز - القرية: المهندسين - المركز: الجيزة - المحافظة: الجيزة', lat: 30.0534, lng: 31.2038 },
      { name: 'الشارع: شارع شبرا - القرية: روض الفرج - المركز: شبرا - المحافظة: القاهرة', lat: 30.0782, lng: 31.2465 },
      { name: 'الشارع: شارع أحمد سعيد - القرية: العباسية - المركز: الوايلي - المحافظة: القاهرة', lat: 30.0694, lng: 31.2721 },
      { name: 'الشارع: شارع الروضة - القرية: المنيل - المركز: مصر القديمة - المحافظة: القاهرة', lat: 30.0182, lng: 31.2248 },
      { name: 'الشارع: شارع قصر العيني - القرية: جاردن سيتي - المركز: غرب القاهرة - المحافظة: القاهرة', lat: 30.0351, lng: 31.2335 },
      { name: 'الشارع: شارع سليم الأول - القرية: الزيتون - المركز: الزيتون - المحافظة: القاهرة', lat: 30.1035, lng: 31.3112 },
      { name: 'الشارع: شارع مؤسسة الزكاة - القرية: المرج - المركز: المرج - المحافظة: القاهرة', lat: 30.1558, lng: 31.3364 },
      { name: 'الشارع: شارع مصطفى كامل - القرية: المعصرة - المركز: حلوان - المحافظة: القاهرة', lat: 29.8974, lng: 31.2985 },
      { name: 'الشارع: شارع 9 الرئيسي - القرية: المقطم - المركز: الخليفة - المحافظة: القاهرة', lat: 30.0163, lng: 31.2994 },
      { name: 'الشارع: طريق مصر إسماعيلية الصحراوي - القرية: العبور - المركز: العبور - المحافظة: القليوبية', lat: 30.2185, lng: 31.4721 },
      { name: 'الشارع: طريق السادات - القرية: الشروق - المركز: الشروق - المحافظة: القاهرة', lat: 30.1448, lng: 31.6247 }
    ];

    for (let i = 0; i < 20; i++) {
      const email = `tech${i + 1}@tech.com`;
      const phone = `010${String(i + 1).padStart(8, '0')}`;
      const loc = techLocations[i];
      await User.create({
        name: techNames[i],
        email,
        phone,
        password: techPassword,
        role: 'technician',
        location: loc.name,
        latitude: loc.lat,
        longitude: loc.lng,
        rating: +(4.0 + Math.random() * 1.0).toFixed(1),
        completedJobs: Math.floor(20 + Math.random() * 300),
        avatar: '',
        services: serviceIds,
        locationGeo: {
          type: 'Point',
          coordinates: [loc.lng, loc.lat],
        },
      });
      console.log(`✔ Seeded Technician: ${techNames[i]}`);
    }

    // 6. Seed 20 Default Customers (Users)
    await User.deleteMany({ role: 'user' });
    console.log('✔ Cleared old customers for fresh seed.');

    const userPassword = await bcrypt.hash('User@123', 10);
    const userNames = [
      'علي أحمد العميل',
      'محمد عمر الخطيب',
      'فاطمة عبد الرحمن',
      'sara سارة محمود الجزار',
      'خالد يوسف الشريف',
      'عمرو مصطفى حسن',
      'إبراهيم عبد الله سليمان',
      'منى علي توفيق',
      'مريم أحمد عبد الحفيظ',
      'ياسر هشام الديب',
      'طارق سليم الملاح',
      'رنا محمود فوزي',
      'نورهان أحمد سعيد',
      'حسام جمال الدين',
      'مصطفى كمال البحيري',
      'دينا رامي منصور',
      'شريف منير عبد السلام',
      'وائل صبري رضوان',
      'أشرف عبد العزيز شاهين',
      'هالة جلال غانم'
    ];

    const userLocations = [
      { name: 'مصر الجديدة، القاهرة', lat: 30.1000, lng: 31.3300 },
      { name: 'مدينة نصر، القاهرة', lat: 30.0560, lng: 31.3500 },
      { name: 'المعادي، القاهرة', lat: 29.9650, lng: 31.2580 },
      { name: 'الزمالك، القاهرة', lat: 30.0630, lng: 31.2180 },
      { name: 'الدقي، الجيزة', lat: 30.0400, lng: 31.2120 },
      { name: 'المهندسين، الجيزة', lat: 30.0510, lng: 31.2010 },
      { name: 'وسط البلد، القاهرة', lat: 30.0450, lng: 31.2400 },
      { name: 'التجمع الخامس، القاهرة الجديدة', lat: 30.0250, lng: 31.4850 },
      { name: 'شبرا، القاهرة', lat: 30.0800, lng: 31.2450 },
      { name: 'العباسية، القاهرة', lat: 30.0650, lng: 31.2750 },
      { name: 'روض الفرج، شبرا', lat: 30.0750, lng: 31.2380 },
      { name: 'حدائق القبة، القاهرة', lat: 30.0900, lng: 31.2950 },
      { name: 'عين شمس، القاهرة', lat: 30.1300, lng: 31.3200 },
      { name: 'الزيتون، القاهرة', lat: 30.1050, lng: 31.3100 },
      { name: 'حلوان، القاهرة', lat: 29.8500, lng: 31.3300 },
      { name: 'المقطم، القاهرة', lat: 30.0200, lng: 31.3000 },
      { name: 'العبور، القليوبية', lat: 30.2200, lng: 31.4800 },
      { name: 'الشروق، القاهرة', lat: 30.1500, lng: 31.6300 },
      { name: 'الرحاب، القاهرة الجديدة', lat: 30.0700, lng: 31.4900 },
      { name: 'مدينتي، القاهرة الجديدة', lat: 30.0900, lng: 31.6500 }
    ];

    for (let i = 0; i < 20; i++) {
      const email = `user${i + 1}@user.com`;
      const phone = `012${String(i + 1).padStart(8, '0')}`;
      const loc = userLocations[i];
      await User.create({
        name: userNames[i],
        email,
        phone,
        password: userPassword,
        role: 'user',
        location: loc.name,
        latitude: loc.lat,
        longitude: loc.lng,
        locationGeo: {
          type: 'Point',
          coordinates: [loc.lng, loc.lat]
        }
      });
      console.log(`✔ Seeded Customer: ${userNames[i]}`);
    }

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
};
