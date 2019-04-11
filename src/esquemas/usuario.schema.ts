import { Schema } from 'mongoose';

export const UsuarioSchema = new Schema({
  dni: String, 
  nombres: String,
  apellidos: String,
  edad: Number,
  sexo: Boolean,
  estado: Number,
  codigo: String,
  correoInstitucional: String,
  correoPersonal: String,
  escuelaId: String,
  telefonoCasa: String,
  telefonoMovil: String,
  direccion: String,
  imagenId: String,
  contrasenia: String
});