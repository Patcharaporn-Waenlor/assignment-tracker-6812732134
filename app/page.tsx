'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskInput, TaskStatus } from '@/types/task';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/lib/tasks';

import Navbar from '@/components/Navbar';
import DashboardStats from '@/components/DashboardStats';
import UrgentAlertBanner from '@/components/UrgentAlertBanner';
import TaskFilters from '@/components/TaskFilters';
import TaskList from '@/components/TaskList';
import TaskModal from '@/components/TaskModal';

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [subjectFilter, setSubjectFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load tasks on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        console.error('Failed to load tasks:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Unique subjects for dropdown filter
  const subjects = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t.subject)));
  }, [tasks]);

  // Filtered tasks logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        t.title.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query));

      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesSubject = subjectFilter === 'all' || t.subject === subjectFilter;

      return matchesSearch && matchesStatus && matchesSubject;
    });
  }, [tasks, searchQuery, statusFilter, subjectFilter]);

  // Open modal for add
  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Save task (Create or Update)
  const handleSaveTask = async (input: TaskInput, id?: string) => {
    if (id) {
      const updated = await updateTask(id, input);
      if (updated) {
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      }
    } else {
      const created = await createTask(input);
      setTasks((prev) => [created, ...prev]);
    }
  };

  // Quick Status Toggle
  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    const updated = await updateTask(id, { status: newStatus });
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  };

  // Delete task
  const handleDeleteTask = async (id: string) => {
    if (confirm('คุณต้องการลบการบ้านชิ้นนี้ใช่หรือไม่?')) {
      const success = await deleteTask(id);
      if (success) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <Navbar onOpenAddModal={handleOpenAddModal} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header Title */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard ติดตามการบ้านและกำหนดส่ง
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            จัดการภาระการเรียน ตรวจสอบเดดไลน์ และติดตามสถานะงานส่งทุกรายวิชาในที่เดียว
          </p>
        </div>

        {/* Dashboard Metrics Cards */}
        <DashboardStats tasks={tasks} />

        {/* Urgent Deadline Banner */}
        <UrgentAlertBanner tasks={tasks} onSelectTask={handleOpenEditModal} />

        {/* Search & Status Filters */}
        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          subjectFilter={subjectFilter}
          onSubjectFilterChange={setSubjectFilter}
          subjects={subjects}
        />

        {/* Task List Table/Cards */}
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-sm">
            กำลังโหลดข้อมูลการบ้าน...
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteTask}
          />
        )}
      </main>

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />
    </div>
  );
}
