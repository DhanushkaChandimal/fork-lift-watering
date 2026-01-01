import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const WaterBatteryModal = ({ show, onHide, forklift, user, onConfirm }) => {
	const [wateringDate, setWateringDate] = useState(new Date().toISOString().split('T')[0]);

	const handleClose = () => {
		setWateringDate(new Date().toISOString().split('T')[0]);
		onHide();
	};

	const handleConfirm = () => {
		onConfirm(wateringDate);
		setWateringDate(new Date().toISOString().split('T')[0]);
	};

	return (
		<Modal show={show} onHide={handleClose} centered className="modal-sams">
			<Modal.Header closeButton>
				<Modal.Title>Water Battery - Forklift #{forklift?.id}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>Confirm that you have watered the battery for Forklift #{forklift?.id}.</p>
				
				<Form.Group className="mb-3">
					<Form.Label><strong>Watering Date</strong></Form.Label>
					<Form.Control
						type="date"
						value={wateringDate}
						onChange={(e) => setWateringDate(e.target.value)}
						max={new Date().toISOString().split('T')[0]}
					/>
					<Form.Text className="text-muted">
						You can only select today or past dates
					</Form.Text>
				</Form.Group>

				<p className="text-muted">
					<small>This will be recorded as watered by: <strong>{user?.displayName || user?.email}</strong></small>
				</p>
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

export default WaterBatteryModal;
