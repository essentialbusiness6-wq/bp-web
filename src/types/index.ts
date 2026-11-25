// ================= API RESPONSE TYPES =================

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  published_date: string; // ISO date string
  read_time_minutes: number;
  image_url: string | null;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// ================= ERROR TYPES =================

export interface ApiError {
  message: string;
  status?: number;
  details?: Record<string, string[]>;
}

// ================= CAREERS TYPES =================
export interface JobRole {
  id: string;
  title: string;
  location: string;
  type: string; // e.g., 'Full-time', 'Contract'
  department: string; // e.g., 'Engineering', 'Design'
  applyUrl: string;
}

// ================= CHANGELOG TYPES =================
export type ChangelogCategory = 'new' | 'improvement' | 'fix';

export interface ChangelogEntry {
  id: string;
  date: string; // ISO date string
  category: ChangelogCategory;
  title: string;
  description: string;
}

export interface ChangelogResponse {
  entries: ChangelogEntry[];
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  status: 'active' | 'coming_soon';
}

// ================= AUTH TYPES =================
export interface User {
  id: string;
  email: string;
  full_name: string;
  profile_image?: string | null;
  is_verified: boolean;
  subscription_plan: 'trial' | 'basic' | 'pro';
  created_at: string;
}

// ================= DASHBOARD TYPES =================
export interface DashboardData {
  username: string;
  plan: 'trial' | 'basic' | 'pro';
  profilepicurl: string;
  currency_symbol: string;
  balance: number;
  total_invoices: number;
  paid_invoices: number;
  pending_invoices: number;
  total_revenue: number;
  unread_count: number;
  account: {
    bank_name: string;
    account_number: string;
    account_name: string;
  } | null;
  activities: Array<{
    id: string;
    title: string;
    created_at: string;
    amount: number;
  }>;
  company_data?: {
    revenue_growth: number;
    total_payments: number;
    successful_payments: number;
    total_revenue: number;
    total_invoices: number;
    monthly_income: number;
    monthly_expenses: number;
    monthly_revenue: Array<{ month: string; paid: number; pending: number }>;
    top_clients: Array<{ name: string; invoice_count: number; revenue: number }>;
  };
}

export interface ShareLinkResponse {
  status: string;
  link: string;
  message?: string;
}

// ================= INVOICE TYPES =================
export type InvoiceStatus = 'paid' | 'pending' | 'unpaid' | 'overdue' | 'draft';

export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  due_date: string;
  created_at: string;
  total_paid: number;
  balance: number;
  items: { description: string; quantity: number; unit_price: number; total: number }[];
  notes?: string;
  tax_rate?: number;
  draft_id?: string;
  total?: number;
  amount_paid?: number;
  company_name?: string;
  company_address?: string;
  company_email?: string;
  company_phone?: string;
  client_email?: string;
  client_address?: string;
  client_phone?: string;
  currency_symbol?: string;
  discount?: number;
  invoice_date?: string;
  sub_total?: number;
  tax_amount?: number;

}

// ================= DRAFT TYPES =================
export interface DraftItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Draft {
  id: string;
  draft_number: string;
  client_name: string;
  client_email?: string;
  client_address?: string;
  amount: number;
  currency: string;
  date: string;
  due_date: string;
  created_at: string;
  items: DraftItem[];
  subtotal: number;
  tax: number;
  notes?: string;
}

// ================= CLIENT TYPES =================
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  total_invoices: number;
  outstanding_balance: number;
  currency: string;
  status: 'active' | 'inactive';
  created_at: string;
}


export interface CreateClientData {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
}


// ================= PAYMENT TYPES =================
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'failed';

export interface Payment {
  id: string;
  invoice_id: string;
  invoice_number: string;
  client_name: string;
  date: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
  transaction_reference?: string;
}

export interface PaymentSummary {
  total_received: number;
  outstanding: number;
  overdue: number;
  currency: string;
}



// ================= SETTINGS TYPES =================
export interface UserSettings {
  // Invoice Settings
  invoice_prefix: string;
  next_invoice_number: number;
  default_due_date: number;
  default_tax_rate: number;
  show_tax: boolean;
  show_discount: boolean;
  footer_note: string;
  
