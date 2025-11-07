import { useEditorStore } from '@/store/store'
import { Slider } from "@/components/ui/slider";
import React, { useEffect, useState } from 'react'
import { Label } from "@/components/ui/label";
import { Bold, Copy, FlipHorizontal, FlipVertical, Italic, MoveDown, MoveUp, Trash, Underline } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cloneSelectedObject, deleteSelectedObject } from '@/fabric/fabric-utils';
import { SelectTrigger, SelectValue, Value } from '@radix-ui/react-select';
import * as fabric from "fabric";

import { PaintBucket } from "lucide-react";
import { Input } from '@/components/ui/input';

const fontFamilies = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Courier New",
    "Tahoma",
    "Trebuchet MS",
    "Impact",
    "Comic Sans MS",

    // 🧩 Google & Modern Fonts
    "Inter",
    "Poppins",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Nunito",
    "Raleway",
    "Merriweather",
    "Playfair Display",
    "DM Sans",
    "Source Sans Pro",
    "Noto Sans",
    "Rubik",
    "Quicksand",

    // ✨ Decorative / Creative
    "Pacifico",
    "Dancing Script",
    "Great Vibes",
    "Bebas Neue",
    "Oswald",
    "Lobster",
    "Fredoka One",
    "Amatic SC",
    "Caveat",
    "Shadows Into Light",
   
];


const Properties: React.FC = () => {
    const { canvas } = useEditorStore();
    const [selectedObject, setSelectedObject] = useState<any>(null);
    const [ObjectType, setObjectType] = useState<any>('');

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

    const[fillColor, setFillColor] = useState('#ffffff');
    const[borderColor, setBorderColor] = useState('#000000');
    const[borderWidth, setBorderWidth] = useState(0);
    const[borderStyle, setBorderStyle] = useState('solid');

    const[filter, setFilter] = useState('none');
    const[blur, setBlur] = useState(0);

 


    useEffect(() => {
        if (!canvas) return;

        const handleSelectionCreated = () => {
            const active = canvas.getActiveObject();
            if (!active) return;

            // console.log(active.type, "activeObject type");
            setSelectedObject(active);

            // 🧩 Common properties
            setOpacity(Math.round(((active.opacity ?? 1) * 100)));
            setWidth(Math.round((active.width ?? 0) * (active.scaleX ?? 1)));
            setHeight(Math.round((active.height ?? 0) * (active.scaleY ?? 1)));

            // ✅ Type Narrowing for Text
            if (active.type === "i-text") {
                // Cast to IText type
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

        // Attach listeners
        canvas.on('selection:created', handleSelectionCreated);
        canvas.on('selection:updated', handleSelectionCreated);
        canvas.on('object:modified', handleSelectionCreated);
        canvas.on('selection:cleared', handleSelectionCleared);

        // Also check once when canvas changes
        handleSelectionCreated();

        return () => {
            canvas.off('selection:created', handleSelectionCreated);
            canvas.off('selection:updated', handleSelectionCreated);
            canvas.off('object:modified', handleSelectionCreated);
            canvas.off('selection:cleared', handleSelectionCleared);
        };
    }, [canvas]);

    // console.log('🧱 Selected Object:', selectedObject);

    const updateObjectProperty = (property, value) => {
        // console.log(property, value, "updateObjectProperty");

        if (!canvas || !selectedObject) return;
        selectedObject.set(property, value);
        canvas.renderAll();
    }

    // console.log(selectedObject, 'selectedObject');


    const handleOpacityChange = (value: number[]) => {
        const newValue = value[0];
        setOpacity(newValue);
        // console.log("Opacity:", newValue);
        updateObjectProperty('opcity', newValue / 100)
        // If you want to apply this to selected Fabric object:
        // if (selectedObject) {
        //   selectedObject.set("opacity", newValue / 100);
        //   canvas.renderAll();
        // }
    };

    // duplicate
    const handleDuplicate = async () => {
        if (!canvas || !selectedObject) return;
        await cloneSelectedObject(canvas)
    }

    // delete
    const handleDelete = async () => {
        if (!canvas || !selectedObject) return;
        deleteSelectedObject(canvas)
    }

    // arrangement
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

    //flip H and V
    const handleFlipHorizontal = async () => {
        if (!canvas || !selectedObject) return;
        const flipX = !selectedObject.flipX
        updateObjectProperty('flipX', flipX)

    }
    const handleFlipVertical = async () => {
        if (!canvas || !selectedObject) return;
        const flipY = !selectedObject.flipY
        updateObjectProperty('flipY', flipY)
    }


    const handleTextChange = (event) => {
        const nextText = event.target.value;
        setText(nextText)
        updateObjectProperty('text', nextText);
    }

    const handleFontSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setFontSize(newSize);
        updateObjectProperty('fontSize', newSize);
    }


   // FONT FAMILY
const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFontFamily(value);
    updateObjectProperty('fontFamily', value);
};

// BOLD
const handleToggleBold = () => {
    if (!selectedObject) return;
    const newWeight = fontWeight === 'bold' ? 'normal' : 'bold';
    setFontWeight(newWeight);
    updateObjectProperty('fontWeight', newWeight);
};

// ITALIC
const handleToggleItalic = () => {
    if (!selectedObject) return;
    const newStyle = fontStyle === 'italic' ? 'normal' : 'italic';
    setFontStyle(newStyle);
    updateObjectProperty('fontStyle', newStyle);
};

// UNDERLINE
const handleToggleUnderline = () => {
    if (!selectedObject) return;
    const newUnderline = !underline;
    setUnderline(newUnderline);
    updateObjectProperty('underline', newUnderline);
};

// TEXT COLOR
const handleToggleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setTextColor(color);
    updateObjectProperty('fill', color); // Fabric uses 'fill' for text color
};

