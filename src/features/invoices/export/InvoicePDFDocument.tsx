import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { Invoice } from '../../../types';
import { formatCurrency, formatDate } from './invoiceExportUtils';

// Professional PDF Styles
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  brand: { fontSize: 20, fontWeight: 'bold', color: '#4361ee', marginBottom: 5 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', textAlign: 'right' },
  subtitle: { fontSize: 12, color: '#64748b', textAlign: 'right' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#4361ee', marginBottom: 8, textTransform: 'uppercase' },
  row: { flexDirection: 'row', marginBottom: 4 },
  col: { flex: 1 },
  label: { color: '#64748b', fontSize: 9 },
  value: { fontSize: 11, fontWeight: 'bold' },
  table: { marginTop: 20, borderBottom: '1pt solid #e2e8f0' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: 8, fontWeight: 'bold', fontSize: 9, color: '#475569' },
  tableRow: { flexDirection: 'row', padding: 8, borderBottom: '1pt solid #f1f5f9' },
  colDesc: { flex: 3 },
  colNum: { flex: 1, textAlign: 'right' },
  totals: { marginTop: 20, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', width: 250, marginBottom: 4 },
  grandTotal: { fontWeight: 'bold', fontSize: 12, color: '#4361ee', borderTop: '1pt solid #e2e8f0', paddingTop: 4, marginTop: 4 },
  footer: { marginTop: 40, paddingTop: 20, borderTop: '1pt solid #e2e8f0', fontSize: 9, color: '#64748b' }
});

interface PDFProps {
  invoice: Invoice;
  profile: any;
}

const InvoicePDFDocument: React.FC<PDFProps> = ({ invoice, profile }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Business Essentials Prime</Text>
          <Text style={styles.label}>{profile?.full_name || 'Your Business'}</Text>
          <Text style={styles.label}>{profile?.email || ''}</Text>
          <Text style={styles.label}>{profile?.phone || ''}</Text>
        </View>
        <View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.subtitle}>#{invoice.invoice_number}</Text>
          <Text style={styles.subtitle}>Issued: {formatDate(invoice.invoice_date)}</Text>
          <Text style={styles.subtitle}>Due: {formatDate(invoice.due_date)}</Text>
        </View>
      </View>

      {/* Billed To / From */}
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.sectionTitle}>Billed From</Text>
          <Text style={styles.value}>{profile?.full_name || profile?.display_name || 'Business Name'}</Text>
          <Text style={styles.label}>{profile?.address || ''}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.sectionTitle}>Billed To</Text>
          <Text style={styles.value}>{invoice.client_name}</Text>
          <Text style={styles.label}>{invoice.client_email}</Text>
          <Text style={styles.label}>{invoice.client_address || ''}</Text>
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>DESCRIPTION</Text>
          <Text style={styles.colNum}>QTY</Text>
          <Text style={styles.colNum}>UNIT PRICE</Text>
          <Text style={styles.colNum}>AMOUNT</Text>
        </View>
        {invoice.items?.map((item: any, idx: number) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={styles.colDesc}>{item.description}</Text>
            <Text style={styles.colNum}>{item.quantity}</Text>
            <Text style={styles.colNum}>{formatCurrency(item.unit_price, invoice.currency)}</Text>
            <Text style={styles.colNum}>{formatCurrency(item.total, invoice.currency)}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text>Subtotal</Text>
          <Text>{formatCurrency(invoice.subtotal, invoice.currency)}</Text>
        </View>
        {invoice.tax_rate > 0 && (
          <View style={styles.totalRow}>
            <Text>Tax ({invoice.tax_rate}%)</Text>
            <Text>{formatCurrency(invoice.tax_amount, invoice.currency)}</Text>
          </View>
        )}
        <View style={[styles.totalRow, styles.grandTotal]}>
          <Text>TOTAL</Text>
          <Text>{formatCurrency(invoice.total_amount, invoice.currency)}</Text>
        </View>
        {invoice.amount_paid > 0 && (
          <View style={styles.totalRow}>
            <Text>Amount Paid</Text>
            <Text>{formatCurrency(invoice.amount_paid, invoice.currency)}</Text>
          </View>
        )}
        {invoice.balance > 0 && (
          <View style={styles.totalRow}>
            <Text>Balance Due</Text>
            <Text>{formatCurrency(invoice.balance, invoice.currency)}</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      {invoice.notes && (
        <View style={styles.footer}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text>{invoice.notes}</Text>
        </View>
      )}
    </Page>
  </Document>
);

export default InvoicePDFDocument;
