import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArchivosController } from "./archivos.controller";
import { ArchivosService } from "./archivos.service";
import { ArchivoSchema } from './../esquemas/archivo.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Archivo', schema: ArchivoSchema }])],
	controllers: [ArchivosController],
	providers: [ArchivosService]
})
export class ArchivosModule {}
