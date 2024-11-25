import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const app = express();

app.use(session({
    secret: 'M1nh4Chav3S3cr3t4',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30 
    }
}));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('./pages/public'));

var listaProdutos = [];

function cadastrarProdutoView(req, res) {
    const mensagemUltimoLogin = exibirUltimoLogin(req);

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Produto</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
        </head>
        <body>
            <div class="container mt-5">
                <h1>Cadastro de Produto</h1>
                <form id="formCadastro" action="/cadastrarProduto" method="POST" novalidate>
                    <div class="mb-3">
                        <label for="codigoBarras" class="form-label">Código de Barras</label>
                        <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" placeholder="Informe o Código de Barras">
                        <span class="text-danger" id="errocodigoBarras"></span>
                    </div>
                    <div class="mb-3">
                        <label for="descricao" class="form-label">Descrição do Produto</label>
                        <input type="text" class="form-control" id="descricao" name="descricao" placeholder="Informe a Descrição do Produto">
                        <span class="text-danger" id="errodescricao"></span>
                    </div>
                    <div class="mb-3">
                        <label for="precoCusto" class="form-label">Preço de Custo</label>
                        <input type="number" class="form-control" id="precoCusto" name="precoCusto" step="0.01" placeholder="Informe o Preço de Custo">
                        <span class="text-danger" id="erroprecoCusto"></span>
                    </div>
                    <div class="mb-3">
                        <label for="precoVenda" class="form-label">Preço de Venda</label>
                        <input type="number" class="form-control" id="precoVenda" name="precoVenda" step="0.01" placeholder="Informe o Preço de Venda">
                        <span class="text-danger" id="erroprecoVenda"></span>
                    </div>
                    <div class="mb-3">
                        <label for="dataValidade" class="form-label">Data de Validade</label>
                        <input type="date" class="form-control" id="dataValidade" name="dataValidade">
                        <span class="text-danger" id="errodataValidade"></span>
                    </div>
                    <div class="mb-3">
                        <label for="qtdEstoque" class="form-label">Quantidade em Estoque</label>
                        <input type="number" class="form-control" id="qtdEstoque" name="qtdEstoque" placeholder="Informe a Quantidade em Estoque">
                        <span class="text-danger" id="erroqtdEstoque"></span>
                    </div>
                    <div class="mb-3">
                        <label for="fabricante" class="form-label">Nome do Fabricante</label>
                        <input type="text" class="form-control" id="fabricante" name="fabricante" placeholder="Informe o Nome do Fabricante">
                        <span class="text-danger" id="errofabricante"></span>
                    </div>
                    <button type="submit" class="btn btn-primary">Cadastrar Produto</button>
                    <br><br>
                     <div class="mb-3">
                     ${mensagemUltimoLogin}
                     </div>
                </form>
            </div>
            <script>
                document.getElementById('formCadastro').addEventListener('submit', function(event) {
                    let isValid = true;

                    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
                    document.querySelectorAll('.form-control, .form-select').forEach(el => el.classList.remove('is-invalid'));

                    if (!document.getElementById('codigoBarras').value.trim()) {
                        document.getElementById('errocodigoBarras').textContent = 'O código de barras é obrigatório.';
                        document.getElementById('codigoBarras').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('descricao').value.trim()) {
                        document.getElementById('errodescricao').textContent = 'A descrição é obrigatória.';
                        document.getElementById('descricao').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('precoCusto').value.trim()) {
                        document.getElementById('erroprecoCusto').textContent = 'O preço de custo é obrigatório.';
                        document.getElementById('precoCusto').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('precoVenda').value.trim()) {
                        document.getElementById('erroprecoVenda').textContent = 'O preço de venda é obrigatório.';
                        document.getElementById('precoVenda').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('dataValidade').value.trim()) {
                        document.getElementById('errodataValidade').textContent = 'A data de validade é obrigatória.';
                        document.getElementById('dataValidade').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('qtdEstoque').value.trim()) {
                        document.getElementById('erroqtdEstoque').textContent = 'A quantidade de estoque é obrigatória.';
                        document.getElementById('qtdEstoque').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('fabricante').value.trim()) {
                        document.getElementById('errofabricante').textContent = 'O nome do fabricante é obrigatório.';
                        document.getElementById('fabricante').classList.add('is-invalid');
                        isValid = false;
                    }

                    if (!isValid) {
                        event.preventDefault();
                    }
                });
            </script>
        </body>
        </html>
    `);
}
function exibirUltimoLogin(req) {
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (dataHoraUltimoLogin) {

        const dataHoraFormatada = new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            dateStyle: 'short',
            timeStyle: 'short',
        }).format(new Date(dataHoraUltimoLogin));

        return `<p><span>Seu último acesso foi realizado em ${dataHoraFormatada}</span></p>`;
    } else {
        return `<p><span>Este é seu primeiro acesso.</span></p>`;
    }
}

function menuView(req, resp) {
    const mensagemUltimoLogin = exibirUltimoLogin(req);

    resp.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Home</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        </head>
        <body>
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Menu Principal</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Alternar navegação">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/cadastrarProduto">Cadastro de Produtos</a>
        </li>
      </ul>
     <div class="mb-3">
          ${mensagemUltimoLogin}
     </div>
    </div>
  </div>
</nav>
</body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</html> `)
}

