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

    @Get(':id')
	obtenerPedido(@Param('id') id){
		return this.pedidosService.obtenerPedido(id);
	}
    
    @Post()
	crearPedido(@Body() pedido:Pedido, @Req() request: Request){
		return this.pedidosService.crearPedido(pedido);
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
