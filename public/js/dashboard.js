/* eslint-disable */

const baseURL = '';
const baseURLAPI = '/api/v1';


//INITIALIZE DATATABLES
$(document).ready( function () {
  $('.data-table').DataTable({
    columnDefs: [
      { orderable: false, targets: -1 },
      {
        target: 0,
        type: 'datetime-moment'
      }
   ],
   "aLengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
    "pageLength": 5
  });
});

//Modals for consumer forms
$(document).on("click", ".show-details", function (e) {
  e.preventDefault();

	const _self = $(this);
  const formData = _self.data('id');
  console.log(formData);

  //Populate common fields
  $(".modal-title").html(formData.form_name);
  $(".mod-cons-name ").html(formData.consumer_name);
  $(".mod-app-date").html(moment(formData.dateOfAppointment).format('Do MMMM YYYY'));
  $(".mod-lc-num").html(formData.lc_num);
  $(".mod-signatory").html(formData.signatory);
  $(".mod-sign-date").html(moment(formData.date).format('Do MMMM YYYY'));


  if(formData.recordType === 'DentalExam'){
    $("#mod-examiner").html(formData.examiner);
    $("#mod-diagnosis").html(formData.diagnosis);
    $("#mod-prescription").html(formData.prescription);
  }

  if(formData.recordType === 'FireEmergencyForm'){
    $("#mod-official").html(formData.official_name);
    $(".mod-address").html(formData.address);
    $("#mod-fire-location").html(formData.fire_location);
    $("#mod-persons-evacuated").html(formData.persons_evacuated);
    $(".mod-res-type").html(formData.res_type);
    $("#mod-begin-time").html(formData.begin_time);
    $("#mod-end-time").html(formData.end_time);
    $("#mod-total-time").html(formData.total_time + ' mins');
    $("#mod-follow-up").html(formData.follow_up);
  }

  if(formData.recordType === 'HotWaterFireForm'){

    $('.questions-section').empty();

    $(".mod-address").html(formData.address);
    $(".mod-needs").html(formData.needs);
    $(".mod-strengths").html(formData.strengths);
    $(".mod-recommendations").html(formData.recommendations);
    $(".mod-res-type").html(formData.res_type);

    for(question of formData.questions){
      $('.questions-section').append(`
        <div class="col-md-4">
          <h5 class="text-primary modal-headings">${question.question}</h5>
          <p class="text-muted modal-items mod-recommendations">${question.answer}</p>
        </div> 
      `)
    }
  }

  if(formData.recordType === 'EnvChecklistForm'){

    $('.questions-section').empty();

    $(".mod-agency").html(formData.agency);
    $(".mod-inspector").html(formData.inspector);
    $(".mod-site").html(formData.site);
    $(".mod-title").html(formData.title);

    for(const [i, question] of formData.questions.entries()){
      let titleId = `title-${i}`;
      $('.questions-section').append(`
          <div class="col-md-4 ${titleId}">
            <h5 class="text-primary modal-headings">${question.title}</h5>
          </div> 
        `)
      for(q of question.questions){
        $('.'+titleId).append(`<p class="text-muted modal-items">${q.question}: <strong>${q.answer}</strong></p>`)
      }
    }
  }

  if(formData.recordType === 'PoisonAssmentForm'){

    $('.questions-section').empty();

    $(".mod-address").html(formData.address);

    for(question of formData.questions){
      $('.questions-section').append(`
        <div class="col-md-4">
          <h5 class="text-primary modal-headings">${question.question}</h5>
          <p class="text-muted modal-items mod-recommendations">${question.answer}</p>
        </div> 
      `);
    }
  }

  if(formData.recordType === 'LegalAssessmentForm'){

    $('.questions-section').empty();

    $(".mod-dob").html(moment(formData.dob).format('Do MMMM YYYY'));
    $(".mod-minor-adult").html(formData.minorAdult);
    $(".mod-current-status").html(formData.currentStatus);
    $(".mod-recommendation").html(formData.recommendation);
    $(".mod-guardianship-type").html(formData.guardianshipType);
    $(".mod-action").html(formData.action);

    for(const [i, question] of formData.questions.entries()){
      let titleId = `title-${i}`;
      $('.questions-section').append(`
          <div class="col-md-6 ${titleId}">
            <h5 class="text-primary modal-headings">${question.title}</h5>
          </div> 
        `)
      for(q of question.questions){
        $('.'+titleId).append(`<p class="text-muted modal-items">${q.question}: <strong>${q.answer}</strong></p>`)
      }
    }
  }
  

  //Side in the modal body for different forms
  formData.recordType === 'DentalExam' ? $(".dental-exam").css('display', 'block'): $(".dental-exam").css('display', 'none');
  formData.recordType === 'FireEmergencyForm' ? $(".fire-drill").css('display', 'block'): $(".fire-drill").css('display', 'none');
  formData.recordType === 'HotWaterFireForm' ? $(".hot-water-fire").css('display', 'block'): $(".hot-water-fire").css('display', 'none');
  formData.recordType === 'EnvChecklistForm' ? $(".environmental-check").css('display', 'block'): $(".environmental-check").css('display', 'none');
  formData.recordType === 'PoisonAssmentForm' ? $(".poison-assessment").css('display', 'block'): $(".poison-assessment").css('display', 'none');
  formData.recordType === 'LegalAssessmentForm' ? $(".legal-assessment").css('display', 'block'): $(".legal-assessment").css('display', 'none');
});

