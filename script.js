const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreContainer = document.getElementById('score-container');
const scoreDisplay = document.getElementById('score');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
//const timerElement = document.getElementById('time');
const saveButton = document.getElementById('save-btn');
const sendButton = document.getElementById('send-btn');

let shuffledQuestions, currentQuestionIndex;
let score = 0;
let totalTime; // Total quiz time (totalQuestions * 15)
let timerInterval;
let userChoices = []; // To store the user's choices
let selectedAnswerText = null; // To store the last selected answer
let correctAnswerText = null; // To store the correct answer for the current question
let numQuestionsToSolve; // Number of questions user wants to solve

const questions = [
  {
    question: "A braking action given by ATS of 0.25 and below is;",
    answers: [
      { text: "Medium.", correct: false },
      { text: "Good.", correct: false },
      { text: "Medium/poor.", correct: false },
      { text: "Poor.", correct: true }
    ]
  },
  {
    question: "A checklist of AIP supplements currently in force shall be issued at intervals of;",
    answers: [
      { text: "not more than three months.", correct: false },
      { text: "not more than one month.", correct: true },
      { text: "not more than 2 months.", correct: false },
      { text: "not more than 28 days.", correct: false }
    ]
  },
  {
    question: "A checklist of NOTAM currently in force shall be issued at the AFTN at intervals of;",
    answers: [
      { text: "not more than 28 days.", correct: false },
      { text: "not more than 15 days.", correct: false },
      { text: "not more than one month.", correct: true },
      { text: "not more than 10 days.", correct: false }
    ]
  },
  {
    question: "A circling approach is;",
    answers: [
      { text: "a flight manoeuvre to be performed only under radar vectoring.", correct: false },
      { text: "a visual manoeuvre to be conducted only in IMC.", correct: false },
      { text: "a contact flight manoeuvre.", correct: false },
      { text: "a visual flight manoeuvre keeping the runway in sight.", correct: true }
    ]
  },
  {
    question: "A Control Zone shall extend laterally to at least;",
    answers: [
      { text: "10 miles from the centre of the aerodrome.", correct: false },
      { text: "20 miles from the centre of the aerodrome.", correct: false },
      { text: "15 miles from the centre of the aerodrome.", correct: false },
      { text: "5 nautical miles from the centre of the aerodrome.", correct: true }
    ]
  },
  {
    question: "A controlled airspace extending upwards from a specified limit above the earth is;",
    answers: [
      { text: "Control zone.", correct: false },
      { text: "Flight Information Region.", correct: false },
      { text: "Advisory airspace.", correct: false },
      { text: "Control area.", correct: true }
    ]
  },
  {
    question: "A controlled airspace extending upwards from the surface of the earth to a specified upper limit is;",
    answers: [
      { text: "Air traffic zone.", correct: false },
      { text: "Advisory airspace.", correct: false },
      { text: "Control area.", correct: false },
      { text: "Control zone.", correct: true }
    ]
  },
  {
    question: "A controlled flight is requested to inform the appropriate ATC unit whenever the average True Air Speed at cruising level varies by;",
    answers: [
      { text: "5%.", correct: true },
      { text: "2%.", correct: false },
      { text: "3%.", correct: false },
      { text: "10%.", correct: false }
    ]
  },
  {
    question: "A double white cross displayed horizontally in the signal area means;",
    answers: [
      { text: "The aerodrome is being used by gliders.", correct: true },
      { text: "Special precautions while landing.", correct: false },
      { text: "An area unit for the movement of aircraft.", correct: false },
      { text: "Bad state of the taxiways.", correct: false }
    ]
  },
  {
    question: "A flashing red light from control tower during an approach to land means;",
    answers: [
      { text: "Continue circling.", correct: false },
      { text: "The airport is unsafe, do not land.", correct: true },
      { text: "The airport is temporarily closed.", correct: false },
      { text: "Give way to other aircraft.", correct: false }
    ]
  },
  {
    question: "If radio communication is established during an interception but communications in a common language are not possible, which phrase should be pronounced by the intercepting aircraft to request the intercepted aircraft to descend for landing?",
    answers: [
      { text: "Descend.", correct: true },
      { text: "Descend for landing.", correct: false },
      { text: "You land.", correct: false },
      { text: "Let down.", correct: false }
    ]
  },
  {
    question: "If radio contact with the intercepting aircraft is established but communication in a common language is not possible, which phrase should be pronounced by the intercepted aircraft to communicate inability to comply?",
    answers: [
      { text: "CAN NOT.", correct: true },
      { text: "UNABLE TO COMPLY.", correct: false },
      { text: "CAN NOT COMPLY.", correct: false },
      { text: "NOT POSSIBLE.", correct: false }
    ]
  },
  {
    question: "On aerodromes, aircraft taxiing on the manoeuvring area shall give way to;",
    answers: [
      { text: "Other converging aircraft.", correct: false },
      { text: "Aircraft taking off.", correct: true },
      { text: "All vehicles except the “follow me” vehicle.", correct: false },
      { text: "Other vehicles and pedestrians.", correct: false }
    ]
  },
  {
    question: "Except when clearance is obtained from an ATC unit, a VFR flight cannot enter or leave a control zone when ceiling is less than;",
    answers: [
      { text: "1000 feet or visibility is less than 8 km.", correct: false },
      { text: "1000 feet or visibility is less than 5 km.", correct: false },
      { text: "1500 feet or visibility is less than 5 km.", correct: true },
      { text: "2000 feet or visibility is less than 5 km.", correct: false }
    ]
  },
  {
      question: "The VMC minima for an airspace classified as “B” above 10.000 feet MSL are;",
      answers: [
        { text: "1 nautical mile horizontally and 1000 feet vertically from clouds, 8 km visibility.", correct: false },
        { text: "1500 metres horizontally, 1000 feet vertically from clouds, 8 km visibility.", correct: true },
        { text: "1 mile horizontally and 1000 feet vertically from clouds, 5 km visibility.", correct: false },
        { text: "clear of clouds, 8 km visibility.", correct: false }
      ]
    },
    {
      question: "The VMC minima for an airspace classified as “G” above 10.000 feet MSL are;",
      answers: [
        { text: "1 nautical mile horizontally and 1000 feet vertically from clouds, 5 km visibility.", correct: false },
        { text: "1500 m horizontally, 1000 feet vertically from clouds, 8 km visibility.", correct: true },
        { text: "1 nautical mile horizontally and 1000 feet vertically from clouds, 8 km visibility.", correct: false },
        { text: "1500 m horizontally and 1000 feet vertically from clouds, 5 km visibility.", correct: false }
      ]
    },
    {
      question: "A controlled flight is requested to inform the appropriate ATC unit whenever the average True Air Speed at cruising level varies or is expected to vary from that given in the flight plan by plus or minus;",
      answers: [
        { text: "5%.", correct: true },
        { text: "2%.", correct: false },
        { text: "3%.", correct: false },
        { text: "10%.", correct: false }
      ]
    },
    {
      question: "Interception: An aircraft equipped with SSR transponder which is intercepted by another aircraft shall immediately, unless otherwise instructed by the appropriate air traffic service unit, select Mode A;",
      answers: [
        { text: "Code 7000.", correct: false },
        { text: "Code 7700.", correct: true },
        { text: "Code 7600.", correct: false },
        { text: "Code 7500.", correct: false }
      ]
    },
    {
      question: "An aircraft intercepted by another aircraft shall immediately attempt to establish radio communication with the intercepting aircraft on the following frequencies;",
      answers: [
        { text: "243 MHz – 125.5 MHz.", correct: false },
        { text: "121.5 MHz – 282.8 MHz.", correct: false },
        { text: "121.5 MHz – 125.5 MHz.", correct: false },
        { text: "121.5 MHz – 243 MHz.", correct: true }
      ]
    },
    {
      question: "Definitions: A manoeuvre in which a turn is made away from a designated track followed by a turn in the opposite direction to permit the aircraft to intercept and proceed along the reciprocal of the designated track is called a;",
      answers: [
        { text: "Race track", correct: false },
        { text: "Procedure turn", correct: true },
        { text: "Reversal track", correct: false },
        { text: "Base turn", correct: false }
      ]
    },
    {
      question: "ATS airspace’s where IFR and VFR flights are permitted, all flights are subject to air traffic control service and are separated from each other is classified as;",
      answers: [
        { text: "Class A.", correct: false },
        { text: "Class B.", correct: true },
        { text: "Class E.", correct: false },
        { text: "Class D.", correct: false }
      ]
    },
    {
      question: "Aerodrome traffic is;",
      answers: [
        { text: "All traffic in the aerodrome circuit.", correct: false },
        { text: "All traffic on the manoeuvring area and flying in the vicinity of an aerodrome.", correct: true },
        { text: "All traffic on the movement area and flying in the vicinity of an aerodrome.", correct: false },
        { text: "All traffic on the manoeuvring area.", correct: false }
      ]
    },
    {
      question: "Final approach segment: During a precision approach (ILS), glide path interception occurs normally at heights above runway elevation between;",
      answers: [
        { text: "300 m (984 ft) to 900 m (2955 ft).", correct: true },
        { text: "300 m (984 ft) to 600 m (1968 ft).", correct: false },
        { text: "150 m (492 ft) to 300 m (984 ft).", correct: false },
        { text: "150 m (492 ft) to 900 m (2955 ft).", correct: false }
      ]
    },
    {
      question: "Approach procedures - Missed approach - Phases. A complete missed approach procedure consists of the following phases;",
      answers: [
        { text: "Arrival, Intermediate and Final.", correct: false },
        { text: "Initial, Intermediate and Final.", correct: true },
        { text: "Initial and Final.", correct: false },
        { text: "Arrival, Initial, Intermediate and Final.", correct: false }
      ]
    },
  {
      question: "Approach Procedures - Circling. The term used to describe the visual phase of flight after completing an instrument approach, to bring an aircraft into position for landing on a runway which is not suitably located for straight-in approach, is;",
      answers: [
        { text: "Visual approach.", correct: false },
        { text: "Visual manoeuvring (circling).", correct: true },
        { text: "Contact approach.", correct: false },
        { text: "Aerodrome traffic pattern.", correct: false }
      ]
    },
    {
      question: "Approach Procedures - Circling. It is permissible to eliminate from consideration a particular sector where a prominent obstacle exists in the visual manoeuvring (circling) area outside the final approach and missed approach area. When this option is exercised, the published procedure;",
      answers: [
        { text: "permits circling only in VMC.", correct: false },
        { text: "recommends not to perform circling within the total sector in which the obstacle exists.", correct: false },
        { text: "prohibits circling within the total sector in which the obstacle exists.", correct: true },
        { text: "prohibits the circling approach to the affected runway.", correct: false }
      ]
    },
    {
      question: "Holding procedures - Outbound time. The outbound time in a holding pattern above 14.000 ft in still air conditions is;",
      answers: [
        { text: "2 minutes 30 seconds.", correct: false },
        { text: "2 minutes.", correct: false },
        { text: "1 minute.", correct: false },
        { text: "1 minute 30 seconds.", correct: true }
      ]
    },
    {
      question: "Low intensity obstacle lights on mobile objects shall be;",
      answers: [
        { text: "flashing red or preferably yellow.", correct: true },
        { text: "fixed red or preferably orange.", correct: false },
        { text: "fixed red or preferably blue.", correct: false },
        { text: "flashing blue.", correct: false }
      ]
    },
    {
      question: "Low intensity obstacle lights on fixed objects shall be;",
      answers: [
        { text: "flashing red.", correct: false },
        { text: "fixed orange.", correct: false },
        { text: "flashing yellow.", correct: false },
        { text: "fixed red.", correct: true }
      ]
    },
    {
      question: "ICAO ANNEX 14 - Visual aids for navigation - Lights: The colour of the fixed, unidirectional Runway End Lights shall be;",
      answers: [
        { text: "green.", correct: false },
        { text: "white.", correct: false },
        { text: "red.", correct: true },
        { text: "yellow.", correct: false }
      ]
    },
    {
      question: "Visual ground signals: A double white cross displayed horizontally in the signal area indicates that;",
      answers: [
        { text: "this area is unfit for the movement of aircraft.", correct: false },
        { text: "special precautions is needed while approaching for landing on the runway in use.", correct: false },
        { text: "the aerodrome is being used by gliders and that glider flights are being performed.", correct: true },
        { text: "special precautions must be observed due to the state of the taxiways.", correct: false }
      ]
    },
    {
      question: "The aerodrome category for rescue and fire fighting is based on;",
      answers: [
        { text: "the over-all length of the longest aeroplane normally using the aerodrome and its maximum fuselage width.", correct: true },
        { text: "the over-all length of the longest aeroplane normally using the aerodrome and its maximum fuselage weight.", correct: false },
        { text: "the over-all length of the longest aeroplane.", correct: false },
        { text: "the longest aeroplane maximum width only.", correct: false }
      ]
    },
    {
      question: "The obligation of a carrier to transport any person away from the territory of a Contracting State shall terminate from the moment such person has been definitely admitted in other Contracting State of destination.",
      answers: [
        { text: "The obligation is for the Contracting State of the operator.", correct: false },
        { text: "The obligation of the operator terminates as soon as the person leaves the aeroplane.", correct: false },
        { text: "The stated above is correct.", correct: true },
        { text: "The operator has no obligation.", correct: false }
      ]
    },
    {
      question: "Accident, incident notification and reporting. After landing, while taxiing towards the apron, the landing gear of your aircraft sinks into a hole. Nobody gets injured, but the aircraft sustains structural damage. This obliges the crew to delay the departure.",
      answers: [
        { text: "This is an incident and the pilot-in-command must report it to the airport authority within the next 48 hours.", correct: false },
        { text: "Since there is no person injured and the flight is terminated, a damage report has to be made out with the services of the aerodrome in charge of the runway and taxiways for the insurance company.", correct: false },
        { text: "This is an irregularity in the operation. The crew must inform the operator of the aerodrome and establish a report.", correct: false },
        { text: "This is an accident and the crew must follow the procedure relevant to this case.", correct: true }
      ]
    },
  {
      question: "The Alerting Service is provided by;",
      answers: [
        { text: "the Area Control Centres.", correct: false },
        { text: "the ATC unit responsible for the aircraft at that moment, when it is provided with 121.5 MHz.", correct: false },
        { text: "the ATS unit responsible for the aircraft at that moment.", correct: true },
        { text: "only by ATC units.", correct: false }
      ]
    },
    {
      question: "The phases related to an aircraft in emergency or believed in emergency are;",
      answers: [
        { text: "uncertainty phase, urgency phase, distress phase.", correct: false },
        { text: "uncertainty phase, alert phase, distress phase.", correct: true },
        { text: "uncertainty phase, distress phase, urgency phase.", correct: false },
        { text: "uncertainty phase, alert phase, distress phase and urgency phase.", correct: false }
      ]
    },
    {
      question: "A radio communications, 'Distress' differs from 'Urgency' because in the first case;",
      answers: [
        { text: "there is a serious and imminent danger requiring immediate assistance.", correct: true },
        { text: "the aeroplane will not be able to reach a suitable aerodrome.", correct: false },
        { text: "the aeroplane has suffered damages which impair its fitness to fly.", correct: false },
        { text: "the aeroplane or a passenger's safety require the flight immediately interrupted.", correct: false }
      ]
    },
    {
      question: "Alert phase is defined as follows;",
      answers: [
        { text: "An emergency event in which an aircraft and its occupants are considered to be threatened by a danger.", correct: false },
        { text: "A situation where an apprehension exists as to the safety of an aircraft and its occupants.", correct: true },
        { text: "A situation related to an aircraft which reports that the fuel on board is exhausted.", correct: false },
        { text: "A situation related to an aircraft and its occupants are considered to be in a state of emergency.", correct: false }
      ]
    },
    {
      question: "General provisions - handling an ATC-flight plan in case of a delay. In the event of a delay for an uncontrolled flight for which a flight plan has been submitted, the flight plan should be amended or a new flight plan submitted and the old one cancelled, when the delay is exceeding the original;",
      answers: [
        { text: "estimated departure time by 30 minutes.", correct: false },
        { text: "estimated off-block time by 30 minutes.", correct: false },
        { text: "estimated off-block time by 60 minutes.", correct: true },
        { text: "estimated departure time by 60 minutes.", correct: false }
      ]
    },
    {
      question: "Communication Failure - Flight Procedures. You are on a flight in accordance with IFR in IMC, exactly on the current flight plan route. At 18:36 UTC you receive and acknowledge the following instruction from the radar controller; 'Turn immediately, fly heading 050° until further advised'. At 18:37 UTC you discover a communication failure. Two way radio communication cannot be established again.",
      answers: [
        { text: "You continue on Heading 050 for 15 minutes.", correct: false },
        { text: "You continue on Heading 050.", correct: false },
        { text: "You continue on Heading 050 for 30 minutes.", correct: false },
        { text: "You have to return to your current flight plan route.", correct: true }
      ]
    },
    {
      question: "Separation methods and minima - Vertical separation (VSM) acc. Above flight level FL 290 the Vertical Separation Minimum (VSM) for aircraft flying in the same direction shall be;",
      answers: [
        { text: "4000 feet.", correct: true },
        { text: "3000 feet.", correct: false },
        { text: "1500 feet.", correct: false },
        { text: "2000 feet.", correct: false }
      ]
    },
    {
      question: "Approach procedures - Minimum Sector Altitudes / MSA. Minimum Sector Altitudes are established for each aerodrome. The MSA provides an obstacle clearance of at least 300 m (984 ft) within a circle, associated with the homing facility for the approach procedure of that aerodrome. How many NM is the radius of this circle ?",
      answers: [
        { text: "10 NM", correct: false },
        { text: "25 NM", correct: true },
        { text: "5 NM", correct: false },
        { text: "20 NM", correct: false }
      ]
    },
    {
      question: "Separation in the vicinity of aerodromes - Timed approaches. A 'Timed Approach Procedure' may be utilized as necessary in order to expedite the approaches of a number of arriving aircraft. This will be obtained by requesting aircraft to;",
      answers: [
        { text: "notify the time when passing a specified point.", correct: false },
        { text: "pass a specified point inbound at the previously notified time.", correct: true },
        { text: "keep distance and time equal between aircraft in the approach.", correct: false },
        { text: "maintain a specified airspeed during the approach procedure.", correct: false }
      ]
    },
    {
      question: "Unless otherwise prescribed, what is the rule regarding level to be maintained by an aircraft flying IFR outside controlled airspace ?",
      answers: [
        { text: "2000 feet above the highest obstacle within 8 nautical miles of course.", correct: false },
        { text: "1000 feet above the highest obstacle within 8 kilometres of the estimated position of the aircraft.", correct: true },
        { text: "2000 feet above the highest obstacle within 8 kilometres of course.", correct: false },
        { text: "1000 feet above the highest obstacle within 8 nautical miles of course.", correct: false }
      ]
    },
  {
      question: "Aircraft “A” with an ATC clearance is flying in VMC conditions within a control area. Aircraft “B” with no ATC clearance is approaching at approximately the same altitude and on a converging course. Which has the right of way?",
      answers: [
        { text: "Aircraft “A” regardless of the direction which “B” is approaching.", correct: false },
        { text: "Aircraft “B” if “A” is on its left.", correct: true },
        { text: "Aircraft “B” regardless of the direction “A” is approaching.", correct: false },
        { text: "Aircraft “A” if “B” is on its right.", correct: false }
      ]
    },
    {
      question: "Which of the following actions shall be taken in case of a controlled flight deviates from the track?",
      answers: [
        { text: "Notify ATC of the new track immediately and comply with instructions.", correct: false },
        { text: "If VMC, maintain this condition, waiting for the ATC instructions.", correct: false },
        { text: "Inform the ATC unit immediately.", correct: false },
        { text: "Adjust the heading of aircraft to regain track as soon as practicable.", correct: true }
      ]
    },
    {
      question: "While on IFR flight, a pilot has an emergency which causes a deviation from an ATC clearance. What action must be taken?",
      answers: [
        { text: "Squawk 7700.", correct: false },
        { text: "Request an amended clearance or cancel the IFR flight plan.", correct: false },
        { text: "Submit a detailed report to ATC within 24 hours.", correct: false },
        { text: "The appropriate ATC unit shall be notified of the action taken as soon as circumstances permit.", correct: true }
      ]
    },
    {
      question: "A signalman will ask the pilot to apply parking brakes by the following signals;",
      answers: [
        { text: "Arms down, palms facing inwards, moving arms from extended position inwards.", correct: false },
        { text: "Crossing arms extended above his head.", correct: false },
        { text: "Horizontally moving his hands, fingers extended, palms toward ground.", correct: false },
        { text: "Raise arm and hand, with fingers extended, horizontally in front of body, then clench fist.", correct: true }
      ]
    },
    {
      question: "An aircraft is flying under Instrument Flight Rules in an area where the visibility is unlimited and the sky is clear (free of clouds), when it totally loses radio communications. The procedure to be followed is;",
      answers: [
        { text: "adopt a VFR flight level and continue flight onto destination.", correct: false },
        { text: "descend to En-route Minimum Safe Altitude and join closest airfield open to IFR operations.", correct: false },
        { text: "continue flight onto destination, complying with last received clearances then with filed flight plan.", correct: false },
        { text: "land on the closest appropriate aerodrome, then advise Air Traffic Services of landing.", correct: true }
      ]
    },
    {
      question: "A red flare addressed to a flying aircraft means;",
      answers: [
        { text: "Not with standing any previous instructions, do not land for the time being.", correct: true },
        { text: "Dangerous airfield. Do not land.", correct: false },
        { text: "Come back and land.", correct: false },
        { text: "Give way to another aircraft and hold the circuit.", correct: false }
      ]
    },
    {
      question: "Definitions (ICAO Doc 8168). What is: A turn executed by the aircraft during the initial approach between the end of the outbound track and the beginning of the intermediate or final approach track. The tracks are not reciprocal.",
      answers: [
        { text: "Race track", correct: false },
        { text: "Base turn", correct: true },
        { text: "Procedure turn", correct: false },
        { text: "Reversal procedure", correct: false }
      ]
    },
    {
      question: "In which section of AIP are contained information elements relating to prohibited, restricted and dangerous areas?",
      answers: [
        { text: "ENR", correct: true },
        { text: "AGA", correct: false },
        { text: "GEN", correct: false },
        { text: "MAP", correct: false }
      ]
    },
    {
      question: "A notice containing information concerning flight safety, air navigation, technical, administration or legislative matters and originated at the AIS of a state is called;",
      answers: [
        { text: "Aeronautical Information Circular (AIC).", correct: true },
        { text: "NOTAM.", correct: false },
        { text: "AIRAC.", correct: false },
        { text: "Aeronautical Information Publication (AIP).", correct: false }
      ]
    },
    {
      question: "Aeronautical Information Service: Name the acronym signifying the system aimed at advance notification based on common effective dates, of circumstances that necessitate significant changes in operating practices.",
      answers: [
        { text: "NOTAM RAC", correct: false },
        { text: "ATS NOTAM", correct: false },
        { text: "AIRAC", correct: true },
        { text: "Advisory NOTAM", correct: false }
      ]
    },
    {
      question: "Each contracting state shall provide an Aeronautical Information Service (AIS) in its territory and for areas in which the state is responsible for the Air Traffic Services outside its territory, and this shall include the preparation and origination of;",
      answers: [
        { text: "AIP, NOTAMs, Circular and AIRAC.", correct: false },
        { text: "Integrated Aeronautical Information Package.", correct: true },
        { text: "Only NOTAMs and Circulars.", correct: false },
        { text: "Only AIP and NOTAMs.", correct: false }
      ]
    },
    {
      question: "“Instrument runways” are the following runways intended for the operation of aircraft using instrument approach procedures;",
      answers: [
        { text: "Instrument approach runways, precision approach runways category I, II and III.", correct: false },
        { text: "Precision approach runways in general.", correct: false },
        { text: "Precision approach runways category I, II and III.", correct: false },
        { text: "Non-precision approach runways, precision approach runways category I, II and III.", correct: true }
      ]
    },
    {
      question: "“Code letter D” shall be chosen to identify a taxiway used by aircraft having an outer main gear wheel span of less than 9 m. The taxiway width shall be;",
      answers: [
        { text: "23 m.", correct: false },
        { text: "18 m.", correct: true },
        { text: "25 m.", correct: false },
        { text: "15 m.", correct: false }
      ]
    },
    {
      question: "Which “code letter” shall be chosen to identify a taxiway to be used by an aircraft having a wheelbase of 15 m?",
      answers: [
        { text: "Code letter “E”.", correct: false },
        { text: "Code letter “B”.", correct: false },
        { text: "Code letter “C”.", correct: true },
        { text: "Code letter “D”.", correct: false }
      ]
    },
    {
      question: "According to the “Aerodrome Reference Code”, the “Code Letter E” shall identify an aircraft wing span of;",
      answers: [
        { text: "36 m up to but not including 52 m.", correct: false },
        { text: "24 m up to but not including 36 m.", correct: false },
        { text: "52 m up to but not including 65 m.", correct: true },
        { text: "15 m up to but not including 24 m.", correct: false }
      ]
    },
    {
      question: "The “Aerodrome Reference Code” is a code composed of two elements which are related to the aeroplane performance characteristics and dimensions. These elements are a combination of a number and a letter as in the example under listed;",
      answers: [
        { text: "4F.", correct: false },
        { text: "5E.", correct: false },
        { text: "2B.", correct: true },
        { text: "6D.", correct: false }
      ]
    },
    {
      question: "According to the “Aerodrome Reference Code” the “Code number 4” shall identify an aircraft reference field length of;",
      answers: [
        { text: "1200 m.", correct: false },
        { text: "1800 m and over.", correct: true },
        { text: "1500 m.", correct: false },
        { text: "1600 m.", correct: false }
      ]
    },
  {
      question: "How many red lights must a pilot see, whose aircraft, in final approach, is following a normal glide path defined by a PAPI?",
      answers: [
        { text: "None.", correct: false },
        { text: "3.", correct: false },
        { text: "1.", correct: false },
        { text: "2.", correct: true }
      ]
    },
    {
      question: "Taxiway centre line lights other than an exit taxiway shall be;",
      answers: [
        { text: "fixed lights showing green.", correct: true },
        { text: "fixed lights showing white.", correct: false },
        { text: "fixed lights showing blue.", correct: false },
        { text: "fixed lights showing yellow.", correct: false }
      ]
    },
    {
      question: "In a precision approach Category I lighting system, the centre line and crossbar lights shall be;",
      answers: [
        { text: "fixed lights showing variable white.", correct: true },
        { text: "fixed lights showing variable green.", correct: false },
        { text: "flashing lights showing variable green.", correct: false },
        { text: "flashing lights showing variable white.", correct: false }
      ]
    },
    {
      question: "The abbreviation PAPI stands for;",
      answers: [
        { text: "Precision Approach Power Index.", correct: false },
        { text: "Precision Approach Path Indicator.", correct: true },
        { text: "Precision Approach Power Indicator.", correct: false },
        { text: "Precision Approach Path Index.", correct: false }
      ]
    },
    {
      question: "The “PAPI” shall consist of;",
      answers: [
        { text: "two wing bars of 4 sharp transition multi-lamp or paired units equally spaced.", correct: false },
        { text: "a wing bar of 4 sharp transition multi-lamp or paired units equally spaced.", correct: true },
        { text: "two wing bars of 6 sharp transition multi-lamp or paired units equally spaced.", correct: false },
        { text: "a wing bar of 2 sharp transition multi-lamp equally spaced.", correct: false }
      ]
    },
    {
      question: "In the “PAPI” system the pilot during an approach will see the two units nearest the runway as red and the two units farthest from the runway as white when;",
      answers: [
        { text: "only on the approach slope.", correct: false },
        { text: "below the approach slope.", correct: false },
        { text: "above the approach slope.", correct: false },
        { text: "on or close to the approach slope.", correct: true }
      ]
    },
    {
      question: "In case of parallel runways, each runway designation number shall be supplemented;",
      answers: [
        { text: "by a letter for 2 parallel runways.", correct: false },
        { text: "by a number like “0” and “01” for 2 parallel runways.", correct: false },
        { text: "by a letter - for example 3 parallel runways “L” and “R” and the central has no letter.", correct: false },
        { text: "by a letter - for example 2 parallel runways “L” and “R” - for 3 “L”, “C” and “R”.", correct: true }
      ]
    },
    {
      question: "Taxiway edge lights shall be;",
      answers: [
        { text: "flashing showing blue.", correct: false },
        { text: "fixed showing yellow.", correct: false },
        { text: "fixed showing green.", correct: false },
        { text: "fixed showing blue.", correct: true }
      ]
    },
    {
      question: "Runway end lights shall be;",
      answers: [
        { text: "fixed unidirectional lights showing white in the direction of the runway.", correct: false },
        { text: "fixed lights showing variable white.", correct: false },
        { text: "fixed unidirectional lights showing red in the direction of the runway.", correct: true },
        { text: "fixed lights showing variable red.", correct: false }
      ]
    },
    {
      question: "Runway threshold lights shall be;",
      answers: [
        { text: "fixed unidirectional lights showing white in the direction of approach to the runway.", correct: false },
        { text: "fixed unidirectional lights showing green in the direction of approach to the runway.", correct: true },
        { text: "fixed lights green colours.", correct: false },
        { text: "fixed lights showing green or white colours.", correct: false }
      ]
    },
    {
      question: "ICAO Annex 14 - Visual aids for navigation - Lights: Runway edge lights shall consist of at least;",
      answers: [
        { text: "flashing lights showing variable yellow.", correct: false },
        { text: "flashing lights showing variable green.", correct: false },
        { text: "fixed lights showing steady green.", correct: false },
        { text: "fixed lights showing variable white.", correct: true }
      ]
    },
    {
      question: "Runway threshold identification lights, when provided, should be;",
      answers: [
        { text: "flashing white.", correct: true },
        { text: "flashing green.", correct: false },
        { text: "fixed green.", correct: false },
        { text: "fixed white.", correct: false }
      ]
    },
    {
      question: "The light shown by an “Aerodrome Identification Beacon” at a land aerodrome shall be;",
      answers: [
        { text: "white and green colour identification given by Morse Code.", correct: false },
        { text: "green colour identification given by Morse Code.", correct: true },
        { text: "blue colour identification given by Morse Code.", correct: false },
        { text: "white colour identification given by Morse Code.", correct: false }
      ]
    },
    {
      question: "In a precision approach Category I lighting system, the single, two and three light sources on the centre line have a length of;",
      answers: [
        { text: "150 m.", correct: false },
        { text: "250 m.", correct: false },
        { text: "200 m.", correct: false },
        { text: "300 m.", correct: true }
      ]
    },
    {
      question: "High intensity obstacle lights should be;",
      answers: [
        { text: "fixed red.", correct: false },
        { text: "flashing white.", correct: true },
        { text: "fixed orange.", correct: false },
        { text: "flashing red.", correct: false }
      ]
    },
    {
      question: "Air Traffic Service unit means;",
      answers: [
        { text: "Air Traffic Control units, Flight Information Centres or Air Services reporting offices.", correct: true },
        { text: "Air Traffic Control units and Flight Information Centres.", correct: false },
        { text: "Flight Information Centres and Air Services reporting offices.", correct: false },
        { text: "Air Traffic Control units and Air Services reporting offices.", correct: false }
      ]
    },
    {
      question: "Which condition is requested so that an aerodrome may be considered controlled?",
      answers: [
        { text: "The aerodrome shall be located within a controlled airspace.", correct: false },
        { text: "The aerodrome shall be located within a Control Zone.", correct: false },
        { text: "The aerodrome shall be located within a Control Zone (CTR) and provided with a Control Tower.", correct: false },
        { text: "The aerodrome shall be provided with a Control Tower.", correct: true }
      ]
    },
    {
      question: "Flight Information Region (FIR) is an airspace within which the following services are provided;",
      answers: [
        { text: "Flight Information Service, Alerting Service and Advisory Service.", correct: false },
        { text: "Flight Information Service only.", correct: false },
        { text: "Flight Information Service and Alerting Service.", correct: true },
        { text: "Flight Information Service and Advisory Service.", correct: false }
      ]
    },
    {
      question: "Control Area (CTA) is defined as follows;",
      answers: [
        { text: "A controlled airspace extending upwards from a specified limit above the earth.", correct: true },
        { text: "A controlled airspace extending upwards from a height of 1000 feet above the earth.", correct: false },
        { text: "A controlled airspace extending upwards from the surface of the earth to a specified limit.", correct: false },
        { text: "A controlled airspace extending upwards from a height of 900 feet above the earth.", correct: false }
      ]
    },
    {
      question: "A lower limit of a Control Area shall be established at a height above the ground level or water of not less than;",
      answers: [
        { text: "500 metres.", correct: false },
        { text: "300 metres.", correct: false },
        { text: "200 metres.", correct: true },
        { text: "150 metres.", correct: false }
      ]
    },
    {
      question: "The units providing Air Traffic Services are;",
      answers: [
        { text: "Area Control Centre - Approach Control Office and Aerodrome Control Tower.", correct: false },
        { text: "Area Control Centre - Flight Information Region - Approach Control Office and Tower.", correct: false },
        { text: "Area Control Centre - Flight Information Centre - Approach Control Office - Aerodrome Control Tower and Air Traffic Services reporting office.", correct: true },
        { text: "Area Control Centre - Advisory Centre - Flight Information Centre - Approach Control Office and Tower.", correct: false }
      ]
    },
    {
      question: "Air traffic control service is provided for the purpose of;",
      answers: [
        { text: "preventing collisions between aircraft, between aircraft and obstacles on the manoeuvring area and expediting and maintaining an orderly flow of air traffic.", correct: true },
        { text: "applying separation between aircraft and expediting and maintaining an orderly flow of air traffic.", correct: false },
        { text: "preventing collisions between controlled air traffic and expediting and maintaining an orderly flow of air traffic.", correct: false },
        { text: "avoiding collisions between all aircraft and maintaining an orderly flow of air traffic.", correct: false }
      ]
    },
    {
      question: "Area Control Centres issue clearances for the purpose of;",
      answers: [
        { text: "achieving separation between IFR flights.", correct: false },
        { text: "providing flight Information Service.", correct: false },
        { text: "providing advisory service.", correct: false },
        { text: "achieving separation between controlled flights.", correct: true }
      ]
    },
    {
      question: "Clearances will be issued by an ATC unit for the purpose of;",
      answers: [
        { text: "achieving separation between controlled flights.", correct: true },
        { text: "providing flight Information Service.", correct: false },
        { text: "providing alerting services.", correct: false },
        { text: "providing advisory services.", correct: false }
      ]
    },
    {
      question: "You receive an IFR enroute clearance stating; Clearance expires at 0920. What does it mean?",
      answers: [
        { text: "If not airborne until 0920, a new clearance has to be issued.", correct: true },
        { text: "After 0920 return to the ramp and file a new flight plan.", correct: false },
        { text: "Do not take off before 0920.", correct: false },
        { text: "The take off clearance is expected at 0920.", correct: false }
      ]
    },
    {
      question: "When are ATIS broadcasts updated?",
      answers: [
        { text: "Only when the ceiling and/or visibility changes by a reportable value.", correct: false },
        { text: "Upon receipt of any official weather, regardless of content change or reported values.", correct: true },
        { text: "Every 30 minutes if weather conditions are below those for VFR, otherwise hourly.", correct: false },
        { text: "Only when weather conditions change enough to require a change in the active runway or instrument approach in use.", correct: false }
      ]
    },
    {
      question: "When it becomes apparent that an aircraft is in difficulty, the decision to initiate the alert phases is the responsibility of the;",
      answers: [
        { text: "flight information or control organisations.", correct: false },
        { text: "search and rescue co-ordination centres.", correct: false },
        { text: "operational air traffic control centres.", correct: true },
        { text: "air traffic co-ordination services.", correct: false }
      ]
    },
    {
      question: "Separation methods and minima - Vertical separation. The Vertical Separation Minimum (VSM) between flights in accordance with IFR, within controlled airspace below FL 290 is;",
      answers: [
        { text: "2000 feet (600 m).", correct: false },
        { text: "2500 feet (750 m).", correct: false },
        { text: "1000 feet (300 m).", correct: true },
        { text: "500 feet (150 m).", correct: false }
      ]
    },
    {
      question: "Separation methods and minima - Vertical separation. The Vertical Separation Minimum (VSM) between flights in accordance with IFR, within controlled airspace above FL 290 is;",
      answers: [
        { text: "4000 feet (1200 m).", correct: false },
        { text: "2000 feet (600 m).", correct: true },
        { text: "1000 feet (300 m).", correct: false },
        { text: "500 feet (150 m).", correct: false }
      ]
    },
    {
      question: "Which code shall be used on Mode “A” to provide recognition of an emergency aircraft?",
      answers: [
        { text: "Code 7500.", correct: false },
        { text: "Code 7000.", correct: false },
        { text: "Code 7700.", correct: true },
        { text: "Code 7600.", correct: false }
      ]
    },
    {
      question: "One of the functions ensured by a radar control unit for the provision of approach control service is;",
      answers: [
        { text: "to conduct surveillance radar approaches.", correct: true },
        { text: "to apply a reduced vertical separation of 500 feet between IFR flights and VFR flights.", correct: false },
        { text: "to provide instructions in order to reduce separations minima, if accepted by the pilots.", correct: false },
        { text: "to apply a horizontal separation less than 5 NM.", correct: false }
      ]
    },{
    question: 'The primary duty provided by a radar unit is;',
    answers: [
      { text: 'to assist aircraft due to failure of airborne equipment.', correct: false },
      { text: 'to assist aircraft where navigation appears unsatisfactory.', correct: false },
      { text: 'to assist aircraft on the location of storms.', correct: false },
      { text: 'to provide radar separation.', correct: true }
    ]
  },
  {
    question: 'When radar identification of aircraft has been achieved, ATC unit shall;',
    answers: [
      { text: 'inform the aircraft only if radar identification has been achieved without availability of SSR.', correct: false },
      { text: 'inform the aircraft only if communication’s load permits it.', correct: false },
      { text: 'not advise the aircraft before issuing instructions.', correct: false },
      { text: 'inform the aircraft prior to issue any instructions or advice based on the use of radar.', correct: true }
    ]
  },
  {
      question: 'One of the functions ensured by a radar control unit for the provision of approach control service is;',
      answers: [
        { text: 'to provide instructions to reduce the separation minima.', correct: false },
        { text: 'to apply a reduced vertical separation of 500 feet between IFR and VFR flights.', correct: false },
        { text: 'to apply a horizontal separation less than 5 NM.', correct: false },
        { text: 'to conduct precision radar approach (PAR).', correct: true }
      ]
    },
    {
      question: 'Except otherwise established by the appropriate ATS authority a Surveillance Radar Approach (SRA) shall be terminated at a distance from the touchdown of;',
      answers: [
        { text: '2 NM.', correct: true },
        { text: '3 NM.', correct: false },
        { text: '5 NM.', correct: false },
        { text: '4 NM.', correct: false }
      ]
    },
    {
      question: 'When “Secondary Radar” is used, an aircraft may be identified by one of the following procedures;',
      answers: [
        { text: 'To request pilot to set transponder on position “OFF”.', correct: false },
        { text: 'To request pilot to set transponder on position “ON”.', correct: false },
        { text: 'To request pilot to switch from “ON” to “STBY”.', correct: false },
        { text: 'Observation of compliance with an instruction to operate transponder from “ON” to “STBY” and back to “ON”.', correct: true }
      ]
    },
    {
      question: 'Where a “Secondary Surveillance Radar” (SSR) is not available, radar identification may be achieved by one of the following procedures;',
      answers: [
        { text: 'to instruct the pilot to execute one or more changes of 10°.', correct: false },
        { text: 'to instruct the pilot to execute one or more changes of 20° or more.', correct: false },
        { text: 'to instruct the pilot to execute one or more changes of 30° or more.', correct: true },
        { text: 'to instruct the pilot to execute one or more changes of 45°.', correct: false }
      ]
    },
    {
      question: 'Which code shall be used on Mode “A” to provide recognition of an aircraft subjected to unlawful interference?',
      answers: [
        { text: 'Code 2000.', correct: false },
        { text: 'Code 7600.', correct: false },
        { text: 'Code 7700.', correct: false },
        { text: 'Code 7500.', correct: true }
      ]
    },
    {
      question: 'Which does ATC Term “Radar contact” signify?',
      answers: [
        { text: 'Your aircraft has been identified on the radar display and radar flight instructions will be provided until radar identification is terminated.', correct: true },
        { text: 'Your aircraft has been identified and you will receive separation from all aircraft while in contact with this radar facility.', correct: false },
        { text: 'You will be given traffic advisories until advised that the service has been terminated or that radar contact has been lost.', correct: false },
        { text: 'ATC is receiving your transponder and will furnish vectors and traffic advisories until you are advised that contact has been lost.', correct: false }
      ]
    },
    {
      question: 'What is meant when departure control instructs you to “resume own navigation” after you have been vectored to an airway?',
      answers: [
        { text: 'You are still in radar contact, but must make position reports.', correct: false },
        { text: 'Advisories will no longer be issued by ATC.', correct: false },
        { text: 'You should maintain that airway by use of your navigation equipment.', correct: true },
        { text: 'Radar Service is terminated.', correct: false }
      ]
    },
    {
      question: 'The proficiency check of a pilot took place on the 15th of April. The validity of the previous proficiency check was the 30th of June. The period of the new proficiency check can be and can’t exceed;',
      answers: [
        { text: '15th of October the same year.', correct: false },
        { text: '30th of October the same year.', correct: false },
        { text: '30th of April the following year.', correct: false },
        { text: '31st of December the same year.', correct: true }
      ]
    },
    {
      question: 'Abbreviations (Doc 8168). What does the abbreviation OIS mean?',
      answers: [
        { text: 'Obstacle in surface.', correct: false },
        { text: 'Obstacle identification slope.', correct: false },
        { text: 'Obstacle identification surface.', correct: true },
        { text: 'Obstruction in surface.', correct: false }
      ]
    },
    {
      question: 'Abbreviations (Doc 8168). In Pans-Ops, the abbreviation DER stands for;',
      answers: [
        { text: 'Distance error in routing.', correct: false },
        { text: 'Direct entry route.', correct: false },
        { text: 'Displaced end of runway.', correct: false },
        { text: 'Departure end of runway.', correct: true }
      ]
    },
    {
      question: 'Instrument Departure Procedures - Obstacle Clearance. The minimum obstacle clearance at the departure end of runway equals;',
      answers: [
        { text: '35 ft.', correct: false },
        { text: '0 ft.', correct: true },
        { text: '0.8% gradient.', correct: false },
        { text: '3.3% gradient.', correct: false }
      ]
    },
    {
      question: 'Standard Instrument Departure Procedures - Straight Departures. A straight departure is one in which the initial departure track does not deviate from the alignment of the extended runway centre line by more than;',
      answers: [
        { text: '30°.', correct: false },
        { text: '15°.', correct: true },
        { text: '45°.', correct: false },
        { text: '12.5°.', correct: false }
      ]
    },
    {
      question: 'Holding procedures - Offset Entry. Above 14,000 ft in still air, the outbound time on a 30° offset track is limited to;',
      answers: [
        { text: '2 minutes.', correct: false },
        { text: '1 minute.', correct: false },
        { text: '1 minute 30 seconds.', correct: true },
        { text: '3 minutes.', correct: false }
      ]
    },
    {
      question: 'Approach segments. In an instrument approach procedure, the segment in which alignment and descent for landing are made is called;',
      answers: [
        { text: 'Final approach segment.', correct: true },
        { text: 'Initial approach segment.', correct: false },
        { text: 'Arrival segment.', correct: false },
        { text: 'Intermediate approach segment.', correct: false }
      ]
    },
    {
      question: 'Approach procedures - Final approach segment. In a precision approach (ILS), the final approach segment begins at the;',
      answers: [
        { text: 'FAP.', correct: true },
        { text: 'FAF.', correct: false },
        { text: 'IF.', correct: false },
        { text: 'MAP.', correct: false }
      ]
    },
    {
      question: 'Holding procedures - Entry. Related to the three entry sectors in a holding pattern, there is a zone of flexibility on either side of the sector boundaries of;',
      answers: [
        { text: '15°.', correct: false },
        { text: '5°.', correct: true },
        { text: '10°.', correct: false },
        { text: '20°.', correct: false }
      ]
    },
    {
      question: 'Holding Procedures - Buffer Area. How far beyond the boundary of the holding area extends the buffer area?',
      answers: [
        { text: '5 NM.', correct: true },
        { text: '3 NM.', correct: false },
        { text: '5 km.', correct: false },
        { text: '3 km.', correct: false }
      ]
    },
    {
      question: 'Altimeter setting procedures - Transition Level. The vertical position of an aircraft at or above the transition level with altimeter setting 1013.2 hPa has to be reported;',
      answers: [
        { text: 'as Altitude.', correct: false },
        { text: 'as Height.', correct: false },
        { text: 'according to pilot’s choice.', correct: false },
        { text: 'as Flight Level.', correct: true }
      ]
    },
    {
      question: 'Altimeter setting procedures - Transition Level. With altimeter setting of 1013.2 hPa, the vertical position of an aircraft at or above the transition level has to be reported;',
      answers: [
        { text: 'as Altitude.', correct: false },
        { text: 'as Height.', correct: false },
        { text: 'according to pilot’s choice.', correct: false },
        { text: 'as Flight Level.', correct: true }
      ]
    },
    {
      question: 'SSR - Transponder. When an aircraft carries a serviceable transponder, the pilot shall operate the transponder;',
      answers: [
        { text: 'at all times during flight, regardless of whether the aircraft is within or outside airspace where SSR is used for ATS purposes.', correct: true },
        { text: 'only when the aircraft is flying within airspace where SSR is used for ATS purposes.', correct: false },
        { text: 'only when the aircraft is flying within controlled airspace.', correct: false },
        { text: 'only when directed by ATC.', correct: false }
      ]
    },
  {
      question: 'SSR - Transponder. When the aircraft carries a serviceable Mode C transponder, the pilot shall continuously operate this mode;',
      answers: [
        { text: 'regardless of ATC instructions.', correct: false },
        { text: 'unless otherwise directed by ATC.', correct: true },
        { text: 'only when the aircraft is flying within controlled airspace.', correct: false },
        { text: 'only when directed by ATC.', correct: false }
      ]
    },
    {
      question: 'SSR - Transponder. When an aircraft is subjected to unlawful interference, the pilot-in-command shall indicate the situation by setting the transponder to Mode A, Code;',
      answers: [
        { text: '7700.', correct: false },
        { text: '7600.', correct: false },
        { text: '7000.', correct: false },
        { text: '7500.', correct: true }
      ]
    },
    {
      question: 'SSR - Transponder. When acknowledging mode/code setting instructions, pilots shall;',
      answers: [
        { text: 'read back the mode and code to be set.', correct: true },
        { text: 'read back the code to be set and SQUAWK IDENT.', correct: false },
        { text: 'use the word ROGER.', correct: false },
        { text: 'use the word WILCO.', correct: false }
      ]
    },
    {
      question: 'The longitudinal separation minima based on time between aircraft at the same cruising level where navigation aids permit frequent determination of position and speed, is;',
      answers: [
        { text: '3 minutes.', correct: false },
        { text: '15 minutes.', correct: false },
        { text: '10 minutes.', correct: true },
        { text: '5 minutes.', correct: false }
      ]
    },
    {
      question: 'Longitudinal separation minima based on time for aircraft at the same cruising level when navigation aids permit frequent determination of position and speed provided that the preceding aircraft is maintaining a true airspeed of 20 kt or more faster than the succeeding aircraft will be;',
      answers: [
        { text: '2 minutes.', correct: false },
        { text: '5 minutes.', correct: true },
        { text: '3 minutes.', correct: false },
        { text: '10 minutes.', correct: false }
      ]
    },
    {
      question: 'Longitudinal separation minima based on time for aircraft at the same cruising level when navigation aids permit frequent determination of position and speed provided that the preceding aircraft is maintaining a true airspeed of 40 kt or more faster than the succeeding aircraft will be;',
      answers: [
        { text: '2 minutes.', correct: false },
        { text: '3 minutes.', correct: true },
        { text: '10 minutes.', correct: false },
        { text: '5 minutes.', correct: false }
      ]
    },
    {
      question: 'Longitudinal separation minima based on time. The minimum longitudinal separation between two aircraft flying on the same track, the preceding one maintaining a true airspeed of 37 km (20 kt) faster than the succeeding aircraft, departed from the same aerodrome or having reported exactly over the same significant point, is;',
      answers: [
        { text: '5 minutes.', correct: true },
        { text: '10 minutes.', correct: false },
        { text: '2 minutes.', correct: false },
        { text: '3 minutes.', correct: false }
      ]
    },
    {
      question: 'Longitudinal separation minima based on time for aircraft at the same cruising level when navigation aids permit frequent determination of position and speed provided that the preceding aircraft is maintaining a true airspeed of 40 kt or more faster than the succeeding aircraft, is;',
      answers: [
        { text: '2 minutes.', correct: false },
        { text: '3 minutes.', correct: true },
        { text: '10 minutes.', correct: false },
        { text: '5 minutes.', correct: false }
      ]
    },
    {
      question: 'When an aircraft will pass through the level of another aircraft on the same track, the following minimum longitudinal separation shall be provided;',
      answers: [
        { text: '5 minutes at the time the level is crossed.', correct: false },
        { text: '20 minutes at the time the level is crossed.', correct: false },
        { text: '15 minutes at the time the level is crossed.', correct: true },
        { text: '10 minutes at the time the level is crossed.', correct: false }
      ]
    },
    {
      question: 'The longitudinal separation minima based on distance using DME, and each aircraft “on track” uses DME stations, is;',
      answers: [
        { text: '20 NM when the leading aircraft maintains a true airspeed of 20 kt or more faster than the succeeding aircraft.', correct: false },
        { text: '5 NM.', correct: false },
        { text: '20 NM.', correct: true },
        { text: '10 NM.', correct: false }
      ]
    },
    {
      question: 'The longitudinal separation minima based on DME, and each aircraft “on track” uses DME stations, is;',
      answers: [
        { text: '20 NM provided that the leading aircraft maintains a true airspeed of 10 kt or more faster than the succeeding aircraft.', correct: false },
        { text: '10 NM provided that the leading aircraft maintains a true airspeed of 20 kt or more faster than the succeeding aircraft.', correct: true },
        { text: '10 NM provided that the leading aircraft maintains a true airspeed of 10 kt or more faster than the succeeding aircraft.', correct: false },
        { text: '10 NM provided that the leading aircraft maintains a true airspeed of 40 kt or more faster than the succeeding aircraft.', correct: false }
      ]
    },
    {
      question: 'A “RNAV” distance-based separation minimum may be used at the time the level is crossed, provided that each aircraft reports its distance to or from the same “on track” waypoint. This minimum is;',
      answers: [
        { text: '20 NM.', correct: false },
        { text: '50 NM.', correct: false },
        { text: '80 NM.', correct: true },
        { text: '60 NM.', correct: false }
      ]
    },
    {
      question: 'Separation methods and minima - essential traffic. A VFR flight constitutes essential traffic to other VFR flights, when operating in controlled airspace classified as;',
      answers: [
        { text: 'B.', correct: true },
        { text: 'B, C, and D.', correct: false },
        { text: 'B and C.', correct: false },
        { text: 'B, C, D, and E.', correct: false }
      ]
    },
    {
      question: 'One-minute separation may be used between departing aircraft if they are to fly on tracks diverging by at least;',
      answers: [
        { text: '30° immediately after take-off.', correct: false },
        { text: '25° immediately after take-off.', correct: false },
        { text: '45° immediately after take-off.', correct: true },
        { text: '15° immediately after take-off.', correct: false }
      ]
    },
    {
      question: 'Two-minute separation may be used between departing aircraft if they are to fly on the same track, when;',
      answers: [
        { text: 'the preceding aircraft is 10 kt or more faster than the following aircraft.', correct: false },
        { text: 'the preceding aircraft is 30 kt or more faster than the following aircraft.', correct: false },
        { text: 'the preceding aircraft is 20 kt or more faster than the following aircraft.', correct: false },
        { text: 'the preceding aircraft is 40 kt or more faster than the following aircraft.', correct: true }
      ]
    },
    {
      question: 'When vectoring an aircraft to intercept the localizer course, the final vector furnished shall be such as to enable the aircraft to intercept the localizer course at an angle not greater than;',
      answers: [
        { text: '20 degrees.', correct: false },
        { text: '25 degrees.', correct: false },
        { text: '15 degrees.', correct: false },
        { text: '30 degrees.', correct: true }
      ]
    },
  {
    question: 'The following minimum radar separation shall be provided between aircraft on the same localizer with additional longitudinal separation as required for wake turbulence;',
    answers: [
      { text: '3 NM.', correct: false },
      { text: '5 NM.', correct: true },
      { text: '2 NM.', correct: false },
      { text: '2.5 NM.', correct: false }
    ]
  },
  {
    question: 'The minimum radar separation to be provided to aircraft established on the localizer course shall be;',
    answers: [
      { text: '5.0 NM between aircraft on the same localizer course.', correct: false },
      { text: '3.0 NM between aircraft on the same localizer course.', correct: true },
      { text: '2.0 NM between aircraft on the same localizer course.', correct: false },
      { text: '3.0 NM between aircraft on adjacent localizer course.', correct: false }
    ]
  },
  {
    question: 'The tolerance value used to determine that mode C derived level information displayed to the controller is accurate shall be;',
    answers: [
      { text: '+/- 500 ft.', correct: false },
      { text: '+/- 200 ft.', correct: false },
      { text: '+/- 250 ft.', correct: false },
      { text: '+/- 300 ft.', correct: true }
    ]
  },
  {
    question: 'Radar Services - Radar Separation - Minima. Unless otherwise prescribed by the appropriate ATS authority, the horizontal radar separation minimum shall be;',
    answers: [
      { text: '5.0 NM.', correct: true },
      { text: '3.5 NM.', correct: false },
      { text: '3.0 NM.', correct: false },
      { text: '10.0 NM.', correct: false }
    ]
  },
  {
    question: 'The criterion which shall be used to determine that a specific level is occupied by an aircraft shall be, (except that appropriate ATS authorities may specify a smaller criterion);',
    answers: [
      { text: '+/- 200 ft.', correct: false },
      { text: '+/- 150 ft.', correct: false },
      { text: '+/- 250 ft.', correct: false },
      { text: '+/- 300 ft.', correct: true }
    ]
  },
  {
    question: 'An aircraft is considered to be maintaining its assigned level as long as the SSR mode C derived level information indicated that it is within;',
    answers: [
      { text: '+/- 500 ft of the assigned level.', correct: false },
      { text: '+/- 200 ft of the assigned level.', correct: false },
      { text: '+/- 300 ft of the assigned level.', correct: true },
      { text: '+/- 250 ft of the assigned level.', correct: false }
    ]
  },
  {
    question: 'An aircraft in climb or descent is considered to have crossed a level when the SSR mode C derived level information indicates that it has passed this level in the required direction by;',
    answers: [
      { text: 'more than 300 ft.', correct: true },
      { text: '+/- 300 ft.', correct: false },
      { text: '300 ft.', correct: false },
      { text: 'more than 200 ft.', correct: false }
    ]
  },
  {
    question: 'The radar separation minimum may be reduced but not below;',
    answers: [
      { text: '1.5 NM.', correct: false },
      { text: '2.0 NM.', correct: false },
      { text: '3.0 NM.', correct: true },
      { text: '5.0 NM.', correct: false }
    ]
  },
  {
    question: 'Unless otherwise prescribed by the appropriate ATS authority, the radar controller should notify the non-radar controller when an aircraft making a radar approach is approximately;',
    answers: [
      { text: '8 NM.', correct: true },
      { text: '6 NM.', correct: false },
      { text: '10 NM.', correct: false },
      { text: '5 NM.', correct: false }
    ]
  },
  {
    question: 'An aircraft making a radar approach should be advised to consider executing a missed approach, if the position or identification of the aircraft is in doubt during any portion of the final approach or if the aircraft is not visible on the radar display for significant interval during the last;',
    answers: [
      { text: '2 NM.', correct: true },
      { text: '3 NM.', correct: false },
      { text: '4 NM.', correct: false },
      { text: '1 NM.', correct: false }
    ]
  },
  {
    question: 'When conducting a surveillance radar approach, the radar controller shall terminate the surveillance radar approach, except as determined by the appropriate ATS authority, at a distance of;',
    answers: [
      { text: '1 NM from touchdown.', correct: false },
      { text: '3 NM from touchdown.', correct: false },
      { text: '2.5 NM from touchdown.', correct: false },
      { text: '2 NM from touchdown.', correct: true }
    ]
  },
  {
    question: 'Subject to conditions specified by the appropriate ATS authority, a radar controller may request radar-controlled aircraft to adjust their speed when established on intermediate and final approach. This speed adjustment should not be more than;',
    answers: [
      { text: '+/- 15 kt.', correct: false },
      { text: '+/- 20 kt.', correct: true },
      { text: '+/- 10 kt.', correct: false },
      { text: '+/- 8 kt.', correct: false }
    ]
  },
  {
    question: 'The radar controller shall not request the pilot to adjust the speed where the aircraft has passed;',
    answers: [
      { text: '3 NM from the threshold on final approach.', correct: false },
      { text: '5 NM from the threshold on final approach.', correct: false },
      { text: '2 NM from the threshold on final approach.', correct: false },
      { text: '4 NM from the threshold on final approach.', correct: true }
    ]
  },
  {
    question: 'Aircraft wishing to conduct IFR flight within advisory airspace, but not electing to use the air traffic advisory service;',
    answers: [
      { text: 'shall nevertheless submit a flight plan but changes made thereto are not necessary to be notified.', correct: false },
      { text: 'may file a flight plan under pilot\'s discretion.', correct: false },
      { text: 'need to file a flight plan.', correct: false },
      { text: 'shall nevertheless submit a flight plan and notify changes made thereto to the ATS unit providing that service.', correct: true }
    ]
  },
  {
    question: 'Search and Rescue Signals, droppable containers or packages containing survival equipment for dropping should have the general nature of the content indicated by a colour code. The colour of droppable containers and streamers for food and water is;',
    answers: [
      { text: 'red.', correct: false },
      { text: 'blue.', correct: true },
      { text: 'yellow.', correct: false },
      { text: 'black.', correct: false }
    ]
  },
  {
    question: 'The colour identification of the contents of droppable containers and packages containing survival equipment should take the form of coloured streamers according to the following code;',
    answers: [
      { text: 'Blue for medical supplies and first aid equipment.', correct: false },
      { text: 'Red for food and water.', correct: false },
      { text: 'Black for food and water.', correct: false },
      { text: 'Yellow for blankets and protective clothing.', correct: true }
    ]
  },
  {
    question: 'Search and Rescue Signals, droppable containers or packages containing survival equipment for dropping should have the general nature of the content indicated by a colour code. The colour of droppable containers and streamers for medical supply is;',
    answers: [
      { text: 'black.', correct: false },
      { text: 'yellow.', correct: false },
      { text: 'red.', correct: true },
      { text: 'blue.', correct: false }
    ]
  },
  {
    question: 'The prescribed re-examination of a licence holder operating in an area distant from designated medical examination facilities may be deferred at the discretion of the licence authority, provided that such deferment shall only be made as an exception and shall not exceed;',
    answers: [
      { text: 'a single period of three months in the case of a flight crew member of an aircraft engaged in commercial operations.', correct: false },
      { text: 'a single period of six months in the case of a flight crew member of an aircraft engaged in non-commercial operations.', correct: true },
      { text: 'two consecutive periods each of six months in the case of a flight crew member of an aircraft engaged in non-commercial operations.', correct: false },
      { text: 'two consecutive periods each of three months in the case a flight crew member of an aircraft engaged in non-commercial operations.', correct: false }
    ]
  },
  {
    question: 'ICAO Annex 1. When a Contracting State renders valid a licence issued in accordance with Annex 1 by another Contracting State, the validity of the authorisation;',
    answers: [
      { text: 'shall not extend beyond the period of validity of the licence.', correct: true },
      { text: 'depends on the regulations of the contracting state which renders valid the licence.', correct: false },
      { text: 'shall not extend beyond one year for ATPL and CPL.', correct: false },
      { text: 'is only considered for PPL.', correct: false }
    ]
  },
  {
    question: 'Which body of ICAO finalises the Standard and Recommended Practices (SARPS) for submission for adoption?',
    answers: [
      { text: 'The Air Navigation Commission.', correct: true },
      { text: 'The Assembly.', correct: false },
      { text: 'The Council.', correct: false },
      { text: 'The Regional Air Navigation meeting.', correct: false }
    ]
  },
  {
    question: 'You may act as a flight instructor to carry out flight instruction for the issue of a PPL;',
    answers: [
      { text: 'with an ATPL.', correct: false },
      { text: 'with a theoretical CPL examination plus flight instructor rating.', correct: true },
      { text: 'with a CPL.', correct: false },
      { text: 'with a PPL plus flight instructor rating.', correct: false }
    ]
  },
  {
    question: 'The validity of the instrument-rating aeroplane - IR(A) is;',
    answers: [
      { text: '6 months.', correct: false },
      { text: '5 years.', correct: false },
      { text: '1 year.', correct: true },
      { text: '2 years.', correct: false }
    ]
  },
  {
    question: 'AIP. Which part of the AIP contains a list with “Location Indicators”?',
    answers: [
      { text: 'ENR', correct: false },
      { text: 'AD', correct: false },
      { text: 'LOC', correct: false },
      { text: 'GEN', correct: true }
    ]
  },
  {
    question: 'The minimum age for obtaining a PPL is;',
    answers: [
      { text: '17 years.', correct: true },
      { text: '16 years.', correct: false },
      { text: '21 years.', correct: false },
      { text: '18 years.', correct: false }
    ]
  },
  {
    question: 'An aircraft is considered to overtake another if it approaches the other aircraft from the rear on a line forming an angle of less than;',
    answers: [
      { text: '70 degrees with the plane of symmetry of the latter.', correct: true },
      { text: '50 degrees with the plane of symmetry of the latter.', correct: false },
      { text: '80 degrees with the plane of symmetry of the latter.', correct: false },
      { text: '60 degrees with the plane of symmetry of the latter.', correct: false }
    ]
  },
  {
    question: 'A so called “Visual Approach” can be performed;',
    answers: [
      { text: 'during IFR flights, if there is permanent sight on the movement area and the underlying ground.', correct: true },
      { text: 'during IFR flights, if the cloud base is 1000 ft more than the appropriate DA or MDA for that procedure.', correct: false },
      { text: 'as in above, but in addition there should be a visibility of 5.5 km or more.', correct: false },
      { text: 'during IFR and VFR flights in VMC.', correct: false }
    ]
  },
  {
    question: 'An approaching aircraft may descend below the MSA if;',
    answers: [
      { text: 'the aircraft gets radar vectors.', correct: false },
      { text: 'the pilot is following the published approach procedure.', correct: false },
      { text: 'the pilot has the field and the underlying terrain in sight and will keep it in sight.', correct: false },
      { text: 'all mentioned answers are correct.', correct: true }
    ]
  },
  {
    question: 'To be able to execute a public transport flight, the minimum and maximum age (with ATPL) is;',
    answers: [
      { text: '18 and 60 years.', correct: false },
      { text: '17 and 59 years.', correct: false },
      { text: '21 and 59 years.', correct: true },
      { text: '16 and 60 years.', correct: false }
    ]
  },
  {
    question: 'The EAT has to be transmitted to the pilot as soon as possible, in case the expected delay is;',
    answers: [
      { text: '15 minutes or more.', correct: false },
      { text: '10 minutes.', correct: true },
      { text: '20 minutes.', correct: false },
      { text: '5 minutes or more.', correct: false }
    ]
  },
  {
    question: 'Except when prescribed in procedures or made possible by agreements, aircraft under radar control shall not be vectored closer to the boundary of controlled airspace than;',
    answers: [
      { text: '2.5 NM.', correct: true },
      { text: '3 NM.', correct: false },
      { text: '5 NM.', correct: false },
      { text: '1.5 NM.', correct: false }
    ]
  },
  {
    question: 'During radar control, a “radar-controller” shall issue a missed-approach instruction, in case the “tower-controller” has not issued a “landing-clearance” at the moment the aircraft is;',
    answers: [
      { text: '2 NM from touch-down.', correct: true },
      { text: '4 NM from touch-down.', correct: false },
      { text: '3 NM from touch-down.', correct: false },
      { text: '1 NM from touch-down.', correct: false }
    ]
  },
  {
    question: 'Airspace Classification - Services. During a “Visual Approach” in Controlled Airspace Class C;',
    answers: [
      { text: 'ATC will provide separation with other traffic.', correct: true },
      { text: 'ATC will provide separation with arriving but not with departing traffic.', correct: false },
      { text: 'ATC will provide separation between flights under IFR, pilots are responsible for separation between flights under VFR.', correct: false },
      { text: 'Pilots are responsible for separation with arriving and departing aircraft.', correct: false }
    ]
  },
  {
    question: '“Cabotage” refers to;',
    answers: [
      { text: 'domestic air services.', correct: true },
      { text: 'a flight above territorial waters.', correct: false },
      { text: 'a national air carrier.', correct: false },
      { text: 'crop spraying.', correct: false }
    ]
  },
  {
    question: 'A Special Air Report comprises a number of sections. In section I the pilot fills in;',
    answers: [
      { text: 'a position report, including aircraft identification, height, position and time.', correct: true },
      { text: 'flight identification and weather noted.', correct: false },
      { text: 'weather noted.', correct: false },
      { text: 'urgent messages.', correct: false }
    ]
  },
  {
    question: 'Which of the following correctly lists special purpose codes that are to be used in conjunction with Secondary Surveillance Radar (SSR)?',
    answers: [
      { text: 'Distress 7700, Hijacking 7500, Communication failure 7600.', correct: true },
      { text: 'Distress 7500, Hijacking 7700, Communication failure 7600.', correct: false },
      { text: 'Distress 7700, Hijacking 7600, Communication failure 7500.', correct: false },
      { text: 'Distress 7600, Hijacking 7500, Communication failure 7700.', correct: false }
    ]
  },
  {
    question: 'Search and Rescue signals. The ground-air visual code for “REQUIRE MEDICAL ASSISTANCE” is;',
    answers: [
      { text: 'X.', correct: true },
      { text: 'V.', correct: false },
      { text: 'N.', correct: false },
      { text: 'Y.', correct: false }
    ]
  },
  {
    question: 'JAR-FCL 3, Information of the Authority in case of illness. The holder of a pilot’s licence shall inform the Authority of any illness, which involves the incapacity to undertake licence-related functions for a certain number of days. The number of days is;',
    answers: [
      { text: '90.', correct: false },
      { text: '60.', correct: false },
      { text: '21.', correct: true },
      { text: '30.', correct: false }
    ]
  },
  {
    question: 'If a licence holder is unable to perform the flight crew functions appropriate to that licence due to illness, the authority must be informed;',
    answers: [
      { text: 'if still not fit to fly when his/her current medical certificate expires.', correct: false },
      { text: 'after 21 days of consecutive “illness”.', correct: true },
      { text: 'after one calendar month of consecutive illness.', correct: false },
      { text: 'as soon as possible if the illness is expected to last more than 21 days.', correct: false }
    ]
  },
  {
    question: 'To perform a VFR flight in airspace classification E;',
    answers: [
      { text: 'a clearance and/or two-way radio communication is required.', correct: false },
      { text: 'a clearance and two-way radio communication is required.', correct: false },
      { text: 'a clearance is required.', correct: false },
      { text: 'two-way radio communication is not required.', correct: true }
    ]
  },
  {
    question: 'Which statement regarding approach control service is correct?',
    answers: [
      { text: 'If it is anticipated that an aircraft has to hold for 30 minutes or more, an Expected Approach Time will be transmitted by the most expeditious means to the aircraft.', correct: true },
      { text: 'An approach sequence shall be established according to the sequence of initial radio contact between aircraft and approach control.', correct: false },
      { text: 'During a visual approach an aircraft is maintaining its own separation.', correct: false },
      { text: 'Approach control has to advise the aircraft operators about substantial delays in departure in any event when they are expected to exceed 45 minutes.', correct: false }
    ]
  },
  {
    question: 'Radar Services - Precision Surveillance Radar. At what distance from the end of the runway may a pilot expect that his aircraft can be identified on departure when ATC is equipped with and using PSR?',
    answers: [
      { text: '5 NM', correct: false },
      { text: '1 NM', correct: true },
      { text: '2 NM', correct: false },
      { text: '3 NM', correct: false }
    ]
  },
  {
    question: 'Runway lead-in lighting should consist;',
    answers: [
      { text: 'of a group of at least three white lights flashing in sequence towards the runway.', correct: true },
      { text: 'of an arbitrary amount of green lights.', correct: false },
      { text: 'always of a straight row of lights towards the runway.', correct: false },
      { text: 'of flashing lights only.', correct: false }
    ]
  },
  {
    question: 'Which of the following statements regarding Alerting service is correct?',
    answers: [
      { text: 'Alerting Service and Flight Information Service are often provided by the same ATS unit.', correct: true },
      { text: 'The distress phase is established when an aircraft is known or believed to be the subject of unlawful interference.', correct: false },
      { text: 'Aircraft in the vicinity of an aircraft known or believed to be the subject of unlawful interference, shall be informed about this.', correct: false },
      { text: 'The Alert phase is established when no communication has been received from an aircraft within a period of thirty minutes after the time a communication should have been received.', correct: false }
    ]
  },
  {
    question: 'Aerodrome Control Service - Priority for landing. If an aircraft enters the traffic circuit without proper authorisation;',
    answers: [
      { text: 'it shall only be permitted to land after having received proper authorisation from the aerodrome authority.', correct: false },
      { text: 'it shall be permitted to land if its actions indicate that it so desires.', correct: true },
      { text: 'it shall not be permitted to land.', correct: false },
      { text: 'it shall not be permitted to land unless it becomes evident that the aircraft is in a state of emergency.', correct: false }
    ]
  },
  {
    question: 'Which provisions on a VFR-flight in Class E airspace are CORRECT?',
    answers: [
      { text: 'Service provided: Traffic Information as far as practical, ATC Clearance not required.', correct: true },
      { text: 'Service provided: Air Traffic Control Service, ATC Clearance required.', correct: false },
      { text: 'Service provided: Air Traffic Control Service, ATC Clearance not required.', correct: false },
      { text: 'Service provided: Traffic Information as far as practical, ATC Clearance required.', correct: false }
    ]
  },
  {
    question: 'VMC minima for VFR flights in Class B airspace, above 3050 m (10,000 ft) AMSL, are;',
    answers: [
      { text: '5 km visibility, 1500 m horizontal and 1000 ft vertical distance from clouds.', correct: false },
      { text: '8 km visibility, 1500 m horizontal and 1000 ft vertical distance from clouds.', correct: true },
      { text: '8 km visibility, and clear of clouds.', correct: false },
      { text: 'No minima, VFR flights are not permitted.', correct: false }
    ]
  },
  {
    question: 'During an IFR flight in VMC in controlled airspace you experience a two-way radio communication failure. You will;',
    answers: [
      { text: 'land at the nearest suitable aerodrome and inform ATC.', correct: false },
      { text: 'descend to the flight level submitted for that portion of flight.', correct: false },
      { text: 'land at the nearest suitable aerodrome maintaining VMC and inform ATC.', correct: true },
      { text: 'select A7600 and continue according to the current flight plan to destination.', correct: false }
    ]
  },
  {
    question: 'Which freedom of the air will be exercised by an airline planning a flight that will require a technical stop in a neighbouring State?',
    answers: [
      { text: '4th freedom', correct: false },
      { text: '3rd freedom', correct: false },
      { text: '1st freedom', correct: false },
      { text: '2nd freedom', correct: true }
    ]
  },
  {
    question: 'Radar-controlled aircraft on intermediate or final approach may be requested to make minor speed adjustments by ATC. These adjustments shall never be more than;',
    answers: [
      { text: '25 knots at any stage.', correct: false },
      { text: '20 knots and not within 4 NM of threshold.', correct: true },
      { text: '15 knots at any stage.', correct: false },
      { text: '10 knots and not within 5 NM of threshold.', correct: false }
    ]
  },
  {
    question: 'What is the length of an approach lighting system of a precision-approach runway CAT II?',
    answers: [
      { text: '300 m', correct: false },
      { text: '150 m', correct: false },
      { text: '600 m', correct: false },
      { text: '900 m', correct: true }
    ]
  },
  {
    question: 'What is a “barrette”?',
    answers: [
      { text: 'a frangible structure on which approach lights are fixed.', correct: false },
      { text: 'three or more ground lights closely spaced together to appear as a bar of lights.', correct: true },
      { text: 'a CAT II or III holding position.', correct: false },
      { text: 'a high obstacle near the runway and/or taxiway.', correct: false }
    ]
  },
  {
    question: 'Which statement is correct?',
    answers: [
      { text: 'The upper limit of a CTR shall be established at a height of at least 3000 ft AMSL.', correct: false },
      { text: 'The lower limit of a TMA shall be established at a height of at least 700 ft AGL.', correct: true },
      { text: 'The lower limit of an UIR may coincide with an IFR cruising level.', correct: false },
      { text: 'The lower limit of a CTA shall be established at a height of at least 1500 ft AGL.', correct: false }
    ]
  },
  {
    question: 'The separation method whereby the vertical and horizontal separation may be reduced till a maximum of half the standard criteria is called;',
    answers: [
      { text: 'Composite separation.', correct: true },
      { text: 'Reduced separation.', correct: false },
      { text: 'Combined separation.', correct: false },
      { text: 'Essential separation.', correct: false }
    ]
  },
  {
    question: 'The closure of a runway for a year, because of maintenance, will be published;',
    answers: [
      { text: 'only in AIP.', correct: false },
      { text: 'in NOTAM and AIP, inclusive Supplement.', correct: true },
      { text: 'NOTAM, AIP and MAL.', correct: false },
      { text: 'only in NOTAM.', correct: false }
    ]
  },
  {
    question: 'Aerodromes signs should be in the following configuration;',
    answers: [
      { text: 'mandatory instruction signs, black background with red inscriptions.', correct: false },
      { text: 'mandatory instruction signs, red background with black inscriptions.', correct: false },
      { text: 'information signs, yellow or black background with black or yellow inscriptions.', correct: true },
      { text: 'information signs, orange background with black inscriptions.', correct: false }
    ]
  },
  {
    question: 'In the event that a controlled flight inadvertently deviates from its current flight plan, the appropriate ATS unit has to be informed;',
    answers: [
      { text: 'it is a deviation from the track.', correct: false },
      { text: 'the estimated time is in error by more than 10 minutes.', correct: false },
      { text: 'the TAS varies by plus or minus 5% of the TAS notified in the flight plan.', correct: true },
      { text: 'of an emergency.', correct: false }
    ]
  },
  {
    question: 'When the transponder appears to be unserviceable prior to departure and restore is impossible, then;',
    answers: [
      { text: 'you must indicate the failure in the flight plan, after which the ATC will endeavour to provide for continuation of the flight.', correct: false },
      { text: 'you are not allowed to commence the flight.', correct: false },
      { text: 'the flight can only continue in the most direct manner.', correct: false },
      { text: 'departure to the nearest suitable airport where repair can be effected is allowed.', correct: true }
    ]
  },
  {
    question: 'Where State has not established minimum IFR altitudes, the minimum height of an aircraft above the highest obstacle over high terrain, or in mountainous areas shall be for an IFR flight;',
    answers: [
      { text: 'at least 1000 feet within 8 km of the estimated position.', correct: false },
      { text: 'at least 1000 feet within 5 km of the estimated position.', correct: false },
      { text: 'at least 2000 feet within 8 km of the estimated position.', correct: true },
      { text: 'at least 2000 feet within 5 km of the estimated position.', correct: false }
    ]
  },
  {
    question: 'An aircraft shall display, if so equipped, an anti-collision light;',
    answers: [
      { text: 'while taxiing, but not when it is being towed.', correct: false },
      { text: 'outside the daylight period in flight, but not on the ground when it is being towed.', correct: false },
      { text: 'on the ground when the engines are running.', correct: true },
      { text: 'outside the daylight period at engine-start. During the daylight period this is not applicable.', correct: false }
    ]
  },
  {
    question: 'The white dumb-bell with black perpendicular bar indicates that;',
    answers: [
      { text: 'this aerodrome is using parallel runways.', correct: false },
      { text: 'taxiing need not be confined to the taxiways.', correct: true },
      { text: 'glider flying is performed outside the landing area.', correct: false },
      { text: 'landing, take-off and taxiing is allowed on runway and/or taxiway only.', correct: false }
    ]
  },
  {
    question: 'Unlawful interference (Hijacking) in non-RVSM airspace. If an aircraft is being subjected to unlawful interference (hijacked) in non-RVSM airspace and the pilot is forced to divert from the cleared track or cruising level without being able to communicate with ATS, he shall try to;',
    answers: [
      { text: 'proceed at a level which differs from the cruising level normally used for IFR flights in that area by 1000 ft if the aircraft is operated above FL290 or 500 ft if the aircraft is operated below FL290.', correct: true },
      { text: 'slow the speed of the aircraft down to minimum, squawk A7700 and declare emergency on 121.5 MHz.', correct: false },
      { text: 'commence as soon as possible an emergency descent in order to minimize the difference between cabin pressure and outside pressure.', correct: false },
      { text: 'fly the emergency triangle and try to establish radiotelephony contact with the interference coordinator of the appropriate ATS unit on 121.5 MHz.', correct: false }
    ]
  },
  {
    question: 'What is the speed limit (IAS) in airspace class E?',
    answers: [
      { text: '250 kt for IFR and VFR up to FL 100.', correct: true },
      { text: '250 kt only for VFR up to FL 195.', correct: false },
      { text: '250 kt only for IFR up to FL 100.', correct: false },
      { text: '250 kt VFR and IFR, all levels.', correct: false }
    ]
  },
  {
    question: 'Within the Annex to the ICAO convention that specifies dimensions of aerodromes are codes for different runways. Which is the minimum width of a runway with runway code 4?',
    answers: [
      { text: '40 metres', correct: true },
      { text: '35 metres', correct: false },
      { text: '45 metres', correct: true },
      { text: '50 metres', correct: false }
    ]
  },
  {
    question: 'One of the main objectives of ICAO is to;',
    answers: [
      { text: 'approve new international airlines.', correct: false },
      { text: 'approve the ticket prices set by international airline companies.', correct: false },
      { text: 'develop principles and techniques for international aviation.', correct: true },
      { text: 'approve new international airlines with jet aircraft.', correct: false }
    ]
  },
  {
    question: 'The “Standards” contained in the Annexes to the Chicago convention are to be considered;',
    answers: [
      { text: 'binding for the member states that have not notified ICAO about a national difference.', correct: true },
      { text: 'binding for all member states.', correct: false },
      { text: 'advice and guidance for the aviation legislation within the member states.', correct: false },
      { text: 'binding for all airline companies with international traffic.', correct: false }
    ]
  },
  {
    question: 'The Warsaw convention and later amendments deals with;',
    answers: [
      { text: 'the regulation of transportation of dangerous goods.', correct: false },
      { text: 'limitation of the operator’s liability for damage caused to passengers and goods transported.', correct: true },
      { text: 'operator’s licence for international scheduled aviation.', correct: false },
      { text: 'the security system at airports.', correct: false }
    ]
  },
  {
    question: 'Altimeter setting procedures - Transition Layer. When flying through the transition layer the vertical position of the aircraft as;',
    answers: [
      { text: 'either altitude or flight level in climb.', correct: false },
      { text: 'altitude in climb.', correct: false },
      { text: 'flight level in a descent.', correct: false },
      { text: 'altitude in a descent.', correct: true }
    ]
  },
  {
    question: 'The air traffic control unit has reported “radar contact”, what does that mean to the pilot?',
    answers: [
      { text: 'The radar identity of the aircraft has been established.', correct: true },
      { text: 'The aircraft is subject to positive control.', correct: false },
      { text: 'The pilot does not have to follow up the position of the aircraft.', correct: false },
      { text: 'Position reports may be omitted.', correct: false }
    ]
  },
  {
    question: 'What is the minimum vertical separation between aircraft flying IFR below flight level 290?',
    answers: [
      { text: '1500 feet', correct: false },
      { text: '500 feet', correct: false },
      { text: '1000 feet', correct: true },
      { text: '2000 feet', correct: false }
    ]
  },
  {
    question: 'Change from IFR to VFR will always take place;',
    answers: [
      { text: 'on the initiative of the aircraft commander.', correct: true },
      { text: 'as instructed by an air traffic control unit.', correct: false },
      { text: 'at the clearance limit, irrespective of the weather conditions.', correct: false },
      { text: 'when the aircraft is leaving controlled airspace during VMC.', correct: false }
    ]
  },
  {
    question: 'Which of the following is obligating for members of ICAO?',
    answers: [
      { text: 'ICAO must be informed about differences from the standards in any of the Annexes to the convention.', correct: true },
      { text: 'ICAO must be informed about new flight crew licenses and any suspended validity of such licenses.', correct: false },
      { text: 'ICAO must be informed about changes in the national regulations.', correct: false },
      { text: 'ICAO shall approve the pricing of tickets on international airline connections.', correct: false }
    ]
  },
  {
    question: 'An aircraft which is being subjected to unlawful interference (hijacked) and is forced to divert from the cleared track or cruising level without being able to communicate with ATS shall try to;',
    answers: [
      { text: 'declare an emergency.', correct: false },
      { text: 'continue at an altitude that differs from the semicircular rule with 1000 feet when above FL 290 and 500 feet when lower than FL 290.', correct: true },
      { text: 'fly the emergency triangle.', correct: false },
      { text: 'as soon as possible commence emergency descent in order to minimize the difference between cabin pressure and outside pressure.', correct: false }
    ]
  },
  {
    question: 'Which of the following Annexes to the Chicago convention contains minimum specifications for a crew licence to have international validity?',
    answers: [
      { text: 'Annex 1', correct: true },
      { text: 'Annex 3', correct: false },
      { text: 'Annex 2', correct: false },
      { text: 'Annex 4', correct: false }
    ]
  },
  {
    question: 'Which of the following Annexes to the Chicago convention contains minimum specifications for the design of aerodromes?',
    answers: [
      { text: 'Annex 14', correct: true },
      { text: 'Annex 6', correct: false },
      { text: 'Annex 11', correct: false },
      { text: 'Annex 10', correct: false }
    ]
  },
  {
    question: 'An aircraft is maintaining FL 150 within airspace class C. Another aircraft below at FL 140 is receiving a clearance to descend to FL 70. It is severe turbulence in the area. When is the earliest that a clearance to descend to FL 140 or below can be expected?',
    answers: [
      { text: 'When the other aircraft has reported that it has left FL 120.', correct: false },
      { text: 'When the other aircraft has reported that it has left FL 140.', correct: false },
      { text: 'When the other aircraft has reported that it has reached FL 70.', correct: false },
      { text: 'When the other aircraft has reported that it has descended through FL 130.', correct: true }
    ]
  },
  {
    question: 'Who is responsible, under Annex 13 of the Chicago convention, for the initiation of an accident investigation?',
    answers: [
      { text: 'The law enforcement authorities of the state in which the aircraft is registered.', correct: false },
      { text: 'The aircraft manufacturer.', correct: false },
      { text: 'Operators of the same aircraft type.', correct: false },
      { text: 'The government of the state in which the accident took place.', correct: true }
    ]
  },
  {
    question: 'Which of the following Annexes to the Chicago convention contains international standards and recommended practices for air traffic services (ATS)?',
    answers: [
      { text: 'Annex 14', correct: false },
      { text: 'Annex 11', correct: true },
      { text: 'Annex 17', correct: false },
      { text: 'Annex 6', correct: false }
    ]
  },
  {
    question: 'According to international agreements wind direction shall be adjusted to the local variation and given in degrees magnetic;',
    answers: [
      { text: 'when the local variation exceeds 10° East or 10° West.', correct: false },
      { text: 'in upper wind forecast for areas north of lat 60° North or 60° South.', correct: false },
      { text: 'before landing and take-off.', correct: true },
      { text: 'when an aircraft on the request by a meteorological watch office (MWO) or at specified points transmits a PIREP.', correct: false }
    ]
  },
  {
    question: 'IFR cruising levels within controlled airspace shall be given as flight level (FL);',
    answers: [
      { text: 'when the QNH is higher than the standard pressure 1013 hPa.', correct: false },
      { text: 'only in airspace class A.', correct: false },
      { text: 'if the obstacle clearance is more than 2000 feet.', correct: false },
      { text: 'above the transition altitude when applicable.', correct: true }
    ]
  },
  {
    question: 'Changing of flight rules from IFR to VFR is possible;',
    answers: [
      { text: 'only when leaving controlled airspace.', correct: false },
      { text: 'if instructed by ATC so long as VMC is forecasted during the next 60 minutes.', correct: false },
      { text: 'if the commander so requests.', correct: true },
      { text: 'if instructed by ATC so long as VMC is forecasted during the next 30 minutes.', correct: false }
    ]
  },
  {
    question: 'For controlled traffic that shall be separated in the vicinity of an airport, separation minima may be reduced;',
    answers: [
      { text: 'only if the air traffic controller has the involved aircraft in sight.', correct: false },
      { text: 'if the commander of the involved aircraft so requests.', correct: false },
      { text: 'at the discretion of the air traffic controller.', correct: false },
      { text: 'when the commander in the following aircraft has the preceding aircraft in sight and is able to maintain own separation.', correct: true }
    ]
  },
  {
    question: 'If the crew on an arriving aircraft approaching a controlled aerodrome will report “field in sight”, a clearance for “visual approach” may be given under certain conditions;',
    answers: [
      { text: 'the meteorological visibility must not be less than 8 km.', correct: false },
      { text: 'continued approach will be according to VFR.', correct: true },
      { text: 'the air traffic controller will provide separation to other controlled traffic.', correct: false },
      { text: 'the approach must be passing the FAF.', correct: false }
    ]
  },
  {
    question: 'What is the shortest distance in a sequence for landing between a “Heavy” aircraft preceding a “Light” aircraft?',
    answers: [
      { text: '2 km', correct: false },
      { text: '10 km', correct: false },
      { text: '3 NM', correct: false },
      { text: '6 NM', correct: true }
    ]
  },
  {
    question: 'Aircraft flying along the same track may be separated by DME-distances from the same DME and it is confirmed that the aircraft have passed each other. Specify the shortest difference in DME-distance to make it possible for one aircraft to climb or descend;',
    answers: [
      { text: '15 NM.', correct: false },
      { text: '20 NM.', correct: false },
      { text: '12 NM.', correct: false },
      { text: '10 NM.', correct: true }
    ]
  },
  {
    question: 'The objectives of ICAO was ratified by the;',
    answers: [
      { text: 'Geneva convention 1936.', correct: false },
      { text: 'Warsaw convention 1929.', correct: false },
      { text: 'Chicago convention 1944.', correct: true },
      { text: 'Geneva convention 1948.', correct: false }
    ]
  },
  {
    question: 'According to JAR-FCL, a professional flight crew licence issued by a non-JAA State may be rendered valid for use on aircraft registered in a JAA Member State;',
    answers: [
      { text: 'at the discretion of the Authority of that Member State concerned for a period not exceeding one year, provided that the basic licence remains valid.', correct: true },
      { text: 'at the discretion of the Authority of the Member State concerned for a period not exceeding the period validity of basic licence.', correct: false },
      { text: 'at the discretion of the Authority of that Member State concerned for a period not exceeding one year.', correct: false },
      { text: 'at the discretion of the Authority of that Member State concerned for a period not exceeding one year.', correct: false }
    ]
  },
  {
    question: 'According to JAR-FCL, licence holders do not exercise the privileges of their licences, related ratings or authorisations at any time when they are aware of any decrease in their medical fitness which might render them unable to safely exercise those privileges. They shall without undue delay seek the advice of the authority or AME when becoming aware of hospital or clinic admissions for;',
    answers: [
      { text: 'more than one week.', correct: false },
      { text: 'more than 12 hours.', correct: true },
      { text: 'more than 12 days.', correct: false },
      { text: 'any period.', correct: false }
    ]
  },
  {
    question: 'According to JAR-FCL, Class 2 medical certificate for private pilots will be valid for;',
    answers: [
      { text: '24 months until age of 40, 12 months until age of 60 and 6 months thereafter.', correct: false },
      { text: '24 months until age of 40, 12 months thereafter.', correct: false },
      { text: '60 months until age of 40, 24 months until age of 50, 12 months until age of 65 and 6 months thereafter.', correct: true },
      { text: '60 months until age of 30, 24 months until age of 40, 12 months thereafter.', correct: false }
    ]
  },
  {
    question: 'If an arriving aircraft is making a straight in approach a departing aircraft may take off in any direction;',
    answers: [
      { text: 'until ten minutes before the arriving aircraft is estimated to be over the instrument runway.', correct: false },
      { text: 'until five minutes before the arriving aircraft is estimated to be over the instrument runway.', correct: true },
      { text: 'until two minutes before the arriving aircraft is estimated to be over the instrument runway.', correct: false },
      { text: 'until three minutes before the arriving aircraft is estimated to be over the instrument runway.', correct: false }
    ]
  },
  {
    question: 'When surveillance radar approaches are to be continued to the threshold of the runway transmission should not be interrupted for intervals of more than five seconds while the aircraft is within a distance of;',
    answers: [
      { text: '1.5 NM from the touchdown.', correct: false },
      { text: '2 NM from the touchdown.', correct: false },
      { text: '4 NM from the touchdown.', correct: true },
      { text: '3 NM from the touchdown.', correct: false }
    ]
  },
  {
    question: 'The surveillance radar approach shall be terminated at a distance of 2 NM from the touchdown except when as determined by the appropriate ATS authority, the accuracy of the radar equipment permits to be continued to a prescribed point less than 2 NM from the touchdown. In this case distance and level information shall be given at each;',
    answers: [
      { text: 'half NM.', correct: true },
      { text: 'half mile.', correct: false },
      { text: '1.5 NM.', correct: false },
      { text: '1 NM.', correct: false }
    ]
  },
  {
    question: 'Clearance on Final Approach. A pilot may expect to receive the clearance to land or any alternative clearance before the aircraft reaches a distance of;',
    answers: [
      { text: '3 NM from touchdown.', correct: false },
      { text: '2 NM from touchdown.', correct: true },
      { text: '5 NM from touchdown.', correct: false },
      { text: '4 NM from touchdown.', correct: false }
    ]
  },
  {
    question: 'An aircraft making a radar approach should be directed to execute a missed approach if no clearance to land has been received from the non-radar controller by the time the aircraft reaches a distance of;',
    answers: [
      { text: '5 NM from the touchdown.', correct: false },
      { text: '2 NM from the touchdown.', correct: true },
      { text: '4 NM from the touchdown.', correct: false },
      { text: '1.5 NM from the touchdown.', correct: false }
    ]
  },
  {
    question: 'An aircraft making a radar approach should be directed to consider executing a missed approach if the aircraft is not visible on the radar display for any significant interval during the;',
    answers: [
      { text: 'last 5 NM of the approach.', correct: false },
      { text: 'last 3 NM of the approach.', correct: false },
      { text: 'last 2 NM of the approach.', correct: true },
      { text: 'last 4 NM of the approach.', correct: false }
    ]
  },
  {
    question: 'What is the maximum speed adjustment that a pilot should be requested to make when under radar control and established on intermediate and final approach?',
    answers: [
      { text: '± 10 KT', correct: false },
      { text: '± 15 KT', correct: false },
      { text: '± 20 KT', correct: true },
      { text: '± 25 KT', correct: false }
    ]
  },
  {
    question: 'Lights on and in the vicinity of aerodromes may be turned off, provided that they can be again brought into operation;',
    answers: [
      { text: 'at least 15 minutes before the expected arrival of an aircraft.', correct: false },
      { text: 'at least 30 minutes before the expected arrival of an aircraft.', correct: false },
      { text: 'at least one hour before the expected arrival of an aircraft.', correct: true },
      { text: 'at least 5 minutes before the expected arrival of an aircraft.', correct: false }
    ]
  },
  {
    question: 'At the commencement of final approach, if the controller possesses wind information in the form of components, significant changes in the mean surface wind direction and speed shall be transmitted to aircraft. The mean cross-wind component significant change is;',
    answers: [
      { text: '8 KT.', correct: false },
      { text: '5 KT.', correct: true },
      { text: '10 KT.', correct: false },
      { text: '3 KT.', correct: false }
    ]
  },
  {
    question: 'At the commencement of final approach, if the controller possesses wind information in the form of components, significant changes in the mean surface wind direction and speed shall be transmitted to aircraft. The mean tail-wind component significant change is;',
    answers: [
      { text: '2 KT.', correct: true },
      { text: '3 KT.', correct: false },
      { text: '4 KT.', correct: false },
      { text: '5 KT.', correct: false }
    ]
  },
  {
    question: 'At the commencement of final approach, if the controller possesses wind information in the form of components, significant changes in the mean surface wind direction and speed shall be transmitted to aircraft. The mean head-wind component significant change is;',
    answers: [
      { text: '5 KT.', correct: false },
      { text: '8 KT.', correct: false },
      { text: '4 KT.', correct: false },
      { text: '10 KT.', correct: true }
    ]
  },
  {
    question: 'Whenever unlawful interference with an aircraft is suspected, and where automatic distinct display of SSR Mode A code 7500 and code 7700 is not provided, the radar controller shall attempt to verify this suspicion by;',
    answers: [
      { text: 'setting the SSR decoder to mode A 7700 then to standby and thereafter to code 7500.', correct: false },
      { text: 'setting the SSR decoder to mode A code 7500 and thereafter to code 7700.', correct: true },
      { text: 'setting the SSR decoder to mode A code 7000 and thereafter to code 7500.', correct: false },
      { text: 'setting the SSR decoder to mode A 7500 then to standby and thereafter to code 7700.', correct: false }
    ]
  },
  {
    question: 'When the Mach number technique (MNT) is being applied, and the preceding aircraft shall maintain a mach number equal to or greater than the following aircraft a RNAV distance based separation minimum may be used on the same direction tracks in lieu of 10 minutes longitudinal separation minimum. The distance is;',
    answers: [
      { text: '70 NM.', correct: false },
      { text: '100 NM.', correct: false },
      { text: '80 NM.', correct: true },
      { text: '60 NM.', correct: false }
    ]
  },
  {
    question: 'Longitudinal separation minima based on distance using DME for aircraft at the same cruising level and track, provided that each aircraft utilises “on track” DME stations and separation is checked by obtaining simultaneous DME readings, is;',
    answers: [
      { text: '40 NM.', correct: false },
      { text: '25 NM.', correct: false },
      { text: '20 NM.', correct: true },
      { text: '10 NM.', correct: false }
    ]
  },
  {
    question: 'Longitudinal separation minima based on time for aircraft at the same cruising level when navigation aids permit frequent determination of position and speed provided that the preceding aircraft is maintaining a true air speed of 40 kt or more, faster than the succeeding aircraft will be;',
    answers: [
      { text: '2 minutes.', correct: false },
      { text: '3 minutes.', correct: true },
      { text: '10 minutes.', correct: false },
      { text: '5 minutes.', correct: false }
    ]
  },
  {
    question: 'Longitudinal separation minima based on time for aircraft at the same cruising level when navigation aids permit frequent determination of position and speed provided that the preceding aircraft is maintaining a true air speed of 20 kt or more, faster than the succeeding aircraft will be;',
    answers: [
      { text: '2 minutes.', correct: false },
      { text: '5 minutes.', correct: true },
      { text: '3 minutes.', correct: false },
      { text: '10 minutes.', correct: false }
    ]
  },
  {
    question: 'Longitudinal separation minima based on time for aircraft at the same cruising level when navigation aids permit frequent determination of position and speed will be;',
    answers: [
      { text: '10 minutes.', correct: true },
      { text: '3 minutes.', correct: false },
      { text: '5 minutes.', correct: false },
      { text: '15 minutes.', correct: false }
    ]
  },
  {
    question: 'Repetitive flight plans (RPLs) shall not be used for flights operated regularly on the same day(s) of consecutive weeks and;',
    answers: [
      { text: 'on at least ten occasions or every day over a period of at least ten consecutive days.', correct: true },
      { text: 'on at least ten occasions or every day over a period of at least 20 consecutive days.', correct: false },
      { text: 'on at least 20 occasions.', correct: false },
      { text: 'on at least 20 days consecutively.', correct: false }
    ]
  },
  {
    question: 'What is the minimum wake turbulence separation criteria when a Light aircraft is taking off behind a Medium aircraft and both are using the same runway?',
    answers: [
      { text: '5 minutes', correct: false },
      { text: '1 minute', correct: false },
      { text: '2 minutes', correct: true },
      { text: '3 minutes', correct: false }
    ]
  },
  {
    question: 'Special VFR flights may the authorised to operate locally within a control zone when the ground visibility is not less than 1500 metres, even when the aircraft is not equipped with a functioning radio receiver within class;',
    answers: [
      { text: 'C, D and E airspace.', correct: false },
      { text: 'E airspace.', correct: true },
      { text: 'D and E airspace.', correct: false },
      { text: 'D airspace.', correct: false }
    ]
  },
  {
    question: 'In order to meet wake turbulence criteria, for arriving aircraft and using timed approaches, what minima shall be applied to aircraft landing behind a Heavy or a Medium aircraft?',
    answers: [
      { text: 'Light aircraft behind Medium aircraft - 4 minutes.', correct: false },
      { text: 'Medium aircraft behind Heavy aircraft - 2 minutes.', correct: true },
      { text: 'Medium aircraft behind Heavy aircraft - 3 minutes.', correct: false },
      { text: 'Medium aircraft other Medium aircraft - 2 minutes.', correct: false }
    ]
  },
  {
    question: 'A minimum vertical separation shall be provided until aircraft are established inbound on the ILS localizer course and/or MLS final approach track. This minimum is, when independent parallel approaches are being conducted;',
    answers: [
      { text: '200 m (660 ft).', correct: false },
      { text: '150 m (500 ft).', correct: false },
      { text: '100 m (330 ft).', correct: false },
      { text: '300 m (1000 ft).', correct: true }
    ]
  },
  {
    question: 'A separation minimum shall be applied between a light or MEDIUM aircraft and a HEAVY aircraft and between a LIGHT aircraft and a MEDIUM aircraft when the heavier aircraft is making a low or missed approach and the lighter aircraft is landing on the same runway in the opposite direction or on a parallel opposite direction runway separated by;',
    answers: [
      { text: 'less than 730 m.', correct: false },
      { text: '760 m.', correct: false },
      { text: 'less than 760 m.', correct: true },
      { text: '730 m.', correct: false }
    ]
  },
  {
    question: 'Wake turbulence - Separation between departing aircraft. The minimum separation to be applied between a LIGHT or MEDIUM aircraft taking off behind a HEAVY aircraft or a LIGHT aircraft taking off behind a MEDIUM aircraft using the same runway is;',
    answers: [
      { text: '3 minutes.', correct: false },
      { text: '2 minutes.', correct: true },
      { text: '1 minute.', correct: false },
      { text: '5 minutes.', correct: false }
    ]
  },
  {
    question: 'Horizontal separation - Independent parallel approaches. A minimum radar separation shall be provided until aircraft are established inbound on the ILS localizer course and/or MLS final approach track. This minimum is, when independent parallel approaches are being conducted;',
    answers: [
      { text: '1.0 NM.', correct: false },
      { text: '2.0 NM.', correct: false },
      { text: '3.0 NM.', correct: true },
      { text: '5.0 NM.', correct: false }
    ]
  },
  {
    question: 'Horizontal separation - Independent parallel approaches. Such approaches may be conducted to parallel runways provided that, the missed approach track for one approach diverges from the missed approach track of the adjacent approach by at least;',
    answers: [
      { text: '30º (degrees).', correct: true },
      { text: '25º (degrees).', correct: false },
      { text: '45º (degrees).', correct: false },
      { text: '20º (degrees).', correct: false }
    ]
  },
  {
    question: 'Independent parallel approaches may be conducted to parallel runways provided that;',
    answers: [
      { text: 'the missed approach track for one approach diverges by at least 25° (degrees) from the missed approach track of the adjacent approach.', correct: false },
      { text: 'the missed approach track for one approach diverges by at least 45° (degrees) from the missed approach track of the adjacent approach.', correct: false },
      { text: 'the missed approach track for one approach diverges by at least 30° (degrees) from the missed approach track of the adjacent approach.', correct: true },
      { text: 'the missed approach track for one approach diverges by at least 20° (degrees) from the missed approach track of the adjacent approach.', correct: false }
    ]
  },
  {
    question: 'When independent parallel approaches are being conducted to parallel runways and vectoring to intercept the ILS localizer course or MLS final approach track, the vector shall be such as to enable the aircraft to be established on the ILS localizer course or MLS final approach track in level flight for;',
    answers: [
      { text: 'at least 2.5 NM prior to intercepting the ILS glide path or specified MLS elevation angle.', correct: false },
      { text: 'at least 2.0 NM prior to intercepting the ILS glide path or specified MLS elevation angle.', correct: true },
      { text: 'at least 1.5 NM prior to intercepting the ILS glide path or specified MLS elevation angle.', correct: false },
      { text: 'at least 3.0 NM prior to intercepting the ILS glide path or specified MLS elevation angle.', correct: false }
    ]
  },
  {
    question: 'Dependent parallel approaches may be conducted to parallel runways provided that the missed approach track for one approach diverges by;',
    answers: [
      { text: 'at least 15° (degrees) from the missed approach track of the adjacent approach.', correct: false },
      { text: 'at least 30° (degrees) from the missed approach track of the adjacent approach.', correct: true },
      { text: 'at least 45° (degrees) from the missed approach track of the adjacent approach.', correct: false },
      { text: 'at least 25° (degrees) from the missed approach track of the adjacent approach.', correct: false }
    ]
  },
  {
    question: 'Non Radar Wake Turbulence separation minima for departing aircraft. The minimum separation that shall be applied between a LIGHT or MEDIUM aircraft taking off behind a HEAVY aircraft and both are using the same runway is;',
    answers: [
      { text: '1 minute.', correct: false },
      { text: '2 minutes.', correct: true },
      { text: '3 minutes.', correct: false },
      { text: '4 minutes.', correct: false }
    ]
  },
  {
    question: 'The speed limitation for IFR flights inside ATS airspace classified as C, when flying below 3050 m (10000 ft) AMSL, is;',
    answers: [
      { text: '240 KT IAS.', correct: false },
      { text: 'not applicable.', correct: true },
      { text: '250 KT IAS.', correct: false },
      { text: '250 KT TAS.', correct: false }
    ]
  },
  {
    question: 'The speed limitation for VFR flights inside ATS airspace classified as C, when flying below 3050 m (10000 ft) AMSL, is;',
    answers: [
      { text: '250 KT TAS.', correct: false },
      { text: '240 KT IAS.', correct: false },
      { text: 'not applicable.', correct: false },
      { text: '250 KT IAS.', correct: true }
    ]
  },
  {
    question: 'The speed limitation for IFR flights inside ATS airspace classified as E, when flying below 3050 m (10000 ft) AMSL, is;',
    answers: [
      { text: '250 KT TAS.', correct: false },
      { text: '260 KT IAS.', correct: false },
      { text: '250 KT IAS.', correct: true },
      { text: 'not applicable.', correct: false }
    ]
  },
  {
    question: 'The speed limitation for both IFR flights and VFR flights inside ATS airspace classified as B, when flying below 3050 m (10000 ft) AMSL, is;',
    answers: [
      { text: '260 KT IAS.', correct: false },
      { text: '250 KT TAS.', correct: false },
      { text: 'not applicable.', correct: true },
      { text: '250 KT IAS.', correct: false }
    ]
  },
  {
    question: 'A strayed aircraft is;',
    answers: [
      { text: 'an aircraft which has deviated significantly from its intended track or which reports that it is lost.', correct: true },
      { text: 'only that aircraft which reports that it is lost.', correct: false },
      { text: 'only that aircraft which has deviated significantly its intended track.', correct: false },
      { text: 'an aircraft in a given area but whose identity has not been established.', correct: false }
    ]
  },
  {
    question: 'Flight information service provided to flights shall include the provision of information concerning collision hazards to aircraft operating in airspace classes;',
    answers: [
      { text: 'A to E (inclusive).', correct: false },
      { text: 'F and G.', correct: false },
      { text: 'C to G (inclusive).', correct: true },
      { text: 'A to G (inclusive).', correct: false }
    ]
  },
  {
    question: 'ATIS broadcast messages containing departure and arrival information should include cloud cover, when the clouds are;',
    answers: [
      { text: 'cumulonimbus.', correct: false },
      { text: 'below 1500 m (5000 ft) or below the highest minimum sector altitude, whichever is the greater.', correct: true },
      { text: 'below 900 m (3000 ft) or below the highest minimum sector altitude, whichever is the greater.', correct: false },
      { text: 'below 2000 m (600 ft) or below the highest minimum sector altitude, whichever is the greater.', correct: false }
    ]
  },
  {
    question: 'Where an upper flight information region (UIR) is established, the procedures applicable there in;',
    answers: [
      { text: 'have to be as agreed at the regional air navigation meetings.', correct: false },
      { text: 'have to be as indicated by ICAO council.', correct: false },
      { text: 'need not to be identical with those applicable in the underlying flight information region.', correct: true },
      { text: 'has to be the same as the underlying flight information region.', correct: false }
    ]
  },
  {
    question: 'The VMC minima for a VFR flight inside an ATS airspace classified as B, is;',
    answers: [
      { text: '8 km visibility when at or above 3050 m (10.000 ft) AMSL and clear of clouds.', correct: false },
      { text: '5 NM visibility when below 3050 m (10.000 ft) AMSL, 1500 m horizontal and 300 m vertical from cloud.', correct: false },
      { text: '5 NM visibility below 3050 m (10.000 ft) AMSL, clear of clouds.', correct: false },
      { text: '8 km visibility when at or above 3050 m (10.000 ft) AMSL, and 1500 m horizontal and 300 m vertical from clouds.', correct: true }
    ]
  },
  {
    question: 'A VFR flight when flying inside an ATS airspace classified as B has to maintain the following minima of flight visibility and distance from clouds;',
    answers: [
      { text: '8 km below 3050 m (10.000 ft) AMSL, 1500 m horizontal and 300 m vertical from clouds.', correct: false },
      { text: '5 km below 3050 m (10.000 ft) AMSL and clear of clouds.', correct: false },
      { text: '5 km below 3050 m (10.000 ft) AMSL, 1500 m horizontal and 300 m vertical from clouds.', correct: true },
      { text: '5 km visibility, 1500 m horizontal and 300 m vertical from clouds.', correct: false }
    ]
  },
  {
    question: 'A VFR flight when flying inside an ATS airspace classified as C has to maintain the following minima of flight visibility and distance from clouds;',
    answers: [
      { text: '8 km at or above 3050 m (10.000 ft) AMSL, 1500 m horizontal and 300 m vertical from clouds.', correct: true },
      { text: '8 km at or above 3050 m (10.000 ft) AMSL, and clear of clouds.', correct: false },
      { text: '5 NM at or above 3050 m (10.000 ft) AMSL, 1500 m horizontal and 300 m vertical from clouds.', correct: false },
      { text: '5 km at or above 3050 m (10.000 ft) AMSL,1500 m horizontal and 300 m vertical from clouds.', correct: false }
    ]
  },
  {
    question: 'An ATS airspace where IFR and VFR flights are permitted, all flights are subject to air traffic control service and IFR flights are separated from other IFR flights and from VFR flights, VFR flights are separated from IFR flights and receive traffic information in respect of other VFR flights, is classified as;',
    answers: [
      { text: 'Airspace E.', correct: false },
      { text: 'Airspace C.', correct: true },
      { text: 'Airspace D.', correct: false },
      { text: 'Airspace B.', correct: false }
    ]
  },
  {
    question: 'An ATS airspace where IFR and VFR flights are permitted, all flights are subject to air traffic control service and are separated from each other is classified as;',
    answers: [
      { text: 'Airspace C.', correct: false },
      { text: 'Airspace B.', correct: true },
      { text: 'Airspace D.', correct: false },
      { text: 'Airspace E.', correct: false }
    ]
  },
  {
    question: 'An ATS airspace where IFR and VFR flights are permitted and all flights are subject to air traffic control service. IFR flights are separated from other IFR flights and receive traffic information in respect of VFR flights. VFR flights receive traffic information in respect of all other flights, is classified as;',
    answers: [
      { text: 'Airspace A.', correct: false },
      { text: 'Airspace D.', correct: true },
      { text: 'Airspace E.', correct: false },
      { text: 'Airspace B.', correct: false }
    ]
  },
  {
    question: 'An ATS airspace where IFR and VFR are permitted IFR flights are subject to Air Traffic Control Service and are separated from other IFR flights. All flights receive traffic information as far as is practical, is classified as;',
    answers: [
      { text: 'Airspace A.', correct: false },
      { text: 'Airspace B.', correct: false },
      { text: 'Airspace E.', correct: true },
      { text: 'Airspace D.', correct: false }
    ]
  },
  {
    question: 'An ATS airspace where IFR and VFR flights are permitted, all participating IFR flights receive an air traffic advisory service and all flights receive flight information service if requested, is classified;',
    answers: [
      { text: 'Airspace D.', correct: false },
      { text: 'Airspace G.', correct: false },
      { text: 'Airspace E.', correct: false },
      { text: 'Airspace F.', correct: true }
    ]
  },
  {
    question: 'An ATS airspace where IFR and VFR are permitted and receive flight information service if requested, is classified as;',
    answers: [
      { text: 'Airspace G.', correct: true },
      { text: 'Airspace F.', correct: false },
      { text: 'Airspace C.', correct: false },
      { text: 'Airspace E.', correct: false }
    ]
  },
  {
    question: 'An integrated aeronautical information package consists of the following elements;',
    answers: [
      { text: 'AIP, supplements to AIP, NOTAM and PIB, AIC and checklist summaries.', correct: false },
      { text: 'AIP, including amendment service, supplements to AIP, NOTAM, AIC, AIRAC.', correct: false },
      { text: 'AIP, including amendment service, supplements to AIP, NOTAM, AIC and checklist summaries.', correct: false },
      { text: 'AIP, including amendment service, supplements to AIP, NOTAM and pre-flight information bulletin (PIB), AIC, checklists and summaries.', correct: true }
    ]
  },
  {
    question: 'The identification of each prohibited, restricted and danger area shall be composed by;',
    answers: [
      { text: 'the nationality letters for location indicators assigned to the state or territory, followed the letters P, R and D and figures.', correct: true },
      { text: 'the letters P (Prohibited), R (Restricted) and D (Dangerous) for the area concerned and figures.', correct: false },
      { text: 'the letters P (Prohibited), R (Restricted) and D (Dangerous) followed by figures.', correct: false },
      { text: 'the nationality letters for the location indicators assigned to the state, followed by P, R and D.', correct: false }
    ]
  },
  {
    question: 'In order to avoid confusion , the identification numbers given to each prohibited area , restricted area and danger area shall not be re-used for a period of;',
    answers: [
      { text: 'at least 6 months after cancellation of the area to which they refer.', correct: false },
      { text: 'at least 2 months after cancellation of the area to which they refer.', correct: false },
      { text: 'at least one year after cancellation of the area to which they refer.', correct: true },
      { text: 'at least 3 months after cancellation of the area to which they refer.', correct: false }
    ]
  },
  {
    question: 'Temporary changes of “long duration” and information of “short duration” with extensive text and/or graphics are published as AIP supplements. It is considered a long duration;',
    answers: [
      { text: 'six months or longer.', correct: false },
      { text: 'three months or longer.', correct: true },
      { text: 'one year or longer.', correct: false },
      { text: 'two months or longer.', correct: false }
    ]
  },
  {
    question: 'Operationally significant changes to the AIP shall be published in accordance with;',
    answers: [
      { text: 'AIRAC procedures and identified by the acronym AIRAC.', correct: true },
      { text: 'NOTAM procedures and identified by acronym NOTAM followed by a number.', correct: false },
      { text: 'AIP supplements and shall be clearly identified.', correct: false },
      { text: 'AIC procedures and identified by the acronym AIC followed by a number.', correct: false }
    ]
  },
  {
    question: 'A checklist of AIP supplements currently in force shall be issued at intervals of;',
    answers: [
      { text: 'not more than three months.', correct: false },
      { text: 'not more than one month.', correct: true },
      { text: 'not more than 2 months.', correct: false },
      { text: 'not more than 28 days.', correct: false }
    ]
  },
  {
    question: 'AIP. SIGMET information can be found in which part of the AIP?',
    answers: [
      { text: 'MET', correct: false },
      { text: 'GEN', correct: true },
      { text: 'AD', correct: false },
      { text: 'ENR', correct: false }
    ]
  },
  {
    question: 'AIP. Which part of the AIP contains information relating to existing prohibited , restricted and danger areas?',
    answers: [
      { text: 'ENR', correct: true },
      { text: 'The AIP does not contain this information', correct: false },
      { text: 'GEN', correct: false },
      { text: 'AD', correct: false }
    ]
  },
  {
    question: 'Unaccompanied baggage carried by air shall be cleared under the procedure applicable to ;',
    answers: [
      { text: 'accompanied baggage or under another simplified customs procedure distinct from that normally applicable to other cargo.', correct: true },
      { text: 'cargo but is free from any kind of declaration forms.', correct: false },
      { text: 'cargo and is covered by a traffic document.', correct: false },
      { text: 'cargo but clearance documents provided by airlines shall be completed by the passenger prior to shipment.', correct: false }
    ]
  },
  {
    question: 'The documents for entry and departure of aircraft;',
    answers: [
      { text: 'are accepted in hand-written block lettering in ink.', correct: true },
      { text: 'has to be typewritten.', correct: false },
      { text: 'are accepted at the contracting state discretion.', correct: false },
      { text: 'has to be typewritten or produced by electronic data processing techniques.', correct: false }
    ]
  },
  {
    question: 'When a person is found inadmissible and is returned to the operator for transport away from the territory of the state , the operator;',
    answers: [
      { text: 'shall not be preclude from recovering from such person any transportation costs arising from his (her) inadmissibility.', correct: true },
      { text: 'is not responsible for the person inadmissible for entry in the receiving state.', correct: false },
      { text: 'and the state of the operator are both responsible for the person inadmissible.', correct: false },
      { text: 'shall not recover from such person any transportation costs arising from his (her) inadmissibility.', correct: false }
    ]
  },
  {
    question: 'The ICAO annex which deals with entry and departure of persons and their baggage in international flights is;',
    answers: [
      { text: 'Annex 6.', correct: false },
      { text: 'Annex 15.', correct: false },
      { text: 'Annex 9.', correct: true },
      { text: 'Annex 8.', correct: false }
    ]
  },
  {
    question: 'The ICAO annex which deals with entry and departure of cargo and other articles on international flights is;',
    answers: [
      { text: 'Annex 8.', correct: false },
      { text: 'Annex 16.', correct: false },
      { text: 'Annex 9.', correct: true },
      { text: 'Annex 15.', correct: false }
    ]
  },
  {
    question: 'The aircraft commander , when he has reasonable grounds to believe that a person has committed or is about to commit , on board the aircraft , an offence against penal law;',
    answers: [
      { text: 'may require the assistance of passengers to restrain such person.', correct: false },
      { text: 'may request such person to disembark.', correct: false },
      { text: 'may not require or authorise the assistance of other crew members.', correct: false },
      { text: 'may deliver such person to the competent authorities.', correct: true }
    ]
  },
  {
    question: 'The Rome Convention and later amendments deals with;',
    answers: [
      { text: 'regulation of transportation of dangerous goods.', correct: false },
      { text: 'offences and certain other acts committed on board aircraft.', correct: false },
      { text: 'damage caused by any aircraft to third parties on the surface.', correct: false },
      { text: 'damage caused by foreign aircraft to third parties on the surface.', correct: true }
    ]
  },
  {
    question: 'The convention signed by the states and moved by a desire to ensure adequate compensation for persons who suffer damage caused on the surface by foreign aircraft is;',
    answers: [
      { text: 'the Paris Convention.', correct: false },
      { text: 'the Rome Convention.', correct: true },
      { text: 'the Warsaw Convention.', correct: false },
      { text: 'the Tokyo Convention.', correct: false }
    ]
  },
  {
    question: 'Any person who suffers damage on the surface shall , upon proof only that damage was caused by an aircraft in flight or by any person or thing falling therefore will be entitled to compensation as provided by;',
    answers: [
      { text: 'the Rome Convention.', correct: true },
      { text: 'the Warsaw Convention.', correct: false },
      { text: 'the Chicago Convention.', correct: false },
      { text: 'the Montreal Convention.', correct: false }
    ]
  },
  {
    question: 'The convention on offences and certain acts committed on board aircraft, is;',
    answers: [
      { text: 'the convention of Chicago.', correct: false },
      { text: 'the convention of Rome.', correct: false },
      { text: 'the convention of Tokyo.', correct: true },
      { text: 'the convention of Paris.', correct: false }
    ]
  },
  {
    question: 'The convention which deals with offences against penal law, is;',
    answers: [
      { text: 'the convention of Tokyo.', correct: true },
      { text: 'the convention of Warsaw.', correct: false },
      { text: 'the convention of Madrid.', correct: false },
      { text: 'the convention of Rome.', correct: false }
    ]
  },
  {
    question: 'The holder of a pilot licence when acting as co-pilot of an aircraft required to be operated with a co-pilot, shall be entitled to be credit with not more than;',
    answers: [
      { text: '50 % of the co-pilot flight time towards the total flight time required for a higher grade of pilot licence.', correct: true },
      { text: '60 % of the co-pilot flight time towards , the total flight time required for a higher grade of a pilot licence.', correct: false },
      { text: '40 % of the co-pilot flight time towards , the total flight time required for a higher grade of a pilot licence.', correct: false },
      { text: '100 hours of flying time required for a higher grade of a pilot licence.', correct: false }
    ]
  },
  {
    question: 'The age of an applicant for a commercial pilot licence shall not be less than;',
    answers: [
      { text: '17 years of age.', correct: false },
      { text: '16 years of age.', correct: false },
      { text: '18 years of age.', correct: true },
      { text: '21 years of age.', correct: false }
    ]
  },
  {
    question: 'An applicant for a commercial pilot licence shall hold;',
    answers: [
      { text: 'a current class I medical assessment.', correct: true },
      { text: 'a current class III medical assessment.', correct: false },
      { text: 'a current class II medical assessment.', correct: false },
      { text: 'a current class medical assessment as prescribed by the state issuing the licence.', correct: false }
    ]
  },
  {
    question: 'An applicant for a commercial pilot licence-aeroplane shall have completed not less than ........ hours of cross country flight time as pilot in command including a cross country flight totalling not less than ........ km ( ........ NM ) , in the course of which full stop landings at two different aerodromes shall be made. The hours and distance referred are;',
    answers: [
      { text: '10 hours and 270 km ( 150 NM )', correct: false },
      { text: '15 hours and 540 km ( 300 NM )', correct: false },
      { text: '20 hours and 270 km ( 150 NM )', correct: false },
      { text: '20 hours and 540 km ( 300 NM )', correct: true }
    ]
  },
  {
    question: 'An applicant for a commercial pilot licence aeroplane shall have completed in aeroplanes not less than ;',
    answers: [
      { text: '15 hours of cross country flight time as pilot-in-command including a cross country flight not less than 540 km ( 300 NM ).', correct: false },
      { text: '20 hours of cross country flight time as pilot-in-command including a cross country flight not less than 540 km ( 300 NM ).', correct: true },
      { text: '10 hours of cross country flight time as pilot-in-command including a cross country flight not less than 540 km ( 300 NM ).', correct: false },
      { text: '25 hours of cross country flight time as pilot-in-command including a cross country flight not less than 540 km ( 300 NM ).', correct: false }
    ]
  },
  {
    question: 'The applicant for an Airline Transport Pilot Licence shall have completed in aeroplanes not less than ......... hours of cross- country flight time, of which not less than ......... hours shall be as pilot-in command or co-pilot performing, under the supervision of the pilot in command, the duties and functions of a pilot in command, provided that the method of supervision employed is acceptable to the licensing authority. The state above hours are respectively;',
    answers: [
      { text: '200 hours and 75 hours', correct: false },
      { text: '250 hours and 10 hours', correct: false },
      { text: '200 hours and 100 hours', correct: true },
      { text: '150 hours and 75 hours', correct: false }
    ]
  },
  {
    question: 'An applicant holding a private or commercial pilot licence aeroplane for the issue of an instrument rating , shall have completed ..... hours of cross-country flight time as pilot-in-command of aircraft in categories acceptable to the licensing Authority , of which not less than ..... hours shall be in aeroplanes. The said hours , are respectively;',
    answers: [
      { text: '40 hours and 15 hours', correct: false },
      { text: '50 hours and 10 hours', correct: true },
      { text: '40 hours and 10 hours', correct: false },
      { text: '50 hours and 15 hours', correct: false }
    ]
  },
  {
    question: 'In certain circumstances a medical examination may be deferred at the discretion of the licensing authority , provided that such deferment shall only be made as an exception and shall not exceed;',
    answers: [
      { text: 'a single period of six months in the case of a flight crew member of an aircraft engaged in commercial operations.', correct: false },
      { text: 'two consecutive periods each of three months in the case of a flight crew member of an aircraft engaged in non commercial operations.', correct: false },
      { text: 'a single period of six months in the case of a flight crew member of an aircraft engaged in non commercial operations.', correct: true },
      { text: 'in the case of a private pilot , a single period of 12 months.', correct: false }
    ]
  },
  {
    question: 'The duration of the period of currency of a medical assessment shall begin on the date ;',
    answers: [
      { text: 'the licence is issued or renewed.', correct: false },
      { text: 'the medical assessment is issued.', correct: true },
      { text: 'the licence is delivered to the pilot.', correct: false },
      { text: 'the licence is issued or validated.', correct: false }
    ]
  },
  {
    question: 'When a contracting state renders valid a licence issued by another contracting state the validity of the authorisation ;',
    answers: [
      { text: 'shall not extend beyond the period of validity of the licence other than for use in private flights.', correct: false },
      { text: 'shall not extend more than 15 days from the date of the licence.', correct: false },
      { text: 'shall not extend beyond the period of validity of the licence.', correct: true },
      { text: 'the Contracting state rendering a licence valid may extend the date of the validity at its own discretion.', correct: false }
    ]
  },
  {
    question: 'Type ratings shall be established ;',
    answers: [
      { text: 'all the answers are correct.', correct: false },
      { text: 'only aircraft certificated for operation with a minimum crew of at least two pilots.', correct: false },
      { text: 'for any type of aircraft whenever considered necessary by the authority.', correct: true },
      { text: 'only for aircraft certificated for operation with a minimum crew of at least two pilots and each type of helicopter.', correct: false }
    ]
  },
  {
    question: 'The holder of a pilot licence when acting as co-pilot performing under the supervision of the pilot in command the functions and duties of a pilot in command shall be entitled to be credit ;',
    answers: [
      { text: 'in full with his flight but not more than 300 hours towards the total time required for a higher grade of pilot licence.', correct: false },
      { text: '50% of his flight time towards the total time required for higher grade of pilot licence.', correct: false },
      { text: 'the flight time towards the total time required for higher grade of pilot licence in accordance with the requirements of the licensing authority.', correct: false },
      { text: 'in full with his flight time towards the total time required for higher grade of pilot licence.', correct: true }
    ]
  },
  {
    question: 'An applicant for a commercial pilot licence-aeroplane shall have completed in aeroplanes not less than ;',
    answers: [
      { text: '200 hours of flight time or 150 hours if completed during a course of approved training as a pilot of aeroplanes', correct: true },
      { text: '150 hours of flight time and 100 hours as pilot in command.', correct: false },
      { text: '200 hours of flight time and 70 hours as pilot in command.', correct: false },
      { text: '200 hours of flight time and 80 hours as pilot in command.', correct: false }
    ]
  },
  {
    question: 'An applicant for a commercial pilot licence shall have completed in aeroplanes not less than ;',
    answers: [
      { text: '20 hours of instrument instruction time of which not more than 5 hours may be instrument ground time.', correct: false },
      { text: '10 hours of instrument instruction time of which not more than 5 hours may be instrument ground time.', correct: true },
      { text: '15 hours of instrument time of which not more than 5 hours as pilot in command.', correct: false },
      { text: '20 hours of instrument instruction time of which not more than 10 hours may be instrument ground time.', correct: false }
    ]
  },
  {
    question: 'The national civil aviation security programme shall be established by ;',
    answers: [
      { text: 'ECAC.', correct: false },
      { text: 'each contracting state.', correct: true },
      { text: 'ICAO.', correct: false },
      { text: 'ICAO and other organisations including the contracting state concerned.', correct: false }
    ]
  },
  {
    question: 'Each member state should designate an appropriate authority with its administration to be responsible for the development implementation and maintenance of a national aviation security programme. This programme should apply ;',
    answers: [
      { text: 'to all international civil air transport including aircraft engaged solely in the carriage of cargo and yet to domestic flights at the discretion of each member state.', correct: true },
      { text: 'only to passengers and aircrew in international civil transport flights.', correct: false },
      { text: 'only to passengers and aircrew in international civil transport flights and domestic flights.', correct: false },
      { text: 'only to all international civil transport including aircraft engaged solely in the carriage of cargo.', correct: false }
    ]
  },
  {
    question: 'When mixing or contact does take place between passengers subjected to security control and other persons not subjected to such control after the security screening points at airports serving international civil aviation have been passed ;',
    answers: [
      { text: 'only the passengers cabin baggage are to be re screened.', correct: false },
      { text: 'the passengers concerned and their cabin baggage shall be rescreened before boarding an aircraft.', correct: true },
      { text: 'the persons not subjected to security control shall be identified.', correct: false },
      { text: 'only the passengers are to be re screened.', correct: false }
    ]
  },
  {
    question: 'Annex 17 - Security. Each Contracting State shall ensure that the appropriate authority arranges for the supporting resources and facilities required by the aviation security services to be available ;',
    answers: [
      { text: 'on a common basis for all airports within the State.', correct: false },
      { text: 'at each airport serving international civil aviation.', correct: true },
      { text: 'for administrative staff of each airport within that State.', correct: false },
      { text: 'for every airline operating in that State.', correct: false }
    ]
  },
  {
    question: 'When a member state allows police officers , security staff , bodyguards or other agents of foreign states to carry weapons in their territory for the protection of aircraft in flight , permission for the carriage of weapons should be conditional upon ;',
    answers: [
      { text: 'notification of the pilot in command of a decision to permit a weapon to be carried on board his aircraft only.', correct: false },
      { text: 'agreement between the state of embarcation and the state of destination.', correct: false },
      { text: 'agreement between the state of embarcation and the airport of arrival.', correct: false },
      { text: 'prior notification by the state of embarcation to the foreign state in which the weapons will be carried on the airport of arrival and notification of the pilot in command of a decision to permit a weapon to be carried on board his aircraft.', correct: true }
    ]
  },
  {
    question: 'Member states should introduce specific security measures for the air transport of the following groups of potentially disruptive passengers defined below ;',
    answers: [
      { text: 'Deportees and persons in lawful custody only.', correct: false },
      { text: 'Deportees , inadmissible persons and persons in lawful custody.', correct: true },
      { text: 'Deportees and inadmissible persons only.', correct: false },
      { text: 'None of the answers is correct.', correct: false }
    ]
  },
  {
    question: 'For the transport of potentially disruptive passengers some supplementary safeguards are to be observed such as ;',
    answers: [
      { text: 'the boarding will be at the pilot in command discretion.', correct: false },
      { text: 'boarding prior to all passengers.', correct: true },
      { text: 'boarding after to all other passengers.', correct: false },
      { text: 'the boarding has to be done at the state discretion.', correct: false }
    ]
  },
  {
    question: 'When on a RNP 1 route is indicated A342 Z , means that all turns shall be made within the allowable RNP tolerance of a tangential arc between the straight leg segments with a radius of ;',
    answers: [
      { text: '25 NM on the route between 30° and 90° at and below FL190.', correct: false },
      { text: '15 NM on the route between 30° and 90° at and above FL 200.', correct: false },
      { text: '22.5 NM on the route between 30° and 90° at and above FL 250.', correct: false },
      { text: '15 NM on the route between 30° and 90° at and below FL 190.', correct: true }
    ]
  },
  {
    question: 'Concerning to RNP ( Required Navigation Performance ) types , the indication RNP 4 , represents a navigation accuracy of ;',
    answers: [
      { text: 'plus or minus 4 NM on a 90 per cent containment basis.', correct: false },
      { text: 'plus or minus 4 miles on a 90 per cent containment basis.', correct: false },
      { text: 'plus or minus 4 NM on a 98 per cent containment basis.', correct: false },
      { text: 'plus or minus 4 NM on a 95 per cent containment basis.', correct: true }
    ]
  },
  {
    question: 'When on a RNP 1 route is indicated B235 Y , means that all turns shall be made within the allowable RNP tolerance of a tangential arc between the straight leg segments defined with a radius of ;',
    answers: [
      { text: '22.5 NM between 30° and 90° at and above FL260.', correct: false },
      { text: '20 NM on the route between 30° and 90° at and above FL200.', correct: false },
      { text: '22.5 NM between 30° and 90° at and above FL200.', correct: true },
      { text: '25.0 NM on the route between 30° and 90° at and above FL 250.', correct: false }
    ]
  },
  {
    question: 'The ATIS broadcast message should , whenever practicable , not exceed ;',
    answers: [
      { text: '3 minutes.', correct: false },
      { text: '30 seconds.', correct: true },
      { text: '2 minutes.', correct: false },
      { text: '1 minute.', correct: false }
    ]
  },
  {
    question: 'ATIS-Updating. Whenever ATIS is provided , the broadcast information shall be updated ;',
    answers: [
      { text: 'at least every half an hour independently of any significant change.', correct: false },
      { text: 'immediately a significant change occurs.', correct: true },
      { text: 'as prescribed by the meteorological office.', correct: false },
      { text: 'as prescribed by the state.', correct: false }
    ]
  },
  {
    question: 'Whenever ATIS is provided , the preparation and dissemination of the ATIS message shall be the responsibility of ;',
    answers: [
      { text: 'the air traffic services.', correct: true },
      { text: 'the unit as prescribed the states.', correct: false },
      { text: 'the meteorological office serving the aerodrome(s).', correct: false },
      { text: 'both air traffic services and the meteorological office.', correct: false }
    ]
  },
  {
    question: 'ATIS broadcast ;',
    answers: [
      { text: 'shall not be transmitted on the voice channel of an ILS.', correct: true },
      { text: 'shall not be transmitted on the voice of a VOR.', correct: false },
      { text: 'shall be transmitted on the voice channel of an ILS , on a discrete VHF frequency or on the voice channel of a VOR.', correct: false },
      { text: 'Shall only be transmitted on a discrete VHF frequency.', correct: false }
    ]
  },
  {
    question: 'Air traffic services unit clocks and other time recording devices shall be checked as necessary to ensure correct time to within plus or minus ;',
    answers: [
      { text: '10 seconds of UTC at all times.', correct: false },
      { text: '15 seconds of UTC at all times.', correct: false },
      { text: '1 minute of UTC at all times.', correct: false },
      { text: '30 seconds of UTC at all times.', correct: true }
    ]
  },
  {
    question: 'An information issued by a meteorological watch office concerning the occurrence or expected occurrence of specified en-route weather phenomena which may affect the safety of low-level aircraft operations and which was not already included in the forecast issued for low level flights in the flight information region concerned or subarea thereof is ;',
    answers: [
      { text: 'a SIGMET information.', correct: false },
      { text: 'a NOTAM.', correct: false },
      { text: 'an AIRMET information.', correct: true },
      { text: 'an En-Route Meteo Report.', correct: false }
    ]
  },
  {
    question: 'Except in some special cases the establishment of change-over points should be limited to route segments of ;',
    answers: [
      { text: '100 NM or more.', correct: false },
      { text: '60 NM or more.', correct: true },
      { text: '50 NM or more.', correct: false },
      { text: '75 NM or more.', correct: false }
    ]
  },
  {
    question: 'Required Navigation Performance ( RNP ) shall be prescribed ;',
    answers: [
      { text: 'by regional air navigation agreements.', correct: false },
      { text: 'by states but not on the basis of regional air agreements.', correct: false },
      { text: 'by ICAO on the basis of regional air navigation agreements.', correct: false },
      { text: 'by states on the basis of regional air navigation agreements.', correct: true }
    ]
  },
  {
    question: 'Flight Information Service shall be provided to aircraft in order to avoid collision hazards when operating in airspace classes ;',
    answers: [
      { text: 'F only.', correct: false },
      { text: 'A , B , C , D , E , F and G.', correct: false },
      { text: 'F and G only.', correct: false },
      { text: 'C , D , E , F and G.', correct: true }
    ]
  },
  {
    question: 'ICAO Annex 7 - Nationality and registration. The registration mark shall be letters , numbers or a combination of letters and numbers and shall be that assigned by the ;',
    answers: [
      { text: 'Ministry of Transport and the Ministry of Defense in the state of registry.', correct: false },
      { text: 'the International Telecommunication Union.', correct: false },
      { text: 'the International Civil Aviation Organisation.', correct: false },
      { text: 'the state of registry or common mark registering authority.', correct: true }
    ]
  },
  {
    question: 'ICAO Annex 7 - Nationality and registration. When letters are used for the registration mark , combinations shall not be used which might be confused with the ;',
    answers: [
      { text: 'letters used for ICAO identification documents.', correct: false },
      { text: 'five letter combinations used in the international code of signals.', correct: true },
      { text: 'four letter combinations beginning with Q.', correct: false },
      { text: 'three letter combinations used in the international code of signals.', correct: false }
    ]
  },
  {
    question: 'When letters are used for registration mark combinations shall not be used which might be confused with urgent signals for example ;',
    answers: [
      { text: 'LLL.', correct: false },
      { text: 'RCC.', correct: false },
      { text: 'FFF.', correct: false },
      { text: 'TTT.', correct: true }
    ]
  },
  {
    question: 'When letters are used for registration mark combinations shall not be used which might be confused with urgent signals for example ;',
    answers: [
      { text: 'DDD.', correct: false },
      { text: 'LLL.', correct: false },
      { text: 'RCC.', correct: false },
      { text: 'PAN.', correct: true }
    ]
  },
  {
    question: 'When letters are used for the registration mark combinations shall not be used which might be confused with urgent or distress signals for example ;',
    answers: [
      { text: 'DDD.', correct: false },
      { text: 'LLL.', correct: false },
      { text: 'XXX.', correct: true },
      { text: 'RCC.', correct: false }
    ]
  },
  {
    question: 'The height of the marks under the wings of heavier than air aircraft shall be ;',
    answers: [
      { text: 'at least 75 centimetres.', correct: false },
      { text: 'at least 50 centimetres.', correct: true },
      { text: 'at least 60 centimetres.', correct: false },
      { text: 'at least between 40 centimetres and 50 centimetres.', correct: false }
    ]
  },
  {
    question: 'The height of the marks on the fuselage ( or equivalent structure ) and on the vertical tail surfaces of heavier than air aircraft shall be ;',
    answers: [
      { text: 'at least between 20 centimetres and 40 centimetres.', correct: false },
      { text: 'at least 20 centimetres.', correct: false },
      { text: 'at least 40 centimetres.', correct: false },
      { text: 'at least 30 centimetres.', correct: true }
    ]
  },
  {
    question: 'The state of design shall ensure that , there exists a continuing structural integrity program to ensure the airworthiness of the aeroplane , which includes specific information concerning corrosion prevention and control , in respect of aeroplanes ;',
    answers: [
      { text: 'over 5.700 kg maximum certificate take-off mass.', correct: true },
      { text: 'up to 5.700 kg maximum certificate take-off mass.', correct: false },
      { text: 'over 5.700 kg maximum certificate take-off and landing mass.', correct: false },
      { text: 'up to 5.700 kg maximum certificate take-off and landing mass.', correct: false }
    ]
  },
  {
    question: 'When an aircraft has sustained damage , the aircraft shall be allowed to resume its flight , if ;',
    answers: [
      { text: 'the state of design and the state of manufacture inform the state of registry that the aircraft is still airworthy.', correct: false },
      { text: 'the state of registry , the state of design and the state of manufacture consider that the aircraft is still airworthy.', correct: false },
      { text: 'the state of registry considers that the damage sustained is of a nature such that the aircraft is still airworthy.', correct: true },
      { text: 'the state of manufacture informs the state of registry that the damage sustained is of a nature such that the aircraft is still airworthy.', correct: false }
    ]
  },
  {
    question: 'When an aircraft is experiencing difficulties, triggering of the alert phase is the responsibility of;',
    answers: [
      { text: 'air traffic control and flight information centres.', correct: true },
      { text: 'search and rescue co-ordination centres.', correct: false },
      { text: 'control centres only.', correct: false },
      { text: 'air traffic co-ordination centres.', correct: false }
    ]
  },
  {
    question: 'When an aircraft subjected to an unlawful interference has landed it shall notify by the most expeditious means of the State of registry of the aircraft and the State of the operator of the landing and shall similarly transmit all other relevant information to the;',
    answers: [
      { text: 'two aforementioned States, each State whose citizens suffered fatalities or injuries, each State whose citizens are known to be on board the aircraft and the ICAO.', correct: false },
      { text: 'two aforementioned States, each State whose citizens suffered fatalities or injuries, each State whose citizens were detained as hostages, each State whose citizens are known to be on board the aircraft and the ICAO.', correct: true },
      { text: 'two aforementioned States, each State whose citizens suffered fatalities or injuries on board the aircraft and the ICAO.', correct: false },
      { text: 'two aforementioned States and the ICAO.', correct: false }
    ]
  },
  {
    question: "A notice providing information on Rules of the Air, Air Traffic Services, and Air Navigation Procedures and distributed in advance of its effective date is;",
    answers: [
      { text: "A NOTAM RAC.", correct: false },
      { text: "An ATS NOTAM.", correct: false },
      { text: "An Advisory NOTAM.", correct: false },
      { text: "An AIRAC.", correct: true }
    ]
  },
  {
    question: "A separation minimum shall be applied between a light or MEDIUM aircraft and a HEAVY aircraft and between a LIGHT aircraft and a MEDIUM aircraft when the heavier aircraft is making a low or missed approach and the lighter aircraft is utilizing an opposite direction runway for takeoff, this minimum is;",
    answers: [
      { text: "1 minute.", correct: false },
      { text: "2 minutes.", correct: true },
      { text: "5 minutes.", correct: false },
      { text: "3 minutes.", correct: false }
    ]
  },
  {
    question: "A State shall provide assistance to an aircraft subjected to an act of unlawful seizure. This assistance includes;",
    answers: [
      { text: "Provision of navigation aids, air traffic services, permission to land, and refuelling.", correct: false },
      { text: "Provision of navigation aids, air traffic services, and permission to land.", correct: true },
      { text: "Only permission to land.", correct: false },
      { text: "Provision of navigation aids, air traffic services, permission to land, and catering for passengers.", correct: false }
    ]
  },
  {
    question: "A State shall take adequate measures for the safety of passengers and crew of an aircraft which is subjected to an act of unlawful interference;",
    answers: [
      { text: "Until their journey can be continued.", correct: true },
      { text: "If requested by an individual passenger.", correct: false },
      { text: "And arrange for them to return to their country of origin.", correct: false },
      { text: "During a period of investigation.", correct: false }
    ]
  },
  {
    question: "Who is responsible for the initiation of an accident investigation?",
    answers: [
      { text: "The aircraft manufacturer.", correct: false },
      { text: "The Operators of the same aircraft type.", correct: false },
      { text: "The Authority of the State in which the accident took place.", correct: true },
      { text: "The State of design and manufacturer.", correct: false }
    ]
  },
  {
    question: "The sole objective of the investigation of an accident or incident shall be the;",
    answers: [
      { text: "Prevention of accidents or incidents and establish the liability.", correct: false },
      { text: "Prevention of accidents or incidents and to provide legal evidence for subsequent court cases.", correct: false },
      { text: "Prevention of accidents or incidents.", correct: true },
      { text: "Prevention of accidents or incidents and provide the manufacturer with investigation data for improvement of the design.", correct: false }
    ]
  },
  {
    question: "According to ICAO Annex 8, a certificate of airworthiness shall be renewed or shall remain valid subject to the;",
    answers: [
      { text: "Laws of the State in which it is operated.", correct: false },
      { text: "Laws of the State of registry and operation.", correct: false },
      { text: "Laws of the State of registry.", correct: true },
      { text: "Requirements laid down by ICAO.", correct: false }
    ]
  },
  {
    question: "According to JAR-FCL, an applicant for a CPL (A) who has satisfactorily followed and completed an integrated flying training course shall have completed as a pilot of aeroplanes having a certificate of airworthiness issued or accepted by a JAA Member State at least;",
    answers: [
      { text: "150 hours of flight time.", correct: true },
      { text: "200 hours of flight time plus 10 hours of instrument ground time.", correct: false },
      { text: "150 hours of flight time plus 10 hours of instrument ground time.", correct: false },
      { text: "200 hours of flight time.", correct: false }
    ]
  },
  {
    question: "According to JAR-FCL, an applicant for an IR(A) shall hold a PPL(A) including a night qualification or CPL(A) and shall have completed at least 50 hours;",
    answers: [
      { text: "Instructional flight time as student-pilot-in-command of aeroplanes.", correct: false },
      { text: "Cross country flight time as a pilot of aeroplanes or helicopters of which at least 10 hours shall be in aeroplanes.", correct: true },
      { text: "Instructional flight time as student-pilot-in-command of aeroplanes or helicopters of which at least 10 hours shall be in aeroplanes.", correct: false },
      { text: "Cross country flight time as pilot-in-command in aeroplanes or helicopters of which at least 10 hours shall be in aeroplanes.", correct: false }
    ]
  },
  {
      question: "According to JAR-FCL, an applicant for ATPL(A) shall have completed as a pilot of aeroplane at least 1,500 hours of flight time, including;",
      answers: [
        { text: "500 hours in multi-pilot operations on aeroplanes type certificated in accordance with JAR/FAR 25 or JAR/FAR 23.", correct: true },
        { text: "500 hours in multi-pilot operations on aeroplanes type certificated in accordance with JAR/FAR 25 or JAR/FAR 23, of which up to 150 hours may be as flight engineer.", correct: false },
        { text: "500 hours in multi-pilot operations on aeroplanes type certificated in accordance with JAR/FAR 25 or JAR/FAR 23, as pilot-in-command.", correct: false },
        { text: "500 hours in multi-pilot operations on aeroplanes type certificated in accordance with JAR/FAR 25 or JAR/FAR 23, including 200 hours of night flight as pilot-in-command or as co-pilot.", correct: false }
      ]
  },
  {
      question: "According to JAR-FCL, an applicant for ATPL(A) shall have demonstrated the ability to perform as pilot-in-command, the procedures and manoeuvres of an aeroplane type certificated for;",
      answers: [
        { text: "Operations by pilots under training.", correct: false },
        { text: "The carriage of passengers at night.", correct: false },
        { text: "A minimum crew of two pilots under IFR.", correct: true },
        { text: "A minimum crew of two pilots plus a flight engineer.", correct: false }
      ]
  },
  {
      question: "According to JAR-FCL, an examiner’s authorisation is valid for;",
      answers: [
        { text: "The period of validity of the class/type rating.", correct: false },
        { text: "Not more than two years.", correct: false },
        { text: "Not more than three years.", correct: true },
        { text: "The period of validity of the medical certificate.", correct: false }
      ]
  },
  {
      question: "According to JAR-FCL, an instrument rating is valid for;",
      answers: [
        { text: "Indefinitely.", correct: false },
        { text: "The period of validity of the licence.", correct: false },
        { text: "One year.", correct: true },
        { text: "Two years.", correct: false }
      ]
  },
  {
      question: "According to JAR-FCL, class rating shall be established for single pilots aeroplanes not requiring a type rating, including;",
      answers: [
        { text: "All self-sustaining gliders.", correct: true },
        { text: "All types of single-pilot, single-engine aeroplanes fitted with a turbojet engine.", correct: false },
        { text: "Any other type of aeroplane if considered necessary.", correct: false },
        { text: "Microlights having fixed wings and moveable aerodynamic control surfaces acting in all three dimensions.", correct: false }
      ]
  },
  {
      question: "According to JAR-FCL, establishment of separate type rating for aeroplanes will be assessed on the basis of three criteria. One of these three criteria is that the aeroplane has;",
      answers: [
        { text: "Handling characteristics that require additional flying or simulator training.", correct: true },
        { text: "Handling characteristics that require the use of more than one crew member.", correct: false },
        { text: "A certificate of airworthiness issued by the manufacturer.", correct: false },
        { text: "A certificate of airworthiness issued by a non-member state.", correct: false }
      ]
  },
  {
      question: "According to JAR-FCL, medical certificates classes are;",
      answers: [
        { text: "1 and 2.", correct: true },
        { text: "Class 1 only.", correct: false },
        { text: "1, 2 and 3.", correct: false },
        { text: "1, 2, 3 and 4.", correct: false }
      ]
  },
  {
      question: "According to JAR-FCL, single pilot single-engine class ratings are valid for;",
      answers: [
        { text: "One year.", correct: false },
        { text: "Two years up to age 40 years then one year thereafter.", correct: false },
        { text: "Five years after licence issue.", correct: false },
        { text: "Two years.", correct: true }
      ]
  },
  {
      question: "According to JAR-FCL, successful completion of multi-crew co-operation (MCC) training shall be required to;",
      answers: [
        { text: "Obtain a professional pilot licence.", correct: false },
        { text: "Revalidate any rating or licence.", correct: false },
        { text: "Obtain the first class rating on multi-engine aeroplanes.", correct: false },
        { text: "Obtain the first type rating on multi-pilot aeroplanes.", correct: true }
      ]
  },
  {
      question: "According to JAR-FCL, the aeroplane instructor categories recognised are;",
      answers: [
        { text: "FE(A)/TRE(A)/CRE(A)/IRE(A) and SFI authorisation.", correct: false },
        { text: "FI(A) and IRI(A).", correct: false },
        { text: "FI(A)/TRI(A)CRE(A)/IRE(A) and SFI authorisation.", correct: false },
        { text: "FI(A)/TRI(A)/CRI(A)/IRI(A) ratings, SFI and MCCI authorisation.", correct: true }
      ]
  },
  {
      question: "According to JAR-FCL, the privileges of a newly qualified Flight Instructor are restricted to carrying out instruction under the supervision of a FI(A), approved for this purpose. The restrictions may be removed from the rating;",
      answers: [
        { text: "On the recommendation of the supervising FI(A) after the holder of the restricted FI(A) rating has completed a competency test.", correct: false },
        { text: "On the recommendation of the supervising FI(A) after the holder of the restricted FI(A) rating has completed at least 100 hours flight instruction and, in addition, has supervised at least 25 student solo flights.", correct: true },
        { text: "On the recommendation of the supervising FI(A) after the holder of the restricted FI(A) rating has supervised at least 100 solo flights.", correct: false },
        { text: "On the recommendation of the supervising FI(A) after the holder of the restricted FI(A) rating has supervised at least 100 solo flights and completed a competency test.", correct: false }
      ]
  },
  {
      question: "According to JAR-FCL, the privileges of the holder of an unrestricted FI(A) rating are to conduct flight instruction for the issue of a CPL(A);",
      answers: [
        { text: "Provided that the FI(A) has completed not less than 15 hours on the relevant type in the preceding 12 months.", correct: false },
        { text: "Provided that the FI(A) has completed 200 hours of flight instruction.", correct: false },
        { text: "Provided that the FI(A) has completed at least 500 hours of flight time as a pilot of aeroplanes including at least 200 hours of flight instruction.", correct: true },
        { text: "Without restriction.", correct: false }
      ]
  },
  {
      question: "According to JAR-FCL, the validity of type ratings and multi-engine class ratings will be one year from the date;",
      answers: [
        { text: "Of the last medical certificate.", correct: false },
        { text: "Of issue.", correct: true },
        { text: "Of the skill test.", correct: false },
        { text: "The application is received by the Authority.", correct: false }
      ]
  },
  {
    question: "Aeronautical Ground Lights on and in the vicinity of aerodromes may be turned off, provided that they can be brought back into operation before the expected arrival of an aircraft in at least;",
    answers: [
      { text: "30 minutes.", correct: false },
      { text: "one hour.", correct: true },
      { text: "5 minutes.", correct: false },
      { text: "15 minutes.", correct: false }
    ]
  },
  {
    question: "A defined rectangular area on the ground at the end of the take-off run available, prepared as a suitable area in which an aircraft can be stopped in the case of an abandoned take-off, is called;",
    answers: [
      { text: "Runway end safety area.", correct: false },
      { text: "Stopway.", correct: true },
      { text: "Clearway.", correct: false },
      { text: "Obstacle free zone (OFZ).", correct: false }
    ]
  }
];

startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', () => {
  if (selectedAnswerText) {
    storeAnswer();
    currentQuestionIndex++;

    // If this is the last question, finish the quiz
    if (currentQuestionIndex < shuffledQuestions.length) {
      setNextQuestion();
    } else {
      clearInterval(timerInterval); // Stop the timer once the quiz is finished
      showScore(); // Show the score and hide the "Next" button
    }
  }
});

saveButton.addEventListener('click', saveResults);
sendButton.addEventListener('click', sendResults);

function startQuiz() {
  // Show the password input field
  document.getElementById('password-container').classList.remove('hide');

  // Hide the start button
  startButton.classList.add('hide');
}

document.getElementById('submit-password-btn').addEventListener('click', () => {
  const enteredPassword = document.getElementById('quiz-password').value;
    numQuestionsToSolve = document.getElementById('num-questions').value;

  if (enteredPassword !== "1234") {
    alert("Incorrect password. You cannot start the quiz.");
    return; // Exit if password is wrong
  }

  // If password is correct, hide the password container and start the quiz
  document.getElementById('password-container').classList.add('hide');
  questionContainerElement.classList.remove('hide');
  shuffledQuestions = shuffleArray(questions);
    // Convert the number of questions to solve into an integer, unless it's "all"
      if (numQuestionsToSolve !== 'all') {
        shuffledQuestions = shuffledQuestions.slice(0, parseInt(numQuestionsToSolve));
      }
  currentQuestionIndex = 0;
  score = 0;
  userChoices = []; // Reset user choices

  //totalTime = shuffledQuestions.length * 15; // Total quiz time (15 seconds per question)
 // startTimer(totalTime);

  setNextQuestion();
});

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);

  // Check if it's the last question and update the "Next" button to say "Finish"
  if (currentQuestionIndex === shuffledQuestions.length - 1) {
    nextButton.innerText = "Finish";
  } else {
    nextButton.innerText = "Next";
  }

  // Update question number and progress bar
  progressText.innerText = `Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}`;
    // In the setNextQuestion function, update the percentage text:
    const progressPercentage = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressText.innerText = `Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length} (${progressPercentage.toFixed(0)}%)`;
}

