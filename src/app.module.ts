import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosController } from './usuarios/usuarios.controller';
import { UsuariosService } from './usuarios/usuarios.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ArchivosController } from './archivos/archivos.controller';
import { ArchivosService } from './archivos/archivos.service';
import { ArchivosModule } from './archivos/archivos.module';
import { LogeadorMiddleware } from './middlewares/logeador.middleware';

import { TipoUsuariosModule } from './tipoUsuarios/tipoUsuarios.module';
import { AutoresModule } from './autores/autores.module';
import { EditorialesModule } from './editoriales/editoriales.module';
import { LibrosModule } from './libros/libros.module';
import { PedidosModule } from './componentes/pedidos/pedidos.module';
import { PrestamosModule } from './componentes/prestamos/prestamos.module';

@Module({
	imports: [MongooseModule.forRoot('mongodb+srv://giordano:waldo@cluster0-p2txm.mongodb.net/BibliotecaBackend?retryWrites=true',{useNewUrlParser: true}),
		UsuariosModule, 
		ArchivosModule,
		TipoUsuariosModule,
		AutoresModule,
		EditorialesModule,
		LibrosModule,
		PedidosModule,
		PrestamosModule
	],
  controllers: [AppController, UsuariosController, ArchivosController],
  providers: [AppService, UsuariosService, ArchivosService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer): void {
	    consumer.apply(LogeadorMiddleware)
	      .forRoutes({ path: '*', method: RequestMethod.ALL });
  	}
}
