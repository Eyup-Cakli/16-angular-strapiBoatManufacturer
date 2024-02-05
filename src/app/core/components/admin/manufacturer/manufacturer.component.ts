import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Manufacturer } from './models/manufacturer';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ManufacturerService } from './services/manufacturer.service';
import { AlertifyService } from 'app/core/services/alertify.service';
import { Subscription } from 'rxjs';
import { ManufacturerLogoService } from '../manufacturer-logo/services/manufacturer-logo.service';
import { ManufacturerLogo } from '../manufacturer-logo/models/manufacturerLogo';

declare var jQuery: any;

@Component({
  selector: 'app-manufacturer',
  templateUrl: './manufacturer.component.html',
  styleUrl: './manufacturer.component.css'
})
export class ManufacturerComponent implements AfterViewInit, OnInit, OnDestroy{
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('fileInput') fileInputRef: ElementRef;

  manufacturerList: Manufacturer[] = [];
  manufacturerLogoList: ManufacturerLogo [] = [];
  manufacturer: Manufacturer = new Manufacturer();
  manufacturerLogo: ManufacturerLogo = new ManufacturerLogo();
  dataLoaded = false;

  file: File | null = null;
  fileControl = new FormControl(null);

  myManufacturerControl = new FormControl("");

  displayedColumns: string[] = [
    "image",
    "name",
    "webSite",
    "update",
    "delete"
  ];

  manufacturerAddForm: FormGroup;

  constructor(
    private manufacturerService: ManufacturerService,
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
    this.getManufacturerList();
  }

  ngOnInit(): void {
      this.createManufacturerAddForm();
  }

  getManufacturerList() {
    this.manufacturerService.getManufacturerList().subscribe((data) => {
      this.manufacturerList = data;
      this.dataLoaded = true;
      this.dataSource = new MatTableDataSource(data);
      this.configDataTable();
    })
  }

  getImageUrl(element: Manufacturer) {
    const imageUrl = "http://localhost:1337" + element;
    return imageUrl;
  }

  getManufacturerById(id: number) {
    this.clearFormGroup(this.manufacturerAddForm);
    this.manufacturerService.getManufacturerById(id).subscribe((data) => {
      console.log("getManufacturerById data : ", data);
      this.manufacturer = data;
      this.manufacturerAddForm.patchValue({
        id: data.id,
        name: data.attributes.name,
        webSite: data.attributes.webSite,
        manufacturer_logo: data.attributes.manufacturer_logo
      })
    })
  }

  save() {
    if (this.manufacturerAddForm.valid) {
      this.manufacturer = Object.assign({}, this.manufacturerAddForm.value);

      if (!this.manufacturer.id) {
        this.createManufacturer();
      } else {
        this.updateManufacturer();
      }
    }
  }

  createManufacturerAddForm() {
    this.manufacturerAddForm = this.formBuilder.group({
      id: [0],
      name: "",
      webSite: "",
      manufacturer_logo: ""
    })
  }

