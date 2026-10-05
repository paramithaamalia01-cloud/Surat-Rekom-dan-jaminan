import * as XLSX from 'xlsx';
import { LetterRecord } from '../types';
import { toTitleCase } from './letterFormatter';

/**
 * Exports archive data into native Microsoft Excel (.xlsx) format
 * perfectly suited for operational monitoring at PT. Alzam Mandiri Wisata.
 * 
 * Features:
 * - Proper text types for NIK & KK (prevents Excel scientific notation 1.90201E+15)
 * - Auto-adjusted column widths for clear readability
 * - Formatted header row with Indonesian operational terms
 * - Worksheet named 'Rekap Surat PT Alzam'
 */
export function exportArchiveToExcel(records: LetterRecord[], filename?: string): void {
  if (!records || records.length === 0) {
    alert('Belum ada data surat dalam arsip untuk diekspor ke Excel.');
    return;
  }

  // 1. Prepare table data matrix (Array of Arrays)
  const headers = [
    'No',
    'Tanggal Surat',
    'Nomor Surat Permohonan',
    'Nomor Surat Pernyataan',
    'Nama Lengkap Jamaah',
    'NIK (KTP)',
    'Nomor KK',
    'Tempat, Tanggal Lahir',
    'Jenis Kelamin',
    'Alamat KTP Lengkap',
    'Jadwal Keberangkatan & Kepulangan',
    'Negara Tujuan',
    'Keperluan / Dokumen',
    'Tujuan Kantor Imigrasi',
    'Alamat Kantor Imigrasi',
    'Penyelenggara Travel',
    'Izin PPIU Kemenag',
    'Nama Direktur Utama',
    'Waktu Simpan Database',
  ];

  const dataRows = records.map((r, index) => {
    const nomorPermohonan = r.nomorSurat || '-';
    const nomorPernyataan =
      r.nomorSuratPernyataan ||
      (r.templateType === 'paket_lengkap_alzam'
        ? nomorPermohonan.replace(/^\d+/, (m) => String(Number(m) + 1))
        : nomorPermohonan);

    return [
      index + 1,
      r.tanggalSurat || '-',
      nomorPermohonan,
      nomorPernyataan,
      toTitleCase(r.namaLengkap || '-'),
      r.nik ? String(r.nik) : '-', // formatted as text string
      r.nomorKk ? String(r.nomorKk) : '-',
      toTitleCase(r.tempatTanggalLahir || `${r.tempatLahir || ''}, ${r.tanggalLahir || ''}`.trim() || '-'),
      r.jenisKelamin || 'LAKI-LAKI',
      toTitleCase(r.alamatKtp || '-'),
      r.jadwalKeberangkatanDanKepulangan || r.estimasiKeberangkatan || '-',
      r.negaraTujuan || 'Arab Saudi',
      r.keperluan || 'Permohonan Pembuatan Paspor Umrah',
      r.tujuanKantorImigrasi || 'Kepala Kantor Imigrasi Kelas II TPI Tanjung Pandan',
      r.alamatKantorImigrasi || '-',
      r.namaPerusahaan || 'PT. Alzam Mandiri Wisata',
      r.izinPpiu || '29042200007580004',
      r.pejabatNama || 'Khairul Umam, S.T, B.A, MBA',
      r.createdAt ? new Date(r.createdAt).toLocaleString('id-ID') : new Date().toLocaleString('id-ID'),
    ];
  });

  const fullData = [headers, ...dataRows];

  // 2. Create worksheet from Array of Arrays
  const worksheet = XLSX.utils.aoa_to_sheet(fullData);

  // 3. Ensure NIK and KK columns (columns 5 and 6) are explicitly typed as string 's'
  // to avoid Excel stripping leading zeros or rendering as exponential numbers
  for (let rowIndex = 1; rowIndex <= records.length; rowIndex++) {
    // Column E (NIK) index 5 -> 'F' in 1-based or coordinate {r, c}
    const nikCellRef = XLSX.utils.encode_cell({ r: rowIndex, c: 5 });
    if (worksheet[nikCellRef]) {
      worksheet[nikCellRef].t = 's';
      worksheet[nikCellRef].z = '@'; // Text format
    }

    // Column F (KK) index 6 -> 'G'
    const kkCellRef = XLSX.utils.encode_cell({ r: rowIndex, c: 6 });
    if (worksheet[kkCellRef]) {
      worksheet[kkCellRef].t = 's';
      worksheet[kkCellRef].z = '@';
    }
  }

  // 4. Set custom column widths for clean readability
  worksheet['!cols'] = [
    { wch: 5 },  // No
    { wch: 16 }, // Tanggal Surat
    { wch: 25 }, // No Surat Permohonan
    { wch: 25 }, // No Surat Pernyataan
    { wch: 28 }, // Nama Lengkap
    { wch: 20 }, // NIK
    { wch: 20 }, // KK
    { wch: 28 }, // TTL
    { wch: 14 }, // Gender
    { wch: 45 }, // Alamat
    { wch: 26 }, // Jadwal
    { wch: 14 }, // Negara
    { wch: 30 }, // Keperluan
    { wch: 35 }, // Tujuan Imigrasi
    { wch: 45 }, // Alamat Imigrasi
    { wch: 26 }, // Penyelenggara
    { wch: 20 }, // Izin PPIU
    { wch: 26 }, // Pejabat
    { wch: 20 }, // Waktu Dibuat
  ];

  // 5. Create workbook and append sheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Surat PT Alzam');

  // 6. Generate filename with date stamp and trigger native .xlsx file download
  const dateStr = new Date().toISOString().slice(0, 10);
  const finalFilename = filename || `Rekap_Surat_Paspor_PT_Alzam_Mandiri_Wisata_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, finalFilename);
}
