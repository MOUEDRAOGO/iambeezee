

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
const url = "mongodb://localhost:27017/iambeezeedb";
//const url = "mongodb://admin:admin1@ds119374.mlab.com:19374/iambeezee"; 

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

io.on('connect', function (socket) { // qd un utilisateur (encore anonyme) arrive sur l url du site

    siteConnexionsNbr++;
    console.log("il y a eu " + siteConnexionsNbr + " connexions sur le site");

    socket.on('disconnect', function(){
        siteConnexionsNbr--;
        console.log("il y a eu " + siteConnexionsNbr + " connexions sur le site");
    });

    socket.on('newMembersNbr', function(data) { // nbre de nouveaux membres
        console.log("new member");
        console.log(data);
    });

    socket.on('connectedMembersNbr', function() { // nbre de membres connectés
        console.log("connected new member");
    });

    //TO DO qd le user clique sur "validez" : creer un userID et stocker et matcher l email et la confirmation du mot de passe et le check des CGU(check true/false)  en bdd
    //    socket.on('signUpInformations', function() {
    //            console.log("kikou server");
    //
    //                }); // je renvoie, au server, les valeurs de signUpEmail, signUpPassword et de signUpConfirmPassword, afin de les stocker dans l'id du membre
    //
    //                    //TO DO stcoker ses data en userId et notamment sa date d'inscription
    //                        //TO DO verifier si l utilisateur a une permission admin, si oui, afficher la div rs-navbar-admin
    /*socket.on('membersValidateSignIn', function() {
        if(){
            socket.emit('ValidateSignInOk', ValidateSignInOk); // le mdp correpond bien a l email du membre
        }else{
            socket.emit('ValidateSignInNok', ValidateSignInNok); 

        }
    });*/
}); // end of io.on

//TO DO si validateSignIn == true, user === UserMember donc rafraichir ses data (Id + +date de connexion + permission + localisation + timeData + SearchData + friends dans rs-aside-friends-badge et rs-friends-connected-listGroup + Members dans rs-members-connected-listGroup + mon compte dans rs-asideAccount-listGroup ) dans son userID
//    //TO DO si validateSignIn == false, envoyer un msg d avertissement
//        //TO DO verifier si l utilisateur a une permission admin, si oui, afficher la div rs-navbar-admin
/********************************************/

// Ecoute serveur

/********************************************/

server.listen(8888, function () {
    console.log('CONNECTED TO local nov_server_reseausocial.js !');
});
/*jsserver.listen(process.env.PORT || 8888, function () {
    console.log('CONNECTED TO nov_server_reseausocial.js !');
});*/
// process.env.PORT = port de connexion pour l hebergement chez Heroku
