document.addEventListener("DOMContentLoaded", function() {
    const sidebarLinks = document.querySelectorAll(".sidebar li a");
    const contentSections = document.querySelectorAll(" .content");
    const dashboardSection = document.getElementById("dashboard");
    if (dashboardSection) {
      dashboardSection.style.display = "block";
    }
  
    sidebarLinks.forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        contentSections.forEach(section => {
          section.style.display = "none";
        });
        const targetSectionId = link.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetSectionId);
        const productHome = document.getElementById("products-sec");
        const productData = document.getElementById("product-data");
        const cutomerss =  document.getElementById("cust-data");

        if (targetSection) {
          targetSection.style.display = "block";
          productHome.style.display = "block";
          productData.style.display = "block";
          cutomerss.style.display = "block";
        }
      });
    });
  });
  
    document.addEventListener("DOMContentLoaded", function() {
      const showFormButton = document.getElementById("showAddProductForm");
      const addProductSection = document.getElementById("addProduct");
      const hide = document.getElementById("products-sec");
      const productData = document.getElementById("product-data");
      const cancel = document.getElementById("cancelModalBtn");
      // const cutomerss =  document.getElementById("cust-data");
  
      cancel.addEventListener("click", () => {
        window.location.reload();
      });
      showFormButton.addEventListener("click", function() {
        addProductSection.style.display = "block";
        hide.style.display = "none"; 
        productData.style.display = "none";
       
      });
   
     
    });  


    //edit user fetch api

    function editUser(userID) {
      fetch(`/api/users/${userID}`, {
        method: 'GET',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
  
        const productImg = document.getElementById('productImage');
        const productTitle = document.getElementById('productTitles');
        const userIds = document.getElementById('userId');
        const productPriz = document.getElementById('productPrices');
        const discountEle = document.getElementById('discounts');
        const stockEle = document.getElementById('stocks');
        const cloud = document.getElementById('cloud_id');
        const productCategory = document.getElementById('productCategory');
        const datass = data.productImages[0];
        const imgData = datass.secure_url;
        console.log(imgData);
        
        productImg.src = imgData ;
        cloud.value = data.productImages[0].cloudinary_id;
        console.log(cloud.value);
        productTitle.value = data.productTitle || '';
        userIds.value = data._id || '';
        productPriz.value = data.productPrice || '';
        discountEle.value = data.discount || '';
        stockEle.value = data.stock || '';
        productCategory.value = data.productCategory || '';
      })
      .catch(error => {
        console.error('Error editing user:', error);
      });
    }



    // const form = document.getElementById('editProductForm');
    // form.addEventListener('submit', async (event) => {
    //     event.preventDefault();
    //     const formData = new FormData(form);
    //     try {
    //       const userId = document.getElementById('userId').value;
    //         const response = await fetch(`/api/users/update/${encodeURIComponent(userId)}`, {
    //           method: 'PUT',
    //           headers: {
    //             'Content-Type': 'application/json'
    //           },
    //           body: JSON.stringify(Object.fromEntries(formData.entries()))
    //         });
        
    //         if (response.ok) {
    //           const data = await response.json();
    //           console.log(data); 
    //           window.location.reload();
    //         } else {
    //           console.error('Error:', response.statusText);
    //         }
    //       } catch (error) {
    //         console.error('Error:', error);
    //       }
    // });

    const form = document.getElementById('editProductForm');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const userId = document.getElementById('userId').value;

  try {
    const response = await fetch(`/api/users/update/${encodeURIComponent(userId)}`, {
      method: 'POST', // Change to POST
      body: formData, // Use the FormData object directly
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      window.location.reload();
    } else {
      console.error('Error:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});


//delte user fetch

function editUsers(userID) {
  fetch(`/api/delete/${userID}`, {
    method: 'DELETE',
  })
  .then(response => {
    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    return response.json();
  })
  .then(data => {
    console.log('Data:', data);
    window.location.reload();
  })
  .catch(error => {
    console.error('Error editing user:', error);
    
    window.location.reload();
  });
}



async function BlockUser(userId) {
  try {
    const response = await fetch(`/api/block-user/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
     
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      window.location.reload();
    } else {
      console.error('Error blocking user');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


// const buttonBlk =  document.querySelectorAll('.buttonOne');
// const tdElements = document.querySelectorAll('.active-sts'); // Use class instead of ID

// tdElements.forEach(tdElement => {
//   if (tdElement.textContent.trim() === 'true') {
//     buttonBlk.textContent.
//     tdElement.style.backgroundColor = 'red';
//   } else {
//     tdElement.style.backgroundColor = 'green';
//   }
// });
const buttonBlk = document.querySelectorAll('.buttonOne');
const tdElements = document.querySelectorAll('.active-sts');

tdElements.forEach((tdElement, index) => {
  const button = buttonBlk[index]; 
  if (tdElement.textContent.trim() === 'true') {
    button.style.backgroundColor = 'red';
    button.textContent = 'Unblock'; 

    
  } else {
    button.style.backgroundColor = 'green';
    button.textContent = 'Block'; 
  
   
  }
});




// JavaScript code


const inputField = document.getElementById("categoryName");
const sub = document.getElementById("categoryForm");
const resultDiv = document.getElementById("result");
inputField.addEventListener("input", async function() {
  const inputValue = inputField.value;

  try {
    const response = await fetch(`/category/${encodeURIComponent(inputValue)}`);
    const data = await response.json();

    if (data.exists) {
      resultDiv.textContent = "Category exists in the database.";
      resultDiv.style.color = "red";
      
    } else {
      resultDiv.textContent = "Category doesn't exist in the database.";
      resultDiv.style.color = "green";
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
});

sub.addEventListener("submit", function(event) {
  if (resultDiv.textContent === 'Category exists in the database.') {
    event.preventDefault(); 
  }
});




// change sts

var orderId;

function changeSts(id) {
    orderId = id;
    
}

function updateDeliveryStatus() {
  location.reload();
    const status = document.getElementById('deliveryStatus').value;
   
    fetch(`/updateDeliveryStatus/${orderId}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
  })
  .catch(error => {
      console.error('Error:', error);
  });
  
}






// user delete 

async function deleteUser(userId) {
  try {
    const response = await fetch(`/delete-user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
     
    });
    if (response.ok) {
      console.log('User deleted successfully');
      location.reload(); // Reload the page
    } else {
      throw new Error('Error deleting user');
    }
  
  } catch (error) {
    console.error('Error:', error);
  }
  location.reload();
}