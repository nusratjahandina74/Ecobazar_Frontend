import { useEffect, useState } from "react";
import { ProductImage } from "./ProductCard";

export default function ProductImageGallery({ images = [], title = "Product" }) {
    const [active, setActive] = useState("");

    useEffect(() => {
        setActive(images.find((i) => i.isMain)?.url || images[0]?.url || "");
    }, [images]);

    return (
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 min-w-0 max-w-full">
            {images.length > 1 && (
                <div className="flex sm:flex-col gap-3 shrink-0 max-w-full overflow-x-auto sm:overflow-x-visible sm:overflow-y-auto sm:max-h-[32rem] pb-1 sm:pb-0 overscroll-contain">
                    {images.map((img, i) => (
                        <button
                            key={img.url}
                            onClick={() => setActive(img.url)}
                            aria-label={`Show image ${i + 1}`}
                            className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${active === img.url ? "border-leaf" : "border-transparent "}`}
                        >
                            <img src={img.url} alt={`${title} view ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-1 min-w-0 aspect-square rounded-xl overflow-hidden bg-mint">
                <ProductImage src={active} alt={title} className="w-full h-full object-cover" />
            </div>
        </div>
    );
}
