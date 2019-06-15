import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TemasController } from "./temas.controller";
import { TemasService } from "./temas.service";
import { TemaSchema } from './../../esquemas/tema.schema';
import { Libro_TemaSchema } from './../../esquemas/libro_tema.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Tema', schema: TemaSchema },
	{ name: 'Libro_Tema', schema: Libro_TemaSchema }])],
	controllers: [TemasController],
	providers: [TemasService]
})
export class TemasModule {}
