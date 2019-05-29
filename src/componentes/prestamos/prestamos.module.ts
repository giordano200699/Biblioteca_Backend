import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrestamosController } from "./prestamos.controller";
import { PrestamosService } from "./prestamos.service";
import { PrestamoSchema } from './../../esquemas/prestamo.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Prestamo', schema: PrestamoSchema }])],
	controllers: [PrestamosController],
	providers: [PrestamosService]
})
export class PrestamosModule {}
