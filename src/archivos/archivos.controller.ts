import { Controller, Get, Post, Put, Delete, Body,Param,Res } from '@nestjs/common';
import { ArchivosService } from "./archivos.service";
import { Archivo } from "./../interfaces/Archivo";
var fs = require('fs');
const path = require('path');

@Controller('archivos')
export class ArchivosController {
	
	constructor(private archivosService: ArchivosService){}
	
	@Get('imagen/:id/:numero')
	obtenerImagenArchivo(@Param('id') id, @Param('numero') numero, @Res() respuesta) {
		var objeto = this.archivosService.obtenerArchivo(id);
		objeto.then(function(res){
			var buf = Buffer.from(res[0].archivo.toString(), 'base64');  
			fs.writeFile(path.dirname(path.dirname(__dirname))+'/fotos/foto'+numero+'.png', buf,function(){
				return respuesta.sendFile(path.dirname(path.dirname(__dirname))+'/fotos/foto'+numero+'.png');
			});
			
		});
	}
	@Get(':id')
	obtenerArchivo(@Param('id') id) : Promise<Archivo>{
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
