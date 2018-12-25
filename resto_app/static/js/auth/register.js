function validateUsername() {
    var username_form = document.forms["register"]["username"];
    var username = username_form.value;
    var xhttp;
    if (username === "") {
        username_form.classList.remove('valid')
        username_form.classList.add('invalid');
        document.getElementById("invalidUsername").innerHTML = "Please fill in a username.";
        document.getElementById("invalidUsername").style.display = 'block';
        return false;
    } else {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.responseText === "true"){
                username_form.classList.remove('invalid')
                username_form.classList.add('valid');
                document.getElementById("invalidUsername").style.display = 'none';
                return true;
            } else {
                username_form.classList.remove('valid');
                username_form.classList.add('invalid');
                document.getElementById("invalidUsername").innerHTML = "Username is already taken. Please pick another.";
                document.getElementById("invalidUsername").style.display = 'block';
                return false;
            }
        }
        xhttp.open("GET", window.location.origin+"/auth/validate-username/"+username);
        xhttp.send()
    }
}

function validateName() {
    var name_form = document.forms["register"]["name"];
    var name = name_form.value;
    if (name !== ""){
        name_form.classList.remove('invalid');
        name_form.classList.add('valid');
        document.getElementById("invalidName").style.display = 'none';
        return true;
    } else {
        document.getElementById("invalidName").innerHTML = "Please enter your name";
        document.getElementById("invalidName").style.display = 'block';
        name_form.classList.remove('valid');
        name_form.classList.add('invalid');
        return false;
    }
}

function validateEmail() {
    var email_form = document.forms["register"]["email"];
    var email = email_form.value;
    if (email!=="" && isEmail(email)){
        email_form.classList.remove('invalid');
        email_form.classList.add('valid');
        document.getElementById("invalidEmail").style.display = 'none';
        return true;
    } else {
        document.getElementById("invalidEmail").innerHTML = "Please enter a proper email. E.g. <b>example@email.com</b>";
        document.getElementById("invalidEmail").style.display = 'block';
        email_form.classList.remove('valid');
        email_form.classList.add('invalid');
        return false;
    }
}

function validatePassword() {
    var password_form = document.forms["register"]["password"];
    var password = password_form.value.toString();
    if (password.length < 6){   
        password_form.classList.remove('valid');
        password_form.classList.add('invalid');
        document.getElementById("invalidPassword").innerHTML = "Password needs to be at least 6 characters long";
        document.getElementById("invalidPassword").style.display = 'block';
        return false;
    } else {
        document.getElementById("invalidPassword").style.display = 'none';
        password_form.classList.remove('invalid');
        password_form.classList.add('valid');
        return true;
    }
}

function validateAddress() {
    var address_form = document.forms["register"]["address"];
    var address = address_form.value.toString();
    if (address == ""){   
        address_form.classList.remove('valid');
        address_form.classList.add('invalid');
        document.getElementById("invalidAddress").innerHTML = "Please enter your address";
        document.getElementById("invalidAddress").style.display = 'block';
        return false;
    } else {
        document.getElementById("invalidAddress").style.display = 'none';
        address_form.classList.remove('invalid');
        address_form.classList.add('valid');
        return true;
    }
}

function validatePhone() {
    var phone_form = document.forms["register"]["phone"];
    var phone = phone_form.value.toString();
    if (phone.length < 9 || phone.length > 12){   
        phone_form.classList.remove('valid');
        phone_form.classList.add('invalid');
        document.getElementById("invalidPhone").innerHTML = "Please enter 9 to 12 digits of phone number";
        document.getElementById("invalidPhone").style.display = 'block';
        return false;
    } else {
        document.getElementById("invalidPhone").style.display = 'none';
        phone_form.classList.remove('invalid');
        phone_form.classList.add('valid');
        return true;
    }
}

function isEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateForm() {
    var name = validateName();
    var uname = validateUsername();
    var passwd = validatePassword();
    var email = validateEmail();
    var addr = validateAddress();
    var phone = validatePhone();
    return name && uname && passwd && email && addr && phone;
}