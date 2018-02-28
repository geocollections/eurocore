import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule, HttpClientJsonpModule }    from '@angular/common/http';
import {JsonpModule, Jsonp, Response} from '@angular/http';

//import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
//import { SelectModule } from 'ng-select';
import { NgSelectModule } from '@ng-select/ng-select';


import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AppComponent } from './app.component';
import { SiteDetailsComponent } from './site-details/site-details.component';
import { SiteService } from './services/site.service';
import { AppRoutingModule } from './/app-routing.module';
import { OresComponent } from './ores/ores.component';
import { DataComponent } from './data/data.component';
import { SiteSearchComponent } from './site-search/site-search.component';
import { DepositDetailsComponent } from './deposit-details/deposit-details.component';
import { LithologyService } from './services/lithology.service';
import { DepositService } from './services/deposit.service';
import { SampleDetailsComponent } from './sample-details/sample-details.component';
import { AnalysisDetailsComponent } from './analysis-details/analysis-details.component';
import { SampleService } from './services/sample.service';
import { AnalysisService } from './services/analysis.service';
import { DrillcoreBoxesComponent } from './drillcore-boxes/drillcore-boxes.component';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { DrillcoreBoxService } from './services/drillcore-box.service';
import { DrillcoreDataComponent } from './drillcore-data/drillcore-data.component';
import { SpectrumDetailsComponent } from './spectrum-details/spectrum-details.component';
import { DipService } from './services/dip.service';
import { RqdService } from './services/rqd.service';
import { OlMapService } from './services/ol-map.service';
import { ReferenceService } from './services/reference.service';

 

@NgModule({
  declarations: [
    AppComponent,
    SiteDetailsComponent,
    OresComponent,
    DataComponent,
    SiteSearchComponent,
    DepositDetailsComponent,
    SampleDetailsComponent,
    AnalysisDetailsComponent,
    DrillcoreBoxesComponent,
    FrontpageComponent,
    DrillcoreDataComponent,
    SpectrumDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    JsonpModule,
    HttpClientJsonpModule,
    InfiniteScrollModule, 
    NgbModule.forRoot(),
    TypeaheadModule.forRoot(),
    NgSelectModule,   
    //SelectModule,
  ],
  providers: [SiteService, LithologyService, DepositService, SampleService, AnalysisService, DrillcoreBoxService, DipService, RqdService, OlMapService, ReferenceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
