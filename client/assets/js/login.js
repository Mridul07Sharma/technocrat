const form = document.querySelector("form");
const inputs = document.querySelectorAll("form input");
const skill = document.querySelector("#skill2");
const errorDiv = document.querySelector("#loginerror");

const verifyToken = (token) => {
    const url = 'http://localhost:3000/verifyLogin';
    const options = {
        method: 'post',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: token
        })
    }
    fetch(url, options)
        .then((response) => {
            response.json()
                .then((result) => {
                    if (result.reply === 'y') {
                        sessionStorage.setItem('technocratUserData', JSON.stringify(result.userData));
                        if (result.userData.userType === "employee") {
                            window.location.href = "./employee.html";
                        } else {
                            window.location.href = "./employer.html";
                        }
                    }
                })
        })
        .catch((error) => {
            return false;
        });
}

const token = localStorage.getItem('413F4428472B4B6250655367566B5970337336763979244226452948404D6351');
verifyToken(token);

form.onsubmit = (e) => {
    e.preventDefault();
    const loginData = {
        email: inputs[0].value,
        password: inputs[1].value,
        userType: skill.value
    }
    const url = 'http://localhost:3000/login';
    const options = {
        method: 'post',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    }
    fetch(url, options)
        .then((response) => {
            response.json()
                .then((result) => {
                    if (result.reply === 'n') errorDiv.innerHTML = result.msg;
                    else {
                        errorDiv.innerHTML = '';
                        localStorage.setItem('413F4428472B4B6250655367566B5970337336763979244226452948404D6351', result.token);
                        verifyToken(result.token);
                    }
                })
        })
        .catch((error) => {
            errorDiv.innerHTML = "Error ! Try Again Later"
        });
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