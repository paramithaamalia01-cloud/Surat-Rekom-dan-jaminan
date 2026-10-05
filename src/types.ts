export type LetterTemplateType = 'permohonan_paspor' | 'pernyataan_jaminan' | 'paket_lengkap_alzam' | 'rekomendasi';

export interface ApplicantData {
  templateType?: LetterTemplateType;
  nik: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  tempatTanggalLahir: string;
  jenisKelamin: 'LAKI-LAKI' | 'PEREMPUAN' | string;
  alamatKtp: string;
  nomorKk: string;
  namaKepalaKeluarga: string;
  agama?: string;
  pekerjaan?: string;
  statusPerkawinan?: string;
  kewarganegaraan?: string;
  negaraTujuan: string;
  estimasiKeberangkatan: string;
  keperluan: string;
  kantorImigrasiTujuan?: string;
  nomorSurat: string;
  nomorSuratPernyataan?: string;
  idJamaah?: string;
  tanggalSurat: string;
  kotaPenerbitan?: string;
  pejabatNama: string;
  pejabatJabatan: string;
  namaPerusahaan: string;
  alamatPerusahaan: string;
  perihal?: string;
  izinPpiu?: string;
  tanggalIzinPpiu?: string;
  tujuanKantorImigrasi?: string;
  alamatKantorImigrasi?: string;
  teleponPerusahaan?: string;
  emailPerusahaan?: string;
  websitePerusahaan?: string;
  taglinePerusahaan?: string;
  jadwalKeberangkatanDanKepulangan?: string;
  customAssets?: {
    logoAlzam?: string;
    logoUmrahBisa?: string;
    stempel?: string;
    ttd?: string;
  };
  crossCheckStatus?: {
    nikValid: boolean;
    kkValid: boolean;
    nameMatched: boolean;
    notes: string;
  };
}

export interface UploadedFiles {
  ktpBase64: string | null;
  ktpName: string | null;
  kkBase64: string | null;
  kkName: string | null;
}

export interface LetterRecord extends ApplicantData {
  id: string;
  createdAt: string;
  withMaterai: boolean;
  withStamp: boolean;
  withSignature: boolean;
}
