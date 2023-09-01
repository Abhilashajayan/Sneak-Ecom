let totalAmount = 0;
const productDivs = document.querySelectorAll('.price');

productDivs.forEach(productDiv => {
const totalPriceElement = productDiv.querySelector('.total-price');
const totalPrice = parseFloat(totalPriceElement.textContent.trim());
totalAmount += totalPrice;
});
const totalAmountElement = document.getElementById('totalAmount');
totalAmountElement.textContent = '$' + totalAmount.toFixed(2); 
let totAmy = document.getElementById('total');
totAmy.value = totalAmount;


const shippingMethodForm = document.getElementById('shippingMethodForm');

shippingMethodForm.addEventListener('change', (event) => {
    const selectedShippingMethod = event.target.value;
    console.log('Selected shipping method:', selectedShippingMethod);
});


const shippingMethodForms = document.getElementById('shippingMethodForm');
    const shippingCostElement = document.getElementById('shippingCost');
    
    shippingMethodForms.addEventListener('change', (event) => {
        const selectedShippingMethod = event.target.value;
        

        const shippingCosts = {
            free: 0,
            express: 14
        };
        

        shippingCostElement.textContent = `+ $${shippingCosts[selectedShippingMethod].toFixed(2)}`;
        let shippingCost = document.getElementById('del');
        shippingCost.value  = `${shippingCosts[selectedShippingMethod]}`;

        
    
       
        const shpCst = shippingCosts[selectedShippingMethod];
        console.log(shpCst);
        const newTotalAmt = totalAmount + shpCst;
        console.log(newTotalAmt);
        let subtotal = document.getElementById('subtotal');
        subtotal.value = newTotalAmt;
        const totalAmt = document.getElementById('finalAmts');
        totalAmt.textContent = `$${newTotalAmt.toFixed(2)}`;
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
      paymentMethodInput.value = 'Credit Card'; 
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
    
    
    

    document.getElementById('userAddAddressForm').addEventListener('submit', function (event) {
        
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


       
    function handleCreditButtonClick() {
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
    


    


    
    
  




    
    
    
    