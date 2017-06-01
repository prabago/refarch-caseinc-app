/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }  from './app.component';
import { HomeComponent } from './home.component';
import { LoginComponent }  from './login/login.component';
import { ConversationComponent} from './conv/conversation.component';
import { ConversationService }  from './conv/conversation.service';
import { InventoryComponent} from './inventory/inventory.component';
import { InventoryService }  from './inventory/inventory.service';
import { HomeService }  from './home.service';
import { AuthGuard }         from './login/auth.guard';
import { AuthenticationService } from "./login/authentication.service";
import { AlertService }          from "./login/alert.service";


const routes: Routes = [
  { path: 'home', component: HomeComponent,canActivate: [AuthGuard] },
  { path: 'log', component: LoginComponent },
  { path: 'inventory', component: InventoryComponent,canActivate: [AuthGuard]},
  { path: 'itSupport', component: ConversationComponent,canActivate: [AuthGuard]},
  // otherwise redirect to home
  { path: '**', redirectTo: 'home' }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ConversationComponent,
    InventoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AlertService,
    AuthenticationService,
    AuthGuard,
    ConversationService,
    InventoryService,
    HomeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
