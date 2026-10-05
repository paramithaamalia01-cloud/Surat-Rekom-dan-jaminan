import React, { useState, useRef } from 'react';
import {
  Upload,
  FileCheck,
  Sparkles,
  AlertCircle,
  Eye,
  Trash2,
  Plane,
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
  X,
  FileText,
  Building2,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import { UploadedFiles, ApplicantData, LetterTemplateType } from '../types';
import { DEMO_PROFILES, generateKtpImage, generateKkImage } from '../utils/sampleDocuments';
import {
  parseSpreadsheetTextToApplicant,
  USER_SAMPLE_SPREADSHEET_ROW
} from '../utils/spreadsheetParser';
import { toTitleCase } from '../utils/letterFormatter';

interface DocumentUploaderProps {
  files: UploadedFiles;
  setFiles: React.Dispatch<React.SetStateAction<UploadedFiles>>;
  onExtractionSuccess: (data: ApplicantData) => void;
  onDirectPreview?: (data: ApplicantData) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (loading: boolean) => void;
  errorMsg: string | null;
  setErrorMsg: (msg: string | null) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  files,
  setFiles,
  onExtractionSuccess,
  onDirectPreview,
  isAnalyzing,
  setIsAnalyzing,
  errorMsg,
  setErrorMsg,
}) => {
  // Input method mode: 'files' (Upload KTP/KK) vs 'spreadsheet' (Paste Excel row directly)
  const [inputMode, setInputMode] = useState<'files' | 'spreadsheet'>('files');
  const [spreadsheetText, setSpreadsheetText] = useState<string>('');
  const [parsedSpreadsheet, setParsedSpreadsheet] = useState(() =>
    parseSpreadsheetTextToApplicant(USER_SAMPLE_SPREADSHEET_ROW, 'paket_lengkap_alzam')
  );

  // Template selection: default to 'paket_lengkap_alzam' or 'pernyataan_jaminan'
  const [templateType, setTemplateType] = useState<LetterTemplateType>('paket_lengkap_alzam');

  // Travel inputs
  const [country, setCountry] = useState<string>('Arab Saudi');
  const [customCountry, setCustomCountry] = useState<string>('');
  const [departureMonth, setDepartureMonth] = useState<string>('12 - 23 Januari 2026');
  const [purpose, setPurpose] = useState<string>('Surat Pernyataan dan Jaminan Paspor Umrah');
  const [zoomImage, setZoomImage] = useState<{ title: string; src: string } | null>(null);

  // Drag and drop state for photos with enter counters to prevent flickering
  const [isDraggingKtp, setIsDraggingKtp] = useState<boolean>(false);
  const [isDraggingKk, setIsDraggingKk] = useState<boolean>(false);
  const ktpDragCounter = useRef<number>(0);
  const kkDragCounter = useRef<number>(0);

  const ktpInputRef = useRef<HTMLInputElement>(null);
  const kkInputRef = useRef<HTMLInputElement>(null);

  // Prevent browser from opening dropped files in new tab when dropped outside zone
  React.useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('dragover', preventDefaults, false);
    window.addEventListener('drop', preventDefaults, false);

    return () => {
      window.removeEventListener('dragover', preventDefaults, false);
      window.removeEventListener('drop', preventDefaults, false);
    };
  }, []);

  // Quick country presets
  const countryPresets = [
    { label: 'Arab Saudi (Umroh)', val: 'Arab Saudi' },
    { label: 'Jepang', val: 'Jepang' },
    { label: 'Turki', val: 'Turki' },
    { label: 'Eropa Barat', val: 'Eropa Barat' },
    { label: 'Lainnya...', val: 'custom' },
  ];

  // Helper to test if file is an image
  const isImageFile = (file: File): boolean => {
    if (!file) return false;
    if (file.type && (file.type.startsWith('image/') || file.type === 'application/pdf')) return true;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'jfif', 'heic', 'tif', 'tiff', 'svg'].includes(ext);
  };

  // Helper to read file to Base64
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processKtpFile = async (file: File) => {
    if (!file) return;
    if (!isImageFile(file)) {
      setErrorMsg('Harap masukkan berkas foto / gambar KTP (JPG, JPEG, PNG, WEBP).');
      return;
    }
    try {
      const base64 = await readFileAsBase64(file);
      setFiles((prev) => ({
        ...prev,
        ktpBase64: base64,
        ktpName: file.name,
      }));
      setErrorMsg(null);
    } catch {
      setErrorMsg('Gagal membaca berkas KTP.');
    }
  };

  const processKkFile = async (file: File) => {
    if (!file) return;
    if (!isImageFile(file)) {
      setErrorMsg('Harap masukkan berkas foto / gambar Kartu Keluarga (JPG, JPEG, PNG, WEBP).');
      return;
    }
    try {
      const base64 = await readFileAsBase64(file);
      setFiles((prev) => ({
        ...prev,
        kkBase64: base64,
        kkName: file.name,
      }));
      setErrorMsg(null);
    } catch {
      setErrorMsg('Gagal membaca berkas KK.');
    }
  };

  const handleKtpUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processKtpFile(file);
    }
  };

  const handleKkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processKkFile(file);
    }
  };

  const handleKtpDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    ktpDragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDraggingKtp(true);
    }
  };

  const handleKtpDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingKtp) {
      setIsDraggingKtp(true);
    }
  };

  const handleKtpDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    ktpDragCounter.current -= 1;
    if (ktpDragCounter.current <= 0) {
      ktpDragCounter.current = 0;
      setIsDraggingKtp(false);
    }
  };

  const handleKtpDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    ktpDragCounter.current = 0;
    setIsDraggingKtp(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processKtpFile(file);
    }
  };

  const handleKkDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    kkDragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDraggingKk(true);
    }
  };

  const handleKkDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingKk) {
      setIsDraggingKk(true);
    }
  };

  const handleKkDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    kkDragCounter.current -= 1;
    if (kkDragCounter.current <= 0) {
      kkDragCounter.current = 0;
      setIsDraggingKk(false);
    }
  };

  const handleKkDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    kkDragCounter.current = 0;
    setIsDraggingKk(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processKkFile(file);
    }
  };

  // 1-Click Load Demo Profile
  const handleLoadDemo = (profileIndex = 0) => {
    const profile = DEMO_PROFILES[profileIndex] || DEMO_PROFILES[0];
    const ktpDataUrl = generateKtpImage(profile);
    const kkDataUrl = generateKkImage(profile);

    setFiles({
      ktpBase64: ktpDataUrl,
      ktpName: `KTP_${profile.ktpData.nama.replace(/\s+/g, '_')}.png`,
      kkBase64: kkDataUrl,
      kkName: `KK_No_${profile.kkData.noKk}.png`,
    });

    if (profile.id === 'shofiyullah-alzam') {
      setTemplateType('pernyataan_jaminan');
    } else {
      setTemplateType('rekomendasi');
    }

    setCountry(profile.country);
    setDepartureMonth(profile.departure);
    setPurpose(profile.purpose);
    setErrorMsg(null);
  };

  const handleSpreadsheetChange = (val: string) => {
    setSpreadsheetText(val);
    if (val.trim()) {
      setParsedSpreadsheet(parseSpreadsheetTextToApplicant(val, templateType));
    }
  };

  const handleLoadSampleSpreadsheet = () => {
    setSpreadsheetText(USER_SAMPLE_SPREADSHEET_ROW);
    setParsedSpreadsheet(parseSpreadsheetTextToApplicant(USER_SAMPLE_SPREADSHEET_ROW, templateType));
  };

  const handleApplySpreadsheet = (directToPreview = true) => {
    const textToUse = spreadsheetText.trim() || USER_SAMPLE_SPREADSHEET_ROW;
    const res = parseSpreadsheetTextToApplicant(textToUse, templateType);
    if (res.isValid && res.data) {
      if (directToPreview && onDirectPreview) {
        onDirectPreview(res.data);
      } else {
        onExtractionSuccess(res.data);
      }
    }
  };

  // Clean up error message into user-friendly Indonesian
  const formatErrorMessage = (raw: string): string => {
    if (!raw) return 'Terjadi kesalahan saat memproses dokumen.';
    if (raw.includes('503') || raw.includes('high demand') || raw.includes('UNAVAILABLE')) {
      return 'Server AI Google Gemini sedang mengalami lonjakan antrean sementara (503 High Demand). Silakan klik "Coba Lagi" atau gunakan opsi "Lanjut dengan Draf Cerdas".';
    }
    if (raw.includes('429') || raw.includes('RESOURCE_EXHAUSTED')) {
      return 'Kuota harian AI sedang sibuk sementara. Silakan coba kembali dalam beberapa saat.';
    }
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.error?.message) {
        return formatErrorMessage(parsed.error.message);
      }
    } catch {
      // not json
    }
    return raw;
  };

  // Submit documents to analysis endpoint
  const handleStartAnalysis = async () => {
    if (!files.ktpBase64 && !files.kkBase64) {
      setErrorMsg('Mohon unggah dokumen KTP dan Kartu Keluarga (KK) terlebih dahulu.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    const selectedCountry = country === 'custom' ? (customCountry || 'Arab Saudi') : country;

    try {
      const res = await fetch('/api/analyze-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ktpImage: files.ktpBase64,
          kkImage: files.kkBase64,
          country: selectedCountry,
          departureMonth,
          purpose,
          templateType,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Terjadi kesalahan saat memproses dokumen.');
      }

      const data = json.data;
      onExtractionSuccess({
        ...data,
        namaLengkap: toTitleCase(data.namaLengkap),
        tempatLahir: toTitleCase(data.tempatLahir),
        tempatTanggalLahir: toTitleCase(data.tempatTanggalLahir),
        alamatKtp: toTitleCase(data.alamatKtp),
        namaKepalaKeluarga: toTitleCase(data.namaKepalaKeluarga),
        templateType,
      });
    } catch (err: any) {
      console.error('Extraction error:', err);
      const friendly = formatErrorMessage(err.message || String(err));
      setErrorMsg(friendly);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Fallback to manual verification draft with clean Title Case
  const handleProceedWithDraft = () => {
    const isAlzam = templateType === 'permohonan_paspor' || templateType === 'pernyataan_jaminan' || templateType === 'paket_lengkap_alzam';
    onExtractionSuccess({
      templateType,
      nik: isAlzam ? '1902013011990002' : '3174051203920003',
      namaLengkap: isAlzam ? 'Shofiyullah Achmad Maksun' : 'Ahmad Fauzi Pratama',
      tempatLahir: isAlzam ? 'Jepara' : 'Jakarta',
      tanggalLahir: isAlzam ? '30 November 1999' : '12-03-1992',
      tempatTanggalLahir: isAlzam ? 'Jepara, 30 November 1999' : 'Jakarta, 12-03-1992',
      jenisKelamin: 'LAKI-LAKI',
      alamatKtp: isAlzam ? 'Jl. Air Ketekok Gg. Pinang RT/RW: 02/004 Kel/Desa: Air Ketekok, Kec. Tanjung Pandan' : 'Jl. Tebet Timur Dalam VII No. 14, Jakarta Selatan',
      nomorKk: isAlzam ? '1902012005080003' : '3174052908150002',
      namaKepalaKeluarga: isAlzam ? 'Achmad Maksun' : 'Ahmad Fauzi Pratama',
      negaraTujuan: country === 'custom' ? (customCountry || 'Arab Saudi') : country,
      estimasiKeberangkatan: departureMonth,
      jadwalKeberangkatanDanKepulangan: departureMonth,
      keperluan: purpose,
      nomorSurat: isAlzam ? '7378/SR/AMW/X/2026' : '7378/SR/AMW/X/2026',
      perihal: templateType === 'pernyataan_jaminan' ? 'Surat Pernyataan dan Jaminan' : 'Permohonan Pembuatan Paspor',
      tanggalSurat: '5 Oktober 2026',
      kotaPenerbitan: 'Jakarta',
      pejabatNama: 'Khairul Umam, S.T, B.A, MBA',
      pejabatJabatan: 'Direktur Utama',
      namaPerusahaan: 'PT. Alzam Mandiri Wisata',
      taglinePerusahaan: 'Tour & Travel',
      izinPpiu: '29042200007580004',
      alamatPerusahaan: 'Ciledug Mas, Jl. HOS Cokroaminoto Blok C9 dan C10, RT.003/RW.004, Sudimara Timur, Kecamatan Karang Tengah, Kota Tangerang, Banten 15151',
      tujuanKantorImigrasi: 'Kepala Kantor Imigrasi Kelas II TPI Tanjung Pandan',
      alamatKantorImigrasi: 'Jl. Jendral Sudirman Km. 6,5, Desa Perawas, Kec. Tanjung Pandan, Kabupaten Belitung, Kepulauan Bangka Belitung 33413.',
      tanggalIzinPpiu: '02 Agustus 2022',
      teleponPerusahaan: '0815-9888-154',
      emailPerusahaan: 'alzam@bisa.id',
      websitePerusahaan: 'www.umrahbisa.com',
    });
    setErrorMsg(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Intro Hero Banner */}
      <div className="bg-gradient-to-r from-[#1B3024] via-[#244030] to-[#1B3024] border border-[#3D604C] rounded-2xl p-6 sm:p-8 shadow-xl text-[#FAF7F2] relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#557A64]/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3D604C] border border-[#557A64] text-[#FAF7F2] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#E68F65]" />
            Generator Surat Pernyataan &amp; Rekomendasi Paspor Imigrasi
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FAF7F2]">
            Pindai Identitas KTP &amp; KK Pemohon Paspor / Umrah
          </h1>
          <p className="text-sm text-[#D4E2D7] leading-relaxed">
            Sistem ekstraksi otomatis dokumen KTP dan Kartu Keluarga (KK). Menghasilkan surat resmi siap cetak format <strong className="text-[#E68F65]">Surat Pernyataan dan Jaminan (PT. Alzam Mandiri Wisata)</strong> sesuai standar Ditjen Imigrasi Kemenkumham RI.
          </p>
        </div>
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div className="bg-red-950/80 border border-red-500/50 rounded-xl p-4 text-red-200 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md animate-shake">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-300">Pemberitahuan Sistem (AI Service Status)</h4>
              <p className="text-xs mt-0.5 text-red-200/90 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={handleStartAnalysis}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-red-800 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
            >
              Coba Lagi
            </button>
            <button
              type="button"
              onClick={handleProceedWithDraft}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
            >
              Lanjut dengan Draf Cerdas
            </button>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-red-400 hover:text-red-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input Method Switcher (KTP/KK vs Direct Excel Spreadsheet vs Direct Manual Entry) */}
      <div className="bg-slate-900 text-white rounded-2xl p-2 border border-slate-800 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setInputMode('files')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              inputMode === 'files'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>1. Foto KTP &amp; KK</span>
          </button>

          <button
            type="button"
            onClick={() => setInputMode('spreadsheet')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              inputMode === 'spreadsheet'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg ring-1 ring-emerald-400/50'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>2. Tempel Baris Excel</span>
          </button>

          <button
            type="button"
            onClick={handleProceedWithDraft}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-all cursor-pointer"
            title="Ketik atau edit data langsung di formulir HP tanpa perlu foto KTP/KK"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>3. Ketik Manual di HP</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* OPSI 2: SPREADSHEET EXCEL DIRECT INPUT PANEL                              */}
      {/* ========================================================================= */}
      {inputMode === 'spreadsheet' && (
        <div className="bg-white rounded-2xl border border-emerald-600/30 p-6 sm:p-7 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Input Cepat Spreadsheet (TSV / Tab-Separated)
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Kolom Masukan Baris Data Excel / Spreadsheet Langsung
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Salin (copy) satu baris dari file Excel Anda dan tempel (paste) ke kotak di bawah. Sistem akan secara otomatis mengurai seluruh 17 kolom (Nomor Surat, Tanggal, Nama Jamaah, NIK, TTL, Alamat, Jadwal, dan Kantor Imigrasi).
              </p>
            </div>

            <button
              type="button"
              onClick={handleLoadSampleSpreadsheet}
              className="px-4 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-xl text-xs font-bold transition-all border border-emerald-700/60 flex items-center gap-2 shrink-0 cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Tempel Contoh Format (Euis Cholishoh)</span>
            </button>
          </div>

          {/* Text Area for Spreadsheet Row */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>Tempelkan Baris Data Excel di Sini:</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  (Mendukung pembatas Tab dari salinan sel spreadsheet)
                </span>
              </label>

              {spreadsheetText && (
                <button
                  type="button"
                  onClick={() => {
                    setSpreadsheetText('');
                    setParsedSpreadsheet(parseSpreadsheetTextToApplicant('', templateType));
                  }}
                  className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Bersihkan
                </button>
              )}
            </div>

            <textarea
              rows={4}
              value={spreadsheetText}
              onChange={(e) => handleSpreadsheetChange(e.target.value)}
              placeholder="Contoh baris Excel:&#10;3495&#9;5 Oktober 2026&#9;7379&#9;7380&#9;7379/SR/AMW/X/2026&#9;7380/SR/AMW/X/2026&#9;X&#9;10&#9;Euis Cholishoh&#9;Euis Cholishoh&#9;Serang, 13 April 1995&#9;Serang, 13 April 1995&#9;3604075304950002&#9;Kp. Kubang Laban Rt.005, Rw.003...&#9;16 - 24 November 2026&#9;&quot;Kepala Kantor Imigrasi Kelas II Cilegon...&quot;"
              className="w-full bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-500 resize-y shadow-inner"
            />
          </div>

          {/* Live Extracted Preview Cards */}
          {parsedSpreadsheet.isValid && parsedSpreadsheet.data && (
            <div className="bg-slate-50 border border-emerald-500/40 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-sm text-slate-900">
                    Hasil Penguraian Kolom Excel (Otomatis):
                  </span>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {parsedSpreadsheet.rawColumns.length} Kolom Terbaca Sempurna
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {/* Nama Jamaah */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                    Nama Jamaah (Pemohon)
                  </span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                    {parsedSpreadsheet.data.namaLengkap}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                    ID Jamaah: {parsedSpreadsheet.data.idJamaah || '3495'}
                  </span>
                </div>

                {/* NIK */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                    NIK Pemohon (16 Digit)
                  </span>
                  <span className="font-mono text-emerald-800 font-bold text-sm mt-0.5 block">
                    {parsedSpreadsheet.data.nik}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                    Validitas Format: Sesuai
                  </span>
                </div>

                {/* TTL */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                    Tempat, Tanggal Lahir
                  </span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {parsedSpreadsheet.data.tempatTanggalLahir}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Tgl Surat: {parsedSpreadsheet.data.tanggalSurat}
                  </span>
                </div>

                {/* Nomor Surat Permohonan */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                    No. Surat Permohonan (Alzam)
                  </span>
                  <span className="font-mono text-slate-900 font-bold mt-0.5 block">
                    {parsedSpreadsheet.data.nomorSurat}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Dokumen 1: Permohonan Paspor
                  </span>
                </div>

                {/* Nomor Surat Pernyataan */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                    No. Surat Jaminan (Alzam)
                  </span>
                  <span className="font-mono text-slate-900 font-bold mt-0.5 block">
                    {parsedSpreadsheet.data.nomorSuratPernyataan || '-'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Dokumen 2: Pernyataan &amp; Jaminan
                  </span>
                </div>

                {/* Jadwal Keberangkatan */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                    Jadwal Keberangkatan &amp; Pulang
                  </span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">
                    {parsedSpreadsheet.data.jadwalKeberangkatanDanKepulangan}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                    Tercantum pada klausul ke-4
                  </span>
                </div>

                {/* Kantor Imigrasi Tujuan */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs sm:col-span-2 lg:col-span-3">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                    Tujuan &amp; Alamat Kantor Imigrasi
                  </span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                    {parsedSpreadsheet.data.tujuanKantorImigrasi}
                  </span>
                  <span className="text-slate-600 mt-0.5 block">
                    {parsedSpreadsheet.data.alamatKantorImigrasi}
                  </span>
                </div>

                {/* Alamat KTP */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs sm:col-span-2 lg:col-span-3">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                    Alamat Lengkap Pemohon (Sesuai KTP / KK)
                  </span>
                  <span className="text-slate-700 font-medium mt-0.5 block">
                    {parsedSpreadsheet.data.alamatKtp}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!parsedSpreadsheet.isValid && parsedSpreadsheet.error && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Pemberitahuan Format Spreadsheet:</span>
                <span>{parsedSpreadsheet.error}</span>
              </div>
            </div>
          )}

          {/* Action Footer for Spreadsheet Input */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              Data akan langsung dimasukkan ke kop, teks, tanda tangan direktur, dan stempel basah.
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleApplySpreadsheet(false)}
                disabled={!parsedSpreadsheet.isValid || !parsedSpreadsheet.data}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700"
              >
                Periksa di Formulir Verifikasi
              </button>

              <button
                type="button"
                onClick={() => handleApplySpreadsheet(true)}
                disabled={!parsedSpreadsheet.isValid || !parsedSpreadsheet.data}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <FileText className="w-4 h-4" />
                <span>Terapkan &amp; Langsung Buka Pratinjau Surat</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OPSI 1: DUAL DOCUMENT UPLOAD DROPZONES (KTP & KK)                          */}
      {/* ========================================================================= */}
      {inputMode === 'files' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dropzone 1: KTP */}
        <div
          onDragEnter={handleKtpDragEnter}
          onDragOver={handleKtpDragOver}
          onDragLeave={handleKtpDragLeave}
          onDrop={handleKtpDrop}
          className={`bg-white rounded-2xl border shadow-sm p-6 flex flex-col justify-between transition-all relative ${
            isDraggingKtp
              ? 'border-emerald-500 ring-4 ring-emerald-500/20 bg-emerald-50/50'
              : 'border-slate-200 hover:border-emerald-400'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Kartu Tanda Penduduk (KTP)</h3>
                  <p className="text-xs text-slate-500">Pemohon Utama (NIK 16 Digit &amp; Alamat)</p>
                </div>
              </div>
              {files.ktpBase64 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Siap Pindai
                </span>
              )}
            </div>

            {/* Upload Area or Preview */}
            {files.ktpBase64 ? (
              <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-[16/10] flex items-center justify-center">
                <img
                  src={files.ktpBase64}
                  alt="KTP Preview"
                  className="w-full h-full object-contain p-2 pointer-events-none"
                />
                {isDraggingKtp && (
                  <div className="absolute inset-0 bg-emerald-600/90 text-white flex flex-col items-center justify-center gap-2 z-30 pointer-events-none">
                    <Upload className="w-8 h-8 animate-bounce" />
                    <span className="text-sm font-bold">Lepaskan untuk mengganti foto KTP</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={() => setZoomImage({ title: 'Dokumen KTP', src: files.ktpBase64! })}
                    className="p-2 bg-white/90 hover:bg-white text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 shadow cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Perbesar
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiles((p) => ({ ...p, ktpBase64: null, ktpName: null }))}
                    className="p-2 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Ganti
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs truncate max-w-[80%] pointer-events-none">
                  {files.ktpName || 'KTP_Document.png'}
                </div>
              </div>
            ) : (
              <div
                onClick={() => ktpInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center aspect-[16/10] group ${
                  isDraggingKtp
                    ? 'border-emerald-500 bg-emerald-100/80 scale-[1.02] ring-4 ring-emerald-500/20 shadow-md'
                    : 'border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/20'
                }`}
              >
                <input
                  type="file"
                  ref={ktpInputRef}
                  onChange={handleKtpUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform pointer-events-none ${
                  isDraggingKtp ? 'bg-emerald-600 text-white scale-125' : 'bg-emerald-100 text-emerald-600 group-hover:scale-110'
                }`}>
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700 pointer-events-none">
                  {isDraggingKtp ? 'Lepaskan foto KTP di sini!' : 'Klik atau seret foto KTP ke sini'}
                </p>
                <p className="text-xs text-slate-400 mt-1 pointer-events-none">Format: JPG, PNG, WEBP (Maksimal 10 MB)</p>
                <p className="text-[11px] text-emerald-700 font-medium mt-3 bg-emerald-50 px-2.5 py-1 rounded-md pointer-events-none">
                  Pastikan 16 digit NIK dan Nama terbaca jelas
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dropzone 2: KK */}
        <div
          onDragEnter={handleKkDragEnter}
          onDragOver={handleKkDragOver}
          onDragLeave={handleKkDragLeave}
          onDrop={handleKkDrop}
          className={`bg-white rounded-2xl border shadow-sm p-6 flex flex-col justify-between transition-all relative ${
            isDraggingKk
              ? 'border-emerald-500 ring-4 ring-emerald-500/20 bg-emerald-50/50'
              : 'border-slate-200 hover:border-emerald-400'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Kartu Keluarga (KK)</h3>
                  <p className="text-xs text-slate-500">Nomor KK 16 Digit &amp; Kepala Keluarga</p>
                </div>
              </div>
              {files.kkBase64 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Siap Pindai
                </span>
              )}
            </div>

            {/* Upload Area or Preview */}
            {files.kkBase64 ? (
              <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-[16/10] flex items-center justify-center">
                <img
                  src={files.kkBase64}
                  alt="KK Preview"
                  className="w-full h-full object-contain p-2 pointer-events-none"
                />
                {isDraggingKk && (
                  <div className="absolute inset-0 bg-emerald-600/90 text-white flex flex-col items-center justify-center gap-2 z-30 pointer-events-none">
                    <Upload className="w-8 h-8 animate-bounce" />
                    <span className="text-sm font-bold">Lepaskan untuk mengganti foto KK</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={() => setZoomImage({ title: 'Dokumen Kartu Keluarga (KK)', src: files.kkBase64! })}
                    className="p-2 bg-white/90 hover:bg-white text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 shadow cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Perbesar
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiles((p) => ({ ...p, kkBase64: null, kkName: null }))}
                    className="p-2 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Ganti
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs truncate max-w-[80%] pointer-events-none">
                  {files.kkName || 'KK_Document.png'}
                </div>
              </div>
            ) : (
              <div
                onClick={() => kkInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center aspect-[16/10] group ${
                  isDraggingKk
                    ? 'border-emerald-500 bg-emerald-100/80 scale-[1.02] ring-4 ring-emerald-500/20 shadow-md'
                    : 'border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/20'
                }`}
              >
                <input
                  type="file"
                  ref={kkInputRef}
                  onChange={handleKkUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform pointer-events-none ${
                  isDraggingKk ? 'bg-emerald-600 text-white scale-125' : 'bg-emerald-100 text-emerald-600 group-hover:scale-110'
                }`}>
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700 pointer-events-none">
                  {isDraggingKk ? 'Lepaskan foto KK di sini!' : 'Klik atau seret foto/scan KK ke sini'}
                </p>
                <p className="text-xs text-slate-400 mt-1 pointer-events-none">Format: JPG, PNG, WEBP (Maksimal 10 MB)</p>
                <p className="text-[11px] text-emerald-700 font-medium mt-3 bg-emerald-50 px-2.5 py-1 rounded-md pointer-events-none">
                  Nomor KK 16 digit tertera di bagian atas
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Travel & Letter Details Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Plane className="w-5 h-5 text-emerald-700" />
          <h3 className="font-bold text-slate-800 text-base">
            Rincian Program &amp; Jadwal Perjalanan
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Country Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Negara Tujuan
            </label>
            <div className="flex flex-wrap gap-1.5">
              {countryPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setCountry(preset.val)}
                  className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                    country === preset.val
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            {country === 'custom' && (
              <input
                type="text"
                value={customCountry}
                onChange={(e) => setCustomCountry(e.target.value)}
                placeholder="Masukkan negara tujuan (misal: Mesir / Korea Selatan)"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden mt-1.5"
              />
            )}
          </div>

          {/* Departure / Flight Schedule */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              Jadwal Keberangkatan &amp; Kepulangan
            </label>
            <input
              type="text"
              value={departureMonth}
              onChange={(e) => setDepartureMonth(e.target.value)}
              placeholder="Contoh: 12 - 23 Januari 2026"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
            />
            <p className="text-[11px] text-slate-400">
              Dicantumkan pada poin ke-4 Surat Jaminan Imigrasi
            </p>
          </div>

          {/* Purpose of Letter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              Perihal / Keperluan Dokumen
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Surat Pernyataan dan Jaminan"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
            />
            <p className="text-[11px] text-slate-400">
              Ditujukan untuk kelengkapan paspor di Kantor Imigrasi
            </p>
          </div>
        </div>
      </div>

      {/* Main Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-2xl border border-emerald-900/50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">
              Pemeriksaan OCR Multimodal Gemini 3.8 Flash
            </h4>
            <p className="text-xs text-slate-300">
              Mengekstrak NIK, nomor KK, nama, TTL, alamat, dan langsung menyusun template {templateType === 'pernyataan_jaminan' ? 'Surat Pernyataan & Jaminan (PT. Alzam Mandiri Wisata)' : 'Surat Rekomendasi'}.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartAnalysis}
          disabled={isAnalyzing || (!files.ktpBase64 && !files.kkBase64)}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
            isAnalyzing
              ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
              : !files.ktpBase64 && !files.kkBase64
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/40 hover:scale-[1.02]'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Memproses Dokumen...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Susun Template Surat Sekarang</span>
            </>
          )}
        </button>
      </div>
      </>
      )}

      {/* Image Zoom Modal */}
      {zoomImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-slate-900 text-white rounded-2xl max-w-4xl w-full p-4 border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-emerald-400">{zoomImage.title}</h3>
              <button
                onClick={() => setZoomImage(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={zoomImage.src}
                alt="Enlarged view"
                className="max-h-[70vh] w-auto object-contain rounded-lg border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
