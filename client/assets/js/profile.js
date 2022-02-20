let userData = JSON.parse(sessionStorage.getItem('technocratUserData'));
let email;
if (userData !== null) {
    email = userData.email;
    if (userData.userType === 'employee') document.querySelector('.findjobbutton a').innerHTML = 'Find Job';
    else document.querySelector('.findjobbutton a').innerHTML = 'Find Talent';
}

document.querySelector('.findjobbutton').onclick = () => {
    window.location.href = './login.html';
}

let params = (new URL(document.location)).searchParams;
let _id = params.get('id');
let type = params.get('type');

if (type === 'employer') {
    document.querySelector('#xxProfession').style.display = 'none';
}
const url = 'http://localhost:3000/getProfile';
const options = {
    method: 'post',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: _id,
        type: type
    })
}
fetch(url, options)
    .then((response) => {
        response.json()
            .then((result) => {
                if (result == 'n') {
                    window.location.href = "./login.html";
                } else {
                    result = result[0];
                    console.log(result);
                    document.querySelector('#empName').innerHTML = result.name;
                    document.querySelectorAll('.xxName').forEach(el => el.innerHTML = result.name);
                    document.querySelectorAll('.xxAddress').forEach(el => el.innerHTML = result.address);
                    document.querySelector('#xxNum').innerHTML = result.phone;
                    document.querySelector('#xxMail').innerHTML = result.email;
                    document.querySelector('#xxProfession').innerHTML = result.profession;

                }
            })
    })
    .catch((error) => {
        return false;
    });

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