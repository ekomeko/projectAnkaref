import UserNavbar from "./UserNavbar";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Modal } from 'react-bootstrap';

function UserOldActivities() {
    const [activities, setActivities] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const activitiesUrl = 'http://localhost:5259/api/Activity/GetAllActivities';
            const participantsUrl = 'http://localhost:5259/api/Participants/GetParticipants';
        
            try {
                // Fetch activities data
                const activitiesResponse = await axios.get(activitiesUrl);
                const currentDate = new Date();;
                const pastActivities = activitiesResponse.data.filter(activity => new Date(activity.ActivityCompletionDate) < currentDate);
        
                // Fetch user's participation data
                const participantsResponse = await axios.get(participantsUrl, {
                    params: { userId: localStorage.getItem('userId') }
                });
        
                // Create a map to store ConfirmationStatus by ActivityId
                const confirmationStatusMap = new Map();
                participantsResponse.data.forEach(participant => {
                    confirmationStatusMap.set(participant.ActivityId, participant.ConfirmationStatus);
                });
        
                // Set the activities with ConfirmationStatus
                const activitiesWithStatus = pastActivities.map(activity => ({
                    ...activity,
                    ConfirmationStatus: confirmationStatusMap.get(activity.ActivityId) || 0, 
                }));
        
                setActivities(activitiesWithStatus);
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage('Data could not be fetched.');
            }
        };
        

        fetchData();
    }, []);

    const handleCheckboxChange = async (event, ActivityId) => {
        const UserId = localStorage.getItem('userId');
        const isChecked = event.target.checked;
        console.log(UserId);
        try {
 
            setActivities(prevActivities =>
                prevActivities.map(activity => {
                  if (activity.ActivityId === ActivityId) {
                    return { ...activity, ConfirmationStatus: isChecked ? 1 : 0 };
                  }
                  return activity;
                })
              );
              
    

            await axios.post('http://localhost:5259/api/Participants/AddParticipant', {
                ActivityId,
                UserId,
                ConfirmationStatus: isChecked ? 1 : 0,
            });
    
            console.log(`ConfirmationStatus for Activity ${ActivityId} and User ${UserId} is set to ${isChecked ? 1 : 0}`);
        } catch (error) {
            console.error('Error:', error);
            // Handle error, e.g., show an error message
        }
    };
    
    return (
        <>
            <UserNavbar />
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1>Past Activities</h1>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Check</th>
                                </tr>
                            </thead>
                            <tbody>
    {activities
        .filter(activity => activity.ConfirmationStatus !== 1) // Filter out activities with ConfirmationStatus 1
        .map(activity => (
            <tr key={activity.ActivityId}>
                <td>{activity.ActivityTitle}</td>
                <td>{activity.ActivityDescription}</td>
                <td>{activity.ActivityCompletionDate}</td>
                <td>
                    <input
                        type="checkbox"
                        onChange={(e) => handleCheckboxChange(e, activity.ActivityId)}
                        checked={activity.ConfirmationStatus === 1}
                    />
                </td>
            </tr>
        ))
    }
</tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserOldActivities;
