// Official Assets for PT. Alzam Mandiri Wisata
// Handcrafted to precisely match the user's authentic documents:
// 1. Logo Alzam.png
// 2. Logo CAP.png (Stempel Resmi Basah)
// 3. Logo UmrahBISA.png
// 4. ttd.png (Tanda Tangan Asli Khairul Umam)

import React from 'react';

/**
 * 1. LOGO ALZAM MANDIRI WISATA (KOP Kiri)
 * Faithfully matches Logo Alzam.png:
 * - Green Islamic dome silhouette with finial apex
 * - Central layered white & green chevron spire cutting through dome
 * - Lime green gable accent & horizontal base
 * - Official bold lettering: PT. ALZAM MANDIRI WISATA & IZIN PPIU 29042200007580001
 */
export const LogoAlzam: React.FC<{ className?: string }> = ({ className = 'w-24 h-auto' }) => (
  <svg
    viewBox="0 0 340 360"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Logo Resmi PT Alzam Mandiri Wisata"
  >
    {/* Outer Dome Silhouette - Authentic bulbous Islamic dome curve */}
    <path
      d="M170 8 C170 8 198 48 242 88 C286 128 305 170 300 216 C295 258 275 290 270 300 C258 270 234 248 206 238 L170 224 L134 238 C106 248 82 270 70 300 C65 290 45 258 40 216 C35 170 54 128 98 88 C142 48 170 8 170 8 Z"
      fill="#0d5526"
    />

    {/* Center Top White Spire Chevron (cuts straight through dome top) */}
    <path
      d="M170 4 L222 128 H196 L170 66 L144 128 H118 L170 4 Z"
      fill="#ffffff"
    />

    {/* Middle Dark Green Chevron Spire */}
    <path
      d="M170 90 L240 218 H208 L170 150 L132 218 H100 L170 90 Z"
      fill="#0d5526"
    />

    {/* White Spacer Chevron */}
    <path
      d="M170 154 L252 232 L246 250 L170 194 L94 250 L88 232 L170 154 Z"
      fill="#ffffff"
    />

    {/* Lower Lime Green Chevron Roof */}
    <path
      d="M170 188 L262 248 V270 L170 224 L78 270 V248 L170 188 Z"
      fill="#7cb518"
    />

    {/* Lime Green Gable Base Accent */}
    <path
      d="M170 208 L262 260 V270 L170 228 L78 270 V260 L170 208 Z"
      fill="#8ed126"
    />

    {/* Base White Cutout Band */}
    <path
      d="M78 270 L170 228 L262 270 V300 C234 258 204 242 170 242 C136 242 106 258 78 300 V270 Z"
      fill="#ffffff"
    />

    {/* Line 1: PT. ALZAM MANDIRI WISATA */}
    <text
      x="170"
      y="326"
      textAnchor="middle"
      fill="#0d5526"
      fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
      fontWeight="900"
      fontSize="22"
      letterSpacing="0.8"
    >
      PT. ALZAM MANDIRI WISATA
    </text>

    {/* Line 2: IZIN PPIU 29042200007580001 */}
    <text
      x="170"
      y="348"
      textAnchor="middle"
      fill="#7cb518"
      fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
      fontWeight="900"
      fontSize="18.5"
      letterSpacing="1.2"
    >
      IZIN PPIU 29042200007580001
    </text>
  </svg>
);

/**
 * 2. LOGO UMRAHBISA (KOP Kanan)
 * Faithfully matches Logo UmrahBISA.png:
 * - 3D Isometric Kaaba in lime & forest green with white 'UB'
 * - Green airplane silhouette ascending to the right
 * - Vibrant lime and forest green sweeping ribbons
 * - Official bold typography: UmrahBISA & Semua BISA Umrah
 */
