import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Manufacturer } from './models/manufacturer';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ManufacturerService } from './services/manufacturer.service';
import { AlertifyService } from 'app/core/services/alertify.service';

@Component({
  selector: 'app-manufacturer',
  templateUrl: './manufacturer.component.html',
  styleUrl: './manufacturer.component.css'
})
export class ManufacturerComponent implements AfterViewInit, OnInit, OnDestroy{
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  manufacturerList: Manufacturer[] = [];
  manufacturer: Manufacturer = new Manufacturer();
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
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService
  ) {}

  ngOnDestroy(): void {
      
  }

  ngAfterViewInit(): void {
    this.getManufacturerList();
  }

  ngOnInit(): void {
      this.createManufacturerAddForm();
  }

  getManufacturerList() {
    this.manufacturerService.getManufacturerList().subscribe((data) => {
      console.log("data: ", data)
      this.manufacturerList = data;
      this.dataLoaded = true;
      this.dataSource = new MatTableDataSource(data);
    })
  }

  getImageUrl(element: Manufacturer) {
    const imageUrl = "http://localhost:1337" + element;
    return imageUrl;
  }

  save() {

  }

  createManufacturerAddForm() {
    this.manufacturerAddForm = this.formBuilder.group({
      id: [0],
      name: "",
      webSite: ""
    })
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
