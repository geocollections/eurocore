import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SiteService } from '../services/site.service';
import { Site } from '../site';
import { AnalysisService } from '../services/analysis.service';
import { AnalysisSummary } from '../analysis-summary';
import Plotly from 'plotly.js/dist/plotly-basic.min';

@Component({
  selector: 'app-drillcore-data',
  templateUrl: './drillcore-data.component.html',
  styleUrls: ['./drillcore-data.component.css']
})
export class DrillcoreDataComponent implements OnInit {

  siteParameters: Site[];
  //checkedParameters:String[];
  analysisResults: AnalysisSummary[];
  analysisSummaryData: AnalysisSummary[];

  constructor(private siteService: SiteService, private route: ActivatedRoute, private analysisService: AnalysisService) { }

  ngOnInit() {
    this.getAllParametersByDrillcoreId(this.route.snapshot.paramMap.get('id'));
    //this.getAnalysisSummaryByDrillcoreId(this.route.snapshot.paramMap.get('id'));
    this.getAllAnalysisSummaryData(this.route.snapshot.paramMap.get('id'));
  }

  getAllParametersByDrillcoreId(id: string): void {
    this.siteService.searchAllParametersByDrillcoreId(id).subscribe(parameters => { this.siteParameters = parameters['results']; 
    console.log(this.siteParameters[0]['analysis__analysisresult__parameter__parameter'].toLowerCase()+'_'+ this.siteParameters[0]['analysis__analysisresult__unit__unit']);
    console.log(this.siteParameters[0]['analysis__analysis_method__method']);
    console.log(this.siteParameters) });
  }

  changeParameters(element: HTMLInputElement): void {
    console.log(element.value);
    console.log(`Checkbox ${element.value} was ${element.checked ? '' : 'un'}checked\n`);
  }

  getAnalysisSummaryByDrillcoreId(id: string): void {
    this.analysisService.getAnalysisSummary(id).subscribe(analysisSummary => { this.analysisResults = analysisSummary['results']; console.log(this.analysisResults) });
  }

  getAllAnalysisSummaryData(id:string):void{
    let name: string;
    let dataValues:string[];
    let array=[];
    this.analysisService.getAnalysisSummaryData(id).subscribe(analysisSummaryData=>{this.analysisSummaryData=analysisSummaryData['results']; this.filterChartData(this.analysisSummaryData); console.log(this.analysisSummaryData);
    for(let i=0; i<this.analysisSummaryData.length;i++){

    }
    name="as";
    dataValues=["2","3"];
    array.push({name,dataValues});
    name="as222"
    dataValues=["2","3","4"];
    array.push({name,dataValues});
    console.log(array);
    console.log(array[0].dataValues[1]);
  
  });
  }

  filterChartData(results: AnalysisSummary[]): void {
    console.log(results);
    var data = [];
    var x = [];
    var y = [];
    var x2 = [];
    var y2 = [];
    let s_pct = [];
    let ni_pct = [];
    let fe_pct = [];
    let au_ppm = [];
    let cu_pct = [];
    let co_pct = [];
    let zn_pct = [];
    let s_pct_leco = [];

    var t = {
      x,
      y,
      type: 'scatter',
      name: "Au ppm (FA-AAS)"
    }
    var t2 = {
      x,
      y,
      type: 'scatter',
      name: "Au ppm (ICP-OES)"
    }
    for (var k = 0; k < results.length; k++) {
      //console.log("au"+results[k].au_ppm);
      //console.log("depth"+results[k].depth);
      /*if (results[k].au_ppm==null){
        results[k].au_ppm=0;
        }*/
      //if (k % 2 == 0) {
      if(results[k].s_pct!=null && results[k].analysis_method=="ICP-OES")
      s_pct.push(results[k].s_pct);
      if(results[k].s_pct!=null && results[k].analysis_method=="Leco")
      s_pct_leco.push(results[k].s_pct);
      if(results[k].ni_pct!=null)
      ni_pct.push(results[k].ni_pct);
      if(results[k].fe_pct!=null)
      fe_pct.push(results[k].fe_pct);
      if(results[k].au_ppm!=null)
      au_ppm.push(results[k].au_ppm);
      if(results[k].cu_pct!=null)
      cu_pct.push(results[k].cu_pct);
      if(results[k].co_pct!=null)
      co_pct.push(results[k].co_pct);
      if(results[k].zn_pct!=null)
      zn_pct.push(results[k].zn_pct);
      if(!x.includes(results[k].depth))
      x.push(results[k].depth);
      /*         
       y.push(results[k].au_ppm);
  /* }
   if (k % 2 == 1) {
     x2.push(results[k].depth);        
     y2.push(results[k].au_ppm);
   }*/

    }
    console.log("Niiiiiii ---"+ni_pct);
    y = zn_pct;
    data.push({
      x,
      y,
      type: 'scatter',
      name: "Zn % (ICP-OES)"
    })
    y = fe_pct;
    data.push({
      x,
      y,
      type: 'scatter',
      name: "Fe % (ICP-OES)"
    })
    y = ni_pct;
    data.push({
      x,
      y,
      type: 'scatter',
      name: "Ni % (ICP-OES)"
    })
    y = cu_pct;
    data.push({
      x,
      y,
      type: 'scatter',
      name: "Cu % (ICP-OES)"
    })
    y = co_pct;
    data.push({
      x,
      y,
      type: 'scatter',
      name: "Co % (ICP-OES)"
    })
    y = s_pct;
    data.push({
      x,
      y,
      type: 'scatter',
      name: "S % (ICP-OES)"
    })
    y = au_ppm;
    data.push({
      x,
      y,
      type: 'scatter',
      name: "Au ppm(FA-AAS)"
    })
    y = s_pct_leco;
    data.push({
      x,
      y,
      type: 'scatter',
      name: "S % (Leco)"
    })
    //t2.x=x2;
    //t2.y=y2;
    console.log(t);
    console.log(t2);
    //data = [t];
    var layout = {
      title: 'Chart title',
      xaxis: {
        title: 'Depth'
      },
      yaxis: {
        title: '%'
      }
    };

    Plotly.newPlot('plotlyChart', data, layout);

  }
}
