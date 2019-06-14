import { Document } from "mongoose";

export interface Tema extends Document {
    _id?: String,
    temaId?: String,
    nombre: String,
    descripcion?: String,
    temaR1?: String,
    temaR2?: String,
    temaR3?: String,
    temaR4?: String,
    temaR5?: String
}