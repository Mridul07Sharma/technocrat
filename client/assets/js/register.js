const skill = document.querySelector("#skill2");
const inputs = document.querySelectorAll("input");
const profession = document.querySelector("#profession-input");
const gender = document.querySelector("#gender-input");
const experience = document.querySelector("#experience-input");
const registerBtn = document.querySelector("#register-button");
const pf = document.querySelector('.onlyforemployee');
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

skill.onchange = () => {
    if (skill.value == "employee") {
        pf.classList.remove("no-display");
        document.querySelector('#profession-input').setAttribute("required", "");
    } else {
        pf.classList.add("no-display");
        document.querySelector('#profession-input').removeAttribute("required");
    }
};
document.querySelector("form").onsubmit = (e) => {
    e.preventDefault();
    if (inputs[4].value === inputs[5].value) {
        if (inputs[4].value.length < 8) {
            errorDiv.innerHTML = "Password must be of at least 8 letters.";
            inputs[4].value = "";
            inputs[5].value = "";
        } else if (inputs[2].value.length !== 10) {
            errorDiv.innerHTML = "Please enter correct phone number without country code.";
            inputs[2].value = "";
            inputs[4].value = "";
            inputs[5].value = "";
        } else {
            errorDiv.innerHTML = "";
            const userData = {
                userType: skill.value,
                name: inputs[0].value,
                email: inputs[1].value,
                phone: Number(inputs[2].value),
                gender: gender.value,
                address: inputs[3].value,
                password: inputs[4].value
            }
            if (skill.value === "employee") {
                userData.profession = profession.value;
            }
            const url = 'http://localhost:3000/signup';
            const options = {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            }
            fetch(url, options)
                .then((response) => {
                    response.json()
                        .then((result) => {
                            if (result.reply === 'n') errorDiv.innerHTML = result.msg;
                            else window.location.href = "./login.html";
                        })
                })
                .catch((error) => {
                    errorDiv.innerHTML = "Error ! Try Again Later"
                });
        }
    } else {
        errorDiv.innerHTML = "Password do not match ! Please enter again";
        inputs[4].value = "";
        inputs[5].value = "";
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