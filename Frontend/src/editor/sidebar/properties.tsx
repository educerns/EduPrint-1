import { useEditorStore } from '@/store/store'
import { Slider } from "@/components/ui/slider";
import React, { useEffect, useState, useRef } from 'react'
import { Label } from "@/components/ui/label";
import { Bold, Copy, FlipHorizontal, FlipVertical, Italic, MoveDown, MoveUp, Trash, Underline, Pipette, ChevronRight, ChevronLeft, Undo2, Redo2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cloneSelectedObject, deleteSelectedObject } from '@/fabric/fabric-utils';
import * as fabric from "fabric";
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";


const fontFamilies = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana",
    "Courier New", "Tahoma", "Trebuchet MS", "Impact", "Comic Sans MS",
    "Inter", "Poppins", "Roboto", "Open Sans", "Lato", "Montserrat",
    "Nunito", "Raleway", "Merriweather", "Playfair Display", "DM Sans",
    "Source Sans Pro", "Noto Sans", "Rubik", "Quicksand", "Pacifico",
    "Dancing Script", "Great Vibes", "Bebas Neue", "Oswald", "Lobster",
    "Fredoka One", "Amatic SC", "Caveat", "Shadows Into Light",
];

const presetColors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
    "#FFC0CB", "#A52A2A", "#808080", "#FFD700", "#4B0082",
    "#E6E6FA", "#90EE90", "#FFB6C1", "#20B2AA", "#87CEEB",
];

// Enhanced Magnifier + Color Display Component
interface MagnifierProps {
    fabricCanvas: any; // Fabric canvas instance
    htmlCanvas: HTMLCanvasElement | null;
    zoom?: number;
    size?: number;
}

const CanvasMagnifier: React.FC<MagnifierProps> = ({ fabricCanvas, htmlCanvas, zoom = 5, size = 150 }) => {
    const magnifierRef = useRef<HTMLCanvasElement>(null);
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [pixelColor, setPixelColor] = useState({ hex: '#000000', rgb: 'rgb(0, 0, 0)' });

    useEffect(() => {
        if (!htmlCanvas || !magnifierRef.current) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = htmlCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setPos({ x: e.clientX, y: e.clientY });
            setVisible(true);

            // Get pixel color from canvas
            try {
                const ctx = htmlCanvas.getContext("2d");
                if (ctx) {
                    const imageData = ctx.getImageData(Math.round(x), Math.round(y), 1, 1);
                    const [r, g, b, a] = imageData.data;
                    const toHex = (n: number) => n.toString(16).padStart(2, "0");
                    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
                    setPixelColor({
                        hex,
                        rgb: `rgb(${r}, ${g}, ${b})`
                    });
                }
            } catch (err) {
                console.log('Color reading error:', err);
            }

            // Draw zoomed section on magnifier
            const zoomCtx = magnifierRef.current!.getContext("2d");
            if (zoomCtx) {
                zoomCtx.clearRect(0, 0, size, size);
                zoomCtx.imageSmoothingEnabled = false;
                zoomCtx.drawImage(
                    htmlCanvas,
                    x - size / (2 * zoom),
                    y - size / (2 * zoom),
                    size / zoom,
                    size / zoom,
                    0,
                    0,
                    size,
                    size
                );

                // Draw center square highlight
                zoomCtx.strokeStyle = "red";
                zoomCtx.lineWidth = 2;
                zoomCtx.strokeRect(size / 2 - 5, size / 2 - 5, 10, 10);

                // Draw a crosshair
                zoomCtx.strokeStyle = "red";
                zoomCtx.beginPath();
                zoomCtx.moveTo(size / 2, 0);
                zoomCtx.lineTo(size / 2, size);
                zoomCtx.moveTo(0, size / 2);
                zoomCtx.lineTo(size, size / 2);
                zoomCtx.stroke();
            }
        };

        const handleMouseLeave = () => setVisible(false);

        htmlCanvas.addEventListener("mousemove", handleMouseMove);
        htmlCanvas.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            htmlCanvas.removeEventListener("mousemove", handleMouseMove);
            htmlCanvas.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [htmlCanvas, zoom, size]);

    if (!visible) return null;

    return (
        <div style={{ position: "fixed", left: pos.x + 20, top: pos.y + 20, zIndex: 1000, pointerEvents: "none" }}>
            {/* Magnifier Canvas */}
            <canvas
                ref={magnifierRef}
                width={size}
                height={size}
                style={{
                    borderRadius: "50%",
                    border: "3px solid #333",
                    boxShadow: "0 0 0 1px #fff, 0 2px 8px rgba(0,0,0,0.5)",
                    display: "block",
                    backgroundColor: "#fff",
                }}
            />

            {/* Color Info Display - DevTools Style */}
            <div
                style={{
                    position: "absolute",
                    top: size + 10,
                    left: 0,
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                    border: "1px solid #444",
                }}
            >
                <div style={{ marginBottom: "4px", fontWeight: "bold" }}>Pixel Color</div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div
                        style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: pixelColor.hex,
                            border: "1px solid #666",
                            borderRadius: "2px",
                        }}
                    />
                    <span>{pixelColor.hex}</span>
                    <span style={{ color: "#888" }}>{pixelColor.rgb}</span>
                </div>
            </div>
        </div>
    );
};

