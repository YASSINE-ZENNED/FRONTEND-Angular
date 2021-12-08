import { Comment } from './../shared/comment';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { flyInOut } from '../animations/app-animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
      state(
        'visible',
        style({
          transform: 'scale(1.0)',
          opacity: 1,
        })
      ),
      state(
        'hidden',
        style({
          transform: 'scale(0.5)',
          opacity: 0,
        })
      ),
      transition('* => *', animate('0.5s ease-in-out')),
    ]),
    flyInOut(),
  ],
  host: {
    '[@flyInOut]': 'true',
    style: 'display:block',
  },
})
export class DishdetailComponent implements OnInit {
  commentForm!: FormGroup;
  comment!: Comment;

  errMess!: string;

  dishcopy!: Dish;
  dish!: Dish;
  dishIds!: string[];
  prev!: string;
  next!: string;
  myDate = new Date();
  date = new Date(Date.now());
  visibility = 'visible';

  constructor(
    private dishService: DishService,
    private location: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  CreateForm() {
    this.commentForm = this.fb.group({
      author: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      rating: 5,
      comment: ['', Validators.required],
    });

    this.commentForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );

    this.onValueChanged(); // (re)set validation messages now
  }

  formErrors: any = {
    author: '',
    comment: '',
  };

  validationMessages: any = {
    author: {
      required: 'username is required.',
      minlength: 'username must be at least 2 characters long.',
      maxlength: 'username cannot be more than 25 characters long.',
    },
    comment: {
      required: 'comment is required.',
    },
  };

  //ask about this
  ngOnInit(): void {
    this.CreateForm();

    this.dishService
      .getDishIds()
      .subscribe((dishIds) => (this.dishIds = dishIds));
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.visibility = 'hidden';
          return this.dishService.getDish(params['id']);
        })
      )
      .subscribe(
        (dish) => {
          this.dish = dish;
          this.dishcopy = dish;
          this.setPrevNext(this.dish.id);
          this.visibility = 'visible';
        },
        (errmess) => (this.errMess = <any>errmess)
      );
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev =
      this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next =
      this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goback() {
    this.location.back();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) {
      return;
    }
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

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = this.date.toString();
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy).subscribe(
      (dish) => {
        this.dish = dish;
        this.dishcopy = dish;
      },
      (errmess) => {
        this.errMess = <any>errmess;
      }
    );
    console.log(this.comment);

    this.commentForm.reset({
      username: '',
      comment: '',
    });

    this.comment.rating = 5;
  }
}
