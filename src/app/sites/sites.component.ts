import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Site } from '../site';
import { SiteService } from '../services/site.service';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SitesComponent implements OnInit {

  selectedSite: Site;
  sites: Site[];
  map: any;

  constructor(private siteService: SiteService) { }

  ngOnInit() {
    this.getSites();

  }

  onSelect(site: Site): void {
    this.selectedSite = site;
  }

  getSites(): void {
    this.siteService.getSites().subscribe(sites => { this.sites = sites['results']; });
    //console.log("getsites" + this.sites.length);
  }


}
