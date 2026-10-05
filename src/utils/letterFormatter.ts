import { ApplicantData } from '../types';

// Format letter according to selected template
export function formatOfficialLetterText(data: ApplicantData): string {
  if (data.templateType === 'permohonan_paspor') {
    return `${data.namaPerusahaan || 'PT. ALZAM MANDIRI WISATA'}
${data.taglinePerusahaan || 'Tour & Travel'}
IZIN PPIU : ${data.izinPpiu || '29042200007580004'}
${data.alamatPerusahaan || 'Ciledug Mas, Jl. HOS Cokroaminoto Blok C9 dan C10, RT.003/RW.004, Sudimara Timur, Kecamatan Karang Tengah, Kota Tangerang, Banten 15151'}
Telp/hp : ${data.teleponPerusahaan || '0815-9888-154'}, email : ${data.emailPerusahaan || 'alzam@bisa.id'}, ${data.websitePerusahaan || 'www.umrahbisa.com'}
------------------------------------------------------------------------

Nomor   : ${data.nomorSurat}
Perihal : ${data.perihal || 'Permohonan Pembuatan Paspor'}

Kepada Yth.
${data.tujuanKantorImigrasi || 'Kepala Kantor Imigrasi Kelas II TPI Tanjung Pandan'}
${data.alamatKantorImigrasi || 'Jl. Jendral Sudirman Km. 6,5, Desa Perawas, Kec. Tanjung Pandan, Kabupaten Belitung, Kepulauan Bangka Belitung 33413.'}

Assalamu’alaikum warahmatullahi wabarakatuh
Sehubungan dengan akan adanya keberangkatan jamaah umrah ${data.namaPerusahaan || 'PT. Alzam Mandiri Wisata'} dengan izin Penyelenggara Perjalanan Ibadah Umrah yang diterbitkan ${data.tanggalIzinPpiu || '02 Agustus 2022'} oleh Pemerintah Republik Indonesia, maka dengan ini kami mengajukan permohonan guna pembuatan paspor atas nama :

Nama                 : ${data.namaLengkap}
Tempat/Tanggal Lahir : ${data.tempatTanggalLahir}
NIK                  : ${data.nik}
Alamat               : ${data.alamatKtp}

Tanggal Keberangkatan : ${data.jadwalKeberangkatanDanKepulangan || data.estimasiKeberangkatan || '12 - 23 Januari 2026'}

Demikian permohonan ini kami buat, atas bantuan dan perhatian Bapak/Ibu kami ucapkan terima kasih. Wassalamu'alaikum warahmatullahi wabarakatuh

${data.kotaPenerbitan || 'Jakarta'}, ${data.tanggalSurat}
Hormat Kami,
${data.namaPerusahaan || 'PT. Alzam Mandiri Wisata'}

[TTD / Stempel Resmi]

${data.pejabatNama || 'Khairul Umam, ST, BA, MBA'}
${data.pejabatJabatan || 'Direktur Utama'}`;
  }

  if (data.templateType === 'pernyataan_jaminan') {
    return `${data.namaPerusahaan || 'PT. ALZAM MANDIRI WISATA'}
${data.taglinePerusahaan || 'Tour & Travel'}
IZIN PPIU : ${data.izinPpiu || '29042200007580004'}
${data.alamatPerusahaan || 'Ciledug Mas, Jl. HOS Cokroaminoto Blok C9 dan C10, RT.003/RW.004, Sudimara Timur, Kecamatan Karang Tengah, Kota Tangerang, Banten 15151'}
Telp/hp : ${data.teleponPerusahaan || '0815-9888-154'}, email : ${data.emailPerusahaan || 'alzam@bisa.id'}, ${data.websitePerusahaan || 'www.umrahbisa.com'}
------------------------------------------------------------------------

Nomor   : ${data.nomorSurat}
Perihal : ${data.perihal || 'Surat Pernyataan dan Jaminan'}

Assalamu’alaikum warahmatullahi wabarakatuh
Saya yang bertanda tangan dibawah ini:
Nama       : ${data.pejabatNama || 'Khairul Umam, S.T, B.A, MBA'}
Jabatan    : ${data.pejabatJabatan || 'Direktur Utama'}
Perusahaan : ${data.namaPerusahaan || 'PT. Alzam Mandiri Wisata'}

Bersama ini kami menyatakan:
Nama                 : ${data.namaLengkap}
Tempat/Tanggal Lahir : ${data.tempatTanggalLahir}
NIK                  : ${data.nik}
Alamat               : ${data.alamatKtp}

adalah benar calon jamaah umrah ${data.namaPerusahaan || 'PT. Alzam Mandiri Wisata'} sebagai penyelenggara resmi perjalanan umrah dan kami bertanggungjawab dan menjamin sepenuhnya terhadap calon jamaah umrah kami dengan memperhatikan hal-hal sebagai berikut :
1 Pemohon paspor yang kami urus adalah WNI (Warga Negara Indonesia) yang sebenarnya akan melakukan perjalanan ke Arab Saudi dalam rangka menunaikan ibadah umrah.
2 Rombongan calon jamaah umrah yang kami urus tidak akan melakukan pelanggaran peraturan keimigrasian berupa penyalahgunaan izin tinggal, tidak melebihi izin tinggalnya (Overstay) memalsukan atau membuat palsu paspor yang diberikan kepadanya maupun bekerja secara ilegal.
3 Apabila terjadi pelanggaran sebagaimana dimaksud, maka izin usaha kami sebagai penyelenggara perjalanan ibadah umrah bersedia dicabut.
4 Jadwal keberangkatan dan kepulangan ke Indonesia dari Tanggal
${data.jadwalKeberangkatanDanKepulangan || data.estimasiKeberangkatan || '12 - 23 Januari 2026'}

Demikian surat Pernyataan dan Jaminan ini kami buat dengan sebenarnya untuk dipergunakan sebagaimana mestinya. Atas perhatian dan kerjasamanya kami ucapkan terima kasih. Wassalamu'alaikum warahmatullahi wabarakatuh

${data.kotaPenerbitan || 'Jakarta'}, ${data.tanggalSurat}
Hormat Kami,
${data.namaPerusahaan || 'PT. Alzam Mandiri Wisata'}

[TTD / Stempel Resmi]

${data.pejabatNama || 'Khairul Umam, ST, BA, MBA'}
${data.pejabatJabatan || 'Direktur Utama'}`;
  }

  if (data.templateType === 'paket_lengkap_alzam') {
    return `=== DOKUMEN 1: SURAT PERMOHONAN PEMBUATAN PASPOR ===\n\n` +
      formatOfficialLetterText({ ...data, templateType: 'permohonan_paspor', perihal: 'Permohonan Pembuatan Paspor' }) +
      `\n\n\n=======================================================\n` +
      `=== DOKUMEN 2: SURAT PERNYATAAN DAN JAMINAN ===\n\n` +
      formatOfficialLetterText({ ...data, templateType: 'pernyataan_jaminan', perihal: 'Surat Pernyataan dan Jaminan' });
  }

  // Default: PT. Alzam Mandiri Wisata (Permohonan Paspor)
  return `${data.namaPerusahaan || 'PT. ALZAM MANDIRI WISATA'}
${data.taglinePerusahaan || 'Tour & Travel'}
IZIN PPIU : ${data.izinPpiu || '29042200007580004'}
${data.alamatPerusahaan || 'Ciledug Mas, Jl. HOS Cokroaminoto Blok C9 dan C10, RT.003/RW.004, Sudimara Timur, Kecamatan Karang Tengah, Kota Tangerang, Banten 15151'}
Telp/hp : ${data.teleponPerusahaan || '0815-9888-154'}, email : ${data.emailPerusahaan || 'alzam@bisa.id'}, ${data.websitePerusahaan || 'www.umrahbisa.com'}
------------------------------------------------------------------------

Nomor   : ${data.nomorSurat}
Perihal : ${data.perihal || 'Permohonan Pembuatan Paspor'}

Kepada Yth.
${data.tujuanKantorImigrasi || 'Kepala Kantor Imigrasi Kelas II TPI Tanjung Pandan'}
${data.alamatKantorImigrasi || 'Jl. Jendral Sudirman Km. 6,5, Desa Perawas, Kec. Tanjung Pandan, Kabupaten Belitung, Kepulauan Bangka Belitung 33413.'}

Assalamu’alaikum warahmatullahi wabarakatuh
Sehubungan dengan akan adanya keberangkatan jamaah umrah ${data.namaPerusahaan || 'PT. Alzam Mandiri Wisata'} dengan izin Penyelenggara Perjalanan Ibadah Umrah yang diterbitkan ${data.tanggalIzinPpiu || '02 Agustus 2022'} oleh Pemerintah Republik Indonesia, maka dengan ini kami mengajukan permohonan guna pembuatan paspor atas nama :

Nama                 : ${toTitleCase(data.namaLengkap)}
Tempat/Tanggal Lahir : ${toTitleCase(data.tempatTanggalLahir)}
NIK                  : ${data.nik}
Alamat               : ${toTitleCase(data.alamatKtp)}

Tanggal Keberangkatan : ${data.jadwalKeberangkatanDanKepulangan || data.estimasiKeberangkatan || '12 - 23 Januari 2026'}

Demikian permohonan ini kami buat, atas bantuan dan perhatian Bapak/Ibu kami ucapkan terima kasih. Wassalamu'alaikum warahmatullahi wabarakatuh

${data.kotaPenerbitan || 'Jakarta'}, ${data.tanggalSurat}
Hormat Kami,
${data.namaPerusahaan || 'PT. Alzam Mandiri Wisata'}

[TTD / Stempel Resmi]

${data.pejabatNama || 'Khairul Umam, ST, BA, MBA'}
${data.pejabatJabatan || 'Direktur Utama'}`;
}

