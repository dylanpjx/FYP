import { React, useState } from 'react';
import { parseISO } from 'date-fns';
import axios from 'axios';
import { Scheduler } from '@aldabil/react-scheduler';
import { useNavigate } from "react-router-dom";
import { 
    Dialog, 
    TextField, 
    Button, 
    Stack,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Box
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

import DialogPopup from './DialogPopup'

const GROUP_COLORS = ["#FF5733", "#17A2B8", "#FFC107", "#28A745", "#6C757D", "#6F42C1", "#20C997", "#E83E8C", "#007BFF", "#DC3545", "#FD7E14", "#6610F2", "#155724", "#D62020", "#1E90FF", "#FFC300"]

const BACKEND_URL = 'http://localhost:5000';
const MODULES = JSON.parse(localStorage.getItem("modules"));

const CustomEditor = ( scheduler ) => {
    const event = scheduler.edited;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [dialogTitle, setDialogTitle] = useState("");

    const handleDialogClose = () => {
        setDialogTitle("");
        setDialogMessage("");
        setDialogOpen(false);
    }

    // Make your own form/state
    const [state, setState] = useState({ 
        event_id: event?.event_id || null, 
        start: event?.start || scheduler.state.start.value,
        end: event?.end || scheduler.state.end.value,
        module: event?.module || "",
        groupId: event?.groupId || null,
        color: event?.color || null,
        title: event?.title || null
    });

    const handleChange = (value, name) => {
        setState(prevState => {
            return {
              ...prevState,
              [name]: value
            };
        });
    };

    const handleSubmit = async () => {
        // Your own validation
        if (!state.start.getTime()) {
            setDialogTitle("Something went wrong");
            setDialogMessage("Invalid start date");
            setDialogOpen(true);
            return null;
        }
        else if (!state.end.getTime()) {
            setDialogTitle("Something went wrong");
            setDialogMessage("Invalid end date");
            setDialogOpen(true);
            return null;
        }
        else if (state.start.getTime() > state.end.getTime()){
            setDialogTitle("Something went wrong");
            setDialogMessage("Invalid start & end date");
            setDialogOpen(true);
            return null;
        }
        else if(state.module === ""){
            setDialogTitle("Something went wrong");
            setDialogMessage("Select a module to book");
            setDialogOpen(true);
            return null;
        }

        try {
            scheduler.loading(true);

            let url;
            let method;
            let body;
            const userGroup = parseInt(localStorage.getItem("group"));
            const userRole = localStorage.getItem("role")

            if (event) {    //EDIT method
                // Check if user has edit permissions
                if (userGroup === state.groupId ||
                    userRole === "admin") {
                    url = `${BACKEND_URL}/calendar_data/edit`;
                    method = "PUT";
                } else {
                    setDialogOpen()
                    setDialogTitle("You do not have the relevant permissions")
                    setDialogMessage("Not from the correct group/Not an admin")
                    return null;
                }
            } else if (!event) {    //Create method
                url = `${BACKEND_URL}/calendar_data/create`;
                method = "POST";
            } else {
                return null;
            }
            body = JSON.stringify({
                ...state,
                title: `Group ${userGroup} - ${state.module}`,
                color: GROUP_COLORS[userGroup],
                groupId: userGroup
            });

            const added_updated_event = await new Promise((resolve) => {
                axios({
                    method,
                    url,
                    headers: { "Content-Type": "application/json" },
                    data: body
                }).then((response) => {
                    const event = JSON.parse(response.data);
                    const parsedEvent = {
                        ...event,
                        start: parseISO(event.start),
                        end: parseISO(event.end)
                    };
                    resolve(parsedEvent);
                }).catch (error => {
                    console.log(error);
                })
            });

            scheduler.onConfirm(added_updated_event, event ? "edit" : "create"); 
            scheduler.close();

        } catch (err) {
            console.error("Error:", err);
        } finally {
            scheduler.loading(false);
        }
    };
    return (
        <div>
            <Dialog open={true} >
                {event 
                    ?<DialogTitle>Edit booking</DialogTitle>
                    :<DialogTitle>Create booking</DialogTitle>
                }
                <DialogContent>
                    <Stack spacing={2}>
                        <Box sx={{mt:1, minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="Select Module">Select module</InputLabel>
                                <Select
                                labelId="Select Module"
                                id="Select Mod"
                                value={state.module}
                                label="Select module"
                                onChange={(e) => handleChange(e.target.value, "module")}
                                >
                                    {MODULES.map((mod) => (
                                        <MenuItem
                                        key={mod}
                                        value={mod}
                                        >
                                        {mod}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Stack direction="row" spacing={2}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    renderInput={(props) => <TextField {...props} />}
                                    label="Start"
                                    value={state.start}
                                    onChange={(e) => console.log(new Date(e), "start")}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    renderInput={(props) => <TextField {...props} />}
                                    label="End"
                                    value={state.end}
                                    onChange={(e) => handleChange(new Date(e), "end")}
                                />
                            </LocalizationProvider>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={scheduler.close}>Cancel</Button>
                    <Button onClick={handleSubmit}>Confirm</Button>
                </DialogActions>
                <DialogPopup
                    open={dialogOpen}
                    title={dialogTitle}
                    message={dialogMessage}
                    handleClose={handleDialogClose}
                />
            </Dialog>
        </div>
    );
};

const Calendar = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [dialogTitle, setDialogTitle] = useState("");

    let navigate = useNavigate();

    const handleDialogClose = () => {
        setDialogTitle("");
        setDialogMessage("");
        setDialogOpen(false);
    }

    const fetchRemote = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/calendar_data/get`);
            const events = res.data;
            console.log("Events", events);

            const parsedEvents = events.map(event => {
                return {
                    ...event,
                    start: parseISO(event.start),
                    end: parseISO(event.end)
                }
            })
            console.log(parsedEvents)
            return parsedEvents;
        } catch (err) {
            console.log('Error:', err);
        }
    }

    const handleDelete = async (event_id) => {
        try {
            const res = await axios.delete(`${BACKEND_URL}/calendar_data/delete`, {data: {event_id:event_id}});
            console.log(res.data);
            return event_id;
        } catch (err) {
            console.error("Error:", err)
        }
    };

    return (
        <div>
            <Button
                variant="contained"
                onClick={() => navigate("/home")}
                startIcon={ <ArrowLeftIcon /> }
            >
            Back
            </Button>

            <Scheduler
                getRemoteEvents={fetchRemote}
                onDelete={handleDelete}
                customEditor={CustomEditor}
                week={{ 
                    startHour: 0, 
                    endHour: 23,
                }}
                day={{
                    startHour: 0, 
                    endHour: 23, 
                }}
            />

            <DialogPopup
                open={dialogOpen}
                title={dialogTitle}
                message={dialogMessage}
                handleClose={handleDialogClose}
            />
        </div>
    )
}

export default Calendar;
