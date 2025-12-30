import { useState } from "react";

const ForkliftDashboard = () => {
    const [forklifts, setForklifts] = useState(() => {
    const now = new Date();
    
    return [
        {
            id: 1,
            number: 1,
            lastWateringDate: new Date(now - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago - URGENT
            lastWateredBy: 'Dhanushka',
            isOutOfService: false,
            outOfServiceStartDate: null,
            outOfServiceEndDate: null,
        },
        {
            id: 2,
            number: 2,
            lastWateringDate: new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago - URGENT
            lastWateredBy: 'Dee',
            isOutOfService: false,
            outOfServiceStartDate: null,
            outOfServiceEndDate: null,
        },
        {
            id: 3,
            number: 3,
            lastWateringDate: new Date(now - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago - WARNING
            lastWateredBy: 'D',
            isOutOfService: false,
            outOfServiceStartDate: null,
            outOfServiceEndDate: null,
        },
        {
            id: 4,
            number: 4,
            lastWateringDate: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago - WARNING
            lastWateredBy: 'Chandimal',
            isOutOfService: false,
            outOfServiceStartDate: null,
            outOfServiceEndDate: null,
        },
        {
            id: 5,
            number: 5,
            lastWateringDate: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago - GOOD
            lastWateredBy: 'DC',
            isOutOfService: false,
            outOfServiceStartDate: null,
            outOfServiceEndDate: null,
        },
        {
            id: 6,
            number: 6,
            lastWateringDate: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago - GOOD
            lastWateredBy: 'Scott',
            isOutOfService: false,
            outOfServiceStartDate: null,
            outOfServiceEndDate: null,
        },
        {
            id: 7,
            number: 7,
            lastWateringDate: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday - GOOD
            lastWateredBy: 'John',
            isOutOfService: false,
            outOfServiceStartDate: null,
            outOfServiceEndDate: null,
        },
        {
            id: 8,
            number: 8,
            lastWateringDate: now.toISOString(), // Today - GOOD
            lastWateredBy: 'Paul',
            isOutOfService: false,
            outOfServiceStartDate: null,
            outOfServiceEndDate: null,
        },
        {
            id: 9,
            number: 9,
            lastWateringDate: null, // Never watered - URGENT
            lastWateredBy: null,
            isOutOfService: false,
            outOfServiceStartDate: null,
            outOfServiceEndDate: null,
        },
        {
            id: 10,
            number: 10,
            lastWateringDate: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago before service
            lastWateredBy: 'User 1',
            isOutOfService: true, // Currently out of service
            outOfServiceStartDate: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(), // Out since 3 days ago
            outOfServiceEndDate: null,
        },
        {
            id: 11,
            number: 11,
            lastWateringDate: new Date(now - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
            lastWateredBy: 'User 2',
            isOutOfService: false, // Returned to service
            outOfServiceStartDate: new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString(), // Was out 15 days ago
            outOfServiceEndDate: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(), // Returned 8 days ago (7 days out = adjusted to 13 days)
        },
        ];
    });

    return (
        <h1>Forklift Battery Watering Dashboard</h1>
    );
};

export default ForkliftDashboard;
