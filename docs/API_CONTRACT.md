# BEP API Contract

## Contact Form Submission
**Method:** POST  
**Endpoint:** `/api/v1/contact`  
**Purpose:** Submit a contact form inquiry from the landing page.  
**Authentication:** None (Public endpoint, may require rate limiting).  
**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
**Implementation Status:** ⏳ Pending Backend Implementation

## Blog — Get Posts

**Method:** GET  
**Endpoint:** `/api/v1/blog/posts`  
**Purpose:** Retrieve a list of published blog posts, optionally filtered by category or search query.  
**Authentication:** None (Public endpoint).  

**Query Parameters:**
- `category` (optional, string): Filter by category (e.g., "business", "finance").
- `search` (optional, string): Search by post title or excerpt.

**Expected Success Response (200 OK):**
```json
{
  "posts": [
    {
      "id": "uuid-string",
      "title": "10 Proven Strategies to Scale Your Small Business in 2025",
      "excerpt": "Discover the key strategies that successful entrepreneurs are using to grow their businesses...",
      "category": "business",
      "author": "Admin Name",
      "published_date": "2024-12-15T00:00:00Z",
      "read_time_minutes": 8,
      "image_url": "https://images.unsplash.com/..."
    }
  ]
}
**Implementation Status:** ⏳ Pending Backend Implementation

## Changelog — Get Entries

**Method:** GET  
**Endpoint:** `/api/v1/changelog`  
**Purpose:** Retrieve a list of product updates, filtered by category.  
**Authentication:** None (Public endpoint).  

**Query Parameters:**
- `category` (optional, string): Filter by 'new', 'improvement', or 'fix'.

**Expected Success Response (200 OK):**
```json
{
  "entries": [
    {
      "id": "uuid-string",
      "date": "2026-11-10T00:00:00Z",
      "category": "new",
      "title": "Multi-Currency Invoice Support",
      "description": "You can now create invoices in over 150 currencies..."
    }
  ]
}

**Implementation Status:** ⏳ Pending Backend Implementation

## Careers — Get Open Roles

**Method:** GET  
**Endpoint:** `/api/v1/careers/roles`  
**Purpose:** Retrieve a list of currently open job positions..  
**Authentication:** None (Public endpoint).  


**Expected Success Response (200 OK):**
```json
{
  "roles": [
    {
      "id": "uuid-string",
      "title": "Senior Backend Engineer (Python/FastAPI)",
      "location": "Remote",
      "type": "Full-time",
      "department": "Engineering",
      "applyUrl": "/contact?role=Senior+Backend+Engineer"
    }
  ]
}
**Implementation Status:** ⏳ Pending Backend Implementation


## Contact — Submit Message

**Method:** POST  
**Endpoint:** `/api/v1/contact`  
**Purpose:** Submit a contact form inquiry from the website.  
**Authentication:** None (Public endpoint, should be rate-limited).  

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "subject": "string", // e.g., "general", "sales", "support", "partnership"
  "message": "string"
}

**Expected Success Response (200 OK):**
**Implementation Status:** ⏳ Pending Backend Implementation


## Authentication — Login

**Method:** POST  
**Endpoint:** `/api/v1/auth/login`  
**Purpose:** Authenticate an existing user and create an HttpOnly session cookie.  
**Authentication:** None (Public endpoint).  
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "user-password"
}
**Expected Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Jane Doe",
    "is_verified": true,
    "subscription_plan": "trial",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
**Expected Error response (401 Unauthorized):**
```json
{
  "message": "Invalid email or password"
}
**Implementation Status:** ⏳ Pending Backend Implementation

## Authentication — Register
**Method:** POST
**Endpoint:** `/api/v1/auth/register`
**Purpose:** Create a new user account.
**Authentication:** None (Public endpoint).
**Request Body:**
```json
{
  "full_name": "Jane Doe",
  "email": "user@example.com",
  "password": "secure-password",
  "password_confirm": "secure-password"
}
**Expected Success Response (200 OK):**
```json
{
  "message": "Account created. Please verify your email."
}
**Implementation Status:** ⏳ Pending Backend Implementation


