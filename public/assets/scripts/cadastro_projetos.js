// =============================================
// Gearhead Project - cadastro_projetos.js
// Autor: Victor Dourado
// Descrição: Envia novo projeto para o JSON Server via POST
// =============================================

const API_URL_CADASTRO = 'http://localhost:3000/projetos';

/**
 * Lê e valida os dados do formulário
 * @returns {Object|null} Objeto com os dados ou null se inválido
 */
function lerFormulario() {
    const titulo = document.getElementById('titulo').value.trim();
    const categoria = document.getElementById('categoria').value;
    const descricaoCurta = document.getElementById('descricaoCurta').value.trim();
    const descricaoCompleta = document.getElementById('descricaoCompleta').value.trim();

    // Validação dos campos obrigatórios
    if (!titulo) {
        alert('O campo Título é obrigatório!');
        document.getElementById('titulo').focus();
        return null;
    }
    if (!categoria) {
        alert('Selecione uma Categoria!');
        document.getElementById('categoria').focus();
        return null;
    }
    if (!descricaoCurta) {
        alert('A Descrição Curta é obrigatória!');
        document.getElementById('descricaoCurta').focus();
        return null;
    }
    if (!descricaoCompleta) {
        alert('A Descrição Completa é obrigatória!');
        document.getElementById('descricaoCompleta').focus();
        return null;
    }

    // Processa as tags (string separada por vírgulas → array)
    const tagsRaw = document.getElementById('tags').value;
    const tags = tagsRaw
        ? tagsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0)
        : [];

    const anoVal = document.getElementById('ano').value;
    const precoVal = document.getElementById('preco').value;

    return {
        titulo,
        categoria,
        descricaoCurta,
        descricaoCompleta,
        potencia: document.getElementById('potencia').value.trim() || null,
        motor: document.getElementById('motor').value.trim() || null,
        proprietario: document.getElementById('proprietario').value.trim() || null,
        imagem: document.getElementById('imagem').value.trim() || 'images/Mustang.jpg',
        pais: document.getElementById('pais').value.trim() || null,
        ano: anoVal ? parseInt(anoVal) : null,
        preco: precoVal ? parseFloat(precoVal) : null,
        destaque: document.getElementById('destaque').checked,
        tags
    };
}

/**
 * Envia o projeto para o JSON Server via POST
 * @param {Object} projeto - Dados do projeto
 */
async function enviarProjeto(projeto) {
    const response = await fetch(API_URL_CADASTRO, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projeto)
    });

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
}

/**
 * Limpa todos os campos do formulário
 */
function limparFormulario() {
    const campos = ['titulo', 'potencia', 'motor', 'proprietario', 'ano', 'pais',
                    'preco', 'imagem', 'descricaoCurta', 'descricaoCompleta', 'tags'];
    campos.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.getElementById('categoria').value = '';
    document.getElementById('destaque').checked = false;
}

/**
 * Função principal chamada ao clicar em "Cadastrar Projeto"
 */
async function cadastrarProjeto() {
    const projeto = lerFormulario();
    if (!projeto) return;

    const btn = document.getElementById('btnCadastrar');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';

    const successMsg = document.getElementById('successMsg');
    const errorMsg = document.getElementById('errorCadastro');
    successMsg.classList.add('d-none');
    errorMsg.classList.add('d-none');

    try {
        const projetoCriado = await enviarProjeto(projeto);
        console.log('Projeto criado:', projetoCriado);

        // Exibe sucesso
        successMsg.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            <strong>Projeto cadastrado com sucesso!</strong> (ID: ${projetoCriado.id})
            <a href="details.html?id=${projetoCriado.id}" class="alert-link ms-2">Ver Detalhes</a> | 
            <a href="index.html" class="alert-link ms-1">Ver na Home</a>
        `;
        successMsg.classList.remove('d-none');

        limparFormulario();
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        document.getElementById('errorCadastroText').innerHTML = `
            Erro ao cadastrar o projeto. Verifique se o JSON Server está rodando em 
            <code>http://localhost:3000</code>.<br>
            <small>Execute: <code>npx json-server --watch db/db.json --port 3000</code></small>
        `;
        errorMsg.classList.remove('d-none');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save me-2"></i>Cadastrar Projeto';
    }
}
