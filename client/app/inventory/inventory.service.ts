import { Injectable }    from '@angular/core';
import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Item } from "./Item";
import { User } from "../login/User";

@Injectable()
export class InventoryService {
  private invUrl ='/api/i';
  private token : string;

  constructor(private http: Http) {
    var u: User =JSON.parse(localStorage.getItem('currentUser'));
    this.token=u.token;
  };

  getItems(): Observable<any>{
    var req : any = {
      method: 'GET',
      url: this.invUrl+'/items',
      headers: {
        'Authorization': 'Bearer ' +  this.token
      }
    }

    return this.http.get(req)
         .map((res:Response) => res.json())
  }

  saveItem(i) : Observable<any> {
    return this.http.post(this.invUrl+'/items',{item:i}).map((res:Response) => res.json());
  }

  deleteItem(idx) : Observable<any> {
    return this.http.delete(this.invUrl+'/items/'+idx).map((res:Response) => res.json());
  }
}