const Properties: React.FC = () => {
    const { canvas } = useEditorStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [selectedObject, setSelectedObject] = useState<any>(null);
    const [ObjectType, setObjectType] = useState<any>('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const undoStack = useRef<any[]>([]);
    const redoStack = useRef<any[]>([]);

    // Common properties
    const [opacity, setOpacity] = useState(100);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    // Text properties
    const [text, setText] = useState('');
    const [fontSize, setFontSize] = useState(24);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [fontWeight, setFontWeight] = useState('normal');
    const [fontStyle, setFontStyle] = useState('normal');
    const [underline, setUnderline] = useState(false);
    const [textColor, setTextColor] = useState('#000000');
    const [textBackgroundColor, setTextBackgroundColor] = useState('');
    const [letterSpacing, setLetterSpacing] = useState(0);

    // Shape properties
    const [fillColor, setFillColor] = useState('#ffffff');
    const [strokeColor, setStrokeColor] = useState('#000000');
    const [strokeWidth, setStrokeWidth] = useState(0);
    const [strokeDasharray, setStrokeDasharray] = useState('solid');

    const [scaleX, setScaleX] = useState(1);
    const [scaleY, setScaleY] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(0);
    const [saturation, setSaturation] = useState(0);

    // Eyedropper state
    const [isPickingColor, setIsPickingColor] = useState(false);
    const [pickingColorType, setPickingColorType] = useState<'fill' | 'stroke' | 'text' | 'textBg'>('fill');

    const togglePanel = () => setIsCollapsed(!isCollapsed);

    const pickColorFromCanvas = (x: number, y: number) => {
        if (!canvas) return null;

        try {
            canvas.renderAll();
            const ctx = canvas.getContext();

            // Get image data from canvas - make sure coordinates are within bounds
            const canvasWidth = canvas.getWidth();
            const canvasHeight = canvas.getHeight();

            // Ensure coordinates are within canvas bounds
            const clampedX = Math.max(0, Math.min(Math.round(x), canvasWidth - 1));
            const clampedY = Math.max(0, Math.min(Math.round(y), canvasHeight - 1));

            const imageData = ctx.getImageData(clampedX, clampedY, 1, 1);
            const [r, g, b, a] = imageData.data;

            const toHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
            const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

            return { hex, rgba: `rgba(${r}, ${g}, ${b}, ${a / 255})` };
        } catch (err) {
            console.error('Error picking color:', err);
            return null;
        }
    };

    const handleCanvasClick = (e: fabric.TEvent) => {
        if (!isPickingColor || !canvas) return;

        try {
            const pointer = canvas.getPointer(e.e as MouseEvent);

            // Use pointer coordinates directly (already in canvas space)
            const color = pickColorFromCanvas(pointer.x, pointer.y);

            if (color) {
                if (pickingColorType === 'fill') {
                    setFillColor(color.hex);
                    updateObjectProperty('fill', color.hex);
                } else if (pickingColorType === 'stroke') {
                    setStrokeColor(color.hex);
                    updateObjectProperty('stroke', color.hex);
                } else if (pickingColorType === 'text') {
                    setTextColor(color.hex);
                    updateObjectProperty('fill', color.hex);
                } else if (pickingColorType === 'textBg') {
                    setTextBackgroundColor(color.hex);
                    updateObjectProperty('backgroundColor', color.hex);
                }
                console.log('Color picked:', color.hex);
            }

            setIsPickingColor(false);
            setPickingColorType('fill');
            canvas.defaultCursor = 'default';
            canvas.renderAll();
        } catch (err) {
            console.error('Error in handleCanvasClick:', err);
            setIsPickingColor(false);
        }
    };

    const activateEyedropper = (colorType: 'fill' | 'stroke' | 'text' | 'textBg' = 'fill') => {
        if (!canvas) return;
        setIsPickingColor(true);
        setPickingColorType(colorType);
        canvas.defaultCursor = 'grab'; // Use grab cursor
        canvas.renderAll();
    };

    useEffect(() => {
        if (!canvas) return;

        const handleMouseDown = (e: fabric.TEvent) => {
            if (!isPickingColor) return;
            handleCanvasClick(e);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsPickingColor(false);
                setPickingColorType('fill');
                if (canvas) {
                    canvas.defaultCursor = "default";
                    canvas.renderAll();
                }
            }
        };

        canvas.on("mouse:down", handleMouseDown);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            canvas.off("mouse:down", handleMouseDown);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [canvas, isPickingColor, pickingColorType]);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const handleWheel = (e: WheelEvent) => {
            e.stopPropagation();
        };

        scrollContainer.addEventListener('wheel', handleWheel, { passive: true });
        return () => {
            scrollContainer.removeEventListener('wheel', handleWheel);
        };
    }, []);

    useEffect(() => {
        if (!canvas) return;

        const handleSelectionCreated = () => {
            const active = canvas.getActiveObject();
            if (!active) return;

            setSelectedObject(active);

            // Common properties
            setOpacity(Math.round(((active.opacity ?? 1) * 100)));
            setWidth(Math.round((active.width ?? 0) * (active.scaleX ?? 1)));
            setHeight(Math.round((active.height ?? 0) * (active.scaleY ?? 1)));

            // Text object
            if (active.type === "i-text") {
                const textObj = active as fabric.IText;
                setObjectType("text");
                setText(textObj.text ?? "");
                setFontSize(textObj.fontSize ?? 24);
                setFontFamily(textObj.fontFamily ?? "Arial");
                setFontWeight((textObj.fontWeight as string) ?? "normal");
                setFontStyle((textObj.fontStyle as string) ?? "normal");
                setUnderline(!!textObj.underline);
                setTextColor((textObj.fill as string) ?? "#000000");
                setTextBackgroundColor((textObj.backgroundColor as string) ?? "");
                setLetterSpacing(textObj.charSpacing ?? 0);
            }
            // Shape object
            else if (['rect', 'circle', 'ellipse', 'triangle', 'polygon', 'polyline', 'path', 'line'].includes(active.type ?? '')) {
                setObjectType("shape");
                setFillColor((active.fill as string) ?? "#ffffff");
                setStrokeColor((active.stroke as string) ?? "#000000");
                setStrokeWidth(active.strokeWidth ?? 0);
                setStrokeDasharray(active.strokeDashArray?.length > 0 ? 'dashed' : 'solid');
            }  // 🖼️ IMAGE (Fabric 6+)
            else if (active instanceof fabric.Image) {
                const image = active as InstanceType<typeof fabric.Image>;
                setObjectType("image");

                // Ensure filters array exists
                if (!Array.isArray(image.filters)) image.filters = [];

                // Example — store current filter states
                const brightnessFilter = image.filters.find(f => f instanceof fabric.filters.Brightness);
                const contrastFilter = image.filters.find(f => f instanceof fabric.filters.Contrast);
                const saturationFilter = image.filters.find(f => f instanceof fabric.filters.Saturation);

                setBrightness(brightnessFilter ? (brightnessFilter as any).brightness : 0);
                setContrast(contrastFilter ? (contrastFilter as any).contrast : 0);
                setSaturation(saturationFilter ? (saturationFilter as any).saturation : 0);
            }

            // ❌ NONE
            else {
                setObjectType("");
            }
        };

        const handleSelectionCleared = () => { };

        const active = canvas.getActiveObject();
        if (active) {
            handleSelectionCreated();
        }

        canvas.on('selection:created', handleSelectionCreated);
        canvas.on('selection:updated', handleSelectionCreated);
        canvas.on('object:modified', handleSelectionCreated);
        canvas.on('selection:cleared', handleSelectionCleared);

        return () => {
            canvas.off('selection:created', handleSelectionCreated);
            canvas.off('selection:updated', handleSelectionCreated);
            canvas.off('object:modified', handleSelectionCreated);
            canvas.off('selection:cleared', handleSelectionCleared);
        };
    }, [canvas]);
    // ✅ Track canvas history for Undo/Redo
