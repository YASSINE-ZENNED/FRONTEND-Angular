import { Component, OnInit,Inject } from '@angular/core';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service';
import {flyInOut} from '../animations/app-animation';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    flyInOut()
  ] ,
   host:{
  '[@flyInOut]':'true',
  'style':'display:block'
},

})

@Inject('BaseURL')

export class MenuComponent implements OnInit {

  dishes!: Dish[];

  errMess!:string;
  constructor(private dishService: DishService)
    {

    }

  ngOnInit(): void {
   this.dishService.getDishes().subscribe((dishes)=> this.dishes = dishes ,
    errmess => this.errMess =<any>errmess)

  }

}
