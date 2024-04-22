import React from "react";
import AdminNavbar from "./AdminNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './adminAtp.css';

function AdminOldActivities() {
    return (
        <div className="wrapper">
            <AdminNavbar />
            <div className="container">
                <div className="mt-5">
                    <h1>About This Project</h1>
                    <h3>Project-2</h3>
                    <p>Thanks to this project, I have become a more efficient coder.</p>
                    <p>I developed this project utilizing a technology stack that includes ASP.NET Web API, React, SQL, and Azure.</p>
                    <p>In total, I dedicated 100 hours to this project.</p>
                </div>
            </div>
            <footer>
                <p>Author: Ekin</p>
                <p>And thanks to zeynep who never leave me alone when i am building this project</p>
            </footer>
        </div>
    );
}

export default AdminOldActivities;
