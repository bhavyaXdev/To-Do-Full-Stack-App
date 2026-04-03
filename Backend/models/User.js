import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Task content is required'],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Transform subdocument to have 'id' instead of '_id'
taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tasks: [taskSchema], // MERGED COLLECTION: Tasks as subdocuments
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash the password before saving (Modern Async Hook)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

// Method to verify passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password/metadata from JSON representation
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.password;
    delete returnedObject.__v;
    if (returnedObject.tasks) {
       returnedObject.tasks.forEach(t => {
         t.id = t._id?.toString() || t.id;
         delete t._id;
       });
    }
  },
});

const User = mongoose.model('User', userSchema);
export default User;
