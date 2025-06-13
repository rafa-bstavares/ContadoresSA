import {google} from "googleapis"
import { OAuth2Client } from 'google-auth-library';

export async function accessSpreadsheet(): Promise<any[][] | null | undefined> {
    // Configurar autenticação com a conta de serviço
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json', // Substitua pelo caminho para seu arquivo de credenciais JSON
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  
    // Obter o cliente autenticado
    const client = await auth.getClient() as OAuth2Client;
  
    // Crie uma instância da API Google Sheets
    const sheets = google.sheets({ version: 'v4', auth: client });
  
    // ID da sua planilha (pode ser encontrado na URL da planilha)
    const spreadsheetId: string = '1iks79VnQdzTX-W8XMHCG42WR3dMAHUCJwX4tTrzYs9I';
  
    // Defina o intervalo que deseja ler, por exemplo, 'Sheet1!A1:D10'
    const range: string = 'Página1!A1:F100';
  
    // Ler os valores da planilha
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
  
    const rows = response.data.values;
    if (rows && rows.length > 0) {
      console.log('Dados da planilha:');
      
      rows.forEach((row: any[]) => {
        console.log(row);
      });


      return rows

    } else {
      console.log('Nenhum dado encontrado.');
    }
  }
  
  accessSpreadsheet().catch(console.error);