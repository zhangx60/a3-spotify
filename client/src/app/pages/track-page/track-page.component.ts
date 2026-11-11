import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { TrackData } from '../../data/track-data';

@Component({
    selector: 'app-track-page',
    templateUrl: './track-page.component.html',
    styleUrls: ['./track-page.component.css'],
    standalone: false
})
export class TrackPageComponent implements OnInit {
	trackId:string;
	track:TrackData;

  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService) { }

  ngOnInit() {
  	this.trackId = this.route.snapshot.paramMap.get('id');
    // Load the track details using the ID from the URL.
    this.spotifyService.getTrack(this.trackId).then((track) => {
      this.track = track;
    });
  }

}
