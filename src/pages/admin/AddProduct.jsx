import { useNavigate } from "react-router";
import ProductForm from "../../components/product/ProductForm";
import { createProduct } from "../../api/productApi";
import { useCatalog } from "../../context/CatalogContext";
import { useToast } from "../../context/ToastContext";

export default function AddProduct() {
  const navigate = useNavigate();
  const toast = useToast();
  const { products, reload } = useCatalog();

  const handleSubmit = async (formData, onProgress) => {
    await createProduct(formData, onProgress);
    toast.success("Product created");
    reload();
    navigate("/admin/products");
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest mb-1">Add Product</h1>
      <p className="text-sm text-slate mb-6">Fill in the details to list a new product. The SKU is generated automatically.</p>
      <ProductForm submitLabel="Create Product" onSubmit={handleSubmit} categorySource={products} />
    </div>
  );
}
