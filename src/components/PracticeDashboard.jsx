import { useState } from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import '../styles/App.css';
import { isAdmin } from '../lib/adminConfig';
import { sortByUrgency } from '../utils/forkliftUtils';
import WaterBatteryModal from './modals/WaterBatteryModal';
import ServiceStatusModal from './modals/ServiceStatusModal';
import AddForkliftModal from './modals/AddForkliftModal';
import ForkliftTable from './tables/ForkliftTable';

// Sample data covering all scenarios
const getInitialSampleData = () => [
	{
		id: 1,
		docId: 'sample-1',
		lastWateringDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago (Urgent - Red)
		lastWateredBy: 'User 1',
		isOutOfService: false,
		outOfServiceStartDate: null,
		outOfServiceEndDate: null,
	},
	{
		id: 2,
		docId: 'sample-2',
		lastWateringDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago (Warning - Yellow)
		lastWateredBy: 'User 2',
		isOutOfService: false,
		outOfServiceStartDate: null,
		outOfServiceEndDate: null,
	},
	{
		id: 3,
		docId: 'sample-3',
		lastWateringDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago (Good - Green)
		lastWateredBy: 'User 1',
		isOutOfService: false,
		outOfServiceStartDate: null,
		outOfServiceEndDate: null,
	},
	{
		id: 4,
		docId: 'sample-4',
		lastWateringDate: new Date().toISOString(), // Today (Good - Green)
		lastWateredBy: 'User 3',
		isOutOfService: false,
		outOfServiceStartDate: null,
		outOfServiceEndDate: null,
	},
	{
		id: 5,
		docId: 'sample-5',
		lastWateringDate: null, // Never watered (Urgent - Red)
		lastWateredBy: null,
		isOutOfService: false,
		outOfServiceStartDate: null,
		outOfServiceEndDate: null,
	},
	{
		id: 6,
		docId: 'sample-6',
		lastWateringDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
		lastWateredBy: 'User 2',
		isOutOfService: true,
		outOfServiceStartDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Out for 3 days
		outOfServiceEndDate: null,
	},
	{
		id: 7,
		docId: 'sample-7',
		lastWateringDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
		lastWateredBy: 'User 1',
		isOutOfService: true,
		outOfServiceStartDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Out for 10 days
		outOfServiceEndDate: null,
	},
	{
		id: 8,
		docId: 'sample-8',
		lastWateringDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago (Urgent - Red)
		lastWateredBy: 'User 3',
		isOutOfService: false,
		outOfServiceStartDate: null,
		outOfServiceEndDate: null,
	},
	{
		id: 9,
		docId: 'sample-9',
		lastWateringDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), // 11 days ago (Warning - Yellow)
		lastWateredBy: 'User 2',
		isOutOfService: false,
		outOfServiceStartDate: null,
		outOfServiceEndDate: null,
	},
	{
		id: 10,
		docId: 'sample-10',
		lastWateringDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (Good - Green)
		lastWateredBy: 'User 1',
		isOutOfService: false,
		outOfServiceStartDate: null,
		outOfServiceEndDate: null,
	},
	{
		id: 11,
		docId: 'sample-11',
		lastWateringDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday (Good - Green)
		lastWateredBy: 'User 3',
		isOutOfService: false,
		outOfServiceStartDate: null,
		outOfServiceEndDate: null,
	},
];

