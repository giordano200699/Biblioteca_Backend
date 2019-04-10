import { Controller, Get, Post, Put, Delete, Body,Param } from '@nestjs/common';
import { UsuariosService } from "./usuarios.service";
import { Usuario } from "src/interfaces/Usuario";

@Controller('usuarios')
export class UsuariosController {

	constructor(private usuariosService: UsuariosService){}
	
	@Get()
	obtenerUsuarios(): Promise<Object> {
		return this.usuariosService.obtenerUsuarios();
	}
	@Get(':id')
	obtenerUsuario(@Param('id') id): Promise<Object> {
		return this.usuariosService.obtenerUsuario(id);
	}

	@Post()
	crearUsuario(@Body() usuario:Usuario): Promise<Usuario> {
		return this.usuariosService.crearUsuario(usuario);
	}

	@Put(':id')
	actualizarUsuario(@Param('id') id, @Body() usuario:Usuario): Promise<Usuario> {
		return this.usuariosService.actualizarUsuario(id,usuario);
	}

	@Delete(':id')
	eliminarUsuario(@Param('id') id): Promise<Usuario> {
		return this.usuariosService.eliminarUsuario(id);
	}
}
