import { Schema } from 'mongoose';

export const ArchivoSchema = new Schema({
  archivo: Buffer,
  nombre: String
});