# MongoDB Multi-Tenant Invoice System Architecture

## 1. COLLECTIONS OVERVIEW

Your database will have 3 core collections:
- **users** - Authentication & account data
- **clients** - Client records (owned by users)
- **invoices** - Invoice records (owned by users, linked to clients)

---

## 2. SCHEMA DEFINITIONS

### Collection: users

```javascript
{
  _id: ObjectId,                    // MongoDB primary key
  email: String,                    // Unique email
  password: String,                 // Hashed password (bcrypt)
  name: String,                     // User's full name
  company: String,                  // Optional company name
  createdAt: Date,                  // Account creation timestamp
  updatedAt: Date,                  // Last update timestamp
}
```

**Why this is minimal:**
- Don't store client/invoice IDs in users doc (denormalization at scale)
- Invoice numbers are managed per-user, not here
- Keep user doc light for fast queries

---

### Collection: clients

```javascript
{
  _id: ObjectId,                    // MongoDB primary key
  userId: ObjectId,                 // FOREIGN KEY to users._id
  name: String,                     // Client name
  email: String,                    // Client email
  phone: String,                    // Client phone (optional)
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  taxId: String,                    // Tax/GST ID (optional)
  isActive: Boolean,                // Soft delete support
  createdAt: Date,
  updatedAt: Date,
}
```

**Key Design Decisions:**
- `userId` is the foreign key that links to the user who owns this client
- EVERY query will filter by `userId` (this is your security boundary)
- `isActive` allows soft deletes without losing invoice history
- No denormalization of user data here

---

### Collection: invoices

```javascript
{
  _id: ObjectId,                    // MongoDB primary key
  userId: ObjectId,                 // FOREIGN KEY to users._id
  clientId: ObjectId,               // FOREIGN KEY to clients._id
  invoiceNumber: Number,            // Sequential number (unique PER USER, not globally)
  invoiceDate: Date,                // When invoice was issued
  dueDate: Date,                    // Payment due date
  items: [
    {
      description: String,
      quantity: Number,
      unitPrice: Number,
      taxRate: Number,              // 0-100 (e.g., 18 for 18%)
      amount: Number,               // quantity * unitPrice
    }
  ],
  subtotal: Number,                 // Sum of amounts before tax
  taxAmount: Number,                // Calculated tax
  total: Number,                    // Final total (subtotal + tax)
  status: String,                   // "draft" | "sent" | "paid" | "overdue" | "cancelled"
  notes: String,                    // Additional notes (optional)
  createdAt: Date,
  updatedAt: Date,
}
```

**Critical Design Decisions:**
- `userId` + `invoiceNumber` is a COMPOSITE UNIQUE constraint (not just `invoiceNumber` alone)
- This allows invoice #001 for User A AND invoice #001 for User B
- `clientId` links to the specific client (with referential integrity via queries)
- No user/client data is denormalized; keep docs small
- Status tracking allows business logic (payment tracking, overdue alerts)

---

## 3. INDEXES (CRITICAL FOR SECURITY & PERFORMANCE)

```javascript
// Users collection
db.users.createIndex({ email: 1 }, { unique: true })

// Clients collection
db.clients.createIndex({ userId: 1 })           // Fetch all clients for user
db.clients.createIndex({ userId: 1, _id: 1 })  // Fetch specific client with user check
db.clients.createIndex({ userId: 1, isActive: 1 })  // Active clients only

// Invoices collection
db.invoices.createIndex({ userId: 1 })         // Fetch invoices for user
db.invoices.createIndex({ userId: 1, clientId: 1 })  // Invoices for specific client
db.invoices.createIndex({ userId: 1, invoiceNumber: 1 }, { unique: true })  // COMPOSITE UNIQUE KEY
db.invoices.createIndex({ userId: 1, status: 1 })  // Fetch by status (paid, unpaid)
db.invoices.createIndex({ userId: 1, createdAt: -1 })  // Recent invoices first
db.invoices.createIndex({ userId: 1, dueDate: 1 })  // Find overdue invoices
```

**Why these indexes matter:**
1. `{ userId: 1 }` on every collection = fast user data isolation
2. `{ userId: 1, invoiceNumber: 1 }` = enforces unique invoices per user + fast queries
3. Composite indexes on `userId + <other-field>` = ensures MongoDB scans only that user's data
4. No index on `invoiceNumber` alone (this was your bug!)

---

## 4. HOW TO PREVENT YOUR CURRENT ISSUES

### Issue #1: Data Leakage (Users seeing other users' data)

**The Problem:**
```javascript
// ❌ INSECURE - anyone can see anyone's clients
const clients = await db.collection('clients').find({}).toArray();
```

