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
}
