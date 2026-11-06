// One place that converts backend documents into the shape the UI uses.
import { resolveAssetUrl } from "../api/axiosInstance";

export function normalizeProduct(p) {
    if (!p) return null;
    const price = Number(p.price) || 0;
    const discountPrice = Number(p.discountPrice) || 0;
    const hasDiscount = discountPrice > 0 && discountPrice < price;
    const salePrice = hasDiscount ? discountPrice : price;
    const images = (p.images || [])
        .filter((img) => img && img.url)
        .map((img) => ({ url: resolveAssetUrl(img.url), rawUrl: img.url, isMain: !!img.isMain }));
    const mainImage = images.find((i) => i.isMain)?.url || images[0]?.url || "";
    return {
        _id: p._id,
        title: p.title || "Untitled product",
        sku: p.sku || "",
        description: p.description || "",
        shortDescription: p.shortDescription || "",
        price,
        discountPrice,
        salePrice,
        discountPercent: hasDiscount ? Math.round((1 - salePrice / price) * 100) : 0,
        hasDiscount,
        stock: Number(p.stock) || 0,
        category: p.category || "",
        subCategory: p.subCategory || "",
        tags: Array.isArray(p.tag) ? p.tag : [],
        additionalInformation: p.additionalInfo || "",
        status: p.status || "pending",
        variants: (p.variants || []).filter((v) => v.isActive !== false).map((v) => {
            const vp = Number(v.price) || price;
            const vd = Number(v.discountPrice) || 0;
            const sale = vd > 0 && vd < vp ? vd : vp;
            return { _id: v._id, label: v.label || [v.color, v.size].filter(Boolean).join(" / "), size: v.size, color: v.color, stock: Number(v.stock) || 0, price: vp, salePrice: sale, hasDiscount: sale < vp };
        }),
        images,
        mainImage,
        isFeatured: !!p.isFeatured,
        soldCount: Number(p.soldCount) || 0,
        ratingAvg: Number(p.ratingAvg) || 0,
        ratingCount: Number(p.ratingCount) || 0,
        createdAt: p.createdAt,
    };
}

export function normalizeCartItem(row) {
    const product = row.product && typeof row.product === "object" ? normalizeProduct(row.product) : null;
    const price = Number(row.price) || product?.salePrice || 0;
    return {
        cartId: row._id, // cart-row id — used by /incredecrecart/:id and /deletecart/:id
        productId: product?._id || row.product,
        variantId: row.variantId || null,
        variantLabel: row.variantId && product ? (product.variants.find((v) => v._id === row.variantId)?.label || "") : "",
        title: product?.title || "Product unavailable",
        image: product?.mainImage || "",
        stock: row.variantId && product ? (product.variants.find((v) => v._id === row.variantId)?.stock ?? 0) : (product?.stock ?? 0),
        price,
        quantity: Number(row.quantity) || 1,
        available: !!product,
    };
}

export function normalizeUser(u) {
    if (!u) return null;
    const first = u.firstName || "";
    const last = u.lastName || "";
    const full = `${first} ${last}`.trim();
    return {
        _id: u._id || u.id,
        email: u.email || "",
        firstName: first,
        lastName: last,
        name: full || (u.email ? u.email.split("@")[0] : "User"),
        phoneNumber: u.phoneNumber || "",
        role: u.role || "user",
        isVerified: !!u.isVerified,
        isHold: !!u.isHold,
        profile: u.profile || "",
        billingAdress: u.billingAdress || {},
        createdAt: u.createdAt,
    };
}

export function normalizeOrder(o) {
    const customer = o.user && typeof o.user === "object" ? normalizeUser(o.user) : null;
    return {
        _id: o._id,
        transactionId: o.transactionId,
        items: (o.products || []).map((p) => ({
            productId: p.productId,
            title: p.title,
            variantLabel: p.variantLabel || "",
            sku: p.sku,
            price: p.price,
            quantity: p.quantity,
            totalPrice: p.totalPrice,
        })),
        orderNumber: o.orderNumber || "",
        subtotal: o.subtotal ?? o.totalAmount,
        deliveryCharge: o.deliveryCharge ?? 0,
        deliveryZone: o.deliveryZone || "",
        paymentMethod: o.paymentMethod || "online",
        courier: o.courier || null,
        totalAmount: o.totalAmount,
        currency: o.currency || "BDT",
        paymentStatus: o.paymentStatus,
        orderStatus: o.orderStatus,
        shippingAddress: o.shippingAddress || {},
        customer,
        createdAt: o.createdAt,
    };
}

export const formatBDT = (n) => `৳${(Number(n) || 0).toLocaleString("en-BD")}`;

export const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
