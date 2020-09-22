const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const config = require('config')

const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos

app.use(bodyParser.json())

app.use((requisicao, resposta, proximo) => {
  const formatoRequisitado = requisicao.header('Accept')

  if (formatosAceitos.indexOf(formatoRequisitado) === -1 ) {
    resposta.status(406)
    resposta.end()
  }
  resposta.setHeader('Content-type', formatoRequisitado)
  proximo()

})

const roteador = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)

app.use((erro, requisicao, resposta, proximo) => {
  let status = 500
  if(erro instanceof NaoEncontrado){
    status = 404
  } 
  if(erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos){
    status = 400
  }
  if(erro instanceof ValorNaoSuportado) {
    status = 406
  }
  resposta.status(status)
  
  resposta.send(
    JSON.stringify({
      mensagem: erro.message,
      id: erro.idErro 
    })
  )

})

app.listen (config.get('api.porta'), () => console.log('A Api esta funcionando!'))