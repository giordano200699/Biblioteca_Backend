import { Document } from "mongoose";

export interface Prestamo extends Document {
    _id?: String,
    prestamoId?: number,
    pedidoId: number,
    fechaInicio: Date,
    fechaFin: Date,
    fechaDevolucion: Date,
    estado: number,
    adminId?: String
}