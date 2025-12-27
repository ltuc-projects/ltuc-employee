document.addEventListener('DOMContentLoaded', () => {
    const employeeForm = document.getElementById('employee-form');
    const employeeList = document.getElementById('employee-list');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const toast = document.getElementById('toast');

    let employees = JSON.parse(localStorage.getItem('ltuc_employees')) || [];
    let isEditing = false;
    let currentEditId = null;

    // --- Core Functions ---

    function saveToLocalStorage() {
        localStorage.setItem('ltuc_employees', JSON.stringify(employees));
    }

    function renderEmployees() {
        employeeList.innerHTML = '';
        
        if (employees.length === 0) {
            employeeList.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748b;">No employees found.</td></tr>`;
            return;
        }

        employees.forEach(emp => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.age}</td>
                <td>${emp.address}</td>
                <td class="actions">
                    <button class="btn btn-edit" onclick="editEmployee('${emp.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteEmployee('${emp.id}')">Delete</button>
                </td>
            `;
            employeeList.appendChild(tr);
        });
    }

    window.showToast = (message, type = 'info') => {
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    };

    function resetForm() {
        employeeForm.reset();
        document.getElementById('edit-id').value = '';
        formTitle.textContent = 'Add New Employee';
        submitBtn.textContent = 'Save Employee';
        cancelBtn.classList.add('hidden');
        isEditing = false;
        currentEditId = null;
    }

    // --- CRUD Actions ---

    employeeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('emp-id').value.trim();
        const name = document.getElementById('name').value.trim();
        const age = document.getElementById('age').value.trim();
        const address = document.getElementById('address').value.trim();

        if (!id || !name || !age || !address) {
            showToast('Please fill all fields', 'error');
            return;
        }

        if (isEditing) {
            // Update existing
            const index = employees.findIndex(emp => emp.id === currentEditId);
            if (index !== -1) {
                // Check if new ID already exists and it's not the current one
                if (id !== currentEditId && employees.some(emp => emp.id === id)) {
                    showToast('Employee ID already exists', 'error');
                    return;
                }
                
                employees[index] = { id, name, age, address };
                showToast('Employee updated successfully', 'success');
            }
        } else {
            // Create new
            if (employees.some(emp => emp.id === id)) {
                showToast('Employee ID already exists', 'error');
                return;
            }
            employees.push({ id, name, age, address });
            showToast('Employee added successfully', 'success');
        }

        saveToLocalStorage();
        renderEmployees();
        resetForm();
    });

    window.editEmployee = (id) => {
        const emp = employees.find(e => e.id === id);
        if (emp) {
            document.getElementById('emp-id').value = emp.id;
            document.getElementById('name').value = emp.name;
            document.getElementById('age').value = emp.age;
            document.getElementById('address').value = emp.address;
            
            formTitle.textContent = 'Edit Employee';
            submitBtn.textContent = 'Update Employee';
            cancelBtn.classList.remove('hidden');
            isEditing = true;
            currentEditId = id;

            // Scroll to form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    window.deleteEmployee = (id) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            employees = employees.filter(emp => emp.id !== id);
            saveToLocalStorage();
            renderEmployees();
            showToast('Employee deleted', 'info');
        }
    };

    cancelBtn.addEventListener('click', resetForm);

    // Initial Render
    renderEmployees();
});
