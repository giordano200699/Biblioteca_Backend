import { Controller, Get, Post, Put, Delete, Body,Param,Req } from '@nestjs/common';
import { AutoresService } from "./autores.service";
import { Autor } from "./../interfaces/Autor";
import { Request } from 'express';

@Controller('autores')
export class AutoresController {

	constructor(private autoresService: AutoresService){}
	
	@Get()
	obtenerAutores(@Req() request: Request){
		return this.autoresService.obtenerAutores();
	}

	@Get(':id')
	obtenerAutor(@Param('id') id){
		return this.autoresService.obtenerAutor(id);
	}
    
	@Post()
	crearAutor(@Body() autor:Autor, @Req() request: Request){
		return this.autoresService.crearAutor(autor);
	}
    
	@Put(':id')
	actualizarAutor(@Param('id') id, @Body() autor:Autor, @Req() request: Request){
		return this.autoresService.actualizarAutor(id,autor);
	}

	@Delete(':id')
	eliminarAutor(@Param('id') id, @Req() request: Request){
		return this.autoresService.eliminarAutor(id);
	}
}
