import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetings } from "./hooks.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.pre("findOneAndUpdate", setUpdateSetings);
contactSchema.post("findOneAndUpdate", handleSaveError);

contactSchema.post("save", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
