export interface PostFuncionario {
  nome: string;
  telefone: string;
  matricula: string;
  login: string;
  senha: string;
  area: string;
}

export interface DadosFuncionarios {
  area: string;
  createAt: string;
  isDemitido: boolean;
  login: string;
  matricula: string;
  nome: string;
  senha: string;
  telefone: string;
  id: number;
}

export interface DadosCracha {
  devEUI: string;
  nome: string;
  applicationID: number;
  description: string;
  deviceProfileID: string;
  modelo: string;
  isDisabled: boolean;
  createdAt: Date;
}

export interface DadosSemRelacao {
  funcionarios: Array<DadosFuncionarios>;
  crachas: Array<DadosCracha>;
}

export interface DataLocalizacao {
  id: number;
  nome: string;
  tipo: area;
}

export interface DataGetFeature {
  type: string;
  features: Array<any>;
  totalFeatures: number;
}

export interface DataBigDataStatus {
  total: Array<{ count: string }>;
  areas: Record<string, { id: number; count: string }>;
}

export interface BodyBigData {
  areas: Array<number | string>;
}

export interface LocationData {
  id: number;
  nome: string;
  descricao: string;
  localizacao: Array<any>;
}

export interface DataPanicWs {
  func: string;
  args: {
    message: {
      localizacao: [number, number];

      bateria: number;
      cracha: string;
      date: string;
      vinculado: boolean;
      nome_funcionario: string;
    };
  };
}

export interface Panics {
  id: number;
  cracha: string;
  tratado: boolean;
  localizacao: [number, number];
  date: string;
  vinculado?: boolean;
  funcionario: string;
}

export interface DataPanics {
  id: number;
  nome_funcionario: string;
  identificador_cracha: string;
  bateria: number;
  origem: string;
  localizacao: [number, number];
  data: string;
  area: string;
  telefone: string;
  tratado: boolean;
  buffered: number;
}

export interface BodyPanics {
  areas: Array<number>;
  funcionarios: Array<number>;
}

export interface BodyDataStatus {
  areas: Array<number | string>;
}

export interface DataDataStatus {
  id: number;
  nome_funcionario: string;
  identificador_cracha: string;
  bateria: number;
  spread_factor: number | null;
  frequency: number;
  origem: string;
  band_width_lora: number | null;
  gateway_id: string;
  gateway_eui: string;
  distancia: number;
  localizacao: string;
  altitude: number;
  velocidade: number;
  acuracia: number;
  direcao: number;
  date: string;
  snr: number;
  rssi: number;
  buffered: boolean;
  areas: { f1: number; f2: string }[];
}

export interface DataDataStatusTratada {
  id: number;
  nome_funcionario: string;
  identificador_cracha: string;
  bateria: number;
  spread_factor: number | null;
  frequency: number;
  origem: string;
  band_width_lora: number | null;
  gateway_id: string;
  gateway_eui: string;
  distancia: number;
  localizacao: string;
  altitude: number;
  velocidade: number;
  acuracia: number;
  direcao: number;
  date: string;
  snr: number;
  rssi: number;
  buffered: boolean;
  areas: Record<string, number>;
}
