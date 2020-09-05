import mongoose from "mongoose";

const Schema = mongoose.Schema;

const whatsappSchema = new Schema({
  message: String,
  name: String,
  timestamp: String,
  received: Boolean,
});

// dbMessages = mongoose.model("messageContent", whatsappSchema);

//collection
export default mongoose.model("messagecontents", whatsappSchema);

// module.exports = Message = mongoose.model("messageContent", whatsappSchema);
