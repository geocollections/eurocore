import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import {IOption} from 'ng-select';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DataComponent implements OnInit {

  myOptions: Array<IOption> = [
    {label: 'Au', value: 'Au'},
    {label: 'Fe', value: 'Fe'},
    {label: 'Ni', value: 'Ni'},
    {label: 'S', value: 'S'},
    {label: 'Ag', value: 'Ag'}
];
  selected;


  constructor() { }

  ngOnInit() {
  }

}
