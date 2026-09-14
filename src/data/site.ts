// Every piece of copy on the site. Markup stays copy-free; edit here.

export type SocialIconName = "instagram" | "linkedin" | "youtube" | "whatsapp"

export interface Cta {
  label: string
  href: string
}

export const brand = {
  name: "Amani Group",
  mark: "A",
  description:
    "Amani Group mengelola empat unit usaha di tujuh cabang di bawah satu standar tata kelola.",
}

export const navLinks: Cta[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Unit Usaha", href: "/unit-usaha" },
  { label: "Artikel", href: "/artikel" },
]

export const contact = {
  address: ["Jl. Raya Amani No. 12", "Jakarta Selatan 12560"],
  email: "halo@amanigroup.co.id",
  investorEmail: "investor@amanigroup.co.id",
  phone: "+62 21 5555 0123",
  whatsapp: "https://wa.me/62215550123",
  whatsappPrefilled:
    "https://wa.me/62215550123?text=Halo%20Amani%20Group%2C%20saya%20ingin%20bertanya%20mengenai%20",
  instagramHandle: "@amanigroup",
  instagram: "https://instagram.com/amanigroup",
  hours: ["Senin – Jumat", "08.00 – 17.00 WIB"],
}

export const socials: { label: string; href: string; icon: SocialIconName }[] = [
  { label: "Instagram", href: "https://instagram.com/amanigroup", icon: "instagram" },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/amanigroup",
    icon: "linkedin",
  },
  { label: "YouTube", href: "https://youtube.com/@amanigroup", icon: "youtube" },
  { label: "WhatsApp", href: "https://wa.me/62215550123", icon: "whatsapp" },
]

export const footerColumns: { title: string; links: Cta[] }[] = [
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang kami", href: "/about" },
      { label: "Visi & misi", href: "/about#misi" },
      { label: "Tim manajemen", href: "/about#tim" },
      { label: "Artikel", href: "/artikel" },
    ],
  },
  {
    title: "Unit usaha",
    links: [
      { label: "Amani Laundry", href: "/unit-usaha/amani-laundry" },
      { label: "Amani Karpet", href: "/unit-usaha/amani-karpet" },
      { label: "Warkop Amani", href: "/unit-usaha/warkop-amani" },
      { label: "PAT", href: "/unit-usaha/pat" },
    ],
  },
  {
    title: "Hubungi",
    links: [
      { label: "Relasi investor", href: "/contact?topic=investor" },
      { label: "Karier", href: "/contact?topic=karier" },
      { label: "Kemitraan pemasok", href: "/contact?topic=pemasok" },
      { label: "Media", href: "/contact?topic=media" },
    ],
  },
]

export const legalLinks: Cta[] = [
  { label: "Kebijakan privasi", href: "#" },
  { label: "Syarat & ketentuan", href: "#" },
]

export const stats: { value: number; suffix?: string; label: string }[] = [
  { value: 4, label: "Unit usaha aktif" },
  { value: 7, label: "Cabang beroperasi" },
  { value: 50, suffix: " M", label: "Nilai aset dikelola" },
  { value: 5000, label: "Pelanggan dilayani" },
]

export const hero = {
  lines: ["Tata Kelola Disiplin,", "Pertumbuhan yang", "Terukur"],
  label: "Grup usaha",
  description:
    "Amani Group mengelola empat unit usaha di tujuh cabang di bawah satu standar tata kelola. Setiap unit dijalankan dengan disiplin keuangan, pengawasan internal, dan target pertumbuhan yang terukur.",
  image:
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1800&auto=format&fit=crop",
  primary: { label: "Lihat Unit Usaha", href: "/unit-usaha" } satisfies Cta,
  secondary: { label: "Tentang Amani Group", href: "/about" } satisfies Cta,
}

