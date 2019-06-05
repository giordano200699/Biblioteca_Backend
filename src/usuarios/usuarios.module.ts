import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosController } from "./usuarios.controller";
import { UsuariosService } from "./usuarios.service";
import { UsuarioSchema } from './../esquemas/usuario.schema';
import { CuentaSchema } from './../esquemas/cuenta.schema';
import { PedidoSchema } from './../esquemas/pedido.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Usuario', schema: UsuarioSchema },{ name: 'Cuenta', schema: CuentaSchema },
	{ name: 'Pedido', schema: PedidoSchema }])],
	controllers: [UsuariosController],
	providers: [UsuariosService]
})
export class UsuariosModule {}
