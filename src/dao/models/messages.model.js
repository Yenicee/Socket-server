import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const messageCollection = "messages";

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

messageSchema.plugin(mongoosePaginate);

const messagesModel = mongoose.model(messageCollection, messageSchema);

export default messagesModel;


