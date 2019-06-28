import { Injectable } from '@nestjs/common';
import { Castigo } from "src/interfaces/Castigo";
import { Prestamo } from "src/interfaces/Prestamo";
import { Pedido } from "src/interfaces/Pedido";
import { Item } from "src/interfaces/Item";
import { Usuario } from "src/interfaces/Usuario";
import { Libro } from "src/interfaces/Libro";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
var request = require('request');

@Injectable()
export class CastigosService {

	constructor(@InjectModel('Castigo') private castigoModelo: Model<Castigo>,
    @InjectModel('Prestamo') private prestamoModelo: Model<Prestamo>,
    @InjectModel('Pedido') private pedidoModelo: Model<Pedido>,
    @InjectModel('Item') private itemModelo: Model<Item>,
    @InjectModel('Usuario') private usuarioModelo: Model<Usuario>,
    @InjectModel('Libro') private libroModelo: Model<Libro>) {}

    async crearCastigo(datos){

        var fechaActualS = new Date();
        var fechaFin = new Date();
        fechaActualS.setTime( fechaActualS.getTime() + -5 * 60 * 60 * 1000 );
        fechaFin.setTime( fechaFin.getTime() + -5 * 60 * 60 * 1000 );

        const mes = fechaActualS.getMonth()+1;
        var ciclo = null;
        if(mes<7){
            ciclo = ""+fechaActualS.getFullYear()+"-1"
        }else{
            ciclo = ""+fechaActualS.getFullYear()+"-2";
        }
        const prestamo = await this.prestamoModelo.findOne({"prestamoId":datos.prestamoId});
        const pedido = await this.pedidoModelo.findOne({"pedidoId":prestamo.pedidoId});

        await this.itemModelo.update({'itemId':pedido.itemId},{'disponibilidad':1});
        prestamo.estado = 3;
        prestamo.fechaDevolucion = fechaFin;
        await prestamo.save();
        var usuario = await this.usuarioModelo.findOne({'usuarioId':pedido.usuarioId});
        if(!usuario){
            usuario = await this.usuarioModelo.findOne({'dni':pedido.usuarioId});
        }
        usuario.estado = 4;
        await usuario.save();

        const castigos = await this.castigoModelo.find({"usuarioId":pedido.usuarioId,"ciclo":ciclo}).sort({ orden: 'desc'}).limit(1);
        const ultimoCastigo = await this.castigoModelo.findOne().sort({ castigoId: 'desc'}).limit(1);
        var nuevoId;
        var nuevoOrden;
        if(ultimoCastigo){
            nuevoId = ultimoCastigo.castigoId + 1;
        }else{
            nuevoId = 1;
        }
        if(castigos.length==1){
            nuevoOrden = castigos[0].orden+1;
        }else{
            nuevoOrden = 1;
        }
        if(nuevoOrden ==1){
            fechaFin.setDate(fechaFin.getDate() + 3);
        }else if(nuevoOrden == 2){
            fechaFin.setDate(fechaFin.getDate() + 7);
        }else if(nuevoOrden == 3){
            fechaFin.setDate(fechaFin.getDate() + 15);
        }else{
            if(mes<7){
                fechaFin = new Date(fechaActualS.getFullYear()+"-07-01 00:00:00.000Z");
            }else{
                fechaFin = new Date((fechaActualS.getFullYear()+1)+"-01-01 00:00:00.000Z"); 
            }
        }

        const castigoNuevo = new this.castigoModelo({
            castigoId:nuevoId,
            orden: nuevoOrden,
            fechaInicio: fechaActualS,
            fechaFin: fechaFin,
            ciclo: ciclo,
            prestamoId: prestamo.prestamoId,
            estado: 1,
            usuarioId: usuario.usuarioId
        });
        return await castigoNuevo.save();
    }

    async analizarFinCastigo(){
        var fechaActualS = new Date();
        fechaActualS.setTime( fechaActualS.getTime() + -5 * 60 * 60 * 1000 );
        const castigosActivos = await this.castigoModelo.find({"estado":1,
            "fechaFin":{"$lt":fechaActualS}
        });
        for (let castigo of castigosActivos){
            await this.usuarioModelo.update({'usuarioId':castigo.usuarioId},{'estado':0});
            castigo.estado = 0;
            castigo.save();
        }

    }

}
