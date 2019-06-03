import { Injectable } from '@nestjs/common';
import { Pedido } from "src/interfaces/Pedido";
import { Item } from "src/interfaces/Item";
import { Usuario } from "src/interfaces/Usuario";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PedidosService {

	constructor(@InjectModel('Pedido') private pedidoModelo: Model<Pedido>,
    @InjectModel('Item') private itemModelo: Model<Item>,
    @InjectModel('Usuario') private usuarioModelo: Model<Usuario>) {}

    async obtenerPedidos(){
		return await this.pedidoModelo.find();
    }
    
    async crearPedido(pedido: Pedido){
        await this.itemModelo.update({'itemId':pedido.itemId},{'disponibilidad':2});
        await this.usuarioModelo.update({'dni':pedido.usuarioId},{'estado':1});
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

    async obtenerPedidosActivos(){
        var pedidos = await this.pedidoModelo.find({'estado':1});
        var resultado = [];

        for (let pedido of pedidos) {
            const usuario = await this.usuarioModelo.findOne({'dni':pedido.usuarioId});
            await resultado.push({
                pedidoId:pedido.pedidoId,
                usuarioId: pedido.usuarioId,
                itemId: pedido.itemId,
                fechaInicio: pedido.fechaInicio,
                estado: pedido.estado,
                tipo: pedido.tipo,
                dni: usuario.dni,
                nombres:usuario.nombres,
                apellidos:usuario.apellidos,
                codigo: usuario.codigo
            });
        }

        return resultado;
    }

    async cancelarPedido(id:String, datos){
        const pedido = await this.pedidoModelo.find({'pedidoId':id});
        await this.itemModelo.update({'itemId':pedido[0].itemId},{'disponibilidad':1});
        await this.usuarioModelo.update({'dni':pedido[0].usuarioId},{'estado':0});
        return await this.pedidoModelo.update({"pedidoId":id},datos);
    }
}
