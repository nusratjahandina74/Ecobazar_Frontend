import { useEffect, useMemo, useState } from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";
import ImageUploader from "./ImageUploader";
import { buildCategories } from "../../utils/categories";
import { getErrorMessage } from "../../api/axiosInstance";

const STATUSES = ["active", "pending", "inactive"];
const MAX_IMAGES = 5;
const MAX_BYTES = 5 * 1024 * 1024;

const selectCls = "w-full py-2.5 px-3 rounded-lg border border-forest/15 bg-white text-sm hover:border-leaf/50 focus:outline-none focus:ring-4 focus:ring-leaf/15 focus:border-leaf transition-all";

export default function ProductForm({ initialData, onSubmit, submitLabel = "Save Product", categorySource = [] }) {
  const categories = useMemo(() => buildCategories(categorySource), [categorySource]);

  const [form, setForm] = useState({
    title: initialData?.title || "",
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    price: initialData?.price ?? "",
    discountPrice: initialData?.discountPrice || "",
    stock: initialData?.stock ?? "",
    category: initialData?.category || "",
    subCategory: initialData?.subCategory || "",
    tag: initialData?.tags?.join(", ") || "",
    additionalInfo: initialData?.additionalInformation || "",
    status: initialData?.status || "active",
  });
  const [existing, setExisting] = useState(initialData?.images || []);
  const [removed, setRemoved] = useState([]); // rawUrl list
  const [added, setAdded] = useState([]); // [{ file, preview }]
  const [mainKey, setMainKey] = useState(initialData?.images?.find((i) => i.isMain)?.rawUrl || initialData?.images?.[0]?.rawUrl || "");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => () => added.forEach((a) => URL.revokeObjectURL(a.preview)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const allKeys = [...existing.map((i) => i.rawUrl), ...added.map((a) => a.preview)];
  const effectiveMain = allKeys.includes(mainKey) ? mainKey : allKeys[0] || "";

  const subOptions = categories.find((c) => c.name === form.category)?.subcategories || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value, ...(name === "category" ? { subCategory: "" } : {}) }));
    setErrors((er) => ({ ...er, [name]: "" }));
    setSubmitError("");
  };

  const addFiles = (files) => {
    const bad = files.find((f) => f.size > MAX_BYTES);
    if (bad) return setErrors((er) => ({ ...er, images: `"${bad.name}" is larger than 5 MB` }));
    setErrors((er) => ({ ...er, images: "" }));
    setAdded((a) => [...a, ...files.map((file) => ({ file, preview: URL.createObjectURL(file) }))].slice(0, MAX_IMAGES - existing.length));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (form.price === "" || Number(form.price) <= 0) errs.price = "Price must be greater than 0";
    if (form.discountPrice !== "" && Number(form.discountPrice) !== 0) {
      if (Number(form.discountPrice) < 0) errs.discountPrice = "Cannot be negative";
      else if (Number(form.discountPrice) >= Number(form.price)) errs.discountPrice = "Discount price must be lower than the price";
    }
    if (form.stock === "" || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) errs.stock = "Stock must be a whole number, 0 or more";
    if (!form.category.trim()) errs.category = "Category is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "discountPrice") fd.append(k, v === "" ? "0" : String(v)); // 0 clears a discount
      else if (k === "tag") fd.append(k, v);
      else if (v !== "" && v !== null && v !== undefined) fd.append(k, typeof v === "string" ? v.trim() : v);
    });
    removed.forEach((u) => fd.append("removeImages", u));
    const addedIndex = added.findIndex((a) => a.preview === effectiveMain);
    if (addedIndex >= 0) fd.append("mainImage", `new:${addedIndex}`);
    else if (effectiveMain) fd.append("mainImage", effectiveMain);
    added.forEach((a) => fd.append("photos", a.file));

    setSaving(true);
    setProgress(0);
    setSubmitError("");
    try {
      await onSubmit(fd, (ev) => { if (ev.total) setProgress(Math.round((ev.loaded / ev.total) * 100)); });
    } catch (err) {
      setSubmitError(getErrorMessage(err));
      setSaving(false);
    }
  };

  const label = "text-sm font-medium text-forest block mb-1.5";
  const card = "bg-white rounded-xl border border-forest/10 p-5 sm:p-6";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6" noValidate>
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className={card}>
          <h2 className="font-display text-lg font-semibold text-forest mb-5">Basic information</h2>
          <div className="flex flex-col gap-4">
            <InputField label="Title" name="title" value={form.title} onChange={handleChange} error={errors.title} placeholder="Bamboo water bottle" />
            <InputField label="Short description" name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="One-line summary" />
            <div>
              <label htmlFor="description" className={label}>Description</label>
              <textarea id="description" name="description" rows={5} value={form.description} onChange={handleChange} className={`${selectCls} resize-y`} />
            </div>
            <div>
              <label htmlFor="additionalInfo" className={label}>Additional information</label>
              <textarea id="additionalInfo" name="additionalInfo" rows={3} value={form.additionalInfo} onChange={handleChange} className={`${selectCls} resize-y`} placeholder="Weight, dimensions, materials…" />
            </div>
          </div>
        </div>

        <div className={card}>
          <h2 className="font-display text-lg font-semibold text-forest mb-5">Images</h2>
          <ImageUploader
            existing={existing}
            added={added}
            mainKey={effectiveMain}
            onSetMain={setMainKey}
            error={errors.images}
            onAddFiles={addFiles}
            onRemoveExisting={(img) => { setExisting((x) => x.filter((i) => i.rawUrl !== img.rawUrl)); setRemoved((r) => [...r, img.rawUrl]); }}
            onRemoveAdded={(i) => setAdded((a) => { URL.revokeObjectURL(a[i].preview); return a.filter((_, idx) => idx !== i); })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className={card}>
          <h2 className="font-display text-lg font-semibold text-forest mb-5">Pricing & stock</h2>
          <div className="flex flex-col gap-4">
            <InputField label="Price (৳)" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} error={errors.price} />
            <InputField label="Discount price (৳, optional)" name="discountPrice" type="number" min="0" step="0.01" value={form.discountPrice} onChange={handleChange} error={errors.discountPrice} placeholder="Lower than price" />
            <InputField label="Stock" name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} error={errors.stock} />
          </div>
        </div>

        <div className={card}>
          <h2 className="font-display text-lg font-semibold text-forest mb-5">Organisation</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="category" className={label}>Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange} aria-invalid={!!errors.category} className={selectCls}>
                <option value="">Select category</option>
                {form.category && !categories.some((c) => c.name === form.category) && <option value={form.category}>{form.category}</option>}
                {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              {errors.category && <p role="alert" className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>
            <div>
              <label htmlFor="subCategory" className={label}>Sub-category</label>
              <select id="subCategory" name="subCategory" value={form.subCategory} onChange={handleChange} className={selectCls} disabled={!form.category}>
                <option value="">None</option>
                {form.subCategory && !subOptions.includes(form.subCategory) && <option value={form.subCategory}>{form.subCategory}</option>}
                {subOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <InputField label="Tags (comma separated)" name="tag" value={form.tag} onChange={handleChange} placeholder="eco, bamboo, bottle" />
            <div>
              <label htmlFor="status" className={label}>Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange} className={`${selectCls} capitalize`}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <p className="text-xs text-slate mt-1">Only "active" products appear in the store.</p>
            </div>
          </div>
        </div>

        {submitError && <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{submitError}</p>}
        {saving && added.length > 0 && (
          <div aria-label="Upload progress">
            <div className="h-1.5 rounded-full bg-forest/10 overflow-hidden"><div className="h-full bg-leaf transition-all" style={{ width: `${progress}%` }} /></div>
            <p className="text-xs text-slate mt-1">Uploading… {progress}%</p>
          </div>
        )}
        <Button type="submit" loading={saving}>{submitLabel}</Button>
      </div>
    </form>
  );
}
