
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



  
  