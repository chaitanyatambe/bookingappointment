// Replace the baseApiUrl with the actual base URL of your API
const baseApiUrl = 'https://crudcrud.com/api/497b8a39f9914bbb95868e864fecd958/BookingAppointmentData';

function submitAppointment() {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;

    // Validate inputs
    if (name === "" || email === "" || phone === "") {
        alert("Please fill in all fields.");
        return;
    }

    // Check if editing an existing appointment
    var editIndex = document.getElementById('editIndex').value;

    if (editIndex !== "") {
        // Editing an existing appointment
        editAppointment(editIndex, name, email, phone);
    } else {
        // Save data to the API
        createAppointment({ name, email, phone })
            .then(() => {
                // Display data on the screen after successful API request
                displayAppointments();
            })
            .catch(error => {
                console.error('Error creating appointment:', error);
            });
    }

    // Reset the form
    document.getElementById('appointmentForm').reset();
    document.getElementById('editIndex').value = "";
}

function createAppointment(appointmentData) {
    // Use Axios to make a POST request to create a new appointment
    return axios.post(baseApiUrl, appointmentData);
}

function displayAppointments() {
    // Fetch appointments from the API
    fetchAppointments()
        .then(appointments => {
            var appointmentsList = document.getElementById('appointments');

            // Clear existing list
            appointmentsList.innerHTML = "";

            // Display each appointment
            appointments.forEach(function (appointment, index) {
                var listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span>Name: ${appointment.name}</span>
                    <span>Email: ${appointment.email}</span>
                    <span>Phone: ${appointment.phone}</span>
                    <button class="edit" onclick="prepareEdit(${index})">Edit</button>
                    <button class="delete" onclick="deleteAppointment(${index})">Delete</button>
                `;

                appointmentsList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching appointments:', error);
        });
}

function fetchAppointments() {
    // Use Axios to make a GET request to fetch appointments
    return axios.get(baseApiUrl)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching appointments:', error);
            throw error; // Re-throw the error for the next .catch
        });
}

// Other functions (prepareEdit, editAppointment, deleteAppointment) remain unchanged