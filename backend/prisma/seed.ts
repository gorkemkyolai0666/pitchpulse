import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const demoEmail = 'demo@modastudyo.com';

  const existingUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (existingUser) {
    console.log('Demo kullanıcı zaten mevcut.');
    return;
  }

  const studio = await prisma.studio.create({
    data: {
      name: 'Moda Kayıt Stüdyosu',
      address: 'Caferağa Mah. Moda Cad. No:42',
      city: 'İstanbul',
      district: 'Kadıköy',
      phone: '0216 345 67 89',
      email: 'info@modastudyo.com',
      taxNo: 'STD-34-2024-0042',
    },
  });

  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.user.create({
    data: {
      email: demoEmail,
      passwordHash,
      firstName: 'Emre',
      lastName: 'Kaya',
      role: 'admin',
      specialty: 'Baş Ses Mühendisi',
      studioId: studio.id,
    },
  });

  const client1 = await prisma.client.create({
    data: {
      artistName: 'Deniz ve Rüzgar',
      contactName: 'Deniz Aksoy',
      phone: '0532 111 22 33',
      email: 'deniz@denizveruzgar.com',
      genre: 'Alternatif Rock',
      city: 'İstanbul',
      notes: 'EP kaydı — 6 parça, canlı davul',
      studioId: studio.id,
    },
  });

  const client2 = await prisma.client.create({
    data: {
      artistName: 'Seda Nova',
      contactName: 'Seda Yılmaz',
      phone: '0533 444 55 66',
      email: 'seda@sedanova.com',
      genre: 'Pop / R&B',
      city: 'İstanbul',
      studioId: studio.id,
    },
  });

  const client3 = await prisma.client.create({
    data: {
      artistName: 'Podcast Kadıköy',
      contactName: 'Ali Öztürk',
      phone: '0535 777 88 99',
      email: 'ali@podcastkadikoy.com',
      genre: 'Podcast',
      city: 'İstanbul',
      studioId: studio.id,
    },
  });

  const room1 = await prisma.studioRoom.create({
    data: {
      name: 'A Odası — Live Room',
      roomType: 'live',
      hourlyRate: 2500,
      capacity: 6,
      description: '120m² canlı kayıt odası, yüksek tavan, izole davul odası',
      studioId: studio.id,
    },
  });

  const room2 = await prisma.studioRoom.create({
    data: {
      name: 'B Odası — Mix Suite',
      roomType: 'mix',
      hourlyRate: 1800,
      capacity: 3,
      description: 'Dolby Atmos uyumlu mix odası, PMC monitörler',
      studioId: studio.id,
    },
  });

  const room3 = await prisma.studioRoom.create({
    data: {
      name: 'C Odası — Vocal Booth',
      roomType: 'vocal',
      hourlyRate: 1200,
      capacity: 2,
      description: 'Vokal ve podcast kayıt kabini',
      studioId: studio.id,
    },
  });

  await prisma.equipment.createMany({
    data: [
      {
        name: 'Neumann U87 Ai',
        category: 'microphone',
        brand: 'Neumann',
        model: 'U87 Ai',
        serialNumber: 'NU87-2021-0042',
        condition: 'excellent',
        studioRoomId: room1.id,
        studioId: studio.id,
      },
      {
        name: 'Universal Audio Apollo x16',
        category: 'interface',
        brand: 'Universal Audio',
        model: 'Apollo x16',
        serialNumber: 'UAX16-2022-0088',
        condition: 'excellent',
        studioRoomId: room1.id,
        studioId: studio.id,
      },
      {
        name: 'PMC twentysix+',
        category: 'monitor',
        brand: 'PMC',
        model: 'twentysix+',
        serialNumber: 'PMC-2020-0012',
        condition: 'good',
        studioRoomId: room2.id,
        studioId: studio.id,
      },
      {
        name: 'Shure SM7B',
        category: 'microphone',
        brand: 'Shure',
        model: 'SM7B',
        serialNumber: 'SM7B-2023-0156',
        condition: 'good',
        studioRoomId: room3.id,
        studioId: studio.id,
      },
    ],
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(10, 0, 0, 0);

  const session1 = await prisma.session.create({
    data: {
      date: tomorrow,
      duration: 180,
      type: 'recording',
      status: 'confirmed',
      engineerName: 'Emre Kaya',
      notes: 'Davul kayıtları — 4 parça',
      clientId: client1.id,
      studioRoomId: room1.id,
      studioId: studio.id,
    },
  });

  await prisma.session.create({
    data: {
      date: nextWeek,
      duration: 120,
      type: 'mixing',
      status: 'scheduled',
      engineerName: 'Emre Kaya',
      clientId: client2.id,
      studioRoomId: room2.id,
      studioId: studio.id,
    },
  });

  await prisma.session.create({
    data: {
      date: tomorrow,
      duration: 90,
      type: 'podcast',
      status: 'scheduled',
      engineerName: 'Emre Kaya',
      clientId: client3.id,
      studioRoomId: room3.id,
      studioId: studio.id,
    },
  });

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  await prisma.delivery.create({
    data: {
      title: 'Deniz ve Rüzgar EP — Mix (6 parça)',
      type: 'mix',
      status: 'in_progress',
      totalPrice: 18000,
      paidAmount: 9000,
      dueDate,
      clientId: client1.id,
      sessionId: session1.id,
      studioId: studio.id,
    },
  });

  await prisma.delivery.create({
    data: {
      title: 'Seda Nova — Single Master',
      type: 'master',
      status: 'quoted',
      totalPrice: 4500,
      paidAmount: 0,
      dueDate,
      clientId: client2.id,
      studioId: studio.id,
    },
  });

  console.log('PitchPulse seed tamamlandı.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
