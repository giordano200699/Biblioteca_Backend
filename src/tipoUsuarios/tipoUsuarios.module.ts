import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoUsuariosController } from "./tipoUsuarios.controller";
import { TipoUsuariosService } from "./tipoUsuarios.service";
import { TipoUsuarioSchema } from './../esquemas/tipoUsuario.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'TipoUsuario', schema: TipoUsuarioSchema }])],
	controllers: [TipoUsuariosController],
	providers: [TipoUsuariosService]
})
export class TipoUsuariosModule {}
