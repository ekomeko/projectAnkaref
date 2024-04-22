import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Modal } from 'react-bootstrap';
import AdminNavbar from "./AdminNavbar";
import { format, parseISO } from 'date-fns';

function AdminOldActivities() {
    const [activities, setActivities] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [Participantss, setParticipants] = useState([]); // State to store Participantss
    const [UserName, setUserName] = useState({}); // State to store UserName

    useEffect(() => {
        const getData = async () => {
            const url = 'http://localhost:5259/api/Activity/GetAllActivities';
            try {
                const response = await axios.get(url);
                const currentDate = new Date();
                const pastActivities = response.data.filter(activity => new Date(activity.ActivityCompletionDate) < currentDate);   
                  setActivities(pastActivities);
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage('Data could not be fetched.');
            }
        };
                

        getData();
    }, []);

    // Function to open the modal and fetch Participantss
    const openModal = async (ActivityId) => {
        try {
            const response = await axios.get(`http://localhost:5259/api/Participants/GetParticipants?ActivityId=${ActivityId}`);
            // Filter Participantss with ConfirmationStatus equal to 1
            const filteredParticipants = response.data.filter(Participants => Participants.ConfirmationStatus === 1);
            setParticipants(filteredParticipants);
            setShowModal(true);

            // Fetch UserName based on UserIds
            const UserIds = filteredParticipants.map(Participants => Participants.UserId);
            const UserNameResponse = await axios.get(`http://localhost:5259/api/User/GetUsers?UserIds=${UserIds.join(',')}`);
            const UsernameMap = {};
            UserNameResponse.data.forEach(User => {
                UsernameMap[User.UserId] = User.UserName;
            });
            setUserName(UsernameMap);
        } catch (error) {
            console.error('Error fetching Participantss:', error);
            setErrorMessage('Participants could not be fetched.');
        }
    };

    // Function to close the modal
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <AdminNavbar />
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
                                    <th>Users</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map(activity => (
                                    <tr key={activity.ActivityId}>
                                        <td>{activity.ActivityTitle}</td>
                                        <td>{activity.ActivityDescription}</td>
                                        <td>{activity.ActivityCompletionDate}</td>
                                        <td>
                                            <Button variant="primary" onClick={() => openModal(activity.ActivityId)}>Users</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Users with Confirmation Status 1</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>User Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Participantss.map(Participants => (
                                <tr key={Participants.UserId}>
                                    <td>{UserName[Participants.UserId]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AdminOldActivities;
