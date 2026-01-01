import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const ServiceStatusModal = ({ show, onHide, forklift, onConfirm }) => {
	const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);

	const handleClose = () => {
		setServiceDate(new Date().toISOString().split('T')[0]);
		onHide();
	};

	const handleConfirm = () => {
		const action = forklift?.isOutOfService ? 'in' : 'out';
		onConfirm(action, serviceDate);
		setServiceDate(new Date().toISOString().split('T')[0]);
	};

	return (
		<Modal show={show} onHide={handleClose} centered className="modal-sams">
			<Modal.Header closeButton>
				<Modal.Title>Change Service Status - Forklift #{forklift?.id}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>
					{forklift?.isOutOfService 
						? 'Are you sure you want to return this forklift to service?'
						: 'Are you sure you want to mark this forklift as out of service?'
					}
				</p>
				
				<Form.Group className="mb-3">
					<Form.Label><strong>
						{forklift?.isOutOfService ? 'Return to Service Date' : 'Out of Service Date'}
					</strong></Form.Label>
					<Form.Control
						type="date"
						value={serviceDate}
						onChange={(e) => setServiceDate(e.target.value)}
						min={forklift?.isOutOfService && forklift?.outOfServiceStartDate 
							? new Date(forklift.outOfServiceStartDate).toISOString().split('T')[0]
							: undefined}
						max={new Date().toISOString().split('T')[0]}
					/>
					<Form.Text className="text-muted">
						{forklift?.isOutOfService 
							? 'Select a date on or after the out-of-service date'
							: 'You can only select today or past dates'}
					</Form.Text>
				</Form.Group>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Cancel
				</Button>
				<Button variant="primary" onClick={handleConfirm}>
					Confirm
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ServiceStatusModal;
