import { Schema } from 'mongoose';

export const TipoUsuarioSchema = new Schema({
    nombre: String,
    descripcion: String
});