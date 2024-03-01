import { Schema, model, models } from "mongoose";

const qrCodeSchema = new Schema({
  usageCount: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  securityKey: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
    default: null,
  },
});

const QrCode = models.QrCode || model("QrCode", qrCodeSchema);
export default QrCode;