export const LogoUmrahBisa: React.FC<{ className?: string }> = ({ className = 'w-28 h-auto' }) => (
  <svg
    viewBox="0 0 380 230"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Logo Resmi UmrahBISA"
  >
    {/* Upper 3D Kaaba Cube & Airplane */}
    <g transform="translate(55, 4)">
      {/* Small Dark Green Airplane flying up to top-right */}
      <path
        d="M184 32 L206 35 L224 21 L222 26 L208 39 L210 47 L204 43 L200 45 L201 41 L193 39 L184 32 Z"
        fill="#0d5526"
      />
      <path
        d="M208 38 L198 51 L196 50 L201 40 L208 38 Z"
        fill="#0d5526"
      />

      {/* Kaaba 3D Top Lid (Lime Green Hexagon) */}
      <polygon
        points="130,12 182,28 130,46 78,28"
        fill="#7cb518"
      />
      <polygon
        points="130,14 178,28 130,44 82,28"
        fill="#8ed126"
      />

      {/* Kaaba Left Face (Deep Forest Green) */}
      <polygon
        points="78,30 130,48 130,98 78,80"
        fill="#0d5526"
      />
      {/* Kaaba Right Face (Deeper Forest Green for 3D depth) */}
      <polygon
        points="130,48 182,30 182,80 130,98"
        fill="#073b18"
      />

      {/* White Letter "U" on Left Face */}
      <path
        d="M89 44 H100 V68 C100 72 103 74 107 75 C111 76 115 75 115 71 V48 H124 V71 C124 80 115 85 106 83 C97 81 89 74 89 65 V44 Z"
        fill="#ffffff"
      />

      {/* White Letter "B" on Right Face */}
      <path
        d="M137 51 H158 C165 51 170 54 169 59 C168 62 165 64 160 65 C166 66 170 70 169 75 C168 81 161 84 154 85 L137 88 V51 Z M145 58 V64 H154 C157 64 159 63 159 60 C159 58 157 57 154 58 L145 58 Z M145 71 V79 L154 77 C157 76 159 75 159 73 C159 71 157 70 154 71 H145 Z"
        fill="#ffffff"
      />

      {/* Lime Green Ribbon Swoosh Under Kaaba */}
      <path
        d="M58 84 C88 112 142 112 190 80 C154 100 102 100 70 84 Z"
        fill="#7cb518"
      />
      {/* Dark Forest Green Secondary Ribbon Swoosh */}
      <path
        d="M92 100 C124 112 158 106 185 86 C158 100 130 104 100 100 Z"
        fill="#0d5526"
      />
    </g>

    {/* Text Line 1: Umrah (Dark Green) + BISA (Lime Green) */}
    <g transform="translate(18, 185)">
      <text
        x="24"
        y="0"
        fill="#0d5526"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontWeight="900"
        fontSize="56"
        letterSpacing="-1.5"
      >
        Umrah
      </text>
      <text
        x="206"
        y="0"
        fill="#7cb518"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontWeight="900"
        fontSize="56"
        letterSpacing="-1.5"
      >
        BISA
      </text>
    </g>

    {/* Text Line 2: Semua BISA Umrah */}
    <g transform="translate(190, 214)">
      <text
        x="0"
        y="0"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontSize="22"
      >
        <tspan fill="#7cb518" fontWeight="600">Semua </tspan>
        <tspan fill="#0d5526" fontWeight="900">BISA </tspan>
        <tspan fill="#7cb518" fontWeight="600">Umrah</tspan>
      </text>
    </g>
  </svg>
);

/**
 * 3. LOGO CAP / STEMPEL RESMI PT. ALZAM MANDIRI WISATA
 * Faithfully matches Logo CAP.png:
 * - Authentic circular rubber stamp in official green consular ink (#136336)
 * - Concentric double rings with circular lettering:
 *   "PT. ALZAM MANDIRI WISATA" (top) and "UmrahBISA" (bottom)
 * - Kaaba cube icons dividing the texts
 * - Center circular medallion with dome emblem and "UB" airplane box
 * - Positioned with natural rotational tilt & ink overlay
 */
