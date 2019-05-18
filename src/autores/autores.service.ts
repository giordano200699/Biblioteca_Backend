import { Injectable } from '@nestjs/common';
import { Autor } from "src/interfaces/Autor";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AutoresService {

	constructor(@InjectModel('Autor') private autorModelo: Model<Autor>) {}

	async obtenerAutores(){
        //console.log(await this.autorModelo.count());
		return await this.autorModelo.find();
    }
    
    async crearAutor(autor: Autor){
        const ultimoAutor:Autor = await this.autorModelo.findOne().sort({ autorId: 'desc'}).limit(1);
        if(ultimoAutor){
            autor.autorId = ultimoAutor.autorId + 1;
        }else{
            autor.autorId = 1;
        }
        const autorNuevo = new this.autorModelo(autor);
        return await autorNuevo.save();
    }
    
    async obtenerAutor(id:String){
		return await this.autorModelo.find({'autorId':id});
    }
    
    async actualizarAutor(id:String, autor:Autor){
		return await this.autorModelo.update({"autorId":id},autor);
	}

	async eliminarAutor(id:String){
		return await this.autorModelo.deleteOne({"autorId":id});
	}
}
