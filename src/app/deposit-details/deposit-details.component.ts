import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DepositService } from '../services/deposit.service';
import { Deposit } from '../deposit';
import { SiteService } from '../services/site.service';
import { Site } from '../site';
import { Title } from '@angular/platform-browser';
import { OlMapService } from '../services/ol-map.service';

@Component({
  selector: 'app-deposit-details',
  templateUrl: './deposit-details.component.html',
  styleUrls: ['./deposit-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DepositDetailsComponent implements OnInit {

  deposit: Deposit;
  sites: Site[];

  constructor(private route: ActivatedRoute, private depositService: DepositService, private siteService: SiteService,
    private titleService: Title, private olMapService: OlMapService) {
      window.scrollTo(0, 0);
     }

  ngOnInit() {
    this.getDepositById(this.route.snapshot.paramMap.get('id'));
    this.olMapService.drawDetailsViewMap();
    this.getDrillcoresByDepositId(this.route.snapshot.paramMap.get('id'));  
  }

  getDepositById(id: string): void {
    this.depositService.searchDepositById(id).subscribe(deposit => { this.deposit = deposit['results'][0]; 
    console.log(this.deposit); 
    this.olMapService.addPointWithName(this.deposit.name, this.deposit.longitude, this.deposit.latitude);
  });
  }

  getDrillcoresByDepositId(id: string): void {
    var ID=id.toString();
    if (this.sites == undefined) {
      this.siteService.searchSitesByDepositId(ID).subscribe(sites => { this.sites = sites['results']; console.log(this.sites)
    });
    }
  }

}
