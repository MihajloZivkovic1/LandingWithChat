const TYPE_ANSWER = 0;
const TYPE_QUESTION = 1;

var currentStep = $('.step.active');
let userUsername = 'You';


$(document).ready(function () {

  var typingAnimation = document.querySelector(".typing-animation");
  var selectedOption = document.getElementById("sex_seeking");
  var provinceOption = document.getElementById("province");
  var ageOption = document.getElementById("select_age");
  var usernameField = document.getElementById("uname");


  selectedOption.addEventListener("change", function () {
    document.querySelector('.p-step-button').removeAttribute("disabled");
  })

  provinceOption.addEventListener("change", function () {
    document.querySelector('.p-step-button').removeAttribute("disabled");
  })


  ageOption.addEventListener("change", function () {
    document.querySelector('.p-step-button').removeAttribute("disabled");
  })

  function updateCurrentStep() {

    var currentStep = $('.step.active');
    var currentId = currentStep.attr('id');
    console.log('currentId', currentId);

    const stepsConfig = {
      step1: {
        message: "Hello, what is your username?",
        elementId: "uname",
        nextMessage: null,
      },
      step2: {
        message: "What is your gender",
        elementId: "sex_seeking",
        nextMessage: function () { userUsername = usernameField.value; return `My name is ${userUsername}` }
      },
      step3: {
        message: "Where are you from",
        elementId: "province",
        nextMessage: function () { return selectedOption.options[selectedOption.selectedIndex].text; }
      },
      step4: {
        message: "How old are you",
        elementId: "select_age",
        nextMessage: function () { return provinceOption.options[provinceOption.selectedIndex].text; },

      },
      step5: {
        message: `Okay  ${userUsername}, what is your email`,
        elementId: "email",
        nextMessage: function () { return ageOption.options[ageOption.selectedIndex].text; },
      },
      step6: {
        message: `Okay  ${userUsername}, please choose your password`,
        elementId: "password",
        nextMessage: function () { return document.getElementById("email").value; },
      }
    };

    let stepConfig = stepsConfig[currentId];

    if (stepConfig) {
      handleStep(stepConfig);
    }
  }


  $('.p-step-button').on('click', function () {
    var currentStep = $('.step.active');
    var nextStep = currentStep.next('.step');

    currentStep.hide().removeClass('active');
    nextStep.show().addClass('active');

    updateCurrentStep();
  });

  updateCurrentStep();




  const userNameField = document.querySelector("#uname");
  const nextUsernameBtn = document.querySelector(".p-step-button");
  userNameField.addEventListener("keyup", function () {
    console.log(this.value);

    if (this.value.length < 5) {

      this.setCustomValidity("De gebruikersnaam moet minimaal 5 tekens lang zijn.");
      this.reportValidity();
      nextUsernameBtn.disabled = true;
    } else {
      this.setCustomValidity("");
      nextUsernameBtn.disabled = false;

      fetch(`https://www.staging.ondeugende.date/controller/validation/index.php?addr=12345432sdfhkjhsjdggt3234pl,kjhsgsff&username=${userNameField.value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === true) {
            console.log(data)
            this.setCustomValidity("")
            nextUsernameBtn.disabled = false;
          }
          else {
            console.log(data);
            this.setCustomValidity(data.message);
            this.reportValidity();
            nextUsernameBtn.disabled = true;
          }
        })
        .catch((error) => {
          console.error('Error:' + error);
        })
    }
  });

  const emailField = document.querySelector("#email");
  const emailNextBtn = document.querySelector(".p-step-button");


  emailField.addEventListener('keyup', function () {
    var email = document.getElementById('email').value;

    if (!validateEmail(email)) {
      console.log("ovde sam");
      this.setCustomValidity("De e-mail is niet geldig");
      this.reportValidity();
      emailNextBtn.disabled = true;
    }
    else {
      this.setCustomValidity("");
      emailNextBtn.disabled = false;

      fetch(`https://www.staging.ondeugende.date/controller/validation/index.php?addr=12345432sdfhkjhsjdggt3234pl,kjhsgsff&email=${emailField.value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },

      })
        .then(response => response.json())
        .then(data => {
          if (data.status === true) {
            console.log(data);
            this.setCustomValidity("");
            this.reportValidity();
            emailNextBtn.disable = false;
          }
          else {
            console.log(data);
            this.setCustomValidity(data.message)
            this.reportValidity();
            emailNextBtn.disable = true;
          }
        })
    };
  })


  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }


  function handleStep(config) {
    console.log(`Handling step with message: ${config.message}`);

    if (config.nextMessage) {
      let nextMessage = typeof config.nextMessage === "function" ? config.nextMessage() : config.nextMessage;
      addMessage(nextMessage, 0);
    }

    setTimeout(function () {
      $('.typing-animation').hide();
      addMessage(config.message, 1);
      document.querySelector(".user-bubble").classList.remove("hidden");
      document.getElementById(config.elementId).removeAttribute("disabled");
    }, 2000);

    $('.typing-animation').show();
    document.querySelector('.p-step-button').setAttribute("disabled", "btn");
  }
})

function addMessage(message, type) {
  let userClass = 'user-bubble'
  let username = 'Susan'
  let onlineIndicator = 'online-indicator'
  let photo = 'images/user-photo.webp'

  if (type === TYPE_ANSWER) {
    userClass = 'user-reply'
    username = userUsername
    console.log(userUsername)
    onlineIndicator = ''
    photo = 'images/avatar.jpg'
  }
  let template = `<div class="chat-bubble ${userClass}">
                      <div class="user-info">
                        <img src="${photo}" alt="Susan Avatar" class="user-photo">
                          <span class="user-name">${username}</span>
                          <span class="${onlineIndicator}"></span>
                      </div>
                      <div class="message">
                        <p class="message-text"> ${message} </p>

                      </div>
                    </div>`;


  $('.messages').prepend(template);
}
