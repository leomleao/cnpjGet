
const mongoose = require('mongoose');

const cnpjSchema = new mongoose.Schema({
  uuid: String,
  status: String,
  ultima_atualizacao: String,
  cnpj: String,   
  tipo: String,   
  abertura: String,  
  nome: String,  
  fantasia: String,
  atividade_principal: {
    code: String,
    text:String
  },
  atividades_secundarias: Array,
  natureza_juridica: String,
  logradouro: String,
  numero: String,
  complemento: String,
  cep: String,
  bairro: String,
  municipio: String,
  uf: String,
  email: String,
  telefone: String,
  efr: String,
  situacao: String,
  data_situacao: String,
  motivo_situacao: String,
  situacao_especial: String,
  data_situacao_especial: String,
  capital_social: String,
  qsa: {
    nome: String,
    qual: String,
    pais_origem: String,
    nome_rep_legal: String,
    qual_rep_legal: String
  }

}, { timestamps: true });


const Cnpj = mongoose.model('Cnpj', cnpjSchema);

module.exports = Cnpj;
