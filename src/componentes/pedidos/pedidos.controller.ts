import { Controller, Get, Post, Put, Delete, Body,Param,Req } from '@nestjs/common';
import { PedidosService } from "./pedidos.service";
import { Pedido } from "./../../interfaces/Pedido";
import { Request } from 'express';

@Controller('pedidos')
export class PedidosController {

	constructor(private pedidosService: PedidosService){}
	
	@Get()
	obtenerPedidos(@Req() request: Request){
		return this.pedidosService.obtenerPedidos();
    }
    
    @Get('activos')
	obtenerPedidosActivos(@Req() request: Request){
		return this.pedidosService.obtenerPedidosActivos();
    }

    @Get('usuario/:id')
	obtenerPedidosUsuario(@Param('id') id){
		return this.pedidosService.obtenerPedidosUsuario(id);
	}

    @Get(':id')
	obtenerPedido(@Param('id') id){
		return this.pedidosService.obtenerPedido(id);
	}
    
    @Post()
	crearPedido(@Body() pedido:Pedido, @Req() request: Request){
		return this.pedidosService.crearPedido(pedido);
    }

    @Post('estadistica')
	obtenerEstadistica(@Body() datos){
		return this.pedidosService.obtenerEstadistica(datos);
    }

    @Post('cancelar/:id')
	cancelarPedido(@Body() datos, @Req() request: Request,@Param('id') id){
		return this.pedidosService.cancelarPedido(id,datos);
    }

    @Post('aceptar/:id')
	aceptarPedido(@Body() datos, @Req() request: Request,@Param('id') id){
		return this.pedidosService.aceptarPedido(id,datos);
    }
    
    @Put(':id')
	actualizarPedido(@Param('id') id, @Body() pedido:Pedido, @Req() request: Request){
		return this.pedidosService.actualizarPedido(id,pedido);
	}

	@Delete(':id')
	eliminarPedido(@Param('id') id, @Req() request: Request){
		return this.pedidosService.eliminarPedido(id);
	}


	
}
