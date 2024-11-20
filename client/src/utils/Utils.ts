import axios from 'axios';

class Utils {

    static apenasNumeros(value: string) {
        if (!value) {
            return "";
        }
        value = value.replace(/([^\d])+/gim, '');
        return value;
    };

    static numerosStringBr2CasasDecimais(value: string) {
        if (!value) {
            return "";
        }
        if (value === "") {
            return "0,00"
        }
        const partInteira = this.apenasNumeros(value.split(",")[0]);
        if (partInteira === "") {
            return partInteira;
        }
        const partDecimal = value.split(",")[1];
        value = this.apenasNumeros(value);
        if (partDecimal === "") {
            return parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ",";
        } else if (!partDecimal) {
            return parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        } else {
            if (this.apenasNumeros(partDecimal).length > 2) {
                return parseFloat(partInteira).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + "," + this.apenasNumeros(partDecimal).substring(0, 2);
            }
            return parseFloat(partInteira).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + "," + this.apenasNumeros(partDecimal);
        }
    };

    static numerosStringBr3CasasDecimais(value: string) {
        if (!value) {
            return "";
        }
        if (value === "") {
            return "0,000"
        }
        const partInteira = this.apenasNumeros(value.split(",")[0]);
        if (partInteira === "") {
            return partInteira;
        }
        const partDecimal = value.split(",")[1];
        value = this.apenasNumeros(value);
        if (partDecimal === "") {
            return parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 3 }) + ",";
        } else if (!partDecimal) {
            return parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 3 });
        } else {
            if (this.apenasNumeros(partDecimal).length > 3) {
                return parseFloat(partInteira).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 3 }) + "," + this.apenasNumeros(partDecimal).substring(0, 3);
            }
            return parseFloat(partInteira).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 3 }) + "," + this.apenasNumeros(partDecimal);
        }
    };

    static validarCNPJ(cnpj: string) {
        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj == '') {
            return false;
        }

        if (cnpj.length != 14) {
            return false;
        }

        if (cnpj == "00000000000000" ||
            cnpj == "11111111111111" ||
            cnpj == "22222222222222" ||
            cnpj == "33333333333333" ||
            cnpj == "44444444444444" ||
            cnpj == "55555555555555" ||
            cnpj == "66666666666666" ||
            cnpj == "77777777777777" ||
            cnpj == "88888888888888" ||
            cnpj == "99999999999999") {
            return false;
        }

        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += Number(numeros.charAt(tamanho - i)) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != Number(digitos.charAt(0))) {
            return false;
        }

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += Number(numeros.charAt(tamanho - i)) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != Number(digitos.charAt(1))) {
            return false;
        }
        return true;
    };

    static viaCep(cep: string) {
        return `https://viacep.com.br/ws/${this.apenasNumeros(cep)}/json/`;
    }

    static validarCPF(strCPF: string) {
        let Soma: number;
        let Resto: number;
        Soma = 0;
        if (!strCPF ||
            strCPF.length != 11 ||
            strCPF == "00000000000" ||
            strCPF == "11111111111" ||
            strCPF == "22222222222" ||
            strCPF == "33333333333" ||
            strCPF == "44444444444" ||
            strCPF == "55555555555" ||
            strCPF == "66666666666" ||
            strCPF == "77777777777" ||
            strCPF == "88888888888" ||
            strCPF == "99999999999") return false;

        for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10))) return false;

        Soma = 0;
        for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(strCPF.substring(10, 11))) return false;
        return true;
    }

    static ESTADOS() {
        return [{
            "ID": "12",
            "Sigla": "AC",
            "Nome": "Acre",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "27",
            "Sigla": "AL",
            "Nome": "Alagoas",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "16",
            "Sigla": "AP",
            "Nome": "Amapá",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "13",
            "Sigla": "AM",
            "Nome": "Amazonas",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "29",
            "Sigla": "BA",
            "Nome": "Bahia",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "23",
            "Sigla": "CE",
            "Nome": "Ceará",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "53",
            "Sigla": "DF",
            "Nome": "Distrito Federal",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "32",
            "Sigla": "ES",
            "Nome": "Espírito Santo",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "52",
            "Sigla": "GO",
            "Nome": "Goiás",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "21",
            "Sigla": "MA",
            "Nome": "Maranhão",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "31",
            "Sigla": "MG",
            "Nome": "Minas Gerais",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "50",
            "Sigla": "MS",
            "Nome": "Mato Grosso do Sul",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "51",
            "Sigla": "MT",
            "Nome": "Mato Grosso",
            "prazoCancelamentoNota": "2"
        },
        {
            "ID": "15",
            "Sigla": "PA",
            "Nome": "Pará",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "25",
            "Sigla": "PB",
            "Nome": "Paraíba",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "26",
            "Sigla": "PE",
            "Nome": "Pernambuco",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "22",
            "Sigla": "PI",
            "Nome": "Piauí",
            "prazoCancelamentoNota": "1440"
        },
        {
            "ID": "41",
            "Sigla": "PR",
            "Nome": "Paraná",
            "prazoCancelamentoNota": "168"
        },
        {
            "ID": "33",
            "Sigla": "RJ",
            "Nome": "Rio de Janeiro",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "24",
            "Sigla": "RN",
            "Nome": "Rio Grande do Norte",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "11",
            "Sigla": "RO",
            "Nome": "Rondônia",
            "prazoCancelamentoNota": "720"
        },
        {
            "ID": "14",
            "Sigla": "RR",
            "Nome": "Roraima",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "43",
            "Sigla": "RS",
            "Nome": "Rio Grande do Sul",
            "prazoCancelamentoNota": "168"
        },
        {
            "ID": "42",
            "Sigla": "SC",
            "Nome": "Santa Catarina",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "28",
            "Sigla": "SE",
            "Nome": "Sergipe",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "35",
            "Sigla": "SP",
            "Nome": "São Paulo",
            "prazoCancelamentoNota": "24"
        },
        {
            "ID": "17",
            "Sigla": "TO",
            "Nome": "Tocantins",
            "prazoCancelamentoNota": "24"
        }]
    }

    static REGIOES() {
        return [{
            "ID": "1",
            "Descricao": "Norte"
        },
        {
            "ID": "2",
            "Descricao": "Nordeste"
        },
        {
            "ID": "3",
            "Descricao": "Centro-Oeste"
        },
        {
            "ID": "4",
            "Descricao": "Sudeste"
        },
        {
            "ID": "5",
            "Descricao": "Sul"
        }]
    }

    static async municipiosPorUF(uf: string) {
        const { data } = await axios.create().get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
        return data;
    }

    static mascaraCPF(value: string) {
        if (value.length < 11) {
            return "___.___.___-__";
        }
        return value.slice(0, 3) + "." + value.slice(3, 6) + "." + value.slice(6, 9) + "-" + value.slice(9);
    }

    static formatarCPF(value: string): string {
        return value
            .replace(/\D/g, '') // Remove caracteres não numéricos
            .slice(0, 11) // Garante que o valor tenha no máximo 11 dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Primeiro ponto
            .replace(/(\d{3})(\d)/, '$1.$2') // Segundo ponto
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Hífen
    }

    static mascaraCNPJ(value: string) {
        if (value.length < 14) {
            return "__.___.___/____-__";
        }
        return value.slice(0, 2) + "." + value.slice(2, 5) + "." + value.slice(5, 8) + "/" + value.slice(8, 12) + "-" + value.slice(12);
    }

    static mascaraTelefone(value: string) {
        if (value.length < 10) {
            return "___.___.___-__";
        }
        if (value.length > 10) {
            return "(" + value.slice(0, 2) + ") " + value[2] + " " + value.slice(3, 7) + "-" + value.slice(7);
        }
        return "(" + value.slice(0, 2) + ") " + value.slice(2, 6) + "-" + value.slice(6);
    }

    static maskParaNumerosPtBR(valor: number, precisao: number): string {
        if (typeof valor === "string") {
            valor = parseFloat(valor);
        }
        return valor.toLocaleString('pt-BR', { minimumFractionDigits: precisao, maximumFractionDigits: precisao });
    }

    static maskParaDataPtBR(data: Date): string {
        if (typeof data === "string") {
            const arr = (data as string).split("-");
            data = new Date(+arr[0], (+arr[1]) - 1, +arr[2]);
        }
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    static validarTelefones(tel: string, tipo: string) {
        if ((!tel) || tel === "" || tel.length == 0) {
            return true;
        }
        const number = this.apenasNumeros(tel);
        if (tipo === "cel") {
            return number.length == 11 || number.length == 0;
        } else if (tipo === "fixo") {
            return number.length == 10 || number.length == 0;
        } else {
            return number.length == 11 || number.length == 10 || number.length == 0;
        }
    }

    static formataDataParaDataPtBR(data: string): string {
        if (data) {
            return new Date(data).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
        return new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    static ajustarCasasDecimais(number: string) {
        let numbers = number.split('.');
        if (!numbers[1]) {
            numbers = number.split(',');
        }
        if (!(numbers[1] && numbers[1]?.length > 3)) {
            return number;
        }
        return numbers[0] + "," + numbers[1]?.substring(0, 3);
    }

    static retornaMaterialPorCodigoNcm(codigo: string): string {
        const ncmInt = parseInt(codigo.substring(0, 2), 10);

        const materialMap: [number[], string][] = [
            [[72, 73, 74, 75, 76, 78, 79, 80, 81, 82, 83, 33], "METAIS"],
            [[47, 48, 49], "PAPEL"],
            [[39, 40], "PLÁSTICO"],
            [[70], "VIDRO"]
        ];

        for (const [keys, grupoMaterial] of materialMap) {
            if (keys.includes(ncmInt)) {
                return grupoMaterial;
            }
        }

        return "OUTROS";
    }

}
export default Utils;