//End of Modals section


//Delivery Logs forms DOM manipulation

const addRecordForm = (id, type) =>{

  let html;

  switch(type){
    case 'home':
      html = `
      <div class="card" id="card-${id}" style="background:#f8f7f7;">
        <div class="card-header">
          <button class="btn btn-link btn-danger btn-just-icon" id="close-${id}"><i class="material-icons">close</i></button>
        </div>
        <div class="card-body records-area">
          <div class="row">
            <div class="col-md-2">
              <div class="form-group">
                <label class="bmd-label-floating">Location *</label>
                <input type="text" class="form-control" required>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label class="bmd-label-floating">Number of Individuals *</label>
                <input type="text" class="form-control" required>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label class="bmd-label-floating">Number of Staff *</label>
                <input type="text" class="form-control" required>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group controls">
                <label class="label-control">Date of Service *</label>
                <input type="text" class="form-control datepicker" required>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
              <label class="label-control">Begin Time *</label>
                <input type="text" class="form-control timepicker" required>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
              <label class="label-control">End Time *</label>
                <input type="text" class="form-control timepicker" required>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label class="bmd-label-floating">Code for all services provided *</label>
                <input type="text" class="form-control" required>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label class="bmd-label-floating">Billable Units *</label>
                <input type="text" class="form-control" required>
              </div>
            </div>
          </div><br>
        </div>
      </div>
      `;
      break;
    case 'employment':
      html = `<div class="card" id="card-${id}" style="background:#f8f7f7;">
      <div class="card-header">
        <button class="btn btn-link btn-danger btn-just-icon" id="close-${id}"><i class="material-icons">close</i></button>
      </div>
      <div class="card-body records-area">
        <div class="row">
          <div class="col-md-2">
            <div class="form-group">
              <label class="bmd-label-floating">Location *</label>
              <input type="text" class="form-control" required>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group controls">
              <label class="label-control">Date of Service *</label>
              <input type="text" class="form-control datepicker" required>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
            <label class="label-control">Morning Begin Time *</label>
              <input type="text" class="form-control timepicker" required>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
            <label class="label-control">Morning End Time *</label>
              <input type="text" class="form-control timepicker" required>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
            <label class="label-control">Evening Begin Time *</label>
              <input type="text" class="form-control timepicker" required>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
            <label class="label-control">Evening End Time *</label>
              <input type="text" class="form-control timepicker" required>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label class="bmd-label-floating">Code for all services provided *</label>
              <input type="text" class="form-control" required>
            </div>
          </div>
        </div><br>
      </div>
    </div>`;
      break
  }


  $('#divider').before(html);

  setTimeout(() =>{
    md.initFormExtendedDatetimepickers();
  },1000);

  $(`#close-${id}`).click(() =>{
    $(`#card-${id}`).remove();
  });

}

