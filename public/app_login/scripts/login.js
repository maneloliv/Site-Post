const LOGIN_URL = "login.html";
const apiUrlUsuarios = '/usuarios';
const apiUrlPosts = '/posts';


// Inicializa db_usuarios e db_posts como arrays vazios para evitar erros
var db_usuarios = [];
var db_posts = [];

// Objeto para o usuário corrente
var usuarioCorrente = {};

// Função para gerar códigos randômicos
function generateUUID() { 
    var d = new Date().getTime();
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// Inicializa o usuarioCorrente e banco de dados de usuários
function initLoginApp() {
    usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON) {
        usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    }

    // Carrega dados de usuários da API JSONServer
    fetch(apiUrlUsuarios)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar dados de usuários");
            }
            return response.json();
        })
        .then(data => {
            db_usuarios = data;
            console.log("Usuários carregados:", db_usuarios);
        })
        .catch(error => {
            console.error('Erro ao carregar usuários:', error);
        });

    // Carrega dados de posts da API JSONServer
    fetch(apiUrlPosts)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar dados de posts");
            }
            return response.json();
        })
        .then(data => {
            db_posts = data;
            console.log("Posts carregados:", db_posts);
        })
        .catch(error => {
            console.error('Erro ao carregar posts:', error);
        });
}

// Verifica login do usuário
function loginUser(login, senha) {
    for (var i = 0; i < db_usuarios.length; i++) {
        var usuario = db_usuarios[i];
        if (login === usuario.login && senha === usuario.senha) {
            usuarioCorrente = { id: usuario.id, login: usuario.login, email: usuario.email, nome: usuario.nome };
            sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
            return true;
        }
    }
    return false;
}

// Apaga dados do usuário corrente no sessionStorage
function logoutUser() {
    usuarioCorrente = {};
    sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
    window.location = LOGIN_URL;
}

// Adiciona um novo usuário
function addUser(nome, login, senha, email) {
    let usuario = { "id": generateUUID(), "login": login, "senha": senha, "nome": nome, "email": email };
    fetch(apiUrlUsuarios, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
    })
    .then(response => {
        console.log("Resposta ao adicionar usuário:", response);
        if (!response.ok) {
            throw new Error("Erro ao inserir usuário");
        }
        return response.json();
    })
    .then(data => {
        db_usuarios.push(data); // Aqui adiciona a resposta da API ao `db_usuarios`
        console.log("Usuário adicionado:", data);
        alert("Usuário inserido com sucesso");
    })
    .catch(error => {
        console.error('Erro ao inserir usuário:', error);
        alert("Erro ao inserir usuário");
    });
}

// Adiciona um novo post
function addPost(url, descricao) {
    let post = { "id": generateUUID(), "url": url, "descricao": descricao };
    fetch(apiUrlPosts, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
    })
    .then(response => {
        console.log("Resposta ao adicionar post:", response);
        if (!response.ok) {
            throw new Error("Erro ao inserir post");
        }
        return response.json();
    })
    .then(data => {
        db_posts.push(data); // Adiciona o post retornado pela API
        console.log("Post adicionado:", data);
        alert("Post inserido com sucesso");
    })
    .catch(error => {
        console.error('Erro ao inserir post:', error);
        alert("Erro ao inserir post");
    });
}


// Inicializa a aplicação de login
initLoginApp();
