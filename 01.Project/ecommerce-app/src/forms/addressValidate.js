export const validateAddress = (values)=> {
    const errors = {
        name : "",
        address1: "",
        address2: "",
        postalCode: "",
        city: "",
        country: "",
        reference: "",
        default: "",
    };
if (!values.name.trim() errors.name ) "escriba un nombre para la dirección";

};
