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
		return this.usuariosService.obtenerUsuarios();
	}
	@Get(':id')
	obtenerUsuario(@Param('id') id, @Req() request: Request){
		return this.usuariosService.obtenerUsuario(id);
	}

	@Post()
	crearUsuario(@Body() usuario:Usuario, @Req() request: Request){
		return this.usuariosService.crearUsuario(usuario);
	}

	@Put(':id')
	actualizarUsuario(@Param('id') id, @Body() usuario:Usuario, @Req() request: Request){
		return this.usuariosService.actualizarUsuario(id,usuario);
	}

	@Delete(':id')
	eliminarUsuario(@Param('id') id, @Req() request: Request){
		return this.usuariosService.eliminarUsuario(id);
	}
}
