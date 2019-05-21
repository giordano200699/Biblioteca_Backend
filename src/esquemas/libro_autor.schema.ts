import { Schema } from 'mongoose';

export const Libro_AutorSchema = new Schema({
    libroId: Number,
    autorId: Number,
    tipo: Number
});