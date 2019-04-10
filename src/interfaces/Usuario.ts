import { Document } from "mongoose";

export interface Usuario extends Document {
	_id?: String;
	dni: String;
	nombre: string;
	apellidos: string;
	edad: number;
}