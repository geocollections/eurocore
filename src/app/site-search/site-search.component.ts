import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SiteService } from '../services/site.service';
import { Site } from '../site';
import { MapService } from '../services/map.service';
import * as $ from 'jquery';
//import  'jquery-ui/ui/widgets/autocomplete';


@Component({
  selector: 'app-site-search',
  templateUrl: './site-search.component.html',
  styleUrls: ['./site-search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SiteSearchComponent implements OnInit {


  selectedSite: Site;
  sites: Site[];
  mapSites: Site[];
  siteCount: number;
  drillcoreAutocompleteValues: String[];
  depositAutocompleteValues: String[];
  oreTypeAutocompleteValues: String[];
  coreDepositorAutocompleteValues: String[];
  pageNumber: number = 1;
  pageCount;
  

  searchDrillcoreName: string = "";
  searchDepositName: string = "";
  searchOreType: string = "";
  searchCommodity: string = "";
  searchInstitution: string = "";
  searchDrillcoreId:string="";
  
  drillcoreIdArray: string[];

  constructor(private siteService: SiteService, private mapService: MapService) { 
    
  }
 
  ngOnInit() {
    this.getMapSites();
    this.searchSites(1);
    this.mapService.drawDrillcoreSearchMap(this);
    //this.getMapSites();
  } 

  searchDrillcoreByName(): void {

    if (this.searchDrillcoreName.length > 1)
      this.siteService.searchDrillcoreByName(this.searchDrillcoreName).subscribe(drillcoreValues => { this.drillcoreAutocompleteValues = drillcoreValues['results']; 
    });
    else
      this.drillcoreAutocompleteValues = [];
  }
  searchDepositByName(name: string): void {
    if (name.length > 1)
      this.siteService.searchDepositByName(name).subscribe(depositValues => { this.sortDeposits(depositValues['results'], name); });
    else
      this.depositAutocompleteValues = [];
  }

  searchCoreDepositorByName(name: string): void {
    if (name.length > 1)
      this.siteService.searchCoreDepositorByName(name).subscribe(coreDepositValues => { this.sortCoreDepositors(coreDepositValues['results'], name); console.log("res"+this.coreDepositorAutocompleteValues);});
    else
      this.coreDepositorAutocompleteValues = [];
  }



  searchOreTypeByName(name: string): void {
    if (name.length > 1)
      this.siteService.searchOreTypeByName(name).subscribe(oreTypeValues => { this.oreTypeAutocompleteValues = oreTypeValues['results']; });
    else
      this.oreTypeAutocompleteValues = [];
  }

  sortCoreDepositors(deposits: Site[], name:string):void{
    this.coreDepositorAutocompleteValues=[];
    for(var i = 0; i < deposits.length; i++){
      if(deposits[i].core_depositor__name != undefined && deposits[i].core_depositor__name.toUpperCase().search(name.toUpperCase()) >= 0){
        this.coreDepositorAutocompleteValues[i]=(deposits[i].core_depositor__name);
      }
      if(deposits[i].core_depositor__acronym !=undefined && deposits[i].core_depositor__acronym.toUpperCase().search(name.toUpperCase()) >= 0){
        this.coreDepositorAutocompleteValues[i]=(deposits[i].core_depositor__acronym);
      }
    }
  }

  sortDeposits(deposits: Site[], name: string): void {
    this.depositAutocompleteValues = [];
    for (var i = 0; i < deposits.length; i++) {
      if (deposits[i].deposit__name != undefined && deposits[i].deposit__name.toUpperCase().search(name.toUpperCase()) >= 0) {
        this.depositAutocompleteValues.push(deposits[i].deposit__name);
      }
      if (deposits[i].deposit__alternative_names != undefined && deposits[i].deposit__alternative_names.toUpperCase().search(name.toUpperCase()) >= 0) {
        this.depositAutocompleteValues.push(deposits[i].deposit__alternative_names);
      }
    }
  }

  searchSites(page: number = 1): void {
    console.log(this.searchDrillcoreId + "-"+this.searchDrillcoreName + " -" + this.searchDepositName + " -" + this.searchOreType + " -" + this.searchCommodity + " -" + this.searchInstitution + " -" + this.pageNumber);

    this.drillcoreIdArray = String(this.searchDrillcoreId).split(",");

    this.siteService.searchSites(this.drillcoreIdArray,this.searchDrillcoreName, this.searchDepositName, this.searchOreType, this.searchCommodity, this.searchInstitution, page).subscribe(sites => {
      this.sites = sites['results']; this.siteCount = sites['count'];
      if (sites['page'])
        this.pageCount = new Array(Number(String(sites['page']).split("of ")[1]))
      else
        this.pageCount = new Array(1);

    });
    this.siteService.searchMapSites(this.drillcoreIdArray,this.searchDrillcoreName, this.searchDepositName, this.searchOreType, this.searchCommodity, this.searchInstitution).subscribe(sites =>
       { this.mapSites = sites['results']; this.mapService.addPoints(this.mapSites); console.log("mapsites" + this.mapSites.length); });
    this.selectedSite = undefined;
    this.setPageNumber(page);
  }

  onSelect(site: Site): void {
    this.selectedSite = site;
    this.mapService.addPointWithName(site.name, site.longitude, site.latitude);

  }

  searchSitesByNames(names: string[]): void {
    this.siteService.searchDrillcoresByNames(names).subscribe(sites => { this.sites = sites['results']; this.siteCount = sites['count']; /*this.mapService.addPoints(this.sites); */ });
  }

  getMapSites(): void {
    this.siteService.getSites().subscribe(sites => { this.mapSites = sites['results']; this.mapService.addAllPoints(this.mapSites) });
    //console.log("getsites" + this.sites.length);
  }

  setPageNumber(pageNumber: number):void {
    this.pageNumber = pageNumber;
    //this.searchSites();
  }

  enterKeyPress(keyEvent):void{
    if(keyEvent.which==13)
    this.searchSites();
  }

  resetFormValues():void{
    this.searchDrillcoreName="";
    this.searchDepositName="";
    this.searchOreType="";
    this.searchCommodity="";
    this.searchInstitution="";
    this.searchDrillcoreId="";
    this.searchSites();
  }

}
