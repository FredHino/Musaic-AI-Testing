import React, { useState, useEffect } from 'react';
import {
  Button,
  Drawer,
  Grid,
  Menu,
  MenuItem,
  Link,
  TextField,
} from '@mui/material';
import MenuaItems from "@/components/index/_menuaitems";
import Center from '@/components/active/_center';
import CreateMusaicLobby from './CreateMusaicLobby';
import JoinMusaicLobby from './JoinMusaicLobby';
import Lobby from './lobby';
import MainButton from '@/components/active/_generalbutton';
import Menua from '@/components/active/_avatarmenu';
import styles from '@/styles/Home.module.css';
import TrackList from '@/components/active/_scrolltracklist';
import VibePicker from './vibePicker';
import useDashboard from '@/hooks/useDashboard';

import { Checkbox } from "@mui/material";

import { getDatabase, ref, set, push, child, update } from 'firebase/database';


export const formatTracks = (tracks) => {
  console.log(tracks)
  return tracks.map((track) => ({
    id: track.id,
    name: track.name,
    author: track.artist, 
    avatar: track.image_url, 
    url: track.url,
  }));
};

const Dashboard = ({ navigateToSignIn, navigateToLanding, user, setUser }) => {

  const [deleteClicked, setDeleteClicked] = useState(false);
  const [selectedDeletePlaylists, setSelectedDeletePlaylists] = useState([]);
  const [vibePickerOpen, setVibePickerOpen] = useState(false);
  const [createMusaicDrawerOpen, setCreateMusaicDrawerOpen] = useState(false);
  const [joinMusaicDrawerOpen, setJoinMusaicDrawerOpen] = useState(false);
  const [lobbyIdInput, setLobbyIdInput] = useState('');
  const spotify_yt = "/signin/spotify_yt.png";
  const handleLobbyIdInputChange = (event) => {
    setLobbyIdInput(event.target.value);
  };

  const openVibePicker = () => {
    setVibePickerOpen(true);
  };

  const closeVibePicker = () => {
    setVibePickerOpen(false);
  };

  const openCreateMusaicDrawer = () => {
    setCreateMusaicDrawerOpen(true);
  };

  const closeCreateMusaicDrawer = () => {
    setCreateMusaicDrawerOpen(false);
  };

  const openJoinMusaicDrawer = () => {
    setJoinMusaicDrawerOpen(true);
  };

  const closeJoinMusaicDrawer = () => {
    setJoinMusaicDrawerOpen(false);
  };

  const handleJoinLobbySubmit = () => {
    if (lobbyIdInput.trim() !== "") {
      joinLobby(lobbyIdInput.trim());
    } else {
      // Replace alert() with Material-UI Snackbar
    }
  };
  const handleDeletePlaylistsClick = () => {
    setDeleteClicked(!deleteClicked);
  };

  const handlePlaylistCheck = (event, isChecked, playlistID) => {
    if (isChecked) {
      setSelectedDeletePlaylists([...selectedDeletePlaylists, playlistID]);
    } else {
      setSelectedDeletePlaylists(selectedDeletePlaylists.filter(id => id !== playlistID));
    }
  };

  const handleDeletePlaylists = async () => {
    setDeleteClicked(!deleteClicked);
    const accessToken = sessionStorage.getItem('spotify_access_token');
    if (selectedDeletePlaylists.length > 0) {
      try {
        const requestBody = {
          user_id: user.user_id,
          playlist_ids: selectedDeletePlaylists,
          token: accessToken,
        };
        const response = await fetch('/api/delete_playlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

        if (response.ok) {
          const currentUserData = JSON.parse(sessionStorage.getItem('user_data'));
          currentUserData.playlists = currentUserData.playlists.filter(
            (playlist) => !selectedDeletePlaylists.includes(playlist.id)
          );
          sessionStorage.setItem('user_data', JSON.stringify(currentUserData));
          setUser(currentUserData);
          console.log('playlists successfully deleted');
        } else {
            console.error('Request failed', response.statusText);
        }

      } catch (error) {
        console.error('Error deleting playlists:', error);
      }
    }

  };

  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const { playlists = [], image_url = "/landing/logo.png", username } = user || {};
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);


  const {
    createLobby,
    joinLobby,
    handleCreatePlaylist,
    searchTerm,
    setSearchTerm,
    handleSearchChange,
    anchorLobby,
    setAnchorLobby,
    copyToClipboard,
    musaicKey,
    setMusaicKey
  } = useDashboard(user, setSelectedPlaylist, setUser, closeJoinMusaicDrawer);

  const avatar = user?.image_url || "/landing/logo.png";
  const name = user?.username || "Guest";

  
  const untitledArtwork = "/landing/logo.png";
  const home = "/dashboard/home.png";
  const friend = "/dashboard/friend.png";
  const vibepicker = "/dashboard/vibepicker.png";
  const vector = "/dashboard/vector.png";
  
  const handleLanding = () => {
    navigateToLanding();
  };

  const handleLetsGo = () => {
        navigateToSignIn();
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openLobby = (event) => {
    setAnchorLobby(event.currentTarget);
  };

  const closeLobby = () => {
    setAnchorLobby(null);
  };

  const [lobbyOpen, setLobbyOpen] = useState(false);




  const handlePlaylistSelection = (playlist) => {
    console.log("Setting selected playlist:", playlist);
    setLoadingPlaylist(true);
    setSelectedPlaylist(playlist);
  };
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(
        "User data from session storage:",
        JSON.parse(sessionStorage.getItem("user_data"))
      );
    }
  }, []);


  useEffect(() => {
    console.log("Selected playlist changed:", selectedPlaylist);
  }, [selectedPlaylist]);

  useEffect(() => {
    if (selectedPlaylist) {
      setLoadingPlaylist(false);
    }
  }, [selectedPlaylist]);

  const formatPlaylists = (playlists) => {
    console.log(playlists)
    return playlists.map((playlist) => ({
      ...playlist, 
      id: playlist.id,
      name: playlist.name,
      author: "", // SAMPLE
      avatar: playlist.image_url || "/landing/logo.png",
      url: playlist.url,
      openInSpotify: playlist.spotify_url, // Add this line
    }));
  };
  
  
  const handleCreatePlaylistAndClose = async (playlistName, filteredTracks) => {
    await handleCreatePlaylist(playlistName, filteredTracks);
    closeCreateMusaicDrawer();
  };


  const renderDrawers = () => {
    return (
      <>
        <Drawer anchor={"right"} open={Boolean(anchorLobby)} onClose={closeLobby}>
          <Lobby
            handleCreatePlaylist={handleCreatePlaylist}
            closeLobby={closeLobby}
          />
        </Drawer>
        <Drawer
          anchor="left"
          open={createMusaicDrawerOpen}
          onClose={closeCreateMusaicDrawer}
          sx={{ backgroundColor: "background" }}
        >
          <CreateMusaicLobby createLobby={createLobby} openVibePicker={openVibePicker} closeLobby={closeCreateMusaicDrawer} musaicKey={musaicKey} copyToClipboard={copyToClipboard} />
        </Drawer>
        <Drawer
          anchor="left"
          open={joinMusaicDrawerOpen}
          onClose={closeJoinMusaicDrawer}
          sx={{ backgroundColor: "background" }}
        >
          <JoinMusaicLobby user={user} joinLobby={joinLobby} closeLobby={closeJoinMusaicDrawer} />
        </Drawer>
        <Drawer
          anchor="left"
          open={vibePickerOpen}
          onClose={closeVibePicker}
          sx={{ backgroundColor: "background" }}
        >
          <VibePicker
            handleCreatePlaylist={handleCreatePlaylistAndClose}
            pass={closeVibePicker}
            closeAllDrawers={closeVibePicker}
          />
        </Drawer>
      </>
    );
  };
  

  return (
    user && (
      <div className={styles.all}>
        <div className={styles.dashboard} >
          <div className={styles.navbar} >
          <div className={styles.menu}>
              <Button href="/"><img style = {{height: "40px", width: "45px", alignSelf:"center"}} src={untitledArtwork} /></Button>
              <MenuaItems source={spotify_yt} />
            <div>
              <img onClick={handleClick} className={styles.untitledartworkdash3} src={avatar} />
              <Menua function={handleClose} anchor={anchorEl} logout={handleLanding} user={user}/>
            </div>
          </div>
          </div>
          <div
            className={styles.dashboardbox}
            style={{
              paddingTop: "60px",
            }}
          >
              <div
                className={styles.innerbox}
                style={{
                  width: "80vw",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: "3%",
                  marginBottom: "50px",
                }}
              >
                <div>
                  <div className={styles.landingdash} style={{ lineHeight:"50px" }}>
                    Hi, {name}
                  </div>
                  <div
                    className={styles.landingdash}
                    style={{
                      fontSize: "15px",
                      letterSpacing: "5px",
                      marginTop: "50px",
                      lineHeight:"20px"
                    }}
                  >
                    
                    You've made {playlists ? playlists.length : 0} Musaics
                  </div>
                  <div>
                    <MainButton
                    mrr="10px"
                    mtt="10px"
                    loc={openCreateMusaicDrawer}
                    name="Create a Musaic"
                  />
                  {playlists.length > 0 && (
                      <MainButton coloringg="red" mtt="10px" name='Delete Playlists' loc={handleDeletePlaylistsClick}/>
                    )}
                     {deleteClicked && (
                      <div>
                      <MainButton mtt="10px" coloringg="gray" name='Cancel' loc={handleDeletePlaylistsClick}/>
                      <MainButton mtt="10px" coloringg="red" name ='Delete' loc={handleDeletePlaylists}/>
                      </div>
                    )}
                  </div>
                  
                </div>
              </div>
  
               <Center object={
               <div>
                  {/* <input
                    className={styles.search}
                    type="text"
                    placeholder="Search Tracks"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  /> */}
                </div>}/>
                <div className={styles.tracksContainer}>
              {/* Your Musaics section */}
                <div className={styles.trackList}>
                  <h3 style={{ fontWeight: '100', fontFamily: 'Inter, sans-serif', letterSpacing: '1px', color: '#ced3fa', fontSize: '15px' }}>Your Musaics:</h3>
                  <TrackList
                    items={formatPlaylists(playlists)}
                    onSelection={handlePlaylistSelection}
                    renderAdditionalButton={(item) => (
                      <div>
                      <Link href={item.url} target="_blank" rel="noopener noreferrer" underline="none">
                        <Button size="small" variant="contained">Open in Spotify</Button>
                      </Link>
                      {deleteClicked && (
                        <Checkbox onChange={(event, isChecked) => handlePlaylistCheck(event, isChecked, item.id)}/>
                      )}
                      </div>
                    )}
                  />
                </div>
              {/* Selected Playlist section */}
                <div className={styles.trackList}>
                  {loadingPlaylist ? (
                    <div></div>
                  ) : selectedPlaylist ? (
                    <>
                      <h3 style={{ fontWeight: '100', fontFamily: 'Inter, sans-serif', letterSpacing: '1px', color: '#ced3fa', fontSize: '15px' }}>{selectedPlaylist.name}</h3>
                      {(() => {
                        const items = formatTracks(selectedPlaylist?.tracks || []);
                        console.log("Rendering Selected Playlist TrackList with items:", items);
                        return <TrackList items={items} />;
                      })()}
                    </>
                  ) : (
                    <div style={{ width: '100%' }}>
                      <span className={styles.friendmatch}>
                        Please select a Musaic to view its tracks.
                      </span>
                    </div>
                  )}
                </div>
            </div>

          </div>
        </div>
        {renderDrawers()} 
      </div>
    )
  );
};

export default Dashboard;
