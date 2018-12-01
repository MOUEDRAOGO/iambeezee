//JQUERY
(function ($) {
    /*****************************
     *                            *
     *  AU CHARGEMENT DE LA PAGE  *
     *                            *
     *****************************/

    console.log("ready");
    debugger;
    var socket = io();

    $(window).on("load", function () { // instruction lue mais exécutée une fois que toute la page est chargée

        // socket = io(); 
        // initialisation socket.io

        var test = document.getElementById('#includedNavbar');
        console.log("LOL");
        console.log(test);
        debugger;
        $("#includedNavbar").load("/html/nov_navbar_4.2.html", function(){ 
            f_signUp();
        });

        socket.emit('message1', function () {
            console.log('message1 envoyé par le client')
        });

        /* USER DEFAULT LOCALISATION */
        // f_userDefaultLocalisation("48.858559", "2.294440"); 
        // localisation par default = utilisation en parametre des coordonnees de la Tour Effeil

        /* SIGN UP */

        /* SIGN IN */
        // f_signIn();

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
        console.log("kikou");

        let signupValidateBtn = $('.test');
        let test = document.getElementById("#rs-signup-validate-btn");
        debugger;

        signupValidateBtn.click( function() {
            console.log("kikou");
            debugger;
            let isFormValid = true; 
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

                socket.emit('usersSignUpData',{signUpEmailValue, signUpPasswordValue, signUpConfirmPasswordValue, signupCguInputValue}); // renvoie, au server, les valeurs de signUpEmail, signUpPassword et de signUpConfirmPassword + acceptation des cgu, afin de les stocker dans l'id du membre

            }
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






})(jQuery);






/*************************** A NETTOYER ******************************************************************************/


