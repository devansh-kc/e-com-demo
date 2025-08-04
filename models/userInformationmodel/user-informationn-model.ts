import { Schema, model, models, Document } from "mongoose";

export interface UserInformationModel extends Document {
  email: string;
  state: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  pincode: string;
}

const UserInformationSchema = new Schema<UserInformationModel>(
  {
    email: { type: String, required: true },
    state: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    address: { type: String, required: true },
    apartment: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

// ✅ This prevents the "Cannot overwrite model" error
const UserInformationModel =
  models.ProductData ||
  model<UserInformationModel>("UserInformationModel", UserInformationSchema);

export default UserInformationModel;
