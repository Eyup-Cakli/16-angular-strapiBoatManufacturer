import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HullMaterial } from '../models/hull-metarial';

@Injectable({
  providedIn: 'root'
})
export class HullMaterialService {

  constructor(private readonly httpClient: HttpClient) { }

  getHullMaterialList(): Observable<HullMaterial[]>{
    return this.httpClient.get<HullMaterial[]>(environment.getApiUrl + "/hull-materials")
  }

  getHullMaterialById(id: number) {
    return this.httpClient.get<HullMaterial>(environment.getApiUrl + "/hull-material/" + id);
  }

  addHullMaterial(hullMaterail: HullMaterial): Observable<any> {
    return this.httpClient.post(environment.getApiUrl + "/hull-material", hullMaterail, {responseType: 'text'});
  }

  updateHullMaterial(hullMaterail: HullMaterial): Observable<any> {
    return this.httpClient.put(environment + "/hull-material/", hullMaterail.id, { responseType: 'text' });
  }

  deleteHullMaterial(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + "/hull-material/", {body: { id: id } });
  }
}
