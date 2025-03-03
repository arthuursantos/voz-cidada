<h1 align="center" style="font-weight: bold;">Voz Cidadã 🏙️</h1>
<p align="center">
    <b>Em desenvolvimento!</b>
</p>

<p align="center">
 <a href="#sobre">Sobre o projeto</a> • 
 <a href="#stack">Stack</a> • 
 <a href="#how">Como usar</a> • 
 <a href="#routes">Endpoints</a>
</p>

<h2 id="sobre">📜 Sobre o projeto</h2>

Esse repositório acompanha o desenvolvimento do meu TCC como técnico em informática na FIEC, Indaiatuba.
O projeto consiste em um sistema onde os usuários possam abrir denúncias para resolver problemas de infraestrutura municipais.
Um usuário administrador é responsável por manipular as denúncias e prosseguir com o atendimento.

<h2 id="stack">💻 Stack</h2>

- Java & Spring Boot
- PostgreSQL
- TypeScript & React

<h2 id="how">🚀 Como usar o sistema?</h2>

<h3>Requisitos</h3>

O que você precisa para rodar o projeto localmente:

- [Git](https://git-scm.com/downloads/win)
- [Docker](https://github.com/)

<h3>Clone & Docker</h3>

Clone o projeto: 

```bash
git clone https://github.com/arthuursantos/voz-cidada.git
```

Para iniciar os containers:

```bash
cd voz-cidada
docker compose up --build
```

<h2 id="routes">📍 Auth Endpoints</h2>

Esses são os endpoints para você se autenticar e acessar os recursos do sistema.

<h3 id="get-auth-detail">POST /auth/register</h3>

O campo "role" não é definitivo, por enquanto facilita o desenvolvimento. Ele pode ser preenchido com USER ou ADMIN.

**REQUEST**
```json
{
  "login": "arthur",
  "password": "minhasenha",
  "role": "USER"
}
```

<h3 id="post-auth-detail">POST /auth/login</h3>

**REQUEST**
```json
{
  "username": "arthur",
  "password": "minhasenha"
}
```