import type { Product, Order, ShippingAddress } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL!;

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(params?: Record<string, string>): Promise<Product[]> {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`${BASE}/api/products${qs}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`${BASE}/api/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

export async function createProduct(data: Partial<Product>, token: string): Promise<Product> {
  const res = await fetch(`${BASE}/api/products`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(id: string, data: Partial<Product>, token: string): Promise<Product> {
  const res = await fetch(`${BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE}/api/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function registerUser(data: { name: string; email: string; password: string }) {
  const res = await fetch(`${BASE}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Registration failed');
  return json;
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Login failed');
  return json;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getMyOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${BASE}/api/orders/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function createOrder(
  data: { items: unknown[]; totalAmount: number; shippingAddress: ShippingAddress; paymentRef: string },
  token: string
): Promise<Order> {
  const res = await fetch(`${BASE}/api/orders`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
}