## Authentication — Get Current User
**Method:** GET
**Endpoint:** `/api/v1/auth/me`
**Purpose:** Retrieve the currently authenticated user's profile.
**Authentication:** Required (HttpOnly session cookie).
**Expected Success Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "Jane Doe",
  "profile_image": null,
  "is_verified": true,
  "subscription_plan": "trial",
  "created_at": "2024-01-01T00:00:00Z"
}
**Expected Error response (401 Unauthorized):**
```json
{
  "message": "Redirect to login"
}
**Implementation Status:** ⏳ Pending Backend Implementation


## Authentication — Forgot Password
**Method: POST**
**Endpoint:** `/api/v1/auth/forgot-password`
**Purpose:** Send a password reset email to the user.
**Authentication:** None (Public endpoint, rate-limited).
**Request Body:**
```json
{
  "email": "user@example.com"
}
**Expected Success Response (200 OK):**
```json
{
  "message": "If an account exists, a reset link has been sent."
}
**Implementation Status:** ⏳ Pending Backend Implementation


## Authentication — Reset Password
**Method: POST**
**Endpoint:** `/api/v1/auth/reset-password`
**Purpose:** Reset user's password using a valid token.
**Authentication:** None (Token-based).
**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "new-secure-password",
  "password_confirm": "new-secure-password"
}
**Expected Success Response (200 OK):**
```json
{
  "message": "Password reset successful"
}
**Implementation Status:** ⏳ Pending Backend Implementation


## Authentication — Logout
**Method: POST**
**Endpoint:** `/api/v1/auth/logout`
**Purpose:** Invalidate the user's session.
**Authentication:** Required (HttpOnly session cookie).
**Expected Success Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
**Implementation Status:** ⏳ Pending Backend Implementation

## Authentication — Verify 2FA

**Method:** POST  
**Endpoint:** `/api/v1/auth/verify-2fa`  
**Purpose:** Verify the 6-digit TOTP code after initial password check.  
**Authentication:** None (Uses `temp_token` from previous step).  
**Request Body:**
```json
{
  "temp_token": "string",
  "code": "123456"
}
**Expected Success Response (200 OK):** Returns standard session cookie and user object.
**Implementation Status:** ⏳ Pending Backend Implementation


## Authentication — Verify Backup Code
**Method: POST**
**Endpoint:** `/api/v1/auth/verify-backup`
**Purpose:** Verify a backup recovery code when 2FA device is unavailable.
**Authentication:** None (Uses temp_token from previous step).
**Request Body:**
```json
{
  "temp_token": "string",
  "backup_code": "XXXX-XXXX-XXXX"
}
**Expected Success Response (200 OK):** Returns standard session cookie and user object.
**Implementation Status:** ⏳ Pending Backend Implementation

