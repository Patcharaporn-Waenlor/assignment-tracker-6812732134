/* ==========================================================================
   MINIMALIST ASSIGNMENT TRACKER APPLICATION LOGIC
   Handles Task Storage, Live Header Clock, Calendar View, Filters & Form Modals
   ========================================================================== */

const INITIAL_DEMO_TASKS = [
  {
    id: "task-1",
    title: "ออกแบบ ER-Diagram & Database Schema",
    subject: "Database Systems",
    description: "ออกแบบ Normalization (3NF) และเขียน DDL สำหรับระบบห้องพยาบาลมหาวิทยาลัย",
    due_date: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    status: "in_progress"
  },
  {
    id: "task-2",
    title: "พัฒนา Web Dashboard ด้วย HTML/CSS/JS",
    subject: "Web Development",
    description: "สร้างระบบติดตามการบ้านพร้อมตัวกรองค้นหาและแบนเนอร์เตือนเดดไลน์",
    due_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    status: "in_progress"
  },
  {
    id: "task-3",
    title: "จัดทำเอกสาร Software Requirement Specification (SRS)",
    subject: "Software Engineering",
    description: "เขียน Use Case Diagrams, Functional & Non-functional Requirements",
    due_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    status: "not_started"
  },
  {
    id: "task-4",
    title: "ทำแบบฝึกหัด Decision Tree & Entropy",
    subject: "AI & Data Science",
    description: "คำนวณ Information Gain ด้วยมือ และเขียน Python Code ด้วย Scikit-learn",
    due_date: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0],
    status: "not_started"
  },
  {
    id: "task-5",
    title: "ส่งสไลด์นำเสนอวิชาการสื่อสารทางเทคโนโลยี",
    subject: "Tech Communication",
    description: "จัดทำสไลด์ 10 หน้า หัวข้อ Cloud Architecture Trends 2026",
    due_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    status: "done"
  }
];

