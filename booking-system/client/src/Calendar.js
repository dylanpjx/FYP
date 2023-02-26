import { React, useState, useContext } from 'react';
import { parseISO } from 'date-fns';
import axios from 'axios';
import { Scheduler } from '@aldabil/react-scheduler';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

import { AuthContext } from './AuthProvider';
import DialogPopup from './DialogPopup';

const GROUP_COLORS = ["#FF5733", "#17A2B8", "#FFC107", "#28A745", "#6C757D", "#6F42C1", "#20C997", "#E83E8C", "#007BFF", "#DC3545", "#FD7E14", "#6610F2", "#155724", "#D62020", "#1E90FF", "#FFC300"]

const BACKEND_URL = 'http://localhost:5000'

const Calendar = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [dialogTitle, setDialogTitle] = useState("");

    let navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleDialogClose = () => {
        setDialogTitle("");
        setDialogMessage("");
        setDialogOpen(false);
    }

    const fetchRemote = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/calendar`);
            const events = res.data;

            const parsedEvents = events.map(event => {
                return {
                    ...event,
                    start: parseISO(event.start),
                    end: parseISO(event.end)
                }
            })

            return parsedEvents;
        } catch (err) {
            console.log('Error:', err);
        }
    }

    const handleConfirm = async (event, action) => {
        try {
            let url;
            let method;
            let event_color;

            const userGroup = user.group;
            const userRole = user.role;

            if (action === "edit") {
                url = `${BACKEND_URL}/calendar/${event.event_id}`;
                method = "PUT";

                event = {
                    ...event,
                    group_id: userGroup,
                    role: userRole
                };
            } else if (action === "create") {
                url = `${BACKEND_URL}/calendar`;
                method = "POST";
                event_color = GROUP_COLORS[userGroup - 1];

                event = {
                    ...event,
                    group_id: userGroup,
                    color: event_color
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
            const res = await axios.delete(`${BACKEND_URL}/calendar/${deletedId}`);
            return res.data;
        } catch (err) {
            console.error("Error:", err)
        }
    }

    // TODO: Fix conflict resolution
    const handleDrag = async (droppedOn, updatedEvent, originalEvent) => {
        console.log(updatedEvent);
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

            <Scheduler
                getRemoteEvents={fetchRemote}
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
                        default: "Group " + user.group,
                        config: { disabled: true }
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