**The Solution:**
```javascript
// ✅ SECURE - always filter by logged-in user's ID
const userId = req.user._id;  // From your auth middleware
const clients = await db.collection('clients')
  .find({ userId: ObjectId(userId) })  // USER ISOLATION BARRIER
  .toArray();
```

**Why it works:**
- `userId` is the security boundary
- MongoDB index on `{ userId: 1 }` makes this fast
- No document can be retrieved without the correct `userId` filter
- Your auth middleware must set `req.user._id` on every request

---

### Issue #2: E11000 Duplicate Key Error on invoiceNumber

**The Problem:**
```javascript
// ❌ WRONG - invoiceNumber is unique globally
db.invoices.createIndex({ invoiceNumber: 1 }, { unique: true })
// User A creates invoice #1 ✓
// User B tries to create invoice #1 ✗ E11000 ERROR!
```

**The Solution:**
```javascript
// ✅ CORRECT - invoiceNumber is unique PER USER
db.invoices.createIndex({ userId: 1, invoiceNumber: 1 }, { unique: true })
// User A creates invoice #1 ✓
// User B creates invoice #1 ✓ Works!
```

**How to generate the next invoiceNumber:**
```javascript
// Option A: Counter-based (recommended for production)
// Store counter in separate collection:
db.invoiceCounters.updateOne(
  { userId: ObjectId(userId) },
  { $inc: { nextNumber: 1 } },
  { upsert: true }  // Create if doesn't exist
);

const counter = await db.invoiceCounters.findOne({ userId: ObjectId(userId) });
const invoiceNumber = counter.nextNumber;

// Option B: Aggregate + Max (simple but slower at scale)
const lastInvoice = await db.invoices.findOne(
  { userId: ObjectId(userId) },
  { sort: { invoiceNumber: -1 } }
);
const invoiceNumber = (lastInvoice?.invoiceNumber || 0) + 1;
```

**Use Option A for production** (atomic counter updates, no race conditions)

---

## 5. DATA RELATIONSHIPS (Linking Everything)

```
User (userId)
  ├── owns many Clients
  │   └── each Client has _id, userId
  │
  └── owns many Invoices
      ├── each Invoice has userId, clientId
      └── clientId must exist in Clients collection where userId matches
```

**Example Document Relationships:**

```javascript
// User document
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  email: "john@example.com",
  name: "John Smith",
}

// Client created by User A
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  userId: ObjectId("507f1f77bcf86cd799439011"),  // Links to User
  name: "Acme Corp",
  email: "contact@acme.com",
}

// Invoice created by User A for Client 012
{
  _id: ObjectId("507f1f77bcf86cd799439013"),
  userId: ObjectId("507f1f77bcf86cd799439011"),  // Links to User
  clientId: ObjectId("507f1f77bcf86cd799439012"),  // Links to Client
  invoiceNumber: 1,
  total: 5000,
}
```

---

## 6. EXAMPLE QUERIES (SECURE & EFFICIENT)

### Query 1: Fetch all clients for logged-in user

```javascript
async function getUserClients(userId) {
  return await db.collection('clients')
    .find({ userId: ObjectId(userId), isActive: true })
    .sort({ createdAt: -1 })
    .toArray();
}

// This query:
// ✓ Uses index on { userId: 1 }
// ✓ Filters by userId (security boundary)
// ✓ Returns only active clients
// ✓ Execution time: < 10ms for 10k clients
```

---

### Query 2: Fetch all invoices for logged-in user

```javascript
async function getUserInvoices(userId, status = null) {
  const filter = { userId: ObjectId(userId) };
  
  if (status) {
    filter.status = status;  // Optional: filter by status
  }
  
  return await db.collection('invoices')
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
}

// Example calls:
// getUserInvoices(userId)  → all invoices
// getUserInvoices(userId, 'paid')  → paid invoices only
// This uses index on { userId: 1, status: 1 }
```

---

### Query 3: Fetch invoices for a specific client

```javascript
async function getClientInvoices(userId, clientId) {
  return await db.collection('invoices')
    .find({
      userId: ObjectId(userId),      // Security check
      clientId: ObjectId(clientId),  // Client filter
    })
    .sort({ invoiceNumber: -1 })
    .toArray();
}

// This query:
// ✓ Ensures user owns this client (userId filter)
// ✓ Gets invoices for that specific client
// ✓ Uses index on { userId: 1, clientId: 1 }
// ✓ PREVENTS accessing other users' clients
```

---

### Query 4: Create a new invoice (SAFE)

