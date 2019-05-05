import { Injectable } from '@nestjs/common';
import { TipoUsuario } from "src/interfaces/TipoUsuario";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TipoUsuariosService {

	constructor(@InjectModel('TipoUsuario') private tipoUsuarioModelo: Model<TipoUsuario>) {}

	async obtenerTiposUsuarios(){
		return await this.tipoUsuarioModelo.find();
	}

	async obtenerTipoUsuario(id:String){
		return await this.tipoUsuarioModelo.find({'id':id});
	}

	async registrar(tipoUsuario: TipoUsuario){
		const tipoUsuarioNuevo = new this.tipoUsuarioModelo(tipoUsuario);
		return await tipoUsuarioNuevo.save();
	}

	async actualizar(id:String, tipoUsuario:TipoUsuario){
		return await this.tipoUsuarioModelo.update({"id":id},tipoUsuario);
	}

	async eliminar(id:String){
		return await this.tipoUsuarioModelo.deleteOne({"id":id});
	}
}
