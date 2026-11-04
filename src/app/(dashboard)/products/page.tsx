"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useBusiness } from "@/context/BusinessContext";
import { ProductItem } from "@/mock/mockData";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  Package,
  Plus,
  Upload,
  Search,
  ChevronRight,
  ChevronDown,
  GitBranch,
  Pencil,
  Trash2,
  AlertCircle,
  FileSpreadsheet,
  X,
  Check,
} from "lucide-react";

export default function ProductsPage() {
  const {
    activeBusiness,
    businessFlows,
    defaultFlow,
    products,
    addProduct,
    updateProductFlow,
    updateProduct,
    deleteProduct,
    importProducts,
    showToast,
  } = useBusiness();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [selectedFlowFilter, setSelectedFlowFilter] = useState("all");

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);

  // Add Product Form State
  const [newProductId, setNewProductId] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newProductFlowId, setNewProductFlowId] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");

  // Edit Product Form State
  const [editProductId, setEditProductId] = useState("");
  const [editProductName, setEditProductName] = useState("");
  const [editProductFlowId, setEditProductFlowId] = useState("");
  const [editProductPrice, setEditProductPrice] = useState("");

  // CSV Upload State
  const [csvText, setCsvText] = useState("");
  const [parsedRows, setParsedRows] = useState<
    Array<{ productId: string; name: string; flowId: string; flowName: string; price?: string }>
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const hasFlows = businessFlows.length > 0;

  // Set default flow when Add modal opens or activeBusiness changes
  useEffect(() => {
    if (defaultFlow) {
      setNewProductFlowId(defaultFlow.id);
    } else if (businessFlows.length > 0) {
      setNewProductFlowId(businessFlows[0].id);
    } else {
      setNewProductFlowId("");
    }
  }, [defaultFlow, businessFlows, addModalOpen]);

  // Close modals on Escape, window blur, or backdrop click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAddModalOpen(false);
        setUploadModalOpen(false);
        setEditingProduct(null);
        setProductToDelete(null);
      }
    };
    const handleBlur = () => {
      setAddModalOpen(false);
      setUploadModalOpen(false);
      setEditingProduct(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  // Filter products by search and flow
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.productId.toLowerCase().includes(search.toLowerCase());
      const matchesFlow =
        selectedFlowFilter === "all" || p.flowId === selectedFlowFilter;
      return matchesSearch && matchesFlow;
    });
  }, [products, search, selectedFlowFilter]);

  // Handle opening Add Modal
  const handleOpenAddModal = () => {
    if (!hasFlows) {
      showToast("Please create a call flow first before adding products.", "warning");
      return;
    }
    setNewProductId(`PRD-${Math.floor(100 + Math.random() * 900)}`);
    setNewProductName("");
    setNewProductPrice("");
    setNewProductFlowId(defaultFlow ? defaultFlow.id : businessFlows[0]?.id || "");
    setAddModalOpen(true);
  };

  // Submit Add Product
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductId.trim() || !newProductName.trim()) {
      showToast("Product ID and Name are required.", "warning");
      return;
    }
    if (!hasFlows) {
      showToast("Cannot add product without an available flow.", "error");
      return;
    }

    const assignedFlow = businessFlows.find((f) => f.id === newProductFlowId) || defaultFlow || businessFlows[0];

    addProduct({
      businessId: activeBusiness.id,
      productId: newProductId.trim(),
      name: newProductName.trim(),
      flowId: assignedFlow.id,
      flowName: assignedFlow.name,
      price: newProductPrice.trim() || undefined,
    });

    setAddModalOpen(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setEditProductId(p.productId);
    setEditProductName(p.name);
    setEditProductFlowId(p.flowId);
    setEditProductPrice(p.price || "");
  };

  // Submit Edit Product
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editProductId.trim() || !editProductName.trim()) {
      showToast("Product ID and Name are required.", "warning");
      return;
    }

    const targetFlow = businessFlows.find((f) => f.id === editProductFlowId) || defaultFlow || businessFlows[0];

    updateProduct({
      ...editingProduct,
      productId: editProductId.trim(),
      name: editProductName.trim(),
      flowId: targetFlow ? targetFlow.id : editingProduct.flowId,
      flowName: targetFlow ? targetFlow.name : editingProduct.flowName,
      price: editProductPrice.trim() || undefined,
    });

    setEditingProduct(null);
  };

  // Handle Quick Inline Flow Switch
  const handleQuickFlowChange = (productId: string, newFlowId: string) => {
    const flow = businessFlows.find((f) => f.id === newFlowId);
    if (flow) {
      updateProductFlow(productId, flow.id, flow.name);
    }
  };

  // Parse CSV text
  const parseCsvData = (text: string) => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length === 0) {
      setParsedRows([]);
      return;
    }

    const rows: Array<{
      productId: string;
      name: string;
      flowId: string;
      flowName: string;
      price?: string;
    }> = [];

    // Check if first line is header
    const startIndex = lines[0].toLowerCase().includes("id") || lines[0].toLowerCase().includes("name") ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(",").map((p) => p.trim());
      if (parts.length >= 2) {
        const id = parts[0];
        const name = parts[1];
        const flowQuery = parts[2] || "";
        const price = parts[3] || undefined;

        // Find flow or use default
        let matchedFlow = businessFlows.find(
          (f) =>
            f.id.toLowerCase() === flowQuery.toLowerCase() ||
            f.name.toLowerCase().includes(flowQuery.toLowerCase())
        );
        if (!matchedFlow) {
          matchedFlow = defaultFlow || businessFlows[0];
        }

        if (id && name && matchedFlow) {
          rows.push({
            productId: id,
            name,
            flowId: matchedFlow.id,
            flowName: matchedFlow.name,
            price,
          });
        }
      }
    }
    setParsedRows(rows);
  };

  // Handle CSV file selection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCsvText(content);
        parseCsvData(content);
      }
    };
    reader.readAsText(file);
  };

  // Submit CSV Import
  const handleImportSubmit = () => {
    if (parsedRows.length === 0) {
      showToast("No valid product rows parsed.", "warning");
      return;
    }

    const itemsToImport = parsedRows.map((r) => ({
      businessId: activeBusiness.id,
      productId: r.productId,
      name: r.name,
      flowId: r.flowId,
      flowName: r.flowName,
      price: r.price,
    }));

    importProducts(itemsToImport);
    setUploadModalOpen(false);
    setCsvText("");
    setParsedRows([]);
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-16">
      {/* 1. Header (No colorful cards on top!) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant/70 mb-1">
            <span>Dashboard</span>
            <ChevronRight size={13} />
            <span className="text-[#9a55ff] font-bold">Products</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Package size={20} />
            </span>
            Products
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">
            Manage product catalog and assigned call flows for{" "}
            <strong className="text-on-surface font-bold">{activeBusiness.name}</strong>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              if (!hasFlows) {
                showToast("Please create a call flow first before uploading products.", "warning");
                return;
              }
              setCsvText("");
              setParsedRows([]);
              setUploadModalOpen(true);
            }}
            className="px-4 py-2 rounded-full bg-white dark:bg-[#1a1329] hover:bg-surface-container text-on-surface font-bold text-xs sm:text-sm border border-outline-variant/30 shadow-2xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            type="button"
          >
            <Upload size={16} className="text-[#9a55ff]" />
            <span>Upload Products</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="btn-gradient-primary text-white text-xs sm:text-sm px-4 py-2 rounded-full inline-flex items-center gap-2 font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* 2. Flow Readiness Warning Banner (if no flows ready) */}
      {!hasFlows && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-bold text-sm">No Call Flows Configured</p>
              <p className="text-xs opacity-90 mt-0.5">
                To add or import products, {activeBusiness.name} must have at least one active or default call flow ready.
              </p>
            </div>
          </div>
          <Link
            href="/flows/builder/new"
            className="btn-gradient-warning px-4 py-1.5 rounded-full text-xs font-bold text-gray-950 shadow-xs hover:shadow transition active:scale-95 shrink-0"
          >
            Create Flow
          </Link>
        </div>
      )}

      {/* 3. Products Table Card (With Total Products Count in Header) */}
      <div className="bg-white dark:bg-[#1a1329] rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        {/* Table Controls Bar with Total Count */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID or name..."
                className="w-full pl-9 pr-3.5 py-1.5 bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium rounded-full border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30 shadow-2xs"
                type="text"
              />
            </div>

            {/* Filter by Assigned Flow */}
            <div className="flex items-center gap-2">
              <select
                value={selectedFlowFilter}
                onChange={(e) => setSelectedFlowFilter(e.target.value)}
                className="bg-surface-container-low text-on-surface text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30 cursor-pointer"
              >
                <option value="all">All Flows</option>
                {businessFlows.map((flow) => (
                  <option key={flow.id} value={flow.id}>
                    {flow.name} {flow.isDefault ? "(Default)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Total Products Count Badge */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs sm:text-sm font-semibold text-on-surface-variant bg-surface-container-low px-3.5 py-1.5 rounded-full border border-outline-variant/30 flex items-center gap-2 shadow-2xs">
              <Package size={15} className="text-[#9a55ff]" />
              <span>
                Total Products: <strong className="text-on-surface font-bold">{products.length}</strong>
              </span>
            </span>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" style={{ minWidth: "720px" }}>
            <thead>
              <tr className="bg-surface-container-low/70 text-on-surface text-xs font-bold uppercase tracking-wider border-b border-outline-variant/20">
                <th className="px-5 py-3.5 w-16">#</th>
                <th className="px-5 py-3.5">Product ID</th>
                <th className="px-5 py-3.5">Product Name</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Assigned Flow</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-sm text-on-surface">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Package size={32} className="text-on-surface-variant/40" />
                      <p className="font-semibold text-sm">
                        {search || selectedFlowFilter !== "all"
                          ? "No products matching your search criteria."
                          : "No products added for this business yet."}
                      </p>
                      {hasFlows && !search && selectedFlowFilter === "all" && (
                        <button
                          onClick={handleOpenAddModal}
                          className="mt-2 text-xs font-bold text-[#9a55ff] hover:underline cursor-pointer"
                        >
                          + Add your first product
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, index) => {
                  const isCurrentDefaultFlow = defaultFlow?.id === p.flowId;
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-surface-container-lowest/70 transition-colors"
                    >
                      {/* Index */}
                      <td className="px-5 py-3.5 text-xs text-on-surface-variant font-mono">
                        {index + 1}
                      </td>

                      {/* Product ID */}
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-bold bg-surface-container-low px-2.5 py-1 rounded-md border border-outline-variant/30 text-on-surface">
                          {p.productId}
                        </span>
                      </td>

                      {/* Product Name */}
                      <td className="px-5 py-3.5 font-bold text-on-surface">
                        {p.name}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-3.5 font-medium text-xs sm:text-sm text-on-surface-variant font-mono">
                        {p.price || "—"}
                      </td>

                      {/* Assigned Flow (Inline Editable on the fly) */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="relative inline-block">
                            <select
                              value={p.flowId}
                              onChange={(e) => handleQuickFlowChange(p.id, e.target.value)}
                              className="appearance-none bg-surface-container-low hover:bg-surface-container text-xs font-bold text-on-surface pl-7 pr-7 py-1.5 rounded-full border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30 transition cursor-pointer shadow-2xs"
                              title="Change assigned flow"
                            >
                              {businessFlows.map((flow) => (
                                <option key={flow.id} value={flow.id}>
                                  {flow.name} {flow.isDefault ? "(Default)" : ""}
                                </option>
                              ))}
                            </select>
                            <GitBranch
                              size={13}
                              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9a55ff] pointer-events-none"
                            />
                            <ChevronDown
                              size={13}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                            />
                          </div>

                          {isCurrentDefaultFlow && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-[#9a55ff] border border-purple-500/20">
                              Default
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-[#9a55ff] hover:bg-surface-container transition cursor-pointer"
                            title="Edit Product"
                            type="button"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                            title="Delete Product"
                            type="button"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant font-medium">
          <span>
            Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
          </span>
          {defaultFlow && (
            <span className="hidden sm:inline">
              Default Flow: <strong className="text-on-surface">{defaultFlow.name}</strong>
            </span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. Add Product Modal */}
      {addModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setAddModalOpen(false);
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-[#1a1329] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-5">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                  <Package size={17} />
                </div>
                <h3 className="text-lg font-bold text-on-surface">Add New Product</h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Product ID / SKU <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  placeholder="e.g. PRD-109 or SKU-884"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Aromatic Chinigura Rice 1kg"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Assigned Call Flow <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newProductFlowId}
                  onChange={(e) => setNewProductFlowId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30 cursor-pointer"
                >
                  {businessFlows.map((flow) => (
                    <option key={flow.id} value={flow.id}>
                      {flow.name} {flow.isDefault ? "(Default Flow)" : ""}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Initially defaults to the store default flow. You can change this anytime.
                </p>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Unit Price (Optional)
                </label>
                <input
                  type="text"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  placeholder="e.g. ৳ 350"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-outline-variant/30 text-on-surface text-xs font-semibold hover:bg-surface-container transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient-primary text-white font-bold text-xs px-5 py-2 rounded-full shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Product Modal */}
      {editingProduct && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingProduct(null);
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-[#1a1329] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-5">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                  <Pencil size={16} />
                </div>
                <h3 className="text-lg font-bold text-on-surface">Edit Product</h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Product ID / SKU <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editProductId}
                  onChange={(e) => setEditProductId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editProductName}
                  onChange={(e) => setEditProductName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Assigned Call Flow <span className="text-rose-500">*</span>
                </label>
                <select
                  value={editProductFlowId}
                  onChange={(e) => setEditProductFlowId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30 cursor-pointer"
                >
                  {businessFlows.map((flow) => (
                    <option key={flow.id} value={flow.id}>
                      {flow.name} {flow.isDefault ? "(Default Flow)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Unit Price
                </label>
                <input
                  type="text"
                  value={editProductPrice}
                  onChange={(e) => setEditProductPrice(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-full border border-outline-variant/30 text-on-surface text-xs font-semibold hover:bg-surface-container transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient-primary text-white font-bold text-xs px-5 py-2 rounded-full shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Upload Products Modal */}
      {uploadModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setUploadModalOpen(false);
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-[#1a1329] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-info flex items-center justify-center text-white">
                  <FileSpreadsheet size={17} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Upload Products</h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Import multiple products via CSV file or raw data.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              {/* File Upload Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-outline-variant/40 hover:border-[#9a55ff] rounded-2xl p-5 text-center cursor-pointer transition-colors bg-surface-container-low/50"
              >
                <Upload size={24} className="mx-auto text-[#9a55ff] mb-2" />
                <p className="font-bold text-on-surface">
                  Click to select CSV file
                </p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  or paste CSV contents into the text box below
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv,text/csv"
                  className="hidden"
                />
              </div>

              {/* Paste Text Area */}
              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  CSV Data <span className="text-xs font-normal text-on-surface-variant">(Product ID, Name, Flow, Price)</span>
                </label>
                <textarea
                  value={csvText}
                  onChange={(e) => {
                    setCsvText(e.target.value);
                    parseCsvData(e.target.value);
                  }}
                  rows={4}
                  placeholder={`PRD-301, Premium Honey 500g, Order Confirmation Flow, ৳ 500\nPRD-302, Organic Chia Seeds 250g, , ৳ 280`}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30 resize-none"
                />
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Tip: If flow is left empty, the default flow ({defaultFlow?.name || "Standard"}) will be assigned automatically.
                </p>
              </div>

              {/* Parsed Rows Preview */}
              {parsedRows.length > 0 && (
                <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/30 max-h-36 overflow-y-auto space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-on-surface pb-1 border-b border-outline-variant/20">
                    <span>Parsed Preview ({parsedRows.length} rows)</span>
                    <Check size={14} className="text-emerald-500" />
                  </div>
                  {parsedRows.map((r, i) => (
                    <div key={i} className="text-[11px] flex items-center justify-between py-1 text-on-surface-variant border-b border-outline-variant/10 last:border-none">
                      <span className="font-mono font-bold text-on-surface">{r.productId}</span>
                      <span className="truncate max-w-[160px]">{r.name}</span>
                      <span className="text-[#9a55ff] font-semibold truncate max-w-[120px]">{r.flowName}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-outline-variant/30 text-on-surface text-xs font-semibold hover:bg-surface-container transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={parsedRows.length === 0}
                  onClick={handleImportSubmit}
                  className="btn-gradient-primary disabled:opacity-50 text-white font-bold text-xs px-5 py-2 rounded-full shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
                >
                  Import {parsedRows.length} Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => {
          if (productToDelete) {
            deleteProduct(productToDelete.id);
            setProductToDelete(null);
          }
        }}
        title="Delete Product"
        description={`Are you sure you want to remove "${productToDelete?.name}" (${productToDelete?.productId}) from the catalog?`}
        confirmText="Delete"
        variant="danger"
        icon="delete"
      />
    </div>
  );
}
