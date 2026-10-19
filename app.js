const API_URL = 'http://localhost:3000/api/clinic';

const form = document.getElementById('clinicForm');
const tableBody = document.getElementById('clinicTableBody');
const statusText = document.getElementById('status');
const cancelEdit = document.getElementById('cancelEdit');

let editingId = null;

async function loadClinics() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Could not load clinics');

        const clinics = await response.json();
        tableBody.innerHTML = '';

        clinics.forEach(clinic => {
            const row = document.createElement('tr');

            [
                clinic.id,
                clinic.clinic_name,
                clinic.doctor_name,
                clinic.address,
                clinic.phone,
                clinic.services,
                clinic.opening_hours,
                clinic.email
            ].forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value || '';
                row.appendChild(cell);
            });

            const actions = document.createElement('td');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editClinic(clinic);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-btn';
            deleteButton.onclick = () => deleteClinic(clinic.id);

            actions.append(editButton, deleteButton);
            row.appendChild(actions);
            tableBody.appendChild(row);
        });

        statusText.textContent = `${clinics.length} clinic record(s) loaded.`;
    } catch (error) {
        statusText.textContent = 'Could not connect to the API. Make sure the server is running.';
    }
}

form.addEventListener('submit', async event => {
    event.preventDefault();

    const clinic = {
        clinic_name: document.getElementById('clinic_name').value.trim(),
        doctor_name: document.getElementById('doctor_name').value.trim(),
        address: document.getElementById('address').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        services: document.getElementById('services').value.trim(),
        opening_hours: document.getElementById('opening_hours').value.trim(),
        email: document.getElementById('email').value.trim()
    };

    try {
        const url = editingId ? `${API_URL}/${editingId}` : API_URL;
        const method = editingId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clinic)
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || result.message);

        statusText.textContent = result.message || 'Clinic saved successfully.';
        resetForm();
        await loadClinics();
    } catch (error) {
        statusText.textContent = error.message || 'Could not save clinic.';
    }
});

function editClinic(clinic) {
    editingId = clinic.id;

    Object.keys(clinic).forEach(key => {
        const input = document.getElementById(key);
        if (input) input.value = clinic[key] || '';
    });

    document.getElementById('formTitle').textContent = 'Edit Clinic';
    cancelEdit.hidden = false;
    form.scrollIntoView({ behavior: 'smooth' });
}

cancelEdit.addEventListener('click', resetForm);

function resetForm() {
    editingId = null;
    form.reset();
    document.getElementById('formTitle').textContent = 'Add a Clinic';
    cancelEdit.hidden = true;
}

async function deleteClinic(id) {
    if (!confirm('Are you sure you want to delete this clinic?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || result.message);

        statusText.textContent = result.message || 'Clinic deleted successfully.';
        await loadClinics();
    } catch (error) {
        statusText.textContent = error.message || 'Could not delete clinic.';
    }
}

loadClinics();