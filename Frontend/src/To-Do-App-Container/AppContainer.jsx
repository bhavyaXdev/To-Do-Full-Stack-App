import React, { useEffect, useRef, useState } from "react";
import { 
  Check, ChevronDown, Edit2, Plus, Trash2, Loader2, LogOut, User as UserIcon, Menu
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { fetchTasks, addTask, updateTask, deleteTask } from "../store/slices/taskSlice";

const cn = (...inputs) => twMerge(clsx(inputs));

// Status config: order, label, colors
const STATUS_CYCLE = ["pending", "in-progress", "complete"];

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  },
  "in-progress": {
    label: "In Progress",
    dot: "bg-blue-400",
    badge: "bg-blue-400/10 text-blue-300 border-blue-400/20",
  },
  complete: {
    label: "Complete",
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  },
};

/* ── Custom Status Dropdown ─────────────────────────────── */
const StatusDropdown = ({ status, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const cfg = STATUS_CONFIG[status];

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const DOT_COLORS = {
    pending: "#fbbf24",
    "in-progress": "#60a5fa",
    complete: "#34d399",
  };

  return (
    <div ref={ref} className="relative shrink-0" style={{ minWidth: "108px" }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 outline-none select-none",
          "hover:brightness-125 active:scale-95",
          cfg.badge
        )}
      >
        <span
          className="w-2 h-2 rounded-full shrink-0 shadow-sm"
          style={{ backgroundColor: DOT_COLORS[status], boxShadow: `0 0 6px ${DOT_COLORS[status]}99` }}
        />
        <span className="flex-1 text-left">{cfg.label}</span>
        <ChevronDown
          className={cn("w-3 h-3 opacity-60 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {/* Panel */}
      {open && (
        <div
          className="absolute right-0 mt-1.5 w-36 rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50"
          style={{
            background: "rgba(15,23,42,0.90)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {STATUS_CYCLE.map((s) => {
            const opt = STATUS_CONFIG[s];
            const isSelected = s === status;
            return (
              <button
                key={s}
                onClick={() => { onChange(s); setOpen(false); }}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-150 text-left",
                  isSelected
                    ? cn("text-white", opt.badge.split(" ").find(c => c.startsWith("bg-")))
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: DOT_COLORS[s],
                    boxShadow: isSelected ? `0 0 8px ${DOT_COLORS[s]}bb` : "none",
                  }}
                />
                {opt.label}
                {isSelected && <Check className="w-3 h-3 ml-auto opacity-80" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ── Action Menu (Burger) ─────────────────────────────── */
const ActionMenu = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0 ml-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 text-slate-500 hover:text-white rounded-xl bg-white/0 hover:bg-white/5 transition-colors group-hover:text-slate-300"
      >
        <Menu className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-32 rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50 p-1 space-y-0.5"
          style={{
            background: "rgba(15,23,42,0.95)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <button
            onClick={() => { onEdit(); setOpen(false); }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors text-left"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => { onDelete(); setOpen(false); }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-colors text-left"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const AppContainer = () => {
  const [inputVal, setInputVal] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, token } = useSelector((state) => state.auth);
  const { tasks, loading: isLoading } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    dispatch(fetchTasks());
  }, [token, navigate, dispatch]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const newTaskText = inputVal;
    setInputVal("");
    dispatch(addTask(newTaskText));
  };

  const handleEdit = (task) => {
    if (!task) {
      setEditId(null);
      return;
    }
    setEditId(task._id || task.id);
    setEditValue(task.text);
  };

  const handleSaveEdit = async (id) => {
    if (!editValue.trim()) return;
    dispatch(updateTask({ id, updates: { text: editValue } }))
      .unwrap()
      .then(() => setEditId(null));
  };

  const toggleComplete = async (task) => {
     const id = task._id || task.id;
     dispatch(updateTask({ id, updates: { completed: !task.completed } }));
  };

  const handleDelete = async (id) => {
     dispatch(deleteTask(id));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  /** Change status directly from dropdown */
  const handleStatusChange = (task, newStatus) => {
    const id = task._id || task.id;
    dispatch(updateTask({ id, updates: { status: newStatus, completed: newStatus === "complete" } }));
  };

  const pendingCount   = tasks.filter(t => (t.status || "pending") === "pending").length;
  const inProgressCount = tasks.filter(t => (t.status || "pending") === "in-progress").length;
  const doneCount      = tasks.filter(t => (t.status || "pending") === "complete").length;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_center,_#1e1b4b,_#0f172a,_#020617)] font-['Inter',sans-serif] text-slate-100 flex items-center justify-center p-2 sm:p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full animate-pulse decoration-indigo-500" />
      </div>

      <div className="w-full max-w-3xl glass-effect rounded-[2.5rem] shadow-2xl relative z-10 p-5 sm:p-6 sm:pb-5 flex flex-col h-[560px] sm:h-[630px] animate-fade-in border border-white/5">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 shrink-0 bg-white/5 p-3 sm:p-4 rounded-[1.5rem] border border-white/5">
           <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                 <UserIcon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                 <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 font-bold leading-none mb-1">Authenticated</p>
                 <p className="text-sm sm:text-base font-extrabold text-white leading-none truncate max-w-[120px] sm:max-w-full">{user?.username}</p>
              </div>
           </div>
           <button onClick={handleLogout} className="p-3 text-slate-400 hover:text-rose-400 hover:bg-rose-400/5 rounded-2xl transition-all active:scale-95">
              <LogOut className="w-5 h-5" />
           </button>
        </div>

        {/* Title + Stats */}
        <div className="flex items-center justify-between mb-5 sm:mb-6 shrink-0 px-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Tasks</h1>
          <div className="flex gap-3">
            <div className="text-center">
              <span className="block text-lg sm:text-xl font-black text-amber-400 leading-none">{pendingCount}</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-600 font-black">Pending</span>
            </div>
            <div className="text-center">
              <span className="block text-lg sm:text-xl font-black text-blue-400 leading-none">{inProgressCount}</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-600 font-black">Active</span>
            </div>
            <div className="text-center">
              <span className="block text-lg sm:text-xl font-black text-emerald-400 leading-none">{doneCount}</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-600 font-black">Done</span>
            </div>
          </div>
        </div>

        {/* Add Task form */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-6 sm:mb-8 shrink-0 relative">
          <input
            type="text"
            placeholder="What's next?..."
            className="flex-1 bg-slate-900/40 border border-white/5 rounded-2xl py-3.5 px-5 text-sm sm:text-base outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder-slate-600 shadow-inner"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button type="submit" disabled={!inputVal.trim()} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 transition-all rounded-2xl px-5 sm:px-6 font-bold shadow-xl shadow-blue-600/20 active:scale-95 border border-white/10">
            <Plus className="w-6 h-6 stroke-[3px]" />
          </button>
        </form>

        {/* Task List */}
        <div className="custom-scrollbar overflow-y-auto flex-1 pr-2 sm:pr-3 space-y-3 min-h-0 -mr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500/40" />
              <p className="text-[10px] uppercase tracking-widest font-bold">Syncing...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center border md:py-10 py-16 lg:py-16 bg-white/5 rounded-[2rem] border border-dashed border-white/5 flex flex-col items-center gap-3">
              <Plus className="w-8 h-8 text-slate-700" />
              <p className="text-slate-400 text-xs sm:text-sm font-bold">Nothing here yet</p>
            </div>
          ) : (
            tasks.map((task) => {
              const taskId = task._id || task.id;
              const status = task.status || "pending";
              const cfg = STATUS_CONFIG[status];
              return (
              <div
                key={taskId}
                className={cn(
                  "group flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all shrink-0",
                  status === "complete"
                    ? "bg-slate-800/10 border-white/5 opacity-60"
                    : "bg-white/5 border-white/5 hover:bg-white/10 shadow-sm"
                )}
              >
                {editId === taskId ? (
                  <div className="flex-1 flex gap-2 items-center">
                    <input type="text" autoFocus className="flex-1 bg-slate-900/80 border border-blue-500/30 rounded-xl px-3 py-1.5 text-sm text-white outline-none" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                    <div className="flex gap-1">
                      <button onClick={() => handleSaveEdit(taskId)} className="p-2 text-green-400 hover:bg-green-400/10 rounded-xl"><Check className="w-4 h-4" /></button>
                      <button onClick={() => handleEdit(null)} className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Complete toggle */}
                    <button 
                      onClick={() => toggleComplete(task)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0",
                        status === "complete"
                          ? "bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/40" 
                          : "border-slate-600 hover:border-blue-400 group-hover:scale-110"
                      )}
                    >
                      {status === "complete" && <Check className="w-4 h-4 text-white stroke-[3.5px]" />}
                    </button>

                    {/* Task text */}
                    <span className={cn(
                      "flex-1 text-sm sm:text-base font-semibold tracking-tight transition-all truncate",
                      status === "complete" ? "line-through text-slate-500" : "text-white group-hover:translate-x-0.5"
                    )}>
                      {task.text}
                    </span>

                    {/* Status dropdown */}
                    <StatusDropdown
                      status={status}
                      onChange={(newStatus) => handleStatusChange(task, newStatus)}
                    />

                    {/* Edit / Delete actions via Burger Menu */}
                    <ActionMenu
                      onEdit={() => handleEdit(task)}
                      onDelete={() => handleDelete(taskId)}
                    />
                  </>
                )}
              </div>
            )})
          )}
        </div>
      </div>
    </div>
  );
};

export default AppContainer;
