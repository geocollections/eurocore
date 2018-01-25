import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Jsonp, JsonpModule } from '@angular/http';

import { Analysis } from '../analysis';
import { AnalysisResult } from '../analysis-result';
import { AnalysisSummary } from '../analysis-summary';

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
    return this.http.jsonp<Analysis[]>('http://api.eurocore.rocks/analysis/?format=jsonp&order_by=depth&multi_search=value:'+id+';fields:drillcore__id,sample__drillcore__id&paginate_by=2000',"callback").pipe();
  }

  getAnalysisSepectrumEnergyRanges(id:string):Observable<String[]>{
    return this.http.jsonp<String[]>('http://api.eurocore.rocks/spectrum/?analysis__id=2000000&distinct=true&fields=energy_range__value&format=jsonp',"callback").pipe();    
  }

  getAnalysisSpectrumData(id: string):Observable<String[]>{
    return this.http.jsonp<String[]>('http://api.eurocore.rocks/spectrum/?analysis__id=2000000&format=jsonp',"callback").pipe();    
  }

  getAnalysisSummary(id:string):Observable<AnalysisSummary[]>{
    //return this.http.jsonp<AnalysisSummary[]>('http://api.eurocore.rocks/analysis_summary/?format=jsonp&drillcore_id='+id+'&or_search=analysis_method:ICP-OES;analysis_method:FA-AAS&fields=au_ppm,cu_pct,co_pct,zn_pct,depth,end_depth,analysis_id,sample_id,sample_number,analysis_method&order_by=depth', 'callback').pipe();
    //return this.http.jsonp<AnalysisSummary[]>('http://api.eurocore.rocks/analysis_summary/?paginate_by=400&drillcore_id='+id+'&analysis_method__iexact=FA-AAS&fields=au_ppm,cu_pct,co_pct,zn_pct,depth,end_depth,analysis_id,sample_id,sample_number,analysis_method&order_by=depth&format=jsonp', 'callback').pipe();
    return this.http.jsonp<AnalysisSummary[]>('http://api.eurocore.rocks/analysis_summary/?paginate_by=400&drillcore_id='+id+'&analysis_method__iexact=ICP-OES&fields=s_pct,ni_pct,fe_pct,au_ppm,cu_pct,co_pct,zn_pct,depth,end_depth,analysis_id,sample_id,sample_number,analysis_method&order_by=depth&format=jsonp', 'callback').pipe();
  }

  getAnalysisSummaryData(id:string):Observable<AnalysisSummary[]>{ 
    return this.http.jsonp<AnalysisSummary[]>('http://api.eurocore.rocks/analysis_summary/?drillcore_id='+id+'&order_by=depth&format=jsonp&paginate_by=10000', 'callback').pipe();
  }
}
