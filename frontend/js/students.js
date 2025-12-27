/**
 * Students Page - Complete Implementation
 */

function initStudents() {
    console.log('Initializing Students page...');
    
    const container = document.getElementById('all-students-page');
    if (!container) return;
    
    container.innerHTML = `
        <div class="page-header" style="margin-bottom: 24px;">
            <h2>All Students</h2>
            <p>Manage student records</p>
        </div>
        
        <div class="table-header">
            <div class="filter-bar">
                <input type="text" id="searchStudents" class="search-input" placeholder="Search students...">
            </div>
            
            <button class="export-btn" onclick="exportStudents()">
                <i class="fas fa-download"></i> Export
            </button>
        </div>
        
        <div id="studentsTableContainer"></div>
    `;
    
    loadStudents();
    document.getElementById('searchStudents')?.addEventListener('input', loadStudents);
    
    console.log('✅ Students page initialized');
}

function initAddStudent() {
    console.log('Initializing Add Student page...');
    
    const container = document.getElementById('add-student-page');
    if (!container) return;
    
    container.innerHTML = `
        <div class="page-header" style="margin-bottom: 24px;">
            <h2>Add New Student</h2>
            <p>Register a new student</p>
        </div>
        
        <div class="form-container" style="max-width: 700px; margin: 0 auto;">
            <form id="addStudentForm" style="background: white; padding: 32px; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="form-group">
                        <label for="studentName">Full Name *</label>
                        <input type="text" id="studentName" required class="form-input" placeholder="Enter full name">
                    </div>
                    
                    <div class="form-group">
                        <label for="studentEmail">Email *</label>
                        <input type="email" id="studentEmail" required class="form-input" placeholder="student@example.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="studentPhone">Phone *</label>
                        <input type="tel" id="studentPhone" required class="form-input" placeholder="9876543210">
                    </div>
                    
                    <div class="form-group">
                        <label for="studentCourse">Course *</label>
                        <select id="studentCourse" required class="form-input">
                            <option value="">Select Course</option>
                            <option value="NEST">NEST</option>
                            <option value="IAT">IAT</option>
                            <option value="ISI">ISI</option>
                            <option value="CUET">CUET</option>
                        </select>
                    </div>
                </div>
                
                <div style="margin-top: 32px; display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" onclick="document.getElementById('addStudentForm').reset()" class="btn-secondary">
                        <i class="fas fa-redo"></i> Reset
                    </button>
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-user-plus"></i> Add Student
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('addStudentForm')?.addEventListener('submit', handleAddStudent);
    console.log('✅ Add Student page initialized');
}

function loadStudents() {
    const container = document.getElementById('studentsTableContainer');
    if (!container) return;
    
    const searchText = document.getElementById('searchStudents')?.value.toLowerCase() || '';
    
    let students = JSON.parse(localStorage.getItem('students') || '[]');
    
    if (students.length === 0) {
        students = [
            { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', course: 'NEST', joinDate: '2025-01-15', status: 'Active' },
            { id: 2, name: 'Priya Patel', email: 'priya@example.com', phone: '9876543211', course: 'IAT', joinDate: '2025-01-20', status: 'Active' },
            { id: 3, name: 'Amit Kumar', email: 'amit@example.com', phone: '9876543212', course: 'ISI', joinDate: '2025-02-01', status: 'Inactive' }
        ];
    }
    
    let filteredStudents = students.filter(s => 
        !searchText || s.name.toLowerCase().includes(searchText) || s.email.toLowerCase().includes(searchText)
    );
    
    if (filteredStudents.length === 0) {
        container.innerHTML = '<div class="coming-soon">No students found.</div>';
        return;
    }
    
    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Course</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${filteredStudents.map(s => `
                    <tr>
                        <td>#${s.id}</td>
                        <td>${s.name}</td>
                        <td>${s.email}</td>
                        <td>${s.phone}</td>
                        <td><span class="badge badge-primary">${s.course}</span></td>
                        <td>${s.joinDate}</td>
                        <td><span class="status-${s.status.toLowerCase()}">${s.status}</span></td>
                        <td>
                            <button class="action-btn" onclick="viewStudent(${s.id})" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn" onclick="editStudent(${s.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn danger" onclick="deleteStudent(${s.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function handleAddStudent(e) {
    e.preventDefault();
    
    const student = {
        id: Date.now(),
        name: document.getElementById('studentName').value,
        email: document.getElementById('studentEmail').value,
        phone: document.getElementById('studentPhone').value,
        course: document.getElementById('studentCourse').value,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active'
    };
    
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
    
    if (typeof AdminUtils !== 'undefined') {
        AdminUtils.showToast('Student added successfully!', 'success');
    } else {
        alert('Student added successfully!');
    }
    
    document.getElementById('addStudentForm').reset();
}

function viewStudent(id) {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => s.id == id);
    if (student) {
        alert(`Name: ${student.name}\nEmail: ${student.email}\nPhone: ${student.phone}\nCourse: ${student.course}`);
    }
}

function editStudent(id) {
    alert('Edit functionality coming soon!');
}

function deleteStudent(id) {
    if (!confirm('Delete this student?')) return;
    
    let students = JSON.parse(localStorage.getItem('students') || '[]');
    students = students.filter(s => s.id != id);
    localStorage.setItem('students', JSON.stringify(students));
    
    if (typeof AdminUtils !== 'undefined') {
        AdminUtils.showToast('Student deleted!', 'success');
    }
    
    loadStudents();
}

function exportStudents() {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    if (typeof AdminUtils !== 'undefined') {
        AdminUtils.exportToCSV(students, 'students.csv');
    }
}

if (document.getElementById('all-students-page')) initStudents();
if (document.getElementById('add-student-page')) initAddStudent();