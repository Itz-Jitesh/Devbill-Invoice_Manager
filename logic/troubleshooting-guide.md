# Troubleshooting Guide: Data Leakage & Duplicate Key Errors

---

## PROBLEM 1: Data Leakage (Users seeing other users' data)

### Symptoms
- User A logs in and sees User B's clients/invoices
- `find({})` queries return documents from all users
- No userId filter in queries

### Root Cause Analysis

```javascript
// ❌ THE PROBLEM: Query without userId filter
const clients = await db.collection('clients')
  .find({})  // ← No filter = returns ALL clients
  .toArray();

// This returns:
[
  { _id: ..., userId: userA_id, name: "Acme Corp" },     ← User A's client
  { _id: ..., userId: userB_id, name: "TechCorp Ltd" },   ← User B's client
  { _id: ..., userId: userC_id, name: "Global Inc" },     ← User C's client
]

// If you render all of these in the UI → data leakage!
```

### Diagnostic Checklist

```javascript
// 1. Check your queries for missing userId filter
db.collection('clients').find({})  // ❌ INSECURE
db.collection('invoices').find({})  // ❌ INSECURE
db.collection('clients').find({ userId: userId })  // ✓ SECURE

// 2. Run this to see if your data is mixed
db.clients.aggregate([
  { $group: { _id: "$userId", count: { $sum: 1 } } }
])
// If you see multiple userIds: data is mixed (expected)
// If count is imbalanced: check for queries without userId filter

// 3. Check your middleware - is userId being extracted?
console.log(req.user)  // Should show userId
console.log(req.userId)  // Should have a value
```

### Fix: Add userId to Every Query

**Before:**
```javascript
export async function getClients() {
  return await db.collection('clients').find({}).toArray();
}
```

**After:**
```javascript
export async function getClients(userId: string) {
  return await db
    .collection('clients')
    .find({ userId: ObjectId(userId) })
    .toArray();
}

// Usage: 
const userId = req.user._id;  // From auth middleware
const clients = await getClients(userId);  // ← Pass userId
```

### Verification

```javascript
// After fix, run this in MongoDB Shell
db.clients.findOne({ userId: ObjectId("USER_A_ID") })
// Returns only User A's clients ✓

// Verify User B can't see User A's clients
db.clients.findOne({ 
  userId: ObjectId("USER_B_ID"),
  _id: ObjectId("USER_A_CLIENT_ID")  // ObjectId from User A
})
// Returns null ✓ (User B can't access User A's client)
```

---

## PROBLEM 2: E11000 Duplicate Key Error on invoiceNumber

### Error Message
```
MongoError: E11000 duplicate key error collection: invoicedb.invoices index: invoiceNumber_1 dup key: { invoiceNumber: 1 }
```

### Root Cause Analysis

```javascript
// ❌ THE PROBLEM: Global unique index on invoiceNumber
db.invoices.createIndex({ invoiceNumber: 1 }, { unique: true })

// User A creates invoice #1
db.invoices.insertOne({
  userId: ObjectId("USER_A"),
  invoiceNumber: 1,  // ✓ Works
})

// User B tries to create invoice #1
db.invoices.insertOne({
  userId: ObjectId("USER_B"),
  invoiceNumber: 1,  // ✗ E11000 Error! Already exists globally
})
```

### Diagnostic Steps

```javascript
// 1. Check your current indexes
db.invoices.getIndexes()

// Look for this (BAD):
[
  { key: { invoiceNumber: 1 }, name: "invoiceNumber_1" }  // ❌ WRONG!
]

// 2. See which invoiceNumbers exist
db.invoices.distinct("invoiceNumber")
// Returns: [1, 2, 3, 4, 5, ...]

// 3. Count duplicates
db.invoices.aggregate([
  { $group: { _id: "$invoiceNumber", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
])
// If this returns anything: duplicates exist! (But this shouldn't happen with unique index)
```

### The Right Index

**Remove the old (bad) index:**
```javascript
db.invoices.dropIndex("invoiceNumber_1")
```