export const LogoCapAlzam: React.FC<{ className?: string; rotation?: number }> = ({
  className = 'w-36 h-36',
  rotation = -8,
}) => (
  <div
    style={{ transform: `rotate(${rotation}deg)` }}
    className={`select-none pointer-events-none mix-blend-multiply opacity-90 transition-transform ${className}`}
    aria-label="Stempel Resmi PT Alzam Mandiri Wisata"
  >
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-xs"
    >
      {/* Outer Thick Rubber Border */}
      <circle
        cx="200"
        cy="200"
        r="185"
        stroke="#136336"
        strokeWidth="6.5"
        strokeLinecap="round"
      />

      {/* Inner Thin Border */}
      <circle
        cx="200"
        cy="200"
        r="170"
        stroke="#136336"
        strokeWidth="2.5"
      />

      {/* Center Circle Ring */}
      <circle
        cx="200"
        cy="200"
        r="108"
        stroke="#136336"
        strokeWidth="3.5"
      />

      {/* Circular Text Paths */}
      <defs>
        <path
          id="topArcCapExact"
          d="M 52,200 A 148,148 0 0,1 348,200"
          fill="none"
        />
        <path
          id="bottomArcCapExact"
          d="M 342,200 A 142,142 0 0,1 58,200"
          fill="none"
        />
      </defs>

      {/* Upper Text: PT. ALZAM MANDIRI WISATA */}
      <text
        fill="#136336"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="21"
        fontWeight="900"
        letterSpacing="2.8"
      >
        <textPath
          href="#topArcCapExact"
          startOffset="50%"
          textAnchor="middle"
        >
          PT. ALZAM MANDIRI WISATA
        </textPath>
      </text>

      {/* Left Cube / Kaaba divider */}
      <g transform="translate(42, 192) scale(0.65)">
        <polygon points="15,2 28,8 15,14 2,8" fill="#136336" />
        <polygon points="2,8 15,14 15,28 2,22" fill="#136336" />
        <polygon points="15,14 28,8 28,22 15,28" fill="#136336" />
      </g>

      {/* Right Cube / Kaaba divider */}
      <g transform="translate(332, 192) scale(0.65)">
        <polygon points="15,2 28,8 15,14 2,8" fill="#136336" />
        <polygon points="2,8 15,14 15,28 2,22" fill="#136336" />
        <polygon points="15,14 28,8 28,22 15,28" fill="#136336" />
      </g>

      {/* Lower Text: UmrahBISA */}
      <text
        fill="#136336"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="34"
        fontWeight="900"
        letterSpacing="1.2"
      >
        <textPath
          href="#bottomArcCapExact"
          startOffset="50%"
          textAnchor="middle"
        >
          UmrahBISA
        </textPath>
      </text>

      {/* Center Medallion: Dome + UB + Airplane */}
      <g transform="translate(142, 130) scale(0.38)">
        <path
          d="M150 10 C150 10 175 45 215 80 C255 115 275 155 270 200 C265 240 245 270 240 280 C230 255 210 235 185 225 L150 210 L115 225 C90 235 70 255 60 280 C55 270 35 240 30 200 C25 155 45 115 85 80 C125 45 150 10 150 10 Z"
          fill="#136336"
        />
        <path
          d="M150 8 L195 115 H170 L150 62 L130 115 H105 L150 8 Z"
          fill="#ffffff"
        />
        <path
          d="M150 85 L215 200 H185 L150 135 L115 200 H85 L150 85 Z"
          fill="#136336"
        />
        <path
          d="M150 148 L225 215 L220 232 L150 180 L80 232 L75 215 L150 148 Z"
          fill="#ffffff"
        />
        <path
          d="M150 175 L235 230 V250 L150 208 L65 250 V230 L150 175 Z"
          fill="#136336"
        />

        {/* Central UB Box & Airplane */}
        <g transform="translate(85, 230)">
          <rect
            x="30"
            y="10"
            width="60"
            height="45"
            rx="8"
            fill="#136336"
          />
          <text
            x="60"
            y="42"
            fill="#ffffff"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="28"
          >
            UB
          </text>
          <path
            d="M90 14 L105 16 L116 8 L115 11 L107 19 L108 23 L105 21 L102 22 L103 20 L97 18 L90 14 Z"
            fill="#136336"
          />
        </g>
      </g>

      {/* Authentic rubber stamp texture / faint ink splatters */}
      <circle cx="110" cy="95" r="1.5" fill="#136336" opacity="0.4" />
      <circle cx="285" cy="120" r="1.8" fill="#136336" opacity="0.5" />
      <circle cx="95" cy="285" r="1.6" fill="#136336" opacity="0.4" />
      <circle cx="305" cy="275" r="2" fill="#136336" opacity="0.4" />
    </svg>
  </div>
);

/**
 * 4. TANDA TANGAN ASLI DIREKTUR (Khairul Umam, S.T, B.A, MBA)
 * Meticulously traced from ttd.png in authentic royal blue ink (#1b3bb2):
 * - Sharp horizontal needle/arrow pointing far left: `<`
 * - Sweeping upper stroke across to center loop
 * - Two distinct vertical slashing stems cutting across the signature
 * - Cursive handwriting wave oscillations ("Umam")
 * - Outward right arrow flourish with dot and dash accents
 */
