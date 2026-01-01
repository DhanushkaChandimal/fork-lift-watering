import { useState } from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import '../styles/App.css';
import { useCreateForklift, useForklifts, useUpdateForklift } from "../hooks/useForklift";
import { isAdmin } from '../lib/adminConfig';
import { sortByUrgency } from '../utils/forkliftUtils';
import WaterBatteryModal from './modals/WaterBatteryModal';
import ServiceStatusModal from './modals/ServiceStatusModal';
import AddForkliftModal from './modals/AddForkliftModal';
import ForkliftTable from './tables/ForkliftTable';

const ForkliftDashboard = ({ user }) => {
	const [selectedForklift, setSelectedForklift] = useState(null);
	const [showServiceModal, setShowServiceModal] = useState(false);
	const [showWaterModal, setShowWaterModal] = useState(false);
	const [showAddForkliftModal, setShowAddForkliftModal] = useState(false);
	const [generatedForkliftId, setGeneratedForkliftId] = useState(null);
	
	const { data: forklifts = [], isLoading, error } = useForklifts();
	const { mutate: createForklift } = useCreateForklift();
	const { mutate: updateForklift } = useUpdateForklift();

	const activeForklifts = forklifts
		.filter(f => !f.isOutOfService)
		.sort(sortByUrgency);
	
	const outOfServiceForklifts = forklifts
		.filter(f => f.isOutOfService);

	const handleWaterBattery = (forklift) => {
		setSelectedForklift(forklift);
		setShowWaterModal(true);
	};

	const confirmWaterBattery = (wateringDate) => {
		const loggedInUserName = user?.displayName || user?.email || 'Unknown User';
		const selectedDate = new Date(wateringDate + 'T' + new Date().toTimeString().split(' ')[0]);

		const updates = {
			lastWateringDate: selectedDate.toISOString(),
			lastWateredBy: loggedInUserName,
		};

		updateForklift(
			{ docId: selectedForklift.docId, updates },
			{
				onSuccess: () => {
					setShowWaterModal(false);
					setSelectedForklift(null);
				}
			}
		);
	};

	const handleServiceStatusToggle = (forklift) => {
		setSelectedForklift(forklift);
		setShowServiceModal(true);
	};

	const confirmServiceStatusChange = (action, serviceDate) => {
		const selectedDate = new Date(serviceDate + 'T' + new Date().toTimeString().split(' ')[0]);

		const updates = action === 'out'
			? {
				isOutOfService: true,
				outOfServiceStartDate: selectedDate.toISOString(),
				outOfServiceEndDate: null,
			}
			: {
				isOutOfService: false,
				outOfServiceEndDate: selectedDate.toISOString(),
			};

		updateForklift(
			{ docId: selectedForklift.docId, updates },
			{
				onSuccess: () => {
					setShowServiceModal(false);
					setSelectedForklift(null);
				}
			}
		);
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
			lastWateringDate: null,
			lastWateredBy: null,
			isOutOfService: false,
			outOfServiceStartDate: null,
			outOfServiceEndDate: null,
		};

		createForklift(newForklift, {
			onSuccess: () => {
				alert('Forklift created successfully!');
				setShowAddForkliftModal(false);
				setGeneratedForkliftId(null);
			},
			onError: (error) => {
				alert(`Failed to add forklift: ${error.message}`);
				setShowAddForkliftModal(false);
				setGeneratedForkliftId(null);
				window.location.reload();
			}
		});
	};

	return (
		<Container fluid className="dashboard-container pt-4">
			{isLoading && (
				<div className="loading-container">
					<div className="spinner-sams"></div>
				</div>
			)}

			{!isLoading && (
				<>
					<div className="dashboard-header text-center">
						<h1 className="dashboard-title">⚡ Forklift Battery Management</h1>
						<p className="dashboard-subtitle">Batteries should be watered at least once every 2 weeks</p>
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
							{!error && isAdmin(user) && (
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
							error={error}
							isAdmin={isAdmin(user)}
						/>
					</div>

					{error && (
						<div className="alert alert-danger text-center" role="alert">
							Error loading forklifts: {error.message}
							<div className="mt-3">
								<Button variant="primary" onClick={() => window.location.reload()}>
									🔄 Refresh Page
								</Button>
							</div>
						</div>
					)}

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
				</>
			)}
		</Container>
	);
};

export default ForkliftDashboard;
