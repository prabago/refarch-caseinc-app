import { Injectable }    from '@angular/core';
import { Headers, Http,Response,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class InventoryService {
  private invUrl ='/api/i';

  constructor(private http: Http) {
  };

  getItems(): Observable<any>{
    let headers = new Headers({ 'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers })
    return this.http.get(this.invUrl+'/items',options)
         .map((res:Response) => res.json())
  }
}