export const visi = {
  eyebrow: "Visi kami",
  statement:
    "Menjadi perusahaan induk yang menghadirkan manfaat nyata melalui layanan berstandar tinggi, serta berkontribusi secara berkelanjutan terhadap penguatan perekonomian masyarakat.",
  // The about page sets two phrases in a heavier weight.
  segments: [
    { text: "Menjadi perusahaan induk yang menghadirkan " },
    { text: "manfaat nyata", strong: true },
    { text: " melalui layanan berstandar tinggi, serta berkontribusi secara " },
    { text: "berkelanjutan", strong: true },
    { text: " terhadap penguatan perekonomian masyarakat." },
  ],
  intro:
    "Satu kalimat yang menjadi tolok ukur setiap keputusan: pembukaan cabang, pembentukan unit usaha baru, hingga pemilihan pemasok.",
  pillars: [
    {
      title: "Layanan berstandar tinggi",
      body: "Prosedur baku yang sama di setiap unit dan cabang, diukur dan diaudit secara berkala.",
    },
    {
      title: "Manfaat nyata",
      body: "Nilai yang dirasakan langsung oleh pelanggan, karyawan, dan mitra pemasok, bukan sekadar angka pada laporan.",
    },
    {
      title: "Kontribusi berkelanjutan",
      body: "Pertumbuhan yang dibiayai oleh kinerja dan mengutamakan pemasok lokal, sehingga manfaatnya bertahan lama.",
    },
  ],
}

export const misi = {
  title: "Misi Kami",
  intro:
    "Empat komitmen yang menjadi kerangka kerja seluruh unit usaha Amani Group. Setiap komitmen diterjemahkan menjadi prosedur baku, diukur secara berkala, dan menjadi dasar pengambilan keputusan manajemen.",
  items: [
    {
      title: "Permodalan bertahap",
      body: "Pendanaan disalurkan secara bertahap berdasarkan capaian kinerja. Setiap unit memperoleh modal sesuai kemampuannya menghasilkan pendapatan yang terverifikasi.",
      image:
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Satu standar tata kelola",
      body: "Standar pelaporan keuangan, audit internal, dan kepatuhan yang seragam diterapkan tanpa pengecualian di seluruh unit dan cabang.",
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Pengembangan talenta lintas unit",
      body: "Program rotasi manajemen yang terstruktur memastikan kompetensi yang terbentuk di satu unit menjadi aset seluruh grup.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Sinergi rantai pasok",
      body: "Kebutuhan pengadaan, logistik, dan bahan baku dipenuhi secara internal antarunit, sehingga nilai tambah tetap berada di dalam grup.",
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    },
  ],
}

export const unitUsahaIntro = {
  title: "Unit Usaha",
  intro:
    "Amani Group menaungi empat unit usaha yang beroperasi di tujuh cabang. Setiap unit menjalankan model bisnisnya masing-masing di bawah standar tata kelola, pengelolaan talenta, dan rantai pasok yang sama.",
}

export const testimonials = {
  title: "Testimoni Klien",
  intro:
    "Penilaian dari klien yang menggunakan lebih dari satu layanan Amani Group. Satu kontrak, satu narahubung, dan standar pelayanan yang sama di seluruh unit usaha.",
  items: [
    {
      quote:
        "Sejak 2024 seluruh linen hotel kami ditangani Amani Laundry dan karpet lobi dirawat Amani Karpet. Jadwal penyelesaian selalu ditepati dan laporan kualitas disampaikan setiap bulan tanpa perlu diminta.",
      name: "Rahmat Hidayat",
      role: "Manajer Operasional, Hotel Sekar Wangi",
      units: ["Amani Laundry", "Amani Karpet"],
    },
    {
      quote:
        "Kami menggunakan Amani Karpet untuk perawatan karpet masjid dan PAT untuk pengadaan perlengkapan rutin. Administrasi tertib, harga transparan, dan setiap pekerjaan didokumentasikan dengan berita acara.",
      name: "Ir. Budi Santoso",
      role: "Ketua Takmir, Masjid Al-Ikhlas",
      units: ["Amani Karpet", "PAT"],
    },
    {
      quote:
        "Warkop Amani menjadi mitra konsumsi rapat kami, sementara seragam karyawan dikelola Amani Laundry. Satu kontrak, satu narahubung, dan standar pelayanan yang konsisten di kedua unit.",
      name: "Dewi Anggraini",
      role: "Head of People, PT Solusi Digital Nusantara",
      units: ["Warkop Amani", "Amani Laundry"],
    },
  ],
}

