import { Document } from "mongoose";

export interface Usuario extends Document {
	_id?: String;
	dni: String, 
	nombres: String,
	apellidos: String,
	edad: Number,
	sexo: Boolean,
	estado: Number,
	codigo?: String,
	correoInstitucional: String,
	correoPersonal?: String,
	escuelaId?: String,
	telefonoCasa?: String,
	telefonoMovil?: String,
	direccion?: String,
	imagenId?: String,
	tipoUsuarioId: String
}