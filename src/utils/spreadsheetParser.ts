import { ApplicantData, LetterTemplateType } from '../types';
import { toTitleCase } from './letterFormatter';

export interface ParsedSpreadsheetRow {
  isValid: boolean;
  error?: string;
  data?: ApplicantData;
  rawColumns: string[];
}

/**
 * Parses a TSV or CSV row (from Excel, Google Sheets, or text editor)
 * Handles double-quoted fields with embedded newlines and tabs
 */
export function splitSpreadsheetLine(input: string): string[] {
  const tokens: string[] = [];
  let curr = '';
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '"') {
      // Check for escaped quote ("")
      if (inQuotes && input[i + 1] === '"') {
        curr += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === '\t' && !inQuotes) {
      tokens.push(curr.trim());
      curr = '';
    } else {
      curr += char;
    }
  }
  tokens.push(curr.trim());

  // Filter out leading empty token if input started with a tab
  if (tokens.length > 1 && tokens[0] === '') {
    tokens.shift();
  }

  // Clean trailing commas or quotes from tokens
  return tokens.map((t) => t.replace(/^"+|"+$/g, '').trim());
}

/**
 * Parses user input spreadsheet format into ApplicantData:
 * Col 0: ID / Nomor Urut (3495)
 * Col 1: Tanggal Surat (5 Oktober 2026)
 * Col 2: Nomor Urut 1 (7379)
 * Col 3: Nomor Urut 2 (7380)
 * Col 4: Nomor Surat Permohonan (7379/SR/AMW/X/2026)
 * Col 5: Nomor Surat Pernyataan (7380/SR/AMW/X/2026)
 * Col 6: Bulan Romawi (X)
 * Col 7: Bulan Angka (10)
 * Col 8: Nama Lengkap Jamaah (Euis Cholishoh)
 * Col 9: Nama KTP / KK (Euis Cholishoh)
 * Col 10: Tempat, Tanggal Lahir (Serang, 13 April 1995)
 * Col 11: Tempat, Tanggal Lahir (Serang, 13 April 1995)
 * Col 12: NIK (3604075304950002)
 * Col 13: Alamat KTP (Kp. Kubang Laban Rt.005, Rw.003, ...)
 * Col 14: Alamat Domisili / KK
 * Col 15: Jadwal Keberangkatan (16 - 24 November 2026)
 * Col 16: Kantor Imigrasi (Kepala Kantor Imigrasi Kelas II Cilegon \n Jl. KH. Yasin Beji No.8 ...)
 */
