document.getElementById('cadastroAluno').addEventListener('submit', function(event) {
  event.preventDefault();

  const aluno = {
    nome: document.getElementById('nome').value,
    idade: document.getElementById('idade').value,
    sexo: document.getElementById('sexo').value,
    dataNascimento: document.getElementById('dataNascimento').value,
    cpf: document.getElementById('cpf').value,
    peso: parseFloat(document.getElementById('peso').value),
    altura: parseFloat(document.getElementById('altura').value),
    rua: document.getElementById('rua').value,
    numero: document.getElementById('numero').value,
    bairro: document.getElementById('bairro').value,
    cidade: document.getElementById('cidade').value,
    cep: document.getElementById('cep').value,
    telefone: document.getElementById('telefone').value,
    email: document.getElementById('email').value,
    graduacao: document.getElementById('graduacao').value
  };

  fetch('http://localhost:3000/api/alunos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aluno)
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Aluno cadastrado com sucesso");
      window.location.href = 'home.html';
    })
    .catch(err => {
      console.error('Erro ao cadastrar aluno:', err);
      alert('Erro ao cadastrar aluno');
    });
});

     

      
      fetch('http://localhost:3000/api/cadastrar-aluno', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(aluno)
})
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    document.getElementById('cadastroAluno').reset();
  })
  .catch(err => console.error('Erro ao cadastrar:', err));
  