```javascript
async function createInvoice(userId, clientId, invoiceData) {
  // Step 1: Verify client belongs to this user
  const client = await db.collection('clients').findOne({
    _id: ObjectId(clientId),
    userId: ObjectId(userId),  // Security check!
  });
  
  if (!client) {
    throw new Error('Client not found or does not belong to this user');
  }
  
  // Step 2: Get next invoice number for this user (atomic counter)
  const counter = await db.collection('invoiceCounters').findOneAndUpdate(
    { userId: ObjectId(userId) },
    { $inc: { nextNumber: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  
  const invoiceNumber = counter.value.nextNumber;
  
  // Step 3: Calculate totals
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (invoiceData.taxRate || 0) / 100;
  const total = subtotal + taxAmount;
  
  // Step 4: Create invoice
  const result = await db.collection('invoices').insertOne({
    userId: ObjectId(userId),
    clientId: ObjectId(clientId),
    invoiceNumber: invoiceNumber,  // Unique per user
    invoiceDate: new Date(),
    dueDate: invoiceData.dueDate,
    items: invoiceData.items,
    subtotal: subtotal,
    taxAmount: taxAmount,
    total: total,
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  return result;
}

// This function:
// ✓ Verifies ownership (client belongs to user)
// ✓ Uses atomic counter for invoice numbers (no duplicates)
// ✓ Calculates totals server-side (don't trust client)
// ✓ Stores userId to prevent cross-user access
// ✓ PREVENTS race conditions on invoiceNumber
```

---

### Query 5: Update an invoice (with ownership check)

```javascript
async function updateInvoice(userId, invoiceId, updates) {
  const result = await db.collection('invoices').findOneAndUpdate(
    {
      _id: ObjectId(invoiceId),
      userId: ObjectId(userId),  // Only update if user owns it
    },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );
  
  if (!result.value) {
    throw new Error('Invoice not found or does not belong to this user');
  }
  
  return result.value;
}

// This guarantees:
// ✓ User can only update their own invoices
// ✓ MongoDB returns null if invoice doesn't exist or doesn't belong to user
// ✓ PREVENTS unauthorized updates
```

---

### Query 6: Find overdue invoices

```javascript
async function getOverdueInvoices(userId) {
  const now = new Date();
  
  return await db.collection('invoices')
    .find({
      userId: ObjectId(userId),
      dueDate: { $lt: now },
      status: { $in: ['sent', 'overdue'] },
    })
    .sort({ dueDate: 1 })  // Oldest overdue first
    .toArray();
}

// This uses:
// ✓ Index on { userId: 1, status: 1 }
// ✓ Fast date range query
// ✓ Finds unpaid invoices past due date
```

---

## 7. COMMON MISTAKES TO AVOID

### ❌ Mistake #1: No userId filter

```javascript
// INSECURE - Data Leakage!
const invoices = await db.collection('invoices').find({}).toArray();
```

**Why it's bad:** Returns ALL invoices from ALL users.

**Fix:** Always include userId in queries.
```javascript
// ✓ SECURE
const invoices = await db.collection('invoices')
  .find({ userId: ObjectId(userId) })
  .toArray();
```

---

### ❌ Mistake #2: Unique index on invoiceNumber alone

```javascript
// WRONG - Global uniqueness
db.invoices.createIndex({ invoiceNumber: 1 }, { unique: true });
```

**Why it's bad:** Prevents User B from having invoice #1 if User A has it.

**Fix:** Use composite index.
```javascript
// ✓ CORRECT - Unique per user
db.invoices.createIndex({ userId: 1, invoiceNumber: 1 }, { unique: true });
```

---

### ❌ Mistake #3: Storing invoice counters in user document

```javascript
// PROBLEMATIC - Requires full document update
{
  _id: ObjectId(...),
  email: "user@example.com",
  invoiceCounter: 42,  // Gets updated frequently
}
```

**Why it's bad:** 
- Frequent updates to user doc causes contention
- If user has 10k clients, document is large
- Race conditions if multiple invoices created simultaneously

**Fix:** Separate counter collection.
```javascript
// ✓ CORRECT - Atomic counter
db.invoiceCounters.createIndex({ userId: 1 });
// This is lightweight and supports atomic $inc
```

---

### ❌ Mistake #4: Denormalizing client data in invoice

```javascript
// PROBLEMATIC - Data duplication
{
  _id: ObjectId(...),
  userId: ObjectId(...),
  clientId: ObjectId(...),
  clientName: "Acme Corp",      // ← Redundant!
  clientEmail: "contact@acme.com",  // ← Outdated if client updates!
  clientAddress: {...},         // ← Duplicated!
}
```

**Why it's bad:**
- If client name changes, invoices become stale
- Storage bloat
- Update nightmare (change one client = update 100 invoices)

