import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SiteService } from '../services/site.service';
import { Site } from '../site';
import { AnalysisService } from '../services/analysis.service';
import { AnalysisSummary } from '../analysis-summary';
import Plotly from 'plotly.js/dist/plotly-basic.min';
import { TableExport } from 'tableexport';

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
  }

  updateSelectedParameters(parameter) {
    console.log(this.siteParameters);
    let deleteIndex = this.selectedParameters.indexOf(parameter);
    if (deleteIndex == -1)
      this.selectedParameters.push(parameter);
    else
      this.selectedParameters.splice(deleteIndex, 1)
    this.getTabsData();
    //console.log(this.selectedParameters);
  }
  getTabsData() {
    this.filterData(this.analysisSummaryData);
    this.filterChartData();
  }

  exportTable(fileExtension: string, tableId: string) {
    let tabledata = new TableExport(document.getElementById(tableId), {formats: ['xlsx','xls', 'csv', 'txt'],exportButtons: false });
    let exportData = tabledata.getExportData()[tableId][fileExtension];
    tabledata.export2file(exportData.data, exportData.mimeType, exportData.filename, exportData.fileExtension);
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

  filterChartData(): void {
    var results = this.filteredResults;
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
          //mode: 'lines',
          type: 'scattergl',
          name: name,
          yaxis: 'y2',
        })
      }
      else {
        data.push({
          x,
          y,
          mode: 'lines+markers',
         // mode: 'lines',
          type: 'scattergl',
          name: name
        })
      }
    }
    //console.log(this.siteParameters[0]['name']);
    var layout = {
      margin: {
        l: 10,
        r: 10,
        b: 40,
        t: 80,
        pad: 4
      },
      /*title: 'Analysis results',*/
      legend: {
        x: 0,
        y: 1.1,
        "orientation": "h",
      },
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
    let fName = this.siteParameters[0]['name'];


    var d3 = Plotly.d3;

    var WIDTH_IN_PERCENT_OF_PARENT = 90,
      HEIGHT_IN_PERCENT_OF_PARENT = 70;
    //console.log(d3.select("div[id='plotlyChart']"));
    var gd3 = d3.select("div[id='plotlyChart']")
      //.append('div')
      .style({
        width: WIDTH_IN_PERCENT_OF_PARENT + '%',
        'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',
        height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
        //height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
        //'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
      });

    var gd = gd3.node();

    Plotly.newPlot(gd, data, layout,
      {
        modeBarButtonsToRemove: ['toImage'],
        modeBarButtonsToAdd: [{
          name: 'Download plot as a SVG',
          icon: Plotly.Icons.camera,
          click: function (gd) {

            Plotly.downloadImage(gd, { filename: fName, format: 'svg', height: 400, width: 800 })
          }
        }],
        displaylogo: false
      });

    window.onresize = function () {
      Plotly.Plots.resize(gd);
    };

  }


  filterData(results: AnalysisSummary[]): void {
    this.filteredResults = [];
    console.log("start...");
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
    console.log("end...");
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

  selectAllParameters() {
    var data = document.getElementsByName("parameter[]");
    for (var i = 0; i < data.length; i++) {
      (<HTMLInputElement>data[i]).checked = true;
    }
    for (let i = 0; i < this.siteParameters.length; i++)
      this.selectedParameters.push(this.siteParameters[i]);
    this.getTabsData();
  }

  clearAllParameters() {
    var data = document.getElementsByName("parameter[]");
    for (var i = 0; i < data.length; i++) {
      (<HTMLInputElement>data[i]).checked = false;
    }
    this.selectedParameters = [];
    this.getTabsData();
  }

}
