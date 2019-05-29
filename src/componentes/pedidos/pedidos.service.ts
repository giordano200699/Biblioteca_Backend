import { Injectable } from '@nestjs/common';
import { Pedido } from "src/interfaces/Pedido";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PedidosService {

	constructor(@InjectModel('Pedido') private pedidoModelo: Model<Pedido>) {}

    async obtenerPedidos(){
		return await this.pedidoModelo.find();
    }
    
    async crearPedido(pedido: Pedido){
        const ultimoPedido:Pedido = await this.pedidoModelo.findOne().sort({ pedidoId: 'desc'}).limit(1);
        if(ultimoPedido){
            pedido.pedidoId = ultimoPedido.pedidoId + 1;
        }else{
            pedido.pedidoId = 1;
        }
        const pedidoNuevo = new this.pedidoModelo(pedido);
        return await pedidoNuevo.save();
    }
    
    async obtenerPedido(id:String){
        return await this.pedidoModelo.find({'pedidoId':id});
    }
    
    async actualizarPedido(id:String, pedido:Pedido){
		return await this.pedidoModelo.update({"pedidoId":id},pedido);
	}

	async eliminarPedido(id:String){
		return await this.pedidoModelo.deleteOne({"pedidoId":id});
	}
}
