import { Link } from "react-router";
import { Edit, Trash2 } from "../common/Icons";
import { ProductImage } from "../product/ProductCard";
import { formatBDT } from "../../utils/adapters";

function StatusBadge({ status }) {
  const styles = { active: "text-leaf-dark bg-leaf/10", pending: "text-yellow-700 bg-yellow-50", inactive: "text-slate bg-forest/5" };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${styles[status] || styles.pending}`}>{status}</span>;
}

export default function ProductTable({ products, onDeleteClick, canDelete = true }) {
  if (products.length === 0) {
    return <div className="text-center py-16 bg-white rounded-xl border border-forest/10"><p className="text-slate text-sm">No products found.</p></div>;
  }

  const iconBtn = "w-8 h-8 rounded-lg flex items-center justify-center text-forest/50 transition-colors";

  return (
    <div className="bg-white rounded-xl border border-forest/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest/10 text-left text-xs text-slate uppercase tracking-wide bg-mint/60">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-forest/5 last:border-0 hover:bg-mint/50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-mint shrink-0">
                      <ProductImage src={product.mainImage} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-forest line-clamp-1">{product.title}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-slate whitespace-nowrap">{product.sku}</td>
                <td className="px-5 py-3 text-slate">{product.category}</td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <span className="text-forest font-medium">{formatBDT(product.salePrice)}</span>
                  {product.hasDiscount && <span className="ml-1.5 text-xs text-slate/60 line-through">{formatBDT(product.price)}</span>}
                </td>
                <td className="px-5 py-3">
                  {product.stock === 0
                    ? <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">Out of stock</span>
                    : <span className="text-forest">{product.stock}</span>}
                </td>
                <td className="px-5 py-3"><StatusBadge status={product.status} /></td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/admin/products/edit/${product._id}`} aria-label={`Edit ${product.title}`} className={`${iconBtn} hover:bg-leaf/10 hover:text-leaf`}><Edit size={15} /></Link>
                    {canDelete && (
                      <button onClick={() => onDeleteClick(product)} aria-label={`Delete ${product.title}`} className={`${iconBtn} hover:bg-red-50 hover:text-red-500`}><Trash2 size={15} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