// Download formatted letter as a Word Document (.doc file compatible with Microsoft Word & Google Docs)
export function exportToWordDocument(data: ApplicantData): void {
  const isPermohonan = data.templateType === 'permohonan_paspor';
  const isPernyataan = data.templateType === 'pernyataan_jaminan';
  const isPaket = data.templateType === 'paket_lengkap_alzam';

  const kopAlzam = `
    <div style="text-align: center; margin-bottom: 8px;">
      <div style="font-size: 15pt; font-weight: bold; color: #1e3a5f;">${data.namaPerusahaan || 'PT. ALZAM MANDIRI WISATA'}</div>
      <div style="font-size: 12.5pt; font-weight: 800; color: #065f46; font-style: italic;">${data.taglinePerusahaan || 'Tour & Travel'}</div>
      <div style="font-size: 10pt; font-weight: bold; margin-top: 2px;">IZIN PPIU : ${data.izinPpiu || '29042200007580004'}</div>
      <div style="font-size: 8pt; margin-top: 2px;">${data.alamatPerusahaan || 'Ciledug Mas, Jl. HOS Cokroaminoto Blok C9 dan C10, RT.003/RW.004, Sudimara Timur, Kecamatan Karang Tengah, Kota Tangerang, Banten 15151'}</div>
      <div style="font-size: 7.5pt;">Telp/hp : ${data.teleponPerusahaan || '0815-9888-154'}, email : ${data.emailPerusahaan || 'alzam@bisa.id'}, ${data.websitePerusahaan || 'www.umrahbisa.com'}</div>
    </div>
    <div style="border-top: 2px solid #000; margin: 8px 0 16px 0;"></div>
  `;

  const permohonanHtml = `
    ${kopAlzam}
    <table style="width: 100%; margin-bottom: 12px; font-size: 11pt;">
      <tr><td style="width: 80px;">Nomor</td><td style="width: 15px;">:</td><td>${data.nomorSurat}</td></tr>
      <tr><td>Perihal</td><td>:</td><td><u><b>${data.perihal || 'Permohonan Pembuatan Paspor'}</b></u></td></tr>
    </table>

    <div style="margin-bottom: 12px; font-size: 11pt;">
      Kepada Yth.<br/>
      <b>${data.tujuanKantorImigrasi || 'Kepala Kantor Imigrasi Kelas II TPI Tanjung Pandan'}</b><br/>
      ${data.alamatKantorImigrasi || 'Jl. Jendral Sudirman Km. 6,5, Desa Perawas, Kec. Tanjung Pandan, Kabupaten Belitung, Kepulauan Bangka Belitung 33413.'}
    </div>

    <p style="margin-bottom: 6px;">Assalamu’alaikum warahmatullahi wabarakatuh</p>
    <p style="text-align: justify; margin-bottom: 8px;">
      Sehubungan dengan akan adanya keberangkatan jamaah umrah ${data.namaPerusahaan || 'PT. Alzam Mandiri Wisata'} dengan izin Penyelenggara Perjalanan Ibadah Umrah yang diterbitkan ${data.tanggalIzinPpiu || '02 Agustus 2022'} oleh Pemerintah Republik Indonesia, maka dengan ini kami mengajukan permohonan guna pembuatan paspor atas nama :
    </p>

    <table style="width: 100%; margin-left: 20px; font-size: 11pt; margin-bottom: 12px;">
      <tr><td style="width: 180px;">Nama</td><td style="width: 15px;">:</td><td><b>${data.namaLengkap}</b></td></tr>
      <tr><td>Tempat/Tanggal Lahir</td><td>:</td><td>${data.tempatTanggalLahir}</td></tr>
      <tr><td>NIK</td><td>:</td><td><b>${data.nik}</b></td></tr>
      <tr><td style="vertical-align: top;">Alamat</td><td style="vertical-align: top;">:</td><td>${data.alamatKtp}</td></tr>
      <tr><td>Tanggal Keberangkatan</td><td>:</td><td><b>${data.jadwalKeberangkatanDanKepulangan || data.estimasiKeberangkatan || '12 - 23 Januari 2026'}</b></td></tr>
    </table>

    <p style="text-align: justify; margin-top: 10px;">
      Demikian permohonan ini kami buat, atas bantuan dan perhatian Bapak/Ibu kami ucapkan terima kasih. Wassalamu'alaikum warahmatullahi wabarakatuh
    </p>

    <div style="width: 100%; margin-top: 25px; text-align: right;">
      <div style="display: inline-block; text-align: left; width: 290px; line-height: 1.5;">
        <div>${data.kotaPenerbitan || 'Jakarta'}, ${data.tanggalSurat}</div>
        <div>Hormat Kami,</div>
        <div><b>${data.namaPerusahaan || 'PT. Alzam Mandiri Wisata'}</b></div>
        <div style="height: 60px;"></div>
        <div><b><u>${data.pejabatNama || 'Khairul Umam, ST, BA, MBA'}</u></b></div>
        <div>${data.pejabatJabatan || 'Direktur Utama'}</div>
      </div>
    </div>
  `;

  const pernyataanHtml = `
    ${kopAlzam}
    <table style="width: 100%; margin-bottom: 12px; font-size: 11pt;">
      <tr><td style="width: 80px;">Nomor</td><td style="width: 15px;">:</td><td>${data.nomorSurat}</td></tr>
      <tr><td>Perihal</td><td>:</td><td><u><b>Surat Pernyataan dan Jaminan</b></u></td></tr>
    </table>

    <p style="margin-bottom: 6px;">Assalamu’alaikum warahmatullahi wabarakatuh</p>
    <p style="margin-bottom: 4px;">Saya yang bertanda tangan dibawah ini:</p>
    <table style="width: 100%; margin-left: 20px; font-size: 11pt; margin-bottom: 8px;">
      <tr><td style="width: 120px;">Nama</td><td style="width: 15px;">:</td><td>${data.pejabatNama}</td></tr>
      <tr><td>Jabatan</td><td>:</td><td>${data.pejabatJabatan}</td></tr>
      <tr><td>Perusahaan</td><td>:</td><td>${data.namaPerusahaan}</td></tr>
    </table>

    <p style="margin-bottom: 4px;">Bersama ini kami menyatakan:</p>
    <table style="width: 100%; margin-left: 20px; font-size: 11pt; margin-bottom: 12px;">
      <tr><td style="width: 180px;">Nama</td><td style="width: 15px;">:</td><td><b>${data.namaLengkap}</b></td></tr>
      <tr><td>Tempat/Tanggal Lahir</td><td>:</td><td>${data.tempatTanggalLahir}</td></tr>
      <tr><td>NIK</td><td>:</td><td><b>${data.nik}</b></td></tr>
      <tr><td style="vertical-align: top;">Alamat</td><td style="vertical-align: top;">:</td><td>${data.alamatKtp}</td></tr>
    </table>

    <p style="text-align: justify; margin-bottom: 8px;">
      adalah benar calon jamaah umrah ${data.namaPerusahaan} sebagai penyelenggara resmi perjalanan umrah dan kami bertanggungjawab dan menjamin sepenuhnya terhadap calon jamaah umrah kami dengan memperhatikan hal-hal sebagai berikut :
    </p>

    <ol style="margin-left: 20px; padding-left: 10px; line-height: 1.4;">
      <li style="margin-bottom: 6px;">Pemohon paspor yang kami urus adalah WNI (Warga Negara Indonesia) yang sebenarnya akan melakukan perjalanan ke Arab Saudi dalam rangka menunaikan ibadah umrah.</li>
      <li style="margin-bottom: 6px;">Rombongan calon jamaah umrah yang kami urus tidak akan melakukan pelanggaran peraturan keimigrasian berupa penyalahgunaan izin tinggal, tidak melebihi izin tinggalnya (Overstay) memalsukan atau membuat palsu paspor yang diberikan kepadanya maupun bekerja secara ilegal.</li>
      <li style="margin-bottom: 6px;">Apabila terjadi pelanggaran sebagaimana dimaksud, maka izin usaha kami sebagai penyelenggara perjalanan ibadah umrah bersedia dicabut.</li>
      <li style="margin-bottom: 6px;">Jadwal keberangkatan dan kepulangan ke Indonesia dari Tanggal<br/><b>${data.jadwalKeberangkatanDanKepulangan || data.estimasiKeberangkatan || '12 - 23 Januari 2026'}</b></li>
    </ol>

    <p style="text-align: justify; margin-top: 10px;">
      Demikian surat Pernyataan dan Jaminan ini kami buat dengan sebenarnya untuk dipergunakan sebagaimana mestinya. Atas perhatian dan kerjasamanya kami ucapkan terima kasih. Wassalamu'alaikum warahmatullahi wabarakatuh
    </p>

    <div style="width: 100%; margin-top: 25px; text-align: right;">
      <div style="display: inline-block; text-align: left; width: 290px; line-height: 1.5;">
        <div>${data.kotaPenerbitan || 'Jakarta'}, ${data.tanggalSurat}</div>
        <div>Hormat Kami,</div>
        <div><b>${data.namaPerusahaan}</b></div>
        <div style="height: 60px;"></div>
        <div><b><u>${data.pejabatNama}</u></b></div>
        <div>${data.pejabatJabatan}</div>
      </div>
    </div>
  `;

  let bodyContent = '';
  if (isPermohonan) {
    bodyContent = permohonanHtml;
  } else if (isPernyataan) {
    bodyContent = pernyataanHtml;
  } else if (isPaket) {
    bodyContent = permohonanHtml + `<br clear="all" style="page-break-before:always" />` + pernyataanHtml;
  } else {
    bodyContent = permohonanHtml;
  }

  const content = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${data.perihal || 'Surat Imigrasi'} - ${data.namaLengkap}</title>
      <style>
        @page { size: A4 portrait; margin: 2.0cm 2.5cm 2.0cm 2.5cm; }
        body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.35; color: #000; margin: 2.0cm 2.5cm 2.0cm 2.5cm; }
        p { text-align: justify; text-justify: inter-word; }
      </style>
    </head>
    <body>
      ${bodyContent}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = isPermohonan
    ? 'Surat_Permohonan_Paspor'
    : isPernyataan
    ? 'Surat_Pernyataan_Jaminan'
    : isPaket
    ? 'Paket_Lengkap_Imigrasi_Alzam'
    : 'Surat_Rekomendasi';
  a.download = `${fileName}_${data.namaLengkap.replace(/\s+/g, '_')}_${data.nik}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Download as pure text
export function exportToPlainText(data: ApplicantData): void {
  const text = formatOfficialLetterText(data);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = data.templateType === 'permohonan_paspor'
    ? 'Surat_Permohonan_Paspor'
    : data.templateType === 'pernyataan_jaminan'
    ? 'Surat_Pernyataan_Jaminan'
    : 'Surat_Rekomendasi';
  a.download = `${fileName}_${data.namaLengkap.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Indonesian Date Formatter
export function getIndonesianCurrentDate(): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const now = new Date();
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

/**
 * Capitalize first letter of each word (Title Case)
 * Handles Indonesian names, addresses, places, and prevents CAPSLOCK output.
 * Preserves standard Indonesian abbreviations (NIK, KK, RT, RW, DKI, WNI, gelar S.T., MBA, dll.)
 */
export function toTitleCase(str: string): string {
  if (!str) return '';

  const preserveUpper = new Set([
    'NIK', 'KK', 'KTP', 'RT', 'RW', 'DKI', 'WNI', 'WNA', 'RI', 'TPI', 'PPIU',
    'ST', 'S.T', 'S.T.', 'BA', 'B.A', 'B.A.', 'MBA', 'M.B.A', 'M.B.A.', 'SE', 'S.E', 'S.E.',
    'SH', 'S.H', 'S.H.', 'SKM', 'S.K.M', 'S.K.M.', 'SP', 'S.P', 'S.P.', 'MM', 'M.M', 'M.M.',
    'PT', 'PT.', 'CV', 'CV.', 'TBK', 'II', 'III', 'IV', 'VI', 'VII', 'VIII', 'IX', 'XI', 'XII',
    'AMW', 'SR', 'KH', 'KH.'
  ]);

  const specificTitleMap: Record<string, string> = {
    'rt': 'RT',
    'rw': 'RW',
    'rt.': 'RT.',
    'rw.': 'RW.',
    'ktp': 'KTP',
    'kk': 'KK',
    'nik': 'NIK',
    'wni': 'WNI',
    'wna': 'WNA',
    'dki': 'DKI',
    'tpi': 'TPI',
    'ppiu': 'PPIU',
    'jl': 'Jl.',
    'jl.': 'Jl.',
    'jln': 'Jln.',
    'jln.': 'Jln.',
    'kp': 'Kp.',
    'kp.': 'Kp.',
    'gg': 'Gg.',
    'gg.': 'Gg.',
    'no': 'No.',
    'no.': 'No.',
    'blok': 'Blok',
    'kel': 'Kel.',
    'kel.': 'Kel.',
    'kec': 'Kec.',
    'kec.': 'Kec.',
    'kab': 'Kab.',
    'kab.': 'Kab.',
    'prov': 'Prov.',
    'prov.': 'Prov.',
    'kh': 'KH.',
    'kh.': 'KH.',
  };

  const particles = new Set(['dan', 'di', 'ke', 'dari', 'yang', 'untuk', 'pada', 'atau', 'bin', 'binti', 'al']);

  return str
    .split(/(\s+|[-/.,:;()])/g)
    .map((word, index) => {
      if (!word || /^\s+$/.test(word) || /^[-/.,:;()]$/.test(word)) return word;
      
      // If purely numbers, leave as-is (e.g. 005, 3604075304950002)
      if (/^\d+$/.test(word)) return word;

      const lower = word.toLowerCase();
      if (specificTitleMap[lower]) {
        return specificTitleMap[lower];
      }

      const upper = word.toUpperCase();
      if (preserveUpper.has(upper)) {
        return upper;
      }

      if (index > 0 && particles.has(lower)) {
        return lower;
      }

      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}

/**
 * Ensures entire ApplicantData object has clean Title Case casing
 * for all human-readable text fields (Name, TTL, Address, etc.)
 */
export function formatApplicantData(data: ApplicantData): ApplicantData {
  return {
    ...data,
    namaLengkap: toTitleCase(data.namaLengkap),
    tempatLahir: toTitleCase(data.tempatLahir),
    tempatTanggalLahir: toTitleCase(data.tempatTanggalLahir),
    alamatKtp: toTitleCase(data.alamatKtp),
    namaKepalaKeluarga: toTitleCase(data.namaKepalaKeluarga),
    pekerjaan: data.pekerjaan ? toTitleCase(data.pekerjaan) : undefined,
    agama: data.agama ? toTitleCase(data.agama) : undefined,
    statusPerkawinan: data.statusPerkawinan ? toTitleCase(data.statusPerkawinan) : undefined,
    tujuanKantorImigrasi: data.tujuanKantorImigrasi ? toTitleCase(data.tujuanKantorImigrasi) : undefined,
    alamatKantorImigrasi: data.alamatKantorImigrasi ? toTitleCase(data.alamatKantorImigrasi) : undefined,
  };
}

// Validate NIK
export function validateNik(nik: string): { isValid: boolean; message: string } {
  const clean = nik.replace(/[^0-9]/g, '');
  if (clean.length !== 16) {
    return {
      isValid: false,
      message: `NIK harus terdiri dari tepat 16 digit angka (saat ini ${clean.length} digit).`
    };
  }
  return { isValid: true, message: 'Format NIK 16 digit valid.' };
}

// Validate KK
export function validateNoKk(kk: string): { isValid: boolean; message: string } {
  const clean = kk.replace(/[^0-9]/g, '');
  if (clean.length !== 16) {
    return {
      isValid: false,
      message: `Nomor KK harus terdiri dari tepat 16 digit angka (saat ini ${clean.length} digit).`
    };
  }
  return { isValid: true, message: 'Format Nomor KK 16 digit valid.' };
}
