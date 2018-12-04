//JQUERY
(function ($) {
    /*****************************
     *                            *
     *  AU CHARGEMENT DE LA PAGE  *
     *                            *
     *****************************/

    var socket = io();
    let navbar;
    let mainPage;
    let includedAccountPageMiddleBloc;
    let userId = "";
    let includedProfilPageMiddleBloc;

    $(window).on("load", function () { // instruction lue mais exécutée une fois que toute la page est chargée

        console.log("client : onLoad ok");
        // affectation des templates

        navbar = $("#includedNavbar");
        mainPage = $("#includedMiddleBloc");
        includedAccountPageMiddleBloc = $("#includedAccountPageMiddleBloc");
        includedProfilPageMiddleBloc = $("#includedProfilPageMiddleBloc");

        mainPage.load("/html/nov_mainMiddleBlocContent_4.2.html");

        navbar.load("/html/nov_navbar_4.2.html", function () {
            f_signUp();
            f_signIn();

            // gestion des redirections "mon compte" de la navbar
            $("#rs-notifications-dropdown-linkA").click(function (e) {
                e.preventDefault(); // evite que la page se recharge elle meme
                mainPage.hide(); // display none du middlebloc de la page principale
                includedProfilPageMiddleBloc.hide(); 
                includedAccountPageMiddleBloc.load("/html/nov_page_account_reseausocial_4.2.html", function () { // chargement de  l included la page account
                    if(userId != ""){
                        console.log("account loaded");
                        socket.emit("getAccountInfo", userId, function (userInfo) {
                            console.log(userInfo);
                            $("#inputEmail4").get(0).value = userInfo.email;
                            $("#inputpseudo").get(0).value = userInfo.pseudo;
                        });
                    }
                    includedAccountPageMiddleBloc.show(); // une fois que tout est chargé on affiche includedAccountPageMiddleBloc
                });
            });

            $("#rs-notifications-dropdown-linkB").click(function (e) {
                e.preventDefault(); 
                mainPage.hide(); 
                includedAccountPageMiddleBloc.hide(); 
                includedProfilPageMiddleBloc.load("/html/nov_page_profil_reseausocial_4.2.html", function () { 
                    if(userId != "") {
                        socket.emit("getProfileInfo", userId, function (profileInfo) {
                            console.log(profileInfo);
                            $("#rs-profil-favoriteOccupationsTop-imageA").attr("src", profileInfo[0].fav_img);
                            $("#rs-profil-favoriteOccupationsTop-textNameA").get(0).innerText = profileInfo[0].fav_name;
                            $("#rs-profil-favoriteOccupationsTop-imageB").attr("src", profileInfo[1].fav_img);
                            $("#rs-profil-favoriteOccupationsTop-textNameB").get(0).innerText = profileInfo[1].fav_name;
                            $("#rs-profil-favoriteOccupationsTop-imageC").attr("src", profileInfo[2].fav_img);
                            $("#rs-profil-favoriteOccupationsTop-textNameC").get(0).innerText = profileInfo[2].fav_name;

                        });
                    }
                    includedProfilPageMiddleBloc.show(); 
                });
            });

            $("#rs-navbar-icon-container").click(function (e) {
                e.preventDefault(); 
                mainPage.show(); 
                includedAccountPageMiddleBloc.hide(); 
                includedProfilPageMiddleBloc.hide(); 
            });

            $(".lcs_check").click(function (e) {
                if(userId != ""){
                    console.log(e.currentTarget.parentNode.parentNode.parentNode.parentNode.children[0].children[0].src);
                    console.log(e.currentTarget.checked);
                    console.log(e.currentTarget.parentNode.parentNode.parentNode.children[0].innerText);
                    let img = e.currentTarget.parentNode.parentNode.parentNode.parentNode.children[0].children[0].src;
                    let checked = e.currentTarget.checked;
                    let favori = e.currentTarget.parentNode.parentNode.parentNode.children[0].innerText;
                    socket.emit("saveFavori", userId, img, checked, favori);
                }
            });
        });

    });
    // end of windowonload


    /********************************
     *                               *
     * A LA LECTURE DE L INSTRUCTION *
     *                               *
     ********************************/

    $(document).on("ready", function () { // execution immédiate dès que l'instruction est lue

        console.log("client : onReady ok");

    });
    // end of $(document).on("ready", function() {






    /*************************** INITIALISATION DES FONCTIONS ******************************************************************************/

    function f_signUp() {
        // TO DO affichage des CGU au click sur CGU , dans une popup avec dimensions specifiques

        // console.log('signUp function is ready');

        let signupValidateBtn = $('#rs-signup-validate-btn');

        signupValidateBtn.click(function () {
            let isFormValid = true;

            let signUpPseudo = $("#signUpPseudo").get(0);

            let signUpPseudoValue = signUpPseudo.value;
            console.log(signUpPseudoValue);
            if (!signUpPseudoValue) {
                console.log("client  : Pas de signUpPseudoValue");
            }

            let signUpEmail = $("#signUpEmail").get(0);
            let signUpEmailValue = signUpEmail.value;
            if (!signUpEmailValue) {
                console.log("client  : Pas de signUpEmailValue");
            }

            // verification de la correspondance des mots de passe lors de l'inscription
            let signUpPassword = $("#signUpPassword").get(0);
            let signUpPasswordValue = signUpPassword.value;
            if (!signUpPasswordValue) {
                console.log("client  : Pas de signUpPasswordValue");
            }

            if (!signUpPasswordValue || signUpPasswordValue == null) {
                isFormValid = false;
            }

            let signUpConfirmPassword = $("#signUpConfirmPassword").get(0);
            let signUpConfirmPasswordValue = signUpConfirmPassword.value;
            if (!signUpConfirmPasswordValue) {
                console.log("client  : Pas de signUpConfirmPasswordValue");
            }

            if (!signUpConfirmPasswordValue || signUpConfirmPasswordValue == null) {
                isFormValid = false;
            }

            if (!isFormValid || signUpPasswordValue != signUpConfirmPasswordValue) {
                signUpConfirmPassword.setCustomValiy("Votre confirmation de mot de passe ne correspond pas !");
                console.log("client  : confirmation password nok");
            } else {
                console.log("client  : confirmation password ok");
                let newMembersNbr = 0;
                let connectedMembersNbr = 0;

                if (signUpConfirmPassword.setCustomValidity('')) {
                    connexionStatus = "online"; // changement de statut  

                    newMembersNbr++; // qd un nouveau membre s inscrit on incremente le nbre de nouveaux membres 
                    console.log("client  : Nombre de nouveaux membres = " + newMembersNbr);

                    connectedMembersNbr++; // qd un membre se connecte on incremente le nbre de membres
                    console.log("client  : Nombre membres connectés = " + connectedMembersNbr);

                };

                socket.emit('userSignUpData', { signUpPseudoValue, signUpEmailValue, signUpPasswordValue }); // renvoie, au server, les valeurs de signUpEmail, signUpPassword et de signUpConfirmPassword + acceptation des cgu, afin de les stocker dans l'id du membre

                socket.emit('newMembersNbr', newMembersNbr); // renvoi pour update coté server du nbre de nouveaux inscrits

                socket.emit('connectedMembersNbr', connectedMembersNbr); // renvoi pour update coté server du nbre de membres connectés   

            }

            socket.on('emailAlreadyUsed', function (emailAlreadyUsedData) {
                console.log(emailAlreadyUsedData);
            });

        });


    }

    function f_signIn() {
        // console.log('signIn function is ready');
        let rsSignupEnterBtn = $('#rs-signup-enter-btn');
        rsSignupEnterBtn.click(function () {
            console.log('signInClicked');
            let signInEmailValue = $('#signInEmail').get(0).value;
            let signInPasswordValue = $('#signInPassword').get(0).value;

            socket.emit('userSignInEmit', { signInEmailValue, signInPasswordValue }); // envoi des valeurs de champ saisis par l utilisateur
        });

        socket.on('userIsLogged', function (userObj) {
            let rsNavbarNotificationsTitle = $('#rs-navbar-notifications-title');
            console.log(userObj);
            userId = userObj._id; // recuperation de l id utilisateur ds l objet renvoyé
            rsNavbarNotificationsTitle.get(0).innerText = userObj.pseudo; // affichage de l id ds le champ concerné
        });

        socket.on('newMembersConnectedMore', function (membersConnected) {
            console.log(membersConnected);
            let realtimeConnectedBadge = $('#rs-realTime-connected-badge');
            realtimeConnectedBadge.get(0).innerText = membersConnected; // a la recpetion d'un nouveau membre on affiche sa nouvelle valeur ds le champ concerné

        });
    }



})(jQuery);






/*************************** A NETTOYER ******************************************************************************/


