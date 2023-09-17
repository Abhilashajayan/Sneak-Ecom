
document.addEventListener("DOMContentLoaded", function() {
    const sidebar = document.querySelector('.sidebar');
    const contentContainer = document.querySelector('.content-container');
    const dashLink = document.getElementById('dashLink');
    const ordersLink = document.getElementById('ordersLink');
    const dashboardContent = document.getElementById('dashboard');
    const ordersContent = document.getElementById('orders');
    const addressLink = document.getElementById('addressLink');
    const addressContent = document.getElementById('address');
    const walletLink = document.getElementById('walletLink');
    const walletLinkContent = document.getElementById('wallet');
    function hideContent() {
        contentContainer.style.display = 'none';
    }

    function showContent() {
        contentContainer.style.display = 'block';
    }

    function hideSidebar() {
        sidebar.style.display = 'none';
    }

    function showSidebar() {
        sidebar.style.display = 'block';
    }

    function toggleSidebar() {
        if (window.innerWidth <= 767) {
            sidebar.style.display = (sidebar.style.display === 'none') ? 'block' : 'none';
        }
    }

    dashLink.addEventListener('click', () => {
        dashboardContent.style.display = 'block';
        ordersContent.style.display = 'none';
        addressContent.style.display ='none';
        walletLinkContent.style.display = 'none';
        toggleSidebar();
       
    });

    ordersLink.addEventListener('click', () => {
        dashboardContent.style.display = 'none';
        ordersContent.style.display = 'block';
        addressContent.style.display ='none';
        walletLinkContent.style.display = 'none';
        toggleSidebar();
        hideContent();
    });

    walletLink.addEventListener('click', () => {
        walletLinkContent.style.display = 'block';
        dashboardContent.style.display = 'none';
        ordersContent.style.display = 'none';
        addressContent.style.display ='none';
        toggleSidebar();
        hideContent();
    });

    addressLink.addEventListener('click', () => {
        dashboardContent.style.display = 'none';
        walletLinkContent.style.display = 'none';
        ordersContent.style.display = 'none';
        addressContent.style.display ='block';
        toggleSidebar();
        hideContent();
      

    });
    const backButton = document.querySelector('.hBack');
    backButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '/user-Dash';
    });


    if (window.innerWidth <= 767) {
        showSidebar();
        hideContent();
    } else {
        showSidebar();
        showContent();
    }
});


function editDash(userId) {
    const formData = new FormData(document.getElementById('profileForm'));
    const formDataObject = Object.fromEntries(formData);
    
    fetch(`/users/${userId}`, {
        method: 'POST',
        body: JSON.stringify(formDataObject),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error editing user:', error);
    });
}


 



function addAdd(userId) {
    const form = document.getElementById('userAddAddressForm');
    const formData = new FormData(form);

    fetch(`/add-address/${userId}`, {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error adding address:', error);
    });
}

const addressCards = document.querySelectorAll('.address-card');
addressCards.forEach(address => {
    const editButton = address.querySelector('.edit-button');
    const addressId = editButton.getAttribute('data-address-id');
    editButton.addEventListener('click', () => {
        editAddress(addressId);
    });
});

