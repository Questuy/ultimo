require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuração do PostgreSQL Neon com variáveis do .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// Teste de conexão
app.get('/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// LOGIN DE USUÁRIO
app.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE usuario = $1 AND senha = $2',
      [usuario, senha]
    );
    if (result.rows.length > 0) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// LISTAR ALUNOS
app.get('/alunos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alunos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ADICIONAR ALUNO
app.post('/alunos', async (req, res) => {
  const { nome, idade, sexo } = req.body;
  try {
    await pool.query(
      'INSERT INTO alunos (nome, idade, sexo) VALUES ($1, $2, $3)',
      [nome, idade, sexo]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// EDITAR ALUNO
app.put('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, idade, sexo } = req.body;
  try {
    await pool.query(
      'UPDATE alunos SET nome=$1, idade=$2, sexo=$3 WHERE id=$4',
      [nome, idade, sexo, id]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETAR ALUNO
app.delete('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM alunos WHERE id=$1', [id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
