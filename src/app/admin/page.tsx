'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, Loader2, X, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/api';
import type { Product } from '@/types';

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.string().min(1),
  salePrice: z.string().optional(),
  category: z.string().min(2),
  stock: z.string().min(1),
  sizes: z.string(),
  colors: z.string(),
  images: z.string(),
  badge: z.enum(['new', 'sale', 'bestseller', '']).optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export default function AdminPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (!user?.isAdmin) { router.push('/'); return; }
    loadProducts();
  }, [user, router]);

  const loadProducts = () => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const openAdd = () => {
    setEditing(null);
    reset({ name: '', description: '', price: '', category: '', stock: '0', sizes: '', colors: '', images: '', badge: '' });
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    reset({
      name: p.name,
      description: p.description,
      price: String(p.price),
      salePrice: p.salePrice ? String(p.salePrice) : '',
      category: p.category,
      stock: String(p.stock),
      sizes: p.sizes?.join(', ') || '',
      colors: p.colors?.join(', ') || '',
      images: p.images?.join(', ') || '',
      badge: (p.badge as '' | 'new' | 'sale' | 'bestseller') || '',
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: ProductForm) => {
    if (!token) return;
    setSaving(true);
    try {
      const payload = {
        ...data,
        price: parseFloat(data.price),
        salePrice: data.salePrice ? parseFloat(data.salePrice) : undefined,
        stock: parseInt(data.stock, 10),
        sizes: data.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: data.colors.split(',').map(s => s.trim()).filter(Boolean),
        images: data.images.split(',').map(s => s.trim()).filter(Boolean),
        badge: data.badge || undefined,
      };
      if (editing) {
        await updateProduct(editing._id, payload, token);
      } else {
        await createProduct(payload, token);
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId || !token) return;
    setSaving(true);
    try {
      await deleteProduct(deleteId, token);
      setDeleteId(null);
      loadProducts();
    } catch {
      alert('Failed to delete product');
    } finally {
      setSaving(false);
    }
  };

  if (!user?.isAdmin) return null;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="bg-burgundy py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end justify-between">
          <div>
            <p className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-2">Dashboard</p>
            <h1 className="font-display text-white text-4xl tracking-wide">Admin Panel</h1>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-6 py-3 bg-mauve text-white rounded-full font-body text-sm hover:bg-mauve-dark transition-colors"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: products.length },
            { label: 'In Stock', value: products.filter(p => p.stock > 0).length },
            { label: 'On Sale', value: products.filter(p => p.badge === 'sale').length },
            { label: 'New Arrivals', value: products.filter(p => p.badge === 'new').length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-blush/40 rounded-2xl p-5">
              <p className="font-body text-burgundy/50 text-xs uppercase tracking-wide mb-1">{label}</p>
              <p className="font-display text-burgundy text-3xl">{value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-6">
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search products…"
            className="flex-1 max-w-sm px-4 py-2.5 rounded-xl border border-blush-dark font-body text-burgundy text-sm focus:outline-none focus:border-mauve"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-blush/40 rounded-2xl aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-blush">
            <table className="w-full">
              <thead className="bg-blush/40">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Badge', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-body text-burgundy/70 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-blush">
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-blush/20 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded-xl overflow-hidden bg-blush shrink-0">
                          {p.images?.[0] ? (
                            <Image src={p.images[0]} alt={p.name} width={48} height={56} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={16} className="text-burgundy/30" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-body text-burgundy text-sm font-medium line-clamp-2 max-w-[200px]">{p.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-body text-burgundy/60 text-sm capitalize">{p.category}</td>
                    <td className="px-4 py-4">
                      <p className="font-body text-burgundy text-sm font-medium">₦{(p.salePrice ?? p.price).toLocaleString()}</p>
                      {p.salePrice && <p className="font-body text-burgundy/40 text-xs line-through">₦{p.price.toLocaleString()}</p>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`font-body text-sm ${p.stock > 5 ? 'text-green-600' : p.stock > 0 ? 'text-gold' : 'text-mauve'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {p.badge && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-body font-semibold capitalize ${
                          p.badge === 'new' ? 'bg-burgundy/10 text-burgundy' :
                          p.badge === 'sale' ? 'bg-mauve/10 text-mauve' :
                          'bg-gold/10 text-gold'
                        }`}>{p.badge}</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-blush text-burgundy transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteId(p._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-burgundy px-6 py-5 flex items-center justify-between rounded-t-3xl">
                <h2 className="font-display text-white tracking-wide text-lg">
                  {editing ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                {[
                  { name: 'name', label: 'Product Name', placeholder: 'Adire Silk Dress' },
                  { name: 'description', label: 'Description', placeholder: 'A beautiful hand-crafted piece…', textarea: true },
                  { name: 'category', label: 'Category', placeholder: 'dress' },
                  { name: 'images', label: 'Image URLs (comma-separated)', placeholder: 'https://…, https://…' },
                  { name: 'sizes', label: 'Sizes (comma-separated)', placeholder: 'XS, S, M, L, XL' },
                  { name: 'colors', label: 'Colors (comma-separated)', placeholder: 'Black, Ivory, Navy' },
                ].map(({ name, label, placeholder, textarea }) => (
                  <div key={name}>
                    <label className="block font-body text-burgundy/70 text-xs uppercase tracking-wide mb-1.5">{label}</label>
                    {textarea ? (
                      <textarea
                        {...register(name as keyof ProductForm)}
                        placeholder={placeholder}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-blush-dark bg-blush/20 font-body text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-mauve text-sm resize-none"
                      />
                    ) : (
                      <input
                        {...register(name as keyof ProductForm)}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-xl border border-blush-dark bg-blush/20 font-body text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-mauve text-sm"
                      />
                    )}
                    {errors[name as keyof ProductForm] && (
                      <p className="text-mauve text-xs mt-1">{(errors[name as keyof ProductForm] as { message?: string })?.message}</p>
                    )}
                  </div>
                ))}

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-body text-burgundy/70 text-xs uppercase tracking-wide mb-1.5">Price (₦)</label>
                    <input type="number" {...register('price')} className="w-full px-4 py-3 rounded-xl border border-blush-dark bg-blush/20 font-body text-burgundy focus:outline-none focus:border-mauve text-sm" />
                    {errors.price && <p className="text-mauve text-xs mt-1">{errors.price.message}</p>}
                  </div>
                  <div>
                    <label className="block font-body text-burgundy/70 text-xs uppercase tracking-wide mb-1.5">Sale Price (₦)</label>
                    <input type="number" {...register('salePrice')} className="w-full px-4 py-3 rounded-xl border border-blush-dark bg-blush/20 font-body text-burgundy focus:outline-none focus:border-mauve text-sm" />
                  </div>
                  <div>
                    <label className="block font-body text-burgundy/70 text-xs uppercase tracking-wide mb-1.5">Stock</label>
                    <input type="number" {...register('stock')} className="w-full px-4 py-3 rounded-xl border border-blush-dark bg-blush/20 font-body text-burgundy focus:outline-none focus:border-mauve text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block font-body text-burgundy/70 text-xs uppercase tracking-wide mb-1.5">Badge</label>
                  <select {...register('badge')} className="w-full px-4 py-3 rounded-xl border border-blush-dark bg-blush/20 font-body text-burgundy focus:outline-none focus:border-mauve text-sm">
                    <option value="">None</option>
                    <option value="new">New</option>
                    <option value="sale">Sale</option>
                    <option value="bestseller">Bestseller</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3.5 bg-burgundy text-white rounded-xl font-body text-sm tracking-wide hover:bg-burgundy-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {editing ? 'Save Changes' : 'Add Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h3 className="font-display text-burgundy text-xl tracking-wide mb-2">Delete Product?</h3>
              <p className="font-body text-burgundy/60 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-burgundy/20 rounded-xl font-body text-burgundy text-sm hover:bg-blush transition-colors">
                  Cancel
                </button>
                <button onClick={confirmDelete} disabled={saving} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-body text-sm hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
