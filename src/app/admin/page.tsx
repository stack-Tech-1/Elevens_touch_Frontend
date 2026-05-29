'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus, Pencil, Trash2, Loader2, X, Package, ShoppingBag,
  Users, BarChart3, ChevronDown, Check, TrendingUp, Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  getAllOrders, updateOrderStatus, getAllUsers, getDashboardStats, promoteUser,
} from '@/lib/api';
import type { Product, Order, AdminUser, DashboardStats } from '@/types';

// ─── Product form ──────────────────────────────────────────────────────────────
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

// ─── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-gold/15 text-gold',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-mauve/15 text-mauve',
  delivered: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-500',
};
const ALL_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-body font-semibold capitalize ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  type Tab = 'overview' | 'products' | 'orders' | 'customers';
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // Orders
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [orderFilter, setOrderFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Customers
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [promotingUserId, setPromotingUserId] = useState<string | null>(null);

  // Analytics
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsLoaded, setStatsLoaded] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });
  const watchedImages = watch('images');

  useEffect(() => {
    if (!user?.isAdmin) { router.push('/'); return; }
    loadProducts();
  }, [user, router]);

  useEffect(() => {
    if (!token) return;
    if (activeTab === 'overview' && !statsLoaded) loadStats();
    if (activeTab === 'orders' && !ordersLoaded) loadAllOrders();
    if (activeTab === 'customers' && !usersLoaded) loadUsers();
  }, [activeTab, token]);

  const loadProducts = () => {
    setProductsLoading(true);
    getProducts().then(setProducts).catch(console.error).finally(() => setProductsLoading(false));
  };

  const loadAllOrders = useCallback(() => {
    if (!token) return;
    setOrdersLoading(true);
    getAllOrders(token).then(data => { setAllOrders(data); setOrdersLoaded(true); }).catch(console.error).finally(() => setOrdersLoading(false));
  }, [token]);

  const loadUsers = useCallback(() => {
    if (!token) return;
    setUsersLoading(true);
    getAllUsers(token).then(data => { setUsers(data); setUsersLoaded(true); }).catch(console.error).finally(() => setUsersLoading(false));
  }, [token]);

  const loadStats = useCallback(() => {
    if (!token) return;
    setStatsLoading(true);
    getDashboardStats(token).then(data => { setStats(data); setStatsLoaded(true); }).catch(console.error).finally(() => setStatsLoading(false));
  }, [token]);

  // ── Product upload
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) throw new Error('Cloudinary not configured');
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: form });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.secure_url as string;
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setImageUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setValue('images', url);
      setImagePreview(url);
    } catch {
      alert('Image upload failed. Paste a URL instead.');
      setImagePreview('');
    } finally {
      setImageUploading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    reset({ name: '', description: '', price: '', category: '', stock: '0', sizes: '', colors: '', images: '', badge: '' });
    setImagePreview('');
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    const firstImage = p.images?.[0] || '';
    reset({
      name: p.name, description: p.description, price: String(p.price),
      salePrice: p.salePrice ? String(p.salePrice) : '', category: p.category,
      stock: String(p.stock), sizes: p.sizes?.join(', ') || '',
      colors: p.colors?.join(', ') || '', images: firstImage,
      badge: (p.badge as '' | 'new' | 'sale' | 'bestseller') || '',
    });
    setImagePreview(firstImage);
    setModalOpen(true);
  };

  const onProductSubmit = async (data: ProductForm) => {
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
      editing ? await updateProduct(editing._id, payload, token) : await createProduct(payload, token);
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

  const handlePromote = async (userId: string, makeAdmin: boolean) => {
    if (!token) return;
    setPromotingUserId(userId);
    try {
      const updated = await promoteUser(userId, makeAdmin, token);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isAdmin: updated.isAdmin } : u));
    } catch {
      alert('Failed to update user role');
    } finally {
      setPromotingUserId(null);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!token) return;
    setUpdatingStatus(true);
    try {
      const updated = await updateOrderStatus(orderId, newStatus, token);
      setAllOrders(prev => prev.map(o => o._id === orderId ? updated : o));
      if (selectedOrder?._id === orderId) setSelectedOrder(updated);
    } catch {
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!user?.isAdmin) return null;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orderFilter === 'all'
    ? allOrders
    : allOrders.filter(o => o.status === orderFilter);

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
    { id: 'products', label: 'Products', icon: <Package size={16} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={16} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={16} /> },
  ];

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Header */}
      <div className="bg-burgundy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-0">
          <p className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-1">Dashboard</p>
          <h1 className="font-display text-white text-4xl tracking-wide mb-6">Admin Panel</h1>
          {/* Tabs */}
          <div className="flex gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 font-body text-sm tracking-wide rounded-t-xl transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-burgundy'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── OVERVIEW TAB ─────────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {statsLoading || !stats ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="animate-pulse bg-blush/40 rounded-2xl h-28" />)}
              </div>
            ) : (
              <>
                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, sub: `₦${stats.revenueThisMonth.toLocaleString()} this month`, icon: <TrendingUp size={20} className="text-mauve" /> },
                    { label: 'Total Orders', value: stats.totalOrders, sub: `${stats.ordersByStatus?.pending || 0} pending`, icon: <ShoppingBag size={20} className="text-mauve" /> },
                    { label: 'Customers', value: stats.totalCustomers, sub: 'Registered users', icon: <Users size={20} className="text-mauve" /> },
                    { label: 'Products', value: stats.totalProducts, sub: `${products.filter(p => p.stock > 0).length} in stock`, icon: <Package size={20} className="text-mauve" /> },
                  ].map(({ label, value, sub, icon }) => (
                    <div key={label} className="bg-blush/30 rounded-2xl p-5 border border-blush">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-body text-burgundy/50 text-xs uppercase tracking-wide">{label}</p>
                        {icon}
                      </div>
                      <p className="font-display text-burgundy text-2xl lg:text-3xl mb-1">{value}</p>
                      <p className="font-body text-burgundy/40 text-xs">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Revenue breakdown */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Today', value: stats.revenueToday },
                    { label: 'This Week', value: stats.revenueThisWeek },
                    { label: 'This Month', value: stats.revenueThisMonth },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white border border-blush rounded-2xl p-5 text-center">
                      <p className="font-body text-burgundy/50 text-xs uppercase tracking-wide mb-2">{label}</p>
                      <p className="font-display text-burgundy text-xl">₦{value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent orders */}
                  <div className="bg-white border border-blush rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-blush bg-blush/30 flex items-center justify-between">
                      <h3 className="font-display text-burgundy text-sm tracking-wider uppercase">Recent Orders</h3>
                      <button onClick={() => setActiveTab('orders')} className="font-body text-mauve text-xs hover:underline">View all</button>
                    </div>
                    <ul className="divide-y divide-blush">
                      {stats.recentOrders.slice(0, 5).map(order => (
                        <li key={order._id} className="flex items-center justify-between px-5 py-3 gap-3">
                          <div className="min-w-0">
                            <p className="font-body text-burgundy text-xs font-semibold">#{order._id.slice(-6).toUpperCase()}</p>
                            <p className="font-body text-burgundy/50 text-xs truncate">
                              {typeof order.user === 'object' && (order.user as {name?:string}).name
                                ? (order.user as {name:string}).name
                                : 'Guest'}
                            </p>
                          </div>
                          <StatusBadge status={order.status} />
                          <p className="font-body text-burgundy text-xs font-semibold shrink-0">₦{order.totalAmount.toLocaleString()}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Top products */}
                  <div className="bg-white border border-blush rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-blush bg-blush/30">
                      <h3 className="font-display text-burgundy text-sm tracking-wider uppercase">Top Products by Revenue</h3>
                    </div>
                    <ul className="divide-y divide-blush">
                      {stats.topProducts.map((p, i) => (
                        <li key={p._id} className="flex items-center gap-3 px-5 py-3">
                          <span className="font-body text-burgundy/30 text-sm w-4">{i + 1}</span>
                          <div className="w-8 h-10 rounded-lg overflow-hidden bg-blush shrink-0">
                            {p.image
                              ? <Image src={p.image} alt={p.name} width={32} height={40} className="object-cover w-full h-full" />
                              : <Package size={14} className="text-burgundy/20 m-auto mt-3" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-burgundy text-xs font-medium truncate">{p.name}</p>
                            <p className="font-body text-burgundy/40 text-xs">{p.unitsSold} sold</p>
                          </div>
                          <p className="font-body text-burgundy text-xs font-semibold shrink-0">₦{p.revenue.toLocaleString()}</p>
                        </li>
                      ))}
                      {stats.topProducts.length === 0 && (
                        <li className="px-5 py-6 text-center font-body text-burgundy/40 text-sm">No sales data yet</li>
                      )}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── PRODUCTS TAB ─────────────────────────────────────────────────────── */}
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-4 items-center">
                <input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search products…"
                  className="w-60 px-4 py-2.5 rounded-xl border border-blush-dark font-body text-burgundy text-sm focus:outline-none focus:border-mauve"
                />
              </div>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 px-6 py-2.5 bg-mauve text-white rounded-full font-body text-sm hover:bg-mauve-dark transition-colors"
              >
                <Plus size={15} /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total', value: products.length },
                { label: 'In Stock', value: products.filter(p => p.stock > 0).length },
                { label: 'On Sale', value: products.filter(p => p.badge === 'sale').length },
                { label: 'New Arrivals', value: products.filter(p => p.badge === 'new').length },
              ].map(({ label, value }) => (
                <div key={label} className="bg-blush/40 rounded-2xl p-4">
                  <p className="font-body text-burgundy/50 text-xs uppercase tracking-wide mb-1">{label}</p>
                  <p className="font-display text-burgundy text-2xl">{value}</p>
                </div>
              ))}
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="animate-pulse bg-blush/40 rounded-2xl aspect-[3/4]" />)}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-blush">
                <table className="w-full">
                  <thead className="bg-blush/40">
                    <tr>{['Product', 'Category', 'Price', 'Stock', 'Badge', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-body text-burgundy/70 text-xs uppercase tracking-wide">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-blush">
                    {filteredProducts.map((p, i) => (
                      <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-blush/20 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-14 rounded-xl overflow-hidden bg-blush shrink-0">
                              {p.images?.[0]
                                ? <Image src={p.images[0]} alt={p.name} width={48} height={56} className="object-cover w-full h-full" />
                                : <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-burgundy/30" /></div>}
                            </div>
                            <p className="font-body text-burgundy text-sm font-medium line-clamp-2 max-w-[180px]">{p.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-body text-burgundy/60 text-sm capitalize">{p.category}</td>
                        <td className="px-4 py-4">
                          <p className="font-body text-burgundy text-sm font-medium">₦{(p.salePrice ?? p.price).toLocaleString()}</p>
                          {p.salePrice && <p className="font-body text-burgundy/40 text-xs line-through">₦{p.price.toLocaleString()}</p>}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`font-body text-sm ${p.stock > 5 ? 'text-green-600' : p.stock > 0 ? 'text-gold' : 'text-red-400'}`}>{p.stock}</span>
                        </td>
                        <td className="px-4 py-4">
                          {p.badge && (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-body font-semibold capitalize ${p.badge === 'new' ? 'bg-burgundy/10 text-burgundy' : p.badge === 'sale' ? 'bg-mauve/10 text-mauve' : 'bg-gold/10 text-gold'}`}>
                              {p.badge}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-blush text-burgundy transition-colors"><Pencil size={14} /></button>
                            <button onClick={() => setDeleteId(p._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ───────────────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div>
            {/* Status filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['all', ...ALL_STATUSES].map(s => (
                <button
                  key={s}
                  onClick={() => setOrderFilter(s)}
                  className={`px-4 py-2 rounded-full font-body text-xs tracking-wide transition-colors capitalize ${
                    orderFilter === s ? 'bg-burgundy text-white' : 'bg-blush text-burgundy hover:bg-blush-dark'
                  }`}
                >
                  {s} {s === 'all' ? `(${allOrders.length})` : `(${allOrders.filter(o => o.status === s).length})`}
                </button>
              ))}
            </div>

            {ordersLoading ? (
              <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="animate-pulse bg-blush/40 rounded-xl h-16" />)}</div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-blush">
                <table className="w-full">
                  <thead className="bg-blush/40">
                    <tr>{['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-body text-burgundy/70 text-xs uppercase tracking-wide">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-blush">
                    {filteredOrders.map(order => {
                      const customer = typeof order.user === 'object' ? (order.user as {name?:string;email?:string}) : null;
                      return (
                        <tr key={order._id} className="hover:bg-blush/20 transition-colors">
                          <td className="px-4 py-3 font-body text-burgundy text-xs font-semibold">#{order._id.slice(-8).toUpperCase()}</td>
                          <td className="px-4 py-3">
                            <p className="font-body text-burgundy text-xs font-medium">{customer?.name || '—'}</p>
                            <p className="font-body text-burgundy/40 text-xs">{customer?.email || ''}</p>
                          </td>
                          <td className="px-4 py-3 font-body text-burgundy/60 text-xs">{order.items.length}</td>
                          <td className="px-4 py-3 font-body text-burgundy text-xs font-semibold">₦{order.totalAmount.toLocaleString()}</td>
                          <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                          <td className="px-4 py-3 font-body text-burgundy/50 text-xs whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setSelectedOrder(order)} className="p-1.5 rounded-lg hover:bg-blush text-burgundy transition-colors">
                                <Eye size={14} />
                              </button>
                              <select
                                value={order.status}
                                onChange={e => handleStatusChange(order._id, e.target.value)}
                                disabled={updatingStatus}
                                className="text-xs font-body text-burgundy bg-blush border-0 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-mauve cursor-pointer"
                              >
                                {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredOrders.length === 0 && (
                      <tr><td colSpan={7} className="px-4 py-10 text-center font-body text-burgundy/40 text-sm">No orders found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── CUSTOMERS TAB ────────────────────────────────────────────────────── */}
        {activeTab === 'customers' && (
          <div>
            {usersLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="animate-pulse bg-blush/40 rounded-xl h-16" />)}</div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-blush">
                <table className="w-full">
                  <thead className="bg-blush/40">
                    <tr>{['Customer', 'Email', 'Joined', 'Orders', 'Total Spent', 'Role', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-body text-burgundy/70 text-xs uppercase tracking-wide">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-blush">
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-blush/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-mauve flex items-center justify-center text-white text-xs font-semibold font-body shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <p className="font-body text-burgundy text-sm font-medium">{u.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-body text-burgundy/60 text-xs">{u.email}</td>
                        <td className="px-4 py-3 font-body text-burgundy/50 text-xs">
                          {new Date(u.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3 font-body text-burgundy text-xs font-semibold">{u.orderCount}</td>
                        <td className="px-4 py-3 font-body text-burgundy text-xs font-semibold">₦{u.totalSpent.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          {u.isAdmin
                            ? <span className="px-2.5 py-1 rounded-full text-xs font-body font-semibold bg-burgundy/10 text-burgundy">Admin</span>
                            : <span className="px-2.5 py-1 rounded-full text-xs font-body font-semibold bg-blush text-burgundy/60">Customer</span>}
                        </td>
                        <td className="px-4 py-3">
                          {u._id !== user?.id && (
                            <button
                              onClick={() => handlePromote(u._id, !u.isAdmin)}
                              disabled={promotingUserId === u._id}
                              className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-colors disabled:opacity-50 ${
                                u.isAdmin
                                  ? 'border border-red-300 text-red-500 hover:bg-red-50'
                                  : 'border border-burgundy/30 text-burgundy hover:bg-blush'
                              }`}
                            >
                              {promotingUserId === u._id
                                ? <Loader2 size={12} className="animate-spin inline" />
                                : u.isAdmin ? 'Remove Admin' : 'Make Admin'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-10 text-center font-body text-burgundy/40 text-sm">No customers yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Order detail slide-over ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-3xl w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-burgundy px-6 py-4 rounded-t-3xl flex items-center justify-between">
                <div>
                  <h2 className="font-display text-white tracking-wide">Order #{selectedOrder._id.slice(-8).toUpperCase()}</h2>
                  <p className="font-body text-white/50 text-xs mt-0.5">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-white/60 hover:text-white"><X size={20} /></button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status update */}
                <div className="flex items-center gap-3">
                  <StatusBadge status={selectedOrder.status} />
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="font-body text-burgundy/60 text-xs">Change status:</span>
                    <select
                      value={selectedOrder.status}
                      onChange={e => handleStatusChange(selectedOrder._id, e.target.value)}
                      disabled={updatingStatus}
                      className="text-xs font-body text-burgundy bg-blush border border-blush-dark rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-mauve"
                    >
                      {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {updatingStatus && <Loader2 size={14} className="animate-spin text-mauve" />}
                  </div>
                </div>

                {/* Customer info */}
                {typeof selectedOrder.user === 'object' && (
                  <div className="bg-blush/30 rounded-xl p-4">
                    <p className="font-body text-burgundy/50 text-xs uppercase tracking-wide mb-2">Customer</p>
                    <p className="font-body text-burgundy font-medium">{(selectedOrder.user as {name?:string}).name}</p>
                    <p className="font-body text-burgundy/60 text-xs">{(selectedOrder.user as {email?:string}).email}</p>
                  </div>
                )}

                {/* Items */}
                <div>
                  <p className="font-body text-burgundy/50 text-xs uppercase tracking-wide mb-3">Items ({selectedOrder.items.length})</p>
                  <ul className="space-y-3">
                    {selectedOrder.items.map((item, i) => {
                      const product = item.product as { name?: string; images?: string[] } | string;
                      const name = typeof product === 'object' ? product.name : 'Product';
                      const img = typeof product === 'object' ? product.images?.[0] : undefined;
                      return (
                        <li key={i} className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded-lg overflow-hidden bg-blush shrink-0">
                            {img && <Image src={img} alt={name || ''} width={40} height={48} className="object-cover w-full h-full" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-burgundy text-xs font-medium truncate">{name}</p>
                            <p className="font-body text-burgundy/40 text-xs">{[item.size, item.color].filter(Boolean).join(' · ')} · Qty {item.quantity}</p>
                          </div>
                          <p className="font-body text-burgundy text-xs font-semibold shrink-0">₦{(item.price * item.quantity).toLocaleString()}</p>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Shipping address */}
                {selectedOrder.shippingAddress && (
                  <div className="bg-blush/30 rounded-xl p-4">
                    <p className="font-body text-burgundy/50 text-xs uppercase tracking-wide mb-2">Shipping Address</p>
                    <p className="font-body text-burgundy text-sm font-medium">{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                    <p className="font-body text-burgundy/60 text-xs mt-1">{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                    <p className="font-body text-burgundy/60 text-xs">{selectedOrder.shippingAddress.phone}</p>
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-blush pt-4 flex justify-between">
                  <span className="font-body text-burgundy/60 text-sm">Order Total</span>
                  <span className="font-display text-burgundy text-xl">₦{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>

                {selectedOrder.paymentRef && (
                  <div className="flex items-center gap-2">
                    <Check size={13} className="text-green-500" />
                    <p className="font-body text-burgundy/40 text-xs break-all">Ref: {selectedOrder.paymentRef}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Product modal ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-burgundy px-6 py-5 flex items-center justify-between rounded-t-3xl">
                <h2 className="font-display text-white tracking-wide text-lg">{editing ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit(onProductSubmit)} className="p-6 space-y-4">
                {[
                  { name: 'name', label: 'Product Name', placeholder: 'Adire Silk Dress' },
                  { name: 'description', label: 'Description', placeholder: 'A beautiful curated piece…', textarea: true },
                  { name: 'category', label: 'Category', placeholder: 'dress' },
                  { name: 'sizes', label: 'Sizes (comma-separated)', placeholder: 'XS, S, M, L, XL' },
                  { name: 'colors', label: 'Colors (comma-separated)', placeholder: 'Black, Ivory, Navy' },
                ].map(({ name, label, placeholder, textarea }) => (
                  <div key={name}>
                    <label className="block font-body text-burgundy/70 text-xs uppercase tracking-wide mb-1.5">{label}</label>
                    {textarea ? (
                      <textarea {...register(name as keyof ProductForm)} placeholder={placeholder} rows={3} className="w-full px-4 py-3 rounded-xl border border-blush-dark bg-blush/20 font-body text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-mauve text-sm resize-none" />
                    ) : (
                      <input {...register(name as keyof ProductForm)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl border border-blush-dark bg-blush/20 font-body text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-mauve text-sm" />
                    )}
                    {errors[name as keyof ProductForm] && <p className="text-mauve text-xs mt-1">{(errors[name as keyof ProductForm] as { message?: string })?.message}</p>}
                  </div>
                ))}

                <div>
                  <label className="block font-body text-burgundy/70 text-xs uppercase tracking-wide mb-1.5">Product Image</label>
                  <input type="hidden" {...register('images')} />
                  <div className="flex gap-3 items-start">
                    <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors text-sm font-body ${imageUploading ? 'border-mauve bg-mauve/5 text-mauve' : 'border-blush-dark bg-blush/20 text-burgundy/50 hover:border-mauve hover:text-mauve'}`}>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageFile} disabled={imageUploading} />
                      {imageUploading ? <><Loader2 size={15} className="animate-spin" /> Uploading…</> : '📷 Click to upload image'}
                    </label>
                    {(imagePreview || watchedImages) && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-blush shrink-0 border border-blush-dark">
                        <Image src={imagePreview || watchedImages} alt="preview" width={64} height={64} className="object-cover w-full h-full" />
                      </div>
                    )}
                  </div>
                  <p className="font-body text-burgundy/40 text-xs mt-1.5">Or paste a URL below:</p>
                  <input value={watchedImages} onChange={e => { setValue('images', e.target.value); setImagePreview(e.target.value); }} placeholder="https://…" className="w-full mt-1 px-4 py-3 rounded-xl border border-blush-dark bg-blush/20 font-body text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-mauve text-sm" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'price', label: 'Price (₦)' },
                    { name: 'salePrice', label: 'Sale Price (₦)' },
                    { name: 'stock', label: 'Stock' },
                  ].map(({ name, label }) => (
                    <div key={name}>
                      <label className="block font-body text-burgundy/70 text-xs uppercase tracking-wide mb-1.5">{label}</label>
                      <input type="number" {...register(name as keyof ProductForm)} className="w-full px-4 py-3 rounded-xl border border-blush-dark bg-blush/20 font-body text-burgundy focus:outline-none focus:border-mauve text-sm" />
                    </div>
                  ))}
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

                <button type="submit" disabled={saving} className="w-full py-3.5 bg-burgundy text-white rounded-xl font-body text-sm tracking-wide hover:bg-burgundy-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {editing ? 'Save Changes' : 'Add Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Delete confirm ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h3 className="font-display text-burgundy text-xl tracking-wide mb-2">Delete Product?</h3>
              <p className="font-body text-burgundy/60 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-burgundy/20 rounded-xl font-body text-burgundy text-sm hover:bg-blush transition-colors">Cancel</button>
                <button onClick={confirmDelete} disabled={saving} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-body text-sm hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />} Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
