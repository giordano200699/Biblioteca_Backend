import { Injectable } from '@nestjs/common';
import { Libro } from "src/interfaces/Libro";
import { Item } from "src/interfaces/Item";
import { Libro_Autor } from "src/interfaces/Libro_Autor";
import { Libro_Editorial } from "src/interfaces/Libro_Editorial";
import { Autor } from "src/interfaces/Autor";
import { Editorial } from "src/interfaces/Editorial";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LibrosService {

	constructor(@InjectModel('Libro') private libroModelo: Model<Libro>,
	@InjectModel('Item') private itemModelo: Model<Item>,
	@InjectModel('Libro_Autor') private libro_autorModelo: Model<Libro_Autor>,
	@InjectModel('Libro_Editorial') private libro_editorialModelo: Model<Libro_Editorial>,
	@InjectModel('Autor') private autorModelo: Model<Autor>,
	@InjectModel('Editorial') private editorialModelo: Model<Editorial>) {}

	async obtenerLibros(){
		return await this.libroModelo.find();
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
		const items = await this.itemModelo.find({'libroId':id});

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
}
