const express = require('express'),
    app = express(),
    fs = require('fs'),
    _ = require('underscore');

let db = {
};

app.set('view engine', 'hbs');
app.set('views',`${__dirname}/views`)

db.jogadores =JSON.parse(fs.readFileSync(`${__dirname}/data/jogadores.json`, "utf8"));
db.jogosPorJogador =JSON.parse(fs.readFileSync(`${__dirname}/data/jogosPorJogador.json`, "utf8"));
app.get('/', function (req, res) {
  res.render('index',db.jogadores);
})

app.get('/jogador/:numero_identificador', function (req, res) {
 let numero_identificador= req.params.numero_identificador
 let jogosDesteJogador = db.jogosPorJogador[numero_identificador].games;
  let naoJogados = _.where(jogosDesteJogador,
    { playtime_forever: 0 });
  let ordenadoDesc = _.sortBy(jogosDesteJogador, function(jogo) {
    return -jogo.playtime_forever;
  });
  var primeiros5 = _.first(ordenadoDesc, 5);
  let jogador = _.find(db.jogadores.players, function(j) {
    return j.steamid===numero_identificador;
    });
    primeiros5.map(jogo=>  jogo.playtime_forever = (jogo.playtime_forever/60).toFixed(0));
  res.render('jogador',{
    jogador:jogador,
    naoJogados: naoJogados,
    primeiros5: primeiros5,
    jogosDesteJogador:ordenadoDesc
  });
})

app.use(express.static(`${__dirname}/../client`));

const server = app.listen(3000, () => {
  console.log('Escutando em: http://localhost:3000');
});
