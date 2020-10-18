/* eslint-disable */

document.getElementById('copy_date').innerHTML = new Date().getFullYear();

//Makes request to login user
const login = async (email, password) =>{
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if(res.data.status === 'success'){
      console.log('success', 'Logged in successfully!');
      md.showNotification('Success!', 'success', 'thumb_up');
      window.setTimeout(() =>{
        location.assign('/');
      }, 1000);
   }
  } 
  catch (err) {
    md.showNotification(err.response.data.message, 'danger', 'error_outline');
    console.log('error', err.response.data);
  }
  
};

//Makes request to submit employment form
const submitEmploymentForm = async (payload) =>{
  try {
    const res = await axios({
      method: 'POST',
      url: '/employment',
      data: payload
    });

    if(res.data.status === 'success'){
      console.log('success', 'Application Form submitted successfully');
      md.showNotification('Success!', 'success', 'thumb_up');
      window.setTimeout(() =>{
        location.assign('/');
      }, 1000);
   }
  } 
  catch (err) {
    md.showNotification(err.response.data.message, 'danger', 'error_outline');
    console.log('error', err);
  }
  
};


//Logs out user | Clears cookies
const logout = async() =>{
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    if(res.data.status === 'success'){
      md.showNotification('Logging you out', 'success', 'sentiment_satisfied_alt');
      window.setTimeout(() =>{
        location.assign('/');
      }, 1000); //location.reload(true); //Reload from server
    }
  } 
  catch (err) {
    md.showNotification(err.response.data.message, 'danger', 'error_outline');
  }
}

//Get Form Data
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('#logout_btn');
const employmentForm = document.querySelector('.employment_form');

if(loginForm)
  loginForm.addEventListener('submit', e =>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
});

if(employmentForm)
  employmentForm.addEventListener('submit', e =>{
    e.preventDefault();
    const payload = {
      firstName : document.getElementById('firstName').value,
      lastName : document.getElementById('lastName').value,
      address : document.getElementById('address').value,
      email: document.getElementById('email').value,
      ssn : document.getElementById('ssn').value,
      high_school : document.getElementById('highSchool').value,
      references: [
        { 
          name: document.getElementById('ref1_name').value,
          phone: document.getElementById('ref1_phone').value 
        },
        { 
          name: document.getElementById('ref2_name').value,
          phone: document.getElementById('ref2_phone').value 
        },
        { 
          name: document.getElementById('ref3_name').value,
          phone: document.getElementById('ref3_phone').value 
        }
      ]
    }

    submitEmploymentForm(payload);
});

if(logOutBtn){
  logOutBtn.addEventListener('click', logout);
}
