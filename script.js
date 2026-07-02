        // Array to store all expenses
        let expenses = [];

        // Get form elements
        const form = document.getElementById('expense-form');
        const expensesContainer = document.getElementById('expenses-container');

        // Category icons mapping
        const categoryIcons = {
            food: 'fas fa-utensils',
            transport: 'fas fa-car',
            entertainment: 'fas fa-gamepad',
            other: 'fas fa-shopping-bag'
        };

        // Set today's date as default
        document.getElementById('date').valueAsDate = new Date();

        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const description = document.getElementById('description').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const category = document.getElementById('category').value;
            const date = document.getElementById('date').value;

            // Create expense object
            const expense = {
                id: Date.now(), // Simple ID generation
                description: description,
                amount: amount,
                category: category,
                date: date
            };

            // Add expense to array
            expenses.push(expense);

            // Update the display
            displayExpenses();
            updateSummary();

            // Reset form
            form.reset();
            document.getElementById('date').valueAsDate = new Date();

            // Show success message
            showNotification('Expense added successfully!');
        });

        // Display all expenses
        function displayExpenses() {
            if (expenses.length === 0) {
                expensesContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-receipt"></i>
                        <h3>No expenses yet</h3>
                        <p>Add your first expense to get started tracking your spending</p>
                    </div>
                `;
                return;
            }

            // Sort expenses by date (newest first)
            const sortedExpenses = expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

            expensesContainer.innerHTML = sortedExpenses.map(expense => `
                <div class="expense-item">
                    <div class="category-icon category-${expense.category}">
                        <i class="${categoryIcons[expense.category]}"></i>
                    </div>
                    <div class="expense-info">
                        <div class="expense-description">${expense.description}</div>
                        <div class="expense-meta">
                            ${formatDate(expense.date)} • ${capitalizeFirst(expense.category)}
                        </div>
                    </div>
                    <div class="expense-amount">-$${expense.amount.toFixed(2)}</div>
                </div>
            `).join('');
        }

        // Update summary cards
        function updateSummary() {
            const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const food = expenses.filter(e => e.category === 'food').reduce((sum, expense) => sum + expense.amount, 0);
            const transport = expenses.filter(e => e.category === 'transport').reduce((sum, expense) => sum + expense.amount, 0);
            const entertainment = expenses.filter(e => e.category === 'entertainment').reduce((sum, expense) => sum + expense.amount, 0);

            document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
            document.getElementById('food-amount').textContent = `$${food.toFixed(2)}`;
            document.getElementById('transport-amount').textContent = `$${transport.toFixed(2)}`;
            document.getElementById('entertainment-amount').textContent = `$${entertainment.toFixed(2)}`;
        }

        // Clear all expenses
        function clearAllExpenses() {
            if (expenses.length === 0) {
                showNotification('No expenses to clear!');
                return;
            }

            if (confirm('Are you sure you want to clear all expenses? This action cannot be undone.')) {
                expenses = [];
                displayExpenses();
                updateSummary();
                showNotification('All expenses cleared!');
            }
        }

        // Utility function to format date
        function formatDate(dateString) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        }

        // Utility function to capitalize first letter
        function capitalizeFirst(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        // Show notification (simple implementation)
        function showNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 16px 24px;
                border-radius: 8px;
                font-weight: 600;
                z-index: 1000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);

            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Initialize the app
        displayExpenses();
        updateSummary();
