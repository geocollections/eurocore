import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Jsonp, JsonpModule } from '@angular/http';

import { Deposit } from '../deposit';

@Injectable()
export class DepositService {

  constructor(private http: HttpClient, private jsonp: Jsonp) { }

  searchDepositById(id: string): Observable<Deposit>{
    
    return this.http.jsonp<Deposit>('http://api.eurocore.rocks/deposit/'+id+'?format=jsonp',"callback").pipe();
  }

}
