import { Schema } from 'mongoose';

export const TemaSchema = new Schema({
    temaId: String,
    nombre: String,
    descripcion: String,
    temaR1: String,
    temaR2: String,
    temaR3: String,
    temaR4: String,
    temaR5: String
});