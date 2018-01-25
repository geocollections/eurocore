import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalysisService } from '../services/analysis.service';
import Plotly from 'plotly.js/dist/plotly-basic.min';

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
    this.analysisId = this.route.snapshot.paramMap.get('id');
    //this.getAnalysisSepectrumEnergyRanges("20000");
    this.getAnalysisSpectrumData("20000");
  }

  getAnalysisSepectrumEnergyRanges(id: string): void {
    this.analysisSerrivce.getAnalysisSepectrumEnergyRanges(id).subscribe(spectrumEnergyRanges => { this.spectrumEnergyRanges = spectrumEnergyRanges['results']; console.log(this.spectrumEnergyRanges) });
  }

  getAnalysisSpectrumData(id: string): void {
    this.analysisSerrivce.getAnalysisSpectrumData(id).subscribe(spectrumData => { this.filterSpectrumData(spectrumData['results']); console.log(this.spectrumData); })
  }

  filterSpectrumData(results: String[]): void {
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
      margin: {
        l: 40,
        r: 10,
        b: 40,
        t: 40,
        pad: 4
      },
      title: 'Spectrum energy ranges',
      xaxis: {
        title: 'keV'
      },
      yaxis: {
        title: 'count'
      }
    };

    var d3 = Plotly.d3;

    var WIDTH_IN_PERCENT_OF_PARENT = 90,
      HEIGHT_IN_PERCENT_OF_PARENT = 70;
    //console.log(d3.select("div[id='plotlyChart']"));
    var gd3 = d3.select("div[id='myDiv']")
      //.append('div')
      .style({
        width: WIDTH_IN_PERCENT_OF_PARENT + '%',
        'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',

        height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
        'margin-top': 0
      });

    var gd = gd3.node();


    Plotly.newPlot(gd, data, layout,
      {
        modeBarButtonsToRemove: ['toImage'],
        modeBarButtonsToAdd: [{
          name: 'Download plot as a SVG',
          icon: Plotly.Icons.camera,
          click: function (gd) {
            Plotly.downloadImage(gd, { format: 'svg' })
          }
        }],
        displaylogo: false
      });

      window.onresize = function() {
        Plotly.Plots.resize(gd);
    };
  }

}
