from http.server import BaseHTTPRequestHandler
from json import dumps, loads


from api.helpers.mongodb_helper import MongodbHelper
from api.helpers.spotify_helper import PlaylistMaker

class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        request_body = loads(post_data)

        user_id = request_body.get('user_id')
        playlist_id = request_body.get('playlistId')

        print(f"Deleting playlist: {playlist_id} for user: {user_id}")  # Add print statement
        playlist_ids = request_body.get('playlist_ids')
        token = request_body.get('token')

        mdb = MongodbHelper()
        pm = PlaylistMaker([token])


        for playlist_id in playlist_ids:
            mdb.remove_playlist_from_user(user_id, playlist_id)
            pm.delete_playlist(playlist_id)

        self.send_response(200)
        self.send_response(204)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(dumps({"message": "Playlist deleted successfully"}).encode())
        return