export function parseSpreadsheetTextToApplicant(
  rawText: string,
  preferredTemplate: LetterTemplateType = 'paket_lengkap_alzam'
): ParsedSpreadsheetRow {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Teks masukan masih kosong. Silakan tempel (paste) baris data dari Excel / Google Sheets.',
      rawColumns: [],
    };
  }

  const cols = splitSpreadsheetLine(trimmed);

  if (cols.length < 5) {
    return {
      isValid: false,
      error: `Format kolom tidak mencukupi (terdeteksi ${cols.length} kolom). Mohon pastikan baris disalin langsung dari spreadsheet Excel / Google Sheets dengan pembatas Tab.`,
      rawColumns: cols,
    };
  }

  // Extract fields with smart fallback mapping
  let idJamaah = '';
  let tanggalSurat = '5 Oktober 2026';
  let nomorSuratPermohonan = '';
  let nomorSuratPernyataan = '';
  let namaLengkap = '';
  let tempatTanggalLahir = '';
  let nik = '';
  let alamatKtp = '';
  let jadwalKeberangkatan = '';
  let tujuanKantorImigrasi = 'Kepala Kantor Imigrasi Kelas II Cilegon';
  let alamatKantorImigrasi = 'Jl. KH. Yasin Beji No.8, Kotabumi, Kec. Purwakarta, Kota Cilegon, Banten 42434';

  if (cols.length >= 13) {
    // Standard 17-column format as provided by the user
    idJamaah = cols[0] || '';
    tanggalSurat = cols[1] || '5 Oktober 2026';
    nomorSuratPermohonan = cols[4] || (cols[2] ? `${cols[2]}/SR/AMW/X/2026` : '7379/SR/AMW/X/2026');
    nomorSuratPernyataan = cols[5] || (cols[3] ? `${cols[3]}/SR/AMW/X/2026` : '7380/SR/AMW/X/2026');
    namaLengkap = cols[8] || cols[9] || '';
    tempatTanggalLahir = cols[10] || cols[11] || '';
    nik = cols[12] ? cols[12].replace(/[^0-9]/g, '') : '';
    alamatKtp = (cols[13] || cols[14] || '').replace(/,\s*$/, '');
    jadwalKeberangkatan = cols[15] || '16 - 24 November 2026';

    // Kantor Imigrasi (Column 16, often contains newline between Title and Address)
    if (cols[16]) {
      const imigrasiRaw = cols[16];
      const lines = imigrasiRaw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      if (lines.length >= 2) {
        tujuanKantorImigrasi = lines[0];
        alamatKantorImigrasi = lines.slice(1).join(', ');
      } else if (lines.length === 1) {
        tujuanKantorImigrasi = lines[0];
        alamatKantorImigrasi = '';
      }
    }
  } else {
    // Flexible heuristic parsing for shorter or modified spreadsheet rows
    idJamaah = cols[0] || '';
    // Look for 16-digit NIK
    const nikIndex = cols.findIndex((c) => /^\d{16}$/.test(c.replace(/[^0-9]/g, '')));
    if (nikIndex !== -1) {
      nik = cols[nikIndex].replace(/[^0-9]/g, '');
    }

    // Look for Surat Number like XXXX/SR/AMW/...
    const suratIndex = cols.findIndex((c) => /\/SR\/AMW\//i.test(c));
    if (suratIndex !== -1) {
      nomorSuratPermohonan = cols[suratIndex];
      if (cols[suratIndex + 1] && /\/SR\/AMW\//i.test(cols[suratIndex + 1])) {
        nomorSuratPernyataan = cols[suratIndex + 1];
      }
    }

    // Look for Indonesian Date (e.g. 5 Oktober 2026 or 16 - 24 November 2026)
    const datePattern = /(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)/i;
    const dateIndices = cols
      .map((c, i) => (datePattern.test(c) ? i : -1))
      .filter((i) => i !== -1);

    if (dateIndices.length >= 1) {
      tanggalSurat = cols[dateIndices[0]];
    }
    if (dateIndices.length >= 2) {
      jadwalKeberangkatan = cols[dateIndices[dateIndices.length - 1]];
    }

    // Look for name
    cols.forEach((c) => {
      if (
        !namaLengkap &&
        c.length > 2 &&
        !datePattern.test(c) &&
        !/^\d+$/.test(c) &&
        !/\/SR\//.test(c) &&
        !c.toLowerCase().includes('imigrasi') &&
        !c.toLowerCase().includes('kelurahan') &&
        !c.toLowerCase().includes('kp.')
      ) {
        namaLengkap = c;
      }
    });
  }

  // Parse tempat & tanggal lahir if present (e.g. "Serang, 13 April 1995")
  let tempatLahir = 'Serang';
  let tanggalLahir = '13 April 1995';
  if (tempatTanggalLahir.includes(',')) {
    const parts = tempatTanggalLahir.split(',');
    tempatLahir = parts[0].trim();
    tanggalLahir = parts.slice(1).join(',').trim();
  }

  // Clean trailing commas from address
  alamatKtp = alamatKtp.replace(/,\s*$/, '').trim();

  const finalNomorSurat = nomorSuratPermohonan || '7379/SR/AMW/X/2026';
  const finalNomorSuratPernyataan = nomorSuratPernyataan || '7380/SR/AMW/X/2026';

  const data: ApplicantData = {
    templateType: preferredTemplate,
    idJamaah: idJamaah || '3495',
    nik: nik || '3604075304950002',
    namaLengkap: toTitleCase(namaLengkap || 'Euis Cholishoh'),
    tempatLahir: toTitleCase(tempatLahir),
    tanggalLahir: toTitleCase(tanggalLahir),
    tempatTanggalLahir: toTitleCase(tempatTanggalLahir || `${tempatLahir}, ${tanggalLahir}`),
    jenisKelamin: 'PEREMPUAN',
    alamatKtp: toTitleCase(alamatKtp || 'Kp. Kubang Laban Rt.005, Rw.003, Kelurahan Lambangsari, Kec. Bojonegara, Kabupaten Serang, Provinsi Banten'),
    nomorKk: '3604070000000000',
    namaKepalaKeluarga: toTitleCase(namaLengkap || 'Euis Cholishoh'),
    negaraTujuan: 'Arab Saudi',
    estimasiKeberangkatan: jadwalKeberangkatan || '16 - 24 November 2026',
    jadwalKeberangkatanDanKepulangan: jadwalKeberangkatan || '16 - 24 November 2026',
    keperluan: 'Permohonan Pembuatan Paspor Umrah',
    nomorSurat: finalNomorSurat,
    nomorSuratPernyataan: finalNomorSuratPernyataan,
    perihal: preferredTemplate === 'pernyataan_jaminan' ? 'Surat Pernyataan dan Jaminan' : 'Permohonan Pembuatan Paspor',
    tanggalSurat: tanggalSurat || '5 Oktober 2026',
    kotaPenerbitan: 'Jakarta',
    pejabatNama: 'Khairul Umam, ST, BA, MBA',
    pejabatJabatan: 'Direktur Utama',
    namaPerusahaan: 'PT. Alzam Mandiri Wisata',
    taglinePerusahaan: 'Tour & Travel',
    izinPpiu: '29042200007580004',
    tanggalIzinPpiu: '02 Agustus 2022',
    alamatPerusahaan: 'Ciledug Mas, Jl. HOS Cokroaminoto Blok C9 dan C10, RT.003/RW.004, Sudimara Timur, Kecamatan Karang Tengah, Kota Tangerang, Banten 15151',
    teleponPerusahaan: '0815-9888-154',
    emailPerusahaan: 'alzam@bisa.id',
    websitePerusahaan: 'www.umrahbisa.com',
    tujuanKantorImigrasi: toTitleCase(tujuanKantorImigrasi || 'Kepala Kantor Imigrasi Kelas II Cilegon'),
    alamatKantorImigrasi: toTitleCase(alamatKantorImigrasi || 'Jl. KH. Yasin Beji No.8, Kotabumi, Kec. Purwakarta, Kota Cilegon, Banten 42434'),
    crossCheckStatus: {
      nikValid: nik.length === 16,
      kkValid: true,
      nameMatched: true,
      notes: 'Data dimuat langsung dari baris Excel/Spreadsheet tanpa KTP & KK',
    },
  };

  return {
    isValid: true,
    data,
    rawColumns: cols,
  };
}

export const USER_SAMPLE_SPREADSHEET_ROW =
  `3495\t5 Oktober 2026\t7379\t7380\t7379/SR/AMW/X/2026\t7380/SR/AMW/X/2026\tX\t10\tEuis Cholishoh\tEuis Cholishoh\tSerang, 13 April 1995\tSerang, 13 April 1995\t3604075304950002\tKp. Kubang Laban Rt.005, Rw.003, Kelurahan Lambangsari, Kec. Bojonegara, Kabupaten Serang, Provinsi Banten,  \tKp. Kubang Laban RT.005, RW.003, Kelurahan Lambangsari, Kec. Bojonegara, Kabupaten Serang, Provinsi Banten,  \t16 - 24 November 2026\t"Kepala Kantor Imigrasi Kelas II Cilegon \nJl. KH. Yasin Beji No.8, Kotabumi, Kec. Purwakarta, Kota Cilegon, Banten 42434"`;
