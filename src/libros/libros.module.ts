import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LibrosController } from "./libros.controller";
import { LibrosService } from "./libros.service";
import { LibroSchema } from './../esquemas/libro.schema';
import { ItemSchema } from './../esquemas/item.schema';
import { Libro_AutorSchema } from './../esquemas/libro_autor.schema';
import { Libro_EditorialSchema } from './../esquemas/libro_editorial.schema';
import { AutorSchema } from './../esquemas/autor.schema';
import { EditorialSchema } from './../esquemas/editorial.schema';
import { PrestamoSchema } from './../esquemas/prestamo.schema';
import { PedidoSchema } from './../esquemas/pedido.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Libro', schema: LibroSchema },
	{ name: 'Item', schema: ItemSchema },
	{ name: 'Libro_Autor', schema: Libro_AutorSchema },
	{ name: 'Libro_Editorial', schema: Libro_EditorialSchema },
	{ name: 'Autor', schema: AutorSchema },
	{ name: 'Editorial', schema: EditorialSchema },
	{ name: 'Prestamo', schema: PrestamoSchema },
	{ name: 'Pedido', schema: PedidoSchema }])],
	controllers: [LibrosController],
	providers: [LibrosService]
})
export class LibrosModule {}
