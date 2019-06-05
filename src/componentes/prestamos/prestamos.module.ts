import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrestamosController } from "./prestamos.controller";
import { PrestamosService } from "./prestamos.service";
import { PrestamoSchema } from './../../esquemas/prestamo.schema';
import { PedidoSchema } from './../../esquemas/pedido.schema';
import { UsuarioSchema } from './../../esquemas/usuario.schema';
import { ItemSchema } from './../../esquemas/item.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Prestamo', schema: PrestamoSchema },
	{ name: 'Pedido', schema: PedidoSchema },
	{ name: 'Usuario', schema: UsuarioSchema },
	{ name: 'Item', schema: ItemSchema }])],
	controllers: [PrestamosController],
	providers: [PrestamosService]
})
export class PrestamosModule {}
