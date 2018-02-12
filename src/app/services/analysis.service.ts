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
    return this.http.jsonp<String[]>('http://api.eurocore.rocks/spectrum/?analysis__id='+id+'&distinct=true&fields=energy_range__value&format=jsonp',"callback").pipe();    
  }

  getAnalysisSpectrumData(id: string):Observable<String[]>{
    return this.http.jsonp<String[]>('http://api.eurocore.rocks/spectrum/?analysis__id='+id+'&format=jsonp',"callback").pipe();    
  }

  getAnalysisSummary(id:string):Observable<AnalysisSummary[]>{
    //return this.http.jsonp<AnalysisSummary[]>('http://api.eurocore.rocks/analysis_summary/?format=jsonp&drillcore_id='+id+'&or_search=analysis_method:ICP-OES;analysis_method:FA-AAS&fields=au_ppm,cu_pct,co_pct,zn_pct,depth,end_depth,analysis_id,sample_id,sample_number,analysis_method&order_by=depth', 'callback').pipe();
    //return this.http.jsonp<AnalysisSummary[]>('http://api.eurocore.rocks/analysis_summary/?paginate_by=400&drillcore_id='+id+'&analysis_method__iexact=FA-AAS&fields=au_ppm,cu_pct,co_pct,zn_pct,depth,end_depth,analysis_id,sample_id,sample_number,analysis_method&order_by=depth&format=jsonp', 'callback').pipe();
    return this.http.jsonp<AnalysisSummary[]>('http://api.eurocore.rocks/analysis_summary/?paginate_by=400&drillcore_id='+id+'&analysis_method__iexact=ICP-OES&fields=s_pct,ni_pct,fe_pct,au_ppm,cu_pct,co_pct,zn_pct,depth,end_depth,analysis_id,sample_id,sample_number,analysis_method&order_by=depth&format=jsonp', 'callback').pipe();
  }

  getAnalysisSummaryData(id:string):Observable<AnalysisSummary[]>{    
    return this.http.jsonp<AnalysisSummary[]>('http://api.eurocore.rocks/analysis_summary/?drillcore_id='+id+'&order_by=depth&format=jsonp', 'callback').pipe();
  }

  getAnalysesByDepth(startDepth: string, endDepth:string, drillcoreId: string):Observable<Analysis[]>{
    return this.http.jsonp<Analysis[]>('http://api.eurocore.rocks/analysis/?drillcore__id='+drillcoreId+'&depth__range='+startDepth+','+endDepth+'&end_depth__range='+startDepth+','+endDepth+'&format=jsonp&order_by=depth',"callback").pipe(); 
  }

  getAllAnalysesMethods():Observable<String[]>{
    return this.http.jsonp<String[]>('http://api.eurocore.rocks/analysis_summary/?fields=analysis_method&distinct=true&format=jsonp', 'callback').pipe();
  }

  getMeasuredParameters(name: string, methods: string){
    let nameCriteria="";
    let methodCriteria="";
    if(name!="")
    nameCriteria='&drillcore__name='+name;
    if(methods.length!=0)
    methodCriteria='&analysis_method__method__iexact='+methods;

    return this.http.jsonp<String[]>('http://api.eurocore.rocks/analysis/?fields=analysisresult__parameter__parameter,analysisresult__unit__unit&order_by=analysisresult__parameter__parameter&distinct=true&format=jsonp&analysisresult__unit__unit__isnull=false'+nameCriteria+methodCriteria, 'callback').pipe();
  }

  getAnalysesData(id: string, methods: string, parameters: string):Observable<AnalysisSummary[]>{
    let idCriteria="";
    let methodCriteria="";
    let parameterCriteria="";
    if(id!="")
    idCriteria='&drillcore_id='+id;
    if(methods.length!=0)
    methodCriteria='&analysis_method__iexact='+methods;
    if(parameters!="")
    parameterCriteria="&"+parameters;
    return this.http.jsonp<AnalysisSummary[]>('http://api.eurocore.rocks/analysis_summary/?format=jsonp'+idCriteria+methodCriteria+parameterCriteria+'&paginate_by=3000', 'callback').pipe();
  }

  getCTscansByDrillcoreId(id: string):Observable<Analysis[]> {
    return this.http.jsonp<Analysis[]>('http://api.eurocore.rocks/analysis/?drillcore__id='+id+'&analysis_method__method=CT&format=jsonp', 'callback').pipe();
  }
}