function cadastrarProduto(req, resp) {
    const mensagemUltimoLogin = exibirUltimoLogin(req);

    const codigoBarras = req.body.codigoBarras;
    const descricao = req.body.descricao;
    const precoCusto = req.body.precoCusto;
    const precoVenda = req.body.precoVenda;
    const dataValidade = req.body.dataValidade;
    const qtdEstoque = req.body.qtdEstoque;
    const fabricante = req.body.fabricante;

    const produto = { codigoBarras, descricao, precoCusto, precoVenda, dataValidade, qtdEstoque, fabricante };
    listaProdutos.push(produto); 

    resp.write(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lista de Produtos</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        </head>
        <body>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Código de Barras</th>
                    <th scope="col">Descrição do Produto</th>
                    <th scope="col">Preço de Custo</th>
                    <th scope="col">Preço de Venda</th>
                    <th scope="col">Data de Validade</th>
                    <th scope="col">Quantidade em Estoque</th>
                    <th scope="col">Nome do Fabricante</th>
                </tr>
            </thead>
            <tbody>`);

    for (let i = 0; i < listaProdutos.length; i++) {
        resp.write(`
            <tr>
                <td>${listaProdutos[i].codigoBarras}</td>
                <td>${listaProdutos[i].descricao}</td>
                <td>${listaProdutos[i].precoCusto}</td>
                <td>${listaProdutos[i].precoVenda}</td>
                <td>${listaProdutos[i].dataValidade}</td>
                <td>${listaProdutos[i].qtdEstoque}</td>
                <td>${listaProdutos[i].fabricante}</td>
            </tr>
        `);
    }

    resp.write(`
        </tbody>
        </table>
        <a class="btn btn-dark" href="/cadastrarProduto" role="button">Continuar cadastrando</a>
        <a class="btn btn-dark" href="/" role="button">Voltar para o menu</a>
        <br><br>
        <div class="mb-3">
            ${mensagemUltimoLogin}
        </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </html>
    `);
    resp.end();
}

function autenticarUsuario(req, resp) {
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    console.log("Usuário enviado:", usuario);
    console.log("Senha enviada:", senha);

    if (usuario === 'admin' && senha === '123') {
        console.log("Autenticação bem-sucedida");
        req.session.usuarioLogado = true;
        resp.cookie('dataHoraUltimoLogin', new Date().toLocaleString(), { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
        resp.redirect('/');
    } else {
        console.log("Autenticação falhou");
        resp.send(`
            <html>
                <head>
                    <meta charset="utf-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                    <div class="container w-25"> 
                        </br>
                        <div class="alert alert-danger" role="alert">
                            Usuário ou senha inválidos!
                        </div>
                        <div>
                            <a href="/login.html" class="btn btn-primary">Tentar novamente</a>
                        </div>
                    </div>
                </body>
            </html>
        `);
    }
}    

function verificarAutenticacao(req, resp, next) {
    console.log("Sessão ativa:", req.session);
    if (req.session.usuarioLogado) {
        next();
    } else {
        resp.redirect('/login.html');
    }
}    

app.get('/test-login', (req, res) => {
    res.sendFile(__dirname + '/pages/public/login.html');
});

app.get('/logout', (req, resp) => {
    req.session.destroy(); 
    resp.redirect('/login.html');
});
app.post('/login', autenticarUsuario);
app.get('/',verificarAutenticacao,menuView);
app.get('/cadastrarProduto', verificarAutenticacao,cadastrarProdutoView);
app.post('/cadastrarProduto', verificarAutenticacao, cadastrarProduto);

if (process.env.NODE_ENV !== 'production') {
    const porta = 3000;
    const host = 'localhost';
    app.listen(porta, host, () => {
        console.log(`Servidor rodando em http://${host}:${porta}`);
    });
}

export default app;