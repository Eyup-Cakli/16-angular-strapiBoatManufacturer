import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHandler, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { ManufacturerLogo } from '../models/manufacturerLogo';
import { AbstractResponseService } from '../../abstract/abstractResponseService';
import { catchError, map } from 'rxjs/operators';
import { apiToken } from 'environments/apiToken';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerLogoService extends AbstractResponseService<ManufacturerLogo>{

  constructor(httpClient: HttpClient, private http: HttpClient) { 
    super(httpClient);
  }

  getManufacturerLogoList(): Observable<ManufacturerLogo[]>{
    return this.getDataList(`${environment.getApiUrl}/manufacturer-logos`);
  }

  getManufacturerLogoById(id: number) {
    return this.getDataById(`${environment.getApiUrl}/manufacturer-logos`, id);
  }

  createManufacturerLogo(file: File, name: ManufacturerLogo): Observable<number | ManufacturerLogo> {
    const formData = new FormData();

    formData.append("files.image", file, file.name);
    formData.append("data", JSON.stringify({ name }));

    const req = new HttpRequest('POST', `${environment.getApiUrl}/manufacturer-logos`, formData, {
      headers: apiToken,
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          return event.body as ManufacturerLogo;
        } else if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          return percentDone;
        }
      }),
      catchError((error) => {
        console.error('File upload failed:', error);
        return throwError('Error uploading file');
      })
    );
  }

  updateManufacturerLogo(file: File, name: ManufacturerLogo, manufacturerLogo: ManufacturerLogo): Observable<number | ManufacturerLogo> {
    const formData = new FormData();
  
    formData.append("files.image", file, file.name);
    formData.append("data", JSON.stringify({ name }));
  
    const req = new HttpRequest('PUT', `${environment.getApiUrl}/manufacturer-logos/` + manufacturerLogo.id , formData, {
      headers: apiToken,
      reportProgress: true,
      responseType: 'json'
    });
  
    return this.http.request(req).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          return event.body as ManufacturerLogo;
        } else if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          return percentDone;
        }
      }),
      catchError((error) => {
        console.error('File upload failed:', error);
        return throwError('Error uploading file');
      })
    );
  }

  updateManufacturerName(manufacturerLogo: ManufacturerLogo): Observable<any> {
    const updateData = {
      data: {
        name: manufacturerLogo.name
      }
    }
    return this.updateData(`${environment.getApiUrl}/manufacturer-logos`, manufacturerLogo.id, updateData);
  }

  deleteManufacturerLogo(id: number) {
    return this.deleteData(`${environment.getApiUrl}/manufacturer-logos`, id);
  }

  
}
