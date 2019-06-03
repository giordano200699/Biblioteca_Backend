import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PedidosController } from "./pedidos.controller";
import { PedidosService } from "./pedidos.service";
import { PedidoSchema } from './../../esquemas/pedido.schema';
import { ItemSchema } from './../../esquemas/item.schema';
import { UsuarioSchema } from './../../esquemas/usuario.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Pedido', schema: PedidoSchema },
	{ name: 'Item', schema: ItemSchema },
	{ name: 'Usuario', schema: UsuarioSchema }])],
	controllers: [PedidosController],
	providers: [PedidosService]
})
export class PedidosModule {}
