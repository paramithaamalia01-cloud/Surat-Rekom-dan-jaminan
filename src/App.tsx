import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DocumentUploader } from './components/DocumentUploader';
import { VerificationForm } from './components/VerificationForm';
import { LetterPreview } from './components/LetterPreview';
import { LetterArchive } from './components/LetterArchive';
import { ApplicantData, UploadedFiles, LetterRecord, LetterTemplateType } from './types';
import { DEMO_PROFILES, generateKtpImage, generateKkImage } from './utils/sampleDocuments';
import { useAuth } from './context/AuthContext';
import {
  subscribeToUserLetters,
  saveLetterToFirestore,
  deleteLetterFromFirestore,
} from './services/letterService';

const STORAGE_KEY = 'alzam_mandiri_wisata_archive_v1';

export const DEFAULT_APPLICANT: ApplicantData = {
  templateType: 'paket_lengkap_alzam',
  idJamaah: '3495',
  nik: '3604075304950002',
  namaLengkap: 'Euis Cholishoh',
  tempatLahir: 'Serang',
  tanggalLahir: '13 April 1995',
  tempatTanggalLahir: 'Serang, 13 April 1995',
  jenisKelamin: 'PEREMPUAN',
  alamatKtp: 'Kp. Kubang Laban Rt.005, Rw.003, Kelurahan Lambangsari, Kec. Bojonegara, Kabupaten Serang, Provinsi Banten',
  nomorKk: '3604070000000000',
  namaKepalaKeluarga: 'Euis Cholishoh',
  negaraTujuan: 'Arab Saudi',
  estimasiKeberangkatan: '16 - 24 November 2026',
  jadwalKeberangkatanDanKepulangan: '16 - 24 November 2026',
  keperluan: 'Permohonan Pembuatan Paspor Umrah',
  nomorSurat: '7379/SR/AMW/X/2026',
  nomorSuratPernyataan: '7380/SR/AMW/X/2026',
  perihal: 'Permohonan Pembuatan Paspor',
  tanggalSurat: '5 Oktober 2026',
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
  tujuanKantorImigrasi: 'Kepala Kantor Imigrasi Kelas II Cilegon',
  alamatKantorImigrasi: 'Jl. KH. Yasin Beji No.8, Kotabumi, Kec. Purwakarta, Kota Cilegon, Banten 42434',
  crossCheckStatus: {
    nikValid: true,
    kkValid: true,
    nameMatched: true,
    notes: 'Data siap diedit',
  },
};

