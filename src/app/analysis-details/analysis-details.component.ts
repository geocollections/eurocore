import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Analysis } from '../analysis';
import { AnalysisService } from '../services/analysis.service';
import { AnalysisResult } from '../analysis-result';

/*
import * as $ from 'jquery';
//import * as ol from 'ol';

import Map from 'ol/map';
import View from 'ol/view';
import TileLayer from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';
import ol from 'ol';*/


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
    
    
    /*
    new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });*/

  }

  getAnalysisById(id:string): void{
    this.analysisSerrivce.getAnalysisById(id).subscribe(analysis=>{this.analysis=analysis['results'][0]; console.log(this.analysis);});
  }

  getAnalysisResultsByAnalysisId(id: string): void{
    this.analysisSerrivce.getAnalysisResultsByAnalysisId(id).subscribe(analysisResults=> {this.analysisResults=analysisResults['results']; console.log(this.analysisResults);});
  }

}
