import { useState, useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check, RotateCw, LayoutTemplate } from 'lucide-react';

const ASPECT_RATIOS = [
    { value: 1 / 1, label: 'Square' },
    { value: 4 / 3, label: '4:3' },
    { value: 16 / 9, label: '16:9' },
    { value: 2 / 3, label: '2:3' },
    { value: undefined, label: 'Free' },
];

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

const ImageCropper = ({ image, onCrop, onClose }) => {
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [aspect, setAspect] = useState(undefined);
    const [rotation, setRotation] = useState(0);
    const imgRef = useRef(null);

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        if (aspect) {
            setCrop(centerAspectCrop(width, height, aspect));
        } else {
            // Default to full image crop
            setCrop({
                unit: '%',
                width: 100,
                height: 100,
                x: 0,
                y: 0
            });
        }
    }

    useEffect(() => {
        if (imgRef.current) {
            const { width, height } = imgRef.current;
            if (aspect) {
                setCrop(centerAspectCrop(width, height, aspect));
            }
        }
    }, [aspect]);

    const getCroppedImg = async (image, crop, rotation = 0) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const pixelRatio = window.devicePixelRatio;

        const maxSize = Math.max(image.width, image.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        // set each dimensions to double largest dimension to allow for a safe area for the
        // image to rotate in without being clipped by canvas context
        canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
        canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = 'high';

        const cropX = crop.x * scaleX;
        const cropY = crop.y * scaleY;

        const rotateRads = (rotation * Math.PI) / 180;
        const centerX = image.naturalWidth / 2;
        const centerY = image.naturalHeight / 2;

        ctx.save();

        // 5) Move the crop origin to the canvas origin (0,0)
        ctx.translate(-cropX, -cropY);
        // 4) Move the origin to the center of the original position
        ctx.translate(centerX, centerY);
        // 3) Rotate around the origin
        ctx.rotate(rotateRads);
        // 2) Scale the image
        ctx.scale(1, 1);
        // 1) Move the center of the image to the origin (0,0)
        ctx.translate(-centerX, -centerY);

        ctx.drawImage(
            image,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
        );

        ctx.restore();

        return new Promise((resolve, reject) => {
            canvas.toBlob((file) => {
                if (file) {
                    resolve(file);
                } else {
                    reject(new Error('Canvas is empty'));
                }
            }, 'image/jpeg', 0.95);
        });
    };

    const handleSave = async () => {
        if (!completedCrop || !imgRef.current) {
            return;
        }

        try {
            const croppedImage = await getCroppedImg(imgRef.current, completedCrop, rotation);
            onCrop(croppedImage);
        } catch (e) {
            console.error('Crop error:', e);
            alert('Failed to crop image.');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl w-full max-w-4xl flex flex-col h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white z-10">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <LayoutTemplate size={20} className="text-primary" />
                        Crop & Edit Image
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Main Cropper Area */}
                <div className="relative flex-1 bg-gray-900 flex items-center justify-center overflow-hidden">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        style={{ maxHeight: '100%' }}
                    >
                        <img
                            ref={imgRef}
                            alt="Crop me"
                            src={image}
                            style={{ transform: `rotate(${rotation}deg)`, maxHeight: '75vh', maxWidth: '100%' }}
                            onLoad={onImageLoad}
                        />
                    </ReactCrop>
                </div>

                {/* Controls */}
                <div className="p-6 border-t border-gray-200 bg-white z-10 flex flex-col gap-6">

                    {/* Top Row: Aspect Ratio & Rotation */}
                    <div className="flex flex-col md:flex-row gap-6 justify-between">

                        {/* Aspect Ratio */}
                        <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                Aspect Ratio
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {ASPECT_RATIOS.map((ratio) => (
                                    <button
                                        key={ratio.label}
                                        onClick={() => setAspect(ratio.value)}
                                        className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${aspect === ratio.value
                                            ? 'bg-primary text-white border-primary shadow-sm'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
                                            }`}
                                    >
                                        {ratio.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Rotation */}
                        <div className="flex-1 max-w-xs">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block flex justify-between">
                                <span>Rotation</span>
                                <span>{rotation}°</span>
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setRotation(r => Math.max(r - 90, 0))}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <RotateCw size={16} className="-scale-x-100" />
                                </button>
                                <input
                                    type="range"
                                    value={rotation}
                                    min={0}
                                    max={360}
                                    step={90}
                                    onChange={(e) => setRotation(Number(e.target.value))}
                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <button
                                    onClick={() => setRotation(r => Math.min(r + 90, 360))}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <RotateCw size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => {
                                setAspect(undefined);
                                setCrop({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
                            }}
                            className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95"
                        >
                            <Check size={18} />
                            Apply Crop
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
