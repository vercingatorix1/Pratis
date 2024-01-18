let featureNames = [];

function generateFeatureNameOptions() {
  let featureNameSelect = document.getElementById('featureName');

  // Clear existing options
  while (featureNameSelect.firstChild) {
    featureNameSelect.firstChild.remove();
  }
  
  // Add the "none" option
  let noneOption = document.createElement('option');
  noneOption.value = 'none';
  noneOption.textContent = 'None';
  featureNameSelect.appendChild(noneOption);

  // Add new options based on the featureNames array
  featureNames.forEach(function(feature) {
    let option = document.createElement('option');
    option.value = feature.name;
    option.textContent = `${feature.name}, Backlogcount ${feature.backlogCount}, Featurecount ${feature.featureCount}`;
    featureNameSelect.appendChild(option);
  });
}

// Function to show the Add User Story form on button click
document.getElementById('addStoryButton').addEventListener('click', function() {
  document.getElementById('storyForm').style.display = 'block';

  // Set the default values for feature priority and backlog priority
  document.getElementById('backlogPriority').value = backlogUserStoryCount;
});

// Function to show the Add Feature form on button click
document.getElementById('addFeatureButton').addEventListener('click', function() {
  document.getElementById('featureForm').style.display = 'block';

  // Set the default values for backlog priority
  document.getElementById('featurebacklogPriority').value = backlogUserStoryCount;
});

// Object to track the user story heights of team members
let teamMemberUserStoryHeight = {
  jokic: 0,
  giannis: 0,
  lebron: 0,
  ausar: 0,
  tyresse: 0
};

// Object to track the user story count for each feature
let featureUserStoryCount = {};

// Variable to track the total user story count
let backlogUserStoryCount = 1;

// Function to handle the submission of the Add Feature form
document.getElementById('addFeatureForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get the feature name and backlog priority from the input fields
  let featureName = document.getElementById('newFeatureName').value;
  let backlogPriority = parseInt(document.getElementById('featurebacklogPriority').value) || backlogUserStoryCount;

  // Create a new object with the feature name, backlog priority, and initialize user story count to 1
  let feature = {
    name: featureName,
    backlogCount: backlogPriority,
    featureCount: 1
  };

  // Add the feature object to the array
  featureNames.push(feature);

  // Reset the form
  document.getElementById('addFeatureForm').reset();

  // Hide the Add New Feature form
  document.getElementById('featureForm').style.display = 'none';

  // Log the array of feature names for testing purposes
  console.log(featureNames);

  // Generate the feature name dropdown options
  generateFeatureNameOptions();

  // Increase the user story count variables
  backlogUserStoryCount++;
});

// Function to handle the submission of the Add User Story form
document.getElementById('addStoryForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get the details of the user story from the input fields
  let name = document.getElementById('name').value;
  let assignee = document.getElementById('assignee').value;
  let points = parseInt(document.getElementById('points').value);
  let featureName = document.getElementById('featureName').value;
  let backlogPriority = parseInt(document.getElementById('backlogPriority').value) || backlogUserStoryCount;

  if (name && assignee && points) {
    // Calculate the capacity and height of the team member
    let teamMember = document.querySelector('.teamMember.' + assignee);
    let capacity = parseInt(teamMember.getAttribute('data-points'));
    let teamMemberHeight = teamMemberUserStoryHeight[assignee];

    // Create a new user story element
    let userStory = document.createElement('div');
    userStory.className = 'userStory';
    userStory.style.width = (capacity * 10) + 'px';
    userStory.style.height = (points * 1000) / capacity + 'px';
    userStory.style.bottom = teamMemberHeight + 'px';
    userStory.innerHTML = `
    <div class="userStoryName">Name: ${name}</div>
    <div class="featurePriority">Feature Priority: ${featurePriority}</div>
    <div class="backlogPriority">Backlog Priority: ${backlogPriority}</div>
    `;

    // Update the height of the team member
    teamMemberUserStoryHeight[assignee] += (points * 1000) / capacity;

    // Append the user story to the team member's container
    teamMember.appendChild(userStory);

    // Hide the Add User Story form and reset the form values
    document.getElementById('storyForm').style.display = 'none';
    document.getElementById('addStoryForm').reset();

    

    if (featureName === 'none') {
      featurePriority = 0;
    } else {
      // Find the matching feature object by name
      let selectedFeature = featureNames.find(function(feature) {
        return feature.name === featureName;
      });

    // Check if selectedFeature exists
    if (selectedFeature) {
      // Increment the user story count for the selected feature
      selectedFeature.featureCount++;
      featurePriority = selectedFeature.featureCount;
    }
  }

      // Update the feature priority value in the user story element
      userStory.querySelector('.featurePriority').textContent = featurePriority;

    // Generate the feature name dropdown options
    generateFeatureNameOptions();

    // Increase the user story count variables
    featureUserStoryCount++;
    backlogUserStoryCount++;
  }
});

// Function to get the next working day
function getNextWorkingDay(date) {
  const dayOfWeek = date.getDay();

  // Saturday (6) or Sunday (0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    date.setDate(date.getDate() + (8 - dayOfWeek)); // Jump to next Monday
  }

  return date;
}

// Function to be executed when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Generate the feature name dropdown options
  generateFeatureNameOptions();
});

// Function to add the dates to the timeline
function addDates() {
  const datesContainer = document.getElementById('datesContainer');
  const today = new Date();

  // Add 10 working day dates to the container
  for (let i = 9; i >= 0; i--) {
    const dateElement = document.createElement('div');
    dateElement.className = 'date';
    dateElement.style.height = `100px`;
    dateElement.innerText = getNextWorkingDay(new Date(today.getTime() + i * 24 * 60 * 60 * 1000))
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    datesContainer.appendChild(dateElement);
  }
}

// Call the function to add dates to the timeline
addDates();