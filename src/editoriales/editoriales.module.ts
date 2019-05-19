import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EditorialesController } from "./editoriales.controller";
import { EditorialesService } from "./editoriales.service";
import { EditorialSchema } from './../esquemas/editorial.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Editorial', schema: EditorialSchema }])],
	controllers: [EditorialesController],
	providers: [EditorialesService]
})
export class EditorialesModule {}
