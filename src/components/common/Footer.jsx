import { Link } from "react-router";
import { Truck, ShieldCheck, Package, CreditCard } from "../common/Icons";

const trustPoints = [
    { icon: Truck, label: "Delivery in Bangladesh", desc: "Shipped to your address" },
    { icon: ShieldCheck, label: "Secure Payment", desc: "Protected gateway checkout" },
    { icon: Package, label: "Order Tracking", desc: "Follow every order" },
    { icon: CreditCard, label: "Online Payment", desc: "Cards & mobile banking via aamarPay" },
];

export default function Footer() {
    return (
        <footer className="bg-forest text-snow/80 mt-20">
            {/* Trust strip */}
            <div className="border-b border-snow/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {trustPoints.map(({ icon: Icon, label, desc }) => (
                        <div key={label} className="flex items-start gap-3">
                            <Icon size={20} className="text-leaf shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-snow">{label}</p>
                                <p className="text-xs text-snow/50 mt-0.5">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand + newsletter */}
                    <div className="lg:col-span-2">
                        <h3 className="font-display text-xl font-semibold text-snow">
                            Eco<span className="text-leaf">Bazaar</span>
                        </h3>
                        <p className="text-sm mt-2 text-snow/60 max-w-xs">
                            Eco-friendly products, delivered across Bangladesh.
                        </p>

                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-snow mb-3">Shop</h4>
                        <ul className="space-y-2 text-sm text-snow/60">
                            <li><Link to="/products" className="hover:text-white hover:underline underline-offset-2 transition-colors">All Products</Link></li>
                            <li><Link to="/cart" className="hover:text-white hover:underline underline-offset-2 transition-colors">Cart</Link></li>
                            <li><Link to="/my-orders" className="hover:text-white hover:underline underline-offset-2 transition-colors">My Orders</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-snow mb-3">Account</h4>
                        <ul className="space-y-2 text-sm text-snow/60">
                            <li><Link to="/login" className="hover:text-white hover:underline underline-offset-2 transition-colors">Login</Link></li>
                            <li><Link to="/register" className="hover:text-white hover:underline underline-offset-2 transition-colors">Register</Link></li>
                            <li><Link to="/profile" className="hover:text-white hover:underline underline-offset-2 transition-colors">Profile</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-snow mb-3">Support</h4>
                        <ul className="space-y-2 text-sm text-snow/60">
                            <li><Link to="/resend-verification" className="hover:text-white hover:underline underline-offset-2 transition-colors">Verify Email</Link></li>
                            <li><Link to="/forgot-password" className="hover:text-white hover:underline underline-offset-2 transition-colors">Reset Password</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-snow/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-snow/40">
                        © {new Date().getFullYear()} EcoBazaar. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};