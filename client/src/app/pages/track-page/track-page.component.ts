import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
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

  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService, private destroyRef: DestroyRef) { }

  ngOnInit() {
    // Reload whenever the URL changes to another track.
    this.route.paramMap.pipe(
      switchMap((params) => {
        this.trackId = params.get('id');
        this.track = undefined;
        return this.spotifyService.getTrack(this.trackId);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((track) => {
      this.track = track;
    });
  }

}
