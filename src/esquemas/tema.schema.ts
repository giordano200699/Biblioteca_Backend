//Esquema para Temas
import { Schema } from 'mongoose';

export const TemaSchema = new Schema({
    temaId: Number,
    nombre: String,
    descripcion: String,
    temaR1: Number,
    temaR2: Number,
    temaR3: Number,
    temaR4: Number,
    temaR5: Number
});