import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SiteService } from '../services/site.service';
import { Site } from '../site';

@Component({
  selector: 'app-drillcore-data',
  templateUrl: './drillcore-data.component.html',
  styleUrls: ['./drillcore-data.component.css']
})
export class DrillcoreDataComponent implements OnInit {

  siteParameters: Site[];
  checkedParameters:String[];
  constructor(private siteService: SiteService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getAllParametersByDrillcoreId(this.route.snapshot.paramMap.get('id'));
  }

  getAllParametersByDrillcoreId(id:string):void{
    this.siteService.searchAllParametersByDrillcoreId(id).subscribe(parameters=>{this.siteParameters=parameters['results']; console.log(this.siteParameters)});
  }

  changeParameters(element: HTMLInputElement):void{
    console.log(element.value);
    console.log(`Checkbox ${element.value} was ${element.checked ? '' : 'un'}checked\n`);
  }

}
