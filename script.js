const cart = {};
const milkNames = {
    1: 'Chocolate Goat Milk (190ml)',
    2: 'Strawberry Goat Milk (190ml)',
    3: 'Vanilla Goat Milk (190ml)',
    4: 'Almond Goat Milk (190ml)',
    5: 'Goat Milk (500ml)',
    6: 'Goat Milk (190ml)'
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

// Modal functions
function openOrderModal() {
    document.getElementById('orderModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    resetOrder();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target == modal) {
        closeOrderModal();
    }
}

// Quantity control functions
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

// Cart management functions
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

// Carousel scroll function
function scrollCarousel(direction) {
    const carousel = document.getElementById('milkCarousel');
    const scrollAmount = 180;
    carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Reset order function
function resetOrder() {
    for (let i = 1; i <= 6; i++) {
        const qtyInput = document.getElementById(`qty-${i}`);
        if (qtyInput) {
            qtyInput.value = 0;
        }
    }
    Object.keys(cart).forEach(key => delete cart[key]);
    updateOrderDisplay();
    
    const form = document.getElementById('orderForm');
    if (form) {
        form.reset();
    }
}

// Form submission - WhatsApp Order
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const address = document.getElementById('address').value.trim();
            
            // Validate required fields
            if (!fullName) {
                alert('Please enter your full name!');
                return;
            }
            
            if (!phone) {
                alert('Please enter your phone number!');
                return;
            }
            
            if (!address) {
                alert('Please enter your delivery address!');
                return;
            }
            
            if (Object.keys(cart).length === 0) {
                alert('Please add items to your order!');
                return;
            }

            // Build order details
            let orderDetails = '';
            for (const [milkId, quantity] of Object.entries(cart)) {
                orderDetails += `• ${milkNames[milkId]}: ${quantity} bottle(s)%0A`;
            }
            
            // Build WhatsApp message
            const message = `*New Order from Farm Lanka Website*%0A%0A` +
                          `*Customer Details:*%0A` +
                          `Name: ${encodeURIComponent(fullName)}%0A` +
                          `Phone: ${encodeURIComponent(phone)}%0A` +
                          (email ? `Email: ${encodeURIComponent(email)}%0A` : '') +
                          `Delivery Address: ${encodeURIComponent(address)}%0A%0A` +
                          `*Order Details:*%0A` +
                          orderDetails +
                          `%0AThank you!`;
            
            // Open WhatsApp with the message
            const whatsappNumber = '94756297207'; // Farm Lanka WhatsApp number
            window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
            
            // Show success message
            alert('Opening WhatsApp to send your order...');
            
            // Close modal and reset form
            setTimeout(() => {
                closeOrderModal();
            }, 500);
        });
    }
});
