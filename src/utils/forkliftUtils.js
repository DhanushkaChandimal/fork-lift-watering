// Utility functions for forklift date calculations

export const getDaysSinceWatering = (forklift) => {
	if (!forklift.lastWateringDate) return Infinity;
	
	const lastWatering = new Date(forklift.lastWateringDate);
	const today = new Date();
	
	// If forklift is currently out of service, time is frozen
	// Calculate days from last watering to when it went out of service
	if (forklift.isOutOfService && forklift.outOfServiceStartDate) {
		const outStart = new Date(forklift.outOfServiceStartDate);
		const diffTime = Math.abs(outStart - lastWatering);
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}
	
	// For active forklifts (or returned), calculate normally
	// Out-of-service dates are cleared on return, and lastWateringDate is already adjusted
	const diffTime = Math.abs(today - lastWatering);
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
};

export const getStatusText = (forklift) => {
	const days = getDaysSinceWatering(forklift);
	
	if (days === Infinity) return 'Needs Watering';
	if (days === 0) return 'Watered Today';
	if (days === 1) return 'Watered Yesterday';
	return `${days} days ago`;
};

export const getBadgeVariant = (forklift) => {
	const days = getDaysSinceWatering(forklift);
	
	if (days === Infinity || days >= 14) {
		return 'danger';
	} else if (days >= 10) {
		return 'warning';
	}
	return 'success';
};

export const getRowVariant = (forklift) => {
	const days = getDaysSinceWatering(forklift);
	
	if (days === Infinity || days >= 14) {
		return 'table-danger';
	} else if (days >= 10) {
		return 'table-warning';
	}
	return 'table-success';
};

export const formatDate = (dateString) => {
	if (!dateString) return 'N/A';
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const sortByUrgency = (a, b) => {
	const daysA = getDaysSinceWatering(a);
	const daysB = getDaysSinceWatering(b);
	
	// Primary sort: by urgency (days since watering, highest first)
	if (daysB !== daysA) {
		return daysB - daysA;
	}
	
	// Secondary sort: by ID (lowest first) when urgency is the same
	return a.id - b.id;
};
