import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosController } from "./usuarios.controller";
import { UsuariosService } from "./usuarios.service";
import { UsuarioSchema } from './../esquemas/usuario.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Usuario', schema: UsuarioSchema }])],
	controllers: [UsuariosController],
	providers: [UsuariosService]
})
export class UsuariosModule {}
