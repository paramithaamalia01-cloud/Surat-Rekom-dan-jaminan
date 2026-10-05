import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  User,
  CreditCard,
  Users,
  Compass,
  RefreshCw,
  Eye,
  Info,
  Sparkles,
  X,
  Building,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { ApplicantData, UploadedFiles } from '../types';
import { validateNik, validateNoKk, toTitleCase, formatApplicantData } from '../utils/letterFormatter';

interface VerificationFormProps {
  data: ApplicantData;
  setData: React.Dispatch<React.SetStateAction<ApplicantData>>;
  files: UploadedFiles;
  onProceedToLetter: () => void;
  onBackToUpload: () => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  data,
  setData,
  files,
  onProceedToLetter,
  onBackToUpload,
}) => {
  const [activePreview, setActivePreview] = useState<'ktp' | 'kk'>('ktp');
  const [showAdvancedCompany, setShowAdvancedCompany] = useState<boolean>(false);

  const nikValidation = validateNik(data.nik || '');
  const kkValidation = validateNoKk(data.nomorKk || '');

  // Auto-format all fields to clean Title Case on initial mount
  useEffect(() => {
    setData((prev) => formatApplicantData(prev));
  }, []);

  const handleFieldChange = (field: keyof ApplicantData, value: string) => {
    setData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'tempatLahir' || field === 'tanggalLahir') {
        const tLahir = field === 'tempatLahir' ? value : (prev.tempatLahir || '');
        const tgLahir = field === 'tanggalLahir' ? value : (prev.tanggalLahir || '');
        updated.tempatTanggalLahir = `${tLahir}, ${tgLahir}`.trim().replace(/^,\s*/, '').replace(/,\s*$/, '');
      }
      return updated;
    });
  };

  const handleFormatAllToTitleCase = () => {
    setData((prev) => formatApplicantData(prev));
  };

  const regenerateLetterNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const romanMonth = romanMonths[now.getMonth()];
    const random4 = Math.floor(1000 + Math.random() * 9000);
    const random4b = Math.floor(1000 + Math.random() * 9000);
    handleFieldChange('nomorSurat', `${random4}/SR/AMW/${romanMonth}/${year}`);
    handleFieldChange('nomorSuratPernyataan', `${random4b}/SR/AMW/${romanMonth}/${year}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full w-fit mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Langkah 2: Verifikasi &amp; Edit Data Identitas
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Formulir Data Pemohon Surat Resmi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Anda dapat menambah, menghapus, atau mengubah ketikan data langsung di bawah ini.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={onBackToUpload}
            className="flex-1 md:flex-none px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-all text-center"
          >
            Pindai Ulang
          </button>
          <button
            type="button"
            onClick={onProceedToLetter}
            className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Buka Pratinjau Surat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Validation Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* NIK Card */}
        <div className={`p-4 rounded-xl border transition-colors ${nikValidation.isValid ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-amber-50/80 border-amber-300 text-amber-900'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold">Validasi NIK KTP (16 Digit)</span>
            {nikValidation.isValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
          </div>
          <div className="font-mono text-base font-bold tracking-wider">
            {data.nik || '[Belum Terisi]'}
          </div>
          <p className="text-[11px] mt-1 opacity-80">{nikValidation.message}</p>
        </div>

        {/* KK Card */}
        <div className={`p-4 rounded-xl border transition-colors ${kkValidation.isValid ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-amber-50/80 border-amber-300 text-amber-900'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold">Validasi Nomor KK (16 Digit)</span>
            {kkValidation.isValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
          </div>
          <div className="font-mono text-base font-bold tracking-wider">
            {data.nomorKk || '[Belum Terisi]'}
          </div>
          <p className="text-[11px] mt-1 opacity-80">{kkValidation.message}</p>
        </div>

        {/* Cross Check Match */}
        <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 text-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold">Pemeriksaan Hubungan KK</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xs font-semibold text-slate-700 truncate">
            Kepala Keluarga: <span className="font-bold text-slate-900">{data.namaKepalaKeluarga || '-'}</span>
          </div>
          <p className="text-[11px] mt-1 text-slate-500">
            Terverifikasi dalam database berkas keluarga pemohon.
          </p>
        </div>
      </div>

      {/* Main Split Layout: Left Form Fields, Right Original Document Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Fields Editor (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                Data Pemohon Utama (Untuk Dicantumkan di Surat)
              </h3>
              <span className="text-[11px] text-slate-400">Sentuh / ketik kolom di bawah untuk mengedit</span>
            </div>

            <button
              type="button"
              onClick={handleFormatAllToTitleCase}
              className="text-[11px] text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all w-fit cursor-pointer shadow-xs"
              title="Rapikan semua tulisan menjadi huruf kapital di awal kata (bukan CAPSLOCK)"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rapikan Huruf Awal Kata</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap (Sesuai Ejaan KTP) *
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={data.namaLengkap ?? ''}
                  onChange={(e) => handleFieldChange('namaLengkap', e.target.value)}
                  onBlur={(e) => handleFieldChange('namaLengkap', toTitleCase(e.target.value))}
                  autoCapitalize="words"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full text-base sm:text-sm px-3.5 py-3 sm:py-2.5 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold tracking-wide min-h-[48px] bg-white text-slate-900"
                  placeholder="Contoh: Euis Cholishoh"
                />
                {Boolean(data.namaLengkap) && (
                  <button
                    type="button"
                    onClick={() => handleFieldChange('namaLengkap', '')}
                    className="absolute right-2.5 p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-100 transition-colors"
                    title="Hapus nama"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* NIK & KK in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Induk Kependudukan (NIK) *
                </label>
                <div className="relative flex items-center">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={16}
                    value={data.nik ?? ''}
                    onChange={(e) => handleFieldChange('nik', e.target.value)}
                    className={`w-full text-base sm:text-sm pl-9 pr-10 py-3 sm:py-2.5 border rounded-xl font-mono font-bold tracking-wider focus:ring-2 focus:outline-hidden min-h-[48px] bg-white text-slate-900 ${
                      nikValidation.isValid ? 'border-slate-300 focus:ring-emerald-500' : 'border-amber-400 bg-amber-50/30 focus:ring-amber-500'
                    }`}
                    placeholder="3604xxxxxxxxxxxx"
                  />
                  {Boolean(data.nik) && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('nik', '')}
                      className="absolute right-2.5 p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-100 transition-colors"
                      title="Hapus NIK"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                  <span>Standar 16 digit</span>
                  <span>{(data.nik || '').replace(/[^0-9]/g, '').length} / 16 digit</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Kartu Keluarga (KK) *
                </label>
                <div className="relative flex items-center">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={16}
                    value={data.nomorKk ?? ''}
                    onChange={(e) => handleFieldChange('nomorKk', e.target.value)}
                    className={`w-full text-base sm:text-sm pl-9 pr-10 py-3 sm:py-2.5 border rounded-xl font-mono font-bold tracking-wider focus:ring-2 focus:outline-hidden min-h-[48px] bg-white text-slate-900 ${
                      kkValidation.isValid ? 'border-slate-300 focus:ring-emerald-500' : 'border-amber-400 bg-amber-50/30 focus:ring-amber-500'
                    }`}
                    placeholder="3604xxxxxxxxxxxx"
                  />
                  {Boolean(data.nomorKk) && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('nomorKk', '')}
                      className="absolute right-2.5 p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-100 transition-colors"
                      title="Hapus KK"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                  <span>Standar 16 digit</span>
                  <span>{(data.nomorKk || '').replace(/[^0-9]/g, '').length} / 16 digit</span>
                </div>
              </div>
            </div>

            {/* Tempat / Tgl Lahir & Jenis Kelamin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tempat / Tgl Lahir (TTL) *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={data.tempatTanggalLahir ?? ''}
                    onChange={(e) => handleFieldChange('tempatTanggalLahir', e.target.value)}
                    onBlur={(e) => handleFieldChange('tempatTanggalLahir', toTitleCase(e.target.value))}
                    autoCapitalize="words"
                    autoCorrect="off"
                    spellCheck="false"
                    className="w-full text-base sm:text-sm px-3.5 py-3 sm:py-2.5 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden min-h-[48px] bg-white text-slate-900"
                    placeholder="Contoh: Serang, 13 April 1995"
                  />
                  {Boolean(data.tempatTanggalLahir) && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('tempatTanggalLahir', '')}
                      className="absolute right-2.5 p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-100 transition-colors"
                      title="Hapus tempat tanggal lahir"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jenis Kelamin *
                </label>
                <select
                  value={data.jenisKelamin || 'PEREMPUAN'}
                  onChange={(e) => handleFieldChange('jenisKelamin', e.target.value)}
                  className="w-full text-base sm:text-sm px-3.5 py-3 sm:py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white font-medium min-h-[48px] text-slate-900"
                >
                  <option value="LAKI-LAKI">LAKI-LAKI</option>
                  <option value="PEREMPUAN">PEREMPUAN</option>
                </select>
              </div>
            </div>

            {/* Alamat KTP Lengkap */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Alamat KTP Lengkap (RT/RW, Desa, Kec, Kab/Kota, Provinsi) *
                </label>
                {Boolean(data.alamatKtp) && (
                  <button
                    type="button"
                    onClick={() => handleFieldChange('alamatKtp', '')}
                    className="text-[11px] text-slate-400 hover:text-red-500 flex items-center gap-1 cursor-pointer py-0.5"
                  >
                    <X className="w-3.5 h-3.5" /> Hapus Alamat
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                value={data.alamatKtp ?? ''}
                onChange={(e) => handleFieldChange('alamatKtp', e.target.value)}
                onBlur={(e) => handleFieldChange('alamatKtp', toTitleCase(e.target.value))}
                autoCapitalize="sentences"
                autoCorrect="off"
                spellCheck="false"
                className="w-full text-base sm:text-sm px-3.5 py-3 sm:py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden leading-relaxed bg-white text-slate-900"
                placeholder="Contoh: Kp. Kubang Laban Rt.005, Rw.003, Kelurahan Lambangsari, Kec. Bojonegara, Kabupaten Serang, Provinsi Banten"
              />
            </div>

            {/* Nama Kepala Keluarga */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Kepala Keluarga (Sesuai Kartu Keluarga)
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={data.namaKepalaKeluarga ?? ''}
                  onChange={(e) => handleFieldChange('namaKepalaKeluarga', e.target.value)}
                  onBlur={(e) => handleFieldChange('namaKepalaKeluarga', toTitleCase(e.target.value))}
                  autoCapitalize="words"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full text-base sm:text-sm px-3.5 py-3 sm:py-2.5 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium min-h-[48px] bg-white text-slate-900"
                  placeholder="Contoh: Euis Cholishoh"
                />
                {Boolean(data.namaKepalaKeluarga) && (
                  <button
                    type="button"
                    onClick={() => handleFieldChange('namaKepalaKeluarga', '')}
                    className="absolute right-2.5 p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-100 transition-colors"
                    title="Hapus nama kepala keluarga"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Kantor Imigrasi Tujuan & Tanggal Keberangkatan */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tujuan Kantor Imigrasi (Untuk Surat Permohonan)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={data.tujuanKantorImigrasi ?? 'Kepala Kantor Imigrasi Kelas II Cilegon'}
                      onChange={(e) => handleFieldChange('tujuanKantorImigrasi', e.target.value)}
                      onBlur={(e) => handleFieldChange('tujuanKantorImigrasi', toTitleCase(e.target.value))}
                      className="w-full text-base sm:text-sm px-3.5 py-3 sm:py-2.5 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium min-h-[48px] bg-white text-slate-900"
                      placeholder="Kepala Kantor Imigrasi Kelas II Cilegon"
                    />
                    {Boolean(data.tujuanKantorImigrasi) && (
                      <button
                        type="button"
                        onClick={() => handleFieldChange('tujuanKantorImigrasi', '')}
                        className="absolute right-2.5 p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-100 transition-colors"
                        title="Hapus tujuan kantor imigrasi"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jadwal Keberangkatan &amp; Kepulangan
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={data.jadwalKeberangkatanDanKepulangan || data.estimasiKeberangkatan || '16 - 24 November 2026'}
                      onChange={(e) => {
                        handleFieldChange('jadwalKeberangkatanDanKepulangan', e.target.value);
                        handleFieldChange('estimasiKeberangkatan', e.target.value);
                      }}
                      className="w-full text-base sm:text-sm px-3.5 py-3 sm:py-2.5 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium min-h-[48px] bg-white text-slate-900"
                      placeholder="16 - 24 November 2026"
                    />
                    {Boolean(data.jadwalKeberangkatanDanKepulangan || data.estimasiKeberangkatan) && (
                      <button
                        type="button"
                        onClick={() => {
                          handleFieldChange('jadwalKeberangkatanDanKepulangan', '');
                          handleFieldChange('estimasiKeberangkatan', '');
                        }}
                        className="absolute right-2.5 p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-100 transition-colors"
                        title="Hapus jadwal"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Kantor Imigrasi
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={data.alamatKantorImigrasi ?? 'Jl. KH. Yasin Beji No.8, Kotabumi, Kec. Purwakarta, Kota Cilegon, Banten 42434'}
                    onChange={(e) => handleFieldChange('alamatKantorImigrasi', e.target.value)}
                    onBlur={(e) => handleFieldChange('alamatKantorImigrasi', toTitleCase(e.target.value))}
                    className="w-full text-base sm:text-sm px-3.5 py-3 sm:py-2.5 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden min-h-[48px] bg-white text-slate-900"
                    placeholder="Alamat kantor imigrasi..."
                  />
                  {Boolean(data.alamatKantorImigrasi) && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('alamatKantorImigrasi', '')}
                      className="absolute right-2.5 p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-100 transition-colors"
                      title="Hapus alamat imigrasi"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Letter Number and Date */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Nomor Surat Permohonan</span>
                  <button
                    type="button"
                    onClick={regenerateLetterNumber}
                    className="text-[10px] text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-semibold cursor-pointer py-0.5"
                  >
                    <RefreshCw className="w-3 h-3" /> Acak Ulang
                  </button>
                </label>
                <input
                  type="text"
                  value={data.nomorSurat ?? ''}
                  onChange={(e) => handleFieldChange('nomorSurat', e.target.value)}
                  className="w-full text-base sm:text-sm px-3.5 py-3 sm:py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono min-h-[48px] bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tanggal Surat Diterbitkan
                </label>
                <input
                  type="text"
                  value={data.tanggalSurat ?? ''}
                  onChange={(e) => handleFieldChange('tanggalSurat', e.target.value)}
                  className="w-full text-base sm:text-sm px-3.5 py-3 sm:py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden min-h-[48px] bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Advanced Accordion: Data Kop Surat & Pejabat Penandatangan PT Alzam */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAdvancedCompany(!showAdvancedCompany)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-600" />
                  Kop Surat &amp; Data Legalitas PT. Alzam Mandiri Wisata
                </span>
                {showAdvancedCompany ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvancedCompany && (
                <div className="mt-3 p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Direktur Utama</label>
                      <input
                        type="text"
                        value={data.pejabatNama ?? 'Khairul Umam, ST, BA, MBA'}
                        onChange={(e) => handleFieldChange('pejabatNama', e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Jabatan Direktur</label>
                      <input
                        type="text"
                        value={data.pejabatJabatan ?? 'Direktur Utama'}
                        onChange={(e) => handleFieldChange('pejabatJabatan', e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Kota Penerbitan Surat</label>
                      <input
                        type="text"
                        value={data.kotaPenerbitan ?? 'Jakarta'}
                        onChange={(e) => handleFieldChange('kotaPenerbitan', e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Nomor Surat Pernyataan</label>
                      <input
                        type="text"
                        value={data.nomorSuratPernyataan ?? '7380/SR/AMW/X/2026'}
                        onChange={(e) => handleFieldChange('nomorSuratPernyataan', e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Document Reference Viewer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Peninjau Dokumen Asli
              </span>
              <div className="flex bg-slate-800 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActivePreview('ktp')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    activePreview === 'ktp' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  KTP
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreview('kk')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    activePreview === 'kk' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  KK
                </button>
              </div>
            </div>

            {/* Document Image Preview */}
            <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[16/11] flex items-center justify-center p-2">
              {activePreview === 'ktp' && files.ktpBase64 ? (
                <img
                  src={files.ktpBase64}
                  alt="KTP Reference"
                  className="max-h-full max-w-full object-contain"
                />
              ) : activePreview === 'kk' && files.kkBase64 ? (
                <img
                  src={files.kkBase64}
                  alt="KK Reference"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-center text-slate-500 text-xs p-4">
                  Dokumen {activePreview.toUpperCase()} belum dimuat.
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Bandingkan langsung digit NIK dan ejaan nama dengan berkas asli.
            </p>
          </div>

          {/* Quick Notice Card */}
          <div className="bg-emerald-950/50 border border-emerald-800/40 rounded-2xl p-5 text-emerald-100 text-xs space-y-2">
            <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-400" />
              Ketentuan Surat Resmi Imigrasi
            </h4>
            <p className="text-emerald-200/80 leading-relaxed text-[11.5px]">
              Dokumen ini secara resmi diterbitkan oleh <strong>PT. Alzam Mandiri Wisata</strong> (Izin PPIU No. 29042200007580004) sebagai penyelenggara resmi ibadah umrah untuk permohonan dan penjaminan paspor jamaah.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Floating Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3.5 px-4 shadow-2xl z-30 flex items-center justify-between gap-3 sm:hidden">
        <button
          type="button"
          onClick={onBackToUpload}
          className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold"
        >
          Pindai Ulang
        </button>
        <button
          type="button"
          onClick={onProceedToLetter}
          className="flex-1 py-2.5 bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2"
        >
          <span>Buka Surat Resmi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
