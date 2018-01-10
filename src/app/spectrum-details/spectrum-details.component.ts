import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalysisService } from '../services/analysis.service';
import Plotly from 'plotly.js/dist/plotly.min';
 
@Component({
  selector: 'app-spectrum-details',
  templateUrl: './spectrum-details.component.html',
  styleUrls: ['./spectrum-details.component.css']
})
export class SpectrumDetailsComponent implements OnInit {

  analysisId: string;
  spectrumEnergyRanges: string[];
  spectrumData: String[];

  constructor(private route: ActivatedRoute, private analysisSerrivce: AnalysisService) {
    
   }

  ngOnInit() {
    this.analysisId=this.route.snapshot.paramMap.get('id');
    //this.getAnalysisSepectrumEnergyRanges("20000");
    this.getAnalysisSpectrumData("20000");
  }

  getAnalysisSepectrumEnergyRanges(id: string):void{
    this.analysisSerrivce.getAnalysisSepectrumEnergyRanges(id).subscribe(spectrumEnergyRanges=>{this.spectrumEnergyRanges=spectrumEnergyRanges['results']; console.log(this.spectrumEnergyRanges)});
  }

  getAnalysisSpectrumData(id: string):void{
    this.analysisSerrivce.getAnalysisSpectrumData(id).subscribe(spectrumData=>{this.filterSpectrumData(spectrumData['results']); console.log(this.spectrumData);})
  }

  filterSpectrumData(results: String[]):void{
    var data = [];
    for (var k = 0; k < results.length; k++) {
      var x = [];
      var y = [];
      var t = {
        x,
        y,
        type: 'scatter',
        name: results[k]['energy_range__value']
      }

      for (var i = 0; i < results[k]['data'].length; i++) {
        x.push(results[k]['data'][i].keV);
        y.push(results[k]['data'][i].count);       
      }
      data.push(t);
    }

    var layout = {
      title: 'Spectrum energy ranges',
      xaxis: {
        title: 'keV'
      },
      yaxis: {
        title: 'count'
      }
    };
 
    Plotly.newPlot('myDiv', data, layout);
  }

}
