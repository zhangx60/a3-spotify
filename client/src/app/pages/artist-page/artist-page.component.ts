import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { ArtistData } from '../../data/artist-data';
import { TrackData } from '../../data/track-data';
import { AlbumData } from '../../data/album-data';

@Component({
    selector: 'app-artist-page',
    templateUrl: './artist-page.component.html',
    styleUrls: ['./artist-page.component.css'],
    standalone: false
})
export class ArtistPageComponent implements OnInit {
	artistId:string;
	artist:ArtistData;
	topTracks:TrackData[];
	albums:AlbumData[];

  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService, private destroyRef: DestroyRef) { }

  ngOnInit() {
    // Reload whenever the URL changes to another artist.
    this.route.paramMap.pipe(
      switchMap((params) => {
        this.artistId = params.get('id');
        this.artist = undefined;
        this.topTracks = [];
        this.albums = [];

        return forkJoin({
          artist: this.spotifyService.getArtist(this.artistId),
          topTracks: this.spotifyService.getTopTracksForArtist(this.artistId),
          albums: this.spotifyService.getAlbumsForArtist(this.artistId)
        });
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((data) => {
      this.artist = data.artist;
      this.topTracks = data.topTracks;
      this.albums = data.albums;
    });
  }

}
