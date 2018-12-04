

/********************************************

 ******      CHARGEMENT DES MODULES    ******

 ********************************************/


// const fs = require('fs');
const http = require('http');
const fs = require('fs');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
var ObjectId = mongo.ObjectID;
//const url = "mongodb://localhost:27017/playersdb";


/*****************************************************************************************************************************************************************************
 * 
 ******************************************************************      MONGODB    ***********************************************************************
 *
 *****************************************************************************************************************************************************************************/

// const mongo = require('mongodb');

// const MongoClient = mongo.MongoClient;
//const url = "mongodb://localhost:27017/iambeezeedb";
const url = "mongodb://admin:admin1@ds119374.mlab.com:19374/iambeezee"; 

//mongod.exe --dbpath=H:\MOUEDRAOGO\atelier_reseau_social\iambeezee\data

let dbo = null;


MongoClient.connect(url, function (err, db) {
    dbo = db.db("iambeezee");
    dbo.createCollection("members", function (err, res) {
        if (err) throw err;
        console.log("server  : Collection members created!");
    });
    dbo.createCollection("occupations", function (err, res) {
        if (err) throw err;
        console.log("server  : Collection occupations created!");
    });
    dbo.createCollection("chatmsg", function (err, res) {
        if (err) throw err;
        console.log("server  : Collection chatmsg created!");
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

io.on('connect', function (socket) { // qd un utilisateur (encore anonyme) arrive sur l url du site

    siteConnexionsNbr++;
    console.log(" server  : il y a eu " + siteConnexionsNbr + " connexions sur le site");

    socket.on('newMembersNbr', function(data) { // nbre de nouveaux membres
        console.log("server  : new member");
        console.log(data);
    });

    socket.on('connectedMembersNbr', function() { // nbre de membres connectés
        console.log("server  : connected new member");
    });

    socket.on('userSignUpData', function(userSignUpData) {
        console.log("server  pseudo :" + userSignUpData.signUpPseudoValue);
        console.log("server  email :" + userSignUpData.signUpEmailValue);
        console.log("server  password :" + userSignUpData.signUpPasswordValue);

        // verification qu un membre ayant cet email ne soit pas deja inscrit
        var response = dbo.collection('members').find({email: userSignUpData.signUpEmailValue});
        response.count(function(err, count) {
            if(count > 0) {
                console.log("server  : Utilisateur existe deja");
                socket.emit('emailAlreadyUsed', "Attention l'utilisateur " + userSignUpData.signUpEmailValue + " existe deja");
            } else {
                var obj = {
                    pseudo: userSignUpData.signUpPseudoValue,
                    email: userSignUpData.signUpEmailValue,
                    password: userSignUpData.signUpPasswordValue,
                    userPermission: "member",
                    userStatus: "offline"
                };

                // insertion d un new member ds la bdd
                dbo.collection("members").insertOne(obj, function(err, res) {
                    if (err) throw err;
                    console.log("server  : 1 new user inserted");
                    socket.emit('newMemberCreated', res.insertedId);

                    newMembersNbr++; //a la creation d 'un new member, on le rajoute au nbre de membres deja cree
                    console.log("server  : nbre de new members =  " + newMembersNbr );
                    socket.emit('newMembersNbrMore', obj);

                });
                // 
            }
        });
    });

    socket.on('userSignInEmit', function(userSignInData) {
        console.log('userSignIn try');
        var response = dbo.collection('members').find({email: userSignInData.signInEmailValue});
        response.count(function(err, count) {
            if(count > 0) {
                console.log("server  : ok cet email appartient bien a un membre");
                response.forEach(function(obj) {
                    //dbo.collections("members").update({_id: new ObjectId(obj._id)},{$set: { userStatus: "online" }});
                    obj.userStatus = "online";
                    socket.emit('userIsLogged', obj); // qd le user est logge on incremente
                    membersConnected++;
                    console.log("nbre de members connectés =  " + membersConnected );
                    socket.broadcast.emit('newMembersConnectedMore', membersConnected);
                    socket.emit('newMembersConnectedMore', membersConnected);
                });
            } else {
                console.log("server  : cet email n est pas celui d un membre existant ");
            }
        });
    });

    socket.on('getAccountInfo', function(id, fn) {
        console.log(id);
        dbo.collection("members").findOne({_id: new ObjectId(id)}, function(err, result) { // verification de la presence de l id
            if (err) throw err;
            console.log(result);
            fn(result);
        });
    });

    socket.on('saveFavori', function(userId, img, checked, favori) {
        console.log(userId);
        console.log(img);
        console.log(checked);
        console.log(favori);
        dbo.collection("occupations").findOne({fav_user_id: userId, fav_name: favori}, function(err, result){
            if (err) throw err;
            console.log(result);
            var obj = {
                fav_user_id: userId,
                fav_img: img,
                fav_state: checked,
                fav_name: favori
            }

            if(result != null){
                obj._id = result._id;
            }          

            dbo.collection("occupations").save(obj);
        });
    });

    // fn correspond a la fonction declaree dans le front
    socket.on('getProfileInfo', function(userId, fn) {
        dbo.collection("occupations").find({fav_user_id: userId}, function(err, result) {
            if (err) throw err;
            //La fonction sera executee une fois que le resultat sera connu
            result.toArray().then(function(occupationsArray) {
                fn(occupationsArray);
            });
            //fn(result);
        });
    });
    //DISCONNECTION
    socket.on('disconnect', function(){
        siteConnexionsNbr--;


        if(membersConnected > 0){
            membersConnected--;
        }
        socket.broadcast.emit('newMembersConnectedMore', membersConnected);
        console.log("server  : il reste " + membersConnected + " membres connectés");
    });
}); // end of io.on

//TO DO si validateSignIn == true, user === UserMember donc rafraichir ses data (Id + +date de connexion + permission + localisation + timeData + SearchData + friends dans rs-aside-friends-badge et rs-friends-connected-listGroup + Members dans rs-members-connected-listGroup + mon compte dans rs-asideAccount-listGroup ) dans son userID
//    //TO DO si validateSignIn == false, envoyer un msg d avertissement
//        //TO DO verifier si l utilisateur a une permission admin, si oui, afficher la div rs-navbar-admin

/********************************************/

// Ecoute serveur

/********************************************/

// server.listen(8890, function () {
//     console.log('CONNECTED TO local nov_server_reseausocial.js !');
// });

server.listen(process.env.PORT || 8890, function () {
    console.log('server  : CONNECTED TO nov_server_reseausocial.js !');
});
// process.env.PORT = port de connexion pour l hebergement chez Heroku
