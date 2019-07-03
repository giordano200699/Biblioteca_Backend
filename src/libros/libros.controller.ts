import { Controller, Get, Post, Put, Delete, Body,Param,Req } from '@nestjs/common';
import { LibrosService } from "./libros.service";
import { Libro } from "./../interfaces/Libro";
import { Item } from "./../interfaces/Item";
import { Libro_Autor } from "./../interfaces/Libro_Autor";
import { Libro_Editorial } from "./../interfaces/Libro_Editorial";
import { Request } from 'express';

@Controller('libros')
export class LibrosController {

	constructor(private librosService: LibrosService){}
	
	@Get()
	obtenerLibros(@Req() request: Request){
		return this.librosService.obtenerLibros();
	}

	@Get('conFormato')
	obtenerLibrosConFormato(@Req() request: Request){
		return this.librosService.obtenerLibrosConFormato();
	}

	@Get(':id')
	obtenerLibro(@Param('id') id){
		return this.librosService.obtenerLibro(id);
	}

	@Post()
	crearLibro(@Body() libro:Libro, @Req() request: Request){
		return this.librosService.crearLibro(libro);
	}

	@Post('estadistica')
	obtenerEstadistica(@Body() datos){
		return this.librosService.obtenerEstadistica(datos);
    }

	@Put(':id')
	actualizarLibro(@Param('id') id, @Body() libro:Libro, @Req() request: Request){
		return this.librosService.actualizarLibro(id,libro);
	}

	@Delete(':id')
	eliminarLibro(@Param('id') id, @Req() request: Request){
		return this.librosService.eliminarLibro(id);
	}

	@Get('items/:id')
	obtenerItems(@Param('id') id){
		return this.librosService.obtenerItems(id);
	}

	@Get('items/:id/:id2')
	obtenerItem(@Param('id') id, @Param('id2') id2){
		return this.librosService.obtenerItem(id,id2);
	}

	@Post('items/:id')
	crearItem(@Param('id') id,@Body() item:Item, @Req() request: Request){
		return this.librosService.crearItem(id,item);
	}

	@Put('items/:id/:id2')
	actualizarItem(@Param('id') id, @Param('id2') id2, @Body() item:Item, @Req() request: Request){
		return this.librosService.actualizarItem(id,id2,item);
	}

	@Put('items/:id/id/:id2')
	actualizarItemPorId(@Param('id') id, @Param('id2') id2, @Body() item:Item, @Req() request: Request){
		return this.librosService.actualizarItem(id,id2,item);
	}

	@Delete('items/:id')
	eliminarUltimoItem(@Param('id') id, @Req() request: Request){
		return this.librosService.eliminarUltimoItem(id);
	}

	@Delete('items/:id/:id2')
	eliminarItem(@Param('id') id, @Param('id2') id2, @Req() request: Request){
		return this.librosService.eliminarItem(id,id2);
	}

	@Delete('items/:id/id/:id2')
	eliminarItemPorId(@Param('id') id, @Param('id2') id2, @Req() request: Request){
		return this.librosService.eliminarItemPorId(id,id2);
	}

	@Post('autores/:id/:id2')
	relacionarAutor(@Param('id') id, @Param('id2') id2,@Body() libro_autor:Libro_Autor, @Req() request: Request){
		return this.librosService.relacionarAutor(id,id2,libro_autor);
	}

	@Delete('autores/:id/:id2')
	eliminarRelacionAutor(@Param('id') id, @Param('id2') id2, @Req() request: Request){
		return this.librosService.eliminarRelacionAutor(id,id2);
	}

	@Get('autores/:id')
	obtenerRelacionesAutor(@Param('id') id){
		return this.librosService.obtenerRelacionesAutor(id);
	}

	@Post('editoriales/:id/:id2')
	relacionarEditorial(@Param('id') id, @Param('id2') id2,@Body() libro_editorial:Libro_Editorial, @Req() request: Request){
		return this.librosService.relacionarEditorial(id,id2,libro_editorial);
	}

	@Delete('editoriales/:id/:id2')
	eliminarRelacionEditorial(@Param('id') id, @Param('id2') id2, @Req() request: Request){
		return this.librosService.eliminarRelacionEditorial(id,id2);
	}

	@Get('editoriales/:id')
	obtenerRelacionesEditorial(@Param('id') id){
		return this.librosService.obtenerRelacionesEditorial(id);
	}

	@Get('todo/:id')
	obtenerTotalInformacion(@Param('id') id){
		return this.librosService.obtenerTotalInformacion(id);
	}

	@Post('paginado/:pagina')
	paginadoLibros(@Body() dato,@Param('pagina') pagina){
		return this.librosService.paginadoLibros(pagina,dato);
	}

	@Post('paginadoF/:pagina')
	paginadoLibrosF(@Body() dato,@Param('pagina') pagina){
		return this.librosService.paginadoLibrosF(pagina,dato);
	}
}
