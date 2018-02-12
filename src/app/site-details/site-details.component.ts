import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Title } from '@angular/platform-browser';
import {PlatformLocation } from '@angular/common';

import { SiteService } from '../services/site.service';
import { Site } from '../site';
import { MapService } from '../services/map.service';
import { LithologyService } from '../services/lithology.service';
import { Lithology } from '../lithology';
import { DrillcoreBoxService } from '../services/drillcore-box.service';
import { DrillcoreBox } from '../drillcoreBox';
import { SampleService } from '../services/sample.service';
import { Sample } from '../sample';
import { AnalysisService } from '../services/analysis.service';
import { Analysis } from '../analysis';
import { DrillcoreSummary } from '../drillcoreSummary';
import { DipService } from '../services/dip.service';
import { Dip } from '../dip';

import * as $ from 'jquery'; 
import 'popper.js';
//import  'bootstrap/dist/js/bootstrap.min';
import  'bootstrap/js/src/tab';
import { RqdService } from '../services/rqd.service';
import { Rqd } from '../rqd';



@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SiteDetailsComponent implements OnInit {

  @Input() site: Site;
  lithologies: Lithology[];
  drillcoreBoxes: DrillcoreBox[]=[]; 
  samples: Sample[];
  analyzes: Analysis[];
  drillcoreSummary: DrillcoreSummary;
  dip: Dip[];
  rqd: Rqd[];
  CTscans: Analysis[];

  pageNr: number = 1;
  paginateBy = 5;
  pageCount: number;
  

  constructor(private route: ActivatedRoute, private siteService: SiteService, private mapService: MapService,
    private lithologyService: LithologyService, private drillcoreBoxService: DrillcoreBoxService, private titleService: Title, 
    private sampleService: SampleService, private analysisService: AnalysisService, private platformLocation: PlatformLocation,
    private dipService: DipService, private rqdService: RqdService) { 
      console.log("Path: " +JSON.stringify((this.platformLocation as any).location.href));
      window.scrollTo(0, 0);
    }

  ngOnInit() {    
    this.getSiteById(this.route.snapshot.paramMap.get('id'));
    this.mapService.drawDetailsViewMap();
    this.getDrillcoreSummary(this.route.snapshot.paramMap.get('id'));
    //this.titleService.setTitle("EUROCORE Data Portal: "+ this.site.name+ " drillcore");
    //this.getCTscansByDrillcoreId("29");
  }

  getSiteById(id: string): void {
    this.siteService.searchSiteById(id).subscribe(site => { this.site = site['results'][0]; console.log(this.site); this.mapService.addPointWithName(this.site.name, this.site.longitude,this.site.latitude);  });   
  }

  getDrillcoreBoxesByDrillcoreId(id: string): void {
    
    if (this.pageNr <= this.pageCount || this.pageCount == undefined) {
      this.drillcoreBoxService.getDrillcoreBoxesByDrillcoreId(id, this.paginateBy, this.pageNr).subscribe(drillcoreBoxes => {
        if(drillcoreBoxes['results']){
        for (let i = 0; i < drillcoreBoxes['results'].length; i++) {
          this.drillcoreBoxes.push(drillcoreBoxes['results'][i]);
          console.log("boxespush" + drillcoreBoxes['results'][i].number)
        }
        if (drillcoreBoxes['page'])
          this.pageCount = Number(String(drillcoreBoxes['page']).split("of ")[1])
        else
          this.pageCount = 1;

        console.log(this.pageCount);
        console.log(this.pageNr);
        this.pageNr++;
      }
    }
      );
    }
  }

  onScroll() {
    this.getDrillcoreBoxesByDrillcoreId(this.route.snapshot.paramMap.get("id"));
  }
  getLithologyByDrillcoreId(drillcoreId:string):void{
    this.lithologyService.getLithologyByDrillcoreId(drillcoreId).subscribe(lithologies => { this.lithologies = lithologies['results']; console.log(this.lithologies); });
  }

  getSamplesByDrillcoreId(drillcoreId: string): void{
    this.sampleService.searchSamplesByDrillcoreId(drillcoreId).subscribe(samples=> {this.samples=samples['results']; console.log(this.samples)});
  }

  getDipByDrillcoreId(id: string):void{
    this.dipService.getDipByDrillcoreId(id).subscribe(dip =>{this.dip=dip['results']; console.log("dip "+this.dip)});
  }

  getCTscansByDrillcoreId(id: string):void{
    this.analysisService.getCTscansByDrillcoreId(id).subscribe( CTscans=>{this.CTscans=CTscans['results']; console.log(this.CTscans)});
  }

  getRqdByDrillcoreId(id: string):void{
    this.rqdService.getRqdByDrillcoreId(id).subscribe(rqd =>{this.rqd=rqd['results']; console.log("rqd "+ this.rqd)})
  }

  getAnalyzesByDrillcoreId(drillcoreId: string): void{
    this.analysisService.getAnalyzesByDrillcoreId(drillcoreId).subscribe(analyzes=>{this.analyzes=analyzes['results']; console.log(this.analyzes)});
  }

  openNewWindow(id:string):void{    
    window.open((this.platformLocation as any).location.pathname +'#/corebox/'+id, '', 'width=800,height=800') ;
  }

  getDrillcoreSummary(drillcoreId:string):void{
    this.siteService.searchDrillcoreSummaryById(drillcoreId).subscribe(drillcoreSummary =>{this.drillcoreSummary=drillcoreSummary['results'][0];this.findFirstTab();console.log(this.drillcoreSummary);});
  }

  openAnalysisView(id:number):void{   
    var ID=id.toString(); 
    window.open((this.platformLocation as any).location.pathname +'#/analysis/'+ID, '', 'width=800,height=800') ;
  }
  openSampleView(id:number):void{   
    var ID=id.toString(); 
    window.open((this.platformLocation as any).location.pathname +'#/sample/'+ID, '', 'width=800,height=800') ;
  }

  findFirstTab(){
    if(!(this.drillcoreSummary.lithologies==0  || this.drillcoreSummary.lithologies==null)){
      console.log("lithologies"); 
      this.getLithologyByDrillcoreId(this.site.id.toString());
      this.activateTab("lithologyTab");
      return;   
    }
    if(!(this.drillcoreSummary.dips==0  || this.drillcoreSummary.dips==null)){
      console.log("dip"); 
      //this.getLithologyByDrillcoreId(this.site.id.toString());
      this.getDipByDrillcoreId(this.site.id.toString());
      this.activateTab("dipTab");
      return;   
    }
    if(!(this.drillcoreSummary.rqds==0  || this.drillcoreSummary.rqds==null)){
      console.log("rqds"); 
      //this.getLithologyByDrillcoreId(this.site.id.toString());
      this.activateTab("rqdTab");
      return;   
    }
    if(!(this.drillcoreSummary.structures==0  || this.drillcoreSummary.structures==null)){
      console.log("structures"); 
      //this.getLithologyByDrillcoreId(this.site.id.toString());
      this.activateTab("structuresTab");
      return;   
    }
    if(!(this.drillcoreSummary.stratigraphies==0  || this.drillcoreSummary.stratigraphies==null)){
      console.log("stratigraphies"); 
      //this.getLithologyByDrillcoreId(this.site.id.toString());
      this.activateTab("stratigraphyTab");
      return;   
    }
    if(!(this.drillcoreSummary.boxes==0  || this.drillcoreSummary.boxes==null)){
      console.log("images");
      this.getDrillcoreBoxesByDrillcoreId(this.site.id.toString());
      this.activateTab("boxesTab");
      return;   
    }
    if(!(this.drillcoreSummary.samples==0  || this.drillcoreSummary.samples==null)){
      console.log("sampels");
      this.getSamplesByDrillcoreId(this.site.id.toString());
      this.activateTab("samplesTab");
      return;   
    }
    if(!(this.drillcoreSummary.analyses==0  || this.drillcoreSummary.analyses==null)){
      console.log("analysis");
      this.getAnalyzesByDrillcoreId(this.site.id.toString());
      this.activateTab("analysesTab");
      return;   
    } 
    if(!(this.drillcoreSummary.attachments==0  || this.drillcoreSummary.attachments==null)){
      console.log("attachments"); 
      //this.getLithologyByDrillcoreId(this.site.id.toString());
      this.activateTab("attachmentsTab");
      return;   
    }
    if(!(this.drillcoreSummary.references==0  || this.drillcoreSummary.references==null)){
      console.log("references"); 
      //this.getLithologyByDrillcoreId(this.site.id.toString());
      this.activateTab("refernecesTab");
      return;   
    }  
  }

  activateTab(tab: string){
    $(function () {
      $('#'+tab).tab('show');      
    })
  }

  getImagePreviewLink(size:string,imageLink:string){
    let imageFolder=imageLink.substr(0,10);
    let imagePreviewLink=imageFolder+size+imageLink.substr(9);
    return imagePreviewLink;
  }



}
