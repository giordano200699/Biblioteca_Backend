import { Schema } from 'mongoose';

export const EditorialSchema = new Schema({
    editorialId: Number,
    nombre: String
});