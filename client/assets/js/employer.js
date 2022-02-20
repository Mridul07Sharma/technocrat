let userData = JSON.parse(sessionStorage.getItem('technocratUserData'));
if (userData === null) {
    localStorage.removeItem('413F4428472B4B6250655367566B5970337336763979244226452948404D6351');
    sessionStorage.removeItem('technocratUserData');
    window.location.href = "./login.html";
}
let email = userData.email;
let employeeData;
const myUL = document.querySelector(".cnhgs #myUL");
const myJobsUL = document.querySelector(".bsfjdbf #myUL");
const jobForm = document.querySelector('form');
myUL.innerHTML = '';
myJobsUL.innerHTML = '';
const socket = io("http://localhost:3000");

const url = 'http://localhost:3000/getUserData';
const options = {
    method: 'post',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: email,
        userType: "employer"
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
                    userData.userType = 'employer';
                    sessionStorage.setItem('technocratUserData', JSON.stringify(x));
                    changePage();
                }
            })
    })
    .catch((error) => {
        return false;
    });
const addEmployees = (emps) => {
    emps.forEach(emp => {
        myUL.innerHTML +=
            `<li id="gud" class="col-12 col-md-6 mb-3">
            <a id="bad">
                <div class="row px-3">
                    <div class="col-12 grey">
                        <b> Name : </b> ${emp.name}
                    </div>
                    <div class="col-12 grey">
                        <b> Proffesion : </b> ${emp.profession}
                    </div>
                    <div class="col-12 grey">
                        <b> Jobs : </b> ${emp.jobs}
                    </div>
                    <div class="col-12 grey mb-3">
                        <b> Address : </b> ${emp.address}
                    </div>
                    <div class="col-12 grey">
                        <button onclick=(viewProfile('${emp._id}')) class="btn btn-primary profile-button" type="button">view
                            profile</button>
                    </div>
                </div>
            </a>
        </li>
        <br>`;
    })
}
const viewProfile = (id) => {
    window.location.replace(`./profile.html?id=${id}&type=employee`);
}
const changePage = () => {
    document.querySelector("#empName").innerHTML = userData.name;
    const url = 'http://localhost:3000/getTopEmployees';
    const options = {
        method: 'get',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(url, options)
        .then((response) => {
            response.json()
                .then((result) => {
                    if (result === 'n') {
                        return false;
                    } else {
                        employeeData = result;
                        addEmployees(result);
                    }
                })
        })
        .catch((error) => {
            return false;
        });
}

jobForm.onsubmit = (e) => {
    e.preventDefault();
    let myJob = {
        name: userData.name,
        email: userData.email,
        profession: document.querySelector('select').value,
        description: document.querySelector('#jobdescta').value,
        address: document.querySelector('#jobaddrta').value
    }
    socket.emit('newJob', myJob);
}

const deleteJob = (id) => {
    socket.emit('deleteJob', id);
}

socket.on('refresh', () => {
    window.location.reload();
});

const printJob = (job) => {
    myJobsUL.innerHTML += `
            <li id="gud" class=" col-12 col-md-6 mb-5" data-id=${job._id}>
                <a id="bad" href="#">
                    <div class="row px-3">
                        <div class="col-6 grey mb-4" style="text-align: left">
                            ${job.name}
                        </div>
                        <div class="col-6 grey mb-4" style="text-align: right">
                            ${job.email}
                        </div>
                        <div class="col-12 grey">
                            <h3>Need an ${job.profession}</h3>
                            &#8377; 300 / hr
                        </div>
                        <div class="col-12 grey my-4">
                            ${job.description}
                        </div>
                        <hr>
                        <div class="col-12 grey mb-2">
                            <i class="fa-solid fa-location-dot"></i> ${job.address}
                        </div>
                        <div class="col-12 grey">
                            <button onClick=(deleteJob('${job._id}')) class="btn btn-danger" style="background-color: red;" type="button">Delete Job</button>
                        </div>
                    </div>
                </a>
            </li>
            <br>`;
}

socket.emit('loggedIn', userData);
socket.on('jobPosted', jobDetails => {
    if (jobDetails.status === 'success') {
        document.querySelector('#jobPostMsg').innerHTML = 'Job Posted Successfully';
        document.querySelector('#jobPostMsg').style.color = 'green';
        document.querySelector('#jobdescta').value = '';
        document.querySelector('#jobaddrta').value = '';
        printJob(jobDetails.job);
    } else {
        document.querySelector('#jobPostMsg').innerHTML = 'There was error in posting job. Try again later !';
        document.querySelector('#jobPostMsg').style.color = 'red';
    }
});

socket.emit('getMyJobs', userData.email);
socket.on('myJobs', jobs => {
    jobs.forEach(job => printJob(job));
})

document.querySelector('#log_out_btn').onclick = () => {
    localStorage.removeItem('413F4428472B4B6250655367566B5970337336763979244226452948404D6351');
    sessionStorage.removeItem('technocratUserData');
    window.location.href = "./login.html";
};

document.querySelector('#hrsdbj').onclick = () => {
    window.location.replace(`./profile.html?id=${userData._id}&type=employer`);
}