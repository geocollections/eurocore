import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SampleService } from '../services/sample.service';
import { AnalysisService } from '../services/analysis.service';
import { Sample } from '../sample';
import { Analysis } from '../analysis';

@Component({
  selector: 'app-sample-details',
  templateUrl: './sample-details.component.html',
  styleUrls: ['./sample-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SampleDetailsComponent implements OnInit {

  sample: Sample;
  analyzes: Analysis[];

  constructor(private route: ActivatedRoute, private sampleSerrivce: SampleService, private analysisSerrivce: AnalysisService) { }

  ngOnInit() {
    this.getSampleById(this.route.snapshot.paramMap.get('id'));
    this.getAnalyzesBySampleId(this.route.snapshot.paramMap.get('id'));

  }

  getSampleById(id: string): void{
      this.sampleSerrivce.searchSampleById(id).subscribe(sample =>{this.sample=sample['results'][0]; console.log(this.sample.sample_number); });
  }
  getAnalyzesBySampleId(id: string): void{
    this.analysisSerrivce.getAnalyzesBySampleId(id).subscribe(analyzes=>{this.analyzes=analyzes['results']; console.log(this.analyzes);})
  }

}
