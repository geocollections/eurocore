import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Jsonp, JsonpModule } from '@angular/http';

import { Site } from '../site';

@Injectable()
export class SiteService { 

  results: Site[] ;
  searchResults: Site[];
  searchCriteria: string;

  constructor( private http: HttpClient, private jsonp: Jsonp) { } 
 
  getSites(): Observable<Site[]> {  

    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?format=jsonp',"callback").pipe();
  } 

  
  searchDrillcoreByName(name: string): Observable<Site[]> { 
    if (!name.trim()) {
      return of([]);
    }
    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?format=jsonp&fields=name&name__icontains='+name,"callback").pipe();
  }
  searchDepositByName(name: string): Observable<Site[]> { 
    if (!name.trim()) {
      return of([]);
    }
    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?format=jsonp&multi_search=value:'+name+';fields:deposit__name,deposit__alternative_names;lookuptype:icontains&fields=deposit__name,deposit__alternative_names&group_by=deposit__name&group_by=deposit__alternative_names',"callback").pipe();
  }
  searchOreTypeByName(name: string): Observable<Site[]> { 
    if (!name.trim()) {
      return of([]);
    }
    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/ore_genetic_type/?format=jsonp&fields=name&name__icontains='+name,"callback").pipe();
  }

  searchCoreDepositorByName(name: string): Observable<Site[]>{
    if (!name.trim()) {
      return of([]);
    }
    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?format=jsonp&fields=core_depositor__name&core_depositor__name__icontains='+name+'&group_by=core_depositor__name',"callback").pipe();
  }

  searchSites(name: string, deposit: string, oreType: string, commodity: string, coreDepositorName: string, page=1): Observable<Site[]> { 
    this.searchCriteria="";
    if(name!=""){
      this.searchCriteria+='&name__icontains='+name;
    }
    if(deposit!=""){
      this.searchCriteria+='&multi_search=value:'+deposit+';fields:deposit__name,deposit__alternative_names;lookuptype:icontains';
    }
    if(oreType!=""){
      this.searchCriteria+='&deposit__genetic_type__name__icontains='+oreType;
    }
    if(commodity!=""){
      this.searchCriteria+='&multi_search=value:'+commodity+';fields:deposit__main_commodity,deposit__other_commodities;lookuptype:icontains';
    }
    if(coreDepositorName!=""){
      this.searchCriteria+='&core_depositor__name__icontains='+coreDepositorName;
    }

    /*if(siteType!=""){
      this.searchCriteria+='&site_type__site_type__iexact='+siteType;
    }*/
    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?format=jsonp'+this.searchCriteria+'&paginate_by=10&page='+page,"callback").pipe();
  }

  searchSiteById(id: string): Observable<Site>{
    return this.http.jsonp<Site>('http://api.eurocore.rocks/drillcore/'+id+'?format=jsonp',"callback").pipe();
  }


  searchDrillcoresByNames(names: string[]): Observable<Site[]>{
    this.searchCriteria="";
    
    if(names.length!=0){
      this.searchCriteria+="or_search=";
      for(var i=0;i<names.length;i++){
        this.searchCriteria+="name__icontains:"+names[i];
        if(names.length-i>1)
        this.searchCriteria+=";";
      }
    }
    console.log(this.searchCriteria);
    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?format=jsonp&'+this.searchCriteria,"callback").pipe();
    //return null; 
  }

  searchMapSites(name: string, deposit: string, oreType: string, commodity: string, coreDepositorName: string): Observable<Site[]> {
    this.searchCriteria="";
    if(name!=""){
      this.searchCriteria+='&name__icontains='+name;
    }
    if(deposit!=""){
      this.searchCriteria+='&multi_search=value:'+deposit+';fields:deposit__name,deposit__alternative_names;lookuptype:icontains';
    }
    if(oreType!=""){
      this.searchCriteria+='&deposit__genetic_type__name__icontains='+oreType;
    }
    if(commodity!=""){
      this.searchCriteria+='&multi_search=value:'+commodity+';fields:deposit__main_commodity,deposit__other_commodities;lookuptype:icontains';
    }
    if(coreDepositorName!=""){
      this.searchCriteria+='&core_depositor__name__icontains='+coreDepositorName;
    }
    
    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?format=jsonp'+this.searchCriteria+'&fields=name,longitude,latitude',"callback").pipe();
  }



 

}
