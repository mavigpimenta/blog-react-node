const { Author } = require('../model/author');
const newLocal = '../model/user';
const User  = require(newLocal);
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require("bcryptjs");

class AuthControler {
    static async register(req, res){
        const { name, birth, email, password, confirmPassword } = req.body;
        if(!name)
            return res.status(400).json({ message: "O nome é obrigatório" });

        if(!email)
            return res.status(400).json({ message: "O e-mail é obrigatório" });

        if(!password)
            return res.status(400).json({ message: "A senha é obrigatória" });
    
        if(password != confirmPassword)
            return res.status(400).json({ message: "As senhas não conferem" });
    
        const userExist = await User.findOne({ email: email });
    
        if(userExist)
            return res.status(422).json({ message: "insira outro e-mail" });
        
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const author = new Author({
            name,
            email,
            birth,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            removedAt: null,
        })
        
        const user = new User({
            login: email,
            author,
            email,
            password: passwordHash,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            removedAt: null,
        });

        try {
            await User.create(user);
            res.status(201).send({ message: "Usuário cadastrado com sucesso" });
        } catch (error) {
            return res.status(500).send({ message: "Something failed", data: error.message })
        }   
    }

    static async login(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(!user)
            return res.status(400).send({ message: "Invalid Email or password" });
        
        if(!bcrypt.compare(password, user.password)) {
            return res.status(400).send({ message: "Invalid Email or password" });
        }

        const secret = process.env.SECRET;
        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
            {
                expiresIn: '2d'
            }
        );

        return res.status(200).send({token: token})
    }
}

module.exports = AuthControler;