# Campo Minado

Jogo do campo minado feito com HTML, CSS e JavaScript puro. A lógica do tabuleiro ficou separada da interface, o que facilita testar e ajustar as regras.

## Como jogar

- Escolha a dificuldade: fácil (8×8 e 10 minas), médio (10×10 e 20 minas) ou difícil (12×12 e 30 minas).
- Clique em uma célula para abri-la. A primeira jogada nunca cai em uma mina e sempre abre uma área segura.
- Use o clique direito para marcar uma mina. No celular, ative o botão **Marcar minas** e toque nas células.
- Você vence ao abrir todas as células sem mina. O tempo e o número de jogadas aparecem no painel.

## Rodando localmente

Abra o `index.html` no navegador. Para servir via HTTP:

```bash
npx serve .
```

Depois acesse `http://localhost:3000`.

## Publicando no GitHub Pages

O repositório já publica a branch `main` na raiz. O site fica disponível em `https://bypaulohx.github.io/Campo-Minado/`.

## Estrutura

```
.
├── assets/images/  ícone da página
├── css/
│   ├── base.css    variáveis, reset e botões
│   └── game.css    painel, tabuleiro, células e responsividade
├── js/
│   ├── data.js     níveis de dificuldade
│   ├── game.js     regras do jogo e estado do tabuleiro
│   ├── ui.js       renderização do tabuleiro e do painel
│   └── app.js      eventos, cronômetro e controle da partida
├── index.html
└── README.md
```

## Tecnologias

HTML semântico, CSS com variáveis e media queries, JavaScript com classes e DOM API. Ícones do Bootstrap Icons e fonte Inter do Google Fonts.

Projeto feito para estudo.

---

Paulo Henrique · [GitHub](https://github.com/Bypaulohx)
