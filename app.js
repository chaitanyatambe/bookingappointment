// main.js
// Function to fetch user details from the cloud
function fetchUserDetails() {
    return axios.get('https://crudcrud.com/api/3020b76d547e4358a4082e1da171f957/AppointmentBooking');
}

// Function to update user details in the cloud
function updateUserDetails(userDetailsArray) {
    return axios.put('https://crudcrud.com/api/3020b76d547e4358a4082e1da171f957/AppointmentBooking', { data: userDetailsArray });
}

// Function to initialize the UI with stored user details
function initUI() {
    // Fetch user details from the cloud
    fetchUserDetails()
    .then(function (response) {
        var userDetailsArray = response.data;

        // Display user details in the UI
        var userList = document.getElementById('userList');
        userList.innerHTML = ''; // Clear previous entries

        userDetailsArray.forEach(function (userDetails, index) {
            var listItem = document.createElement('li');

            // Unicode characters for the edit and delete icons
            var editIcon = '\u{1F58A}'; // Edit icon
            var deleteIcon = '\u{1F5D1}'; // Delete icon

            // Create an edit button for each user
            var editButton = document.createElement('button');
            editButton.innerHTML = editIcon;
            editButton.style.cursor = 'pointer';
            editButton.onclick = function () {
                editUser(index, userDetails);
            };

            // Create a delete button for each user
            var deleteButton = document.createElement('button');
            deleteButton.innerHTML = deleteIcon;
            deleteButton.style.cursor = 'pointer';
            deleteButton.onclick = function () {
                deleteUser(index, userDetails._id);
            };

            // Display user details in the list item
            listItem.textContent = userDetails.firstName + ' ' + userDetails.lastName + ' ' + userDetails.email + ' ' + userDetails.address + ' ' + userDetails.Phone_no + ' ';

            // Append the edit and delete buttons to the list item
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);

            // Append the list item to the user list
            userList.appendChild(listItem);
        });
    })
    .catch(function (error) {
        // Handle errors if the GET request fails
        console.error('Error fetching data from the cloud:', error);
    });
}

// Function to delete a user by index
function deleteUser(index, userId) {
    // Fetch user details from the cloud
    fetchUserDetails()
        .then(function (response) {
            var userDetailsArray = response.data;

            // Update user details in the cloud
            updateUserDetails(userDetailsArray.filter(user => user._id !== userId))
                .then(function (putResponse) {
                    // Handle the success response if needed
                    console.log('Data updated in the cloud:', putResponse.data);

                    // Remove the user from the UI
                    var userList = document.getElementById('userList');
                    userList.removeChild(userList.childNodes[index]);

                    // Alternatively, you can clear the entire list and reinitialize it
                    // userList.innerHTML = '';
                    // initUI();
                })
                .catch(function (putError) {
                    // Handle errors if the PUT request fails
                    console.error('Error updating data in the cloud:', putError);
                });
        })
        .catch(function (error) {
            // Handle errors if the GET request fails
            console.error('Error fetching data from the cloud:', error);
        });
}

// Function to handle user editing
function editUser(index, userDetails) {
    // Populate the form with user details for editing
    document.getElementById('firstName').value = userDetails.firstName;
    document.getElementById('lastName').value = userDetails.lastName;
    document.getElementById('email').value = userDetails.email;
    document.getElementById('address').value = userDetails.address;
    document.getElementById('Phone_no').value = userDetails.Phone_no;

    // Handle form submission for editing
    document.getElementById('userForm').onsubmit = function (event) {
        event.preventDefault();
        // Update the user details array with edited details
        userDetailsArray[index] = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            Phone_no: document.getElementById('Phone_no').value,
            _id: userDetails._id // Keep the original ID
        };

        // Update user details in the cloud
        updateUserDetails(userDetailsArray)
            .then(function (putResponse) {
                // Handle the success response if needed
                console.log('Data updated in the cloud:', putResponse.data);

                // Reinitialize the UI
                initUI();
            })
            .catch(function (putError) {
                // Handle errors if the PUT request fails
                console.error('Error updating data in the cloud:', putError);
            });

        // Clear the form after submission
        document.getElementById('userForm').reset();
        // Remove the event listener to avoid unintentional form submissions
        document.getElementById('userForm').onsubmit = submitForm;
    };
}


// Function to handle form submission
function submitForm() {
    // ... (your existing submitForm code)
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var email = document.getElementById('email').value;
    var address = document.getElementById('address').value;
    var Phone_no = document.getElementById('Phone_no').value;

    // Create an object to store user details
    var userDetails = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        address: address,
        Phone_no: Phone_no
    };

    // Perform a POST request using Axios to store the data in the cloud
    axios.post('https://crudcrud.com/api/3020b76d547e4358a4082e1da171f957/AppointmentBooking', userDetails)
        .then(function (response) {
            // Handle the success response if needed
            console.log('Data stored in the cloud:', response.data);

            // You may choose to do something with the response, but for now, let's reinitialize the UI
            initUI();
        })
        .catch(function (error) {
            // Handle errors if the POST request fails
            console.error('Error storing data in the cloud:', error);
        });
    // After submitting the form, reinitialize the UI
    initUI();
}

// Initialize UI on page load
document.addEventListener('DOMContentLoaded', function () {
    initUI();
});