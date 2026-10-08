// src/tools/contractor/ContractorStockModal.jsx
import React, { useState } from 'react';
import { X, Boxes, Check } from 'lucide-react';

export default function ContractorStockModal({
  isOpen,
  onClose,
  consumables = [],
  sites = [],
  onSave
}) {
  const [itemName, setItemName] = useState('Copper Slag Grit Grade G-24');
  const [siteId, setSiteId] = useState(sites[0]?.id || '');
  const [transactionType, setTransactionType] = useState('Inward');
  const [quantity, setQuantity] = useState(50);
  const [unit, setUnit] = useState('MT');
  const [clientRef, setClientRef] = useState('L&T Hazira');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTx = {
      id: 'TX-' + Date.now(),
      item: 'Copper Slag',
      note: `${transactionType.toLowerCase()} • ${quantity} ${unit} • ${clientRef}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const newLog = {
      id: 'LOG-' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      action: transactionType === 'Inward' ? 'Transfer In' : 'Transfer Out',
      details: `${itemName} • ${quantity} ${unit} • ${clientRef}`,
      site: sites.find(s => s.id === siteId)?.name || 'Hazira Yard',
      type: 'transfer'
    };

    onSave(newTx, newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#F7941D] flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Monthly Stock Update</h3>
              <p className="text-[11px] text-slate-500">Record consumable arrival, transfers &amp; consumption.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Consumable Item</label>
            <input
              type="text"
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Transaction Type</label>
              <select
                value={transactionType}
                onChange={e => setTransactionType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              >
                <option value="Inward">Inward / Receipt</option>
                <option value="Outward">Outward / Consumed</option>
                <option value="Transfer">Inter-Site Transfer</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Site Location</label>
              <select
                value={siteId}
                onChange={e => setSiteId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              >
                {sites.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Unit of Measure (UOM)</label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
              >
                <option value="MT">Metric Ton (MT)</option>
                <option value="KG">Kilogram (KG)</option>
                <option value="LTR">Litre (LTR)</option>
                <option value="NOS">Numbers (NOS)</option>
                <option value="BAGS">Bags (50 KG)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Party / Contractor Reference</label>
            <input
              type="text"
              value={clientRef}
              onChange={e => setClientRef(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D94F26] to-[#E8700A] text-white text-xs font-bold hover:brightness-110 shadow-xs transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Update Stock</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
