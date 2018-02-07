import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { NgSelectModule, NgOption } from '@ng-select/ng-select';
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

  myOptions = [
    { label: 'Au', value: 'Au' },
    { label: 'Fe', value: 'Fe' },
    { label: 'Ni', value: 'Ni' },
    { label: 'S', value: 'S' },
    { label: 'Ag', value: 'Ag' }
  ];
  opt = [{ label: 'dsd', value: "dsd" }, { label: 'dsd2', value: "dds" }];
  selected;
  searchDrillcoreName: string = "";
  searchAnalysesMethods: string = "";
  searchComparisonOperator: string = "";
  searchComparisonValue: string = "";
  searchComparisonParameter: string = "";
  //searchAnalyticlaMethod:
  drillcoreAutocompleteValues: string[];
  methodAutocompleteValues: string[] = [];
  measuredParameters: string[];

  drillcoreIds = [];
  sampleIds = [];
  analysisIds = [];

  sites: Site[];
  samples: Sample[];
  analysisSummary: AnalysisSummary[];

  constructor(private siteService: SiteService, private analysisService: AnalysisService, 
    private sampleService: SampleService, private platformLocation: PlatformLocation) {
  }

  ngOnInit() {
  }

  getDrillcoreByName(): void {
    this.siteService.searchDrillcoreByName(this.searchDrillcoreName).subscribe(
      drillcoreValues => {
        if (drillcoreValues['results'])
          this.drillcoreAutocompleteValues = drillcoreValues['results'];
        else
          this.drillcoreAutocompleteValues = [];
        // console.log("values" + JSON.stringify(this.drillcoreAutocompleteValues));
        console.log(this.drillcoreAutocompleteValues);
      });
  }

  getAnalyticalMehtods(): void {
    console.log(this.searchDrillcoreName);
    this.methodAutocompleteValues = [];
    console.log("get methods");
    if (this.searchDrillcoreName == "") {
      this.analysisService.getAllAnalysesMethods().subscribe(analysesMethods => {
        for (var k = 0; k < analysesMethods['results'].length; k++)
          this.methodAutocompleteValues.push(analysesMethods['results'][k].analysis_method);
        //this.analysesMethods=analysesMethods['results'];
        console.log(this.methodAutocompleteValues);
      });
    }
    else {
      this.siteService.searchAnalysesMethods(this.searchDrillcoreName).subscribe(analysesMethods => {
        for (var k = 0; k < analysesMethods['results'].length; k++)
          this.methodAutocompleteValues.push(analysesMethods['results'][k].analysis__analysis_method__method);
        // this.analysesMethods=analysesMethods['results'];
        console.log(this.methodAutocompleteValues);
      });
    }
  }

  getMeasuredParameters(): void {
    this.measuredParameters = [];
    this.analysisService.getMeasuredParameters(this.searchDrillcoreName, this.searchAnalysesMethods).subscribe(measuredParameters => {
      this.measuredParameters = measuredParameters['results'];
      console.log("paras " + JSON.stringify(this.measuredParameters));
    })
  }

  getDrillcoresByIds() {
    this.siteService.searchSites(this.drillcoreIds, '', '', '', '', '').subscribe(sites => {
      this.sites = sites['results'];
      console.log(sites['results']);
    });
  }

  getSamplesByIds() {
    console.log(this.sampleIds.toString());
    this.sampleService.searchSamplesByIds(this.sampleIds).subscribe(samples => {
      this.samples = samples['results'];
      console.log(samples['results']);
    })
  }

  getData() {
    this.drillcoreIds = [];
    this.analysisIds = [];
    this.sampleIds = [];
    var id = "";
    var parameterComparison = "";
    if (this.searchComparisonParameter != "" && this.searchComparisonOperator != "" && this.searchComparisonValue != "")
      parameterComparison = this.searchComparisonParameter + "__" + this.searchComparisonOperator + "=" + this.searchComparisonValue;

    if (this.drillcoreAutocompleteValues)
      id = this.getDrillcoreId(this.searchDrillcoreName);


    console.log("id " + id);
    this.analysisService.getAnalysesData(id, this.searchAnalysesMethods, parameterComparison).subscribe(data => {
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
      console.log("analysis ids" + this.analysisIds.length);
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

  resetFormValues(): void {
    this.searchDrillcoreName = "";
    this.searchAnalysesMethods = "";
    this.searchComparisonOperator = "";
    this.searchComparisonValue = "";
    this.searchComparisonParameter = "";
  }

  openNewWin(subUrl: string,id:string):void{    
    window.open((this.platformLocation as any).location.pathname +'#/'+subUrl+'/'+id, '', 'width=800,height=800') ;
  }


}
