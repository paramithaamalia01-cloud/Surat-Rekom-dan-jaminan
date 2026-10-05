// Utility to generate realistic Indonesian KTP and KK sample images using Canvas

export interface DemoProfile {
  id: string;
  label: string;
  badge: string;
  country: string;
  departure: string;
  purpose: string;
  ktpData: {
    nik: string;
    nama: string;
    tempatLahir: string;
    tanggalLahir: string;
    jenisKelamin: string;
    golDarah: string;
    alamat: string;
    rtRw: string;
    kelDesa: string;
    kecamatan: string;
    kota: string;
    provinsi: string;
    agama: string;
    statusPerkawinan: string;
    pekerjaan: string;
    kewarganegaraan: string;
  };
  kkData: {
    noKk: string;
    kepalaKeluarga: string;
    alamat: string;
    rtRw: string;
    kelDesa: string;
    kecamatan: string;
    kota: string;
    provinsi: string;
    kodePos: string;
    anggota: Array<{
      nama: string;
      nik: string;
      jk: string;
      ttl: string;
      agama: string;
      statusHub: string;
    }>;
  };
}

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: 'shofiyullah-alzam',
    label: 'Shofiyullah Achmad Maksun (PT. Alzam Mandiri Wisata)',
    badge: 'Template Gambar (Alzam)',
    country: 'Arab Saudi',
    departure: '12 - 23 Januari 2026',
    purpose: 'Ibadah Umroh / Surat Pernyataan dan Jaminan Paspor',
    ktpData: {
      nik: '1902013011990002',
      nama: 'SHOFIYULLAH ACHMAD MAKSUN',
      tempatLahir: 'JEPARA',
      tanggalLahir: '30-11-1999',
      jenisKelamin: 'LAKI-LAKI',
      golDarah: 'O',
      alamat: 'JL. AIR KETEKOK GG. PINANG',
      rtRw: '002 / 004',
      kelDesa: 'AIR KETEKOK',
      kecamatan: 'TANJUNG PANDAN',
      kota: 'KABUPATEN BELITUNG',
      provinsi: 'KEPULAUAN BANGKA BELITUNG',
      agama: 'ISLAM',
      statusPerkawinan: 'BELUM KAWIN',
      pekerjaan: 'WIRASWASTA',
      kewarganegaraan: 'WNI',
    },
    kkData: {
      noKk: '1902012005080003',
      kepalaKeluarga: 'ACHMAD MAKSUN',
      alamat: 'JL. AIR KETEKOK GG. PINANG',
      rtRw: '002/004',
      kelDesa: 'AIR KETEKOK',
      kecamatan: 'TANJUNG PANDAN',
      kota: 'BELITUNG',
      provinsi: 'BANGKA BELITUNG',
      kodePos: '33411',
      anggota: [
        {
          nama: 'ACHMAD MAKSUN',
          nik: '1902011505680001',
          jk: 'LAKI-LAKI',
          ttl: 'JEPARA, 15-05-1968',
          agama: 'ISLAM',
          statusHub: 'KEPALA KELUARGA',
        },
        {
          nama: 'SHOFIYULLAH ACHMAD MAKSUN',
          nik: '1902013011990002',
          jk: 'LAKI-LAKI',
          ttl: 'JEPARA, 30-11-1999',
          agama: 'ISLAM',
          statusHub: 'ANAK',
        },
      ],
    },
  },
  {
    id: 'fauzi-umroh',
    label: 'Ahmad Fauzi Pratama (Paket Umroh Plus)',
    badge: 'Umroh Saudi',
    country: 'Arab Saudi',
    departure: 'Desember 2026',
    purpose: 'Ibadah Umroh / Pembuatan Paspor Baru',
    ktpData: {
      nik: '3174051203920003',
      nama: 'AHMAD FAUZI PRATAMA',
      tempatLahir: 'JAKARTA',
      tanggalLahir: '12-03-1992',
      jenisKelamin: 'LAKI-LAKI',
      golDarah: 'O',
      alamat: 'JL. TEBET TIMUR DALAM VII NO. 14',
      rtRw: '004 / 008',
      kelDesa: 'TEBET TIMUR',
      kecamatan: 'TEBET',
      kota: 'KOTA ADM. JAKARTA SELATAN',
      provinsi: 'DKI JAKARTA',
      agama: 'ISLAM',
      statusPerkawinan: 'KAWIN',
      pekerjaan: 'KARYAWAN SWASTA',
      kewarganegaraan: 'WNI',
    },
    kkData: {
      noKk: '3174052908150002',
      kepalaKeluarga: 'AHMAD FAUZI PRATAMA',
      alamat: 'JL. TEBET TIMUR DALAM VII NO. 14',
      rtRw: '004/008',
      kelDesa: 'TEBET TIMUR',
      kecamatan: 'TEBET',
      kota: 'JAKARTA SELATAN',
      provinsi: 'DKI JAKARTA',
      kodePos: '12820',
      anggota: [
        {
          nama: 'AHMAD FAUZI PRATAMA',
          nik: '3174051203920003',
          jk: 'LAKI-LAKI',
          ttl: 'JAKARTA, 12-03-1992',
          agama: 'ISLAM',
          statusHub: 'KEPALA KELUARGA',
        },
        {
          nama: 'DINA MARLINA, S.PD',
          nik: '3174054508940001',
          jk: 'PEREMPUAN',
          ttl: 'BANDUNG, 05-08-1994',
          agama: 'ISLAM',
          statusHub: 'ISTRI',
        },
      ],
    },
  },
  {
    id: 'siti-jepang',
    label: 'Siti Nurhaliza Siregar (Wisata Sakura Jepang)',
    badge: 'Wisata Jepang',
    country: 'Jepang',
    departure: 'Januari 2027',
    purpose: 'Wisata Jepang / Pembuatan Paspor',
    ktpData: {
      nik: '3275016511950004',
      nama: 'SITI NURHALIZA SIREGAR',
      tempatLahir: 'MEDAN',
      tanggalLahir: '25-11-1995',
      jenisKelamin: 'PEREMPUAN',
      golDarah: 'B',
      alamat: 'KOMPLEK HARAPAN INDAH BLOK FB NO. 12',
      rtRw: '003 / 015',
      kelDesa: 'MEDAN SATRIA',
      kecamatan: 'MEDAN SATRIA',
      kota: 'KOTA BEKASI',
      provinsi: 'JAWA BARAT',
      agama: 'ISLAM',
      statusPerkawinan: 'BELUM KAWIN',
      pekerjaan: 'DOKTER GIGI',
      kewarganegaraan: 'WNI',
    },
    kkData: {
      noKk: '3275011406110008',
      kepalaKeluarga: 'H. HASAN SIREGAR',
      alamat: 'KOMPLEK HARAPAN INDAH BLOK FB NO. 12',
      rtRw: '003/015',
      kelDesa: 'MEDAN SATRIA',
      kecamatan: 'MEDAN SATRIA',
      kota: 'KOTA BEKASI',
      provinsi: 'JAWA BARAT',
      kodePos: '17132',
      anggota: [
        {
          nama: 'H. HASAN SIREGAR',
          nik: '3275011004650002',
          jk: 'LAKI-LAKI',
          ttl: 'MEDAN, 10-04-1965',
          agama: 'ISLAM',
          statusHub: 'KEPALA KELUARGA',
        },
        {
          nama: 'SITI NURHALIZA SIREGAR',
          nik: '3275016511950004',
          jk: 'PEREMPUAN',
          ttl: 'MEDAN, 25-11-1995',
          agama: 'ISLAM',
          statusHub: 'ANAK',
        },
      ],
    },
  },
];

