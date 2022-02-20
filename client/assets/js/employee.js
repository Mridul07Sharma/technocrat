let userData = JSON.parse(sessionStorage.getItem('technocratUserData'));
if (userData === null) {
    localStorage.removeItem('413F4428472B4B6250655367566B5970337336763979244226452948404D6351');
    sessionStorage.removeItem('technocratUserData');
    window.location.href = "./login.html";
}
let email = userData.email;
const socket = io("http://localhost:3000");
const myUL = document.querySelector("#myUL");
myUL.innerHTML = '';
const currentJobs = [];

const url = 'http://localhost:3000/getUserData';
const options = {
    method: 'post',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: email,
        userType: "employee"
    })
}
fetch(url, options)
    .then((response) => {
        response.json()
            .then((result) => {
                if (result == 'n') {
                    localStorage.removeItem('413F4428472B4B6250655367566B5970337336763979244226452948404D6351');
                    sessionStorage.removeItem('technocratUserData');
                    window.location.href = "./login.html";
                } else {
                    let x = result.userData;
                    delete x.password;
                    userData = x;
                    userData.userType = 'employee';
                    sessionStorage.setItem('technocratUserData', JSON.stringify(x));
                    changePage();
                };
            })
    })
    .catch((error) => {
        return false;
    });

const changePage = () => {
    document.querySelector("#empName").innerHTML = userData.name;
    socket.emit('loggedIn', userData);
}

socket.on('listedJobs', jobList => {
    jobList.forEach(job => {
        myUL.innerHTML += `
        <li id="gud" class="col-12 col-md-6">
            <a id="bad">
                <div class="row px-3">
                    <div class="col-6 grey mb-4" style="text-align: left">
                        ${job.name}
                    </div>
                    <div class="col-6 grey mb-4" style="text-align: right">
                        ${job.email}
                    </div>
                    <div class="col-12 grey mb-3">
                        <h3><b>Need an ${job.profession}</b></h3>
                    </div>
                    <div class="col-12 col-md-12 grey mb-3">
                        <p>${job.description}</p>
                    </div>
                    <hr>
                    <div class="col-12grey">
                        <i class="fa-solid fa-location-dot"></i>
                        ${job.address}
                    </div>
                    <div class="col-12grey">
                        <button onclick=(applyJob('${job._id}')) class="btn btn-primary profile-button" type="button">Apply</button>
                    </div>
                </div>
            </a>
        </li>
        <br>`;
    })
});

const applyJob = (x) => {
    const data = {
        profile: userData._id,
        job: x
    }
    socket.emit('applyJob', data);
}
socket.on('refresh', () => {
    window.location.reload();
});

socket.on('jobApplied', reply => {
    if (reply === 'y') window.location.reload();
})
socket.on('newJobPosted', job => {
    myUL.innerHTML += `
        <li id="gud" class="col-12 col-md-6">
            <a id="bad" href="#">
                <div class="row px-3">
                    <div class="col-12 grey mb-3">
                        <h3><b>Need an ${job.profession}</b></h3>
                    </div>
                    <div class="col-12 col-md-12 grey mb-3">
                        <p>${job.description}</p>
                    </div>
                    <hr>
                    <div class="col-12grey">
                        <i class="fa-solid fa-location-dot"></i>
                        ${job.address}
                    </div>
                    <div class="col-12grey">
                        <button class="btn btn-primary profile-button" type="button">Apply</button>
                    </div>
                </div>
            </a>
        </li>
        <br>`;
})

document.querySelector('#log_out_btn').onclick = () => {
    localStorage.removeItem('413F4428472B4B6250655367566B5970337336763979244226452948404D6351');
    sessionStorage.removeItem('technocratUserData');
    window.location.href = "./login.html";
};

document.querySelector('#hrsdbj').onclick = () => {
    window.location.replace(`./profile.html?id=${userData._id}&type=employee`);
}