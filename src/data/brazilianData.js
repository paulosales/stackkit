// Realistic mock data for Brazilian person & address generation

export const firstNamesMale = [
  'Lucas', 'Gabriel', 'Matheus', 'Arthur', 'Guilherme', 'Felipe', 'Gustavo', 'Pedro',
  'Bernardo', 'Enzo', 'Leonardo', 'Thiago', 'Rafael', 'Bruno', 'Rodrigo', 'Eduardo',
  'Henrique', 'Diego', 'Vinicius', 'Caio', 'Daniel', 'Marcelo', 'Carlos', 'Andre',
  'Joao', 'Vitor', 'Igor', 'Murilo', 'Samuel', 'Renan', 'Alexandre', 'Fernando'
];

export const firstNamesFemale = [
  'Julia', 'Sophia', 'Isabella', 'Manuela', 'Giovanna', 'Alice', 'Laura', 'Beatriz',
  'Mariana', 'Leticia', 'Larissa', 'Camila', 'Carolina', 'Amanda', 'Bruna', 'Bianca',
  'Gabriela', 'Helena', 'Fernanda', 'Luiza', 'Isadora', 'Rafaela', 'Natalia', 'Debora',
  'Vanessa', 'Priscila', 'Renata', 'Juliana', 'Jessica', 'Tatiane', 'Aline', 'Patricia'
];

export const lastNames = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
  'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes',
  'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade',
  'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Ramos',
  'Goncalves', 'Santana', 'Teixeira', 'Araujo', 'Moura', 'Cavalcanti', 'Pinto', 'Castro'
];

