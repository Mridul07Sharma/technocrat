const http = require("http");
const app = require("./app.js");
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const mongoose = require("mongoose");
require("dotenv").config();
const CONNECTION_URL = process.env.DB;
const io = require("socket.io")(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
const nodemailer = require('nodemailer');

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.mail,
        pass: process.env.password
    }
});

const jobSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    profession: String,
    description: String,
    address: String
});
const Job = mongoose.model('Job', jobSchema);

io.on('connection', (socket) => {
    let user;
    socket.on("loggedIn", (userData) => {
        user = userData;
        userType = userData.userType;
        if (userType === 'employee') {
            Job.find({ "profession": userData.profession }, (err, data) => {
                socket.emit('listedJobs', (data));
            })
        }
    })
    socket.on('getMyJobs', email => {
        Job.find({ email: email })
            .exec()
            .then(jobs => {
                socket.emit('myJobs', jobs);
            })
            .catch(err => {
                return res.status(200).send('n');
            })
    })
    socket.on('newJob', (jobDetails) => {
        let job = new Job({
            _id: new mongoose.Types.ObjectId,
            name: jobDetails.name,
            email: jobDetails.email,
            profession: jobDetails.profession,
            description: jobDetails.description,
            address: jobDetails.address
        });
        job.save()
            .then(result => {
                socket.emit('jobPosted', {
                    status: "success",
                    job: job
                });
                io.emit('newJobPosted', result);
            })
            .catch(err => {
                socket.emit('jobPosted', ('error'));
            })
    });
    socket.on('deleteJob', (jobId) => {
        Job.findOneAndDelete({ _id: jobId }, (err, data) => {
            if (err) console.log('error');
            else {
                io.emit('refresh');
            }
        })
    })
    socket.on('applyJob', (data) => {
        Job.find({ _id: data.job })
            .exec()
            .then(job => {
                let mailDetails = {
                    from: process.env.mail,
                    to: job[0].email,
                    subject: `JOB UPDATE : ${job[0].description}`,
                    text: `The following employee has applied for your job. Visit his profile by follwoing link :
                    file:///E:/technocrat/client/profile.html?id=${job[0].job}&type=employee
                    `
                };
                mailTransporter.sendMail(mailDetails, function(err, data) {
                    if (err) {
                        socket.emit('jobApplied', 'n');
                    } else {
                        socket.emit('jobApplied', 'y');
                    }
                });
            })
    })
});

mongoose
    .connect(CONNECTION_URL, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Listening at port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error.message);
    });