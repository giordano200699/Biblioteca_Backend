import { Injectable } from '@nestjs/common';
import { Pedido } from "src/interfaces/Pedido";
import { Item } from "src/interfaces/Item";
import { Usuario } from "src/interfaces/Usuario";
import { Libro } from "src/interfaces/Libro";
import { Autor } from "src/interfaces/Autor";
import { Libro_Autor } from "src/interfaces/Libro_Autor";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
var request = require('request');

@Injectable()
export class PedidosService {

	constructor(@InjectModel('Pedido') private pedidoModelo: Model<Pedido>,
    @InjectModel('Item') private itemModelo: Model<Item>,
    @InjectModel('Usuario') private usuarioModelo: Model<Usuario>,
    @InjectModel('Libro') private libroModelo: Model<Libro>,
    @InjectModel('Autor') private autorModelo: Model<Autor>,
    @InjectModel('Libro_Autor') private libro_autorModelo: Model<Libro_Autor>) {}

    async obtenerPedidos(){

		return await this.pedidoModelo.find();
    }
    
    async crearPedido(pedido: Pedido){

        var usuario = await this.usuarioModelo.findOne({'usuarioId':pedido.usuarioId});
        if(!usuario){
            usuario = await this.usuarioModelo.findOne({'dni':pedido.usuarioId});
        }
        const itemRelacionado = await this.itemModelo.findOne({'itemId':pedido.itemId});
        if(usuario.estado == 0 && itemRelacionado.disponibilidad==1){
            //await this.itemModelo.update({'itemId':pedido.itemId},{'disponibilidad':2});
            itemRelacionado.disponibilidad = 2;
            itemRelacionado.save();
            usuario.estado = 1;
            await usuario.save();
            const ultimoPedido:Pedido = await this.pedidoModelo.findOne().sort({ pedidoId: 'desc'}).limit(1);
            
            const libroRelacionado = await this.libroModelo.findOne({'libroId':itemRelacionado.libroId});
            if(ultimoPedido){
                pedido.pedidoId = ultimoPedido.pedidoId + 1;
            }else{
                pedido.pedidoId = 1;
            }
            const pedidoNuevo = new this.pedidoModelo(pedido);

            request.post( 'https://bibliotecafrontend.herokuapp.com/evento?Content-Type=application/json&clave=QDm6pbKeVwWikPvpMSUYwp0tNnxcaLoYLnyvLQ4ISV39uQOgsjTEjS0UNlZHwbxl2Ujf30S31CSKndwpkFeubt5gJHTgFlq7LeIaSYc0jNm44loPty2ZK1nI0qisrt2Xwq0nFhdp8H3kdpyL5wVZLH7EpSE6IO0cHAOGOfSpJjF36eiCuXJ3gkOfX8C4n',
             { 
                json:   {
                            nombreEvento: 'pedido creado',
                            contenidoEvento:{
                                                pedidoId: pedidoNuevo.pedidoId,
                                                numeroCopia: itemRelacionado.numeroCopia,
                                                titulo: libroRelacionado.titulo
                                            }
                        }
             },
            function (error, response, body) { if (!error && response.statusCode == 200) { console.log(body) } } );
            return await pedidoNuevo.save();
        }
        else{
            if(itemRelacionado.disponibilidad==0){
                return {tipoError:6,contenidoError:"El material no esta disponible para préstamo."};  
            }else if(itemRelacionado.disponibilidad==2){
                return {tipoError:7,contenidoError:"El material ya ha sido pedido por otro usuario."};  
            }else if(itemRelacionado.disponibilidad==3){
                return {tipoError:8,contenidoError:"El material ya ha sido prestado a otro usuario."};  
            }

            if(usuario.estado == 1){
                return {tipoError:1,contenidoError:"Usted ya ha pedido un material."};   
            }else if(usuario.estado == 2){
                return {tipoError:2,contenidoError:"Usted ya presenta un préstamo activo."}; 
            }else if(usuario.estado == 3){
                return {tipoError:3,contenidoError:"Usted está bloqueado(a), por favor devuelva el material prestado."}; 
            }else if(usuario.estado == 4){
                return {tipoError:4,contenidoError:"Usted está castigado(a), espere a que termine la sanción."};
            }
        }
        return {tipoError:5,contenidoError:"ERROR DESCONOCIDO, comuniquese con el Área de Biblioteca"};     
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
            var usuario = await this.usuarioModelo.findOne({'usuarioId':pedido.usuarioId});
            if(!usuario){
                usuario = await this.usuarioModelo.findOne({'dni':pedido.usuarioId});
            }
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
        var usuario = await this.usuarioModelo.findOne({'usuarioId':pedido[0].usuarioId});
        if(!usuario){
            usuario = await this.usuarioModelo.findOne({'dni':pedido[0].usuarioId});
        }
        usuario.estado = 0;
        await usuario.save();
        const itemRelacionado = await this.itemModelo.findOne({'itemId':pedido[0].itemId});
        const libroRelacionado = await this.libroModelo.findOne({'libroId':itemRelacionado.libroId});

        request.post( 'https://bibliotecafrontend.herokuapp.com/evento?Content-Type=application/json&clave=QDm6pbKeVwWikPvpMSUYwp0tNnxcaLoYLnyvLQ4ISV39uQOgsjTEjS0UNlZHwbxl2Ujf30S31CSKndwpkFeubt5gJHTgFlq7LeIaSYc0jNm44loPty2ZK1nI0qisrt2Xwq0nFhdp8H3kdpyL5wVZLH7EpSE6IO0cHAOGOfSpJjF36eiCuXJ3gkOfX8C4n',
         { 
            json:   {
                        nombreEvento: 'pedido rechazado',
                        contenidoEvento:{
                                            pedidoId: pedido[0].pedidoId,
                                            numeroCopia: itemRelacionado.numeroCopia,
                                            titulo: libroRelacionado.titulo,
                                            usuarioId: pedido[0].usuarioId,
                                            administradorId: datos.adminId
                                        }
                    }
         },
        function (error, response, body) { if (!error && response.statusCode == 200) { console.log(body) } } );

        return await this.pedidoModelo.update({"pedidoId":id},datos);
    }

