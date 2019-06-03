import { Schema } from 'mongoose';

export const PedidoSchema = new Schema({
    pedidoId: Number,
    usuarioId: String,
    itemId: Number,
    fechaInicio: Date,
    fechaFin: Date,
    estado: Number,
    adminId: String,
    tipo: Number
});