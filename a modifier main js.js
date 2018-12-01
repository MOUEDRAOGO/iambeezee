function f_signUp() {
        // TO DO affichage des CGU au click sur CGU , dans une popup avec dimensions specifiques

        let signupCguLink = $(".rs-signup-cgu-link");
        let cguMainContainer = $(".rs-cgu-main-container");

        signupCguLink.click (function() {
            cguMainContainer.style.display = "block";
        });

        let signupValidateBtn = $('#rs-signup-validate-btn');

        signupValidateBtn.click( function() {

            console.log("kikou");
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