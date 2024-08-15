import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {type: String, required: true},
    description: {type: String, required: true},
    image_url: {type: String, required: true},
    logo_url: {type: String, required: true},
    live_preview_url: {type: String, required: true},
    github_url: {type: String, required: true},
    color: {type: String, required: true},
    category: {type: String, required: true},
  },
  {
    timestamps: true
  }
);

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;