import bcrypyjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const usuarios =[{
    user: "a",
    email: "a@a.com",
    password: "$2a$05$a6y8IC9v8xkokUHBqY2Bberyw38COtJulBu9Hmiz4M1Z.Q1gn4Dvu"
}]


async function login(req,res){
    console.log(req.body);
    const user = req.body.user;
    const password = req.body.password;
    if(!user || !password){
        return res.status(400).send({status:"Error",message:"Los campos están incompletos"})
    }
    const usuarioARevisar = usuarios.find(useuario =>useuario.user === user);
    if(!usuarioARevisar){
        return res.status(400).send({status:"Error",message:"Error durante login"})
    }
    const loginCorrecto = await bcrypyjs.compare(password,usuarioARevisar.password);
    if(!loginCorrecto){
        return res.status(400).send({status:"Error",message:"Error durante login"})
    }
    const token = jsonwebtoken.sign(
        {user:usuarioARevisar.user},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRATION});

        const cookieOption = {
            expires: new Date(Date.now() + process.env.JWT_KOOKIES_EXPIRES*24*60*1000),
            path:"/"
        }
        res.cookie("jwt",token,cookieOption)
        res.send({status:"ok",message:"Usuario loggeado",redirect:"/admin"})
}

async function register(req,res){
    console.log(req.body);
    const user = req.body.user;
    const password = req.body.password;
    const email = req.body.email;
    if(!user || !password || !email){
        return res.status(400).send({status:"Error",message:"Los campos están incompletos"})
    }
    const usuarioARevisar = usuarios.find(useuario =>useuario.user === user);
    if(usuarioARevisar){
        return res.status(400).send({status:"Error",message:"Este usuario ya existe"})
    }
    const salt = await bcrypyjs.genSalt(5);
    const hashPassword = await bcrypyjs.hash(password,salt);
    const nuevoUsuario = {
        user, email, password: hashPassword
    }
    usuarios.push(nuevoUsuario);
    console.log(usuarios);
    return res.status(201).send({status:"ok",message:`Usuario ${nuevoUsuario.user} agregado`, redirect:"/"})

}

export const methods = {
    login,
    register
}