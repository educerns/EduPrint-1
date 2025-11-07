import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import fabric from "fabric";

// ✅ JPEG EXPORT
export const exportAsJPEG = (canvas: fabric.Canvas, fileName = "design") => {
  if (!canvas) return false;

  try {
    // Create a high-quality JPEG export
    const dataURL = canvas.toDataURL({
      format: "jpeg",          // 👈 Change format
      quality: 0.9,            // 👈 JPEG quality (0–1)
      multiplier: 2,           // 👈 Higher = sharper output
      enableRetinaScaling: true,
    } as any); // 👈 Cast to `any` to avoid Fabric v6 type issues

    // Convert to Blob and save
    saveAs(dataURL, `${fileName}.jpg`);
    return true;
  } catch (e) {
    console.error("Error exporting JPEG:", e);
    return false;
  }
};


// ✅ PNG EXPORT
export const exportAsPNG = (canvas: fabric.Canvas, fileName = "design") => {
  if (!canvas) return false;
  try {
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
      enableRetinaScaling: true,
    });
    saveAs(dataURL, `${fileName}.png`);
    return true;
  } catch (e) {
    console.error("Error exporting PNG:", e);
    return false;
  }
};

// ✅ SVG EXPORT
export const exportAsSVG = (canvas: fabric.Canvas, fileName = "design") => {
  if (!canvas) return false;
  try {
    const svgData = canvas.toSVG();
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    saveAs(blob, `${fileName}.svg`);
    return true;
  } catch (e) {
    console.error("Error exporting SVG:", e);
    return false;
  }
};

// ✅ PDF EXPORT
export const exportAsPDF = (canvas: fabric.Canvas, fileName = "design") => {
  if (!canvas) return false;

  try {
    const pdf = new jsPDF("landscape", "mm", "a4");

    // ✅ Include multiplier (required in Fabric 6)
const imgData = canvas.toDataURL({
  format: "png",
  quality: 1,
  multiplier: 1,
  enableRetinaScaling: true,
} as any);


    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}.pdf`);

    return true;
  } catch (e) {
    console.error("Error exporting PDF:", e);
    return false;
  }
};