export const csr = {
  title: "Tumbuh Bersama Masyarakat",
  body: "Program tanggung jawab sosial Amani Group dijalankan di setiap cabang: pelatihan kerja bagi warga sekitar, kemitraan dengan pemasok lokal, dan dukungan pendidikan bagi keluarga karyawan. Dampak setiap program diukur dan dilaporkan secara berkala.",
  cta: { label: "Lihat Program CSR", href: "/contact?topic=csr" } satisfies Cta,
}

export const artikelIntro = {
  title: "Artikel",
  intro:
    "Catatan manajemen mengenai pengelolaan unit usaha, pembentukan tim, dan pembelajaran dari setiap cabang yang dibuka.",
  cta: { label: "Semua Artikel", href: "/artikel" } satisfies Cta,
  listTitle: "Seluruh artikel",
  listIntro:
    "Catatan keputusan, evaluasi program, dan pembelajaran manajemen dari pengelolaan empat unit usaha di tujuh cabang.",
  author: "Manajemen Amani Group",
}

export const investorCta = {
  eyebrow: "Investor",
  heading:
    "Amani Group membuka kesempatan bagi investor yang mengutamakan pertumbuhan bertahap, tata kelola yang jelas, dan pelaporan yang transparan.",
  cta: { label: "Informasi Investor", href: "/contact?topic=investor" } satisfies Cta,
  note: "Tanggapan diberikan dalam 2 hari kerja.",
}

export const kemitraanCta = {
  eyebrow: "Kemitraan",
  heading:
    "Membutuhkan lebih dari satu layanan? Amani Group menyediakan satu kontrak dan satu narahubung untuk seluruh unit usaha.",
  cta: { label: "Hubungi Kami", href: "/contact?topic=kemitraan" } satisfies Cta,
  note: "Tanggapan diberikan dalam 2 hari kerja.",
}

export const timeline = {
  title: "Perjalanan Perusahaan",
  intro:
    "Sepuluh tahun pertumbuhan yang dibangun secara bertahap. Setiap unit dan cabang baru dibuka setelah unit sebelumnya memenuhi indikator kinerja yang ditetapkan.",
  items: [
    {
      year: "2016",
      title: "Amani Laundry didirikan",
      body: "Cabang pertama dibuka di Jakarta Selatan dengan fokus pada segmen rumah tangga dan hunian kos. Prosedur operasional baku disusun sejak hari pertama.",
      image:
        "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=800&q=80",
      alt: "Cabang pertama Amani Laundry",
    },
    {
      year: "2018",
      title: "Ekspansi ke cabang kedua dan ketiga",
      body: "Dua cabang tambahan dibuka setelah cabang pertama mencatat arus kas positif selama dua belas bulan berturut-turut. Kontrak pertama dengan klien perhotelan ditandatangani.",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      alt: "Cabang kedua dan ketiga Amani Laundry",
    },
    {
      year: "2019",
      title: "Amani Karpet mulai beroperasi",
      body: "Permintaan pencucian karpet dari klien laundry menjadi dasar pembentukan unit kedua, dengan fasilitas dan mesin pengering industri tersendiri.",
      image:
        "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=800&q=80",
      alt: "Fasilitas pencucian karpet Amani Karpet",
    },
    {
      year: "2021",
      title: "Warkop Amani dibuka",
      body: "Unit ketiga dikembangkan sebagai kedai kopi dengan standar kebersihan dan konsistensi layanan yang sama dengan unit jasa.",
      image:
        "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=800&q=80",
      alt: "Kedai Warkop Amani",
    },
    {
      year: "2022",
      title: "Pembentukan Amani Group",
      body: "Ketiga unit dikonsolidasikan di bawah satu perusahaan induk. Satu standar tata kelola, bagan akun, dan mekanisme audit internal diberlakukan untuk seluruh unit.",
      image:
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
      alt: "Kantor pusat Amani Group",
    },
    {
      year: "2023",
      title: "PAT dibentuk",
      body: "Fungsi pengadaan dan logistik seluruh unit dipusatkan pada unit keempat, dengan kebijakan prioritas pemasok lokal terverifikasi.",
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      alt: "Gudang dan logistik PAT",
    },
    {
      year: "2025",
      title: "Program rotasi manajemen",
      body: "Rotasi manajer antarunit ditetapkan sebagai program tetap dengan siklus dua belas bulan, disertai dokumen serah terima dan laporan pembelajaran.",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      alt: "Program rotasi manajemen",
    },
    {
      year: "2026",
      title: "Cabang ketujuh beroperasi",
      body: "Cabang ketiga Amani Laundry dibuka di Depok, sepenuhnya dibiayai dari laba ditahan dan alokasi modal bertahap tanpa pinjaman perbankan.",
      image:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
      alt: "Cabang ketujuh di Depok",
    },
  ],
}

