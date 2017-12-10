import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Jsonp, JsonpModule } from '@angular/http';

import { Lithology } from '../lithology';

@Injectable()
export class LithologyService {

  constructor(private http: HttpClient, private jsonp: Jsonp) { }

  getLithologyByDrillcoreId(id: string): Observable<Lithology[]>{
    
    return this.http.jsonp<[Lithology]>('http://api.eurocore.rocks/lithology/?format=jsonp&drillcore__id__iexact='+id+'&order_by=start_depth',"callback").pipe();
   
  }
}