// Helper to draw realistic KTP into a base64 Data URL
export function generateKtpImage(profile: DemoProfile): string {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 570;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const { ktpData } = profile;

  // Background e-KTP Indonesian cyan/teal guilloche gradient
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#7bc9dd');
  grad.addColorStop(0.5, '#99d9e9');
  grad.addColorStop(1, '#81ccdc');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Microprint wave patterns (guilloche simulation)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.height; i += 12) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.bezierCurveTo(200, i + 8, 600, i - 8, canvas.width, i + 4);
    ctx.stroke();
  }

  // Indonesian Garuda watermark in center
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.arc(450, 300, 160, 0, Math.PI * 2);
  ctx.fill();

  // Header Texts
  ctx.fillStyle = '#0f2438';
  ctx.textAlign = 'center';
  ctx.font = 'bold 20px "Arial", sans-serif';
  ctx.fillText(`PROVINSI ${ktpData.provinsi}`, 450, 40);
  ctx.font = 'bold 18px "Arial", sans-serif';
  ctx.fillText(ktpData.kota, 450, 65);

  // Line separator
  ctx.strokeStyle = '#0f2438';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 75);
  ctx.lineTo(850, 75);
  ctx.stroke();

  // NIK Header
  ctx.textAlign = 'left';
  ctx.font = 'bold 26px "Courier New", monospace, sans-serif';
  ctx.fillStyle = '#000000';
  ctx.fillText('NIK', 50, 115);
  ctx.fillText(':', 240, 115);
  ctx.font = 'bold 30px "Courier New", monospace, sans-serif';
  ctx.fillStyle = '#b00000'; // red-tinted authentic NIK font
  ctx.fillText(ktpData.nik, 270, 115);

  // KTP Fields
  ctx.font = 'bold 15px "Arial", sans-serif';
  ctx.fillStyle = '#111827';

  const rows = [
    { label: 'Nama', val: ktpData.nama },
    { label: 'Tempat/Tgl Lahir', val: `${ktpData.tempatLahir}, ${ktpData.tanggalLahir}` },
    { label: 'Jenis Kelamin', val: `${ktpData.jenisKelamin}    Gol. Darah : ${ktpData.golDarah}` },
    { label: 'Alamat', val: ktpData.alamat },
    { label: '    RT/RW', val: ktpData.rtRw },
    { label: '    Kel/Desa', val: ktpData.kelDesa },
    { label: '    Kecamatan', val: ktpData.kecamatan },
    { label: 'Agama', val: ktpData.agama },
    { label: 'Status Perkawinan', val: ktpData.statusPerkawinan },
    { label: 'Pekerjaan', val: ktpData.pekerjaan },
    { label: 'Kewarganegaraan', val: ktpData.kewarganegaraan },
    { label: 'Berlaku Hingga', val: 'SEUMUR HIDUP' },
  ];

  let yPos = 150;
  for (const r of rows) {
    ctx.font = r.label.startsWith('    ') ? '14px "Arial", sans-serif' : 'bold 14px "Arial", sans-serif';
    ctx.fillText(r.label, 50, yPos);
    ctx.fillText(':', 240, yPos);
    ctx.font = 'bold 14px "Arial", sans-serif';
    ctx.fillText(r.val, 270, yPos);
    yPos += 26;
  }

  // Right Photo Area (Pas Foto Resmi)
  const photoX = 660;
  const photoY = 130;
  const photoW = 190;
  const photoH = 260;

  // Background red or blue photo
  ctx.fillStyle = ktpData.jenisKelamin === 'LAKI-LAKI' ? '#1e40af' : '#b91c1c';
  ctx.fillRect(photoX, photoY, photoW, photoH);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.strokeRect(photoX, photoY, photoW, photoH);

  // Silhouette / portrait
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.arc(photoX + photoW / 2, photoY + 90, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(photoX + photoW / 2, photoY + 220, 75, 60, 0, Math.PI, 0);
  ctx.fill();

  // Signature box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillRect(photoX + 15, photoY + photoH + 20, 160, 60);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  ctx.strokeRect(photoX + 15, photoY + photoH + 20, 160, 60);

  // Fake cursive signature
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(photoX + 30, photoY + photoH + 60);
  ctx.bezierCurveTo(photoX + 60, photoY + photoH + 30, photoX + 90, photoY + photoH + 75, photoX + 120, photoY + photoH + 45);
  ctx.lineTo(photoX + 160, photoY + photoH + 55);
  ctx.stroke();

  // City & issue date below photo
  ctx.fillStyle = '#0f172a';
  ctx.font = '12px "Arial", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(ktpData.kota.replace('KOTA ADM. ', ''), photoX + photoW / 2, photoY + photoH + 95);
  ctx.fillText(ktpData.tanggalLahir, photoX + photoW / 2, photoY + photoH + 110);

  return canvas.toDataURL('image/png');
}

