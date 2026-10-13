import { useRef } from "react";
import { ImagePlus, X, Star } from "../common/Icons";

const MAX = 5;
export default function ImageUploader({ existing = [], added = [], mainKey, onSetMain, onRemoveExisting, onRemoveAdded, onAddFiles, error }) {
    const inputRef = useRef();
    const total = existing.length + added.length;

    const handlePick = (e) => {
        const files = Array.from(e.target.files || []).slice(0, MAX - total);
        if (files.length) onAddFiles(files);
        e.target.value = "";
    };

    const tile = "relative aspect-square rounded-lg overflow-hidden border-2 group transition-colors";
    const iconBtn = "w-7 h-7 rounded-full flex items-center justify-center bg-forest/80 text-white transition hover:bg-leaf";

    const renderTile = (key, src, alt, onRemove) => {
        const isMain = key === mainKey;
        return (
            <div key={key} className={`${tile} ${isMain ? "border-leaf" : "border-forest/10 hover:border-leaf/50"}`}>
                <img src={src} alt={alt} className="w-full h-full object-cover" />

                {isMain ? (
                    <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-leaf text-white">
                        <Star size={10} fill="white" /> Main
                    </span>
                ) : (
                    <button
                        type="button"
                        onClick={() => onSetMain(key)}
                        className="absolute bottom-1.5 left-1.5 text-[10px] font-semibold px-2 py-1 rounded-full bg-white/95 text-leaf-dark border border-leaf/30 hover:bg-leaf hover:text-white transition-colors"
                    >
                        Make main
                    </button>
                )}

                <button type="button" onClick={onRemove} aria-label={`Remove ${alt}`} className={`absolute top-1.5 right-1.5 ${iconBtn} hover:!bg-red-600`}>
                    <X size={13} />
                </button>
            </div>
        );
    };

    return (
        <div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {existing.map((img, i) => renderTile(img.rawUrl, img.url, `current image ${i + 1}`, () => onRemoveExisting(img)))}
                {added.map((img, i) => renderTile(img.preview, img.preview, `new image ${i + 1}`, () => onRemoveAdded(i)))}

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
            <p className="text-xs text-slate mt-2">Up to {MAX} images (JPG, PNG, WEBP, GIF · max 5 MB each). Click "Make main" on the image that should be shown first in the store.</p>
            {error && <p role="alert" className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}
