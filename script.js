document.addEventListener('DOMContentLoaded', () => {
    const budgetForm = document.getElementById('budget-form');
    const descriptionInput = document.getElementById('description-input');
    const amountInput = document.getElementById('amount-input');
    const typeSelect = document.getElementById('type-select');
    const monthSelect = document.getElementById('month-select');
    const incomeList = document.getElementById('income-list');
    const expenseList = document.getElementById('expense-list');
    const totalIncomeElement = document.getElementById('total-income');
    const totalExpensesElement = document.getElementById('total-expenses');
    const balanceElement = document.getElementById('balance');

    let totalIncome = 0;
    let totalExpenses = 0;

    budgetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addItem(descriptionInput.value, parseFloat(amountInput.value), typeSelect.value, monthSelect.value);
        descriptionInput.value = '';
        amountInput.value = '';
        monthSelect.value = '';
        typeSelect.value = '';
    });

    incomeList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            deleteItem(e.target.parentElement, 'income');
        }
    });

    expenseList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            deleteItem(e.target.parentElement, 'expense');
        }
    });

    function addItem(description, amount, type, month) {
        if (description.trim() === '' || isNaN(amount) || amount <= 0 || month === '') return;

        const li = document.createElement('li');
        li.textContent = `${month} - ${description}: $${amount.toFixed(2)}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        li.appendChild(deleteButton);

        if (type === 'income') {
            incomeList.appendChild(li);
            totalIncome += amount;
        } else {
            expenseList.appendChild(li);
            totalExpenses += amount;
        }

        updateSummary();
    }

    function deleteItem(itemElement, type) {
        const amount = parseFloat(itemElement.textContent.split(': $')[1]);

        if (type === 'income') {
            totalIncome -= amount;
            incomeList.removeChild(itemElement);
        } else {
            totalExpenses -= amount;
            expenseList.removeChild(itemElement);
        }

        updateSummary();
    }

    function updateSummary() {
        const balance = totalIncome - totalExpenses;
        totalIncomeElement.textContent = totalIncome.toFixed(2);
        totalExpensesElement.textContent = totalExpenses.toFixed(2);
        balanceElement.textContent = balance.toFixed(2);
    }

    document.getElementById('save-plan').addEventListener('click', function() {
        html2canvas(document.getElementById('budget-container')).then(function(canvas) {
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10);
            pdf.save('budget-plan.pdf');
        });
    });
});
