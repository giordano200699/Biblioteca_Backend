import { Document } from "mongoose";

export interface Castigo extends Document {
    _id?: String,
    castigoId?: Number,
    usuarioId: String,
    prestamoId: Number,
    fechaInicio: Date,
    fechaFin?: Date,
    orden: Number,
    estado: Number,
    ciclo: String
}