useEffect(() => {
  if (!canvas) return;

  const recordChange = () => saveCanvasState();

  // Record changes for undo/redo
  canvas.on("object:added", recordChange);
  canvas.on("object:modified", recordChange);
  canvas.on("object:removed", recordChange);

  // Capture initial state when canvas loads
  saveCanvasState();

  return () => {
    canvas.off("object:added", recordChange);
    canvas.off("object:modified", recordChange);
    canvas.off("object:removed", recordChange);
  };
}, [canvas]);



    const saveCanvasState = () => {
    if (!canvas) return;
    const json = canvas.toJSON();
    const prev = undoStack.current[undoStack.current.length - 1];
    if (JSON.stringify(prev) !== JSON.stringify(json)) {
        undoStack.current.push(json);
        if (undoStack.current.length > 50) undoStack.current.shift(); // limit history
        redoStack.current = [];
    }
};

    const handleUndo = () => {
    if (!canvas || undoStack.current.length <= 1) return;

    const current = undoStack.current.pop();
    redoStack.current.push(current);

    const prevState = undoStack.current[undoStack.current.length - 1];
    canvas.loadFromJSON(prevState, () => {
        canvas.renderAll();
    });
};

const handleRedo = () => {
    if (!canvas || redoStack.current.length === 0) return;

    const nextState = redoStack.current.pop();
    if (nextState) {
        undoStack.current.push(nextState);
        canvas.loadFromJSON(nextState, () => {
            canvas.renderAll();
        });
    }
};


