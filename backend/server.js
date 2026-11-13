
import express from 'express'
import cors from 'cors'
import { db } from './database.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

if (!process.env.JWT_SECRET) {
    console.error('Defina JWT_SECRET no arquivo backend/.env antes de iniciar o servidor.')
    process.exit(1)
}

const app = express()

app.use(cors())
app.use(express.json())

const TIPOS_COM_CHAT = ['usuaria', 'voluntaria', 'psicologa']

function gerarToken(usuario) {
    return jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    )
}

async function autenticarConta(req, res, next) {
    try {
        const partes = (req.headers.authorization || '').trim().split(/\s+/)
        const [esquema, token, ...extras] = partes

        if (esquema !== 'Bearer' || !token || extras.length > 0) {
            return res.status(401).json({
                erro: 'Faça login para continuar.'
            })
        }

        let dados
        try {
            dados = jwt.verify(token, process.env.JWT_SECRET)
        } catch {
            return res.status(401).json({
                erro: 'Sessão expirada. Faça login novamente.'
            })
        }

        if (
            !dados ||
            typeof dados !== 'object' ||
            !Number.isSafeInteger(dados.id) ||
            dados.id < 1
        ) {
            return res.status(401).json({
                erro: 'Sessão inválida. Faça login novamente.'
            })
        }

        const [linhas] = await db.query(
            'SELECT id, nome, email, tipo, accountType FROM usuarios WHERE id = ?',
            [dados.id]
        )

        if (linhas.length === 0) {
            return res.status(401).json({
                erro: 'Conta não encontrada. Faça login novamente.'
            })
        }

        req.usuario = linhas[0]
        next()
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao validar o acesso.' })
    }
}

function autorizarChat(req, res, next) {
    if (
        req.usuario.tipo === 'admin' ||
        !TIPOS_COM_CHAT.includes(req.usuario.accountType)
    ) {
        return res.status(403).json({
            erro: 'Este tipo de conta não tem acesso ao chat.'
        })
    }

    next()
}

async function obterConversaDaConta(usuarioId) {
    const [linhas] = await db.query(
        `SELECT id FROM conversas
        WHERE usuaria_id = ? AND voluntaria_id IS NULL
        ORDER BY id
        LIMIT 1`,
        [usuarioId]
    )

    if (linhas.length > 0) {
        return linhas[0].id
    }

    const [resultado] = await db.query(
        'INSERT INTO conversas (usuaria_id) VALUES (?)',
        [usuarioId]
    )

    return resultado.insertId
}

function lerTextoDaMensagem(body) {
    const texto = typeof body?.mensagem === 'string' ? body.mensagem.trim() : ''

    if (!texto) {
        return { erro: 'Digite uma mensagem.' }
    }

    if (texto.length > 2000) {
        return { erro: 'A mensagem pode ter no máximo 2000 caracteres.' }
    }

    return { texto }
}

const AREAS_VOLUNTARIA = ['Acolhimento', 'Divulgação', 'Eventos', 'Profissional']

app.get('/', (req, res) => {
    res.send('Backend ELLA funcionando!')
})

app.get('/teste-banco', async (req, res) => {
    try {
        const [resultado] = await db.query(
            'SELECT 1 AS conectado'
        )
        res.json(resultado[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao conectar ao banco.' })
    }
})

// Cadastro público: cria somente contas de usuária
app.post('/cadastro', async (req, res) => {
    try {
        const { nome, email, password } = req.body

        if (!nome || !email || !password) {
            return res.status(400).json({
                erro: 'Preencha nome, e-mail e senha.'
            })
        }

        const emailFormatado = email.trim().toLowerCase()

        const [existe] = await db.query(
            'SELECT id FROM usuarios WHERE email = ?',
            [emailFormatado]
        )

        if (existe.length > 0) {
            return res.status(409).json({
                erro: 'Este e-mail já está cadastrado.'
            })
        }

        const senhaHash = await bcrypt.hash(password, 10)

        const [resultado] = await db.query(
            `INSERT INTO usuarios
            (nome, email, senha_hash, tipo)
            VALUES (?, ?, ?, ?)`,
            [nome, emailFormatado, senhaHash, 'usuaria']
        )

        res.status(201).json({
            id: resultado.insertId,
            nome,
            email: emailFormatado,
            tipo: 'usuaria',
            accountType: 'usuaria',
            token: gerarToken({ id: resultado.insertId })
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            erro: 'Erro ao cadastrar usuário.'
        })
    }
})

// Login: reconhece os quatro tipos de conta
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                erro: 'Informe e-mail e senha.'
            })
        }

        const [linhas] = await db.query(
            `SELECT id, nome, email, senha_hash, tipo, accountType,
                    telefone, cidade, areas_atuacao, crm, criado_em
            FROM usuarios
            WHERE email = ?`,
            [email.trim().toLowerCase()]
        )

        const usuario = linhas[0]

        const senhaCorreta = usuario
            ? await bcrypt.compare(password, usuario.senha_hash)
            : false

        if (!senhaCorreta) {
            return res.status(401).json({
                erro: 'E-mail ou senha incorretos.'
            })
        }

        res.json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo,
            accountType: usuario.accountType === 'usuaria' && usuario.tipo !== 'usuaria'
                ? usuario.tipo
                : usuario.accountType || usuario.tipo,
            telefone: usuario.telefone,
            cidade: usuario.cidade,
            areas_atuacao: usuario.areas_atuacao,
            crm: usuario.crm,
            criado_em: usuario.criado_em,
            token: gerarToken(usuario)
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            erro: 'Erro ao fazer login.'
        })
    }
})

