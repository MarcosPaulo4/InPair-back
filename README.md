## Project
<h1 align="center">🚀 InPair</h1>
<p align="center">Uma plataforma para conectar pessoas com interesses em comum e promover parcerias de crescimento mútuo.</p>

## Project setup

```bash
$ docker compose up --build
```

## Compile and run the project
```bash
$ docker compose up
```
## Run tests

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
  Contêineres garantem que o ambiente de desenvolvimento seja o mesmo em todas as máquinas. Isso elimina o famoso “na minha máquina funciona” e facilita o deploy em ambientes como Heroku, Render ou servidores próprios.
</p>

<p>
  <strong>WebSocket:</strong><br />
  A troca de mensagens em tempo real entre os pares é essencial na proposta da InPair. <code>WebSocket</code> permite essa comunicação bidirecional com baixa latência.
</p>

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
