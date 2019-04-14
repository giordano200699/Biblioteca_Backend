import { Injectable } from '@nestjs/common';
import { Archivo } from "src/interfaces/Archivo";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

var fs = require('fs');

function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
};

@Injectable()
export class ArchivosService {
	
	constructor(@InjectModel('Archivo') private archivoModelo: Model<Archivo>) {}

	async obtenerArchivo(id:String){
		return await this.archivoModelo.find({'_id':id});
	}

	async crearArchivo(archivo: Archivo){
		var base64str = base64_encode('E:/Archivos/fotos/IMG_20180527_162900.jpg');
		archivo.archivo = base64str;
		const archivoNuevo = new this.archivoModelo(archivo);
		return await archivoNuevo.save();
	}

	async actualizarArchivo(id:String, archivo:Archivo){
		return await this.archivoModelo.update({"_id":id},archivo);
	}

	async eliminarArchivo(id:String){
		return await this.archivoModelo.deleteOne({"_id":id});
	}

	mensajeError(id:Number){
		if(id==1){
			return "Usted no tiene permiso para obtener la imagen procesada de un archivo en específico.";
		}else if(id==2){
			return "Usted no tiene permiso para obtener toda la información de un archivo en específico.";
		}else if(id==3){
			return "Usted no tiene permiso para crear un nuevo archivo en la base de datos.";
		}else if(id==4){
			return "Usted no tiene permiso para editar la información de un archivo en específico";
		}
		return "Usted no tiene permiso para eliminar un archivo en la base de datos.";
	}
}
