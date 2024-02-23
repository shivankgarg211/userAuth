import express, { response } from 'express';
import mysql from 'mysql'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser';
const salt = 10;




const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
})

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "you are not authenticated" });
    } else[
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "token is not okey" });
            } else {
                req.name = decoded.name;
                next();
            }
        })
    ]


}

app.get('/', verifyUser, (req, res) => {
    return res.json({ Status: "Success", name: req.name });
})

app.post('/register', (req, res) => {
    const sql = "Insert into login (`name`,`email`, `password`) VALUES(?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json({ Error: "Error for hashing password" });
        const values = [
            req.body.name,
            req.body.email,
            hash
        ]
        db.query(sql, [values], (err, result) => {
            if (err) return res.json({ Error: "inserting data Error in server" });
            return res.json({ Status: "Success" });
        })
    })

})

app.post('/login', (req, res) => {
    // console.log(req.body)
    const sql = 'select * from login where email = ?';
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: "Login error in server" });
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: "password compare error" });
                if (response) {
                    const name = data[0].name;
                    const token = jwt.sign({ name }, "jwt-secret-key", { expiresIn: '1d' });
                    res.cookie('token', token);

                    return res.json({ status: "Succes" });
                } else {
                    return res.json({ Error: "Pasword not matched" });
                }
            })

        } else {
            return res.json({ Error: "No email existed" })
        }
    })
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.join({ Status: "Success" });
})

app.listen(4000, () => {
    console.log("Connection established....")
});