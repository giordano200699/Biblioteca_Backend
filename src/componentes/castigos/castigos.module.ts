import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CastigosController } from "./castigos.controller";
import { CastigosService } from "./castigos.service";
import { CastigoSchema } from './../../esquemas/castigo.schema';
import { PrestamoSchema } from './../../esquemas/prestamo.schema';
import { PedidoSchema } from './../../esquemas/pedido.schema';
import { UsuarioSchema } from './../../esquemas/usuario.schema';
import { ItemSchema } from './../../esquemas/item.schema';
import { LibroSchema } from './../../esquemas/libro.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Castigo', schema: CastigoSchema },
	{ name: 'Prestamo', schema: PrestamoSchema },
	{ name: 'Pedido', schema: PedidoSchema },
	{ name: 'Usuario', schema: UsuarioSchema },
	{ name: 'Item', schema: ItemSchema },
	{ name: 'Libro', schema: LibroSchema }])],
	controllers: [CastigosController],
	providers: [CastigosService]
})
export class CastigosModule {}
