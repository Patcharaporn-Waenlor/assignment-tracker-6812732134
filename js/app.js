/* ==========================================================================
   ASSIGNMENT TRACKER APPLICATION LOGIC
   Handles LocalStorage, State Management, UI Renderers, AI Priority Engine,
   Calendar, Deadline Alerts, and Filters.
   ========================================================================== */

// Sample Initial Demo Data
const initialTasks = [
  {
    id: "task-101",
    title: "ออกแบบ ER-Diagram & Database Schema",
    subject: "Database Systems",
    type: "individual", // individual | group | project
    dueDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0], // 1 day remaining
    dueTime: "23:59",
    status: "in-progress", // to-do | in-progress | completed
    priority: "high", // low | medium | high
    difficulty: 4, // 1 - 5
    weight: 15, // score weight %
    description: "ออกแบบ Normalization (3NF) และเขียน DDL สำหรับระบบห้องพยาบาลมหาวิทยาลัย",
    subtasks: [
      { id: "st-1", text: "วาด Conceptual ER Diagram", done: true },
      { id: "st-2", text: "แปลงเป็น Relational Schema", done: true },
      { id: "st-3", text: "เขียนไฟล์ SQL Script schema.sql", done: false }
    ],
    members: ["ตนเอง"]
  },
  {
    id: "task-102",
    title: "พัฒนา Web Frontend ด้วย HTML/CSS/JS",
    subject: "Web Development",
    type: "project",
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    dueTime: "18:00",
    status: "in-progress",
    priority: "high",
    difficulty: 5,
    weight: 25,
    description: "สร้างระบบติดตามการบ้านพร้อมความสวยงามและฟังก์ชันการค้นหากรองข้อมูล",
    subtasks: [
      { id: "st-4", text: "ออกแบบ UI/UX Glassmorphic Theme", done: true },
      { id: "st-5", text: "พัฒนา Dashboard & Kanban Board", done: true },
      { id: "st-6", text: "ทำ AI Priority Scheduler & Calendar", done: true }
    ],
    members: ["ตนเอง", "พัชราภรณ์", "ปิยพร"]
  },
  {
    id: "task-103",
    title: "ส่งรายงาน Software Requirement Specification (SRS)",
    subject: "Software Engineering",
    type: "group",
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    dueTime: "12:00",
    status: "to-do",
    priority: "medium",
    difficulty: 3,
    weight: 10,
    description: "เขียน Use Case Diagrams, Functional & Non-functional requirements",
    subtasks: [
      { id: "st-7", text: "รวบรวม User Stories", done: false },
      { id: "st-8", text: "วาด Activity Diagram", done: false }
    ],
    members: ["ทีมงานกลุ่มที่ 4"]
  },
  {
    id: "task-104",
    title: "ทำแบบฝึกหัด Neural Network & Decision Tree",
    subject: "AI & Data Science",
    type: "individual",
    dueDate: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0],
    dueTime: "23:59",
    status: "to-do",
    priority: "medium",
    difficulty: 4,
    weight: 10,
    description: "คำนวณ Entropy และ Information Gain ด้วยมือ และเขียน Python Code ด้วย Scikit-learn",
    subtasks: [
      { id: "st-9", text: "คำนวณข้อ 1-3 ในเอกสาร", done: false }
    ],
    members: ["ตนเอง"]
  },
  {
    id: "task-105",
    title: "ส่งสไลด์นำเสนอวิชาการสื่อสารทางเทคโนโลยี",
    subject: "Tech Communication",
    type: "individual",
    dueDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], // completed past
    dueTime: "16:30",
    status: "completed",
    priority: "low",
    difficulty: 2,
    weight: 5,
    description: "จัดทำสไลด์ 10 หน้า หัวข้อ Cloud Architecture Trends 2026",
    subtasks: [
      { id: "st-10", text: "ส่งไฟล์ PDF ในระบบ LMS", done: true }
    ],
    members: ["ตนเอง"]
  }
];

