import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getError } from '../api';

export const fetchHotels = createAsyncThunk('hotels/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/api/hotels', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(getError(err));
  }
});

export const fetchHotel = createAsyncThunk('hotels/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/api/hotels/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(getError(err));
  }
});

export const saveHotel = createAsyncThunk('hotels/save', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = id ? await api.put(`/api/hotels/${id}`, formData) : await api.post('/api/hotels', formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(getError(err));
  }
});

export const deleteHotel = createAsyncThunk('hotels/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/hotels/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(getError(err));
  }
});

const hotelSlice = createSlice({
  name: 'hotels',
  initialState: {
    list: [],
    total: 0,
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.hotels;
        state.total = action.payload.total;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrent } = hotelSlice.actions;
export default hotelSlice.reducer;
