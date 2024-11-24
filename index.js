import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';

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

app.use(express.static(path.join(__dirname, 'pages/public')));

const porta = 3000;
const host = 'localhost'; 

var listaProdutos = [];

function cadastrarProdutoView(req, res) {
    const mensagemUltimoLogin = exibirUltimoLogin(req);

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Produtos</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        </head>
        <body>
            <div class="container mt-5">
                <h1>Cadastro de Produtos</h1>
                <form action="/cadastrarProduto" method="POST">
                    <div class="mb-3">
                        <label for="codigoBarras" class="form-label">Código de Barras</label>
                        <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" placeholder="Digite o código de barras" required>
                    </div>
                    <div class="mb-3">
                        <label for="descricao" class="form-label">Descrição do Produto</label>
                        <input type="text" class="form-control" id="descricao" name="descricao" placeholder="Digite a descrição do produto" required>
                    </div>
                    <div class="mb-3">
                        <label for="precoCusto" class="form-label">Preço de Custo</label>
                        <input type="number" class="form-control" id="precoCusto" name="precoCusto" step="0.01" placeholder="Digite o preço de custo" required>
                    </div>
                    <div class="mb-3">
                        <label for="precoVenda" class="form-label">Preço de Venda</label>
                        <input type="number" class="form-control" id="precoVenda" name="precoVenda" step="0.01" placeholder="Digite o preço de venda" required>
                    </div>
                    <div class="mb-3">
                        <label for="dataValidade" class="form-label">Data de Validade</label>
                        <input type="date" class="form-control" id="dataValidade" name="dataValidade" required>
                    </div>
                    <div class="mb-3">
                        <label for="qtdEstoque" class="form-label">Quantidade em Estoque</label>
                        <input type="number" class="form-control" id="qtdEstoque" name="qtdEstoque" placeholder="Digite a quantidade em estoque" required>
                    </div>
                    <div class="mb-3">
                        <label for="fabricante" class="form-label">Nome do Fabricante</label>
                        <input type="text" class="form-control" id="fabricante" name="fabricante" placeholder="Digite o nome do fabricante" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Cadastrar Produto</button>
                    <br><br>
                </form>
                     <div class="mb-3">
                     ${mensagemUltimoLogin}
                     </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </body>
        </html>
    `);
}

function exibirUltimoLogin(req) {
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (dataHoraUltimoLogin) {
        return `<p><span>Seu último acesso foi realizado em ${dataHoraUltimoLogin}</span></p>`;
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

function cadastrarProduto(req,resp){
    const mensagemUltimoLogin = exibirUltimoLogin(req);

    const codigoBarras = req.body.codigoBarras;
    const descricao = req.body.descricao;
    const precoCusto = req.body.precoCusto;
    const precoVenda = req.body.precoVenda;
    const dataValidade = req.body.dataValidade;
    const qtdEstoque = req.body.qtdEstoque;
    const fabricante = req.body.fabricante;


    if (codigoBarras && descricao && precoCusto && precoVenda && dataValidade && qtdEstoque && fabricante) {

    const produto = { codigoBarras, descricao, precoCusto, precoVenda, dataValidade, qtdEstoque, fabricante};
    listaProdutos.push(produto);

    resp.write(`   
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lista de Fornecedores</title>
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

  for (var i = 0; i < listaProdutos.length; i++){
    resp.write(`<tr>
                <td>${listaProdutos[i].codigoBarras}</td>
                <td>${listaProdutos[i].descricao}</td>
                <td>${listaProdutos[i].precoCusto}</td>
                <td>${listaProdutos[i].precoVenda}</td>
                <td>${listaProdutos[i].dataValidade}</td>
                <td>${listaProdutos[i].qtdEstoque}</td>
                <td>${listaProdutos[i].fabricante}</td>
                </tr>
        `)
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
  }
    else
    {
        resp.write(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cadastro de Produtos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            </head>
            <body>
                <div class="container mt-5">
                    <h1>Cadastro de Fornecedores</h1>
                    <form action="/cadastrarProduto" method="POST">
                                <div class="mb-3">
                                    <label for="codigoBarras" class="form-label">Código de Barras</label>
                                    <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" value="${codigoBarras}">
            `);
            if (!codigoBarras){
                resp.write(`
                    <div>
                        <span><p class="text-danger">Por favor, você deve informar o Código de Barras</p></span>
                    </div>
                    `);
            }
            resp.write(`
                            <div class="mb-3">
                            <label for="descricao" class="form-label">Descrição do Produto</label>
                            <input type="text" class="form-control" id="descricao" name="descricao" value="${descricao}">`);
            if (!descricao){
                resp.write(`
                    <div>
                        <span><p class="text-danger">Por favor, você deve informar a Descrição do Produto!</p></span>
                    </div>
                    `);
            }
            resp.write(`
                <div class="mb-3">
                <label for="precoCusto" class="form-label">Preço de Custo</label>
                <input type="number" class="form-control" id="precoCusto" name="precoCusto" value="${precoCusto}">`);
            if (!precoCusto){
            resp.write(`
            <div>
            <span><p class="text-danger">Por favor, você deve informar o Preço de Custo!</p></span>
            </div>
            `);
            }
            resp.write(`
                            <div class="mb-3">
                            <label for="precoVenda" class="form-label">Preço de Venda</label>
                            <input type="number" class="form-control" id="precoVenda" name="precoVenda" value="${precoVenda}">`);
            if (!precoVenda){
                resp.write(`
                    <div>
                        <span><p class="text-danger">Por favor, você deve informar o Preço de Venda!</p></span>
                    </div>
                    `);
            }
            resp.write(`
                      
                <div class="mb-3">
                    <label for="dataValidade" class="form-label">Data de Validade</label>
                    <input type="date" class="form-control" id="dataValidade" name="dataValidade" value="${dataValidade}">
                `);
        
            if (!dataValidade){
                resp.write(`
                    <div>
                        <span><p class="text-danger">Por favor, informe a Data de Validade!</p></span>
                    </div>
                    `);
            }
            resp.write(`
                </select>
            </div>
            <div class="mb-3">
                <label for="qtdEstoque" class="form-label">Quantidade de Estoque</label>
                <input type="number" class="form-control" id="qtdEstoque" name="qtdEstoque" value="${qtdEstoque}">
            `);
        if (!qtdEstoque){
            resp.write(`
                <div>
                    <span><p class="text-danger">Por favor, informe a Quantidade de Estoque!</p></span>
                </div>
                `);
        }
            resp.write(`
                </select>
            </div>
            <div class="mb-3">
                <label for="fabricante" class="form-label">Nome do Fabricante</label>
                <input type="text" class="form-control" id="fabricante" name="fabricante" value="${fabricante}">
            `);
        if (!fabricante){
            resp.write(`
                <div>
                    <span><p class="text-danger">Por favor, informe o Nome do Fabricante!</p></span>
                </div>
                `);
        }
            resp.write(`
                </div>
            <div class="mb-3">
                <button class="btn btn-primary" type="submit">Cadastrar</button>
            </div>
            </form>
        </div>
            <div class="mb-3">
             ${mensagemUltimoLogin}
            </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html> `);

    } 

    resp.end();
}

function autenticarUsuario(req, resp) {
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    console.log("Usuário enviado:", usuario);
    console.log("Senha enviada:", senha);

    if (usuario === 'admin' && senha === '1234') {
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

app.get('/login', (req, resp) =>{
    resp.redirect('/login.html');
});

app.get('/logout', (req, resp) => {
    req.session.destroy(); 
    resp.redirect('/login.html');
});
app.post('/login', autenticarUsuario);
app.get('/',verificarAutenticacao,menuView);
app.get('/cadastrarProduto', verificarAutenticacao,cadastrarProdutoView);
app.post('/cadastrarProduto', verificarAutenticacao, cadastrarProduto);

app.listen(porta, host, () => {
    console.log(`Servidor iniciado em execução no endereço http://${host}:${porta}`);
});