// App State Manager
class AssignmentApp {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('assignment_tracker_tasks')) || initialTasks;
    this.currentView = 'kanban'; // kanban | list
    this.activeTab = 'dashboard';
    this.searchQuery = '';
    this.filterSubject = 'all';
    this.filterStatus = 'all';
    this.filterType = 'all';
    this.editingTaskId = null;
    this.currentCalendarDate = new Date();

    this.init();
  }

  init() {
    this.saveTasks();
    this.setupEventListeners();
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.renderAll();
  }

  saveTasks() {
    localStorage.setItem('assignment_tracker_tasks', JSON.stringify(this.tasks));
  }

  updateClock() {
    const clockEl = document.getElementById('live-clock');
    if (clockEl) {
      const now = new Date();
      const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      clockEl.textContent = now.toLocaleDateString('th-TH', options);
    }
  }

  renderAll() {
    this.checkUrgentDeadlines();
    this.renderMetrics();
    this.renderSubjectProgress();
    this.renderTasks();
    this.renderCalendar();
    this.renderAIScheduler();
    this.renderGroupCollaboration();
    this.populateSubjectSelects();
  }

  // Urgent Deadline Alert Engine
  checkUrgentDeadlines() {
    const bannerContainer = document.getElementById('urgent-banner-container');
    const urgentBadgeDot = document.getElementById('urgent-badge-dot');
    const now = new Date();
    
    // Find tasks due within 48 hours (excluding completed)
    const urgentTasks = this.tasks.filter(t => {
      if (t.status === 'completed') return false;
      const due = new Date(`${t.dueDate}T${t.dueTime || '23:59'}`);
      const diffHours = (due - now) / (1000 * 60 * 60);
      return diffHours > 0 && diffHours <= 48;
    });

    if (urgentTasks.length > 0) {
      const topTask = urgentTasks[0];
      const due = new Date(`${topTask.dueDate}T${topTask.dueTime || '23:59'}`);
      const hoursLeft = Math.round((due - now) / (1000 * 60 * 60));
      
      bannerContainer.innerHTML = `
        <div class="urgent-banner">
          <div class="urgent-banner-content">
            <i class="fa-solid fa-triangle-exclamation urgent-icon"></i>
            <div>
              <strong>แจ้งเตือนเดดไลน์ด่วน!</strong> เหลืออีกประมาณ <strong>${hoursLeft} ชั่วโมง</strong>! 
              งาน <u>"${topTask.title}"</u> (${topTask.subject}) กำลังจะถึงกำหนดส่ง!
            </div>
          </div>
          <div class="urgent-actions">
            <button class="btn-banner" onclick="app.switchToTasksAndHighlight('${topTask.id}')">ดูงานนี้</button>
            <button class="btn-banner-close" onclick="this.parentElement.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>
      `;
      if (urgentBadgeDot) urgentBadgeDot.style.display = 'block';
    } else {
      bannerContainer.innerHTML = '';
      if (urgentBadgeDot) urgentBadgeDot.style.display = 'none';
    }
  }

  // Dashboard Metrics & Charts
  renderMetrics() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.status === 'completed').length;
    const inProgress = this.tasks.filter(t => t.status === 'in-progress').length;
    const urgent = this.tasks.filter(t => {
      if (t.status === 'completed') return false;
      const due = new Date(`${t.dueDate}T${t.dueTime || '23:59'}`);
      return (due - new Date()) / (1000 * 60 * 60) <= 48;
    }).length;

    document.getElementById('metric-total').textContent = total;
    document.getElementById('metric-completed').textContent = completed;
    document.getElementById('metric-pending').textContent = total - completed;
    document.getElementById('metric-urgent').textContent = urgent;

    // Completion percentage ring
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const ringFill = document.getElementById('ring-fill');
    const ringText = document.getElementById('ring-percentage-text');
    
    if (ringFill && ringText) {
      const circumference = 440;
      const offset = circumference - (percentage / 100) * circumference;
      ringFill.style.strokeDashoffset = offset;
      ringText.textContent = `${percentage}%`;
    }
  }

  // Subject Progress Breakdown
  renderSubjectProgress() {
    const container = document.getElementById('subject-progress-container');
    if (!container) return;

    const subjectMap = {};
    this.tasks.forEach(t => {
      if (!subjectMap[t.subject]) {
        subjectMap[t.subject] = { total: 0, completed: 0 };
      }
      subjectMap[t.subject].total++;
      if (t.status === 'completed') subjectMap[t.subject].completed++;
    });

    let html = '';
    const colors = ['#6366f1', '#ec4899', '#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'];
    let colorIdx = 0;

    Object.keys(subjectMap).forEach(subj => {
      const data = subjectMap[subj];
      const pct = Math.round((data.completed / data.total) * 100);
      const color = colors[colorIdx % colors.length];
      colorIdx++;

      html += `
        <div class="subject-item">
          <div class="subject-meta">
            <span class="subject-name">${subj}</span>
            <span class="subject-count">${data.completed}/${data.total} งาน (${pct}%)</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${pct}%; background: ${color};"></div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html || '<p class="text-muted">ยังไม่มีข้อมูลรายวิชา</p>';
  }

  // Filter Tasks Engine
  getFilteredTasks() {
    return this.tasks.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          t.subject.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchSubject = this.filterSubject === 'all' || t.subject === this.filterSubject;
      const matchStatus = this.filterStatus === 'all' || t.status === this.filterStatus;
      const matchType = this.filterType === 'all' || t.type === this.filterType;

      return matchSearch && matchSubject && matchStatus && matchType;
    });
  }

  // Render Tasks (Kanban vs List View)
  renderTasks() {
    const filtered = this.getFilteredTasks();

    if (this.currentView === 'kanban') {
      document.getElementById('kanban-view').style.display = 'grid';
      document.getElementById('list-view').style.display = 'none';

      const todoTasks = filtered.filter(t => t.status === 'to-do');
      const progressTasks = filtered.filter(t => t.status === 'in-progress');
      const completedTasks = filtered.filter(t => t.status === 'completed');

      document.getElementById('kanban-todo-list').innerHTML = this.buildTaskCardsHTML(todoTasks);
      document.getElementById('kanban-progress-list').innerHTML = this.buildTaskCardsHTML(progressTasks);
      document.getElementById('kanban-completed-list').innerHTML = this.buildTaskCardsHTML(completedTasks);

      document.getElementById('count-todo').textContent = todoTasks.length;
      document.getElementById('count-progress').textContent = progressTasks.length;
      document.getElementById('count-completed').textContent = completedTasks.length;

    } else {
      document.getElementById('kanban-view').style.display = 'none';
      document.getElementById('list-view').style.display = 'flex';

      document.getElementById('list-view-container').innerHTML = this.buildTaskListHTML(filtered);
    }
  }

  buildTaskCardsHTML(taskList) {
    if (taskList.length === 0) {
      return '<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">ไม่มีงานในหมวดนี้</div>';
    }

    return taskList.map(t => {
      const now = new Date();
      const due = new Date(`${t.dueDate}T${t.dueTime || '23:59'}`);
      const hoursLeft = (due - now) / (1000 * 60 * 60);
      const isUrgent = hoursLeft > 0 && hoursLeft <= 48 && t.status !== 'completed';

      let borderClass = '';
      if (t.status === 'completed') borderClass = 'completed-border';
      else if (isUrgent) borderClass = 'urgent-border';
      else borderClass = 'progress-border';

      return `
        <div class="task-card ${borderClass}" id="card-${t.id}">
          <div class="task-card-header">
            <span class="subject-tag">${t.subject}</span>
            <span class="task-type-badge type-${t.type}">
              ${t.type === 'individual' ? 'งานเดี่ยว' : t.type === 'group' ? 'งานกลุ่ม' : 'โปรเจกต์'}
            </span>
          </div>
          <div class="task-title">${t.title}</div>
          <div class="task-desc">${t.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</div>
          <div class="task-meta-footer">
            <div class="due-date ${isUrgent ? 'urgent' : ''}">
              <i class="fa-regular fa-clock"></i> 
              ${t.dueDate} ${t.dueTime || ''}
              ${isUrgent ? `<span style="font-size:0.7rem; background:var(--status-urgent); color:#fff; padding:1px 5px; border-radius:4px;">ด่วน!</span>` : ''}
            </div>
            <div class="task-actions">
              <button class="btn-card-action" title="เปลี่ยนสถานะ" onclick="app.cycleTaskStatus('${t.id}')">
                <i class="fa-solid fa-rotate"></i>
              </button>
              <button class="btn-card-action" title="แก้ไข" onclick="app.openEditTaskModal('${t.id}')">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn-card-action delete" title="ลบ" onclick="app.deleteTask('${t.id}')">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  buildTaskListHTML(taskList) {
    if (taskList.length === 0) {
      return '<div style="padding: 40px; text-align: center; color: var(--text-muted);">ไม่พบรายการงานตามเงื่อนไขที่เลือก</div>';
    }

    return taskList.map(t => {
      const isDone = t.status === 'completed';
      return `
        <div class="task-list-item">
          <div class="list-item-main">
            <div class="checkbox-status ${isDone ? 'checked' : ''}" onclick="app.cycleTaskStatus('${t.id}')">
              ${isDone ? '<i class="fa-solid fa-check"></i>' : ''}
            </div>
            <div>
              <div class="task-title" style="${isDone ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${t.title}</div>
              <div style="font-size: 0.78rem; color: var(--text-secondary); display: flex; gap: 12px; margin-top: 4px;">
                <span><i class="fa-solid fa-book"></i> ${t.subject}</span>
                <span><i class="fa-regular fa-calendar"></i> ${t.dueDate} ${t.dueTime || ''}</span>
                <span class="task-type-badge type-${t.type}" style="display:inline-block; transform: scale(0.85);">${t.type}</span>
              </div>
            </div>
          </div>
          <div class="task-actions">
            <button class="btn-card-action" onclick="app.openEditTaskModal('${t.id}')"><i class="fa-solid fa-pen-to-square"></i> แก้ไข</button>
            <button class="btn-card-action delete" onclick="app.deleteTask('${t.id}')"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>
      `;
    }).join('');
  }

  cycleTaskStatus(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    if (task.status === 'to-do') task.status = 'in-progress';
    else if (task.status === 'in-progress') task.status = 'completed';
    else task.status = 'to-do';

    this.saveTasks();
    this.renderAll();
    this.showToast(`อัปเดตสถานะงาน "${task.title}" เป็น ${task.status}`, 'success');
  }

  // Academic Calendar Renderer
  renderCalendar() {
    const grid = document.getElementById('calendar-grid-container');
    const monthLabel = document.getElementById('calendar-month-label');
    if (!grid || !monthLabel) return;

    const year = this.currentCalendarDate.getFullYear();
    const month = this.currentCalendarDate.getMonth();

    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    monthLabel.textContent = `${monthNames[month]} ${year + 543}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = `
      <div class="day-name">อา.</div>
      <div class="day-name">จ.</div>
      <div class="day-name">อ.</div>
      <div class="day-name">พ.</div>
      <div class="day-name">พฤ.</div>
      <div class="day-name">ศ.</div>
      <div class="day-name">ส.</div>
    `;

    // Empty lead slots
    for (let i = 0; i < firstDay; i++) {
      html += `<div class="calendar-day empty" style="opacity: 0.3; background: transparent;"></div>`;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Day slots
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      
      const dayTasks = this.tasks.filter(t => t.dueDate === dateStr);

      html += `
        <div class="calendar-day ${isToday ? 'today' : ''}">
          <div class="day-num">${d}</div>
          ${dayTasks.map(t => `
            <div class="calendar-task-dot ${t.status === 'completed' ? 'completed' : 'urgent'}" onclick="app.openEditTaskModal('${t.id}')">
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

  // AI Smart Priority Scheduler Algorithm
  renderAIScheduler() {
    const container = document.getElementById('ai-priority-list');
    if (!container) return;

    const now = new Date();

    // Calculate urgency score: Urgency = (Weight * 0.35) + (Difficulty * 15) + (DaysLeftFactor * 50)
    const scoredTasks = this.tasks
      .filter(t => t.status !== 'completed')
      .map(t => {
        const due = new Date(`${t.dueDate}T${t.dueTime || '23:59'}`);
        const daysLeft = Math.max(0.1, (due - now) / (1000 * 60 * 60 * 24));
        const timeFactor = Math.max(0, 100 - (daysLeft * 10)); // Closer due date -> higher score

        const rawScore = Math.round((t.weight * 0.35) + (t.difficulty * 12) + (timeFactor * 0.45));
        const urgencyScore = Math.min(99, Math.max(10, rawScore));

        return { ...t, urgencyScore, daysLeft: Math.round(daysLeft * 10) / 10 };
      })
      .sort((a, b) => b.urgencyScore - a.urgencyScore);

    if (scoredTasks.length === 0) {
      container.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted);">ไม่มีงานที่ค้างส่งในขณะนี้ 🎉</div>';
      return;
    }

    container.innerHTML = scoredTasks.map((t, idx) => `
      <div class="ai-item">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div class="ai-rank ${idx === 0 ? 'top1' : ''}">${idx + 1}</div>
          <div>
            <div style="font-weight: 700; font-size: 1.05rem;">${t.title}</div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">
              วิชา: <strong style="color: var(--cyan-neon);">${t.subject}</strong> | เดดไลน์: เหลืออีก <strong style="color: ${t.daysLeft <= 2 ? 'var(--status-urgent)' : 'var(--status-pending)'};">${t.daysLeft} วัน</strong> | น้ำหนักคะแนน: ${t.weight}%
            </div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">AI Urgency Index</div>
          <div style="font-size: 1.3rem; font-weight: 800; color: ${idx === 0 ? 'var(--status-urgent)' : 'var(--primary)'};">${t.urgencyScore} / 100</div>
        </div>
      </div>
    `).join('');
  }

  // Group Collaboration View
  renderGroupCollaboration() {
    const container = document.getElementById('group-tasks-container');
    if (!container) return;

    const groupTasks = this.tasks.filter(t => t.type === 'group' || t.type === 'project');

    if (groupTasks.length === 0) {
      container.innerHTML = '<div style="padding: 20px; color: var(--text-muted);">ไม่มีงานกลุ่มหรือโปรเจกต์ในขณะนี้</div>';
      return;
    }

    container.innerHTML = groupTasks.map(t => `
      <div class="analytics-card" style="margin-bottom: 16px;">
        <div class="analytics-card-header">
          <div>
            <h3>${t.title} (${t.subject})</h3>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">สมาชิกในกลุ่ม: ${(t.members || ['ตนเอง']).join(', ')}</p>
          </div>
          <span class="subject-tag">${t.status}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">
          กำหนดส่ง: ${t.dueDate}
        </div>
        <div class="subject-progress-list">
          ${(t.subtasks || []).map(st => `
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; background: var(--bg-secondary); padding: 8px 12px; border-radius: 6px;">
              <span>${st.text}</span>
              <span style="color: ${st.done ? 'var(--status-completed)' : 'var(--status-pending)'}; font-weight: 600;">
                ${st.done ? 'เสร็จแล้ว' : 'กำลังดำเนินการ'}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  // Modal Handlers
  openAddTaskModal() {
    this.editingTaskId = null;
    document.getElementById('modal-title').textContent = 'เพิ่มการบ้าน / งานใหม่';
    document.getElementById('task-form').reset();
    document.getElementById('task-id').value = '';
    document.getElementById('task-modal').classList.add('active');
  }

  openEditTaskModal(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    this.editingTaskId = id;
    document.getElementById('modal-title').textContent = 'แก้ไขรายละเอียดงาน';
    
    document.getElementById('task-id').value = task.id;
    document.getElementById('input-title').value = task.title;
    document.getElementById('input-subject').value = task.subject;
    document.getElementById('input-type').value = task.type;
    document.getElementById('input-duedate').value = task.dueDate;
    document.getElementById('input-duetime').value = task.dueTime || '23:59';
    document.getElementById('input-status').value = task.status;
    document.getElementById('input-priority').value = task.priority || 'medium';
    document.getElementById('input-weight').value = task.weight || 10;
    document.getElementById('input-desc').value = task.description || '';

    document.getElementById('task-modal').classList.add('active');
  }

  closeModal() {
    document.getElementById('task-modal').classList.remove('active');
  }

  saveTaskFromForm(event) {
    event.preventDefault();

    const id = document.getElementById('task-id').value || `task-${Date.now()}`;
    const title = document.getElementById('input-title').value;
    const subject = document.getElementById('input-subject').value;
    const type = document.getElementById('input-type').value;
    const dueDate = document.getElementById('input-duedate').value;
    const dueTime = document.getElementById('input-duetime').value;
    const status = document.getElementById('input-status').value;
    const priority = document.getElementById('input-priority').value;
    const weight = parseInt(document.getElementById('input-weight').value) || 10;
    const description = document.getElementById('input-desc').value;

    const newTask = {
      id,
      title,
      subject,
      type,
      dueDate,
      dueTime,
      status,
      priority,
      difficulty: priority === 'high' ? 5 : priority === 'medium' ? 3 : 1,
      weight,
      description,
      subtasks: [],
      members: ["ตนเอง"]
    };

    if (this.editingTaskId) {
      const idx = this.tasks.findIndex(t => t.id === this.editingTaskId);
      if (idx !== -1) {
        this.tasks[idx] = { ...this.tasks[idx], ...newTask };
      }
      this.showToast('บันทึกการแก้ไขงานเรียบร้อยแล้ว', 'success');
    } else {
      this.tasks.unshift(newTask);
      this.showToast('เพิ่มการบ้านใหม่สำเร็จแล้ว!', 'success');
    }

    this.saveTasks();
    this.closeModal();
    this.renderAll();
  }

  deleteTask(id) {
    if (confirm('คุณต้องการลบการบ้านชิ้นนี้ใช่หรือไม่?')) {
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.saveTasks();
      this.renderAll();
      this.showToast('ลบรายการงานเรียบร้อยแล้ว', 'warning');
    }
  }

  resetDemoData() {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลตัวอย่างกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      this.tasks = initialTasks;
      this.saveTasks();
      this.renderAll();
      this.showToast('รีเซ็ตข้อมูลตัวอย่างเรียบร้อยแล้ว', 'success');
    }
  }

  populateSubjectSelects() {
    const subjects = Array.from(new Set(this.tasks.map(t => t.subject)));
    const filterSelect = document.getElementById('filter-subject');
    if (!filterSelect) return;

    const currentVal = filterSelect.value;
    filterSelect.innerHTML = '<option value="all">ทุกรายวิชา</option>' + 
      subjects.map(s => `<option value="${s}">${s}</option>`).join('');
    filterSelect.value = currentVal;
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

        const target = e.currentTarget.getAttribute('data-tab');
        e.currentTarget.classList.add('active');
        document.getElementById(`tab-${target}`).classList.add('active');
        this.activeTab = target;
      });
    });

    // Theme Switcher
    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
      });
    }

    // View toggle (Kanban vs List)
    document.getElementById('btn-view-kanban')?.addEventListener('click', () => {
      this.currentView = 'kanban';
      document.getElementById('btn-view-kanban').classList.add('active');
      document.getElementById('btn-view-list').classList.remove('active');
      this.renderTasks();
    });

    document.getElementById('btn-view-list')?.addEventListener('click', () => {
      this.currentView = 'list';
      document.getElementById('btn-view-list').classList.add('active');
      document.getElementById('btn-view-kanban').classList.remove('active');
      this.renderTasks();
    });

    // Search and filters
    document.getElementById('search-input')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderTasks();
    });

    document.getElementById('filter-subject')?.addEventListener('change', (e) => {
      this.filterSubject = e.target.value;
      this.renderTasks();
    });

    document.getElementById('filter-status')?.addEventListener('change', (e) => {
      this.filterStatus = e.target.value;
      this.renderTasks();
    });

    document.getElementById('filter-type')?.addEventListener('change', (e) => {
      this.filterType = e.target.value;
      this.renderTasks();
    });
  }

  switchToTasksAndHighlight(taskId) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

    const tasksTab = document.querySelector('[data-tab="tasks"]');
    if (tasksTab) tasksTab.classList.add('active');
    document.getElementById('tab-tasks')?.classList.add('active');

    setTimeout(() => {
      const card = document.getElementById(`card-${taskId}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.8)';
        setTimeout(() => card.style.boxShadow = '', 2500);
      }
    }, 200);
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }
}

// Global App Instance
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new AssignmentApp();
});
