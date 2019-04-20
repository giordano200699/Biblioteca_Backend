import { Controller, Get, Post, Put, Delete, Body,Param,Req } from '@nestjs/common';
import { UsuariosService } from "./usuarios.service";
import { Usuario } from "./../interfaces/Usuario";
import { Request } from 'express';

@Controller('usuarios')
export class UsuariosController {

	constructor(private usuariosService: UsuariosService){}
	
	@Get()
	obtenerUsuarios(@Req() request: Request){
		return this.usuariosService.obtenerUsuarios();
	}
	@Post('esUsuario')
	esUsuario(@Body() cuenta){
		return this.usuariosService.esUsuario(cuenta);
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
