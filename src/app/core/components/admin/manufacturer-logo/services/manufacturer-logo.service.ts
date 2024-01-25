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

  // createManufacturerLogo(manufacturerLogo: ManufacturerLogo): Observable<any> {
  //   const formData = new FormData();

  //   if (!manufacturerLogo.name) {
  //     console.error('Invalid manufacturerLogo: ', manufacturerLogo.name);
  //     return throwError('Invalid manufacturerLogo');
  //   }
  
  //   if (!manufacturerLogo.image) {
  //     console.error('Invalid manufacturerLogo.image: ', manufacturerLogo.image);
  //     return throwError('Invalid manufacturerLogo.image');
  //   }
  

  //   formData.append('files.image', manufacturerLogo.image, manufacturerLogo.name);

  //   const data = {
  //     data: {
  //       name: manufacturerLogo.name || ''
  //     }
  //   }
  
  //   return this.createData(`${environment.getApiUrl}/manufacturer-logos`, { data, formData });
  // }

  updateManufacturerLogo(manufacturerLogo: ManufacturerLogo): Observable<any> {
    const updateData = {
      data: {

      }
    }
    return this.updateData(`${environment.getApiUrl}/manufacturer-logos`, manufacturerLogo.id, updateData);
  }

  deleteManufacturerLogo(id: number) {
    return this.deleteData(`${environment.getApiUrl}/manufacturer-logos`, id);
  }

  uploadManufacturerLogo(file: File, name: ManufacturerLogo): Observable<number | ManufacturerLogo> {
    const formData = new FormData();

    formData.append("files.image", file, file.name);
    formData.append("data", JSON.stringify({ name }));;
    
    const headers = new HttpHeaders({
      'Authorization': "Bearer " +
      "b5edb745cb93c2bb6749af3b636f1d64d6733154cb9e25dd899bc57f93fce685d8a48e1dd0073419b083da007ecbad82b636a466fd704f56b53981fdc55b93c81fc9c88ea00cfe701ea42b591797a3c15cec3e3ee46e63af4d472a42c80630d754e1176fdfc93fac2eb42d3741d00d6457bfa2a62227038700c2cd27c3fa8b2f",
    })

    const req = new HttpRequest('POST', `${environment.getApiUrl}/manufacturer-logos`, formData, {
      headers: headers,
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          console.log('Upload complete event if:', event);
          return event.body as ManufacturerLogo;
        } else if (event.type === HttpEventType.UploadProgress) {
          console.log('Upload progress event elif:', event);
          const percentDone = Math.round(100 * event.loaded / event.total);
          console.log(`Upload progress serv: ${percentDone}%`);
          return percentDone;
        }
      }),
      catchError((error) => {
        console.error('File upload failed:', error);
        return throwError('Error uploading file');
      })
    );
  }
}
