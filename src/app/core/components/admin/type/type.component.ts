import { Component, AfterViewInit, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

import { TypeService } from "./services/type.service";
import { Type } from "./models/type";
import { AlertifyService } from "app/core/services/alertify.service";

declare var jQuery: any;

@Component({
  selector: "app-type",
  templateUrl: "./type.component.html",
  styleUrl: "./type.component.css",
})
export class TypeComponent implements AfterViewInit, OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  typeList: Type[] = [];
  type: Type = new Type();
  dataLoaded = false;

  mytypeControl = new FormControl("");

  displayedColumns: string[] = ["name", "update", "delete"];

  typeAddForm: FormGroup;

  constructor(
    private typeService: TypeService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService
  ) {}

  ngAfterViewInit(): void {
    this.getTypeList();
  }

  ngOnInit(): void {
    this.createTypeAddForm();
  }

  getTypeList() {
    this.typeService.getTypeList().subscribe((data) => {
      this.typeList = data;
      this.dataLoaded = true;
      this.dataSource = new MatTableDataSource(data);
      this.configDataTable();
    });
  }

  getTypeById(id: number) {
    this.clearFormGroup(this.typeAddForm);
    this.typeService.getTypeById(id).subscribe((data) => {
      this.type = data;
      console.log("getTypeById data: ", data);
      this.typeAddForm.patchValue({
        id: data.id,
        name: data.attributes.name
      })
    });
  }

  save() {
    if (this.typeAddForm.valid) {
      this.type = Object.assign({}, this.typeAddForm.value);

      if (!this.type.id) {
        this.addType();
      } else {
        this.updateType();
      }
    }
  }

  createTypeAddForm() {
    this.typeAddForm = this.formBuilder.group({
      id: [0],
      name: ""
    });
  }

  addType() {
    this.typeService.createType(this.type).subscribe(
      (data) => {
        console.log(data);
        this.getTypeList();
        this.type = new Type();
        jQuery('#type').modal('hide');
        this.clearFormGroup(this.typeAddForm);
      },
      (error) => {
        console.log(error);
        this.alertifyService.error(error.error);
      }
    )
  }

  updateType() {
    this.typeService.updateType(this.type).subscribe((data) => {
      var index = this.typeList.findIndex((x) => x.id == this.type.id);
      this.typeList[index] = this.type;
      this.dataSource = new MatTableDataSource(this.typeList);
      this.configDataTable();
      this.getTypeList();
      this.type = new Type();
      jQuery("#type").modal("hide");
      this.alertifyService.success(data);
      this.clearFormGroup(this.typeAddForm);

    },
    (error) => {
      console.log(error);
      this.alertifyService.error(error.error);
    })
  }

  deleteType(id: number){
    this.typeService.deleteType(id).subscribe((data) => {
      this.alertifyService.success(data.toString());
      this.typeList = this.typeList.filter((x) => x.id != id);
      this.dataSource = new MatTableDataSource(this.typeList);
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
    this.mytypeControl.setValue("");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log('Filter Value: ', filterValue);

    this.dataSource.filter = filterValue;

    console.log('Filtered Datas: ', filterValue);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  configDataTable(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
