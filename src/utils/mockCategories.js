import {
    ShoppingBasket, Shirt, HomeIcon, Sparkles, HeartPulse,
    Smartphone, Gamepad2, BookOpen, Gem, PawPrint,
    OrganicIcon, RecyclingIcon // Custom Eco Icons Imported
} from "../components/common/Icons";

export const categories = [
    {
        name: "Organic Groceries",
        icon: ShoppingBasket,
        subcategories: ["Fresh Produce", "Organic Grains", "Herbal Teas", "Eco Snacks"],
    },
    {
        name: "Eco Home & Living",
        icon: HomeIcon,
        subcategories: ["Bamboo Furniture", "Solar Gadgets", "Biodegradable Cleaners", "Clay Cookware"],
    },
    {
        name: "Natural Beauty",
        icon: Sparkles,
        subcategories: ["Organic Skincare", "Vegan Makeup", "Cruelty-Free Haircare", "Essential Oils"],
    },
    {
        name: "Health & Wellness",
        icon: HeartPulse,
        subcategories: ["Herbal Supplements", "Eco Fitness Gear", "Natural Remedies", "Aromatherapy"],
    },
    {
        name: "Eco-Friendly Toys",
        icon: Gamepad2,
        subcategories: ["Wooden Toys", "Organic Plushies", "Educational Kits", "Recycled Games"],
    },
    {
        name: "Eco Stationary & Books",
        icon: BookOpen,
        subcategories: ["Recycled Notebooks", "Eco Journals", "Green Living Books", "Plantable Pens"],
    },
    {
        name: "Sustainable Accessories",
        icon: Gem,
        subcategories: ["Handmade Jewelry", "Wooden Watches", "Upcycled Wallets", "Jute Craft"],
    },
];
