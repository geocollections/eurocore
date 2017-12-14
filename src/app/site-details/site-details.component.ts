import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SiteService } from '../services/site.service';
import { Site } from '../site';
import { MapService } from '../services/map.service';
import { LithologyService } from '../services/lithology.service';
import { Lithology } from '../lithology';
import { DrillcoreBoxService } from '../services/drillcore-box.service';
import { DrillcoreBox } from '../drillcoreBox';

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
  pageNr: number = 1;
  paginateBy = 5;
  pageCount: number;

  constructor(private route: ActivatedRoute, private siteService: SiteService, private mapService: MapService,
    private lithologyService: LithologyService, private drillcoreBoxService: DrillcoreBoxService) { }

  ngOnInit() {
    this.getSiteById(this.route.snapshot.paramMap.get('id'));
    this.mapService.drawMap();
  }

  getSiteById(id: string): void {
    this.siteService.searchSiteById(id).subscribe(site => { this.site = site['results'][0]; console.log(this.site); this.mapService.addPointWithName(this.site); });
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

}
