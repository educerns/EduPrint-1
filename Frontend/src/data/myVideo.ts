export interface MyVideo {
  id: number;
  _id?: string;
  title: string;
  description: string;
  thumbnail: string; // Not used but kept for consistency
  videoUrl: string; // Single video file used for both thumbnail and playback
  price: number;
  type: string;
}

export const myVideos: readonly MyVideo[] = [
  {
    id: 1,
    videoUrl: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762510658/WhatsApp_Video_2025-11-07_at_15.41.22_o4n1x8.mp4",
    thumbnail: "https://res.cloudinary.com/ddb0hp5ka/video/upload/v1762510658/WhatsApp_Video_2025-11-07_at_15.41.22_o4n1x8.mp4",
    title: "Video 1",
    description: "This video is for your institution promotion",
    price: 0,
    type: "Promotion", // 🟢 Capitalized
  },
];



// 🧱 Grouped Videos (Array Format)
export const groupedVideos = [
  {
    category: "Demo",
    videos: myVideos.filter(
      (item) => item.type === "Demo1" || item.type === "Demo2" || item.type === "Demo3"
    ),
  },
  {
    category: "Promotion",
    videos: myVideos.filter(
      (item) =>
        item.type === "Promotion" 
        
    ),
  },
  {
    category: "Registration",
    videos: myVideos.filter(
      (item) =>
        item.type === "Registration" 
        
    ),
  },
  {
    category: "Announcement",
    videos: myVideos.filter(
      (item) =>
        item.type === "Announcement" 
       
    ),
  },
] as const;

export default myVideos;
