const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const async = require('hbs/lib/async');
const conn = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

exports.register = (req, res) =>{
    console.log(req.body);

    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;

    const {name, email, password, passwordConfirm} = req.body;

    conn.query('SELECT email FROM users WHERE email = ?', [email], async (err, result) => {
        if(err) {
            console.log(err);
        }
        if(result.length > 0){
            return res.render('register', {
                message: 'That email is already in use'
            })
        }else if(password.length < 8){
            return res.render('register', {
                message: 'Password length must be eight'
            })
        }else if(password !== passwordConfirm){
            return res.render('register', {
                message: 'Password does not match'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        
        conn.query('INSERT INTO users SET ? ', {name: name, email: email, password: hashedPassword}, (err, result)=>{
            if(err){
                console.log(err);
            }else{
                console.log(result);
                return res.render('register', {
                    message: 'User registered'
                })
            }
        })
    })
}