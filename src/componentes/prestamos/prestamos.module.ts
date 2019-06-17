import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrestamosController } from "./prestamos.controller";
import { PrestamosService } from "./prestamos.service";
import { PrestamoSchema } from './../../esquemas/prestamo.schema';
import { PedidoSchema } from './../../esquemas/pedido.schema';
import { UsuarioSchema } from './../../esquemas/usuario.schema';
import { ItemSchema } from './../../esquemas/item.schema';
import { LibroSchema } from './../../esquemas/libro.schema';
import { AutorSchema } from './../../esquemas/autor.schema';
import { Libro_AutorSchema } from './../../esquemas/libro_autor.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Prestamo', schema: PrestamoSchema },
	{ name: 'Pedido', schema: PedidoSchema },
	{ name: 'Usuario', schema: UsuarioSchema },
	{ name: 'Item', schema: ItemSchema },
	{ name: 'Libro', schema: LibroSchema },
	{ name: 'Autor', schema: AutorSchema },
	{ name: 'Libro_Autor', schema: Libro_AutorSchema }])],
	controllers: [PrestamosController],
	providers: [PrestamosService]
})
export class PrestamosModule {}
