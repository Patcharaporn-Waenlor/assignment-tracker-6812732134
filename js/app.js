/* ==========================================================================
   MINIMALIST ASSIGNMENT TRACKER APPLICATION LOGIC
   Handles Task Storage, Overdue Calculation, Task Types, Validation,
   Automatic Date Sorting, Empty State, Calendar & Modals
   ========================================================================== */

const INITIAL_DEMO_TASKS = [
  {
    id: "task-1",
    title: "ออกแบบ ER-Diagram & Database Schema",
    subject: "Database Systems",
    task_type: "individual", // individual | group | project
    description: "ออกแบบ Normalization (3NF) และเขียน DDL สำหรับระบบห้องพยาบาลมหาวิทยาลัย",
    due_date: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    status: "in_progress"
  },
  {
    id: "task-2",
    title: "พัฒนา Web Dashboard ด้วย HTML/CSS/JS",
    subject: "Web Development",
    task_type: "project",
    description: "สร้างระบบติดตามการบ้านพร้อมตัวกรองค้นหาและแบนเนอร์เตือนเดดไลน์",
    due_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    status: "in_progress"
  },
  {
    id: "task-3",
    title: "จัดทำเอกสาร Software Requirement Specification (SRS)",
    subject: "Software Engineering",
    task_type: "group",
    description: "เขียน Use Case Diagrams, Functional & Non-functional Requirements",
    due_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    status: "not_started"
  },
  {
    id: "task-4",
    title: "ทำแบบฝึกหัด Decision Tree & Entropy",
    subject: "AI & Data Science",
    task_type: "individual",
    description: "คำนวณ Information Gain ด้วยมือ และเขียน Python Code ด้วย Scikit-learn",
    due_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], // Overdue
    status: "not_started"
  },
  {
    id: "task-5",
    title: "ส่งสไลด์นำเสนอวิชาการสื่อสารทางเทคโนโลยี",
    subject: "Tech Communication",
    task_type: "individual",
    description: "จัดทำสไลด์ 10 หน้า หัวข้อ Cloud Architecture Trends 2026",
    due_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    status: "done"
  }
];

