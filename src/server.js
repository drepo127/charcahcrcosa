const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('node:fs');
const { Buffer } = require('node:buffer');
const concat = require('stream-concat');
const app = express();
const port = 3080;

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
//tamaño maximo
app.use(express.json({ limit: '100mb' }));


// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para permitir solicitudes desde otras páginas web (CORS)
app.use(cors());

// Ruta al archivo de credenciales de Firebase
const serviceAccount = require('./la-charca-del-pejelagart-42698-firebase-adminsdk-x91fd-dcee3392f3.json');

// Inicialización de la aplicación de Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Conexión a la base de datos Firestore
const db = admin.firestore();

// Referencia a la colección 'usuarios' en Firestore
const usuarios = db.collection('charca').doc('usuarios');

// Inicio del servidor Express
app.listen(port, () => {
  console.log(`Escuchando en el puerto: ${port}`);
});

// Ruta para obtener datos de usuario
app.get('/datosUsuario', async (req, res) => {
  try {
    // Obtener datos de Firestore
    const datos = await usuarios.get();
    // Enviar datos como respuesta JSON
    res.json(datos.data());
  } catch (error) {
    // Manejo de errores
    console.error("Error al obtener datos de usuario:", error);
    res.status(500).json({ error: 'Error al obtener datos de usuario' });
  }
});

app.post('/registroUsuario', async (req, res) => {
  const datos = db.collection('charca')
  const nombrearchibo = req.body.email;
  const datosuser = {
    user: req.body.user,
    email: req.body.email,
    contrasenya: req.body.contrasenya,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    descripcion: req.body.descripcion,
    tel: req.body.tel
  };
  await datos.doc(nombrearchibo).set({datosuser})
});


//se tiene que instalar el jsonpath
const  jp = require('jsonpath')
const {createWriteStream, appendFile} = require("fs");
const {join} = require("path");
//const {dirname} = require("@angular/compiler-cli");
const path = require("path");
const sequelize = require("sequelize");

app.get('/gmailuser', async (req, res) => {
  const snapshot = await db.collection('charca').get();
  const nombresArchivos = [];

  snapshot.forEach(doc => {
    nombresArchivos.push(doc.id);
  });

  res.json(nombresArchivos);
});
app.get('/passworduser', async (req, res) =>{
  try {
    const usuariosSnapshot = await db.collection('charca').get();
    const entradasConContraseña = [];

    usuariosSnapshot.forEach(doc => {
      const datauser = doc.data();
      const datosmail = jp.query(datauser, '$..email');
      const datosconta = jp.query(datauser, '$..contrasenya');
      const datosuser = jp.query(datauser, '$..user');

      for (let i = 0; i < Math.min(datosmail.length, datosconta.length, datosuser.length); i++) {
        entradasConContraseña.push({
          email: datosmail[i],
          contrasenya: datosconta[i],
          user: datosuser[i]
        });
      }
    });

    res.json(entradasConContraseña);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

app.get('/tadalainfodeluser', async (req, res) => {
  try {
    const usuariosSnapshot = await db.collection('charca').get();
    const entradasConTodosLosCampos = [];

    usuariosSnapshot.forEach(doc => {
      const datauser = doc.data();
      const datosmail = jp.query(datauser, '$..email');
      const datosconta = jp.query(datauser, '$..contrasenya');
      const datosuser = jp.query(datauser, '$..user');
      const datosnom = jp.query(datauser, '$..nombre');
      const datoscognom = jp.query(datauser, '$..apellido');
      const datosdescripcion = jp.query(datauser, '$..descripcion');
      const datostel = jp.query(datauser, '$..tel');

      for (let i = 0; i < Math.min(datosmail.length, datosconta.length, datosuser.length); i++) {
        entradasConTodosLosCampos.push({
          email: datosmail[i],
          contrasenya: datosconta[i],
          user: datosuser[i],
          nombre: datosnom[i],
          apellido: datoscognom[i],
          descripcion: datosdescripcion[i],
          tel: datostel[i]
        });
      }
    });

    res.json(entradasConTodosLosCampos);
  } catch (error) {
    console.error("Error al obtener los datos de usuario:", error);
    res.status(500).json({ error: "Hubo un error al obtener los datos de usuario." });
  }
});

app.post('/modificarUsuario', async (req, res) => {
  try {
    const correoUsuario = req.body.email;
    const datosUsuario = {
      user: req.body.user,
      email: req.body.email,
      contrasenya: req.body.contrasenya,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      descripcion: req.body.descripcion,
      tel: req.body.tel
    };

    const usuarioRef = db.collection('charca').doc(correoUsuario);

    await usuarioRef.set(datosUsuario);

    return res.status(200).json({ message: 'Usuario modificado exitosamente.' });
  } catch (error) {
    console.error("Error al modificar el usuario:", error);
    return res.status(500).json({ error: "Hubo un error al modificar el usuario." });
  }
});

app.post('/mailberificacion',async (req,res) => {
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lacharchadelpejelagarto@gmail.com',
      pass: 'hnfy izkj luuc dwaq'
    }
  });
  const mail = req.body.mail; // Accede al correo electrónico enviado desde el cliente
  let mailOptions = {
    from: 'lacharchadelpejelagarto@gmail.com',
    to: mail,
    subject: 'Verificar tu cuenta',
    html: '<a href="http://localhost:4200/validacion">Validar</a>'
  };
  await transporter.sendMail(mailOptions, (error, response) => {
    error ? console.log(error) : console.log(response);
  })
})

