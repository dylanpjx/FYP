import { React, useEffect, useState, useContext, useRef } from 'react';
import { parseISO } from 'date-fns';
import axios from 'axios';
import { Scheduler, useScheduler } from '@aldabil/react-scheduler';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  DialogActions,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

import { AuthContext } from './AuthProvider';
import DialogPopup from './DialogPopup';

const GROUP_COLORS = ["#FF5733", "#17A2B8", "#FFC107", "#28A745", "#6C757D", 
"#6F42C1", "#20C997", "#E83E8C", "#007BFF", "#DC3545", "#FD7E14", "#6610F2", 
"#155724", "#D62020", "#1E90FF", "#FFC300"]

const BACKEND_URL = 'http://localhost:5000'

const Calendar = () => {
  const { setEvents } = useScheduler();
  const [viewMode, setViewMode] = useState("EE2026");
  const stateRef = useRef();
  stateRef.current = viewMode;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");

  const handleChange = (event, newModule) => {
    if (newModule !== null) {
      setViewMode(newModule);
    }
  }

  let navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleDialogClose = () => {
    setDialogTitle("");
    setDialogMessage("");
    setDialogOpen(false);
  }

  useEffect(() => {
    const fetchRemote = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/calendar/${viewMode}`);
        const events = res.data;

        const parsedEvents = events.map(event => {
          return {
            ...event,
            start: parseISO(event.start),
            end: parseISO(event.end)
          }
        })

        setEvents(parsedEvents);
      } catch (err) {
        console.log('Error:', err);
      }
    }

    fetchRemote();
  }, [viewMode]);


  const handleConfirm = async (event, action) => {
    try {
      let url;
      let method;
      let event_color;

      const userGroup = user.group;
      const userRole = user.role;
      const module = stateRef.current;

      if (action === "edit") {
        url = `${BACKEND_URL}/calendar/${event.event_id}`;
        method = "PUT";

        event = {
          ...event,
          group_id: userGroup,
          role: userRole,
          module: module
        };
      } else if (action === "create") {
        url = `${BACKEND_URL}/calendar`;
        method = "POST";
        event_color = GROUP_COLORS[userGroup - 1];

        event = {
          ...event,
          group_id: userGroup,
          color: event_color,
          module: module
        };
      } else {
        return;
      }

      const res = await axios({
        method,
        url,
        headers: { "Content-Type": "application/json" },
        data: event
      });

      return {
        ...res.data,
        start: parseISO(res.data.start),
        end: parseISO(res.data.end)
      };
    } catch (err) {
      console.error(err.response.data);
      setDialogTitle("Unable to create/edit event");
      setDialogMessage(err.response.data);
      setDialogOpen(true);

      if (action === "create")
        return {...event, start: null, end: null};
    }
  }

  const handleDelete = async (deletedId) => {
    try {
      const userGroup = user.group;
      const userRole = user.role;
      const res = await axios.delete(`${BACKEND_URL}/calendar/${deletedId}`, 
        {
          data: {
            group_id: userGroup,
            role: userRole
          }
        });
      return res.data;
    } catch (err) {
      console.error("Error:", err)
      setDialogTitle("Unable to delete event");
      setDialogMessage(err.response.data);
      setDialogOpen(true);
    }
  }

  const handleDrag = async (droppedOn, updatedEvent, originalEvent) => {
    try {
      const userGroup = user.group;
      const userRole = user.role;
      const res = await axios.put(`${BACKEND_URL}/calendar/${updatedEvent.event_id}`,
        {
          ...updatedEvent,
          group_id: userGroup,
          role: userRole

        });
      return updatedEvent;

    } catch(err) {
      console.error("Error:", err);
      setDialogTitle("Unable to edit event");
      setDialogMessage(err.response.data);
      setDialogOpen(true);
      return originalEvent;
    }
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => navigate("/home")}
        startIcon={ <ArrowLeftIcon /> }
      >
        Back
      </Button>

      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          justifyContent: 'center'
        }}
      >

        <ToggleButtonGroup 
          color="primary"
          variant="contained" 
          value={viewMode}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value="EE2026" >
            EE2026
          </ToggleButton>
          <ToggleButton value="EE2028" >
            EE2028
          </ToggleButton>
          <ToggleButton value="EE4218" >
            EE4218
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Scheduler
        onConfirm={handleConfirm}
        onDelete={handleDelete}
        onEventDrop={handleDrag}
        week = {{
          startHour: 9,
          endHour: 24,
        }}
        day = {{
          startHour: 9,
          endHour: 24,
        }}
        fields={[
          {
            name: "title",
            type: "input",
            default: `Group ${user.group}`,
            config: { 
              disabled: true,
              variant: "filled"
            }
          }
        ]}
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
