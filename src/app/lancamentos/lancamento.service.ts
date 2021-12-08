import { Http, Headers, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { format } from 'date-fns';

export class LancamentoFiltro {
  descricao: string;
  dataVencimentoIncio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class LancamentoService {

  lancamentosUrl = 'http://localhost:8080/lancamentos';

  constructor(private http: Http) { }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    const params = new URLSearchParams;
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    params.set('page', filtro.pagina.toString());
    params.set('size', filtro.itensPorPagina.toString());

    if ( filtro.descricao ) {
      params.set('descricao',filtro.descricao);
    }

    if ( filtro.dataVencimentoIncio ) {
      params.set('dataVencimentoDe', format(filtro.dataVencimentoIncio, 'yyyy-MM-dd'))
    }

  if ( filtro.dataVencimentoFim ) {
      params.set('dataVencimentoAte', format(filtro.dataVencimentoFim, 'yyyy-MM-dd'))
    }

    return this.http.get(`${this.lancamentosUrl}?resumo`, { headers, search: params })
      .toPromise()
      .then(response => {
        const responseJson = response.json();
        const lancamentos = responseJson.content;

        const resultado = {
          lancamentos : lancamentos,
          total : responseJson.totalElements
        };
        return resultado;
      })
  }

}