  // Localization
  currency: string;
  currency_symbol: string;
  timezone: string;
  date_format: string;
  
  // Notifications
  email_notifications: boolean;
  due_date_reminder: boolean;
  reminder_days_before: number;
  
  // Security
  auto_logout_on_inactivity: boolean;
  auto_logout_minutes: number;
  require_pin_for_delete: boolean;
  two_factor_enabled: boolean;
}

export interface CloseAccountReason {
  reason: string;
  details?: string;
}

// ================= PROFILE TYPES =================
export interface ProfileData {
  fullname: string;
  profilename: string;
  username: string;
  phone: string;
  address: string;
  country: string;
  alternateemail: string;
  website: string;
  bio: string;
  profile_pic: string;
}

// ================= BANK TYPES =================
export interface Bank {
  code: string;
  name: string;
}

export interface BankData {
  bank_code: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  subaccount_id?: string; // Returned by backend after Paystack subaccount creation
  is_verified: boolean;
}

// ================= NOTIFICATION TYPES =================
export type NotificationType = 'payment' | 'invoice' | 'client' | 'system';
export type NotificationStatus = 'read' | 'unread';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  created_at: string;
  link?: string;
}

export interface NotificationFilters {
  type: 'all' | NotificationType;
  status: 'all' | NotificationStatus;
  month: string;
  year: string;
}

// ================= BILLING TYPES =================
export type PlanType = 'trial' | 'basic' | 'pro';
export type BillingCycle = 'monthly' | 'yearly';

export interface Subscription {
  plan: PlanType;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_end: string;
  days_left?: number;
  hours_left?: number;
  minutes_left?: number;
}

export interface CheckoutSessionResponse {
  checkout_url: string;
  reference: string;
}

// ================= FEEDBACK TYPES =================
export type FeedbackType = 'suggestion' | 'bug' | 'compliment';
export type FeedbackStatus = 'pending' | 'reviewed' | 'resolved';

export interface Feedback {
  id: string;
  type: FeedbackType;
  rating: number;
  subject: string;
  message: string;
  notify_me: boolean;
  created_at: string;
  status: FeedbackStatus;
  has_attachment: boolean;
}

// ================= PUBLIC INVOICE TYPES =================
export interface PublicInvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface PublicInvoice {
  id: string;
  invoice_number: string;
  status: 'pending' | 'paid' | 'overdue' | 'draft';
  company_name: string;
  company_address: string;
  company_email: string;
  client_name: string;
  client_address: string;
  client_email: string;
  invoice_date: string;
  due_date: string;
  currency: string;
  currency_symbol: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount: number;
  total: number;
  amount_paid: number;
  balance: number;
  notes: string;
  subaccount_code?: string;
  items: PublicInvoiceItem[];
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

// ================= SECURITY TYPES =================
export interface SecuritySettings {
  two_factor_enabled: boolean;
  biometric_enabled: boolean;
  email_verified: boolean;
  pin_enabled: boolean;
  last_password_change: string;
  security_score: number;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip_address: string;
  location: string;
  last_active: string;
  is_current: boolean;
}

export interface TwoFactorSetupData {
  qr_code_url: string;
  secret_key: string;
}

// ================= TRANSACTION TYPES =================
export type TransactionStatus = 'paid' | 'pending' | 'overdue' | 'failed';

export interface Transaction {
  id: string;
  invoice_id: string;
  invoice_number: string;
  client_name: string;
  date: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
}

export interface TransactionSummary {
  total: number;
  paid: number;
  pending: number;
  overdue: number;
}

// ================= PUBLIC REQUEST TYPES =================
export interface ShareContext {
  creator_name: string;
  currency_symbol: string;
  is_valid: boolean;
}

export interface InvoiceRequestItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

export interface InvoiceRequestData {
  client_name: string;
  client_email: string;
  client_phone?: string;
  client_address?: string;
  items: InvoiceRequestItem[];
  tax_rate: number;
  notes?: string;
}