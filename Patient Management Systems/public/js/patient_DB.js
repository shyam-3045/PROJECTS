// grid buttons hover effect
document.querySelectorAll(".grid-item button").forEach((button) => {
  button.addEventListener("mouseover", () => {
    button.style.color = "#17a2b8"; // Change color on hover
    button.style.transform = "scale(1.05)"; // Slightly enlarge button
  });

  button.addEventListener("mouseout", () => {
    button.style.color = "black"; // Revert to original color
    button.style.transform = "scale(1)"; // Reset size
  });
});

/*
// MODAL WINDOW
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnsOpenModal = document.querySelectorAll(".grid-item button");

// Function to open the modal and show the overlay
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

// Function to close the modal and hide the overlay
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// Add click event listeners to all specialty buttons to open the modal
for (let i = 0; i < btnsOpenModal.length; i++) {
  btnsOpenModal[i].addEventListener("click", openModal);
}

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
*/

// MODAL WINDOW
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.querySelector(".modal");
  const overlay = document.querySelector(".overlay");
  const closeModalBtn = document.querySelector(".close-modal");
  const modalTitle = document.querySelector(".modal h1");
  const modalText = document.querySelector(".modal p");
  const modalButtons = document.querySelectorAll(".modal-btn");

  // Function to open modal and set dynamic content
  const openModal = (title, text) => {
    modalTitle.textContent = title;
    modalText.textContent = text;
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  };

  // Attach event listeners to each modal button
  modalButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const title = this.getAttribute("data-content-title");
      const text = this.getAttribute("data-content-text");
      openModal(title, text);
    });
  });

  // Function to close modal
  const closeModal = () => {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  };

  closeModalBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
});

// APPOINTMENTS BUTTON REDITRECT
const appointment_btn = document.querySelector(".appointment-btn");

