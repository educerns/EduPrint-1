import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

(async () => {
  // Ensure the Poppins font is fully loaded before any canvas rendering
  await document.fonts.load('16px "Poppins"');
  // console.log("✅ Poppins font loaded and ready");
})();

createRoot(document.getElementById("root")!).render(<App />);
