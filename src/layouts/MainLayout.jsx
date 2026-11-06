import { Outlet } from "react-router";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import NoticeBar from "../components/common/NoticeBar";
import WhatsAppButton from "../components/common/WhatsAppButton";
import ScrollToTop from "../components/common/ScrollToTop";

export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-snow font-sans text-forest">
            <ScrollToTop />
            <NoticeBar />
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
};