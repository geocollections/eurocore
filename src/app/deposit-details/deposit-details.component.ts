import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DepositService } from '../services/deposit.service';
import { Deposit } from '../deposit';
import { MapService } from '../services/map.service';
import { SiteService } from '../services/site.service';
import { Site } from '../site';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-deposit-details',
  templateUrl: './deposit-details.component.html',
  styleUrls: ['./deposit-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DepositDetailsComponent implements OnInit {

  deposit: Deposit;
  sites: Site[];
  //id: string;

  constructor(private route: ActivatedRoute, private depositService: DepositService, private mapService: MapService, private siteService: SiteService,
    private titleService: Title) { }

  ngOnInit() {
    this.getDepositById(this.route.snapshot.paramMap.get('id'));
    this.mapService.drawDetailsViewMap();
  }

  getDepositById(id: string): void {
    this.depositService.searchDepositById(id).subscribe(deposit => { this.deposit = deposit['results'][0]; console.log(this.deposit); this.mapService.addPointWithName(this.deposit.name, this.deposit.longitude, this.deposit.latitude); });;
  }

  getDrillcoresByDepositId(id: string): void {
    if (this.sites == undefined) {
      this.siteService.searchSitesByDepositId(id).subscribe(sites => { this.sites = sites['results']; console.log(this.sites) });
    }
  }

}
