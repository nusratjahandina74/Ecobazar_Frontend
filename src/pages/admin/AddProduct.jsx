import { useNavigate } from "react-router";
import ProductForm from "../../components/product/ProductForm";

export default function AddProduct() {
    const navigate = useNavigate();

    return (
        <div>
            <h1 className="font-display text-2xl font-semibold text-ink mb-1">Add Product</h1>
            <p className="text-sm text-slate mb-6">Fill in the details to list a new product.</p>

            <ProductForm submitLabel="Create Product" onSubmit={() => navigate("/admin/products")} />
        </div>
    );
};