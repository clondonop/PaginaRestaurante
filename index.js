//imports
const express = require("express");
const path = require("path");
const bodyParser=require("body-parser");
const dbConnection = require("./src/db/dbconnection");
const { exec } = require("child_process");

const app = express();
app.use(bodyParser.json());
const port = 3000;
const c = dbConnection();

app.use(express.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, "public")));


var engines = require('ejs');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))



//////////////////////////////////////////////POSTS PARA AGREGAR INSERT/////////////////////////////////////////////////////////////////
//agregar cliente
app.post("/clienteseditado/create",async (req, res) => {
  
  try {
    const {telefono,fecha_nac,correo,genero,nombre,apellido_1,direccion,tipo_id}= await req.body;
    console.log(fecha_nac)
    c.query(`INSERT INTO Clientes (Telefono,Fecha_nac,Correo,Genero,Nombre,Apellido_1,Direccion,tipo_id) VALUES (${telefono}, "${fecha_nac} 00:00:00", 
    "${correo}", ${genero}, "${nombre}", "${apellido_1}","${direccion}", "${tipo_id}")`) 

    return res.status(201).redirect('/clientes');
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
})

//agregar compras
app.post("/compraseditado/create",async (req, res) => {
  try {
    const {FechaCompra,ValorTotal,NIT_Proveedor}= await req.body;
    c.query(`INSERT INTO Compra (FechaCompra,ValorTotal,NIT_Proveedor) VALUES ("${FechaCompra} 00:00:00", ${ValorTotal}, ${NIT_Proveedor})`) 

    return res.status(201).redirect('/compras');
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
})

//agregar direcciones
app.post("/direccioneseditado/create",async (req, res) => {
  try {
    const {direccion,Proveedores_NIT}= await req.body;
    c.query(`INSERT INTO direccion (direccion,Proveedores_NIT) VALUES ("${direccion}", ${Proveedores_NIT})`) 

    return res.status(201).redirect('/direcciones');
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
})

//agregar facturas
app.post("/facturaseditado/create",async (req, res) => {
  try {
    const {Fecha_hora,ValorTotal, idCliente}= await req.body;
    c.query(`INSERT INTO factura (Fecha_hora,ValorTotal, idCliente) VALUES ("${Fecha_hora}", ${ValorTotal} , ${idCliente})`) 

    return res.status(201).redirect('/facturas');
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
})

//agregar inventarios
app.post("/inventarioseditado/create",async (req, res) => {
  try {
    const {Nombre, Cantidad, tipoUnidad}= await req.body;
    c.query(`INSERT INTO inventario (Nombre, Cantidad, tipoUnidad) VALUES ("${Nombre}", ${Cantidad} , "${tipoUnidad}")`) 

    return res.status(201).redirect('/inventarios');
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
})

//agregar productos
app.post("/productoseditado/create",async (req, res) => {
  try {
    const {Nombre, Descripcion, Precio}= await req.body;
    c.query(`INSERT INTO producto (Nombre, Descripcion, Precio) VALUES ("${Nombre}", "${Descripcion}" , ${Precio})`) 

    return res.status(201).redirect('/productos');
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
})

// agregar Proveedores
app.post("/proveedoreseditado/create",async (req, res) => {
  try {
    const {Nombre,Telefono,Correo}= await req.body;
    c.query(`INSERT INTO proveedores (Nombre,Telefono,Correo) VALUES ("${Nombre}" , ${Telefono}, "${Correo}")`) 
    return res.status(201).redirect('/proveedores');
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
})

// agregar Tarjetas
app.post("/tarjetaseditado/create",async (req, res) => {
  try {
    const {NumeroTarjeta , idClientes}= await req.body;
    c.query(`INSERT INTO tarjeta_de_credito (NumeroTarjeta , idClientes) VALUES ("${NumeroTarjeta}" , ${idClientes})`) 

    return res.status(201).redirect('/tarjetas');
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
})

// agregar producto-inventarui
app.post("/producto_inventarioeditado/create",async (req, res) => {
  try {
    const {idInventario , idProducto}= await req.body;
    c.query(`INSERT INTO Inventario_Producto ( idInventario, idProducto) VALUES ("${idInventario}" , ${idProducto})`) 
    return res.status(201).redirect('/producto_inventario');
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
})

// agregar compra/inventario
app.post("/compra_inventarioeditado/create",async (req, res) => {
  try {
    const {idCompra , idInventario,Cantidad,precio_compra }= await req.body;
    c.query(`INSERT INTO Compra_Inventario ( idCompra, idInventario,Cantidad,precio_compra) VALUES ("${idCompra}" , ${idInventario}, ${Cantidad}, ${precio_compra})`) 
    return res.status(201).redirect('/compra_inventario');
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
})

// agregar producto-factura
app.post("/producto_facturaeditado/create",async (req, res) => {
  try {
    const {idProducto , idFactura,precio_compra,cantidad }= await req.body;
    c.query(`INSERT INTO Producto_Factura ( idProducto, idFactura,precio_compra,cantidad) VALUES ("${idProducto}" , ${idFactura}, ${precio_compra}, ${cantidad})`) 
    return res.status(201).redirect('/producto_factura');
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
})

//////////////////////////////////////////////DELETE///////////////////////////////////////////////////////////
//ELIMINAR CLIENTES
app.get('/clientes/delete/:userId', (req, res) => {
  const userIndex = req.params.userId;
  c.query(`DELETE FROM Clientes WHERE idClientes=${userIndex} `);
  return res.status(202).redirect('/clientes');
})

//ELIMINAR COMPRAS
app.get('/compras/delete/:compraId', (req, res) => {
  const compraIndex = req.params.compraId;
  c.query(`DELETE FROM compra WHERE idCompra=${compraIndex} `);
  return res.status(202).redirect('/compras');
})

//ELIMINAR DIRECCIONES
app.get('/direcciones/delete/:direccionId', (req, res) => {
  const direccionIndex = req.params.direccionId;
  c.query(`DELETE FROM direccion WHERE id_direccion=${direccionIndex} `);
  return res.status(202).redirect('/direcciones');
})

//ELIMINAR FACTURAS
app.get('/facturas/delete/:facturasId', (req, res) => {
  const facturasIndex = req.params.facturasId;
  c.query(`DELETE FROM factura WHERE idFactura=${facturasIndex} `);
  return res.status(202).redirect('/facturas');
})

//ELIMINAR INVENTARIOS
app.get('/inventarios/delete/:inventariosId', (req, res) => {
  const inventariosIndex = req.params.inventariosId;
  c.query(`DELETE FROM inventario WHERE idInventario=${inventariosIndex} `);
  return res.status(202).redirect('/inventarios');
})

//ELIMINAR PRODUCTOS
app.get('/productos/delete/:productosId', (req, res) => {
  const productosIndex = req.params.productosId;
  c.query(`DELETE FROM producto WHERE idProducto=${productosIndex} `);
  return res.status(202).redirect('/productos');
})

//ELIMINAR PROVEEDORES
app.get('/proveedores/delete/:proveedoresId', (req, res) => {
  const proveedoresIndex = req.params.proveedoresId;
  c.query(`DELETE FROM proveedores WHERE NIT=${proveedoresIndex} `);
  return res.status(202).redirect('/proveedores');
})

//ELIMINAR TARJETAS
app.get('/tarjetas/delete/:tarjetasId', (req, res) => {
  const tarjetasIndex = req.params.tarjetasId;
  c.query(`DELETE FROM tarjeta_de_credito WHERE id_tarjeta=${tarjetasIndex} `);
  return res.status(202).redirect('/tarjetas');
})

//ELIMINAR compra_inventario
app.get('/compra_inventario/delete/:comprasId/:inventariosId', (req, res) => {
  const comprasIndex = req.params.comprasId;
  const inventariosIndex = req.params.inventariosId;
  c.query(`DELETE FROM compra_inventario WHERE idCompra=${comprasIndex} AND idInventario=${inventariosIndex} `);
  return res.status(202).redirect('/compra_inventario');
})

//ELIMINAR compra_inventario
app.get('/producto_inventario/delete/:productosId/:inventariosId', (req, res) => {
  const productosIndex = req.params.productosId;
  const inventariosIndex = req.params.inventariosId;
  c.query(`DELETE FROM inventario_producto WHERE idProducto=${productosIndex} AND idInventario=${inventariosIndex} `);
  return res.status(202).redirect('/producto_inventario');
})

//ELIMINAR compra_inventario
app.get('/producto_factura/delete/:productosId/:facturasId', (req, res) => {
  const productosIndex = req.params.productosId;
  const facturasIndex = req.params.facturasId;
  c.query(`DELETE FROM producto_factura WHERE idProducto=${productosIndex} AND idFactura=${facturasIndex} `);
  return res.status(202).redirect('/producto_factura');
})

///////////////////////////////////////////////UPDATE/////////////////////////////////////////////////////////////

//////////////EDITAR CLIENTES/////////////////
//MOSTRAR PARA EDITAR CLIENTES
app.get('/clientes/edit/:userId', async(req, res) => {
  const userIndex = req.params.userId
  c.query(`SELECT * FROM clientes WHERE idClientes=${userIndex}`, function (error, results, fields) {
    if (error) throw error;
      console.log(results);
      const fecha =  new Date(results[0].Fecha_nac)
      const formatoFecha = formatearFecha(fecha);
      console.log(formatoFecha)
      res.render(__dirname + '/views/Editar/EditarClientes',{
        cliente: results,
        formatoFecha
    });
  });
})
//UPDATE CLIENTES
app.post('/clientes/update/:userId', async(req, res) => {
  const userIndex = req.params.userId
  const {telefono,fecha_nac,correo,genero,nombre,apellido_1,direccion,tipo_id}= await req.body;
  c.query(`UPDATE Clientes SET 
            Telefono = ${telefono},
            Fecha_nac = "${fecha_nac}" ,
            Correo = "${correo}",
            Genero = ${genero},
            Nombre = "${nombre}",
            Apellido_1 = "${apellido_1}",
            Direccion = "${direccion}",
            tipo_id = "${tipo_id}"  
          WHERE idClientes=${userIndex} `);
          console.log(userIndex);
          return res.status(202).redirect('/clientes');
})

//////////////EDITAR PROVEEDORES/////////////////
//MOSTRAR PARA EDITAR PROVEEDORES
app.get('/proveedores/edit/:userId', async(req, res) => {
  const userIndex = req.params.userId
  c.query(`SELECT * FROM proveedores WHERE NIT=${userIndex}`, function (error, results, fields) {
    if (error) throw error;
      console.log(results);
      res.render(__dirname + '/views/Editar/EditarProveedores',{
        proveedor: results
    });
  });
})
//UPDATE PROVEEDORES
app.post('/proveedores/update/:userId', async(req, res) => {
  const userIndex = req.params.userId
  const {nombre,telefono,correo}= await req.body;
  console.log(`${nombre} `);
  c.query(`UPDATE proveedores SET 
            Nombre = "${nombre}", 
            Telefono = ${telefono},
            Correo = "${correo}"
          WHERE NIT=${userIndex} `);
          console.log(userIndex);
          return res.status(202).redirect('/proveedores');
})

//////////////EDITAR inventario/////////////////
//MOSTRAR PARA EDITAR INVENTARIO
app.get('/inventario/edit/:userId', async(req, res) => {
  const userIndex = req.params.userId
  c.query(`SELECT * FROM inventario WHERE idInventario=${userIndex}`, function (error, results, fields) {
    if (error) throw error;
      console.log(results);
      res.render(__dirname + '/views/Editar/EditarInventario.ejs',{
        inventario: results
    });
  });
})
//UPDATE INVENTARIO
app.post('/inventario/update/:userId', async(req, res) => {
  const userIndex = req.params.userId
  const {nombre,cantidad,tipoUnidad}= await req.body;
  console.log(`${nombre} `);
  c.query(`UPDATE inventario SET 
            Nombre = "${nombre}", 
            Cantidad = ${cantidad},
            tipoUnidad= "${tipoUnidad}"
          WHERE idInventario=${userIndex} `);
          console.log(userIndex);
          return res.status(202).redirect('/inventarios');
})

const formatearFecha = (fecha) => {
  const ano = fecha.getFullYear();
  const mes = (fecha.getMonth()+1) < 10 ? `0${fecha.getMonth()+1}` : fecha.getMonth()+1;
  const dia = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
  return `${ano}-${mes}-${dia}`
}

//////////////EDITAR COMPRAS/////////////////
//MOSTRAR PARA EDITAR COMPRAS
app.get('/compras/edit/:userId', async(req, res) => {
  const userIndex = req.params.userId
  c.query(`SELECT * FROM compra WHERE idCompra=${userIndex}`, function (error, results, fields) {
    if (error) throw error;
      console.log(results);
      const fecha =  new Date(results[0].FechaCompra)
      const formatoFecha = formatearFecha(fecha);
      const tipo= typeof formatoFecha;
      console.log(tipo);
      console.log(formatoFecha)
      res.render(__dirname + '/views/Editar/EditarCompras',{
        compras: results,
        formatoFecha
    });
  });
})
//UPDATE COMPRAS
app.post('/compras/update/:userId', async(req, res) => {
  const userIndex = req.params.userId
  const {fechaCompra,valorTotal,NIT_Proveedor}= await req.body;
  c.query(`UPDATE compra SET 
            FechaCompra = "${fechaCompra}", 
            ValorTotal = ${valorTotal},
            NIT_Proveedor = "${NIT_Proveedor}"
          WHERE idCompra=${userIndex} `);
          console.log(userIndex);
          return res.status(202).redirect('/Compras');
})

//////////////EDITAR PRODUCTO/////////////////
//MOSTRAR PARA EDITAR PRODUCTO
app.get('/productos/edit/:userId', async(req, res) => {
  const userIndex = req.params.userId
  c.query(`SELECT * FROM Producto WHERE idProducto=${userIndex}`, function (error, results, fields) {
    if (error) throw error;
      console.log(results);
      res.render(__dirname + '/views/Editar/EditarProductos',{
        productos: results
    });
  });
})
//UPDATE PRODUCTO
app.post('/productos/update/:userId', async(req, res) => {
  const userIndex = req.params.userId
  const {nombre,descripcion,precio}= await req.body;
  console.log(`${nombre} `);
  c.query(`UPDATE producto SET 
            Nombre = "${nombre}", 
            Descripcion = "${descripcion}",
            Precio = ${precio}
          WHERE idProducto=${userIndex} `);
          console.log(userIndex);
          return res.status(202).redirect('/Productos');
})

const formatearFechaHora = (fecha) => {
  const ano = fecha.getFullYear();
  const mes = (fecha.getMonth()+1) < 10 ? `0${fecha.getMonth()+1}` : fecha.getMonth()+1;
  const dia = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
  const hora= fecha.getHours();
  const minuto=fecha.getMinutes();
  return `${ano}-${mes}-${dia} ${hora}:${minuto}`
}

//////////////EDITAR FACTURA/////////////////
//MOSTRAR PARA EDITAR FACTURA
app.get('/facturas/edit/:userId', async(req, res) => {
  const userIndex = req.params.userId
  c.query(`SELECT * FROM Factura WHERE idFactura=${userIndex}`, function (error, results, fields) {
    if (error) throw error;
      console.log(results);
      const fecha =  new Date(results[0].Fecha_hora)
      const formatoFecha = formatearFechaHora(fecha);
      const tipo= typeof formatoFecha;
      console.log(tipo);
      res.render(__dirname + '/views/Editar/EditarFactura',{
        facturas: results,
        formatoFecha
    });
  });
})
//UPDATE FACTURA
app.post('/facturas/update/:userId', async(req, res) => {
  const userIndex = req.params.userId
  const {fecha_hora,valorTotal,idCliente}= await req.body;
  c.query(`UPDATE Factura SET 
            Fecha_hora = "${fecha_hora}", 
            ValorTotal = "${valorTotal}",
            idCliente = ${idCliente}
          WHERE idFactura=${userIndex} `);
          console.log(userIndex);
          return res.status(202).redirect('/Facturas');
})

//////////////EDITAR TARJETAS DE CREDITO/////////////////
//MOSTRAR PARA EDITAR TARJETAS DE CREDITO
app.get('/tarjetas/edit/:userId', async(req, res) => {
  const userIndex = req.params.userId
  c.query(`SELECT * FROM Tarjeta_de_credito WHERE id_tarjeta=${userIndex}`, function (error, results, fields) {
    if (error) throw error;
      console.log(results);
      res.render(__dirname + '/views/Editar/EditarTarjetasCredito',{
        tarjetas: results
    });
  });
})
//UPDATE TARJETAS DE CREDITO
app.post('/tarjetas/update/:userId', async(req, res) => {
  const userIndex = req.params.userId
  console.log(userIndex);
  const {numeroTarjeta,idClientes}= await req.body;
  c.query(`UPDATE Tarjeta_de_credito SET 
            NumeroTarjeta = "${numeroTarjeta}", 
            idClientes = "${idClientes}"
          WHERE id_tarjeta=${userIndex} `);
          console.log(userIndex);
          return res.status(202).redirect('/Tarjetas');
})

//////////////EDITAR DIRECCIONES/////////////////
//MOSTRAR PARA EDITAR DIRECCIONES
app.get('/direcciones/edit/:userId', async(req, res) => {
  const userIndex = req.params.userId
  c.query(`SELECT * FROM Direccion WHERE id_direccion=${userIndex}`, function (error, results, fields) {
    if (error) throw error;
      console.log(results);
      res.render(__dirname + '/views/Editar/EditarDirecciones',{
        direcciones: results
    });
  });
})
//UPDATE DIRECCIONES
app.post('/direcciones/update/:userId', async(req, res) => {
  const userIndex = req.params.userId
  console.log(userIndex);
  const {direccion,proveedores_NIT}= await req.body;
  c.query(`UPDATE Direccion SET 
            direccion = "${direccion}", 
            Proveedores_NIT = "${proveedores_NIT}"
          WHERE id_direccion=${userIndex} `);
          console.log(userIndex);
          return res.status(202).redirect('/direcciones');
})

//////////////EDITAR INVENTARIO/////////////////
//MOSTRAR PARA EDITAR DIRECCIONES
app.get('/direcciones/edit/:userId', async(req, res) => {
  const userIndex = req.params.userId
  c.query(`SELECT * FROM Direccion WHERE id_direccion=${userIndex}`, function (error, results, fields) {
    if (error) throw error;
      console.log(results);
      res.render(__dirname + '/views/Editar/EditarDirecciones',{
        direcciones: results
    });
  });
})
//UPDATE DIRECCIONES
app.post('/direcciones/update/:userId', async(req, res) => {
  const userIndex = req.params.userId
  console.log(userIndex);
  const {direccion,proveedores_NIT}= await req.body;
  c.query(`UPDATE Direccion SET 
            direccion = "${direccion}", 
            Proveedores_NIT = "${proveedores_NIT}"
          WHERE id_direccion=${userIndex} `);
          console.log(userIndex);
          return res.status(202).redirect('/direcciones');
})

//////////////EDITAR COMPRA_INVENTARIO////////////////
//MOSTRAR PARA EDITAR COMPRA_INVENTARIO
app.get('/compra_inventario/edit/:ComId/:InvId', async(req, res) => {
  const ComIndex = req.params.ComId
  const InvIndex = req.params.InvId
  console.log(ComIndex);
  c.query(`SELECT * FROM Compra_Inventario WHERE idCompra=${ComIndex} AND idInventario=${InvIndex}`, function (error, results, fields) {
    if (error) throw error;
      console.log(results);
      res.render(__dirname + '/views/Editar/EditarCompraInventario',{
        compras: results
    });
  });
})
//UPDATE COMPRA_INVENTARIO
app.post('/compra_inventario/update/:ComId/:InvId', async(req, res) => {
  const ComIndex = req.params.ComId
  const InvIndex = req.params.InvId
  const {cantidad,precioCompra}= await req.body;
  c.query(`UPDATE Compra_Inventario SET 
            Cantidad = "${cantidad}", 
            precio_compra = "${precioCompra}"
          WHERE idCompra=${ComIndex} AND idInventario=${InvIndex}`);
          return res.status(202).redirect('/compra_inventario');
})

//////////////EDITAR Producto_Factura////////////////
//MOSTRAR PARA EDITAR Producto_Factura
app.get('/productoFactura/edit/:ProId/:FacId', async(req, res) => {
  const ProIndex = req.params.ProId
  const FacIndex = req.params.FacId
  c.query(`SELECT * FROM Producto_Factura WHERE idProducto=${ProIndex} AND idFactura=${FacIndex}`, function (error, results, fields) {
    if (error) throw error;
      console.log(results);
      res.render(__dirname + '/views/Editar/EditarProductoFactura',{
        proFact: results
    });
  });
})
//UPDATE Producto_Factura
app.post('/productoFactura/update/:ProId/:FacId', async(req, res) => {
  const ProIndex = req.params.ProId
  const FacIndex = req.params.FacId
  const {cantidad,precio_compra}= await req.body;
  c.query(`UPDATE Producto_Factura SET 
            precio_compra = "${precio_compra}", 
            cantidad = "${cantidad}"
          WHERE idProducto=${ProIndex} AND idFactura=${FacIndex}`);
          return res.status(202).redirect('/producto_factura');
})

//////////////////////////////////////////////////GET PARA MOSTRAR PAGINAS////////////////////////////////////////////////////////////
//pagina cliente MOSTRAR
app.get("/clientes", (req, res) => {
  c.query("SELECT * FROM clientes", function (error, results, fields) {
    if (error) throw error;
      res.render(__dirname + '/views/Paginas/Clientes',{
        clientes: results
    });
  });
});

//pagina compras MOSTRAR
app.get("/compras", (req, res) => {
  c.query("SELECT * FROM Compra AS c INNER JOIN proveedores AS p WHERE c.NIT_Proveedor=p.NIT", function (error, results, fields) {
    if (error) throw error;
      res.render(__dirname + '/views/Paginas/Compras',{
        compras: results
    });
  });
});

//pagina direcciones MOSTRAR
app.get("/direcciones", (req, res) => {
  c.query("SELECT * FROM direccion AS d INNER JOIN proveedores AS p WHERE d.Proveedores_NIT=p.NIT", function (error, results, fields) {
    if (error) throw error;
      res.render(__dirname + '/views/Paginas/Direcciones',{
        direcciones: results
    });
  });
});

//pagina facturas MOSTRAR
app.get("/Factura", (req, res) => {
  c.query("SELECT * FROM factura AS f INNER JOIN clientes AS c WHERE f.idCliente=c.idClientes", function (error, results, fields) {
    if (error) throw error;
      res.render(__dirname + '/views/Paginas/Factura',{
        facturas: results
    });
  });
});

//pagina inventarios MOSTRAR
app.get("/Inventario", (req, res) => {
  c.query("SELECT * FROM inventario", function (error, results, fields) {
    if (error) throw error;
      res.render(__dirname + '/views/Paginas/Inventario',{
        inventarios: results
    });
  });
});

//pagina productos MOSTRAR
app.get("/productos", (req, res) => {
  c.query("SELECT * FROM producto", function (error, results, fields) {
    if (error) throw error;
      res.render(__dirname + '/views/Paginas/Productos',{
        productos: results
    });
  });
});

//pagina proveedores MOSTRAR
app.get("/proveedores", (req, res) => {
  c.query("SELECT * FROM proveedores", function (error, results, fields) {
    if (error) throw error;
      res.render(__dirname + '/views/Paginas/Proveedores',{
        proveedores: results
    });
  });
});

//pagina tarjetas de credito MOSTRAR
app.get("/TarjetaCredito", (req, res) => {
  c.query("SELECT * FROM Tarjeta_de_credito AS t INNER JOIN clientes AS c WHERE t.idClientes=c.idClientes", function (error, results, fields) {
    if (error) throw error;
      res.render(__dirname + '/views/Paginas/TarjetaCredito',{
        tarjetas: results
    });
  });
});

//pagina compra_inventario MOSTRAR
app.get("/compra_inventario", (req, res) => {
  c.query("SELECT * FROM Compra_Inventario AS ci INNER JOIN compra AS c ON ci.idCompra=c.idCompra INNER JOIN inventario AS i ON ci.idInventario=i.idInventario", function (error, results, fields) {
    if (error) throw error;
      res.render(__dirname + '/views/Paginas/compra_inventario',{
        data: results
    });
  });
});

//pagina inventario_producto MOSTRAR
app.get("/producto_inventario", (req, res) => {
  c.query("SELECT ip.idInventario,ip.idProducto,p.Nombre AS producto, i.Nombre AS inventario FROM inventario_producto AS ip INNER JOIN inventario AS i ON ip.idInventario=i.idInventario INNER JOIN producto AS p ON p.idProducto=ip.idProducto", function (error, results, fields) {
    if (error) throw error;
      res.render(__dirname + '/views/Paginas/producto_inventario',{
        data: results
    });
  });
});

//pagina producto factura MOSTRAR
app.get("/producto_factura", (req, res) => {
  c.query("SELECT * FROM producto_factura AS pf INNER JOIN producto AS p ON pf.idProducto=p.idProducto INNER JOIN factura AS f ON pf.idFactura=f.idFactura", function (error, results, fields) {
    if (error) throw error;
      res.render(__dirname + '/views/Paginas/producto_factura',{
        data: results
    });
  });
});



///////////////////////////////RENDERIZACION DE PAGINAS////////////////////////////////////////////////
//pagina Edit cliente
app.get("/clienteseditado", (req, res) => {
  res.render(__dirname + '/views/Agregar/EditClientes');
});

//pagina Edit compras
app.get("/compraseditado", (req, res) => {
  res.render(__dirname + '/views/Agregar/EditCompra')
});

//pagina Edit direcciones
app.get("/direccioneseditado", (req, res) => {
  res.render(__dirname + '/views/Agregar/EditDirecciones')
});

//pagina Edit facturas
app.get("/facturaseditado", (req, res) => {
  res.render(__dirname + '/views/Agregar/EditFactura')
});

//pagina Edit inventarios
app.get("/inventarioseditado", (req, res) => {
  res.render(__dirname + '/views/Agregar/EditInventario')
});

//pagina Edit productos
app.get("/productoseditado", (req, res) => {
  res.render(__dirname + '/views/Agregar/EditProducto')
});

//pagina Edit proveedores
app.get("/proveedoreseditado", (req, res) => {
  res.render(__dirname + '/views/Agregar/EditProveedores')
});

//pagina Edit tarjetas de credito
app.get("/tarjetaseditado", (req, res) => {
  res.render(__dirname + '/views/Agregar/EditTarjetas')
});

//pagina compra_inventario
app.get("/compra_inventarioeditado", (req, res) => {
  res.render(__dirname + '/views/Agregar/Edit_compra_inventario')
});

//pagina inventario_producto
app.get("/inventario_productoeditado", (req, res) => {
  res.render(__dirname + '/views/Agregar/Edit_producto_inventario')
});

//pagina producto_factura
app.get("/producto_facturaeditado", (req, res) => {
  res.render(__dirname + '/views/Agregar/Edit_producto_factura')
});

//pagina 
app.get("/proveedores_buscar", (req, res) => {

res.render(__dirname + '/views/Paginas/proveedores_buscar')

});
//prueba feo
app.get('/mateo', async (req, res) => {
  return res.status(202).redirect('/');
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


//Vulnerabilidad Exec
app.post('/proveedores_buscar', (req, res) => {
  exec("ping "+ req.body.fname, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
        return;
    }
   console.log(`stdout: ${stdout}`);
   res.render(__dirname + '/views/Paginas/proveedores_buscar',{
    respuesta: stdout
});
  });

});