## Authentication — Google Sign-In
**Method: POST**
**Endpoint:** `/api/v1/auth/google`
**Purpose:** Authenticate user using Google Identity Services ID token.
**Authentication:** None (Public endpoint).
**Request Body:**
```json
{
  "credential": "string" // The JWT ID token returned by Google
}
**Expected Success Response (200 OK):** Returns standard session cookie and user object.
**Implementation Status:** ⏳ Pending Backend Implementation


## Dashboard — Get Overview Data

**Method:** GET  
**Endpoint:** `/api/v1/dashboard/data`  
**Purpose:** Retrieve the user's dashboard overview, including balances, stats, and recent activity.  
**Authentication:** Required (HttpOnly session cookie).  
**Expected Success Response (200 OK):** Returns `DashboardData` object (see types).  
**Implementation Status:** ⏳ Pending Backend Implementation

---

## Dashboard — Generate Share Link

**Method:** POST  
**Endpoint:** `/api/v1/invoices/share-link`  
**Purpose:** Generate a temporary, secure link to share an invoice with a client.  
**Authentication:** Required.  
**Request Body:**
```json
{
  "invoice_id": "string"
}
**Expected Success Response (200 OK):** Returns `DashboardData` object (see types).  
```json
{
  "status": "success",
  "link": "https://businessessentia.net/share/abc123xyz"
}
**Implementation Status:** ⏳ Pending Backend Implementation


   ## Invoices — Get List
   **Method:** GET  
   **Endpoint:** `/api/v1/invoices`  
   **Purpose:** Retrieve a list of invoices, optionally filtered by status.  
   **Query Params:** `status` (all, paid, pending, unpaid, overdue), `page`, `limit`  
   **Expected Response:** Array of `Invoice` objects.

   ## Invoices — Delete
   **Method:** DELETE  
   **Endpoint:** `/api/v1/invoices/{invoice_id}`  
   **Purpose:** Permanently delete an invoice.  
   **Expected Response:** `{ "message": "Invoice deleted successfully" }`
   **Implementation Status:** ⏳ Pending Backend Implementation


   ## Drafts — Get List
   **Method:** GET  
   **Endpoint:** `/api/v1/drafts`  
   **Query Params:** `sort` (recent, client, date)  
   **Expected Response:** Array of `Draft` objects.

   ## Drafts — Delete
   **Method:** DELETE  
   **Endpoint:** `/api/v1/drafts/{draft_id}`  

   ## Drafts — Convert to Invoice
   **Method:** POST  
   **Endpoint:** `/api/v1/drafts/{draft_id}/convert`  
   **Expected Response:** `{ "message": "Draft converted", "invoice_id": "uuid" }`

   ## Invoices — Create / Update
**Method:** POST (Create) / PUT (Update)  
**Endpoint:** `/api/v1/invoices` or `/api/v1/invoices/{id}`  
**Purpose:** Create a new invoice or update an existing one. The backend MUST recalculate totals, tax, and discounts authoritatively.  
**Request Body:** `InvoiceFormData` (client info, items array, tax_rate, discount, notes).  
**Expected Response:** The fully calculated and saved `Invoice` object.

## Drafts — Create
**Method:** POST  
**Endpoint:** `/api/v1/drafts`  
**Purpose:** Create a new invoice draft.  
**Request Body:** Same as Invoice Create (client info, items array, tax_rate, discount, notes, status="draft").  
**Expected Response:** The fully calculated and saved `Draft` object.

## Drafts — Update
**Method:** PUT  
**Endpoint:** `/api/v1/drafts/{draft_id}`  
**Purpose:** Update an existing draft. The backend MUST recalculate totals, tax, and discounts authoritatively.  
**Expected Response:** The updated `Draft` object.

   ## Clients — Get List
   **Method:** GET  
   **Endpoint:** `/api/v1/clients`  
   **Query Params:** `search` (optional string)  
   **Expected Response:** Array of `Client` objects.

   ## Clients — Create / Update / Delete
   **Method:** POST `/api/v1/clients`, PUT `/api/v1/clients/{id}`, DELETE `/api/v1/clients/{id}`  
   **Purpose:** Manage client records.  
   **Request Body (POST/PUT):** `{ "name": "string", "email": "string", "phone": "string", "company": "string", "notes": "string" }`


      ## Payments — Get List
   **Method:** GET  
   **Endpoint:** `/api/v1/payments`  
   **Query Params:** `search` (string), `status` (all, paid, pending, overdue, failed)  
   **Expected Response:** Array of `Payment` objects.

   ## Payments — Get Summary
   **Method:** GET  
   **Endpoint:** `/api/v1/payments/summary`  
   **Expected Response:** `{ "total_received": number, "outstanding": number, "overdue": number, "currency": string }`

   ## Payments — Get Details
   **Method:** GET  
   **Endpoint:** `/api/v1/payments/{payment_id}`  
   **Expected Response:** Single `Payment` object with extended details (e.g., `transaction_reference`, `payment_method`).

      ## Me — Get Overview
   **Method:** GET  
   **Endpoint:** `/api/v1/me/overview`  
   **Purpose:** Retrieve the current user's account balance and currency for the profile overview.  
   **Expected Response:** `{ "balance": number, "currency": string }`

   ## Settings — Get All
**Method:** GET  
**Endpoint:** `/api/v1/settings`  
**Expected Response:** `UserSettings` object

## Settings — Update
**Method:** PUT  
**Endpoint:** `/api/v1/settings`  
**Request Body:** Partial `UserSettings` (only fields being changed)

## Settings — Change Password
**Method:** PUT  
**Endpoint:** `/api/v1/settings/password`  
**Request Body:** `{ "current_password": "string", "new_password": "string", "confirm_password": "string" }`

## Settings — Close Account
**Method:** POST  
**Endpoint:** `/api/v1/settings/close-account`  
**Request Body:** `{ "reason": "string", "details": "string?", "password": "string" }`  
**Purpose:** Permanently close user account after confirmation.

## Settings — Export Data
**Method:** GET  
**Endpoint:** `/api/v1/settings/export-data`  
**Expected Response:** JSON file download (Blob)

   ## Profile — Get Data
   **Method:** GET  
   **Endpoint:** `/api/v1/profile`  
   **Expected Response:** `ProfileData` object

   ## Profile — Update
   **Method:** PUT  
   **Endpoint:** `/api/v1/profile`  
   **Request Body:** `ProfileData` (supports `multipart/form-data` for image uploads)

   ## Profile — Get Bank Details
   **Method:** GET  
   **Endpoint:** `/api/v1/profile/bank`  
   **Expected Response:** `BankData` object or `null`

   ## Profile — Update Bank Details
   **Method:** PUT  
   **Endpoint:** `/api/v1/profile/bank`  
   **Request Body:** `{ "bank_code": "string", "account_number": "string", "account_name": "string", "is_verified": true }`

   ## Profile — Verify Bank Account
   **Method:** POST  
   **Endpoint:** `/api/v1/profile/bank/verify`  
   **Request Body:** `{ "bank_code": "string", "account_number": "string" }`  
   **Expected Response:** `{ "account_name": "string" }`

      ## Notifications — Get List
   **Method:** GET  
   **Endpoint:** `/api/v1/notifications`  
   **Query Params:** `type` (all, payment, invoice, client, system), `status` (all, read, unread), `month`, `year`  
   **Expected Response:** Array of `Notification` objects.

   ## Notifications — Mark All Read
   **Method:** POST  
   **Endpoint:** `/api/v1/notifications/mark-all-read`  

   ## Notifications — Clear All
   **Method:** DELETE  
   **Endpoint:** `/api/v1/notifications/clear-all`  

   ## Notifications — Export
   **Method:** GET  
   **Endpoint:** `/api/v1/notifications/export`  
   **Expected Response:** CSV file download (Blob)


   ## Banks — Get List
**Method:** GET  
**Endpoint:** `/api/v1/banks`  
**Purpose:** Fetch list of supported banks (e.g., from Paystack).  
**Expected Response:** `[{ "code": "044", "name": "Access Bank" }, ...]`

## Banks — Resolve Account
**Method:** POST  
**Endpoint:** `/api/v1/banks/resolve`  
**Purpose:** Verify account name before saving (Paystack Resolve Account).  
**Request Body:** `{ "bank_code": "string", "account_number": "string" }`  
**Expected Response:** `{ "account_name": "string" }`

## Profile — Update Bank Details
**Method:** PUT  
**Endpoint:** `/api/v1/profile/bank`  
**Purpose:** Save bank details. **Backend must create a Paystack subaccount** using the resolved details and return the saved record.  
**Request Body:** `{ "bank_code": "string", "account_number": "string", "account_name": "string" }`  
**Expected Response:** `BankData` object (including the newly generated `subaccount_id`).


   ## Billing — Get Subscription
   **Method:** GET  
   **Endpoint:** `/api/v1/billing/subscription`  
   **Expected Response:** `Subscription` object (includes `days_left`, `hours_left`, `minutes_left` for trial users).

   ## Billing — Create Checkout Session
   **Method:** POST  
   **Endpoint:** `/api/v1/billing/checkout`  
   **Request Body:** `{ "plan": "basic" | "pro", "billing_cycle": "monthly" | "yearly" }`  
   **Purpose:** Initialize a Paystack transaction for subscription upgrades. The backend MUST handle Paystack subaccount creation/split logic here if applicable.  
   **Expected Response:** `{ "checkout_url": "string", "reference": "string" }`

      ## Billing — Verify Payment (Optional Frontend Check)
   **Method:** GET  
   **Endpoint:** `/api/v1/billing/verify?reference=<paystack_reference>`  
   **Purpose:** Allow frontend to double-check payment status before showing success. (Note: The backend webhook is the ultimate source of truth for updating the database).

  ## Billing — Paystack Webhook (Backend Only)
**Method: POST**
**Endpoint:** `/api/v1/webhooks/paystack`
**Purpose:** Receive asynchronous payment events from Paystack (charge.success).
**Action:** Backend must verify the Paystack signature, confirm the transaction via Paystack Verify API, update the user's subscription plan in the database, and return 200 OK to Paystack.
**Note:** The frontend relies on this webhook completing before the user's refreshUser() call reflects the new plan.


   ## Feedback — Submit
   **Method:** POST  
   **Endpoint:** `/api/v1/feedback`  
   **Content-Type:** `multipart/form-data`  
   **Request Body:** 
   - `type` (string): 'suggestion', 'bug', or 'compliment'
   - `rating` (integer): 1-5
   - `subject` (string)
   - `message` (string)
   - `notify_me` (boolean)
   - `attachment` (file, optional): Max 5MB

   ## Feedback — Get My Feedback
   **Method:** GET  
   **Endpoint:** `/api/v1/feedback/my-feedback`  
   **Expected Response:** Array of `Feedback` objects.

      ## Public — Get Invoice
   **Method:** GET  
   **Endpoint:** `/api/v1/public/invoices/{invoice_id}`  
   **Purpose:** Allow clients to view invoice details without authentication.  
   **Expected Response:** `PublicInvoice` object.

   ## Public — Verify Paystack Payment
   **Method:** POST  
   **Endpoint:** `/api/v1/public/paystack/verify`  
   **Request Body:** `{ "reference": "string", "invoice_id": "string", "client_name": "string" }`  
   **Purpose:** Verify the Paystack transaction and mark the invoice as paid.  
   **Expected Response:** `{ "success": true, "message": "Payment verified and invoice updated" }`

      ## Rate Us — Submit Rating
   **Method:** POST  
   **Endpoint:** `/api/v1/rate`  
   **Request Body:** `{ "rating": number (1-5), "feedback": string (max 500 chars) }`  
   **Purpose:** Record user feedback and optionally trigger reward logic (e.g., Pro trial).  
   **Expected Response:** `{ "message": "Thank you for your feedback!" }`

      ## Security — Initiate 2FA
   **Method:** POST  
   **Endpoint:** `/api/v1/security/2fa/initiate`  
   **Purpose:** Generate a new TOTP secret and QR code URL for the user.  
   **Expected Response:** `{ "qr_code_url": "data:image/png...", "secret_key": "JBSWY3DPEHPK3PXP" }`

   ## Security — Verify 2FA
   **Method:** POST  
   **Endpoint:** `/api/v1/security/2fa/verify`  
   **Request Body:** `{ "code": "123456" }`  
   **Purpose:** Verify the 6-digit code from the user's authenticator app and enable 2FA.

   ## Security — Disable 2FA
   **Method:** POST  
   **Endpoint:** `/api/v1/security/2fa/disable`  
   **Request Body:** `{ "password": "user_password" }`  
   **Purpose:** Disable 2FA after verifying the user's current password.


      ## Referral — Get Data
   **Method:** GET  
   **Endpoint:** `/api/v1/referral/data`  
   **Purpose:** Fetch the user's unique referral code and their referral statistics.  
   **Expected Response:** `{ "referral_code": "string", "invites_sent": number, "signups": number, "earned": number, "currency": "string" }`


      ## Support — Submit Ticket
   **Method:** POST  
   **Endpoint:** `/api/v1/support/tickets`  
   **Request Body:** `{ "category": "bug" | "feature" | "billing" | "account" | "other", "subject": "string", "message": "string" }`  
   **Expected Response:** Created `Ticket` object.

   ## Support — Get My Tickets
   **Method:** GET  
   **Endpoint:** `/api/v1/support/tickets`  
   **Expected Response:** Array of `Ticket` objects.


      ## Transactions — Get List
   **Method:** GET  
   **Endpoint:** `/api/v1/transactions`  
   **Query Params:** `month` (0-11), `year` (YYYY), `status` (all, paid, pending, overdue)  
   **Expected Response:** Array of `Transaction` objects.

   ## Transactions — Get Summary
   **Method:** GET  
   **Endpoint:** `/api/v1/transactions/summary`  
   **Query Params:** `month` (0-11), `year` (YYYY)  
   **Expected Response:** `{ "total": number, "paid": number, "pending": number, "overdue": number }`

   ## Transactions — Export
   **Method:** GET  
   **Endpoint:** `/api/v1/transactions/export`  
   **Query Params:** Same as Get List  
   **Expected Response:** CSV file download (Blob).

      ## Invoices — Get Details
   **Method:** GET  
   **Endpoint:** `/api/v1/invoices/{invoice_id}`  
   **Purpose:** Fetch full details of a specific invoice for viewing/printing.  
   **Expected Response:** Complete `Invoice` object including `items`, `company_*` fields, and `client_*` fields.

   ## Invoices — Share
   **Method:** POST  
   **Endpoint:** `/api/v1/invoices/{invoice_id}/share`  
   **Purpose:** Generate or retrieve a secure, public payment link for the invoice.  
   **Expected Response:** `{ "share_link": "https://..." }`

   ## Invoices — Generate Client Link
**Method:** POST  
**Endpoint:** `/api/v1/invoices/generate-client-link`  
**Purpose:** Generate a secure, unique, tokenized URL that allows a customer to independently fill out details and generate an invoice (or access a client invoice portal).  
**Authentication:** Required (User must be logged in to generate a link tied to their account).  
**Expected Success Response (201 Created):**
```json
{
  "token": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "share_url": "https://businessessentia.net/client/invoice-request?token=a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
}


   ## Public — Verify Share Token
   **Method:** GET  
   **Endpoint:** `/api/v1/public/invoice-request/verify?token={token}`  
   **Purpose:** Verify if a shared invoice request link is valid and active.  
   **Expected Response:** `{ "creator_name": "string", "currency_symbol": "string", "is_valid": true }`

   ## Public — Submit Invoice Request
   **Method:** POST  
   **Endpoint:** `/api/v1/public/invoice-request/submit?token={token}`  
   **Purpose:** Allow a client to submit their billing details and items to generate an invoice request for the creator.  
   **Request Body:** `InvoiceRequestData` (client details, items array, tax_rate, notes).  
   **Expected Response:** `{ "message": "Invoice request submitted successfully" }`