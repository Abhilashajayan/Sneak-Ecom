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
        const productImgs = document.getElementById('nn');
        const productTitle = document.getElementById('productTitles');
        const userIds = document.getElementById('userId');
        const productPriz = document.getElementById('productPrices');
        const discountEle = document.getElementById('discounts');
        const stockEle = document.getElementById('stocks');
        const cloud = document.getElementById('cloud_id');
        const productCategory = document.getElementById('productCategory');
        const datass = data.productImages[0];
        const datasss = data.productImages[1];
        const imgData = datass.secure_url;
        const imgDatas = datasss.secure_url;
        console.log(imgData);
        productImgs.src = imgDatas;
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
const submitButton = document.getElementById("cataButton");
inputField.addEventListener("input", async function() {
  const inputValue = inputField.value;
  if (!isValidInput(inputValue)) {
    resultDiv.textContent = "Invalid input. Please use only alphanumeric characters.";
    resultDiv.style.color = "red";
    submitButton.disabled = true; 
  } else {
    submitButton.disabled = false; 
  }

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
function isValidInput(input) {
  return input.length >= 3 && /^[A-Za-z0-9]+$/.test(input);
}

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


//delete category

async function deleteCategory(categoryId) {
  try {
      const response = await fetch(`/delete-category/${categoryId}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (response.ok) {
          console.log('Category deleted successfully');
          location.reload(); 
      } 

  } catch (error) {
      console.error('Error:', error);
  }
}




document.addEventListener('DOMContentLoaded', function() {
  async function handleApprovalOrRejection(returnId, isApproved) {
    try {
      const response = await fetch(`/api/return-requests/${returnId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isApproved: isApproved })
      });

      if (response.ok) {
        alert(`Return request ${isApproved ? 'approved' : 'rejected'} successfully.`);
      } else {
        alert('Return request could not be processed.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while processing the request.');
    }
  }
  const approveButtons = document.querySelectorAll('.approveBtn');
  const rejectButtons = document.querySelectorAll('.rejectBtn');

  approveButtons.forEach(button => {
    button.addEventListener('click', function() {
      const returnId = this.getAttribute('data-return-id');
      handleApprovalOrRejection(returnId, true);
    });
  });

  rejectButtons.forEach(button => {
    button.addEventListener('click', function() {
      const returnId = this.getAttribute('data-return-id');
      handleApprovalOrRejection(returnId, false); 
    });
  });
});


