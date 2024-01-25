import { Component, AfterViewInit, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ManufacturerLogoService } from './services/manufacturer-logo.service';
import { ManufacturerLogo } from './models/manufacturerLogo';
import { AlertifyService } from 'app/core/services/alertify.service';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { apiToken } from 'environments/apiToken';
import { Subscription } from 'rxjs';

declare var jQuery: any;

@Component({
  selector: 'app-manufacturer-logo',
  templateUrl: './manufacturer-logo.component.html',
  styleUrl: './manufacturer-logo.component.css'
})
export class ManufacturerLogoComponent implements AfterViewInit, OnInit, OnDestroy {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  manufacturerLogoList: ManufacturerLogo[] = [];
  manufacturerLogo: ManufacturerLogo = new ManufacturerLogo();
  dataLoaded = false;

  file: File | null = null;

  myManufacturerLogoControl = new FormControl("");

  displayedColumns: string[] = [
    "image",
    "name",
    "update",
    "delete"
  ];

  manufacturerLogoAddForm: FormGroup;

  constructor(
    private manufacturerLogoService: ManufacturerLogoService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private httpClient: HttpClient
  ) {}

  private uploadSubscription: Subscription;

  ngOnDestroy(): void {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.getManufacturerLogoList();
  }

  ngOnInit(): void {
    this.createManufacturerLogoAddForm();
  }

  getManufacturerLogoList() {
    this.manufacturerLogoService.getManufacturerLogoList().subscribe((data) => {
      this.manufacturerLogoList = data;
      this.dataLoaded = true;
      this.dataSource = new MatTableDataSource(data);
      console.log("manufacturerLogoList :", data);
      this.configDataTable();
    })
  }

  getImageUrl(element: ManufacturerLogo) {
    return "http://localhost:1337" + element
  }

  getManufacturerLogoById(id: number) {
    this.clearFormGroup(this.manufacturerLogoAddForm);
    this.manufacturerLogoService.getManufacturerLogoById(id).subscribe((data) => {
      this.manufacturerLogo = data;
      console.log("logo: ", data);
      this.manufacturerLogoAddForm.patchValue({
        id: data.id,
        name: data.attributes.name
      });
    });
  }

  save() {
    if (this.manufacturerLogoAddForm.valid) {
      this.manufacturerLogo = Object.assign({}, this.manufacturerLogoAddForm.value);

      if (!this.manufacturerLogo.id) {
        //this.addManufacturerLogo();
        this.onUpload();
      } else {
        this.updateManufacturerLogo();
      }
    }
  }

  createManufacturerLogoAddForm() {
    this.manufacturerLogoAddForm = this.formBuilder.group({
      id: [0],
      name: "",
      image: ""
    })
  }

  fileUploadProgress: number;

  onFileChanged(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
      this.manufacturerLogoAddForm.patchValue({ image: file.name });
    }
  }

  onUpload() {
    if (this.file) {
      if (this.uploadSubscription) {
        this.uploadSubscription.unsubscribe();
      }
      this.uploadSubscription = this.manufacturerLogoService.uploadManufacturerLogo(this.file, this.manufacturerLogoAddForm.get('name').value)
        .subscribe(
          (result) => {
            console.log("result : " , result)
            if (typeof result === 'number') {
             // console.log(`Upload progress: ${result}%`);
            } else {
              //console.log('Upload successful. Result:', result);
              this.getManufacturerLogoList();
            }
          },
          (error) => {
            console.error('Upload failed. Error:', error);
          }
        );
    } else {
      console.error('File is undefined!');
    }
  }

  // addManufacturerLogo() {
  //   this.manufacturerLogoService.createManufacturerLogo(this.manufacturerLogo).subscribe(
  //     (data) => {
  //       console.log("data: ", data)
  //       this.getManufacturerLogoList();
  //       this.manufacturerLogo = new ManufacturerLogo();
  //       jQuery('#manufacturerLogo').modal('hide');
  //       this.alertifyService.success(data);
  //       this.clearFormGroup(this.manufacturerLogoAddForm);
  //     },
  //     (error) => {
  //       console.log(error);
  //       this.alertifyService.error(error.error);
  //     }
  //   );
  // }
  

  updateManufacturerLogo() {
    this.manufacturerLogoService.updateManufacturerLogo(this.manufacturerLogo).subscribe((data) => {
      var index = this.manufacturerLogoList.findIndex((x) => x.id == this.manufacturerLogo.id);
      this.manufacturerLogoList[index] = this.manufacturerLogo;
      this.dataSource = new MatTableDataSource(this.manufacturerLogoList);
      this.configDataTable();
      this.getManufacturerLogoList();
      this.manufacturerLogo = new ManufacturerLogo();
      jQuery('#manufacturerLogo').modal('hide');
      this.alertifyService.success(data);
      this.clearFormGroup(this.manufacturerLogoAddForm);
    },
    (error) => {
      console.log(error);
      this.alertifyService.error(error.error);
    })
  }

  deleteManufacturerLogo(id: number) {
    this.manufacturerLogoService.deleteManufacturerLogo(id).subscribe((data) => {
      this.alertifyService.success(data.toString());
      this.manufacturerLogoList = this.manufacturerLogoList.filter((x) => x.id != id);
      this.dataSource = new MatTableDataSource(this.manufacturerLogoList);
      this.configDataTable();
    });
  }

  clearFormGroup(group: FormGroup) {
    group.markAllAsTouched();
    group.reset();

    Object.keys(group.controls).forEach((key) => {
      group.get(key)?.setErrors(null);
      if (key == "id") {
        group.get(key)?.setValue(0);
      }
    });
    this.myManufacturerLogoControl.setValue("");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log('Filtre Değeri:', filterValue);
  
    this.dataSource.filter = filterValue;
  
    console.log('Filtrelenmiş Veriler:', filterValue);
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  configDataTable(): void{
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
