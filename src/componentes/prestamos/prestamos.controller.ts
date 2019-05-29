import { Controller, Get, Post, Put, Delete, Body,Param,Req } from '@nestjs/common';
import { PrestamosService } from "./prestamos.service";
import { Prestamo } from "./../../interfaces/Prestamo";
import { Request } from 'express';

@Controller('prestamos')
export class PrestamosController {

	constructor(private prestamosService: PrestamosService){}
	
	@Get()
	obtenerPrestamos(@Req() request: Request){
		return this.prestamosService.obtenerPrestamos();
    }

    @Get(':id')
	obtenerPrestamo(@Param('id') id){
		return this.prestamosService.obtenerPrestamo(id);
	}
    
    @Post()
	crearPrestamo(@Body() prestamo:Prestamo, @Req() request: Request){
		return this.prestamosService.crearPrestamo(prestamo);
    }
    
    @Put(':id')
	actualizarPrestamo(@Param('id') id, @Body() prestamo:Prestamo, @Req() request: Request){
		return this.prestamosService.actualizarPrestamo(id,prestamo);
	}

	@Delete(':id')
	eliminarPrestamo(@Param('id') id, @Req() request: Request){
		return this.prestamosService.eliminarPrestamo(id);
	}
}
