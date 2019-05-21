import { Injectable } from '@nestjs/common';
import { Libro } from "src/interfaces/Libro";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LibrosService {

	constructor(@InjectModel('Libro') private libroModelo: Model<Libro>) {}

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
    
}
