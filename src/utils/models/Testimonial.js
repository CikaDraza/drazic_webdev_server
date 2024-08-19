import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    client_name: {type: String, required: true},
    client_title: {type: String, required: true},
    rating: {type: String, required: true},
    text: {type: String, required: true},
    image_url: {type: String, required: true},
  },
  {
    timestamps: true
  }
);

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;