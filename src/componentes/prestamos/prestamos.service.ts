import { Injectable } from '@nestjs/common';
import { Prestamo } from "src/interfaces/Prestamo";
import { Pedido } from "src/interfaces/Pedido";
import { Usuario } from "src/interfaces/Usuario";
import { Item } from "src/interfaces/Item";
import { Libro } from "src/interfaces/Libro";
import { Autor } from "src/interfaces/Autor";
import { Libro_Autor } from "src/interfaces/Libro_Autor";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
var request = require('request');

@Injectable()
export class PrestamosService {

	constructor(@InjectModel('Prestamo') private prestamoModelo: Model<Prestamo>,
    @InjectModel('Pedido') private pedidoModelo: Model<Pedido>,
    @InjectModel('Usuario') private usuarioModelo: Model<Usuario>,
    @InjectModel('Item') private itemModelo: Model<Item>,
    @InjectModel('Libro') private libroModelo: Model<Libro>,
    @InjectModel('Autor') private autorModelo: Model<Autor>,
    @InjectModel('Libro_Autor') private libro_autorModelo: Model<Libro_Autor>) {}

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

        //const prestamos = await this.prestamoModelo.find({"estado":2});
        var prestamos = [];
        if(datos.mes ==0){
            prestamos = await this.prestamoModelo.find({"estado":2,
            "fechaInicio":{"$gte":new Date(datos.anio+"-01-01 00:00:00.000Z"),
                            "$lte":new Date((datos.anio+1)+"-01-01 00:00:00.000Z")}});
        }else{
            if(datos.mes<10){
                var cadenaMes = "0"+datos.mes;
                var cadenaMesS = "0"+(datos.mes+1);
            }else{
                if(datos.mes<12){
                    var cadenaMes = ""+datos.mes;
                    var cadenaMesS = ""+(datos.mes+1);
                }else{
                    var cadenaMes = "12";
                    var cadenaMesS = "01";
                }
                
            }
            if(datos.mes!=12){
                prestamos = await this.prestamoModelo.find({"estado":2,
            "fechaInicio":{"$gte":new Date(datos.anio+"-"+cadenaMes+"-01 00:00:00.000Z"),
                            "$lte":new Date(datos.anio+"-"+cadenaMesS+"-01 00:00:00.000Z")}});
            }else{
                prestamos = await this.prestamoModelo.find({"estado":2,
            "fechaInicio":{"$gte":new Date(datos.anio+"-"+cadenaMes+"-01 00:00:00.000Z"),
                            "$lte":new Date((datos.anio+1)+"-"+cadenaMesS+"-01 00:00:00.000Z")}});
            }
            
        }
        //const prestamos = await this.prestamoModelo.find({"fechaInicio":{"$gte":new Date("2018-03-01 00:00:00.000Z")}});
        
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


    async obtenerPrestamosUsuario(id:String){
        const usuario = await this.usuarioModelo.findOne({'dni':id});
        const pedidos = await this.pedidoModelo.find({usuarioId:id,estado:2});
        var resultado = [];
        var item = [];
        var libro = [];
        var libro_autor = [];
        var autor = [];

        for (let pedido of pedidos) {
            if(!item[pedido.itemId]){
                item[pedido.itemId] = await this.itemModelo.findOne({itemId:pedido.itemId});
            }
            if(!libro[item[pedido.itemId].libroId]){
                libro[item[pedido.itemId].libroId] = await this.libroModelo.findOne({libroId:item[pedido.itemId].libroId});
            }
            if(!libro_autor[libro[item[pedido.itemId].libroId].libroId]){
                libro_autor[libro[item[pedido.itemId].libroId].libroId] = await this.libro_autorModelo.findOne({libroId:libro[item[pedido.itemId].libroId].libroId,tipo:1});
            }
            if(!autor[libro_autor[libro[item[pedido.itemId].libroId].libroId].autorId]){
                autor[libro_autor[libro[item[pedido.itemId].libroId].libroId].autorId] = await this.autorModelo.findOne({autorId:libro_autor[libro[item[pedido.itemId].libroId].libroId].autorId});
            }
            const prestamo = await this.prestamoModelo.findOne({pedidoId:pedido.pedidoId});
            await resultado.push({
                //pedido:pedido,
                //item:item,
                //libro:libro
                titulo:libro[item[pedido.itemId].libroId].titulo,
                nombreAutor: autor[libro_autor[libro[item[pedido.itemId].libroId].libroId].autorId].nombre,
                codigoBarra: item[pedido.itemId].codigoBarra,
                fechaInicio: prestamo.fechaInicio,
                fechaFin: prestamo.fechaFin,
                pedidoId: pedido.pedidoId,
                tipo: pedido.tipo,
                estado: prestamo.estado
            });
        }
        return resultado;
    }

    async analizarFinPrestamo(){
        
        var fechaActualS = new Date();
        fechaActualS.setTime( fechaActualS.getTime() + -5 * 60 * 60 * 1000 );
        //console.log(fechaActualS.toJSON());
        const prestamos = await this.prestamoModelo.find({"estado":1,
            "fechaFin":{"$lt":fechaActualS}
        });
        //console.log(prestamos);
        for (let prestamo of prestamos){
            const pedido = await this.pedidoModelo.findOne({"pedidoId":prestamo.pedidoId});
            await this.usuarioModelo.update({'dni':pedido.usuarioId},{'estado':3});
            await this.prestamoModelo.update({'prestamoId':prestamo.prestamoId},{'estado':0});
        }
    }
}
