import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SitesComponent }      from './sites/sites.component';
import { OresComponent }   from './ores/ores.component';
import { DataComponent }   from './data/data.component';
import { SiteDetailsComponent }   from './site-details/site-details.component';
import { DepositDetailsComponent }   from './deposit-details/deposit-details.component';
import { SampleDetailsComponent }   from './sample-details/sample-details.component';
import { AnalysisDetailsComponent }   from './analysis-details/analysis-details.component';
import { DrillcoreBoxesComponent} from "./drillcore-boxes/drillcore-boxes.component";
import { FrontpageComponent} from "./frontpage/frontpage.component";


const routes: Routes = [
  { path: 'drillcore', component: SitesComponent },
  { path: 'ores', component: OresComponent },
  { path: 'data', component: DataComponent },
  { path: 'drillcore/:id', component: SiteDetailsComponent },
  { path: 'deposit/:id', component: DepositDetailsComponent },
  { path: 'sample/:id', component: SampleDetailsComponent },
  { path: 'analysis/:id', component: AnalysisDetailsComponent },
  { path: 'drillcore/:id/coreboxes', component: DrillcoreBoxesComponent },
  { path: '', component: FrontpageComponent },
];  

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes,  { useHash: true }) ]
})
export class AppRoutingModule { }

