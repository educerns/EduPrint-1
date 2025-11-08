import { useEditorStore } from '@/store/store'
import { Slider } from "@/components/ui/slider";
import React, { useEffect, useState, useRef } from 'react'
import { Label } from "@/components/ui/label";
import { Bold, Copy, FlipHorizontal, FlipVertical, Italic, MoveDown, MoveUp, Trash, Underline, Pipette } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cloneSelectedObject, deleteSelectedObject } from '@/fabric/fabric-utils';
import * as fabric from "fabric";
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const fontFamilies = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana",
    "Courier New", "Tahoma", "Trebuchet MS", "Impact", "Comic Sans MS",
    "Inter", "Poppins", "Roboto", "Open Sans", "Lato", "Montserrat",
    "Nunito", "Raleway", "Merriweather", "Playfair Display", "DM Sans",
    "Source Sans Pro", "Noto Sans", "Rubik", "Quicksand", "Pacifico",
    "Dancing Script", "Great Vibes", "Bebas Neue", "Oswald", "Lobster",
    "Fredoka One", "Amatic SC", "Caveat", "Shadows Into Light",
];

// Preset colors
const presetColors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
    "#FFC0CB", "#A52A2A", "#808080", "#FFD700", "#4B0082",
    "#E6E6FA", "#90EE90", "#FFB6C1", "#20B2AA", "#87CEEB",
];

