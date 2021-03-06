import { Injectable } from '@nestjs/common';
import { Libro } from "src/interfaces/Libro";
import { Item } from "src/interfaces/Item";
import { Libro_Autor } from "src/interfaces/Libro_Autor";
import { Libro_Editorial } from "src/interfaces/Libro_Editorial";
import { Autor } from "src/interfaces/Autor";
import { Editorial } from "src/interfaces/Editorial";
import { Prestamo } from "src/interfaces/Prestamo";
import { Pedido } from "src/interfaces/Pedido";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LibrosService {

	constructor(@InjectModel('Libro') private libroModelo: Model<Libro>,
	@InjectModel('Item') private itemModelo: Model<Item>,
	@InjectModel('Libro_Autor') private libro_autorModelo: Model<Libro_Autor>,
	@InjectModel('Libro_Editorial') private libro_editorialModelo: Model<Libro_Editorial>,
	@InjectModel('Autor') private autorModelo: Model<Autor>,
	@InjectModel('Editorial') private editorialModelo: Model<Editorial>,
	@InjectModel('Prestamo') private prestamoModelo: Model<Prestamo>,) {}
	@InjectModel('Pedido') private pedidoModelo: Model<Pedido>

	async obtenerLibros(){
		return await this.libroModelo.find();
	}

	async obtenerLibrosConFormato(){
		const libros = await this.libroModelo.find().limit(10);

		var resultado = [];

		for (let libro of libros){
			

			const autorM = await this.libro_autorModelo.aggregate([{
				$lookup:
			    {
			        from: "autors",
			        localField: "autorId",
			        foreignField : "autorId",
			        as: "autores"
			    }
			},{
			    $match:{
			    	"libroId":libro.libroId
		    }}]);

		    const editorialM = await this.libro_editorialModelo.aggregate([{
				$lookup:
			    {
			        from: "editorials",
			        localField: "editorialId",
			        foreignField : "editorialId",
			        as: "editoriales"
			    }
			},{
			    $match:{
			    	"libroId":libro.libroId
		    }}]);

		    var dato = {autores:autorM,
		    	editoriales:editorialM,
		    	libro:{
					libroId: libro.libroId,
					clasificacion: libro.clasificacion,
					titulo: libro.titulo
			}};
				
			
			await resultado.push(dato);
		}
		return resultado;
	}
		
	async crearLibro(libro: Libro){
		const ultimoLibro:Libro = await this.libroModelo.findOne().sort({ libroId: 'desc'}).limit(1);
		if(ultimoLibro){
				libro.libroId = ultimoLibro.libroId + 1;
		}else{
				libro.libroId = 1;
		}
		const libroNuevo = new this.libroModelo(libro);
		return await libroNuevo.save();
	}
		
	async obtenerLibro(id:String){
		return await this.libroModelo.find({'libroId':id});
	}
		
	async actualizarLibro(id:String, libro:Libro){
		return await this.libroModelo.update({"libroId":id},libro);
	}
	
	async eliminarLibro(id:String){
		return await this.libroModelo.deleteOne({"libroId":id});
	}

	async obtenerItems(id:String){
		return await this.itemModelo.find({'libroId':id});
	}

	async obtenerItem(id:String,id2:String){
		return await this.itemModelo.find({'libroId':id,'itemId':id2});
	}

	async crearItem(id:string,item: Item){
		const ultimoItem:Item = await this.itemModelo.findOne().sort({ itemId: 'desc'}).limit(1);
		item.libroId = parseInt(id);
		if(ultimoItem){
			item.itemId = ultimoItem.itemId + 1;
			const ultimoItemCompanero = await this.itemModelo.findOne({libroId:item.libroId}).sort({ numeroCopia: 'desc'}).limit(1);
			if(ultimoItemCompanero){
				item.numeroCopia = ultimoItemCompanero.numeroCopia+1;
			}else{
				item.numeroCopia = 1;
			}
			
		}else{
			item.itemId = 1;
			item.numeroCopia = 1;
		}
		
		const itemNuevo = new this.itemModelo(item);
		return await itemNuevo.save();
	}

	async actualizarItem(id:String, id2:String, item:Item){
		return await this.itemModelo.update({'libroId':id,'numeroCopia':id2},item);
	}

	async actualizarItemPorId(id:String, id2:String, item:Item){
		return await this.itemModelo.update({'libroId':id,'itemId':id2},item);
	}

	async eliminarUltimoItem(id:String){
		const ultimoItem:Item = await this.itemModelo.findOne({"libroId":id}).sort({ numeroCopia: 'desc'}).limit(1);
		if(ultimoItem){
			return await this.itemModelo.deleteOne({"itemId":ultimoItem.itemId});
		}
		return [];
	}

	async eliminarItem(id:String, id2:String){
		const itemEliminado:Item = await this.itemModelo.findOne({'libroId':id,'numeroCopia':id2});
		if(itemEliminado){
			const itemsSiguientes = await this.itemModelo.find({
				'numeroCopia':{$gt:itemEliminado.numeroCopia}
			});
			itemsSiguientes.forEach(async elemento => {
				await this.itemModelo.update({'itemId':elemento.itemId},{$inc:{'numeroCopia':-1}});
			});
			return await this.itemModelo.deleteOne({'itemId':itemEliminado.itemId});
		}
		return [];
	}

	async eliminarItemPorId(id:String, id2:String){
		const itemEliminado:Item = await this.itemModelo.findOne({'libroId':id,'itemId':id2});
		if(itemEliminado){
			const itemsSiguientes = await this.itemModelo.find({
				'numeroCopia':{$gt:itemEliminado.numeroCopia}
			});
			itemsSiguientes.forEach(async elemento => {
				await this.itemModelo.update({'itemId':elemento.itemId},{$inc:{'numeroCopia':-1}});
			});
			return await this.itemModelo.deleteOne({'itemId':itemEliminado.itemId});
		}
		return [];
	}

	async relacionarAutor(id:string,id2:string,libro_autor: Libro_Autor){
		libro_autor.libroId = parseInt(id);
		libro_autor.autorId = parseInt(id2);
		const libro_autorNuevo = new this.libro_autorModelo(libro_autor);
		return await libro_autorNuevo.save();
	}

	async eliminarRelacionAutor(id:string,id2:string){
		return await this.libro_autorModelo.deleteOne({"libroId":id,"autorId":id2});
	}

	async obtenerRelacionesAutor(id:string){
		return await this.libro_autorModelo.find({"libroId":id});
	}

	async relacionarEditorial(id:string,id2:string,libro_editorial: Libro_Editorial){
		libro_editorial.libroId = parseInt(id);
		libro_editorial.editorialId = parseInt(id2);
		const libro_editorialNuevo = new this.libro_editorialModelo(libro_editorial);
		return await libro_editorialNuevo.save();
	}

	async eliminarRelacionEditorial(id:string,id2:string){
		return await this.libro_editorialModelo.deleteOne({"libroId":id,"editorialId":id2});
	}

	async obtenerRelacionesEditorial(id:string){
		return await this.libro_editorialModelo.find({"libroId":id});
	}

	async obtenerTotalInformacion(id:string){
		const libro_autor = await this.libro_autorModelo.find({"libroId":id});
		const libro_editorial = await this.libro_editorialModelo.find({"libroId":id});
		const items = await this.itemModelo.find({'libroId':id}).sort({ numeroCopia: 'asc'});

		var resultado = [];
		var dato = {autores:[],editoriales:[],items:[]};

		if(libro_autor){
			for (let elemento of libro_autor) {
				const autor = await this.autorModelo.findOne({"autorId":elemento.autorId});
				await dato.autores.push(autor);
			}
		}

		if(libro_editorial){
			for (let elemento of libro_editorial) {
				const editorial = await this.editorialModelo.findOne({"editorialId":elemento.editorialId});
				await dato.editoriales.push(editorial);
			}
		}

		if(items){
			for (let elemento of items) {
				await dato.items.push(elemento);
			}
		}

		return dato;
	}

	async paginadoLibros(pagina,dato){
		if(parseInt(pagina)>0){
			if(pagina!=''){
				return await this.libroModelo.find({"titulo":{'$regex': dato.busqueda}}).skip(4*(parseInt(pagina)-1)).limit(5);
			}else{
				return await this.libroModelo.find().skip(4*(parseInt(pagina)-1)).limit(5);
			}
			
		}
		return [];
	}

	async paginadoLibrosF(pagina,dato){
		if(parseInt(pagina)>0){
			var libros = [];
			var cantLibros = 0;
			if(pagina!=''){
				//var regex = new RegExp(["/", dato.busqueda, "/"].join(""), "i");
				libros = await this.libroModelo.find({"titulo":{'$regex': new RegExp(dato.busqueda, "i")}}).skip(10*(parseInt(pagina)-1)).limit(10);
				cantLibros = await this.libroModelo.find({"titulo":{'$regex': new RegExp(dato.busqueda, "i")}}).count();
			}else{
				libros = await this.libroModelo.find().skip(4*(parseInt(pagina)-1)).limit(10);
				cantLibros = await this.libroModelo.count();
			}

			var resultado = [];

			for (let libro of libros){
				

				const autorM = await this.libro_autorModelo.aggregate([{
					$lookup:
				    {
				        from: "autors",
				        localField: "autorId",
				        foreignField : "autorId",
				        as: "autores"
				    }
				},{
				    $match:{
				    	"libroId":libro.libroId
			    }}]);

			    const editorialM = await this.libro_editorialModelo.aggregate([{
					$lookup:
				    {
				        from: "editorials",
				        localField: "editorialId",
				        foreignField : "editorialId",
				        as: "editoriales"
				    }
				},{
				    $match:{
				    	"libroId":libro.libroId
			    }}]);

			    const dato = {autores:autorM,
			    	editoriales:editorialM,
			    	libro:{
						libroId: libro.libroId,
						clasificacion: libro.clasificacion,
						titulo: libro.titulo
				}};
					
				
				await resultado.push(dato);
			}
			return {resultado:resultado,cantLibros:cantLibros};
			
		}
		return {};
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

        var nuevosPrestamos = [];
        var resultado = [];
        //return prestamos;
        for (let prestamo of prestamos) {
            const pedido = await this.pedidoModelo.findOne({pedidoId:prestamo.pedidoId});
            const item = await this.itemModelo.findOne({itemId:pedido.itemId});
            if(!nuevosPrestamos['p'+item.libroId]){
                nuevosPrestamos['p'+item.libroId] = {libroId:item.libroId, cantidad:1};
            }
            else{
                await nuevosPrestamos['p'+item.libroId].cantidad++;
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
            const libro = await this.libroModelo.findOne({libroId:dato.libroId});
            await resultado.push({
                titulo:libro.titulo,
                libroId: libro.libroId,
                cantidad: dato.cantidad
            })

        }

        return resultado;
    }
}