class HomeworkTrackerApp {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('assignment_tracker_data')) || INITIAL_DEMO_TASKS;
    this.searchQuery = '';
    this.statusFilter = 'all'; // all | not_started | in_progress | done
    this.subjectFilter = 'all';
    this.activeView = 'list'; // list | calendar
    this.currentCalendarDate = new Date();
    this.editingTaskId = null;

    this.init();
  }

  init() {
    this.saveTasks();
    this.startLiveClock();
    this.setupEventListeners();
    this.renderAll();
  }

  saveTasks() {
    localStorage.setItem('assignment_tracker_data', JSON.stringify(this.tasks));
  }

  // Live Date / Month / Year / Time Header Ticker
  startLiveClock() {
    this.updateClockDisplay();
    setInterval(() => this.updateClockDisplay(), 1000);
  }

  updateClockDisplay() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;

    const now = new Date();
    const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

    const dayName = thaiDays[now.getDay()];
    const dayDate = now.getDate();
    const monthName = thaiMonths[now.getMonth()];
    const yearBE = now.getFullYear() + 543;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    clockEl.innerHTML = `<i class="fa-regular fa-clock"></i> วัน${dayName}ที่ ${dayDate} ${monthName} ${yearBE} | ${hours}:${minutes}:${seconds} น.`;
  }

  renderAll() {
    this.renderStats();
    this.renderUrgentBanner();
    this.populateSubjectSelect();
    
    if (this.activeView === 'list') {
      document.getElementById('list-view-section').style.display = 'block';
      document.getElementById('calendar-view-section').style.display = 'none';
      this.renderTasks();
    } else {
      document.getElementById('list-view-section').style.display = 'none';
      document.getElementById('calendar-view-section').style.display = 'block';
      this.renderCalendar();
    }
  }

  // Dashboard Stats Summary
  renderStats() {
    const total = this.tasks.length;
    const done = this.tasks.filter(t => t.status === 'done').length;
    const inProgress = this.tasks.filter(t => t.status === 'in_progress').length;
    const notStarted = this.tasks.filter(t => t.status === 'not_started').length;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-done').textContent = done;
    document.getElementById('stat-progress').textContent = inProgress;
    document.getElementById('stat-pending').textContent = notStarted;
  }

  // Urgent Deadline Alert Banner (within 48 hours)
  renderUrgentBanner() {
    const container = document.getElementById('urgent-banner-container');
    if (!container) return;

    const now = new Date();
    const urgentTasks = this.tasks.filter(t => {
      if (t.status === 'done') return false;
      const due = new Date(`${t.due_date}T23:59:59`);
      const diffHours = (due - now) / (1000 * 60 * 60);
      return diffHours > 0 && diffHours <= 48;
    });

    if (urgentTasks.length === 0) {
      container.innerHTML = '';
      return;
    }

    const taskItemsHTML = urgentTasks.map(t => {
      const due = new Date(`${t.due_date}T23:59:59`);
      const diffHours = Math.ceil((due - now) / (1000 * 60 * 60));
      const daysLeft = Math.ceil(diffHours / 24);

      return `
        <div class="urgent-item">
          <div class="urgent-item-info">
            <strong>${t.title}</strong>
            <span style="color: var(--text-secondary);">(${t.subject})</span>
          </div>
          <div class="urgent-badge-time">
            <i class="fa-regular fa-clock"></i> 
            ${daysLeft <= 1 ? `เหลืออีกประมาณ ${diffHours} ชั่วโมง!` : `เหลืออีก ${daysLeft} วัน`}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="urgent-banner">
        <div class="urgent-banner-title">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>แจ้งเตือนเดดไลน์ด่วน! มี ${urgentTasks.length} งานกำลังจะถึงกำหนดส่ง</span>
        </div>
        <div class="urgent-task-list">
          ${taskItemsHTML}
        </div>
      </div>
    `;
  }

  // Populate unique subjects in filter dropdown
  populateSubjectSelect() {
    const filterSelect = document.getElementById('filter-subject');
    if (!filterSelect) return;

    const subjects = Array.from(new Set(this.tasks.map(t => t.subject)));
    const currentVal = filterSelect.value;

    filterSelect.innerHTML = '<option value="all">ทุกรายวิชา</option>' +
      subjects.map(s => `<option value="${s}">${s}</option>`).join('');

    filterSelect.value = currentVal;
  }

  // Filter Tasks Algorithm
  getFilteredTasks() {
    return this.tasks.filter(t => {
      const query = this.searchQuery.toLowerCase();
      const matchSearch = t.title.toLowerCase().includes(query) ||
                          t.subject.toLowerCase().includes(query) ||
                          (t.description && t.description.toLowerCase().includes(query));

      const matchStatus = this.statusFilter === 'all' || t.status === this.statusFilter;
      const matchSubject = this.subjectFilter === 'all' || t.subject === this.subjectFilter;

      return matchSearch && matchStatus && matchSubject;
    });
  }

  // Render Tasks List Table/Cards
  renderTasks() {
    const listContainer = document.getElementById('task-list-container');
    if (!listContainer) return;

    const filtered = this.getFilteredTasks();

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <i class="fa-regular fa-folder-open"></i>
          <p>ไม่พบรายการการบ้านที่ตรงกับเงื่อนไขที่เลือก</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(t => {
      let statusBadgeHTML = '';
      if (t.status === 'done') {
        statusBadgeHTML = `<span class="status-badge done"><i class="fa-solid fa-circle-check"></i> ส่งแล้ว</span>`;
      } else if (t.status === 'in_progress') {
        statusBadgeHTML = `<span class="status-badge in_progress"><i class="fa-solid fa-clock"></i> กำลังทำ</span>`;
      } else {
        statusBadgeHTML = `<span class="status-badge not_started"><i class="fa-solid fa-circle-exclamation"></i> ยังไม่เริ่ม</span>`;
      }

      return `
        <div class="task-item" id="task-${t.id}">
          <div class="task-content">
            <div class="task-header-row">
              <span class="subject-badge">${t.subject}</span>
              ${statusBadgeHTML}
            </div>
            <div class="task-title">${t.title}</div>
            <div class="task-description">${t.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</div>
            <div class="task-meta">
              <span><i class="fa-regular fa-calendar"></i> กำหนดส่ง: <strong>${t.due_date}</strong></span>
            </div>
          </div>

          <div class="task-actions">
            <select class="status-select" onchange="app.updateTaskStatus('${t.id}', this.value)">
              <option value="not_started" ${t.status === 'not_started' ? 'selected' : ''}>ยังไม่เริ่ม</option>
              <option value="in_progress" ${t.status === 'in_progress' ? 'selected' : ''}>กำลังทำ</option>
              <option value="done" ${t.status === 'done' ? 'selected' : ''}>ส่งแล้ว</option>
            </select>

            <button class="icon-btn" title="แก้ไข" onclick="app.openEditModal('${t.id}')">
              <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button class="icon-btn delete" title="ลบ" onclick="app.deleteTask('${t.id}')">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Academic Calendar Renderer
  renderCalendar() {
    const grid = document.getElementById('calendar-grid-container');
    const monthLabel = document.getElementById('calendar-month-label');
    if (!grid || !monthLabel) return;

    const year = this.currentCalendarDate.getFullYear();
    const month = this.currentCalendarDate.getMonth();

    const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    monthLabel.textContent = `${thaiMonths[month]} ${year + 543}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = `
      <div class="calendar-day-header">อา.</div>
      <div class="calendar-day-header">จ.</div>
      <div class="calendar-day-header">อ.</div>
      <div class="calendar-day-header">พ.</div>
      <div class="calendar-day-header">พฤ.</div>
      <div class="calendar-day-header">ศ.</div>
      <div class="calendar-day-header">ส.</div>
    `;

    // Empty lead slots
    for (let i = 0; i < firstDay; i++) {
      html += `<div class="calendar-day-cell empty" style="opacity: 0.3; background: transparent; border: none;"></div>`;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Day slots
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      
      const dayTasks = this.tasks.filter(t => t.due_date === dateStr);

      html += `
        <div class="calendar-day-cell ${isToday ? 'today' : ''}">
          <div class="calendar-day-number">${d}</div>
          ${dayTasks.map(t => `
            <div class="calendar-task-pill ${t.status}" onclick="app.openEditModal('${t.id}')" title="${t.title} (${t.subject})">
              ${t.title}
            </div>
          `).join('')}
        </div>
      `;
    }

    grid.innerHTML = html;
  }

  navigateCalendar(delta) {
    this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + delta);
    this.renderCalendar();
  }

  // Update Status Action
  updateTaskStatus(id, newStatus) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    task.status = newStatus;
    this.saveTasks();
    this.renderAll();
  }

  // Open Add Modal
  openAddModal() {
    this.editingTaskId = null;
    document.getElementById('modal-title').textContent = 'เพิ่มการบ้าน / งานใหม่';
    document.getElementById('task-form').reset();
    document.getElementById('form-id').value = '';
    document.getElementById('form-duedate').value = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    document.getElementById('task-modal').classList.add('active');
  }

  // Open Edit Modal
  openEditModal(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    this.editingTaskId = id;
    document.getElementById('modal-title').textContent = 'แก้ไขรายการการบ้าน';
    document.getElementById('form-id').value = task.id;
    document.getElementById('form-title').value = task.title;
    document.getElementById('form-subject').value = task.subject;
    document.getElementById('form-duedate').value = task.due_date;
    document.getElementById('form-status').value = task.status;
    document.getElementById('form-desc').value = task.description || '';

    document.getElementById('task-modal').classList.add('active');
  }

  // Close Modal
  closeModal() {
    document.getElementById('task-modal').classList.remove('active');
  }

  // Save Task Form Submission
  saveTaskForm(event) {
    event.preventDefault();

    const title = document.getElementById('form-title').value;
    const subject = document.getElementById('form-subject').value;
    const due_date = document.getElementById('form-duedate').value;
    const status = document.getElementById('form-status').value;
    const description = document.getElementById('form-desc').value;

    if (this.editingTaskId) {
      const idx = this.tasks.findIndex(t => t.id === this.editingTaskId);
      if (idx !== -1) {
        this.tasks[idx] = {
          ...this.tasks[idx],
          title,
          subject,
          due_date,
          status,
          description
        };
      }
    } else {
      const newTask = {
        id: `task-${Date.now()}`,
        title,
        subject,
        due_date,
        status,
        description
      };
      this.tasks.unshift(newTask);
    }

    this.saveTasks();
    this.closeModal();
    this.renderAll();
  }

  // Delete Task
  deleteTask(id) {
    if (confirm('คุณต้องการลบการบ้านชิ้นนี้ใช่หรือไม่?')) {
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.saveTasks();
      this.renderAll();
    }
  }

  // Event Listeners Registration
  setupEventListeners() {
    document.getElementById('search-input')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderTasks();
    });

    document.getElementById('filter-subject')?.addEventListener('change', (e) => {
      this.subjectFilter = e.target.value;
      this.renderTasks();
    });

    document.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.statusFilter = e.currentTarget.getAttribute('data-status');
        this.renderTasks();
      });
    });

    // View Mode Toggle (List vs Calendar)
    document.getElementById('btn-view-list')?.addEventListener('click', () => {
      this.activeView = 'list';
      document.getElementById('btn-view-list').classList.add('active');
      document.getElementById('btn-view-calendar').classList.remove('active');
      this.renderAll();
    });

    document.getElementById('btn-view-calendar')?.addEventListener('click', () => {
      this.activeView = 'calendar';
      document.getElementById('btn-view-calendar').classList.add('active');
      document.getElementById('btn-view-list').classList.remove('active');
      this.renderAll();
    });
  }
}

// Global App Instance
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new HomeworkTrackerApp();
});
