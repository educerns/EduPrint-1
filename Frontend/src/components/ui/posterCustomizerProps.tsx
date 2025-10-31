import React from "react";
import Swal from "sweetalert2";

interface Template {
  customImage: string;
  type?: string;
}

interface FormData {
  centerName?: string;
  address?: string;
  email?: string;
  mobile?: string;
  dateTime?: string;
}

interface PosterCustomizerProps {
  template: Template;
  formData: FormData;
  setGeneratedUrl: (url: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const PosterCustomizer: React.FC<PosterCustomizerProps> = ({
  template,
  formData,
  setGeneratedUrl,
  canvasRef,
}) => {
  // ✅ Debug Log
  console.log("PosterCustomizer mounted with:", { template, formData });

const handleGenerate = async (): Promise<void> => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = template.customImage;

  img.onload = async (): Promise<void> => {
    // === CANVAS SETUP ===
    const targetWidth = 1080;
    const targetHeight = 1350;
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const scale = targetWidth / 1080;
    ctx.textBaseline = "top";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // === TEXT HELPER ===
    const drawText = (
      text: string,
      x: number,
      y: number,
      opts: {
        align?: CanvasTextAlign;
        size?: number;
        color?: string;
        bold?: boolean;
      } = {}
    ) => {
      const {
        align = "center",
        size = 40,
        color = "#1a1a1a",
        bold = false,
      } = opts;
      ctx.font = `${bold ? "bold " : ""}${size * scale}px Poppins, Arial, sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.fillText(text, x * scale, y * scale);
    };

    // === POSTER TYPE DISPATCHER ===
    const type: string = template.type || "Promotion";

    // --- 🎯 PROMOTION posters ---
    if (type.startsWith("Promotion")) {
      const promotionStyles: Record<
        string,
        {
          color: string;
          x: number;
          y: number;
          maxWidth: number;
          maxFont: number;
          minFont: number;
          align: CanvasTextAlign;
        }
      > = {
        Promotion1: { color: "#fff", x: 90, y: 110, maxWidth: 650, maxFont: 60, minFont: 28, align: "left" },
        Promotion2: { color: "#2C4E86", x: 250, y: 950, maxWidth: 400, maxFont: 60, minFont: 32, align: "center" },
        Promotion3: { color: "#2C4E86", x: 180, y: 250, maxWidth: 650, maxFont: 70, minFont: 30, align: "left" },
        Promotion4: { color: "#003865", x: canvas.width - 30, y: 10, maxWidth: 700, maxFont: 60, minFont: 28, align: "right" },
        Promotion5: { color: "#2C4E86", x: 90, y: 90, maxWidth: 650, maxFont: 60, minFont: 30, align: "left" },
      };

      if (formData.centerName) {
        const text = formData.centerName;
        const style = promotionStyles[type] || promotionStyles["Promotion3"];
        const { color, x, y, maxWidth, maxFont, minFont, align } = style;
        let fontSize = maxFont;

        ctx.fillStyle = color;
        ctx.textAlign = align;

        // Shrink text until it fits
        while (fontSize > minFont) {
          ctx.font = `bold ${fontSize}px Poppins`;
          if (ctx.measureText(text).width <= maxWidth) break;
          fontSize -= 2;
        }

        const words = text.split(" ");
        const lineHeight = fontSize + 2;
        let line = "";
        let currentY = y;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const testWidth = ctx.measureText(testLine).width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line.trim(), x, currentY);
            line = words[n] + " ";
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line.trim(), x, currentY);
      }

      // Address bottom-left
      if (formData.address) {
        const maxWidth = 500;
        const lineHeight = 30;
        const x = 16;
        const y = 1290;
        const fontSize = 30;
        ctx.font = `bold ${fontSize}px Poppins`;
        ctx.fillStyle = "#000";
        ctx.textAlign = "left";

        const words = formData.address.replace(/\n/g, " ").split(" ");
        let line = "";
        let currentY = y;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const testWidth = ctx.measureText(testLine).width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line.trim(), x, currentY);
            line = words[n] + " ";
            currentY += lineHeight;
          } else line = testLine;
        }
        ctx.fillText(line.trim(), x, currentY);
      }

      // Contact bottom-right
      const contactFields = [formData.mobile, formData.email].filter(Boolean) as string[];
      if (contactFields.length > 0) {
        const maxWidth = 600;
        const startY = 1290;
        const lineHeight = 25;
        const x = canvas.width - 20;
        let fontSize = 30;
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";

        const anyLineTooWide = (size: number): boolean => {
          ctx.font = `bold ${size}px Poppins`;
          return contactFields.some((line) => ctx.measureText(line).width > maxWidth);
        };

        while (anyLineTooWide(fontSize) && fontSize > 18) fontSize -= 2;

        ctx.font = `bold ${fontSize}px Poppins`;
        let currentY = startY;
        contactFields.forEach((line) => {
          ctx.fillText(line, x, currentY);
          currentY += lineHeight;
        });
      }
    }

    // --- 🟢 DEMO1 ---
    else if (type === "Demo1") {
      if (formData.dateTime) {
        const text = `🕒 ${formData.dateTime}`;
        ctx.font = `bold 35px Poppins`;
        ctx.textAlign = "right";
        ctx.fillStyle = "#faa508";

        const textWidth = ctx.measureText(text).width;
        const padding = 20;
        const x = canvas.width - 40;
        const y = canvas.height - 60;

        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(x - textWidth - padding, y - 20, textWidth + padding * 2, 70);

        ctx.fillStyle = "#faa508";
        ctx.fillText(text, x, y);
      }

      if (formData.centerName) {
        const text = formData.centerName;
        const x = 20;
        const y = 1150;
        const maxWidth = 1000;
        const lineHeight = 60;
        ctx.font = `bold 56px Poppins`;
        ctx.fillStyle = "#faa508";
        ctx.textAlign = "left";

        const words = text.split(" ");
        let line = "";
        let currentY = y;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const testWidth = ctx.measureText(testLine).width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line.trim(), x, currentY);
            line = words[n] + " ";
            currentY += lineHeight;
          } else line = testLine;
        }
        ctx.fillText(line.trim(), x, currentY);
      }

      const contactText = [formData.email, formData.mobile].filter(Boolean).join(" | ");
      if (contactText)
        drawText(contactText, 20, 1270, { align: "left", size: 28, color: "#000" });
      if (formData.address)
        drawText(`📍 ${formData.address}`, 20, 1300, {
          align: "left",
          size: 30,
          
          color: "#000",
        });
    }

    // --- 🟣 DEMO2 ---
    else if (type === "Demo2") {
      if (formData.dateTime) {
        const text = `🕒 ${formData.dateTime}`;
        ctx.font = `bold 35px Poppins`;
        ctx.textAlign = "left";
        ctx.fillStyle = "#fff";
        const x = 45;
        const y = canvas.height - 180;
        ctx.fillText(text, x, y);
      }

     if (formData.centerName) {
  const text = formData.centerName;
  const startY = 160; // moved slightly below the top edge for padding
  const maxWidth = 600;
  const maxLines = 2;
  const lineHeight = 50;
  let fontSize = 50;

  // 🔹 Align text to the left
  ctx.textAlign = "left";

  // 🔹 Move text to top-left corner (add some left padding)
  const x = 60; // was canvas.width - maxWidth - 35;
  ctx.fillStyle = "#fd7400";

  const getLineCount = (size: number): number => {
    ctx.font = `bold ${size}px Poppins`;
    const words = text.split(" ");
    let line = "";
    let count = 1;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      if (ctx.measureText(testLine).width > maxWidth && n > 0) {
        line = words[n] + " ";
        count++;
      } else line = testLine;
    }
    return count;
  };

  let lines = getLineCount(fontSize);
  while (lines > maxLines && fontSize > 20) {
    fontSize -= 2;
    lines = getLineCount(fontSize);
  }

  ctx.font = `bold ${fontSize}px Poppins`;
  const words = text.split(" ");
  let line = "";
  let currentY = startY;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else line = testLine;
  }
  ctx.fillText(line.trim(), x, currentY);
}

      const contactFields = [formData.mobile, formData.email].filter(Boolean) as string[];
      if (contactFields.length > 0) {
        const maxWidth = 600;
        const startY = 1180;
        const lineHeight = 50;
        const x = canvas.width - 110;
        let fontSize = 35;
        ctx.textAlign = "right";
        ctx.fillStyle = "#fd7400";

        const anyLineTooWide = (size: number): boolean => {
          ctx.font = `bold ${size}px Poppins`;
          return contactFields.some((line) => ctx.measureText(line).width > maxWidth);
        };
        while (anyLineTooWide(fontSize) && fontSize > 18) fontSize -= 2;

        ctx.font = `bold ${fontSize}px Poppins`;
        let currentY = startY;
        contactFields.forEach((line) => {
          ctx.fillText(line, x, currentY);
          currentY += lineHeight;
        });
      }

      if (formData.address)
        drawText(`📍 ${formData.address}`, canvas.width - 60, 1300, {
          align: "right",
          size: 32,
          bold: true,
          color: "#2C4E86",
        });
    }

    // --- 🔵 DEMO3 ---
    else if (type === "Demo3") {
      if (formData.centerName) {
        const text = formData.centerName;
        const maxWidth = 750;
        const minFont = 28;
        let fontSize = 60;
        ctx.fillStyle = "#01596f";
        ctx.textAlign = "left";
        while (fontSize > minFont) {
          ctx.font = `bold ${fontSize}px Poppins`;
          if (ctx.measureText(text).width <= maxWidth) break;
          fontSize -= 2;
        }
        const x = 155;
        const y = 120;
        ctx.font = `bold ${fontSize}px Poppins`;
        ctx.fillText(text, x, y);
      }

      if (formData.address) {
        ctx.font = "bold 32px Poppins";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "left";
        ctx.fillText(` ${formData.address}`, 110, canvas.height - 160);
      }

      const contactParts = [];
      if (formData.mobile) contactParts.push(` ${formData.mobile}`);
      if (formData.email) contactParts.push(` ${formData.email}`);
      if (contactParts.length > 0) {
        const contactText = contactParts.join("    |    ");
        ctx.font = "bold 30px Poppins";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "left";
        ctx.fillText(contactText, 150, canvas.height - 85);
      }
    }

    // --- 🟣 REGISTRATION1 / 2 ---
    else if (type === "Registration1" || type === "Registration2") {
      if (formData.centerName) {
        const text = formData.centerName;
        const maxWidth = 650;
        const minFont = 30;
        let fontSize = 60;
        ctx.fillStyle = "#01596f";
        ctx.textAlign = "left";

        while (fontSize > minFont) {
          ctx.font = `bold ${fontSize}px Poppins`;
          if (ctx.measureText(text).width <= maxWidth * 1.2) break;
          fontSize -= 2;
        }

        let x = 20, y = 35;
        if (type === "Registration2") y = canvas.height - 142;

        const words = text.split(" ");
        let line = "";
        const lineHeight = fontSize + 2;
        let currentY = y;

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + " ";
          if (ctx.measureText(testLine).width > maxWidth && i > 0) {
            ctx.fillText(line.trim(), x, currentY);
            line = words[i] + " ";
            currentY += lineHeight;
          } else line = testLine;
        }
        ctx.fillText(line.trim(), x, currentY);
      }

      if (formData.address) {
        const maxWidth = 500;
        const lineHeight = 30;
        const x = 16;
        const y = 1290;
        const fontSize = 25;
        ctx.font = `bold ${fontSize}px Poppins`;
        ctx.fillStyle = "#000";
        ctx.textAlign = "left";

        const words = formData.address.split(" ");
        let line = "";
        let currentY = y;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            ctx.fillText(line.trim(), x, currentY);
            line = words[n] + " ";
            currentY += lineHeight;
          } else line = testLine;
        }
        ctx.fillText(line.trim(), x, currentY);
      }

      const contactFields = [formData.mobile, formData.email].filter(Boolean) as string[];
      if (contactFields.length > 0) {
        const maxWidth = 600;
        const startY = 1290;
        const lineHeight = 25;
        const x = canvas.width - 20;
        let fontSize = 25;
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";

        const anyLineTooWide = (size: number): boolean => {
          ctx.font = `bold ${size}px Poppins`;
          return contactFields.some((line) => ctx.measureText(line).width > maxWidth);
        };

        while (anyLineTooWide(fontSize) && fontSize > 18) fontSize -= 2;

        ctx.font = `bold ${fontSize}px Poppins`;
        let currentY = startY;
        contactFields.forEach((line) => {
          ctx.fillText(line, x, currentY);
          currentY += lineHeight;
        });
      }
    }

    // === EXPORT ===
    const url = canvas.toDataURL("image/png", 1.0);
    setGeneratedUrl(url);

    Swal.fire({
      icon: "success",
      title: `${type} Poster Generated!`,
      text: "Your customized poster is ready to download.",
      confirmButtonColor: "#2C4E86",
    });
  };

  img.onerror = (): void => {
    Swal.fire({
      icon: "error",
      title: "Image Load Failed",
      text: "Unable to load template image. Please try again.",
      confirmButtonColor: "#2C4E86",
    });
  };
};



  const handleDownload = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn("⚠️ Download failed: no canvas");
      return;
    }

    const url = canvas.toDataURL("image/png", 1.0);
    console.log("⬇️ Downloading image of length:", url.length);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${formData.centerName || "Customized"}_Poster.png`;
    link.click();
  };

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex justify-center mt-5 gap-3">
        <button
          onClick={handleGenerate}
          className="bg-[#2C4E86] text-white px-5 py-2 rounded-md hover:bg-[#1f3a5f] transition text-sm"
        >
          Generate Poster
        </button>
        <button
          onClick={handleDownload}
          className="border border-[#2C4E86] text-[#2C4E86] px-5 py-2 rounded-md hover:bg-[#2C4E86] hover:text-white transition text-sm"
        >
          Download PNG
        </button>
      </div>
    </>
  );
};

export default PosterCustomizer;
