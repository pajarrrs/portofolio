// Full seed data extracted directly from index.html
const projects = [
  {
    title: 'JasaKita — On-Demand Service Marketplace & Bidding',
    category: 'fullstack enterprise',
    chip: 'Marketplace & Mobile',
    description: 'Platform marketplace on-demand untuk jasa spesifik dengan sistem request dan lelang penawaran (bidding) real-time antar mitra. Terintegrasi dengan aplikasi mobile Android untuk pelanggan dan mitra kerja.',
    tags: 'Laravel, Livewire Flux, Pusher JS, Capacitor',
    image: 'images/jasakita.webp',
    order_index: 0
  },
  {
    title: 'MuslimApps — Islamic Companion & Quranic Mobile App',
    category: 'fullstack',
    chip: 'Mobile & API Integration',
    description: "Aplikasi mobile ibadah Muslim modern dengan fitur jadwal sholat akurat standar Kemenag, kompas arah kiblat, tasbih digital, serta Al-Qur'an 114 surah lengkap dengan transliterasi, terjemahan, dan audio murottal via integrasi RESTful API.",
    tags: 'React Native, Capacitor, RESTful API, Mobile App',
    image: 'images/muslimapps.webp',
    order_index: 1
  },
  {
    title: 'JukutTaman (SiJukut) — Lawn Supply & Dynamic Cost Estimator',
    category: 'fullstack enterprise',
    chip: 'E-Commerce & Tool',
    description: 'Platform e-commerce dan kalkulator estimasi biaya rumput taman interaktif dengan slider luas area dinamis, pemilihan varietas rumput, kalkulasi jasa tanam, dan direct WhatsApp order integration.',
    tags: 'Laravel / Next.js, TailwindCSS, Dynamic Calculator, WhatsApp API',
    image: 'images/sijukut.webp',
    order_index: 2
  },
  {
    title: 'Siarvi - Surveilans Penyakit DBD Kemenkes',
    category: 'healthtech',
    chip: 'Gov / Healthtech',
    description: 'Platform surveilans epidemiologi Kemenkes RI untuk pemantauan dan pengendalian penyebaran Arbovirosis skala nasional.',
    tags: 'CakePHP, MySQL, GIS Region',
    image: 'images/siarvi.webp',
    order_index: 3
  },
  {
    title: 'SiPTM - Monitoring Faktor Risiko Diabetes',
    category: 'healthtech',
    chip: 'Gov / Healthtech',
    description: 'Platform monitoring skrining faktor risiko penyakit tidak menular (diabetes & hipertensi) terintegrasi puskesmas.',
    tags: 'CakePHP, MySQL, Analytics',
    image: 'images/siptm.webp',
    order_index: 4
  },
  {
    title: 'FieldTrack - Team Task & Operations Hub',
    category: 'fullstack',
    chip: 'SaaS / Fullstack',
    description: 'Aplikasi manajemen tugas kolaboratif tim lapangan dengan kanban board real-time, time tracking, dan granular permissions.',
    tags: 'Next.js, AdonisJS, TypeScript',
    image: 'images/fieldtrack.webp',
    order_index: 5
  },
  {
    title: 'Farmalkes - Elektronik Suplemen Farmakope',
    category: 'healthtech',
    chip: 'Gov / Standards',
    description: 'Portal dokumen standarisasi mutu sediaan farmasi dan regulasi bahan baku obat Kementerian Kesehatan RI.',
    tags: 'CakePHP, PostgreSQL, Archive',
    image: 'images/farmakope.webp',
    order_index: 6
  },
  {
    title: 'E-FILCA - Agregasi POPM Kecacingan',
    category: 'healthtech',
    chip: 'Gov / Health',
    description: 'Sistem agregasi pemberian obat pencegahan massal (POPM) kecacingan nasional untuk pemantauan intervensi anak sekolah.',
    tags: 'Laravel, MySQL, Validation',
    image: 'images/efilca.webp',
    order_index: 7
  },
  {
    title: 'Cafe Cashier & Stock Inventory POS',
    category: 'enterprise',
    chip: 'Retail POS',
    description: 'Aplikasi kasir coffee shop dengan pemotongan stok bahan baku otomatis, display kitchen order, dan pelaporan omzet.',
    tags: 'Laravel, MySQL, Thermal Print',
    image: 'images/cafe.webp',
    order_index: 8
  },
  {
    title: 'Inalog - Logistik & Pergudangan',
    category: 'enterprise',
    chip: 'Logistics',
    description: 'Sistem pergudangan enterprise untuk pelacakan pergerakan barang, servis peralatan, dan otomasi alur requisition.',
    tags: 'CakePHP, MySQL, Asset Tracking',
    image: 'images/inalog.webp',
    order_index: 9
  },
  {
    title: 'Sistem Pengaduan Aspirasi Siswa & Warga',
    category: 'fullstack',
    chip: 'Public Service',
    description: 'Portal aspirasi transparan dengan tracking tiket status real-time, enkripsi lampiran dokumen, dan panel moderasi.',
    tags: 'Laravel, MySQL, Ticketing',
    image: 'images/pemas-2.webp',
    order_index: 10
  },
  {
    title: 'Barbershop Cashier & Booking Management',
    category: 'enterprise',
    chip: 'Retail POS',
    description: 'Aplikasi kasir multi-layanan dan komisi kapster dengan antrean treatment rambut dan rekap transaksi harian.',
    tags: 'PHP Native, MySQL, Commissions',
    image: 'images/barber.webp',
    order_index: 11
  },
  {
    title: 'Digital Library Circulation System',
    category: 'enterprise',
    chip: 'Info System',
    description: 'Sistem sirkulasi peminjaman buku digital, kartu barcode anggota, dan perhitungan denda keterlambatan otomatis.',
    tags: 'Laravel, MySQL, Barcode Scan',
    image: 'images/perpus.webp',
    order_index: 12
  }
];

