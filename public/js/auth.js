/* eslint-disable */

document.getElementById('copy_date').innerHTML = new Date().getFullYear();

//Makes request to login user
const login = async (email, password, btn) =>{
  btn.textContent = 'Login in...';
  btn.disabled = true;
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
    btn.textContent = 'Login';
    btn.disabled = false;
  }
  
};

//Makes request to submit employment form
const submitEmploymentForm = async (payload) =>{
  try {
    const res = await axios({
      method: 'POST',
      url: `/employment`,
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
const loginBtn = document.querySelector('#btn-login');
const employmentForm = document.querySelector('.employment_form');
const employmentFormSubmit = document.getElementById('employment_form_submit');

let payload = {};

if(loginForm){
    loginForm.addEventListener('submit', e =>{
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      login(email, password, loginBtn);
  });
}
if(employmentForm){
    const navReferences = document.getElementById('nav-references');

    employmentForm.addEventListener('submit', e =>{
      e.preventDefault();
      
      payload = {
        firstName : document.getElementById('firstName').value,
        lastName : document.getElementById('lastName').value,
        address : document.getElementById('address').value,
        email: document.getElementById('email').value,
        ssn : document.getElementById('ssn').value,
        high_school : document.getElementById('highSchool').value
      }
      navReferences.click();
      console.log(payload);
  });
}

if(employmentFormSubmit){

  let idCard, ssCard, highSchoolCert;

  $('#id_card').on('change', () =>{ 
    idCard = document.getElementById('id_card').files[0];
    idCard ? $('#lab_id_card').html(idCard.name).css('color', '#222f3e'): '';
  });

  $('#ss_card').on('change', () =>{ 
    ssCard = document.getElementById('ss_card').files[0];
    ssCard ? $('#lab_ss_card').html(ssCard.name).css('color', '#222f3e'): '';
  });

  $('#high_school_cert').on('change', () =>{ 
    highSchoolCert = document.getElementById('high_school_cert').files[0];
    highSchoolCert? $('#lab_high_school_cert').html(highSchoolCert.name).css('color', '#222f3e'): '';
  });

  employmentFormSubmit.addEventListener('submit', e =>{
    e.preventDefault();

    if(
      !payload.firstName 
      || !payload.lastName 
      || !payload.address 
      || !payload.email 
      || !payload.ssn 
      || !payload.high_school
      ){
        return md.showNotification('Your basic info is incomplete, please check and fill in all required fields', 'danger', 'error_outline');
      }

    if(!idCard || !ssCard || !highSchoolCert){
      return md.showNotification('One or more files have\'t been selected', 'danger', 'error_outline');
    }

    const references = [
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
    ];

    payload.references = references;
    console.log(payload);

    const form = new FormData();

    form.append('firstName', payload.firstName); form.append('lastName', payload.lastName);
    form.append('address', payload.address); form.append('email', payload.email);
    form.append('ssn', payload.ssn); form.append('high_school', payload.high_school);
    form.append('references', JSON.stringify(payload.references)); form.append('id_card', idCard);
    form.append('ss_card', ssCard); form.append('highSchool_cert', highSchoolCert);

    console.log(Array.from(form.values()));
    submitEmploymentForm(form);
  });
}

if(logOutBtn){

  //For mobile phones
  $(document).on("touchstart", "#logout_btn", function() {
    logout();
  });

  //For desktop browsers
  logOutBtn.addEventListener('click', () =>{
    logout();
  });
}
