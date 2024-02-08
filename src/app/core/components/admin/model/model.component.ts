import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Model } from './models/model';
import { Manufacturer } from '../manufacturer/models/manufacturer';
import { Type } from '../type/models/type';
import { HullMaterial } from '../hull-material/models/hull-material';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModelService } from './services/model.service';
import { AlertifyService } from 'app/core/services/alertify.service';

declare var jQuery: any;

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})
export class ModelComponent implements AfterViewInit, OnInit, OnDestroy{
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('fileInput') fileInputRef: ElementRef;

  modelList: Model[] = [];
  manufacturerList: Manufacturer[] = [];
  typeList: Type[] = [];
  materialList: HullMaterial[] = [];

  model: Model = new Model; 

  dataLoaded = false; 

  myMaterialControl = new FormControl("");

  displayedColumns: string[] = [
    "name",
    "lengthMeter",
    "beamMeter",
    "draftMeter",
    "manufacturer",
    "type",
    "hull_material",
    "update",
    "delete"
  ];

  modelAddForm: FormGroup;

  constructor(
    private modelService: ModelService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService
  ){}

  ngOnDestroy(): void {}
  
  ngAfterViewInit(): void {
    this.getModelList();
  }

  ngOnInit(): void {
    this.createModelAddForm();
  }

  getModelList() {
    this.modelService.getModelList().subscribe((data) => {
      this.modelList = data;
      this.dataLoaded = true;
      this.dataSource = new MatTableDataSource(data);
      this.configDataTable();
    })
  }

  getModelById(id: number) {
    this.clearFormGroup(this.modelAddForm);
    this.modelService.getModelById(id).subscribe((data) => {
      this.model =data;
      this.modelAddForm.patchValue({
        id: data.id,
        name: data.attributes.name,
        lengthMeter: data.attributes.lengthMeter,
        beamMeter: data.attributes.beamMeter,
        draftMeter: data.attributes.draftMeter,
        manufacturer: data.attributes.manufacturer,
        type: data.attributes.type,
        hull_material: data.attributes.hull_material
      })
    })
  }

  save() {}

  createModelAddForm() {
    this.modelAddForm = this.formBuilder.group({
      id: [0],
      name: "",
      lengthMeter: [0],
      beamMeter: [0],
      draftMeter: [0],
      manufacturer: [0],
      type: [0],
      hull_Material: [0]
    });
  }

  createModel() {}

  updateModel() {}

  deleteModel(id: number) {}

  clearFormGroup(group: FormGroup) {
    group.markAllAsTouched();
    group.reset();

    Object.keys(group.controls).forEach((key) => {
      group.get(key)?.setErrors(null);
      if (key == "id") {
        group.get(key)?.setValue(0);
      }
    });
    this.myMaterialControl.setValue("");
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
