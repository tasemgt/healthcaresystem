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

function reFormatDate(dateArr){
  if(dateArr.length <=1 ){
    return '';
  }
  return new Date(dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0]);
}

function chunkArray(myArray, chunk_size){
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];
  
  for (index = 0; index < arrayLength; index += chunk_size) {
      myChunk = myArray.slice(index, index+chunk_size);
      // Do something if you want with the group
      tempArray.push(myChunk);
  }

  return tempArray;
}

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


//------------------Consumer Delivery Service Logs ---------------------//
(function(doCreate, doUpdate){

  const respiteServiceForm = document.getElementById('respite-service-form');
  const supportedHomeForm = document.getElementById('supported-home-form');
  const supportedEmploymentForm = document.getElementById('supported-employment-form');
  const rssSLServiceForm = document.getElementById('rss-sl-service-form');
  const dayHabilitationServiceForm = document.getElementById('day-habilitation-service-form');

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

  if(rssSLServiceForm){
    rssSLServiceForm.addEventListener('submit', e =>{
      e.preventDefault();

      const dateArr = (document.getElementById('dateOfWeek').value).split('/');
      const dateArr2 = (document.getElementById('dateOfComment').value).split('/');

      const payload = {
        lcNumber: document.getElementById('lcNumber').value,
        placeOfService: document.getElementById('placeOfService').value,
        week: {
          weekNumber: document.getElementById('week').value,
          logType: document.getElementById('rss').checked ? 'rss':'sl',
          day:{
            dayOfWeek: document.getElementById('dayOfWeek').value.toLowerCase(),
            dateOfWeek: reFormatDate(dateArr),
            comment: {
              date: reFormatDate(dateArr2),
              staffInitials: document.getElementById('staffInitials').value,
              commentText: document.getElementById('commentText').value,
            },
            signature: {
              employeeName: document.getElementById('employeeName').value,
              initials: document.getElementById('initials').value,
              staffID: document.getElementById('staffID').value,
            },
            records: []
          }
        }
      }

      if(!payload.week.day.dayOfWeek) return md.showNotification('Please select the day of the week', 'danger', 'error_outline');

      let checkArea = document.getElementById('check-area');
      sections = chunkArray(Array.from(checkArea.children), 4);

      for(section of sections){
        const record = { title: section[0].innerHTML };
        const checks = [];
        for(col of section[1].children){
          const check = { 
            item: col.firstElementChild.firstElementChild.innerHTML,
            checked: col.firstElementChild.lastElementChild.firstElementChild.checked
          }
          checks.push(check);
          record.checks = checks;
        }
        payload.week.day.records.push(record);
      }

      console.log(payload);
      doCreate(payload, 
        `${baseURLAPI}/consumer-forms/rss-sl-service-forms`, 
        'Form Submitted Successfully!',
        '/dashboard/consumers/rss-sl-service?all=true'
        );
    });
  }


  //Day Habilitation Service Delivery Section
  if(dayHabilitationServiceForm){
    dayHabilitationServiceForm.addEventListener('submit', e =>{
      e.preventDefault();

      const dateArr = (document.getElementById('dateOfWeek').value).split('/');
      const dateArr2 = (document.getElementById('dateOfComment').value).split('/');

      const payload = {
        lcNumber : document.getElementById('lcNumber').value,
        placeOfService: document.getElementById('placeOfService').value,
        days: {
          dayName: document.getElementById('dayName').value.toLowerCase(),
          dateOfWeek : reFormatDate(dateArr),
          records: [],
          comment: {
            date: reFormatDate(dateArr2),
            staffInitials: document.getElementById('staffInitials').value,
            commentText: document.getElementById('commentText').value,
          },
          signature: {
            employeeName: document.getElementById('employeeName').value,
            initials: document.getElementById('initials').value
          }
        }
      }

      let timesSections = document.getElementsByClassName('times-section');
      timesSections = Array.from(timesSections);

      const sections = timesSections[0].children;

      payload.days.times = {
        morningTimes : {
          timeIn: sections[0].firstElementChild.lastElementChild.value,
          timeOut: sections[1].firstElementChild.children[1].value,
        },
        afternoonTimes : {
          timeIn: sections[2].firstElementChild.lastElementChild.value,
          timeOut: sections[3].firstElementChild.children[1].value,
        },
        eveningTimes : {
          timeIn: sections[4].firstElementChild.lastElementChild.value,
          timeOut: sections[5].firstElementChild.children[1].value,
        }
      };

      if(!payload.days.dayName) return md.showNotification('Please select the day of the week', 'danger', 'error_outline');

      let checkArea = document.getElementById('check-area');
      const checkSections = chunkArray(Array.from(checkArea.children), 4); // For all elements including hr and br

      for(section of checkSections){
        const record = { title: section[0].innerHTML };
        const checks = [];
        for(col of section[1].children){
          const check = { 
            item: col.firstElementChild.firstElementChild.innerHTML,
            checked: col.firstElementChild.lastElementChild.firstElementChild.checked
          }
          checks.push(check);
          record.checks = checks;
        }
        payload.days.records.push(record);
      }

      console.log(payload);
      doCreate(payload, 
        `${baseURLAPI}/consumer-forms/day-habilitation-forms`, 
        'Form Submitted Successfully!',
        '/dashboard/consumers/day-habilitation-service?all=true'
        );
    });
  }

})(createResource, updateResource);


