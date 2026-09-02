import { Task, TaskInput } from '@/types/task';
import { supabase, isSupabaseConfigured } from './supabase';

const INITIAL_MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'ออกแบบ ER-Diagram & Relational Schema',
    subject: 'Database Systems',
    description: 'ออกแบบ 3NF และเขียน SQL Script สำหรับระบบห้องพยาบาล',
    due_date: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    status: 'in_progress',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'พัฒนา Frontend ด้วย Next.js & Tailwind CSS',
    subject: 'Web Development',
    description: 'สร้างระบบติดตามการบ้านและงานส่งพร้อมระบบค้นหากรองข้อมูล',
    due_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    status: 'in_progress',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'จัดทำเอกสาร Software Requirement Specification',
    subject: 'Software Engineering',
    description: 'รวบรวม User Stories, Use Case Diagrams และ Non-functional Requirements',
    due_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    status: 'not_started',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'ทำแบบฝึกหัด Decision Tree & Entropy',
    subject: 'AI & Data Science',
    description: 'คำนวณ Information Gain ด้วยมือและเขียน Python Code',
    due_date: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0],
    status: 'not_started',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'ส่งสไลด์นำเสนอวิชาการสื่อสารทางเทคโนโลยี',
    subject: 'Tech Communication',
    description: 'ทำสไลด์ 10 หน้า หัวข้อ Cloud Architecture Trends',
    due_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    status: 'done',
    created_at: new Date().toISOString(),
  },
];

// LocalStorage Persistence Helper
function getLocalTasks(): Task[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_TASKS;
  const stored = localStorage.getItem('homework_tracker_tasks');
  if (!stored) {
    localStorage.setItem('homework_tracker_tasks', JSON.stringify(INITIAL_MOCK_TASKS));
    return INITIAL_MOCK_TASKS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_TASKS;
  }
}

function saveLocalTasks(tasks: Task[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('homework_tracker_tasks', JSON.stringify(tasks));
  }
}

// Fetch all tasks
export async function fetchTasks(): Promise<Task[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });

    if (!error && data) {
      return data as Task[];
    }
    console.warn('Supabase fetch error, falling back to local state:', error);
  }

  return getLocalTasks();
}

// Add a new task
export async function createTask(input: TaskInput): Promise<Task> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([input])
      .select()
      .single();

    if (!error && data) {
      return data as Task;
    }
    console.warn('Supabase insert error, saving locally:', error);
  }

  const localTasks = getLocalTasks();
  const newTask: Task = {
    ...input,
    id: `local-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  const updated = [newTask, ...localTasks];
  saveLocalTasks(updated);
  return newTask;
}

// Update existing task
export async function updateTask(id: string, input: Partial<TaskInput>): Promise<Task | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('tasks')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      return data as Task;
    }
    console.warn('Supabase update error, updating locally:', error);
  }

  const localTasks = getLocalTasks();
  const idx = localTasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;

  const updatedTask = { ...localTasks[idx], ...input };
  localTasks[idx] = updatedTask;
  saveLocalTasks(localTasks);
  return updatedTask;
}

// Delete task
export async function deleteTask(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (!error) return true;
    console.warn('Supabase delete error, deleting locally:', error);
  }

  const localTasks = getLocalTasks();
  const filtered = localTasks.filter((t) => t.id !== id);
  saveLocalTasks(filtered);
  return true;
}