    async aceptarPedido(id:String, datos){
        const pedido = await this.pedidoModelo.find({'pedidoId':id});
        await this.itemModelo.update({'itemId':pedido[0].itemId},{'disponibilidad':3});
        var usuario = await this.usuarioModelo.findOne({'usuarioId':pedido[0].usuarioId});
        if(!usuario){
            usuario = await this.usuarioModelo.findOne({'dni':pedido[0].usuarioId});
        }
        usuario.estado = 2;
        await usuario.save();
        const itemRelacionado = await this.itemModelo.findOne({'itemId':pedido[0].itemId});
        const libroRelacionado = await this.libroModelo.findOne({'libroId':itemRelacionado.libroId});

        request.post( 'https://bibliotecafrontend.herokuapp.com/evento?Content-Type=application/json&clave=QDm6pbKeVwWikPvpMSUYwp0tNnxcaLoYLnyvLQ4ISV39uQOgsjTEjS0UNlZHwbxl2Ujf30S31CSKndwpkFeubt5gJHTgFlq7LeIaSYc0jNm44loPty2ZK1nI0qisrt2Xwq0nFhdp8H3kdpyL5wVZLH7EpSE6IO0cHAOGOfSpJjF36eiCuXJ3gkOfX8C4n',
         { 
            json:   {
                        nombreEvento: 'pedido aceptado',
                        contenidoEvento:{
                                            pedidoId: pedido[0].pedidoId,
                                            numeroCopia: itemRelacionado.numeroCopia,
                                            titulo: libroRelacionado.titulo,
                                            usuarioId: pedido[0].usuarioId,
                                            administradorId: datos.adminId
                                        }
                    }
         },
        function (error, response, body) { if (!error && response.statusCode == 200) { console.log(body) } } );

        return await this.pedidoModelo.update({"pedidoId":id},datos);
    }

    async obtenerPedidosUsuario(id:String){
        var usuario = await this.usuarioModelo.findOne({'usuarioId':id});
        if(!usuario){
            usuario = await this.usuarioModelo.findOne({'dni':id});
        }
        const pedidos = await this.pedidoModelo.find({usuarioId:usuario.usuarioId});
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
            await resultado.push({
                //pedido:pedido,
                //item:item,
                //libro:libro
                titulo:libro[item[pedido.itemId].libroId].titulo,
                nombreAutor: autor[libro_autor[libro[item[pedido.itemId].libroId].libroId].autorId].nombre,
                codigoBarra: item[pedido.itemId].codigoBarra,
                fechaInicio: pedido.fechaInicio,
                fechaFin: pedido.fechaFin,
                pedidoId: pedido.pedidoId,
                tipo: pedido.tipo,
                estado: pedido.estado
            });
        }
        return resultado;
    }

    async obtenerEstadistica(datos){

        //const pedidos = await this.pedidoModelo.find();
        var pedidos = [];

        if(datos.mes ==0){
            pedidos = await this.pedidoModelo.find({
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
                pedidos = await this.pedidoModelo.find({
            "fechaInicio":{"$gte":new Date(datos.anio+"-"+cadenaMes+"-01 00:00:00.000Z"),
                            "$lte":new Date(datos.anio+"-"+cadenaMesS+"-01 00:00:00.000Z")}});
            }else{
                pedidos = await this.pedidoModelo.find({
            "fechaInicio":{"$gte":new Date(datos.anio+"-"+cadenaMes+"-01 00:00:00.000Z"),
                            "$lte":new Date((datos.anio+1)+"-"+cadenaMesS+"-01 00:00:00.000Z")}});
            }
            
        }

        var nuevosPedidos = [];
        var resultado = [];
        for (let pedido of pedidos) {
            if(!nuevosPedidos['p'+pedido.usuarioId]){
                nuevosPedidos['p'+pedido.usuarioId] = {usuarioId:pedido.usuarioId, cantidad:1};
            }
            else{
                await nuevosPedidos['p'+pedido.usuarioId].cantidad++;
            }
        }

        var arreglo = [];
        for (var indice in nuevosPedidos){
            arreglo.push(nuevosPedidos[indice]);
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
            var usuario = await this.usuarioModelo.findOne({usuarioId:dato.usuarioId});
            if(!usuario){
                usuario = await this.usuarioModelo.findOne({dni:dato.usuarioId});
            }
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