const hero = {
  roleTag: '// Software Engineer',
  locationTag: 'Bogor, ID — UTC+7',
  headingLine1: 'BUILD',
  headingLine2: 'NOW',
  intro: "Software Engineer specializing in enterprise web applications, high-performance APIs, and reliable production systems that scale.",
  ctaText: 'Explore Works',
  ctaLink: '#portfolio',
  metrics: [
    { val: '3+', lbl: 'Years Experience' },
    { val: '13+', lbl: 'Delivered Projects' },
    { val: '8+', lbl: 'Enterprise Modules' }
  ],
  tickerItems: 'LARAVEL, PHP, VUE.JS, REACT.JS, NEXT.JS, NODE.JS, MYSQL, POSTGRESQL, REDIS, NGINX, REST API, SENTRY'
};

const about = {
  specSheet: [
    { k: 'Name', v: 'Pajar' },
    { k: 'Role', v: 'Software Engineer' },
    { k: 'Based In', v: 'Bogor, West Java, ID' },
    { k: 'Experience', v: '3+ Years' },
    { k: 'Focus', v: 'Enterprise Web Apps · Query Performance · Live-System Troubleshooting' },
    { k: 'Status', v: 'Open to WFO — Jabodetabek' }
  ],
  cvLink: 'assets/CV_Pajar_Software_Engineer.pdf',
  aboutLead: 'Software Engineer with 3+ years of experience building and maintaining enterprise web applications for retail, ERP, logistics, HRIS, and government systems.',
  aboutSub: 'Fullstack across Laravel, Node.js, React.js, Next.js, and Vue.js — with a strong focus on query performance, clean and maintainable code, and live-system troubleshooting. I turn slow or error-prone workflows into reliable features, working closely with business users and cross-functional teams.'
};

const services = [
  {
    title: 'Backend & API Architecture',
    description: 'Designing scalable RESTful APIs, high-throughput microservices, authentication systems, and optimized database schemas.',
    tags: 'Laravel, PHP, REST API, MySQL',
    image: 'images/siarvi.webp',
    order_index: 0
  },
  {
    title: 'Healthcare & Gov Systems',
    description: 'Architecting nationwide epidemiological surveillance platforms with strict data accuracy, multi-tier regional access, and reporting.',
    tags: 'Health Informatics, MySQL, REST API',
    image: 'images/siptm.webp',
    order_index: 1
  },
  {
    title: 'Enterprise POS & SaaS',
    description: 'Building real-time point-of-sale inventory engines, automated financial reports, thermal print integration, and collaboration tools.',
    tags: 'Next.js, Node.js, Redis',
    image: 'images/fieldtrack.webp',
    order_index: 2
  }
];

