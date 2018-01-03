import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DrillcoreBoxService } from '../services/drillcore-box.service';
import { DrillcoreBox } from '../drillcoreBox';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-drillcore-boxes',
  templateUrl: './drillcore-boxes.component.html',
  styleUrls: ['./drillcore-boxes.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DrillcoreBoxesComponent implements OnInit {

  corebox: DrillcoreBox;

  constructor(private drillcoreBoxService: DrillcoreBoxService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getDepositById(this.route.snapshot.paramMap.get('id'));
  }

  getDepositById(id: string): void {
    this.drillcoreBoxService.getDrillcoreBoxById(id).subscribe(corebox => { this.corebox = corebox['results'][0]; console.log(this.corebox) });
  }

}
