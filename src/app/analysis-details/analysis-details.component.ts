import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Analysis } from '../analysis';
import { AnalysisService } from '../services/analysis.service';
import { AnalysisResult } from '../analysis-result';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-analysis-details',
  templateUrl: './analysis-details.component.html',
  styleUrls: ['./analysis-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AnalysisDetailsComponent implements OnInit {

  analysis: Analysis;
  analysisResults: AnalysisResult[];
  spectrumCount: number;

  constructor(private route: ActivatedRoute, private analysisSerrivce: AnalysisService, private platformLocation: PlatformLocation) {

   }

  ngOnInit() {
    this.getAnalysisById(this.route.snapshot.paramMap.get('id'));
    this.getAnalysisResultsByAnalysisId(this.route.snapshot.paramMap.get('id'));  
    this.getSpectrumCount(this.route.snapshot.paramMap.get('id'));
  }

  getAnalysisById(id:string): void{
    this.analysisSerrivce.getAnalysisById(id).subscribe(analysis=>{this.analysis=analysis['results'][0]; console.log(this.analysis);});
  }

  getAnalysisResultsByAnalysisId(id: string): void{
    this.analysisSerrivce.getAnalysisResultsByAnalysisId(id).subscribe(analysisResults=> {this.analysisResults=analysisResults['results']; console.log(this.analysisResults);});   
  }

  openSpectrumView(id:number):void{   
    var ID=id.toString(); 
    window.open((this.platformLocation as any).location.pathname +'#/spectrum/'+ID, '', 'width=800,height=800') ;
  }

  getSpectrumCount(id: string):void{
    this.analysisSerrivce.getAnalysisSepectrumEnergyRanges(id).subscribe(spectrumCount=>{this.spectrumCount=spectrumCount['count']; console.log("count "+this.spectrumCount)});
  }

}
