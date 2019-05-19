import { Injectable } from '@nestjs/common';
import { Editorial } from "src/interfaces/Editorial";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EditorialesService {

	constructor(@InjectModel('Editorial') private editorialModelo: Model<Editorial>) {}

    async obtenerEditoriales(){
		return await this.editorialModelo.find();
    }
    
    async crearEditorial(editorial: Editorial){
        const ultimaEditorial:Editorial = await this.editorialModelo.findOne().sort({ editorialId: 'desc'}).limit(1);
        if(ultimaEditorial){
            editorial.editorialId = ultimaEditorial.editorialId + 1;
        }else{
            editorial.editorialId = 1;
        }
        const editorialNueva = new this.editorialModelo(editorial);
        return await editorialNueva.save();
    }
    
    async obtenerEditorial(id:String){
        return await this.editorialModelo.find({'editorialId':id});
    }
    
    async actualizarEditorial(id:String, editorial:Editorial){
		return await this.editorialModelo.update({"editorialId":id},editorial);
	}

	async eliminarEditorial(id:String){
		return await this.editorialModelo.deleteOne({"editorialId":id});
	}
}
