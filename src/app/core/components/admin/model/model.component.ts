import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { Observable } from 'rxjs';
import { ManufacturerService } from '../manufacturer/services/manufacturer.service';
import { TypeService } from '../type/services/type.service';
import { HullMaterialService } from '../hull-material/services/hull-material.service';
import { map, startWith } from "rxjs/operators";

declare var jQuery: any;

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})
export class ModelComponent implements AfterViewInit, OnInit {
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
  myManufacturerControl = new FormControl("");
  myTypeControl = new FormControl("");
  myHullMaterialControll = new FormControl("");

  filteredManufacturer: Observable<Manufacturer[]>;
  filteredType: Observable<Type[]>;
  filteredMaterial: Observable<HullMaterial[]>;


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
    private alertifyService: AlertifyService,
    private manufacturerService: ManufacturerService,
    private typeService: TypeService,
    private materialService: HullMaterialService
  ){}
  
  ngAfterViewInit(): void {
    this.getModelList();
    this.getManufacturerList();
    this.getTypeList();
    this.getHullMetarialList();
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

  getManufacturerList() {
    this.manufacturerService.getManufacturerList().subscribe((data) => {
      this.manufacturerList = data;
      console.log("data : ", data);

      this.filteredManufacturer = this.myManufacturerControl.valueChanges.pipe(
        startWith(""),
        map((value: string | any) => (typeof value === "string" ? value : value.name)),
        map((name) => name ? this._manufacturerFilter(name) : this.manufacturerList.slice())
      )
    })
  }
  
  private _manufacturerFilter(value: string): Manufacturer[] {
    const filterValue = value.toLowerCase();

    return this.manufacturerList.filter((option) => 
    option.attributes.name.toLowerCase().includes(filterValue)  
    );
  }

  displayFnManufacturer(manufacturer: Manufacturer): string {
    return manufacturer && manufacturer.name;
  }

  getTypeList() {
    this.typeService.getTypeList().subscribe((data) => {
      this.typeList = data;

      this.filteredType = this.myTypeControl.valueChanges.pipe(
        startWith(""),
        map((value: string | any) => (typeof value === "string" ? value : value.name)),
        map((name) => name ? this._typeFilter(name) : this.typeList.slice())
      )
    })
  }

  private _typeFilter(value: string): Type[] {
    const filterValue = value.toLowerCase();

    return this.typeList.filter((option) => 
    option.attributes.name.toLowerCase().includes(filterValue)
    );
  }

  displayFnType(type: Type) {
    return type && type.name;
  }

  getHullMetarialList() {
    this.materialService.getHullMaterialList().subscribe((data) => {
      this.materialList = data;

      this.filteredMaterial = this.myMaterialControl.valueChanges.pipe(
        startWith(""),
        map((value: string | any) => (typeof value === "string" ? value : value)),
        map((name) => name ? this._hullMaterialFilter(name) : this.materialList.slice())
      )
    })
  }

  private _hullMaterialFilter(value: string): HullMaterial[] {
    const filterValue = value.toLowerCase();

    return this.materialList.filter((option) => 
    option.attributes.name.toLowerCase().includes(filterValue)    
    );
  }

  displayFnMetarial(metarial: HullMaterial) {
    return metarial && metarial.name;
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
