export const ROLES = { USER: "user", ADMIN: "admin", EDITOR: "editor", VENDOR: "vendor" };
export const ANY_ACCOUNT = [ROLES.USER, ROLES.ADMIN, ROLES.EDITOR, ROLES.VENDOR];
export const ADMIN_PANEL_ROLES = [ROLES.ADMIN, ROLES.EDITOR, ROLES.VENDOR];
export const ADMIN_ONLY = [ROLES.ADMIN];
export const PRODUCT_DELETE_ROLES = [ROLES.ADMIN, ROLES.EDITOR];

export const ORDER_STATUSES = ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
export const PAGE_SIZE = 12;
