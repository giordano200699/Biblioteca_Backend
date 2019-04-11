import { Controller, Get, Post, Put, Delete, Body,Param } from '@nestjs/common';
import { ArchivosService } from "./archivos.service";
import { Archivo } from "src/interfaces/Archivo";

@Controller('archivos')
export class ArchivosController {
	
	constructor(private archivosService: ArchivosService){}
	
	@Get(':id')
	obtenerArchivo(@Param('id') id): Promise<Archivo> {
		return this.archivosService.obtenerArchivo(id);
	}

	@Post()
	crearArchivo(@Body() archivo:Archivo): Promise<Archivo> {
		return this.archivosService.crearArchivo(archivo);
	}

	@Put(':id')
	actualizarArchivo(@Param('id') id, @Body() archivo:Archivo): Promise<Archivo> {
		return this.archivosService.actualizarArchivo(id,archivo);
	}

	@Delete(':id')
	eliminarArchivo(@Param('id') id): Promise<Archivo> {
		return this.archivosService.eliminarArchivo(id);
	}
}
