import Board from './components/Board'
import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import {Typography, Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	container: {
    display: "flex",
    alignItems: "center",
		flexDirection: "column",
  },
  modal: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: "100vh",
    gap: "15px",
  },
  horizontal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    gap: "15px",
  },
  text: {
    color: "white"
  },
  textField: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(5),
	},
	button: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(5),
	}
}));

function App() {
  const classes = useStyles();
  const [roomName, setRoomName] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [isPlaying, setisPlaying] = useState(false);

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  const handleNewRoomNameChange = (event) => {
    setNewRoomName(event.target.value);
  };

  const handleRoomNameSubmit = (event) => {
    event.preventDefault();
    setisPlaying(true);
  };

  const handleCreateNewRoomSubmit = (event) => {
    event.preventDefault();
    setNewRoomSelected(true);
  };

  return (
    <div className={classes.container}>
            <Typography variant="h3">
                Welcome to Lingle!
            </Typography>
            {isPlaying ? <Board room={roomName} /> :
            <div className={classes.modal}>
                <Typography variant="subtitle1">
                  Join an existing room! Enter your room name below. 
                </Typography>
                <div className={classes.horizontal}>
                  <TextField
                    label="Room Name"
                    variant="standard"
                    focused
                    required
                    InputProps={{
                      className: classes.text
                    }}
                    className={classes.textField}
                    value={roomName}
                    onChange={handleRoomNameChange}
                  />
                  <Button variant="contained" color="secondary" onClick={handleRoomNameSubmit}>
                    Start Game
                  </Button>
                </div>
                <Typography variant="subtitle1">
                  Or alternatively, upload a Whatsapp chat export below, enter a room name, and start a new game!
                </Typography>
                <div className={classes.horizontal}>
                  <TextField
                    label="Room Name"
                    variant="standard"
                    required
                    focused
                    InputProps={{
                      className: classes.text
                    }}
                    className={classes.textField}
                    value={newRoomName}
                    onChange={handleNewRoomNameChange}
                  />
                  <Button variant="outlined" color="secondary" component="label">
                    Choose Whatsapp File
                    <input
                      type="file"
                      hidden
                    />
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handleCreateNewRoomSubmit}>
                    Create Room and Start Game
                  </Button>
                </div>
            </div>
            }
    </div>
  );
}

export default App;