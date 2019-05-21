import { Document } from "mongoose";

export interface Libro_Editorial extends Document {
    _id?: String,
    libroId?: number,
    editorialId?: number,
    tipo: number
}