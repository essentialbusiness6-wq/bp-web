import { PaymentSummary } from '../../../types';

interface PaymentSummaryProps {
  data: PaymentSummary;
}

export default function PaymentSummary({ data }: PaymentSummaryProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  return (
    <section className="payment-summary">
      <div className="summary-card">
        <span>Total Received</span>
        <h3 className="text-success">{formatCurrency(data.total_received, data.currency)}</h3>
      </div>
      <div className="summary-card">
        <span>Outstanding</span>
        <h3 className="text-warning">{formatCurrency(data.outstanding, data.currency)}</h3>
      </div>
      <div className="summary-card">
        <span>Overdue</span>
        <h3 className="text-danger">{formatCurrency(data.overdue, data.currency)}</h3>
      </div>
    </section>
  );
}