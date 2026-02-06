export const addressInitialValues = {
    name : "",
    address1: "",
    address2: "",
    postalCode: "",
    city: "",
    country: "",
    reference: "",
    default: false,
};

export const hasErrors = (errors)=> {
    const walk = (obj)=>
        Object.values(obj).some((v)=> 
        v && typeof v === "objetc" ? walk(v) : Boolean(v),
);
return walk (errors);
};