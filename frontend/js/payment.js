window.PAYMENT = {
    currentTestId: null,
    currentPrice: null,

    // Triggered when user clicks "Execute Purchase"
    executePurchase: function(testId, price) {
        this.currentTestId = testId;
        this.currentPrice = price;

        // SMART CHECK: Is user already logged in?
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const storedEmail = localStorage.getItem("userEmail");

        if (isLoggedIn === "true" && storedEmail) {
            // YES: Skip modal, go straight to payment with stored email
            this.startRazorpay(storedEmail);
        } else {
            // NO: Show the Email Modal
            document.getElementById('emailModal').style.display = 'flex';
        }
    },

    // Triggered when user enters email in Modal
    handleModalSubmit: function() {
        const email = document.getElementById('modalUserEmail').value;
        if (!email) {
            alert("Please enter a valid email.");
            return;
        }
        // Save this email for future use (Auto-Login logic)
        localStorage.setItem("userEmail", email);
        
        // Hide modal and start payment
        document.getElementById('emailModal').style.display = 'none';
        this.startRazorpay(email);
    },

    startRazorpay: function(email) {
        const options = {
            "key": "YOUR_RAZORPAY_KEY_ID", // Replace with actual Key ID
            "amount": this.currentPrice * 100,
            "currency": "INR",
            "name": "IIN Test Series",
            "description": `Access to ${this.currentTestId}`,
            "handler": async function (response) {
                // Payment Success!
                await window.PAYMENT.verifyPayment(response, email);
            },
            "prefill": {
                "email": email
            },
            "theme": {
                "color": "#3b82f6"
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
    },

    verifyPayment: async function(response, email) {
        try {
            const result = await axios.post('https://iin-production.up.railway.app/api/paymentverification', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: email
            });

            if (result.data.success) {
                // 1. Store Session Data (Auto-Login the user)
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userEmail", email);
                localStorage.setItem("userToken", result.data.token);
                
                // 2. Mark test as purchased locally
                this.markAsPurchased(this.currentTestId);

                // 3. Show Success Modal
                document.getElementById('finalTokenDisplay').innerText = result.data.token;
                document.getElementById('successModal').style.display = 'flex';
                
                // 4. Update Navbar immediately without reload
                if(window.checkUserSession) window.checkUserSession();
            }
        } catch (error) {
            alert("Verification Failed. Please contact support.");
            console.error(error);
        }
    },

    markAsPurchased: function(testId) {
        const btn = document.getElementById(`btn-${testId}`);
        if (btn) {
            btn.innerText = "Authorized ✓";
            btn.disabled = true;
            btn.classList.add('purchased');
            btn.style.background = "rgba(16, 185, 129, 0.2)";
            btn.style.color = "#10b981";
            btn.style.border = "1px solid #10b981";
        }
        
        // Save to local history
        let purchased = JSON.parse(localStorage.getItem("purchasedTests") || "[]");
        if (!purchased.includes(testId)) {
            purchased.push(testId);
            localStorage.setItem("purchasedTests", JSON.stringify(purchased));
        }
    }
};