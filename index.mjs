import ServerlessMysql from "serverless-mysql";
import * as fs from 'fs';
var mysql = ServerlessMysql();
mysql.config({
  host: 'database-1.cjznk3ygczwq.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'RyK3npskz1XBVBE',
  database: 'mydatabase'
});

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  let headers = {
    "Content-Type": "application/json",
  };


  try {
    switch (event.routeKey) {
      case "GET /":
        headers = {
          'Content-Type': 'text/html',
        };
        body = fs.readFileSync('index.html', {
          encoding: 'utf8'
        });

        break;
      case "GET /persona/{id}":
        body = await mysql.query('SELECT * FROM tbl_personas where id = ?', [event.pathParameters.id]);
        await mysql.quit();
        if (body.length > 0) {
          body = {
            message: "Registros encontrados",
            success: true,
            user: body[0],
            id: event.pathParameters.id
          };
        } else {
          body = {
            message: "Registros no encontrado",
            res: body.length > 0,
            body: body,
            success: false,
            id: event.pathParameters.id
          };
        }
        break;
      case "GET /personas":
        body = await mysql.query('SELECT * FROM tbl_personas', [1]);
        await mysql.quit();
        body = JSON.stringify(body);
        break;
      case "POST /persona":
        let requestJSON = JSON.parse(event.body);
        body = await mysql.query('INSERT  INTO  tbl_personas (name,lastname) values(?,?)',
          [requestJSON.name, requestJSON.lastname]);
        body = await mysql.query('SELECT * FROM tbl_personas where id = ?', [body.insertId]);
        await mysql.quit();
        if (body.length > 0) {
          body = {
            message: "Persona registrada",
            success: true,
            persona: body[0]
          };
        } else {
          body = {
            message: "Persona no registrada",
            persona: body,
            success: false
          };
        }
        body = JSON.stringify(body);
        break;
      case "PUT /persona":
        let requestJSON2 = JSON.parse(event.body);
        body = await mysql.query('update tbl_personas set name = ?, lastname =? where id = ?', [requestJSON2.name, requestJSON2.lastname, requestJSON2.id]);
        await mysql.quit();
        body = JSON.stringify(body);

        break;
      case "DELETE /persona/{id}":
        body = await mysql.query('DELETE  FROM tbl_personas WHERE  id = ?', [event.pathParameters.id]);
        await mysql.quit();

        body = JSON.stringify(body);
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    //body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};