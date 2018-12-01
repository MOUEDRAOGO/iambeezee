

/********************************************

 ******      CHARGEMENT DES MODULES    ******

 ********************************************/


// const fs = require('fs');
const http = require('http');
const fs = require('fs');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
// const url = "mongodb://localhost:27017/playersdb";


/*****************************************************************************************************************************************************************************
 * 
 ******************************************************************      MONGODB    ***********************************************************************
 *
 *****************************************************************************************************************************************************************************/

// const mongo = require('mongodb');

// const MongoClient = mongo.MongoClient;
//const url = "mongodb://localhost:27017/iambeezeedb";
const url = "mongodb://admin:admin1@ds119374.mlab.com:19374/iambeezee"; 

//mongod.exe --dbpath=H:\MOUEDRAOGO\atelier_reseau_social\novembre_reseau_social\data

let dbo = null;


MongoClient.connect(url, function (err, db) {
    dbo = db.db("iambeezee");
    dbo.createCollection("members", function (err, res) {
        if (err) throw err;
        console.log("Collection members created!");
    });
    dbo.createCollection("occupations", function (err, res) {
        if (err) throw err;
        console.log("Collection occupations created!");
    });
});


const express = require('express');
const app = express();

const server = http.createServer(app);

// const path = require('path')

const io = require('socket.io')(server, { origins: '*:*' });

app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
    res.sendFile('nov_page_main_reseausocial_4.2.html', { root: 'html' });
});




/*****************************************************************************************************************************************************************************
 * 
 ******************************************************************      SOCKET.IO    ***********************************************************************
 *
 *****************************************************************************************************************************************************************************/




let siteConnexionsNbr = 0;

io.on('connexion', function (socket) { // qd un utilisateur (encore anonyme) arrive sur l url du site

    siteConnexionNbr++;
    console.log("il y a eu " + siteConnexionsNbr + " connexions sur le site");

    // socket.on('message1', function () {
    //     console.log('le server a bien recu le message1')
    //   });

    // socket.on('disconnect', function(){
    //     console.log('member disconnected');
    //   });

}); // end of io.on

/********************************************/

// Ecoute serveur

/********************************************/

/*server.listen(8888, function () {
    console.log('CONNECTED TO nov_server_reseausocial.js !');
});*/
server.listen(process.env.PORT || 8888, function () {
    console.log('CONNECTED TO nov_server_reseausocial.js !');
});
// process.env.PORT = port de connexion pour l hebergement chez Heroku
