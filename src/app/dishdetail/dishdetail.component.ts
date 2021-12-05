import { Comment } from './../shared/comment';
import { Component, OnInit,ViewChild } from '@angular/core';
import {Dish} from '../shared/dish';
import { Params,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';




@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

    commentForm!: FormGroup;
    comment!:Comment;
 
  
   dish! :Dish;
   dishIds!:string[];
   prev!:string;
   next!:string;
   myDate = new Date();
    date = new Date(Date.now());


  constructor(private dishService: DishService,private location:Location,private route:ActivatedRoute,private fb:FormBuilder) {
    this.CreateForm();

   }
 

   CreateForm() {
    this.commentForm = this.fb.group({
      author:['',[Validators.required,Validators.minLength(2) ,Validators.maxLength(25)]],
      rating: 5,
      comment: ['', Validators.required]
      
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }



   formErrors : any= {
    'author': '',
    'comment': '',

  };


  
  validationMessages : any= {
    'author': {
      'required':      'username is required.',
      'minlength':     'username must be at least 2 characters long.',
      'maxlength':     'username cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'comment is required.',
    }
  };



  ngOnInit(): void {
  this.dishService.getDishIds().subscribe((dishIds) => this.dishIds =dishIds);
   this.route.params.pipe(switchMap((params:Params) => this.dishService.getDish(params['id'])))
   .subscribe(dish => {this.dish =dish;this.setPrevNext(this.dish.id) });
  }

  setPrevNext(dishId:string) {

    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length]
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length]

  }


  goback(){

    this.location.back();

  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  
  onSubmit(){
    this.comment = this.commentForm.value;
    this.comment.date= this.date.toString();
    this.dish.comments.push(this.comment)
    console.log(this.comment);

    this.commentForm.reset({
      username: '',
      comment:'',
    });

    this.comment.rating=5;

  }
   
}
