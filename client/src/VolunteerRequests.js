//VolunteerRequests.js

import React, { useEffect } from "react";

const VolunteerRequests = ({ volunteerData, setVolunteerData }) => {
    const handleApprove = async (volunteerId) => {
        try {
            const response = await fetch(
                "/approveVolunteer",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: volunteerId }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to approve volunteer");
            }

            const updatedVolunteerData = await response.json();
            setVolunteerData(updatedVolunteerData);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchVolunteerData();
    }, [volunteerData]);

    const fetchVolunteerData = async () => {
        try {
            const response = await fetch("/vols");
            if (!response.ok) {
                throw new Error("Failed to fetch volunteer data");
            }
            const data = await response.json();
            setVolunteerData(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <h2>Volunteer Requests</h2>
            <ul>
                {Array.isArray(volunteerData) && volunteerData.length > 0 ? (
                    volunteerData.map((volunteer) => (
                        <li key={volunteer.id}>
                            {volunteer.name} - {volunteer.event} -{" "}
                            {volunteer.date} - Status: {volunteer.status}
                            {volunteer.status === "request" && (
                                <button
                                    onClick={
                                        ()=>handleApprove(volunteer.id)
                                     }
                                >
                                    Approve
                                </button>
                            )}
                        </li>
                    ))
                ) : (
                    <p>No volunteer requests available.</p>
                )}
            </ul>
        </div>
    );
};

export default VolunteerRequests;