// Helper to draw realistic Kartu Keluarga (KK) into a base64 Data URL
export function generateKkImage(profile: DemoProfile): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1100;
  canvas.height = 780;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const { kkData } = profile;

  // Background off-white / light parchment
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer border with security guilloche style
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 8;
  ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(22, 22, canvas.width - 44, canvas.height - 44);

  // Garuda Pancasila Emblem placeholder
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(550, 60, 24, 0, Math.PI * 2);
  ctx.fill();

  // KK Header Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 24px "Arial", sans-serif';
  ctx.fillText('KARTU KELUARGA', 550, 105);
  ctx.font = 'bold 22px "Courier New", monospace, sans-serif';
  ctx.fillText(`No. ${kkData.noKk}`, 550, 130);

  // Metadata Columns (Left & Right)
  ctx.textAlign = 'left';
  ctx.font = 'bold 13px "Arial", sans-serif';
  ctx.fillStyle = '#1e293b';

  // Left Column
  const leftX = 50;
  let leftY = 165;
  const leftRows = [
    { label: 'Nama Kepala Keluarga', val: kkData.kepalaKeluarga },
    { label: 'Alamat', val: kkData.alamat },
    { label: 'RT/RW', val: kkData.rtRw },
    { label: 'Desa/Kelurahan', val: kkData.kelDesa },
  ];
  for (const r of leftRows) {
    ctx.fillText(r.label, leftX, leftY);
    ctx.fillText(':', leftX + 170, leftY);
    ctx.fillText(r.val, leftX + 185, leftY);
    leftY += 22;
  }

  // Right Column
  const rightX = 620;
  let rightY = 165;
  const rightRows = [
    { label: 'Kecamatan', val: kkData.kecamatan },
    { label: 'Kabupaten/Kota', val: kkData.kota },
    { label: 'Kode Pos', val: kkData.kodePos },
    { label: 'Provinsi', val: kkData.provinsi },
  ];
  for (const r of rightRows) {
    ctx.fillText(r.label, rightX, rightY);
    ctx.fillText(':', rightX + 140, rightY);
    ctx.fillText(r.val, rightX + 155, rightY);
    rightY += 22;
  }

  // KK Table Header 1
  const tableY = 270;
  const tableW = canvas.width - 100;
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(50, tableY, tableW, 40);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.strokeRect(50, tableY, tableW, 40);

  // Column definitions
  const cols = [
    { label: 'No', w: 40 },
    { label: 'Nama Lengkap', w: 230 },
    { label: 'NIK', w: 180 },
    { label: 'Jenis Kelamin', w: 120 },
    { label: 'Tempat Lahir', w: 130 },
    { label: 'Tanggal Lahir', w: 110 },
    { label: 'Agama', w: 80 },
    { label: 'Status Hubungan', w: 110 },
  ];

  let colX = 50;
  ctx.font = 'bold 11px "Arial", sans-serif';
  ctx.fillStyle = '#0f172a';
  for (const col of cols) {
    ctx.strokeRect(colX, tableY, col.w, 40);
    ctx.fillText(col.label, colX + 8, tableY + 24);
    colX += col.w;
  }

  // Member Rows
  let memberY = tableY + 40;
  kkData.anggota.forEach((mem, idx) => {
    colX = 50;
    ctx.strokeRect(50, memberY, tableW, 35);
    ctx.font = '11px "Arial", sans-serif';

    const vals = [
      String(idx + 1),
      mem.nama,
      mem.nik,
      mem.jk,
      mem.ttl.split(',')[0] || '',
      mem.ttl.split(',')[1]?.trim() || '',
      mem.agama,
      mem.statusHub,
    ];

    cols.forEach((col, cIdx) => {
      ctx.strokeRect(colX, memberY, col.w, 35);
      ctx.fillText(vals[cIdx] || '', colX + 6, memberY + 22);
      colX += col.w;
    });

    memberY += 35;
  });

  // Empty placeholder rows to look authentic
  for (let empty = kkData.anggota.length; empty < 5; empty++) {
    colX = 50;
    ctx.strokeRect(50, memberY, tableW, 30);
    cols.forEach((col) => {
      ctx.strokeRect(colX, memberY, col.w, 30);
      colX += col.w;
    });
    memberY += 30;
  }

  // Official Stamps & Signatures Footer at Bottom
  const footerY = 560;
  ctx.font = '12px "Arial", sans-serif';

  // Kepala Keluarga
  ctx.textAlign = 'center';
  ctx.fillText('KEPALA KELUARGA,', 180, footerY);
  ctx.fillText(kkData.kepalaKeluarga, 180, footerY + 110);
  ctx.beginPath();
  ctx.moveTo(90, footerY + 115);
  ctx.lineTo(270, footerY + 115);
  ctx.stroke();

  // Kepala Dinas Dukcapil
  ctx.fillText(`Dikeluarkan di: ${kkData.kota}`, 880, footerY - 20);
  ctx.fillText('KEPALA DINAS KEPENDUDUKAN & CATATAN SIPIL,', 880, footerY);
  ctx.fillText('DRS. H. SUHARTONO, M.SI', 880, footerY + 110);
  ctx.beginPath();
  ctx.moveTo(760, footerY + 115);
  ctx.lineTo(1000, footerY + 115);
  ctx.stroke();

  return canvas.toDataURL('image/png');
}
