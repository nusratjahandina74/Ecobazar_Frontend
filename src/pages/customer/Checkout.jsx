import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import AddressForm from "../../components/checkout/AddressForm";
import PaymentMethodSelector from "../../components/checkout/PaymentMethodSelector";
import OrderSummary from "../../components/checkout/OrderSummary";
import Button from "../../components/common/Button";
import { PageLoader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/StateViews";
import { initiatePayment } from "../../api/orderApi";
import { getErrorMessage } from "../../api/axiosInstance";
import { isEmail, isBdPhone } from "../../utils/validators";

export default function Checkout() {
    const { items, subtotal, loading } = useCart();
    const { user } = useAuth();

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
        if (!form.cus_city.trim()) errs.cus_city = "City is required";
        if (!form.cus_postcode.trim()) errs.cus_postcode = "Postal code is required";
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
            const data = await initiatePayment(payload);
            if (!data.paymentUrl) throw new Error("The payment gateway did not return a payment link.");
            // The cart is NOT cleared here. The backend clears it only after the gateway confirms payment.
            window.location.assign(data.paymentUrl);
        } catch (err) {
            setSubmitError(getErrorMessage(err));
            setPlacing(false);
        }
    };

    if (loading) return <PageLoader />;

    if (items.length === 0) {
        return (
            <EmptyState
                title="Your cart is empty"
                text="Add something to your cart before checking out."
                action={<Link to="/products" className="px-5 py-2.5 rounded-lg bg-leaf text-white text-sm font-semibold hover:bg-leaf-dark transition-colors">Browse products</Link>}
            />
        );
    }

    return (
        <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="mb-6 text-3xl font-semibold font-display text-forest">Checkout</h1>

            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-8 lg:grid-cols-3" noValidate>
                <div className="flex flex-col gap-6 lg:col-span-2">
                    <AddressForm form={form} errors={errors} onChange={handleChange} />
                    <PaymentMethodSelector />
                </div>

                <div className="flex flex-col gap-4">
                    <OrderSummary items={items} subtotal={subtotal} />
                    {submitError && <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{submitError}</p>}
                    <Button type="submit" loading={placing}>Pay with aamarPay</Button>
                    <p className="text-xs text-center text-slate">
                        You'll be redirected to the payment gateway. Your order is confirmed only after the payment succeeds.
                    </p>
                </div>
            </form>
        </div>
    );
}