**Create the correct (composite) index:**
```javascript
db.invoices.createIndex(
  { userId: 1, invoiceNumber: 1 },  // ← userId FIRST
  { unique: true }  // Unique combination, not globally
)
```

**Why this works:**
```javascript
// Now both can have invoice #1 (different userIds)
db.invoices.insertOne({
  userId: ObjectId("USER_A"),
  invoiceNumber: 1,  // ✓ Works
})

db.invoices.insertOne({
  userId: ObjectId("USER_B"),
  invoiceNumber: 1,  // ✓ Works! (Different userId)
})

// But User A can't create duplicate #1
db.invoices.insertOne({
  userId: ObjectId("USER_A"),
  invoiceNumber: 1,  // ✗ E11000 Error (User A already has #1)
})
```

### Quick Fix Script

```javascript
// Run this in MongoDB Shell to fix your index
db.invoices.dropIndex("invoiceNumber_1");  // Remove bad index
db.invoices.createIndex(  // Add correct index
  { userId: 1, invoiceNumber: 1 },
  { unique: true }
);
console.log("✓ Index fixed!");
```

### Preventing E11000 in Application Code

```javascript
// Wrap your invoice creation in try-catch
export async function createInvoice(userId, clientId, data) {
  try {
    // Atomic counter generation
    const counter = await db.collection('invoiceCounters').findOneAndUpdate(
      { userId: ObjectId(userId) },
      { $inc: { nextNumber: 1 } },
      { upsert: true, returnDocument: 'after' }
    );

    const invoiceNumber = counter.value.nextNumber;

    // Insert invoice
    const result = await db.collection('invoices').insertOne({
      userId: ObjectId(userId),
      clientId: ObjectId(clientId),
      invoiceNumber,  // Safe: came from atomic counter
      ...data,
      createdAt: new Date(),
    });

    return result;
  } catch (err: any) {
    // ✓ Handle E11000 gracefully
    if (err.code === 11000) {
      console.error('Duplicate invoice number detected!');
      console.error('This should not happen with atomic counter');
      throw new Error('Failed to create invoice. Please try again.');
    }
    throw err;
  }
}
```

### Verification After Fix

```javascript
// Test that User A and B can both create invoice #1
const userA = ObjectId("USER_A_ID");
const userB = ObjectId("USER_B_ID");

// User A creates invoice #1
db.invoices.insertOne({
  userId: userA,
  invoiceNumber: 1,
  total: 1000,
})
// ✓ Success

// User B creates invoice #1
db.invoices.insertOne({
  userId: userB,
  invoiceNumber: 1,
  total: 2000,
})
// ✓ Success (different userId)

// User A tries to create another #1
db.invoices.insertOne({
  userId: userA,
  invoiceNumber: 1,
  total: 500,
})
// ✗ E11000 Error (User A already has #1)
```

---

## PROBLEM 3: How Invoice Numbers are Generated

### The Wrong Way (Race Condition)

```javascript
// ❌ PROBLEMATIC: Find max + increment
async function getNextInvoiceNumber(userId) {
  const lastInvoice = await db.invoices.findOne(
    { userId: ObjectId(userId) },
    { sort: { invoiceNumber: -1 } }
  );
  
  const nextNumber = (lastInvoice?.invoiceNumber || 0) + 1;
  return nextNumber;
  // ← Race condition if two requests happen simultaneously!
}

// Timeline of race condition:
// T1: Request A → lastInvoice.invoiceNumber = 5 → nextNumber = 6
// T2: Request B → lastInvoice.invoiceNumber = 5 → nextNumber = 6
// T3: Request A inserts invoiceNumber: 6 ✓
// T4: Request B inserts invoiceNumber: 6 ✗ E11000 Error!
```

### The Right Way (Atomic Counter)

