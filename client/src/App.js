// App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import AddVolunteerForm from "./AddVolunteerForm";
import VolunteerRequests from "./VolunteerRequests";

const App = () => {
    const [volunteerData, setVolunteerData] = useState([]);
    const [currentSection, setCurrentSection] = useState("");

    useEffect(() => {
        fetchVolunteerData();
    }, []);

    const fetchVolunteerData = async () => {
        try {
            const response = await fetch("/vols", {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch volunteer data");
            }

            const data = await response.json();
            setVolunteerData(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const openAddVolunteerForm = () => {
        setCurrentSection("addVolunteer");
    };

    const loadVolunteerRequests = () => {
        setCurrentSection("volunteerRequests");
    };

    const handleApprove = async (volunteerId) => {
        try {
            const approveResponse = await fetch(
                "/approveVolunteer",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ id: volunteerId }),
                }
            );

            if (!approveResponse.ok) {
                throw new Error("Failed to approve volunteer");
            }

            await fetchVolunteerData();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleRemoveFromRequests = async (volunteerId) => {
        try {
            const response = await fetch(
                "/removeFromRequests",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ id: volunteerId }),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to remove 
                                 volunteer from requests`);
            }

            await fetchVolunteerData();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="App">
            <div className="navbar">
                <h1>Volunteer Management System</h1>
            </div>

            <div className="hero-section">
                <div className="buttons">
                    <button onClick={openAddVolunteerForm}>
                        Add Volunteer
                    </button>
                    <button onClick={loadVolunteerRequests}>
                        Volunteer Requests
                    </button>
                </div>

                <div className="data-display">
                    {currentSection === "addVolunteer" && (
                        <AddVolunteerForm
                            fetchVolunteerData={fetchVolunteerData}
                        />
                    )}
                    {currentSection === "volunteerRequests" && (
                        <VolunteerRequests
                            volunteerData={volunteerData}
                            setVolunteerData={setVolunteerData}
                            handleApprove={handleApprove}
                            handleRemoveFromRequests=
                                    {handleRemoveFromRequests}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
