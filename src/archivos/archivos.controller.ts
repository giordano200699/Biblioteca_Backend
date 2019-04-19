import { Controller, Get, Post, Put, Delete, Body,Param,Res,Req } from '@nestjs/common';
import { ArchivosService } from "./archivos.service";
import { Archivo } from "./../interfaces/Archivo";
var fs = require('fs');
const path = require('path');
import { Request } from 'express';

const CLAVE = "QDm6pbKeVwWikPvpMSUYwp0tNnxcaLoYLnyvLQ4ISV39uQOgsjTEjS0UNlZHwbxl2Ujf30S31CSKndwpkFeubt5gJHTgFlq7LeIaSYc0jNm44loPty2ZK1nI0qisrt2Xwq0nFhdp8H3kdpyL5wVZLH7EpSE6IO0cHAOGOfSpJjF36eiCuXJ3gkOfX8C4n";

@Controller('archivos')
export class ArchivosController {
	
	constructor(private archivosService: ArchivosService){}
	
	@Get('imagen/:id/:numero')
	obtenerImagenArchivo(@Param('id') id, @Param('numero') numero, @Res() respuesta,@Req() request: Request){
		if(request.query.clave == CLAVE){
			var objeto = this.archivosService.obtenerArchivo(id);
			objeto.then(function(res){
				var buf = Buffer.from(res[0].archivo.toString(), 'base64');  
				fs.writeFile(path.dirname(path.dirname(__dirname))+'/fotos/foto'+numero+'.png', buf,function(){
					return respuesta.sendFile(path.dirname(path.dirname(__dirname))+'/fotos/foto'+numero+'.png');
				});
				
			});
		}
		return this.archivosService.mensajeError(1);
	}
	@Get('ipUsuarioHistorial')
	obtenerIpUsuarioHistorial(@Res() respuesta){
		respuesta.sendFile(path.dirname(path.dirname(__dirname))+'/archivos/ipCliente.txt');
	}

	@Get(':id')
	obtenerArchivo(@Param('id') id,@Req() request: Request){
		if(request.query.clave == CLAVE){
			return this.archivosService.obtenerArchivo(id);
		}
		return this.archivosService.mensajeError(2);
	}

	@Post()
	crearArchivo(@Body() archivo:Archivo,@Req() request: Request){
		if(request.query.clave == CLAVE){
			return this.archivosService.crearArchivo(archivo);
		}
		return this.archivosService.mensajeError(3);
	}

	@Put(':id')
	actualizarArchivo(@Param('id') id, @Body() archivo:Archivo,@Req() request: Request){
		if(request.query.clave == CLAVE){
			return this.archivosService.actualizarArchivo(id,archivo);
		}
		return this.archivosService.mensajeError(4);
	}

	@Delete(':id')
	eliminarArchivo(@Param('id') id,@Req() request: Request){
		if(request.query.clave == CLAVE){
			return this.archivosService.eliminarArchivo(id);
		}
		return this.archivosService.mensajeError(5);
	}
}
