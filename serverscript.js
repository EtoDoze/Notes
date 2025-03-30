const webservice = "http://localhost:3008"//"https://notes-backend-3c5r.onrender.com"


async function createuser() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const senhaConf = document.getElementById("senhaconf").value;
    
    // Validação de senhas iguais
    if (senha !== senhaConf) {
        return alert("As senhas tem que ser iguais!");
    }
    // Validação simples
    if (!username || !email || !(document.getElementById("senha").value || document.getElementById("senhaconf").value)) {
        return alert("Preencha todos os campos!");
    }

    alert(senha)
    try {
        const response = await fetch(`${webservice}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password: senha })
        });

        const data = await response.json();

        if (response.status === 400) {
            return alert(data.error || "E-mail já cadastrado");
            
        }

        if (!response.ok) {
            throw new Error(data.error || "Erro na criação do usuário");
        }

        alert(`Usuário ${data.username} criado com sucesso!`);
        setTimeout(function() {
            window.location.href = "login.html";
        }, 3000);
        
    } catch (error) {
        alert(error.message);
        console.error("Erro:", error);
    }
}



async function loginuser(){
    const email = document.getElementById("emailinpt").value;
    const senha = document.getElementById("senhainpt").value;

        // Validação simples
        if (!email || !senha) {
            return alert("Preencha todos os campos!");
        }
    
    try{
        const response = await fetch(`${webservice}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password: senha })
        });

        const data = await response.json();

        if(response.status === 404){
           return alert("Usuario não encontrado")
        }
        if (!response.ok) {
            throw new Error(data.error || "Erro na criação do usuário");
        }

        localStorage.setItem('authToken', data.token);
        alert(`usuario ${data.username} encontrado`)
        window.location.href = "index.html";
    }
    catch (error) {
    alert(error.message);
    console.error("Erro:", error);
}
}

function parseJwt(token) {
    try {
        // O token JWT tem 3 partes separadas por pontos: header.payload.signature
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Erro ao decodificar token:', e);
        return null;
    }
}

function VerToken() {
    // Espera o DOM carregar completamente
    document.addEventListener('DOMContentLoaded', function() {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            console.log('Nenhum token encontrado');
            window.location.href = '/login.html';
            return;
        }

        try {
            const tokenauth = parseJwt(token);
            console.log('Token decodificado:', tokenauth); // Para debug
            
            // Verifica se estamos em qualquer página (não só sobre.html)
            const usernameElement = document.getElementById("user");
            
            if (usernameElement) {
                // Verifica os possíveis nomes de campo no token
                const username = tokenauth.username || tokenauth.sub || tokenauth.name;
                if (username) {
                    usernameElement.textContent = username;
                } else {
                    console.error('Propriedade username não encontrada no token');
                }
            }
        } catch (e) {
            console.error('Erro ao decodificar token:', e);
            localStorage.removeItem('authToken');
            window.location.href = '/login.html';
        }
    });
}


async function criarPost() {
    // 1. Pegar o conteúdo do post do formulário
    const titulo = document.getElementById('titulo-post').value;
    const conteudo = document.getElementById('conteudo-post').value;
    
    if(!titulo || !conteudo){return alert("Preencha todos os campos!");}
    // 2. Pegar o token do localStorage
    const token = localStorage.getItem('authToken');
  
    try {
      // 3. Enviar a requisição para o servidor
      const response = await fetch(`${webservice}/postar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Envia o token no header
        },
        body: JSON.stringify({
          title: titulo,
          content: conteudo
        })
      });
  
      if (!response.ok) {
        throw new Error('Erro ao criar post');
      }
  
      const data = await response.json();
      console.log('Post criado com sucesso:', data);
      alert('Post criado com sucesso!');
      
    } catch (error) {
      console.error('Erro:', error);
      alert('Falha ao criar post: ' + error.message);
    }
  }


  async function carregarPosts() {
    try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`${webservice}/myposts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar posts');
        }

        const posts = await response.json();
        exibirPosts(posts);
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao carregar posts: ' + error.message);
    }
}

function exibirPosts(posts) {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';
  
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'post';
      postElement.dataset.postId = post.id; // Armazena o ID do post
      
      postElement.innerHTML = `
      <div class="post-cont">
        <h3>${post.title}</h3>
        <span> ${new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <hr>
        <p id="post-cont-index">${post.content}</p>
        
      `;
  
      // Adiciona o evento de clique
      postElement.addEventListener('click', () => abrirPost(post));
      
      container.appendChild(postElement);
    });
  }
  
  function abrirPost(post) {
    console.log('Post clicado:', post);
    
    // Aqui você pode:
    // 1. Mostrar os detalhes completos
    // 2. Redirecionar para uma página de edição
    // 3. Abrir um modal com as informações
    
    // Exemplo: Armazenar o post selecionado
    localStorage.setItem('selectedPost', JSON.stringify(post));
    window.location.href = `view.html?id=${post.id}`;
  }

  
  async function buscarPostDetalhado(id) {
    try {
        const response = await fetch(`${webservice}/posts/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Post não encontrado');
        }
        
        const post = await response.json();
        
        // Atualize para usar innerHTML em vez de textContent
        document.getElementById('post-titulo').textContent = post.title;
        document.getElementById('editor').innerHTML = post.content; // Alterado aqui
        document.getElementById('post-date').textContent = `${new Date(post.createdAt).toLocaleString()}`;
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar post: ' + error.message);
    }
}

async function EditPost() {
    try {
        const postId = new URLSearchParams(window.location.search).get('id');
        const title = document.getElementById('post-titulo').textContent;
        const content = document.getElementById('editor').innerHTML;
        const token = localStorage.getItem('authToken');

        if (!title || !content) {
            return alert("O post não pode estar vazio!");
        }

        const response = await fetch(`${webservice}/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        });

        // Verificar se a resposta é JSON
        if (response.status === 404) {
            throw new Error('Endpoint não encontrado. Verifique a URL do servidor.');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao atualizar post');
        }

        alert('Post atualizado com sucesso!');
        window.location.href = 'index.html'; // Redireciona após sucesso
        
    } catch (error) {
        console.error('Erro na atualização:', error);
        alert(`Erro: ${error.message}`);
    }
}



// Modifique o evento DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Verifique se estamos na página correta
    if (window.location.pathname.includes('view.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        
        if (postId) {
            buscarPostDetalhado(postId);
        } else {
            console.error('ID do post não encontrado na URL');
        }
        
        // Verifique se o token existe
        if (!localStorage.getItem('authToken')) {
            window.location.href = 'login.html';
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  
  if (postId) {
    buscarPostDetalhado(postId);
  }
});
// Chama a função
if (window.location.pathname.includes('index.html')){
    VerToken();
}
if (window.location.pathname.includes('index.html')){
    carregarPosts();
    setInterval(carregarPosts, 30000);
}

