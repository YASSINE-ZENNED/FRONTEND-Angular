import { Component, OnInit, ViewChild } from '@angular/core';
import { FeedBack, ContactType } from '../shared/feedback';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { flyInOut } from '../animations/app-animation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';
import { of, Observable } from 'rxjs';
import { expand } from '../animations/app-animation';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [flyInOut(), expand()],
  host: {
    '[@flyInOut]': 'true',
    style: 'display:block',
  },
})
export class ContactComponent implements OnInit {
  feedbackForm!: FormGroup;
  feedback!: FeedBack;
  feedbackcopy!: FeedBack;
  feedbackcopy1!: FeedBack;
  contacttype = ContactType;
  reqsent: boolean = false;

  @ViewChild('fform') feedbackFormDirective: any;

  formErrors: any = {
    firstname: '',
    lastname: '',
    telnum: '',
    email: '',
  };

  validationMessages: any = {
    firstname: {
      required: 'First Name is required.',
      minlength: 'First Name must be at least 2 characters long.',
      maxlength: 'FirstName cannot be more than 25 characters long.',
    },
    lastname: {
      required: 'Last Name is required.',
      minlength: 'Last Name must be at least 2 characters long.',
      maxlength: 'Last Name cannot be more than 25 characters long.',
    },
    telnum: {
      required: 'Tel. number is required.',
      pattern: 'Tel. number must contain only numbers.',
    },
    email: {
      required: 'Email is required.',
      email: 'Email not in valid format.',
    },
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService
  ) {
    this.CreateForm();
  }

  ngOnInit(): void {}

  CreateForm() {
    this.feedbackForm = this.fb.group({
      firstname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      telnum: [, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: '',
    });

    this.feedbackForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );

    this.onValueChanged(); //reset form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
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

  putFeedback(feedback: FeedBack): Observable<FeedBack> {
    return this.http
      .post<FeedBack>(environment.baseUrl + 'feedback/', feedback)
      .pipe(catchError(this.processHTTPMsgService.handelError));
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;

    this.putFeedback(this.feedback).subscribe((feedback) => {

          // <<<---using ()=> syntax
      this.feedbackcopy = feedback;


      setTimeout(() => {
        // <<<---using ()=> syntax
        this.reqsent = true;
      }, 5000);


    });
    

    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: '',
    });
  }
}
