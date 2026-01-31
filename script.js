const cart = {};
        const milkNames = {
            1: 'Chocolate Goat Milk',
            2: 'Strawberry Goat Milk',
            3: 'Vanilla Goat Milk',
            4: 'Almond Goat Milk',
            5: 'Goat Milk (500 ML)',
            6: 'Goat Milk (190 ML)'
        };

        // Mobile menu toggle
        function toggleMenu() {
            const navLinks = document.querySelector('.navbar-links');
            const hamburger = document.querySelector('.hamburger');
            const overlay = document.querySelector('.menu-overlay');
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        }

        function closeMenu() {
            const navLinks = document.querySelector('.navbar-links');
            const hamburger = document.querySelector('.hamburger');
            const overlay = document.querySelector('.menu-overlay');
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Flip card functionality
        document.addEventListener('DOMContentLoaded', function() {
            const flipCards = document.querySelectorAll('.flip-card');
            flipCards.forEach(card => {
                card.addEventListener('click', function() {
                    this.classList.toggle('flipped');
                });
            });
        });

        function openOrderModal() {
            document.getElementById('orderModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeOrderModal() {
            document.getElementById('orderModal').style.display = 'none';
            document.body.style.overflow = 'auto';
            resetOrder();
        }

        window.onclick = function(event) {
            const modal = document.getElementById('orderModal');
            if (event.target == modal) {
                closeOrderModal();
            }
        }

        function changeItemQuantity(milkId, delta) {
            const input = document.getElementById(`qty-${milkId}`);
            let value = parseInt(input.value) || 0;
            value = Math.max(0, value + delta);
            input.value = value;
        }

        function updateItemQuantity(milkId) {
            const input = document.getElementById(`qty-${milkId}`);
            let value = parseInt(input.value) || 0;
            if (value < 0) value = 0;
            input.value = value;
        }

        function addToCart(milkId) {
            const qtyInput = document.getElementById(`qty-${milkId}`);
            const quantity = parseInt(qtyInput.value) || 0;
            
            if (quantity === 0) {
                alert('Please enter a quantity greater than 0');
                return;
            }

            if (cart[milkId]) {
                cart[milkId] += quantity;
            } else {
                cart[milkId] = quantity;
            }

            qtyInput.value = 0;
            updateOrderDisplay();
        }

        function removeFromCart(milkId) {
            delete cart[milkId];
            updateOrderDisplay();
        }

        function updateOrderDisplay() {
            const container = document.getElementById('orderTableContainer');
            const submitBtn = document.getElementById('submitBtn');
            
            if (Object.keys(cart).length === 0) {
                container.innerHTML = '<div class="empty-cart">No items added yet. Select items above to add to your order.</div>';
                submitBtn.disabled = true;
                return;
            }

            let tableHTML = `
                <table class="order-table">
                    <thead>
                        <tr>
                            <th>Milk Type</th>
                            <th style="text-align: right;">Qty</th>
                            <th style="text-align: center;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            for (const [milkId, quantity] of Object.entries(cart)) {
                tableHTML += `
                    <tr>
                        <td>${milkNames[milkId]}</td>
                        <td style="text-align: right;">${quantity}</td>
                        <td style="text-align: center;">
                            <button type="button" class="delete-btn" onclick="removeFromCart(${milkId})">Delete</button>
                        </td>
                    </tr>
                `;
            }

            tableHTML += `
                    </tbody>
                </table>
            `;

            container.innerHTML = tableHTML;
            submitBtn.disabled = false;
        }

        function scrollCarousel(direction) {
            const carousel = document.getElementById('milkCarousel');
            const scrollAmount = 180;
            carousel.scrollBy({
                left: direction * scrollAmount,
                behavior: 'smooth'
            });
        }

        function resetOrder() {
            for (let i = 1; i <= 6; i++) {
                document.getElementById(`qty-${i}`).value = 0;
            }
            Object.keys(cart).forEach(key => delete cart[key]);
            updateOrderDisplay();
            document.getElementById('orderForm').reset();
        }

        function toggleFAQ(element) {
            const answer = element.nextElementSibling;
            const icon = element.querySelector('span');
            
            answer.classList.toggle('active');
            icon.textContent = answer.classList.contains('active') ? '-' : '+';
        }

        document.getElementById('orderForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const fullName = document.getElementById('fullName').value;
            const address = document.getElementById('address').value;
            
            if (Object.keys(cart).length === 0) {
                alert('Please add items to your order!');
                return;
            }

            let orderDetails = '';
            for (const [milkId, quantity] of Object.entries(cart)) {
                orderDetails += `• ${milkNames[milkId]}: ${quantity} bottle(s)%0A`;
            }
            
            const message = `Hi, I would like to order from Farm Lanka. Here's my order:%0A%0A` +
                          `*Customer Details:*%0A` +
                          `Name: ${fullName}%0A` +
                          `Email: ${email}%0A` +
                          `Delivery Address: ${address}%0A%0A` +
                          `*Order Details:*%0A` +
                          orderDetails +
                          `%0AThank you!`;
            
            window.open(`https://wa.me/94756297207?text=${message}`, '_blank');
            
            closeOrderModal();
        });

// Contact Form Handler
// Note: Replace the form action URL in the HTML with your actual email service

// Alternative: Handle form submission with JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // If you want to use a custom email service, uncomment below and add your logic
            // e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Example: Send to your backend API
            // fetch('your-api-endpoint', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(formData)
            // })
            // .then(response => response.json())
            // .then(data => {
            //     alert('Message sent successfully!');
            //     contactForm.reset();
            // })
            // .catch(error => {
            //     alert('Error sending message. Please try again.');
            // });
        });
    }
});

// Instructions for setting up the contact form:
// 
// OPTION 1: Using Formspree (Recommended - Free & Easy)
// 1. Go to https://formspree.io/
// 2. Sign up for a free account
// 3. Create a new form and get your form ID
// 4. Replace 'YOUR_FORM_ID' in the HTML with your actual form ID
//    Example: action="https://formspree.io/f/xwkgwryz"
// 5. The form will automatically send emails to farmlanka@gmail.com
//
// OPTION 2: Using Web3Forms (Another free option)
// 1. Go to https://web3forms.com/
// 2. Get your access key
// 3. Add a hidden input: <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY">
// 4. Change form action to: action="https://api.web3forms.com/submit"
// 5. Add: <input type="hidden" name="redirect" value="https://yourwebsite.com/thank-you.html">
//
// OPTION 3: Direct mailto (Simple but limited)
// Replace the form with:
// <form action="mailto:farmlanka@gmail.com" method="post" enctype="text/plain">
// Note: This opens the user's email client, not ideal for web forms
//
// OPTION 4: Your own backend
// If you have a server, create an API endpoint and use the fetch code above