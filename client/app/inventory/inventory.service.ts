import { Injectable }    from '@angular/core';
import { Headers, Http,Response,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Item } from "./Item";
import { User } from "../login/User";

@Injectable()
export class InventoryService {
  private invUrl ='/api/i';

  constructor(private http: Http) {

  };
  buildOptions() : RequestOptions {
    let u: User =JSON.parse(localStorage.getItem('currentUser'));
    let headers = new Headers({ 'token': u.token });
    let options = new RequestOptions({ headers: headers })
    return options;
  }

  getItems(): Observable<any>{
    let options = this.buildOptions();
    return this.http.get(this.invUrl+'/items',options)
         .map((res:Response) =>
          res.json())
  }

  saveItem(i) : Observable<any> {
    let options = this.buildOptions();
    return this.http.post(this.invUrl+'/items',{item:i},options).map((res:Response) => res.json());
  }

  updateItem(i) : Observable<any> {
    let options = this.buildOptions();
    return this.http.put(this.invUrl+'/items',{item:i},options).map((res:Response) => res.json());
  }

  deleteItem(idx) : Observable<any> {
    let options = this.buildOptions();
    return this.http.delete(this.invUrl+'/items/'+idx,options)
    .map((res:Response) =>
       res.json());
  }
}
