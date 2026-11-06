import express from 'express'
import cors from 'cors'
import { db } from './database.js'
import bcrypt from 'bcryptjs'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Backend ELLA funcionando!')
})

app.get('/teste-banco', async (req, res) => {
    try {
        const [resultado] = await db.query('SELECT 1 AS conectado')
        res.json(resultado[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({
            erro: error.message
        })
    }
})

app.post('/cadastro', async (req, res) => {
    try {
        const { nome, email, password } = req.body

        if (!nome || !email || !password) {
            return res.status(400).json({ erro: 'Preencha nome, e-mail e senha.' })
        }

        const [existe] = await db.query(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        )
        if (existe.length > 0) {
            return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' })
        }

        const senhaHash = await bcrypt.hash(password, 10)

        const [resultado] = await db.query(
            'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
            [nome, email, senhaHash, 'usuaria']
        )

        res.status(201).json({ id: resultado.insertId, nome, email, tipo: 'usuaria' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao cadastrar usuário.' })
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ erro: 'Informe e-mail e senha.' })
        }

        const [linhas] = await db.query(
            'SELECT id, nome, email, senha, tipo FROM usuarios WHERE email = ?',
            [email]
        )
        const usuario = linhas[0]

        const senhaCorreta = usuario
            ? await bcrypt.compare(password, usuario.senha)
            : false

        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos.' })
        }

            res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao fazer login.' })
    }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor ELLA rodando na porta ${PORT}`)
})