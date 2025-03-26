async function createuser() {
    const username = document.getElementById("userinpt").value;
    const email = document.getElementById("emailinp").value;
    const senha = document.getElementById("senhainp").value;

    // Validação simples
    if (username === "" || email === "" || senha === "") {
        return alert("Preencha todos os campos!");
    }

    try {
        const user = await fetch("http://localhost:3008/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password: senha })
        });

        if (!user.ok) {
            const errorData = await user.json();
            throw new Error(errorData.error || "Erro na criação do usuário");
        }

        const data = await user.json();
        alert("Usuário " + data.username + " criado com sucesso!");
        window.location.href = "login.html"
    } catch (error) {
        console.error("Erro:");  // Exibe mensagem de erro caso algo aconteça
    }
}
