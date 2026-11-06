import { useParams, useNavigate, Link } from "react-router";
import ProductForm from "../../components/product/ProductForm";
import { mockProducts } from "../../utils/mockProducts";

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    // TODO: replace with data fetched from GET /get-single-product/:id
    const product = mockProducts.find((p) => p._id === id);

    if (!product) {
        return (
            <div className="text-center py-16">
                <p className="text-slate">Product not found.</p>
                <Link to="/admin/products" className="text-amber font-medium hover:underline mt-2 inline-block">
                    Back to products
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="font-display text-2xl font-semibold text-ink mb-1">Edit Product</h1>
            <p className="text-sm text-slate mb-6">Update details for "{product.name}".</p>

            <ProductForm
                initialData={product}
                submitLabel="Save Changes"
                onSubmit={() => navigate("/admin/products")}
            />
        </div>
    );
};