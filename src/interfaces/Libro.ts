import { Document } from "mongoose";

export interface Libro extends Document {
    _id?: String,
    libroId?: number,
    titulo: String,
    tituloSecundario?: String,
    clasificacion: String,
    anio: number,
    edicion: number,
    resumen: String,
    capitulos: String,
    isbn: String,
    extension: number,
    observaciones?: String,
    dimensiones: String,
    acompaniamiento?: String,
    palabrasClaves: String,
    tomo?: number
}
