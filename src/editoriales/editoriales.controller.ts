import { Controller, Get, Post, Put, Delete, Body,Param,Req } from '@nestjs/common';
import { EditorialesService } from "./editoriales.service";
import { Editorial } from "./../interfaces/Editorial";
import { Request } from 'express';

@Controller('editoriales')
export class EditorialesController {

	constructor(private editorialesService: EditorialesService){}
	
	@Get()
	obtenerEditoriales(@Req() request: Request){
		return this.editorialesService.obtenerEditoriales();
    }

    @Get(':id')
	obtenerEditorial(@Param('id') id){
		return this.editorialesService.obtenerEditorial(id);
	}
    
    @Post()
	crearEditorial(@Body() editorial:Editorial, @Req() request: Request){
		return this.editorialesService.crearEditorial(editorial);
    }
    
    @Put(':id')
	actualizarEditorial(@Param('id') id, @Body() editorial:Editorial, @Req() request: Request){
		return this.editorialesService.actualizarEditorial(id,editorial);
	}

	@Delete(':id')
	eliminarEditorial(@Param('id') id, @Req() request: Request){
		return this.editorialesService.eliminarEditorial(id);
	}
}
