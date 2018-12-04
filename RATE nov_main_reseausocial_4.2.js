//JQUERY
(function ($) {
    /*****************************
     *                            *
     *  AU CHARGEMENT DE LA PAGE  *
     *                            *
     *****************************/

    var socket = io();

    $(window).on("load", function () { // instruction lue mais exécutée une fois que toute la page est chargée

        // socket = io(); 
        // initialisation socket.io

        $("#includedNavbar").load("/html/nov_navbar_4.2.html", function(){ 
            f_signUp();
            f_signIn();
        });

        // socket.emit('message1', function () {
        //     console.log('message1 envoyé par le client')
        // });

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


        let signupValidateBtn = $('#rs-signup-validate-btn');

        signupValidateBtn.click( function() {
            let isFormValid = true; 
            let signUpPseudo = $("#SignUpPseudo").get(0);
            let signUpPseudoValue = signUpPseudo.value;
            debugger;


            let signUpEmail = $("#SignUpEmail").get(0);
            let signUpEmailValue = signUpEmail.value;

            // verification de la correspondance des mots de passe lors de l'inscription
            let signUpPassword = $("#SignUpPassword").get(0);
            let signUpPasswordValue = signUpPassword.value;
            if(!signUpPasswordValue || signUpPasswordValue == null) { 
                isFormValid = false;
            }

            let signUpConfirmPassword = $("#SignUpConfirmPassword").get(0);
            let signUpConfirmPasswordValue = signUpConfirmPassword.value;
            if(!signUpConfirmPasswordValue || signUpConfirmPasswordValue == null) { 
                isFormValid = false;
            }

            if(!isFormValid || signUpPasswordValue != signUpConfirmPasswordValue) {
                signUpConfirmPassword.setCustomValidity("Votre confirmation de mot de passe ne correspond pas !");
                console.log("confirmation nok");
            } else {
                console.log("confirmation ok");
                let connexionStatus = "offline";
                let newMembersNbr = 0;
                let connectedMembersNbr = 0;

                if (signUpConfirmPassword.setCustomValidity('')) {
                    connexionStatus = "online"; // changement de statut                                                                                                    
                    newMembersNbr++; // qd un nouveau membre s inscrit on incremente le nbre de nouveaux membres 
                    connectedMembersNbr++; // qd un membre se connecte on incremente le nbre de membres
                    console.log("Nombre de nouveaux membres = " + newMembersNbr);
                    console.log("Nombre membres connectés = " + connectedMembersNbr);

                };


                socket.emit('newMembersNbr', newMembersNbr); // renvoi pour update coté server du nbre de nouveaux inscrits
                socket.emit('connectedMembersNbr', connectedMembersNbr); // renvoi pour update coté server du nbre de membres connectés


                let signupCguInput = $('#rs-signup-cgu-input')
                let signupCguInputValue = signupCguInput.value

                socket.emit('userSignUpData',{signUpPseudoValue, signUpEmailValue, signUpConfirmPasswordValue}); // renvoie, au server, les valeurs de signUpEmail, signUpPassword et de signUpConfirmPassword + acceptation des cgu, afin de les stocker dans l'id du membre

            }

            socket.on('pseudoOrEmailAlreadyUsed', function(pseudoOrEmailAlreadyUsed) {

                // alert(pseudoOrEmailAlreadyUsed); impossible d afficher le msg contenu ds le emit pseudoOrEmailAlreadyUsed
                console.log(data);
            });

            socket.on('newMemberCreated', function(data) {
                console.log(data);
            });
        });



    }


    function f_signIn() {
        console.log('signIN');
        let signInEnterBtn = $('#rs-signin-enter-btn');
        signInEnterBtn.click(function() {
        console.log('signInClicked');
            let signInEmail = $('#signInEmail').get(0);
            let signInEmailValue = signInEmail.value; 
            let signInPassword = $('#signInPassword').get(0); 
            let signInPasswordValue = signInPassword.value; 

            socket.emit('userSignInData', {signInEmailValue, signInPasswordValue});
        });

        socket.on('userIsLogged', function(data) {
            let navbarNotificationsTitle = $('#rs-navbar-notifications-title').get(0);
            let navbarNotificationsTitleValue = navbarNotificationsTitle.value; 
            console.log(data.email);
            navbarNotificationsTitleValue.innerText = data.signInEmailValue;
        });

        // socket.on('newMembersNbrMore', function(data) {
        //     let realtimeCommentsBadge = $('#rs-realTime-comments-badge');
        //     console.log(data.email);
        //     rsNavbarNotificationsTitle.get(0).innerText = data.newMembersNbrMore;
        // });
    }



})(jQuery);






/*************************** A NETTOYER ******************************************************************************/


