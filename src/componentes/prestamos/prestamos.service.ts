import { Injectable } from '@nestjs/common';
import { Prestamo } from "src/interfaces/Prestamo";
import { Pedido } from "src/interfaces/Pedido";
import { Usuario } from "src/interfaces/Usuario";
import { Item } from "src/interfaces/Item";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PrestamosService {

	constructor(@InjectModel('Prestamo') private prestamoModelo: Model<Prestamo>,
    @InjectModel('Pedido') private pedidoModelo: Model<Pedido>,
    @InjectModel('Usuario') private usuarioModelo: Model<Usuario>,
    @InjectModel('Item') private itemModelo: Model<Item>) {}

    async obtenerPrestamos(){
		return await this.prestamoModelo.find();
    }
    
    async crearPrestamo(prestamo: Prestamo){
        const ultimoPrestamo:Prestamo = await this.prestamoModelo.findOne().sort({ prestamoId: 'desc'}).limit(1);
        if(ultimoPrestamo){
            prestamo.prestamoId = ultimoPrestamo.prestamoId + 1;
        }else{
            prestamo.prestamoId = 1;
        }
        const prestamoNuevo = new this.prestamoModelo(prestamo);
        return await prestamoNuevo.save();
    }
    
    async obtenerPrestamo(id:String){
        return await this.prestamoModelo.find({'prestamoId':id});
    }
    
    async actualizarPrestamo(id:String, prestamo:Prestamo){
		return await this.prestamoModelo.update({"prestamoId":id},prestamo);
	}

	async eliminarPrestamo(id:String){
		return await this.prestamoModelo.deleteOne({"prestamoId":id});
	}

    async obtenerPrestamosActivos(){
        var prestamos = await this.prestamoModelo.find({'estado':{$lte:1}});
        var resultado = [];

        for (let prestamo of prestamos) {
            const pedido = await this.pedidoModelo.findOne({'pedidoId':prestamo.pedidoId});
            const usuario = await this.usuarioModelo.findOne({'dni':pedido.usuarioId});
            await resultado.push({
                prestamoId:prestamo.prestamoId,
                pedidoId:prestamo.pedidoId,
                fechaInicio: prestamo.fechaInicio,
                fechaFin: prestamo.fechaFin,
                estado: prestamo.estado,
                dni: usuario.dni,
                nombres:usuario.nombres,
                apellidos:usuario.apellidos,
                codigo: usuario.codigo
            });
        }

        return resultado;
    }

    async recibirPrestamo(id:String, datos){
        const prestamo = await this.prestamoModelo.find({'prestamoId':id});
        const pedido = await this.pedidoModelo.findOne({'pedidoId':prestamo.pedidoId});
        await this.itemModelo.update({'itemId':pedido.itemId},{'disponibilidad':1});
        await this.usuarioModelo.update({'dni':pedido.usuarioId},{'estado':0});
        return await this.prestamoModelo.update({"prestamoId":id},datos);
    }
}
