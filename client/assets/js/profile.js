let userData = JSON.parse(sessionStorage.getItem('technocratUserData'));
if (userData === null) {
    localStorage.removeItem('413F4428472B4B6250655367566B5970337336763979244226452948404D6351');
    sessionStorage.removeItem('technocratUserData');
    window.location.href = "./login.html";
}
let email = userData.email;
if (userData.userType === 'employee') document.querySelector('.findjobbutton a').innerHTML = 'Find Job';
else document.querySelector('.findjobbutton a').innerHTML = 'Find Talent';

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
                    document.querySelector('#empName').innerHTML = result.name;
                    document.querySelectorAll('.xxName').forEach(el => el.innerHTML = result.name);
                    document.querySelectorAll('.xxAddress').forEach(el => el.innerHTML = result.address);
                    document.querySelector('#xxNum').innerHTML = result.phone;
                    document.querySelector('#xxMail').innerHTML = result.email;
                    document.querySelector('#xxRate').innerHTML = result.rating;
                }
            })
    })
    .catch((error) => {
        return false;
    });