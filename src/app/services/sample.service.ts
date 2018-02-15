import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Jsonp, JsonpModule } from '@angular/http';

import { Sample } from '../sample';

@Injectable()
export class SampleService {

  constructor( private http: HttpClient, private jsonp: Jsonp) { }

  searchSampleById(id: string): Observable<Sample>{
    return this.http.jsonp<Sample>('http://api.eurocore.rocks/sample/'+id+'?format=jsonp',"callback").pipe();
  }

  searchSamplesByDrillcoreId(drillcoreId: string): Observable<Sample[]>{
    return this.http.jsonp<Sample[]>('http://api.eurocore.rocks/sample/?format=jsonp&order_by=depth&drillcore__id='+drillcoreId,"callback").pipe();   
  }

  searchSamplesByDepth(startDepth: string, endDepth: string, drillcoreId: string):Observable<Sample[]>{ 
    return this.http.jsonp<Sample[]>('http://api.eurocore.rocks/sample/?drillcore__id='+drillcoreId+'&or_search=depth__range:'+startDepth+','+endDepth+';end_depth__range:'+startDepth+','+endDepth+'&format=jsonp&order_by=depth&paginate_by=1000',"callback").pipe();  
  }

  searchSamplesByIds(id: string[]){
    return this.http.jsonp<Sample>('http://api.eurocore.rocks/sample/?id__in='+id.toString()+'&format=jsonp',"callback").pipe();
  }

}
