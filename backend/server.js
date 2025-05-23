require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔗 Conexão com PostgreSQL (Supabase, Neon, etc.)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

// ✅ Rota raiz para indicar que o servidor está ativo
app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});

// 🔄 Teste de conexão com o banco
app.get('/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 🔐 Login de usuário
app.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE usuario = $1 AND senha = $2',
      [usuario, senha]
    );
    if (result.rows.length > 0) {
      res.json({ success: true, message: 'Login bem-sucedido' });
    } else {
      res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 📄 Listar alunos
app.get('/alunos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alunos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ➕ Cadastrar aluno
app.post('/alunos', async (req, res) => {
  const {
    nome,
    idade,
    sexo,
    dataNascimento,
    cpf,
    peso,
    altura,
    endereco = {},
    telefone,
    email,
    graduacao,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO alunos 
        (nome, idade, sexo, dataNascimento, cpf, peso, altura, rua, numero, bairro, cidade, cep, telefone, email, graduacao) 
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        nome,
        idade,
        sexo,
        dataNascimento,
        cpf,
        peso,
        altura,
        endereco.rua || '',
        endereco.numero || '',
        endereco.bairro || '',
        endereco.cidade || '',
        endereco.cep || '',
        telefone,
        email,
        graduacao,
      ]
    );
    res.status(201).json({ message: 'Aluno cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro ao cadastrar aluno:', err);
    res.status(500).send(err.message);
  }
});

// ✏️ Editar aluno
app.put('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, idade, sexo } = req.body;
  try {
    await pool.query(
      'UPDATE alunos SET nome = $1, idade = $2, sexo = $3 WHERE id = $4',
      [nome, idade, sexo, id]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ❌ Deletar aluno
app.delete('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM alunos WHERE id = $1', [id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ▶️ Inicializar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

