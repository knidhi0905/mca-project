//AddVolunteerForm.js
import React, { useState } from "react";

const AddVolunteerForm = ({ fetchVolunteerData }) => {
    const [formData, setFormData] = useState({
        name: "",
        event: "",
        date: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
`http://localhost:5000/addVolunteer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to add volunteer");
            }

            await fetchVolunteerData();

            setFormData({
                name: "",
                event: "",
                date: "",
            });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <h2>Add Volunteer</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Event:
                    <input
                        type="text"
                        name="event"
                        value={formData.event}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Date:
                    <input
                        type="text"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AddVolunteerForm;
