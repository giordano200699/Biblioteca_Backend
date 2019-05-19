import { Document } from "mongoose";

export interface Editorial extends Document {
    _id?: String,
    editorialId?: number,
    nombre: String
}