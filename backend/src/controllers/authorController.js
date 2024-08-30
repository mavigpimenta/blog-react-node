const { Author } = require("../model/author");

class AuthorController {
    static async create(req, res) {
        const { name, email, birth } = req.body;

        if(!name || !birth || !email)
            return res.status(400).send({ message: "os campos não podem estarem vazios " });

        if(name.length < 3)
            return res.status(400).send({ message: "o nome não pode ser menor que 3 caracteres" });

        if(email.length < 3 || !email.includes('@'))
            return res.status(400).send({ message: "Insira um e-mail válido" });
        
        const author = {
            name,
            email,
            birth,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            removedAt: null,
        }

        console.log(author)

        try {
            await Author.create(author)
            return res.status(201).send({ message: "Autor cadastrado com sucesso" })
        } catch (error) {
            return res.status(500).send({ error: "Failed to get data" });
        }
    }

    static async getAuthor(_id){
        try {
            const author = await Author.findById(_id)
            return author
        } catch (error) {
            throw error;
        }
    }

    static async getAll(req, res) {
        try {
            const authors = await Author.find();
            return res.status(200).send({ data: authors });
        } catch (error) {
            return res.status(500).send({ error: error });
        }
    }
}

module.exports = AuthorController;