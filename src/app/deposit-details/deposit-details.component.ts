import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { DepositService } from '../services/deposit.service';
import { Deposit } from '../deposit';
import { MapService} from '../services/map.service';

@Component({
  selector: 'app-deposit-details',
  templateUrl: './deposit-details.component.html',
  styleUrls: ['./deposit-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DepositDetailsComponent implements OnInit {

  deposit: Deposit;
  //id: string;

  constructor(private route: ActivatedRoute, private depositService: DepositService, private mapService: MapService) { }

  ngOnInit() {
    //console.log(this.route.snapshot.paramMap.get('id'));
    //this.id=this.route.snapshot.paramMap.get('id');
    this.getDepositById(this.route.snapshot.paramMap.get('id'));
    this.mapService.drawMap();
    
  }

  getDepositById(id: string): void{
      this.depositService.searchDepositById(id).subscribe(deposit =>{ this.deposit = deposit['results'][0]; console.log(this.deposit);this.mapService.addPointWithName(this.deposit.name,this.deposit.longitude,this.deposit.latitude) });;
  }

}
