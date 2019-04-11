import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosController } from './usuarios/usuarios.controller';
import { UsuariosService } from './usuarios/usuarios.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ArchivosController } from './archivos/archivos.controller';
import { ArchivosService } from './archivos/archivos.service';
import { ArchivosModule } from './archivos/archivos.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/BibliotecaBackend',{useNewUrlParser: true}),UsuariosModule, ArchivosModule],
  controllers: [AppController, UsuariosController, ArchivosController],
  providers: [AppService, UsuariosService, ArchivosService],
})
export class AppModule {}
