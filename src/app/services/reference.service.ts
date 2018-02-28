import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Jsonp, JsonpModule } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import {Reference} from '../reference';

@Injectable()
export class ReferenceService {

  constructor(private http: HttpClient, private jsonp: Jsonp) { }

  getReferencesByDepositId(id: string): Observable<Reference[]>{
    return this.http.jsonp<Reference[]>('http://api.eurocore.rocks/reference/?deposit__id='+id+'&format=jsonp',"callback").pipe();
  }
}
