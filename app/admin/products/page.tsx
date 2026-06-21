'use client';

import { useState, useCallback } from 'react';
import { Product, Category, CATEGORIES, FABRICS } from '@/lib/types';
import { formatINR } from '@/lib/format';

const EMPTY: Partial<Product> = {
  name: '',
  sku: '',
  description: '',
  price: 0,
  images: [],
  category: 'saree',
  fabric: 'Silk',
  size_guide: '',
  in_stock: true,
};

export default function AdminProductsPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (pw: string) => {
    setLoading(true);
    setMessage('');
    const res = await fetch('/api/admin/products', {
      headers: { 'x-admin-password': pw },
    });
    setLoading(false);
    if (res.status === 401) {
      setMessage('Incorrect password.');
      return false;
    }
    const data = await res.json();
    setProducts(data.products || []);
    return true;
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const ok = await load(password);
    if (ok) setAuthed(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const isUpdate = Boolean(editing.id);
    const res = await fetch('/api/admin/products', {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(editing),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Save failed.');
      return;
    }
    setMessage(isUpdate ? 'Product updated.' : 'Product created.');
    setEditing(null);
    await load(password);
  }

  async function remove(id: string) {
    if (!confirm('Delete this product?')) return;
    const res = await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Delete failed.');
      return;
    }
    setMessage('Product deleted.');
    await load(password);
  }

  if (!authed) {
    return (
      <div className="container-px py-20 max-w-sm mx-auto">
        <h1 className="font-serif text-3xl mb-6 text-center">Admin Login</h1>
        <form onSubmit={login} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="input"
            required
          />
          <button type="submit" className="btn-gold w-full" disabled={loading}>
            {loading ? 'Checking…' : 'Login'}
          </button>
          {message && <p className="text-sm text-red-600 text-center">{message}</p>}
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">
          Default password is <code>changeme</code> (set <code>ADMIN_PASSWORD</code> in
          env).
        </p>
      </div>
    );
  }

  return (
    <div className="container-px py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Manage Products</h1>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-gold">
          + Add Product
        </button>
      </div>

      {message && (
        <p className="mb-4 text-sm bg-gold/10 border border-gold/30 text-gold-dark px-3 py-2 rounded-sm">
          {message}
        </p>
      )}

      {/* Editor */}
      {editing && (
        <form
          onSubmit={save}
          className="border border-gray-200 rounded-sm p-5 mb-8 grid md:grid-cols-2 gap-4"
        >
          <h2 className="md:col-span-2 font-serif text-xl">
            {editing.id ? 'Edit Product' : 'New Product'}
          </h2>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="input"
              value={editing.name ?? ''}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input
              className="input"
              value={editing.sku ?? ''}
              onChange={(e) => setEditing({ ...editing, sku: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              className="input"
              value={editing.price ?? 0}
              onChange={(e) =>
                setEditing({ ...editing, price: Number(e.target.value) })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="input"
              value={editing.category}
              onChange={(e) =>
                setEditing({ ...editing, category: e.target.value as Category })
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fabric</label>
            <select
              className="input"
              value={editing.fabric}
              onChange={(e) => setEditing({ ...editing, fabric: e.target.value })}
            >
              {FABRICS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 pt-7">
            <input
              type="checkbox"
              id="in_stock"
              checked={editing.in_stock ?? true}
              onChange={(e) => setEditing({ ...editing, in_stock: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
            <label htmlFor="in_stock" className="text-sm">
              In stock
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Image URLs (comma separated)
            </label>
            <input
              className="input"
              value={(editing.images ?? []).join(', ')}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  images: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="https://...jpg, https://...jpg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="input"
              rows={3}
              value={editing.description ?? ''}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Size Guide</label>
            <textarea
              className="input"
              rows={2}
              value={editing.size_guide ?? ''}
              onChange={(e) => setEditing({ ...editing, size_guide: e.target.value })}
            />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-gold">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-200 text-gray-500">
              <th className="py-2 pr-4">SKU</th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gray-100">
                <td className="py-2 pr-4 font-mono text-xs">{p.sku}</td>
                <td className="py-2 pr-4">{p.name}</td>
                <td className="py-2 pr-4 capitalize">{p.category}</td>
                <td className="py-2 pr-4">{formatINR(p.price)}</td>
                <td className="py-2 pr-4">
                  {p.in_stock ? (
                    <span className="text-green-700">In stock</span>
                  ) : (
                    <span className="text-red-600">Out</span>
                  )}
                </td>
                <td className="py-2 pr-4 whitespace-nowrap">
                  <button
                    onClick={() => setEditing(p)}
                    className="text-gold-dark hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        Note: Add/edit/delete require a connected Supabase database. Without it, the
        list shows seed data in read-only mode.
      </p>
    </div>
  );
}
