document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;

  fetch('https://ultimo-lxkj.onrender.com/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Login bem-sucedido');
        window.location.href = 'home.html';
      } else {
        alert('Usuário ou senha incorretos');
      }
    })
    .catch(err => {
      console.error('Erro no login:', err);
      alert('Erro ao tentar fazer login');
    });
});
