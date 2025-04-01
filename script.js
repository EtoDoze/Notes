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


document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('add-post-btn');
    const formContainer = document.querySelector('.create-cont');
    const overlay = document.querySelector('.p3r-overlay') || document.createElement('div');
    
    // Garante que o overlay existe
    if (!document.querySelector('.p3r-overlay')) {
        overlay.className = 'p3r-overlay';
        document.body.appendChild(overlay);
    }

    // Função aprimorada para toggle
    function toggleForm(show = null) {
        const shouldShow = show !== null ? show : !formContainer.classList.contains('show');
        
        if (shouldShow) {
            formContainer.classList.add('show');
            overlay.style.display = 'block';
            formContainer.style.display = 'flex'; // Corresponde ao seu CSS
        } else {
            formContainer.classList.remove('show');
            overlay.style.display = 'none';
            formContainer.style.display = 'none';
        }
    }

    // Event listeners
    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleForm();
    });

    overlay.addEventListener('click', function() {
        toggleForm(false);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && formContainer.classList.contains('show')) {
            toggleForm(false);
        }
    });

    formContainer.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});