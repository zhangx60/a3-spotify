import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { TrackData } from '../../data/track-data';
import { AlbumData } from '../../data/album-data';

@Component({
    selector: 'app-album-page',
    templateUrl: './album-page.component.html',
    styleUrls: ['./album-page.component.css'],
    standalone: false
})
export class AlbumPageComponent implements OnInit {
	albumId:string;
	album:AlbumData;
	tracks:TrackData[];


  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService, private destroyRef: DestroyRef) { }

  ngOnInit() {
    // Reload whenever the URL changes to another album.
    this.route.paramMap.pipe(
      switchMap((params) => {
        this.albumId = params.get('id');
        this.album = undefined;
        this.tracks = [];

        return forkJoin({
          album: this.spotifyService.getAlbum(this.albumId),
          tracks: this.spotifyService.getTracksForAlbum(this.albumId)
        });
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((data) => {
      this.album = data.album;
      this.tracks = data.tracks;
    });
  }

}
