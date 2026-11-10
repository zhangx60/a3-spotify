import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://127.0.0.1:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //Specifically, update the URI according to the base URL for express and the endpoint.
    var uri:string = this.expressBaseUrl + endpoint;

    //firstValueFrom generates a Promise for whatever is returned first from the GET request.
    //You shouldn't need to update this part.
    return firstValueFrom(this.http.get(uri)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.
    var endpoint:string = '/search/' + category + '/' + encodeURIComponent(resource);

    return this.sendRequestToExpress(endpoint).then((data) => {
      var results:ResourceData[] = [];

      //Spotify puts the results under "artists", "albums", or "tracks", and the list is in "items"
      if (category == 'artist') {
        var artistItems = data['artists']['items'];
        for (var i = 0; i < artistItems.length; i++) {
          results.push(new ArtistData(artistItems[i]));
        }
      } else if (category == 'album') {
        var albumItems = data['albums']['items'];
        for (var i = 0; i < albumItems.length; i++) {
          results.push(new AlbumData(albumItems[i]));
        }
      } else if (category == 'track') {
        var trackItems = data['tracks']['items'];
        for (var i = 0; i < trackItems.length; i++) {
          results.push(new TrackData(trackItems[i]));
        }
      }

      return results;
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    var endpoint:string = '/artist/' + encodeURIComponent(artistId);

    return this.sendRequestToExpress(endpoint).then((data) => {
      return new ArtistData(data);
    });
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    var endpoint:string = '/artist-top-tracks/' + encodeURIComponent(artistId);

    return this.sendRequestToExpress(endpoint).then((data) => {
      //The top tracks are in data['tracks']
      var tracks:TrackData[] = [];
      var trackItems = data['tracks'];
      for (var i = 0; i < trackItems.length; i++) {
        tracks.push(new TrackData(trackItems[i]));
      }
      return tracks;
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    var endpoint:string = '/artist-albums/' + encodeURIComponent(artistId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      //The albums are in data['items']
      var albums:AlbumData[] = [];
      var albumItems = data['items'];
      for (var i = 0; i < albumItems.length; i++) {
        albums.push(new AlbumData(albumItems[i]));
      }
      return albums;
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    var endpoint:string = '/album/' + encodeURIComponent(albumId);

    return this.sendRequestToExpress(endpoint).then((data) => {
      return new AlbumData(data);
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    var endpoint:string = '/album-tracks/' + encodeURIComponent(albumId);

    return this.sendRequestToExpress(endpoint).then((data) => {
      //The tracks are in data['items']
      var tracks:TrackData[] = [];
      var trackItems = data['items'];
      for (var i = 0; i < trackItems.length; i++) {
        tracks.push(new TrackData(trackItems[i]));
      }
      return tracks;
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    var endpoint:string = '/track/' + encodeURIComponent(trackId);

    return this.sendRequestToExpress(endpoint).then((data) => {
      return new TrackData(data);
    });
  }
}