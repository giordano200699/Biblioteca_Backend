import { Document } from "mongoose";

export interface Autor extends Document {
    _id?: String,
    autorId?: number,
    nombre: String
}