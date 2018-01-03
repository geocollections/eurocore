import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule, HttpClientJsonpModule }    from '@angular/common/http';
import {JsonpModule, Jsonp, Response} from '@angular/http';


import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AppComponent } from './app.component';
import { SitesComponent } from './sites/sites.component';
import { SiteDetailsComponent } from './site-details/site-details.component';
import { SiteService } from './services/site.service';
import { AppRoutingModule } from './/app-routing.module';
import { OresComponent } from './ores/ores.component';
import { DataComponent } from './data/data.component';
import { SiteSearchComponent } from './site-search/site-search.component';
import { DepositDetailsComponent } from './deposit-details/deposit-details.component';
import { MapComponent } from './map/map.component';
import { MapService } from './services/map.service';
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

 

@NgModule({
  declarations: [
    AppComponent,
    SitesComponent,
    SiteDetailsComponent,
    OresComponent,
    DataComponent,
    SiteSearchComponent,
    DepositDetailsComponent,
    MapComponent,
    SampleDetailsComponent,
    AnalysisDetailsComponent,
    DrillcoreBoxesComponent,
    FrontpageComponent,
    DrillcoreDataComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    JsonpModule,
    HttpClientJsonpModule,
    InfiniteScrollModule, 
  ],
  providers: [SiteService, MapService, LithologyService, DepositService, SampleService, AnalysisService, DrillcoreBoxService],
  bootstrap: [AppComponent]
})
export class AppModule { }
