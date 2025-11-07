// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { saveDesign } from "@/api/saveDesign"; // or your equivalent API

// const Banner: React.FC = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const handleCreateNewDesign = async () => {
//     if (loading) return;
//     try {
//       setLoading(true);

//       const initialDesignData = {
//         name: "Untitled design - YouTube Thumbnail",
//         canvasData: null,
//         width: 825,
//         height: 465,
//         category: "youtube_thumbnail",
//       };

//       const newDesign = await saveDesign(initialDesignData);

//       if (newDesign?.success) {
//         navigate(`/editor/${newDesign.data?._id}`);
//       } else {
//         alert("Failed to create new design");
//       }
//     } catch (error) {
//       console.error("❌ Error creating new design:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center py-10">
//       <button
//         onClick={handleCreateNewDesign}
//         disabled={loading}
//         className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
//       >
//         {loading ? "Creating..." : "Create New YouTube Thumbnail"}
//       </button>
//     </div>
//   );
// };

// export default Banner;
