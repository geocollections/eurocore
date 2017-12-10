import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
declare var ol: any;
import { Site } from '../site';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit {

  @Input() drillcore: Site;
  vectorSource: any;
  map: any;
  constructor() { }

  ngOnInit() {

    //this.searchSites("","","","","");

    this.vectorSource = new ol.source.Vector({
    });

    var vectorLayer = new ol.layer.Vector({
      source: this.vectorSource
    });

    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        vectorLayer
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([29.34424401655, 62.856645860855]),
        zoom: 4
      })
    });
  }


  drawMap(): void {
    /* if(this.drillcore.longitude!=undefined){
     var holeNr6 = new ol.Feature({
       geometry: new ol.geom.Point(ol.proj.fromLonLat([this.drillcore.longitude,this.drillcore.latitude]))
     });
     holeNr6.setStyle(new ol.style.Style({
       image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ /* ({
    color: 'red',
      crossOrigin: 'anonymous',
      
      src: 'https://openlayers.org/en/v4.5.0/examples/data/dot.png'
    })),
    text: new ol.style.Text({
      scale: 1.4,
      text: this.drillcore.name,
      offsetY: -25,
      fill: new ol.style.Fill({
          color: 'black'
      }),
      stroke: new ol.style.Stroke({
        color: 'white',
        width: 3.5
      })
  })
    
  }));
 // vectorSource.removeFeature(holeNr2);
  this.vectorSource.clear();
  this.vectorSource.addFeature(holeNr6);
  this.map.getView().setZoom(4);
  this.map.getView().setCenter(ol.proj.fromLonLat([29.34424401655 ,62.856645860855]));
}
else{
  this.vectorSource.clear();
}*/
  }









}