useEffect(() => {
    if (!canvas) return;

    const handleKeyDown = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

        // Delete key → remove selected object
        if (event.key === "Delete" || event.key === "Backspace") {
            const activeObjects = canvas.getActiveObjects();
            if (activeObjects.length > 0) {
                activeObjects.forEach((obj) => canvas.remove(obj));
                canvas.discardActiveObject();
                canvas.requestRenderAll();
                saveCanvasState();
            }
        }

        // Ctrl+Z → Undo
        if (event.ctrlKey && event.key.toLowerCase() === "z") {
            event.preventDefault();
            handleUndo();
        }

        // Ctrl+Y → Redo
        if (event.ctrlKey && event.key.toLowerCase() === "y") {
            event.preventDefault();
            handleRedo();
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
}, [canvas]);


    const updateObjectProperty = (property: string, value: any) => {
        if (!canvas || !selectedObject) return;
        selectedObject.set(property, value);
        canvas.renderAll();
    };

    const handleOpacityChange = (value: number[]) => {
        const newValue = value[0];
        setOpacity(newValue);
        updateObjectProperty('opacity', newValue / 100);
    };

    const handleDuplicate = async () => {
        if (!canvas || !selectedObject) return;
        await cloneSelectedObject(canvas);
    };

    const handleDelete = async () => {
        if (!canvas || !selectedObject) return;
        deleteSelectedObject(canvas);
    };

    const handleBringToFront = () => {
        if (!canvas || !selectedObject) return;
        canvas.bringToFront(selectedObject);
        canvas.renderAll();
    };

    const handleSendToBack = () => {
        if (!canvas || !selectedObject) return;
        canvas.sendToBack(selectedObject);
        canvas.renderAll();
    };

    const handleFlipHorizontal = () => {
        if (!canvas || !selectedObject) return;
        updateObjectProperty('flipX', !selectedObject.flipX);
    };

    const handleFlipVertical = () => {
        if (!canvas || !selectedObject) return;
        updateObjectProperty('flipY', !selectedObject.flipY);
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const nextText = event.target.value;
        setText(nextText);
        updateObjectProperty('text', nextText);
    };

    const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = Number(e.target.value);
        setFontSize(newSize);
        updateObjectProperty('fontSize', newSize);
    };

    const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFontFamily(value);
        updateObjectProperty('fontFamily', value);
    };

    const handleToggleBold = () => {
        if (!selectedObject) return;
        const newWeight = fontWeight === 'bold' ? 'normal' : 'bold';
        setFontWeight(newWeight);
        updateObjectProperty('fontWeight', newWeight);
    };

    const handleToggleItalic = () => {
        if (!selectedObject) return;
        const newStyle = fontStyle === 'italic' ? 'normal' : 'italic';
        setFontStyle(newStyle);
        updateObjectProperty('fontStyle', newStyle);
    };

    const handleToggleUnderline = () => {
        if (!selectedObject) return;
        const newUnderline = !underline;
        setUnderline(newUnderline);
        updateObjectProperty('underline', newUnderline);
    };

    const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setTextColor(color);
        updateObjectProperty('fill', color);
    };

    const handleTextColorHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (!value.startsWith('#')) value = '#' + value;
        setTextColor(value);
        updateObjectProperty('fill', value);
    };

    const handleTextBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setTextBackgroundColor(color);
        updateObjectProperty('backgroundColor', color);
    };

    const handleToggleTextbackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setTextBackgroundColor(color);
        updateObjectProperty('backgroundColor', color);
    };

    const handleToggleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setTextColor(color);
        updateObjectProperty('fill', color);
    };

    const handleBgColorHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (!value.startsWith('#')) value = '#' + value;
        setTextBackgroundColor(value);
        updateObjectProperty('backgroundColor', value);
    };

    const handleLetterSpacingChange = (value: number[]) => {
        const spacing = value[0];
        setLetterSpacing(spacing);
        if (!selectedObject) return;
        selectedObject.set('charSpacing', spacing);
        canvas?.renderAll();
    };

    // Shape handlers
    const handleFillColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setFillColor(color);
        updateObjectProperty('fill', color);
    };

    const handleFillColorHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (!value.startsWith('#')) value = '#' + value;
        setFillColor(value);
        updateObjectProperty('fill', value);
    };

    const handleStrokeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setStrokeColor(color);
        updateObjectProperty('stroke', color);
    };

    const handleStrokeColorHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (!value.startsWith('#')) value = '#' + value;
        setStrokeColor(value);
        updateObjectProperty('stroke', value);
    };

    const handleStrokeWidthChange = (value: number[]) => {
        const width = value[0];
        setStrokeWidth(width);
        updateObjectProperty('strokeWidth', width);
    };

    const handleStrokeDasharrayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const dashType = e.target.value;
        setStrokeDasharray(dashType);

        let dasharray: number[] = [];
        if (dashType === 'dashed') dasharray = [10, 5];
        else if (dashType === 'dotted') dasharray = [2, 2];

        updateObjectProperty('strokeDashArray', dasharray);
    };

    const ColorPickerPopover = ({
        color,
        onChange,
        onHexChange,
        label,
        colorType = 'fill'
    }: {
        color: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        onHexChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        label: string;
        colorType?: 'fill' | 'stroke' | 'text' | 'textBg';
    }) => {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                    >
                        <div className="flex items-center gap-2 w-full">
                            <div
                                className="w-6 h-6 rounded border-2 border-gray-300"
                                style={{ backgroundColor: color || '#ffffff' }}
                            />
                            <span className="text-xs flex-1">{label}</span>
                            <span className="text-xs text-gray-500">{color || '#ffffff'}</span>
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="start">
                    <div className="space-y-3">
                        <div>
                            <Label className="text-xs mb-2 block">Color Picker</Label>
                            <div className="relative w-full h-32 rounded border overflow-hidden">
                                <input
                                    type="color"
                                    value={color || '#ffffff'}
                                    onChange={onChange}
                                    className="absolute inset-0 w-full h-full cursor-pointer"
                                    style={{ border: 'none' }}
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs mb-2 block">Hex Code</Label>
                            <Input
                                type="text"
                                value={color || '#ffffff'}
                                onChange={onHexChange}
                                placeholder="#000000"
                                className="h-8 text-sm font-mono"
                            />
                        </div>

                        <div>
                            <Label className="text-xs mb-2 block">Preset Colors</Label>
                            <div className="grid grid-cols-5 gap-2">
                                {presetColors.map((presetColor) => (
                                    <button
                                        key={presetColor}
                                        className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
                                        style={{ backgroundColor: presetColor }}
                                        onClick={() => {
                                            if (colorType === 'fill') {
                                                setFillColor(presetColor);
                                                updateObjectProperty('fill', presetColor);
                                            } else if (colorType === 'stroke') {
                                                setStrokeColor(presetColor);
                                                updateObjectProperty('stroke', presetColor);
                                            } else if (colorType === 'text') {
                                                setTextColor(presetColor);
                                                updateObjectProperty('fill', presetColor);
                                            } else if (colorType === 'textBg') {
                                                setTextBackgroundColor(presetColor);
                                                updateObjectProperty('backgroundColor', presetColor);
                                            }
                                        }}
                                        title={presetColor}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="pt-2 border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => activateEyedropper(colorType)}
                            >
                                <Pipette className="w-4 h-4 mr-2" />
                                Pick from Canvas
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    };

    // ✅ Image scale handler
    const handleImageScaleChange = (x: number, y: number) => {
        const active = canvas.getActiveObject();
        if (active) {
            active.scaleX = x;
            active.scaleY = y;
            setScaleX(x);
            setScaleY(y);
            canvas.renderAll();
        }
    };

    // ✅ Rotation
    const handleImageRotation = (angle: number) => {
        const active = canvas.getActiveObject();
        if (active) {
            active.rotate(angle);
            setRotation(angle);
            canvas.renderAll();
        }
    };

    // ✅ Image filter handler
    const handleImageFilterChange = (type: string, value: number) => {
        if (!canvas) return;

        const active = canvas.getActiveObject();
        if (!active || !(active instanceof fabric.Image)) {
            console.warn("Selected object is not an image");
            return;
        }

        const image = active as InstanceType<typeof fabric.Image>; // ✅ correct for Fabric 6

        if (!Array.isArray(image.filters)) image.filters = [];

        while (image.filters.length < 3) image.filters.push(null);

        switch (type) {
            case "brightness":
                image.filters[0] = new fabric.filters.Brightness({ brightness: value });
                setBrightness(value);
                break;

            case "contrast":
                image.filters[1] = new fabric.filters.Contrast({ contrast: value });
                setContrast(value);
                break;

            case "saturation":
                image.filters[2] = new fabric.filters.Saturation({ saturation: value });
                setSaturation(value);
                break;
        }

        image.applyFilters();
        canvas.requestRenderAll();
    };




    return (
        <>
            {/* Magnifier for eyedropper */}
            {isPickingColor && canvas && (
                <CanvasMagnifier
                    fabricCanvas={canvas}
                    htmlCanvas={canvas.getElement()}
                    zoom={5}
                    size={150}
                />
            )}
            {/* 🧭 Toggle Button */}
      <button
                onClick={togglePanel}
                className="fixed top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-all z-[9999]"
                style={{ 
                    overflow: "visible",
                    right: isCollapsed ? '0px' : '280px',
                    transition: 'right 0.3s ease-in-out'
                }}
            >
                <ChevronLeft
                    className={`w-5 h-5 text-gray-700 transition-transform duration-300 ${
                        isCollapsed ? "rotate-180" : ""
                    }`}
                />
            </button>



            {/* ⚡ Animated Properties Panel */}
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        key="properties-panel"
                        initial={{ x: 280, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 280, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="fixed right-0 top-[125px] bottom-0 bg-white border-l border-gray-200 z-10 flex flex-col overflow-hidden w-[280px]"
                    >


                      {/* Header */}
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  className="flex justify-between items-center p-3 border-b flex-shrink-0"
>
  <div className="flex items-center gap-2">
    <span className="font-medium">Properties</span>
    {isPickingColor && (
      <span className="text-xs text-blue-600 animate-pulse">
        Click canvas to pick
      </span>
    )}
  </div>

  {/* 🕹️ Undo / Redo Buttons */}
  {/* <div className="flex items-center gap-2">
    <Button
      onClick={handleUndo}
      variant="outline"
      size="icon"
      className="h-7 w-7"
      title="Undo (Ctrl+Z)"
    >
      <Undo2 className="w-4 h-4" />
    </Button>
    <Button
      onClick={handleRedo}
      variant="outline"
      size="icon"
      className="h-7 w-7"
      title="Redo (Ctrl+Y)"
    >
      <Redo2 className="w-4 h-4" />
    </Button>
  </div> */}
</motion.div>


                        {/* Scrollable content */}
                        <motion.div
                            ref={scrollContainerRef}
                            className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6"
                            onWheel={(e) => e.stopPropagation()}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.15, duration: 0.3 }}
                        >

                            <h3 className='text-sm font-medium'>Size & Position</h3>

                            {/* Width & Height */}
                            <div className='grid grid-cols-2 gap-3'>
                                <div className='space-y-1'>
                                    <Label className='text-sm'>Width</Label>
                                    <div className='h-9 px-3 py-2 border rounded-md flex items-center'>
                                        {width}
                                    </div>
                                </div>
                                <div className='space-y-1'>
                                    <Label className='text-sm'>Height</Label>
                                    <div className='h-9 px-3 py-2 border rounded-md flex items-center'>
                                        {height}
                                    </div>
                                </div>
                            </div>

                            {/* Opacity */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm">Opacity</Label>
                                    <div className="h-9 px-3 py-2 border rounded-md flex items-center">
                                        {opacity}%
                                    </div>
                                </div>
                                <Slider
                                    id="opacity"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={[opacity]}
                                    onValueChange={handleOpacityChange}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button onClick={handleFlipHorizontal} variant="outline" size="sm" className="h-8 text-xs">
                                    <FlipHorizontal className="w-4 h-4 mr-1" />
                                    Flip H
                                </Button>
                                <Button onClick={handleFlipVertical} variant="outline" size="sm" className="h-8 text-xs">
                                    <FlipVertical className="w-4 h-4 mr-1" />
                                    Flip V
                                </Button>
                            </div>

                            {/* Layer Position */}
                            <div className='space-y-4 pt-4 border-t'>
                                <h3 className='text-sm font-medium'>Layer Position</h3>
                                <div className='grid grid-cols-2 gap-2'>
                                    <Button onClick={handleBringToFront} variant="outline" size="sm" className="h-8 text-xs">
                                        <MoveUp className="w-4 h-4 mr-1" />
                                        <span>Bring to front</span>
                                    </Button>
                                    <Button onClick={handleSendToBack} variant="outline" size="sm" className="h-8 text-xs">
                                        <MoveDown className="w-4 h-4 mr-1" />
                                        <span>Send to back</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Duplicate and Delete */}
                            <div className='space-y-4 pt-4 border-t'>
                                <h3 className='text-sm font-medium'>Duplicate and Delete</h3>
                                <div className='grid grid-cols-2 gap-2'>
                                    <Button onClick={handleDuplicate} variant="default" size="sm" className="h-8 text-xs">
                                        <Copy className="w-4 h-4 mr-1" />
                                        <span>Duplicate</span>
                                    </Button>
                                    <Button onClick={handleDelete} variant="destructive" size="sm" className="h-8 text-xs">
                                        <Trash className="w-4 h-4 mr-1" />
                                        <span>Delete</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Shape Properties */}
                            {ObjectType === "shape" && (
                                <div className="space-y-4 border-t pt-4">
                                    <h3 className="text-sm font-semibold">Shape Properties</h3>

                                    {/* 🎨 Fill + Stroke Colors (in one row) */}
                                    <div className="space-y-3">
                                        <Label className="text-sm">Colors</Label>
                                        <div className="flex items-center justify-between gap-6">

                                            {/* Fill Color */}
                                            <div className="flex flex-col items-center space-y-1">
                                                <span className="text-xs text-gray-500">Fill</span>
                                                <div className="relative w-10 h-8 overflow-hidden rounded-md border">
                                                    <div
                                                        className="absolute inset-0"
                                                        style={{ backgroundColor: fillColor }}
                                                    />
                                                    <input
                                                        type="color"
                                                        value={fillColor}
                                                        onChange={handleFillColorChange}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>

                                            {/* Stroke Color */}
                                            <div className="flex flex-col items-center space-y-1">
                                                <span className="text-xs text-gray-500">Stroke</span>
                                                <div className="relative w-10 h-8 overflow-hidden rounded-md border">
                                                    <div
                                                        className="absolute inset-0"
                                                        style={{ backgroundColor: strokeColor }}
                                                    />
                                                    <input
                                                        type="color"
                                                        value={strokeColor}
                                                        onChange={handleStrokeColorChange}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Advanced Color Pickers */}
                                        <ColorPickerPopover
                                            color={fillColor}
                                            onChange={handleFillColorChange}
                                            onHexChange={handleFillColorHexChange}
                                            label="Advanced Fill"
                                            colorType="fill"
                                        />
                                        <ColorPickerPopover
                                            color={strokeColor}
                                            onChange={handleStrokeColorChange}
                                            onHexChange={handleStrokeColorHexChange}
                                            label="Advanced Stroke"
                                            colorType="stroke"
                                        />
                                    </div>

                                    {/* Stroke Settings */}
                                    <div className="space-y-3 border-t pt-4">
                                        <h4 className="text-sm font-medium">Stroke Settings</h4>

                                        {/* Stroke Width */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label className="text-sm">Stroke Width</Label>
                                                <span className="text-xs">{strokeWidth}px</span>
                                            </div>
                                            <Slider
                                                id="stroke-width"
                                                min={0}
                                                max={20}
                                                step={1}
                                                value={[strokeWidth]}
                                                onValueChange={handleStrokeWidthChange}
                                            />
                                        </div>

                                        {/* Stroke Style */}
                                        <div className="space-y-2">
                                            <Label className="text-sm">Stroke Style</Label>
                                            <select
                                                value={strokeDasharray}
                                                onChange={handleStrokeDasharrayChange}
                                                className="w-full h-9 px-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="solid">Solid</option>
                                                <option value="dashed">Dashed</option>
                                                <option value="dotted">Dotted</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Text Properties */}
                            {ObjectType === "text" && (
                                <div className="space-y-4 border-t pt-4">
                                    <h3 className="text-sm font-semibold">Text Properties</h3>

                                    {/* Text Content */}
                                    <div className="space-y-2">
                                        <Label htmlFor="text-content" className="text-sm">
                                            Text
                                        </Label>
                                        <textarea
                                            id="text-content"
                                            value={text}
                                            onChange={handleTextChange}
                                            className="h-20 w-full resize-none border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>

                                    <div className="space-y-6">
                                        {/* Font Size */}
                                        <div className="space-y-2">
                                            <Label htmlFor="font-size" className="text-sm">
                                                Font Size
                                            </Label>
                                            <input
                                                id="font-size"
                                                type="number"
                                                value={fontSize}
                                                onChange={handleFontSizeChange}
                                                className="w-20 h-9 px-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>

                                        {/* Font Family */}
                                        <div className="space-y-2">
                                            <Label htmlFor="font-family" className="text-sm">
                                                Font Family
                                            </Label>
                                            <select
                                                id="font-family"
                                                value={fontFamily}
                                                onChange={handleFontFamilyChange}
                                                className="w-full h-9 px-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                {fontFamilies.map((font) => (
                                                    <option key={font} value={font} style={{ fontFamily: font }}>
                                                        {font}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Font Style Buttons */}
                                        <div className="space-y-2">
                                            <Label className="text-sm">Style</Label>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant={fontWeight === "bold" ? "default" : "outline"}
                                                    size="icon"
                                                    onClick={handleToggleBold}
                                                    className="w-8 h-8"
                                                >
                                                    <Bold className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant={fontStyle === "italic" ? "default" : "outline"}
                                                    size="icon"
                                                    onClick={handleToggleItalic}
                                                    className="w-8 h-8"
                                                >
                                                    <Italic className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant={underline ? "default" : "outline"}
                                                    size="icon"
                                                    onClick={handleToggleUnderline}
                                                    className="w-8 h-8"
                                                >
                                                    <Underline className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Text & Background Colors - Simple Inputs */}
                                        <div className="space-y-2">
                                            <Label className="text-sm">Colors</Label>
                                            <div className="flex items-center justify-between gap-6">
                                                {/* Text Color */}
                                                <div className="flex flex-col items-center space-y-1">
                                                    <span className="text-xs text-gray-500">Text</span>
                                                    <div className="relative w-10 h-8 overflow-hidden rounded-md border">
                                                        <div
                                                            className="absolute inset-0"
                                                            style={{ backgroundColor: textColor }}
                                                        />
                                                        <input
                                                            id="text-color"
                                                            type="color"
                                                            value={textColor}
                                                            onChange={handleToggleTextColorChange}
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Background Color */}
                                                <div className="flex flex-col items-center space-y-1">
                                                    <span className="text-xs text-gray-500">BG</span>
                                                    <div className="relative w-10 h-8 overflow-hidden rounded-md border">
                                                        <div
                                                            className="absolute inset-0"
                                                            style={{ backgroundColor: textBackgroundColor || '#ffffff' }}
                                                        />
                                                        <input
                                                            id="text-bg-color"
                                                            type="color"
                                                            value={textBackgroundColor || '#ffffff'}
                                                            onChange={handleToggleTextbackgroundColorChange}
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Text Color Picker */}
                                        <div className="space-y-3">
                                            <Label className="text-sm">Advanced Color Picker</Label>
                                            <ColorPickerPopover
                                                color={textColor}
                                                onChange={handleTextColorChange}
                                                onHexChange={handleTextColorHexChange}
                                                label="Text Color"
                                                colorType="text"
                                            />

                                            <ColorPickerPopover
                                                color={textBackgroundColor}
                                                onChange={handleTextBackgroundColorChange}
                                                onHexChange={handleBgColorHexChange}
                                                label="Background Color"
                                                colorType="textBg"
                                            />
                                        </div>

                                        {/* Letter Spacing */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label htmlFor="letter-spacing" className="text-sm">
                                                    Letter Spacing
                                                </Label>
                                                <span className="text-xs">{letterSpacing}</span>
                                            </div>
                                            <Slider
                                                id="letter-spacing"
                                                min={-200}
                                                max={800}
                                                step={10}
                                                value={[letterSpacing]}
                                                onValueChange={(value) => handleLetterSpacingChange(value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Image Properties */}
                            {ObjectType === "image" && (
                                <div className="space-y-4 border-t pt-4">
                                    <h3 className="text-sm font-semibold">Image Properties</h3>



                                    {/* 🔄 Rotation */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-sm">Rotation</Label>
                                            <span className="text-xs">{rotation}°</span>
                                        </div>
                                        <Slider
                                            id="rotation"
                                            min={0}
                                            max={360}
                                            step={1}
                                            value={[rotation]}
                                            onValueChange={(value) => handleImageRotation(value[0])}
                                        />
                                    </div>



                                    {/* 🎨 Filters */}
                                    <div className="space-y-4 border-t pt-4">
                                        <h4 className="text-sm font-medium">Image Filters</h4>

                                        {/* Brightness */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label className="text-sm">Brightness</Label>
                                                <span className="text-xs">{brightness}</span>
                                            </div>
                                            <Slider
                                                id="brightness"
                                                min={-1}
                                                max={1}
                                                step={0.1}
                                                value={[brightness]}
                                                onValueChange={(value) => handleImageFilterChange("brightness", value[0])}
                                            />
                                        </div>

                                        {/* Contrast */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label className="text-sm">Contrast</Label>
                                                <span className="text-xs">{contrast}</span>
                                            </div>
                                            <Slider
                                                id="contrast"
                                                min={-1}
                                                max={1}
                                                step={0.1}
                                                value={[contrast]}
                                                onValueChange={(value) => handleImageFilterChange("contrast", value[0])}
                                            />
                                        </div>

                                        {/* Saturation */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between ">
                                                <Label className="text-sm">Saturation</Label>
                                                <span className="text-xs">{saturation}</span>
                                            </div>
                                            <Slider
                                                id="saturation"
                                                min={-1}
                                                max={1}
                                                step={0.1}
                                                value={[saturation]}
                                                onValueChange={(value) => handleImageFilterChange("saturation", value[0])}
                                            />
                                        </div>
                                    </div>


                                </div>
                            )}

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </>
    );
};

export default Properties;