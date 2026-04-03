import React, { useEffect, useState } from "react";
import { 
  Check, Edit2, Plus, Trash2, Loader2, LogOut, User as UserIcon
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";

const cn = (...inputs) => twMerge(clsx(inputs));

const API_URL = "https://to-do-full-stack-app-aeba.onrender.com/api/tasks";

const AppContainer = () => {
  const [tasks, setTasks] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("todo_user")));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("todo_token");
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchTasks(token);
  }, [navigate]);

  const fetchTasks = async (token = localStorage.getItem("todo_token")) => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) {
         if (response.status === 401) handleLogout();
         throw new Error("Connection failed");
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const newTaskText = inputVal;
    setInputVal("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { 
           "Content-Type": "application/json",
           "Authorization": `Bearer ${localStorage.getItem("todo_token")}`
        },
        body: JSON.stringify({ text: newTaskText }),
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks([newTask, ...tasks]);
      }
    } catch (error) {
      console.error("Creation error:", error);
    }
  };

  const handleEdit = (task) => {
    if (!task) {
      setEditId(null);
      return;
    }
    setEditId(task.id);
    setEditValue(task.text);
  };

  const handleSaveEdit = async (id) => {
    if (!editValue.trim()) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { 
           "Content-Type": "application/json",
           "Authorization": `Bearer ${localStorage.getItem("todo_token")}`
        },
        body: JSON.stringify({ text: editValue }),
      });
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
        setEditId(null);
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const oldTasks = [...tasks];
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: { 
           "Content-Type": "application/json",
           "Authorization": `Bearer ${localStorage.getItem("todo_token")}`
        },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!response.ok) setTasks(oldTasks);
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("todo_token")}` }
      });
      if (response.ok) setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("todo_token");
    localStorage.removeItem("todo_user");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_center,_#1e1b4b,_#0f172a,_#020617)] font-['Inter',sans-serif] text-slate-100 flex items-center justify-center p-2 sm:p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full animate-pulse decoration-indigo-500" />
      </div>

      <div className="w-full max-w-lg glass-effect rounded-[2.5rem] shadow-2xl relative z-10 p-6 sm:p-8 sm:pb-6 flex flex-col h-[480px] sm:h-[550px] animate-fade-in border border-white/5">
        
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

        <div className="flex items-center justify-between mb-5 sm:mb-6 shrink-0 px-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Tasks</h1>
          <div className="flex gap-4">
             <div className="text-right">
                <span className="block text-xl sm:text-2xl font-black text-white leading-none">{tasks.filter(t => !t.completed).length}</span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-600 font-black">Missing</span>
             </div>
             <div className="text-right">
                <span className="block text-xl sm:text-2xl font-black text-blue-400 leading-none">{tasks.filter(t => t.completed).length}</span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-600 font-black">Done</span>
             </div>
          </div>
        </div>

        <form onSubmit={handleAddTask} className="flex gap-2 mb-6 sm:mb-8 shrink-0 relative">
          <input
            type="text"
            placeholder="What's next?..."
            className="flex-1 bg-slate-900/40 border border-white/5 rounded-2xl py-3.5 px-5 text-sm sm:text-base outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder-slate-600 shadow-inner"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button type="submit" disabled={!inputVal.trim()} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 transition-all rounded-2xl px-5 sm:px-6 font-bold shadow-xl shadow-blue-500/20 active:scale-95 border border-white/10">
            <Plus className="w-6 h-6 stroke-[3px]" />
          </button>
        </form>

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
            tasks.map((task) => (
              <div key={task.id} className={cn("group flex items-center gap-4 p-4 rounded-2xl border transition-all h-14 sm:h-16 shrink-0", task.completed ? "bg-slate-800/10 border-white/5 opacity-60" : "bg-white/5 border-white/5 hover:bg-white/10 shadow-sm")}>
                {editId === task.id ? (
                  <div className="flex-1 flex gap-2 items-center">
                    <input type="text" autoFocus className="flex-1 bg-slate-900/80 border border-blue-500/30 rounded-xl px-3 py-1.5 text-sm text-white outline-none" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                    <div className="flex gap-1">
                      <button onClick={() => handleSaveEdit(task.id)} className="p-2 text-green-400 hover:bg-green-400/10 rounded-xl"><Check className="w-4 h-4" /></button>
                      <button onClick={() => handleEdit(null)} className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* CUSTOM CIRCULAR CHECKBOX */}
                    <button 
                      onClick={() => toggleComplete(task)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0",
                        task.completed 
                          ? "bg-blue-600 border-blue-600 shadow-md shadow-blue-600/40" 
                          : "border-slate-600 hover:border-blue-400 group-hover:scale-110"
                      )}
                    >
                      {task.completed && <Check className="w-4 h-4 text-white stroke-[3.5px]" />}
                    </button>

                    <span className={cn("flex-1 text-sm sm:text-base font-semibold tracking-tight transition-all truncate", task.completed ? "line-through text-slate-500" : "text-white group-hover:translate-x-1")}>{task.text}</span>
                    
                    <div className="flex gap-1 items-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all shrink-0">
                      <button onClick={() => handleEdit(task)} className="p-2 text-slate-500 hover:text-white rounded-xl bg-white/0 hover:bg-white/5 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(task.id)} className="p-2 text-rose-500/30 hover:text-rose-500 rounded-xl bg-white/0 hover:bg-rose-500/5 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AppContainer;