const Properties: React.FC = () => {
    const { canvas } = useEditorStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [selectedObject, setSelectedObject] = useState<any>(null);
    const [ObjectType, setObjectType] = useState<any>('');

    // Eyedropper state
    const [isPickingColor, setIsPickingColor] = useState(false);
    const [pickingForBackground, setPickingForBackground] = useState(false);

    //common
    const [opacity, setOpacity] = useState(100);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    // text
    const [text, setText] = useState('');
    const [fontSize, setFontSize] = useState(24);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [fontWeight, setFontWeight] = useState('normal');
    const [fontStyle, setFontStyle] = useState('normal');
    const [underline, setUnderline] = useState(false);
    const [textColor, setTextColor] = useState('#000000');
    const [textBackgroundColor, setTextBackgroundColor] = useState('');
    const [letterSpacing, setLetterSpacing] = useState(0);

    const [fillColor, setFillColor] = useState('#ffffff');
    const [borderColor, setBorderColor] = useState('#000000');
    const [borderWidth, setBorderWidth] = useState(0);
    const [borderStyle, setBorderStyle] = useState('solid');
    const [filter, setFilter] = useState('none');
    const [blur, setBlur] = useState(0);

    // Eyedropper functionality
    const pickColorFromCanvas = (x: number, y: number) => {
        if (!canvas) return null;

        const ctx = canvas.getContext();
        const imageData = ctx.getImageData(x, y, 1, 1);
        const pixel = imageData.data;

        const r = pixel[0];
        const g = pixel[1];
        const b = pixel[2];
        const a = pixel[3] / 255;

        // Convert to hex
        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

        return { hex, rgba: `rgba(${r}, ${g}, ${b}, ${a})` };
    };

    const handleCanvasClick = (e: fabric.TEvent) => {
        if (!isPickingColor || !canvas) return;

        const pointer = canvas.getPointer(e.e as MouseEvent);
        const color = pickColorFromCanvas(pointer.x, pointer.y);

        if (color) {
            if (pickingForBackground) {
                setTextBackgroundColor(color.hex);
                updateObjectProperty('backgroundColor', color.hex);
            } else {
                setTextColor(color.hex);
                updateObjectProperty('fill', color.hex);
            }
        }

        // Reset picker state
        setIsPickingColor(false);
        setPickingForBackground(false);
        canvas.defaultCursor = 'default';
        canvas.renderAll();
    };

    const activateEyedropper = (forBackground: boolean = false) => {
        if (!canvas) return;

        setIsPickingColor(true);
        setPickingForBackground(forBackground);
        canvas.defaultCursor = 'crosshair';
        canvas.renderAll();
    };

    // Setup eyedropper click listener
    useEffect(() => {
        if (!canvas) return;

        if (isPickingColor) {
            canvas.on('mouse:down', handleCanvasClick);
            
            // Cancel on ESC key
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape' && isPickingColor) {
                    setIsPickingColor(false);
                    setPickingForBackground(false);
                    canvas.defaultCursor = 'default';
                    canvas.renderAll();
                }
            };

            window.addEventListener('keydown', handleKeyDown);

            return () => {
                canvas.off('mouse:down', handleCanvasClick);
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [canvas, isPickingColor, pickingForBackground]);

    // Prevent scroll propagation
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

            // Type Narrowing for Text
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
            } else {
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

        handleSelectionCreated();

        return () => {
            canvas.off('selection:created', handleSelectionCreated);
            canvas.off('selection:updated', handleSelectionCreated);
            canvas.off('object:modified', handleSelectionCreated);
            canvas.off('selection:cleared', handleSelectionCleared);
        };
    }, [canvas]);

    const updateObjectProperty = (property, value) => {
        if (!canvas || !selectedObject) return;
        selectedObject.set(property, value);
        canvas.renderAll();
    }

    const handleOpacityChange = (value: number[]) => {
        const newValue = value[0];
        setOpacity(newValue);
        updateObjectProperty('opacity', newValue / 100);
    };

    const handleDuplicate = async () => {
        if (!canvas || !selectedObject) return;
        await cloneSelectedObject(canvas);
    }

    const handleDelete = async () => {
        if (!canvas || !selectedObject) return;
        deleteSelectedObject(canvas);
    }

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

    const handleFlipHorizontal = async () => {
        if (!canvas || !selectedObject) return;
        const flipX = !selectedObject.flipX;
        updateObjectProperty('flipX', flipX);
    }

    const handleFlipVertical = async () => {
        if (!canvas || !selectedObject) return;
        const flipY = !selectedObject.flipY;
        updateObjectProperty('flipY', flipY);
    }

    const handleTextChange = (event) => {
        const nextText = event.target.value;
        setText(nextText);
        updateObjectProperty('text', nextText);
    }

    const handleFontSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setFontSize(newSize);
        updateObjectProperty('fontSize', newSize);
    }

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

    const handleToggleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setTextColor(color);
        updateObjectProperty('fill', color);
    };

    const handleTextColorHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        // Add # if not present
        if (!value.startsWith('#')) {
            value = '#' + value;
        }
        setTextColor(value);
        updateObjectProperty('fill', value);
    };

    const handleToggleTextbackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setTextBackgroundColor(color);
        updateObjectProperty('backgroundColor', color);
    };

    const handleBgColorHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        // Add # if not present
        if (!value.startsWith('#')) {
            value = '#' + value;
        }
        setTextBackgroundColor(value);
        updateObjectProperty('backgroundColor', value);
    };

    const handleLetterSpacingChange = (value: number[]) => {
        const spacing = value[0];
        setLetterSpacing(spacing);
        if (!selectedObject) return;
        selectedObject.set('charSpacing', spacing);
        canvas.renderAll();
    };

    const ColorPickerPopover = ({ 
        color, 
        onChange, 
        onHexChange, 
        label,
        isBackground = false 
    }: { 
        color: string; 
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        onHexChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        label: string;
        isBackground?: boolean;
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
                                            if (isBackground) {
                                                setTextBackgroundColor(presetColor);
                                                updateObjectProperty('backgroundColor', presetColor);
                                            } else {
                                                setTextColor(presetColor);
                                                updateObjectProperty('fill', presetColor);
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
                                onClick={() => activateEyedropper(isBackground)}
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

    return (
        <div className="fixed right-0 top-[125px] bottom-0 w-[280px] bg-white border-l border-gray-200 z-10 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b flex-shrink-0">
                <span className="font-medium">Properties</span>
                {isPickingColor && (
                    <span className="text-xs text-blue-600 animate-pulse">
                        Click canvas to pick
                    </span>
                )}
            </div>

            <div 
                ref={scrollContainerRef}
                className='flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6'
                onWheel={(e) => e.stopPropagation()}
            >
                <h3 className='text-sm font-medium'>Size & Position</h3>

                {/* width & height */}
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

                {/* opacity */}
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

                {/* <div className='space-y-4 pt-4 border-t'>
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
                </div> */}

                {/* duplicate delete */}
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

                {/* text properties */}
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

                            {/* Advanced Color Pickers */}
                            <div className="space-y-3">
                                <Label className="text-sm">Advanced Color Picker</Label>
                                
                                {/* Text Color Picker */}
                                <ColorPickerPopover
                                    color={textColor}
                                    onChange={handleToggleTextColorChange}
                                    onHexChange={handleTextColorHexChange}
                                    label="Text Color"
                                    isBackground={false}
                                />

                                {/* Background Color Picker */}
                                <ColorPickerPopover
                                    color={textBackgroundColor}
                                    onChange={handleToggleTextbackgroundColorChange}
                                    onHexChange={handleBgColorHexChange}
                                    label="Background Color"
                                    isBackground={true}
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
            </div>
        </div>
    );
};

export default Properties;