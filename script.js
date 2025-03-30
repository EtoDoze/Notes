function formatText(command, value = null) {
    document.execCommand(command, false, value);
    document.getElementById('editor').focus();
}

function downloadText() {
    const content = document.getElementById('editor').innerHTML;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function clearText() {
    document.getElementById('editor').innerHTML = '';
}

// Foco no editor ao carregar a página
window.onload = function() {
    document.getElementById('editor').focus();
};