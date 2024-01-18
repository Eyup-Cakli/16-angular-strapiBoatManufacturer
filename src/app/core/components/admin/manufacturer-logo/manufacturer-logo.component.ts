import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ManufacturerLogoService } from './services/manufacturer-logo.service';
import { ManufacturerLogo } from './models/manufacturerLogo';
import { AlertifyService } from 'app/core/services/alertify.service';

declare var jQuery: any;

@Component({
  selector: 'app-manufacturer-logo',
  templateUrl: './manufacturer-logo.component.html',
  styleUrl: './manufacturer-logo.component.css'
})
export class ManufacturerLogoComponent implements AfterViewInit, OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  manufacturerLogoList: ManufacturerLogo[] = [];
  manufacturerLogo: ManufacturerLogo = new ManufacturerLogo();
  dataLoaded = false;

  file: File = null;
  shortLink: string = ""; 

  myManufacturerLogoControl = new FormControl("");

  displayedColumns: string[] = [
    "image",
    "name",
    "update",
    "delete"
  ];

  manufacturerLogoAddForm: FormGroup;
  image: any;

  constructor(
    private manufacturerLogoService: ManufacturerLogoService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService
  ) {}

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
        this.addManufacturerLogo();
      } else {
        this.updateManufacturerLogo();
      }
    }
  }

  createManufacturerLogoAddForm() {
    this.manufacturerLogoAddForm = this.formBuilder.group({
      id: [0],
      name: "",
      image:""
    })
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.setImagePreview();
  }
  
  setImagePreview() {
    const reader = new FileReader();
    reader.onload = () => {
      this.image = reader.result as string;
    };
    reader.readAsDataURL(this.file);
  }

  addManufacturerLogo() {
    if (this.manufacturerLogoAddForm.valid) {
      this.manufacturerLogo = Object.assign({}, this.manufacturerLogoAddForm.value);
  
      if (!this.manufacturerLogo.id && this.file) {
        this.manufacturerLogoService.addManufacturerLogo(this.manufacturerLogo, this.file).subscribe(
          (data) => {
            this.getManufacturerLogoList();
            this.manufacturerLogo = new ManufacturerLogo();
            jQuery('#manufacturerLogo').modal('hide');
            this.alertifyService.success(data);
            this.clearFormGroup(this.manufacturerLogoAddForm);
          },
          (error) => {
            console.log(error);
            this.alertifyService.error(error.error);
          }
        );
      } else {
        this.updateManufacturerLogo();
      }
    }
  }
  

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
  
    // Filtrelenmiş verileri konsolda görüntüle
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
