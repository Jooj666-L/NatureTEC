document.addEventListener('DOMContentLoaded', () => {
    const carrinhoKey = 'carrinhoNatureTEC';

    function atualizarContador() {
        const carrinho = JSON.parse(localStorage.getItem(carrinhoKey)) || [];
        const contador = document.getElementById('carrinho-count');
        if (contador) contador.textContent = carrinho.length;
    }

    function adicionarProduto(produto, quantidade = 1) {
        const carrinho = JSON.parse(localStorage.getItem(carrinhoKey)) || [];
        const produtoComQuantidade = { ...produto, quantidade };
        carrinho.push(produtoComQuantidade);
        localStorage.setItem(carrinhoKey, JSON.stringify(carrinho));
        atualizarContador();
        mostrarAlerta('Produto adicionado ao carrinho!', '🛒');
    }

    function abrirModal(produto) {
        const modal = document.getElementById('modal-produto');
        const imagem = document.getElementById('modal-imagem');
        const nome = document.getElementById('modal-nome');
        const descricao = document.getElementById('modal-descricao');
        const preco = document.getElementById('modal-preco');
        const botaoAdicionar = document.getElementById('botao-adicionar-carrinho');
        const inputQuantidade = document.getElementById('quantidade-produto');

        imagem.src = produto.imagem;
        imagem.alt = produto.nome;
        nome.textContent = produto.nome;
        descricao.textContent = produto.descricao; // Descrição completa no modal
        preco.textContent = produto.preco;

        modal.style.display = 'flex';

        botaoAdicionar.onclick = () => {
            const quantidade = parseInt(inputQuantidade.value, 10);
            if (quantidade > 0) {
                adicionarProduto(produto, quantidade);
                modal.style.display = 'none';
            } else {
                mostrarAlerta('Quantidade inválida!', '⚠️');
            }
        };
    }

    const fechar = document.getElementById('fechar-modal');
    const modal = document.getElementById('modal-produto');

    if (fechar && modal) {
        fechar.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    if (window.location.pathname.includes('produtos.html')) {
        const botoesVerMais = document.querySelectorAll('.produto .ver-mais');
        botoesVerMais.forEach(botao => {
            botao.addEventListener('click', () => {
                const card = botao.closest('.produto');
                const produto = {
                    nome: card.querySelector('h3').textContent,
                    preco: card.querySelectorAll('p')[1].textContent,
                    imagem: card.querySelector('img').src,
                    descricao: card.querySelectorAll('p')[0].textContent
                };
                abrirModal(produto);
            });
        });

        const botoesAdicionar = document.querySelectorAll('.produto button');
        botoesAdicionar.forEach(botao => {
            botao.addEventListener('click', () => {
                const card = botao.closest('.produto');
                const produto = {
                    nome: card.querySelector('h3').textContent,
                    preco: card.querySelectorAll('p')[1].textContent,
                    imagem: card.querySelector('img').src,
                    descricao: card.querySelectorAll('p')[0].textContent
                };
                abrirModal(produto);
            });
        });
    }

    if (window.location.pathname.includes('carrinho.html')) {
        const lista = document.getElementById('lista-carrinho');
        const carrinho = JSON.parse(localStorage.getItem(carrinhoKey)) || [];

        if (carrinho.length === 0) {
            lista.innerHTML = '<p>Você ainda não adicionou produtos ao carrinho.</p>';
        } else {
            lista.innerHTML = '';
            carrinho.forEach((item, index) => {
                const div = document.createElement('div');
                div.classList.add('item-carrinho');
                div.innerHTML = `
                    <img src="${item.imagem}" alt="${item.nome}" width="80">
                    <div>
                        <strong>${item.nome}</strong><br>
                        <span>${item.preco}</span><br>
                        <span>Quantidade: ${item.quantidade}</span>
                    </div>
                    <button onclick="removerItem(${index})">Remover</button>
                `;
                lista.appendChild(div);
            });
        }

        window.removerItem = (index) => {
            carrinho.splice(index, 1);
            localStorage.setItem(carrinhoKey, JSON.stringify(carrinho));
            location.reload();
        };

        window.finalizarCompra = () => {
            if (carrinho.length > 0) {
                mostrarAlerta('Compra finalizada com sucesso!', '🎉');
                setTimeout(() => {
                    localStorage.removeItem(carrinhoKey);
                    location.reload();
                }, 2000);
            } else {
                mostrarAlerta('Seu carrinho está vazio!', '⚠️');
            }
        };
    }

    atualizarContador();
});

// Função para mostrar alerta customizado
function mostrarAlerta(mensagem, icone = '✅') {
    const alerta = document.getElementById('alerta');
    const texto = document.getElementById('alerta-texto');
    const iconeElemento = document.getElementById('alerta-icone');

    if (!iconeElemento) {
        const novoIcone = document.createElement('span');
        novoIcone.id = 'alerta-icone';
        novoIcone.style.marginRight = '8px';
        alerta.prepend(novoIcone);
    }

    document.getElementById('alerta-icone').textContent = icone;
    texto.textContent = mensagem;
    alerta.style.display = 'flex';

    setTimeout(() => {
        alerta.style.display = 'none';
    }, 3000);
}
