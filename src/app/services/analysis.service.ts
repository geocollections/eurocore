import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Jsonp, JsonpModule } from '@angular/http';

import { Analysis } from '../analysis';
import { AnalysisResult } from '../analysis-result';

@Injectable()
export class AnalysisService {

  constructor(private http: HttpClient, private jsonp: Jsonp) { }

  getAnalyzesBySampleId(id: string): Observable<Analysis[]>{
    return this.http.jsonp<Analysis[]>('http://api.eurocore.rocks/analysis/?format=jsonp&sample__id__iexact='+id,"callback").pipe();
  }

  getAnalysisById(id: string): Observable<Analysis>{
    return this.http.jsonp<Analysis>('http://api.eurocore.rocks/analysis/'+id+'?format=jsonp',"callback").pipe();
  }

  getAnalysisResultsByAnalysisId(id: string): Observable<AnalysisResult[]>{
    return this.http.jsonp<AnalysisResult[]>('http://api.eurocore.rocks/analysis_result/?format=jsonp&analysis__id__iexact='+id+'&order_by=parameter__parameter',"callback").pipe();
  }

  getAnalyzesByDrillcoreId(id:string): Observable<Analysis[]>{
    return this.http.jsonp<Analysis[]>('http://api.eurocore.rocks/analysis/?format=jsonp&order_by=depth&sample__drillcore__id__iexact='+id,"callback").pipe();
  }

}
