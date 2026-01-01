import { useState } from "react";
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import '../styles/ForkliftDashboard.css';

const ForkliftDashboard = () => {
	const [forklifts, setForklifts] = useState(() => {
		const now = new Date();
		
		return [
			{
				id: 1,
				lastWateringDate: new Date(now - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago - URGENT
				lastWateredBy: 'Dhanushka',
				isOutOfService: false,
				outOfServiceStartDate: null,
				outOfServiceEndDate: null,
			},
			{
				id: 2,
				lastWateringDate: new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago - URGENT
				lastWateredBy: 'Dee',
				isOutOfService: false,
				outOfServiceStartDate: null,
				outOfServiceEndDate: null,
			},
			{
				id: 3,
				lastWateringDate: new Date(now - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago - WARNING
				lastWateredBy: 'D',
				isOutOfService: false,
				outOfServiceStartDate: null,
				outOfServiceEndDate: null,
			},
			{
				id: 4,
				lastWateringDate: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago - WARNING
				lastWateredBy: 'Chandimal',
				isOutOfService: false,
				outOfServiceStartDate: null,
				outOfServiceEndDate: null,
			},
			{
				id: 5,
				lastWateringDate: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago - GOOD
				lastWateredBy: 'DC',
				isOutOfService: false,
				outOfServiceStartDate: null,
				outOfServiceEndDate: null,
			},
			{
				id: 6,
				lastWateringDate: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago - GOOD
				lastWateredBy: 'Scott',
				isOutOfService: false,
				outOfServiceStartDate: null,
				outOfServiceEndDate: null,
			},
			{
				id: 7,
				lastWateringDate: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday - GOOD
				lastWateredBy: 'John',
				isOutOfService: false,
				outOfServiceStartDate: null,
				outOfServiceEndDate: null,
			},
			{
				id: 8,
				lastWateringDate: now.toISOString(), // Today - GOOD
				lastWateredBy: 'Paul',
				isOutOfService: false,
				outOfServiceStartDate: null,
				outOfServiceEndDate: null,
			},
			{
				id: 9,
				lastWateringDate: null, // Never watered - URGENT
				lastWateredBy: null,
				isOutOfService: false,
				outOfServiceStartDate: null,
				outOfServiceEndDate: null,
			},
			{
				id: 10,
				lastWateringDate: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago before service
				lastWateredBy: 'User 1',
				isOutOfService: true, // Currently out of service
				outOfServiceStartDate: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(), // Out since 3 days ago
				outOfServiceEndDate: null,
			},
			{
				id: 11,
				lastWateringDate: new Date(now - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
				lastWateredBy: 'User 2',
				isOutOfService: false, // Returned to service
				outOfServiceStartDate: new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString(), // Was out 15 days ago
				outOfServiceEndDate: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(), // Returned 8 days ago (7 days out = adjusted to 13 days)
			},
        ];
    });
	const [selectedForklift, setSelectedForklift] = useState(null);
	const [showServiceModal, setShowServiceModal] = useState(false);
	const [showWaterModal, setShowWaterModal] = useState(false);
	const [showAddForkliftModal, setShowAddForkliftModal] = useState(false);
	const [userName, setUserName] = useState('');
	const [newForkliftId, setNewForkliftId] = useState('');

	const getDaysSinceWatering = (forklift) => {
		if (!forklift.lastWateringDate) return Infinity;
		
		const lastWatering = new Date(forklift.lastWateringDate);
		const today = new Date();
		
		let effectiveLastWatering = lastWatering;
		
		if (forklift.outOfServiceStartDate && forklift.outOfServiceEndDate) {
			const outStart = new Date(forklift.outOfServiceStartDate);
			const outEnd = new Date(forklift.outOfServiceEndDate);
			const outOfServiceDays = Math.floor((outEnd - outStart) / (1000 * 60 * 60 * 24));
			
			effectiveLastWatering = new Date(lastWatering.getTime() + (outOfServiceDays * 24 * 60 * 60 * 1000));
		}
    
		const diffTime = Math.abs(today - effectiveLastWatering);
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

	const getBadgeVariant = (forklift) => {
		const days = getDaysSinceWatering(forklift);
		
		if (days === Infinity || days >= 14) {
			return 'danger';
		} else if (days >= 10) {
			return 'warning';
		}
		return 'success';
	};

	const getRowVariant = (forklift) => {
		const days = getDaysSinceWatering(forklift);
		
		if (days === Infinity || days >= 14) {
			return 'table-danger';
		} else if (days >= 10) {
			return 'table-warning';
		}
		return 'table-success';
	};

	const formatDate = (dateString) => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	const confirmServiceStatusChange = (action) => {
		setForklifts(prev => prev.map(f => 
		f.id === selectedForklift.id 
			? action === 'out'
			? {
				...f,
				isOutOfService: true,
				outOfServiceStartDate: new Date().toISOString(),
				outOfServiceEndDate: null,
				}
			: {
				...f,
				isOutOfService: false,
				outOfServiceEndDate: new Date().toISOString(),
				}
			: f
		));

		setShowServiceModal(false);
		setSelectedForklift(null);
	};

	const handleWaterBattery = (forklift) => {
		setSelectedForklift(forklift);
		setShowWaterModal(true);
	};

	const confirmWaterBattery = () => {
		if (!userName.trim()) {
			alert('Please enter your name');
			return;
		}

		setForklifts(prev => prev.map(f => 
		f.id === selectedForklift.id 
			? {
				...f,
				lastWateringDate: new Date().toISOString(),
				lastWateredBy: userName,
			}
			: f
		));

		setShowWaterModal(false);
		setUserName('');
		setSelectedForklift(null);
	};

	const sortByUrgency = (a, b) => {
		const daysA = getDaysSinceWatering(a);
		const daysB = getDaysSinceWatering(b);
		return daysB - daysA;
	};

	const activeForklifts = forklifts
		.filter(f => !f.isOutOfService)
		.sort(sortByUrgency);
	
	const outOfServiceForklifts = forklifts
		.filter(f => f.isOutOfService);
	
	const handleServiceStatusToggle = (forklift) => {
		setSelectedForklift(forklift);
		setShowServiceModal(true);
	};

	const handleAddForklift = () => {
		setShowAddForkliftModal(true);
	};

	const confirmAddForklift = () => {
		const id = parseInt(newForkliftId.trim());
		
		if (!id || isNaN(id)) {
			alert('Please enter a valid forklift number');
			return;
		}

		if (forklifts.some(f => f.id === id)) {
			alert('Forklift with this number already exists');
			return;
		}

		const newForklift = {
			id: id,
			lastWateringDate: null,
			lastWateredBy: null,
			isOutOfService: false,
			outOfServiceStartDate: null,
			outOfServiceEndDate: null,
		};

		setForklifts(prev => [...prev, newForklift]);
		setShowAddForkliftModal(false);
		setNewForkliftId('');
	};

	return (
		<Container fluid className="py-4">
			<div className="text-center mb-4">
				<h1 className="display-4 mb-3">Forklift Battery Watering Dashboard</h1>
				<p className="lead text-muted">Batteries should be watered at least once every 2 weeks</p>
			</div>

			<div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
				<div className="d-flex align-items-center">
					<Badge bg="danger" className="me-2">Urgent</Badge>
					<span>14+ days</span>
				</div>
				<div className="d-flex align-items-center">
					<Badge bg="warning" text="dark" className="me-2">Warning</Badge>
					<span>10-13 days</span>
				</div>
				<div className="d-flex align-items-center">
					<Badge bg="success" className="me-2">Good</Badge>
					<span>&lt;10 days</span>
				</div>
			</div>

			<div className="mb-4">
				<div className="d-flex justify-content-between align-items-center mb-3">
					<h2 className="h3 mb-0">Active Forklifts ({activeForklifts.length})</h2>
					<Button variant="success" onClick={handleAddForklift}>
						+ Add Forklift
					</Button>
				</div>
				<Table striped bordered hover responsive size="sm">
					<thead className="table-dark">
						<tr>
							<th>FORKLIFT #</th>
							<th>STATUS</th>
							<th>LAST WATERED</th>
							<th>WATERED BY</th>
							<th>ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{activeForklifts.map(forklift => (
							<tr key={forklift.id} className={getRowVariant(forklift)}>
								<td className="fw-bold">Forklift #{forklift.id}</td>
								<td>
									<Badge bg={getBadgeVariant(forklift)}>{getStatusText(forklift)}</Badge>
								</td>
								<td>{formatDate(forklift.lastWateringDate)}</td>
								<td>{forklift.lastWateredBy || 'N/A'}</td>
								<td>
									<div className="d-flex flex-column gap-1">
										<Button 
											variant="primary"
											size="sm"
											className="action-btn"
											onClick={() => handleWaterBattery(forklift)}
										>
											Water
										</Button>
										<Button 
											variant="secondary"
											size="sm"
											className="action-btn"
											onClick={() => handleServiceStatusToggle(forklift)}
										>
											Out of Service
										</Button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>

			{outOfServiceForklifts.length > 0 && (
				<div className="mb-4">
					<h2 className="h3 mb-3">Out of Service Forklifts ({outOfServiceForklifts.length})</h2>
					<Table striped bordered hover responsive>
						<thead className="table-dark">
							<tr>
								<th>FORKLIFT #</th>
								<th>OUT OF SERVICE SINCE</th>
								<th>ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							{outOfServiceForklifts.map(forklift => (
								<tr key={forklift.id}>
									<td className="fw-bold">Forklift #{forklift.id}</td>
									<td>{formatDate(forklift.outOfServiceStartDate)}</td>
									<td>
										<Button 
											variant="success"
											size="sm"
											onClick={() => handleServiceStatusToggle(forklift)}
										>
											Return to Service
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
			)}

			<Modal show={showServiceModal} onHide={() => setShowServiceModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Change Service Status - Forklift #{selectedForklift?.id}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						{selectedForklift?.isOutOfService 
						? 'Are you sure you want to return this forklift to service?'
						: 'Are you sure you want to mark this forklift as out of service?'
						}
					</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowServiceModal(false)}>
						Cancel
					</Button>
					<Button 
						variant="primary" 
						onClick={() => confirmServiceStatusChange(selectedForklift?.isOutOfService ? 'in' : 'out')}
					>
						Confirm
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={showWaterModal} onHide={() => setShowWaterModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Water Battery - Forklift #{selectedForklift?.id}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group>
							<Form.Label>Your Name:</Form.Label>
							<Form.Control
								type="text"
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
								placeholder="Enter your name"
								autoFocus
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => {
						setShowWaterModal(false);
						setUserName('');
					}}>
						Cancel
					</Button>
					<Button variant="primary" onClick={confirmWaterBattery}>
						Confirm
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={showAddForkliftModal} onHide={() => setShowAddForkliftModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Add New Forklift</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group>
							<Form.Label>Forklift Number:</Form.Label>
							<Form.Control
								type="number"
								value={newForkliftId}
								onChange={(e) => setNewForkliftId(e.target.value)}
								placeholder="Enter forklift number"
								autoFocus
							/>
							<Form.Text className="text-muted">
								Enter a unique number for the new forklift
							</Form.Text>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => {
						setShowAddForkliftModal(false);
						setNewForkliftId('');
					}}>
						Cancel
					</Button>
					<Button variant="success" onClick={confirmAddForklift}>
						Add Forklift
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
};

export default ForkliftDashboard;
