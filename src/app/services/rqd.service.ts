import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Jsonp, JsonpModule } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Rqd } from '../rqd';

@Injectable()
export class RqdService {

  constructor(private http: HttpClient, private jsonp: Jsonp) { }

  getRqdByDrillcoreId(id: string): Observable<Rqd[]>{
    return this.http.jsonp<Rqd[]>('http://api.eurocore.rocks/rqd/?drillcore__id='+id+'&format=jsonp&order_by=depth',"callback").pipe();
  }

}