// BACKGROUND COLOR
const handleToggleTextbackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setTextBackgroundColor(color);
    updateObjectProperty('backgroundColor', color); // Fabric uses 'backgroundColor' for text background
};

// LETTER SPACING
const handleLetterSpacingChange = (value: number[]) => {
    const spacing = value[0];
    setLetterSpacing(spacing);
    if (!selectedObject) return;
    selectedObject.set('charSpacing', spacing); // Fabric uses charSpacing in 1/1000 em units
    canvas.renderAll();
};



    return (
        <div className="fixed right-0 top-[125px] bottom-0 w-[280px] bg-white border-l border-gray-200 z-10 flex flex-col">
            <div className="flex justify-between items-center p-3 border-b flex-shrink-0">
                <span className="font-medium">Properties</span>
            </div>
            {/* <div className="flex-1 overflow-y-auto p-3">
        {selectedObject ? (
          <>
            <p className="text-gray-600 text-sm mb-2">
              Selected: <span className="font-medium">{selectedObject.type}</span>
            </p>
            {selectedObject.text && (
              <div>
                <label className="text-sm text-gray-500">Text:</label>
                <input
                  type="text"
                  value={selectedObject.text}
                  onChange={(e) => {
                    selectedObject.set("text", e.target.value);
                    canvas.renderAll();
                    setSelectedObject({ ...selectedObject }); // 🔁 Force re-render
                  }}
                  className="w-full border rounded px-2 py-1 text-sm mt-1"
                />
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-sm">
            Select an element to see its properties.
          </p>
        )}
      </div> */}

            <div className='h-[calc(100%-96px)] overflow-auto p-4 space-y-6'>
                <h3 className='text-sm font-medium'>Size & Position </h3>

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
                <div className='space-y-4 pt-4 border-t'>
                    <h3 className='text-sm font-medium'>Layer Position</h3>
                    <div className='grid grid-cols-2 gap-2'>
                        <Button onClick={handleBringToFront} variant="outline" size="sm" className="h-8 text-xs">
                            <MoveUp className="w-4 h-4 mr-1" />
                            <span>Bring to front</span>
                        </Button>
                        <Button onClick={handleSendToBack} variant="outline" size="sm" className="h-8 text-xs">
                            <MoveDown className="w-4 h-4 mr-1" />
                            <span>Sent to back</span>
                        </Button>
                    </div>
                </div>

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

                        {/* 📝 Text Content */}
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
                            {/* 🔠 Font Size */}
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

                            {/* 🔤 Font Family */}
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


                            {/* ✍️ Font Style Buttons */}
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

                            {/* 🎨 Text & Background Colors */}
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
                                                style={{ backgroundColor: textBackgroundColor }}
                                            />
                                            <input
                                                id="text-bg-color"
                                                type="color"
                                                value={textBackgroundColor}
                                                onChange={handleToggleTextbackgroundColorChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* 🔡 Letter Spacing */}
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

















