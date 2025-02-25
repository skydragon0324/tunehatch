import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { APIURL } from "../../Helpers/configConstants";
const initialState = {};

// const getAllShows = createAsyncThunk(
//     'shows/getAllShows',
//     async (payload, thunkAPI) => {
//         try {
//             let result = await axios.get(APIURL + 'get-all-shows')
//             return result.data;
//         } catch (err: any) {
//             return thunkAPI.rejectWithValue(err.response.data);
//         }
//     }
// )

const showsSlice = createSlice({
  name: "shows",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(getAllShows.fulfilled, (state, action) => {
    //     return action.payload
    // })
  },
});

//export actions
export {};
// export const {} = showsSlice.actions;

export default showsSlice.reducer;
