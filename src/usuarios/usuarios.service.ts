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
		var usuario = await this.usuarioModelo.findOne({'usuarioId':id});
		if(!usuario){
			usuario = await this.usuarioModelo.findOne({'dni':id});
		}
		return usuario
	}

	async crearUsuario(usuario: Usuario){
		const usuarioNuevo = new this.usuarioModelo(usuario);
		const cuentaNueva = new this.cuentaModelo({nombre:usuario.correoInstitucional,contrasenia:usuario.codigo,idUsuario:usuario.usuarioId});
		await cuentaNueva.save();
		return await usuarioNuevo.save();

	}

	async actualizarUsuario(id:String, usuario:Usuario){
		var usuarioN = await this.usuarioModelo.findOne({'usuarioId':id});
		if(!usuarioN){
			usuarioN = await this.usuarioModelo.findOne({'dni':id});
		}
		var cuenta = await this.cuentaModelo.findOne({'idUsuario':usuarioN.usuarioId});
		cuenta.nombre = usuario.correoInstitucional;
		cuenta.save();
		return await this.usuarioModelo.update({"usuarioId":usuarioN.usuarioId},usuario);
	}

	async eliminarUsuario(id:String){
		var usuario = await this.usuarioModelo.findOne({'usuarioId':id});
		if(!usuario){
			usuario = await this.usuarioModelo.findOne({'dni':id});
		}
		await this.cuentaModelo.deleteOne({"idUsuario":usuario.usuarioId});
		return await this.usuarioModelo.deleteOne({"usuarioId":usuario.usuarioId});
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
			const usuario = await this.usuarioModelo.findOne({'usuarioId':cuentas[0].idUsuario});
			if(usuario.estado != 3){
				const pedidosRechazados = await this.pedidoModelo.find({'estado':0,'usuarioId':usuario.usuarioId}).count();
				const pedidosActivos = await this.pedidoModelo.find({'estado':1,'usuarioId':usuario.usuarioId}).count();
				const pedidosAceptados = await this.pedidoModelo.find({'estado':2,'usuarioId':usuario.usuarioId}).count();
				await resultado.push({
					"_id": usuario._id,
					"usuarioId":usuario.usuarioId,
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
				return {tipoMensaje:1,descripcion:'Su cuenta ha sido bloqueada, porfavor acercarse a devolver el material prestado.'};
			}
		}else{
			if(cuentas.length==0){
				return {tipoMensaje:2,descripcion:'No existe una cuenta de usuario con estos datos.'};
			}else{
				return {tipoMensaje:3,descripcion:'ERROR RARO, existen mas de una cuenta de usuario vinculado con estos datos'};				
			}
		}
		return resultado;
	}

	async esUsuarioGoogle(cuenta){
		var resultado = [];
		const cuentas = await this.cuentaModelo.find({"nombre":cuenta.nombre});
		if(cuentas.length==1){

			if(cuentas[0].idGoogle){
				if(cuentas[0].idGoogle!=cuenta.idGoogle){
					return {tipoMensaje:2,descripcion:'Ya existe una cuenta de google relacionada con esta cuenta.'};
				}

			}else{
					cuentas[0].idGoogle = cuenta.idGoogle;
					await cuentas[0].save();
			}
			const usuario = await this.usuarioModelo.findOne({'usuarioId':cuentas[0].idUsuario});
			const pedidosRechazados = await this.pedidoModelo.find({'estado':0,'usuarioId':usuario.usuarioId}).count();
			const pedidosActivos = await this.pedidoModelo.find({'estado':1,'usuarioId':usuario.usuarioId}).count();
			const pedidosAceptados = await this.pedidoModelo.find({'estado':2,'usuarioId':usuario.usuarioId}).count();

			await resultado.push({"_id": usuario._id,
				"usuarioId": usuario.usuarioId,
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
				"pedidosAceptados":pedidosAceptados});

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