export const statesAndCities = [
  {
    uf: 'SP',
    name: 'São Paulo',
    ddd: ['11', '12', '13', '14', '15', '16', '17', '18', '19'],
    cities: [
      { name: 'São Paulo', cepPrefix: '01310', neighborhoods: ['Bela Vista', 'Pinheiros', 'Moema', 'Vila Mariana', 'Tatuapé', 'Itaim Bibi'] },
      { name: 'Campinas', cepPrefix: '13010', neighborhoods: ['Cambuí', 'Taquaral', 'Barão Geraldo', 'Castelo', 'Nova Campinas'] },
      { name: 'Santos', cepPrefix: '11015', neighborhoods: ['Gonzaga', 'Boqueirão', 'Ponta da Praia', 'Embaré'] },
      { name: 'Ribeirão Preto', cepPrefix: '14010', neighborhoods: ['Jardim Paulista', 'Alto da Boa Vista', 'Irajá'] },
      { name: 'Sorocaba', cepPrefix: '18010', neighborhoods: ['Campolim', 'Trujillo', 'Vila Hortência'] }
    ]
  },
  {
    uf: 'RJ',
    name: 'Rio de Janeiro',
    ddd: ['21', '22', '24'],
    cities: [
      { name: 'Rio de Janeiro', cepPrefix: '22041', neighborhoods: ['Copacabana', 'Ipanema', 'Botafogo', 'Tijuca', 'Barra da Tijuca', 'Leblon'] },
      { name: 'Niterói', cepPrefix: '24020', neighborhoods: ['Icaraí', 'Ingá', 'Santa Rosa', 'Charitas'] },
      { name: 'Petrópolis', cepPrefix: '25610', neighborhoods: ['Centro', 'Quitandinha', 'Itaipava'] }
    ]
  },
  {
    uf: 'MG',
    name: 'Minas Gerais',
    ddd: ['31', '32', '33', '34', '35', '37', '38'],
    cities: [
      { name: 'Belo Horizonte', cepPrefix: '30130', neighborhoods: ['Savassi', 'Lourdes', 'Funcionários', 'Buritis', 'Sion'] },
      { name: 'Uberlândia', cepPrefix: '38400', neighborhoods: ['Santa Mônica', 'Tibery', 'Fundinho'] },
      { name: 'Juiz de Fora', cepPrefix: '36010', neighborhoods: ['Granbery', 'São Mateus', 'Cascatinha'] }
    ]
  },
  {
    uf: 'PR',
    name: 'Paraná',
    ddd: ['41', '42', '43', '44', '45', '46'],
    cities: [
      { name: 'Curitiba', cepPrefix: '80010', neighborhoods: ['Batel', 'Água Verde', 'Bigorrilho', 'Cabral', 'Juvevê'] },
      { name: 'Londrina', cepPrefix: '86010', neighborhoods: ['Gleba Palhano', 'Centro', 'Jardim Higienópolis'] },
      { name: 'Maringá', cepPrefix: '87013', neighborhoods: ['Zona 01', 'Zona 07', 'Jardim Alvorada'] }
    ]
  },
  {
    uf: 'RS',
    name: 'Rio Grande do Sul',
    ddd: ['51', '53', '54', '55'],
    cities: [
      { name: 'Porto Alegre', cepPrefix: '90010', neighborhoods: ['Moinhos de Vento', 'Petrópolis', 'Menino Deus', 'Bela Vista'] },
      { name: 'Caxias do Sul', cepPrefix: '95010', neighborhoods: ['Lourdes', 'Exposição', 'São Pelegrino'] }
    ]
  },
  {
    uf: 'SC',
    name: 'Santa Catarina',
    ddd: ['47', '48', '49'],
    cities: [
      { name: 'Florianópolis', cepPrefix: '88010', neighborhoods: ['Agronômica', 'Centro', 'Córrego Grande', 'Campeche'] },
      { name: 'Joinville', cepPrefix: '89201', neighborhoods: ['América', 'Atiradores', 'Glória'] },
      { name: 'Blumenau', cepPrefix: '89010', neighborhoods: ['Victor Konder', 'Vila Nova', 'Ponta Aguda'] }
    ]
  },
  {
    uf: 'BA',
    name: 'Bahia',
    ddd: ['71', '73', '74', '75', '77'],
    cities: [
      { name: 'Salvador', cepPrefix: '40010', neighborhoods: ['Pituba', 'Barra', 'Graça', 'Rio Vermelho', 'Ondina'] },
      { name: 'Feira de Santana', cepPrefix: '44001', neighborhoods: ['Kalilândia', 'Santa Mônica', 'Capuchinhos'] }
    ]
  },
  {
    uf: 'PE',
    name: 'Pernambuco',
    ddd: ['81', '87'],
    cities: [
      { name: 'Recife', cepPrefix: '50010', neighborhoods: ['Boa Viagem', 'Graças', 'Espinheiro', 'Casa Forte'] },
      { name: 'Olinda', cepPrefix: '53010', neighborhoods: ['Bairro Novo', 'Casa Caiada', 'Carmo'] }
    ]
  },
  {
    uf: 'CE',
    name: 'Ceará',
    ddd: ['85', '88'],
    cities: [
      { name: 'Fortaleza', cepPrefix: '60010', neighborhoods: ['Aldeota', 'Meireles', 'Varjota', 'Cocó', 'Fátima'] }
    ]
  },
  {
    uf: 'DF',
    name: 'Distrito Federal',
    ddd: ['61'],
    cities: [
      { name: 'Brasília', cepPrefix: '70040', neighborhoods: ['Asa Sul', 'Asa Norte', 'Sudoeste', 'Lago Sul', 'Águas Claras'] }
    ]
  }
];

export const streetTypes = ['Rua', 'Avenida', 'Alameda', 'Travessa', 'Praça'];

export const streetNames = [
  'das Flores', 'Sete de Setembro', 'Quinze de Novembro', 'Tiradentes', 'Brasil',
  'São Paulo', 'Bela Cintra', 'Paulista', 'Rui Barbosa', 'Santos Dumont',
  'Duque de Caxias', 'Getúlio Vargas', 'Amazonas', 'das Palmeiras', 'da Paz',
  'Castro Alves', 'Paraná', 'Minas Gerais', 'Bahia', 'Goiás', 'do Comércio'
];

export const emailDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com.br', 'uol.com.br', 'icloud.com'];

export const zodiacSigns = [
  { name: 'Áries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { name: 'Touro', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { name: 'Gêmeos', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { name: 'Câncer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { name: 'Leão', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { name: 'Virgem', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { name: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { name: 'Escorpião', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { name: 'Sagitário', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  { name: 'Capricórnio', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { name: 'Aquário', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { name: 'Peixes', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 }
];

export function getZodiacSign(day, month) {
  for (const sign of zodiacSigns) {
    if (
      (month === sign.startMonth && day >= sign.startDay) ||
      (month === sign.endMonth && day <= sign.endDay)
    ) {
      return sign.name;
    }
  }
  return 'Capricórnio';
}
