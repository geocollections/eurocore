import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DrillcoreBoxService } from '../services/drillcore-box.service';
import { DrillcoreBox } from '../drillcoreBox';

@Component({
  selector: 'app-drillcore-boxes',
  templateUrl: './drillcore-boxes.component.html',
  styleUrls: ['./drillcore-boxes.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DrillcoreBoxesComponent implements OnInit {

  corebox: DrillcoreBox;

  constructor(private drillcoreBoxService: DrillcoreBoxService) { }

  ngOnInit() {
    this.getDepositById("1");
  }

  getDepositById(id: string): void{
    this.drillcoreBoxService.getDrillcoreBoxById(id).subscribe(corebox =>{this.corebox=corebox['results'][0]; console.log(this.corebox)});
    //this.depositService.searchDepositById(id).subscribe(deposit =>{ this.deposit = deposit['results'][0]; console.log(this.deposit);this.mapService.addPointWithName(this.deposit.name,this.deposit.longitude,this.deposit.latitude) });;
}

}
