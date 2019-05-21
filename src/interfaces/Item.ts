import { Document } from "mongoose";

export interface Item extends Document {
    _id?: String,
    itemId?: number,
    numeroIngreso: String,
    codigoBarra: String,
    numeroCopia: number,
    volumen: number,
    modoAdquisicion: String,
    fuenteAdquisicion: String,
    precioAdquisicion?: String,
    fechaAdquisicion?: String,
    disponibilidad: number,
    tipoImpresion: number,
    lugarPublicacion: String,
    libroId: number,
    standId?: number
}
