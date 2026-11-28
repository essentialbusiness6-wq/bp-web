import React, { forwardRef } from 'react';
import { Invoice } from '../../../types';
import { formatCurrency, formatDate } from './invoiceExportUtils';

interface ImageProps {
  invoice: Invoice;
  profile: any;
}

// Inline styles ensure perfect rendering in the hidden container
const containerStyle: React.CSSProperties = {
  width: '800px',
  padding: '40px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  color: '#1e293b',
  backgroundColor: '#ffffff',
  boxSizing: 'border-box'
};

const InvoiceImageDocument = forwardRef<HTMLDivElement, ImageProps>(({ invoice, profile }, ref) => {
  return (
    <div ref={ref} style={containerStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <h1 style={{ color: '#4361ee', margin: 0, fontSize: '24px' }}>Business Essentials Prime</h1>
          <p style={{ margin: '5px 0', color: '#64748b', fontSize: '12px' }}>{profile?.full_name || 'Your Business'}</p>
          <p style={{ margin: '2px 0', color: '#64748b', fontSize: '12px' }}>{profile?.email}</p>
          <p style={{ margin: '2px 0', color: '#64748b', fontSize: '12px' }}>{profile?.phone}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: '32px', color: '#1e293b' }}>INVOICE</h2>
          <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}>#{invoice.invoice_number}</p>
          <p style={{ margin: '2px 0', color: '#64748b', fontSize: '12px' }}>Issued: {formatDate(invoice.invoice_date)}</p>
          <p style={{ margin: '2px 0', color: '#64748b', fontSize: '12px' }}>Due: {formatDate(invoice.due_date)}</p>
        </div>
      </div>

      {/* Addresses */}
      <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#4361ee', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Billed From</h3>
          <p style={{ fontWeight: 'bold', margin: '4px 0' }}>{profile?.full_name || 'Business Name'}</p>
          <p style={{ color: '#64748b', fontSize: '12px', margin: '2px 0' }}>{profile?.address}</p>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#4361ee', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Billed To</h3>
          <p style={{ fontWeight: 'bold', margin: '4px 0' }}>{invoice.client_name}</p>
          <p style={{ color: '#64748b', fontSize: '12px', margin: '2px 0' }}>{invoice.client_email}</p>
          <p style={{ color: '#64748b', fontSize: '12px', margin: '2px 0' }}>{invoice.client_address}</p>
        </div>
      </div>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc' }}>
            <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #e2e8f0', fontSize: '12px', color: '#475569' }}>DESCRIPTION</th>
            <th style={{ textAlign: 'right', padding: '12px', borderBottom: '2px solid #e2e8f0', fontSize: '12px', color: '#475569' }}>QTY</th>
            <th style={{ textAlign: 'right', padding: '12px', borderBottom: '2px solid #e2e8f0', fontSize: '12px', color: '#475569' }}>UNIT PRICE</th>
            <th style={{ textAlign: 'right', padding: '12px', borderBottom: '2px solid #e2e8f0', fontSize: '12px', color: '#475569' }}>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items?.map((item: any, idx: number) => (
            <tr key={idx}>
              <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>{item.description}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', textAlign: 'right' }}>{item.quantity}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', textAlign: 'right' }}>{formatCurrency(item.unit_price, invoice.currency)}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(item.total, invoice.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Subtotal</span>
            <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
          </div>
          {invoice.tax_rate > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Tax ({invoice.tax_rate}%)</span>
              <span>{formatCurrency(invoice.tax_amount, invoice.currency)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #e2e8f0', paddingTop: '8px', fontWeight: 'bold', fontSize: '16px', color: '#4361ee' }}>
            <span>TOTAL</span>
            <span>{formatCurrency(invoice.total_amount, invoice.currency)}</span>
          </div>
          {invoice.balance > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: '#ef4444' }}>
              <span>Balance Due</span>
              <span>{formatCurrency(invoice.balance, invoice.currency)}</span>
            </div>
          )}
        </div>
      </div>

      {invoice.notes && (
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#4361ee', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Notes</h3>
          <p style={{ color: '#64748b', fontSize: '12px' }}>{invoice.notes}</p>
        </div>
      )}
    </div>
  );
});

export default InvoiceImageDocument;
