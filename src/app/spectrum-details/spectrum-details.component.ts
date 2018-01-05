import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalysisService } from '../services/analysis.service';

@Component({
  selector: 'app-spectrum-details',
  templateUrl: './spectrum-details.component.html',
  styleUrls: ['./spectrum-details.component.css']
})
export class SpectrumDetailsComponent implements OnInit {

  analysisId: string;
  spectrumEnergyRanges: string[];

  constructor(private route: ActivatedRoute, private analysisSerrivce: AnalysisService) {
    
   }

  ngOnInit() {
    this.analysisId=this.route.snapshot.paramMap.get('id');
    this.getAnalysisSepectrumEnergyRanges("1");
  }

  getAnalysisSepectrumEnergyRanges(id: string):void{
    this.analysisSerrivce.getAnalysisSepectrumEnergyRanges(id).subscribe(spectrumEnergyRanges=>{this.spectrumEnergyRanges=spectrumEnergyRanges['results']; console.log(this.spectrumEnergyRanges)});
  }

}
