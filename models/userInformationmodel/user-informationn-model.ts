import { Schema, model, models, Document } from "mongoose";

export interface UserSchemaModel extends Document {
  email: string;
  state: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  pincode: string;
  password: string;
}

const UserSchema = new Schema<UserSchemaModel>(
  {
    email: { type: String, required: true, unique: true },
    state: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    apartment: { type: String, required: false }, // Fixed: optional
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

// Fixed: Correct model name reference
const UserModel =
  models.UserInformationModel ||
  model<UserSchemaModel>("UserInformationModel", UserSchema);

export default UserModel;