const addCommentForm = (id, type) =>{

  let html;

  switch(type){
    case 'home':
      html = `
      <div class="comments-area" id="comment-row-${id}">
        <div style="width:50%; text-align:right">
          <button class="btn btn-link btn-danger btn-just-icon" id="comment-close-${id}"><i class="material-icons">close</i></button>
        </div>
        <div class="row">
          <div class="col-md-2">
            <div class="form-group controls">
              <label class="label-control">Date *</label>
              <input type="text" class="form-control datepicker" required>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="bmd-label-floating">Comment</label>
              <textarea class="form-control" rows="5" required></textarea>
            </div>
          </div>
        </div>
      </div>
      `;
      break;
    case 'employment':
      html = `
      <div class="comments-area" id="comment-row-${id}">
        <div style="width:50%; text-align:right">
          <button class="btn btn-link btn-danger btn-just-icon" id="comment-close-${id}"><i class="material-icons">close</i></button>
        </div>
        <div class="row">
          <div class="col-md-2">
            <div class="form-group controls">
              <label class="label-control">Date *</label>
              <input type="text" class="form-control datepicker" required>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label class="bmd-label-floating">Staff Initials *</label>
              <input type="text" class="form-control" required>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="bmd-label-floating">Comment</label>
              <textarea class="form-control" rows="5" required></textarea>
            </div>
          </div>
        </div>
      </div>
      `;
      break;
  }

  $('#add-comment-btn').before(html);

  setTimeout(() =>{
    md.initFormExtendedDatetimepickers();
  },1000);

  $(`#comment-close-${id}`).click(() =>{
    $(`#comment-row-${id}`).remove();
  });

}


// HANDLES DATE FORMATTING ON TABLES
let formatedDate = document.getElementsByClassName('formatted-date');

if(formatedDate && formatedDate.length > 0){
  formatedDate = Array.from(formatedDate);

  for(let i=0; i< formatedDate.length; i++){
    formatedDate[i].innerHTML = moment(formatedDate[i].innerHTML).format('Do MMMM YYYY');
  }
}

function toggleSpinner(btn, show){
  if(show){
    btn.btn.text(btn.loadingText);
    // btn.append('<div class="lds-dual-ring"></div>');
    btn.btn.attr('disabled', true);
  }
  else{
    btn.btn.empty();
    btn.btn.text(btn.normalText);
    btn.btn.attr('disabled', false);
  }
} 



const errorNotifications = (err) =>{
  const errorData = err.response.data;
  if(typeof errorData.message === 'string'){
    md.showNotification(errorData.message, 'danger', 'error_outline');
  }
  else if(errorData.message.code && errorData.message.code === 11000){
    const field = Object.keys(errorData.message.keyValue)[0];
    md.showNotification(`The provided ${field} is already taken. Please try again.`, 'danger', 'error_outline');
  }
  else{
    console.log('error', errorData);
    if(Object.keys(errorData.message.errors).includes('employment')){
      return md.showNotification('An Approved Application is required before registering a user', 'danger', 'error_outline');
    }
    md.showNotification(errorData.message.message.split(':')[2], 'danger', 'error_outline');
  }
}

//Makes request to get resource
const getResource = async (url, successMessage) =>{
  try {
    const res = await axios({
      method: 'GET',
      url
    });

    if(res.data.status === 'success'){
      md.showNotification(successMessage, 'success', 'thumb_up');
      return res.data.data;
   }
  } 
  catch (err) {
    errorNotifications(err);
  }
};


//Makes request to create resource
const createResource = async (payload, url, successMessage, redirectURL, btn) =>{
  
  btn ? toggleSpinner(btn, true): null;

  try {
    const res = await axios({
      method: 'POST',
      url,
      data: payload
    });

    if(res.data.status === 'success'){
      md.showNotification(successMessage, 'success', 'thumb_up');
      window.setTimeout(() =>{
        location.assign(redirectURL);
      }, 1000);
   }
  } 
  catch (err) {
    errorNotifications(err);
    btn ? toggleSpinner(btn, false): null;
  }
};

