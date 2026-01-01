import { useState } from "react";
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import '../styles/ForkliftDashboard.css';
import { useCreateForklift, useForklifts, useUpdateForklift } from "../hooks/useForklift";

const ForkliftDashboard = () => {
	const [selectedForklift, setSelectedForklift] = useState(null);
	const [showServiceModal, setShowServiceModal] = useState(false);
	const [showWaterModal, setShowWaterModal] = useState(false);
	const [showAddForkliftModal, setShowAddForkliftModal] = useState(false);
	const [userName, setUserName] = useState('');
	const [newForkliftId, setNewForkliftId] = useState('');
	
	const { data: forklifts = [], isLoading, error } = useForklifts();
	const { mutate: createForklift } = useCreateForklift();
	const { mutate: updateForklift } = useUpdateForklift();

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
		const updates = action === 'out'
			? {
				isOutOfService: true,
				outOfServiceStartDate: new Date().toISOString(),
				outOfServiceEndDate: null,
			}
			: {
				isOutOfService: false,
				outOfServiceEndDate: new Date().toISOString(),
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

	const handleWaterBattery = (forklift) => {
		setSelectedForklift(forklift);
		setShowWaterModal(true);
	};

	const confirmWaterBattery = () => {
		if (!userName.trim()) {
			alert('Please enter your name');
			return;
		}

		const updates = {
			lastWateringDate: new Date().toISOString(),
			lastWateredBy: userName,
		};

		updateForklift(
			{ docId: selectedForklift.docId, updates },
			{
				onSuccess: () => {
					setShowWaterModal(false);
					setUserName('');
					setSelectedForklift(null);
				}
			}
		);
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

		console.log("11111111111111")

		createForklift(newForklift, {
			onSuccess: () => {
				console.log("22222222222222")
				alert('Forklift created successfully!');
				setShowAddForkliftModal(false);
				setNewForkliftId('');
			}
		});
	};

	return (
		<Container fluid className="py-4">
			{isLoading && (
				<div className="text-center py-5">
					<div className="spinner-border text-primary" role="status">
						<span className="visually-hidden">Loading...</span>
					</div>
				</div>
			)}

			{!isLoading && (
				<>
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
									<th className="d-none d-md-table-cell">LAST WATERED</th>
									<th className="d-none d-md-table-cell">WATERED BY</th>
									<th>ACTIONS</th>
								</tr>
							</thead>
							<tbody>
								{activeForklifts.length === 0 ? (
									<tr>
										<td colSpan="5" className="text-center py-4 text-muted">
											No active forklifts found. Click "+ Add Forklift" to add one.
										</td>
									</tr>
								) : (
									activeForklifts.map(forklift => (
										<tr key={forklift.id} className={getRowVariant(forklift)}>
											<td className="fw-bold">Forklift #{forklift.id}</td>
											<td>
												<Badge bg={getBadgeVariant(forklift)}>{getStatusText(forklift)}</Badge>
												<div className="d-block d-md-none mobile-watering-info">
													{formatDate(forklift.lastWateringDate)}<br/>
													By: {forklift.lastWateredBy || 'N/A'}
												</div>
											</td>
											<td className="d-none d-md-table-cell">{formatDate(forklift.lastWateringDate)}</td>
											<td className="d-none d-md-table-cell">{forklift.lastWateredBy || 'N/A'}</td>
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
									))
								)}
							</tbody>
						</Table>
					</div>

					{error && (
						<div className="alert alert-danger" role="alert">
							Error loading forklifts: {error.message}
						</div>
					)}

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
				</>
			)}
		</Container>
	);
};

export default ForkliftDashboard;
