import { Document } from "mongoose";

export interface Cuenta extends Document {
	_id?: String;
	nombre: String, 
	contrasenia?: String,
	idUsuario:String,
	idGoogle?:String
}