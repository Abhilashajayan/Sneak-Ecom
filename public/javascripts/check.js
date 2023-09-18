let totalAmount = 0;
const productDivs = document.querySelectorAll('.price');
const couponAmount = 0;







productDivs.forEach(productDiv => {
const totalPriceElement = productDiv.querySelector('.total-price');
const totalPrice = parseFloat(totalPriceElement.textContent.trim());
totalAmount += totalPrice;
});
const totalAmountElement = document.getElementById('totalAmount');
totalAmountElement.textContent = '₹' + totalAmount.toFixed(2); 
let totAmy = document.getElementById('total');
totAmy.value = totalAmount;


const shippingMethodForm = document.getElementById('shippingMethodForm');

shippingMethodForm.addEventListener('change', (event) => {
 
    const selectedShippingMethod = event.target.value;
    

    console.log('Selected shipping method:', selectedShippingMethod);
});

document.addEventListener("DOMContentLoaded", function () {
  const promoCodeInput = document.getElementById("promoCodeInput");
  const applyButton = document.getElementById("applyButton");
  applyButton.addEventListener("click", function () {
    const promoCode = promoCodeInput.value;
    console.log(promoCode);
    const url = `/checkCoupon/${promoCode}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        addCouponData(data);
      })
      .catch(error => {
        console.error("Fetch error:", error);
      });
  });
});

 
function addCouponData(data) {
  console.log(data.couponData.minPurchase);
const couponMinPurchase = data.couponData.minPurchase;
if (totalAmount >= couponMinPurchase) {
  const couponAmount = data.couponData.discountAmount;
  totalAmount = totalAmount - couponAmount;
  
  console.log("Coupon applied successfully. New total amount: " + totalAmount);
} else if ( totalAmount < couponMinPurchase) {
  console.log("Coupon cannot be applied. Minimum purchase requirement not met.");
}
}

const shippingMethodForms = document.getElementById('shippingMethodForm');
    const shippingCostElement = document.getElementById('shippingCost');
    
    shippingMethodForms.addEventListener('change', (event) => {
        const selectedShippingMethod = event.target.value;
        const totalDiv = document.getElementById('finalPrice');
        totalDiv.style.display = "flex";
        const shippingCosts = {
            free: 0,
            express: 14
        };
        

        shippingCostElement.textContent = `+ ₹${shippingCosts[selectedShippingMethod].toFixed(2)}`;
        let shippingCost = document.getElementById('del');
        shippingCost.value  = `${shippingCosts[selectedShippingMethod]}`;

        
    
       
        const shpCst = shippingCosts[selectedShippingMethod];
        console.log(shpCst);
        const newTotalAmt = totalAmount + shpCst;
        console.log(newTotalAmt);
        let subtotal = document.getElementById('subtotal');
        subtotal.value = newTotalAmt;
        const totalAmt = document.getElementById('finalAmts');
        totalAmt.textContent = `₹${newTotalAmt.toFixed(2)}`;

    });


    const creditCardTab = document.querySelector('[href="#credit-card"]');
    const codTab = document.querySelector('[href="#cod"]');
    const creditCardSection = document.getElementById('credit-card');
    const codSection = document.getElementById('cod');
    const paymentMethodInput = document.getElementById('paymentMethod');
  

    codSection.style.display = 'none';
    
    creditCardTab.addEventListener('click', () => {
      creditCardSection.style.display = 'block';
      codSection.style.display = 'none';
      paymentMethodInput.value = 'Razorpay'; 
    });
  
    codTab.addEventListener('click', () => {
     
      codSection.style.display = 'block';
      creditCardSection.style.display = 'none';
      paymentMethodInput.value = 'COD'; 
    });

    document.addEventListener('DOMContentLoaded', () => {
      const radioButtons = document.querySelectorAll('input[name="flexRadioDefault"]');
      
      radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', (event) => {
          if (event.target.checked) {
            const selectedAddressId = event.target.value;
            let address = document.getElementById('addessId1');
            address.value = selectedAddressId;
            console.log(selectedAddressId);
          }
        });
      });
    });
    
    
    

    document.getElementById('userAddAddressForm').addEventListener('submit', function () {
        
        const userId = document.getElementById('getUser').value;
        console.log(userId);

        const formData = new FormData(this);
        
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
    });

   
    function handleCodButtonClick() {
      const selectedRadioButton = document.querySelector('input[name="flexRadioDefault"]:checked');
      if (!selectedRadioButton) {
        alert('Please select an address before placing the order.');
        return;
      }
    
      const paymentMethod = document.getElementById('paymentMethod').value;
      console.log(paymentMethod);
      const addressId = document.getElementById('addessId1').value; 
      const methodAddress = document.getElementById('del').value;
      const totalAmount = document.getElementById('total').value;
      const newTotalAmt = document.getElementById('subtotal').value;
      
      const orderData = {
         paymentMethod: paymentMethod,
         address: addressId,
         methodAddress: methodAddress,
         totalAmount: totalAmount,
         newTotalAmt: newTotalAmt
      };
      
     
      fetch('/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({orderData})
      })

       
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while placing the order.');
      });

      window.location.href = '/payment-success';
    }


   
   

   

    async function handleCreditButtonClick() {
      const selectedRadioButton = document.querySelector('input[name="flexRadioDefault"]:checked');
      if (!selectedRadioButton) {
        alert('Please select an address before placing the order.');
        return;
      }
    
      const paymentMethod = document.getElementById('paymentMethod').value;
      console.log(paymentMethod);
      const addressId = document.getElementById('addessId1').value;
      const methodAddress = document.getElementById('del').value;
      const totalAmountInput = document.getElementById('total');
      const newTotalAmtInput = document.getElementById('subtotal');
    
      // Parse the input values as numbers
      const totalAmount = parseFloat(totalAmountInput.value);
      const newTotalAmt = parseFloat(newTotalAmtInput.value);
    
      if (isNaN(totalAmount) || isNaN(newTotalAmt)) {
        alert('Invalid total amount or subtotal.');
        return;
      }
    
      const orderData = {
        paymentMethod: paymentMethod,
        address: addressId,
        methodAddress: methodAddress,
        totalAmount: totalAmount,
        newTotalAmt: newTotalAmt,
      };
      

      const options = {
        key: 'rzp_test_yo3IwIuNagxMzt',
        amount: newTotalAmt * 100,
        currency: 'INR',
        order_id: "",
        name: 'SNEAK E-COM',
        description: 'Payment for Order',
        image: 'YOUR_LOGO_URL_HERE',
        handler: async function (response) {
          console.log(response, 'this is response from Razorpay handler');
          paymetVarification(response);
          location.href = '/payment-success';
        },
      };
      try {
        const response = await sendOrderData(orderData);
        options.order_id = String(response.id)
        console.log(response, 'this is response from send order');
        // Create Razorpay options here after getting the response
        const rzp = new Razorpay(options);
        rzp.open();
    
      } catch (error) {
        console.error('Error:', error);
        // Handle the error here
      }
    }
   
    
    function paymetVarification(response) {
      const paymentData = {
        response: response,
      };
      console.log(paymentData);
      fetch('/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({paymentData}),
      })
        .then((verificationResponse) => verificationResponse.json())
        .then((verificationResult) => {
          if (verificationResult.success) {
            console.log('Payment verification is successful');

          } else {
            console.error('Payment verification failed');
          }
        })
        .catch((error) => {
          console.error('Error verifying payment:', error);
          alert('An error occurred while verifying the payment.');
        });
    }

    async function sendOrderData(orderData) {
      try {
        const response = await fetch('/submit-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderData }),
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    
        return response.json(); // Return response.json() directly
      } catch (error) {
        console.error('Error:', error);
        // Handle the error here
        throw error; // Re-throw the error to be caught by the caller
      }
    }
    