//Makes request to create resource
const updateResource = async (payload, url, successMessage, redirectURL) =>{
  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data: payload
    });

    if(res.data.status === 'success'){
      md.showNotification(successMessage, 'success', 'thumb_up');
      window.setTimeout(() =>{
        location.assign(redirectURL);
      }, 1000);
   }
  } 
  catch (err) {
    errorNotifications(err);
  }
};





//--- DATA FROM VIEWS --//

//Add Users Form
(function(doCreate){

  //Get Form Data
  const addUserForm = document.querySelector('#add_user_form');

  if(addUserForm){
    addUserForm.addEventListener('submit', e =>{
      e.preventDefault();

      const payload = {
        firstName : document.getElementById('firstName').value,
        lastName : document.getElementById('lastName').value,
        email : document.getElementById('email').value,
        address : document.getElementById('address').value,
        phone : document.getElementById('phone').value,
        ssn : document.getElementById('ssn').value,
        bio : document.getElementById('bio').value,
        role : document.getElementById('role').value,
        employment: document.getElementById('applicationId').value,
      }

      if(!payload.employment){
        return md.showNotification('An Approved Application is required before registering a user!', 'danger', 'error_outline'); 
      }

      doCreate(payload, `${baseURLAPI}/users`, 'User created successfully', '/dashboard/users');
    });
  }
})(createResource);


//Search Application to populate New User form
(function(doCreate){

  //Get Form Data
  const applicationId = document.querySelector('#search');
  const searchApplicationBtn = document.querySelector('#searchApplication');

  if(searchApplicationBtn){
    searchApplicationBtn.addEventListener('click', async () =>{

    const response = await doCreate(`${baseURL}/employment/${applicationId.value}?approved=true`, 'Data obtained...');
    console.log(response);
    
    if(response){
      document.getElementById('firstName').value = response.application.firstName;
      document.getElementById('lastName').value = response.application.lastName;
      document.getElementById('email').value = response.application.email;
      document.getElementById('address').value = response.application.address;
      document.getElementById('ssn').value = response.application.ssn;
      document.getElementById('applicationId').value = response.application._id;
    }
    else{
      document.getElementById('firstName').value = '';
      document.getElementById('lastName').value = '';
      document.getElementById('email').value = '';
      document.getElementById('address').value = '';
      document.getElementById('ssn').value = '';
      document.getElementById('applicationId').value = '';
    }

    });
  }
})(getResource);


//Create Consumer
(function(doCreate){

  const addConsumerForm = document.querySelector('#add_consumer');
  const btn = $('#add_consumer_btn');

  const btnService = {
    btn,
    normalText: 'Register Consumer',
    loadingText: 'Registering...'
  }

  if(addConsumerForm){
    addConsumerForm.addEventListener('submit', e =>{
      e.preventDefault();

      const payload = {
        firstName : document.getElementById('firstName').value,
        lastName : document.getElementById('lastName').value,
        email : document.getElementById('email').value,
        phone : document.getElementById('phone').value,
        lcNumber : document.getElementById('lcNumber').value
      }
      console.log(payload);
      doCreate(payload, `${baseURLAPI}/consumers`, 'Success!', '/dashboard/consumers', btnService);
    });
  }
})(createResource);


//Book Appointment Form Data
(function(doCreate){

  //Get Form Data
  const bookAppointmentForm = document.querySelector('#book-appointment-form');
  const bookBtn = document.querySelector('#book-appointment-btn');

  if(bookAppointmentForm){
    bookAppointmentForm.addEventListener('submit', e =>{
      e.preventDefault();
      const dateArr = (document.getElementById('date').value).split('/');

      const payload = {
        consumerName : document.getElementById('consName').value,
        age : document.getElementById('age').value,
        phone : document.getElementById('phone').value,
        dateOfAppointment: new Date(dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0]),
        time: document.getElementById('time').value,
        email : document.getElementById('email').value,
        reason : document.getElementById('reason').value
      }

      console.log(payload);
      doCreate(payload, `${baseURLAPI}/appointments`, 'Appointment Booked Successfully', '/dashboard/appointments', bookBtn);
    });
  }
})(createResource);

