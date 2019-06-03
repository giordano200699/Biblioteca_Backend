import { Document } from "mongoose";

export interface Pedido extends Document {
    _id?: String,
    pedidoId?: number,
    usuarioId: String,
    itemId: number,
    fechaInicio: Date,
    fechaFin: Date,
    estado: number,
    adminId?: String,
    tipo: number
}