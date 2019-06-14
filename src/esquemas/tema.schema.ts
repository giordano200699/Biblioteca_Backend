import { Schema } from 'mongoose';

export const TemaSchema = new Schema({
    temaId: String,
    nombre: String,
    descripcion: String,
    temas: [{temaId:String, peso:Number}]
});