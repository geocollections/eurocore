import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DrillcoreBoxService } from '../services/drillcore-box.service';
import { DrillcoreBox } from '../drillcoreBox';
import { ActivatedRoute } from '@angular/router';
import {PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-drillcore-boxes',
  templateUrl: './drillcore-boxes.component.html',
  styleUrls: ['./drillcore-boxes.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DrillcoreBoxesComponent implements OnInit {

  corebox: DrillcoreBox;

  constructor(private drillcoreBoxService: DrillcoreBoxService, private route: ActivatedRoute, private platformLocation: PlatformLocation) { }

  ngOnInit() {
    this.getDepositById(this.route.snapshot.paramMap.get('id'));
  }

  getDepositById(id: string): void {
    this.drillcoreBoxService.getDrillcoreBoxById(id).subscribe(corebox => { this.corebox = corebox['results'][0]; console.log(this.corebox) });
  }

  openNewWindow(url:string):void{
    window.open(url, '', 'width=600,height=800') ;
  }

  getImagePreviewLink(size:string,imageLink:string){
    let imageFolder=imageLink.substr(0,10);
    let imagePreviewLink=imageFolder+size+imageLink.substr(9);
    return imagePreviewLink;
  }

}
