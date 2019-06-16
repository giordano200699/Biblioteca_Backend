import { Document } from "mongoose";

export interface Libro_Tema extends Document {
    _id?: String,
    libroId?: Number,
    temas: [{temaId?:String, peso:Number, nombre?:String}]
}

