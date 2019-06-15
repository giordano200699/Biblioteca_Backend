import { Injectable } from '@nestjs/common';
import { Tema } from "src/interfaces/Tema";
import { Libro_Tema } from "src/interfaces/Libro_Tema";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TemasService {

    constructor(@InjectModel('Tema') private temaModelo: Model<Tema>,
    @InjectModel('Libro_Tema') private libro_temaModelo: Model<Libro_Tema>) {}

    async obtenerTemas(){
		return await this.temaModelo.find();
    }
    
    async crearTema(tema: Tema){
        const ultimoTema:Tema = await this.temaModelo.findOne().sort({ temaId: 'desc'}).limit(1);
        if(ultimoTema){
            tema.temaId = ''+(parseInt(ultimoTema.temaId+'') + 1);
        }else{
            tema.temaId = '1';
        }
        const temaNuevo = new this.temaModelo(tema);
        return await temaNuevo.save();
    }
    
    async obtenerTema(id:String){
        return await this.temaModelo.find({'temaId':id});
    }
    
    async actualizarTema(id:String, tema:Tema){
		return await this.temaModelo.update({"temaId":id},tema);
	}

	async eliminarTema(id:String){
		return await this.temaModelo.deleteOne({"temaId":id});
    }
    
    async relacionarLibro(datos:Libro_Tema){
        const libroTema = new this.libro_temaModelo(datos);
        return await libroTema.save();
    }

    async actualizarRelacionarLibro(datos:Libro_Tema){
        return await this.libro_temaModelo.update({"libroId":datos.libroId},datos);
    }

    async obtenerRelacionesLibros(id:String){
        return await this.libro_temaModelo.find({"libroId":parseInt(id+'')});
    }
}
