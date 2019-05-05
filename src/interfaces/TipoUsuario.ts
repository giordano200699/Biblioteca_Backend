import { Document } from "mongoose";

export interface TipoUsuario extends Document {
    _id?: String,
    id?:String,
    nombre: String,
    descripcion: String
}