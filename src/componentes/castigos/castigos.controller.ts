import { Controller, Get, Post, Put, Delete, Body,Param,Req } from '@nestjs/common';
import { CastigosService } from "./castigos.service";
import { Castigo } from "./../../interfaces/Castigo";
import { Request } from 'express';
const cron = require("node-cron");

@Controller('castigos')
export class CastigosController {

	constructor(private castigosService: CastigosService){
		var mithis = this;
		cron.schedule("* * * * *", function() {
	      mithis.castigosService.analizarFinCastigo();
	    });
	}

	@Post()
	crearPedido(@Body() datos){
		return this.castigosService.crearCastigo(datos);
    }
}