```javascript
// ✓ CORRECT: Atomic increment
async function getNextInvoiceNumber(userId) {
  const counter = await db.collection('invoiceCounters').findOneAndUpdate(
    { userId: ObjectId(userId) },
    { $inc: { nextNumber: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  
  return counter.value.nextNumber;
  // ← MongoDB guarantees this is atomic (no race conditions)
}

// Timeline with atomic counter:
// T1: Request A → $inc { nextNumber: 1 } → returns 6
// T2: Request B → $inc { nextNumber: 1 } → returns 7 (guaranteed sequential)
// T3: Request A inserts invoiceNumber: 6 ✓
// T4: Request B inserts invoiceNumber: 7 ✓
// No duplicates possible!
```

### Initialize Counter for Existing Users

```javascript
// If you have existing invoices without a counter, initialize it
async function initializeCounterForUser(userId) {
  const lastInvoice = await db.invoices.findOne(
    { userId: ObjectId(userId) },
    { sort: { invoiceNumber: -1 } }
  );
  
  const nextNumber = (lastInvoice?.invoiceNumber || 0) + 1;
  
  // Create counter if doesn't exist
  await db.collection('invoiceCounters').updateOne(
    { userId: ObjectId(userId) },
    { $set: { nextNumber } },
    { upsert: true }
  );
  
  console.log(`✓ Counter initialized for user ${userId}`);
}

// Run for all users
const users = await db.users.find({}).toArray();
for (const user of users) {
  await initializeCounterForUser(user._id);
}
```

---

## PROBLEM 4: Fixing Existing Data

### Scenario: You have mixed data with data leakage

```javascript
// Current state: Invoices exist but might have missing userId
db.invoices.find({}).limit(3).pretty()
[
  { _id: ..., invoiceNumber: 1, clientId: ... },  // ❌ No userId!
  { _id: ..., invoiceNumber: 2, clientId: ... },  // ❌ No userId!
  { _id: ..., userId: userA, invoiceNumber: 3 },  // ✓ Has userId
]
```

### Step 1: Clean Up - Add Missing userIds

```javascript
// Identify which invoices are missing userId
db.invoices.find({ userId: { $exists: false } }).count()

// If you can infer the user from clientId:
const clientToUserMap = {};
await db.clients.find({}).forEach(doc => {
  clientToUserMap[doc._id] = doc.userId;
});

// Update invoices with missing userId
await db.invoices.updateMany(
  { userId: { $exists: false } },
  [
    {
      $set: {
        userId: clientToUserMap[this.clientId]
      }
    }
  ]
);

console.log("✓ Added missing userIds");
```

### Step 2: Delete Invoices with Orphaned clientIds

```javascript
// Find invoices where clientId doesn't exist in clients collection
const clientIds = await db.clients.find({}).project({ _id: 1 }).toArray();
const clientIdSet = new Set(clientIds.map(c => c._id.toString()));

const orphanedInvoices = await db.invoices.find({}).toArray();
const toDelete = orphanedInvoices.filter(
  inv => !clientIdSet.has(inv.clientId.toString())
);

console.log(`Found ${toDelete.length} orphaned invoices`);

// Delete or quarantine them
await db.invoices.deleteMany({
  _id: { $in: toDelete.map(i => i._id) }
});

console.log("✓ Deleted orphaned invoices");
```

### Step 3: Fix Duplicate Invoice Numbers

```javascript
// Find all invoices with duplicate (userId, invoiceNumber) pairs
const duplicates = await db.invoices.aggregate([
  { $group: {
    _id: { userId: "$userId", invoiceNumber: "$invoiceNumber" },
    count: { $sum: 1 },
    ids: { $push: "$_id" }
  }},
  { $match: { count: { $gt: 1 } } }
]).toArray();

console.log(`Found ${duplicates.length} duplicates`);

// For each duplicate, keep the oldest and delete the rest
for (const dup of duplicates) {
  const invoices = await db.invoices.find({
    _id: { $in: dup.ids }
  }).sort({ createdAt: 1 }).toArray();
  
  const toKeep = invoices[0];
  const toDelete = invoices.slice(1);
  
  console.log(`Keeping invoice ${toKeep._id}, deleting ${toDelete.length} duplicates`);
  
  // Soft delete the duplicates (don't hard delete)
  await db.invoices.updateMany(
    { _id: { $in: toDelete.map(i => i._id) } },
    {
      $set: {
        status: 'cancelled',
        deletedAt: new Date(),
      }
    }
  );
}

console.log("✓ Handled duplicate invoice numbers");
```

