export interface PostFuncionario{ 
    nome:string, 
    telefone:string, 
    matricula:string, 
    login:string, 
    senha:string, 
    area:string 
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

export interface DadosCracha{
    devEUI:  string,
	nome :  string ,
	applicationID : number,
	description :  string,
	deviceProfileID :  string ,
	modelo :  string ,
	isDisabled : boolean,
	createdAt :  Date 
}

export interface DadosSemRelacao{
    funcionarios:Array<DadosFuncionarios>,
    crachas:Array<DadosCracha>

}