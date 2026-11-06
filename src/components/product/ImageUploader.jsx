import { useRef } from "react";
import { ImagePlus, X, Star } from "../common/Icons";

// images: array of { file?, url?, preview?, isMain }
export default function ImageUploader({ images, onChange }) {
    const inputRef = useRef();

    const handleFiles = (fileList) => {
        const files = Array.from(fileList).slice(0, 5 - images.length);
        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            isMain: images.length === 0 && files.indexOf(file) === 0, // first upload defaults to main
        }));
        onChange([...images, ...newImages].slice(0, 5));
    };

    const removeImage = (index) => {
        const wasMain = images[index]?.isMain;
        let next = images.filter((_, i) => i !== index);
        if (wasMain && next.length > 0) next[0] = { ...next[0], isMain: true };
        onChange(next);
    };

    const setMain = (index) => {
        onChange(images.map((img, i) => ({ ...img, isMain: i === index })));
    };

    return (
        <div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-ink/10 group">
                        <img src={img.preview || img.url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />

                        <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-ink/70 text-paper flex items-center justify-center
                opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={13} />
                        </button>

                        <button
                            type="button"
                            onClick={() => setMain(i)}
                            className={`absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full transition-colors ${img.isMain
                                    ? "bg-amber text-ink"
                                    : "bg-ink/60 text-paper opacity-0 group-hover:opacity-100"
                                }`}
                        >
                            <Star size={10} fill={img.isMain ? "currentColor" : "none"} />
                            {img.isMain ? "Main" : "Set main"}
                        </button>
                    </div>
                ))}

                {images.length < 5 && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-ink/15 flex flex-col items-center justify-center
              gap-1.5 text-ink/40 hover:border-amber hover:text-amber transition-colors"
                    >
                        <ImagePlus size={20} />
                        <span className="text-xs font-medium">Add image</span>
                    </button>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
            />

            <p className="text-xs text-slate/60 mt-2">
                Up to 5 images. Click the star to set the main product image.
            </p>
        </div>
    );
};