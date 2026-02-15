import {http} from "http";

export const getCart = async () => {
try {
    const response = await http.get("cart"); 
    return response.data;
}catch (error){
    console.error ("error fetching a cart",error);
}
};

export const addToCard = async (productId, quantity)=> {
    try {
        const response = await "http.post("cart / add",{producId, quantity})
        return response.data;
    }catch (error){
        console.error("error adding a cart", error);
    }
};

export const updateToCart = async (producId, quantity)=> {
    try {
   const response = await http.post("cart/update"),{producId,quantity};
    return response.data;
} catch (error) {
    console.error("error adding a cart",error);
}
};

export const removeToCart = async (producId, )=> {
    try {
   const response = await http.post("cart/remove/${productID}),{producId};
    return response.data;
} catch (error) {
    console.error("error adding a cart",error);
}
};

export const cleanCard = async (productId ) => {
    try {
   const response = await http.delete("cart/clear");
    return response.data;
} catch (error) {
    console.error("error adding a cart",error);
}
};