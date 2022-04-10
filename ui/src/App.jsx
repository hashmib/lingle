import Board from './components/Board'
import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import {Typography, Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import CheckIcon from '@mui/icons-material/Check';
import MuiAlert from '@material-ui/lab/Alert';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

const fontTheme = createTheme({
  typography: {
    fontFamily: [
      'Ubuntu Mono',
    ].join(','),
},});

const useStyles = makeStyles(theme => ({
	container: {
    display: "flex",
    alignItems: "center",
		flexDirection: "column",
    gap: "50px",
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
	},
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function App() {
  const classes = useStyles();
  const [roomName, setRoomName] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isErrorState, setIsErrorState] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
    setIsErrorState(false);
  };

  const handleNewRoomNameChange = (event) => {
    setNewRoomName(event.target.value);
    setIsErrorState(false);
  };

  async function handleRoomNameSubmit(event) {
    event.preventDefault();

    // Reusing same API since it will tell us if the room exists or not
    let queryBuilder = "/api/wordoftheday?name=" + roomName;

    await fetch(queryBuilder)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setRoomName(roomName);
        setIsPlaying(true);
      }
      else {
        setIsErrorState(true);
        setErrorMessage(data.error);
      }
    })
    .catch(error => {
      console.log(error);
    });

  };

  const handleFileUpload = (event) => {
    event.preventDefault();
    setIsFileUploaded(true);
    setUploadedFile(event.target.files[0]);
  };


  async function handleCreateNewRoomSubmit(event) {
    event.preventDefault();

    const formData = new FormData();
  
    formData.append("name", newRoomName);
    formData.append("file", uploadedFile);
  
    let queryBuilder = "/api/createlingleroom";
    await fetch(queryBuilder, {
      method: "POST",
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setRoomName(newRoomName);
        setIsPlaying(true);
      }
      else {
        setIsErrorState(true);
        setErrorMessage(data.error);
      }
    })
    .catch(error => {
      console.log(error);
    });
  };

  return (
    <ThemeProvider theme={fontTheme}>
    <div className={classes.container}>
            <Typography variant="h3">
                lingle
            </Typography>
            {isPlaying ? <Board room={roomName} /> :
            <div className={classes.modal}>
                <Typography variant="h6">
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
                <Typography variant="h6">
                  Or alternatively, upload a Whatsapp chat export below, enter a room name, and start a new game!
                </Typography>
                {isErrorState ? <Alert severity="error">{errorMessage}</Alert> : null}
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
                  <Button variant="outlined" color="secondary" component="label" onChange={handleFileUpload}>
                    Choose Whatsapp File
                    <input
                      type="file"
                      hidden
                    />
                  </Button>
                  {isFileUploaded ? <CheckIcon /> : null}
                  <Button variant="contained" color="secondary" onClick={handleCreateNewRoomSubmit}>
                    Create Room and Start Game
                  </Button>
                </div>
            </div>
            }
    </div>
    </ThemeProvider>
  );
}

export default App;