class HomeworkTrackerApp {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('assignment_tracker_data')) || INITIAL_DEMO_TASKS;
    this.searchQuery = '';
    this.statusFilter = 'all'; // all | not_started | in_progress | done | overdue
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

  // Calculate Overdue status automatically
  getEffectiveStatus(task) {
    if (task.status === 'done') return 'done';

    const todayStr = new Date().toISOString().split('T')[0];
    if (task.due_date < todayStr) {
      return 'overdue';
    }

    return task.status;
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

    clockEl.innerHTML = `<span class="live-dot"></span><i class="fa-regular fa-clock"></i> วัน${dayName}ที่ ${dayDate} ${monthName} ${yearBE} | ${hours}:${minutes}:${seconds} น.`;
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

  // Dashboard Stats Summary (5 Cards)
  renderStats() {
    const total = this.tasks.length;
    const done = this.tasks.filter(t => this.getEffectiveStatus(t) === 'done').length;
    const inProgress = this.tasks.filter(t => this.getEffectiveStatus(t) === 'in_progress').length;
    const notStarted = this.tasks.filter(t => this.getEffectiveStatus(t) === 'not_started').length;
    const overdue = this.tasks.filter(t => this.getEffectiveStatus(t) === 'overdue').length;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-done').textContent = done;
    document.getElementById('stat-progress').textContent = inProgress;
    document.getElementById('stat-pending').textContent = notStarted;
    document.getElementById('stat-overdue').textContent = overdue;
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

  // Filter by Stat Card Click
  filterByStatCard(status) {
    this.statusFilter = status;
    this.activeView = 'list';

    document.querySelectorAll('.pill-btn').forEach(btn => {
      if (btn.getAttribute('data-status') === status) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    document.getElementById('btn-view-list')?.classList.add('active');
    document.getElementById('btn-view-calendar')?.classList.remove('active');

    this.renderAll();
    document.querySelector('.toolbar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Filter & Automatic Sorting Algorithm (Feature 5: Sort by due_date ascending)
  getFilteredTasks() {
    const filtered = this.tasks.filter(t => {
      const query = this.searchQuery.toLowerCase();
      const matchSearch = t.title.toLowerCase().includes(query) ||
                          t.subject.toLowerCase().includes(query) ||
                          (t.description && t.description.toLowerCase().includes(query));

      const effectiveStatus = this.getEffectiveStatus(t);
      const matchStatus = this.statusFilter === 'all' || effectiveStatus === this.statusFilter;
      const matchSubject = this.subjectFilter === 'all' || t.subject === this.subjectFilter;

      return matchSearch && matchStatus && matchSubject;
    });

    // Feature 5: Automatically sort by due_date from closest/overdue (earliest date) to latest
    return filtered.sort((a, b) => a.due_date.localeCompare(b.due_date));
  }

  // Render Task Type Badge Tag
  renderTaskTypeTag(type) {
    const label = type === 'group' ? 'งานกลุ่ม' : type === 'project' ? 'โปรเจกต์' : 'งานเดี่ยว';
    const icon = type === 'group' ? 'fa-users' : type === 'project' ? 'fa-diagram-project' : 'fa-user';
    return `<span class="task-type-tag type-${type || 'individual'}"><i class="fa-solid ${icon}"></i> ${label}</span>`;
  }

  // Render Tasks List Table/Cards (Feature 6: Clean Empty State)
  renderTasks() {
    const listContainer = document.getElementById('task-list-container');
    if (!listContainer) return;

    const filtered = this.getFilteredTasks();

    // Feature 6: Empty state when no tasks match filter/search
    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <i class="fa-regular fa-folder-open"></i>
          <p>ไม่พบงานที่ค้นหา</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(t => {
      const effectiveStatus = this.getEffectiveStatus(t);

      let statusBadgeHTML = '';
      if (effectiveStatus === 'done') {
        statusBadgeHTML = `<span class="status-badge done"><i class="fa-solid fa-circle-check"></i> ส่งแล้ว</span>`;
      } else if (effectiveStatus === 'overdue') {
        statusBadgeHTML = `<span class="status-badge overdue"><i class="fa-solid fa-clock-rotate-left"></i> เลยกำหนดส่ง</span>`;
      } else if (effectiveStatus === 'in_progress') {
        statusBadgeHTML = `<span class="status-badge in_progress"><i class="fa-solid fa-clock"></i> กำลังทำ</span>`;
      } else {
        statusBadgeHTML = `<span class="status-badge not_started"><i class="fa-solid fa-circle-exclamation"></i> ยังไม่เริ่ม</span>`;
      }

      return `
        <div class="task-item" id="task-${t.id}">
          <div class="task-content">
            <div class="task-header-row">
              <span class="subject-badge">${t.subject}</span>
              ${this.renderTaskTypeTag(t.task_type)}
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
      html += `<div class="calendar-day-cell empty" style="opacity: 0.2; background: transparent; border: none; cursor: default;"></div>`;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Day slots
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      
      const dayTasks = this.tasks.filter(t => t.due_date === dateStr);
      const hasTasks = dayTasks.length > 0;

      // Small Colored Dots
      const dotsHTML = dayTasks.map(t => {
        const effStatus = this.getEffectiveStatus(t);
        return `<span class="calendar-dot ${effStatus}" title="${t.title}"></span>`;
      }).join('');

      // Preview Task Pills (Up to 2)
      const previewPillsHTML = dayTasks.slice(0, 2).map(t => {
        const effStatus = this.getEffectiveStatus(t);
        return `<div class="calendar-task-pill ${effStatus}">${t.title}</div>`;
      }).join('');

      html += `
        <div class="calendar-day-cell ${isToday ? 'today' : ''} ${hasTasks ? 'has-tasks' : ''}" onclick="app.openDayTasksModal('${dateStr}')" title="คลิกเพื่อดูงานประจำวันที่ ${d}">
          <div class="calendar-day-top">
            <span class="calendar-day-number">${d}</span>
            ${hasTasks ? `<span class="calendar-task-count-badge">${dayTasks.length} งาน</span>` : ''}
          </div>
          <div class="calendar-tasks-preview">
            ${previewPillsHTML}
          </div>
          ${hasTasks ? `<div class="calendar-dots-bar">${dotsHTML}</div>` : ''}
        </div>
      `;
    }

    grid.innerHTML = html;
  }

  navigateCalendar(delta) {
    this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + delta);
    this.renderCalendar();
  }

  // Open Modal for Tasks of a Specific Day
  openDayTasksModal(dateStr) {
    const dayTasks = this.tasks.filter(t => t.due_date === dateStr);
    
    const [y, m, d] = dateStr.split('-');
    const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const formattedDate = `${parseInt(d)} ${thaiMonths[parseInt(m) - 1]} ${parseInt(y) + 543}`;

    const titleEl = document.getElementById('day-modal-title');
    const contentEl = document.getElementById('day-modal-content');
    if (!titleEl || !contentEl) return;

    titleEl.innerHTML = `<i class="fa-regular fa-calendar-days"></i> กำหนดส่งวันที่ ${formattedDate}`;

    if (dayTasks.length === 0) {
      contentEl.innerHTML = `
        <div class="empty-state" style="padding: 32px 16px;">
          <i class="fa-regular fa-calendar-check" style="font-size: 2rem;"></i>
          <p style="margin-bottom: 16px;">ไม่มีงานที่มีกำหนดส่งในวันที่ ${formattedDate}</p>
          <button class="btn-primary" onclick="app.closeDayModal(); app.openAddModalWithDate('${dateStr}');">
            <i class="fa-solid fa-plus"></i> เพิ่มการบ้านในวันนี้
          </button>
        </div>
      `;
    } else {
      contentEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px; max-height: 60vh; overflow-y: auto; padding-right: 4px;">
          ${dayTasks.map(t => {
            const effStatus = this.getEffectiveStatus(t);
            let badgeHTML = '';
            if (effStatus === 'done') badgeHTML = `<span class="status-badge done">ส่งแล้ว</span>`;
            else if (effStatus === 'overdue') badgeHTML = `<span class="status-badge overdue">เลยกำหนดส่ง</span>`;
            else if (effStatus === 'in_progress') badgeHTML = `<span class="status-badge in_progress">กำลังทำ</span>`;
            else badgeHTML = `<span class="status-badge not_started">ยังไม่เริ่ม</span>`;

            return `
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px;">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 6px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="subject-badge">${t.subject}</span>
                    ${this.renderTaskTypeTag(t.task_type)}
                  </div>
                  ${badgeHTML}
                </div>
                <div style="font-weight: 700; color: #0f172a; margin-bottom: 4px;">${t.title}</div>
                <div style="font-size: 0.85rem; color: #475569; margin-bottom: 10px;">${t.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</div>
                <div style="display: flex; align-items: center; justify-content: space-between; pt: 8px; border-top: 1px solid #e2e8f0;">
                  <select class="status-select" onchange="app.updateTaskStatus('${t.id}', this.value); app.openDayTasksModal('${dateStr}');">
                    <option value="not_started" ${t.status === 'not_started' ? 'selected' : ''}>ยังไม่เริ่ม</option>
                    <option value="in_progress" ${t.status === 'in_progress' ? 'selected' : ''}>กำลังทำ</option>
                    <option value="done" ${t.status === 'done' ? 'selected' : ''}>ส่งแล้ว</option>
                  </select>
                  <div>
                    <button class="icon-btn" title="แก้ไข" onclick="app.closeDayModal(); app.openEditModal('${t.id}');">
                      <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="icon-btn delete" title="ลบ" onclick="app.deleteTask('${t.id}'); app.openDayTasksModal('${dateStr}');">
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    document.getElementById('day-tasks-modal')?.classList.add('active');
  }

  closeDayModal() {
    document.getElementById('day-tasks-modal')?.classList.remove('active');
  }

  openAddModalWithDate(dateStr) {
    this.openAddModal();
    document.getElementById('form-duedate').value = dateStr;
  }

  // Update Status Action
  updateTaskStatus(id, newStatus) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    task.status = newStatus;
    this.saveTasks();
    this.renderAll();
  }

  // Reset Title Validation Error UI
  resetFormValidation() {
    const errorMsg = document.getElementById('title-error-msg');
    const titleInput = document.getElementById('form-title');
    if (errorMsg) errorMsg.style.display = 'none';
    if (titleInput) titleInput.style.borderColor = '';
  }

  // Open Add Modal
  openAddModal() {
    this.editingTaskId = null;
    document.getElementById('modal-title').textContent = 'เพิ่มการบ้าน / งานใหม่';
    document.getElementById('task-form').reset();
    document.getElementById('form-id').value = '';
    document.getElementById('form-type').value = 'individual';
    document.getElementById('form-duedate').value = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    this.resetFormValidation();
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
    document.getElementById('form-type').value = task.task_type || 'individual';
    document.getElementById('form-duedate').value = task.due_date;
    document.getElementById('form-status').value = task.status;
    document.getElementById('form-desc').value = task.description || '';

    this.resetFormValidation();
    document.getElementById('task-modal').classList.add('active');
  }

  // Close Modal
  closeModal() {
    document.getElementById('task-modal').classList.remove('active');
    this.resetFormValidation();
  }

  // Feature 4: Save Task Form Submission with Validation
  saveTaskForm(event) {
    event.preventDefault();

    const titleInput = document.getElementById('form-title');
    const title = titleInput.value.trim();
    const errorMsg = document.getElementById('title-error-msg');

    // Feature 4: Validation - Cannot save if title is empty or blank spaces
    if (!title) {
      if (errorMsg) errorMsg.style.display = 'block';
      titleInput.style.borderColor = '#ef4444';
      titleInput.focus();
      return;
    } else {
      if (errorMsg) errorMsg.style.display = 'none';
      titleInput.style.borderColor = '';
    }

    const subject = document.getElementById('form-subject').value.trim() || 'ทั่วไป';
    const task_type = document.getElementById('form-type').value;
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
          task_type,
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
        task_type,
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

  // Feature 4: Delete Task with Confirmation Popup
  deleteTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    if (confirm(`ยืนยันลบงาน "${task.title}" หรือไม่?`)) {
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

    document.getElementById('form-title')?.addEventListener('input', () => {
      this.resetFormValidation();
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
