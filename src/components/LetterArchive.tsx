import React, { useState } from 'react';
import {
  History,
  Search,
  Trash2,
  Eye,
  Download,
  Calendar,
  CreditCard,
  MapPin,
  Plane,
  FileText,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { LetterRecord } from '../types';
import { exportArchiveToExcel } from '../utils/excelExporter';

interface LetterArchiveProps {
  archive: LetterRecord[];
  onOpenRecord: (record: LetterRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export const LetterArchive: React.FC<LetterArchiveProps> = ({
  archive,
  onOpenRecord,
  onDeleteRecord,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = archive.filter((rec) => {
    const q = searchTerm.toLowerCase();
    return (
      rec.namaLengkap.toLowerCase().includes(q) ||
      rec.nik.includes(q) ||
      rec.nomorSurat.toLowerCase().includes(q) ||
      rec.negaraTujuan.toLowerCase().includes(q)
    );
  });

  const handleExportExcel = () => {
    exportArchiveToExcel(archive);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full w-fit mb-2">
            <History className="w-3.5 h-3.5" />
            Buku Arsip &amp; Rekapitulasi PT. Alzam Mandiri Wisata
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Riwayat &amp; Monitoring Surat Rekomendasi / Jaminan Terbit
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring rekam jejak surat pemohon paspor secara offline. Seluruh data dapat diunduh ke format resmi <strong>Microsoft Excel (.xlsx)</strong> untuk arsip operasional travel.
          </p>
        </div>

        {archive.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-4 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer hover:scale-[1.02] active:scale-95 ring-1 ring-teal-400/50"
              title="Unduh rekapitulasi seluruh data surat dalam file Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Ekspor Rekap Excel (.xlsx)</span>
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className="px-3.5 py-2.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus Semua
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari berdasarkan nama pemohon, NIK 16 digit, nomor surat, atau negara tujuan..."
          className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
        />
      </div>

      {/* Records Table or Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-700">
            {searchTerm ? 'Tidak ada surat yang cocok dengan pencarian' : 'Belum ada arsip surat rekomendasi'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            {searchTerm
              ? 'Coba gunakan kata kunci lain seperti NIK atau sebagian nama pemohon.'
              : 'Pindai KTP & KK pemohon di tab pertama, lalu klik "Simpan ke Arsip" pada pratinjau surat.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {item.nomorSurat}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1">
                      {item.namaLengkap}
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3" />
                    {item.tanggalSurat}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono font-semibold">{item.nik}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 truncate">KK: {item.nomorKk}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Plane className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold text-slate-800">{item.negaraTujuan}</span>
                    <span className="text-slate-400">({item.estimasiKeberangkatan})</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-slate-500 line-clamp-1">{item.alamatKtp}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => exportArchiveToExcel([item], `Surat_${(item.nomorSurat || 'Arsip').replace(/[^a-zA-Z0-9_-]/g, '_')}_${(item.namaLengkap || 'Pemohon').replace(/\s+/g, '_')}.xlsx`)}
                    className="px-2.5 py-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    title="Unduh data surat ini ke file Excel (.xlsx)"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>.xlsx</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteRecord(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs cursor-pointer"
                    title="Hapus dari arsip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenRecord(item)}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Buka &amp; Cetak Surat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
