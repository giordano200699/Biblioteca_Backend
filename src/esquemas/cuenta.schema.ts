import { Schema } from 'mongoose';

export const CuentaSchema = new Schema({
  nombre: String, 
  contrasenia: String,
  idUsuario: String,
  idGoogle: String
});