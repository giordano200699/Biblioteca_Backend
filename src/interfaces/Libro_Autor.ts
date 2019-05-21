import { Document } from "mongoose";

export interface Libro_Autor extends Document {
    _id?: String,
    libroId?: number,
    autorId?: number,
    tipo: number
}