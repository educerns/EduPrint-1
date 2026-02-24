// 🎥 Define Video type
export interface Video {
  id: number;
  _id?: string;
  title: string;
  description: string;
  thumbnail: string; // Not used but kept for consistency
  videoUrl: string; // Single video file used for both thumbnail and playback
  price: number;
  type: string;
}


// 🎥 Base Video List
// Note: Same video file used for both thumbnail and videoUrl
// The browser will automatically show the first frame as thumbnail in gallery view
export const staticVideos: readonly Video[] = [
  {
    id: 1,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246294/WhatsApp_Video_2025-11-04_at_12.31.09_1_g4fhqe.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246294/WhatsApp_Video_2025-11-04_at_12.31.09_1_g4fhqe.mp4", // Same file - first frame shows as thumbnail
    title: "Accelerate Your Success with Us!",
    description: "Practice GST filing and compliance in an environment mirroring real GST portal flow.",
    price: 0,
    type: "Demo",
  },
  {
    id: 2,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246295/WhatsApp_Video_2025-11-04_at_12.31.07_1_ntqp2w.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246295/WhatsApp_Video_2025-11-04_at_12.31.07_1_ntqp2w.mp4",
    title: "GST Simulator Portal",
    description: "Experience an exact replica of the GST portal—same dashboards, same procedures, same workflows, without real-world consequences.",
    price: 0,
    type: "Demo",
  },
  {
    id: 3,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246296/WhatsApp_Video_2025-11-04_at_12.31.07_ysqdpm.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246296/WhatsApp_Video_2025-11-04_at_12.31.07_ysqdpm.mp4",
    title: "Learn E-WayBill and E-Invoice Today!",
    description: "Experience Our GST simulation platform, helping you learn E-waybill, E-invoice generation, and compliance procedures through hands-on practice with realistic scenarios.",
    price: 0,
    type: "Demo",
  },
  {
    id: 4,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246296/WhatsApp_Video_2025-11-04_at_12.31.08_winvuk.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246296/WhatsApp_Video_2025-11-04_at_12.31.08_winvuk.mp4",
    title: "Master GST Compliance",
    description: "Master GST Compliance Through Interactive Simulations.",
    price: 0,
    type: "Promotion",
  },
  {
    id: 5,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246297/WhatsApp_Video_2025-11-04_at_12.31.09_ufktmh.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246297/WhatsApp_Video_2025-11-04_at_12.31.09_ufktmh.mp4",
    title: "Ready to Master GST Filing?",
    description: "Practice on an exact copy of the GST Simulation portal - same return filing procedure, same e-way bill generation, same dashboard, same everything.",
    price: 0,
    type: "Promotion",
  },
  {
    id: 6,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246302/WhatsApp_Video_2025-11-04_at_12.31.08_1_gfvf1l.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246302/WhatsApp_Video_2025-11-04_at_12.31.08_1_gfvf1l.mp4",
    title: "EduTax - India's Number 1 GST Simulator",
    description: "Learn without the fear of making costly mistakes. Enhance employability with practical skills",
    price: 0,
    type: "Promotion",
  },
  {
    id: 7,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246303/WhatsApp_Video_2025-11-04_at_12.31.09_2_drlaqq.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246303/WhatsApp_Video_2025-11-04_at_12.31.09_2_drlaqq.mp4",
    title: "Industry-recognized learning platform",
    description: "Experience an exact replica of the GST portal—same dashboards, same procedures, same workflows, without real-world consequences.",
    price: 0,
    type: "Promotion",
  },
  {
    id: 8,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246331/WhatsApp_Video_2025-11-04_at_12.31.08_2_gz4h3x.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246331/WhatsApp_Video_2025-11-04_at_12.31.08_2_gz4h3x.mp4",  
    title: "Master GST Filing with Risk-Free Practice",
    description: "Practice on India's most accurate GST simulator. Learn by doing, without the fear of mistakes.",
    price: 0,
    type: "Promotion",
  },
  {
    id: 9,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246307/WhatsApp_Video_2025-11-04_at_12.31.09_3_dkfkxi.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246307/WhatsApp_Video_2025-11-04_at_12.31.09_3_dkfkxi.mp4",
    title: "Join EduTax today",
    description: "Empowering Future Taxation Experts with Real-World Learning",
    price: 0,
    type: "Promotion",
  },
  {
    id: 10,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246314/WhatsApp_Video_2025-11-04_at_12.31.11_1_b2ubqo.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246314/WhatsApp_Video_2025-11-04_at_12.31.11_1_b2ubqo.mp4",
    title: "Accelerate Your Success with EduTax",
    description: "Stay updated with latest GST regulations. Join live DEMO Sessions",
    price: 0,
    type: "Registration",
  },
  {
    id: 11,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246320/WhatsApp_Video_2025-11-04_at_12.31.10_lzqo9i.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246320/WhatsApp_Video_2025-11-04_at_12.31.10_lzqo9i.mp4",
    title: "Start Your Accounting Career Today",
    description: "Join thousands of students and professionals who trust EduTax Learning",
    price: 0,
    type: "Registration",
  },
  {
    id: 12,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246307/WhatsApp_Video_2025-11-04_at_12.31.11_h6lkjb.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246307/WhatsApp_Video_2025-11-04_at_12.31.11_h6lkjb.mp4",
    title: "India's First Real-Time GST Simulator",
    description: "Practice on India's most accurate GST simulator. Learn by doing, without the fear of mistakes.",
    price: 0,
    type: "Registration",
  },
  {
    id: 13,    
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246327/WhatsApp_Video_2025-11-04_at_12.31.10_1_ctld0k.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246327/WhatsApp_Video_2025-11-04_at_12.31.10_1_ctld0k.mp4",
    title: "GST Training Platform",
    description: "Join EduTax,The Real Time GST Trainig Platform",
    price: 0,
    type: "Registration",
  },
  {
    id: 14,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246355/WhatsApp_Video_2025-11-04_at_12.31.12_bzozzj.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246355/WhatsApp_Video_2025-11-04_at_12.31.12_bzozzj.mp4",
    title: "Learn GST with Prctical Knowledge",
    description: "Learn without the fear of making costly mistakes.Practice unlimited times, reset your progress anytime, and learn by doing. Perfect for students, professionals, and businesses aiming for complete confidence in GST compliance.",
    price: 0,
    type: "Registration",
  },
  {
    id: 15,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246342/WhatsApp_Video_2025-11-04_at_12.31.10_2_zorqae.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246342/WhatsApp_Video_2025-11-04_at_12.31.10_2_zorqae.mp4",
    title: "Learn GST & Taxation",
    description: "Promotion video for attract students to enroll in GST & Taxation courses ",
    price: 0,
    type: "Promotion",
  },
  {
    id: 16,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246327/WhatsApp_Video_2025-11-04_at_12.31.12_1_gtepjd.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246327/WhatsApp_Video_2025-11-04_at_12.31.12_1_gtepjd.mp4",
    title: "Real Time GST Simulation Platform",
    description: "Master GST, E-Invoicing, E-Way Bill generation, and Return Filing through hands-on practice in a 100% risk-free simulation. Experience an exact replica of the GST portal—same dashboards, same procedures, same workflows, without real-world consequences",
    price: 0,
    type: "Promotion",
  },
  {
    id: 17,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246324/WhatsApp_Video_2025-11-04_at_12.31.11_2_jtzwn9.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246324/WhatsApp_Video_2025-11-04_at_12.31.11_2_jtzwn9.mp4",
    title: "Real Time Gst Training PLatform",
    description: "Promote upcoming events and workshops effectively.",
    price: 0,
    type: "Promotion",
  },
  //  {
  //   id: 18,
  //   videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762510658/WhatsApp_Video_2025-11-07_at_15.41.22_o4n1x8.mp4",
  //   thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762510658/WhatsApp_Video_2025-11-07_at_15.41.22_o4n1x8.mp4",
  //   title: "Edutax in your city",
  //   description: "Practice unlimited times, reset your progress anytime, and learn by doing. Perfect for students, professionals, and businesses aiming for complete confidence in GST compliance.",
  //   price: 0,
  //   type: "Promotion", // 🟢 Capitalized
  // },
  {
    id: 19,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/WhatsApp_Video_2026-01-26_at_12.12.40_w4pale.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/WhatsApp_Video_2026-01-26_at_12.12.40_w4pale.mp4",
    title: "Happy Republic Day",
    description: "Celebrate Republic Day with Educerns",
    price: 0,
    type: "Promotion",
  },
  {
    id: 20,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/WhatsApp_Video_2026-02-14_at_16.24.42_svzuhc.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/WhatsApp_Video_2026-02-14_at_16.24.42_svzuhc.mp4",
    title: "Happy Mahashivratri",
    description: "Team Educerns wishes you a very Happy Mahashivratri",
    price: 0,
    type: "Promotion",
  },
  //  {
  //   id: 18,
  //   videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/WhatsApp_Video_2026-02-14_at_16.24.42_svzuhc.mp4",
  //   thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/WhatsApp_Video_2026-02-14_at_16.24.42_svzuhc.mp4",
  //   title: "Video 18",
  //   description: "Happy Mahashivratri",
  //   price: 0,
  //   type: "Promotion",
  // },
];

// 🧱 Grouped Videos (Array Format)
export const groupedVideos = [
  {
    category: "Demo",
    videos: staticVideos.filter(
      (item) => item.type === "Demo" 
    ),
  },
  {
    category: "Promotion",
    videos: staticVideos.filter(
      (item) =>
        item.type === "Promotion" 
        
    ),
  },
  {
    category: "Registration",
    videos: staticVideos.filter(
      (item) =>
        item.type === "Registration" 
        
    ),
  },
  {
    category: "Announcement",
    videos: staticVideos.filter(
      (item) =>
        item.type === "Announcement" 
       
    ),
  },
] as const;

export default staticVideos;