import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DrillcoreBoxService } from '../services/drillcore-box.service';
import { DrillcoreBox } from '../drillcoreBox';
import { ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { SampleService } from '../services/sample.service';
import { Sample } from '../sample';
import { AnalysisService } from '../services/analysis.service';
import { Analysis } from '../analysis';

@Component({
  selector: 'app-drillcore-boxes',
  templateUrl: './drillcore-boxes.component.html',
  styleUrls: ['./drillcore-boxes.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DrillcoreBoxesComponent implements OnInit {

  corebox: DrillcoreBox;
  samples: Sample[];
  analyses: Analysis[];

  constructor(private drillcoreBoxService: DrillcoreBoxService,private sampleService: SampleService, private analysisService: AnalysisService,
     private route: ActivatedRoute, private platformLocation: PlatformLocation) { }

  ngOnInit() {
    this.getDepositById(this.route.snapshot.paramMap.get('id'));
    //document.getElementById("overlay").style.backgroundImage='url(http://www.eurocore.rocks/files/53/2000/53e20a8e-2bfc-4bc1-b2b4-bed900c8625c.jpg.JPG)'; 
    this.zoomOut();
  }

  getDepositById(id: string): void {
    this.drillcoreBoxService.getDrillcoreBoxById(id).subscribe(corebox => {
    this.corebox = corebox['results'][0]; console.log(this.corebox);
    this.getSamplesByDepth(this.corebox.start_depth, this.corebox.end_depth,this.corebox.drillcore__id.toString());
    this.getAnalysesByDepth(this.corebox.start_depth, this.corebox.end_depth, this.corebox.drillcore__id.toString());
      document.getElementById("overlay").style.backgroundImage = 'url(http://www.eurocore.rocks' + this.getImagePreviewLink("2000", this.corebox.attachmentlink__attachment__url) + ')';
    });
  }

  getSamplesByDepth(startDepth: string, endDepth: string, drillcoreId: string):void{
    this.sampleService.searchSamplesByDepth(startDepth, endDepth, drillcoreId).subscribe(samples =>{this.samples=samples['results']; console.log("samples"+this.samples)})
  }
  getAnalysesByDepth(startDepth: string, endDepth: string, drillcoreId: string){
    this.analysisService.getAnalysesByDepth(startDepth, endDepth, drillcoreId).subscribe(analyses =>{this.analyses=analyses['results']; console.log("analyses "+this.analyses)});
  }

  openNewWindow(url: string): void {
    window.open(url, '');
  }

  getImagePreviewLink(size: string, imageLink: string) {
    let imageFolder = imageLink.substr(0, 10);
    let imagePreviewLink = imageFolder + size + imageLink.substr(9);
    return imagePreviewLink;
  }

  zoomIn(event: MouseEvent) {
    let width=document.getElementById("imgZoom").offsetWidth;
    let height=document.getElementById("imgZoom").offsetHeight;
    var element = document.getElementById("overlay");
    element.style.display = "inline-block";
    var img = document.getElementById("imgZoom");
    var posX = event.offsetX ? (event.offsetX) : event.pageX - img.offsetLeft;
    var posY = event.offsetY ? (event.offsetY) : event.pageY - img.offsetTop;
    
    element.style.backgroundPosition = (-posX * 2000/width*0.8) + "px " + (-posY * 710/height*0.8) + "px";
  }

  zoomOut() {
    var element = document.getElementById("overlay");
    //element.style.display = "none";
  }

  openNewWin(subUrl: string,id:string):void{    
    window.open((this.platformLocation as any).location.pathname +'#/'+subUrl+'/'+id, '', 'width=800,height=800') ;
  }

}
