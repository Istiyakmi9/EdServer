/// <reference path="jquery-3.3.1.min.js" />


function MaskMobile(number) {
    if (number != '') {

    }
}

function validateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (inputText.match(mailformat) != null) {
        return true;
    }
    else {
        return false;
    }
}

function validateMobile(inputtxt) {
    var phoneno = /^\d{10}$/;
    if (inputtxt.match(phoneno) != null) {
        return true;
    }
    else {
        return false;
    }
}


function IsNumeric(key) {
    if (key == 46 || key == 8) {
        // let it happen, don't do anything
        return true;
    }
    else {
        // Ensure that it is a number and stop the keypress
        if (key < 48 || key > 57) {
            return false;
        }

        return true;
    }
}