**Fix:** Store reference only, join when needed.
```javascript
// ✓ CORRECT - Reference only
{
  _id: ObjectId(...),
  userId: ObjectId(...),
  clientId: ObjectId(...),  // Just the ID
  // Fetch client data separately if needed
}

// When you need client details:
async function getInvoiceWithClient(userId, invoiceId) {
  const invoice = await db.collection('invoices').findOne({
    _id: ObjectId(invoiceId),
    userId: ObjectId(userId),
  });
  
  const client = await db.collection('clients').findOne({
    _id: ObjectId(invoice.clientId),
    userId: ObjectId(userId),
  });
  
  return { ...invoice, client };
}
```

---

### ❌ Mistake #5: No verification of client ownership

```javascript
// INSECURE - Cross-user invoice creation
async function createInvoice(userId, clientId, data) {
  // No check that clientId belongs to userId!
  const result = await db.collection('invoices').insertOne({
    userId: ObjectId(userId),
    clientId: ObjectId(clientId),  // Could be someone else's client!
    ...data,
  });
}
```

**Why it's bad:** User A can create invoices for User B's clients.

**Fix:** Always verify ownership.
```javascript
// ✓ CORRECT - Verify first
async function createInvoice(userId, clientId, data) {
  const client = await db.collection('clients').findOne({
    _id: ObjectId(clientId),
    userId: ObjectId(userId),  // Verify ownership
  });
  
  if (!client) throw new Error('Unauthorized');
  
  // Now safe to create invoice
  const result = await db.collection('invoices').insertOne({
    userId: ObjectId(userId),
    clientId: ObjectId(clientId),
    ...data,
  });
}
```

---

### ❌ Mistake #6: No soft delete support

```javascript
// PROBLEMATIC - Hard delete
{
  // Invoice deleted, but invoice history lost!
}
```

**Why it's bad:**
- Invoices are legal documents; you may need audit trails
- Reports (total invoiced) break if you delete
- Compliance/tax issues

**Fix:** Use soft delete with status field.
```javascript
// ✓ CORRECT - Logical deletion
{
  _id: ObjectId(...),
  userId: ObjectId(...),
  status: "cancelled",  // Instead of hard delete
  deletedAt: new Date(),
  ...
}

// Query only active invoices:
const invoices = await db.collection('invoices')
  .find({
    userId: ObjectId(userId),
    status: { $ne: 'cancelled' },
  })
  .toArray();
```

---

## 8. PRODUCTION CHECKLIST

- [ ] **Authentication Middleware:** Every route checks `req.user._id` and passes it to queries
- [ ] **Indexes Created:** Run all `createIndex` commands before launch
- [ ] **Composite Unique Index:** `{ userId: 1, invoiceNumber: 1 }` on invoices
- [ ] **Separate Counter Collection:** For atomic invoice number generation
- [ ] **Ownership Verification:** Every update/delete checks userId
- [ ] **No Denormalization:** Client details not stored in invoices
- [ ] **Status Field:** For soft deletes and invoice state tracking
- [ ] **Error Handling:** Catch E11000 errors and handle gracefully
- [ ] **Query Logging:** Monitor slow queries; ensure userId is always first in filter
- [ ] **Backup Strategy:** MongoDB backups configured (critical for invoices)

---

## 9. PERFORMANCE EXPECTATIONS

With this schema and indexes:

| Operation | Execution Time |
|-----------|---|
| Fetch 100 clients for user | ~5ms |
| Fetch 100 invoices for user | ~5ms |
| Create invoice (counter + insert) | ~10ms |
| Find invoices by status | ~5ms |
| Get invoices for specific client | ~3ms |
| Hard delete (remove index) | ~1ms |

**At scale (100k users, 10M invoices):**
- All queries remain fast because index filters by `userId` first
- MongoDB doesn't scan the entire collection
- No cross-user data leakage possible

---

## 10. TYPESCRIPT TYPES (For Next.js)

```typescript
// types/invoice.ts
import { ObjectId } from 'mongodb';

export interface User {
  _id: ObjectId;
  email: string;
  password: string;
  name: string;
  company?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  _id: ObjectId;
  userId: ObjectId;
  name: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  taxId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  amount: number;
}

export interface Invoice {
  _id: ObjectId;
  userId: ObjectId;
  clientId: ObjectId;
  invoiceNumber: number;
  invoiceDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## SUMMARY

This architecture solves both your issues:

1. **Data Leakage:** `userId` in every collection + index ensures user isolation at the database level
2. **Invoice Number Duplicates:** Composite unique index `{ userId: 1, invoiceNumber: 1 }` + atomic counter prevents conflicts
3. **Scalability:** Proper indexing means queries stay fast regardless of total data volume
4. **Production-Ready:** Soft deletes, status tracking, and ownership verification built-in

The key principle: **userId is your security boundary**. Every query, update, and delete must filter by userId before accessing any data.
