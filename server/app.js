const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const CONNECTION_URL = process.env.DB;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

const employeeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    phone: Number,
    gender: String,
    address: String,
    profession: String,
    qualification: String,
    experience: String,
    rating: Number,
    jobs: Number,
    password: String
});
const employerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    phone: Number,
    gender: String,
    address: String,
    rating: Number,
    jobs: Number,
    password: String
});
const Employee = mongoose.model('Employee', employeeSchema);
const Employer = mongoose.model('Employer', employerSchema);

const verifyLogin = (token, res) => {
    jwt.verify(token, process.env.JWT_KEY, function(err, loginData) {
        if (err) res.status(200).json({
            reply: 'n'
        });
        res.status(200).json({
            reply: 'y',
            userData: loginData
        });
    });
}

app.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        if (err) {
            return res.status(200).json({
                reply: 'n',
                msg: 'Internal Error !! Try again later'
            })
        } else {
            if (req.body.userType === "employee") {
                Employee.find({ email: req.body.email })
                    .exec()
                    .then(employeeindb => {
                        if (employeeindb.length < 1) {
                            let employee = new Employee({
                                _id: new mongoose.Types.ObjectId,
                                name: req.body.name,
                                email: req.body.email,
                                phone: req.body.phone,
                                gender: req.body.gender,
                                address: req.body.address,
                                profession: req.body.profession,
                                qualification: req.body.qualification,
                                experience: req.body.experience,
                                rating: 0,
                                jobs: 7,
                                password: hash
                            })
                            employee.save()
                                .then(result => {
                                    return res.status(200).json({
                                        reply: 'y'
                                    })
                                })
                                .catch(err => {
                                    res.status(200).json({
                                        error: 'Error !!'
                                    });
                                })
                        } else {
                            return res.status(200).json({
                                reply: 'n',
                                msg: 'Email already registered ! Try logging in !!'
                            })
                        }
                    })
                    .catch(err => {
                        return res.status(200).json({
                            reply: 'n',
                            msg: 'Internal Error !! Try again later'
                        })
                    })
            } else {
                Employer.find({ email: req.body.email })
                    .exec()
                    .then(employerindb => {
                        if (employerindb.length < 1) {
                            let employer = new Employer({
                                _id: new mongoose.Types.ObjectId,
                                name: req.body.name,
                                email: req.body.email,
                                phone: req.body.phone,
                                gender: req.body.gender,
                                address: req.body.address,
                                rating: 0,
                                jobs: 0,
                                password: hash
                            })
                            employer.save()
                                .then(result => {
                                    res.status(200).json(employer);
                                })
                                .catch(err => {
                                    res.status(200).json({ message: "Error" });
                                })
                        } else {
                            return res.status(200).json({
                                reply: 'n',
                                msg: 'Email already registered ! Try logging in !!'
                            })
                        }
                    })
                    .catch(err => {
                        return res.status(200).json({
                            reply: 'n',
                            msg: 'Internal Error !! Try again later'
                        })
                    })
            }
        }
    });
})

app.post('/login', (req, res) => {
    if (req.body.userType === "employee") {
        Employee.find({ email: req.body.email })
            .exec()
            .then(employee => {
                if (employee.length < 1) {
                    return res.status(200).json({
                        reply: 'n',
                        msg: 'Employee Not found !'
                    })
                } else {
                    bcrypt.compare(req.body.password, employee[0].password, (err, result) => {
                        if (err) {
                            return res.status(200).json({
                                reply: 'n',
                                msg: 'Internal Error !! Try again later'
                            })
                        } else {
                            if (result) {
                                let loginData = {
                                    name: employee[0].name,
                                    email: req.body.email,
                                    userType: req.body.userType,
                                };
                                const loginDataToken = jwt.sign(loginData, process.env.JWT_KEY);
                                res.status(200).json({
                                    reply: 'y',
                                    token: loginDataToken
                                });
                            } else {
                                return res.status(200).json({
                                    reply: 'n',
                                    msg: 'Wrong login credentials !'
                                })
                            }
                        }
                    });
                }
            })
            .catch(err => {
                return res.status(200).json({
                    reply: 'n',
                    msg: 'Internal Error !! Try again later'
                })
            })
    } else {
        Employer.find({ email: req.body.email })
            .exec()
            .then(employer => {
                if (employer.length < 1) {
                    return res.status(200).json({
                        reply: 'n',
                        msg: 'Employer not found !'
                    })
                } else {
                    bcrypt.compare(req.body.password, employer[0].password, (err, result) => {
                        if (err) {
                            return res.status(200).json({
                                reply: 'n',
                                msg: 'Internal Error !! Try again later'
                            })
                        } else {
                            if (result) {
                                let loginData = {
                                    email: req.body.email,
                                    userType: req.body.userType,
                                };
                                const loginDataToken = jwt.sign(loginData, process.env.JWT_KEY);
                                res.status(200).json({
                                    reply: 'y',
                                    token: loginDataToken
                                })
                            } else {
                                return res.status(200).json({
                                    reply: 'n',
                                    msg: 'Wrong Login credentials !'
                                })
                            }
                        }
                    });
                }
            })
            .catch(err => {
                return res.status(200).json({
                    reply: 'n',
                    msg: 'Internal Error !! Try again later'
                })
            })
    }
})

app.post('/verifyLogin', (req, res) => {
    verifyLogin(req.body.token, res);
});

app.post('/getUserData', (req, res) => {
    if (req.body.userType == "employee") {
        Employee.find({ email: req.body.email })
            .exec()
            .then(employee => {
                if (employee.length < 1) {
                    return res.status(200).json({
                        reply: 'n',
                        msg: 'Employee not found !'
                    })
                } else {
                    let x = employee[0];
                    x.password = null;
                    res.status(200).json({
                        userData: x
                    });
                }
            })
            .catch(err => {
                return res.status(200).json({
                    reply: 'n',
                    msg: 'Internal Error !! Try again later'
                })
            })
    } else {
        Employer.find({ email: req.body.email })
            .exec()
            .then(employer => {
                if (employer.length < 1) {
                    return res.status(200).json({
                        reply: 'n',
                        msg: 'Employer not found !'
                    })
                } else {
                    let x = employer[0];
                    x.password = null;
                    res.status(200).json({
                        userData: x
                    });
                }
            })
            .catch(err => {
                return res.status(200).json({
                    reply: 'n',
                    msg: 'Internal Error !! Try again later'
                })
            })
    }
})

app.get('/getTopEmployees', (req, res) => {
    Employee.find().sort({ jobs: -1 }).limit(10)
        .exec()
        .then(employees => {
            res.status(200).send(employees);
        })
        .catch(err => {
            return res.status(200).send('n');
        })
})
app.post('/getProfile', (req, res) => {
    if (req.body.type === 'employee') {
        Employee.find({ _id: req.body.id })
            .exec()
            .then(employee => {
                if (employee.length === 0) res.status(200).send('n');
                else res.status(200).send(employee);
            })
            .catch(err => {
                return res.status(200).send('n');
            })
    } else {
        Employer.find({ _id: req.body.id })
            .exec()
            .then(employer => {
                if (employer.length === 0) res.status(200).send('n');
                else res.status(200).send(employer);
            })
            .catch(err => {
                return res.status(200).send('n');
            })
    }
})


module.exports = app;