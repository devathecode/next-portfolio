import * as Yup from 'yup';

export const contactUsSchema = Yup.object({
    name: Yup.string().min(2).max(25).required("Please enter your name"),
    email: Yup.string().email('Please enter a valid email').required('Please enter your Email'),
    message: Yup.string().min(6).max(225).required('Please enter a message')
})