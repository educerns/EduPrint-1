import React, { useState } from "react";
import { useEditorStore } from "@/store/store";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, FileIcon, FileImage, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  exportAsJPEG,
  exportAsPDF,
  exportAsPNG,
  exportAsSVG,
} from "@/services/services"

interface ExportModelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportModel: React.FC<ExportModelProps> = ({ isOpen, onClose }) => {
  const { canvas } = useEditorStore();
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    { id: "jpeg", name: "JPEG Template", icon: FileIcon, description: "Template" },
    { id: "png", name: "PNG Image", icon: FileImage, description: "Best for web" },
    // { id: "svg", name: "SVG Image", icon: FileIcon, description: "Scalable vector format" },
    // { id: "pdf", name: "PDF File", icon: FileText, description: "Best for printing" },
  ];

  const handleExport = async () => {
    if (!canvas) return;
    setIsExporting(true);

    let success = false;
    switch (selectedFormat) {
    //   case "json":
    //     success = exportAsJSON(canvas, "design");
    //     break;
    case "jpeg":
        success = exportAsJPEG(canvas, "design");
        break;
      case "png":
        success = exportAsPNG(canvas, "design");
        break;
      case "svg":
        success = exportAsSVG(canvas, "design");
        break;
      case "pdf":
        success = exportAsPDF(canvas, "design");
        break;
      default:
        break;
    }

    if (success) {
      setTimeout(() => {
        onClose();
        setIsExporting(false);
      }, 400);
    } else {
      setIsExporting(false);
    }
  };

  if (!canvas) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Export Design</DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-3">
          {exportFormats.map((format) => (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format.id)}
              className={`flex items-center justify-between w-full border rounded-lg p-3 hover:bg-gray-50 transition ${
                selectedFormat === format.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <format.icon className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">{format.name}</p>
                  <p className="text-xs text-gray-500">{format.description}</p>
                </div>
              </div>
            </button>
          ))}

          <DialogFooter className="sm:justify-between">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="min-w-[120px] bg-blue-900 text-white"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 w-4 h-4" />
                  Export {selectedFormat.toUpperCase()}
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModel;