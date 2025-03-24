// MODAL WINDOW
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeModalBtn = document.querySelector(".close-modal");
const modalButton = document.querySelector(".new-appointment");

// Function to open modal and set dynamic content
const openModal = () => {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

// Attach event listeners to each modal button
modalButton.addEventListener("click", openModal);

// Function to close modal
const closeModal = () => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

closeModalBtn.addEventListener("click", closeModal);

// Function to switch between tabs
function switchTab(selectedTab, tabId) {
  // Remove active class from all tabs
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Add active class to selected tab
  selectedTab.classList.add('active');
  
  // Hide all appointment sections
  const sections = document.querySelectorAll('.appointments-section');
  sections.forEach(section => {
    section.classList.add('hidden');
  });
  
  // Show the selected section
  const selectedSection = document.getElementById(tabId);
  if (selectedSection) {
    selectedSection.classList.remove('hidden');
  }
}

// Initialize the page to show the upcoming appointments tab by default
document.addEventListener('DOMContentLoaded', function() {
  // Get the first tab (Upcoming) and make it active
  const defaultTab = document.querySelector('.tab');
  if (defaultTab) {
    defaultTab.classList.add('active');
  }
  
  // Make sure upcoming section is visible
  const upcomingSection = document.getElementById('upcoming');
  if (upcomingSection) {
    upcomingSection.classList.remove('hidden');
  }
  
  // Add click event listeners to all tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
      // Get the tab id from the tab's text content
      let tabId;
      if (this.textContent.trim().toLowerCase().includes('upcoming')) {
        tabId = 'upcoming';
      } else if (this.textContent.trim().toLowerCase().includes('past')) {
        tabId = 'past';
      } else if (this.textContent.trim().toLowerCase().includes('cancelled')) {
        tabId = 'cancelled';
      }
      
      if (tabId) {
        switchTab(this, tabId);
      }
    });
  });
});
// Option 1: Add this to your pat_appointment.js file
document.addEventListener('DOMContentLoaded', function() {
  // Format all dates in appointment cards
  const appointmentDates = document.querySelectorAll('.appointment-date');
  
  appointmentDates.forEach(element => {
    const dateTimeString = element.textContent.trim();
    // Split by the bullet point to get just the date part
    const datePart = dateTimeString.split('•')[0].trim();
    const timePart = dateTimeString.split('•')[1]?.trim() || '';
    
    // Format the date
    const formattedDate = formatDate(datePart);
    
    // Replace the content with formatted date and original time
    element.textContent = timePart ? `${formattedDate} • ${timePart}` : formattedDate;
  });
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    
    // Array of month names with full spelling
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Array of day names
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Get day, month, and year
    const dayOfWeek = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    // Format as "Thu, March 13 2025"
    return `${dayOfWeek}, ${month} ${day} ${year}`;
  }
});