//Updating Application/Employment
(function(doCreate){

  //Get Form Data
  const saveButton = document.querySelector('#save_application_btn');
  const approvedCheck = document.querySelector('#approved');

  const applicationId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

  if(saveButton){
    saveButton.addEventListener('click', () =>{
      const payload = {
        approved : approvedCheck.checked
      }

      doCreate(payload, `${baseURL}/employment/${applicationId}`, 'Successfully Updated', '/dashboard/users/add');
    });
  }
})(updateResource);


//Consumer Forms
(function(doCreate){

  //Get Form Data
  const dentalForm = document.querySelector('#dental_form');
  const hotFireForm = document.querySelector('#hot_fire_form');
  const fireEmergencyForm = document.querySelector('#fire_emergency_form');
  const environmentalChecklistForm = document.querySelector('#environmental_checklist_form');
  const poisonAssessmentForm = document.querySelector('#poison-assessment-form');
  const legalAssessmentForm = document.querySelector('#legal-assessment-form');

  //Dental Form
  if(dentalForm)
    dentalForm.addEventListener('submit', e =>{
      e.preventDefault();

      const dateArr = (document.getElementById('date').value).split('/');

      const payload = {
        consumer: document.getElementById('con').value,
        lcNum: document.getElementById('lcNum').value,
        date: new Date(dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0]),
        examiner: document.getElementById('examiner').value,
        diagnosis: document.getElementById('diagnosis').value,
        prescription: document.getElementById('prescription').value
      }
      doCreate(payload, 
        `${baseURLAPI}/consumer-forms/dental-exam`, 
        'Dental Examination Form Created Successfully!',
        '/dashboard/consumer-forms'
        );
  });

  if(hotFireForm){
    hotFireForm.addEventListener('submit', e =>{
      e.preventDefault();

      const dateArr = (document.getElementById('date').value).split('/');

      const payload = {
        formName: document.getElementById('formName').value,
        consumer: document.getElementById('cons').value,
        date: new Date(dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0]),
        lcNum: document.getElementById('lcNum').value,
        address: document.getElementById('address').value,
        resType: document.getElementById('resType').value,
        strengths: document.getElementById('strengths').value,
        needs: document.getElementById('needs').value,
        recommendations: document.getElementById('recommendations').value,
        questions: []
      }

      const quest = document.querySelector('.questionaire');
      let answers = document.getElementsByTagName('select');
      answers = Array.from(answers);
      const children = quest.children;

      for (var i = 0; i < children.length; i++) {
        let question = children[i].children[0].innerHTML;
        question = question.substring(question.indexOf(' ') + 1);
        let answer = answers[i].value;
        payload.questions.push({question, answer});
      }
      doCreate(payload, 
        `${baseURLAPI}/consumer-forms/hot-water-fire-form`, 
        'Form Submitted Successfully!',
        '/dashboard/consumer-forms'
        );
    });
  }

  if(fireEmergencyForm){
    fireEmergencyForm.addEventListener('submit', e =>{
      e.preventDefault();

      const dateArr = (document.getElementById('date').value).split('/');

      const payload = {
        consumer: document.getElementById('con').value,
        date: new Date(dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0]),
        lcNum: document.getElementById('lcNum').value,
        address: document.getElementById('address').value,
        resType: document.getElementById('resType').value,
        official: document.getElementById('official').value,
        personsEvacuated: document.getElementById('personsEvacuated').value,
        fireLocation: document.getElementById('fireLocation').value,
        beginTime: document.getElementById('beginTime').value,
        endTime: document.getElementById('endTime').value,
        followUp: document.getElementById('followUp').value,
      }

      console.log(payload);

      doCreate(payload, 
        `${baseURLAPI}/consumer-forms/fire-emergency-form`, 
        'Form Submitted Successfully!',
        '/dashboard/consumer-forms'
        );
    });
  }

  if(environmentalChecklistForm){
    environmentalChecklistForm.addEventListener('submit', e =>{
      e.preventDefault();

      const dateArr = (document.getElementById('date').value).split('/');

      const payload = {
        consumer: document.getElementById('con').value,
        date: new Date(dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0]),
        lcNum: document.getElementById('lcNum').value,
        agency: document.getElementById('agency').value,
        inspector: document.getElementById('inspector').value,
        site: document.getElementById('site').value,
        title: document.getElementById('title').value,
        questions: []
      }

      let questionSection = document.getElementsByClassName('questions-section');
      questionSection = Array.from(questionSection);

      for (section of questionSection){
        let sectionObj = {questions:[]}; //Initialize an empty object for each section to be populated
        const questions = section.lastElementChild.children;
        sectionObj.title =  section.firstElementChild.innerHTML; //Get the title i.e the h5 element and set to sectionObj
        for(question of questions){
          let qnA = {
            question: question.children[0].innerHTML, //Get the question i.e the p element 
            answer: question.children[1].children[0].children[0].checked ? 'Yes': 'No' // Get the answer i.e the first radio and check its checked status
          }
          sectionObj.questions.push(qnA); //Push qnA to sectionObj
        }
        payload.questions.push(sectionObj); //Push sectionObj to payload
      }

      console.log(payload);

      doCreate(payload, 
        `${baseURLAPI}/consumer-forms/fire-emergency-form`, 
        'Form Submitted Successfully!',
        '/dashboard/consumer-forms'
        );
    });
  }

  //Toxic Poison Assessment Form
  if(poisonAssessmentForm){
    poisonAssessmentForm.addEventListener('submit', e =>{

      e.preventDefault();

      const dateArr = (document.getElementById('date').value).split('/');
      const payload = {
        consumer: document.getElementById('con').value,
        date: new Date(dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0]),
        lcNum: document.getElementById('lcNum').value,
        address: document.getElementById('address').value,
        questions: []
      }

      let questionSection = document.getElementsByClassName('questionaire');
      questionSection = Array.from(questionSection);

      const tempQuestions = [];

      for(question of questionSection[0].children){
        let qnA = {
          question: question.children[0].innerHTML,
          answer: question.children[1].children[0].children[0].checked ? 'Yes': 'No'
        }
        tempQuestions.push(qnA);
      }

      payload.questions = [...tempQuestions];
      console.log(payload);

      doCreate(payload, 
        `${baseURLAPI}/consumer-forms/poison-assessment-form`, 
        'Form Submitted Successfully!',
        '/dashboard/consumer-forms'
        );
    });
  }

  //Legal Status Assessment Form
  if(legalAssessmentForm){
    legalAssessmentForm.addEventListener('submit', e =>{

      e.preventDefault();

      const dateArr = (document.getElementById('date').value).split('/');
      const dob = (document.getElementById('dob').value).split('/');

      const payload = {
        consumer: document.getElementById('con').value,
        date: new Date(dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0]),
        dob: new Date(dob[2]+'-'+dob[1]+'-'+dob[0]),
        lcNum: document.getElementById('lcNum').value,
        minorAdult: document.getElementById('minor-adult').value,
        evaluator: document.getElementById('evaluator').value,
        currentStatus: document.getElementById('current-status').value,
        recommendation: document.getElementById('recommendation').value,
        guardianshipType: document.getElementById('guardianship-type').value,
        action: document.getElementById('action').value,
        questions: []
      }

      let questionSection = document.getElementsByClassName('questionaire');
      questionSection = Array.from(questionSection);

      for (section of questionSection[0].children){
        let sectionObj = {questions:[]}; //Initialize an empty object for each section to be populated
        const questions = section.children;
        sectionObj.title =  section.firstElementChild.innerHTML.split('. ')[1]; //Get the title i.e the h5 element and set to sectionObj
        for(question of questions){
          if(question.tagName === 'P') continue;

          let qnA = {
            question: question.children[0].innerHTML, //Get the question i.e the p element 
            answer: question.children[1].children[0].children[0].checked ? 'Yes': 'No' // Get the answer i.e the first radio and check its checked status
          }
          sectionObj.questions.push(qnA); //Push qnA to sectionObj
        }
        payload.questions.push(sectionObj); //Push sectionObj to payload
      }
      
      console.log(payload);

      doCreate(payload, 
        `${baseURLAPI}/consumer-forms/legal-assessment-form`, 
        'Form Submitted Successfully!',
        '/dashboard/consumer-forms'
        );
    });
  }

})(createResource);


