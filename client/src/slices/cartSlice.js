import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";


const initialState = {
    cart : localStorage.getItem("cart") 
            ? JSON.parse(localStorage.getItem("cart")) 
            : [],
    total : localStorage.getItem("total") 
            ? JSON.parse(localStorage.getItem("total")) 
            : 0,
    totalItems : localStorage.getItem("totalItems") 
            ? JSON.parse(localStorage.getItem("totalItems")) 
            : 0
}

const cartSlice = createSlice({
    name:"cart",
    initialState:initialState,
    reducers:{
        addToCart : (state,action)=>{
            const course = action.payload;
            const filteredArray = state.cart.filter((item) => item._id === course._id);

            if(filteredArray.length){
                toast.error("Course is already in the cart");
                return;
            }
            state.cart.push(course);
            state.totalItems++;
            state.total+=course.price;

            localStorage.setItem("cart",JSON.stringify(state.cart));
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
            localStorage.setItem("total",JSON.stringify(state.total));

            toast.success("Added to cart") // change it to dynamic course name
        },

        removeFromCart :(state,action)=>{
            const cousreId = action.payload;
            const index = state.cart.findIndex((item)=> item._id ===cousreId);
            if(index >= 0){
                state.totalItems--;
                state.total-=state.cart[index].price;
                state.cart.splice(index,1);

                localStorage.setItem("cart",JSON.stringify(state.cart));
                localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
                localStorage.setItem("total",JSON.stringify(state.total));

                toast.success("Course removed from cart")

            }
        },
        resetCart : (state)=>{
            state.cart = [];
            state.total = 0;
            state.totalItems = 0;
            localStorage.removeItem("cart");
            localStorage.removeItem("totalItems");
            localStorage.removeItem("total");
        }
    }
})

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions

export default cartSlice.reducer;