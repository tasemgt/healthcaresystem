/* eslint-disable */

const baseURL = '';
const baseURLAPI = '/api/v1';


//INITIALIZE DATATABLES
$(document).ready( function () {
  $('.table').DataTable({
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

//Modals for forms
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

    for(question of formData.questions){
      $('.questions-section').append(`
          <div class="col-md-4 q-title">
            <h5 class="text-primary modal-headings">${question.title}</h5>
          </div> 
        `)
      for(q of question.questions){
        $('.q-title').append(`<p class="text-muted modal-items mod-recommendations">${q.question}: <strong>${q.answer}</strong></p>`)
      }
    }
  }
  

  //Side in the modal body for different forms
  formData.recordType === 'DentalExam' ? $(".dental-exam").css('display', 'block'): $(".dental-exam").css('display', 'none');
  formData.recordType === 'FireEmergencyForm' ? $(".fire-drill").css('display', 'block'): $(".fire-drill").css('display', 'none');
  formData.recordType === 'HotWaterFireForm' ? $(".hot-water-fire").css('display', 'block'): $(".hot-water-fire").css('display', 'none');
  formData.recordType === 'EnvChecklistForm' ? $(".environmental-check").css('display', 'block'): $(".environmental-check").css('display', 'none');

});

// $('#myModal').on('shown.bs.modal', function () {
//   $('#myInput').trigger('focus')
// })


// HANDLES DATE FORMATTING ON TABLES
let formatedDate = document.getElementsByClassName('formatted-date');

if(formatedDate && formatedDate.length > 0){
  formatedDate = Array.from(formatedDate);

  for(let i=0; i< formatedDate.length; i++){
    formatedDate[i].innerHTML = moment(formatedDate[i].innerHTML).format('Do MMMM YYYY');
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
const createResource = async (payload, url, successMessage, redirectURL) =>{
  console.log(payload);
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
(function(doAction){

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

      doAction(payload, `${baseURLAPI}/users`, 'User created successfully', '/dashboard/users');
    });
  }
})(createResource);


//Search Application to populate New User form
(function(doAction){

  //Get Form Data
  const applicationId = document.querySelector('#search');
  const searchApplicationBtn = document.querySelector('#searchApplication');

  if(searchApplicationBtn){
    searchApplicationBtn.addEventListener('click', async () =>{

    const response = await doAction(`${baseURL}/employment/${applicationId.value}?approved=true`, 'Data obtained...');
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


//Updating Application/Employment
(function(doAction){

  //Get Form Data
  const saveButton = document.querySelector('#save_application_btn');
  const approvedCheck = document.querySelector('#approved');

  const applicationId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

  if(saveButton){
    saveButton.addEventListener('click', () =>{
      const payload = {
        approved : approvedCheck.checked
      }

      doAction(payload, `${baseURL}/employment/${applicationId}`, 'Successfully Updated', '/dashboard/users/add');
    });
  }
})(updateResource);


//Consumer Forms
(function(doAction){

  //Get Form Data
  const dentalForm = document.querySelector('#dental_form');
  const hotFireForm = document.querySelector('#hot_fire_form');
  const fireEmergencyForm = document.querySelector('#fire_emergency_form');
  const environmentalChecklistForm = document.querySelector('#environmental_checklist_form');

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
      doAction(payload, 
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
      doAction(payload, 
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

      doAction(payload, 
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

      doAction(payload, 
        `${baseURLAPI}/consumer-forms/fire-emergency-form`, 
        'Form Submitted Successfully!',
        '/dashboard/consumer-forms'
        );
    });
  }

})(createResource);
