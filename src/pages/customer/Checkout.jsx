import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSettings, quoteDelivery } from "../../context/SettingsContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import AddressForm from "../../components/checkout/AddressForm";
import DeliveryZoneSelect from "../../components/checkout/DeliveryZoneSelect";
import PaymentMethodSelector from "../../components/checkout/PaymentMethodSelector";
import OrderSummary from "../../components/checkout/OrderSummary";
import CouponBox from "../../components/checkout/CouponBox";
import { previewCart } from "../../api/publicApi";
import usePageTitle from "../../hooks/usePageTitle";
import Button from "../../components/common/Button";
import { CartSkeleton } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/StateViews";
import { initiatePayment } from "../../api/orderApi";
import { formatBDT } from "../../utils/adapters";
import { getErrorMessage } from "../../api/axiosInstance";
import { isEmail, isBdPhone } from "../../utils/validators";

export default function Checkout() {
    const { items, subtotal, loading, reload: reloadCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { settings } = useSettings();
    const delivery = settings.delivery;
    const [zone, setZone] = useState("inside_dhaka");
    const [method, setMethod] = useState(delivery.codEnabled === false ? "online" : "cod");
    const quote = quoteDelivery(delivery, zone, subtotal);
    usePageTitle("Checkout");

    // Coupon: the server prices it; we re-ask whenever the zone or cart changes
    const [coupon, setCoupon] = useState(null);
    const applyCoupon = async (code) => { setCoupon(await previewCart({ deliveryZone: zone, couponCode: code })); };
    useEffect(() => {
        if (!coupon?.couponCode) return;
        previewCart({ deliveryZone: zone, couponCode: coupon.couponCode }).then(setCoupon).catch(() => setCoupon(null));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zone, subtotal]);
    const discount = coupon?.discount || 0;
    const deliveryCharge = coupon ? coupon.deliveryCharge : quote.charge;
    const deliveryFree = coupon ? coupon.deliveryCharge === 0 : quote.free;

    const [form, setForm] = useState({
        cus_name: user?.name && user.name !== user?.email?.split("@")[0] ? user.name : "",
        cus_email: user?.email || "",
        cus_phone: user?.phoneNumber || "",
        cus_add1: "",
        cus_add2: "",
        cus_city: "",
        cus_state: "",
        cus_postcode: "",
    });
    const [errors, setErrors] = useState({});
    const [placing, setPlacing] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
        setSubmitError("");
    };

    const validate = () => {
        const errs = {};
        if (!form.cus_name.trim()) errs.cus_name = "Name is required";
        if (!form.cus_email.trim()) errs.cus_email = "Email is required";
        else if (!isEmail(form.cus_email)) errs.cus_email = "Enter a valid email";
        if (!form.cus_phone.trim()) errs.cus_phone = "Phone number is required";
        else if (!isBdPhone(form.cus_phone)) errs.cus_phone = "Enter a valid Bangladeshi phone number";
        if (!form.cus_add1.trim()) errs.cus_add1 = "Address is required";
        return errs;
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) return setErrors(errs);

        setPlacing(true);
        setSubmitError("");
        try {
            // The browser never sends an amount or userId: the server prices the cart and uses the session.
            const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
            const data = await initiatePayment({ ...payload, paymentMethod: method, deliveryZone: zone, ...(coupon?.couponCode ? { couponCode: coupon.couponCode } : {}) });
            if (data.cod) {
                await reloadCart().catch(() => { });
                navigate(`/order-success?txnId=${encodeURIComponent(data.transactionId)}`, { replace: true });
                return;
            }
            if (!data.paymentUrl) throw new Error("The payment gateway did not return a payment link.");
            // The cart is NOT cleared here. The backend clears it only after the gateway confirms payment.
            window.location.assign(data.paymentUrl);
        } catch (err) {
            setSubmitError(getErrorMessage(err));
            setPlacing(false);
        }
    };

    const total = subtotal - discount + deliveryCharge;
    const placeLabel = method === "cod" ? "Place order (Cash on delivery)" : "Pay with aamarPay";
    const placeHint = method === "cod" ? "Pay in cash when the parcel arrives." : "You'll be redirected to the payment gateway. Your order is confirmed only after the payment succeeds.";

    if (loading) return <CartSkeleton />;

    if (items.length === 0) {
        return (
            <EmptyState
                title="Your cart is empty"
                text="Add something to your cart before checking out."
                action={<Link to="/products" className="px-5 py-2.5 rounded-lg bg-leaf text-white text-sm font-semibold transition-colors">Browse products</Link>}
            />
        );
    }

    return (
        <div className="px-4 pt-8 pb-32 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:pt-10 lg:pb-12">
            <h1 className="mb-6 text-3xl font-semibold font-display text-forest">Checkout</h1>

            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-8 lg:grid-cols-3" noValidate>
                <div className="flex flex-col gap-6 lg:col-span-2">
                    <AddressForm form={form} errors={errors} onChange={handleChange} />
                    <DeliveryZoneSelect value={zone} onChange={setZone} delivery={delivery} subtotal={subtotal} />
                    <PaymentMethodSelector value={method} onChange={setMethod} delivery={delivery} />
                </div>

                {/* The WHOLE column is sticky, so the summary and the Place-order button stay on screen together while the form scrolls. */}
                <aside className="flex flex-col gap-4 lg:sticky lg:top-40 lg:self-start lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto lg:pr-1">
                    <OrderSummary items={items} subtotal={subtotal} deliveryCharge={deliveryCharge} deliveryFree={deliveryFree} discount={discount} couponCode={coupon?.couponCode}>
                        <CouponBox applied={coupon ? { code: coupon.couponCode, discount } : null} onApply={applyCoupon} onRemove={() => setCoupon(null)} />
                    </OrderSummary>
                    {submitError && <p role="alert" className="px-3 py-2 text-sm text-red-600 rounded-lg bg-red-50">{submitError}</p>}
                    <div className="hidden lg:block">
                        <Button type="submit" loading={placing}>{placeLabel}</Button>
                        <p className="mt-3 text-xs text-center text-slate">{placeHint}</p>
                    </div>
                </aside>

                {/* Mobile / tablet: the button is pinned to the bottom of the screen, always reachable. */}
                <div className="fixed inset-x-0 bottom-0 z-40 px-4 py-3 bg-white border-t shadow-[0_-4px_16px_rgba(15,61,36,.08)] lg:hidden border-forest/10">
                    <div className="flex items-center gap-3 mx-auto max-w-7xl">
                        <div className="shrink-0">
                            <p className="text-xs text-slate">Total</p>
                            <p className="text-lg font-semibold leading-tight font-display text-forest">{formatBDT(total)}</p>
                        </div>
                        <Button type="submit" loading={placing} className="flex-1">{placeLabel}</Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
