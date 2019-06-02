import { Document } from "mongoose";

export interface Tema extends Document {
    _id?: String,
    temaId?: number,
    nombre: String,
    descripcion?: String,
    temaR1?: number,
    temaR2?: number,
    temaR3?: number,
    temaR4?: number,
    temaR5?: number
}