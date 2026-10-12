import { useParams, useNavigate, Link } from "react-router";
import ProductForm from "../../components/product/ProductForm";
import { PageLoader } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/StateViews";
import useFetch from "../../hooks/useFetch";
import { getProduct, updateProduct } from "../../api/productApi";
import { useCatalog } from "../../context/CatalogContext";
import { useToast } from "../../context/ToastContext";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { products, reload } = useCatalog();
  const { data: product, loading, error, reload: retry } = useFetch((signal) => getProduct(id, { signal }), [id]);

  if (loading) return <PageLoader />;
  if (error || !product) {
    return (
      <div>
        <ErrorState message={error || "Product not found."} onRetry={retry} />
        <p className="text-center"><Link to="/admin/products" className="text-leaf font-medium hover:underline">Back to products</Link></p>
      </div>
    );
  }

  const handleSubmit = async (formData, onProgress) => {
    await updateProduct(id, formData, onProgress);
    toast.success("Product updated");
    reload();
    navigate("/admin/products");
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest mb-1">Edit Product</h1>
      <p className="text-sm text-slate mb-6">Update details for "{product.title}" (SKU {product.sku}).</p>
      <ProductForm initialData={product} submitLabel="Save Changes" onSubmit={handleSubmit} categorySource={products} />
    </div>
  );
}
