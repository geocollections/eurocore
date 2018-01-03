import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Jsonp, JsonpModule } from '@angular/http';

import {DrillcoreBox} from '../drillcoreBox';

@Injectable()
export class DrillcoreBoxService {

  constructor(private http: HttpClient, private jsonp: Jsonp) { }

  getDrillcoreBoxesByDrillcoreId(id: string, paginateBy: number, pageNr: number): Observable<DrillcoreBox>{
    //return this.http.jsonp<DrillcoreBox>('http://api.eurocore.rocks/drillcore_box/?drillcore__id__icontains='+id+'&format=jsonp',"callback").pipe();
    return this.http.jsonp<DrillcoreBox>('http://api.eurocore.rocks/drillcore_box/?drillcore__id__iexact='+id+'&paginate_by='+paginateBy+'&page='+pageNr+'&format=jsonp',"callback").pipe();
  }

  getDrillcoreBoxById(id: string): Observable<DrillcoreBox>{
    return this.http.jsonp<DrillcoreBox>('http://api.eurocore.rocks/drillcore_box/'+id+'?format=jsonp',"callback").pipe();
  }
}
