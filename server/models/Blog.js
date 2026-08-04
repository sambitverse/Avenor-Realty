import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  readTime: { type: String, default: '5 min read' },
  excerpt: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: String, default: 'July 2026' }
}, { timestamps: true });

export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
