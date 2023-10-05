import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartsCollection = "carts"

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
});

cartSchema.plugin(mongoosePaginate);

const cartsModel = mongoose.model(cartsCollection, cartSchema);

export default cartsModel;
