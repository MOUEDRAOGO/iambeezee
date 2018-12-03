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
    let accountPage;
    let userId;

    $(window).on("load", function () { // instruction lue mais exécutée une fois que toute la page est chargée

        // socket = io(); 
        // initialisation socket.io

        navbar = $("#includedNavbar");
        mainPage = $("#includedMiddleBloc");
        accountPage = $("#includedAccountMiddleBloc") 

        navbar.load("/html/nov_navbar_4.2.html", function(){ 
            f_signUp();
            f_signIn();
            $("#rs-notifications-dropdown-linkA").click(function(e) {
                e.preventDefault();
                mainPage.hide();
                accountPage.load("/html/nov_page_account_reseausocial_4.2.html", function() {
                    console.log("account loaded");
                    socket.emit("getAccountInfo", userId, function(userInfo) {
                        console.log(userInfo);
                        $("#inputEmail4").get(0).value = userInfo.email;
                        $("#inputpseudo").get(0).value = userInfo.pseudo;
                    });
                    accountPage.show();
                });
            });

        });

        /* USER DEFAULT LOCALISATION */
        // f_userDefaultLocalisation("48.858559", "2.294440"); 
        // localisation par default = utilisation en parametre des coordonnees de la Tour Effeil

        /* SIGN UP */

        /* SIGN IN */

        /* onOffSwitchButtonSetUp */
        // f_onOffSwitchButtonSetUp();


    });
    // end of $(window).on("load", function() {


    /********************************
     *                               *
     * A LA LECTURE DE L INSTRUCTION *
     *                               *
     ********************************/

    /*$(document).on("ready", function () { // execution immédiate dès que l'instruction est lue

        console.log("ready");

    });*/
    // end of $(document).on("ready", function() {






    /*************************** INITIALISATION DES FONCTIONS ******************************************************************************/

    function f_signUp() {
        // TO DO affichage des CGU au click sur CGU , dans une popup avec dimensions specifiques

        let signupValidateBtn = $('#rs-signup-validate-btn');

        signupValidateBtn.click( function() {
            let isFormValid = true; 

            let signUpPseudo = $("#signUpPseudo").get(0);

            let signUpPseudoValue = signUpPseudo.value;
            console.log(signUpPseudoValue);

            if(!signUpPseudoValue) { 
                console.log("client  : Pas de signUpPseudoValue");
            }

            let signUpEmail = $("#signUpEmail").get(0);
            let signUpEmailValue = signUpEmail.value;
            if(!signUpEmailValue) { 
                console.log("client  : Pas de signUpEmailValue");
            }

            // verification de la correspondance des mots de passe lors de l'inscription
            let signUpPassword = $("#signUpPassword").get(0);
            let signUpPasswordValue = signUpPassword.value;
            if(!signUpPasswordValue) { 
                console.log("client  : Pas de signUpPasswordValue");
            }

            if(!signUpPasswordValue || signUpPasswordValue == null) { 
                isFormValid = false;
            }

            let signUpConfirmPassword = $("#signUpConfirmPassword").get(0);
            let signUpConfirmPasswordValue = signUpConfirmPassword.value;
            if(!signUpConfirmPasswordValue) { 
                console.log("client  : Pas de signUpConfirmPasswordValue");
            }

            if(!signUpConfirmPasswordValue || signUpConfirmPasswordValue == null) { 
                isFormValid = false;
            }

            if(!isFormValid || signUpPasswordValue != signUpConfirmPasswordValue) {
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

                socket.emit('userSignUpData',{signUpPseudoValue, signUpEmailValue, signUpPasswordValue}); // renvoie, au server, les valeurs de signUpEmail, signUpPassword et de signUpConfirmPassword + acceptation des cgu, afin de les stocker dans l'id du membre

                socket.emit('newMembersNbr', newMembersNbr); // renvoi pour update coté server du nbre de nouveaux inscrits

                socket.emit('connectedMembersNbr', connectedMembersNbr); // renvoi pour update coté server du nbre de membres connectés   

            }

            socket.on('emailAlreadyUsed', function(emailAlreadyUsedData) {
                console.log(emailAlreadyUsedData);
            });

        });



        // TO DO   TO DO   TO DO   TO DO   TO DO   TO DO   TO DO   TO DO   TO DO   TO DO    TO DO   TO DO   TO DO   TO DO   TO DO   TO DO   TO DO   TO DO   TO DO   TO DO


        // TO DO POURQUOI MON URL N EST PAS RECONNUE ?
        // function popUp('cgu_reseausocial_1.0.html') { 
        //     newwindow=window.open(url,'PopUpCgu','height=500,width=600');
        //     if (window.focus) {newwindow.focus()}
        //     return false;
        // }


        // fermeture de la popup
        // let cguCloseBtn = document.getElementsByClassName('rs-cgu-close-btn');

        // document.getElementsByClassName('rs-signup-cgu-link').addEventListener('click', function() { 
        //     cguMainContainer.style.display = "block"; 

        //                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             // }); 

        //
    }

    function f_signIn() {
        console.log('signIN');
        let rsSignupEnterBtn = $('#rs-signup-enter-btn');
        rsSignupEnterBtn.click(function() {
            console.log('signInClicked');
            let signInEmailValue = $('#signInEmail').get(0).value; 
            let signInPasswordValue = $('#signInPassword').get(0).value; 

            socket.emit('userSignInEmit', {signInEmailValue, signInPasswordValue});
        });

        socket.on('userIsLogged', function(userObj) {
            let rsNavbarNotificationsTitle = $('#rs-navbar-notifications-title');
            console.log(userObj);
            userId = userObj._id;
            rsNavbarNotificationsTitle.get(0).innerText = userObj.pseudo;
        });

        socket.on('newMembersConnectedMore', function(membersConnected) {
            console.log(membersConnected);
            let realtimeConnectedBadge = $('#rs-realTime-connected-badge');
            realtimeConnectedBadge.get(0).innerText = membersConnected;

        });
    }



})(jQuery);






/*************************** A NETTOYER ******************************************************************************/