//Consumer Delivery Service Logs
(function(doCreate, doUpdate){

  const respiteServiceForm = document.getElementById('respite-service-form');
  const supportedHomeForm = document.getElementById('supported-home-form');
  const supportedEmploymentForm = document.getElementById('supported-employment-form');

  const btn = $('#submit-btn');

  const btnService = {
    btn,
    normalText: 'Submit',
    loadingText: 'Submitting...'
  }
  
  //Respite Service Delivery Section
  if(respiteServiceForm){
    respiteServiceForm.addEventListener('submit', e =>{
      e.preventDefault();

      const dateArr = (document.getElementById('dateOfAppointment').value).split('/');

      const payload = {
        lcNumber : document.getElementById('lcNumber').value,
        dateOfAppointment : new Date(dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0]),
        placeOfService: document.getElementById('placeOfService').value,
        staffInitials: document.getElementById('staffInitials').value,
        comment: document.getElementById('comment').value
      }

      let timesSections = document.getElementsByClassName('times-section');
      timesSections = Array.from(timesSections);

      const sections = [];

      for(timesSection of timesSections){
        let section = {activities:[]};
        section.sectionTitle = timesSection.children[0].innerHTML;

        for(let i=1; i < timesSection.children.length; i++){
          let activity = {};
          activity.activityName = timesSection.children[i].children[0].innerHTML;
          const items = timesSection.children[i].children;

          activity.morningTimes = {
            timeIn: items[1].firstElementChild.lastElementChild.value,
            timeOut: items[2].firstElementChild.children[1].value
          }
          activity.afternoonTimes = {
            timeIn: items[3].firstElementChild.lastElementChild.value,
            timeOut: items[4].firstElementChild.children[1].value,
          }
          activity.eveningTimes = {
            timeIn: items[5].firstElementChild.lastElementChild.value,
            timeOut: items[6].firstElementChild.children[1].value,
          }

          section.activities.push(activity);
        }
        sections.push(section);
      }

      payload.sections = sections;
      console.log(payload);
      doCreate(payload, 
        `${baseURLAPI}/consumer-forms/respite-service-forms`, 
        'Form Submitted Successfully!',
        '/dashboard/consumers/respite-service-delivery?all=true', btnService
        );
    });
  }

  if(supportedHomeForm){
    let counter = 0, counter1 = 0

    const addRecordBtn = document.getElementById('add-record-btn');
    const addCommentBtn = document.getElementById('add-comment-btn');
    const submitBtn = document.getElementById('submit-btn');

    addRecordBtn.addEventListener('click', () =>{
      addRecordForm(counter, 'home');
      counter++;
    });

    addCommentBtn.addEventListener('click', () =>{
      addCommentForm(counter1, 'home');
      counter1++;
    });

    supportedHomeForm.addEventListener('submit', e =>{
      e.preventDefault();

      let sections = document.getElementsByClassName('records-area');
      let commentSections = document.getElementsByClassName('comments-area');

      const payload = {
        lcNumber: document.getElementById('lcNumber').value
      }

      sections = Array.from(sections);
      const records = [], comments = [];

      if(sections){
        for(section of sections){
          const row = section.children[0];
          const cols = row.children;
          const dateArr = (cols[3].firstElementChild.lastElementChild.value).split('/');
          const record = {
            location: cols[0].firstElementChild.lastElementChild.value,
            numberOfIndividuals: cols[1].firstElementChild.lastElementChild.value,
            numberOfStaff: cols[2].firstElementChild.lastElementChild.value,
            dateOfService: new Date(dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0]),
            beginTime: cols[4].firstElementChild.lastElementChild.value,
            endTime: cols[5].firstElementChild.lastElementChild.value,
            servicesCode: cols[6].firstElementChild.lastElementChild.value,
            billableUnits: cols[7].firstElementChild.lastElementChild.value,
          }
          records.push(record);
        }
      }

      if(commentSections){
        for(section of commentSections){
          const rowDate = section.children[1];
          const rowComment = section.children[2];
          const dateArr = (rowDate.firstElementChild.firstElementChild.lastElementChild.value).split('/');
          
          const comment = {
            commentDate: new Date(dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0]),
            commentText: rowComment.firstElementChild.firstElementChild.lastElementChild.value
          }
          comments.push(comment);
        }
      }

      records.length > 0? payload.records = records: null;
      comments.length > 0? payload.comments = comments: null;
     
      if(records.length <= 0 && comments.length <= 0){
        return md.showNotification('Please add a record or comment to submit', 'danger', 'error_outline');
      }

      console.log(payload);
      doCreate(payload, 
        `${baseURLAPI}/consumer-forms/supported-home-forms`, 
        'Form Submitted Successfully!',
        '/dashboard/consumers/supported-home-living?all=true'
        );

    });

  }

  if(supportedEmploymentForm){
    let counter = 0, counter1 = 0

    const addRecordBtn = document.getElementById('add-record-btn');
    const addCommentBtn = document.getElementById('add-comment-btn');
    const submitBtn = document.getElementById('submit-btn');

    addRecordBtn.addEventListener('click', () =>{
      addRecordForm(counter, 'employment');
      counter++;
    });

    addCommentBtn.addEventListener('click', () =>{
      addCommentForm(counter1, 'employment');
      counter1++;
    });

    supportedEmploymentForm.addEventListener('submit', e =>{
      e.preventDefault();

      let sections = document.getElementsByClassName('records-area');
      let commentSections = document.getElementsByClassName('comments-area');

      const payload = {
        lcNumber: document.getElementById('lcNumber').value
      }

      sections = Array.from(sections);
      const records = [], comments = [];

      if(sections){
        for(section of sections){
          const row = section.children[0];
          const cols = row.children;
          const dateArr = (cols[1].firstElementChild.lastElementChild.value).split('/');
          const record = {
            location: cols[0].firstElementChild.lastElementChild.value,
            dateOfService: new Date(dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0]),
            beginTime:{
              morning: cols[2].firstElementChild.lastElementChild.value,
              evening: cols[4].firstElementChild.lastElementChild.value,
            },
            endTime: {
              morning: cols[3].firstElementChild.lastElementChild.value,
              evening: cols[5].firstElementChild.lastElementChild.value,
            },
            servicesCode: cols[6].firstElementChild.lastElementChild.value
          }
          records.push(record);
        }
      }

      if(commentSections){
        for(section of commentSections){
          const rowDate = section.children[1];
          const rowComment = section.children[2];
          const dateArr = (rowDate.firstElementChild.firstElementChild.lastElementChild.value).split('/');
          
          const comment = {
            commentDate: new Date(dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0]),
            staffInitials: rowDate.lastElementChild.firstElementChild.lastElementChild.value,
            commentText: rowComment.firstElementChild.firstElementChild.lastElementChild.value
          }
          comments.push(comment);
        }
      }

      records.length > 0? payload.records = records: null;
      comments.length > 0? payload.comments = comments: null;
     
      if(records.length <= 0 && comments.length <= 0){
        return md.showNotification('Please add a record or comment to submit', 'danger', 'error_outline');
      }

      console.log(payload);
      doCreate(payload, 
        `${baseURLAPI}/consumer-forms/supported-employment-forms`, 
        'Form Submitted Successfully!',
        '/dashboard/consumers/supported-employment?all=true'
        );

    });

  }

})(createResource, updateResource);