const PracticeDashboard = ({ user }) => {
	const [forklifts, setForklifts] = useState(getInitialSampleData());
	const [selectedForklift, setSelectedForklift] = useState(null);
	const [showServiceModal, setShowServiceModal] = useState(false);
	const [showWaterModal, setShowWaterModal] = useState(false);
	const [showAddForkliftModal, setShowAddForkliftModal] = useState(false);
	const [generatedForkliftId, setGeneratedForkliftId] = useState(null);

	const activeForklifts = forklifts
		.filter(f => !f.isOutOfService)
		.sort(sortByUrgency);
	
	const outOfServiceForklifts = forklifts
		.filter(f => f.isOutOfService)
		.sort((a, b) => a.id - b.id);

	const handleWaterBattery = (forklift) => {
		setSelectedForklift(forklift);
		setShowWaterModal(true);
	};

	const confirmWaterBattery = (wateringDate) => {
		const loggedInUserName = user?.displayName || user?.email || 'Unknown User';
		const selectedDate = new Date(wateringDate + 'T' + new Date().toTimeString().split(' ')[0]);

		setForklifts(prevForklifts =>
			prevForklifts.map(f =>
				f.id === selectedForklift.id
					? {
						...f,
						lastWateringDate: selectedDate.toISOString(),
						lastWateredBy: loggedInUserName,
					}
					: f
			)
		);

		setShowWaterModal(false);
		setSelectedForklift(null);
	};

	const handleServiceStatusToggle = (forklift) => {
		setSelectedForklift(forklift);
		setShowServiceModal(true);
	};

	const confirmServiceStatusChange = (action, serviceDate) => {
		const selectedDate = new Date(serviceDate + 'T' + new Date().toTimeString().split(' ')[0]);

		if (action === 'out') {
			setForklifts(prevForklifts =>
				prevForklifts.map(f =>
					f.id === selectedForklift.id
						? {
							...f,
							isOutOfService: true,
							outOfServiceStartDate: selectedDate.toISOString(),
							outOfServiceEndDate: null,
						}
						: f
				)
			);
		} else {
			// Returning to service
			setForklifts(prevForklifts =>
				prevForklifts.map(f => {
					if (f.id === selectedForklift.id) {
						const updates = {
							...f,
							isOutOfService: false,
							outOfServiceStartDate: null,
							outOfServiceEndDate: null,
						};

						if (f.lastWateringDate && f.outOfServiceStartDate) {
							const lastWatering = new Date(f.lastWateringDate);
							const outStart = new Date(f.outOfServiceStartDate);

							if (lastWatering >= outStart && lastWatering <= selectedDate) {
								updates.lastWateringDate = selectedDate.toISOString();
							} else if (lastWatering < outStart) {
								const outOfServiceDays = Math.floor((selectedDate - outStart) / (1000 * 60 * 60 * 24));
								const adjustedDate = new Date(lastWatering.getTime() + (outOfServiceDays * 24 * 60 * 60 * 1000));
								updates.lastWateringDate = adjustedDate.toISOString();
							}
						}

						return updates;
					}
					return f;
				})
			);
		}

		setShowServiceModal(false);
		setSelectedForklift(null);
	};

	const handleAddForklift = () => {
		const maxId = forklifts.length > 0 ? Math.max(...forklifts.map(f => f.id)) : 0;
		const nextId = maxId + 1;
		setGeneratedForkliftId(nextId);
		setShowAddForkliftModal(true);
	};

	const confirmAddForklift = (forkliftId) => {
		const newForklift = {
			id: forkliftId,
			docId: `sample-${forkliftId}`,
			lastWateringDate: null,
			lastWateredBy: null,
			isOutOfService: false,
			outOfServiceStartDate: null,
			outOfServiceEndDate: null,
		};

		setForklifts(prevForklifts => [...prevForklifts, newForklift]);
		setShowAddForkliftModal(false);
		setGeneratedForkliftId(null);
	};

	const handleReset = () => {
		window.location.reload();
	};

	return (
		<Container fluid className="dashboard-container pt-4">
			<Alert variant="info" className="mb-4">
				<div className="d-flex justify-content-between align-items-center">
					<div>
						<strong>🎯 Practice Mode</strong> - This is a demo environment with sample data. 
						Practice using the app without affecting the real database. Changes are temporary and reset when you refresh.
					</div>
					<Link to="/" className="btn btn-sm btn-outline-primary">
						← Back to Main
					</Link>
				</div>
			</Alert>

			<div className="dashboard-header text-center">
				<h1 className="dashboard-title">⚡ Forklift Battery Management (Practice)</h1>
				<p className="dashboard-subtitle">Batteries should be watered at least once every 2 weeks</p>
				<Button 
					variant="outline-secondary" 
					size="sm" 
					onClick={handleReset}
					className="mt-2"
				>
					🔄 Reset Practice Data
				</Button>
			</div>

			<div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
				<div className="d-flex align-items-center">
					<Badge className="badge-sams-danger me-2">Urgent</Badge>
					<span>14+ days</span>
				</div>
				<div className="d-flex align-items-center">
					<Badge className="badge-sams-warning me-2">Warning</Badge>
					<span>10-13 days</span>
				</div>
				<div className="d-flex align-items-center">
					<Badge className="badge-sams-success me-2">Good</Badge>
					<span>&lt;10 days</span>
				</div>
			</div>

			<div className="dashboard-card">
				<div className="d-flex justify-content-between align-items-center mb-3">
					<h2 className="dashboard-section-title">
						Active Forklifts ({activeForklifts.length})
					</h2>
					{isAdmin(user) && (
						<Button className="btn-sams-primary" onClick={handleAddForklift}>
							+ Add Forklift
						</Button>
					)}
				</div>
				
				<ForkliftTable
					forklifts={activeForklifts}
					type="active"
					onWater={handleWaterBattery}
					onServiceToggle={handleServiceStatusToggle}
					error={null}
					isAdmin={isAdmin(user)}
				/>
			</div>

			{outOfServiceForklifts.length > 0 && (
				<div className="dashboard-card">
					<h2 className="dashboard-section-title-with-margin">
						Out of Service Forklifts ({outOfServiceForklifts.length})
					</h2>
					
					<ForkliftTable
						forklifts={outOfServiceForklifts}
						type="out-of-service"
						onServiceToggle={handleServiceStatusToggle}
					/>
				</div>
			)}

			<WaterBatteryModal
				show={showWaterModal}
				onHide={() => {
					setShowWaterModal(false);
					setSelectedForklift(null);
				}}
				forklift={selectedForklift}
				user={user}
				onConfirm={confirmWaterBattery}
			/>

			<ServiceStatusModal
				show={showServiceModal}
				onHide={() => {
					setShowServiceModal(false);
					setSelectedForklift(null);
				}}
				forklift={selectedForklift}
				onConfirm={confirmServiceStatusChange}
			/>

			<AddForkliftModal
				show={showAddForkliftModal}
				onHide={() => {
					setShowAddForkliftModal(false);
					setGeneratedForkliftId(null);
				}}
				generatedId={generatedForkliftId}
				onConfirm={confirmAddForklift}
			/>
		</Container>
	);
};

export default PracticeDashboard;
