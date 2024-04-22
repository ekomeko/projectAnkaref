import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table } from 'react-bootstrap';
import UserNavbar from './UserNavbar';

function ActivitiyDetail() {
    const { categoryId } = useParams();
    const [Activity, setActivities] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const getData = async () => {
            const url = `http://localhost:5259/api/Activity/GetActivityById/${categoryId}`;
            try {
                const response = await axios.get(url);
                // Filter activities where ActivityCompletionDate is greater than the current date
                const currentDate = new Date();
                const filteredActivities = response.data.filter(activity => new Date(activity.ActivityCompletionDate) > currentDate);
                setActivities(filteredActivities);
            } catch (error) {
                console.error('Hata:', error);
                setErrorMessage('Veri alınamadı.');
            }
        };

        getData();
    }, [categoryId]);

    return (
        <>
        <UserNavbar />
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
                            {Activity.map(Activity => (
                                <tr key={Activity.ActivityId}>
                                    <td>{Activity.ActivityTitle}</td>
                                    <td>{Activity.ActivityDescription}</td>
                                    <td>{Activity.ActivityCompletionDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
        </>
    );
}

export default ActivitiyDetail;
