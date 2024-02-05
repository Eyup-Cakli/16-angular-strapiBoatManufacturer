import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { Manufacturer } from "../models/manufacturer";
import { AbstractResponseService } from "../../abstract/abstractResponseService";
import { ManufacturerLogoService } from "../../manufacturer-logo/services/manufacturer-logo.service";
import { ManufacturerLogo } from "../../manufacturer-logo/models/manufacturerLogo";

@Injectable({
  providedIn: "root",
})
export class ManufacturerService extends AbstractResponseService<Manufacturer> {
  constructor(httpClient: HttpClient, private manufacturerLogoService: ManufacturerLogoService) {
    super(httpClient);
  }

  getManufacturerList(): Observable<Manufacturer[]> {
    return this.getDataList(`${environment.getApiUrl}/manufacturers?populate=manufacturer_logo.image`);
  }

  getManufacturerById(id: number) {
    return this.getDataById(`${environment.getApiUrl}/manufacturers`, id, "?populate=manufacturer_logo.image");
  }

  createManufacturer(manufacturer: Manufacturer): Observable<any> {
    const data = {
      data: {
        name: manufacturer.name,
        webSite: manufacturer.webSite
      }
    }
    return this.createData(`${environment.getApiUrl}/manufacturers`, data);
  }

  createManufacturerWithLogo(manufacturer: Manufacturer, result: ManufacturerLogo): Observable<any> {
    const data = {
      data: {
        name: manufacturer.name,
        webSite: manufacturer.webSite,
        manufacturer_logo: result.data.id
      }
    }
    return this.createData(`${environment.getApiUrl}/manufacturers`, data);
  }

  updateManufacturer(manufacturer: Manufacturer): Observable<any>{
    const updateData = {
      data: {
        name: manufacturer.name,
        webSite: manufacturer.webSite
      }
    }
    return this.updateData(`${environment.getApiUrl}/manufacturers`, manufacturer.id, updateData);
  }

  updateManufacturerWithLogo(manufacturer: Manufacturer, result: ManufacturerLogo): Observable<any> {
    const updateData = {
      data: {
        name: manufacturer.name,
        webSite: manufacturer.webSite,
        manufacturer_logo: result.data.id
      }
    }
    return this.updateData(`${environment.getApiUrl}/manufacturers`, manufacturer.id, updateData);
  }

  deleteManufacturer(id: number) {
    return this.deleteData(`${environment.getApiUrl}/manufacturers`, id)
  }
}
