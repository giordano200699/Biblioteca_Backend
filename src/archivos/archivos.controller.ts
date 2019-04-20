import { Controller, Get, Post, Put, Delete, Body,Param,Res,Req } from '@nestjs/common';
import { ArchivosService } from "./archivos.service";
import { Archivo } from "./../interfaces/Archivo";
var fs = require('fs');
const path = require('path');
import { Request } from 'express';

@Controller('archivos')
export class ArchivosController {
	
	constructor(private archivosService: ArchivosService){}
	
	@Get('imagen/:id/:numero')
	obtenerImagenArchivo(@Param('id') id, @Param('numero') numero, @Res() respuesta,@Req() request: Request){
		var objeto = this.archivosService.obtenerArchivo(id);
		objeto.then(function(res){
			var buf = Buffer.from(res[0].archivo.toString(), 'base64');  
			fs.writeFile(path.dirname(path.dirname(__dirname))+'/fotos/foto'+numero+'.png', buf,function(){
				return respuesta.sendFile(path.dirname(path.dirname(__dirname))+'/fotos/foto'+numero+'.png');
			});
			
		});
	}
	@Get('ipUsuarioHistorial')
	obtenerIpUsuarioHistorial(@Res() respuesta){
		respuesta.sendFile(path.dirname(path.dirname(__dirname))+'/archivos/ipCliente.txt');
	}

	@Get(':id')
	obtenerArchivo(@Param('id') id,@Req() request: Request){
		return this.archivosService.obtenerArchivo(id);
	}

	@Post()
	crearArchivo(@Body() archivo:Archivo,@Req() request: Request){
		return this.archivosService.crearArchivo(archivo);
	}

	@Put(':id')
	actualizarArchivo(@Param('id') id, @Body() archivo:Archivo,@Req() request: Request){
		return this.archivosService.actualizarArchivo(id,archivo);
	}

	@Delete(':id')
	eliminarArchivo(@Param('id') id,@Req() request: Request){
		return this.archivosService.eliminarArchivo(id);
	}
}
