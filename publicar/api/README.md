# API local da Calculadora da Copa 2026

Esta API fornece um snapshot para a calculadora em:

```txt
http://localhost:3000/api/worldcup/2026/snapshot
```

## Como iniciar

```powershell
cd C:\Users\piatuxo\Documents\Codex\2026-06-20\q\api
npm start
```

## Endpoints

```txt
GET /health
GET /api/worldcup/2026/snapshot
GET /api/worldcup/2026/snapshot?refresh=1
POST /api/worldcup/2026/ask
GET /api/worldcup/2026/team/:team/results?limit=10
```

O endpoint `snapshot` busca:

- calendário/resultados da fase de grupos
- fixtures e ratings pré-jogo do World Football Elo Ratings

Ele usa cache por 5 minutos. Use `?refresh=1` para forçar nova busca.

O endpoint `ask` recebe uma pergunta:

```json
{ "question": "Quem lidera o grupo C?" }
```

E responde com base nos resultados e tabelas carregados.

## Integração com a calculadora

O botão **Atualizar agora** no HTML tenta usar esta API local primeiro. Se ela não estiver rodando, a calculadora usa o fallback direto no navegador.
