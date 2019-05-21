import { Controller, Get, Post, Put, Delete, Body,Param,Req } from '@nestjs/common';
import { LibrosService } from "./libros.service";
import { Libro } from "./../interfaces/Libro";
import { Request } from 'express';

@Controller('libros')
export class LibrosController {

	constructor(private librosService: LibrosService){}
	
	@Get()
	obtenerLibros(@Req() request: Request){
		return this.librosService.obtenerLibros();
	}

	@Get(':id')
	obtenerLibro(@Param('id') id){
		return this.librosService.obtenerLibro(id);
	}

	@Post()
	crearLibro(@Body() libro:Libro, @Req() request: Request){
		return this.librosService.crearLibro(libro);
	}

	@Put(':id')
	actualizarLibro(@Param('id') id, @Body() libro:Libro, @Req() request: Request){
		return this.librosService.actualizarLibro(id,libro);
	}

	@Delete(':id')
	eliminarLibro(@Param('id') id, @Req() request: Request){
		return this.librosService.eliminarLibro(id);
	}
}
