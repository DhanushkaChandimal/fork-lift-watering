import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

const AddForkliftModal = ({ show, onHide, generatedId, onConfirm }) => {
	const [inputId, setInputId] = useState('');
	const [error, setError] = useState('');

	const handleClose = () => {
		setInputId('');
		setError('');
		onHide();
	};

	const handleConfirm = () => {
		const typedId = parseInt(inputId.trim());
		
		if (!inputId.trim() || isNaN(typedId)) {
			setError('Please enter the forklift number to confirm');
			return;
		}

		if (typedId !== generatedId) {
			setError(`Please type the exact forklift number shown (${generatedId}) to confirm`);
			return;
		}

		onConfirm(generatedId);
		setInputId('');
		setError('');
	};

	return (
		<Modal show={show} onHide={handleClose} centered className="modal-sams">
			<Modal.Header closeButton>
				<Modal.Title>Add New Forklift</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="alert alert-info mb-3">
					<strong>Next Forklift Number: {generatedId}</strong>
				</div>
				
				{error && (
					<Alert variant="danger" dismissible onClose={() => setError('')}>
						{error}
					</Alert>
				)}
				
				<Form>
					<Form.Group>
						<Form.Label>Type the forklift number to confirm:</Form.Label>
						<Form.Control
							type="number"
							value={inputId}
							onChange={(e) => setInputId(e.target.value)}
							placeholder={`Type ${generatedId} to confirm`}
							autoFocus
						/>
						<Form.Text className="text-muted">
							Please type the forklift number shown above to confirm adding it
						</Form.Text>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Cancel
				</Button>
				<Button variant="success" onClick={handleConfirm}>
					Add Forklift
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AddForkliftModal;
