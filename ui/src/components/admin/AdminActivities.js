import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table, Button, Modal, Form } from 'react-bootstrap';
import AdminNavbar from './AdminNavbar';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

function ActivityDetail() {
    const { categoryId } = useParams();
    const [activities, setActivities] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [activityTitle, setActivityTitle] = useState('');
    const [activityDescription, setActivityDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [newActivityId, setNewActivityId] = useState(null);
    const [showSecondModal, setShowSecondModal] = useState(false);

    const handleTitleChange = (value) => {
        setActivityTitle(value);
    }

    const handleDescriptionChange = (value) => {
        setActivityDescription(value);
    }

    const handleDateChange = (date) => {
        setStartDate(date);
    }

    const handleUserSelection = (user) => {
        setSelectedUsers((prevUsers) => {
            const isUserSelected = prevUsers.some(u => u.UserId === user.UserId);

            if (isUserSelected) {
                return prevUsers.filter(u => u.UserId !== user.UserId);
            } else {
                return [...prevUsers, user];
            }
        });
    };


    const handleSaveActivity = async () => {
        const userId = localStorage.getItem('userId');
        const currentDate = new Date();
        const formattedDate = format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        const formattedDate2 = currentDate.toISOString();

    
        const activityData = {
            createdByUserId: userId,
            activityTitle: activityTitle,
            activityDescription: activityDescription,
            categoryId: categoryId,
            activityCompletionDate: formattedDate,
            activityDate: formattedDate2,
        };
    
        const activityUrl = 'http://localhost:5259/api/Activity/AddActivity'; // API endpoint for Activity
        try {
            const activityResponse = await axios.post(activityUrl, activityData);
                alert(activityResponse.data);
                const addedActivityId = activityResponse.data.ActivityId;
                console.log('Added Activity ID:', addedActivityId);
                setNewActivityId(addedActivityId);

                setShow(false);
                setShowSecondModal(true);
                getAllActivities();
            
        } catch (error) {
            console.error('Error adding activity:', error);
            setErrorMessage('Error adding activity.');
        }
        
        
    }

    console.log('New Activity ID:', newActivityId);
    

    const handleSaveParticipants = async () => {
        try {
            for (const user of selectedUsers) {
                const participantData = {
                    userId: user.UserId,
                    activityId: newActivityId,
                    confirmationStatus: "1",
                };
    
                const participantsUrl = 'http://localhost:5259/api/Participants/AddParticipant';
    
                const result = await axios.post(participantsUrl, participantData);
                alert(result.data);
            }
    
            setShowSecondModal(false);
        } catch (error) {
            console.error('Error adding participants:', error);
        }
    };
    
    

    const getAllActivities = async () => {
        const url = 'http://localhost:5259/api/Activity/GetAllActivities'; 
        try {
            const response = await axios.get(url);
            setActivities(response.data);
        } catch (error) {
            console.error('Error fetching all activities:', error);
        }
    }

    useEffect(() => {
        getAllActivities(); // Fetch all activities when the component mounts
    }, []);

    useEffect(() => {
        const fetchAvailableUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5259/api/User/GetUsers');
                setAvailableUsers(response.data);
            } catch (error) {
                console.error('Error fetching available users:', error);
            }
        };
    
        fetchAvailableUsers();
    }, []);
    
    useEffect(() => {
        const getData = async () => {
            const url = `http://localhost:5259/api/Activity/GetActivityById/${categoryId}`;
            try {
                const response = await axios.get(url);
                const currentDate = new Date();
                const pastActivities = response.data.filter(activity => new Date(activity.ActivityCompletionDate) > currentDate);   
                  setActivities(pastActivities);
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage('Data could not be fetched.');
            }
        };
    
        getData();
    }, [categoryId]);


    

    return (
        <>
            <AdminNavbar />
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1>Activities</h1>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map(activity => (
                                    <tr key={activity.ActivityId}>
                                        <td>{activity.ActivityTitle}</td>
                                        <td>{activity.ActivityDescription}</td>
                                        <td>{activity.ActivityCompletionDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
            <div className="container">
                <div>
                    <Button variant="primary" onClick={() => setShow(true)}>
                        Add new activity
                    </Button>

                    <Modal show={show} onHide={() => setShow(false)} style={{ zIndex: "1060" }}>
                        <Modal.Header closeButton>
                            <Modal.Title>New Activity</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Title"
                                        autoFocus
                                        value={activityTitle}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                    />
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Description"
                                        value={activityDescription}
                                        onChange={(e) => handleDescriptionChange(e.target.value)}
                                    />
                                    <Form.Label>Date</Form.Label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={handleDateChange}
                                        showTimeSelect
                                        timeIntervals={15}
                                        dateFormat="Pp"
                                        timeFormat="HH:mm" // Set the time format to 24-hour
                                    />                           
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShow(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSaveActivity }>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={showSecondModal} onHide={() => setShowSecondModal(false)} style={{ zIndex: "1060" }}>
                            <Form.Group className="mb-3">
                            <Form.Label>Users Attending</Form.Label>
                            {availableUsers.map(user => (
                                <Form.Check
                                    key={user.UserId}
                                    type="checkbox"
                                    label={user.UserName}
                                    checked={selectedUsers.some(u => u.UserId === user.UserId)}
                                    onChange={() => handleUserSelection(user)}
                                 />
                                ))}
                            </Form.Group>
                            <Button variant="primary" onClick={handleSaveParticipants}>
                             Save Participants
                            </Button>
                         </Modal>
                </div>
            </div>
        </>
    );
}

export default ActivityDetail;


