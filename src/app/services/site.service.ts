import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Jsonp, JsonpModule } from '@angular/http';

import { Site } from '../site';
import { DrillcoreSummary } from '../drillcoreSummary';

@Injectable()
export class SiteService {

  results: Site[];
  searchResults: Site[];
  searchCriteria: string;

  constructor(private http: HttpClient, private jsonp: Jsonp) { }

  getSites(): Observable<Site[]> {

    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?format=jsonp&fields=name,longitude,latitude,id', "callback").pipe();
  }


  searchDrillcoreByName(name: string): Observable<Site[]> {
    if (!name.trim()) {
      return of([]);
    }
    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?format=jsonp&fields=name&name__icontains=' + name, "callback").pipe();
  }
  searchDepositByName(name: string): Observable<Site[]> {
    if (!name.trim()) {
      return of([]);
    } 
    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?fields=deposit__name,deposit__alternative_names&multi_search=value:'+name+';fields:deposit__name,deposit__alternative_names;lookuptype:icontains&format=jsonp&distinct=true&order_by=deposit__name', "callback").pipe();
    //return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?format=jsonp&multi_search=value:' + name + ';fields:deposit__name,deposit__alternative_names;lookuptype:icontains&fields=deposit__name,deposit__alternative_names', "callback").pipe();
  }
  searchOreTypeByName(name: string): Observable<Site[]> {
    if (!name.trim()) {
      return of([]);
    }
    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/ore_genetic_type/?format=jsonp&fields=name&name__icontains=' + name, "callback").pipe();
  }

  searchCoreDepositorByName(name: string): Observable<Site[]> {
    if (!name.trim()) {
      return of([]);
    }
    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?fields=core_depositor__name,core_depositor__acronym&distinct=true&multi_search=value:'+name+';fields:core_depositor__name,core_depositor__acronym;lookuptype:icontains&format=jsonp', "callback").pipe();
    //return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?format=jsonp&multi_search=value:' + name + ';fields:core_depositor__name,core_depositor__acronym;lookuptype:icontains&fields=core_depositor__name,core_depositor__acronym&group_by=core_depositor__name&group_by=core_depositor__acronym', "callback").pipe();
  }

  searchSites(id: string[], name: string, deposit: string, oreType: string, commodity: string, coreDepositorName: string, page = 1): Observable<Site[]> {
    this.searchCriteria = "";
    if (id.length != 0 && id[0] != "") {
      this.searchCriteria += "&or_search=";
      for (var i = 0; i < id.length; i++) {
        this.searchCriteria += "id__exact:" + id[i];
        if (id.length - i > 1)
          this.searchCriteria += ";";
      }
    }
    if (name != "") {
      this.searchCriteria += '&name__icontains=' + name;
    }

    if (deposit != "") {
      this.searchCriteria += '&multi_search=value:' + deposit + ';fields:deposit__name,deposit__alternative_names;lookuptype:icontains';
    }
    if (oreType != "") {
      this.searchCriteria += '&deposit__genetic_type__name__icontains=' + oreType;
    }
    if (commodity != "") {
      //this.searchCriteria += '&multi_search=value:' + commodity + ';fields:deposit__main_commodity,deposit__other_commodities;lookuptype:icontains';
      this.searchCriteria += '&deposit__main_commodity__icontains=' + commodity;
    }
    if (coreDepositorName != "") {
      //this.searchCriteria += '&core_depositor__name__icontains=' + coreDepositorName;
      this.searchCriteria += '&multi_search=value:' + coreDepositorName + ';fields:core_depositor__name,core_depositor__acronym;lookuptype:icontains';
    }
    console.log(this.searchCriteria);
    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?format=jsonp' + this.searchCriteria + '&paginate_by=10&page=' + page, "callback").pipe();
  }

  searchSiteById(id: string): Observable<Site> {
    return this.http.jsonp<Site>('http://api.eurocore.rocks/drillcore/' + id + '?format=jsonp', "callback").pipe();
  }


  searchDrillcoresByNames(names: string[]): Observable<Site[]> {
    this.searchCriteria = "";

    if (names.length != 0) {
      this.searchCriteria += "or_search=";
      for (var i = 0; i < names.length; i++) {
        this.searchCriteria += "name__icontains:" + names[i];
        if (names.length - i > 1)
          this.searchCriteria += ";";
      }
    }

    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?format=jsonp&' + this.searchCriteria, "callback").pipe();
    //return null; 
  }

  searchMapSites(id: string[], name: string, deposit: string, oreType: string, commodity: string, coreDepositorName: string): Observable<Site[]> {
    this.searchCriteria = "";

    if (id.length != 0 && id[0] != "") {
      this.searchCriteria += "&or_search=";
      for (var i = 0; i < id.length; i++) {
        this.searchCriteria += "id__exact:" + id[i];
        if (id.length - i > 1)
          this.searchCriteria += ";";
      }
    }
    if (name != "") {
      this.searchCriteria += '&name__icontains=' + name;
    }
    if (deposit != "") {
      this.searchCriteria += '&multi_search=value:' + deposit + ';fields:deposit__name,deposit__alternative_names;lookuptype:icontains';
    }
    if (oreType != "") {
      this.searchCriteria += '&deposit__genetic_type__name__icontains=' + oreType;
    }
    if (commodity != "") {
      //this.searchCriteria += '&multi_search=value:' + commodity + ';fields:deposit__main_commodity,deposit__other_commodities;lookuptype:icontains';
      this.searchCriteria += '&deposit__main_commodity__icontains=' + commodity;
    }
    if (coreDepositorName != "") {
      //this.searchCriteria += '&core_depositor__name__icontains=' + coreDepositorName;
      this.searchCriteria += '&multi_search=value:' + coreDepositorName + ';fields:core_depositor__name,core_depositor__acronym;lookuptype:icontains';
    }

    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?format=jsonp' + this.searchCriteria + '&fields=name,longitude,latitude,id', "callback").pipe();
  }

  searchSitesByDepositId(id: string): Observable<Site[]> {
    return this.http.jsonp<[Site]>('http://api.eurocore.rocks/drillcore/?format=jsonp&deposit__id__iexact=' + id, "callback").pipe();
  }

  searchAllParametersByDrillcoreId(id: string): Observable<String[]> {
    return this.http.jsonp<[String]>('http://api.eurocore.rocks/drillcore/' + id + '?fields=name,analysis__analysisresult__parameter__parameter,analysis__analysisresult__unit__unit,analysis__analysis_method__method&distinct=true&format=jsonp', "callback").pipe();
  }

  searchDrillcoreSummaryById(id:string): Observable<DrillcoreSummary>{
    return this.http.jsonp<DrillcoreSummary>('http://api.eurocore.rocks/drillcore_summary/?format=jsonp&drillcore__id__iexact='+id, "callback").pipe();
  }

}
