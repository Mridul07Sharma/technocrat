const form1 = document.querySelectorAll('form')[0];
const form2 = document.querySelectorAll('form')[1];
form2.style.display = 'none';
let email = null;
let type = null;

form1.onsubmit = (e) => {
    e.preventDefault();

    let user = {
        userType: form1.children[0].children[1].value,
        email: form1.children[1].children[1].value
    }
    email = user.email;
    type = user.userType;
    const url = 'http://localhost:3000/resetPasswordCode';
    const options = {
        method: 'post',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }
    fetch(url, options)
        .then((response) => {
            response.json()
                .then((result) => {
                    if (result.reply === 'n') document.querySelector('#loginerror').innerHTML = 'User Not Found !';
                    else {
                        document.querySelector('#loginerror').innerHTML = '';
                        form1.style.display = 'none';
                        form2.style.display = 'block';
                    }
                })
        })
        .catch((error) => {
            return false;
        });

}

form2.onsubmit = (e) => {
    e.preventDefault();

    if (form2.children[1].children[1].value !== form2.children[2].children[1].value)
        document.querySelector('#loginerror').innerHTML = 'Passwords do not match !';
    else {
        const url = 'http://localhost:3000/verifyOTP';
        const options = {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: type,
                email: email,
                OTP: Number(form2.children[0].children[1].value),
                password: form2.children[1].children[1].value
            })
        }
        fetch(url, options)
            .then((response) => {
                response.json()
                    .then((result) => {
                        if (result.reply === 'n') document.querySelector('#loginerror').innerHTML = 'Wrong PIN';
                        else {
                            window.location.href = "./login.html";
                        }
                    })
            })
            .catch((error) => {
                return false;
            });
    }
}

document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function(e) {
    if (event.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}