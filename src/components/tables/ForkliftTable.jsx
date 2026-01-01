import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { getStatusText, getBadgeVariant, getRowVariant, formatDate } from '../../utils/forkliftUtils';

const ForkliftTable = ({ 
	forklifts, 
	type = 'active', 
	onWater, 
	onServiceToggle,
	error,
	isAdmin 
}) => {
	if (type === 'active') {
		return (
			<Table striped bordered hover responsive size="sm" className="dashboard-table">
				<thead className="table-header-blue">
					<tr>
						<th>FORKLIFT #</th>
						<th>STATUS</th>
						<th className="d-none d-md-table-cell">LAST WATERED</th>
						<th className="d-none d-md-table-cell">WATERED BY</th>
						<th>ACTIONS</th>
					</tr>
				</thead>
				<tbody>
					{forklifts.length === 0 && !error ? (
						<tr>
							<td colSpan="5" className="text-center py-4 text-muted">
								{isAdmin 
									? 'No active forklifts found. Click "+ Add Forklift" to add one.'
									: 'No active forklifts found. Contact an administrator to add forklifts.'
								}
							</td>
						</tr>
					) : forklifts.length > 0 ? (
						forklifts.map(forklift => (
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
											onClick={() => onWater(forklift)}
										>
											Water
										</Button>
										<Button 
											variant="secondary"
											size="sm"
											className="action-btn"
											onClick={() => onServiceToggle(forklift)}
										>
											Out of Service
										</Button>
									</div>
								</td>
							</tr>
						))
					) : null}
				</tbody>
			</Table>
		);
	}

	// Out of service table
	return (
		<Table striped bordered hover responsive className="dashboard-table">
			<thead className="table-header-blue">
				<tr>
					<th>FORKLIFT #</th>
					<th>OUT OF SERVICE SINCE</th>
					<th>ACTIONS</th>
				</tr>
			</thead>
			<tbody>
				{forklifts.map(forklift => (
					<tr key={forklift.id}>
						<td className="fw-bold">Forklift #{forklift.id}</td>
						<td>{formatDate(forklift.outOfServiceStartDate)}</td>
						<td>
							<Button 
								variant="success"
								size="sm"
								onClick={() => onServiceToggle(forklift)}
							>
								Return to Service
							</Button>
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};

export default ForkliftTable;
