// Doctor Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Menu item selection
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items
            menuItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // If this was a real app, we would load the corresponding page content here
            const menuText = this.querySelector('.menu-text').textContent;
            document.querySelector('.page-title').textContent = menuText;
        });
    });

    // Notification handling
    const notifications = document.querySelector('.notifications');
    notifications.addEventListener('click', function() {
        alert('You have 3 new notifications');
        // In a real app, this would show a dropdown with notification details
    });

// Appointment actions
const actionButtons = document.querySelectorAll('.action-buttons button');

actionButtons.forEach(button => {
    button.addEventListener('click', function () {
        const action = this.textContent;
        const row = this.closest('tr');
        const patient = row.cells[0].textContent;
        const time = row.cells[1].textContent;
        const actionsCell = row.cells[4]; // Actions column

        if (action === 'Start') {
            alert(`Starting appointment with ${patient} at ${time}`);
            // In a real app, this would navigate to the appointment page
        } else if (action === 'Cancel') {
            if (confirm(`Are you sure you want to cancel the appointment with ${patient}?`)) {
                row.cells[2].innerHTML = '<span class="status status-cancelled">Cancelled</span>';
                
                // Replace action buttons with reschedule button
                actionsCell.innerHTML = '<button class="btn btn-outline">Reschedule</button>';
            }
        } else if (action === 'Confirm') {
            row.cells[2].innerHTML = '<span class="status status-confirmed">Confirmed</span>';
            
            // Remove all buttons and replace with just "Confirmed"
            actionsCell.textContent = 'Confirmed';
        } else if (action === 'Reschedule') {
            alert(`Reschedule appointment with ${patient}`);
            // In a real app, this would open a calendar modal
        } else if (action === 'View') {
            alert(`Viewing details for ${patient}'s appointment`);
            // In a real app, this would open a modal or navigate to details page
        }
    });
});


    // Calendar functionality
    const calendarDates = document.querySelectorAll('.calendar-date');
    calendarDates.forEach(date => {
        date.addEventListener('click', function() {
            // Remove current class from all dates
            calendarDates.forEach(d => d.classList.remove('current'));
            // Add current class to clicked date
            this.classList.add('current');
            
            // If this date has events, show them
            if (this.classList.contains('has-event')) {
                alert(`Appointments for March ${this.textContent}, 2025`);
                // In a real app, this would show the day's appointments
            }
        });
    });

    // Calendar navigation
    const calendarNav = document.querySelectorAll('.calendar-nav span');
    calendarNav.forEach(nav => {
        nav.addEventListener('click', function() {
            const action = this.textContent;
            if (action === '◀') {
                alert('Previous month');
                // In a real app, this would load the previous month
            } else if (action === '▶') {
                alert('Next month');
                // In a real app, this would load the next month
            } else if (action === 'Today') {
                // Find today's date and highlight it
                calendarDates.forEach(d => {
                    if (d.textContent === '11') { // Hardcoded for demo
                        d.click();
                    }
                });
            }
        });
    });

    // Patient info click handling
    const patientInfos = document.querySelectorAll('.patient-info');
    patientInfos.forEach(info => {
        info.addEventListener('click', function() {
            const patientName = this.querySelector('.patient-name').textContent;
            alert(`Opening medical record for ${patientName}`);
            // In a real app, this would navigate to the patient's record
        });
    });

    // Section actions (View All links)
    const sectionActions = document.querySelectorAll('.section-action');
    sectionActions.forEach(action => {
        action.addEventListener('click', function() {
            const sectionTitle = this.closest('.section-header').querySelector('.section-title').textContent;
            alert(`Viewing all ${sectionTitle}`);
            // In a real app, this would load the full list view
        });
    });

    // Search functionality (assuming there would be a search input)
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search patients, appointments...';
    searchInput.style.padding = '8px 12px';
    searchInput.style.borderRadius = '4px';
    searchInput.style.border = '1px solid var(--gray-300)';
    searchInput.style.marginRight = '20px';
    
    // Insert search box before notifications
    document.querySelector('.user-profile').insertBefore(searchInput, document.querySelector('.notifications'));
    
    // Add search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        // Search in appointments
        const appointmentRows = document.querySelectorAll('tbody tr');
        appointmentRows.forEach(row => {
            const patientName = row.cells[0].textContent.toLowerCase();
            const details = row.cells[3].textContent.toLowerCase();
            
            if (patientName.includes(searchTerm) || details.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        
        // Search in patients
        const patientInfos = document.querySelectorAll('.patient-info');
        patientInfos.forEach(info => {
            const name = info.querySelector('.patient-name').textContent.toLowerCase();
            const details = info.querySelector('.patient-details').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || details.includes(searchTerm)) {
                info.style.display = '';
            } else {
                info.style.display = 'none';
            }
        });
    });

    // Data refresh simulation (for demo purposes)
    setInterval(function() {
        // Randomly update one of the stat cards to simulate real-time data
        const statCards = document.querySelectorAll('.stat-info h3');
        const randomIndex = Math.floor(Math.random() * statCards.length);
        const card = statCards[randomIndex];
        
        if (card.textContent.includes('$')) {
            // If it's the revenue card, update with a random amount
            const newAmount = '$' + (Math.floor(Math.random() * 5) + 7) + '.' + Math.floor(Math.random() * 10) + 'k';
            card.textContent = newAmount;
        } else {
            // For other cards, slightly increase or decrease the number
            let currentValue = parseInt(card.textContent);
            const change = Math.random() > 0.7 ? 1 : 0; // 30% chance of change
            currentValue = Math.max(1, currentValue + (Math.random() > 0.5 ? change : -change));
            card.textContent = currentValue;
        }
    }, 30000); // Every 30 seconds
});

document.addEventListener("DOMContentLoaded", function () {
    const confirmButton = document.getElementById("confirm-btn");
    const janeStatus = document.getElementById("jane-status");
    const janeActions = document.getElementById("jane-actions");

    confirmButton.addEventListener("click", function () {
        // Change status to Confirmed
        janeStatus.textContent = "Confirmed";
        janeStatus.classList.remove("status-pending");
        janeStatus.classList.add("status-confirmed");

        // Update Actions column to just "Confirmed"
        janeActions.textContent = "Confirmed";
    });
});

