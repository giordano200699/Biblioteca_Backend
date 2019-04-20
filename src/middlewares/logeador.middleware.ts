import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
var request = require('request');
var fs = require('fs');
const path = require('path');

@Injectable()
export class LogeadorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {

  	const CLAVE = "QDm6pbKeVwWikPvpMSUYwp0tNnxcaLoYLnyvLQ4ISV39uQOgsjTEjS0UNlZHwbxl2Ujf30S31CSKndwpkFeubt5gJHTgFlq7LeIaSYc0jNm44loPty2ZK1nI0qisrt2Xwq0nFhdp8H3kdpyL5wVZLH7EpSE6IO0cHAOGOfSpJjF36eiCuXJ3gkOfX8C4n";

  	if(req.query.clave == CLAVE){
  		console.log('Pasaste por el Middleware, se tenia que decir y se dijo.');
	    //var ip = req.ip;
	    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	    //console.log(req.connection);
	    //console.log(req.headers);
	    console.log(req.headers);

	    var headers = {
		    'User-Agent':       'Super Agent/0.0.1',
		    'Content-Type':     'application/x-www-form-urlencoded'
		}

		var options = {
		    url     : 'https://ipapi.co/190.239.154.35/json/',
		    method  : 'GET',
		    jar     : true,
		    headers : headers
		}

		//Step 3 - do the request
		request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        //console.log(body);
		    }
		});

		fs.appendFile(path.dirname(__dirname)+'/../archivos/ipCliente.txt', ip+"\n", function (err) { 
		    if (err) { 
		    // append failed 
		    	console.log(err);
		    } else { 
		    	console.log("escribio exitosamente");
		    } 
		});

	    next();
  	}
  	res.send({tipoMensaje:1,descripcion : "Usted no tiene permiso para entrar a este sistema."});

    
  }
}