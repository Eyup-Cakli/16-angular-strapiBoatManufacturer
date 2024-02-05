import { Component, AfterViewInit, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

import { ManufacturerLogoService } from './services/manufacturer-logo.service';
import { ManufacturerLogo } from './models/manufacturerLogo';
import { AlertifyService } from 'app/core/services/alertify.service';

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
  fileControl = new FormControl(null);

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
    private alertifyService: AlertifyService
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
      this.configDataTable();
    })
  }

  getImageUrl(element: ManufacturerLogo) {
    const imageUrl = "http://localhost:1337" + element;
    return imageUrl;

  }

  getManufacturerLogoById(id: number) {
    this.clearFormGroup(this.manufacturerLogoAddForm);
    this.manufacturerLogoService.getManufacturerLogoById(id).subscribe((data) => {
      this.manufacturerLogo = data;
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
        this.createManufacturerLogo();
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

  onFileChanged(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
      this.manufacturerLogoAddForm.patchValue({ image: file.name });
    }
  }

  createManufacturerLogo() {
    if (this.file) {
      if (this.uploadSubscription) {
        this.uploadSubscription.unsubscribe();
      }
      this.uploadSubscription = this.manufacturerLogoService.createManufacturerLogo(this.file, this.manufacturerLogoAddForm.get('name').value)
        .subscribe(
          (result) => {
            if (typeof result === 'object' ) {
              this.getManufacturerLogoList();
              this.manufacturerLogo = new ManufacturerLogo();
              jQuery('#manufacturerLogo').modal('hide');
              this.alertifyService.success("Manufacturer logo added successfully.");
              this.clearFormGroup(this.manufacturerLogoAddForm);
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
  
  updateManufacturerLogo() {
    if (this.manufacturerLogo) {
      if (this.file) {
        if (this.uploadSubscription) {
          this.uploadSubscription.unsubscribe();
        }
        this.uploadSubscription = this.manufacturerLogoService.updateManufacturerLogo(this.file, this.manufacturerLogoAddForm.get('name').value, this.manufacturerLogo)
          .subscribe(
            (result) => {
              if (typeof result === 'object' ) {
                this.handleUpdateSuccess();
              }
            },
            (error) => {
              console.error('Update failed. Error:', error);
            }
          );
      } else {
        this.manufacturerLogoService.updateManufacturerLogoName(this.manufacturerLogo)
          .subscribe(
            () => {
              this.handleUpdateSuccess();
            },
            (error) => {
              console.error('Update failed. Error:', error);
            }
          );
      }
    } else {
      console.error('Manufacturer logo is undefined!');
    }
  }
  
  private handleUpdateSuccess() {
    var index = this.manufacturerLogoList.findIndex((x) => x.id == this.manufacturerLogo.id);
    this.manufacturerLogo[index] = this.manufacturerLogo;
    this.dataSource = new MatTableDataSource(this.manufacturerLogoList);
    this.configDataTable();
    this.getManufacturerLogoList();
    this.manufacturerLogo = new ManufacturerLogo();
    jQuery('#manufacturerLogo').modal('hide');
    this.alertifyService.success("Manufacturer logo updated successfully.");
    this.clearFormGroup(this.manufacturerLogoAddForm);
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
    this.fileControl.setValue(null);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.attributes.name.trim().toLowerCase().includes(filter);
    };

    this.dataSource.filter = filterValue;
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  configDataTable(): void{
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
