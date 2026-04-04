import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks');
  }
});

export const addTask = createAsyncThunk('tasks/addTask', async (text, { rejectWithValue }) => {
  try {
    const response = await api.post('/tasks', { text });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to add task');
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/tasks/${id}`, updates);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to update task');
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete task');
  }
});

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => (t._id || t.id) === (action.payload._id || action.payload.id));
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => (t._id || t.id) !== action.payload);
      });
  },
});

export const { clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
