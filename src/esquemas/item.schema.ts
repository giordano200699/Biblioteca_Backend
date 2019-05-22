import { Schema } from 'mongoose';

export const ItemSchema = new Schema({
    itemId: Number,
    numeroIngreso: String,
    codigoBarra: String,
    numeroCopia: Number,
    volumen: Number,
    modoAdquisicion: Number,
    fuenteAdquisicion: String,
    precioAdquisicion: String,
    fechaAdquisicion: String,
    disponibilidad: Number,
    tipoImpresion: Number,
    lugarPublicacion: String,
    libroId: Number,
    standId: Number
});