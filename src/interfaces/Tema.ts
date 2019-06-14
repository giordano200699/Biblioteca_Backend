import { Document } from "mongoose";

export interface Tema extends Document {
    _id?: String,
    temaId?: String,
    nombre: String,
    descripcion?: String,
    temas?: [{temaId:String, peso:Number}]
}