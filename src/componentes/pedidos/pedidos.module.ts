import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PedidosController } from "./pedidos.controller";
import { PedidosService } from "./pedidos.service";
import { PedidoSchema } from './../../esquemas/pedido.schema';
import { ItemSchema } from './../../esquemas/item.schema';
import { UsuarioSchema } from './../../esquemas/usuario.schema';
import { LibroSchema } from './../../esquemas/libro.schema';
import { AutorSchema } from './../../esquemas/autor.schema';
import { Libro_AutorSchema } from './../../esquemas/libro_autor.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Pedido', schema: PedidoSchema },
	{ name: 'Item', schema: ItemSchema },
	{ name: 'Usuario', schema: UsuarioSchema },
	{ name: 'Libro', schema: LibroSchema },
	{ name: 'Autor', schema: AutorSchema },
	{ name: 'Libro_Autor', schema: Libro_AutorSchema }])],
	controllers: [PedidosController],
	providers: [PedidosService]
})
export class PedidosModule {}
