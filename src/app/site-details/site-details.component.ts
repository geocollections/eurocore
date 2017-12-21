import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Title } from '@angular/platform-browser';

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

  pageNr: number = 1;
  paginateBy = 5;
  pageCount: number;

  constructor(private route: ActivatedRoute, private siteService: SiteService, private mapService: MapService,
    private lithologyService: LithologyService, private drillcoreBoxService: DrillcoreBoxService, private titleService: Title, 
    private sampleService: SampleService, private analysisService: AnalysisService) { }

  ngOnInit() {
    this.getSiteById(this.route.snapshot.paramMap.get('id'));
    this.mapService.drawDetailsViewMap();
    this.titleService.setTitle("EUROCORE Data Portal | Drillcore details"); 
  }

  getSiteById(id: string): void {
    this.siteService.searchSiteById(id).subscribe(site => { this.site = site['results'][0]; console.log(this.site); this.mapService.addPointWithName(this.site.name, this.site.longitude,this.site.latitude); });
    this.lithologyService.getLithologyByDrillcoreId(id).subscribe(lithologies => { this.lithologies = lithologies['results']; console.log(this.lithologies); });
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

  getSamplesByDrillcoreId(drillcoreId: string): void{
    this.sampleService.searchSamplesByDrillcoreId(drillcoreId).subscribe(samples=> {this.samples=samples['results']; console.log(this.samples)});
  }

  getAnalyzesByDrillcoreId(drillcoreId: string): void{
    this.analysisService.getAnalyzesByDrillcoreId(drillcoreId).subscribe(analyzes=>{this.analyzes=analyzes['results']; console.log(this.analyzes)});
  }

}
