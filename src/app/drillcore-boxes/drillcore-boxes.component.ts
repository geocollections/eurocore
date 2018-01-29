import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DrillcoreBoxService } from '../services/drillcore-box.service';
import { DrillcoreBox } from '../drillcoreBox';
import { ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';

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
    //document.getElementById("overlay").style.backgroundImage='url(http://www.eurocore.rocks/files/53/2000/53e20a8e-2bfc-4bc1-b2b4-bed900c8625c.jpg.JPG)'; 
    this.zoomOut();
  }

  getDepositById(id: string): void {
    this.drillcoreBoxService.getDrillcoreBoxById(id).subscribe(corebox => {
    this.corebox = corebox['results'][0]; console.log(this.corebox);
      document.getElementById("overlay").style.backgroundImage = 'url(http://www.eurocore.rocks' + this.getImagePreviewLink("2000", this.corebox.attachmentlink__attachment__url) + ')';
    });
  }

  openNewWindow(url: string): void {
    window.open(url, '', 'width=600,height=800');
  }

  getImagePreviewLink(size: string, imageLink: string) {
    let imageFolder = imageLink.substr(0, 10);
    let imagePreviewLink = imageFolder + size + imageLink.substr(9);
    return imagePreviewLink;
  }

  zoomIn(event: MouseEvent) {
    var element = document.getElementById("overlay");
    element.style.display = "inline-block";
    var img = document.getElementById("imgZoom");
    var posX = event.offsetX ? (event.offsetX) : event.pageX - img.offsetLeft;
    var posY = event.offsetY ? (event.offsetY) : event.pageY - img.offsetTop;
    element.style.backgroundPosition = (-posX * 3) + "px " + (-posY * 3.5) + "px";
  }

  zoomOut() {
    var element = document.getElementById("overlay");
    element.style.display = "none";
  }

}
