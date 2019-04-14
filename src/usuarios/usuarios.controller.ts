import { Controller, Get, Post, Put, Delete, Body,Param,Req } from '@nestjs/common';
import { UsuariosService } from "./usuarios.service";
import { Usuario } from "./../interfaces/Usuario";
import { Request } from 'express';

const CLAVE = "QDm6pbKeVwWikPvpMSUYwp0tNnxcaLoYLnyvLQ4ISV39uQOgsjTEjS0UNlZHwbxl2Ujf30S31CSKndwpkFeubt5gJHTgFlq7LeIaSYc0jNm44loPty2ZK1nI0qisrt2Xwq0nFhdp8H3kdpyL5wVZLH7EpSE6IO0cHAOGOfSpJjF36eiCuXJ3gkOfX8C4n";

@Controller('usuarios')
export class UsuariosController {

	constructor(private usuariosService: UsuariosService){}
	
	@Get()
	obtenerUsuarios(@Req() request: Request){
		if(request.query.clave == CLAVE){
			return this.usuariosService.obtenerUsuarios();
		}
		return this.usuariosService.mensajeError(1);
	}
	@Get(':id')
	obtenerUsuario(@Param('id') id, @Req() request: Request){
		if(request.query.clave == CLAVE){
			return this.usuariosService.obtenerUsuario(id);
		}
		return this.usuariosService.mensajeError(2);
	}

	@Post()
	crearUsuario(@Body() usuario:Usuario, @Req() request: Request){
		if(request.query.clave == CLAVE){
			return this.usuariosService.crearUsuario(usuario);
		}
		return this.usuariosService.mensajeError(3);
	}

	@Put(':id')
	actualizarUsuario(@Param('id') id, @Body() usuario:Usuario, @Req() request: Request){
		if(request.query.clave == CLAVE){
			return this.usuariosService.actualizarUsuario(id,usuario);
		}
		return this.usuariosService.mensajeError(4);
	}

	@Delete(':id')
	eliminarUsuario(@Param('id') id, @Req() request: Request){
		if(request.query.clave == CLAVE){
			return this.usuariosService.eliminarUsuario(id);
		}
		return this.usuariosService.mensajeError(5);
	}
}