async function coupDel(coupID){
  try {
    const response = await fetch(`/delete-coupen/${coupID}`, {
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


function populateEditCouponForm(couponData) {
  const couponCodeInput = document.getElementById('couponCode1');
  const expiryDateInput = document.getElementById('expiryDate1');
  const amountInput = document.getElementById('amount1');
  const minPurchaseInput = document.getElementById('minPurchase1');
  const coupId = document.getElementById('coupId1');
  const formattedExpiryDate = new Date(couponData.expiryDate).toISOString().split('T')[0];
  couponCodeInput.value = couponData.couponCode;
  expiryDateInput.value = formattedExpiryDate;
  coupId.value = couponData._id;
  amountInput.value = couponData.discountAmount;
  minPurchaseInput.value = couponData.minPurchase;
  
}



async function editCoup(coupID) {
  try {
    const response = await fetch(`/getCoupon/${coupID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    if (response.ok) {
      const couponData = await response.json();
      populateEditCouponForm(couponData);
    } else {
      throw new Error('Error retrieving coupon data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}




function isValidInput(input) {
  return /^[A-Za-z0-9\s]+$/.test(input);
}


function editCata(orderID) {
  fetch(`/editCata/${orderID}`, {
    method: 'GET',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.json();
    })
    .then(data => {
      console.log('Received data:', data);
     document.getElementById('categoryNamess').value = data.categoryName;
     document.getElementById('categoryIdss').value = data._id;
    
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


document.getElementById('editCataForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent the default form submission

  const form = e.target; // Get the form element

  // Create an object to hold the form data
  const formData = {
      categoryName: form.querySelector('#categoryNamess').value,
      categoryId: form.querySelector('#categoryIdss').value
  };
  fetch('/update-category', {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData) 
  })
  .then(response => {
      if (response.ok) {
          console.log('Form submitted successfully');
          window.location.reload();
      } else {
          console.error('Form submission failed');
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
});


document.addEventListener('DOMContentLoaded', function() {
  const couponCodeInput = document.getElementById('couponCode1');
  const expiryDateInput = document.getElementById('expiryDate1');
  const amountInput = document.getElementById('amount1');
  const minPurchaseInput = document.getElementById('minPurchase1');
  const errorCouponCode = document.getElementById('errorCoupon3');
  const errorExpiryDate = document.getElementById('errorCoupon');
  const errorAmount = document.getElementById('errorCoupon2');
  const submitButton = document.getElementById('editCouponForm');

  function validateForm() {

    errorCouponCode.textContent = '';
    errorExpiryDate.textContent = '';
    errorAmount.textContent = '';

    const couponCode = couponCodeInput.value.trim();
    if (couponCode === '' || couponCode === null) {
      errorCouponCode.textContent = 'Coupon code cannot be empty.';
      submitButton.disabled = true;
    }


    const expiryDate = expiryDateInput.value.trim();
    if (expiryDate === '' || expiryDate === null) {
      errorExpiryDate.textContent = 'Expiry date cannot be empty.';
      submitButton.disabled = true;
    }

    const amount = amountInput.value.trim();
    if (amount === '' || amount === null || isNaN(amount) || parseFloat(amount) <= 0) {
      errorAmount.textContent = 'Amount must be a valid positive number.';
      submitButton.disabled = true;
    }


    const minPurchase = minPurchaseInput.value.trim();
    if (minPurchase === '' || minPurchase === null || isNaN(minPurchase) || parseFloat(minPurchase) <= 0) {
      errorCoupon.textContent = 'Minimum purchase must be a valid positive number.';
      submitButton.disabled = true;
    }

    if (errorCouponCode.textContent === '' && errorExpiryDate.textContent === '' && errorAmount.textContent === '') {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  }

  couponCodeInput.addEventListener('input', validateForm);
  expiryDateInput.addEventListener('input', validateForm);
  amountInput.addEventListener('input', validateForm);
  minPurchaseInput.addEventListener('input', validateForm);
  submitButton.addEventListener('click', validateForm);
});


document.addEventListener('DOMContentLoaded', function() {
  const couponCodeInput = document.getElementById('couponCode');
  const expiryDateInput = document.getElementById('expiryDate');
  const amountInput = document.getElementById('amount');
  const minPurchaseInput = document.getElementById('minPurchase');
  const errorCouponCode = document.getElementById('coup1');
  const errorExpiryDate = document.getElementById('coup2');
  const errorAmount = document.getElementById('coup4');
  const errorMinPurchase = document.getElementById('coup3');
  const submitButton = document.querySelector('#addCouponForm button[type="submit"]');

  function validateForm() {
     
      errorCouponCode.textContent = '';
      errorExpiryDate.textContent = '';
      errorAmount.textContent = '';
      errorMinPurchase.textContent = '';

    
      const couponCode = couponCodeInput.value.trim();
      if (couponCode === '') {
          errorCouponCode.textContent = 'Coupon code cannot be empty.';
          submitButton.disabled = true;
      }

   
      const expiryDate = expiryDateInput.value.trim();
      if (expiryDate === '') {
          errorExpiryDate.textContent = 'Expiry date cannot be empty.';
          submitButton.disabled = true;
      }

    
      const amount = amountInput.value.trim();
      if (amount === '' || isNaN(amount) || parseFloat(amount) <= 0) {
          errorAmount.textContent = 'Amount must be a valid positive number.';
          submitButton.disabled = true;
      }

      const minPurchase = minPurchaseInput.value.trim();
      if (minPurchase === '' || isNaN(minPurchase) || parseFloat(minPurchase) <= 0) {
          errorMinPurchase.textContent = 'Minimum purchase must be a valid positive number.';
          submitButton.disabled = true;
      }

      if (errorCouponCode.textContent === '' && errorExpiryDate.textContent === '' && errorAmount.textContent === '' && errorMinPurchase.textContent === '') {
          submitButton.disabled = false;
      } else {
          submitButton.disabled = true;
      }
  }


  couponCodeInput.addEventListener('input', validateForm);
  expiryDateInput.addEventListener('input', validateForm);
  amountInput.addEventListener('input', validateForm);
  minPurchaseInput.addEventListener('input', validateForm);


  document.getElementById('addCouponForm').addEventListener('submit', function(event) {
      validateForm(); 
      if (submitButton.disabled) {
          event.preventDefault(); 
      }
  });
});


document.addEventListener('DOMContentLoaded', function() {
  const productTitleInput = document.getElementById('productTitles');
  const productPriceInput = document.getElementById('productPrices');
  const discountInput = document.getElementById('discounts');
  const stockInput = document.getElementById('stocks');
  const isFeaturedInput = document.getElementById('isFeatured');
  const errorProductTitle = document.getElementById('pro1');
  const errorProductPrice = document.getElementById('pro2');
  const errorDiscount = document.getElementById('pro3');
  const errorStock = document.getElementById('pro4');
  const errorIsFeatured = document.getElementById('pro5');
  const submitButton = document.querySelector('#editProductForm button[type="submit"]');

  function validateForm() {
      // Reset error messages
      errorProductTitle.textContent = '';
      errorProductPrice.textContent = '';
      errorDiscount.textContent = '';
      errorStock.textContent = '';
      errorIsFeatured.textContent = '';

      // Validate Product Title
      const productTitle = productTitleInput.value.trim();
      if (productTitle === '') {
          errorProductTitle.textContent = 'Product title cannot be empty.';
          submitButton.disabled = true;
      }

      

      // Validate Product Price
      const productPrice = productPriceInput.value.trim();
      if (productPrice === '' || isNaN(productPrice) || parseFloat(productPrice) <= 0) {
          errorProductPrice.textContent = 'Product price must be a valid positive number.';
          submitButton.disabled = true;
      }

      // Validate Discount
      const discount = discountInput.value.trim();
      if (discount === '' || isNaN(discount) || parseFloat(discount) < 0 || parseFloat(discount) >= 100) {
          errorDiscount.textContent = 'Discount must be a valid percentage (0-99).';
          submitButton.disabled = true;
      }

      // Validate Stock
      const stock = stockInput.value.trim();
      if (stock === '' || isNaN(stock) || parseInt(stock) < 0) {
          errorStock.textContent = 'Stock must be a valid positive number.';
          submitButton.disabled = true;
      }

      // Validate Is Featured
      const isFeatured = isFeaturedInput.value;
      if (isFeatured === '') {
          errorIsFeatured.textContent = 'Please select whether the product is featured or not.';
          submitButton.disabled = true;
      }

      // Enable the button if all fields are filled correctly
      if (errorProductTitle.textContent === '' &&
          errorProductPrice.textContent === '' && errorDiscount.textContent === '' && 
          errorStock.textContent === '' && errorIsFeatured.textContent === '') {
          submitButton.disabled = false;
      } else {
          submitButton.disabled = true;
      }
  }

  productTitleInput.addEventListener('input', validateForm);
  productPriceInput.addEventListener('input', validateForm);
  discountInput.addEventListener('input', validateForm);
  stockInput.addEventListener('input', validateForm);
  isFeaturedInput.addEventListener('change', validateForm);


  document.getElementById('editProductForm').addEventListener('submit', function(event) {
      validateForm(); 
      if (submitButton.disabled) {
          event.preventDefault(); 
      }
  });
});


document.addEventListener('DOMContentLoaded', function() {
  const productTitleInput = document.getElementById('productTitle');
  const productCategoryInput = document.getElementById('category');
  const productPriceInput = document.getElementById('productPrice');
  const sizeCheckboxes = document.querySelectorAll('input[name="sizes"]');
  const discountInput = document.getElementById('discount');
  const stockInput = document.getElementById('stock');
  const addProductButton = document.getElementById('addProBtn');

  function validateForm() {
   
      document.getElementById('error-message1').textContent = '';
      document.getElementById('error-message2').textContent = '';
      document.getElementById('error-message3').textContent = '';
      document.getElementById('error-message4').textContent = '';
      document.getElementById('error-message5').textContent = '';

    
      const productTitle = productTitleInput.value.trim();
      if (productTitle === '') {
          document.getElementById('error-message1').textContent = 'Product title cannot be empty.';
          addProductButton.disabled = true;
      }

  
      const productCategory = productCategoryInput.value.trim();
      if (productCategory === '') {
          document.getElementById('error-message2').textContent = 'Please select a product category.';
          addProductButton.disabled = true;
      }

    
      let atLeastOneSizeSelected = false;
      sizeCheckboxes.forEach(function(checkbox) {
          if (checkbox.checked) {
              atLeastOneSizeSelected = true;
          }
      });
      if (!atLeastOneSizeSelected) {
          document.getElementById('error-message3').textContent = 'At least one size must be selected.';
          addProductButton.disabled = true;
      }

     
      const productPrice = productPriceInput.value.trim();
      if (productPrice === '' || isNaN(productPrice) || parseFloat(productPrice) <= 0) {
          document.getElementById('error-message4').textContent = 'Product price must be a valid positive number.';
          addProductButton.disabled = true;
      }

  
      const discount = discountInput.value.trim();
      if (discount !== '' && (isNaN(discount) || parseFloat(discount) < 0)) {
          document.getElementById('error-message4').textContent = 'Discount must be a valid non-negative number.';
          addProductButton.disabled = true;
      }


      const stock = stockInput.value.trim();
      if (stock === '' || isNaN(stock) || parseInt(stock) < 0) {
          document.getElementById('error-message5').textContent = 'Stock must be a valid non-negative integer.';
          addProductButton.disabled = true;
      }

    
      if (document.getElementById('error-message1').textContent === '' &&
          document.getElementById('error-message2').textContent === '' &&
          document.getElementById('error-message3').textContent === '' &&
          document.getElementById('error-message4').textContent === '' &&
          document.getElementById('error-message5').textContent === '') {
          addProductButton.disabled = false;
      } else {
          addProductButton.disabled = true;
      }
  }


  productTitleInput.addEventListener('input', validateForm);
  productCategoryInput.addEventListener('change', validateForm);
  sizeCheckboxes.forEach(function(checkbox) {
      checkbox.addEventListener('change', validateForm);
  });
  productPriceInput.addEventListener('input', validateForm);
  discountInput.addEventListener('input', validateForm);
  stockInput.addEventListener('input', validateForm);
});





