import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { TlUiExamplesModule } from './tl-ui-examples';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TlUiExamplesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
