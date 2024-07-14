document.addEventListener('DOMContentLoaded', () => {
  const newCustomerForm = document.getElementById('new_customer_form');
  const customerList = document.getElementById('customer_list');
  const customerAddedMessage = document.getElementById('customer_added');




//using this function to encoding special characters in the input ( to prevent xss attack )
  const escapeHTML = (unsafe) => {
    return unsafe.replace(/[&<"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '"': '&quot;',
        "'": '&#39;'
    }[m]));
};

  const fetchCustomers = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('user_id');

      if  (!accessToken || !userId) {
        throw new Error('Access token not found in localStorage');
      }
      const response = await fetch('http://localhost:3001/customers', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch customer data');
      }
      const customers = await response.json();
      customerList.innerHTML = '';
      customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${escapeHTML(customer.customer_name)}</td>
          <td>${escapeHTML(customer.customer_email)}</td>
          <td>${escapeHTML(customer.customer_phone)}</td>
          <td><a href="http://localhost:3001/display_customer?customer_name=${encodeURIComponent(customer.customer_name)}">View Details</a></td>
        `;
        customerList.appendChild(row);
      });

    } catch (error) {
      console.error('Error fetching customers:', error.message);
    }
  };

  newCustomerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const customerName = document.getElementById('customer_name').value;
    const customerEmail = document.getElementById('customer_email').value;
    const customerPhone = document.getElementById('customer_phone').value;

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found in localStorage');
      }
      const response = await fetch('http://localhost:3001/add_customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone
        })
      });
      if (!response.ok) {
        throw new Error('Failed to add customer');
      }
      const result = await response.json();
      customerAddedMessage.textContent = 'Customer added successfully';
      customerAddedMessage.style.color = 'green';
  
      window.location.href = `http://localhost:3001/display_customer?customer_name=${customerName}`;
      fetchCustomers();
      newCustomerForm.reset();


    } catch (error) {
      console.error('Error adding customer:', error.message);
      customerAddedMessage.textContent = 'Failed to add customer';
      customerAddedMessage.style.color = 'red';
    }
  });

  fetchCustomers();
});


