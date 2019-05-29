import { Schema } from 'mongoose';

export const PrestamoSchema = new Schema({
    prestamoId: Number,
    pedidoId: Number,
    fechaInicio: Date,
    fechaFin: Date,
    fechaDevolucion: Date,
    estado: Number,
    adminId: String
});