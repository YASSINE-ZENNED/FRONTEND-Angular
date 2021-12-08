import { Component, OnInit } from '@angular/core';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut ,expand} from '../animations/app-animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [flyInOut(),expand()],
  host: {
    '[@flyInOut]': 'true',
    style: 'display:block',
  },
})
export class AboutComponent implements OnInit {
  constructor(private leaderService: LeaderService) {}

  leaders!: Leader[];

  ngOnInit(): void {
    this.leaderService
      .getLeaders()
      .subscribe((leaders) => (this.leaders = leaders));
  }
}
