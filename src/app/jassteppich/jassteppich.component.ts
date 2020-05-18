import {Component, OnInit} from '@angular/core';
import {Karte} from "../karte";
import {KartenService} from "../services/karten.service";

@Component({
  selector: 'app-jassteppich',
  templateUrl: './jassteppich.component.html',
  styleUrls: ['./jassteppich.component.css']
})
export class JassteppichComponent implements OnInit {

  karten: Karte[];
  karteCurrentPlayer: Karte;

  constructor(private kartenService: KartenService) { }

  ngOnInit(): void {
    this.getKarten();
  }

  getKarten(): void {
    this.kartenService.getSpielerKarten().subscribe(karten => this.karten = karten);
  }

  onClick(karte: Karte) {
    this.karteCurrentPlayer = karte;
    const index: number = this.karten.indexOf(karte);
    if (index !== -1) {
      this.karten.splice(index, 1)
    }
  }
}