### Step 4: Verify the Fix

```javascript
// 1. Verify no missing userIds
const missingUserId = await db.invoices.countDocuments({ userId: { $exists: false } });
console.log(`Missing userIds: ${missingUserId}`);  // Should be 0

// 2. Verify no orphaned invoices
const missingClients = await db.invoices.aggregate([
  {
    $lookup: {
      from: 'clients',
      localField: 'clientId',
      foreignField: '_id',
      as: 'client'
    }
  },
  { $match: { client: { $size: 0 } } }
]).count();
console.log(`Orphaned invoices: ${missingClients}`);  // Should be 0

// 3. Verify no duplicate (userId, invoiceNumber) pairs
const dups = await db.invoices.aggregate([
  { $group: {
    _id: { userId: "$userId", invoiceNumber: "$invoiceNumber" },
    count: { $sum: 1 }
  }},
  { $match: { count: { $gt: 1 } } }
]).count();
console.log(`Duplicate pairs: ${dups}`);  // Should be 0

// 4. Test queries
const userAInvoices = await db.invoices.find({
  userId: ObjectId("USER_A_ID")
}).toArray();
console.log(`User A invoices: ${userAInvoices.length}`);
```

---

## PROBLEM 5: Preventing Future Issues

### Add This to Your Application Initialization

```typescript
// lib/db-init.ts
export async function initializeDatabase() {
  const db = await connectToDb();
  
  // Create all necessary indexes
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  
  await db.collection('clients').createIndex({ userId: 1 });
  await db.collection('clients').createIndex({ userId: 1, isActive: 1 });
  
  await db.collection('invoices').createIndex({ userId: 1 });
  await db.collection('invoices').createIndex({ userId: 1, clientId: 1 });
  await db.collection('invoices').createIndex(
    { userId: 1, invoiceNumber: 1 },
    { unique: true }  // ← CRITICAL
  );
  await db.collection('invoices').createIndex({ userId: 1, status: 1 });
  await db.collection('invoices').createIndex({ userId: 1, createdAt: -1 });
  
  await db.collection('invoiceCounters').createIndex({ userId: 1 });
  
  console.log('✓ Database initialized with correct indexes');
}

// Call this on app startup:
// import { initializeDatabase } from '@/lib/db-init';
// await initializeDatabase();
```

### Add Comprehensive Error Handling

```typescript
// lib/invoice-service.ts
import { MongoError } from 'mongodb';

export class InvoiceError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

export async function createInvoiceWithErrorHandling(
  userId: string,
  clientId: string,
  data: any
) {
  try {
    // ... create invoice logic ...
  } catch (err: any) {
    if (err.code === 11000) {
      throw new InvoiceError(
        'DUPLICATE_INVOICE',
        'Invoice number already exists for this user'
      );
    }
    
    if (err.message.includes('Unauthorized')) {
      throw new InvoiceError(
        'UNAUTHORIZED',
        'You do not have permission to access this resource'
      );
    }
    
    throw new InvoiceError('UNKNOWN_ERROR', err.message);
  }
}
```

---

## Final Checklist

- [ ] All queries filter by userId as first condition
- [ ] Composite index exists: `{ userId: 1, invoiceNumber: 1 }` with unique: true
- [ ] Atomic counter used for invoice number generation
- [ ] No global unique index on invoiceNumber alone
- [ ] All existing data has userId field
- [ ] No orphaned invoices (every clientId exists)
- [ ] Auth middleware extracts userId and passes to all routes
- [ ] E11000 errors caught and handled gracefully
- [ ] Soft deletes used (status: 'cancelled') instead of hard deletes
- [ ] Database initialized with all required indexes on app startup
