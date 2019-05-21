import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LibrosController } from "./libros.controller";
import { LibrosService } from "./libros.service";
import { LibroSchema } from './../esquemas/libro.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Libro', schema: LibroSchema }])],
	controllers: [LibrosController],
	providers: [LibrosService]
})
export class LibrosModule {}
