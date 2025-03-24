function createuser() {
    const username = document.getElementById("userinpt").value;
    const email = document.getElementById("emailinp").value;
    const senha = document.getElementById("senhainp").value;

    fetch("http://localhost:3008/create", { // Corrigida a URL
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: senha
        })
    })
    .then(response => response.json())
    .then(data => {
        alert("Usuário " + data.username + " criado com sucesso!");
    })
    .catch(error => {
        console.error("Erro ao criar usuário:", error);
        alert("Erro ao criar usuário.");
    });
}