app.post('/mail',async (req,res) => {
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lacharchadelpejelagarto@gmail.com',
      pass: 'hnfy izkj luuc dwaq'
    }
  });
  const mail = req.body.mail; // Accede al correo electrónico enviado desde el cliente
  let mailOptions = {
    from: 'lacharchadelpejelagarto@gmail.com',
    to: mail,
    subject: 'Recuperar tu contraseña',
    html: '<a href="http://localhost:4200/recuperar">Recuperar</a>'
  };
  await transporter.sendMail(mailOptions, (error, response) => {
    error ? console.log(error) : console.log(response);
  })
})

const docRef = db.collection('charca')
app.post('/contra', async (req, res)=>{
  let data = {datosuser: {contrasenya: req.body.contrasenya}}
  const rs = await docRef.doc(req.body.mail).set(data, {merge: true})
})


app.post('/consultes', async (req, res) => {
  const nombreConsulta = req.body.nombreConsulta;
  const consulta = req.body.consulta;

  const rutaArchivos = path.join(__dirname, '/consultes')
  if (!fs.existsSync(rutaArchivos)) {
    fs.mkdirSync(rutaArchivos);
  }

  const files = fs.readdirSync(rutaArchivos);
  const cantitatfixers = files.length;

  let cantitatfixersAString = cantitatfixers.toString();
  const rutaParaConsulta = path.join(__dirname, '/consultes','consulta'+cantitatfixersAString+'.txt')
  const escribirConsultas = fs.createWriteStream(rutaParaConsulta, { flags: 'a' });
  fs.writeFileSync(rutaParaConsulta, `--------- ${nombreConsulta} ---------\n`);
  escribirConsultas.write(consulta + "\n");
  escribirConsultas.end("--------------------------------------------------------");

  console.log(cantitatfixers);
  console.log(rutaParaConsulta);
})

app.use(express.static('.'))
app.use('/assets', express.static('assets'))

app.post('/logs', async (req, res) => {
  const user = req.body.user;
  const accion = req.body.accion;
  const data = req.body.data;
  const logEntry = `${data} - User: ${user}, accion: ${accion}\n`;

  const rutaArchibos = join(__dirname, '/logs.txt');
  const escribirConsultas = fs.createWriteStream(rutaArchibos, { flags: 'a' });
  escribirConsultas.write(logEntry)
  escribirConsultas.end("----------------------------------------------------------------\n");
})
app.get('/datosUsuario', async (req, res) => {
  try {
    // Obtener datos de Firestore
    const datos = await usuarios.get();
    const userData = datos.data();
    const isAdmin = userData.admin || false;
    res.json({ ...userData, isAdmin });
  } catch (error) {

    console.error("Error al obtener datos de usuario:", error);
    res.status(500).json({ error: 'Error al obtener datos de usuario' });
  }
});