//------------------ Nursing Service Logs ---------------------//
(function(doCreate, doUpdate){

  const nursingServicesDeliveryForm = document.getElementById('nursing-services-delivery-form');
  const nursingServicesChecklistForm = document.getElementById('nursing-services-checklist-form');
  const nursingTasksScreeningForm = document.getElementById('nursing-tasks-screening-form');
  const exclusionHostHomeForm = document.getElementById('exclusion-of-hhcc-form');
  const rnDelegationChecklistForm = document.getElementById('rn-delegation-checklist-form');
  const comprehensiveNursingAssessmentForm = document.getElementById('comprehensive-nursing-assessment-form');

  if(nursingServicesDeliveryForm){
    nursingServicesDeliveryForm.addEventListener('submit', e =>{
      e.preventDefault();

      const dateArr = (document.getElementById('serviceDate').value).split('/');

      const payload = {
        lcNumber : document.getElementById('lcNumber').value,
        serviceDate: reFormatDate(dateArr),
        individualName : document.getElementById('individualName').value,
        location : document.getElementById('location').value,
        beginTime : document.getElementById('beginTime').value,
        endTime : document.getElementById('endTime').value,
        unitsOfService : document.getElementById('unitsOfService').value,
        nurseName : document.getElementById('nurseName').value,
        title : document.getElementById('title').value,
        nurseSignature : document.getElementById('nurseSignature').value,
        staffID : document.getElementById('staffID').value,
        nursingComponent: [
          {item: 'Registered Nurse (RN)', checked: document.getElementById('rn').checked},
          {item: 'Licensed Vocational Nurse (LVN)', checked: document.getElementById('lvn').checked},
          {item: 'Specialized RN', checked: document.getElementById('srn').checked},
          {item: 'Specialized LVN', checked: document.getElementById('slvn').checked}
        ],
        descriptions: []
      }

      const checkSection = document.getElementById('check-section');
      const cols = Array.from(checkSection.children);

      for(col of cols){
        const desc = { 
          item: col.firstElementChild.firstElementChild.innerHTML,
          checked: col.firstElementChild.lastElementChild.firstElementChild.checked
        }
        payload.descriptions.push(desc);
      }

      console.log(payload);
      doCreate(payload, 
        `${baseURLAPI}/nurse-forms/nurse-services-delivery-forms`, 
        'Form Submitted Successfully!',
        '/dashboard/nurses/nursing-service-delivery?all=true'
        );
      
    });
  }


  if(nursingServicesChecklistForm){
    nursingServicesChecklistForm.addEventListener('submit', e =>{
      e.preventDefault();

      const payload = {
        descriptions: []
      };

      const checkSection = document.getElementsByClassName('check-area');
      const sections = Array.from(checkSection);

      for(section of sections){
        const desc = { title: section.firstElementChild.innerHTML , items: []};
        const cols = section.children[1].children;
        for(let i=0; i < cols.length; i++){
          if(cols[i].className === 'row'){
            for(col of cols[i].children){
              const kid = {title: col.firstElementChild.firstElementChild.innerHTML};
              kid.checked = col.firstElementChild.lastElementChild.firstElementChild.checked;
              desc.items[i-1] ? desc.items[i-1].kids.push(kid) : desc.items[i-2].kids.push(kid); // Takes care of final value of 'i' after loop
            }
            continue;
          }
          const item = { title: cols[i].lastElementChild.firstElementChild.innerHTML, kids: []};
          item.checked = cols[i].lastElementChild.lastElementChild.firstElementChild.checked;
          desc.items.push(item);
        }
        payload.descriptions.push(desc);
      }

      console.log(payload);
      doCreate(payload, 
        `${baseURLAPI}/nurse-forms/nurse-services-checklist-forms`, 
        'Form Submitted Successfully!',
        '/dashboard/nurses/nursing-service-checklist?all=true'
        );

    }); 
  }

  if(nursingTasksScreeningForm){
    
    const sectionACheckYes = document.getElementById('section-a-check-yes');
    const sectionACheckNo = document.getElementById('section-a-check-no');

    sectionACheckYes.addEventListener('change', e =>{
      $('#section-administration').css('display','none');
    });
    sectionACheckNo.addEventListener('change', e =>{
      $('#section-administration').css('display', 'block');
    });

    nursingTasksScreeningForm.addEventListener('submit', e =>{
      e.preventDefault();

      const dateArr = (document.getElementById('date').value).split('/');
      const dateArr2 = (document.getElementById('finalDate').value).split('/');

      const payload = {
        programParticipant : document.getElementById('programParticipant').value,
        date: reFormatDate(dateArr),
        physicianDelegation: sectionACheckYes.checked ? 'Yes': 'No',
        individualSignature: {
          individual: document.getElementById('individualSignature').value,
          date: reFormatDate(document.getElementById('individualDate').value.split('/'))
        },
        programProviderSignature: {
          providerSignature: document.getElementById('providerSignature').value,
          date: reFormatDate(document.getElementById('providerDate').value.split('/'))
        },
        signature: {
          sign: document.getElementById('finalSignature').value,
          title: document.getElementById('finalTitle').value,
          date: reFormatDate(dateArr2)
        },
        medicalAdministration: {},
        programProviderReview: {}
      }

      //If section B exists, then get data from form
      if(sectionACheckNo.checked){
        const sectionAdministration = document.getElementById('section-administration');
        const row = sectionAdministration.children[1];
        payload
        .medicalAdministration
        .requiresAdministration = row.firstElementChild.children[1].firstElementChild.firstElementChild.checked ?
        'Yes': 'No';

        const row2 = sectionAdministration.children[4];
        const routes = [];
        for(col of row2.children){
          const route = { route: col.firstElementChild.firstElementChild.innerHTML };
          route.checked = col.firstElementChild.lastElementChild.firstElementChild.checked;
          routes.push(route);
        }
        //Set routes to playload
        payload.medicalAdministration.routes = routes;
        
        const subSections = document.getElementsByClassName('sub-section');
        const subTitles = document.getElementsByClassName('sub-titles');

        const subSectionsArr = Array.from(subSections);
        const titles = Array.from(subTitles).map(el => el.innerHTML);

        const sections = [];
        for(const [i, subSect] of subSectionsArr.entries()){
          const section = { title: titles[i] };
          section.questions = [];
          for(col of subSect.children[0].children){
            const question = { 
              question: col.firstElementChild.firstElementChild.innerHTML,
              answer: col.firstElementChild.lastElementChild.firstElementChild.checked
            }
            section.questions.push(question);
          }
          sections.push(section);
        }
        //Set sections to payload
        payload.medicalAdministration.sections = sections;
      }

      const reviewSection = document.querySelector('#section-review .row');
      const reviews = [];
      for(col of reviewSection.children){
        const review = { 
          reviewText: col.firstElementChild.lastElementChild.innerHTML,
          checked: col.firstElementChild.firstElementChild.firstElementChild.checked
        }
        reviews.push(review);
      }
      
      //Add reviews to payload
      payload.programProviderReview.reviews = reviews;
      console.log(payload);
      doCreate(payload, 
        `${baseURLAPI}/nurse-forms/nursing-tasks-screening-forms`, 
        'Form Submitted Successfully!',
        '/dashboard/nurses/nursing-tasks-screening?all=true'
        );
    });
  }

  if(exclusionHostHomeForm){
    exclusionHostHomeForm.addEventListener('submit', e =>{
      e.preventDefault();

      const payload = {
        individualName: document.getElementById('individualName').value,
        hhccProviderName: document.getElementById('hhccProviderName').value,
        nurseSignature: document.getElementById('nurseSignature').value,
        date: reFormatDate(document.getElementById('date').value.split('/'))
      }

      console.log(payload);
      doCreate(payload, 
        `${baseURLAPI}/nurse-forms/exclusion-host-home-forms`, 
        'Form Submitted Successfully!',
        '/dashboard/nurses/exclusion-of-hhcc?all=true'
        );

    });
  }

  if(rnDelegationChecklistForm){
    rnDelegationChecklistForm.addEventListener('submit', e =>{
      e.preventDefault();

      const payload = {
        providerName: document.getElementById('providerName').value,
        reviewerIndividual: document.getElementById('reviewerIndividual').value,
        contractComponentCode: document.getElementById('contractComponentCode').value,
        date: reFormatDate(document.getElementById('date').value.split('/')),
        sections: []
      }

      const sections = document.getElementsByClassName('section');
      const sectionTitles = document.getElementsByClassName('section-title');

      const sects = Array.from(sections);
      const titles = Array.from(sectionTitles).map(el => el.innerHTML);

      console.log(titles);
      console.log(sects[4].children[1].children.length);

      for(const [i, sect] of sects.entries()){
        const section = { title: titles[i] }
        section.items = [];
        for(row of sect.children){
          if(row.children.length >= 3){
            const item = {
              item: row.children[0].innerHTML.trim().replace(/  +/g, ' '),
              response: getResponse(row.children[1].children[0].firstElementChild.firstElementChild.checked, row.children[1].children[1].firstElementChild.firstElementChild.checked),
              issues: row.children[2].firstElementChild.lastElementChild.value
            }
            section.items.push(item);
          }
        }
        payload.sections.push(section);
      }

      function getResponse(first, second){
        if(first) return 'yes';
        else if(second) return 'no';
        else return 'n/a';
      }

      console.log(payload);
      doCreate(payload, 
        `${baseURLAPI}/nurse-forms/rn-delegation-checklist-forms`, 
        'Form Submitted Successfully!',
        '/dashboard/nurses/rn-delegation-checklist?all=true'
        );

    });
  }

  //Comprehensive Nursing Assessment Form
  if(comprehensiveNursingAssessmentForm){

    const reviewCheck = document.getElementById('review-check');
    const statusCheck = document.getElementById('status-check');
    const systemsCheck = document.getElementById('systems-check');

    $('#status-section').toggle();
    $('#systems-section').toggle();

    reviewCheck.addEventListener('change', e =>{
      $('#review-section').toggle();
    });

    statusCheck.addEventListener('change', e =>{
      $('#status-section').toggle();
    });

    systemsCheck.addEventListener('change', e =>{
      $('#systems-section').toggle();
    });

    const addRowButton = document.getElementById('add-row-btn');
      let counter1 = 0;

      addRowButton.addEventListener('click', () =>{
        addRow(counter1, 'medication');
        counter1++;
      });

      function addRow(id, type){
        let html; 
        switch(type){
          case 'medication':
            html = `
            <div class="card" id="card-${id}" style="background:#f8f7f7;">
              <div class="card-header">
                <button class="btn btn-link btn-danger btn-just-icon" id="close-${id}"><i class="material-icons">close</i></button>
              </div>
              <div class="card-body medication-area">
                <div class="row">
                  <div class="col-md-2">
                    <div class="form-group">
                      <label class="bmd-label-floating">Medication *</label>
                      <input type="text" class="form-control">
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="form-group">
                      <label class="bmd-label-floating">Dose *</label>
                      <input type="text" class="form-control">
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="form-group">
                      <label class="bmd-label-floating">Freq *</label>
                      <input type="text" class="form-control">
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="form-group">
                      <label class="bmd-label-floating">Route *</label>
                      <input type="text" class="form-control">
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-group">
                      <label class="bmd-label-floating">Purpose / Rationale *</label>
                      <input type="text" class="form-control">
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-group">
                      <label class="bmd-label-floating">Side Effects / Labs*</label>
                      <input type="text" class="form-control">
                    </div>
                  </div>
                </div><br>
              </div>
            </div>
            `;
            break;
        }
        $('.signature-row').before(html);

        $(`#close-${id}`).click(() =>{
          $(`#card-${id}`).remove();
        });
      }

    comprehensiveNursingAssessmentForm.addEventListener('submit', e =>{
      e.preventDefault();

      const payload = {
        individualName: document.getElementById('individualName').value,
        dob: reFormatDate(document.getElementById('date').value.split('/')),
        todaysDate: reFormatDate(document.getElementById('todaysDate').value.split('/'))
      }

      //Handle review section if not hidden
      if($('#review-section').css('display') === 'block'){
        payload.review = {
          title: document.querySelector('#review-section h3').innerHTML,
          rn: document.getElementById('review-rn').value,
          individual: document.getElementById('review-individual').value,
          date: reFormatDate(document.getElementById('review-date').value.split('/')),
          healthCareTeam: {
            title: document.querySelector('#review-section #healthcare-title').innerHTML,
            content: []
          },
          supports: { content: [] },
          healthHistory: {
            title: document.querySelector('#review-section #history-title').innerHTML,
            content: []
          },
          currentMedications:[]
        }
        let container = document.getElementsByClassName('healthcare-row');
        let container2 = document.getElementsByClassName('support-row');
        let container3 = document.getElementsByClassName('history-row');

        container = Array.from(container);
        container2 = Array.from(container2);
        container3 = Array.from(container3);

        for(el of container){
          let content = { 
            title: el.firstElementChild.innerHTML,
            practitioner: el.children[1].firstElementChild.lastElementChild.value,
            lastSeen: reFormatDate(el.children[2].firstElementChild.lastElementChild.value.split('/')),
            comment: el.children[3].firstElementChild.lastElementChild.value
          };
          payload.review.healthCareTeam.content.push(content);
        }
        for(el of container2){
          let content = { 
            title: el.firstElementChild.innerHTML,
            relationship: el.children[1].firstElementChild.lastElementChild.value,
            telephoneNo: el.children[2].firstElementChild.lastElementChild.value,
          };
          payload.review.supports.content.push(content);
        }
        for(el of container3){
          let content = { 
            title: el.firstElementChild.innerHTML,
            diagnosis: el.children[1].firstElementChild.lastElementChild.value
          };
          payload.review.healthHistory.content.push(content);
        }

        //Medications area
        let areas = document.getElementsByClassName('medication-area');
        areas = Array.from(areas);
        if(areas){
          for(area of areas){
            let row = area.firstElementChild;
            let medication = {
              medication: row.children[0].firstElementChild.lastElementChild.value,
              dose: row.children[1].firstElementChild.lastElementChild.value,
              freq: row.children[2].firstElementChild.lastElementChild.value,
              route: row.children[3].firstElementChild.lastElementChild.value,
              purpose: row.children[4].firstElementChild.lastElementChild.value,
              sideEffects: row.children[5].firstElementChild.lastElementChild.value
            }
            payload.review.currentMedications.push(medication);
          }
        }
      }

      //
      if($('#status-section').css('display') === 'block'){
        const currentStatus = {
          title: document.querySelector('#status-section h3').innerHTML,
          currentHistory: [],
          vitalSigns: {
            bloodPressure: document.getElementById('bloodPressure').value,
            pulse: {
              rate: document.getElementById('pulseRate').value,
              rhythm: document.getElementById('pulseRhythm').value
            },
            respirations: {
              rate: document.getElementById('respirationsRate').value,
              rhythm: document.getElementById('respirationsRhythm').value
            },
            temperature: document.getElementById('vitalTemperature').value,
            painLevel: document.getElementById('painLevel').value,
            bloodSugar: document.getElementById('bloodSugar').value,
            weight: document.getElementById('vitalWeight').value,
            height: document.getElementById('vitalHeight').value,
            comments: document.getElementById('vitalComments').value,
          },
          labs: document.getElementById('vitalLabs').value,
          rn: document.getElementById('vital-rn').value,
          individual: document.getElementById('vital-individual').value,
          date: reFormatDate(document.getElementById('vital-date').value.split('/'))
        };

        //Current status area 
        const historyRow = document.getElementById('medical-history-row');
        for(col of historyRow.children){
          const history = { 
            history: col.firstElementChild.firstElementChild.innerHTML,
            response: col.firstElementChild.lastElementChild.firstElementChild.value
          }
          currentStatus.currentHistory.push(history);
        }
        payload.currentStatus = currentStatus;

        //Fall Risk Assessment Area
        const assessment = {
          response: document.getElementById('risk-assessment-check').checked,
          types: {
            neurological: document.getElementById('assessment-neurological').checked,
            musculoskeletal: document.getElementById('assessment-musculoskeletal').checked,
            unknown: document.getElementById('assessment-unknown').checked
          },
          comments: document.getElementById('vitalComments').value
        }
        payload.currentStatus.assessment = assessment;
      }


      if($('#systems-section').css('display') === 'block'){
        const systemsReview = {
          title: document.querySelector('#systems-section h3').innerHTML,
          rn: document.getElementById('systems-rn').value,
          individual: document.getElementById('systems-individual').value,
          date: reFormatDate(document.getElementById('systems-date').value.split('/'))
        }

        //Neurological Area
        const neurological = {
          aims: {
            title: document.querySelector('#neuro-aims-row div p').innerHTML,
            response: document.querySelector('#neuro-aims-row div').children[1].firstElementChild.firstElementChild.checked ? 'Attached':'Deferred'
          },
          illness: [],
          seizures: {}
        }

        const row = document.getElementById('neuro-illness-row');
        for(let i=0; i<row.children.length -2; i++){
          const illness = {
            title: row.children[i].firstElementChild.innerHTML,
            response: row.children[i].children[1].firstElementChild.firstElementChild.checked ? 'yes': 'no'
          }
          neurological.illness.push(illness);
        }

        neurological.seizures.response = document.getElementById('seizures-check').checked ? 'yes': 'no';
        neurological.seizures.frequency = document.getElementById('seizures-freq').value;
        neurological.seizures.duaration = document.getElementById('seizures-duration').value;

        neurological.comments = document.getElementById('seizuresComments').value;

        systemsReview.neurological = neurological;
        // End neurological

        //EENT Area
        const eens = [];
        let rows = document.getElementsByClassName('eent-row');
        let titles = document.getElementsByClassName('eent-section-title');
        rows = Array.from(rows); titles = Array.from(titles);

        titles = titles.map(title => title.innerHTML);
        const throat = { checks: []};

        for(let i=0; i< rows.length; i++){
          if(i === rows.length - 1){
            //Handle throat
            for(col of rows[rows.length -1].children){
              const throatCheck = {
                name: col.firstElementChild.firstElementChild.innerHTML,
                checked: col.firstElementChild.lastElementChild.firstElementChild.checked
              }
              throat.checks.push(throatCheck);
            }
          }
          else{
            //Other een
            const een = { title: titles[i], checks: [] };
            for(col of rows[i].children){
              const check = { 
                name: col.firstElementChild.firstElementChild.innerHTML,
                checked: col.firstElementChild.lastElementChild.firstElementChild.checked
              }
              een.checks.push(check);
            }
            eens.push(een);
          }
        }

        throat.swallowStudy = document.getElementById('swallow-study').checked ? 'yes': 'no';
        throat.results = document.getElementById('throatResults').value;
        throat.comments = document.getElementById('throatComments').value;
        throat.date = reFormatDate(document.getElementById('swallowDate').value.split('/'));

        systemsReview.throat = throat;
        systemsReview.een = eens;

        //Cardiovascular Area
        const cardiovascular = {};
        const cardioRow = document.getElementById('cardio-row');
        const questions = [];
        for(let i=0; i< cardioRow.children.length; i++){
          const question = { 
            name: cardioRow.children[i].firstElementChild.innerHTML,
            response: cardioRow.children[i].children[1].firstElementChild.firstElementChild.checked ? 'yes': 'no'
          }
          questions.push(question);
        }
        cardiovascular.questions = questions;
        cardiovascular.normalRange = document.getElementById('cardioRange').value;
        cardiovascular.comments = document.getElementById('cardioComments').value;

        systemsReview.cardiovascular = cardiovascular;

        //Respiratory Area
        const respiratory = {};
        const breathingRow = document.getElementById('breathing-row');
        const breathingIllnessRow = document.getElementById('breathing-illness-row');
        const breathing = []; const breathingOthers = [];
        for(col of breathingRow.children){
          const item = { 
            type: col.firstElementChild.firstElementChild.innerHTML,
            checked: col.firstElementChild.lastElementChild.firstElementChild.checked
          }
          breathing.push(item);
        }
        respiratory.breathing = breathing;

        for(let i=0; i< breathingIllnessRow.children.length -2; i++){
          const illness = { 
            name: breathingIllnessRow.children[i].firstElementChild.innerHTML,
            response: breathingIllnessRow.children[i].children[1].firstElementChild.firstElementChild.checked ? 'yes': 'no'
          }
          breathingOthers.push(illness);
        }
        respiratory.others = breathingOthers;
        const oxygen = {
          response: document.getElementById('respiratory-oxygen').checked ? 'yes': 'no',
          type: document.getElementById('oxygen-type').value
        }
        respiratory.oxygen = oxygen;
        respiratory.comments = document.getElementById('respiratoryComments').value;

        systemsReview.respiratory = respiratory;

        //Gastrointestinal Area
        const gastrointestinal = {};
        const gastroTypeRow = document.getElementById('gastro-type-row');
        const gastroBowelRow = document.getElementById('gastro-bowel-row');
        const gastroOthersRow = document.getElementById('gastro-others-row');

        const gastroTypes = []; const gastroBowel = []; const gastroOthers = [];
        for(col of gastroTypeRow.children){
          const type = { 
            name: col.firstElementChild.firstElementChild.innerHTML,
            checked: col.firstElementChild.lastElementChild.firstElementChild.checked
          }
          gastroTypes.push(type);
        }
        for(col of gastroBowelRow.children){
          const bowel = { 
            name: col.firstElementChild.firstElementChild.innerHTML,
            desc: col.firstElementChild.lastElementChild.value
          }
          gastroBowel.push(bowel);
        }
        for(col of gastroOthersRow.children){
          const other = { 
            name: col.firstElementChild.innerHTML,
            response: col.children[1].firstElementChild.firstElementChild.checked ? 'yes':'no'
          }
          gastroOthers.push(other);
        }

        gastrointestinal.type = gastroTypes;
        gastrointestinal.bowel = gastroBowel;
        gastrointestinal.others = gastroOthers;
        gastrointestinal.comments = document.getElementById('gastroComments').value;

        systemsReview.gastrointestinal = gastrointestinal;

        //Musculoskeletal Area
        const musculo = {};
        const musculoRow = document.getElementById('musculo-row');
        const musculoOthers = [];
        for(let i=0; i < musculoRow.children.length - 1; i++){
          const item = {
            name: musculoRow.children[i].firstElementChild.innerHTML,
            response: musculoRow.children[i].children[1].firstElementChild.firstElementChild.checked ? 'yes':'no'
          }
          musculoOthers.push(item);
        }
        musculo.others = musculoOthers;
        musculo.comments = document.getElementById('muscloskeletalComments').value;

        systemsReview.musculoskeletal = musculo;

        //Genitourinary Area
        const genitourinary = {};
        const genitoRow = document.getElementById('genito-row');
        const genitoOthers = [];
        for(let i=0; i < genitoRow.children.length - 3; i++){
          const item = {
            name: genitoRow.children[i].firstElementChild.innerHTML,
            response: genitoRow.children[i].children[1].firstElementChild.firstElementChild.checked ? 'yes':'no'
          }
          genitoOthers.push(item);
        }
        const menopausal = {
          response: document.getElementById('menopausal-check').checked ? 'yes':'no',
          date: reFormatDate(document.getElementById('menopausalDate').value.split('/'))
        }

        genitourinary.others = genitoOthers;
        genitourinary.menopausal = menopausal;
        genitourinary.menstrualDate = reFormatDate(document.getElementById('menstrualDate').value.split('/'));
        genitourinary.comments = document.getElementById('genitoComments').value;

        systemsReview.genitourinary = genitourinary;

        //Integumentary Area
        const integumentary = {};
        const integumentarySkinRow = document.getElementById('integumentary-skin-row');
        const integumentarySkinIllness = document.getElementById('integumentary-skin-illness');

        const skins = []; const others = [];
        for(col of integumentarySkinRow.children){
          const skin = {
          name: col.firstElementChild.firstElementChild.innerHTML,
          checked: col.firstElementChild.lastElementChild.firstElementChild.checked
          }
          skins.push(skin);
        }
        for(col of integumentarySkinIllness.children){
          const other = {
            name: col.firstElementChild.innerHTML,
            response: col.children[1].firstElementChild.firstElementChild.checked ? 'yes':'no'
          }
          others.push(other);
        }

        integumentary.skin = skins;
        integumentary.others = others;
        integumentary.skinAssessment = document.getElementById('skin-assessment-check').checked ? 'Attached':'Deferred';
        integumentary.comments = document.getElementById('integumentaryComments').value;

        systemsReview.integumentary = integumentary;

        //Endocrine Area
        const endocrine = [];
        const endocrineTypes = document.getElementById('endocrine-types');
        const diabMgtRow = document.getElementById('diabetes-management-row');
        const endoTypes = []; const endoManagement = [];
        for(col of endocrineTypes.children){
          const type = {
            name: col.firstElementChild.innerHTML,
            response: col.children[1].firstElementChild.firstElementChild.checked ? 'yes':'no'
          }
          endoTypes.push(type);
        }
        for(col of diabMgtRow.children){
          const item = {
            name: col.firstElementChild.firstElementChild.innerHTML,
            checked: col.firstElementChild.lastElementChild.firstElementChild.checked
          }
          endoManagement.push(item);
        }

        endocrine.management = endoManagement;
        endocrine.types = endoTypes;
        endocrine.bSRange = document.getElementById('bloodSugarRange').value;
        endocrine.diabetesType = document.getElementById('diabetesType').value;
        endocrine.comments = document.getElementById('endocrineComments').value;

        systemsReview.endocrine = endocrine;

        payload.systemsReview = systemsReview;
      }



      console.log(payload);
      doCreate(payload, 
        `${baseURLAPI}/nurse-forms/comprehensive-nursing-assessment-forms`, 
        'Form Submitted Successfully!',
        '/dashboard/nurses/comprehensive-nursing-assessment?all=true'
        );

    });
  }

})(createResource, updateResource);