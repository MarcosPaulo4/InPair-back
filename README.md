# 📱 InPair

![GitHub repo size](https://img.shields.io/github/repo-size/iuricode/README-template?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/iuricode/README-template?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/iuricode/README-template?style=for-the-badge)
![Bitbucket open issues](https://img.shields.io/bitbucket/issues/iuricode/README-template?style=for-the-badge)
![Bitbucket open pull requests](https://img.shields.io/bitbucket/pr-raw/iuricode/README-template?style=for-the-badge)

---

## 🇧🇷 Descrição em Português

**InPair é umn projeto feito para estudos de tecnologias**

**InPair** é uma rede social privada focada em conectar pequenos grupos de até 4 pessoas. A proposta é oferecer uma experiência mais íntima e reservada, com recursos como feed, stories, chats e interações típicas de redes sociais, mas em um ambiente fechado. 

Cada grupo possui seu próprio espaço com conteúdos e conversas separados, promovendo **privacidade** e **liberdade** nas interações.

---

## 🇺🇸 Description in English

**InPair** is a private social network designed to connect small groups of up to 4 people. It offers a more intimate and secure experience, featuring feeds, stories, chats, and typical social media interactions — all within a closed environment.

Each group has its own space for content and conversation, ensuring **privacy** and **freedom** in the way users interact.

---

## Funcionalidades e próximos passos

O projeto ainda está em desenvolvimento. As próximas melhorias incluem:

- [x] Setup inicial
- [x] Autenticação e Guards
- [x] Register e login module
- [ ] Invite module
- [ ] Chat em tempo real
- [ ] Feed personalizado

---

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/InPair-back.git
cd InPair-back
yarn # ou npm install / pnpm install / bun install

```

---

## Uso
Execute o ambiente de desenvolvimento com:

```
yarn dev
# ou
npm run dev
# ou
pnpm dev
# ou
bun dev
```

---

## Tech Stack 

<ul>    
<li><strong>Database:</strong> PostgreSQL</li>
<li><strong>Auth:</strong> JWT + Cookies</li> 
<li><strong>Realtime:</strong> WebSocket</li>
<li><strong>Container:</strong> Docker</li> 
</ul>


## Why this Techs ? 
<p>
  <strong>JWT + Cookies:</strong><br />
  Para autenticação, usei <code>JWT</code> com armazenamento em <code>Cookies HTTP-only</code> para maior segurança, evitando exposição do token no <code>localStorage</code> e reduzindo riscos com XSS.
</p>

<p>
  <strong>Bcrypt:</strong><br />
  Utilizei <code>bcrypt</code> para o hash das senhas por ser a biblioteca mais consolidada e amplamente usada no mercado. Ela é segura, confiável e fácil de usar.
</p>

<p>
  <strong>Docker:</strong><br />
  Contêineres garantem que o ambiente de desenvolvimento seja o mesmo em todas as máquinas.
</p>

<p>
  <strong>WebSocket:</strong><br />
  A troca de mensagens em tempo real entre os pares é essencial na proposta da InPair. <code>WebSocket</code> permite essa comunicação bidirecional com baixa latência.
</p>
---
