import { useRef } from "react";
import { ImagePlus, X } from "../common/Icons";

const MAX = 5;

// existing: images already on the product [{ url, rawUrl, isMain }]  (can be removed -> sent as removeImages)
// added:    newly chosen files            [{ file, preview }]
export default function ImageUploader({ existing = [], added = [], onRemoveExisting, onRemoveAdded, onAddFiles, error }) {
    const inputRef = useRef();
    const total = existing.length + added.length;

    const handlePick = (e) => {
        const files = Array.from(e.target.files || []).slice(0, MAX - total);
        if (files.length) onAddFiles(files);
        e.target.value = "";
    };

    const tile = "relative aspect-square rounded-lg overflow-hidden border border-forest/10 group";
    const removeBtn = "absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-forest/80 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-600 transition";

    return (
        <div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {existing.map((img, i) => (
                    <div key={img.rawUrl} className={tile}>
                        <img src={img.url} alt={`Current product image ${i + 1}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => onRemoveExisting(img)} aria-label={`Remove image ${i + 1}`} className={removeBtn}><X size={13} /></button>
                        {i === 0 && added.length >= 0 && <span className="absolute bottom-1.5 left-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-leaf text-white">Main</span>}
                    </div>
                ))}
                {added.map((img, i) => (
                    <div key={img.preview} className={tile}>
                        <img src={img.preview} alt={`New image ${i + 1}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => onRemoveAdded(i)} aria-label={`Remove new image ${i + 1}`} className={removeBtn}><X size={13} /></button>
                        {existing.length === 0 && i === 0 && <span className="absolute bottom-1.5 left-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-leaf text-white">Main</span>}
                    </div>
                ))}

                {total < MAX && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-forest/20 flex flex-col items-center justify-center gap-1.5 text-forest/50 hover:border-leaf hover:text-leaf hover:bg-mint transition-colors"
                    >
                        <ImagePlus size={20} />
                        <span className="text-xs font-medium">Add image</span>
                    </button>
                )}
            </div>

            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={handlePick} aria-label="Upload product images" />
            <p className="text-xs text-slate mt-2">Up to {MAX} images (JPG, PNG, WEBP, GIF · max 5 MB each). The first image is the main image.</p>
            {error && <p role="alert" className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}
