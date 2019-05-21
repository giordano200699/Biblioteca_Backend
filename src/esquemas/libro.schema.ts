import { Schema } from 'mongoose';

export const LibroSchema = new Schema({
    libroId: Number,
    titulo: String,
    tituloSecundario: String,
    clasificacion: String,
    anio: Number,
    edicion: Number,
    resumen: String,
    capitulos: String,
    isbn: String,
    extension: Number,
    observaciones: String,
    dimensiones: String,
    acompaniamiento: String,
    palabrasClaves: String,
    tomo: Number
});