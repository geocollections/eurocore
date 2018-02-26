import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SiteService } from '../services/site.service';
import { Site } from '../site';
import { AnalysisService } from '../services/analysis.service';
import { AnalysisSummary } from '../analysis-summary';
import Plotly from 'plotly.js/dist/plotly.min';
import { TableExport } from 'tableexport';

@Component({
  selector: 'app-drillcore-data',
  templateUrl: './drillcore-data.component.html',
  styleUrls: ['./drillcore-data.component.css']
})
export class DrillcoreDataComponent implements OnInit {

  siteParameters: String[] = [];
  analysisResults: AnalysisSummary[];
  analysisSummaryData: AnalysisSummary[];

  filteredResults: AnalysisSummary[] = [];
  selectedParameters: String[] = [];
  tableData: AnalysisSummary[];

  constructor(private siteService: SiteService, private route: ActivatedRoute, private analysisService: AnalysisService) {
  }

  ngOnInit() {
    this.getAllParametersByDrillcoreId(this.route.snapshot.paramMap.get('id'));
    //this.getAnalysisSummaryByDrillcoreId(this.route.snapshot.paramMap.get('id'));
    this.getAllAnalysisSummaryData(this.route.snapshot.paramMap.get('id'));
  }

  updateSelectedParameters(parameter) {
    let deleteIndex = this.selectedParameters.indexOf(parameter);
    if (deleteIndex == -1)
      this.selectedParameters.push(parameter);
    else
      this.selectedParameters.splice(deleteIndex, 1)
    this.getTabsData();
  }

  getTabsData() {
    this.filterData(this.analysisSummaryData);
    this.filterChartData();
  }

  exportTable(fileExtension: string, tableId: string) {
    let tabledata = new TableExport(document.getElementById(tableId), { formats: ['xlsx', 'xls', 'csv', 'txt'], exportButtons: false });
    let exportData = tabledata.getExportData()[tableId][fileExtension];
    tabledata.export2file(exportData.data, exportData.mimeType, exportData.filename, exportData.fileExtension);
  }

  getAllParametersByDrillcoreId(id: string): void {
    this.siteService.searchAllParametersByDrillcoreId(id).subscribe(parameters => {
      for (var k = 0; k < parameters['results'].length; k++)
        if (parameters['results'][k]['analysis__analysisresult__parameter__parameter'] != null && parameters['results'][k]['analysis__analysisresult__unit__unit'] != null)
          this.siteParameters.push(parameters['results'][k]);
    });
  }

  getAnalysisSummaryByDrillcoreId(id: string): void {
    this.analysisService.getAnalysisSummary(id).subscribe(analysisSummary => {
      this.analysisResults = analysisSummary['results'];
      console.log(this.analysisResults)
    });
  }

  getAllAnalysisSummaryData(id: string): void {
    this.analysisService.getAnalysisSummaryData(id).subscribe(analysisSummaryData => {
      this.analysisSummaryData = analysisSummaryData['results']; console.log(this.analysisSummaryData);
    });
  }

  filterChartData(): void {
    var results = this.filteredResults;
    var data = [];
    var fName = this.siteParameters[0]['name'];
    for (let l = 0; l < this.selectedParameters.length; l++) {
      let x = [];
      let y = [];
      let name = this.getParameterName(this.selectedParameters[l]);
      for (let k = 0; k < results.length; k++) {
        let name = this.getParameterColumnName(this.selectedParameters[l], results[k]);
        if (results[k][name]) {
          x.push(results[k].depth);
          y.push(results[k][name]);
        }
      }

      if (this.selectedParameters[l]['analysis__analysisresult__unit__unit'] == "ppm") {
        data.push({
          x,
          y,
          type: 'scattergl',
          //mode: 'markers',
          mode: 'lines+markers',
          //mode: 'lines',
          name: name,
          yaxis: 'y2',
        })
      }
      else {
        data.push({
          x,
          y,
          type: 'scattergl',
          //mode: 'markers',
          mode: 'lines+markers',
          //mode: 'lines',
          name: name
        })
      }
    }


    var layout = {
      showlegend: true,
      margin: {
        l: 10,
        r: 10,
        b: 40,
        t: 120,
        pad: 4
      },
      title: fName,
      legend: {
        x: 0,
        y: 1.1,
        "orientation": "h",
      },
      xaxis: {
        title: 'Depth',
        domain: [0.05, 0.95],
        linecolor: 'black',
        linewidth: 1,
        // mirror: true,
        autotick: true,
        ticks: "outside",
        ticklen: 5,
        tickwidth: 1,
        tickcolor: 'black'
      },
      yaxis: {
        side: 'left',
        title: '%',
        linecolor: 'black',
        linewidth: 1,
        mirror: true,
        autotick: true,
        ticks: "outside",
        ticklen: 5,
        tickwidth: 1,
        tickcolor: 'black'
      },
      yaxis2: {
        title: 'ppm',
        titlefont: { color: 'rgb(148, 103, 189)' },
        tickfont: { color: 'rgb(148, 103, 189)' },
        overlaying: 'y',
        side: 'right',
        linecolor: 'black',
        linewidth: 1,
        mirror: true,
        autotick: true,
        ticks: "outside",
        ticklen: 5,
        tickwidth: 1,
        tickcolor: 'black',
        showgrid: false,
      }
    };


    var d3 = Plotly.d3;

    var WIDTH_IN_PERCENT_OF_PARENT = 90,
      HEIGHT_IN_PERCENT_OF_PARENT = WIDTH_IN_PERCENT_OF_PARENT / 3 * 2;

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

    //var start = window.performance.now();
    Plotly.newPlot(gd, data, layout,
      {
        modeBarButtonsToRemove: ['toImage'],
        modeBarButtonsToAdd: [{
          name: 'Download plot as a SVG',
          icon: Plotly.Icons.camera,
          click: function (gd) {

            Plotly.downloadImage(gd, { filename: fName, format: 'svg', height: 600, width: 900 })
          }
        }],
        displaylogo: false
      }
    );
    //var end = window.performance.now();
    //console.log(end - start + 'ms');

    window.onresize = function () {
      Plotly.Plots.resize(gd);
    };

    document.getElementById("chartTabLink").addEventListener("click", function () {
      Plotly.Plots.resize(gd);
    })
  }


  filterData(results: AnalysisSummary[]): void {
    this.filteredResults = [];
    for (var k = 0; k < results.length; k++) {
      let addRow: boolean = false;
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
    //this.tableData = this.filteredResults.slice(0, 100);
    this.tableData = this.filteredResults;
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
    this.selectedParameters = [];
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
