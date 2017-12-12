import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Analysis } from '../analysis';
import { AnalysisService } from '../services/analysis.service';
import { AnalysisResult } from '../analysis-result';


//import * as $ from 'jquery';
import * as ol from 'openlayers';

/*
import Map from 'ol/map';
import View from 'ol/view';
import TileLayer from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';
import ol from 'ol';*/
/*import feature from 'ol/feature';
import point from 'ol/geom/point';
import proj from 'ol/proj';*/
//import { Feature, Map } from 'openlayers';



@Component({
  selector: 'app-analysis-details',
  templateUrl: './analysis-details.component.html',
  styleUrls: ['./analysis-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AnalysisDetailsComponent implements OnInit {

  analysis: Analysis;
  analysisResults: AnalysisResult[];

  constructor(private route: ActivatedRoute, private analysisSerrivce: AnalysisService) { }

  ngOnInit() {
    this.getAnalysisById(this.route.snapshot.paramMap.get('id'));
    this.getAnalysisResultsByAnalysisId(this.route.snapshot.paramMap.get('id'));
    
    //new _ol_Map_
    var holeNr1 = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([29.34424401655, 62.856645860855]))
    });
    //console.log("holenr1 "+JSON.stringify(holeNr1));
    
    
    /*
    var holeNr1 = new Feature({
      //geometry: new Point(proj.fromLonLat([29.34424401655, 62.856645860855]))
    });*/
    
    
    new ol.Map({
      target: 'map',
      view: new ol.View({
        center: [0, 0],
        zoom: 2
      })
    });

  }

  getAnalysisById(id:string): void{
    this.analysisSerrivce.getAnalysisById(id).subscribe(analysis=>{this.analysis=analysis['results'][0]; console.log(this.analysis);});
  }

  getAnalysisResultsByAnalysisId(id: string): void{
    this.analysisSerrivce.getAnalysisResultsByAnalysisId(id).subscribe(analysisResults=> {this.analysisResults=analysisResults['results']; console.log(this.analysisResults);});
  }

}
