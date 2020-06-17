import React, {useState, useEffect } from "react"
import "../App.css"
import axios from "axios";
import * as yup from "yup";

const formSchema = yup.object().shape({
    name: yup.string().required("Name is a required field."),
    email: yup
      .string()
      .email("Must be a valid email address.")
      .required("Must include email address."),
    password: yup
      .string()
      .min(8, 'must be at least 8 characters')
      .required("please enter a password"),
    terms: yup.boolean().oneOf([true], "please agree to terms of use")
  });


const Form =  () => {

    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
        terms: ""
    })

    //IF I CHANGE ERRORS STATE TO SOMETHING ELSE THE VALIDATION WILL NOT WORK ON ERRORS, WHY??? Does it have
    //to be errors and setErrors all the time for form validation? 
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        terms: ""
    })
    
    // this is to post data on object api on our form
    const [post, setPost] = useState([]);


    const [buttonDisabled, setButtonDisabled] = useState(true)
    //Use effect for button once form renders right away it's ready to validate button if all yup schemas are true
    useEffect(() => {
        console.log('form state change')
        formSchema.isValid(formState).then(valid => {
          console.log('valid?', valid)
            setButtonDisabled(!valid);
        });
      }, [formState]);


      //validate for errors and add it to INPUT function 
      const validateChange = e => {
        // Reach will allow us to "reach" into the schema and test only one part.
        yup
          .reach(formSchema, e.target.name)
          .validate(e.target.value)
          .then(valid => {
            setErrors({
              ...errors,
              [e.target.name]: ""
            });
          })
          .catch(err => {
            setErrors({
              ...errors,
              [e.target.name]: err.errors[0]
              
            });
          });
      };



    const inputChange = e => {
        e.persist()
        console.log(e.target.name, e.target.value, 'hello there')
        const newFormData = {
            ...formState,
            [e.target.name] : e.target.type === "checkbox" ? e.target.checked : e.target.value
        }
        validateChange(e)
        setFormState(newFormData)
    }

    const formSubmit = e => {
    e.preventDefault();
    axios
      .post("https://reqres.in/api/users", formState)
      .then(res => {
        setPost(res.data); // get just the form data from the REST api
        console.log("success", post);
        // reset form if successful
        setFormState({
            name: "",
            email: "",
            password: "",
            terms: ""
          
        });
      })
      .catch(err => console.log(err.response, 'err response'));
  };

    return(
        <div>
            <form onSubmit={formSubmit}>
                <label htmlFor="name">Name  
                    <input type="text" id="name" name="name" value={formState.name} onChange={inputChange} />
                </label>
                {errors.name.length > 0 ? <p>{errors.name}</p> : null}
              
                <br/>

                <label htmlFor="email">Email
                    <input type="email" id="email" name="email" value={formState.email} onChange={inputChange} />
                </label>
                {errors.email.length > 0 ? <p>{errors.email}</p> : null}
                <br/>

                <label htmlFor="password">Password
                    <input type="password" id="password" name="password" value={formState.password} onChange={inputChange} />
                </label>
                {errors.password.length > 0 ? <p>{errors.password}</p> : null}
                <br/>

                <label htmlFor="terms">Terms and Conditions
                    <input type="checkbox" id="terms" name="terms" checked={formState.terms} onChange={inputChange} />
                </label>

                <pre>{JSON.stringify(post, null, 2)}</pre>
                <button type="submit" disabled={buttonDisabled}>SUBMIT FORM</button>
            </form>
        </div>
    )
}

export default Form;