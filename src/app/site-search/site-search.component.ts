import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SiteService } from '../services/site.service';
import { Site } from '../site';
import { MapService} from '../services/map.service';

@Component({
  selector: 'app-site-search',
  templateUrl: './site-search.component.html',
  styleUrls: ['./site-search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SiteSearchComponent implements OnInit {

  selectedSite: Site;
  sites: Site []; 
  siteCount: string;
  drillcoreAutocompleteValues: String[];
  depositAutocompleteValues: String[];
  oreTypeAutocompleteValues: String[];
  coreDepositorAutocompleteValues: String[];
  pageNumber: number=1;
  pageCount;
  //name2: String;  

  constructor(private siteService: SiteService, private mapService: MapService) { }

  ngOnInit() {   
    this.searchSites("","","","","",1);
    this.mapService.drawMap(this);
  }
  
  searchDrillcoreByName(name: string): void {
    
    if(name.length>1)
      this.siteService.searchDrillcoreByName(name).subscribe(drillcoreValues =>{ this.drillcoreAutocompleteValues = drillcoreValues['results']; });
    else
     this.drillcoreAutocompleteValues=[];
  }
  searchDepositByName(name: string): void {
    if(name.length>1)
      this.siteService.searchDepositByName(name).subscribe(depositValues =>{this.sortDeposits(depositValues['results'], name);});
    else
      this.depositAutocompleteValues=[];
  } 

  searchCoreDepositorByName(name: string): void{
    console.log("true");
    if(name.length>1)
     this.siteService.searchCoreDepositorByName(name).subscribe(coreDepositValues =>{this.coreDepositorAutocompleteValues=coreDepositValues['results'];});
    else   
      this.coreDepositorAutocompleteValues=[];
  }



  searchOreTypeByName(name: string): void {
    if(name.length>1)
      this.siteService.searchOreTypeByName(name).subscribe(oreTypeValues =>{ this.oreTypeAutocompleteValues = oreTypeValues['results']; });
    else
      this.oreTypeAutocompleteValues=[];   
  }
  
  sortDeposits(deposits: Site[], name: string): void{
    this.depositAutocompleteValues=[];
    for(var i=0;i<deposits.length;i++){
      if(deposits[i].deposit__name!=undefined && deposits[i].deposit__name.toUpperCase().search(name.toUpperCase())>=0){
        this.depositAutocompleteValues.push(deposits[i].deposit__name);
      }
      if(deposits[i].deposit__alternative_names!=undefined && deposits[i].deposit__alternative_names.toUpperCase().search(name.toUpperCase())>=0){
       this.depositAutocompleteValues.push(deposits[i].deposit__alternative_names);
      }
    }
  }

  searchSites(drillcore: string, deposit: string, oreType: string, commodity: string, coreDepositorName: string, page: number=1): void {  
    this.siteService.searchSites(drillcore, deposit,oreType,commodity, coreDepositorName,page).subscribe(sites =>{ this.sites = sites['results'];this.siteCount=sites['count'];
    if(sites['page']) this.pageCount=new Array(Number(String(sites['page']).split("of ")[1]))
     else this.pageCount=new Array(1); 
    this.mapService.addPoints(this.sites); });
    this.selectedSite=undefined;
    this.setPageNumber(page);
  }

  onSelect(site: Site): void { 
    this.selectedSite = site;
    this.mapService.addPointWithName(site);
    
  }

  searchSitesByNames(names: string[]):void{
    this.siteService.searchDrillcoresByNames(names).subscribe(sites =>{ this.sites = sites['results']; this.siteCount=sites['count']; this.mapService.addPoints(this.sites); });
  }

  setPageNumber(pageNumber: number){
    this.pageNumber=pageNumber;
    //this.searchSites();
  }
}
