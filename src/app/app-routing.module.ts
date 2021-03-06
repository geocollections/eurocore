import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OresComponent }   from './ores/ores.component';
import { DataComponent }   from './data/data.component';
import { SiteDetailsComponent }   from './site-details/site-details.component';
import { DepositDetailsComponent }   from './deposit-details/deposit-details.component';
import { SampleDetailsComponent }   from './sample-details/sample-details.component';
import { AnalysisDetailsComponent }   from './analysis-details/analysis-details.component';
import { DrillcoreBoxesComponent} from "./drillcore-boxes/drillcore-boxes.component";
import { FrontpageComponent} from "./frontpage/frontpage.component";
import { DrillcoreDataComponent } from './drillcore-data/drillcore-data.component';
import { SpectrumDetailsComponent } from './spectrum-details/spectrum-details.component';
import { SiteSearchComponent } from './site-search/site-search.component';


const routes: Routes = [
  { path: 'drillcore', component: SiteSearchComponent },
  { path: 'teaching_aids', component: OresComponent },
  { path: 'data_search', component: DataComponent },
  { path: 'drillcore/:id', component: SiteDetailsComponent },
  { path: 'deposit/:id', component: DepositDetailsComponent },
  { path: 'sample/:id', component: SampleDetailsComponent },
  { path: 'analysis/:id', component: AnalysisDetailsComponent },
  { path: 'corebox/:id', component: DrillcoreBoxesComponent },
  { path: 'drillcore_data/:id', component: DrillcoreDataComponent}, 
  { path: 'spectrum/:id', component: SpectrumDetailsComponent}, 
  { path: '', component: FrontpageComponent },
];  

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes,  { useHash: true }) ]
})
export class AppRoutingModule { }