export default function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'verify' | 'preview' | 'archive'>('upload');

  // Uploaded documents state
  const [files, setFiles] = useState<UploadedFiles>({
    ktpBase64: null,
    ktpName: null,
    kkBase64: null,
    kkName: null,
  });

  // Extracted applicant data state
  const [applicantData, setApplicantData] = useState<ApplicantData | null>(DEFAULT_APPLICANT);

  // Loading & error state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Archive state
  const [archive, setArchive] = useState<LetterRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse archive from localStorage', e);
    }
    return [
      {
        id: 'rec-alzam-01',
        createdAt: '2026-10-04T12:00:00Z',
        templateType: 'permohonan_paspor',
        withMaterai: false,
        withStamp: true,
        withSignature: true,
        nomorSurat: '7378/SR/AMW/X/2026',
        perihal: 'Permohonan Pembuatan Paspor',
        tujuanKantorImigrasi: 'Kepala Kantor Imigrasi Kelas II TPI Tanjung Pandan',
        alamatKantorImigrasi: 'Jl. Jendral Sudirman Km. 6,5, Desa Perawas, Kec. Tanjung Pandan, Kabupaten Belitung, Kepulauan Bangka Belitung 33413.',
        tanggalIzinPpiu: '02 Agustus 2022',
        tanggalSurat: '5 Oktober 2026',
        kotaPenerbitan: 'Jakarta',
        namaPerusahaan: 'PT. Alzam Mandiri Wisata',
        taglinePerusahaan: 'Tour & Travel',
        izinPpiu: '29042200007580004',
        alamatPerusahaan: 'Ciledug Mas, Jl. HOS Cokroaminoto Blok C9 dan C10, RT.003/RW.004, Sudimara Timur, Kecamatan Karang Tengah, Kota Tangerang, Banten 15151',
        teleponPerusahaan: '0815-9888-154',
        emailPerusahaan: 'alzam@bisa.id',
        websitePerusahaan: 'www.umrahbisa.com',
        pejabatNama: 'Khairul Umam, S.T, B.A, MBA',
        pejabatJabatan: 'Direktur Utama',
        namaLengkap: 'Shofiyullah Achmad Maksun',
        nik: '1902013011990002',
        nomorKk: '1902012005080003',
        tempatLahir: 'Jepara',
        tanggalLahir: '30 November 1999',
        tempatTanggalLahir: 'Jepara, 30 November 1999',
        jenisKelamin: 'LAKI-LAKI',
        alamatKtp: 'Jl. Air Ketekok Gg. Pinang RT/RW: 02/004 Kel/Desa: Air Ketekok, Kec. Tanjung Pandan',
        namaKepalaKeluarga: 'ACHMAD MAKSUN',
        negaraTujuan: 'Arab Saudi',
        estimasiKeberangkatan: '12 - 23 Januari 2026',
        jadwalKeberangkatanDanKepulangan: '12 - 23 Januari 2026',
        keperluan: 'Permohonan Pembuatan Paspor',
      },
    ];
  });

  // Sync with Firestore in real-time when user is authenticated
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserLetters(user.uid, (cloudLetters) => {
      if (cloudLetters && cloudLetters.length > 0) {
        setArchive(cloudLetters);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Save archive to localStorage as offline fallback
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(archive));
    } catch (e) {
      console.error('Failed to save archive to localStorage', e);
    }
  }, [archive]);

  // Show temporary toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // On successful extraction from AI Vision
  const handleExtractionSuccess = (data: ApplicantData) => {
    setApplicantData(data);
    setActiveTab('verify');
    triggerToast('Ekstraksi KTP & KK berhasil! Silakan periksa kelengkapan data.');
  };

  // Direct preview jump from Spreadsheet / Excel row input
  const handleDirectPreview = (data: ApplicantData) => {
    setApplicantData(data);
    setActiveTab('preview');
    triggerToast(`Data ${data.namaLengkap} berhasil dimuat langsung ke Surat Resmi!`);
  };

  // Switch between templates (Permohonan vs Pernyataan & Jaminan vs Rekomendasi)
  const handleUpdateTemplateType = (newTemplate: LetterTemplateType) => {
    if (!applicantData) return;

    if (newTemplate === 'permohonan_paspor') {
      setApplicantData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          templateType: 'permohonan_paspor',
          namaPerusahaan: 'PT. Alzam Mandiri Wisata',
          taglinePerusahaan: 'Tour & Travel',
          izinPpiu: '29042200007580004',
          alamatPerusahaan: 'Ciledug Mas, Jl. HOS Cokroaminoto Blok C9 dan C10, RT.003/RW.004, Sudimara Timur, Kecamatan Karang Tengah, Kota Tangerang, Banten 15151',
          teleponPerusahaan: '0815-9888-154',
          emailPerusahaan: 'alzam@bisa.id',
          websitePerusahaan: 'www.umrahbisa.com',
          pejabatNama: 'Khairul Umam, S.T, B.A, MBA',
          pejabatJabatan: 'Direktur Utama',
          perihal: 'Permohonan Pembuatan Paspor',
          tujuanKantorImigrasi: prev.tujuanKantorImigrasi || 'Kepala Kantor Imigrasi Kelas II TPI Tanjung Pandan',
          alamatKantorImigrasi: prev.alamatKantorImigrasi || 'Jl. Jendral Sudirman Km. 6,5, Desa Perawas, Kec. Tanjung Pandan, Kabupaten Belitung, Kepulauan Bangka Belitung 33413.',
          tanggalIzinPpiu: '02 Agustus 2022',
          nomorSurat: '7378/SR/AMW/X/2026',
          jadwalKeberangkatanDanKepulangan: prev.jadwalKeberangkatanDanKepulangan || '12 - 23 Januari 2026',
          tanggalSurat: '5 Oktober 2026',
          kotaPenerbitan: 'Jakarta',
        };
      });
      triggerToast('Format beralih ke: Surat Permohonan Pembuatan Paspor (PT. Alzam Mandiri Wisata)');
    } else if (newTemplate === 'pernyataan_jaminan') {
      setApplicantData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          templateType: 'pernyataan_jaminan',
          namaPerusahaan: 'PT. Alzam Mandiri Wisata',
          taglinePerusahaan: 'Tour & Travel',
          izinPpiu: '29042200007580004',
          alamatPerusahaan: 'Ciledug Mas, Jl. HOS Cokroaminoto Blok C9 dan C10, RT.003/RW.004, Sudimara Timur, Kecamatan Karang Tengah, Kota Tangerang, Banten 15151',
          teleponPerusahaan: '0815-9888-154',
          emailPerusahaan: 'alzam@bisa.id',
          websitePerusahaan: 'www.umrahbisa.com',
          pejabatNama: 'Khairul Umam, S.T, B.A, MBA',
          pejabatJabatan: 'Direktur Utama',
          perihal: 'Surat Pernyataan dan Jaminan',
          nomorSurat: '7377/SR/AMW/X/2026',
          jadwalKeberangkatanDanKepulangan: prev.jadwalKeberangkatanDanKepulangan || '12 - 23 Januari 2026',
          tanggalSurat: '5 Oktober 2026',
          kotaPenerbitan: 'Jakarta',
        };
      });
      triggerToast('Format beralih ke: Surat Pernyataan dan Jaminan (PT. Alzam Mandiri Wisata)');
    } else if (newTemplate === 'paket_lengkap_alzam') {
      setApplicantData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          templateType: 'paket_lengkap_alzam',
          namaPerusahaan: 'PT. Alzam Mandiri Wisata',
          taglinePerusahaan: 'Tour & Travel',
          izinPpiu: '29042200007580004',
          alamatPerusahaan: 'Ciledug Mas, Jl. HOS Cokroaminoto Blok C9 dan C10, RT.003/RW.004, Sudimara Timur, Kecamatan Karang Tengah, Kota Tangerang, Banten 15151',
          teleponPerusahaan: '0815-9888-154',
          emailPerusahaan: 'alzam@bisa.id',
          websitePerusahaan: 'www.umrahbisa.com',
          pejabatNama: 'Khairul Umam, S.T, B.A, MBA',
          pejabatJabatan: 'Direktur Utama',
          perihal: 'Permohonan Pembuatan Paspor',
          tujuanKantorImigrasi: prev.tujuanKantorImigrasi || 'Kepala Kantor Imigrasi Kelas II TPI Tanjung Pandan',
          alamatKantorImigrasi: prev.alamatKantorImigrasi || 'Jl. Jendral Sudirman Km. 6,5, Desa Perawas, Kec. Tanjung Pandan, Kabupaten Belitung, Kepulauan Bangka Belitung 33413.',
          tanggalIzinPpiu: '02 Agustus 2022',
          nomorSurat: '7378/SR/AMW/X/2026',
          jadwalKeberangkatanDanKepulangan: prev.jadwalKeberangkatanDanKepulangan || '12 - 23 Januari 2026',
          tanggalSurat: '5 Oktober 2026',
          kotaPenerbitan: 'Jakarta',
        };
      });
      triggerToast('Format beralih ke: Paket Lengkap 2 Surat Sekaligus (Permohonan + Jaminan)');
    } else {
      setApplicantData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          templateType: 'permohonan_paspor',
          namaPerusahaan: 'PT. Alzam Mandiri Wisata',
          izinPpiu: '29042200007580004',
          alamatPerusahaan: 'Ciledug Mas, Jl. HOS Cokroaminoto Blok C9 dan C10, RT.003/RW.004, Sudimara Timur, Kecamatan Karang Tengah, Kota Tangerang, Banten 15151',
          teleponPerusahaan: '0815-9888-154',
          emailPerusahaan: 'alzam@bisa.id',
          websitePerusahaan: 'www.umrahbisa.com',
          pejabatNama: 'Khairul Umam, S.T, B.A, MBA',
          pejabatJabatan: 'Direktur Utama',
          perihal: 'Permohonan Pembuatan Paspor',
          tanggalSurat: '5 Oktober 2026',
          kotaPenerbitan: 'Jakarta',
        };
      });
    }
  };

  // Save current letter to archive (Firestore if logged in, local state always)
  const handleSaveToArchive = async (options: { withMaterai: boolean; withStamp: boolean; withSignature: boolean }) => {
    if (!applicantData) return;

    const existingIndex = archive.findIndex(
      (rec) => rec.nomorSurat === applicantData.nomorSurat && rec.namaLengkap === applicantData.namaLengkap
    );

    const newRecord: LetterRecord = {
      ...applicantData,
      id: existingIndex >= 0 ? archive[existingIndex].id : `rec-${Date.now()}`,
      createdAt: new Date().toISOString(),
      withMaterai: options.withMaterai,
      withStamp: options.withStamp,
      withSignature: options.withSignature,
    };

    setArchive((prev) => {
      const filtered = prev.filter((r) => r.id !== newRecord.id);
      return [newRecord, ...filtered];
    });

    // Save to Firestore if user is authenticated
    if (user) {
      try {
        await saveLetterToFirestore(user.uid, newRecord);
        triggerToast('Surat berhasil disimpan ke Cloud Database Firestore!');
      } catch (err) {
        console.error('Firestore save failed:', err);
        triggerToast('Surat berhasil tersimpan di arsip lokal!');
      }
    } else {
      triggerToast('Surat berhasil tersimpan di arsip lokal!');
    }
  };

  const isCurrentSaved = applicantData
    ? archive.some((rec) => rec.nomorSurat === applicantData.nomorSurat)
    : false;

  // Open an archive record in the letter preview
  const handleOpenRecord = (record: LetterRecord) => {
    setApplicantData(record);
    setActiveTab('preview');
  };

  const handleDeleteRecord = async (id: string) => {
    setArchive((prev) => prev.filter((r) => r.id !== id));
    if (user) {
      try {
        await deleteLetterFromFirestore(id);
      } catch (err) {
        console.error('Failed to delete from Firestore:', err);
      }
    }
    triggerToast('Surat dihapus dari arsip.');
  };

  const handleClearAllArchive = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh arsip surat rekomendasi?')) {
      setArchive([]);
      triggerToast('Seluruh arsip berhasil dibersihkan.');
    }
  };

  // Initialize demo data from the user's PDF if user visits verify directly
  const initDefaultDataIfEmpty = () => {
    if (!applicantData) {
      const demo = DEMO_PROFILES[0]; // Shofiyullah Achmad Maksun (Alzam Mandiri Wisata)
      const ktpUrl = generateKtpImage(demo);
      const kkUrl = generateKkImage(demo);
      setFiles({
        ktpBase64: ktpUrl,
        ktpName: 'KTP_Shofiyullah_Achmad_Maksun.png',
        kkBase64: kkUrl,
        kkName: 'KK_Shofiyullah_Achmad_Maksun.png',
      });
      setApplicantData({
        templateType: 'permohonan_paspor',
        nik: '1902013011990002',
        namaLengkap: 'Shofiyullah Achmad Maksun',
        tempatLahir: 'Jepara',
        tanggalLahir: '30 November 1999',
        tempatTanggalLahir: 'Jepara, 30 November 1999',
        jenisKelamin: 'LAKI-LAKI',
        alamatKtp: 'Jl. Air Ketekok Gg. Pinang RT/RW: 02/004 Kel/Desa: Air Ketekok, Kec. Tanjung Pandan',
        nomorKk: '1902012005080003',
        namaKepalaKeluarga: 'ACHMAD MAKSUN',
        negaraTujuan: 'Arab Saudi',
        estimasiKeberangkatan: '12 - 23 Januari 2026',
        jadwalKeberangkatanDanKepulangan: '12 - 23 Januari 2026',
        keperluan: 'Permohonan Pembuatan Paspor',
        nomorSurat: '7378/SR/AMW/X/2026',
        perihal: 'Permohonan Pembuatan Paspor',
        tujuanKantorImigrasi: 'Kepala Kantor Imigrasi Kelas II TPI Tanjung Pandan',
        alamatKantorImigrasi: 'Jl. Jendral Sudirman Km. 6,5, Desa Perawas, Kec. Tanjung Pandan, Kabupaten Belitung, Kepulauan Bangka Belitung 33413.',
        tanggalIzinPpiu: '02 Agustus 2022',
        tanggalSurat: '5 Oktober 2026',
        kotaPenerbitan: 'Jakarta',
        pejabatNama: 'Khairul Umam, S.T, B.A, MBA',
        pejabatJabatan: 'Direktur Utama',
        namaPerusahaan: 'PT. Alzam Mandiri Wisata',
        taglinePerusahaan: 'Tour & Travel',
        izinPpiu: '29042200007580004',
        alamatPerusahaan: 'Ciledug Mas, Jl. HOS Cokroaminoto Blok C9 dan C10, RT.003/RW.004, Sudimara Timur, Kecamatan Karang Tengah, Kota Tangerang, Banten 15151',
        teleponPerusahaan: '0815-9888-154',
        emailPerusahaan: 'alzam@bisa.id',
        websitePerusahaan: 'www.umrahbisa.com',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F362A] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if ((tab === 'verify' || tab === 'preview') && !applicantData) {
            initDefaultDataIfEmpty();
          }
          setActiveTab(tab);
        }}
        hasData={applicantData !== null}
        archiveCount={archive.length}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#244030] text-[#FAF7F2] border border-[#D96B38] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-semibold print:hidden">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D96B38] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'upload' && (
          <DocumentUploader
            files={files}
            setFiles={setFiles}
            onExtractionSuccess={handleExtractionSuccess}
            onDirectPreview={handleDirectPreview}
            isAnalyzing={isAnalyzing}
            setIsAnalyzing={setIsAnalyzing}
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
          />
        )}

        {activeTab === 'verify' && applicantData && (
          <VerificationForm
            data={applicantData}
            setData={(updater) => {
              if (typeof updater === 'function') {
                setApplicantData((prev) => (prev ? updater(prev) : null));
              } else {
                setApplicantData(updater);
              }
            }}
            files={files}
            onProceedToLetter={() => setActiveTab('preview')}
            onBackToUpload={() => setActiveTab('upload')}
          />
        )}

        {activeTab === 'preview' && applicantData && (
          <LetterPreview
            data={applicantData}
            onEditData={() => setActiveTab('verify')}
            onSaveToArchive={handleSaveToArchive}
            isSavedInArchive={isCurrentSaved}
            onUpdateTemplateType={handleUpdateTemplateType}
            onUpdateApplicantData={setApplicantData}
          />
        )}

        {activeTab === 'archive' && (
          <LetterArchive
            archive={archive}
            onOpenRecord={handleOpenRecord}
            onDeleteRecord={handleDeleteRecord}
            onClearAll={handleClearAllArchive}
          />
        )}
      </main>

      {/* Consular Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-200">
              Sistem Surat Permohonan, Pernyataan &amp; Rekomendasi Paspor Umrah / Wisata
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              PT. Alzam Mandiri Wisata (IZIN PPIU 29042200007580004) • Database Terhubung Firebase Firestore
            </p>
          </div>
          <div className="text-[11px] text-slate-400">
            Format resmi sesuai standar Kantor Imigrasi Kemenkumham RI
          </div>
        </div>
      </footer>
    </div>
  );
}
