import { React, useState } from 'react';
import { parseISO } from 'date-fns';
import axios from 'axios';
import { Scheduler } from '@aldabil/react-scheduler';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

import DialogPopup from './DialogPopup'

const GROUP_COLORS = ["#FF5733", "#17A2B8", "#FFC107", "#28A745", "#6C757D", "#6F42C1", "#20C997", "#E83E8C", "#007BFF", "#DC3545", "#FD7E14", "#6610F2", "#155724", "#D62020", "#1E90FF", "#FFC300"]

const BACKEND_URL = 'http://localhost:5000'

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
            const res = await axios.get(`${BACKEND_URL}/calendar_data`);
            const events = res.data;
            console.log("Events", events);

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

            const userGroup = localStorage.getItem("userGroup")
            const userRole = localStorage.getItem("userRole")

            if (action === "edit") {
                // Check if user has edit permissions
                if (userGroup === event.grp_id ||
                    userRole === "admin") {
                    url = `${BACKEND_URL}/calendar_data/${event.event_id}`;
                    method = "PUT";
                } else {
                    setDialogOpen()
                    setDialogTitle("You do not have the relevant permissions")
                    setDialogMessage("Not from the correct group/Not an admin")
                    return null;
                }
            } else if (action === "create") {
                url = `${BACKEND_URL}/calendar_data/`;
                method = "POST";
                event_color = GROUP_COLORS[userGroup]
            } else {
                return null;
            }

            if (event_color) {
                event = {
                    ...event,
                    color: { event_color }
                }
            }
            let body = JSON.stringify(event);
            const res = await axios({
                method,
                url,
                headers: { "Content-Type": "application/json" },
                data: body
            });

            return res.data;
        } catch (err) {
            console.error("Error:", err);
        }
    }

    const handleDelete = async (deletedId) => {
        try {
            const res = await axios.delete(`${BACKEND_URL}/calendar_data/${deletedId}`);
            return res.data;
        } catch (err) {
            console.error("Error:", err)
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