export const team = {
  title: "Tim Manajemen",
  intro:
    "Direksi Amani Group bertanggung jawab atas penetapan standar, pengawasan kinerja unit, dan pengambilan keputusan alokasi modal.",
  members: [
    {
      name: "Ahmad Fauzi",
      role: "Direktur Utama",
      bio: "Pendiri Amani Laundry. Bertanggung jawab atas arah strategis grup dan keputusan alokasi modal.",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Siti Nurhaliza",
      role: "Direktur Keuangan",
      bio: "Menetapkan standar pelaporan keuangan grup dan memimpin fungsi audit internal di seluruh unit.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Rizky Pratama",
      role: "Direktur Operasional",
      bio: "Mengawasi prosedur operasional baku seluruh cabang dan memimpin program rotasi manajemen.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Maya Kartika",
      role: "Direktur Pengembangan Usaha",
      bio: "Bertanggung jawab atas kemitraan korporasi, relasi investor, dan evaluasi peluang unit usaha baru.",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    },
  ],
}

export const pageHeaders = {
  about: {
    eyebrow: "Tentang kami",
    title: "Perusahaan induk dengan disiplin tata kelola sebagai fondasi.",
    lead: "Amani Group didirikan untuk menaungi unit-unit usaha yang tumbuh dari satu standar yang sama: keuangan yang tertib, pengawasan internal yang konsisten, dan pertumbuhan yang dibiayai oleh kinerja, bukan oleh utang.",
  },
  unitUsaha: {
    eyebrow: "Amani Group",
    title: "Unit Usaha",
    lead: unitUsahaIntro.intro,
  },
}

export const contactTopics: { value: string; label: string }[] = [
  { value: "layanan", label: "Layanan unit usaha" },
  { value: "kemitraan", label: "Kemitraan korporasi" },
  { value: "investor", label: "Relasi investor" },
  { value: "pemasok", label: "Kemitraan pemasok" },
  { value: "karier", label: "Karier" },
  { value: "csr", label: "Program CSR" },
  { value: "media", label: "Media" },
  { value: "lainnya", label: "Lainnya" },
]

export const contactPage = {
  title: "Formulir Kontak",
  intro:
    "Setelah menekan tombol kirim, aplikasi email Anda akan terbuka dengan pesan yang telah terisi. Pastikan pesan terkirim dari aplikasi email tersebut.",
  privacy: "Data yang Anda kirimkan hanya digunakan untuk menanggapi permintaan ini.",
  error: "Lengkapi seluruh kolom yang wajib diisi dengan alamat email yang valid.",
  channelsTitle: "Saluran langsung",
  channelsIntro:
    "Untuk tanggapan yang lebih cepat, hubungi kami melalui saluran berikut pada jam kerja.",
}

export const seo = {
  home: {
    title: "Amani Group — Tata Kelola Disiplin, Pertumbuhan Terukur",
    description: brand.description,
  },
  about: {
    title: "Tentang Kami — Amani Group",
    description:
      "Amani Group adalah perusahaan induk dengan disiplin tata kelola sebagai fondasi: visi, misi, perjalanan perusahaan, dan tim manajemen.",
  },
  unitUsaha: {
    title: "Unit Usaha — Amani Group",
    description:
      "Empat unit usaha Amani Group: Amani Laundry, Amani Karpet, Warkop Amani, dan PAT.",
  },
  artikel: {
    title: "Artikel — Amani Group",
    description:
      "Catatan manajemen Amani Group mengenai tata kelola, keuangan, talenta, dan rantai pasok.",
  },
  contact: {
    title: "Hubungi Kami — Amani Group",
    description: "Hubungi Amani Group melalui formulir email, WhatsApp, atau Instagram.",
  },
}