// Add this function to highlight the correct answer before the user selects
function highlightCorrectAnswer() {
  const currentQuestion = questions[currentQuestionIndex];
  currentQuestion.answers.forEach((answer, index) => {
    const answerButton = answerButtonsElement.children[index]; // Find the button associated with the answer
    if (answer.correct) {
      answerButton.classList.add('correct'); // Add the 'correct' class to highlight it
    }
  });
}

function showQuestion(question) {
    resetState();
      questionElement.innerText = question.question;
      
      question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
          button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
      });
      
      highlightCorrectAnswer(); // Call the function to highlight the correct ans
}

function resetState() {
  clearStatusClass(document.body);
  nextButton.classList.add('hide');
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function selectAnswer(e) {
    const selectedButton = e.target;
      const correct = selectedButton.dataset.correct;

      // Mark only the selected answer (correct or wrong)
      setStatusClass(selectedButton, correct);

      // Highlight all buttons with correct status, but don't show wrong background when the correct answer is selected
      if (!correct) {
        Array.from(answerButtonsElement.children).forEach(button => {
          if (!button.dataset.correct) {
            setStatusClass(button, button.dataset.correct); // Apply red only to wrong answers
          }
        });
      }

      // If the selected answer is correct, go to the next question automatically
      if (correct) {
        setTimeout(() => {
          currentQuestionIndex++;
          if (currentQuestionIndex < questions.length) {
            showQuestion(questions[currentQuestionIndex]);
          } else {
            showScore(); // Show the score if there are no more questions
          }
        }, 100); // Delay of 1 second before moving to the next question
      }
}

function storeAnswer() {
  const isCorrect = selectedAnswerText === correctAnswerText;
  if (isCorrect) score++; // Increment score only if the answer is correct

  userChoices.push({
    question: shuffledQuestions[currentQuestionIndex].question,
    selectedAnswer: selectedAnswerText,
    correctAnswer: correctAnswerText,
    isCorrect: isCorrect
  });
}

// Function to get the correct answer text for the current question
function getCorrectAnswer(question) {
  const correctAnswer = question.answers.find(answer => answer.correct);
  return correctAnswer.text;
}

// Function to set the status (correct/wrong) on buttons
function setStatusClass(element, correct) {
    clearStatusClass(element);
      if (correct) {
        element.classList.add('correct'); // Only apply green background for correct answers
      } else {
        element.classList.add('wrong'); // Apply red background for wrong answers
      }
}
// Function to clear previous status
function clearStatusClass(element) {
    element.classList.remove('correct');
      element.classList.remove('wrong');
}
// Disable the next button completely by hiding it
nextButton.classList.add('hide'); // Add this line to hide the "Next" button
/*function startTimer(seconds) {
  timerElement.innerText = seconds;
  timerInterval = setInterval(() => {
    seconds--;
    timerElement.innerText = seconds;
    if (seconds <= 0) {
      clearInterval(timerInterval);
      showScore(); // Automatically show the score when the time runs out
    }
  }, 1000);
}*/

function showScore() {
  questionContainerElement.classList.add('hide');
  scoreContainer.classList.remove('hide');
  nextButton.classList.add('hide'); // Hide the "Next" button on the results page

  const totalQuestions = shuffledQuestions.length;
  const correctAnswers = score;
  const wrongAnswers = totalQuestions - correctAnswers;
  const finalScore = (correctAnswers / totalQuestions) * 100;

  // Determine Pass or Fail status
  const passOrFail = finalScore >= 75 ? `<span style="color: green;">PASS</span>` : `<span style="color: red;">FAIL</span>`;

  // Display the total number of questions, correct answers, wrong answers, and the final score
  scoreDisplay.innerHTML = `
    <p>Total Questions: ${totalQuestions}</p>
    <p>Correct Answers: ${correctAnswers}</p>
    <p>Wrong Answers: ${wrongAnswers}</p>
    <p>Your Score: ${finalScore.toFixed(2)}% ${passOrFail}</p>
  `;
    
    // Display "INCORRECT ANSWERS" heading only if there are wrong answers
      if (wrongAnswers > 0) {
        const incorrectHeading = document.createElement('h2');
        incorrectHeading.innerText = 'WRONG ANSWERS';
        incorrectHeading.style.color = 'red';
        scoreContainer.appendChild(incorrectHeading);
      }

    // Display only wrong answers
      const summary = document.createElement('div');
      userChoices.forEach(choice => {
        if (!choice.isCorrect) {  // Only display wrong answers
          const questionSummary = document.createElement('div');
          questionSummary.innerHTML = `
            <p><strong>Question:</strong> ${choice.question}</p>
            <p style="color:red;"><strong>Your Answer:</strong> ${choice.selectedAnswer}</p>
            <p><strong>Correct Answer:</strong> ${choice.correctAnswer}</p>
            <hr>
          `;
          summary.appendChild(questionSummary);
        }
      });

      scoreContainer.appendChild(summary);
}

// Function to save the results to a local file
function saveResults() {
  const studentName = document.getElementById('student-name').value;
  const studentSurname = document.getElementById('student-surname').value;

  if (!studentName || !studentSurname) {
    alert("Please enter your name and surname.");
    return;
  }

  // Generate the filename with the current date
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const fileName = `${studentName}_${studentSurname}_${formattedDate}.txt`;

  // Generate results file content
  const resultsFileContent = generateResultsFile(studentName, studentSurname);

  // Create a Blob and trigger download
  const blob = new Blob([resultsFileContent], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

// Function to generate quiz results as text
function generateResultsFile(studentName, studentSurname) {
  const totalQuestions = shuffledQuestions.length;
  const correctAnswers = score;
  const wrongAnswers = totalQuestions - correctAnswers;
  const finalScore = (correctAnswers / totalQuestions) * 100;

  let results = `Name: ${studentName}\n`;
  results += `Surname: ${studentSurname}\n`;
  results += `Total Questions: ${totalQuestions}\n`;
  results += `Correct Answers: ${correctAnswers}\n`;
  results += `Wrong Answers: ${wrongAnswers}\n`;
  results += `Your Score: ${finalScore.toFixed(2)}%\n\n`;
  results += `Question Breakdown:\n`;

  userChoices.forEach(choice => {
    results += `Question: ${choice.question}\n`;
    results += `Your Answer: ${choice.selectedAnswer}\n`;
    results += `Correct Answer: ${choice.correctAnswer}\n\n`;
  });

  return results;
}

// Function to send the results via email using mailto
function sendResults() {
  const studentName = document.getElementById('student-name').value;
  const studentSurname = document.getElementById('student-surname').value;

  if (!studentName || !studentSurname) {
    alert("Please enter your name and surname.");
    return;
  }

  const resultsFileContent = generateResultsFile(studentName, studentSurname);

  // Use mailto to open the default email client with the results pre-filled
  const emailSubject = encodeURIComponent("Quiz Results");
  const emailBody = encodeURIComponent(resultsFileContent);
  window.location.href = `mailto:?subject=${emailSubject}&body=${emailBody}`;
}

document.getElementById('restart-btn').addEventListener('click', () => {
  window.location.reload();
});

// Function to shuffle an array (Fisher-Yates Algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
