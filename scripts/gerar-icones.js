// Usamos @napi-rs/canvas (binário pré-compilado, mesma API do node-canvas)
// porque o pacote "canvas" exige Python + build tools no Windows/Node 24.
const { createCanvas } = require("@napi-rs/canvas");
const fs = require("fs");
const path = require("path");

function gerarIcone(tamanho) {
  const canvas = createCanvas(tamanho, tamanho);
  const ctx = canvas.getContext("2d");

  // Fundo verde
  ctx.fillStyle = "#0F6E56";
  ctx.fillRect(0, 0, tamanho, tamanho);

  // Arredondamento simulado (borda interna branca nos cantos)
  const raio = tamanho * 0.18;
  ctx.beginPath();
  ctx.moveTo(raio, 0);
  ctx.lineTo(tamanho - raio, 0);
  ctx.quadraticCurveTo(tamanho, 0, tamanho, raio);
  ctx.lineTo(tamanho, tamanho - raio);
  ctx.quadraticCurveTo(tamanho, tamanho, tamanho - raio, tamanho);
  ctx.lineTo(raio, tamanho);
  ctx.quadraticCurveTo(0, tamanho, 0, tamanho - raio);
  ctx.lineTo(0, raio);
  ctx.quadraticCurveTo(0, 0, raio, 0);
  ctx.closePath();
  ctx.fillStyle = "#0F6E56";
  ctx.fill();

  // Texto H9 centralizado
  const fonteH9 = Math.round(tamanho * 0.3);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 ${fonteH9}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("H9", tamanho / 2, tamanho * 0.38);

  // Texto MEI no Limite menor abaixo
  const fonteSub = Math.round(tamanho * 0.11);
  ctx.font = `500 ${fonteSub}px Arial`;
  ctx.fillStyle = "#9FE1CB";
  ctx.fillText("MEI no Limite", tamanho / 2, tamanho * 0.65);

  return canvas.toBuffer("image/png");
}

const pub = path.join(process.cwd(), "public");
fs.mkdirSync(pub, { recursive: true });

fs.writeFileSync(path.join(pub, "icon-192.png"), gerarIcone(192));
fs.writeFileSync(path.join(pub, "icon-512.png"), gerarIcone(512));
fs.writeFileSync(path.join(pub, "apple-touch-icon.png"), gerarIcone(180));
console.log("Ícones gerados com sucesso.");
