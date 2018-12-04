

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
// const url = "mongodb://localhost:27017/iambeezeedb";
const url = "mongodb://admin:admin1@ds119374.mlab.com:19374/iambeezee"; 

//mongod.exe --dbpath=H:\MOUEDRAOGO\atelier_reseau_social\iambeezee\data

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

let newMembersNbr = 0

let membersConnected = 0

io.on('connect', function (socket) { // qd un utilisateur arrive sur l url du site

    siteConnexionsNbr++;
    console.log("il y a eu " + siteConnexionsNbr + " connexions sur le site");


    socket.on('userSignUpData', function(data) {
        console.log(data.signUpPseudoValue);
        console.log(data.signUpEmailValue);
        console.log(data.signUpConfirmPasswordValue);

        var response = dbo.collection('members').find({pseudo: data.signUpPseudoValue, email: data.signUpEmailValue});
        response.count(function(err, count) {
            if(count > 0) {
                console.log("ce pseudo ou cet email existe deja");
                socket.emit('pseudoOrEmailAlreadyUsed', "Attention le pseudo " + data.signUpPseduoValue + "et/ou ! " + "l'email " + data.signUpEmailValue + " existe(nt) deja");
                
            } else {
                var obj = {
                    pseudo: data.signUpPseudoValue,
                    email: data.signUpEmailValue,
                    confirmPassword: data.signUpConfirmPasswordValue,
                    userPermission: "member"
                };

                dbo.collection("members").insertOne(obj, function(err, res) {
                    if (err) throw err;
                    console.log("1 new user inserted");
                    socket.emit('newMemberCreated', res.insertedId); // on envoie l ID du new member

                    newMembersNbr++ // a la creation d 'un new member, on le rajoute au nbre de membres deja cree
                    console.log("nbre de new members =  " + newMembersNbr )
                    socket.emit('newMembersNbrMore', obj);

                    membersConnected++
                    console.log("nbre de members connectés =  " + membersConnected )

                });
            }
        });
    });

    // qd le membre se connecte, verification si oui ou non ce membre est deja inscrit
    socket.on('userSignInData', function(data) {
        console.log('userSignIn try');
        var response = dbo.collection('members').find({email: data.signInEmailValue});
        response.count(function(err, count) {
            if(count > 0) {
                console.log("cet email correspond a un membre existant, il peut se logger !");
                console.log(response);
                response.forEach(function(obj) {
                    socket.emit('userIsLogged', obj);
                });
            } else {
                console.log("email inconnu ds la bdd members");
            }
        });
    });

// DISCONNECT
    socket.on('disconnect', function(){
        siteConnexionsNbr--;
        console.log("il y a eu " + siteConnexionsNbr + " connexions sur le site");

        membersConnected--;

    });


}); // end of io.on




/********************************************/

// Ecoute serveur

/********************************************/

// server.listen(8888, function () {
//     console.log('CONNECTED TO local nov_server_reseausocial.js !');
// });

server.listen(process.env.PORT || 8889, function () {
    console.log('CONNECTED TO nov_server_reseausocial.js !');
});
// process.env.PORT = port de connexion pour l hebergement chez Heroku
