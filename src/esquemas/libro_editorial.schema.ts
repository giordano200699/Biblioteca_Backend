import { Schema } from 'mongoose';

export const Libro_EditorialSchema = new Schema({
    libroId: Number,
    editorialId: Number,
    tipo: Number
});