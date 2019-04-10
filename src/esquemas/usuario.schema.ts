import { Schema } from 'mongoose';

export const UsuarioSchema = new Schema({
  dni: String, 
  nombre: String,
  apellidos: String,
  edad: Number
});