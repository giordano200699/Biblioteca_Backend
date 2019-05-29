import { Injectable } from '@nestjs/common';
import { Prestamo } from "src/interfaces/Prestamo";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PrestamosService {

	constructor(@InjectModel('Prestamo') private prestamoModelo: Model<Prestamo>) {}

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
}
