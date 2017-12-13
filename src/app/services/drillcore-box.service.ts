import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Jsonp, JsonpModule } from '@angular/http';

import {DrillcoreBox} from '../drillcoreBox';

@Injectable()
export class DrillcoreBoxService {

  constructor(private http: HttpClient, private jsonp: Jsonp) { }

  getDrillcoreBoxesByDrillcoreId(id: string): Observable<DrillcoreBox>{
    return this.http.jsonp<DrillcoreBox>('http://api.eurocore.rocks/drillcore_box/?drillcore__id__icontains='+id+'&format=jsonp',"callback").pipe();
  }
}
