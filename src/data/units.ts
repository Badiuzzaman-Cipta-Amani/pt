import type { SocialIconName } from "@/data/site"
import type { ImageMetadata } from "astro"

import amaniKarpet from "@/assets/units/amani-karpet.png"
import amaniLaundry from "@/assets/units/amani-laundry.png"
import pat from "@/assets/units/pat.png"
import warkopAmani from "@/assets/units/warkop-amani.png"

// Unit usaha data — single source for the listing and the detail pages.
// Logos are the full-colour lock-ups from src/assets/units; the `-black` siblings
// there are unused but kept as the pair every new unit is expected to ship.

export interface Unit {
  slug: string
  name: string
  sector: string
  logo: ImageMetadata
  summary: string
  description: string[]
  facts: [label: string, value: string][]
  website: string
  socials: { label: string; href: string; icon: SocialIconName }[]
}

export const units: Unit[] = [
  {
    slug: "amani-laundry",
    name: "Amani Laundry",
    sector: "Jasa pencucian dan perawatan tekstil",
    logo: amaniLaundry,
    summary:
      "Layanan pencucian, penyetrikaan, dan perawatan tekstil untuk segmen rumah tangga, hunian kos, perhotelan, dan fasilitas kesehatan dengan jaminan waktu penyelesaian.",
    description: [
      "Amani Laundry adalah unit usaha pertama Amani Group dan menjadi acuan standar operasional bagi unit-unit berikutnya. Seluruh proses, mulai dari penerimaan, penyortiran, pencucian, hingga penyerahan, dijalankan berdasarkan prosedur baku yang terdokumentasi dan diaudit secara berkala.",
      "Layanan tersedia untuk segmen rumah tangga, hunian kos, perhotelan, dan fasilitas kesehatan. Untuk klien korporasi, Amani Laundry menyediakan perjanjian tingkat layanan (SLA) dengan jadwal penjemputan tetap, laporan kualitas bulanan, dan satu narahubung khusus.",
    ],
    facts: [
      ["Berdiri", "2016"],
      ["Cabang", "3 cabang"],
      ["Segmen", "Rumah tangga, kos, hotel, klinik"],
    ],
    website: "https://laundry.amanigroup.co.id",
    socials: [
      {
        label: "Instagram",
        href: "https://instagram.com/amanilaundry",
        icon: "instagram",
      },
      { label: "WhatsApp", href: "https://wa.me/62215550123", icon: "whatsapp" },
    ],
  },
  {
    slug: "amani-karpet",
    name: "Amani Karpet",
    sector: "Jasa pencucian dan perawatan karpet",
    logo: amaniKarpet,
    summary:
      "Layanan pencucian dan perawatan karpet untuk masjid, perkantoran, dan hunian, mencakup penjemputan serta pengantaran kembali ke lokasi.",
    description: [
      "Amani Karpet menangani pencucian dan perawatan karpet berukuran besar yang tidak dapat ditangani oleh fasilitas laundry umum. Fasilitas pencucian dilengkapi mesin pengering industri sehingga waktu penyelesaian dapat dipastikan sejak awal pemesanan.",
      "Klien utama unit ini adalah pengurus masjid, pengelola gedung perkantoran, dan hunian. Setiap pekerjaan didokumentasikan dengan foto sebelum dan sesudah, serta berita acara serah terima yang ditandatangani kedua pihak.",
    ],
    facts: [
      ["Berdiri", "2019"],
      ["Cabang", "2 cabang"],
      ["Segmen", "Masjid, perkantoran, hunian"],
    ],
    website: "https://karpet.amanigroup.co.id",
    socials: [
      {
        label: "Instagram",
        href: "https://instagram.com/amanikarpet",
        icon: "instagram",
      },
      { label: "WhatsApp", href: "https://wa.me/62215550123", icon: "whatsapp" },
    ],
  },
  {
    slug: "warkop-amani",
    name: "Warkop Amani",
    sector: "Kedai kopi dan layanan konsumsi",
    logo: warkopAmani,
    summary:
      "Kedai kopi dengan menu harian berharga terjangkau, ruang yang layak untuk bekerja dan bertemu, serta pasokan bahan baku dari mitra lokal terverifikasi.",
    description: [
      "Warkop Amani dikembangkan sebagai kedai kopi dengan standar kebersihan, konsistensi rasa, dan pelayanan yang terukur. Seluruh bahan baku dipasok melalui PAT dari mitra lokal yang telah melalui proses verifikasi mutu.",
      "Selain layanan kedai, Warkop Amani menyediakan layanan konsumsi rapat dan acara untuk klien korporasi dengan kontrak berkala, sehingga kebutuhan konsumsi dapat direncanakan dan dianggarkan secara pasti.",
    ],
    facts: [
      ["Berdiri", "2021"],
      ["Cabang", "1 cabang"],
      ["Segmen", "Umum, korporasi"],
    ],
    website: "https://warkop.amanigroup.co.id",
    socials: [
      {
        label: "Instagram",
        href: "https://instagram.com/warkopamani",
        icon: "instagram",
      },
      { label: "WhatsApp", href: "https://wa.me/62215550123", icon: "whatsapp" },
    ],
  },
  {
    slug: "pat",
    name: "PAT",
    sector: "Pengadaan, logistik, dan pasokan lintas unit",
    logo: pat,
    summary:
      "Unit pendukung yang mengelola pengadaan, logistik, dan pasokan lintas unit agar kebutuhan operasional grup terpenuhi secara internal dan terkendali.",
    description: [
      "PAT dibentuk untuk memusatkan fungsi pengadaan dan logistik seluruh unit usaha Amani Group. Dengan konsolidasi pembelian, grup memperoleh posisi tawar yang lebih baik terhadap pemasok dan pengendalian mutu bahan yang lebih ketat.",
      "PAT juga melayani klien eksternal untuk pengadaan perlengkapan rutin dan jasa logistik. Seluruh transaksi didukung dokumen penawaran, kontrak, dan laporan penyerahan yang lengkap.",
    ],
    facts: [
      ["Berdiri", "2023"],
      ["Cabang", "1 cabang"],
      ["Segmen", "Internal grup, korporasi, institusi"],
    ],
    website: "https://pat.amanigroup.co.id",
    socials: [
      {
        label: "LinkedIn",
        href: "https://linkedin.com/company/amanigroup",
        icon: "linkedin",
      },
      { label: "WhatsApp", href: "https://wa.me/62215550123", icon: "whatsapp" },
    ],
  },
]

export const getUnit = (slug: string) => units.find((u) => u.slug === slug)