  onFileChanged(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
      this.manufacturerAddForm.patchValue({ image: file.name });
    }
  }

  createManufacturer() {
    if (this.file) {
      if (this.uploadSubscription) {
        this.uploadSubscription.unsubscribe();
      }
      this.uploadSubscription = this.manufacturerLogoService.createManufacturerLogo(this.file, this.manufacturerAddForm.get('name').value)
        .subscribe(
          (result) => {
            if (typeof result === 'object') {
              this.handleCreateManufacturerLogoSuccess();
              
              this.manufacturerService.createManufacturerWithLogo(this.manufacturer, result).subscribe(
                (data) => {
                  this.handleCreateManufacturerSuccess();
                }
              )
            }
          }
        )
    } else {
      this.manufacturerService.createManufacturer(this.manufacturer).subscribe(
        (data) => {
          this.handleCreateManufacturerSuccess();
        }
      )
    }
  } 

  private handleCreateManufacturerSuccess() {
    this.getManufacturerList();
    this.manufacturer = new Manufacturer();
    jQuery('#manufacturer').modal('hide');
    this.alertifyService.success("Manufacturer created successfully");
    this.clearFormGroup(this.manufacturerAddForm);
  }

  private handleCreateManufacturerLogoSuccess() {
    this.manufacturerLogo = new ManufacturerLogo();
    jQuery('#manufacturerLogo').modal('hide');
    this.alertifyService.success("Manufacturer logo added successfully.");
  }

  updateManufacturer() {
    var index = this.manufacturerList.findIndex((x) => x.id == this.manufacturer.id)
    this.manufacturerList[index] = this.manufacturer;

    if (this.manufacturer.manufacturer_logo.data === null) {
      if (this.file) {
        if (this.uploadSubscription) {
          this.uploadSubscription.unsubscribe();
        }
        this.uploadSubscription = this.manufacturerLogoService.createManufacturerLogo(this.file, this.manufacturerAddForm.get('name').value)
          .subscribe(
            (result) => {
              if (typeof result === 'object') {
                this.handleCreateManufacturerLogoSuccess();
                
                this.manufacturerService.updateManufacturerWithLogo(this.manufacturer, result).subscribe(
                  (data) => {
                    this.handleUpdateManufacturerSuccess();
                  }
                )
              }
            }
          )
      } else {
        this.manufacturerService.updateManufacturer(this.manufacturer).subscribe(
          (data) => {
            this.handleUpdateManufacturerSuccess();
            return;
          }
        )
      }
    } else {
      if (this.file) {
        console.log("this.file")
        if (this.uploadSubscription) {
          this.uploadSubscription.unsubscribe();
        }
        this.uploadSubscription = this.manufacturerLogoService.updateManufacturerLogo(this.file, this.manufacturerAddForm.get('name').value, this.manufacturerLogo)
          .subscribe(
            (result) => {
              if (typeof result === 'object') {
                this.handleUpdateManufacturerLogoSuccess();
  
                this.manufacturerService.updateManufacturerWithLogo(this.manufacturer, result).subscribe(
                  (data) => {
                    this.handleUpdateManufacturerSuccess();
                  }
                )
              }
            }
          )
      } else {
        console.log("else");
        this.manufacturerLogoService.updateManufacturerLogoName(this.manufacturerLogo).subscribe(
          () => {
            this.handleUpdateManufacturerLogoSuccess();
  
            this.manufacturerService.updateManufacturer(this.manufacturer).subscribe(
              (data) => {
                console.log("data : ", data)
                this.handleUpdateManufacturerSuccess();
              }
            )
          }
        )
      }
    } 
  }

  private handleUpdateManufacturerLogoSuccess() {
    var index = this.manufacturerList.findIndex((x) => x.manufacturer_logo.id == this.manufacturerLogo.id);
    this.manufacturerLogo[index] = this.manufacturerLogo;
    this.dataSource = new MatTableDataSource(this.manufacturerLogoList);
    this.configDataTable();
    this.manufacturerLogo = new ManufacturerLogo();
    jQuery('#manufacturerLogo').modal('hide');
    this.alertifyService.success("Manufacturer logo name updated successfully.")
  }

  private handleUpdateManufacturerSuccess() {
    var index = this.manufacturerList.findIndex((x) => x.id == this.manufacturer.id);
    this.manufacturerList[index] = this.manufacturer;
    this.dataSource = new MatTableDataSource(this.manufacturerList);
    this.configDataTable();
    this.getManufacturerList();
    this.manufacturer = new Manufacturer();
    jQuery('#manufacturer').modal('hide');
    this.alertifyService.success("Manufacturer updated successfully.");
    this.clearFormGroup(this.manufacturerAddForm);
  }

  deleteManufacturer(id: number) {
    this.manufacturerService
  }

  clearFormGroup(group: FormGroup) {
    group.markAllAsTouched();
    group.reset();

    Object.keys(group.controls).forEach((key) => {
      group.get(key)?.setErrors(null);
      group.reset();

      if (key == "id") {
        group.get(key)?.setValue(0);
      }
    });
    this.myManufacturerControl.setValue("");
    this.fileControl.setValue(null);
    this.file = null;
    this.fileControl.reset();
    this.fileInputRef.nativeElement.value = '';
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
