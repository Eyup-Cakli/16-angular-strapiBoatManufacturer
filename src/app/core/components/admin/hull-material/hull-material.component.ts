import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { HullMaterialService } from './services/hull-material.service';
import { HullMaterial } from './models/hull-material';
import { AlertifyService } from 'app/core/services/alertify.service';

declare var jQuery: any;

@Component({
  selector: 'app-hull-material',
  templateUrl: './hull-material.component.html',
  styleUrl: './hull-material.component.css'
})
export class HullMaterialComponent implements AfterViewInit, OnInit{
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  materialList: HullMaterial[] = [];
  hullMaterial: HullMaterial = new HullMaterial();
  dataLoaded = false;

  myHullMaterialControl = new FormControl("");

  displayedColumns: string[] = [
    "name",
    "update",
    "delete"
  ];

  hullMaterialAddForm: FormGroup;

  constructor(
    private hullMaterialService: HullMaterialService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService
  ){}

  ngAfterViewInit(): void {
    this.getHullMaterialList();
  }

  ngOnInit(): void {
    this.createHullMaterialAddForm();
  }

  getHullMaterialList() {
    this.hullMaterialService.getHullMaterialList().subscribe((data) => {
      this.materialList = data;
      this.dataLoaded = true;
      this.dataSource = new MatTableDataSource(data);
      this.configDataTable();
    })
  }

  getHullMaterialById(id: number) {
    this.clearFormGroup(this.hullMaterialAddForm);
    this.hullMaterialService.getHullMaterialById(id).subscribe((data) => {
      this.hullMaterial = data;
      this.hullMaterialAddForm.patchValue({
        id: data.id,
        name: data.attributes.name
      });
    });
  }

  save() {
    if (this.hullMaterialAddForm.valid) {
      this.hullMaterial = Object.assign({}, this.hullMaterialAddForm.value);

      if (!this.hullMaterial.id) {
        this.addHullMaterial();
      } else {
        this.updateHullMaterial();
      }
    }
  }

  createHullMaterialAddForm() {
    this.hullMaterialAddForm = this.formBuilder.group({
      id: [0],
      name: ""
    });
  }

  addHullMaterial() {
    this.hullMaterialService.createHullMaterial(this.hullMaterial).subscribe(
      (data) => {
        this.getHullMaterialList();
        this.hullMaterial = new HullMaterial();
        jQuery('#hullMaterial').modal('hide');
        this.alertifyService.success(data);
        this.clearFormGroup(this.hullMaterialAddForm);
      },
      (error) => {
        console.log(error);
        this.alertifyService.error(error.error);
      }
    );
  }

  updateHullMaterial() {
    this.hullMaterialService.updateHullMaterial(this.hullMaterial).subscribe((data) => {
      var index = this.materialList.findIndex((x) => x.id == this.hullMaterial.id);
      this.materialList[index] = this.hullMaterial;
      this.dataSource = new MatTableDataSource(this.materialList);
      this.configDataTable();
      this.getHullMaterialList();
      this.hullMaterial = new HullMaterial();
      jQuery("#hullMaterial").modal("hide");
      this.alertifyService.success(data);
      this.clearFormGroup(this.hullMaterialAddForm);
    },
    (error) => {
      console.log(error);
      this.alertifyService.error(error.error);
    });
  }

  deleteHullMaterial(id: number) {
    this.hullMaterialService.deleteHullMaterial(id).subscribe((data) => {
      this.alertifyService.success(data.toString());
      this.materialList = this.materialList.filter((x) => x.id != id);
      this.dataSource = new MatTableDataSource(this.materialList);
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
    this.myHullMaterialControl.setValue("");
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
