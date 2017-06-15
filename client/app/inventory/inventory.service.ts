import { Injectable }    from '@angular/core';
import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Item } from "./Item";

@Injectable()
export class InventoryService {
  private invUrl ='/api/i';

  constructor(private http: Http) {
  };

  getItems(): Observable<any>{
    return this.http.get(this.invUrl+'/items')
         .map((res:Response) => res.json())
  }

  saveItem(i) : Observable<any> {
    return this.http.post(this.invUrl+'/items',{item:i}).map((res:Response) => res.json());
  }
}
