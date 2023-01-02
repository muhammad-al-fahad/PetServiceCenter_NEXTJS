const validation = (name, email, password, confirm_password) => {
   if(!name || !email || !password)
   return "Fill all the Fields"

   if(!validateEmail(email))
   return "Invalid Email"

   if(password.length < 8)
   return "Password must be of atleast 8 characters"

   if(password !== confirm_password)
   return "Confirm Password did not match"
  
}

function validateEmail(email) {
   const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(email);
}

export default validation