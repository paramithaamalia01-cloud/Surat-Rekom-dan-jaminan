import React, { useState, useRef } from 'react';
import {
  Printer,
  Download,
  Check,
  FileCheck,
  BookmarkCheck,
  ArrowLeft,
  Layers,
  Sparkles,
  FileText,
  ImageIcon,
  Upload,
  RotateCcw,
  X,
  CheckCircle2,
  Edit3,
  CheckCheck,
} from 'lucide-react';
import { ApplicantData, LetterTemplateType } from '../types';
import { generateOfficialLetterPdf } from '../utils/pdfGenerator';
import { toTitleCase } from '../utils/letterFormatter';
import {
  LogoAlzam,
  LogoUmrahBisa,
  LogoCapAlzam,
  TtdDirekturAlzam,
} from '../assets/letterAssets';

interface LetterPreviewProps {
  data: ApplicantData;
  onEditData: () => void;
  onSaveToArchive: (recordData: { withMaterai: boolean; withStamp: boolean; withSignature: boolean }) => void;
  isSavedInArchive?: boolean;
  onUpdateTemplateType?: (template: LetterTemplateType) => void;
  onUpdateApplicantData?: (newData: ApplicantData) => void;
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({
  data,
  onEditData,
  onSaveToArchive,
  isSavedInArchive = false,
  onUpdateTemplateType,
  onUpdateApplicantData,
}) => {
  const currentTemplate = data.templateType || 'permohonan_paspor';
  const [withStamp, setWithStamp] = useState<boolean>(true);
  const [withSignature, setWithSignature] = useState<boolean>(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfSuccess, setPdfSuccess] = useState<boolean>(false);
  const [localSaveSuccess, setLocalSaveSuccess] = useState<boolean>(false);
  
  // Interactive direct editing on mobile / screen
  const [isInlineEditMode, setIsInlineEditMode] = useState<boolean>(false);
  const [showQuickEditModal, setShowQuickEditModal] = useState<boolean>(false);

  // Manage custom or official loaded assets with localStorage persistence
  const [customAssets, setCustomAssets] = useState<{
    logoAlzam?: string;
    logoUmrahBisa?: string;
    stempel?: string;
    ttd?: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('alzam_official_assets');
      if (saved) {
        return { ...JSON.parse(saved), ...(data.customAssets || {}) };
      }
    } catch {
      // fallback
    }
    return data.customAssets || {};
  });

  const [showAssetModal, setShowAssetModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeAssetUploadKey, setActiveAssetUploadKey] = useState<'logoAlzam' | 'logoUmrahBisa' | 'stempel' | 'ttd' | null>(null);

  const updateField = (field: keyof ApplicantData, value: string) => {
    if (onUpdateApplicantData) {
      const updated = { ...data, [field]: value };
      if (field === 'tempatLahir' || field === 'tanggalLahir') {
        const tLahir = field === 'tempatLahir' ? value : (data.tempatLahir || '');
        const tgLahir = field === 'tanggalLahir' ? value : (data.tanggalLahir || '');
        updated.tempatTanggalLahir = `${tLahir}, ${tgLahir}`.trim().replace(/^,\s*/, '').replace(/,\s*$/, '');
      }
      onUpdateApplicantData(updated);
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      // Auto-save this completed letter to archive & cloud Firestore ledger
      if (onSaveToArchive) {
        onSaveToArchive({ withMaterai: false, withStamp, withSignature });
      }

      await generateOfficialLetterPdf('official-letter-to-print', data);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error('PDF generation error, falling back to window.print():', err);
      try {
        window.print();
      } catch (printErr) {
        console.error('Print also failed:', printErr);
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Direct print blocked by browser/iframe, downloading PDF file:', e);
      handleDownloadPdf();
    }
  };

  const switchTemplate = (tpl: LetterTemplateType) => {
    if (onUpdateTemplateType) {
      onUpdateTemplateType(tpl);
    }
  };

  const triggerUploadAsset = (key: 'logoAlzam' | 'logoUmrahBisa' | 'stempel' | 'ttd') => {
    setActiveAssetUploadKey(key);
    fileInputRef.current?.click();
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeAssetUploadKey) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setCustomAssets((prev) => {
          const updated = {
            ...prev,
            [activeAssetUploadKey]: base64,
          };
          try {
            localStorage.setItem('alzam_official_assets', JSON.stringify(updated));
          } catch (err) {
            console.warn('Could not save to localStorage:', err);
          }
          return updated;
        });
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const removeCustomAsset = (key: 'logoAlzam' | 'logoUmrahBisa' | 'stempel' | 'ttd') => {
    setCustomAssets((prev) => {
      const updated = { ...prev };
      delete updated[key];
      try {
        localStorage.setItem('alzam_official_assets', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not update localStorage:', err);
      }
      return updated;
    });
  };

  // Reusable KOP Surat Alzam Mandiri Wisata with Official Logos (Proporsional & Formal Times New Roman)
  const renderKopAlzam = () => (
    <div className="relative pb-2 mb-3.5 border-b-[2.5px] border-slate-900">
      <div className="flex items-center justify-between gap-3">
        {/* Left Logo: Logo Alzam (Logo Alzam.png) - Ukuran Proporsional */}
        <div className="w-22 sm:w-26 flex flex-col items-center justify-center shrink-0">
          {customAssets.logoAlzam ? (
            <img
              src={customAssets.logoAlzam}
              alt="Logo Alzam Mandiri Wisata"
              className="w-20 sm:w-22 h-auto max-h-20 object-contain"
            />
          ) : (
            <LogoAlzam className="w-20 sm:w-22 h-auto max-h-20" />
          )}
        </div>

        {/* Center Travel Info in Formal Times New Roman */}
        <div className="text-center flex-1 px-1 font-formal leading-tight" style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}>
          <h1 className="text-base sm:text-[15pt] md:text-[16pt] font-black tracking-wide text-slate-900 uppercase">
            {data.namaPerusahaan || 'PT. ALZAM MANDIRI WISATA'}
          </h1>
          <p
            className="text-[11.5pt] sm:text-[13pt] font-extrabold italic tracking-wide mt-0.5 text-kop-tagline"
            style={{ color: '#0d5526', fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}
          >
            {data.taglinePerusahaan || 'Tour & Travel'}
          </p>
          <p className="text-[9pt] sm:text-[10pt] font-bold text-slate-900 tracking-wider mt-0.5">
            IZIN PPIU : {data.izinPpiu || '29042200007580004'}
          </p>
          <p className="text-[7.5pt] sm:text-[8.5pt] text-slate-700 leading-snug mt-0.5">
            {data.alamatPerusahaan || 'Ciledug Mas, Jl. HOS Cokroaminoto Blok C9 dan C10, RT.003/RW.004, Sudimara Timur, Kecamatan Karang Tengah, Kota Tangerang, Banten 15151'}
          </p>
          <p className="text-[7pt] sm:text-[8pt] text-slate-700 mt-0.5">
            Telp/hp : {data.teleponPerusahaan || '0815-9888-154'}, email : {data.emailPerusahaan || 'alzam@bisa.id'},{' '}
            <span
              className="text-kop-link font-normal underline"
              style={{
                color: '#1d4ed8',
                textDecoration: 'underline',
              }}
            >
              {data.websitePerusahaan || 'www.umrahbisa.com'}
            </span>
          </p>
        </div>

        {/* Right Logo: UmrahBISA (Logo UmrahBISA.png) - Ukuran Proporsional */}
        <div className="w-22 sm:w-26 flex flex-col items-center justify-center shrink-0">
          {customAssets.logoUmrahBisa ? (
            <img
              src={customAssets.logoUmrahBisa}
              alt="Logo UmrahBISA"
              className="w-20 sm:w-24 h-auto max-h-16 object-contain"
            />
          ) : (
            <LogoUmrahBisa className="w-20 sm:w-24 h-auto max-h-16" />
          )}
        </div>
      </div>
    </div>
  );

  // Reusable Signature & Stamp Alzam with Single Line Spacing (Spasi 1), shifted 2 tabs to the right, perfectly fitting A4 page
  const renderSignatureAlzam = () => (
    <div className="mt-3 sm:mt-4 flex justify-between items-end">
      <div className="w-8" />

      {/* Signature Block: Single Line Spacing (Spasi 1), geser ke kanan 2 tab */}
      <div className="w-68 sm:w-72 ml-auto pl-8 sm:pl-12 text-left relative font-formal" style={{ fontFamily: '"Times New Roman", Times, "Liberation Serif", serif' }}>
        <p className="text-[11pt] leading-tight">
          {isEditing ? (
            <span className="flex items-center gap-1">
              <input
                type="text"
                value={data.kotaPenerbitan || 'Jakarta'}
                onChange={(e) => updateField('kotaPenerbitan', e.target.value)}
                className="doc-inline-input w-24 text-[11pt]"
              />
              ,
              <input
                type="text"
                value={data.tanggalSurat || '5 Oktober 2026'}
                onChange={(e) => updateField('tanggalSurat', e.target.value)}
                className="doc-inline-input flex-1 text-[11pt]"
              />
            </span>
          ) : (
            `${data.kotaPenerbitan || 'Jakarta'}, ${data.tanggalSurat}`
          )}
        </p>
        <p className="text-[11pt] font-normal leading-tight">Hormat Kami,</p>
        <p className="text-[11pt] font-bold text-slate-950 leading-tight">
          {data.namaPerusahaan || 'PT. Alzam Mandiri Wisata'}
        </p>

        {/* Area TTD dan Stempel: Single Spacing, proporsional h-16 hingga h-20, overflow-visible */}
        <div className="relative h-18 sm:h-20 flex items-center my-1 overflow-visible">
          {/* Stempel Bulat Hijau Resmi PT. Alzam Mandiri Wisata (Logo CAP.png) */}
          {withStamp && (
            <div className="absolute -left-3 sm:-left-5 -top-1 pointer-events-none select-none z-10">
              {customAssets.stempel ? (
                <img
                  src={customAssets.stempel}
                  alt="Stempel Resmi PT Alzam Mandiri Wisata"
                  className="w-24 sm:w-26 h-24 sm:h-26 object-contain mix-blend-multiply opacity-95 -rotate-8"
                />
              ) : (
                <LogoCapAlzam className="w-24 sm:w-26 h-24 sm:h-26" rotation={-8} />
              )}
            </div>
          )}

          {/* Tanda Tangan Khairul Umam Asli (ttd.png) */}
          {withSignature && (
            <div className="absolute left-1 sm:left-3 top-1 pointer-events-none select-none z-20 overflow-visible">
              {customAssets.ttd ? (
                <img
                  src={customAssets.ttd}
                  alt="Tanda Tangan Khairul Umam"
                  className="w-44 sm:w-48 h-16 sm:h-18 object-contain"
                />
              ) : (
                <TtdDirekturAlzam className="w-44 sm:w-48 h-16 sm:h-18" />
              )}
            </div>
          )}
        </div>

        {/* Nama dan Jabatan Direktur: Underline dengan jarak berjarak rapi (tidak dempet ke huruf) */}
        <div className="pt-1.5">
          <p className="font-bold text-[11pt] text-slate-950 leading-tight">
            {isEditing ? (
              <input
                type="text"
                value={data.pejabatNama || 'Khairul Umam, ST, BA, MBA'}
                onChange={(e) => updateField('pejabatNama', e.target.value)}
                className="doc-inline-input font-bold text-[11pt]"
              />
            ) : (
              <span
                className="inline-block font-bold"
                style={{
                  borderBottom: '1.5px solid #020617',
                  paddingBottom: '3.5px',
                  lineHeight: '1.2',
                  display: 'inline-block',
                }}
              >
                {data.pejabatNama || 'Khairul Umam, ST, BA, MBA'}
              </span>
            )}
          </p>
          <p className="text-[10pt] text-slate-800 font-medium leading-tight mt-1">
            {isEditing ? (
              <input
                type="text"
                value={data.pejabatJabatan || 'Direktur Utama'}
                onChange={(e) => updateField('pejabatJabatan', e.target.value)}
                className="doc-inline-input text-[10pt]"
              />
            ) : (
              data.pejabatJabatan || 'Direktur Utama'
            )}
          </p>
        </div>
      </div>
    </div>
  );

  // Controls whether inputs are shown in document
  const isEditing = isInlineEditMode && !isGeneratingPdf;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-28">
      {/* Top Controls Toolbar (Hidden in print) */}
      <div className="bg-[#244030] text-[#FAF7F2] rounded-2xl p-4 sm:p-5 border border-[#3D604C] shadow-md print:hidden space-y-4">
        {/* Template Switcher Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#3D604C] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E68F65] bg-[#1B3024] px-2.5 py-0.5 rounded-full border border-[#D96B38]/40 mb-1">
              <Layers className="w-3.5 h-3.5" />
              Pilih Format Surat Resmi PT. Alzam Mandiri Wisata
            </div>
            <h2 className="text-lg font-bold text-[#FAF7F2]">
              Pratinjau Surat Resmi Siap Cetak
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-[#1B3024] p-1.5 rounded-xl border border-[#3D604C]">
            {/* Surat Permohonan Paspor */}
            <button
              type="button"
              onClick={() => switchTemplate('permohonan_paspor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTemplate === 'permohonan_paspor'
                  ? 'bg-[#D96B38] text-white shadow-md'
                  : 'text-[#D4E2D7] hover:text-white hover:bg-[#2F4E3C]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              1. Permohonan Paspor
            </button>

            {/* Surat Pernyataan dan Jaminan */}
            <button
              type="button"
              onClick={() => switchTemplate('pernyataan_jaminan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTemplate === 'pernyataan_jaminan'
                  ? 'bg-[#D96B38] text-white shadow-md'
                  : 'text-[#D4E2D7] hover:text-white hover:bg-[#2F4E3C]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E4ECE6]" />
              2. Pernyataan &amp; Jaminan
            </button>

            {/* Paket Lengkap 2 Surat Alzam */}
            <button
              type="button"
              onClick={() => switchTemplate('paket_lengkap_alzam')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTemplate === 'paket_lengkap_alzam'
                  ? 'bg-[#3D604C] text-white border border-[#88A995] shadow-md'
                  : 'text-[#C5D8CC] hover:text-white hover:bg-[#2F4E3C]'
              }`}
              title="Tampilkan kedua surat Alzam Mandiri Wisata sekaligus untuk dicetak"
            >
              <Layers className="w-3.5 h-3.5 text-[#D96B38]" />
              Paket 2 Surat Sekaligus
            </button>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onEditData}
              className="px-3.5 py-2 bg-[#1B3024] hover:bg-[#2F4E3C] text-[#FAF7F2] rounded-xl text-xs font-semibold transition-all border border-[#3D604C] flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Formulir Data
            </button>

            {/* Toggle Mode Edit Langsung di Layar */}
            <button
              type="button"
              onClick={() => setIsInlineEditMode(!isInlineEditMode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                isInlineEditMode
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/40'
                  : 'bg-[#1B3024] text-[#E68F65] border-[#D96B38]/50 hover:bg-[#2F4E3C]'
              }`}
              title="Aktifkan untuk mengedit, menambah, atau menghapus ketikan langsung di atas surat"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isInlineEditMode ? 'Mode Ketik di Surat (AKTIF)' : 'Edit Langsung di Surat'}</span>
            </button>

            {/* Tombol Modal Edit Cepat */}
            <button
              type="button"
              onClick={() => setShowQuickEditModal(true)}
              className="px-3 py-2 bg-[#1B3024] hover:bg-[#2F4E3C] text-[#D4E2D7] rounded-xl text-xs font-semibold border border-[#3D604C] flex items-center gap-1"
            >
              Ubah Data Cepat
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onSaveToArchive({ withMaterai: false, withStamp, withSignature });
                setLocalSaveSuccess(true);
                setTimeout(() => setLocalSaveSuccess(false), 2500);
              }}
              className="px-3.5 py-2 bg-[#3D604C] hover:bg-[#4D735C] active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm border border-[#557A64] flex items-center gap-1.5 cursor-pointer"
              title="Simpan atau perbarui data surat ini ke daftar arsip"
            >
              {localSaveSuccess || isSavedInArchive ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-[#E4ECE6]" />
                  <span>{localSaveSuccess ? 'Tersimpan ke Arsip!' : 'Perbarui di Arsip'}</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Simpan ke Arsip</span>
                </>
              )}
            </button>

            {/* Tombol Simpan / Unduh PDF Langsung (Menggunakan html2pdf client-side) */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 bg-[#D96B38] hover:bg-[#C25B2A] disabled:bg-[#7D4020] text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              title="Simpan surat sebagai file PDF A4 resmi"
            >
              {isGeneratingPdf ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Membuat PDF A4...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <Check className="w-4 h-4 text-[#E4ECE6]" />
                  <span className="text-[#FAF7F2]">PDF Tersimpan!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Unduh PDF (A4)</span>
                </>
              )}
            </button>

            {/* Tombol Cetak / Print Dialog */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-[#1B3024] hover:bg-[#2F4E3C] text-[#FAF7F2] rounded-xl text-xs font-semibold transition-all border border-[#3D604C] flex items-center gap-1.5 cursor-pointer"
              title="Buka dialog cetak browser (Ctrl + P)"
            >
              <Printer className="w-3.5 h-3.5 text-[#C5D8CC]" />
              <span className="hidden sm:inline">Cetak (Print)</span>
            </button>
          </div>
        </div>

        {/* Consular Seal Toggles */}
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
          <span className="text-[#C5D8CC] font-medium">Atribut Dokumen Resmi:</span>
          
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-[#D4E2D7] hover:text-white">
            <input
              type="checkbox"
              checked={withStamp}
              onChange={(e) => setWithStamp(e.target.checked)}
              className="rounded-sm text-[#D96B38] focus:ring-[#D96B38] w-3.5 h-3.5 accent-[#D96B38]"
            />
            <span>Stempel Resmi Basah (Logo CAP)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none text-[#D4E2D7] hover:text-white">
            <input
              type="checkbox"
              checked={withSignature}
              onChange={(e) => setWithSignature(e.target.checked)}
              className="rounded-sm text-[#D96B38] focus:ring-[#D96B38] w-3.5 h-3.5 accent-[#D96B38]"
            />
            <span>Tanda Tangan Direktur Utama (ttd)</span>
          </label>
        </div>

        {/* 4 Official Assets Status Bar */}
        <div className="pt-3 border-t border-[#3D604C] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#E68F65] font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#D96B38]" />
              4 Aset Resmi Terpasang:
            </span>
            <span className="text-[#FAF7F2] bg-[#1B3024] px-2 py-0.5 rounded-md border border-[#3D604C] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#88A995]" />
              1. Logo Alzam (Kiri)
            </span>
            <span className="text-[#FAF7F2] bg-[#1B3024] px-2 py-0.5 rounded-md border border-[#3D604C] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#88A995]" />
              2. Logo UmrahBISA (Kanan)
            </span>
            <span className="text-[#FAF7F2] bg-[#1B3024] px-2 py-0.5 rounded-md border border-[#3D604C] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#88A995]" />
              3. Logo CAP (Stempel)
            </span>
            <span className="text-[#FAF7F2] bg-[#1B3024] px-2 py-0.5 rounded-md border border-[#3D604C] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#88A995]" />
              4. ttd.png (Tanda Tangan)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAssetModal(true)}
            className="px-3 py-1.5 bg-[#1B3024] hover:bg-[#2F4E3C] text-[#E68F65] rounded-lg text-xs font-semibold transition-all border border-[#D96B38]/40 flex items-center gap-1.5 shadow-xs"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#D96B38]" />
            <span>Kelola / Ganti File Aset</span>
          </button>
        </div>

        {/* Hidden file input for uploading custom asset replacement */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={onFileSelected}
        />
      </div>

      {/* Mode Edit Notice Banner */}
      {isInlineEditMode && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 text-emerald-900 text-xs flex items-center justify-between gap-3 shadow-sm print:hidden">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Mode Edit Langsung Aktif!</strong> Sentuh / klik tulisan bergaris hijau di dalam surat untuk mengedit, menambah, atau menghapus ketikan langsung.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsInlineEditMode(false)}
            className="px-3 py-1 bg-emerald-700 text-white font-bold rounded-lg text-xs hover:bg-emerald-800 shrink-0"
          >
            Selesai Edit
          </button>
        </div>
      )}

      {/* Quick Edit Sheet Modal for mobile / desktop */}
      {showQuickEditModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 text-slate-900 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-600" />
                Ubah Cepat Teks Surat
              </h3>
              <button
                type="button"
                onClick={() => setShowQuickEditModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Jamaah</label>
                <input
                  type="text"
                  value={data.namaLengkap ?? ''}
                  onChange={(e) => updateField('namaLengkap', e.target.value)}
                  className="w-full text-sm p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIK</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={data.nik ?? ''}
                    onChange={(e) => updateField('nik', e.target.value)}
                    className="w-full text-sm p-2.5 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tempat/Tgl Lahir</label>
                  <input
                    type="text"
                    value={data.tempatTanggalLahir ?? ''}
                    onChange={(e) => updateField('tempatTanggalLahir', e.target.value)}
                    className="w-full text-sm p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat KTP</label>
                <textarea
                  rows={2}
                  value={data.alamatKtp ?? ''}
                  onChange={(e) => updateField('alamatKtp', e.target.value)}
                  className="w-full text-sm p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tujuan Kantor Imigrasi</label>
                  <input
                    type="text"
                    value={data.tujuanKantorImigrasi ?? ''}
                    onChange={(e) => updateField('tujuanKantorImigrasi', e.target.value)}
                    className="w-full text-sm p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jadwal Keberangkatan</label>
                  <input
                    type="text"
                    value={data.jadwalKeberangkatanDanKepulangan || data.estimasiKeberangkatan || ''}
                    onChange={(e) => {
                      updateField('jadwalKeberangkatanDanKepulangan', e.target.value);
                      updateField('estimasiKeberangkatan', e.target.value);
                    }}
                    className="w-full text-sm p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Surat</label>
                  <input
                    type="text"
                    value={data.nomorSurat ?? ''}
                    onChange={(e) => updateField('nomorSurat', e.target.value)}
                    className="w-full text-sm p-2.5 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Surat</label>
                  <input
                    type="text"
                    value={data.tanggalSurat ?? ''}
                    onChange={(e) => updateField('tanggalSurat', e.target.value)}
                    className="w-full text-sm p-2.5 border rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowQuickEditModal(false)}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Management Modal */}
      {showAssetModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1B3024] border border-[#3D604C] rounded-2xl max-w-3xl w-full p-6 text-[#FAF7F2] shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#3D604C] pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#D96B38]" />
                <h3 className="text-base font-bold text-[#FAF7F2]">
                  Kelola 4 Aset Gambar Resmi (Logo, Cap &amp; Tanda Tangan)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAssetModal(false)}
                className="text-[#C5D8CC] hover:text-white p-1 rounded-lg hover:bg-[#2F4E3C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#D4E2D7]">
              Keempat aset ini telah otomatis dimasukkan ke dalam KOP surat, stempel, dan tanda tangan dokumen resmi. Anda dapat melihat pratinjau masing-masing atau mengunggah file gambar PNG pengganti jika diperlukan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Asset 1: Logo Alzam */}
              <div className="bg-[#244030] border border-[#3D604C] rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E68F65]">1. Logo Alzam (KOP Kiri)</span>
                  {customAssets.logoAlzam ? (
                    <span className="text-[10px] bg-[#D96B38]/20 text-[#E68F65] px-2 py-0.5 rounded-full border border-[#D96B38]/40">Kustom</span>
                  ) : (
                    <span className="text-[10px] bg-[#3D604C] text-[#E4ECE6] px-2 py-0.5 rounded-full border border-[#557A64]">Resmi Terpasang</span>
                  )}
                </div>

                <div className="h-28 bg-white/95 rounded-lg flex items-center justify-center p-2 border border-[#3D604C]">
                  {customAssets.logoAlzam ? (
                    <img src={customAssets.logoAlzam} alt="Logo Alzam" className="max-h-24 max-w-full object-contain" />
                  ) : (
                    <LogoAlzam className="w-20 h-auto" />
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => triggerUploadAsset('logoAlzam')}
                    className="flex-1 py-1.5 bg-[#3D604C] hover:bg-[#4D735C] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" /> Ganti Gambar
                  </button>
                  {customAssets.logoAlzam && (
                    <button
                      type="button"
                      onClick={() => removeCustomAsset('logoAlzam')}
                      className="p-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 rounded-lg text-xs"
                      title="Reset ke logo bawaan"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Asset 2: Logo UmrahBISA */}
              <div className="bg-[#244030] border border-[#3D604C] rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E68F65]">2. Logo UmrahBISA (KOP Kanan)</span>
                  {customAssets.logoUmrahBisa ? (
                    <span className="text-[10px] bg-[#D96B38]/20 text-[#E68F65] px-2 py-0.5 rounded-full border border-[#D96B38]/40">Kustom</span>
                  ) : (
                    <span className="text-[10px] bg-[#3D604C] text-[#E4ECE6] px-2 py-0.5 rounded-full border border-[#557A64]">Resmi Terpasang</span>
                  )}
                </div>

                <div className="h-28 bg-white/95 rounded-lg flex items-center justify-center p-2 border border-[#3D604C]">
                  {customAssets.logoUmrahBisa ? (
                    <img src={customAssets.logoUmrahBisa} alt="Logo UmrahBISA" className="max-h-24 max-w-full object-contain" />
                  ) : (
                    <LogoUmrahBisa className="w-24 h-auto" />
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => triggerUploadAsset('logoUmrahBisa')}
                    className="flex-1 py-1.5 bg-[#3D604C] hover:bg-[#4D735C] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" /> Ganti Gambar
                  </button>
                  {customAssets.logoUmrahBisa && (
                    <button
                      type="button"
                      onClick={() => removeCustomAsset('logoUmrahBisa')}
                      className="p-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 rounded-lg text-xs"
                      title="Reset ke logo bawaan"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Asset 3: Logo CAP (Stempel) */}
              <div className="bg-[#244030] border border-[#3D604C] rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E68F65]">3. Logo CAP (Stempel Basah)</span>
                  {customAssets.stempel ? (
                    <span className="text-[10px] bg-[#D96B38]/20 text-[#E68F65] px-2 py-0.5 rounded-full border border-[#D96B38]/40">Kustom</span>
                  ) : (
                    <span className="text-[10px] bg-[#3D604C] text-[#E4ECE6] px-2 py-0.5 rounded-full border border-[#557A64]">Resmi Terpasang</span>
                  )}
                </div>

                <div className="h-28 bg-white/95 rounded-lg flex items-center justify-center p-2 border border-[#3D604C]">
                  {customAssets.stempel ? (
                    <img src={customAssets.stempel} alt="Stempel CAP" className="max-h-24 max-w-full object-contain" />
                  ) : (
                    <LogoCapAlzam className="w-24 h-24" rotation={0} />
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => triggerUploadAsset('stempel')}
                    className="flex-1 py-1.5 bg-[#3D604C] hover:bg-[#4D735C] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" /> Ganti Gambar
                  </button>
                  {customAssets.stempel && (
                    <button
                      type="button"
                      onClick={() => removeCustomAsset('stempel')}
                      className="p-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 rounded-lg text-xs"
                      title="Reset ke cap bawaan"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Asset 4: ttd.png (Tanda Tangan) */}
              <div className="bg-[#244030] border border-[#3D604C] rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E68F65]">4. ttd.png (Tanda Tangan Direktur)</span>
                  {customAssets.ttd ? (
                    <span className="text-[10px] bg-[#D96B38]/20 text-[#E68F65] px-2 py-0.5 rounded-full border border-[#D96B38]/40">Kustom</span>
                  ) : (
                    <span className="text-[10px] bg-[#3D604C] text-[#E4ECE6] px-2 py-0.5 rounded-full border border-[#557A64]">Resmi Terpasang</span>
                  )}
                </div>

                <div className="h-28 bg-white/95 rounded-lg flex items-center justify-center p-2 border border-[#3D604C]">
                  {customAssets.ttd ? (
                    <img src={customAssets.ttd} alt="Tanda Tangan Direktur" className="max-h-24 max-w-full object-contain" />
                  ) : (
                    <TtdDirekturAlzam className="w-40 h-20" />
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => triggerUploadAsset('ttd')}
                    className="flex-1 py-1.5 bg-[#3D604C] hover:bg-[#4D735C] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" /> Ganti Gambar
                  </button>
                  {customAssets.ttd && (
                    <button
                      type="button"
                      onClick={() => removeCustomAsset('ttd')}
                      className="p-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 rounded-lg text-xs"
                      title="Reset ke ttd bawaan"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#3D604C]">
              <button
                type="button"
                onClick={() => setShowAssetModal(false)}
                className="px-5 py-2 bg-[#D96B38] hover:bg-[#C25B2A] text-white font-bold rounded-xl text-xs transition-all shadow-md active:scale-95"
              >
                Selesai &amp; Terapkan ke Dokumen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Letter Printable Container for html2pdf and print */}
      <div id="official-letter-to-print" className="space-y-8 print:space-y-0">
        {/* ========================================================================= */}
        {/* 1. DOKUMEN: SURAT PERMOHONAN PEMBUATAN PASPOR (PT. ALZAM MANDIRI WISATA)  */}
        {/* Persis Screenshot Gambar Ke-2                                             */}
        {/* ========================================================================= */}
        {(currentTemplate === 'permohonan_paspor' || currentTemplate === 'paket_lengkap_alzam') && (
          <div
            className="official-letter-page bg-white border border-slate-300 text-slate-900 mx-auto print:p-0 print:border-none print:shadow-none print:m-0 font-formal text-[11pt] leading-spasi-1-5 print:break-after-page shadow-sm rounded-lg sm:rounded-none"
            style={{
              fontFamily: '"Times New Roman", Times, "Liberation Serif", serif',
              width: '100%',
              maxWidth: '210mm',
              minHeight: '297mm',
              paddingLeft: '2.5cm',
              paddingRight: '2.5cm',
              paddingTop: '2.0cm',
              paddingBottom: '2.0cm',
              boxSizing: 'border-box',
              hyphens: 'none',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              lineHeight: '1.5',
            }}
          >
            {renderKopAlzam()}

            {/* Nomor & Perihal - Spasi 1.5 */}
            <div className="my-2.5 text-[11pt] leading-spasi-1-5" style={{ lineHeight: '1.5' }}>
              <table className="w-full leading-spasi-1-5" style={{ lineHeight: '1.5' }}>
                <tbody>
                  <tr>
                    <td className="w-20 align-top py-0.5 font-normal">Nomor</td>
                    <td className="w-4 align-top py-0.5">:</td>
                    <td className="py-0.5 font-normal">
                      {isEditing ? (
                        <input
                          type="text"
                          value={data.nomorSurat ?? ''}
                          onChange={(e) => updateField('nomorSurat', e.target.value)}
                          className="doc-inline-input font-mono"
                        />
                      ) : (
                        data.nomorSurat
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top py-0.5 font-normal">Perihal</td>
                    <td className="align-top py-0.5">:</td>
                    <td className="py-0.5 font-bold">
                      <span
                        className="inline-block font-bold"
                        style={{
                          borderBottom: '1.5px solid #020617',
                          paddingBottom: '2px',
                        }}
                      >
                        {data.perihal || 'Permohonan Pembuatan Paspor'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Kepada Yth. Tujuan Kantor Imigrasi - Spasi 1.5 */}
            <div className="mb-2.5 text-[11pt] leading-spasi-1-5" style={{ lineHeight: '1.5' }}>
              <p>Kepada Yth,</p>
              <p className="font-normal">
                {isEditing ? (
                  <input
                    type="text"
                    value={data.tujuanKantorImigrasi ?? 'Kepala Kantor Imigrasi Kelas II TPI Tanjung Pandan'}
                    onChange={(e) => updateField('tujuanKantorImigrasi', e.target.value)}
                    className="doc-inline-input font-normal"
                  />
                ) : (
                  toTitleCase(data.tujuanKantorImigrasi || 'Kepala Kantor Imigrasi Kelas II TPI Tanjung Pandan')
                )}
              </p>
              <p className="leading-snug">
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={data.alamatKantorImigrasi ?? 'Jl. Jendral Sudirman Km. 6,5, Desa Perawas, Kec. Tanjung Pandan, Kabupaten Belitung, Kepulauan Bangka Belitung 33413.'}
                    onChange={(e) => updateField('alamatKantorImigrasi', e.target.value)}
                    className="doc-inline-input text-[10.5pt]"
                  />
                ) : (
                  toTitleCase(data.alamatKantorImigrasi || 'Jl. Jendral Sudirman Km. 6,5, Desa Perawas, Kec. Tanjung Pandan, Kabupaten Belitung, Kepulauan Bangka Belitung 33413.')
                )}
              </p>
            </div>

            {/* Salam & Alasan Permohonan - Rata Kanan dan Kiri (Justified) - Spasi 1.5 */}
            <div className="space-y-1.5 text-justify text-justify-formal text-[11pt] leading-spasi-1-5" style={{ lineHeight: '1.5' }}>
              <p style={{ lineHeight: '1.5' }}>Assalamu’alaikum warahmatullahi wabarakatuh</p>
              <p style={{ lineHeight: '1.5' }}>
                Sehubungan dengan akan adanya keberangkatan jamaah umrah {data.namaPerusahaan || 'PT. Alzam Mandiri Wisata'} dengan izin Penyelenggara Perjalanan Ibadah Umrah yang diterbitkan {data.tanggalIzinPpiu || '02 Agustus 2022'} oleh Pemerintah Republik Indonesia, maka dengan ini kami mengajukan permohonan guna pembuatan paspor atas nama :
              </p>

              {/* Tabel Data Pemohon / Jamaah - Spasi 1.5 */}
              <table className="w-full my-1.5 text-[11pt] ml-4 leading-spasi-1-5" style={{ lineHeight: '1.5' }}>
                <tbody>
                  <tr>
                    <td className="w-44 align-top py-0.5">Nama</td>
                    <td className="w-4 align-top py-0.5">:</td>
                    <td className="py-0.5 font-bold">
                      {isEditing ? (
                        <input
                          type="text"
                          value={data.namaLengkap ?? ''}
                          onChange={(e) => updateField('namaLengkap', e.target.value)}
                          className="doc-inline-input font-bold"
                          placeholder="Ketik nama jamaah..."
                        />
                      ) : (
                        toTitleCase(data.namaLengkap)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top py-0.5">Tempat/Tanggal Lahir</td>
                    <td className="align-top py-0.5">:</td>
                    <td className="py-0.5">
                      {isEditing ? (
                        <input
                          type="text"
                          value={data.tempatTanggalLahir ?? ''}
                          onChange={(e) => updateField('tempatTanggalLahir', e.target.value)}
                          className="doc-inline-input"
                          placeholder="Contoh: Serang, 13 April 1995"
                        />
                      ) : (
                        toTitleCase(data.tempatTanggalLahir)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top py-0.5">NIK</td>
                    <td className="align-top py-0.5">:</td>
                    <td className="py-0.5 font-mono">
                      {isEditing ? (
                        <input
                          type="text"
                          inputMode="numeric"
                          value={data.nik ?? ''}
                          onChange={(e) => updateField('nik', e.target.value)}
                          className="doc-inline-input font-mono font-bold"
                          placeholder="Ketik 16 digit NIK..."
                        />
                      ) : (
                        data.nik
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top py-0.5">Alamat</td>
                    <td className="align-top py-0.5">:</td>
                    <td className="py-0.5 leading-snug">
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={data.alamatKtp ?? ''}
                          onChange={(e) => updateField('alamatKtp', e.target.value)}
                          className="doc-inline-input leading-snug"
                          placeholder="Ketik alamat KTP lengkap..."
                        />
                      ) : (
                        toTitleCase(data.alamatKtp)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top py-0.5">Tanggal Keberangkatan</td>
                    <td className="align-top py-0.5">:</td>
                    <td className="py-0.5 font-normal">
                      {isEditing ? (
                        <input
                          type="text"
                          value={data.jadwalKeberangkatanDanKepulangan || data.estimasiKeberangkatan || '20 - 28 Februari 2027'}
                          onChange={(e) => {
                            updateField('jadwalKeberangkatanDanKepulangan', e.target.value);
                            updateField('estimasiKeberangkatan', e.target.value);
                          }}
                          className="doc-inline-input"
                        />
                      ) : (
                        data.jadwalKeberangkatanDanKepulangan || data.estimasiKeberangkatan || '20 - 28 Februari 2027'
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p className="mt-2" style={{ lineHeight: '1.5' }}>
                Demikian permohonan ini kami buat, atas bantuan dan perhatian Bapak/Ibu kami ucapkan terima kasih. Wassalamu'alaikum warahmatullahi wabarakatuh
              </p>
            </div>

            {renderSignatureAlzam()}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. DOKUMEN: SURAT PERNYATAAN DAN JAMINAN (PT. ALZAM MANDIRI WISATA)       */}
        {/* Persis Screenshot Gambar Ke-1                                             */}
        {/* ========================================================================= */}
        {(currentTemplate === 'pernyataan_jaminan' || currentTemplate === 'paket_lengkap_alzam') && (
          <div
            className="official-letter-page bg-white border border-slate-300 text-slate-900 mx-auto print:p-0 print:border-none print:shadow-none print:m-0 font-formal text-[11pt] leading-spasi-1-5 print:break-after-page shadow-sm rounded-lg sm:rounded-none"
            style={{
              fontFamily: '"Times New Roman", Times, "Liberation Serif", serif',
              width: '100%',
              maxWidth: '210mm',
              minHeight: '297mm',
              paddingLeft: '2.5cm',
              paddingRight: '2.5cm',
              paddingTop: '2.0cm',
              paddingBottom: '2.0cm',
              boxSizing: 'border-box',
              hyphens: 'none',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              lineHeight: '1.5',
            }}
          >
            {renderKopAlzam()}

            {/* Nomor & Perihal - Spasi 1.5 */}
            <div className="my-2.5 text-[11pt] leading-spasi-1-5" style={{ lineHeight: '1.5' }}>
              <table className="w-full leading-spasi-1-5" style={{ lineHeight: '1.5' }}>
                <tbody>
                  <tr>
                    <td className="w-20 align-top py-0.5 font-normal">Nomor</td>
                    <td className="w-4 align-top py-0.5">:</td>
                    <td className="py-0.5 font-normal">
                      {isEditing ? (
                        <input
                          type="text"
                          value={data.nomorSuratPernyataan || (currentTemplate === 'paket_lengkap_alzam' ? '7380/SR/AMW/X/2026' : data.nomorSurat)}
                          onChange={(e) => updateField('nomorSuratPernyataan', e.target.value)}
                          className="doc-inline-input font-mono"
                        />
                      ) : (
                        data.nomorSuratPernyataan || (currentTemplate === 'paket_lengkap_alzam' ? '7380/SR/AMW/X/2026' : data.nomorSurat)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top py-0.5 font-normal">Perihal</td>
                    <td className="align-top py-0.5">:</td>
                    <td className="py-0.5 font-bold">
                      <span
                        className="inline-block font-bold"
                        style={{
                          borderBottom: '1.5px solid #020617',
                          paddingBottom: '2px',
                        }}
                      >
                        Surat Pernyataan dan Jaminan
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Salam & Pihak Pertama - Rata Kanan dan Kiri - Spasi 1.5 */}
            <div className="space-y-1 text-justify text-justify-formal text-[11pt] leading-spasi-1-5" style={{ lineHeight: '1.5' }}>
              <p style={{ lineHeight: '1.5' }}>Assalamu’alaikum warahmatullahi wabarakatuh</p>
              <p style={{ lineHeight: '1.5' }}>Saya yang bertanda tangan dibawah ini:</p>

              {/* Tabel Pihak Pertama - Spasi 1.5 */}
              <table className="w-full my-1 text-[11pt] ml-4 leading-spasi-1-5" style={{ lineHeight: '1.5' }}>
                <tbody>
                  <tr>
                    <td className="w-32 align-top py-0.5">Nama</td>
                    <td className="w-4 align-top py-0.5">:</td>
                    <td className="py-0.5 font-bold">{data.pejabatNama || 'Khairul Umam, ST, BA, MBA'}</td>
                  </tr>
                  <tr>
                    <td className="align-top py-0.5">Jabatan</td>
                    <td className="align-top py-0.5">:</td>
                    <td className="py-0.5">{data.pejabatJabatan || 'Direktur Utama'}</td>
                  </tr>
                  <tr>
                    <td className="align-top py-0.5">Perusahaan</td>
                    <td className="align-top py-0.5">:</td>
                    <td className="py-0.5 font-bold">{data.namaPerusahaan || 'PT. Alzam Mandiri Wisata'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pihak Kedua (Calon Jamaah) - Rata Kanan dan Kiri - Spasi 1.5 */}
            <div className="space-y-1 mt-1 text-justify text-justify-formal text-[11pt] leading-spasi-1-5" style={{ lineHeight: '1.5' }}>
              <p style={{ lineHeight: '1.5' }}>Bersama ini kami menyatakan:</p>

              {/* Tabel Data Jamaah - Spasi 1.5 */}
              <table className="w-full my-1 text-[11pt] ml-4 leading-spasi-1-5" style={{ lineHeight: '1.5' }}>
                <tbody>
                  <tr>
                    <td className="w-44 align-top py-0.5">Nama</td>
                    <td className="w-4 align-top py-0.5">:</td>
                    <td className="py-0.5 font-bold">
                      {isEditing ? (
                        <input
                          type="text"
                          value={data.namaLengkap ?? ''}
                          onChange={(e) => updateField('namaLengkap', e.target.value)}
                          className="doc-inline-input font-bold"
                        />
                      ) : (
                        toTitleCase(data.namaLengkap)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top py-0.5">Tempat/Tanggal Lahir</td>
                    <td className="align-top py-0.5">:</td>
                    <td className="py-0.5">
                      {isEditing ? (
                        <input
                          type="text"
                          value={data.tempatTanggalLahir ?? ''}
                          onChange={(e) => updateField('tempatTanggalLahir', e.target.value)}
                          className="doc-inline-input"
                        />
                      ) : (
                        toTitleCase(data.tempatTanggalLahir)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top py-0.5">NIK</td>
                    <td className="align-top py-0.5">:</td>
                    <td className="py-0.5 font-mono">
                      {isEditing ? (
                        <input
                          type="text"
                          inputMode="numeric"
                          value={data.nik ?? ''}
                          onChange={(e) => updateField('nik', e.target.value)}
                          className="doc-inline-input font-mono font-bold"
                        />
                      ) : (
                        data.nik
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top py-0.5">Alamat</td>
                    <td className="align-top py-0.5">:</td>
                    <td className="py-0.5 leading-snug">
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={data.alamatKtp ?? ''}
                          onChange={(e) => updateField('alamatKtp', e.target.value)}
                          className="doc-inline-input leading-snug"
                        />
                      ) : (
                        toTitleCase(data.alamatKtp)
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pernyataan Pengantar Jaminan - Spasi 1.5 */}
            <div className="mt-2 space-y-1 text-justify text-justify-formal text-[11pt] leading-spasi-1-5" style={{ lineHeight: '1.5' }}>
              <p style={{ lineHeight: '1.5' }}>
                adalah benar calon jamaah umrah {data.namaPerusahaan || 'PT. Alzam Mandiri Wisata'} sebagai penyelenggara resmi perjalanan umrah dan kami bertanggungjawab dan menjamin sepenuhnya terhadap calon jamaah umrah kami dengan memperhatikan hal-hal sebagai berikut :
              </p>

              {/* 4 POIN JAMINAN: KHUSUS SPASI 1.15 MURNI (leading-spasi-1-15 / line-height: 1.20) */}
              <div className="space-y-1 ml-1 mt-1.5">
                <div className="flex items-start gap-2 text-justify text-justify-formal">
                  <span className="w-4 shrink-0 font-normal">1.</span>
                  <p className="flex-1 leading-spasi-1-15" style={{ lineHeight: '1.20' }}>
                    Pemohon paspor yang kami urus adalah WNI (Warga Negara Indonesia) yang sebenarnya akan melakukan perjalanan ke Arab Saudi dalam rangka menunaikan ibadah umrah.
                  </p>
                </div>

                <div className="flex items-start gap-2 text-justify text-justify-formal">
                  <span className="w-4 shrink-0 font-normal">2.</span>
                  <p className="flex-1 leading-spasi-1-15" style={{ lineHeight: '1.20' }}>
                    Rombongan calon jamaah umrah yang kami urus tidak akan melakukan pelanggaran peraturan keimigrasian berupa penyalahgunaan izin tinggal, tidak melebihi izin tinggalnya (Overstay) memalsukan atau membuat palsu paspor yang diberikan kepadanya maupun bekerja secara ilegal.
                  </p>
                </div>

                <div className="flex items-start gap-2 text-justify text-justify-formal">
                  <span className="w-4 shrink-0 font-normal">3.</span>
                  <p className="flex-1 leading-spasi-1-15" style={{ lineHeight: '1.20' }}>
                    Apabila terjadi pelanggaran sebagaimana dimaksud, maka izin usaha kami sebagai penyelenggara perjalanan ibadah umrah bersedia dicabut.
                  </p>
                </div>

                <div className="flex items-start gap-2 text-justify text-justify-formal">
                  <span className="w-4 shrink-0 font-normal">4.</span>
                  <p className="flex-1 leading-spasi-1-15" style={{ lineHeight: '1.20' }}>
                    Jadwal keberangkatan dan kepulangan ke Indonesia dari Tanggal{' '}
                    <span className="font-bold text-slate-950">
                      {isEditing ? (
                        <input
                          type="text"
                          value={data.jadwalKeberangkatanDanKepulangan || data.estimasiKeberangkatan || '20 - 28 Februari 2027'}
                          onChange={(e) => {
                            updateField('jadwalKeberangkatanDanKepulangan', e.target.value);
                            updateField('estimasiKeberangkatan', e.target.value);
                          }}
                          className="doc-inline-input font-bold"
                        />
                      ) : (
                        data.jadwalKeberangkatanDanKepulangan || data.estimasiKeberangkatan || '20 - 28 Februari 2027'
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Penutup - Rata Kanan dan Kiri - Spasi 1.5 */}
            <div className="mt-2 text-justify text-justify-formal space-y-1 text-[11pt] leading-spasi-1-5" style={{ lineHeight: '1.5' }}>
              <p style={{ lineHeight: '1.5' }}>
                Demikian surat Pernyataan dan Jaminan ini kami buat dengan sebenarnya untuk dipergunakan sebagaimana mestinya. Atas perhatian dan kerjasamanya kami ucapkan terima kasih. Wassalamu'alaikum warahmatullahi wabarakatuh
              </p>
            </div>

            {renderSignatureAlzam()}
          </div>
        )}
      </div>

      {/* Sticky Mobile Floating Navigation & Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1B3024]/95 backdrop-blur-md border-t border-[#3D604C] p-3 px-4 shadow-2xl z-30 flex items-center justify-between gap-2.5 sm:hidden">
        <button
          type="button"
          onClick={() => setIsInlineEditMode(!isInlineEditMode)}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
            isInlineEditMode
              ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
              : 'bg-[#244030] text-[#FAF7F2] border-[#3D604C]'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5 text-[#E68F65]" />
          <span>{isInlineEditMode ? 'Tutup Edit' : 'Edit di Surat'}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="flex-1 py-2.5 bg-[#D96B38] active:bg-[#C25B2A] text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
        >
          {isGeneratingPdf ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span>Unduh PDF</span>
        </button>
      </div>
    </div>
  );
};
