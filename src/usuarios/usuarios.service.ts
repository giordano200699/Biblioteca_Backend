import { Injectable } from '@nestjs/common';
import { Usuario } from "src/interfaces/Usuario";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsuariosService {

	constructor(@InjectModel('Usuario') private usuarioModelo: Model<Usuario>) {}

	async obtenerUsuarios(){
		return await this.usuarioModelo.find();
	}

	async obtenerUsuario(id:String){
		return await this.usuarioModelo.find({'dni':id});
	}

	async crearUsuario(usuario: Usuario){
		const usuarioNuevo = new this.usuarioModelo(usuario);
		return await usuarioNuevo.save();
	}

	async actualizarUsuario(id:String, usuario:Usuario){
		return await this.usuarioModelo.update({"dni":id},usuario);
	}

	async eliminarUsuario(id:String){
		return await this.usuarioModelo.deleteOne({"dni":id});
	}

	mensajeError(id:Number){
		if(id==1){
			return {descripcion : "Usted no tiene permiso para obtener toda la información de los usuarios."};
		}else if(id==2){
			return {descripcion : "Usted no tiene permiso para obtener toda la información de un usuario en específico."};
		}else if(id==3){
			return {descripcion : "Usted no tiene permiso para crear un nuevo usuario en la base de datos."};
		}else if(id==4){
			return {descripcion : "Usted no tiene permiso para editar la información de un usuario en específico"};
		}
		return {descripcion : "Usted no tiene permiso para eliminar un usuario en la base de datos."};
	}
}
