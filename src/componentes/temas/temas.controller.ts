import { Controller, Get, Post, Put, Delete, Body,Param,Req } from '@nestjs/common';
import { TemasService } from "./temas.service";
import { Tema } from "./../../interfaces/Tema";
import { Libro_Tema } from "src/interfaces/Libro_Tema";
import { Request } from 'express';

@Controller('temas')
export class TemasController {

	constructor(private temasService: TemasService){}
	
	@Get()
	obtenerTemas(@Req() request: Request){
		return this.temasService.obtenerTemas();
	}
	
	@Get('libros/:id')
	obtenerRelacionesLibros(@Param('id') id){
		return this.temasService.obtenerRelacionesLibros(id);
	}

    @Get(':id')
	obtenerTema(@Param('id') id){
		return this.temasService.obtenerTema(id);
	}
    
    @Post()
	crearTema(@Body() tema:Tema, @Req() request: Request){
		return this.temasService.crearTema(tema);
	}
	
	@Post('relacionarLibro')
	relacionarLibro(@Body() datos:Libro_Tema){
		return this.temasService.relacionarLibro(datos);
	}

	@Put('relacionarLibro')
	actualizarRelacionarLibro(@Body() datos:Libro_Tema){
		return this.temasService.actualizarRelacionarLibro(datos);
    }
    
    @Put(':id')
	actualizarTema(@Param('id') id, @Body() tema:Tema, @Req() request: Request){
		return this.temasService.actualizarTema(id,tema);
	}


	@Delete(':id')
	eliminarTema(@Param('id') id, @Req() request: Request){
		return this.temasService.eliminarTema(id);
	}
}
