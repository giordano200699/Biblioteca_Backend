import { Document } from "mongoose";

export interface Archivo extends Document {
	_id?: String;
	archivo: string;
	nombre: string;
}