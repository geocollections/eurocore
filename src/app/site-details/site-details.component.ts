import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SiteService } from '../services/site.service';
import { Site } from '../site';
import { MapService} from '../services/map.service';
import { LithologyService } from '../services/lithology.service';
import { Lithology } from '../lithology';

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SiteDetailsComponent implements OnInit {

  @Input() site: Site;
  lithologies: Lithology[];

  constructor(private route: ActivatedRoute, private siteService: SiteService, private mapService: MapService, private lithologyService: LithologyService) { }

  ngOnInit() {
    //console.log(this.route.snapshot.paramMap.get('id'));
    this.getSiteById(this.route.snapshot.paramMap.get('id'));
    this.mapService.drawMap();
  }

  getSiteById(id: string): void{ 
    this.siteService.searchSiteById(id).subscribe(site =>{ this.site = site['results'][0]; console.log(this.site); this.mapService.addPointWithName(this.site); });
    this.lithologyService.getLithologyByDrillcoreId(id).subscribe(lithologies =>{this.lithologies = lithologies['results']; console.log(this.lithologies);});
  }

}
