'use client';

import { useState } from 'react';

interface MarginRow {
  id: string;
  product: string;
  unit: number;
  price: number;
  cogs: number;
  discount: number;
  shipping: number;
  takeRate: number;
}

export default function MarginCalcPage() {
  const [rows, setRows] = useState<MarginRow[]>([
    { id: '1', product: 'Collagen', unit: 1, price: 33.99, cogs: 15.34, discount: 0, shipping: 9.00, takeRate: 30 },
    { id: '2', product: 'Collagen', unit: 3, price: 29.00, cogs: 23.76, discount: 0, shipping: 9.00, takeRate: 30 },
    { id: '3', product: 'Probiotic 40B', unit: 1, price: 39.99, cogs: 18.50, discount: 10, shipping: 9.00, takeRate: 30 }
  ]);

  const calculateTotalPrice = (row: MarginRow) => {
    return (row.price * row.unit) + row.shipping;
  };

  const calculateRevenue = (row: MarginRow) => {
    const totalPrice = calculateTotalPrice(row);
    const discountAmount = (totalPrice - row.shipping) * (row.discount / 100);
    const priceAfterDiscount = totalPrice - discountAmount;
    return priceAfterDiscount * (1 - row.takeRate / 100);
  };

  const calculateMargin = (row: MarginRow) => {
    const revenue = calculateRevenue(row);
    const totalCogs = row.cogs * row.unit;
    const margin = ((revenue - totalCogs - row.shipping) / revenue) * 100;
    return isNaN(margin) ? 0 : margin;
  };

  const updateRow = (id: string, field: keyof MarginRow, value: string | number) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, [field]: typeof value === 'string' ? parseFloat(value) || 0 : value } : row
    ));
  };

  const addRow = () => {
    const newId = (Math.max(...rows.map(r => parseInt(r.id))) + 1).toString();
    setRows([...rows, { 
      id: newId, 
      product: 'New Product', 
      unit: 1, 
      price: 0, 
      cogs: 0, 
      discount: 0, 
      shipping: 9.00, 
      takeRate: 30 
    }]);
  };

  const deleteRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  // Calculate totals for summary
  const totalRevenue = rows.reduce((sum, row) => sum + calculateRevenue(row), 0);
  const totalCogs = rows.reduce((sum, row) => sum + (row.cogs * row.unit), 0);
  const totalShipping = rows.reduce((sum, row) => sum + row.shipping, 0);
  const totalProfit = totalRevenue - totalCogs - totalShipping;
  const blendedMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0;

  const recalculateAll = () => {
    // Force a re-render by creating a new array reference
    setRows([...rows]);
  };

  const exportToCSV = () => {
    const headers = ['Product', 'Unit', 'Price', 'COGS', 'Discount %', 'Shipping', 'Total Price', 'Take Rate %', 'Revenue', 'Margin'];
    const csvRows = rows.map(row => [
      row.product,
      row.unit,
      row.price.toFixed(2),
      row.cogs.toFixed(2),
      row.discount,
      row.shipping.toFixed(2),
      calculateTotalPrice(row).toFixed(2),
      row.takeRate,
      calculateRevenue(row).toFixed(2),
      calculateMargin(row).toFixed(2) + '%'
    ]);
    
    const csv = [headers, ...csvRows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'margin-calculator.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="content-header">
        <h1 className="header-title">Margin Calculator</h1>
        <p className="header-subtitle">Calculate margins with take rates, shipping, and discounts • Add rows to compare scenarios</p>
      </div>

      <div className="content-body">
        {/* Instructions */}
        <div style={{ 
          background: 'rgba(59, 130, 246, 0.1)', 
          border: '1px solid rgba(59, 130, 246, 0.3)', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '24px' 
        }}>
          <div style={{ fontWeight: '700', marginBottom: '8px' }}>📊 How to Use</div>
          <div style={{ fontSize: '13px', color: '#b3b3b3' }}>
            Enter your pricing data in the spreadsheet below. Margins auto-calculate based on: <strong style={{ color: '#fff' }}>Revenue = (Price - Discount) × (1 - Take Rate)</strong> and <strong style={{ color: '#fff' }}>Margin = (Revenue - COGS - Shipping) / Revenue</strong>
          </div>
        </div>

        {/* Spreadsheet Table */}
        <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#181818', borderRadius: '6px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#282828' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>PRODUCT</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>UNIT</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>NEW PRICE</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>COGS</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>DISCOUNT %</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>SHIPPING</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>TOTAL PRICE</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>TAKE RATE %</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>REVENUE</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>MARGIN</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)' }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const totalPrice = calculateTotalPrice(row);
                const revenue = calculateRevenue(row);
                const margin = calculateMargin(row);
                const marginColor = margin >= 50 ? '#1db954' : margin >= 30 ? '#eab308' : '#ef4444';

                return (
                  <tr key={row.id} style={{ borderBottom: index < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <input 
                        type="text" 
                        value={row.product}
                        onChange={(e) => updateRow(row.id, 'product', e.target.value)}
                        style={{ width: '100%', background: 'transparent', border: '1px solid transparent', color: '#fff', padding: '8px', borderRadius: '4px', fontSize: '13px' }}
                      />
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <input 
                        type="number" 
                        value={row.unit}
                        onChange={(e) => updateRow(row.id, 'unit', e.target.value)}
                        style={{ width: '60px', background: '#282828', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }}
                      />
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <input 
                        type="number" 
                        value={row.price}
                        onChange={(e) => updateRow(row.id, 'price', e.target.value)}
                        step="0.01"
                        style={{ width: '80px', background: '#282828', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }}
                      />
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <input 
                        type="number" 
                        value={row.cogs}
                        onChange={(e) => updateRow(row.id, 'cogs', e.target.value)}
                        step="0.01"
                        style={{ width: '80px', background: '#282828', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }}
                      />
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <input 
                        type="number" 
                        value={row.discount}
                        onChange={(e) => updateRow(row.id, 'discount', e.target.value)}
                        style={{ width: '60px', background: '#282828', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }}
                      />
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <input 
                        type="number" 
                        value={row.shipping}
                        onChange={(e) => updateRow(row.id, 'shipping', e.target.value)}
                        step="0.01"
                        style={{ width: '70px', background: '#282828', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }}
                      />
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#fff' }}>${totalPrice.toFixed(2)}</span>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <input 
                        type="number" 
                        value={row.takeRate}
                        onChange={(e) => updateRow(row.id, 'takeRate', e.target.value)}
                        style={{ width: '60px', background: '#282828', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }}
                      />
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#3b82f6' }}>${revenue.toFixed(2)}</span>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <span style={{ fontWeight: '700', fontSize: '14px', color: marginColor }}>{margin.toFixed(2)}%</span>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <button 
                        onClick={() => deleteRow(row.id)}
                        disabled={rows.length === 1}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: rows.length === 1 ? '#333' : '#666', 
                          cursor: rows.length === 1 ? 'not-allowed' : 'pointer', 
                          fontSize: '20px',
                          transition: 'color 0.2s'
                        }}
                        onMouseOver={(e) => rows.length > 1 && (e.currentTarget.style.color = '#ef4444')}
                        onMouseOut={(e) => rows.length > 1 && (e.currentTarget.style.color = '#666')}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: 'rgba(29, 185, 84, 0.1)' }}>
                <td colSpan={6} style={{ padding: '12px 16px', fontWeight: '600' }}>Blended Totals</td>
                <td style={{ padding: '12px 8px', textAlign: 'center' }}></td>
                <td style={{ padding: '12px 8px', textAlign: 'center' }}></td>
                <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                  <span style={{ fontWeight: '600', color: '#3b82f6' }}>${totalRevenue.toFixed(2)}</span>
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: '#1db954' }}>{blendedMargin.toFixed(2)}%</span>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button 
            onClick={addRow}
            style={{ 
              padding: '12px 24px', 
              background: '#3b82f6', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '600', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
          >
            <span style={{ fontSize: '16px' }}>+</span> Add Row
          </button>
          <button 
            onClick={recalculateAll}
            style={{ 
              padding: '12px 24px', 
              background: 'rgba(255,255,255,0.1)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '600', 
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            🔄 Recalculate All
          </button>
          <button 
            onClick={exportToCSV}
            style={{ 
              padding: '12px 24px', 
              background: 'rgba(255,255,255,0.1)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '600', 
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            📥 Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Summary</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#181818', borderRadius: '6px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>TOTAL REVENUE</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6' }}>${totalRevenue.toFixed(2)}</div>
          </div>
          <div style={{ background: '#181818', borderRadius: '6px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>TOTAL COGS</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff' }}>${totalCogs.toFixed(2)}</div>
          </div>
          <div style={{ background: '#181818', borderRadius: '6px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>BLENDED MARGIN</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1db954' }}>{blendedMargin.toFixed(2)}%</div>
          </div>
          <div style={{ background: '#181818', borderRadius: '6px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>TOTAL PROFIT</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1db954' }}>${totalProfit.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

