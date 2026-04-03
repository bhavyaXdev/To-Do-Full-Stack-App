# 🛡️ Antigravity Backend: Features & Architecture

This document providing a deep dive into the backend architecture of the Antigravity Task Manager, explaining the core features and the code that powers them.

---

## 1. Single-Collection Data Architecture
Instead of separate collections, we store tasks directly move to the `User` document as subdocuments. This ensures perfect **Direct Data Ownership** and high retrieval performance.

### **💾 The Unified Model (`models/User.js`)**
The `tasks` are defined as a subdocument schema inside the `User` schema.

```javascript
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tasks: [taskSchema] // Embedded tasks
});
```

---

## 2. Secure Authentication System
Powered by **JWT (JSON Web Tokens)** and **BcryptJS** for high-security session management.

### **🔒 Password Hashing (`models/User.js`)**
Passwords are never stored in plain text. We hash them using a salt before saving to the database.

```javascript
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

### **🎫 JWT session management (`Apis/AuthMethod.js`)**
Upon a successful login or signup, we sign a secure token that expires in 7 days.

```javascript
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ user, token });
```

---

## 3. Protected Route Middleware
Ensures that only logged-in users with a valid token can access the task-management endpoints.

### **🛡️ Auth Middleware (`middleware/auth.js`)**
This script extracts the token from the `Authorization` header and verifies it.

```javascript
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};
```

---

## 4. Contextual CRUD Operations
All task operations are performed within the scope of the authenticated user's document.

### **✅ Subdocument Management (`Apis/ApiMethod.js`)**
Using specialized Mongoose methods like `.push()`, `.id()`, and `.pull()` to manage the nested task array.

```javascript
// Adding a task
user.tasks.unshift({ text }); 
await user.save();

// Editing a task
const task = user.tasks.id(req.params.id);
task.text = newText;
await user.save();

// Deleting a task
user.tasks.pull(req.params.id);
await user.save();
```

---

## 5. Security & Isolation Summary

1. **Self-Contained Data**: A user can never read, edit, or delete another user's task because the backend queries are scoped exclusively to the `req.user.id` found in the verified token.
2. **Lean API design**: By embedding tasks, we minimize database roundtrips. One query to `findById` retrieves the user and their complete list of tasks instantly.
3. **JSON transformation**: We use custom `toJSON` transforms to hide internal metadata like `__v` and `password` while converting `_id` to `id` for frontend-friendly consumption.

---

*Backend designed for security, scalability, and performance by Antigravity.*
