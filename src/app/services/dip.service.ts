import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Jsonp, JsonpModule } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import {Dip} from '../dip';

@Injectable()
export class DipService {

  constructor(private http: HttpClient, private jsonp: Jsonp) { }

  getDipByDrillcoreId(id: string): Observable<Dip[]>{
    return this.http.jsonp<Dip[]>('http://api.eurocore.rocks/dip/?drillcore__id='+id+'&format=jsonp&order_by=depth',"callback").pipe();
  }

}
