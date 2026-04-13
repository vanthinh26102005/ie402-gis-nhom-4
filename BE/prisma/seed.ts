import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.service.deleteMany();
  await prisma.place.deleteMany();
  await prisma.road.deleteMany();
  await prisma.province.deleteMany();

  // Provinces with simplified polygon geometries
  const provinces = await Promise.all([
    prisma.province.create({
      data: {
        name: 'Thành phố Hồ Chí Minh',
        nameEn: 'Ho Chi Minh City',
        geometry: {
          type: 'Polygon',
          coordinates: [[[106.55, 10.65], [106.55, 10.90], [106.85, 10.90], [106.85, 10.65], [106.55, 10.65]]],
        },
      },
    }),
    prisma.province.create({
      data: {
        name: 'Thành phố Hà Nội',
        nameEn: 'Hanoi',
        geometry: {
          type: 'Polygon',
          coordinates: [[[105.70, 20.90], [105.70, 21.15], [105.95, 21.15], [105.95, 20.90], [105.70, 20.90]]],
        },
      },
    }),
    prisma.province.create({
      data: {
        name: 'Thành phố Đà Nẵng',
        nameEn: 'Da Nang',
        geometry: {
          type: 'Polygon',
          coordinates: [[[108.10, 15.95], [108.10, 16.15], [108.35, 16.15], [108.35, 15.95], [108.10, 15.95]]],
        },
      },
    }),
    prisma.province.create({
      data: {
        name: 'Tỉnh Khánh Hòa',
        nameEn: 'Khanh Hoa',
        geometry: {
          type: 'Polygon',
          coordinates: [[[108.80, 11.80], [108.80, 12.50], [109.30, 12.50], [109.30, 11.80], [108.80, 11.80]]],
        },
      },
    }),
    prisma.province.create({
      data: {
        name: 'Tỉnh Lâm Đồng',
        nameEn: 'Lam Dong',
        geometry: {
          type: 'Polygon',
          coordinates: [[[108.20, 11.60], [108.20, 12.10], [108.80, 12.10], [108.80, 11.60], [108.20, 11.60]]],
        },
      },
    }),
    prisma.province.create({
      data: {
        name: 'Tỉnh Quảng Ninh',
        nameEn: 'Quang Ninh',
        geometry: {
          type: 'Polygon',
          coordinates: [[[106.80, 20.70], [106.80, 21.50], [108.10, 21.50], [108.10, 20.70], [106.80, 20.70]]],
        },
      },
    }),
    prisma.province.create({
      data: {
        name: 'Tỉnh Thừa Thiên Huế',
        nameEn: 'Thua Thien Hue',
        geometry: {
          type: 'Polygon',
          coordinates: [[[107.30, 16.10], [107.30, 16.60], [107.90, 16.60], [107.90, 16.10], [107.30, 16.10]]],
        },
      },
    }),
    prisma.province.create({
      data: {
        name: 'Tỉnh Quảng Nam',
        nameEn: 'Quang Nam',
        geometry: {
          type: 'Polygon',
          coordinates: [[[107.80, 15.30], [107.80, 16.00], [108.60, 16.00], [108.60, 15.30], [107.80, 15.30]]],
        },
      },
    }),
  ]);

  const [hcm, hanoi, danang, khanhhoa, lamdong, quangninh, hue, quangnam] = provinces;

  // Places - Tourist destinations
  const placesData = [
    // Ho Chi Minh City
    { name: 'Bến Thành Market', category: 'market', description: 'Iconic central market famous for local food, souvenirs, and textiles. A must-visit landmark in HCMC.', rating: 4.3, featured: true, longitude: 106.6980, latitude: 10.7725, address: 'Lê Lợi, Bến Thành, Quận 1', provinceId: hcm.id },
    { name: 'Independence Palace', category: 'landmark', description: 'Historical presidential palace, site of the end of the Vietnam War. Beautiful architecture and grounds.', rating: 4.5, featured: true, longitude: 106.6953, latitude: 10.7769, address: '135 Nam Kỳ Khởi Nghĩa, Quận 1', provinceId: hcm.id },
    { name: 'Notre-Dame Cathedral Basilica', category: 'landmark', description: 'Neo-Romanesque cathedral built in the late 1800s, an iconic HCMC landmark.', rating: 4.4, featured: true, longitude: 106.6990, latitude: 10.7798, address: '01 Công xã Paris, Quận 1', provinceId: hcm.id },
    { name: 'War Remnants Museum', category: 'museum', description: 'Museum showcasing Vietnam War history with artifacts and photographs.', rating: 4.6, featured: true, longitude: 106.6919, latitude: 10.7795, address: '28 Võ Văn Tần, Quận 3', provinceId: hcm.id },
    { name: 'Jade Emperor Pagoda', category: 'pagoda', description: 'Atmospheric Taoist temple filled with smoky incense and intricate carvings.', rating: 4.4, featured: false, longitude: 106.6907, latitude: 10.7891, address: '73 Mai Thị Lựu, Quận 1', provinceId: hcm.id },
    { name: 'Bình Tây Market', category: 'market', description: 'Largest market in Cholon, the Chinese district of HCMC.', rating: 4.1, featured: false, longitude: 106.6480, latitude: 10.7483, address: '57A Thạnh Phú, Quận 6', provinceId: hcm.id },
    { name: 'Saigon Central Post Office', category: 'landmark', description: 'French colonial-era post office designed by Gustave Eiffel.', rating: 4.3, featured: false, longitude: 106.6997, latitude: 10.7800, address: '02 Công xã Paris, Quận 1', provinceId: hcm.id },
    { name: 'Thảo Cầm Viên', category: 'park', description: 'Historic zoo and botanical garden in the heart of Saigon.', rating: 4.0, featured: false, longitude: 106.7058, latitude: 10.7876, address: '2 Nguyễn Bỉnh Khiêm, Quận 1', provinceId: hcm.id },

    // Hanoi
    { name: 'Hoan Kiem Lake', category: 'nature', description: 'Scenic lake in the heart of Hanoi with the iconic Turtle Tower.', rating: 4.7, featured: true, longitude: 105.8524, latitude: 21.0288, address: 'Hàng Trống, Hoàn Kiếm', provinceId: hanoi.id },
    { name: 'Temple of Literature', category: 'temple', description: 'Vietnam\'s first national university, dating back to 1070.', rating: 4.6, featured: true, longitude: 105.8355, latitude: 21.0274, address: '58 Quốc Tử Giám, Đống Đa', provinceId: hanoi.id },
    { name: 'Ho Chi Minh Mausoleum', category: 'landmark', description: 'Resting place of Ho Chi Minh, the founding father of modern Vietnam.', rating: 4.5, featured: true, longitude: 105.8345, latitude: 21.0369, address: '2 Hùng Vương, Ba Đình', provinceId: hanoi.id },
    { name: 'Old Quarter', category: 'landmark', description: 'Historic commercial district with 36 ancient streets, each named after the goods once sold there.', rating: 4.5, featured: true, longitude: 105.8520, latitude: 21.0340, address: 'Hoàn Kiếm', provinceId: hanoi.id },
    { name: 'One Pillar Pagoda', category: 'pagoda', description: 'Historic Buddhist temple built in 1049 on a single stone pillar.', rating: 4.3, featured: false, longitude: 105.8339, latitude: 21.0359, address: 'Chùa Một Cột, Ba Đình', provinceId: hanoi.id },
    { name: 'Tràng Tiền Ice Cream', category: 'landmark', description: 'Legendary ice cream shop operating since 1958, a Hanoi institution.', rating: 4.2, featured: false, longitude: 105.8540, latitude: 21.0249, address: '35 Tràng Tiền, Hoàn Kiếm', provinceId: hanoi.id },
    { name: 'West Lake', category: 'nature', description: 'Largest lake in Hanoi surrounded by temples, pagodas and gardens.', rating: 4.4, featured: false, longitude: 105.8220, latitude: 21.0550, address: 'Tây Hồ', provinceId: hanoi.id },

    // Da Nang
    { name: 'Dragon Bridge', category: 'landmark', description: 'Iconic bridge shaped like a dragon that breathes fire on weekends.', rating: 4.5, featured: true, longitude: 108.2280, latitude: 16.0611, address: 'Nguyễn Văn Linh, Hải Châu', provinceId: danang.id },
    { name: 'My Khe Beach', category: 'beach', description: 'One of the most beautiful beaches in the world, famous for soft white sand.', rating: 4.7, featured: true, longitude: 108.2480, latitude: 16.0550, address: 'Phước Mỹ, Sơn Trà', provinceId: danang.id },
    { name: 'Marble Mountains', category: 'nature', description: 'Five marble and limestone hills with caves, tunnels and Buddhist temples.', rating: 4.4, featured: true, longitude: 108.2630, latitude: 16.0040, address: 'Hòa Hải, Ngũ Hành Sơn', provinceId: danang.id },
    { name: 'Bà Nà Hills', category: 'nature', description: 'Mountain resort featuring the famous Golden Bridge held by giant stone hands.', rating: 4.6, featured: true, longitude: 107.9957, latitude: 15.9977, address: 'Hòa Ninh, Hòa Vang', provinceId: danang.id },
    { name: 'Museum of Cham Sculpture', category: 'museum', description: 'World\'s largest collection of Cham artifacts and sculptures.', rating: 4.3, featured: false, longitude: 108.2235, latitude: 16.0600, address: '02 Trần Phú, Hải Châu', provinceId: danang.id },
    { name: 'Han Market', category: 'market', description: 'Central market in Da Nang famous for local specialties and souvenirs.', rating: 4.1, featured: false, longitude: 108.2240, latitude: 16.0680, address: '119 Trần Phú, Hải Châu', provinceId: danang.id },

    // Khanh Hoa (Nha Trang)
    { name: 'Nha Trang Beach', category: 'beach', description: 'Beautiful 6km crescent-shaped beach with crystal clear water.', rating: 4.6, featured: true, longitude: 109.1960, latitude: 12.2460, address: 'Trần Phú, Nha Trang', provinceId: khanhhoa.id },
    { name: 'Ponagar Cham Towers', category: 'temple', description: 'Ancient Cham temple complex dating back to the 7th century.', rating: 4.4, featured: true, longitude: 109.1960, latitude: 12.2655, address: '2 Tháng 4, Vĩnh Phước', provinceId: khanhhoa.id },
    { name: 'Vinpearl Land', category: 'park', description: 'Island resort and amusement park with water slides, aquarium and shows.', rating: 4.5, featured: true, longitude: 109.2285, latitude: 12.2220, address: 'Hòn Tre, Vĩnh Nguyên', provinceId: khanhhoa.id },
    { name: 'Long Son Pagoda', category: 'pagoda', description: 'Buddhist temple famous for its giant white Buddha statue atop a hill.', rating: 4.2, featured: false, longitude: 109.1835, latitude: 12.2495, address: '20 Đường 23/10, Phương Sơn', provinceId: khanhhoa.id },

    // Lam Dong (Da Lat)
    { name: 'Xuan Huong Lake', category: 'nature', description: 'Crescent-shaped artificial lake in the heart of Da Lat.', rating: 4.5, featured: true, longitude: 108.4413, latitude: 11.9430, address: 'Phường 1, Đà Lạt', provinceId: lamdong.id },
    { name: 'Crazy House', category: 'landmark', description: 'Unique expressionist architecture resembling a giant banyan tree.', rating: 4.3, featured: true, longitude: 108.4558, latitude: 11.9368, address: '3 Huỳnh Thúc Kháng, Phường 4', provinceId: lamdong.id },
    { name: 'Dalat Flower Gardens', category: 'park', description: 'Botanical garden with hundreds of flower species and topiary displays.', rating: 4.2, featured: false, longitude: 108.4370, latitude: 11.9470, address: '2 Phù Đổng Thiên Vương, Phường 8', provinceId: lamdong.id },
    { name: 'Valley of Love', category: 'nature', description: 'Scenic valley with lakes, flower gardens and paddle boats.', rating: 4.0, featured: false, longitude: 108.4355, latitude: 11.9655, address: '7 Mai Anh Đào, Phường 8', provinceId: lamdong.id },
    { name: 'Linh Phuoc Pagoda', category: 'pagoda', description: 'Mosaic pagoda decorated with broken glass and ceramics, features tallest bell tower in Vietnam.', rating: 4.4, featured: false, longitude: 108.4635, latitude: 11.9120, address: '120 Tự Phước, Trại Mát', provinceId: lamdong.id },

    // Quang Ninh (Ha Long)
    { name: 'Ha Long Bay', category: 'nature', description: 'UNESCO World Heritage Site with thousands of limestone karst islands.', rating: 4.9, featured: true, longitude: 107.0480, latitude: 20.9101, address: 'Vịnh Hạ Long', provinceId: quangninh.id },
    { name: 'Sung Sot Cave', category: 'nature', description: 'The largest and most beautiful cave in Ha Long Bay.', rating: 4.5, featured: true, longitude: 107.0960, latitude: 20.8925, address: 'Đảo Bồ Hòn, Hạ Long', provinceId: quangninh.id },
    { name: 'Ti Top Island', category: 'beach', description: 'Island with a beautiful beach and panoramic viewpoint of Ha Long Bay.', rating: 4.3, featured: false, longitude: 107.0720, latitude: 20.9200, address: 'Đảo Ti Tốp, Hạ Long', provinceId: quangninh.id },

    // Hue
    { name: 'Imperial Citadel', category: 'landmark', description: 'Massive fortress and palace complex, UNESCO World Heritage Site.', rating: 4.7, featured: true, longitude: 107.5778, latitude: 16.4698, address: 'Thuận Thành, TP Huế', provinceId: hue.id },
    { name: 'Thien Mu Pagoda', category: 'pagoda', description: 'Iconic seven-story pagoda overlooking the Perfume River.', rating: 4.5, featured: true, longitude: 107.5450, latitude: 16.4538, address: 'Hương Hòa, TP Huế', provinceId: hue.id },
    { name: 'Khai Dinh Tomb', category: 'landmark', description: 'Elaborate royal tomb blending Vietnamese and European architecture.', rating: 4.4, featured: false, longitude: 107.5868, latitude: 16.3917, address: 'Thủy Bằng, Hương Thủy', provinceId: hue.id },
    { name: 'Dong Ba Market', category: 'market', description: 'Largest market in Hue, famous for Hue cuisine and conical hats.', rating: 4.1, featured: false, longitude: 107.5916, latitude: 16.4720, address: 'Trần Hưng Đạo, TP Huế', provinceId: hue.id },

    // Quang Nam (Hoi An)
    { name: 'Hoi An Ancient Town', category: 'landmark', description: 'UNESCO World Heritage Site, a beautifully preserved ancient trading port.', rating: 4.8, featured: true, longitude: 108.3380, latitude: 15.8801, address: 'Minh An, Hội An', provinceId: quangnam.id },
    { name: 'Japanese Covered Bridge', category: 'landmark', description: 'Iconic 18th century covered bridge, symbol of Hoi An.', rating: 4.5, featured: true, longitude: 108.3270, latitude: 15.8780, address: 'Nguyễn Thị Minh Khai, Hội An', provinceId: quangnam.id },
    { name: 'My Son Sanctuary', category: 'temple', description: 'Ancient Hindu temple complex, Cham civilization ruins, UNESCO World Heritage.', rating: 4.4, featured: true, longitude: 108.1280, latitude: 15.7640, address: 'Duy Phú, Duy Xuyên', provinceId: quangnam.id },
    { name: 'An Bang Beach', category: 'beach', description: 'Beautiful beach near Hoi An with beachfront restaurants and bars.', rating: 4.3, featured: false, longitude: 108.3800, latitude: 15.8950, address: 'An Bàng, Hội An', provinceId: quangnam.id },
    { name: 'Cua Dai Beach', category: 'beach', description: 'Popular beach with golden sand near Hoi An Ancient Town.', rating: 4.2, featured: false, longitude: 108.3780, latitude: 15.8780, address: 'Cửa Đại, Hội An', provinceId: quangnam.id },
  ];

  await prisma.place.createMany({ data: placesData });
  console.log(`✅ Created ${placesData.length} places`);

  // Roads
  const roadsData = [
    {
      name: 'Quốc lộ 1A - Đoạn HCMC',
      type: 'highway',
      geometry: { type: 'LineString', coordinates: [[106.63, 10.82], [106.66, 10.80], [106.70, 10.78], [106.73, 10.77], [106.76, 10.76]] },
    },
    {
      name: 'Đại lộ Nguyễn Huệ',
      type: 'primary',
      geometry: { type: 'LineString', coordinates: [[106.7009, 10.7741], [106.7009, 10.7770], [106.7009, 10.7800]] },
    },
    {
      name: 'Đường Trần Phú - Nha Trang',
      type: 'primary',
      geometry: { type: 'LineString', coordinates: [[109.1880, 12.2280], [109.1920, 12.2380], [109.1950, 12.2480], [109.1960, 12.2580]] },
    },
    {
      name: 'Quốc lộ 1A - Đoạn Đà Nẵng',
      type: 'highway',
      geometry: { type: 'LineString', coordinates: [[108.15, 16.08], [108.18, 16.07], [108.21, 16.06], [108.24, 16.05]] },
    },
    {
      name: 'Đường Bạch Đằng - Đà Nẵng',
      type: 'primary',
      geometry: { type: 'LineString', coordinates: [[108.2200, 16.0550], [108.2230, 16.0580], [108.2260, 16.0610], [108.2290, 16.0640]] },
    },
    {
      name: 'Đường Trần Hưng Đạo - Hội An',
      type: 'secondary',
      geometry: { type: 'LineString', coordinates: [[108.3200, 15.8780], [108.3250, 15.8790], [108.3300, 15.8800], [108.3350, 15.8810]] },
    },
    {
      name: 'Quốc lộ 51 - Vũng Tàu',
      type: 'highway',
      geometry: { type: 'LineString', coordinates: [[106.83, 10.75], [106.90, 10.65], [106.95, 10.55], [107.00, 10.45], [107.05, 10.38]] },
    },
    {
      name: 'Đường Phạm Văn Đồng - Hà Nội',
      type: 'primary',
      geometry: { type: 'LineString', coordinates: [[105.7900, 21.0450], [105.8000, 21.0400], [105.8100, 21.0350], [105.8200, 21.0300]] },
    },
    {
      name: 'Đường Lê Duẩn - Huế',
      type: 'primary',
      geometry: { type: 'LineString', coordinates: [[107.5850, 16.4600], [107.5820, 16.4650], [107.5790, 16.4700], [107.5760, 16.4730]] },
    },
    {
      name: 'Quốc lộ 20 - Đà Lạt',
      type: 'highway',
      geometry: { type: 'LineString', coordinates: [[108.35, 11.80], [108.38, 11.83], [108.41, 11.87], [108.43, 11.90], [108.44, 11.94]] },
    },
  ];

  await prisma.road.createMany({ data: roadsData });
  console.log(`✅ Created ${roadsData.length} roads`);

  // Services
  const servicesData = [
    // HCMC Hotels
    { name: 'Rex Hotel Saigon', type: 'hotel', longitude: 106.6970, latitude: 10.7735, address: '141 Nguyễn Huệ, Quận 1', provinceId: hcm.id },
    { name: 'Park Hyatt Saigon', type: 'hotel', longitude: 106.7040, latitude: 10.7780, address: '2 Lam Son Square, Quận 1', provinceId: hcm.id },
    { name: 'Continental Saigon', type: 'hotel', longitude: 106.7010, latitude: 10.7770, address: '132 Đồng Khởi, Quận 1', provinceId: hcm.id },
    // HCMC Restaurants
    { name: 'Phở Hòa Pasteur', type: 'restaurant', longitude: 106.6940, latitude: 10.7810, address: '260C Pasteur, Quận 3', provinceId: hcm.id },
    { name: 'Cơm Tấm Bụi Saigon', type: 'restaurant', longitude: 106.6900, latitude: 10.7750, address: '84 Nguyễn Du, Quận 1', provinceId: hcm.id },
    // HCMC Hospitals
    { name: 'Bệnh viện Chợ Rẫy', type: 'hospital', longitude: 106.6530, latitude: 10.7580, address: '201 Nguyễn Chí Thanh, Quận 5', provinceId: hcm.id },
    { name: 'FV Hospital', type: 'hospital', longitude: 106.7150, latitude: 10.7290, address: '6 Nguyễn Lương Bằng, Quận 7', provinceId: hcm.id },

    // Hanoi Hotels
    { name: 'Sofitel Legend Metropole', type: 'hotel', longitude: 105.8560, latitude: 21.0245, address: '15 Ngô Quyền, Hoàn Kiếm', provinceId: hanoi.id },
    { name: 'JW Marriott Hanoi', type: 'hotel', longitude: 105.7840, latitude: 21.0160, address: '8 Đỗ Đức Dục, Nam Từ Liêm', provinceId: hanoi.id },
    // Hanoi Restaurants
    { name: 'Phở Thìn Bờ Hồ', type: 'restaurant', longitude: 105.8530, latitude: 21.0310, address: '61 Đinh Tiên Hoàng, Hoàn Kiếm', provinceId: hanoi.id },
    { name: 'Bún Chả Hương Liên', type: 'restaurant', longitude: 105.8380, latitude: 21.0130, address: '24 Lê Văn Hưu, Hai Bà Trưng', provinceId: hanoi.id },
    // Hanoi ATMs & Gas
    { name: 'Vietcombank ATM - Hoàn Kiếm', type: 'atm', longitude: 105.8540, latitude: 21.0260, address: '78 Bà Triệu, Hoàn Kiếm', provinceId: hanoi.id },

    // Da Nang
    { name: 'InterContinental Da Nang', type: 'hotel', longitude: 108.2620, latitude: 16.1250, address: 'Bãi Bắc, Sơn Trà', provinceId: danang.id },
    { name: 'Novotel Da Nang', type: 'hotel', longitude: 108.2310, latitude: 16.0680, address: '36 Bạch Đằng, Hải Châu', provinceId: danang.id },
    { name: 'Bé Mặn Restaurant', type: 'restaurant', longitude: 108.2420, latitude: 16.0550, address: 'K20/23 Dương Đình Nghệ, Sơn Trà', provinceId: danang.id },
    { name: 'Da Nang General Hospital', type: 'hospital', longitude: 108.2180, latitude: 16.0680, address: '124 Hải Phòng, Hải Châu', provinceId: danang.id },

    // Nha Trang
    { name: 'Mia Resort Nha Trang', type: 'hotel', longitude: 109.2190, latitude: 12.1980, address: 'Bãi Đông, Cam Hải Đông', provinceId: khanhhoa.id },
    { name: 'Galina Hotel', type: 'hotel', longitude: 109.1940, latitude: 12.2380, address: '5 Hùng Vương, Lộc Thọ', provinceId: khanhhoa.id },
    { name: 'Lanterns Vietnamese', type: 'restaurant', longitude: 109.1950, latitude: 12.2450, address: '34/6 Nguyễn Thiện Thuật', provinceId: khanhhoa.id },

    // Da Lat
    { name: 'Ana Mandara Villas Dalat', type: 'hotel', longitude: 108.4390, latitude: 11.9440, address: 'Lê Lai, Phường 5', provinceId: lamdong.id },
    { name: 'Cafe Tùng', type: 'cafe', longitude: 108.4413, latitude: 11.9425, address: '6 Khu Hòa Bình, Phường 1', provinceId: lamdong.id },
    { name: 'Đà Lạt Night Market', type: 'restaurant', longitude: 108.4415, latitude: 11.9420, address: 'Nguyễn Thị Minh Khai, Phường 1', provinceId: lamdong.id },

    // Ha Long
    { name: 'FLC Ha Long Bay', type: 'hotel', longitude: 107.0710, latitude: 20.9530, address: 'Bãi Cháy, Hạ Long', provinceId: quangninh.id },

    // Hue
    { name: 'Pilgrimage Village', type: 'hotel', longitude: 107.5600, latitude: 16.4470, address: '130 Minh Mạng, Thủy Xuân', provinceId: hue.id },
    { name: 'Quán Cơm Hến', type: 'restaurant', longitude: 107.5880, latitude: 16.4720, address: '17 Hàn Mặc Tử, TP Huế', provinceId: hue.id },

    // Hoi An
    { name: 'Anantara Hoi An', type: 'hotel', longitude: 108.3340, latitude: 15.8760, address: '1 Phạm Hồng Thái, Minh An', provinceId: quangnam.id },
    { name: 'Morning Glory Restaurant', type: 'restaurant', longitude: 108.3300, latitude: 15.8790, address: '106 Nguyễn Thái Học, Minh An', provinceId: quangnam.id },
    { name: 'Petro Gas Station - Hoi An', type: 'gas_station', longitude: 108.3200, latitude: 15.8850, address: 'Cửa Đại, Hội An', provinceId: quangnam.id },
  ];

  await prisma.service.createMany({ data: servicesData });
  console.log(`✅ Created ${servicesData.length} services`);

  // Enable PostGIS extension
  try {
    await prisma.$executeRawUnsafe(`
      CREATE EXTENSION IF NOT EXISTS postgis;
    `);
    console.log('✅ PostGIS extension enabled');
  } catch (e) {
    console.log('ℹ️ PostGIS extension already exists or not available, continuing...');
  }

  // Create indexes on lat/lng for efficient bbox queries
  try {
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_places_coords ON places (longitude, latitude);
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_services_coords ON services (longitude, latitude);
    `);
    console.log('✅ Spatial coordinate indexes created');
  } catch (e) {
    console.log('ℹ️ Index creation skipped:', (e as Error).message);
  }

  const stats = {
    provinces: await prisma.province.count(),
    places: await prisma.place.count(),
    roads: await prisma.road.count(),
    services: await prisma.service.count(),
  };

  console.log('\n📊 Database Statistics:');
  console.log(`   Provinces: ${stats.provinces}`);
  console.log(`   Places:    ${stats.places}`);
  console.log(`   Roads:     ${stats.roads}`);
  console.log(`   Services:  ${stats.services}`);
  console.log('\n🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
