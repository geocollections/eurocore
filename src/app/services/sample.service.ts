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

}
