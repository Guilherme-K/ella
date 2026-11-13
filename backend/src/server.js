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

// Contas que têm chat. O administrador usa o painel administrativo.
const TIPOS_COM_CHAT = ['usuaria', 'voluntaria', 'psicologa']

function gerarToken(usuario) {
    return jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    )
}

// Identifica a conta pelo token (nunca por um id enviado pelo frontend)
async function autenticarChat(req, res, next) {
    try {
        const [esquema, token] = (req.headers.authorization || '').split(' ')

        if (esquema !== 'Bearer' || !token) {
            return res.status(401).json({
                erro: 'Faça login para acessar o chat.'
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

        const [linhas] = await db.query(
            'SELECT id, tipo FROM usuarios WHERE id = ?',
            [dados.id]
        )

        const usuario = linhas[0]

        if (!usuario) {
            return res.status(401).json({
                erro: 'Conta não encontrada. Faça login novamente.'
            })
        }

        if (!TIPOS_COM_CHAT.includes(usuario.tipo)) {
            return res.status(403).json({
                erro: 'Este tipo de conta não tem acesso ao chat.'
            })
        }

        req.usuario = usuario
        next()
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao validar o acesso.' })
    }
}

// Identifica a conta autenticada pelo token (sem restringir o tipo de conta)
async function autenticarConta(req, res, next) {
    try {
        const [esquema, token] = (req.headers.authorization || '').split(' ')

        if (esquema !== 'Bearer' || !token) {
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

const AREAS_VOLUNTARIA = ['Acolhimento', 'Divulgação', 'Eventos', 'Profissional']

// Cada conta tem a sua própria conversa, usando as tabelas conversas e mensagens
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
            `SELECT id, nome, email, senha_hash, tipo, accountType
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
            accountType: usuario.accountType,
            token: gerarToken(usuario)
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            erro: 'Erro ao fazer login.'
        })
    }
})

// Inscrição de voluntária: atualiza a própria conta autenticada
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

        // Só usuárias (ou quem já é voluntária) podem se inscrever.
        // Psicóloga e administrador nunca são alterados por esta rota.
        if (
            !['usuaria', 'voluntaria'].includes(req.usuario.tipo) ||
            !['usuaria', 'voluntaria'].includes(req.usuario.accountType)
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
            return res.status(400).json({ erro: 'Telefone ou cidade com tamanho inválido.' })
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

        await db.query(
            `UPDATE usuarios
            SET tipo = 'voluntaria', accountType = 'voluntaria',
                telefone = ?, cidade = ?, areas_atuacao = ?
            WHERE id = ?`,
            [telefoneFormatado || null, cidadeFormatada, areasUnicas.join(', '), req.usuario.id]
        )

        res.json({
            id: req.usuario.id,
            nome: req.usuario.nome,
            email: req.usuario.email,
            tipo: 'voluntaria',
            accountType: 'voluntaria'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao registrar a inscrição.' })
    }
})

// Chat: lista somente as mensagens da própria conta
app.get('/chat/mensagens', autenticarChat, async (req, res) => {
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

// Chat: salva uma nova mensagem na conversa da própria conta
app.post('/chat/mensagens', autenticarChat, async (req, res) => {
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

// Chat: edita uma mensagem, somente se for da própria conta
app.put('/chat/mensagens/:id', autenticarChat, async (req, res) => {
    try {
        const mensagemId = Number(req.params.id)

        if (!Number.isInteger(mensagemId)) {
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

// Chat: exclui uma mensagem, somente se for da própria conta
app.delete('/chat/mensagens/:id', autenticarChat, async (req, res) => {
    try {
        const mensagemId = Number(req.params.id)

        if (!Number.isInteger(mensagemId)) {
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