app.post('/voluntaria/inscricao', autenticarConta, async (req, res) => {
    try {
        const { email, telefone, cidade, areas } = req.body

        if (
            typeof email !== 'string' ||
            email.trim().toLowerCase() !== String(req.usuario.email).toLowerCase()
        ) {
            return res.status(403).json({
                erro: 'O e-mail informado não corresponde à conta em que você está logada.'
            })
        }

        if (
            !['usuaria', 'voluntaria', 'psicologa'].includes(req.usuario.tipo) ||
            !['usuaria', 'voluntaria', 'psicologa'].includes(req.usuario.accountType)
        ) {
            return res.status(403).json({
                erro: 'Esta conta não pode se inscrever como voluntária.'
            })
        }

        const cidadeFormatada = typeof cidade === 'string' ? cidade.trim() : ''
        const telefoneFormatado = typeof telefone === 'string' ? telefone.trim() : ''

        if (!cidadeFormatada) {
            return res.status(400).json({ erro: 'Informe a sua cidade.' })
        }

        if (cidadeFormatada.length > 100 || telefoneFormatado.length > 20) {
            return res.status(400).json({
                erro: 'Telefone ou cidade com tamanho inválido.'
            })
        }

        if (
            !Array.isArray(areas) ||
            areas.length === 0 ||
            !areas.every((area) => AREAS_VOLUNTARIA.includes(area))
        ) {
            return res.status(400).json({
                erro: 'Escolha pelo menos uma forma de ajudar.'
            })
        }

        const areasUnicas = AREAS_VOLUNTARIA.filter((area) => areas.includes(area))
        const accountType = areasUnicas.includes('Profissional')
            ? 'psicologa'
            : 'voluntaria'

        await db.query(
            `UPDATE usuarios
            SET tipo = ?, accountType = ?,
                telefone = ?, cidade = ?, areas_atuacao = ?
            WHERE id = ?`,
            [
                accountType,
                accountType,
                telefoneFormatado || null,
                cidadeFormatada,
                areasUnicas.join(', '),
                req.usuario.id
            ]
        )

        res.json({
            id: req.usuario.id,
            nome: req.usuario.nome,
            email: req.usuario.email,
            tipo: accountType,
            accountType
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao registrar a inscrição.' })
    }
})

app.get('/chat/mensagens', autenticarConta, autorizarChat, async (req, res) => {
    try {
        const conversaId = await obterConversaDaConta(req.usuario.id)

        const [mensagens] = await db.query(
            `SELECT id, mensagem, enviada_em
            FROM mensagens
            WHERE conversa_id = ? AND remetente_id = ?
            ORDER BY enviada_em, id`,
            [conversaId, req.usuario.id]
        )

        res.json(mensagens)
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao carregar as mensagens.' })
    }
})

app.post('/chat/mensagens', autenticarConta, autorizarChat, async (req, res) => {
    try {
        const { texto, erro } = lerTextoDaMensagem(req.body)

        if (erro) {
            return res.status(400).json({ erro })
        }

        const conversaId = await obterConversaDaConta(req.usuario.id)
        const [resultado] = await db.query(
            `INSERT INTO mensagens (conversa_id, remetente_id, mensagem)
            VALUES (?, ?, ?)`,
            [conversaId, req.usuario.id, texto]
        )

        const [linhas] = await db.query(
            'SELECT id, mensagem, enviada_em FROM mensagens WHERE id = ?',
            [resultado.insertId]
        )

        res.status(201).json(linhas[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao salvar a mensagem.' })
    }
})

app.put('/chat/mensagens/:id', autenticarConta, autorizarChat, async (req, res) => {
    try {
        const mensagemId = Number(req.params.id)

        if (!Number.isSafeInteger(mensagemId) || mensagemId < 1) {
            return res.status(400).json({ erro: 'Mensagem inválida.' })
        }

        const { texto, erro } = lerTextoDaMensagem(req.body)

        if (erro) {
            return res.status(400).json({ erro })
        }

        const conversaId = await obterConversaDaConta(req.usuario.id)
        const [existe] = await db.query(
            `SELECT id FROM mensagens
            WHERE id = ? AND conversa_id = ? AND remetente_id = ?`,
            [mensagemId, conversaId, req.usuario.id]
        )

        if (existe.length === 0) {
            return res.status(404).json({ erro: 'Mensagem não encontrada.' })
        }

        await db.query(
            'UPDATE mensagens SET mensagem = ? WHERE id = ?',
            [texto, mensagemId]
        )

        const [linhas] = await db.query(
            'SELECT id, mensagem, enviada_em FROM mensagens WHERE id = ?',
            [mensagemId]
        )

        res.json(linhas[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao editar a mensagem.' })
    }
})

app.delete('/chat/mensagens/:id', autenticarConta, autorizarChat, async (req, res) => {
    try {
        const mensagemId = Number(req.params.id)

        if (!Number.isSafeInteger(mensagemId) || mensagemId < 1) {
            return res.status(400).json({ erro: 'Mensagem inválida.' })
        }

        const conversaId = await obterConversaDaConta(req.usuario.id)
        const [existe] = await db.query(
            `SELECT id FROM mensagens
            WHERE id = ? AND conversa_id = ? AND remetente_id = ?`,
            [mensagemId, conversaId, req.usuario.id]
        )

        if (existe.length === 0) {
            return res.status(404).json({ erro: 'Mensagem não encontrada.' })
        }

        await db.query('DELETE FROM mensagens WHERE id = ?', [mensagemId])

        res.json({ id: mensagemId })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao excluir a mensagem.' })
    }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor ELLA rodando na porta ${PORT}`)
})