async function editAddress(addressId) {
    try {
        console.log('Clicked button with address ID:', addressId);
        const response = await fetch(`/users/address/${addressId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        document.querySelector('#name2').value = data.address.name;
        document.querySelector('#country2').value = data.address.country;
        document.querySelector('#streetAddress2').value = data.address.streetAddress;
        document.querySelector('#city2').value = data.address.city;
        document.querySelector('#state2').value = data.address.state;
        document.querySelector('#pincode2').value = data.address.pincode;
        document.querySelector('#userId2').value = data.address._id;
        console.log(data.address._id);
        // document.querySelector('#userId').value = data.userId;
       
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const editButton = document.getElementById('editButton');

    editButton.addEventListener('click', async () => {
        const form = document.getElementById('editAddressForm');
        const formData = new FormData(form);
        const addressId = formData.get('addressId');

        const addressData = {};
        formData.forEach((value, key) => {
            if (key !== 'addressId') {
                addressData[key] = value;
            }
        });

        try {
            const response = await fetch(`/updateAddress/${addressId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addressData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log('Address updated successfully');
            // Add any further actions or notifications here
        } catch (error) {
            console.error('Error updating address:', error);
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const cameraIcon = document.getElementById('cameraIcon');
    const imageInput = document.getElementById('imageInput');

    cameraIcon.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', (event) => {
        const selectedImage = event.target.files[0];
        if (selectedImage) {
            console.log('Selected image:', selectedImage.name);
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const returnForm = document.getElementById('returnForm');
  
    returnForm.addEventListener('submit', function(event) {
      event.preventDefault(); 
      const formData = new FormData(returnForm);
      fetch(returnForm.action, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (response.ok) {
          alert('Return request submitted successfully!');
        } else {
          alert('Return request failed. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
      });
    });
  });



  document.addEventListener('DOMContentLoaded', function() {
    async function handleCancelOrder(orderId) {
      try {
        const response = await fetch(`/orders/${orderId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ orderId })
        });
        if (response.ok) {
            
          console.log('Order canceled successfully.');
        } else {
          console.error('Order cancellation failed.');
        }
      } catch (error) {
        console.error(error);
      }
    }
    const cancelOrderButtons = document.querySelectorAll('.orderCancelBtn');
    cancelOrderButtons.forEach(button => {
      button.addEventListener('click', function() {
        const orderId = this.getAttribute('data-order-id');
        const userId = this.getAttribute('data-user-id');
        location.reload();
        handleCancelOrder(orderId, userId);
      });
    });
  });

  document.getElementById('profileForm').addEventListener('submit', function (event) {
    const phoneNumber = document.getElementById('phoneNumber').value;

    // Validate the phone number using a regular expression
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phoneNumber)) {
        event.preventDefault(); // Prevent form submission
        document.getElementById('phoneError').textContent = 'Invalid phone number (10 digits required)';
    } else {
        document.getElementById('phoneError').textContent = ''; // Clear any previous error message
    }
});

  
document.addEventListener("DOMContentLoaded", function () {
    const cameraIcon = document.getElementById('cameraIcon');

    cameraIcon.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        document.body.appendChild(input);

        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append('userImage', file);
            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Server response:', data);
                } else {
                    console.error('Error uploading image:', response.statusText);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            } finally {
                // Clean up the input element
                document.body.removeChild(input);
            }
        });

        input.click();
    });
});
  


document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', (event) => {
        const addressId = event.target.getAttribute('data-addresss-id');
        console.log(addressId);
        deleteAddress(addressId);
    });
});

function deleteAddress(addressId) {
    fetch(`/address/${addressId}`, {
        method: 'POST',
    })
    .then(response => {
        if (response.ok) {
            const cardToDelete = document.querySelector(`[data-address-id="${addressId}"]`).closest('.address-card');
            cardToDelete.remove();
        } else {
            console.error('Error deleting address');
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}




async function showOrder(orderId) {
    try {
        console.log('Clicked button with address ID:', orderId);
        const response = await fetch(`/showOrder/${orderId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        
        document.getElementById('ordID').textContent = data._id;
        document.getElementById('prdID').textContent = data.items[0].productId; 
        document.getElementById('prdTitle').textContent = data.items[0].productTitle;
        document.getElementById('ss').textContent = data.items[0].size; 
        document.getElementById('Qty').textContent = data.items[0].quantity;
        document.getElementById('Ttl').textContent = data.subtotals;
        document.getElementById('pymt').textContent = data.paymentMethod;

        let im = document.getElementById('productImage')
        im.src = data.items[0].productImage[0].secure_url;
        
       
    } catch (error) {
        console.error('Error:', error);
    }
}