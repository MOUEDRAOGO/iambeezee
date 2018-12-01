

io.on('connection', function (socket) {

    socket.on('signUpInfos', function (signUpInfos) { // a quoi ca sert de mettre signUpInfos en argument ?
        var signUpInfos = {
            username: pseudo.username,
            state: pseudo.state,
            permission: "member",
            cgu: pseudo.cgu
            // "prenom" : "",
//       "nom" : "",
//       "pseudo" : "",
//         "activity" : ["comments", "privatesmsg", "chat", "friends", "friendshipstatus" : [notfriend, buddy [accepted, invitationinprogress, recommendby,toconfirm]] "friendsrequests", "friendsrequestssent", "waitingforconfirmation", "recommendations", "invitationsinprogress","realisedoccupations", "visitedplaces", "clickedroutes" , "mutualfriends", "deletedfriends"], 
        };
    });


});

