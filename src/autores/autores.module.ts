import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AutoresController } from "./autores.controller";
import { AutoresService } from "./autores.service";
import { AutorSchema } from './../esquemas/autor.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Autor', schema: AutorSchema }])],
	controllers: [AutoresController],
	providers: [AutoresService]
})
export class AutoresModule {}
