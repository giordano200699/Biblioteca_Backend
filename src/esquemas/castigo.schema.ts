import { Schema } from 'mongoose';

export const CastigoSchema = new Schema({
    castigoId: Number,
    prestamoId: Number,
    usuarioId: String,
    fechaInicio: Date,
    fechaFin: Date,
    orden: Number,
    estado: Number,
    ciclo: String
});