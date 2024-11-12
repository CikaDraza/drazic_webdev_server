import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {type: String},
    username: { type: String, sparse: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    password: {type: String},
    vkId: { type: String },
    isAdmin: {type: Boolean, required: true, default: false},
    provider: { type: String, default: 'local' },
  },
  {
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;