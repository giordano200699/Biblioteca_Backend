import { Injectable } from '@nestjs/common';
import { Usuario } from "src/interfaces/Usuario";
import { Cuenta } from "src/interfaces/Cuenta";
import { Pedido } from "src/interfaces/Pedido";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsuariosService {

	constructor(@InjectModel('Usuario') private usuarioModelo: Model<Usuario>,@InjectModel('Cuenta') private cuentaModelo: Model<Cuenta>,
	@InjectModel('Pedido') private pedidoModelo: Model<Pedido>) {}

	async obtenerUsuarios(){
		return await this.usuarioModelo.find();
	}

	async obtenerUsuario(id:String){
		return await this.usuarioModelo.find({'dni':id});
	}

	async crearUsuario(usuario: Usuario){
		const usuarioNuevo = new this.usuarioModelo(usuario);
		const cuentaNueva = new this.cuentaModelo({nombre:usuario.correoInstitucional,contrasenia:usuario.codigo,idUsuario:usuario.dni});
		await cuentaNueva.save();
		return await usuarioNuevo.save();

	}

	async actualizarUsuario(id:String, usuario:Usuario){
		return await this.usuarioModelo.update({"dni":id},usuario);
	}

	async eliminarUsuario(id:String){
		await this.cuentaModelo.deleteOne({"idUsuario":id});
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

	async esUsuario(cuenta){
		var resultado = [];
		const cuentas = await this.cuentaModelo.find({"nombre":cuenta.nombre,"contrasenia":cuenta.contrasenia});
		if(cuentas.length==1){
			const usuario = await this.usuarioModelo.findOne({'dni':cuentas[0].idUsuario});
			const pedidosRechazados = await this.pedidoModelo.find({'estado':0,'usuarioId':usuario.dni}).count();
			const pedidosActivos = await this.pedidoModelo.find({'estado':1,'usuarioId':usuario.dni}).count();
			const pedidosAceptados = await this.pedidoModelo.find({'estado':2,'usuarioId':usuario.dni}).count();
			await resultado.push({
				"_id": usuario._id,
	            "nombres": usuario.nombres,
	            "apellidos": usuario.apellidos,
	            "edad": usuario.edad,
	            "dni": usuario.dni,
	            "imagenId": usuario.imagenId,
	            "sexo": usuario.sexo,
	            "estado": usuario.estado,
	            "codigo": usuario.codigo,
	            "correoInstitucional": usuario.correoInstitucional,
	            "correoPersonal": usuario.correoPersonal,
	            "escuelaId": usuario.escuelaId,
	            "telefonoCasa": usuario.telefonoCasa,
	            "telefonoMovil": usuario.telefonoMovil,
	            "direccion": usuario.direccion,
	            "tipoUsuarioId": usuario.tipoUsuarioId,
				"pedidosRechazados":pedidosRechazados,
				"pedidosActivos":pedidosActivos,
				"pedidosAceptados":pedidosAceptados
			});
		}else{
			if(cuentas.length==0){
				return {tipoMensaje:2,descripcion:'No existe una cuenta de usuario con estos datos.'};
			}else{
				return {tipoMensaje:3,descripcion:'ERROR RARO, existen mas de una cuenta de usuario vinculado con estos datos'};				
			}
		}
		return resultado;
	}
}
