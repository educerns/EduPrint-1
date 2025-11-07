import { useEditorStore } from '@/store/store'
import { Slider } from "@/components/ui/slider";
import React, { useEffect, useState } from 'react'
import { Label } from "@/components/ui/label";
import { FlipHorizontal, FlipVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";


const Properties: React.FC = () => {
    const { canvas } = useEditorStore();
    const [selectedObject, setSelectedObject] = useState<any>(null);
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



    useEffect(() => {
        if (!canvas) return;

        const handleSelectionCreated = () => {
            const active = canvas.getActiveObject();
            //   setSelectedObject(active || null);
            if (active) {
                setSelectedObject(active);

                // update common properties
                setOpacity(Math.round(active.opacity * 100) || 100);
                setWidth(Math.round(active.width * active.scaleX));
                setHeight(Math.round(active.height * active.scaleY))
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

    console.log('🧱 Selected Object:', selectedObject);

    const updateObjectProperty = (property, value) => {
        console.log(property, value, "updateObjectProperty");

        if (!canvas || !selectedObject) return;
        selectedObject.set(property, value);
        canvas.renderAll();
    }

    console.log(selectedObject, 'selectedObject');


    const handleOpacityChange = (value: number[]) => {
        const newValue = value[0];
        setOpacity(newValue);
        console.log("Opacity:", newValue);
        updateObjectProperty('opcity', newValue / 100)
        // If you want to apply this to selected Fabric object:
        // if (selectedObject) {
        //   selectedObject.set("opacity", newValue / 100);
        //   canvas.renderAll();
        // }
    };

    const handleTextChange = (e) => {

    }

    const handleFontSizeChange = (e) => {

    }


    const handleFonFamilyChange = (e) => {

    }


    const handleToggleItalic = (e) => {

    }


    const handleToggleUnderline = (e) => {
    }

    const handleToggleTextColorChange = (e) => {
    }

    const handleToggleTextbackgroundColorChange = (e) => {
    }

    const handleLetterSpacingChange = (e) => {
    }


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
            <Button variant="outline" size="sm" className="h-8 text-xs">
                <FlipHorizontal className="w-4 h-4 mr-1" />
                Flip H
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
                <FlipVertical className="w-4 h-4 mr-1" />
                Flip V
            </Button>
            </div>

            {/* <div className='space-y-4 pt-4 border-t'>
                <h3 className='text-sm font-medium'>Layer Position</h3>
                <div>

                </div>
            </div> */}

            </div>
        </div>
    );
};

export default Properties;

















