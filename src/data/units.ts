import type { SocialIconName } from "@/data/site"
import type { ImageMetadata } from "astro"

import amaniKarpet from "@/assets/units/amani-karpet.png"
import amaniLaundry from "@/assets/units/amani-laundry.png"
import pat from "@/assets/units/pat.png"
import warkopAmani from "@/assets/units/warkop-amani.png"

// Unit usaha data — single source for the listing and the detail pages.
// Logos are the full-colour lock-ups from src/assets/units, trimmed to their
// visible bounds so every mark fills its tile; the `-black` siblings there are
// unused but kept as the pair every new unit is expected to ship.

export interface Unit {
  slug: string
  name: string
  sector: string
  logo: ImageMetadata
  logoClass: string
  summary: string
  description: string[]
  facts: [label: string, value: string][]
  // Leave out when the unit has no site yet: the "Kunjungi situs" button is hidden.
  website?: string
  socials: { label: string; href: string; icon: SocialIconName }[]
}

export const units: Unit[] = [
  {
    slug: "amani-laundry",
    name: "Amani Laundry",
    sector: "Jasa pencucian dan perawatan tekstil",
    logo: amaniLaundry,
    logoClass: "w-30 h-auto",
    summary:
      "Layanan pencucian dan penyetrikaan untuk rumah tangga, hunian kos, dan perhotelan.",
    description: [
      "Amani Laundry adalah unit usaha pertama PT Badiuzzaman Cipta Amani dan menjadi acuan standar operasional bagi unit-unit berikutnya. Seluruh proses, mulai dari penerimaan, penyortiran, pencucian, hingga penyerahan, dijalankan berdasarkan prosedur baku yang terdokumentasi dan diaudit secara berkala.",
      "Layanan tersedia untuk segmen rumah tangga, hunian kos, perhotelan, dan fasilitas kesehatan. Untuk klien korporasi, Amani Laundry menyediakan perjanjian tingkat layanan (SLA) dengan jadwal penjemputan tetap, laporan kualitas bulanan, dan satu narahubung khusus.",
    ],
    facts: [
      ["Berdiri", "2022"],
      ["Cabang", "4 cabang"],
      ["Segmen", "Rumah tangga, kos, hotel, klinik"],
    ],
    website: "https://amanilaundry.net",
    socials: [
      {
        label: "Instagram",
        href: "https://instagram.com/amanilaundry",
        icon: "instagram",
      },
      { label: "WhatsApp", href: "https://wa.me/6285353896139", icon: "whatsapp" },
    ],
  },
  {
    slug: "amani-karpet",
    name: "Amani Karpet",
    sector: "Jasa pencucian dan perawatan karpet",
    logo: amaniKarpet,
    logoClass: "w-40 h-auto",
    summary:
      "Layanan pencucian dan perawatan karpet untuk masjid, perkantoran, dan hunian.",
    description: [
      "Amani Karpet menangani pencucian dan perawatan karpet berukuran besar yang tidak dapat ditangani oleh fasilitas laundry umum. Fasilitas pencucian dilengkapi mesin pengering industri sehingga waktu penyelesaian dapat dipastikan sejak awal pemesanan.",
      "Klien utama unit ini adalah pengurus masjid, pengelola gedung perkantoran, dan hunian. Setiap pekerjaan didokumentasikan dengan foto sebelum dan sesudah, serta berita acara serah terima yang ditandatangani kedua pihak.",
    ],
    facts: [
      ["Berdiri", "2026"],
      ["Cabang", "1 cabang"],
      ["Segmen", "Masjid, perkantoran, hunian"],
    ],
    website: "https://karpet.amanigroup.co.id",
    socials: [
      {
        label: "Instagram",
        href: "https://instagram.com/amanilaundrykarpet",
        icon: "instagram",
      },
      { label: "WhatsApp", href: "https://wa.me/6285177837707", icon: "whatsapp" },
    ],
  },
  {
    slug: "warkop-amani",
    name: "Warkop Amani",
    sector: "Kedai kopi, makanan, dan tempat bermain",
    logo: warkopAmani,
    logoClass: "w-26 h-auto",
    summary:
      "Kedai kopi dan makanan dengan harga terjangkau, sekaligus tempat seru untuk bermain dan berkumpul.",
    description: [
      "Warkop Amani adalah kedai kopi dan makanan yang menyajikan menu harian dengan harga terjangkau. Setiap sajian, dari kopi hingga makanan, disiapkan dengan standar kebersihan dan konsistensi rasa yang sama setiap hari.",
      "Lebih dari sekadar tempat makan dan minum, Warkop Amani adalah tempat yang seru untuk bermain dan berkumpul, cocok untuk bersantai bersama teman, keluarga, maupun komunitas.",
    ],
    facts: [
      ["Berdiri", "2025"],
      ["Cabang", "1 cabang"],
      ["Segmen", "Umum, keluarga, komunitas"],
    ],
    socials: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/warkopamani",
        icon: "instagram",
      },
      { label: "WhatsApp", href: "https://wa.me/6285177837706", icon: "whatsapp" },
    ],
  },
  {
    slug: "pat",
    name: "Putra Amani Teknik",
    sector: "Jasa sumur bor",
    logo: pat,
    logoClass: "w-60 h-auto",
    summary: "Jasa pembuatan sumur bor terstandar di Sukabumi.",
    description: [
      "Putra Amani Teknik (PAT) adalah unit usaha PT Badiuzzaman Cipta Amani yang bergerak di bidang jasa sumur bor. PAT menangani pembuatan sumur bor untuk kebutuhan air bersih rumah tangga, masjid, dan tempat usaha di Sukabumi dan sekitarnya.",
      "Setiap pekerjaan diawali survei lokasi dan penawaran tertulis, lalu didokumentasikan hingga serah terima, sehingga lingkup pekerjaan, biaya, dan jadwal sudah jelas sejak awal.",
    ],
    facts: [
      ["Berdiri", "2025"],
      ["Cabang", "1 cabang"],
      ["Segmen", "Rumah tangga, masjid, tempat usaha"],
    ],
    website: "https://putraamaniteknik.com",
    socials: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/sumurborsukabumi",
        icon: "instagram",
      },
      { label: "WhatsApp", href: "https://wa.me/6282124616909", icon: "whatsapp" },
    ],
  },
]

export const getUnit = (slug: string) => units.find((u) => u.slug === slug)
