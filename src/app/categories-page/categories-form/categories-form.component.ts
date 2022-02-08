import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {MaterialService} from "../../shared/classes/material.service";
import {Category} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef

  form: FormGroup

  image: File

  isNew = true

  imagePreview: string | ArrayBuffer = ''

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    // this.route.params.subscribe( (params: Params) => {
    //   if (params['id']) {
    //     // redaktiruem formu
    //     this.categoriesService.getById(params['id']).subscribe(d => console.log('dddd',d))
    //     this.isNew = false
    //   }
    // })

    this.form.disable()

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']){
              this.isNew = false
              return this.categoriesService.getById(params['id'])
            }
            return  of(null)
          }
        )
      ).subscribe(
      (category: Category) => {
          if (category) {
            this.form.patchValue({
              name: category.name
            })
            this.imagePreview = category.imageSrc
            MaterialService.updateTextInputs()
          }
          this.form.enable()
        },
       error => MaterialService.toast(error.error.message)
      )


  }

  triggerClic() {
    this.inputRef.nativeElement.click()
  }

  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file)
  }

  onSubmit() {

  }


}
