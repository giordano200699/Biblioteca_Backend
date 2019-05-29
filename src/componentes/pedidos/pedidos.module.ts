import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PedidosController } from "./pedidos.controller";
import { PedidosService } from "./pedidos.service";
import { PedidoSchema } from './../../esquemas/pedido.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Pedido', schema: PedidoSchema }])],
	controllers: [PedidosController],
	providers: [PedidosService]
})
export class PedidosModule {}
