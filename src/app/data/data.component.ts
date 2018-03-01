import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { NgSelectModule, NgOption, } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { SiteService } from '../services/site.service';
import { AnalysisService } from '../services/analysis.service';
import { SampleService } from '../services/sample.service';
import { Site } from '../site';
import { Sample } from '../sample';
import { AnalysisSummary } from '../analysis-summary';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
  encapsulation: ViewEncapsulation.None
}) 
export class DataComponent implements OnInit {


  searchDrillcoreName: string[] = [];
  searchAnalysesMethods: string[] = [];
  searchParameters: Object[] = [];
  drillcoreAutocompleteValues: string[];
  methodAutocompleteValues: string[];
  measuredParameters: Object[];

  searchComparisonParameter2: string[] = ['', ''];
  searchComparisonOperator2: string[] = ['gt', 'gt'];
  searchComparisonValue2: string[] = ['', ''];
  parameterRowsCount: number[] = [1, 1];

  parameterKeys: Object[] = [];

  drillcoreIds = [];
  sampleIds = [];
  analysisIds = [];
  dataCount = "";

  sites: Site[];
  samples: Sample[];
  analysisSummary: AnalysisSummary[];

  constructor(private siteService: SiteService, private analysisService: AnalysisService,
    private sampleService: SampleService, private platformLocation: PlatformLocation) {
  }

  ngOnInit() {
    this.getAnalyticalMehtods();
    this.getMeasuredParameters();
    this.getDrillcoreByName();
  }


  addRow() {
    this.parameterRowsCount.push(1);
    this.searchComparisonParameter2.push('');
    this.searchComparisonOperator2.push('gt');
    this.searchComparisonValue2.push('');
  }

  deleteRow(num: number) {
    this.parameterRowsCount.splice(num, 1);
    this.searchComparisonParameter2.splice(num, 1);
    this.searchComparisonOperator2.splice(num, 1);
    this.searchComparisonValue2.splice(num, 1);
  }


  getDrillcoreByName(): void {
    this.siteService.searchAllSitesNames().subscribe(
      drillcoreValues => {
        if (drillcoreValues['results'])
          this.drillcoreAutocompleteValues = drillcoreValues['results'];
        else
          this.drillcoreAutocompleteValues = [];
      });
  }

  getAnalyticalMehtods(): void {
    this.methodAutocompleteValues = [];
    this.analysisService.getAllAnalysesMethods().subscribe(analysesMethods => {
      this.methodAutocompleteValues = analysesMethods['results'];
      console.log(this.methodAutocompleteValues);
    });
  }

  getMeasuredParameters(): void {
    this.measuredParameters = [];
    this.analysisService.getMeasuredParameters("", []).subscribe(measuredParameters => {
      this.measuredParameters = measuredParameters['results'];
      for (var k = 0; k < this.measuredParameters.length; k++) {
        this.measuredParameters[k]['label'] = this.measuredParameters[k]['analysisresult__parameter__parameter'] + " " + this.measuredParameters[k]['analysisresult__unit__unit']
        this.measuredParameters[k]['value'] = this.getParameterColumnName(this.measuredParameters[k]['analysisresult__parameter__parameter'],
          this.measuredParameters[k]['analysisresult__unit__unit'])
      }
      this.onChange(this.searchParameters);
    })
  }

  getDrillcoresByIds() {
    this.siteService.searchSites(this.drillcoreIds, '', '', '', '', '').subscribe(sites => {
      this.sites = sites['results'];
      //console.log(sites['results']);
    });
  }

  getSamplesByIds() {
    console.log(this.sampleIds.toString());
    this.sampleService.searchSamplesByIds(this.sampleIds).subscribe(samples => {
      this.samples = samples['results'];
      //console.log(samples['results']);
    })
  }

  getData() {
    this.drillcoreIds = [];
    this.analysisIds = [];
    this.sampleIds = [];
    this.dataCount = "";
    var id = "";
    var parameterComparison = [];

    for (var i = 0; i < this.searchComparisonParameter2.length; i++) {
      if (this.searchComparisonParameter2[i] != "" && this.searchComparisonOperator2[i] != "" && this.searchComparisonValue2[i] != "")
        parameterComparison.push(this.searchComparisonParameter2[i] + "__" + this.searchComparisonOperator2[i] + "=" + this.searchComparisonValue2[i]);
    }

    console.log("id " + id);
    this.analysisService.getAnalysesData(this.searchDrillcoreName, this.searchAnalysesMethods, parameterComparison).subscribe(data => {
      this.analysisSummary = data['results'];
      for (var k = 0; k < this.analysisSummary.length; k++) {
        if (!this.drillcoreIds.includes(this.analysisSummary[k]['drillcore_id']) && this.analysisSummary[k]['drillcore_id'] != null)
          this.drillcoreIds.push(this.analysisSummary[k]['drillcore_id']);
        if (!this.sampleIds.includes(this.analysisSummary[k]['sample_id']) && this.analysisSummary[k]['sample_id'] != null)
          this.sampleIds.push(this.analysisSummary[k]['sample_id']);
        if (!this.analysisIds.includes(this.analysisSummary[k]['analysis_id']) && this.analysisSummary[k]['analysis_id'] != null)
          this.analysisIds.push(this.analysisSummary[k]['analysis_id']);
      }
      console.log("cores count " + this.drillcoreIds.length);
      console.log("sample ids " + this.sampleIds.length);
      console.log("analysis ids" + data['count']);
      this.dataCount = data['count'];
    })
  }

  getDrillcoreId(name: string): string {
    var id = "";
    if (this.drillcoreAutocompleteValues)
      for (var k = 0; k < this.drillcoreAutocompleteValues.length; k++) {
        if (this.drillcoreAutocompleteValues[k]['name'] == name) {
          id = this.drillcoreAutocompleteValues[k]['id'];
        }
      }
    return id;
  }

  getParameterColumnName(parameter: string, unit: string): string {
    let columnName = "";
    if (unit == "%")
      unit = "pct";
    columnName = parameter.toLowerCase() + "_" + unit;
    return columnName;
  }

  getParameterName(parameterColumn: string) {
    var parName = parameterColumn.charAt(0).toUpperCase() + parameterColumn.slice(1);
    var pars = parName.split("_");
    if (pars[1] == "pct")
      pars[1] = "%";
    return pars[0] + " " + pars[1]
  }

  resetFormValues(): void {
    this.searchDrillcoreName = [];
    this.searchAnalysesMethods = [];
    this.searchParameters = [];
    //this.parameterKeys=[];
    this.onChange(this.searchParameters);
    for (var i = 0; i < this.searchComparisonParameter2.length; i++) {
      this.searchComparisonParameter2[i] = "";
      this.searchComparisonOperator2[i] = "gt";
      this.searchComparisonValue2[i] = "";
    }
    //this.analysisSummary=null;
    //this.getData();
  }

  openNewWin(subUrl: string, id: string): void {
    window.open((this.platformLocation as any).location.pathname + '#/' + subUrl + '/' + id, '', 'width=800,height=800');
  }


  getDrillcoreName(id: string): string {
    for (var i = 0; i < this.drillcoreAutocompleteValues.length; i++) {
      if (this.drillcoreAutocompleteValues[i]['id'] == id)
        return this.drillcoreAutocompleteValues[i]['name'];
    }
  }

  onChange($event) {
    if ($event.length == 0)
      //this.searchParameters=this.measuredParameters;
      this.parameterKeys = this.measuredParameters
    else
      this.parameterKeys = this.searchParameters;
    console.log($event);
  }

}
