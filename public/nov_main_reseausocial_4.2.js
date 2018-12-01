//JQUERY
(function ($) {
    var socket;
    /*****************************
     *                            *
     *  AU CHARGEMENT DE LA PAGE  *
     *                            *
     *****************************/



    $(window).on("load", function () { // instruction lue mais exécutée une fois que toute la page est chargée

        // socket = io(); 
        // initialisation socket.io

        var socket = io();

        socket.emit('message1', function () {
            console.log('message1 envoyé par le client')
        });

        /* USER DEFAULT LOCALISATION */
        // f_userDefaultLocalisation("48.858559", "2.294440"); 
        // localisation par default = utilisation en parametre des coordonnees de la Tour Effeil

        /* SIGN UP */
        // f_signUp();

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

    $(document).on("ready", function () { // execution immédiate dès que l'instruction est lue

        /* onOffSwitchButtonStatusChange */
        // f_onOffSwitchButtonStatusChange ();



    });
    // end of $(document).on("ready", function() {






    /*************************** INITIALISATION DES FONCTIONS ******************************************************************************/





})(jQuery);








/*************************** A NETTOYER ******************************************************************************/