const experiences = [
  {
    company: 'Alturian',
    company_period: 'Jun 2024 – Present',
    role_title: 'Software Engineer Specialist',
    role_period: 'Apr 2026 – Present',
    stack: 'Stack: Laravel, PHP, Vue.js, Angular, WebSocket, Sentry, Git',
    bullets: JSON.stringify([
      'Own complex issues and enhancements across E-Commerce, ERP, Merchandising, and HRIS systems, with primary ownership of E-Commerce.',
      'Resolved and enhanced 29 E-Commerce issues within 5 working days, covering complex ordering flows and improving production readiness ahead of schedule.',
      'Contribute to major retail projects serving operations in Japan, Myanmar, and Indonesia.',
      'Automate manual operational processes to improve efficiency across business workflows.',
      'Analyze complex business and technical cases, recommend implementation approaches, and mentor junior developers on code quality and safer solutions.',
      'Provide debugging and troubleshooting support for live systems in collaboration with business users.'
    ]),
    order_index: 0
  },
  {
    company: 'Alturian',
    company_period: 'Jun 2024 – Present',
    role_title: 'Software Engineer',
    role_period: 'Apr 2025 – Mar 2026',
    stack: 'Stack: Laravel, PHP, Vue.js, Angular, Redis, PostgreSQL, Frontend UI integration',
    bullets: JSON.stringify([
      'Primary developer for 8 major modules and support for 2 more across Invoicing, Supplier Deposit, Supplier Loan, and ERP systems.',
      'Optimized a report query over approximately 24 million invoice-item records, reducing execution time from about 192 seconds to 8-12 seconds.',
      'Refactored existing modules for readability and maintainability, so other developers can continue and extend them faster.',
      'Introduced safer coding practices for model relationships and data access, preventing runtime errors when related data is missing.',
      'Moved heavy export operations to asynchronous Laravel Jobs, keeping the application responsive during long-running processes.'
    ]),
    order_index: 1
  },
  {
    company: 'Alturian',
    company_period: 'Jun 2024 – Present',
    role_title: 'Junior Software Engineer',
    role_period: 'Jun 2024 – Mar 2025',
    stack: 'Stack: Laravel, Angular, Vue.js, WebSocket, Sentry, SQL',
    bullets: JSON.stringify([
      'Maintained and enhanced an ordering system used by approximately 400-500 users with Laravel, Angular, and Vue.js.',
      'Replaced long polling with WebSocket-based communication in Live Chat and Call features for more efficient real-time interaction.',
      'Investigated and resolved HTTP 500 errors, application errors, and business-logic issues across ordering workflows.',
      'Improved reliability with safer try-catch error handling and Sentry for error tracking and monitoring.',
      'Delivered bug fixes and feature requests on a regular basis, supporting continuous improvement of the ordering platform.',
      'Employee of the Month: August 2024 and January 2025.'
    ]),
    order_index: 2
  },
  {
    company: 'PT Zamasco Mitra Solusindo',
    company_period: 'Jun 2023 – May 2024',
    role_title: 'Fullstack Developer',
    role_period: 'Jun 2023 – May 2024',
    stack: 'Stack: Laravel, PHP, Redis, REST API, SQL',
    bullets: JSON.stringify([
      'Primary developer of a Warehouse Management System (WMS) supporting nationwide logistics operations for BNPB, covering courier management, item scanning, shipment tracking, inventory, and stock replenishment.',
      'Optimized database queries and data upload processes for nationwide inventory data and high-volume concurrent uploads from Ministry users.',
      'Integrated REST/JSON APIs with BNPB monitoring systems to provide equipment monitoring dashboards.',
      'Built a disease reporting information system for the Ministry of Health (dengue fever and helminthiasis) with dashboards, reporting workflows, and offline data entry, processing about 15,000 reports per month.',
      'Strengthened application security after identifying SQL injection risks, by improving validation and data handling across the codebase.',
      'Deployed applications to servers and maintained infrastructure using Redis and server-side configuration.',
      'Co-developed a real-time vote-recording application for a political organization using Laravel, with secure storage and real-time processing of voting data.'
    ]),
    order_index: 3
  },
  {
    company: 'PT Immobi Solusi Prima',
    company_period: 'Jul 2022 – Jan 2023',
    role_title: 'Backend Developer (Internship)',
    role_period: 'Jul 2022 – Jan 2023',
    stack: 'Stack: Node.js, AdonisJS, Express.js, Next.js, PostgreSQL, Nginx, Git, CI/CD',
    bullets: JSON.stringify([
      'Built and maintained 10-15 REST API endpoints (JSON) for an internal Task Management System used by 10-50 users: authentication, Kanban CRUD, dashboard, and master data.',
      'Optimized retrieval of the latest Kanban state, cutting response time from about 2 seconds to milliseconds in the tested implementation.',
      'Contributed to the backend of an ERP invoicing module.',
      'Supported staging and production deployments and resolved deployment issues within the same working day.'
    ]),
    order_index: 4
  }
];

const experience_meta = {
  education: [
    { name: 'University of Siber Asia', detail: "Bachelor's Degree (S1) in Information System — Jan 2025 – Present (Currently Enrolled)" },
    { name: 'Wikrama Vocational High School', detail: 'Software Engineering — Jul 2020 – May 2023' }
  ],
  certifications: [
    { name: 'BNSP', detail: 'Software Engineering' },
    { name: 'Certiport', detail: 'IT Specialist' },
    { name: 'Employee of the Month', detail: 'Alturian — August 2024 & January 2025' },
    { name: 'Internship Certificate', detail: 'PT Immobi Solusi Prima' }
  ],
  languages: 'Languages: Indonesian — C1 Advanced | English — B1 Intermediate'
};

const contact = {
  heading: "LET'S TALK.",
  desc: 'Have a project, full-time engineering opportunity, or contract role? Let’s connect and create something impactful together.',
  email: 'pajarr2302@gmail.com',
  github: 'https://github.com/pajarrrs',
  linkedin: 'https://www.linkedin.com/in/pajar-09a1a023b/',
  cvLink: 'assets/CV_Pajar_Software_Engineer.pdf',
  location: 'Bogor, ID',
  locationUrl: 'https://maps.app.goo.gl/Sb3VEU3VkPKwnbyFA'
};

module.exports = {
  projects,
  hero,
  about,
  services,
  experiences,
  experience_meta,
  contact
};
