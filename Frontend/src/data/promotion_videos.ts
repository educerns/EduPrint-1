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
    title: "Video 1",
    description: "Engaging video for promoting demo classes and interactive sessions.",
    price: 0,
    type: "Demo",
  },
  {
    id: 2,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246295/WhatsApp_Video_2025-11-04_at_12.31.07_1_ntqp2w.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246295/WhatsApp_Video_2025-11-04_at_12.31.07_1_ntqp2w.mp4",
    title: "Video 2",
    description: "Dynamic video template for showcasing free demo sessions.",
    price: 0,
    type: "Demo",
  },
  {
    id: 3,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246296/WhatsApp_Video_2025-11-04_at_12.31.07_ysqdpm.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246296/WhatsApp_Video_2025-11-04_at_12.31.07_ysqdpm.mp4",
    title: "Video 3",
    description: "Professional video for promoting interactive demo classes.",
    price: 0,
    type: "Demo",
  },
  {
    id: 4,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246296/WhatsApp_Video_2025-11-04_at_12.31.08_winvuk.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246296/WhatsApp_Video_2025-11-04_at_12.31.08_winvuk.mp4",
    title: "Video 4",
    description: "Professional video for promoting your GST and taxation courses.",
    price: 0,
    type: "Promotion",
  },
  {
    id: 5,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246297/WhatsApp_Video_2025-11-04_at_12.31.09_ufktmh.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246297/WhatsApp_Video_2025-11-04_at_12.31.09_ufktmh.mp4",
    title: "Video 5",
    description: "Eye-catching video for special offers and course discounts.",
    price: 0,
    type: "Promotion",
  },
  {
    id: 6,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246302/WhatsApp_Video_2025-11-04_at_12.31.08_1_gfvf1l.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246302/WhatsApp_Video_2025-11-04_at_12.31.08_1_gfvf1l.mp4",
    title: "Video 6",
    description: "Modern video layout perfect for new course launches.",
    price: 0,
    type: "Promotion",
  },
  {
    id: 7,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246303/WhatsApp_Video_2025-11-04_at_12.31.09_2_drlaqq.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246303/WhatsApp_Video_2025-11-04_at_12.31.09_2_drlaqq.mp4",
    title: "Video 7",
    description: "Compelling video for limited-time promotional campaigns.",
    price: 0,
    type: "Promotion",
  },
  {
    id: 8,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246331/WhatsApp_Video_2025-11-04_at_12.31.08_2_gz4h3x.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246331/WhatsApp_Video_2025-11-04_at_12.31.08_2_gz4h3x.mp4",  
    title: "Video 8",
    description: "Highlight key benefits of your courses with this video.",
    price: 0,
    type: "Promotion",
  },
  {
    id: 9,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246307/WhatsApp_Video_2025-11-04_at_12.31.09_3_dkfkxi.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246307/WhatsApp_Video_2025-11-04_at_12.31.09_3_dkfkxi.mp4",
    title: "Video 9",
    description: "Share student testimonials and success stories effectively.",
    price: 0,
    type: "Promotion",
  },
  {
    id: 10,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246314/WhatsApp_Video_2025-11-04_at_12.31.11_1_b2ubqo.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246314/WhatsApp_Video_2025-11-04_at_12.31.11_1_b2ubqo.mp4",
    title: "Video 10",
    description: "Announcement video for course registration opening.",
    price: 0,
    type: "Registration",
  },
  {
    id: 11,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246320/WhatsApp_Video_2025-11-04_at_12.31.10_lzqo9i.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246320/WhatsApp_Video_2025-11-04_at_12.31.10_lzqo9i.mp4",
    title: "Video 11",
    description: "Compelling video for admission and enrollment campaigns.",
    price: 0,
    type: "Registration",
  },
  {
    id: 12,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246307/WhatsApp_Video_2025-11-04_at_12.31.11_h6lkjb.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246307/WhatsApp_Video_2025-11-04_at_12.31.11_h6lkjb.mp4",
    title: "Video 12",
    description: "Promote early bird registration benefits with this video.",
    price: 0,
    type: "Registration",
  },
  {
    id: 13,    
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246327/WhatsApp_Video_2025-11-04_at_12.31.10_1_ctld0k.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246327/WhatsApp_Video_2025-11-04_at_12.31.10_1_ctld0k.mp4",
    title: "Video 13",
    description: "Create urgency with new batch starting announcements.",
    price: 0,
    type: "Registration",
  },
  {
    id: 14,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246355/WhatsApp_Video_2025-11-04_at_12.31.12_bzozzj.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246355/WhatsApp_Video_2025-11-04_at_12.31.12_bzozzj.mp4",
    title: "Video 14",
    description: "Drive enrollment with limited seats availability message.",
    price: 0,
    type: "Registration",
  },
  {
    id: 15,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246342/WhatsApp_Video_2025-11-04_at_12.31.10_2_zorqae.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246342/WhatsApp_Video_2025-11-04_at_12.31.10_2_zorqae.mp4",
    title: "Video 15",
    description: "Seasonal promotional video for festival offers.",
    price: 0,
    type: "Promotion",
  },
  {
    id: 16,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246327/WhatsApp_Video_2025-11-04_at_12.31.12_1_gtepjd.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246327/WhatsApp_Video_2025-11-04_at_12.31.12_1_gtepjd.mp4",
    title: "Video 16",
    description: "General announcement video for important updates.",
    price: 0,
    type: "Promotion",
  },
  {
    id: 17,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246324/WhatsApp_Video_2025-11-04_at_12.31.11_2_jtzwn9.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762246324/WhatsApp_Video_2025-11-04_at_12.31.11_2_jtzwn9.mp4",
    title: "Video 17",
    description: "Promote upcoming events and workshops effectively.",
    price: 0,
    type: "Promotion",
  },
  {
    id: 18,
    videoUrl: "https://player.cloudinary.com/embed/?cloud_name=ddb0hp5ka&public_id=WhatsApp_Video_2026-01-26_at_12.12.40_w4pale",
    thumbnail: "https://player.cloudinary.com/embed/?cloud_name=ddb0hp5ka&public_id=WhatsApp_Video_2026-01-26_at_12.12.40_w4pale",
    title: "Video 18",
    description: "Happy Republic Day",
    price: 0,
    type: "Promotion",
  },
];

// 🧱 Grouped Videos (Array Format)
export const groupedVideos = [
  {
    category: "Demo",
    videos: staticVideos.filter(
      (item) => item.type === "Demo1" || item.type === "Demo2" || item.type === "Demo3"
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