//------------------- UF2 - Persistència en BDR-BDOR-BDOO --------------------------------
const {where} = require("sequelize");
const {ConfigDB} = require('./db.config')
const dbSQL = ConfigDB();
const mysql2 = require("mysql2");

const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1212',
  database: 'charcacharcosa'
})

app.post('/comprarproductos', (req, res) => {
  const {
    idproducte_productevenut,
    nom_producte_venut,
    cantitat_producte_venut,
    preuTotal_producte_venut,
    cantitat_descompte,
    usuari_compradors
  } = req.body;
  const query = `INSERT INTO productevenut (
    idproducte_productevenut,
    nom_producte_venut,
    cantitat_producte_venut,
    preuTotal_producte_venut,
    data_producte_venut,
    cantitat_descompte,
    usuari_compradors
  ) VALUES (?, ?, ?, ?, CURDATE(), ?, ?)`;

  const values = [
    idproducte_productevenut,
    nom_producte_venut,
    cantitat_producte_venut,
    preuTotal_producte_venut,
    cantitat_descompte,
    usuari_compradors
  ];
  connection.query(query, values)
})

const initModels = require("./models/init-models");

const models = initModels(dbSQL);

app.get('/obtenirProductes', async (req, res) => {
  const productes = await models.producte.findAll();
  console.log(productes)
  res.json(productes);
})

app.get('/obtenirCarrito', async (req, res) => {
  const carrito = await models.cistella.findAll();
  res.json(carrito);
})

app.post('/setProducteCarrito' , async (req, res) => {
  const id_producto_cistella = req.body.id_producto_cistella;
  const usuari_afegit = req.body.usuari_afegit;
  const nom_producte = req.body.nom_producte;
  const cantitat = req.body.cantitat;
  const preu_unitat = req.body.preu_unitat;
  const imagen_producto = req.body.imagen_producto;
  console.log(id_producto_cistella)
  await models.cistella.create({
    id_producto_cistella: id_producto_cistella,
    usuari_afegit: usuari_afegit,
    nom_producte: nom_producte,
    cantitat: cantitat,
    preu_unitat: preu_unitat,
    imagen_producto: imagen_producto
  });
})

app.post('/eliminarProductoCarrito', async (req, res) => {
  const nom_producte = req.body.nom_producte;
  const usuari_afegit = req.body.usuari_afegit;
  await models.cistella.destroy({where: {usuari_afegit: usuari_afegit, nom_producte:nom_producte}})
})

app.post('/eliminarProductoCarritoComprado', async (req, res) => {
  const usuari_afegit = req.body.usuari_afegit;
  await models.cistella.destroy({where: {usuari_afegit: usuari_afegit}})
})

app.post('/descontarStock', async (req, res) => {
  const nom_producte = req.body.nom_producte;
  const cantidad_restar = req.body.cantidad_restar;
  console.log("ola",nom_producte)
  console.log(cantidad_restar)
  const producto = await models.producte.findOne({where: {nombre_producto: nom_producte}});
  producto.cantidad -= cantidad_restar;
  await producto.save();
})

  app.get('/historial', async (req, res) => {

    try {
      const historialProductos = await models.productevenut.findAll();
      console.log(historialProductos);
      res.json(historialProductos);
    } catch (error) {
      console.error('Error al obtener el historial de productos:', error);
      res.status(500).json({ error: 'Error al obtener el historial de productos' });
    }
  });
app.post('/api/agregar-producto', async (req, res) => {
  try {
    console.log(req.body.nombre_producto);
    console.log(req.body.descripcion_producto);
    console.log(req.body.cantidad);
    console.log(req.body.precio_producto);
    console.log(req.body.cantidad_descuento);
    console.log(req.body.imagen_producto);
    console.log(req.body.tipo_producto);
    await models.producte.create({
      nombre_producto: req.body.nombre_producto,
      descripcion_producto: req.body.descripcion_producto,
      cantidad: req.body.cantidad,
      precio_producto: req.body.precio_producto,
      cantidad_descuento: req.body.cantidad_descuento,
      imagen_producto: req.body.imagen_producto,
      tipo_producto: req.body.tipo_producto
    });
    res.status(200).json({ message: 'Producto insertado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al insertar el producto en la base de datos' });
  }
})
