// Roles come from the backend enum (models/userModel.js): user | admin | editor | vendor.
// No role strings are invented on the client.
export const ROLES = { USER: "user", ADMIN: "admin", EDITOR: "editor", VENDOR: "vendor" };

// Access map (UI only — the same rules are enforced server-side in middleware/secureMiddleware.js):
//   user    -> storefront, cart, checkout, profile, own orders
//   admin   -> everything (users, orders, products)
//   editor  -> admin panel: dashboard + products (create / edit / delete)
//   vendor  -> admin panel: dashboard + products (create / edit; cannot delete)
export const ANY_ACCOUNT = [ROLES.USER, ROLES.ADMIN, ROLES.EDITOR, ROLES.VENDOR];
export const ADMIN_PANEL_ROLES = [ROLES.ADMIN, ROLES.EDITOR, ROLES.VENDOR];
export const ADMIN_ONLY = [ROLES.ADMIN];
export const PRODUCT_DELETE_ROLES = [ROLES.ADMIN, ROLES.EDITOR];

export const ORDER_STATUSES = ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
export const PAGE_SIZE = 12;
