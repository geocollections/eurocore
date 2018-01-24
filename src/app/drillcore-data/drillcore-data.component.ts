import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SiteService } from '../services/site.service';
import { Site } from '../site';
import { AnalysisService } from '../services/analysis.service';
import { AnalysisSummary } from '../analysis-summary';
import Plotly from 'plotly.js/dist/plotly-basic.min';
import {TableExport} from 'tableexport';

@Component({
  selector: 'app-drillcore-data',
  templateUrl: './drillcore-data.component.html',
  styleUrls: ['./drillcore-data.component.css']
})
export class DrillcoreDataComponent implements OnInit {

  siteParameters: String[];
  analysisResults: AnalysisSummary[];
  analysisSummaryData: AnalysisSummary[];

  filteredResults: AnalysisSummary[] = [];
  selectedParameters: String[] = [];

  constructor(private siteService: SiteService, private route: ActivatedRoute, private analysisService: AnalysisService) { }

  ngOnInit() {
    this.getAllParametersByDrillcoreId(this.route.snapshot.paramMap.get('id'));
    //this.getAnalysisSummaryByDrillcoreId(this.route.snapshot.paramMap.get('id'));
    this.getAllAnalysisSummaryData(this.route.snapshot.paramMap.get('id'));
    //new TableExport(document.getElementsByTagName("table"));
  }

  updateSelectedParameters(parameter) {
    //console.log(parameter);
    let deleteIndex = this.selectedParameters.indexOf(parameter);
    if (deleteIndex == -1)
      this.selectedParameters.push(parameter);
    else
      this.selectedParameters.splice(deleteIndex, 1)
    this.filterData(this.analysisSummaryData);
    this.filterChartData(this.filteredResults);   
  }

  exportTable(fileExtension: string, tableId: string){
    let tabledata=new TableExport(document.getElementById(tableId), { exportButtons: false} );
    let exportData=tabledata.getExportData()[tableId][fileExtension];
    tabledata.export2file(exportData.data,exportData.mimeType,exportData.filename, exportData.fileExtension); 
  }

  getAllParametersByDrillcoreId(id: string): void {
    this.siteService.searchAllParametersByDrillcoreId(id).subscribe(parameters => {
      this.siteParameters = parameters['results'];
    });
  }

  getAnalysisSummaryByDrillcoreId(id: string): void {
    this.analysisService.getAnalysisSummary(id).subscribe(analysisSummary => { this.analysisResults = analysisSummary['results']; console.log(this.analysisResults) });
  }

  getAllAnalysisSummaryData(id: string): void {
    this.analysisService.getAnalysisSummaryData(id).subscribe(analysisSummaryData => {
      this.analysisSummaryData = analysisSummaryData['results']; console.log(this.analysisSummaryData);
    });
  }

  filterChartData(results: AnalysisSummary[]): void {
    var data = [];
    for (let l = 0; l < this.selectedParameters.length; l++) {
      let x = [];
      let y = [];
      let name = this.getParameterName(this.selectedParameters[l]);
      for (let k = 0; k < results.length; k++) {
        let name = this.getParameterColumnName(this.selectedParameters[l], results[k]);
        //console.log("depth " + results[k].depth+" value "+results[k][name]);
        if (results[k][name]) {
          x.push(results[k].depth);
          y.push(results[k][name]);
        }
      }

      if (this.selectedParameters[l]['analysis__analysisresult__unit__unit'] == "ppm") {
        data.push({
          x,
          y,
          mode: 'lines+markers',
          type: 'scatter',
          name: name,
          yaxis: 'y2',
        })
      }
      else {
        data.push({
          x,
          y,
          mode: 'lines+markers',
          type: 'scatter',
          name: name
        })
      }
    }
    // console.log(data);
    var layout = {
      title: 'Analysis results',
      xaxis: {
        title: 'Depth',
        domain: [0.05, 0.95]
      },
      yaxis: {
        title: '%'
      },
      yaxis2: {
        title: 'ppm',
        titlefont: { color: 'rgb(148, 103, 189)' },
        tickfont: { color: 'rgb(148, 103, 189)' },
        overlaying: 'y',
        side: 'right'
      }
    };

    Plotly.newPlot('plotlyChart', data, layout,
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

  }


  filterData(results: AnalysisSummary[]): void {
    this.filteredResults = [];
    for (var k = 0; k < results.length; k++) {
      let addRow: boolean = false;
      //console.log("length" + this.selectedParameters.length);
      for (var i = 0; i < this.selectedParameters.length; i++) {
        let parameter = this.selectedParameters[i]['analysis__analysisresult__parameter__parameter'].toLowerCase();
        let unit;
        if (this.selectedParameters[i]['analysis__analysisresult__unit__unit'] == "%")
          unit = "pct";
        else
          unit = this.selectedParameters[i]['analysis__analysisresult__unit__unit'];
        let columnName = parameter + "_" + unit;

        if (results[k][columnName] != null && results[k].analysis_method == this.selectedParameters[i]['analysis__analysis_method__method']) {
          addRow = true;
        }
      }
      if (addRow == true) {

        this.filteredResults.push(results[k])
      }
      addRow = false;
    }
  }

  getParameterColumnName(parameter, analysisSummary: AnalysisSummary): string {
    let columnName = "";
    if (analysisSummary.analysis_method == parameter['analysis__analysis_method__method']) {
      let parameterLowCase = parameter['analysis__analysisresult__parameter__parameter'].toLowerCase();
      let unit;
      if (parameter['analysis__analysisresult__unit__unit'] == "%")
        unit = "pct";
      else
        unit = parameter['analysis__analysisresult__unit__unit'];
      columnName = parameterLowCase + "_" + unit;
    }
    return columnName;
  }

  getParameterName(parameter): string {
    let name = parameter['analysis__analysisresult__parameter__parameter'] + " " +
      parameter['analysis__analysisresult__unit__unit'] + " (" +
      parameter['analysis__analysis_method__method'] + ")";
    return name;
  }

}
