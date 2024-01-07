import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HullMaterial } from '../models/hull-material';

@Injectable({
  providedIn: 'root'
})
export class HullMaterialService {

  constructor(private readonly httpClient: HttpClient) { }

  getHullMaterialList(): Observable<HullMaterial>{
    const token = 'Bearer ' + '58b0d1e5aca4ae8ab7bd4a19f1f6c16436944453196f6f31b73256c2d1cd42418376faf1e1babfd07265e34a4916583bf562d5cd76acd426da68781c910ea544008592666377772d026aae7b4bd0a42d5931c3c6564f82055022875fdbcb69d2035e38831961d635ab489013578f96943cf234901acdc64deba31290e0575911';
    
    const headers = new HttpHeaders({
      'Authorization': token
    });
    return this.httpClient.get<HullMaterial>(environment.getApiUrl + "/hull-materials", { headers })
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