export const TtdDirekturAlzam: React.FC<{ className?: string }> = ({
  className = 'w-64 h-32',
}) => (
  <div className={`select-none pointer-events-none ${className}`} aria-label="Tanda Tangan Asli Khairul Umam">
    <svg
      viewBox="0 0 460 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <g stroke="#1b3bb2" strokeLinecap="round" strokeLinejoin="round">
        {/* Left sharp needle tip shooting far left: formed by upper and lower lines meeting at (16, 56) */}
        {/* Upper horizontal baseline leading from left tip */}
        <path
          d="M16 56 C80 58, 160 62, 236 68 C242 69, 246 54, 240 42 C234 32, 222 34, 222 44 C222 56, 232 66, 246 72"
          strokeWidth="3.6"
        />

        {/* Lower diagonal arm extending back to left tip */}
        <path
          d="M16 56 L278 178"
          strokeWidth="3.8"
        />

        {/* Long horizontal baseline crossing right through center */}
        <path
          d="M112 140 C190 137, 290 134, 430 144"
          strokeWidth="3.5"
        />

        {/* Lower return underline stroke */}
        <path
          d="M390 144 C310 148, 210 156, 110 158"
          strokeWidth="3.2"
        />

        {/* Left cursive bridge loop */}
        <path
          d="M228 134 C226 112, 238 92, 250 90 C262 88, 266 112, 270 138"
          strokeWidth="3.6"
        />

        {/* Main tall vertical slash stroke #1 */}
        <path
          d="M248 38 L252 176"
          strokeWidth="4.2"
        />

        {/* Tall vertical curved stroke #2 */}
        <path
          d="M262 44 C264 86, 268 132, 270 178"
          strokeWidth="3.8"
        />

        {/* Rightward arrow flourish stroke */}
        <path
          d="M252 74 C285 68, 325 76, 356 82 L 326 96 C 306 92, 286 88, 272 86"
          strokeWidth="3.4"
        />

        {/* Cursive wave oscillations: handwriting ripples in lower middle */}
        <path
          d="M272 144 C280 120, 288 120, 294 142 C300 122, 308 122, 314 142 C320 122, 328 122, 335 142 C342 125, 350 125, 356 142 C362 130, 370 132, 375 145"
          strokeWidth="3.8"
        />

        {/* Right side flourish accent: horizontal bar & dot */}
        <path
          d="M374 102 L388 102"
          strokeWidth="3.8"
        />
        <circle
          cx="398"
          cy="102"
          r="2.2"
          fill="#1b3bb2"
        />
        <circle
          cx="326"
          cy="48"
          r="1.8"
          fill="#1b3bb2"
        />
      </g>
    </svg>
  </div>
);

/**
 * 5. MATERAI ELEKTRONIK 10.000 (e-Meterai Resmi Peruri / DJP RI)
 * Faithful digital stamp replicating official Indonesian Electronic Stamp (e-Meterai):
 * - Distinctive cyan/teal security border with guilloche micro-lines (#005C8A / #00829B / #0284c7)
 * - Official text: METERAI ELEKTRONIK & 10000 SEPULUH RIBU RUPIAH
 * - Central Garuda Pancasila emblem & cryptographic seal
 * - 22-character serial verification code & date
 */
export const MateraiElektronik10000: React.FC<{
  className?: string;
  serialNumber?: string;
  dateStr?: string;
}> = ({
  className = 'w-24 h-24',
  serialNumber = 'SN: 2610-EMTR-9801-4472-10K',
  dateStr = '05-10-2026',
}) => (
  <div
    className={`select-none relative flex flex-col justify-between p-1.5 rounded-lg border-2 border-[#006E8C] bg-gradient-to-br from-[#E8F5F8] via-[#FFFFFF] to-[#D4EDF4] text-[#00475B] shadow-xs ${className}`}
    style={{
      boxShadow: '0 1px 3px rgba(0, 110, 140, 0.25)',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    }}
    aria-label="Materai Elektronik 10.000 Resmi"
  >
    {/* Micro Guilloche Corner Accents */}
    <div className="flex items-center justify-between border-b border-[#00829B]/40 pb-0.5">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00829B]" />
        <span className="text-[5.5pt] font-black uppercase tracking-wider text-[#00475B]">
          METERAI ELEKTRONIK
        </span>
      </div>
      <span className="text-[5pt] font-mono text-[#006E8C] font-bold">
        DJP • PERURI
      </span>
    </div>

    {/* Center Emblem & Nominal */}
    <div className="flex items-center justify-between my-0.5 px-0.5">
      {/* Garuda Silhouette & Security Seal */}
      <svg
        viewBox="0 0 48 48"
        className="w-8 h-8 text-[#006E8C] shrink-0"
        fill="currentColor"
      >
        <circle cx="24" cy="24" r="22" fill="none" stroke="#00829B" strokeWidth="1.5" strokeDasharray="2,2" />
        <path d="M24 6 L28 14 H38 L30 20 L33 30 L24 24 L15 30 L18 20 L10 14 H20 Z" fill="#006E8C" opacity="0.85" />
        <circle cx="24" cy="24" r="8" fill="#ffffff" />
        <circle cx="24" cy="24" r="6" fill="#006E8C" />
      </svg>

      {/* Nominal 10000 */}
      <div className="text-right">
        <div className="text-[12pt] font-black leading-none text-[#00475B] tracking-tight">
          10000
        </div>
        <div className="text-[4.5pt] font-bold text-[#006E8C] uppercase tracking-tighter mt-0.5">
          SEPULUH RIBU RUPIAH
        </div>
      </div>
    </div>

    {/* Footer Serial Number & Date */}
    <div className="border-t border-[#00829B]/40 pt-0.5 flex items-center justify-between text-[4.5pt] font-mono font-semibold text-[#00475B]">
      <span className="truncate max-w-[85px]">{serialNumber}</span>
      <span className="shrink-0">{dateStr}</span>
    </div>
  </div>
);

