// Utility functions for forklift date calculations

export const getDaysSinceWatering = (forklift) => {
	if (!forklift.lastWateringDate) return Infinity;
	
	const lastWatering = new Date(forklift.lastWateringDate);
	const today = new Date();
	
	let effectiveLastWatering = lastWatering;
	
	// If forklift was out of service and returned, only add the out-of-service period
	// if the watering happened BEFORE going out of service
	if (forklift.outOfServiceStartDate && forklift.outOfServiceEndDate) {
		const outStart = new Date(forklift.outOfServiceStartDate);
		const outEnd = new Date(forklift.outOfServiceEndDate);
		
		// Only adjust if the watering date is before the out-of-service start date
		if (lastWatering < outStart) {
			const outOfServiceDays = Math.floor((outEnd - outStart) / (1000 * 60 * 60 * 24));
			effectiveLastWatering = new Date(lastWatering.getTime() + (outOfServiceDays * 24 * 60 * 60 * 1000));
		}
		// If watered after returning to service, use the actual watering date (no adjustment)
	}

	const diffTime = Math.abs(today - effectiveLastWatering);
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
	return daysB - daysA;
};
