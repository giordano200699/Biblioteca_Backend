import { Controller, Get, Post, Put, Delete, Body,Param,Req } from '@nestjs/common';
import { TipoUsuariosService } from "./tipoUsuarios.service";
import { TipoUsuario } from "./../interfaces/TipoUsuario";
import { Request } from 'express';

@Controller('tipoUsuarios')
export class TipoUsuariosController {

	constructor(private tipoUsuariosService: TipoUsuariosService){}
	
	@Get()
	obtenerTipoUsuarios(){
		return this.tipoUsuariosService.obtenerTiposUsuarios();
    }

    @Get(':id')
	obtenerTipoUsuario(@Param('id') id){
		return this.tipoUsuariosService.obtenerTipoUsuario(id);
	}

    @Post()
	registrarTipoUsuario(@Body() tipoUsuario: TipoUsuario){
		return this.tipoUsuariosService.registrar(tipoUsuario);
    }
    
    @Put(':id')
	actualizarTipoUsuario(@Param('id') id, @Body() tipoUsuario:TipoUsuario){
		return this.tipoUsuariosService.actualizar(id,tipoUsuario);
    }
    
    @Delete(':id')
	eliminarTipoUsuario(@Param('id') id){
		return this.tipoUsuariosService.eliminar(id);
	}
}
