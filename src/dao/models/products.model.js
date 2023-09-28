import mongoose from 'mongoose';

const productCollection = "products";

const productSchema = new mongoose.Schema({
  _id: {
    type: Number, 
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
 
});

export const productModel = mongoose.model(productCollection, productSchema);



