import { Controller, Get, Post, Put, Delete, Body,Param,Req } from '@nestjs/common';
import { PrestamosService } from "./prestamos.service";
import { Prestamo } from "./../../interfaces/Prestamo";
import { Request } from 'express';
const cron = require("node-cron");

@Controller('prestamos')
export class PrestamosController {

	constructor(private prestamosService: PrestamosService){
		var mithis = this;
		cron.schedule("* * * * *", function() {
	      mithis.prestamosService.analizarFinPrestamo();
	    });
	}
	
	@Get()
	obtenerPrestamos(@Req() request: Request){
		return this.prestamosService.obtenerPrestamos();
    }

    @Get('activos')
	obtenerPrestamosActivos(@Req() request: Request){
		return this.prestamosService.obtenerPrestamosActivos();
    }

    @Get('usuario/:id')
	obtenerPrestamosUsuario(@Param('id') id){
		return this.prestamosService.obtenerPrestamosUsuario(id);
	}

    @Get(':id')
	obtenerPrestamo(@Param('id') id){
		return this.prestamosService.obtenerPrestamo(id);
	}
    
    @Post()
	crearPrestamo(@Body() prestamo:Prestamo, @Req() request: Request){
		return this.prestamosService.crearPrestamo(prestamo);
    }

    @Post('estadistica')
	obtenerEstadistica(@Body() datos){
		return this.prestamosService.obtenerEstadistica(datos);
    }

    @Post('recibir/:id')
	recibirPrestamo(@Body() datos, @Req() request: Request,@Param('id') id){
		return this.prestamosService.recibirPrestamo(id,datos);
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
