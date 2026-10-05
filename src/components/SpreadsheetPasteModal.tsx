import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowRight,
  Sparkles,
  X,
  FileText,
  Building,
  User,
  Calendar,
  MapPin,
  Layers
} from 'lucide-react';
import { ApplicantData, LetterTemplateType } from '../types';
import {
  parseSpreadsheetTextToApplicant,
  USER_SAMPLE_SPREADSHEET_ROW
} from '../utils/spreadsheetParser';

interface SpreadsheetPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData: (data: ApplicantData) => void;
  initialTemplate?: LetterTemplateType;
}

export const SpreadsheetPasteModal: React.FC<SpreadsheetPasteModalProps> = ({
  isOpen,
  onClose,
  onApplyData,
  initialTemplate = 'paket_lengkap_alzam',
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplateType>(initialTemplate);
  const [parseResult, setParseResult] = useState(() =>
    parseSpreadsheetTextToApplicant(USER_SAMPLE_SPREADSHEET_ROW, initialTemplate)
  );

  if (!isOpen) return null;

  const handleTextChange = (text: string) => {
    setInputText(text);
    if (text.trim()) {
      const res = parseSpreadsheetTextToApplicant(text, selectedTemplate);
      setParseResult(res);
    }
  };

  const handleLoadSample = () => {
    setInputText(USER_SAMPLE_SPREADSHEET_ROW);
    const res = parseSpreadsheetTextToApplicant(USER_SAMPLE_SPREADSHEET_ROW, selectedTemplate);
    setParseResult(res);
  };

  const handleTemplateChange = (tpl: LetterTemplateType) => {
    setSelectedTemplate(tpl);
    if (inputText.trim()) {
      const res = parseSpreadsheetTextToApplicant(inputText, tpl);
      setParseResult(res);
    } else if (parseResult.data) {
      setParseResult((prev) => ({
        ...prev,
        data: prev.data ? { ...prev.data, templateType: tpl } : undefined,
      }));
    }
  };

  const handleApply = () => {
    const textToUse = inputText.trim() || USER_SAMPLE_SPREADSHEET_ROW;
    const res = parseSpreadsheetTextToApplicant(textToUse, selectedTemplate);
    if (res.isValid && res.data) {
      onApplyData(res.data);
      onClose();
    }
  };

  const parsed = parseResult.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-emerald-800/60 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Tempel (Paste) Data dari Excel / Spreadsheet
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-semibold">
                  Tanpa KTP &amp; KK
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Salin 1 baris dari tabel Excel atau Google Sheets lalu tempelkan di bawah ini
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Action Bar / Load Sample */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="text-xs text-slate-300">
              Format: <span className="font-mono text-emerald-300 font-bold">17 Kolom (Tab-Delimited)</span> dari Excel.
            </div>

            <button
              type="button"
              onClick={handleLoadSample}
              className="px-3 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 rounded-lg text-xs font-semibold transition-all border border-emerald-600/60 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Isi Contoh Format (Euis Cholishoh)</span>
            </button>
          </div>

          {/* Text Area Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Kotak Input Baris Spreadsheet (Tab-Separated):
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={`Contoh tempel (paste) baris dari Excel:\n3495\t5 Oktober 2026\t7379\t7380\t7379/SR/AMW/X/2026\t7380/SR/AMW/X/2026\tX\t10\tEuis Cholishoh\tEuis Cholishoh\tSerang, 13 April 1995\tSerang, 13 April 1995\t3604075304950002\tKp. Kubang Laban Rt.005, Rw.003...\t16 - 24 November 2026\t"Kepala Kantor Imigrasi Kelas II Cilegon..."`}
              className="w-full bg-slate-950 text-slate-100 font-mono text-xs p-3.5 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600 resize-y"
            />
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Pilih Jenis Dokumen yang Dituju:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTemplateChange('paket_lengkap_alzam')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedTemplate === 'paket_lengkap_alzam'
                    ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                  <Layers className="w-3.5 h-3.5" />
                  Paket 2 Surat Sekaligus
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Permohonan Paspor + Pernyataan &amp; Jaminan (PT. Alzam)
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTemplateChange('permohonan_paspor')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedTemplate === 'permohonan_paspor'
                    ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-400">
                  <FileText className="w-3.5 h-3.5" />
                  Surat Permohonan Paspor
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  No. Surat: {parsed?.nomorSurat || '7379/SR/AMW/X/2026'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTemplateChange('pernyataan_jaminan')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedTemplate === 'pernyataan_jaminan'
                    ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-400">
                  <FileText className="w-3.5 h-3.5" />
                  Surat Pernyataan &amp; Jaminan
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  No. Surat: {parsed?.nomorSuratPernyataan || '7380/SR/AMW/X/2026'}
                </div>
              </button>
            </div>
          </div>

          {/* Live Extracted Preview Card */}
          {parseResult.isValid && parsed && (
            <div className="bg-slate-950/80 border border-emerald-800/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Hasil Penguraian Kolom Excel (Otomatis):
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {parseResult.rawColumns.length} Kolom Terdeteksi
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Nama Jamaah
                  </span>
                  <span className="font-bold text-white text-sm">
                    {parsed.namaLengkap}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    NIK Pemohon
                  </span>
                  <span className="font-mono text-amber-300 font-bold">
                    {parsed.nik}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Tempat, Tanggal Lahir
                  </span>
                  <span className="font-semibold text-slate-200">
                    {parsed.tempatTanggalLahir}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    No. Surat Permohonan
                  </span>
                  <span className="font-mono text-emerald-300 font-bold">
                    {parsed.nomorSurat}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    No. Surat Jaminan
                  </span>
                  <span className="font-mono text-emerald-300 font-bold">
                    {parsed.nomorSuratPernyataan || '-'}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Jadwal Keberangkatan
                  </span>
                  <span className="font-semibold text-slate-200">
                    {parsed.jadwalKeberangkatanDanKepulangan}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 sm:col-span-2 md:col-span-3">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Tujuan Kantor Imigrasi
                  </span>
                  <span className="font-bold text-white block">
                    {parsed.tujuanKantorImigrasi}
                  </span>
                  <span className="text-slate-400 text-[11px] block mt-0.5">
                    {parsed.alamatKantorImigrasi}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 sm:col-span-2 md:col-span-3">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Alamat Lengkap KTP
                  </span>
                  <span className="text-slate-300">
                    {parsed.alamatKtp}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!parseResult.isValid && parseResult.error && (
            <div className="bg-rose-950/60 border border-rose-800/60 rounded-xl p-3 text-xs text-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{parseResult.error}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all border border-slate-700"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={!parseResult.isValid || !parseResult.data}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Terapkan &amp; Buka Pratinjau Surat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
