document.addEventListener('DOMContentLoaded', function() {
    // Desk data
    const desks = {
        individual: Array(10).fill().map((_, i) => ({
            id: `ind-${i+1}`,
            type: 'individual',
            booked: false
        })),
        team: Array(5).fill().map((_, i) => ({
            id: `team-${i+1}`,
            type: 'team',
            booked: false
        }))
    };

    // Pricing
    const pricing = {
        basic: 10,
        premium: 15,
        executive: 20,
        team: 25
    };

    // DOM elements
    const membershipSelect = document.getElementById('membership-tier');
    const hoursInput = document.getElementById('hours');
    const individualDesksContainer = document.getElementById('individual-desks');
    const teamDesksContainer = document.getElementById('team-desks');
    const bookingSummary = document.getElementById('booking-summary');
    const summaryDetails = document.getElementById('summary-details');
    const confirmBookingBtn = document.getElementById('confirm-booking');
    const cancelBookingBtn = document.getElementById('cancel-booking');

    // Current booking state
    let currentBooking = {
        desk: null,
        hours: 1,
        membership: 'basic',
        price: 0
    };

    // Initialize the desks display
    function renderDesks() {
        individualDesksContainer.innerHTML = '';
        teamDesksContainer.innerHTML = '';

        desks.individual.forEach(desk => {
            const deskElement = createDeskElement(desk);
            individualDesksContainer.appendChild(deskElement);
        });

        desks.team.forEach(desk => {
            const deskElement = createDeskElement(desk);
            teamDesksContainer.appendChild(deskElement);
        });
    }

    // Create a desk element
    function createDeskElement(desk) {
        const deskElement = document.createElement('div');
        deskElement.className = `desk ${desk.booked ? 'booked' : ''}`;
        deskElement.textContent = `${desk.type === 'individual' ? 'Individual' : 'Team'} Desk ${desk.id.split('-')[1]}`;
        
        if (!desk.booked) {
            deskElement.addEventListener('click', () => selectDesk(desk));
        }
        
        return deskElement;
    }

    // Handle desk selection
    function selectDesk(desk) {
        currentBooking.desk = desk;
        currentBooking.hours = parseInt(hoursInput.value) || 1;
        currentBooking.membership = membershipSelect.value;
        
        // Calculate price
        let pricePerHour;
        if (desk.type === 'team') {
            pricePerHour = pricing.team;
        } else {
            pricePerHour = pricing[currentBooking.membership];
        }
        
        let total = pricePerHour * currentBooking.hours;
        
        // Apply discount for bookings > 3 hours
        if (currentBooking.hours > 3) {
            total *= 0.9; // 10% discount
            currentBooking.price = total;
            summaryDetails.innerHTML = `
                <p>Desk: ${desk.type === 'individual' ? 'Individual' : 'Team'} Desk ${desk.id.split('-')[1]}</p>
                <p>Membership: ${currentBooking.membership.charAt(0).toUpperCase() + currentBooking.membership.slice(1)}</p>
                <p>Hours: ${currentBooking.hours}</p>
                <p>Price: $${pricePerHour}/hr</p>
                <p>Discount: 10% (for booking more than 3 hours)</p>
                <p><strong>Total: $${total.toFixed(2)}</strong></p>
            `;
        } else {
            currentBooking.price = total;
            summaryDetails.innerHTML = `
                <p>Desk: ${desk.type === 'individual' ? 'Individual' : 'Team'} Desk ${desk.id.split('-')[1]}</p>
                <p>Membership: ${currentBooking.membership.charAt(0).toUpperCase() + currentBooking.membership.slice(1)}</p>
                <p>Hours: ${currentBooking.hours}</p>
                <p>Price: $${pricePerHour}/hr</p>
                <p><strong>Total: $${total.toFixed(2)}</strong></p>
            `;
        }
        
        bookingSummary.style.display = 'block';
    }

    // Handle booking confirmation
    function confirmBooking() {
        if (!currentBooking.desk) return;
        
        // Find the desk in our data
        const deskCollection = currentBooking.desk.type === 'individual' ? desks.individual : desks.team;
        const deskIndex = deskCollection.findIndex(d => d.id === currentBooking.desk.id);
        
        if (deskIndex !== -1 && !deskCollection[deskIndex].booked) {
            deskCollection[deskIndex].booked = true;
            renderDesks();
            
            alert(`Booking confirmed!\nDesk: ${currentBooking.desk.id}\nTotal: $${currentBooking.price.toFixed(2)}`);
            bookingSummary.style.display = 'none';
            currentBooking = {
                desk: null,
                hours: 1,
                membership: 'basic',
                price: 0
            };
            
            // Reset form
            hoursInput.value = '1';
            membershipSelect.value = 'basic';
        }
    }

    // Handle booking cancellation
    function cancelBooking() {
        bookingSummary.style.display = 'none';
        currentBooking.desk = null;
    }

    // Event listeners
    confirmBookingBtn.addEventListener('click', confirmBooking);
    cancelBookingBtn.addEventListener('click', cancelBooking);

    // Initial render
    renderDesks();
});