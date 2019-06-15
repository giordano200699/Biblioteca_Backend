import { Schema } from 'mongoose';

export const Libro_TemaSchema = new Schema({
    libroId: Number,
    temas: [{temaId:String, peso:Number}]
});