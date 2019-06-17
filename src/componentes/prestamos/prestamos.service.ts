import { Injectable } from '@nestjs/common';
import { Prestamo } from "src/interfaces/Prestamo";
import { Pedido } from "src/interfaces/Pedido";
import { Usuario } from "src/interfaces/Usuario";
import { Item } from "src/interfaces/Item";
import { Libro } from "src/interfaces/Libro";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
var request = require('request');

@Injectable()
export class PrestamosService {

	constructor(@InjectModel('Prestamo') private prestamoModelo: Model<Prestamo>,
    @InjectModel('Pedido') private pedidoModelo: Model<Pedido>,
    @InjectModel('Usuario') private usuarioModelo: Model<Usuario>,
    @InjectModel('Item') private itemModelo: Model<Item>,
    @InjectModel('Libro') private libroModelo: Model<Libro>) {}

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
        const prestamo = await this.prestamoModelo.findOne({'prestamoId':id});
        const pedido = await this.pedidoModelo.findOne({'pedidoId':prestamo.pedidoId});
        await this.itemModelo.update({'itemId':pedido.itemId},{'disponibilidad':1});
        await this.usuarioModelo.update({'dni':pedido.usuarioId},{'estado':0});
        const itemRelacionado = await this.itemModelo.findOne({'itemId':pedido.itemId});
        const libroRelacionado = await this.libroModelo.findOne({'libroId':itemRelacionado.libroId});

        request.post( 'https://bibliotecafrontend.herokuapp.com/evento?Content-Type=application/json&clave=QDm6pbKeVwWikPvpMSUYwp0tNnxcaLoYLnyvLQ4ISV39uQOgsjTEjS0UNlZHwbxl2Ujf30S31CSKndwpkFeubt5gJHTgFlq7LeIaSYc0jNm44loPty2ZK1nI0qisrt2Xwq0nFhdp8H3kdpyL5wVZLH7EpSE6IO0cHAOGOfSpJjF36eiCuXJ3gkOfX8C4n',
         { 
            json:   {
                        nombreEvento: 'prestamo finalizado',
                        contenidoEvento:{
                                            pedidoId: pedido.pedidoId,
                                            numeroCopia: itemRelacionado.numeroCopia,
                                            titulo: libroRelacionado.titulo,
                                            usuarioId: pedido.usuarioId,
                                            administradorId: datos.adminId,
                                            libroId: libroRelacionado.libroId
                                        }
                    }
         },
        function (error, response, body) { if (!error && response.statusCode == 200) { console.log(body) } } );

        return await this.prestamoModelo.update({"prestamoId":id},datos);
    }

    async obtenerEstadistica(datos){

        const prestamos = await this.prestamoModelo.find({"estado":2});
        var nuevosPrestamos = [];
        var resultado = [];
        //return prestamos;
        for (let prestamo of prestamos) {
            const pedido = await this.pedidoModelo.findOne({pedidoId:prestamo.pedidoId});
            if(!nuevosPrestamos['p'+pedido.usuarioId]){
                nuevosPrestamos['p'+pedido.usuarioId] = {usuarioId:pedido.usuarioId, cantidad:1};
            }
            else{
                await nuevosPrestamos['p'+pedido.usuarioId].cantidad++;
            }
        }
        var arreglo = [];
        for (var indice in nuevosPrestamos){
            arreglo.push(nuevosPrestamos[indice]);
        }

        await arreglo.sort(function (a, b) {
          if (a.cantidad > b.cantidad) {
            return -1;
          }
          if (a.cantidad < b.cantidad) {
            return 1;
          }
          return 0;
        });

        arreglo = await arreglo.slice(0,10);


        for (let dato of arreglo) {
            const usuario = await this.usuarioModelo.findOne({dni:dato.usuarioId});
            await resultado.push({
                apellidos:usuario.apellidos,
                nombres: usuario.nombres,
                usuarioId: dato.usuarioId,
                cantidad: dato.cantidad
            })

        }

        return resultado;
    }
}
