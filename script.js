


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
        const response = await fetch("http://localhost:3008/create", {
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
        const response = await fetch("http://localhost:3008/login", {
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

// Chama a função
if (window.location.pathname.includes('index.html')){
VerToken();
}