import { useState } from "react";
import '../styles/ForkliftDashboard.css';

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

	const getDaysSinceWatering = (forklift) => {
		if (!forklift.lastWateringDate) return Infinity;
		
		const lastWatering = new Date(forklift.lastWateringDate);
		const today = new Date();
    
		const diffTime = Math.abs(today - lastWatering);
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
  	};

	const getStatusText = (forklift) => {
		const days = getDaysSinceWatering(forklift);
		
		if (days === Infinity) return 'Needs Watering';
		if (days === 0) return 'Watered Today';
		if (days === 1) return 'Watered Yesterday';
		return `${days} days ago`;
	};

	const getColorClass = (forklift) => {
		const days = getDaysSinceWatering(forklift);
		let status = 'good';
		
		if (days === Infinity || days >= 14) {
			status =  'urgent';
		}else if (days >= 10){
			status = 'warning';
		}

		// console.log(forklift.number + "  -  " + status + "  -  " + days)

		return `status-${status}`;
	};

	const formatDate = (dateString) => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	const handleServiceStatusToOut = (forklift) => {
		setForklifts(prev => prev.map(f => 
		f.id === forklift.id 
			? {
				...f,
				isOutOfService: true,
				outOfServiceStartDate: new Date().toISOString(),
				outOfServiceEndDate: null,
			}
			: f
		));
	};

	const handleServiceStatusToIn = (forklift) => {
		setForklifts(prev => prev.map(f => 
		f.id === forklift.id 
			? {
				...f,
				isOutOfService: false,
				outOfServiceEndDate: new Date().toISOString(),
			}
			: f
		));
	};

	return (
		<div className="forklift-dashboard">
			<header className="dashboard-header">
				<h1>Forklift Battery Watering Dashboard</h1>
				<p className="subtitle">Batteries should be watered at least once every 2 weeks</p>
			</header>

			<div className="legend">
				<div className="legend-item">
					<span className="legend-color status-urgent"></span>
					<span>Urgent (14+ days)</span>
				</div>
				<div className="legend-item">
					<span className="legend-color status-warning"></span>
					<span>Warning (10-13 days)</span>
				</div>
				<div className="legend-item">
					<span className="legend-color status-good"></span>
					<span>Good (&lt;10 days)</span>
				</div>
			</div>

			<section className="table-section">
				<h2>Active Forklifts</h2>
				<div className="table-container">
					<table className="forklift-table">
						<thead>
							<tr>
								<th>FORKLIFT #</th>
								<th>STATUS</th>
								<th>LAST WATERED</th>
								<th>WATERED BY</th>
								<th>ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							{forklifts.filter(f => !f.isOutOfService).map(forklift => (
								<tr key={forklift.id} className={getColorClass(forklift)}>
									<td className="forklift-number">Forklift #{forklift.number}</td>
									<td>
										<span className="status-badge">{getStatusText(forklift)}</span>
									</td>
									<td>{formatDate(forklift.lastWateringDate)}</td>
									<td>{forklift.lastWateredBy || 'N/A'}</td>
									<td className="actions-cell">
										<button 
											className="btn btn-primary"
										>
											Water Battery
										</button>
										<button 
											className="btn btn-secondary"
											onClick={() => handleServiceStatusToOut(forklift)}
										>
											Mark Out of Service
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section className="table-section">
				<h2>Out of Service Forklifts</h2>
				<div className="table-container">
					<table className="forklift-table">
						<thead>
							<tr>
								<th>FORKLIFT #</th>
								<th>OUT OF SERVICE SINCE</th>
								<th>ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							{forklifts.filter(f => f.isOutOfService).map(forklift => (
								<tr key={forklift.id}>
									<td className="forklift-number">Forklift #{forklift.number}</td>
									<td>{formatDate(forklift.outOfServiceStartDate)}</td>
									<td className="actions-cell">
										<button 
											className="btn btn-success"
											onClick={() => handleServiceStatusToIn(forklift)}
										>
											Return to Service
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
};

export default ForkliftDashboard;
