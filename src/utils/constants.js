export const ROLES = { USER: "user", ADMIN: "admin", EDITOR: "editor", VENDOR: "vendor", MANAGER: "manager", STAFF: "staff" };
export const ANY_ACCOUNT = Object.values(ROLES);
export const ADMIN_PANEL_ROLES = [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF, ROLES.EDITOR, ROLES.VENDOR];
export const ADMIN_URL = (import.meta.env.VITE_ADMIN_URL || "https://ecobazar-dashboard-admin.vercel.app").replace(/\/+$/, "");
export const ADMIN_LOGIN_URL = `${ADMIN_URL}/login`;
export const ADMIN_ONLY = [ROLES.ADMIN];
export const PRODUCT_DELETE_ROLES = [ROLES.ADMIN, ROLES.EDITOR];

export const ORDER_STATUSES = ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
export const PAGE_SIZE = 12;

export const DELIVERY_ZONES = [
    { value: "inside_dhaka", label: "Inside Dhaka" },
    { value: "outside_dhaka", label: "Outside Dhaka" },
];
