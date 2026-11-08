import { useState } from "react";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { sendContactMessage } from "../../api/publicApi";
import { getErrorMessage } from "../../api/axiosInstance";
import { useSettings } from "../../context/SettingsContext";

export default function Contact() {
    const { settings } = useSettings();
    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
    const [state, setState] = useState({ sending: false, done: false, error: "" });
    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.message.trim() || (!form.email.trim() && !form.phone.trim())) {
            return setState({ sending: false, done: false, error: "Please enter your name, a message, and an email or phone number." });
        }
        setState({ sending: true, done: false, error: "" });
        try {
            await sendContactMessage(form);
            setForm({ name: "", email: "", phone: "", subject: "", message: "" });
            setState({ sending: false, done: true, error: "" });
        } catch (err) {
            setState({ sending: false, done: false, error: getErrorMessage(err) });
        }
    };

    const s = settings.store || {};
    return (
        <div className="max-w-3xl px-4 py-6 sm:py-10 mx-auto sm:px-6">
            <h1 className="text-3xl font-semibold font-display text-forest">Contact us</h1>
            <p className="mt-2 text-sm text-slate [overflow-wrap:anywhere]">
                {[s.phone, s.email, s.address].filter(Boolean).join(" · ") || "Send us a message and we will get back to you."}
            </p>
            <form onSubmit={submit} className="grid grid-cols-1 gap-4 p-5 mt-6 bg-white border sm:grid-cols-2 rounded-xl border-forest/10 sm:p-6" noValidate>
                <InputField label="Your name" name="name" value={form.name} onChange={onChange} />
                <InputField label="Phone" name="phone" value={form.phone} onChange={onChange} placeholder="01XXXXXXXXX" />
                <div className="sm:col-span-2"><InputField label="Email" name="email" type="email" value={form.email} onChange={onChange} /></div>
                <div className="sm:col-span-2"><InputField label="Subject (optional)" name="subject" value={form.subject} onChange={onChange} /></div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="message" className="text-sm font-medium text-forest">Message</label>
                    <textarea id="message" name="message" rows={5} value={form.message} onChange={onChange} maxLength={3000}
                        className="w-full px-3.5 py-2.5 text-sm border rounded-lg border-forest/15 focus:outline-none focus:ring-4 focus:ring-leaf/15 focus:border-leaf" />
                </div>
                {state.error && <p role="alert" className="px-3 py-2 text-sm text-red-600 rounded-lg sm:col-span-2 bg-red-50">{state.error}</p>}
                {state.done && <p role="status" className="px-3 py-2 text-sm rounded-lg sm:col-span-2 bg-mint text-leaf-dark">Thanks! We received your message.</p>}
                <div className="sm:col-span-2"><Button type="submit" loading={state.sending}>Send message</Button></div>
            </form>
        </div>
    );
}
