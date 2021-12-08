import { DishService } from './../services/dish.service';
import { Component, OnInit } from '@angular/core';
import {Dish} from '../shared/dish';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import {LeaderService} from '../services/leader.service';
import {Leader} from '../shared/leader';
import { flyInOut,expand } from '../animations/app-animation';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [flyInOut(),expand()],
  host: {
    '[@flyInOut]': 'true',
    style: 'display:block',
  },
})
export class HomeComponent implements OnInit {
  dishErrMsg!: string;
  leaderErrMsg!: string;
  promotionErrMsg!: string;

  dish!: Dish;
  promotion!: Promotion;
  leader!: Leader;

  constructor(
    private DishService: DishService,
    private PromotionService: PromotionService,
    private LeaderService: LeaderService
  ) {}

  ngOnInit(): void {
    this.DishService.getFeaturedDish().subscribe(
      (dish) => (this.dish = dish),
      (errmess) => (this.dishErrMsg = <any>errmess)
    );
    this.PromotionService.getFeaturedPromotion().subscribe(
      (promotion) => (this.promotion = promotion),
      (errmess) => (this.dishErrMsg = <any>errmess)
    );
    this.LeaderService.getFeaturedLeader().subscribe(
      (leader) => (this.leader = leader),
      (errmess) => (this.dishErrMsg = <any>errmess)
    );
  }
}
